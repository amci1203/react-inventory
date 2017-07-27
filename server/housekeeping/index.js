Object.assign(global,
    require('./items'),
    require('./logs')
)

module.exports = app => {

    app.get('/', getAll);
    app.post('/', save);

    // app.get('/utils/fix-logs', fixBalances);

    app.get('/print/:date', printDayReport);

    app.post('/:itemId', saveLog);
    app.put('/:itemId', edit);
    app.delete('/:itemId', remove);



    return app;
};
