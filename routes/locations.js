const express = require('express')
const router = express.Router()
const firestore = require('../firestore')

router.get('/', async(req, res) => {
    //hard coded userid for now
    const locationsList = await firestore.getUserLocationsData( " h5B1fNuYmL1bjzEj2QTJ")
    console.log('Retriever user locations:', locationsList)
    res.render('6_locations', locationsList)
    //to reference the location name for frontend: use the forEach function to then access location.locationName
})

router.get('/location', async(req, res) => {
    //hard coded userid and locationid for now
    const location = await firestore.getUserSingularLocationData( ' h5B1fNuYmL1bjzEj2QTJ', 'xq2OnDZNfIer1lR9jrPo')
    console.log('Retrieved user location:', location)
    res.render('7_location', location)
    //frontend: to reference the location name for frontend: location.locationName
})

router.get('/location/edit', async(req, res) => {
    //hard coded userid and locationid for now
    const location = await firestore.getUserSingularLocationData( ' h5B1fNuYmL1bjzEj2QTJ', 'xq2OnDZNfIer1lR9jrPo')
    console.log('Retrieved user locations for editing:', location)
    res.render('8_editlocation', location)
    //frontend: use data in location to autofill existing location info on edit page
})

router.get('/new', (req, res) => {
    res.render('9_newlocation')
})

router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router