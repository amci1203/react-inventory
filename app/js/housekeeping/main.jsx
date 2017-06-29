import React, { Component } from 'react';
import axios, { get, post } from 'axios';
import { debounce, trigger } from 'lodash';

// import 'smoothscroll';

import Sidebar from './Sidebar.jsx';
import Items from './Items.jsx';



const
    // for axios
    getData = data => data.data;



export default class Housekeeping extends Component {

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
            const items = data;
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
                    handleSearch={ debounce(this.handleSearch, 200, { leading: false }) }
                />
                <Items items={items} />
            </div>
        )

    }
}
