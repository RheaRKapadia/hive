const express = require('express')
const router = express.Router()
const {getAllExercises} = require('../exercisedb')



router.get('/', (req, res) => {
    res.render('10_workouts')
})

router.get('/workout', (req, res) => {
    res.render('11_workout')
})

router.get('/new', async (req, res) => {

        try {

            exercises = await getAllExercises(req, res)
            console.log(exercises.pagination)
            res.status(200).render('12_newworkout', {
                exercises
            })
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
