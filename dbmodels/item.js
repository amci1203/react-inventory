const
    mongoose = require('mongoose'),

    num = {type: Number, default: 0, min: 0},
    str = {type: String, trim: true},
    ass = Object.assign;

const subSchema = new mongoose.Schema({
    date     : ass(str, {unique: true}),
    added    : num,
    removed  : num,
    balance  : num,
    comments : ass(str, { maxlength: 140 })
});

const schema = new mongoose.Schema(
    {
        name     : ass(str, {unique: true}),
        category : ass(str, {default: 'Uncategorized'}),
        inStock  : num,
        lowAt    : num,
        log      : [ subSchema ]
    }, {
        timestamps: {
            createdAt: 'date',
            updatedAt: 'lastModified'
        }
    }
);

Object.assign(schema.statics, {

    getAll: function (callback) {
        const aggr = [
            {$project: {
                _id          : 1,
                category     : 1,
                name         : 1,
                inStock      : 1,
                lowAt        : 1,
                lastModified : 1
            }},
            {$group: {
                _id: '$category',
                items: {$push: {
                    _id          : '$_id',
                    name         : '$name',
                    inStock      : '$inStock',
                    lowAt        : '$lowAt',
                    lastModified : '$lastModified'
                }}
            }},
            {$sort: {_id: 1}}
        ];

        return this.aggregate(aggr).exec((err, docs) => isOK(err, docs, callback))
    },

    get: function (itemId, callback) {
        return this.findOne({ _id: itemId})
        .select('_id category name inStock log')
        .sort('log.date')
        .exec((err, doc) => isOK(err, doc, callback))
    },

    getCategoryItems: function (category, callback) {
        return this.find({category: category})
        .select('_id name')
        .sort('name')
        .exec((err, docs) => isOK(err, docs, callback))
    },

    create: function (item, callback) {
        item.log  = [{
            date     : item.date,
            added    : item.inStock,
            balance  : item.inStock,
            comments : `Added ${item.name} to inventory`
        }];
        let _new = new this(item);
        return _new.save((err, item) => isOK(err, item, callback))
    },

    push: function (isById, item, log, callback) {
        let query   = isById ? {_id: item}  :  {name: new RegExp(`${item}`)},
        balance = log.added - log.removed;
        this.findOne(query).select('_id inStock log').exec((err, doc) => {
            if (!doc) callback(`${item} not found.`);
            else {
                const itemId = doc._id;
                hasNoErrors(err);
                doc.log.forEach(item => {
                    if (item.date == log.date) return callback('Log with that date is already in the database.');
                })
                log.balance = doc.inStock + balance;
                return this.findOneAndUpdate(
                    {_id: doc._id},
                    {
                        $inc:  { inStock  : balance },
                        $push: { log : {
                            $each: [ log ],
                            $sort: { date:1 }
                        }}
                    },
                    { upsert: true },
                    (err, id) => {
                        if (hasNoErrors(err)) callback(err);
                        else callback(err, id);
                    }
                )
            }
        })
    },

    editItem: function (_id, data, callback) {
        const { name } = data;
        this.findOne({name}, (err, doc) => {
            if (doc) return callback({error: 'An item with this name already exists'});
            return this.findOneAndUpdate({_id}, data, {upsert: false}, (err, numAffected) => {
                hasNoErrors(err);
                callback(data);
            })
        })
    },

    editItemLog: function (itemId, logId, newLog, callback) {
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
        return this.update(
            {
                "_id"     : itemId,
                "log._id" : logId
            }, update, { upsert : false },
            (err, numAffected) => {
                if (hasNoErrors(err)) callback(err)
                //            else if (!newLog.hasOwnProperty('comments')) this.checkBalances(itemId, newLog, callback);
                callback(err, numAffected);
            }
        )
    },

    remove: function (itemId, callback) {
        return this.where({_id: itemId}).remove((err, removedId) => {
            hasNoErrors(err);
            if (callback !== undefined) callback(removedId)
        })
    },

    getRecordsForDate: function (dateString, callback) {
        return this.aggregate(
            [
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
                        },
                    }},
                }},
                {$sort: {_id: 1}}
            ], (err, result) => {
                hasNoErrors(err);
                callback(err, result);
            }
        )
    },

    checkBalances: function (id, log, callback) {
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
                let newBalances = {$set: {}},
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
})




module.exports = mongoose.model('Item', schema)


//
function isOK (err, data, cb) {
    if (err) {
        console.error(err.toString());
        if (typeof cb == 'function') cb(err);
        return false;
    }
    if (typeof cb == 'function') cb(null, data);
    return true;
}
