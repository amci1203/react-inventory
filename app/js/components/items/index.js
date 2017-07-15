import React, { Component } from 'react';
import { connectToStore } from '../../helpers';
import { openModal } from '../../actions/modals';
import { fetchItems, setCategories, openItemDetails } from '../../actions/items';

import CategoryGroup from './category-group';
import ItemDetails from './details';

function Items ({
    items: { all, active, logOpen },
    filter,
    openModal,
    openItemDetails,
    fetchItems
}) {
    if (!all) {
        fetchItems();
        return (
            <section className='items loading'>
                <img src='icons/loading.svg' />
            </section>
        )
    }

    const actions = { openModal, openItemDetails };

    if (logOpen) {
        const props = {
            item: active,
            actions,
            logOpen
        };
        return (<ItemDetails {...props} />);
    }

    const groupedItems = ((_items, filter, search) => {
        const
            _search = search ? new RegExp(`^(${search.replace(/\s/g, '')})`, 'i') : null,
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
            { filterNotification }
            { viewableItems }
        </section>
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

        if (nW && nW.replace(/\s/g, '').match(search)) return true;
        if (cW && cW.replace(/\s/g, '').match(search)) return true;
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



const
    state = ({items, filter}) => {
        return { items, filter }
    },
    actions = { openModal, fetchItems, setCategories, openItemDetails };

export default connectToStore(state, actions, Items);
