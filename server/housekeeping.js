const
    Item        = require('../dbmodels/item'),
    querystring = require('querystring');

/*
    All responses. if there is an error/exception, will pass a JSON object
    with at least an "error" field to the client.
*/
const
    error = e => typeof e == 'string' ? { error: e } :{ error: e.toString() },
    reload = () => { reload: true };


module.exports = app => {

    app.get('/', getAllItems);
    app.post('/', saveItem);

    app.post('/items', saveManyItems);
    app.post('/logs', saveManyLogs);

    app.get('/utils/fix-logs', fixBalances);

    app.get('/print/:date', printDayReport);

    app.get('/:itemId', getItemLog);
    app.post('/:itemId', saveLog);
    app.put('/:itemId', editItem);
    app.delete('/:itemId', deleteItem);

    app.put('/:itemId/:logId', editItemLog);



    return app;
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

function saveManyItems (req, res) {
    const
    { category, items } = req.body,
    nItems = items.length;
    let savesCompleted = 0;
    items.forEach(item => {
        item.category  = category;
        Item.add(item, (err) => {
            if (err) res.json(error(err));
            savesCompleted++;
            if (savesCompleted === nItems) res.json(items)
        })
    })
}

function editItem (req, res) {
    Item.editItem(req.params.itemId, req.body, (err, affected) => {
        if (err) res.json({error: 'An item already has that name.'});
        else res.end();
    })
}

function getItemLog (req, res) {
    const { itemId } = req.params;
    Item.getItemLog(itemId, (err, log) => {
        if (err) res.status(500).json(error(err));
        if (log == undefined) res.status(404).json(error(`No item with the id [${itemId}] exists.`));
        res.json(log)
    })
}

function deleteItem (req, res) {
    const {itemId } = req.params;
    Item.remove(itemId, (err, id) => {
        if (id) res.end()
        else res.status(404).json(error(`No item with the id [${itemId}] exists.`))
    })
}

function saveLog (req, res) {
    const { body, params: { itemId } } = req;
    console.log(body);

    Item.push(true, itemId, body, (err, affected) => {
        if (err) res.json(error(err));
        else res.json({ error: null });
    })
}

function saveManyLogs (req, res) {
    const
        { itemLogs, date } = req.body,
        tStamp = new Date(),
        today  = tStamp.toISOString().substring(0,10),
        _date  = date || today,
        nLogs  = itemLogs.length;

    let savesCompleted = 0;

    itemLogs.forEach(item => {
        const { log, name } = item;

        Item.push(false, name, log, (err) => {
            if (err) res.json(error(err));
            else {
                savesCompleted++
                if (savesCompleted === nLogs) res.end();
            }
        })
    })
}

function editItemLog (req, res) {
    const {itemId, logId} = req.params;
    Item.editItemLog(itemId, logId, req.body, (err, affected) => {
        if (affected) {
            res.end();
        }
        else res.json({error: 'The record does not exist to be edited.'})
    })
}

function printDayReport (req, res) {
    Item.getRecordsForDate(req.params.date, (err, docs) => {
        const categories = [];
        docs.forEach(doc => {
            categories.push(docs._id);
            doc.items.forEach((item, index) => {
                doc.items = doc.items.filter(x => x.log.length > 0)
            })
        })
        res.json({ categories, docs })
    })
}

function fixBalances (req, res) {
    Item.find().select('_id log').exec((err, docs) => {
        const numItems     = docs.length;
        let savesCompleted = 0
        docs.forEach((item) => {
            const id        = item._id;
            let prevBalance = 0,
                logBalances = {};
            item.log.forEach((log, index) => {
                const thisLogBalance = prevBalance + log.added - log.removed;
                logBalances[`log.${index}.balance`] = thisLogBalance;
                prevBalance += thisLogBalance;
            })
            Item.update({_id: id}, {$set: logBalances }, {upsert: true}, err =>  {
                if (err) console.error(err)
                else {
                    savesCompleted++
                    if (savesCompleted == numItems) res.end('Done')
                }
            })
        })
    })
}
