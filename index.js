const
    db         = require('mongoose'),
    bodyParser = require('body-parser'),
    express    = require('express'),

    dbconn = 'mongodb://localhost:27017/',
    port   = 3000,

    app          = express(),
    routes       = require('./index.routes')(express.Router()),
    // admin        = require('./server/admin/app')(express),
    // snacks       = require('./server/snacks'),
    housekeeping = require('./server/housekeeping')(express());

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/icons'));

// SET ENV VARIABLES


// ROUTING
//app.use('/_', routes)
app.use('/housekeeping', housekeeping);
//app.use('/snacks', snacks);

app.get('/', (req, res) => { res.send('index.html') })

app.post('/connect/:dbName' , (req, res) => {
    const dbName = req.params.dbName.toLowerCase();
    connectDB(dbName);
})

app.listen(port, (err) => {
    if (err) console.error(err.toString())
    else console.info("Listening on port %s", port)
})

function connectDB (dbName) {
    db.connect(dbconn + dbName, err => {
        if (err) {
            console.log(err.toString());
            return false;
        }
        console.log('Successfully connected to the %s department DB', dbName);
        app.set('department', dbName);
    });
}

// Since so far there's only one department DB
connectDB('housekeeping');
