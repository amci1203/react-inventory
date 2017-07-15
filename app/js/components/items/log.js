import React, { Component } from 'react';


export default function Log ({ log }) {

    const
        logs = log.map((l, i) => {
            return (
                <p key={i}>
                    <span>{l.date}</span>
                    <span>{l.added}</span>
                    <span>{l.removed}</span>
                </p>
            )
        });

    return (
        <div>{logs}</div>
    )

}
