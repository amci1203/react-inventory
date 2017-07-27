export default (state = null, { type, payload }) => {
    switch (type) {
        case 'MODAL_OPEN':
            return payload;
        case 'ACTIVE_ITEM_SET_AND_MODAL_OPEN':
            return payload.id;
        case 'MODAL_CLOSE':
        case 'ITEM_ADDED':
        case 'ITEM_LOGGED':
        case 'ITEM_REMOVED':
        case 'ITEM_EDITED':
        case 'ITEMS_ADDED':
        case 'ITEMS_LOGGED':
        case 'LOG_POSTED':
        case 'LOGS_POSTED':
            return null;
        default:
            return state;
    }
}
