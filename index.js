const express = require('express')
const port = 3000 || process.env.PORT
const Web3 = require('web3')
const path = require('path')

const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const truffle_connect = require('./connection/app.js')
const bodyParser = require('body-parser')
const { info } = require('console')

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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

var current_account
var logged_in = false

app.get('/', (req, res) => {
    truffle_connect.start((account) => {
        res.render('home', {
            title: 'home'
        })
        current_account = account
    })
    console.log(current_account)
})

app.get('/switch', (req, res) => {
    truffle_connect.showAccounts((accounts) => {
        // console.log(accounts)
        res.render('switch', {
            title: 'Switch ethereum account',
            accounts
        })
    })
})

app.post('/switch', (req, res) => {
    const {address} = req.body
    console.log(`Switche to address ${address}`)
    logged_in = false
    current_account = address
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

app.post('/login', async (req, res) => {
    const {login, password} = req.body
    // console.log(login, password, current_account)
    if (current_account == undefined) {
        console.log('Please, select account')
        return
    }
    try {
        truffle_connect.checkAuthData(login, password, current_account, (result) => {
            console.log(result)
            if (result === true) {
                logged_in = true
                console.log('Success login')
            } else {
                console.log('Something going wrong')
            }
        }) 
    } catch (error) {
        console.log(error)
    }
    
})

app.get('/account', (req, res) => {
    truffle_connect.account(current_account, (info) => {
        console.log(info)
    })
})

app.post('/logout', (req, res) => {
    if (current_account !== undefined && logged_in) {
        logged_in = false
    }
})


app.listen(port, () => {

    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
    // console.log(truffle_connect.web3.currentProvider)
  
    console.log("Express Listening at http://localhost:" + port)
  
});