import React, { Component } from 'react';
import { debounce } from 'lodash';
import moment from 'moment';
import { makeErrorDiv, makeSubmitButton } from '../../helpers';

import Modal from '../Modal';


export default class LogItem extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkBalance = debounce(this.checkBalance.bind(this), 200, { leading: false });

        this.state = { error: null };
    }

    componentDidMount () {
        const { added, removed } = this.props.item;
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

    checkDate () {
        if (moment().isBefore(this.date.value, 'days')) {
            const error = 'You cannot select a date that has yet to exist';
            this.setState({ error });
        }
    }

    save () {
        const
            { inStock, _id } = this.props.item,
            date    = this.date.value || moment().format('YYYY-MM-DD'),
            added   = Number(this.added.value),
            removed = Number(this.removed.value),
            balance = inStock + added - removed;

        this.props.log(this.props.item, { date, added, removed, balance });
    }

    render() {
        const
            { save, checkBalance, props: { item } } = this,

            error  = makeErrorDiv(this.state.error),
            submit = makeSubmitButton('SAVE', this.state.error, save);

        return (
            <Modal id='log'>
                <h1 className='section-title'>LOG ITEM</h1>
                <p className='text-center'>{item.name}</p>
                <form>
                    {error}
                    <div className='form-group inline'>
                        <p>Date:</p>
                        <input
                            type='date'
                            onChange={checkDate}
                            ref={d => this.date = d}
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Added:</p>
                        <input
                            type='number'
                            min='0'
                            onChange={checkBalance}
                            ref={a => this.added = a}
                            default='0'
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Removed:</p>
                        <input
                            type='number'
                            min='0'
                            onChange={checkBalance}
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
