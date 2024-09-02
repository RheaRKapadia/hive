const express = require('express')
const router = express.Router()
const firestore = require('../firestore')
const {getAllBodyParts} = require('../exercisedb')

router.get('/', async(req, res) => {
    //hard coded userid for now

    // get pain point list of user 
    const painpointsList = await firestore.getUserPainpointsData( " h5B1fNuYmL1bjzEj2QTJ")
    console.log('Retriever user pain pointss:', painpointsList)

    // get list of body parts 
    const AllBodyParts = await getAllBodyParts(req, res)
    console.log('Retrieved all body parts:', AllBodyParts)
    res.render('5_painpoints', {painpointsList, AllBodyParts})
    //to reference the pain point name for frontend: use the forEach function to then access painpoint.location
    // or painpoint.painLevel
})

//haven't tested out form submit, might not work
router.post('/', async(req, res) => {
    const newPainpointsData = {
        // createdAt:  Timestamp.fromDate(new Date(req.body.date)),
        location: req.body.location, //should be array
        painLevel: req.body.painLevel,
        // userId: req.params.userId
        userId:  " h5B1fNuYmL1bjzEj2QTJ"
        //hard coded user id for now
    };

    await db.collection('PainPoints').set(newPainpointsData);
    res.redirect(`/`);
    //frontend: in the form make sure you are using the same ids as above: date, equipment, and name
    //also set method to post in form
})


module.exports = router