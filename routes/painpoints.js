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
    const userId = req.params.userId
    const region = req.body.region
    const painLevel = req.body.painLevel
    console.log('id:', userId, 'region: ', region, 'pain level: ', painLevel)
    try {
        await firestore.createPainPoint(userId, region, painLevel)
        res.redirect(`/${userId}/painpoints`);
    } catch(error) {
        res.status(500).json({ error: 'Failed to submit pain point' });
    }
    
    //frontend: in the form make sure you are using the same ids as above
    //also set method to post in form
})


module.exports = router
