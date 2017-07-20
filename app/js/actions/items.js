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
import moment from 'moment';

window.moment = moment;

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

export function addItem (item) {
    return dispatch => {
        post('housekeeping', item).then(res => {
            const
                { error } = res.data,
                payload = res.data;
            console.log(error || 'ADD OK');
            if (!error) dispatch({ type: 'ITEM_ADDED', payload });
        })
    }
}

export function editItem (payload) {
    return dispatch => put(`housekeeping/${payload._id}`, payload).then(res => {
        const { error } = res.data;
        console.log(error || 'EDIT OK');
        if (!error) dispatch({ type: 'ITEM_EDITED', payload, i: payload.index })
    })
}

export function removeItem (payload) {
    const { index, _id } = payload;
    return dispatch => {
        axios.delete(`housekeeping/${_id}`).then(res => {
            const { error } = res.data;
            console.log(error || 'DELETE OK');
            if (!error) dispatch({ type: 'ITEM_REMOVED', i: index });
        })
    }
}

export function postLog (item, log) {

    return dispatch => {
        axios.post(`housekeeping/${item._id}`, log).then(res => {
            const
                { error, logs } = res.data,
                log = logs,
                i = item.index,
                inStock = logs.slice(-1)[0].balance;
            console.log(error || 'LOG OK');
            if (!error) dispatch({ type: 'LOG_POSTED', inStock, log, i });
        })
    }

}
