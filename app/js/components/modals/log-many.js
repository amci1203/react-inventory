import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import { post } from 'axios';
import { debounce } from 'lodash';
import { makeErrorDiv, makeSubmitButton } from '../../helpers';
import moment from 'moment';

import Modal from '../Modal';

export default class LogMany extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.isCleared = this.isCleared.bind(this);
        this.changeNumEntries = this.changeNumEntries.bind(this);

        this.state = {
            error: null,
            adding: 5,
        };
    }

    componentWillMount () {
        this.forms = [];
    }

    changeNumEntries (str) {
        const { adding } = this.state;
        switch (str) {
            case 'INC':
                adding < 20 && this.setState({ adding: adding + 1 });
                break;
            case 'DEC':
                adding > 2 && this.setState({ adding: adding - 1 });
                break;
            default:
                return false;
        }

        return false;
    }

    isCleared (i) {
        const
            hasError = error => this.setState({ error }),

            form = this.forms[i],
            date = this.date.value || moment().format('YYYY-MM-DD'),

            name    = form.name.value,
            added   = form.added.value,
            removed = form.removed.value,
            
            formNames  = this.forms.map(n => n.name),
            allItems   = this.props.items,   
            validNames = this.props.names,
            len        = formNames.length,

            index = validNames.indexOf(name.toLowerCase()),
            { _id, log, inStock } = allItems[index] || {};

        if (name.trim() === '') {
            hasError(`Every record should be assigned to an existing item`);
            return false;
        }

        if (index == -1) {
            hasError(`"${name}" does not exist`);
            return false;
        }

        if ( formNames.indexOf(name) !== formNames.lastIndexOf(name) ) {
            hasError(`"${name}" cannot have duplicate records`);
            return false;
        }

        if (log.map(d => d.date).indexOf(date) > -1) {
            hasError(`"${name}" already has a record for ${date}`);
            return false;
        }

        if (inStock + added - removed < 0) {
            hasError(`Items cannot have a negative balance; ${name} currently has ${inStock} unit(s) in stock.`);
            return false;
        }

        this.setState({ error: null });
        return { _id, index };
    }

    save () {
        const
            data = [],
            entries = this.forms
                .slice(0, this.state.adding)
                .map(form => ({
                    name: form.name.value,
                    body: {
                        date    : this.date.value || moment().format('YYYY-MM-DD'),
                        added   : Number(form.added.value) || 0,
                        removed : Number(form.removed.value) || 0
                    }
                }))
            ,
            submit = findDOMNode(this.submit);

        submit.setAttribute('disabled', 'disabled');
        
        for (let i =0, len = entries.length; i < len; i++) {
            const cleared = this.isCleared(i);
            if (cleared) data.push( Object.assign({}, entries[i], cleared) );
            else {
                submit.removeAttribute('disabled');
                return false;    
            }
        }

        submit.removeAttribute('disabled');

        this.props.logAll(data);
    }

    render() {
        const
            { props, save, changeNumEntries } = this,
            error = makeErrorDiv(this.state.error),

            entries = [],
            len = this.state.adding,

            controls = (
                <div className='form-group controls'>
                    <button
                        className='multi-control-button'
                        onClick={e => changeNumEntries('DEC')}
                    >-</button>
                    <span className='num-entries'>{this.state.adding}</span>
                    <button
                        className='multi-control-button'
                        onClick={e => changeNumEntries('INC')}
                    >+</button>
                </div>
            );

        for (let i = 0; i < len; i++) {
            this.forms.push({});
            entries.push(
                <form
                    key={i}
                    className='form-group'
                >
                    <input
                        type='text'
                        name='name'
                        placeholder='Name...'
                        list='items-list'
                        ref={e => this.forms[i].name = e}
                        onClick={e => this.isCleared(i)}
                    />
                    <input
                        type='number'
                        name='added'
                        placeholder='Added...'
                        default='0'
                        min='0'
                        ref={e => this.forms[i].added = e}
                        onClick={e => this.isCleared(i)}
                    />
                    <input
                        type='number'
                        name='removed'
                        placeholder='Removed...'
                        default='0'
                        min='0'
                        ref={e => this.forms[i].removed = e}
                        onClick={e => this.isCleared(i)}
                    />
                </form>
            )
        }

        return (
            <Modal id='log-many'>
                <h1 className='section-title'>POST RECORDS</h1>
                { controls }
                <form className='multi-form'>
                    { error }
                    <div className="form-group inline">
                        <p>Date:</p>
                        <input
                            type='date'
                            placeholder='Date...'
                            ref={d => this.date = d}
                        />
                    </div>
                </form>
                { entries }
                <button
                    className='submit'
                    ref={s => this.submit = s}
                    onClick={save}
                >SAVE</button>
            </Modal>
        )
    }

}
