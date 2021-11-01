const { Router } = require('express')
const { getShops } = require('../connection/app.js')
const truffle_connect = require('../connection/app.js')

const router = Router()

router.get('/', (req, res) => {
    if (req.session.role === 'guest') {
        res.status(404).send("Not found.")
    } else {
        // console.log(req.session.role)
        truffle_connect.account(req.session.user, req.session.role, (info) => {
            truffle_connect.getBalance(req.session.user, (balance) => {
                // console.log(balance)
                ethBalance = (balance / 1000000000000000000).toString()
                res.render('accounts_pages/admin/home', {
                    title: 'Admin page',
                    login: info.login,
                    name: info.name,
                    balance: ethBalance,
                    isLogin: req.session.isAuthenticated,
                    role: req.session.role
                })
            })
        })
    }
})

router.get('/admins_list', (req, res) => {
    truffle_connect.getAdmins(adminsList => {
        console.log(adminsList)
        res.render('accounts_pages/admin/admins', {
            title: 'System admins',
            admins: adminsList,
            isLogin: req.session.isAuthenticated,
            role: req.session.role
        })
    })
})

router.get('/shop_list', (req, res) => {
    truffle_connect.getShops(shops => {
        console.log(shops)
        res.render('accounts_pages/admin/shops', {
            title: 'Shops',
            shops: shopsList,
            isLogin: req.session.isAuthenticated,
            role: req.session.role
        })
    })
})

module.exports = router