const express = require('express')
const port = 3000 || process.env.PORT
const Web3 = require('web3')
const path = require('path')

const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const session = require('express-session')
const sqlite3 = require('sqlite3')
const sqliteStoreFactory = require('express-session-sqlite').default

const SqliteStore = sqliteStoreFactory(session)

const truffle_connect = require('./connection/app.js')
const bodyParser = require('body-parser')
const { info } = require('console')
const { render, redirect } = require('express/lib/response')

const rootRouter = require('./routes/root.js')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const hbs = exphbs.create({
    defauldtDir: 'views',
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(session({
    store: new SqliteStore({
        driver: sqlite3.Database,
        path: '/tmp/sessions.sqlite3',
        ttl: 60 * 60 * 1000,
        prefix: 'sess',
    }),
    secret: 'top secret'
}))

app.use('/', rootRouter)


app.listen(port, () => {

    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

    console.log("Express Listening at http://localhost:" + port)

});