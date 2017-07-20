Object.assign(global,
    require('./items'),
    require('./logs')
)

module.exports = app => {

    app.get('/', getAllItems);
    app.post('/', saveItem);

    app.post('/items', saveManyItems);
    app.post('/logs', saveManyLogs);

    // app.get('/utils/fix-logs', fixBalances);

    app.get('/print/:date', printDayReport);

    app.get('/:itemId', getItemLog);
    app.post('/:itemId', saveLog);
    app.put('/:itemId', editItem);
    app.delete('/:itemId', deleteItem);

    app.put('/:itemId/:logId', editItemLog);



    return app;
};
