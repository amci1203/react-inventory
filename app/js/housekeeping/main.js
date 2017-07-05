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

const
    // for axios
    getData = data => data.data;



export default class Housekeeping extends Component {

    constructor (props) {
        super(props);

        this.filter       = this.filter.bind(this);
        this.groupItems   = this.groupItems.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.closeModal   = this.closeModal.bind(this);
        this.saveItem     = this.saveItem.bind(this);
        this.deleteItem   = this.deleteItem.bind(this);
        this.setActive    = this.setActive.bind(this);

        this.state = {
            activeItem: null,
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


    render () {
        const
            { items, filter, activeView, activeItem } = this.state,
            deb = fn => debounce(fn, 300, { leading: false })

        if (items === null) return null;

        const
            _items = filter ? this.filter() : this.groupItems(),
            categories  = _items.map(i => i.category),
            deleteArr = items.map(n => {
                const { name, _id } = n;
                return { name, _id };
            });

        return (
            <div>
                <Sidebar
                    categories={categories}
                    handleSearch={ deb(this.handleSearch) }
                    newItem={() => this.views.select('new')}
                    editItem={() => this.views.select('edit')}
                    deleteItem={() => this.views.select('delete')}
                />
                <Views
                    className='main-view'
                    ref={v => this.views = v}
                    default='items'
                >
                    <Items
                        id='items'
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
        names  = items.map(n => n.name.toLowerCase()),
        name   = item.toLowerCase();
    for (let i = 0, len = items.length; i < len; i++) {
        if (name === names[i]) {
            return _items = [ ...arr.slice(0, i), ...arr.slice(i + 1)];
        }
    }
}
