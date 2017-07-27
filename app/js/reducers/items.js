import { uniq } from 'lodash';

export default (state = {}, action) => {
    const
        { type, payload, i, inStock, log } = action,
        { all, active } = state;

    switch (type) {
        case 'ITEMS_FETCHED':
            return Object.assign({}, state, payload);

        case 'ITEM_REMOVED':
            const 
                rNext = [...all.slice(0, i), ...all.slice(i + 1)]
                    .map((item, i) => Object.assign(item, { index: i }))
                ,
                rNextCategories = uniq(rNext.map(c => c.category));
            return Object.assign({}, state, {
                all: rNext,
                categories: rNextCategories,
                active: null,
                logOpen: false
            });

        case 'ITEM_ADDED':
            const
                addPos = all
                    .map(c => c.category)
                    .concat(payload.category)
                    .sort()
                    .lastIndexOf(payload.category)
                ,
                aNext = [...all.slice(0, addPos), payload, ...all.slice(addPos)]
                    .map((item, i) => Object.assign(item, { index: i }))
                ,
                aNextCategories = uniq(aNext.map(c => c.category));
            return Object.assign({}, state, {
                all: aNext,
                categories: aNextCategories
            });

        case 'ITEMS_ADDED':
            const
                addManyPos = all
                    .map(c => c.category)
                    .concat(payload[0].category)
                    .sort()
                    .lastIndexOf(payload.category)
                ,
                amNext = [...all.slice(0, addManyPos), ...payload, ...all.slice(addManyPos)]
                    .map((item, i) => Object.assign(item, { index: i }))
                ,
                amNextCategories = uniq(amNext.map(c => c.category));
            return Object.assign({}, state, {
                all: amNext,
                categories: amNextCategories
            });

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
                eNext = [...rem.slice(0, editPos), payload, ...rem.slice(editPos)]
                    .map((item, i) => Object.assign(item, { index: i }))
                ,
                eNextCategories = uniq(eNext.map(c => c.category));
            return Object.assign({}, state, {
                all: eNext,
                categories: eNextCategories
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

        case 'ITEM_DETAILS_OPENED':
            const obj = { active: payload, logOpen: true };
            if (action.addLog) {
                return Object.assign({}, state, obj, {
                    all: [...all.slice(0, i), payload, ...all.slice(i + 1)]
                })
            }
            return Object.assign({}, state, obj);

        case 'LOG_POSTED':
            const nextActive = Object.assign(active, { log, inStock });
            return Object.assign({}, state, {
                all: [...all.slice(0, i), nextActive, ...all.slice(i + 1)],
                active: nextActive
            });

        case 'LOGS_POSTED':
            const stateAfterManyLogs = () => {
                const
                    next = all.slice(0),
                    len = payload.length;
                for (let i = 0; i < len; i++) {
                    const { log, index, inStock } = payload[i];
                    Object.assign(next[index], {
                        log,
                        inStock: log.slice(-1)[0].balance
                    });
                }
                return Object.assign({}, state, { all: next });
            };
            return stateAfterManyLogs();

        default:
            return state;
    }
}
