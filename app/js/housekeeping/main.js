import React, { Component, Children } from 'react';
import axios, { get, post } from 'axios';
import { debounce } from 'lodash';

// import 'smoothscroll';

import Sidebar from './Sidebar';
import Items from './Items';

import Views from '../shared/Views';

import NewItem from './views/new';
import EditItem from './views/edit';
import DeleteItem from './views/delete';
import ConfirmDelete from './views/confirm-delete';

export default class Housekeeping extends Component {

    constructor (props) {
        super(props);

        this.groupItems   = this.groupItems.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.closeModal   = this.closeModal.bind(this);
        this.saveItem     = this.saveItem.bind(this);
        this.deleteItem   = this.deleteItem.bind(this);
        this.setActive    = this.setActive.bind(this);

        this.state = {
            activeItem: null,
            activeView: 'items',
            items: null,
            search: null,
            filter: null
        }
    }

    componentWillMount () {
        get('housekeeping').then(data => {
            const items = data.data;
            this.setState({ items });
        });
    }

    closeModal () {
        this.views.returnToDefaultView();
    }

    // for Sidebar component
    // search arg should be string (e.target.value); not the raw event.
    handleSearch (search) {
        this.setState({ search });
    }

    handleFilter (filter) {
        this.setState({
            filter: (f => {
                const options = [null, 'in-stock', 'low', 'depleted'];
                return options[options.indexOf(f) + 1] || null;

            })(filter)
        })
    }

    saveItem (item) {
        const items = insertItem(item, this.state.items);
        this.setState({ items });
        this.closeModal()
    }

    deleteItem (item) {
        const items = removeItem(item, this.state.items);
        this.setState({ items });
        this.closeModal();
    }

    deleteActiveItem () {
        const { _id, name } = this.state.activeItem;
        axios.delete('housekeeping/' + _id)
            .then(res => this.deleteItem(name));
    }

    editItem (item, prev) {
        const items = insertItem(item, removeItem(prev, this.state.items));
        this.setState({ items });
        this.closeModal();
    }

    setActive (activeItem) {
        this.setState({ activeItem });
    }

    setActiveAndOpenEdit (item) {
        this.setActive(item);
        this.views.select('edit');
    }

    setActiveAndOpenConfirmDelete (item) {
        this.setActive(item);
        this.views.select('confirm-delete');
    }


    groupItems (_items, filter, search) {
        const
            _search = new RegExp(`^(${search})`, 'i'),
            grouped = [],
            items   = _items
                .filter(i => matchFilter(i, filter))
                .filter(i => matchSearch(i, _search))
            ;

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

    render () {
        const
            { items, filter, search, activeView, activeItem } = this.state,
            deb = fn => debounce(fn, 300, { leading: false })

        if (items === null) return null;

        const
            _items = this.groupItems(items, filter, search),
            categories  = _items.map(i => i.category),
            view = this.views ? this.views.getCurrentViewId() : '__default',

            deleteArr = items.map(n => {
                const { name, _id } = n;
                return { name, _id };
            }),

            filterMsg = filter ?
                (<h3>Showing: {filter.toUpperCase().replace('-', '\ ')}</h3>)
                : null
            ;

        return (
            <div>
                <Sidebar
                    view={ view }
                    categories={ categories }
                    filter={ filter }
                    handleSearch={ deb(this.handleSearch) }
                    handleFilter={ this.handleFilter.bind(this) }
                    newItem={ () => this.views.select('new') }
                    editItem={ () => this.views.select('edit') }
                    deleteItem={ () => this.views.select('delete') }
                />
                <Views
                    className='main-view'
                    ref={v => this.views = v}
                    default='items'
                >
                    <Items
                        id='items'
                        filterMsg={filterMsg}
                        items={_items}
                        onEditClick={this.setActiveAndOpenEdit.bind(this)}
                        onDeleteClick={this.setActiveAndOpenConfirmDelete.bind(this)}
                    />
                    <NewItem
                        id='new'
                        items={items.map(n => n.name.toLowerCase())}
                        categories={categories}
                        onSave={this.saveItem}
                        onClose={this.closeModal}
                    />
                    <EditItem
                        id='edit'
                        defaults={this.state.activeItem}
                        items={items.map(n => n.name.toLowerCase())}
                        categories={categories}
                        onEdit={this.saveItem}
                        onClose={this.closeModal}
                    />
                    <DeleteItem
                        id='delete'
                        items={deleteArr}
                        onDelete={this.deleteItem}
                        onClose={this.closeModal}
                    />
                    <ConfirmDelete
                        id='confirm-delete'
                        active={this.state.activeItem}
                        onConfirm={this.deleteActiveItem.bind(this)}
                    />
                </Views>
            </div>
        )

    }
}

function insertItem (item, arr) {
    const
        name        = item.name.toLowerCase(),
        category    = item.category.toLowerCase(),
        categories  = arr.map(c => c.category.toLowerCase()),
        items       = arr.map(n => n.name.toLowerCase()),
        categoryArr = [...categories, category].sort(),

        // first & last occurence of the new item's category
        fc = categoryArr.indexOf(category),
        lc = categoryArr.lastIndexOf(category);

    if (fc === lc) { // new category; secondary sort not required
        const pos = newArr.indexOf(category);
        return [
            ...arr.slice(0, pos + 1),
            item,
            ...arr.slice(pos + 1)
        ];
    }

    const
        categoryItemsArr = [...items.slice(fc, lc + 1), name].sort(),
        itemPos = categoryItemsArr.indexOf(name);

    return [
        ...arr.slice(0, fc + itemPos),
        item,
        ...arr.slice(fc + itemPos)
    ];

}

function removeItem (item, arr) {
    const
        names  = arr.map(n => n.name.toLowerCase()),
        name   = item.toLowerCase();
    for (let i = 0, len = arr.length; i < len; i++) {
        if (name === names[i]) {
            return [ ...arr.slice(0, i), ...arr.slice(i + 1)];
        }
    }
}

function matchSearch (item, search) {
    if ('null'.match(search)) return true;

    const
        nameWords = item.name.split(' '),
        categoryWords = item.category.split(' '),
        len = Math.max(nameWords.length, categoryWords.length);

    for (let i = 0; i < len; i++) {
        let nW = nameWords[i],
            cW = categoryWords[i];

        if (nW && nW.match(search)) return true;
        if (cW && cW.match(search)) return true;
    }

    return false;
}

function matchFilter (item, filter) {
    const { inStock, lowAt } = item;
    if (!filter) return true;
    if (filter === 'low' && lowAt > inStock) return true;
    if (filter === 'in-stock' && lowAt < inStock) return true;
    if (filter === 'depleted' && inStock === 0) return true;
    return false;
}
