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
        const usersSnapshot = await db.collection('Users').get();
        // return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return usersSnapshot
    },
};
