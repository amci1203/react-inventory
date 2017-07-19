const
    mongoose = require('mongoose'),

    num = {type: Number, default: 0, min: 0}
    str = {type: String, trim: true}
    ass = Object.assign;

const subSchema = new mongoose.Schema({
    date     : ass(str, { unique: true }),
    added    : num,
    removed  : num,
    balance  : num,
    comments : ass(str, { maxlength: 140 })
});

const schema = new mongoose.Schema(
    {
        name     : ass(str, {unique: true}),
        category : ass(str, { default: 'Uncategorized' }),
        inStock  : num,
        lowAt    : num,
        log      : [ subSchema ]
    }, {
        timestamps: { updatedAt: 'lastModified' }
    }
);

const
    statics = {
        getAll, getItemLog, getCategoryItems, add, push, editItem, editItemLog, remove,
        getRecordsForDate, checkBalances
    }
    // In case I ever decide to put some.
    methods = {};


Object.assign(schema.statics, statics);
// Object.assign(schema.methods, methods);

// gets all items from the the DB and groups them by category.
function getAll (callback) {
    const sort = {category: 1, name: 1};
    return this
        .find({})
        .select('-log -createdAt')
        .sort(sort)
        .exec((err, docs) => isOK(err, docs, callback))
    ;
}

// returns a single item's log; can only be retrieved by id
function getItemLog (_id, callback) {
    return this.findOne({ _id })
        .select('log')
        .sort('log.date')
        .exec((err, doc) => isOK(err, doc.log, callback))
    ;
}

// PLAN TO DELETE. JUST WANT TO MAKE SURE ALTERNATIVE WORKS FIRST
function getCategoryItems (category, callback) {
    return this.find({ category })
        .select('_id name')
        .sort('name')
        .exec((err, docs) => isOK(err, docs, callback))
    ;
}

// Saves a new item; adds first log; and returns the new item to the client
function add (item, callback) {
    item.category = item.category || 'Uncategorized';
    item.log  = [{
        date     : item.date || currentDate(),
        added    : item.inStock,
        balance  : item.inStock,
        comments : `Added ${item.name} to inventory`
    }];
    this.create(item, (err, _item) => isOK(err, _item, callback))
}

function push (isById, queryVal, incoming, callback) {
    const
        { added, removed, date } = incoming,
        query    = isById ? { _id: queryVal }  :  { name: new RegExp(`${queryVal}`) },
        balance  = added - removed,
        self     = this;

    self
        .findOne(query)
        .select('_id inStock log')
        .exec((err, doc) => {
            if (!doc) return callback(`${queryVal} not found.`);
            if (err) return callback(err);

            const { log, inStock } = doc;
            if (log.map(d => d.date).indexOf(date) > -1) {
                return callback('Log with that date is already in the database.');
            }

            incoming.balance = inStock + balance;

            return self.findOneAndUpdate(
                {_id: doc._id},
                {
                    $inc:  { inStock  : balance },
                    $push: { log : {
                        $each: [ ...log, incoming ],
                        $sort: { date: 1 }
                    }}
                },
                { upsert: true },
                (err, id) => isOK(err, id, callback)
            )
        })
}

function editItem (_id, data, callback) {
    const { name } = data;
    this.findOne({name}, (err, doc) => {
        if (doc) return callback('An item with this name already exists');
        return this.findOneAndUpdate({_id}, data, {upsert: false}, (err, numAffected) => {
            isOK(err, data, callback);
        })
    })
}

function editItemLog (itemId, logId, newLog, callback) {
    let update = {};

    if (newLog.hasOwnProperty('comments'))  {
        update = {
            $set: {
                "log.$.comments": newLog.comments
            }
        }
    } else {
        update = {
            $inc: {
                "inStock"       : newLog.stockDiff,
            },
            $set: {
                "log.$.added"   : newLog.added,
                "log.$.removed" : newLog.removed,
                "log.$.balance" : newLog.balance,
            }
        }
    }

    this.update(
        {
            "_id"     : itemId,
            "log._id" : logId
        },
        update,
        { upsert : false },
        (err, numAffected) => {
            if (err) return callback(err)
            if (numAffected === 0) return // don't know what I want to do here yet
            return correctBalances.call(this, itemId, logId, newLog.balance)
        }
    )
}

function remove (_id, callback) {
    return this
        .where({ _id })
        .remove((err, removed) => isOK(err, removed, callback))
}

function getRecordsForDate (dateString, callback) {
    const aggr = [
        {$project: {
            name     : 1,
            category : 1,
            log      : 1,
        }},
        {$group: {
            _id   : '$category',
            items : {$push: {
                name : '$name',
                log  : {
                    $filter: {
                        input : '$log',
                        as    : 'log',
                        cond  : {$eq: ['$$log.date', dateString]}
                    }
                }
            }}
        }},
        {$sort: {_id: 1}}
    ]
    return this.aggregate(aggr, (err, result) => isOK(err, result, callback))
}

function checkBalances (id, log, callback) {
    const query = {_id:id};
    this.findOne(query).select('log inStock').exec((err, doc) => {
        const allLogs   = doc.log,
        logsLen   = allLogs.length;
        let startFrom   = 0;
        allLogs.forEach((item, index) => {
            if (item.date == log.date) startFrom = index;
        })
        if (startFrom == logsLen - 1) callback(null)
        else {
            let newBalances = {$set: {}}
            i           = startFrom;
            for (i; i < logsLen; i++) {
                if (i == 0) {
                    newBalances['log.0.balance'] = allLogs[i].added - allLogs[i].removed;
                    allLogs[i].balance = newBalances['log.0.balance'];
                } else {
                    const prev = i - 1;
                    newBalances.$set[`log.${i}.balance`] = newBalances.$set[`log.${prev}.balance`] + allLogs[i].added - allLogs[i].removed;
                }
            }
            this.update(query, newBalances, {upsert: false}, err => {
                callback(err)
            })
        }
        callback(null)
    })
}



module.exports = mongoose.model('Item', schema)



function currentDate () {
    const d = new Date();
    return d.toISOString().substring(0, 10);
}

function isOK (err, data, cb) {
    if (err) {
        console.error(err.toString());
        if (typeof cb == 'function') cb(err);
        return false;
    }
    if (typeof cb == 'function') cb(null, data);
    return true;
}

function correctBalances (itemId, logId, balance) {
    const id = { _id: itemId };
    this
        .findOne(id)
        .select('log')
        .exec((err, doc) => {
            if (err) return err;

            const
                { log } = doc,
                len = log.length,
                start = log.map(l => l._id).indexOf(logId) + 1;
            let prev = balance;

            for (let i = start; i < len; i++) {
                const balance = prev + log[i].added - log[i].removed;
                Object.assign(log[i], { balance });
                prev = balance;
            }

            this.update(id, { $set: { log } }, { upsert: false }, err => {
                isOK(err, log, callback);
            })
        })
}
