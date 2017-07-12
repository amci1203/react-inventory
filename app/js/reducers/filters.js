export default (state = { stock: 'ALL', nominal: null }, { type, payload }) => {
    switch (type) {
        case 'SEARCH_SET':
            return Object.assign({}, state, { nominal: payload });
        case 'FILTER_SET':
            return Object.assign({}, state, { stock: payload });
        default:
            return state;
    }
}
