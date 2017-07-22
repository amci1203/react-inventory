import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import { post } from 'axios';
import { debounce } from 'lodash';
import { makeErrorDiv, makeSubmitButton } from '../../helpers';

import Modal from '../Modal';

export default class NewMany extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkUniqueness = this.checkUniqueness.bind(this);
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

    checkUniqueness (str) {
        const
            { names } = this.props,
            name = str.toLowerCase();

            if (names.indexOf(name) > -1) {
                const error = `An item with the name "${name}" already exists`;
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
                    category: this.category.value || 'Uncategorized',
                    name: form.name.value,
                    inStock: form.inStock.value || 0,
                    lowAt: form.lowAt.value || 0
                }))
            ,
            names = entries.map(e => e.name.toLowerCase()),     
            items = this.props.names,
            len = names.length;

        submit.setAttribute('disabled', 'disabled');

        for (let i = 0; i < len; i++) {
            if (names[i].trim() === '') {
                const error = `Every item should at least have a name`;
                this.setState({ error });
                submit.removeAttribute('disabled');
                return;
            }
            const index = items.indexOf(names[i]);
            if (index > -1) {
                const error = `An item with the name "${items[index]}" already exists`;
                this.setState({ error });
                submit.removeAttribute('disabled');
                return;
            }
        }

        this.props.saveAll(entries)
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
                        ref={e => this.forms[i].name = e}
                    />
                    <input
                        type='number'
                        name='inStock'
                        placeholder='In Stock...'
                        default='0'
                        min='0'
                        ref={e => this.forms[i].inStock = e}
                    />
                    <input
                        type='number'
                        name='lowAt'
                        placeholder='Low At...'
                        default='0'
                        min='0'
                        ref={e => this.forms[i].lowAt = e}
                    />
                </form>
            )
        }

        return (
            <Modal id='new-many'>
                <h1 className='section-title'>NEW ITEM</h1>
                { controls }
                <form className='multi-form'>
                    { error }
                    <div className="form-group inline">
                        <p>Category</p>
                        <input
                            list='categories-list'
                            ref={c => this.category = c}
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
