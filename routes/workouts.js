const express = require('express')
const router = express.Router()
const {getAllExercises} = require('../exercisedb')
const firestore = require('../firestore')




//route to display all workouts the user has created
router.get('/:userId/workouts', async(req, res) => {
    const userId = req.params.userId
    try{
        const workoutsList = await firestore.getUserWorkoutsData( userId)
        console.log('Retriever user workouts:', workoutsList)
        res.render('10_workouts', {workoutsList, userId})
    } catch (error){
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
    //to reference workouts for frontend: use the forEach function to then access workout.name
    // or workout.exercise for list of exercises
})

//route to display a singular workout created by the user
//Rhea - working on being able to access exercises as well
router.get('/:userId/workouts/workout/:workoutId', async(req, res) => {
    // res.render('11_workout')
    const userId = req.params.userId
    const workoutId = req.params.workoutId
    console.log(userId, workoutId)
    const workout = await firestore.getUserSingularWorkoutData( userId, workoutId)
    console.log(workout.userId, workout.locationId)
    // const location = await firestore.getUserSingularLocationData( userId, workout.locationId)
    console.log('Retrieved user workout:', workout)
    res.render('11_workout', {workout,  userId})
})

//route to display new workout, returns all exercises in api
router.get('/:userId/workouts/new', async (req, res) => {

        try {
            const userId = req.params.userId
            exercises = await getAllExercises(req, res)
            // console.log(exercises.pagination)
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
// router.get('/:userId/workouts/workout/log', async(req, res) => {
//     // res.render('13_logworkout')
//     const userId = req.params.userId
//     const workout = await firestore.getUserSingularWorkoutData( userId, 'JN4TCIHmfdIsPANP1iSR')
//     console.log('Retrieved user workout for logging:', workout)
//     const location = await firestore.getUserSingularLocationData(userId, workout.locationId)
//     console.log('Retrieved user workout:', workout, location)
//     res.render('13_logworkout', {workout, location, userId})
// })

//route to post new workout to database
router.post('/:userId/workouts/new', (req,res) =>{
    const { exercises, workoutName, location } = req.body;
    const userId = req.params.userId
    try {
        firestore.createWorkout(exercises, workoutName, location, userId)
        res.status(200).json({ success: true, redirectUrl: `/${userId}/workouts` });

    } catch(error) {
        console.error('Error submitting exercises:', error)
        res.status(500).json({ error: 'Failed to send exercises data' });
    }



})

//route to display new workout ai generated form
//returns list of all equipment and userId
router.get('/:userId/workouts/new/ai', async (req, res) => {

    try {
        const userId = req.params.userId
        equipmentAll = await getAllEquipment(req, res)
        // console.log(exercises.pagination)
        res.status(200).render('17_newAiWorkout', {
            equipmentAll, userId
        })
    } catch (error) {
    console.error('Error fetching exercises data:', error)
    res.status(500).json({ error: 'Failed to fetch exercises data' });
}
})

//route for submit button on the ai generated workout form
// no logic implemented yet, just redirects
router.post('/:userId/workouts/new/ai', async (req, res) => {

    try {
        const userId = req.params.userId
        // console.log(exercises.pagination)
        res.status(200).redirect(`${userId}/workouts`)
    } catch (error) {
    console.error('Error fetching exercises data:', error)
    res.status(500).json({ error: 'Failed to fetch exercises data' });
}
})


// Route to get details of a specific workout
// router.get('/:id', async (req, res) => {
//     const exerciseId = req.params.id;

//     try {
//         // Fetch the specific exercise data using the exerciseId
//         const exercise = await getAllExercises(req, res, exerciseId);

//         if (!exercise) {
//             return res.render('16_workoutdetails', { message: 'Exercise not found', exercise: null });
//         }

//         console.log('Fetched exercise:', exercise);  // Add this line for debugging

//         // Render the workout details page with the exercise data
//         res.render('16_workoutdetails', { exercise: exercise });
//     } catch (error) {
//         console.error('Error fetching exercise details:', error);
//         res.render('16_workoutdetails', { message: 'Could not retrieve exercise details', exercise: null });
//     }
// });

// API route for fetching workouts data as JSON
router.get('/:userId/workouts/data', async (req, res) => {
    const userId = req.params.userId;
    try {
        const workoutsList = await firestore.getUserWorkoutsData(userId);
        const simplifiedWorkouts = workoutsList.map(workout => ({
            id: workout.id,
            name: workout.name,
            location: workout.location,
            exerciseNames: workout.exercises.map(exercise => exercise.name)
        }));
        res.json(simplifiedWorkouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
});

module.exports = router
