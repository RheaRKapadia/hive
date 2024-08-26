// firestore.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "hive-3f18f.firebaseapp.com"
});

const db = admin.firestore();

module.exports = {
    db,
    getUserData: async () => {
        const usersSnapshot = await db.collection('Users').get()
        // return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return usersSnapshot
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
      }
      
};
