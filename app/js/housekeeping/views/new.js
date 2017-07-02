import React, { Component } from 'react';

import Modal from '../../shared/Modal';


export default class NewItem extends Component {

    constructor (props) {
        super(props);

        this.state = {};
    }

    save () {

    }

    render() {
        const
            { open, categories, onClose } = this.props,
            _categories = categories.map((c, i) => <option key={i}>{c}</option>);

        return (
            <Modal onClose={onClose}>
                <h1 className='section-title'>NEW ITEM</h1>
                <form>
                    <div className="form-group">
                        <p>Category</p>
                        <input list='categories' ref={c => this.category = c} required />
                    </div>
                    <div className="form-group">
                        <p>Name</p>
                        <input ref={n => this.name = n} required />
                    </div>
                    <div className="form-group">
                        <p>In Stock</p>
                        <input type='number' ref={s => this.inStock = s} required />
                    </div>
                    <div className="form-group">
                        <p>Low At</p>
                        <input type='number' ref={l => this.lowAt = l} required />
                    </div>
                    <button className="submit">SAVE</button>
                </form>
                <datalist id='categories'>{_categories}</datalist>
            </Modal>
        )
    }

}
