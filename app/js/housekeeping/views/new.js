import React, { Component } from 'react';
import axios, { post } from 'axios';
import { debounce } from 'lodash';

import Modal from '../../shared/Modal';


export default class NewItem extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkUniqueness = this.checkUniqueness.bind(this);


        this.state = {
            error: null
        };
    }

    checkUniqueness () {
        const
            { items } = this.props,
            { name } = this,
            _name = name.value.toLowerCase();
        for (let i = 0, len = items.length; i < len; i++) {
            if (_name === items[i]) {
                const error = 'An item with that name already exists';
                this.setState({ error });
                return
            }
        }
        const { error } = this.state;
        if (error === 'An item with that name already exists') {
            this.setState({ error: null });
        }
    }

    save () {
        const { category, name, inStock, lowAt } = this;

        if (name.value.trim() === '') {
            const error = 'A name must be specified';
            this.setState({error})
            return
        }
        const body = { item: {
            category: category.value,
            name: name.value,
            inStock: Number(inStock.value),
            lowAt: Number(lowAt.value)
        }};

        post('housekeeping', body)
            .then(res => this.props.onSave(res.data))
            .catch(e => console.log(e.toString()));
    }

    render() {
        const
            error = this.state.error ? <p className='errors'>{this.state.error}</p> : null,
            { open, categories, onClose } = this.props,
            _categories = categories.map((c, i) => <option key={i}>{c}</option>);

        return (
            <Modal onClose={onClose}>
                <h1 className='section-title'>NEW ITEM</h1>
                <form>
                    {error}
                    <div className="form-group">
                        <p>Category</p>
                        <input
                            list='categories'
                            ref={c => this.category = c}
                        />
                    </div>
                    <div className="form-group">
                        <p>Name</p>
                        <input
                            onChange={debounce(this.checkUniqueness, 200, { leading: false })}
                            ref={n => this.name = n}
                        />
                    </div>
                    <div className="form-group">
                        <p>In Stock</p>
                        <input
                            type='number'
                            default='0'
                            min='0'
                            ref={s => this.inStock = s}
                        />
                    </div>
                    <div className="form-group">
                        <p>Low At</p>
                        <input
                            type='number'
                            default='0'
                            min='0'
                            ref={l => this.lowAt = l}
                        />
                    </div>
                </form>
                <button
                    className="submit"
                    onClick={this.save}
                >SAVE</button>
                <datalist id='categories'>{_categories}</datalist>
            </Modal>
        )
    }

}
