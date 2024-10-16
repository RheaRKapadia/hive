
const firebase = require('firebase/compat/app');
require( 'firebase/compat/firestore');
require('firebase/compat/auth');
require('dotenv').config({ path: '.env' });

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase
