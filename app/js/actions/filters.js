export function setSearch (payload) { // String
    return {
        type: 'SEARCH_SET',
        payload,
        meta: {
            debounce: { time: 350 }
        }
    }
}

export function setFilter (payload) { //String
    return { type: 'FILTER_SET', payload }
}
