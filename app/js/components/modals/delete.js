import React, { Component } from 'react'
import { debounce } from 'lodash';
import axios from 'axios';

import Modal from '../Modal';

export default class DeleteItem extends Component {

    constructor (props) {
        super(props);

        this.remove = this.remove.bind(this);
        this.checkIfExists = this.checkIfExists.bind(this);

        this.state = {
            index: null,
            error: null
        }
    }

    checkIfExists () {
        const
            { names } = this.props,
            name = this.name.value.toLowerCase();
        if (names.indexOf(name) > -1) {
            this.setState({ index: names.indexOf(name), error: null });
            return;
        };
        const error = `The item '${name}' does not exist`;
        this.setState({ index: null, error })
    }

    remove () {
        const {
            state: { index },
            props: { items, del }
        } = this;
        del(items[index])
    }

    render () {
        const
            { error, index } = this.state,
            _error = error ? <p className='errors'>{error}</p> : null,
            submit = index !== null ? (
                <button
                    className="submit"
                    onClick={this.remove}
                >DELETE</button>
            ) : (
                <button
                    className="submit"
                    disabled='disabled'
                >DELETE</button>
            );

            return (
                <Modal id='delete'>
                    <h1 className="section-title">DELETE ITEM</h1>
                    <form>
                        { _error }
                        <div className='form-group'>
                            <p className='wide'>Select the item you wish to remove</p>
                            <input
                                className='wide no-border'
                                list='items-list'
                                onChange={debounce(this.checkIfExists, 200, { leading: false })}
                                ref={n => this.name = n}
                            />
                        </div>
                    </form>
                    { submit }
                </Modal>
            )
    }

}
