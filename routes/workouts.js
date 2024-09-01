const express = require('express')
const router = express.Router()
const {getAllExercises} = require('../exercisedb')
const firestore = require('../firestore')
const { db, getUserWorkoutsData, getUserSingularWorkoutData } = require('../firestore');



//route to display all workouts the user has created
router.get('/:userId/workouts', async(req, res) => {
    // res.render('10_workouts')
    //hard coded userid for now
    const userId = req.params.userId
    const workoutsList = await firestore.getUserWorkoutsData( userId)
    console.log('Retriever user workouts:', workoutsList)
    res.render('10_workouts', {workoutsList, userId})
    //to reference workouts for frontend: use the forEach function to then access workout.name
    // or workout.exercise for list of exercises
})

//route to display a singular workout created by the user
//Rhea - working on being able to access exercises as well
router.get('/:userId/workouts/workout', async(req, res) => {
    // res.render('11_workout')
    const userId = req.params.userId
    const workout = await firestore.getUserSingularWorkoutData( userId, 'JN4TCIHmfdIsPANP1iSR')
    console.log(workout.userId, workout.locationId)
    const location = await firestore.getUserSingularLocationData( userId, workout.locationId)
    console.log('Retrieved user workout:', workout, location.locationName)
    res.render('11_workout', {workout, location, userId})
})

//route to display new workout, returns all exercises in api
router.get('/:userId/workouts/new', async (req, res) => {

        try {
            const userId = req.params.userId
            exercises = await getAllExercises(req, res)
            console.log(exercises.pagination)
            res.status(200).render('12_newworkout', {
                exercises, userId
            })
        } catch (error) {
        console.error('Error fetching exercises data:', error)
        res.status(500).json({ error: 'Failed to fetch exercises data' });
    }
})

//route to display log workout page, returns info for selected workout
//Rhea - working on being able to access exercises as well
router.get('/:userId/workouts/workout/log', async(req, res) => {
    // res.render('13_logworkout')
    const userId = req.params.userId
    const workout = await firestore.getUserSingularWorkoutData( userId, 'JN4TCIHmfdIsPANP1iSR')
    console.log('Retrieved user workout for logging:', workout)
    const location = await firestore.getUserSingularLocationData(userId, workout.locationId)
    console.log('Retrieved user workout:', workout, location)
    res.render('13_logworkout', {workout, location, userId})
})

//route to post new workout to database
router.post('/:userId/workouts/new', (req,res) =>{
    res.redirect('/:userId/workouts')
})


// Route to get details of a specific workout
router.get('/:id', async (req, res) => {
    const exerciseId = req.params.id;

    try {
        // Fetch the specific exercise data using the exerciseId
        const exercise = await getAllExercises(req, res, exerciseId);

        if (!exercise) {
            return res.render('16_workoutdetails', { message: 'Exercise not found', exercise: null });
        }

        console.log('Fetched exercise:', exercise);  // Add this line for debugging

        // Render the workout details page with the exercise data
        res.render('16_workoutdetails', { exercise: exercise });
    } catch (error) {
        console.error('Error fetching exercise details:', error);
        res.render('16_workoutdetails', { message: 'Could not retrieve exercise details', exercise: null });
    }
});

module.exports = router
