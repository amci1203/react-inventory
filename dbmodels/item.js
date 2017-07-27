const moment = require('moment');

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
        getAll,
        getItemLog,
        add,
        push,
        editItem,
        editItemLog,
        remove,
        getRecordsForDate,
        checkBalances
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
        .select('-createdAt')
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

// Saves a new item; adds first log; and returns the new item to the client
function add (item, callback) {
    item.category = item.category || 'Uncategorized';
    item.log  = [{
        date     : item.date || moment().format('YYYY-MM-DD'),
        added    : item.inStock,
        balance  : item.inStock,
        comments : `Added ${item.name} to inventory`
    }];
    this.create(item, (err, _item) => isOK(err, _item, callback))
}

function push (_id, _log, callback) {
    this
        .findOne({ _id })
        .select('_id inStock log')
        .exec((err, doc) => {
            if (!doc) return callback('No item with the specified _id found');
            if (err) return callback(err);

            if (doc.log.map(d => d.date).indexOf(_log.date) > -1) {
                return callback('Log with that date is already in the database.');
            }

            const
                log = calculateBalances(doc.log, _log),
                inStock = log.slice(-1)[0].balance;

            return this.findOneAndUpdate(
                {_id: doc._id},
                { inStock, log },
                { upsert: true },
                (err, id) => isOK(err, log, callback)
            )
        })

    function calculateBalances (existing, log) {
        if ( moment(existing.slice(-1)[0].date).isBefore(log.date, 'days') ) {
            const
                balance = existing.slice(-1)[0].balance + log.added - log.removed,
                insert  = Object.assign(log, { balance });
            return [...existing, insert];
        }

        const
            start = existing
                .map(l => l.date)
                .concat(log.date)
                .sort()
                .indexOf(log.date)
            ,
            // calculates and returns new balance from log
            calc = ({ added, removed }) => {
                const ans = prevBalance + added - removed;
                prevBalance = ans;
                return ans;
            }
            // begin the new array from right before where the new log will be inserted
            arr = start === 0 ? [] : existing.slice(0, start),
            len = existing.length;

        let prevBalance = start === 0 ? 0 : existing[start - 1].balance;
        // push the new log first;
        arr.push( Object.assign(log, { balance: calc(log) }) )
        // keep pushing from right after the insertion to the end
        for (let i = start; i < len; i++) {
            const balance = calc(existing[i]);
            prevBalance = balance;
            arr.push( Object.assign(existing[i], { balance }) )
        }

        return arr;
    }
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


function isOK (err, data, cb) {
    if (err) {
        console.error(err.toString());
        if (typeof cb == 'function') cb(err);
        return false;
    }
    if (typeof cb == 'function') cb(null, data);
    return true;
}