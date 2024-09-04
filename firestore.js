// firestore.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json')
require( 'firebase/compat/firestore');
require('firebase/compat/auth');
const firebase = require('./firebaseLogin')
// const { db } = require('./your-firebase-config-file');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "hive-3f18f.firebaseapp.com"
});

const db = admin.firestore();

module.exports = {
    db,
    getUserData: async (userId) => {
        const userSnapshot = await db.collection('Users').doc(userId).get()
        if (!userSnapshot.exists) {
          return { error: 'User not found' };
        }
        const user = { id: userSnapshot.id, ...userSnapshot.data() };
        // return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return user
    },
    getUserLocationsData: async (userId) => {
        const locationsSnapshot = await db.collection('Locations').where('userId', '==', userId).get()
        const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        return locations
    },
    getUserSingularLocationData: async (userId, locationId) => {
        try {
          const locationSnapshot = await db.collection('Locations').doc(locationId).get();

          if (!locationSnapshot.exists) {
            return { error: 'Location not found' };
          }

          const location = { id: locationSnapshot.id, ...locationSnapshot.data() };

          if (location.userId !== userId) {
            return { error: 'Unauthorized access' };
          }

          return location;
        } catch (error) {
          console.error('Error retrieving location:', error);
          return { error: 'Failed to retrieve location' };
        }
      },
      getUserPainpointsData: async (userId) => {
        const painpointsSnapshot = await db.collection('PainPoints').where('userId', '==', userId).get()
        const painpoints = painpointsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        return painpoints
    },
    getUserWorkoutsData: async (userId) => {
      const workoutsSnapshot = await db.collection('Workouts').where('userId', '==', userId).orderBy('createdAt', 'desc').get()
      const workouts = workoutsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return workouts
    },
    getUserSingularWorkoutData: async (userId, workoutId) => {
      try {
        const workoutSnapshot = await db.collection('Workouts').doc(workoutId).get();
        if (!workoutSnapshot.exists) {
          return { error: 'workout not found' };
        }
        // if (!workoutExercisesSnapshot.exists) {
        //   return { error: 'workout exercises not found' };
        // }

        const workout = { id: workoutSnapshot.id, ...workoutSnapshot.data() };
        // const workoutExercises = { id: workoutExercisesSnapshot.id, ...workoutExercisesSnapshot.data() };

        if (workout.userId !== userId) {
          return { error: 'Unauthorized access' };
        }
        return workout
      } catch (error) {
        console.error('Error retrieving Workout:', error);
        return { error: 'Failed to retrieve exercises' };
      }
    },
    createUser: async(firstName, lastName, email) =>{
      const uid = firebase.auth().currentUser.uid;
      const userRef = db.collection("Users").doc(uid);
      userRef.set({
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePic: "",
        age : null,
        createdAt :  admin.firestore.Timestamp.fromDate(new Date()),
        updatedAt :  admin.firestore.Timestamp.fromDate(new Date()),
        // Timestamp.fromDate(new Date())
      })
      .then(() => {
        console.log("User data stored successfully!");
      })
      .catch(error => {
        console.error("Error storing user data:", error);
      });
    },
    getUserWorkoutsData: async(userId) =>{
      try {
        const workoutsSnapshot = await db.collection('users').doc(userId).collection('workouts').orderBy('createdAt', 'desc').get();
        return workoutsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching user workouts:', error);
        return [];
      }
    },
    // New function to save a workout
saveUserWorkout:async(userId, workoutData)=> {
  return db.collection('users').doc(userId).collection('workouts').add({
    ...workoutData,
    createdAt: new Date()
  });
},

// Updated function to get user workouts with exercises
getDetailedUserWorkouts: function(userId) {
  return db.collection('users').doc(userId).collection('workouts')
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      return Promise.all(snapshot.docs.map(async doc => {
        const workout = { id: doc.id, ...doc.data() };
        // Fetch detailed exercise information for each exercise in the workout
        workout.exercises = await Promise.all(workout.exercises.map(async exerciseRef => {
          const exerciseDoc = await exerciseRef.get();
          return { id: exerciseDoc.id, ...exerciseDoc.data() };
        }));
        return workout;
      }));
    })
    .catch(error => {
      console.error('Error fetching user workouts:', error);
      return [];
    });
},
getExerciseDetails: function(userId, exerciseId) {
  return db.collection('users').doc(userId).collection('exercises').doc(exerciseId).get()
    .then(doc => {
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        return null;
      }
    })
    .catch(error => {
      console.error('Error fetching exercise details:', error);
      return null;
    });
}


};
