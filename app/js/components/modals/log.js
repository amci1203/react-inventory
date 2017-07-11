import React, { Component } from 'react';
import axios, { post } from 'axios';
import { debounce } from 'lodash';

import Modal from '../Modal';


export default class Log extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkBalance = this.checkBalance.bind(this);

        this.state = { error: null };
    }

    componentDidMount () {
        const { added, removed} = this.props.item;
        this.added.value =added;
        this.removed.value = removed;
    }

    checkBalance () {
        const
            { inStock } = this.props.item,
            added   = Number(this.added.value),
            removed = Number(this.removed.value);

        if (inStock + added - removed < 0) {
            const error = 'That is impossible, as it would result in a negative stock level';
            this.setState({ error });
            return;
        }

        this.setState({ error: null });
    }

    save () {
        const
            { inStock, _id } = this.props.item,
            added   = Number(this.added.value),
            removed = Number(this.removed.value),
            balance = inStock + added - removed;

        post('housekeeping/' + _id, { added, removed })
            .then(res => this.props.onLog(balance))
            .catch(e => console.log(e));
    }

    render() {
        const
            { modal, save, checkBalance } = this,
            { onClose, item } = this.props,

            error  = modal ? modal.makeErrorDiv(this.state.error) : null,
            submit = modal ? modal.makeSubmitButton('SAVE', this.state.error, save) : null,

            check = debounce(checkBalance, 200, { leading: false });

        return (
            <Modal ref={m => this.modal = m} onClose={onClose}>
                <h1 className='section-title'>LOG ITEM</h1>
                <p className='text-center'>{item.name}</p>
                <form>
                    {error}
                    <div className='form-group inline'>
                        <p>Date:</p>
                        <input />
                    </div>
                    <div className="form-group inline">
                        <p>Added:</p>
                        <input
                            type='number'
                            min='0'
                            onChange={check}
                            ref={a => this.added = a}
                            default='0'
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Removed:</p>
                        <input
                            type='number'
                            min='0'
                            onChange={check}
                            ref={r => this.removed = r}
                            default='0'
                        />
                    </div>
                </form>
                { submit }
            </Modal>
        )
    }

}
