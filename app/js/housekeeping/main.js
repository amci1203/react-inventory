import React, { Component, Children } from 'react';
import axios, { get, post } from 'axios';
import { debounce, trigger } from 'lodash';

// import 'smoothscroll';

import Sidebar from './Sidebar';
import Items from './Items';

import Views from '../shared/Views';

import NewItem from './views/new';

const
    // for axios
    getData = data => data.data;



export default class Housekeeping extends Component {

    constructor (props) {
        super(props);

        this.filter = this.filter.bind(this);
        this.groupItems = this.groupItems.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            activeitem: null,
            activeView: 'items',
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

    closeModal () {
        this.views.returnToDefaultView();
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
                if (filter === '__low__') {
                    return item.inStock < item.lowAt;
                }
                const
                    _filter = new RegExp(`^(${filter})`, 'i'),
                    nameWords = item.name.split(' '),
                    categoryWords = item.category.split(' '),
                    len = Math.max(nameWords.length, categoryWords.length);

                for (let i = 0; i < len; i++) {
                    let
                        nameWord = nameWords[i],
                        categoryWord = categoryWords[i];
                    if (nameWord && nameWord.match(_filter)) return true;
                    if (categoryWord && categoryWord.match(_filter)) return true;
                }

                return false;
            });

        return this.groupItems(filteredItems)
    }

    render () {
        const
            { items, filter, activeView, activeItem } = this.state,
            deb = fn => debounce(fn, 300, { leading: false })

        if (items === null) return null;

        const
            _items = filter ? this.filter() : this.groupItems(),
            categories  = _items.map(i => i.category);

        return (
            <div>
                <Sidebar
                    categories={categories}
                    handleSearch={ deb(this.handleSearch) }
                    newItem={() => this.views.select('new')}
                    editItem={() => this.views.select('edit')}
                />
            <Views className='main-view' ref={v => this.views = v} default='items'>
                    <Items id='items' items={_items} />
                    <NewItem id='new' categories={categories} onClose={this.closeModal}/>
                </Views>
            </div>
        )

    }
}
