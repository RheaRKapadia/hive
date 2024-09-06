const express = require('express')
const router = express.Router()
const firestore = require('../firestore')
const {getAllEquipment, getTargetMuscles} = require('../exercisedb')

router.get('/:userId/painpoints', async(req, res) => {
    //hard coded userid for now
    const userId = req.params.userId
    const user = await firestore.getUserData(userId)
    const painpointsList = await firestore.getUserPainpointsData(user.id)
    MusclesList = await getTargetMuscles(req, res)
    res.render('5_painpoints', {painpointsList, user, MusclesList, userId})
    //to reference the pain point name for frontend: use the forEach function to then access painpoint.location
    // or painpoint.painLevel
})

//haven't tested out form submit, might not work
router.post('/:userId/painpoints', async(req, res) => {
    const userId = req.params.userId
    const region = req.body.region
    const painLevel = req.body.painLevel
    const date = req.body.date

    try {
        await firestore.createPainPoint(userId, region, painLevel, date)
        res.redirect(`/${userId}/painpoints`);
    } catch(error) {
        res.status(500).json({ error: 'Failed to submit pain point' });
    }
    
    //frontend: in the form make sure you are using the same ids as above
    //also set method to post in form
})


module.exports = router
