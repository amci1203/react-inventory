import React, { Component } from 'react';
import axios, { put } from 'axios';
import { debounce } from 'lodash';
import { makeErrorDiv, makeSubmitButton } from '../../helpers';

import Modal from '../Modal';


export default class EditItem extends Component {

    constructor (props) {
        super(props);
        this.checkUniqueness = this.checkUniqueness.bind(this);
        this.state = { error: null };
    }

    componentDidUpdate () {
        if (!this.props.active) return;

        const { name, category, lowAt } = this.props.active;
        this.name.value = name;
        this.category.value = category;
        this.lowAt.value = lowAt;
    }

    checkUniqueness () {
        const
            defaultName = this.props.active.name.toLowerCase(),
            name = this.name.value.toLowerCase(),
            { names } = this.props;
        if ( name !== defaultName && names.indexOf(name) > -1 ) {
            const error = 'An item with that name already exists';
            return this.setState({ error })
        }
        this.setState({ error: null });
        return;
    }

    save () {
        const
            { category, name, lowAt } = this,
            { items, active } = this.props;

        if (name.value.trim() === '') {
            const error = 'A name must be specified';
            this.setState({error});
            return;
        }
        const
            body = {
                category: category.value || active.category,
                name: name.value || active.name,
                lowAt: Number(lowAt.value) || active.lowAt
            },

            edited = Object.assign({}, defaults, body);

        editItem(items, active.index, edited)
    }

    render() {
        if (!this.props.active) return null;

        const
            { props: { active }, modal, save } = this,

            error = makeErrorDiv(this.state.error),
            submit = makeSubmitButton('SAVE', this.state.error, save);

        return (
            <Modal id='edit'>
                <h1 className='section-title'>EDIT ITEM</h1>
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
                            onChange={debounce(this.checkUniqueness, 200, { leading: false })}
                            ref={n => this.name = n}
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
