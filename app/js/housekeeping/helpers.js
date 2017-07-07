export function insertItem (item, arr) {
    const
        name        = item.name.toLowerCase(),
        category    = item.category.toLowerCase(),
        categories  = arr.map(c => c.category.toLowerCase()),
        items       = arr.map(n => n.name.toLowerCase()),
        categoryArr = [...categories, category].sort(),

        // first & last occurence of the new item's category
        fc = categoryArr.indexOf(category),
        lc = categoryArr.lastIndexOf(category);

    if (fc === lc) { // new category; secondary sort not required
        const pos = newArr.indexOf(category);
        return [
            ...arr.slice(0, pos + 1),
            item,
            ...arr.slice(pos + 1)
        ];
    }

    const
        categoryItemsArr = [...items.slice(fc, lc + 1), name].sort(),
        itemPos = categoryItemsArr.indexOf(name);

    return [
        ...arr.slice(0, fc + itemPos),
        item,
        ...arr.slice(fc + itemPos)
    ];

}

export function removeItem (item, arr) {
    const
        names  = arr.map(n => n.name.toLowerCase()),
        name   = typeof item == 'string' ? item.toLowerCase() : item.name.toLowerCase();
    for (let i = 0, len = arr.length; i < len; i++) {
        if (name === names[i]) {
            return [ ...arr.slice(0, i), ...arr.slice(i + 1)];
        }
    }
}

export function matchSearch (item, search) {
    if ('null'.match(search)) return true;

    const
        nameWords = item.name.split(' '),
        categoryWords = item.category.split(' '),
        len = Math.max(nameWords.length, categoryWords.length);

    for (let i = 0; i < len; i++) {
        let nW = nameWords[i],
            cW = categoryWords[i];

        if (nW && nW.match(search)) return true;
        if (cW && cW.match(search)) return true;
    }

    return false;
}

export function matchFilter (item, filter) {
    const { inStock, lowAt } = item;
    if (!filter) return true;
    if (filter === 'low' && lowAt > inStock) return true;
    if (filter === 'in-stock' && lowAt < inStock) return true;
    if (filter === 'depleted' && inStock === 0) return true;
    return false;
}
