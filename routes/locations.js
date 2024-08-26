const express = require('express')
const router = express.Router()
const firestore = require('../firestore')
const {getAllEquipment} = require('../exercisedb')

//route to view all user locations
router.get('/', async(req, res) => {
    //hard coded userid for now
    const locationsList = await firestore.getUserLocationsData( " h5B1fNuYmL1bjzEj2QTJ")
    console.log('Retriever user locations:', locationsList)
    res.render('6_locations', locationsList)
    //to reference the location name for frontend: use the forEach function to then access location.locationName
})

//route to display a singular location
router.get('/location', async(req, res) => {
    //hard coded userid and locationid for now
    const location = await firestore.getUserSingularLocationData( ' h5B1fNuYmL1bjzEj2QTJ', 'xq2OnDZNfIer1lR9jrPo')
    console.log('Retrieved user location:', location)
    res.render('7_location', location)
    //frontend: to reference the location name for frontend: location.locationName
})

//route to display edit location page
router.get('/location/edit', async(req, res) => {
    //hard coded userid and locationid for now
    const location = await firestore.getUserSingularLocationData( ' h5B1fNuYmL1bjzEj2QTJ', 'xq2OnDZNfIer1lR9jrPo')
    equipmentAll = await getAllEquipment(req, res)
    console.log('Retrieved user locations for editing:', location, '\nAll equipment: ', equipmentAll)
    res.render('8_editlocation', location, equipmentAll)
    //frontend: use data in location to autofill existing location info on edit page
    //get all available equipment from equipmentAll. get equipment the user has from location
    //for some reason getAllEquipment is making the page load a lot
})

//haven't tested this route because theres no form on the frontend, may not work
//route for submitting form on edit page
router.post('/:locationId/edit', async(req, res) =>{
    const locationId = req.params.locationId;
    const locationRef = db.collection('Locations').doc(locationId);
    
    const updatedData = {
        locationName: req.body.name,
        equipmentAvailable: req.body.equipment,
    };

    await locationRef.update(updatedData);
    res.redirect(`/locations/${locationId}`);
})

//route to display creating a new location
router.get('/new', async(req, res) => {
    equipmentAll = await getAllEquipment(req, res)
    console.log('all equipment: ', equipmentAll)
    res.render('9_newlocation', equipmentAll)
})

//route for submitting new location
router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router