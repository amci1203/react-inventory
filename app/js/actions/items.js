/*
    ALL ITEM ACTION TYPES

    ACTIVE_ITEM_SET      : sets active item, such as when opening up a modal
    ITEM_DETAILS_OPENED  : sets active item and opens up its log in the view
    ITEM_DETAILS_CLOSED  : sets active item to null and rturns to item list
    ITEMS_FETCHED        : items retrieved from server; push the array to state
    ACTIVE_ITEM_ STOCK_CHANGED    : active item's stock balance has changed
    ITEM_(REMOVED, ADDED, EDITED) : All self explanatory

*/

import axios, { get, post, put } from 'axios';

export function setActiveItem (payload) {
    return { type: 'ACTIVE_ITEM_SET', payload  }
}

export function openItemDetails (payload) {
    if (!payload.log) {
        get(`housekeeping/${payload._id}`, log => {
            Object.assign(payload, { log });
            return { type: 'ITEM_DETAILS_OPENED', payload, addLog: true }
        })
    }
    else return { type: 'ITEM_DETAILS_OPENED', payload }
}

export function closeItemDetails () {
    return { type: 'ITEM_DETAILS_CLOSED' }
}

export function setStockBalance (i, payload) {
    return { type: 'ACTIVE_ITEM_STOCK_CHANGED', index: i, payload }
}

export function fetchItems () {
    get('housekeeping').then(data => {
        const payload = data.data.map((n, i) => Object.assign(n, { index: i }));
        return { type: 'ITEMS_FETCHED', payload };
    });
}

export function addItem (arr, item) {
// flag is for internal use,
// if true, return the new array rather than the actual action
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
        const
            p = newArr.indexOf(category),
            payload = [...arr.slice(0, pos + 1), item, ...arr.slice(pos + 1)]
                .map((n, i) => Object.assign(n, {index: i}))
            ;
            return { type: 'ITEM_ADD', payload };
    }

    const
        categoryItemsArr = [...items.slice(fc, lc + 1), name].sort(),
        ip = categoryItemsArr.indexOf(name), // item position
        payload = [...arr.slice(0, fc + ip), item ,...arr.slice(fc + ip)]
            .map((n, i) => Object.assign(n, {index: i}))
        ;

    if (flag) return payload;
    return { type: 'ITEM_ADDED', payload };
}

export function removeItem (arr, i) {
    const payload =  [ ...arr.slice(0, i), ...arr.slice(i + 1)];
    return { type: 'ITEM_REMOVED', payload };
}

export function editItem (arr, i, item) {
    const
        edited = Object.assign(item, { index: i }),
        payload =  [ ...arr.slice(0, i), item, ...arr.slice(i + 1)];
    return { type: 'ITEM_EDITED', payload };
}
