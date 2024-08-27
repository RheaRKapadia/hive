const express = require('express')
const router = express.Router()
const {getAllExercises} = require('../exercisedb')
const firestore = require('../firestore')


//route to display all workouts the user has created
router.get('/', async(req, res) => {
    // res.render('10_workouts')
    //hard coded userid for now
    const workoutsList = await firestore.getUserWorkoutsData( " h5B1fNuYmL1bjzEj2QTJ")
    console.log('Retriever user workouts:', workoutsList)
    res.render('10_workouts', workoutsList)
    //to reference workouts for frontend: use the forEach function to then access workout.name
    // or workout.exercise for list of exercises
})

//route to display a singular workout created by the user
router.get('/workout', async(req, res) => {
    // res.render('11_workout')
    const workout = await firestore.getUserSingularWorkoutData( ' h5B1fNuYmL1bjzEj2QTJ', 'JN4TCIHmfdIsPANP1iSR')
    console.log('Retrieved user locations for editing:', workout)
    res.render('11_workout', workout)
})

//route to display new workout, returns all exercises in api
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

//route to display log workout page
router.get('/workout/log', (req, res) => {
    res.render('13_logworkout')
})

//route to post new workout to database
router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router
