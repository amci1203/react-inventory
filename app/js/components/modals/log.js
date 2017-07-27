import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import moment from 'moment';
import { makeErrorDiv, makeSubmitButton } from '../../helpers';

import Modal from '../Modal';


export default class LogItem extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkBalance = debounce(this.checkBalance.bind(this), 200, { leading: false });
        this.checkDate = debounce(this.checkDate.bind(this), 200, { leading: false });

        this.state = { error: null };
    }

    componentDidMount () {
        if (typeof this.props.active == 'number') {
            const
                log = this.props.item.log[this.props.active],
                { date, added, removed, comments } = log;

            this.date.value    = date;
            this.added.value   = added;
            this.removed.value = removed;
            if (comments) this.comments.value = comments;

            ReactDOM.findDOMNode(this.date).setAttribute('disabled', 'disabled');
        }
    }

    checkBalance () {
        if (!this.added) return;
        const
            { inStock } = this.props.item,
            added   = Number(this.added.value),
            removed = Number(this.removed.value);

        if (inStock + added - removed < 0) {
            const error = 'That is impossible, as it would result in a negative stock level';
            this.setState({ error });
            return false;
        }

        this.setState({ error: null });
        return true;
    }

    checkDate () {
        if (!this.date) return;

        const
            { dates, active, item: { name } } = this.props,
            date = this.date.value || moment().format('YYYY-MM-DD');

        if (!active && dates.indexOf(date) > -1) {
            const error = `"${name}" already has a record for ${date}`;
            this.setState({ error })
            return false;
        }

        if (moment().isBefore(this.date.value, 'days')) {
            const error = 'You cannot select a date that has yet to exist';
            this.setState({ error });
            return false;
        }

        this.setState({ error: null });
        return true;
    }

    save () {
        if (!this.checkBalance() || !this.checkDate()) return;

        const
            { active, log, item } = this.props,

            date     = this.date.value || moment().format('YYYY-MM-DD'),
            added    = Number(this.added.value),
            removed  = Number(this.removed.value),
            comments = this.comments.value,
            _log     = { date, added, removed, comments };

        if (typeof active == 'number') Object.assign(_log, { i: active });

        log(item, _log);
    }

    render() {

        const
            { save, edit, checkBalance, checkDate, props: { item, active } } = this,

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
                    <div className='form-group'>
                        <textarea
                            placeholder='Comments...'
                            ref={c => this.comments = c}
                        ></textarea>
                    </div>
                </form>
                { submit }
            </Modal>
        )
    }

}
