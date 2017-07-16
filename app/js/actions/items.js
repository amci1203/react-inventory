/*
    ALL ITEM ACTION TYPES

    ACTIVE_ITEM_SET      : sets active item, such as when opening up a modal
    ITEM_DETAILS_OPENED  : sets active item and opens up its log in the view
    ITEM_DETAILS_CLOSED  : sets active item to null and rturns to item list
    ITEMS_FETCHED        : items retrieved from server; push the array to state
    LOG_POSTED           : pushes a log to an item's log array
    ACTIVE_ITEM_ STOCK_CHANGED    : active item's stock balance has changed
    ITEM_(REMOVED, ADDED, EDITED) : All self explanatory

*/

import axios, { get, post, put } from 'axios';
import { uniq } from 'lodash';

export function setActiveItem (payload) {
    return { type: 'ACTIVE_ITEM_SET', payload  }
}

export function openItemDetails (item) {
    if (!item.log) {
        return dispatch => get(`housekeeping/${item._id}`).then(res => {
            const
                log = [ ...res.data.map((l, i) => Object.assign(l, { index: i })) ],
                payload = Object.assign(item, { log });
            dispatch({ type: 'ITEM_DETAILS_OPENED', payload, i: item.index, addLog: true })
        })
    }
    else return { type: 'ITEM_DETAILS_OPENED', payload: item, i: item.index }
}

export function closeItemDetails () {
    return { type: 'ITEM_DETAILS_CLOSED' }
}

export function setStockBalance (i, payload) {
    return { type: 'ACTIVE_ITEM_STOCK_CHANGED', i, payload }
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

export function addItem (payload) {
    return dispatch => {
        post('housekeeping', payload).then(res => {
            const { err } = res.data;
            console.log(err || 'ADD OK');
            if (!err) dispatch({ type: 'ITEM_ADDED', payload });
        })
    }
}

export function editItem (payload) {
    return dispatch => put(`housekeeping/${payload._id}`, payload).then(res => {
        const { err } = res.data;
        console.log(err || 'EDIT OK');
        dispatch({ type: 'ITEM_EDITED', payload, i: payload.index })
    })
}

export function removeItem (payload) {
    const { index, _id } = payload;
    return dispatch => {
        axios.delete(`housekeeping/${_id}`).then(res => {
            const { err } = res.data;
            console.log(err || 'DELETE OK');
            if (!err) dispatch({ type: 'ITEM_REMOVED', i: index });
        })
    }
}

export function postLog (item, log) {}
