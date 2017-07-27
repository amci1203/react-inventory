export function closeModal () {
    return { type: 'MODAL_CLOSE', payload: null };
}

export function openModal (id, item) {
    if (item || typeof item == 'number') {
        console.log(item);
        const payload = { id, item };
        if (typeof item == 'object') { // this would be an item object from the items.all array
            return { type: 'ACTIVE_ITEM_SET_AND_MODAL_OPEN', payload };
        }
        if (typeof item == 'number') { // this would be an index of the log going to be edited
            return { type: 'ACTIVE_LOG_SET_AND_MODAL_OPEN', payload }
        }
    }
    return { type: 'MODAL_OPEN', payload: id };
}
