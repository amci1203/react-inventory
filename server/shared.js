module.exports = {

    connectDB: dbName => {
        db.connect(dbconn + dbName, err => {
            if (err) {
                console.error('ERR: CANNOT CONNECT TO MONGOD INSTANCE\n\n' + err.toString())
            }
            else console.log('Connected successfully to the %s database', dbName)
        })
    }

}
