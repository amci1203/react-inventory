import React, { Component } from 'react';
import { post } from 'axios';
import { debounce } from 'lodash';
import { makeErrorDiv, makeSubmitButton } from '../../helpers';

import Modal from '../Modal';

export default class NewItem extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkUniqueness = this.checkUniqueness.bind(this);

        this.state = { error: null };
    }

    checkUniqueness () {
        const
            { names } = this.props,
            name = this.name.value.toLowerCase();

        if (names.indexOf(name) > -1) {
            const error = 'An item with that name already exists';
            this.setState({ error });
            return;
        }

        this.setState({ error: null });
    }

    save () {
        const
            { category, name, inStock, lowAt } = this,
            { save, items } = this.props;

        if (name.value.trim() === '') {
            const error = 'A name must be specified';
            this.setState({error})
            return
        }
        const body = {
            category: category.value,
            name: name.value,
            inStock: Number(inStock.value),
            lowAt: Number(lowAt.value)
        };

        save(body)
    }

    render() {
        if (!this.props.items) return null;

        const
            { props, save } = this,
            error = makeErrorDiv(this.state.error),
            submit = makeSubmitButton('SAVE', this.state.error, save);

        return (
            <Modal id='new'>
                <h1 className='section-title'>NEW ITEM</h1>
                <form>
                    {error}
                    <div className="form-group inline">
                        <p>Category</p>
                        <input
                            list='categories-list'
                            ref={c => this.category = c}
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Name</p>
                        <input
                            onChange={debounce(this.checkUniqueness, 300, { leading: false })}
                            ref={n => this.name = n}
                        />
                    </div>
                    <div className="form-group inline">
                        <p>In Stock</p>
                        <input
                            type='number'
                            default='0'
                            min='0'
                            ref={s => this.inStock = s}
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Low At</p>
                        <input
                            type='number'
                            default='0'
                            min='0'
                            ref={l => this.lowAt = l}
                        />
                    </div>
                </form>
                { submit }
            </Modal>
        )
    }

}
