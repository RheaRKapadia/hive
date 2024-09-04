const express = require('express')
const router = express.Router()
require( 'firebase/compat/firestore');
require('firebase/compat/auth');
const firebase = require('../firebaseLogin')
const firestore = require('../firestore')

//landing page
router.get('/', (req, res) => {
    res.render('1_index')
})

//log In page
router.get('/login', (req, res) => {
    res.render('2_login')
})

//log In page
router.post('/login', (req, res) => {
    // res.redirect('/user/dashboard')
    const {email, password} = req.body;
    var user = {}
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        console.log('from login post', userId)
        // Redirect to the user's dashboard using the dynamic user ID
        res.redirect(`/${userId}/dashboard`);
    })
    .catch((error) => {
        console.error("Login Error:", error);
        res.redirect('/login'); // Redirect back to login on error
    });
})

//Sign Up page
router.get('/signup', (req, res) => {
    res.render('3_signup')
})

//sign up page
router.post('/signup', async(req, res) => {
    // res.redirect('/user/dashboard')
    try {
        const {firstName, lastName, email, password} = req.body;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        try{firestore.createUser(firstName, lastName, email)}
        catch(e) {
            console.log(e)
        }
        userId = user.uid
        console.log(userId)
        res.redirect(`/${userId}/dashboard`);
        
        // console.log(user);
        })
        .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        });
        
        
        } catch(e) {
        console.log(e)
        res.redirect('/signup');
        }
})

//settings page
router.get('/user/settings', (req, res) => {
    res.render('14_settings')
})
module.exports = router

// forgot about logout functionality
// app.get('/logout', function(req , res){
//     firebase.auth().signOut().then(() => {
//     res.redirect('/login');
//     }).catch((error) => {
//     // An error happened.
//     });
//     });
