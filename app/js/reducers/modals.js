export default (state = null, { type, payload }) => {
    switch (type) {
        case 'MODAL_OPEN':
            return payload;
        case 'MODAL_CLOSE':
            return null;
        case 'ACTIVE_ITEM_SET_AND_MODAL_OPEN':
            return payload.id;
        default:
            return state;
    }
}
