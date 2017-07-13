import React, { Component } from 'react'
import { debounce } from 'lodash';
import axios from 'axios';

import Modal from '../Modal';

export default class DeleteItem extends Component {

    constructor (props) {
        super(props);

        this.delete = this.delete.bind(this);
        this.checkIfExists = this.checkIfExists.bind(this);

        this.state = {
            index: null,
            error: null
        }
    }

    checkIfExists () {
        const
            { names } = this.props,
            len = items.length,
            name = this.name.value;
        if (names.indexOf(name) > -1) {
            this.setState({ index: names.indexOf(name), error: null });
            return;
        };
        const error = `The item '${name}' does not exist`;
        this.setState({ id: null, error })
    }

    delete () {
        const {
            state: { index },
            props: { items, removeItem }
        } = this;
        del(items, items[index])
    }

    render () {
        const
            { id } = this.state,
            { onClose } = this.props,
            error = this.state.error ? <p className='errors'>{this.state.error}</p> : null,
            submit = id ? (
                <button
                    className="submit"
                    onClick={this.delete}
                >DELETE</button>
            ) : (
                <button
                    className="submit"
                    onClick={this.delete}
                    disabled='disabled'
                >DELETE</button>
            )

            return (
                <Modal id='delete'>
                    <h1 className="section-title">DELETE ITEM</h1>
                    <form>
                        { error }
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
