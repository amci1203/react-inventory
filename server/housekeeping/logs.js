const
    Item  = require('../../dbmodels/item'),
    error = e => typeof e == 'string' ? { error: e } : { error: e.toString() };

/*
    All responses. if there is an error/exception, will pass a JSON object
    with at least an "error" field to the client.
*/

module.exports = {
    saveLog,
    printDayReport
};

// Saves both new and edited logs; an i (index) prop acts as a flag to make the difference
function saveLog (req, res) {
    const { body, params: { itemId } } = req;
    Item.push(itemId, body, (err, log) => {
        if (err) res.json(error(err));
        else res.json(log);
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
