const express = require('express')
const router = express.Router()
const {getAllExercises} = require('../exercisedb')
const firestore = require('../firestore')
const { db, getUserSingularWorkoutData } = require('../firestore');
const { getUserWorkoutsData, saveUserWorkout, getDetailedUserWorkouts } = require('../firestore');


//route to display all workouts the user has created
router.get('/:userId/workouts', async(req, res) => {
    // res.render('10_workouts')
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
      const userId = req.params.userId;
      const exercises = await getAllExercises(req, res);

      if (exercises && exercises.pagination) {
        res.status(200).render('12_newworkout', {
          exercises,
          userId  // Make sure to pass userId here
        });
      } else {
        console.error('Exercises data is incomplete:', exercises);
        res.status(500).render('error', { message: 'Failed to fetch complete exercises data' });
      }
    } catch (error) {
      console.error('Error fetching exercises data:', error);
      res.status(500).render('error', { message: 'Failed to fetch exercises data' });
    }
  });

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
    res.redirect('/:userId/workouts')
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

router.post('/:userId/workouts/create', async (req, res) => {
    const userId = req.params.userId;
    const { exercises, workoutName, location } = req.body;

    try {
      const workoutRef = await db.collection('users').doc(userId).collection('workouts').add({
        name: workoutName,
        location: location,
        exercises: exercises,
        createdAt: new Date()
      });

      res.json({ success: true, workoutId: workoutRef.id });
    } catch (error) {
      console.error('Error creating workout:', error);
      res.status(500).json({ success: false, error: 'Failed to create workout' });
    }
  });

//   router.post('/:userId/workouts/create', async (req, res) => {
//     const userId = req.params.userId;
//     const { exercises, workoutName, location } = req.body;

//     try {
//       const workoutRef = await saveUserWorkout(userId, {
//         name: workoutName,
//         location: location,
//         exercises: exercises
//       });

//       res.json({ success: true, workoutId: workoutRef.id });
//     } catch (error) {
//       console.error('Error creating workout:', error);
//       res.status(500).json({ success: false, error: 'Failed to create workout' });
//     }
//   });

  // Update the route that displays all workouts
  router.get('/:userId/workouts', async (req, res) => {
    const userId = req.params.userId;
    try {
      const workoutsList = await getDetailedUserWorkouts(userId);
      res.render('10_workouts', { workoutsList, userId });
    } catch (error) {
      console.error('Error fetching workouts:', error);
      res.status(500).render('error', { message: 'Failed to fetch workouts' });
    }
  });

  router.get('/:userId/exercise/:exerciseId', async (req, res) => {
    const { userId, exerciseId } = req.params;

    try {
      // Fetch the exercise details from your database or API
      const exercise = await firestore.getExerciseDetails(userId, exerciseId);

      if (exercise) {
        res.render('17_exercisedetails', { exercise, userId });
    } else {
        // Redirect to the workouts page with an error message
        req.flash('error', 'Exercise not found');
        res.redirect(`/${userId}/workouts`);
      }
    } catch (error) {
      console.error('Error fetching exercise details:', error);
      // Redirect to the workouts page with an error message
      req.flash('error', 'Failed to fetch exercise details');
      res.redirect(`/${userId}/workouts`);
    }
  });
module.exports = router
