const express = require('express')
const router = express.Router()
const firestore = require('../firestore')

router.get('/:userId/painpoints', async(req, res) => {
    //hard coded userid for now
    const userId = req.params.userId
    console.log(userId)
    const user = await firestore.getUserData(userId)
    const painpointsList = await firestore.getUserPainpointsData(user.id)
    console.log('Retrieved user pain points:', painpointsList)
    res.render('5_painpoints', {painpointsList, user, userId})
    //to reference the pain point name for frontend: use the forEach function to then access painpoint.location
    // or painpoint.painLevel
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
