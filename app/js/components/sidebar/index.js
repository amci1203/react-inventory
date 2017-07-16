import React, { Component } from 'react';

import SearchBar from './search-bar';
import SidebarButtons from './buttons';
import List from './list';

import { connectToStore } from '../../helpers';
import { openItemDetails } from '../../actions/items';
import { setSearch, setFilter } from '../../actions/filters';
import { openModal } from '../../actions/modals';

function Sidebar ({ items, filter, openModal, openItemDetails, setFilter, setSearch }) {

    if (!items.all) return (
        <aside className='sidebar'>
            <div className='sidebar__aside-buttons'></div>
        </aside>
    )

    const list = !items.logOpen ? items.categories : (() => {
        const { category } = items.active;
        return items.all.filter(i => i.category == category)
    })()

    return (
        <aside className='sidebar'>
            <h1 className="sidebar__title">HOUSEKEEPING</h1>
            <SearchBar setSearch={setSearch} />
            <SidebarButtons
                filter={filter.stock}
                setFilter={setFilter}
                openModal={openModal}
            />
            <List
                type={items.logOpen ? 'single' : 'all'}
                list={list}
                active={items.active ? items.active.name : null}
                openItemDetails={openItemDetails}
            />
        </aside>
    )

}

const
    state = ({ items, filter }) => Object.assign({}, { items }, { filter }),
    actions = { setSearch, setFilter, openModal, openItemDetails };

export default connectToStore(state, actions, Sidebar);
