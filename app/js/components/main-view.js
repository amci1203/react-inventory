import React, { Component, Children } from 'react';
import axios, { get, post } from 'axios';
import { debounce } from 'lodash';

import Sidebar       from './Sidebar';
import Views         from '../shared/Views';
import Items         from './components/items';
import Details       from './views/details';
import NewItem       from './modals/new';
import EditItem      from './modals/edit';
import DeleteItem    from './modals/delete';
import ConfirmDelete from './modals/confirm-delete';
import Log           from './modals/log';

export default class Housekeeping extends Component {

    constructor (props) {
        super(props);

        this.groupItems   = this.groupItems.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.closeModal   = this.closeModal.bind(this);
        this.saveItem     = this.saveItem.bind(this);
        this.deleteItem   = this.deleteItem.bind(this);
        this.editItem     = this.editItem.bind(this);

        this.state = {
            activeItem: null,
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

    setStockBalance (inStock) {
        const item = Object.assign({}, this.state.activeItem, { inStock });
        this.editItem(item, this.state.activeItem);
    }

    setActiveAndOpenEdit (activeItem) {
        this.setState({ activeItem });
        this.views.select('edit');
    }

    setActiveAndOpenLog (activeItem) {
        this.setState({ activeItem });
        this.views.select('log');
    }

    setActiveAndOpenConfirmDelete (activeItem) {
        this.setState({ activeItem });
        this.views.select('confirm-delete');
    }

    setActiveAndOpenDetails (activeItem) {
        this.setState({ activeItem });
        this.views.select('details');
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
            { views } = this,
            { items } = this.state,
            deb = fn => debounce(fn, 300, { leading: false });

        if (items === null) return null;
        if (views && views.getCurrentViewId == 'details') return detailsView.call(this);
        else return mainView.call(this);
    }
}

function mainView () {
    const
        { items, filter, search, activeItem } = this.state,
        deb = fn => debounce(fn, 300, { leading: false }),
        shownItems = this.groupItems(items, filter, search),
        categories  = shownItems.map(i => i.category),

        deleteArr = items.map(n => {
            const { name, _id } = n;
            return { name, _id };
        }),

        filterMsg = filter ? (<h3>Showing: {filter.toUpperCase().replace('-', '\ ')}</h3>) : null;

    return (
        <div>
            <Sidebar
                categories={ categories }
                filter={ filter }
                handleSearch={ deb(this.handleSearch) }
                handleFilter={ this.handleFilter.bind(this) }
                newItem={ () => this.views.select('new') }
                logItems={ () => this.views.select('log') }
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
                    items={shownItems}
                    Details={this.setActiveAndOpenDetails.bind(this)}
                    Log={this.setActiveAndOpenLog.bind(this)}
                    Edit={this.setActiveAndOpenEdit.bind(this)}
                    Delete={this.setActiveAndOpenConfirmDelete.bind(this)}
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
                    onEdit={this.editItem}
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
                    item={this.state.activeItem}
                    onConfirm={this.deleteActiveItem.bind(this)}
                    onClose={this.closeModal}
                />
                <Log
                    id='log'
                    item={this.state.activeItem}
                    onLog={this.setStockBalance.bind(this)}
                    onClose={this.closeModal}
                />
                <Details
                    id='details'
                    item={this.state.activeItem}
                />
            </Views>
        </div>
    )
}
