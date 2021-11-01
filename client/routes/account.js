const { Router } = require('express')
const adminRouter = require('./admin.js')

const router = Router()

router.use('/admin', adminRouter, (req, res) => {
    if (req.session.role !== 'admin') {
        res.status(404).send("Not found.")
    }
})
// router.use('/admin', adminRouter)

module.exports = router