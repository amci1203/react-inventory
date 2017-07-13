export default (state = {}, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'ITEMS_FETCHED':
        case 'ITEMS_ADDED':
        case 'ITEMS_REMOVED':
        case 'ITEMS_EDITED':
            return Object.assign({}, state, payload);

        case 'ACTIVE_ITEM_SET':
            return Object.assign({}, state, { active: payload })

        case 'ACTIVE_ITEM_SET_AND_MODAL_OPEN':
            return Object.assign({}, state, { active: payload.item })

        case 'ITEM_DETAILS_CLOSED':
            return Object.assign({}, state, {
                active: null,
                detailsOpen: false
            });

        case 'ACTIVE_ITEM_STOCK_CHANGED':
            const
                i = action.index,
                items = state.all,
                item = Object.assign({}, items[i], {
                    inStock: payload
                });
            return Object.assign({}, state, {
                all: [...items.slice(0, i), item, items.slice(i + 1)]
            });

        case 'ITEM_DETAILS_OPENED':
            const obj = { active: payload, detailsOpen: true };
            if (action.addLog) {
                const
                    i = payload.index,
                    items = state.all;
                return Object.assign({}, state, obj, {
                    all: [...items.slice(0, i), payload, ...items.slice(i + 1)]
                })
            }
            return Object.assign({}, state, obj);



        default:
            return state;
    }
}
