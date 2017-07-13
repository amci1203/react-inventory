export default (state = null, { type, payload }) => {
    switch (type) {
        case 'MODAL_OPEN':
            return payload;
        case 'ACTIVE_ITEM_SET_AND_MODAL_OPEN':
            return payload.id;
        case 'MODAL_CLOSE':
        case 'ITEMS_ADDED':
        case 'ITEMS_REMOVED':
        case 'ITEMS_EDITED':
            return null;
        default:
            return state;
    }
}
