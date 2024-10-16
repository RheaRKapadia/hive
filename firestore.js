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
getDetailedWorkouts: function() {
  return db.collection('Workouts')  // Make sure this is 'Workouts', not 'workouts'
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
    })
    .catch(error => {
      console.error('Error fetching workouts:', error);
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
},
    updateUserWorkoutCalendar: async (userId, completedDays) => {
      try {
        const workoutTrackerRef = db.collection('WorkoutTracker').doc(userId);
        const workoutTrackerSnapshot = await workoutTrackerRef.get();

        if (!workoutTrackerSnapshot.exists) {
          // If the document doesn't exist, create a new one
          await workoutTrackerRef.set({
            userId: userId,
            workoutCalendar: completedDays,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date())
          });
        } else {
          // If the document exists, update it
          await workoutTrackerRef.update({
            workoutCalendar: completedDays,
            updatedAt: admin.firestore.Timestamp.fromDate(new Date())
          });
        }
        console.log('Workout calendar updated successfully for user:', userId);
        return {
          id: userId,
          workoutCalendar: completedDays,
          updatedAt: admin.firestore.Timestamp.fromDate(new Date())
        };
      } catch (error) {
        console.error('Error updating workout calendar:', error);
        return { error: 'Failed to update workout calendar' };
      }
    },
    getUserWorkoutTracker: async (userId) => {
      try {
        const workoutTrackerSnapshot = await db.collection('WorkoutTracker').doc(userId).get();
        if (!workoutTrackerSnapshot.exists) {
          return { error: 'Workout tracker not found' };
        }
        const workoutTracker = { id: workoutTrackerSnapshot.id, ...workoutTrackerSnapshot.data() };
        return workoutTracker;
      } catch (error) {
        console.error('Error retrieving workout tracker:', error);
        return { error: 'Failed to retrieve workout tracker' };
      }
    },
    createPainPoint: async(userId, region, painLevel, date) =>{
      const painpointsRef = db.collection("PainPoints").doc();
      painpointsRef.set({
        userId: userId,
        region: region,
        painLevel: painLevel,
        date: date
      })
      .then(() => {
        console.log("User pain points data stored successfully!");
      })
      .catch(error => {
        console.error("Error storing user data:", error);
      });
    },
    createLocation: async(userId, location, equipment, possibleLocations) =>{
      const locationRef = db.collection("Locations").doc();
      locationRef.set({
        userId: userId,
        locationName: location,
        equipmentAvailable: equipment,
        possibleLocations: possibleLocations,
        createdAt :  admin.firestore.Timestamp.fromDate(new Date()),
        updatedAt :  admin.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log("User pain points data stored successfully!");
      })
      .catch(error => {
        console.error("Error storing user data:", error);
      });
    },
    updateLocation: async(userId, locationId, location, equipment, possibleLocations) =>{
      const locationRef = db.collection("Locations").doc(locationId);
      locationRef.update({
        userId: userId,
        locationName: location,
        equipmentAvailable: equipment,
        possibleLocations: possibleLocations,
        updatedAt :  admin.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log("User pain points data updated successfully!");
      })
      .catch(error => {
        console.error("Error updating user data:", error);
      });
    },
    createAiWorkout: async(exercises, userId, workoutName) =>{
      const workoutRef = db.collection("Workouts").doc();
      console.log(workoutName)
      workoutRef.set({
        userId: userId,
        locationId: "",
        locationName: '',
        name: workoutName,
        generatedByAi : true,
        createdAt :  admin.firestore.Timestamp.fromDate(new Date()),
        updatedAt :  admin.firestore.Timestamp.fromDate(new Date()),
        exercises : exercises,
      })
      .then(() => {
        console.log("User workout data stored successfully!");
      })
      .catch(error => {
        console.error("Error storing user data:", error);
      });
    },
    createWorkout: async(exercises, name, location, userId) =>{
      const workoutRef = db.collection("Workouts").doc();
      workoutRef.set({
        userId: userId,
        locationId: "",
        locationName: location,
        name: name,
        generatedByAi : false,
        createdAt :  admin.firestore.Timestamp.fromDate(new Date()),
        updatedAt :  admin.firestore.Timestamp.fromDate(new Date()),
        exercises : exercises,
      })
      .then(() => {
        console.log("User workout data stored successfully!");
      })
      .catch(error => {
        console.error("Error storing user data:", error);
      });
    },

};
