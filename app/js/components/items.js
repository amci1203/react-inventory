import React, { Component } from 'react';
import { connectToStore } from '../helpers';
import { openModal } from '../actions/modals';
import { fetchItems } from '../actions/items';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


function Items ({
    items: { all, active },
    filter,
    openModal,
    openItemDetails,
    fetchItems
}) {
    if (!all) {
        fetchItems();
        return (<section className='items'><h1>LOADING...</h1></section>)
    }

    const actions = { openModal, openItemDetails };
    const groupedItems = ((_items, filter, search) => {
        const
            _search = search ? new RegExp(`^(${search})`, 'i') : null,
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
    })(all, filter.stock, filter.nominal);

    const
        filterNotification = (f => {
            f ? (<h3>Showing: {f.toUpperCase().replace('_', '\ ')}</h3>) : null;
        })(filter.stock),
        viewableItems = groupedItems.map((group, key) => {
            const props = { group, actions, key };
            return <CategoryGroup {...props} />
        });

    return (
        <section className='items'>
            {filterNotification}
            { viewableItems }
        </section>
    )


}

function CategoryGroup ({ group: {category, items}, actions }) {
    const
        href = category ? category.replace(' ', '-').toLowerCase() : 'uncategorized',
        list = items.map((item, key) => {
            const props = { item, actions, key };
            return <Item {...props} ></Item>
        });

    return (
        <section className='item-group'>
            <h1 className='item-group__category' id={href}>{category}</h1>
            {list}
        </section>
    )

}


function Item ({
    item: { name, inStock, lowAt, lastModified },
    actions: { openModal, openItemDetails }
}) {
    const
        isLow = lowAt > inStock,
        _lastModified = lastModified ? `Last Updated: ${lastModified.substring(0, 10)}` : '';

    return (
        <article className={`item-card ${isLow ? 'low' : ''}`}>
            <h1
                className='item-card__item-name'
                onClick={() => openItemDetails(item)}
            >{name}</h1>
            <span className='item-card__item-stock'>{inStock}</span>
            <span className='item-card__item-last-modified'>{_lastModified}</span>
            <div className='item-card__options'>
                <span
                    className='option clickable'
                    onClick={() => openModal('edit', item)}
                >EDIT</span>
                <span
                    className='option clickable'
                    onClick={() => openModal('log', item)}
                >LOG</span>
                <span
                    className='option option--danger clickable text-danger'
                    onClick={() => openModal('confirm-delete', item)}
                >DELETE</span>
            </div>
        </article>
    )
}

function matchSearch (item, search) {
    if (!search) return true;

    const
        nameWords = [item.name, ...item.name.split(' ')],
        categoryWords = [item.category, ...item.category.split(' ')],
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
    if (filter === 'ALL') return true;
    if (filter === 'LOW' && lowAt > inStock) return true;
    if (filter === 'IN_STOCK' && lowAt < inStock) return true;
    if (filter === 'DEPLETED' && inStock === 0) return true;
    return false;
}



const state = ({items, filter}) => {
    return { items, filter }
};

export default connectToStore(state, { openModal, fetchItems }, Items);
