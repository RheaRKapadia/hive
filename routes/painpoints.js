const express = require('express')
const router = express.Router()
const firestore = require('../firestore')
const {getAllMuscles} = require('../exercisedb')

router.get('/:userId/painpoints', async(req, res) => {
    const userId = req.params.userId                                         // USER ID 
    const user = await firestore.getUserData(userId)                         // Getitng Pain Point List Associated to the User 
    const painpointsList = await firestore.getUserPainpointsData(user.id)
    const MusclesList = await getAllMuscles(req, res)                        // Getting the Possible Muscle to Identify Pain 

    /*
    console.log('USER ID: ', userId)
    console.log('Retrieved user:', user)
    console.log('Retrieved user id:', user.id)
    console.log('Retrieved user pain points:', painpointsList)
    console.log('Retrieved all muscles:', MusclesList)
    */
   
    res.render('5_painpoints', {painpointsList, user, MusclesList})
})

//haven't tested out form submit, might not work
router.post('/:userId/painpoints', async(req, res) => {
    const user = await firestore.getUserData(userId)
    const newPainpointsData = {
        // createdAt:  Timestamp.fromDate(new Date(req.body.date)),
        // createdAt : admin.firestore.Timestamp.fromDate(new Date()),

        location: req.body.location, //should be array
        painLevel: req.body.painLevel,
        // userId: req.params.userId
        userId:  user.id
        //hard coded user id for now
    };

    await db.collection('PainPoints').set(newPainpointsData);
    res.redirect(`/:userId/painpoints`);
    //frontend: in the form make sure you are using the same ids as above: date, equipment, and name
    //also set method to post in form
})


module.exports = router