import React, { Component } from 'react';
import axios, { get, post } from 'axios';
import { debounce, trigger } from 'lodash';

// import 'smoothscroll';

import Sidebar from './Sidebar';
import Items from './Items';
import { NewModal } from './Modals';



const
    // for axios
    getData = data => data.data;



export default class Housekeeping extends Component {

    constructor (props) {
        super(props);

        this.filter = this.filter.bind(this);
        this.groupItems = this.groupItems.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.modals = {};

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

    openModal (modal) {
        console.log(this.modals[modal]);
        this.modals[modal].setState({open:true})
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

    // for Sidebar component
    // filter arg should be string (e.target.value); not the raw event.
    handleSearch (filter) {
        this.setState({ filter });
    }

    // filter items then passes them to be grouped
    filter () {
        const
            { items, filter } = this.state,
            low = s => s.toLowerCase(),
            filteredItems = items.filter(item => {
                const
                    _filter = new RegExp(`^(${filter})`),
                    words = low(item.name).split(' ');
                for (let i = 0, len = words.length; i < len; i++) {
                    if ( words[i].match(_filter) ) {
                        return true;
                    }
                }

                return false;
            });

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
                    newItem={() => this.openModal('newModal')}
                />
                <Items items={items} />

                <NewModal ref={mod => this.modals.newModal = mod} />
            </div>
        )

    }
}
