import React, { Component } from 'react'
import { debounce } from 'lodash';
import axios from 'axios';

import Modal from '../../shared/Modal';

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
            .catch(e => console.log(e.toString()))
    }

    render () {
        const
            { id } = this.state,
            { onClose } = this.props,
            error = this.state.error ? <p className='errors'>{this.state.error}</p> : null,
            items = this.props.items.map((item, i) => (<option key={i}>{item.name}</option>)),
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
                <Modal onClose={onClose}>
                    <h1 className="section-title">DELETE ITEM</h1>
                    <form>
                        { error }
                        <div className='form-group'>
                            <input
                                className='wide'
                                list='items'
                                onChange={debounce(this.checkIfExists, 200, { leading: false })}
                                ref={n => this.name = n}
                            />
                        </div>
                    </form>
                    { submit }
                    <datalist id='items'>{items}</datalist>
                </Modal>
            )
    }

}
