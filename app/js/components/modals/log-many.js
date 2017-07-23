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
        this.checkExistence = this.checkExistence.bind(this);
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

    checkExistence (str) {
        const
            { names } = this.props,
            name = str.toLowerCase();

            if (names.indexOf(name) == -1) {
                const error = `An item with the name "${name}" does not exist`;
                this.setState({ error });
                return;
            }

        this.setState({ error: null });
    }

    save () {
        const
            submit = findDOMNode(this.submit),
            entries = this.forms
                .slice(0, this.state.adding)
                .map(form => ({
                    date    : this.date.value || moment().format('YYYY-MM-DD'),
                    name    : form.name.value,
                    added   : Number(form.added.value) || 0,
                    removed : Number(form.removed.value) || 0
                }))
            ,
            names = entries.map(e => e.name.toLowerCase()),
            items = this.props.items,   
            itemNames = this.props.names,
            len = names.length;

        submit.setAttribute('disabled', 'disabled');

        for (let i = 0; i < len; i++) {
            if (names[i].trim() === '') {
                const error = `Every record should be assigned to an existing item`;
                this.setState({ error });
                submit.removeAttribute('disabled');
                return;
            }
            
            const
                index = itemNames.indexOf(names[i]),
                _id   = index > -1 ? items[index]._id : null;

            if (index == -1) {
                const error = `"${items[index]}" does not exist`;
                this.setState({ error });
                submit.removeAttribute('disabled');
                return;
            }

            Object.assign(entries[i], { _id, index });
        }

        console.log(entries)
    }

    render() {
        if (!this.props.items) return null;

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
                    />
                    <input
                        type='number'
                        name='added'
                        placeholder='Added...'
                        default='0'
                        min='0'
                        ref={e => this.forms[i].added = e}
                    />
                    <input
                        type='number'
                        name='removed'
                        placeholder='Removed...'
                        default='0'
                        min='0'
                        ref={e => this.forms[i].removed = e}
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
                        <p>Date</p>
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
