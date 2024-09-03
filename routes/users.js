const express = require('express')
const router = express.Router()
const firestore = require('../firestore')

// router.get('/', (req, res) => {
//     res.send('user page')
// })

// router.get('/new', (req, res) => {
//     res.send('new user page')
// })

// router.post('/', (req, res) => {
//     res.send('Create user')
// })
//dashboard page, returns user info: name, id, gender, email, age, date created at, profile pic
router.get('/:userId/dashboard', async(req, res) => {
    try {
        const userId = req.params.userId
        const locationsList = await firestore.getUserLocationsData( userId)
        const painpointsList = await firestore.getUserPainpointsData(userId)
        const workoutsList = await firestore.getUserWorkoutsData( userId)
        // console.log('from dashboard get', userId)
        const user = await firestore.getUserData(userId)
        res.status(200).render('4_dashboard', {user, locationsList, painpointsList, workoutsList, userId}, (err, html) => {
            if (err) {
                console.error('Error rendering dashboard:', err);
                res.status(500).send('Error rendering dashboard');
            } else {
                res.send(html);
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
})

// User Profile page
router.get('/:userId/userprofile', async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await firestore.getUserData(userId)
        res.status(200).render('15_userprofile', { user }, (err, html) => {
            if (err) {
                console.error('Error rendering user profile:', err);
                res.status(500).send('Error rendering user profile');
            } else {
                res.send(html);
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

const users = [{ name: 'Jane'}, { name: 'John'}]
router.param( 'id', (req, res, next, id) =>{
    req.user = users[id]
    next()
})



module.exports = router
