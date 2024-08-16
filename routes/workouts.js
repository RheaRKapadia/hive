const express = require('express')
const router = express.Router()
const axios = require('axios');

router.get('/', (req, res) => {
    res.render('10_workouts')
})

router.get('/workout', (req, res) => {
    res.render('11_workout')
})

router.get('/new', async (req, res) => {
    // res.render('12_newworkout')
    const apiUrl = 'https://wger.de/api/v2/exercise/';

    try {
        const response = await axios.get(apiUrl)
        const exercises = response.data.results
        const exerciseNames = exercises.map(exercise => exercise.name)

        res.status(200).render('12_newworkout', {exerciseNames})
    } catch (error) {
        console.error('Error fetching exercises data:', error)
        res.status(500).json({ error: 'Failed to fetch exercises data' });
    }
})

router.get('/workout/log', (req, res) => {
    res.render('13_logworkout')
})

router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router