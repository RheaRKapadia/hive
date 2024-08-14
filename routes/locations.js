const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('6_locations')
})

router.get('/location', (req, res) => {
    res.render('7_location')
})

router.get('/location/edit', (req, res) => {
    res.render('8_editlocation')
})

router.get('/new', (req, res) => {
    res.render('9_newlocation')
})

router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router