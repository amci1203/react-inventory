import React, { Component } from 'react';
import axios, { get, put, post } from 'axios';
import { debounce } from 'lodash';


export default class Details extends Component {

    constructor (props) {
        super(props);

        this.state = {
            logs: null,
            error: null
        };
    }

    componentWillMount () {
        get('housekeeping/' + this.props.item._id)
            .then(res => this.setState({ logs: res.data.item.log }))
            .catch(e => console.error(e));
    }

    render() {
        if (!this.state.logs) return null;

        const
            { item } = this.props,
            logs = this.state.logs.map(log => {
                console.log(log);
                return (
                    <p key={log.date}>
                        <span>{log.date}</span>
                        <span>{log.added}</span>
                        <span>{log.removed}</span>
                    </p>
                )
            })

        return (
            <div>
                {logs}
            </div>
        )
    }

}
