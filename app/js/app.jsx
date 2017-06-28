import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import axios, { get, post } from 'axios';

import 'smoothscroll';


const
    // for axios
    getData = data => data.data;

class Housekeeping extends Component {

    constructor (props) {
        super(props);

        // this.getItems = this.getItems.bind(this);

        this.state = {
            items: null,
            categories: null
        }
    }

    componentWillMount () {

        axios.get('housekeeping').then(getData).then(data => {
            const
                items      = data,
                categories = items.map(group => group._id || 'Uncategorized'),
                state      = { items, categories };

            this.setState(state);
        });

    }

    render () {
        const
            { items, categories } = this.state;

        if (!items) return null;

        return (
            <div>
                <Sidebar categories={categories} />
                <Items items={items} />
            </div>
        )

    }
}

class Sidebar extends Component {

    constructor (props) {
        super(props);

        this.state = {}
    }

    render () {
        const categories = this.props.categories.map((cat, key) => {
            const href = `#${cat.replace(' ', '-').toLowerCase()}`;
            return <li key={key}><a href={href}>{cat}</a></li>;
        })

        return (
            <section>
                <aside className='sidebar'>
                    <h1 className="sidebar__title">HOUSEKEEPING</h1>
                    <input placeholder='Search...' />
                    <ul className='categories-list'>{categories}</ul>
                </aside>
                <aside className='sidebar__aside-buttons'>
                    <div className='sidebar__aside-buttons__top'>
                        <span className='icon icon--text'>+</span>
                        <span className='icon icon--text'>+</span>
                        <span className='icon icon--text'>+</span>
                    </div>
                    <div className='sidebar__aside-buttons__bottom'>
                        <span className='icon icon--text'>?</span>
                    </div>
                </aside>
            </section>
        )
    }

}

function Items (props) {

    const
        { items } = props,
        all = items.map((group, key) =>
            <CategoryGroup
                key={key}
                category={group._id}
                items={group.items}
            ></CategoryGroup>
        );

    return (
        <section className='items'>{all}</section>
    )

}

function CategoryGroup (props) {
    const
        { category, items } = props,
        href   = category ? category.replace(' ', '-').toLowerCase() : 'uncategorized',
        _items = items.map((item, key) =>
            <Item
                key={key}
                item={item}
            ></Item>
        );

    return (
        <section className='item-group'>
            <h1 className='item-group__category' id={href}>{category}</h1>
            {_items}
        </section>
    )

}

function Item (props) {
    const
        { name, inStock, lowAt, lastModified } = props.item,
        isLow = lowAt > inStock,
        _lastModified = lastModified ? lastModified.substring(0, 10) : '';

    return (
        <article className={`item-card ${isLow ? 'low' : ''}`}>
            <h1 className='item-card__item-name'>{name}</h1>
            <span className='item-card__item-stock'>{inStock}</span>
            <span className='item-card__item-last-modified'>{_lastModified}</span>
            <div className='item-card__options'>
                <span>TEST</span>
                <span>TEST</span>
                <span>TEST</span>
                <span>TEST</span>
            </div>
        </article>
    )
}

render(React.createElement(Housekeeping), document.getElementById('app'));
