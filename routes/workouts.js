const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('10_workouts')
})

router.get('/workout', (req, res) => {
    res.render('11_workout')
})

router.get('/new', (req, res) => {
    res.render('12_newworkout')
})

router.get('/workout/log', (req, res) => {
    res.render('13_logworkout')
})

router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router