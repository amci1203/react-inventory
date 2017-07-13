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
import { uniq } from 'lodash';

export function setActiveItem (payload) {
    return { type: 'ACTIVE_ITEM_SET', payload  }
}

export function openItemDetails (payload) {
    if (!payload.log) {
        return dispatch => get(`housekeeping/${payload._id}`, res => {
            Object.assign(payload, { log: res.log });
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
    return dispatch => get('housekeeping').then(res => {
        const payload = {
            all: res.data.map((n, i) => Object.assign(n, { index: i })),
            categories: uniq(res.data.map(c => c.category))
        };
        dispatch({ type: 'ITEMS_FETCHED', payload });
    });
}

export function addItem (arr, item, noDispatch) {
    const
        name        = item.name.toLowerCase(),
        category    = item.category.toLowerCase(),
        categories  = arr.map(c => c.category.toLowerCase()),
        items       = arr.map(n => n.name.toLowerCase()),
        categoryArr = [...categories, category].sort(),

        // first & last occurence of the new item's category
        fc = categoryArr.indexOf(category),
        lc = categoryArr.lastIndexOf(category);

        categoryItemsArr = [...items.slice(fc, lc + 1), name].sort(),

        pos = fc === lc ? fc : fc + categoryItemsArr.indexOf(name),

        payload = [...arr.slice(0, pos), item , ...arr.slice(pos)]
            .map((n, i) => Object.assign(n, {index: i}))
        ;


    if (noDispatch) return payload;
    return noDispatch ? payload : dispatch => {
        post('housekeeping', item).then(res => {
            const { err } = res.data;
            console.log(err || 'ADD OK');
            if (!err) dispatch({ type: 'ITEM_ADDED', payload });
        })
    }
}

export function editItem (arr, i, item) {
    const
        edited = Object.assign(item, { index: i }),
        payload =  addItem([ ...arr.slice(0, i), ...arr.slice(i + 1)], item, true);
    return dispatch => put(`housekeeping/${item._id}`, item).then(data => {

        dispatch({ type: 'ITEM_EDITED', payload })
    })
}

export function removeItem (arr, { index, _id }, noDispatch) {
    const payload =  [ ...arr.slice(0, index), ...arr.slice(index + 1)];
    return noDispatch ? payload : dispatch => {
        axios.delete(`housekeeping/${_id}`).then(res => {
            const { err } = res.data;
            console.log(err || 'DELETE OK');
            if (!err) dispatch({ type: 'ITEM_REMOVED', payload });
        })
    }
}

export function postLog () {}
