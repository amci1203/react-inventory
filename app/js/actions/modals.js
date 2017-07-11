export function closeModal () {
    return { type: 'MODAL_CLOSE', payload: null };
}

export function openModal (id, item) {
    if (item) {
        const payload = { id, item };
        return { type: 'ACTIVE_ITEM_SET_AND_MODAL_OPEN', payload };
    }
    return { type: 'MODAL_OPEN', payload: id };
}
