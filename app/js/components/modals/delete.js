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
            id: null,
            error: null,
        }
    }

    checkIfExists () {
        const
            { items } = this.props,
            len = items.length,
            name = this.name.value;
        for (let i = 0; i < len; i++) {
            if (name === items[i].name) {
                this.setState({ id: items[i]._id, error: null });
                return;
            };
        }
        const error = `The item '${name}' does not exist`;
        this.setState({ id: null, error })
    }

    delete () {
        axios.delete('housekeeping/' + this.state.id)
            .then(res => this.props.onDelete(this.name.value))
            .catch(e => console.error(e))
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
