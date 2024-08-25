const express = require('express')
const router = express.Router()

//landing page
router.get('/', (req, res) => {
    res.render('1_index')
})

//log In page
router.get('/login', (req, res) => {
    res.render('2_login')
})

//log In page
router.post('/login', (req, res) => {
    res.redirect('/user/dashboard')
})

//Sign Up page
router.get('/signup', (req, res) => {
    res.render('3_signup')
})

//sign up page
router.post('/signup', (req, res) => {
    res.redirect('/user/dashboard')
})

//settings page
router.get('/user/settings', (req, res) => {
    res.render('14_settings')
})
module.exports = router
