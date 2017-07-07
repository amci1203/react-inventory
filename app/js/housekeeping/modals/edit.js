import React, { Component } from 'react';
import axios, { put } from 'axios';
import { debounce } from 'lodash';

import Modal from '../../shared/Modal';


export default class EditItem extends Component {

    constructor (props) {
        super(props);

        this.save = this.save.bind(this);
        this.checkUniqueness = this.checkUniqueness.bind(this);


        this.state = {
            error: null
        };
    }

    componentDidMount () {
        const { name, category, lowAt } = this.props.defaults;
        this.name.value = name;
        this.category.value = category;
        this.lowAt.value = lowAt;
    }

    checkUniqueness () {
        const
            defaultName = this.props.defaults.name.toLowerCase(),
            { items } = this.props,
            { name } = this,
            _name = name.value.toLowerCase();
        for (let i = 0, len = items.length; i < len; i++) {
            if (_name !== defaultName && _name === items[i]) {
                const error = 'An item with that name already exists';
                this.setState({ error });
                return
            }
        }

        this.setState({ error: null });
    }

    save () {
        const
            { category, name, lowAt } = this,
            { defaults } = this.props;

        if (name.value.trim() === '') {
            const error = 'A name must be specified';
            this.setState({error})
            return
        }
        const
            body = {
                category: category.value || defaults.category,
                name: name.value || defaults.name,
                lowAt: Number(lowAt.value) || defaults.lowAt
            },

            edited = Object.assign({}, defaults, body);

        put('housekeeping/' + defaults._id, body)
            .then(res => this.props.onEdit(edited, defaults))
            .catch(e => console.log(e));
    }

    render() {
        const
            { props, modal, save } = this,
            { open, categories, onClose, defaults } = this.props,
            { name, category, lowAt } = defaults,
            _categories = categories.map((c, i) => <option key={i}>{c}</option>),

            error = modal ? modal.makeErrorDiv(this.state.error) : null,
            submit = modal ? modal.makeSubmitButton('SAVE', this.state.error, save) : null;

        return (
            <Modal onClose={onClose} ref={m => this.modal = m}>
                <h1 className='section-title'>EDIT ITEM</h1>
                <form>
                    {error}
                    <div className="form-group inline">
                        <p>Category</p>
                        <input
                            list='categories'
                            ref={c => this.category = c}
                            default={category}
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Name</p>
                        <input
                            onChange={debounce(this.checkUniqueness, 200, { leading: false })}
                            ref={n => this.name = n}
                            default={name}
                        />
                    </div>
                    <div className="form-group inline">
                        <p>Low At</p>
                        <input
                            type='number'
                            default='0'
                            min='0'
                            ref={l => this.lowAt = l}
                            default={lowAt}
                        />
                    </div>
                </form>
                { submit }
                <datalist id='categories'>{_categories}</datalist>
            </Modal>
        )
    }

}
