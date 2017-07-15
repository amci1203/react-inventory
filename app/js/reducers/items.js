export default (state = {}, action) => {
    const
        { type, payload, i } = action,
        { all, active } = state;

    switch (type) {
        case 'ITEMS_FETCHED':
            return Object.assign({}, state, payload);

        case 'ITEM_REMOVED':
            return Object.assign({}, state, {
                all: [...all.slice(0, i), ...all.slice(i + 1)]
            });

        case 'ITEM_ADDED':
            const
                addPos = all
                    .map(c => c.category)
                    .concat(payload.category)
                    .sort()
                    .lastIndexOf(payload.category)
                ,
                next = [...all.slice(0, addPos), payload, ...all.slice(addPos)]
                    .map((item, i) => Object.assign(item, { index: i }));
            return Object.assign({}, state, { all: next });

        case 'ITEM_EDITED':
            const
                rem = [...all.slice(0, i), ...all.slice(i + 1)],
                editPos =  active.category == payload.category ?
                active.index :
                all
                    .map(c => c.category)
                    .concat(payload.category)
                    .sort()
                    .lastIndexOf(payload.category) + 1
                ,
                edited = Object.assign(payload, { index: editPos });
            return Object.assign({}, state, {
                all: [...rem.slice(0, editPos), edited, ...rem.slice(editPos)]
            });

        case 'ACTIVE_ITEM_SET':
            return Object.assign({}, state, { active: payload })

        case 'ACTIVE_ITEM_SET_AND_MODAL_OPEN':
            return Object.assign({}, state, { active: payload.item })

        case 'ITEM_DETAILS_CLOSED':
            return Object.assign({}, state, {
                active: null,
                logOpen: false
            });

        case 'ACTIVE_ITEM_STOCK_CHANGED':
            const
                item = Object.assign({}, active, { inStock: payload });
            return Object.assign({}, state, {
                all: [...all.slice(0, i), item, all.slice(i + 1)]
            });

        case 'ITEM_DETAILS_OPENED':
            const obj = { active: payload, logOpen: true };
            if (action.addLog) {
                const items = state.all;
                return Object.assign({}, state, obj, {
                    all: [...items.slice(0, i), payload, ...items.slice(i + 1)]
                })
            }
            return Object.assign({}, state, obj);



        default:
            return state;
    }
}
