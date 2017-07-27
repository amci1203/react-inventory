const
    Item  = require('../../dbmodels/item'),
    error = e => typeof e == 'string' ? { error: e } : { error: e.toString() };

/*
    All responses. if there is an error/exception, will pass a JSON object
    with at least an "error" field to the client.
*/

module.exports = {
    getAllItems,
    saveItem,
    editItem,
    deleteItem
};

function getAllItems (req, res) {
    try {
        Item.getAll((err, docs) => {
            if (err) res.status(403).json(error(err));
            res.json(docs)
        });
    } catch (e) {
        res.error(e);
    }
}

function saveItem (req, res) {
    if (!req.body.name) {
        res.json({error: 'A name MUST be entered' })
    }
    else Item.add(req.body, (err, item) => {
        if (err) res.status(500).json(error(err));
        res.json(item)
    })
}

function editItem (req, res) {
    Item.editItem(req.params.itemId, req.body, (err, affected) => {
        if (err) res.json({error: 'An item already has that name.'});
        else res.end();
    })
}


function deleteItem (req, res) {
    const {itemId } = req.params;
    Item.remove(itemId, (err, id) => {
        if (id) res.end()
        else res.status(404).json(error(`No item with the id [${itemId}] exists.`))
    })
}
