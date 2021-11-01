const { Router } = require('express')
const truffle_connect = require('../connection/app.js')

const accountRouter = require('./account.js')

const router = Router()

router.use('/account', accountRouter)

router.get('/', (req, res) => {
    if (!req.session.user) {
        truffle_connect.start((account) => {
            req.session.isLogin = false,
                req.session.role = 'guest'
            req.session.user = account
            req.session.save((err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(req.session.user)
                }
            })
        })
    }
    res.render('home', {
        title: 'home',
        isLogin: req.session.isAuthenticated,
        role: req.session.role
    })
})

router.get('/switch', (req, res) => {
    truffle_connect.showAccounts((accounts) => {
        // console.log(accounts)
        res.render('switch', {
            title: 'Switch ethereum account',
            accounts,
            isLogin: req.session.isAuthenticated,
            role: req.session.role
        })
    })
})

router.post('/switch', (req, res) => {
    const { address } = req.body
    req.session.regenerate(err => {
        if (err) {
            console.log(err)
        } else {
            req.session.user = address
            req.session.save((err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Switched to address ${address}`)
                    res.redirect('/login')
                }
            })
        }
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        isLogin: req.session.isAuthenticated,
        role: req.session.role
    })
})

router.post('/login', async (req, res) => {
    const { login, password } = req.body
    // console.log(login, password, current_account)
    if (req.session.user == undefined) {
        console.log('Please, select account')
        return
    }
    try {
        // console.log(req.session.user)
        truffle_connect.checkAuthData(login, password, req.session.user, (result) => {
            if (result === true) {
                truffle_connect.getRole(req.session.user, (role) => {
                    if (role === 'admin' || role === 'customer' || role === 'seller') {
                        req.session.role = role
                        req.session.isAuthenticated = true
                        req.session.save((err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('Success login', role)
                                res.redirect(`/account/${role}`)
                            }
                        })
                    } else {
                        console.log('Not registered yet')
                    }
                })
            } else {
                console.log('Something going wrong')
            }
        })
    } catch (error) {
        console.log(error)
    }

})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
            console.log('Success logged out')
        }
    })
})

module.exports = router