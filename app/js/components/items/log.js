import React, { Component } from 'react';
import moment from 'moment';


export default function Log ({ log, openLogModal}) {

    const
        logs = log.map((l, i) => {
            const
                { added, removed } = l,
                date = moment(l.date).format('ddd, MMM DD YYYY'),
                addClass = added >= removed ? 'added strong' : 'added',
                removeClass = added <= removed ? 'removed strong' : 'removed';

            return (
                <p
                    className='log__record' key={i}
                    onClick={e => openLogModal(i)}
                >
                    <span className='date'>{date}</span>
                    <span className={addClass}>+{l.added}</span>
                    <span className={removeClass}>-{l.removed}</span>
                    <span className='balance'>{l.balance}</span>
                    <span className='comments'>{l.comments}</span>
                </p>
            )
        });

    return (
        <div className='log'>
            <hr />
            <p className='log__record log__record--headings'>
                <span className='date'>Date</span>
                <span>Added</span>
                <span>Removed</span>
                <span>Balance</span>
            </p>
            <hr />
            {logs}
            <button
                className='btn btn--primary log__add-button'
                onClick={e => openLogModal()}
            >ADD</button>
        </div>
    )

}
