import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import axios, { get, post } from 'axios';
// import { debounce, trigger } from 'lodash';

// import 'smoothscroll';


const
    // for axios
    getData = data => data.data;

class Housekeeping extends Component {

    constructor (props) {
        super(props);

        this.filter = this.filter.bind(this);
        this.groupItems = this.groupItems.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            items: null,
            filter: null
        }
    }

    componentWillMount () {

        get('housekeeping').then(getData).then(data => {

            const
                items     = data;


            this.setState({ items });
        });

    }

    groupItems (_items) {
        const
            grouped = [],
            items   = _items ? _items : this.state.items;
        let tmp = {};
        items.forEach((item, i) => {
            if (i === 0) {
                Object.assign(tmp, {
                    category: item.category,
                    items: [item]
                })
            }
            else {
                 if (item.category === items[i - 1].category) {
                     tmp.items.push(item)
                 } else {
                     grouped.push(tmp);
                     tmp = {category: item.category, items: [item]};
                 }
                 if (i === items.length - 1) grouped.push(tmp);
            }

        })

        return grouped;
    }

    handleSearch (filter) {
        this.setState({ filter });
    }

    filter () {
        const
            { items, filter } = this.state,
            low = s => s.toLowerCase(),
            filteredItems = items.filter(i => low(i.name).includes(low(filter)));

        console.log(filter);

        return this.groupItems(filteredItems)
    }

    render () {
        if (this.state.items === null) return null;

        const
            items = this.state.filter ? this.filter() : this.groupItems(),
            categories = items.map(i => i.category);

        return (
            <div>
                <Sidebar
                    categories={categories}
                    handleSearch={this.handleSearch}
                />
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
                    <input placeholder='Search...' onChange={e => this.props.handleSearch(e.target.value)}/>
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
                category={group.category}
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
