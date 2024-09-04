const express = require('express')
const router = express.Router()
const firestore = require('../firestore')
const {getAllEquipment} = require('../exercisedb')

//route to view all user locations
router.get('/:userId/locations', async(req, res) => {
    //hard coded userid for now
    const userId = req.params.userId
    console.log(userId)
    const locationsList = await firestore.getUserLocationsData( userId)
    console.log('Retriever user locations:', locationsList)
    res.render('6_locations', {locationsList, userId})
    //to reference the location name for frontend: use the forEach function to then access location.locationName
})

//route to display a singular location
router.get('/:userId/locations/location', async(req, res) => {
    //hard coded userid and locationid for now
    const userId = req.params.userId
    const location = await firestore.getUserSingularLocationData( userId , 'xq2OnDZNfIer1lR9jrPo')
    console.log('Retrieved user location:', location)
    res.render('7_location', {location, userId})
    //frontend: to reference the location name for frontend: location.locationName
})

//route to display edit location page
router.get('/location/edit', async(req, res) => {
    //hard coded userid and locationid for now
    const userId = req.params.userId
    const location = await firestore.getUserSingularLocationData( userId, 'xq2OnDZNfIer1lR9jrPo')
    equipmentAll = await getAllEquipment(req, res)
    console.log('Retrieved user locations for editing:', location, '\nAll equipment: ', equipmentAll)
    res.render('8_editlocation', {location, equipmentAll, userId})
    //frontend: use data in location to autofill existing location info on edit page
    //get all available equipment from equipmentAll. get equipment the user has from location
    //for some reason getAllEquipment is making the page load a lot, can get rid of equipmentAll on line 30 temporarily for it to load.
})

//haven't tested this route because theres no form on the frontend, may not work. Send Rhea a message.
//frontend: make sure the method for the form is put
//route for submitting form on edit page
router.put('/:locationId/edit', async(req, res) =>{
    const locationId = req.params.locationId;
    const locationRef = db.collection('Locations').doc(locationId);
    
    const updatedData = {
        locationName: req.body.name,
        equipmentAvailable: req.body.equipment,
        updatedAt: Timestamp.fromDate(new Date(req.body.date)),
    };

    await locationRef.update(updatedData);
    res.redirect(`/locations/${locationId}`);
})

//route to display creating a new location
router.get('/:userId/locations/new', async(req, res) => {
    const userId = req.params.userId
    equipmentAll = await getAllEquipment(req, res)
    console.log('all equipment: ', equipmentAll)
    res.render('9_newlocation', {equipmentAll, userId})
    //equipmentAll is an an array, the equipment doesn't have an id associated with it.
    //frontend: create forEach loop to reference all items
})

//route for submitting new location (new location button)
//haven't tested this route because theres no form on the frontend, may not work. Send Rhea a message.
router.post('/:userId/locations/new', async(req,res) =>{
    const locationName = req.body.location
    const userId = req.params.userId
    const equipment = req.params.equipment
    try {
      await firestore.createLocation(userId, locationName, equipment)
      res.redirect(`/${userId}/locations`);
    } catch(error){
      res.status(500).json({ error: 'Failed to submit location' });
    }
})

module.exports = router

/* CODE CAMILLE USED: 
// Route for displaying locations (consider adding an ID or query to specify the location)
router.get('/', async(req, res) => {
  //hard coded userid for now
  const locationsList = await firestore.getUserLocationsData(" h5B1fNuYmL1bjzEj2QTJ")
  res.render('6_locations', {locationsList})
  //to reference the location name for frontend: use the forEach function to then access location.locationName
})

//route to display a singular location
router.get('/location', async(req, res) => {
  //hard coded userid and locationid for now
  const location = await firestore.getUserSingularLocationData( ' h5B1fNuYmL1bjzEj2QTJ', 'xq2OnDZNfIer1lR9jrPo')
  console.log('Retrieved user location!!:', location)
  res.render('7_location', {location})
  //frontend: to reference the location name for frontend: location.locationName
})


router.get('/location/edit', async(req, res) => {
  //hard coded userid and locationid for now
  const location = await firestore.getUserSingularLocationData( ' h5B1fNuYmL1bjzEj2QTJ', 'xq2OnDZNfIer1lR9jrPo')
  const equipmentAll = await getAllEquipment(req, res)
  console.log('Retrieved user locations for editing:', location, '\nAll equipment: ', equipmentAll)
  res.render('8_editlocation', {location, equipmentAll}) // add equipmentAll 
  //frontend: use data in location to autofill existing location info on edit page
  //get all available equipment from equipmentAll. get equipment the user has from location
  //for some reason getAllEquipment is making the page load a lot, can get rid of equipmentAll on line 30 temporarily for it to load.
})

router.get('/new', async(req, res) => {
  const equipmentAll = await getAllEquipment(req, res)
  console.log('all equipment: ', equipmentAll)
  res.render('9_newlocation', {equipmentAll})
  //equipmentAll is an an array, the equipment doesn't have an id associated with it.
  //frontend: create forEach loop to reference all items
})

//route for submitting new location (new location button)
//haven't tested this route because theres no form on the frontend, may not work. Send Rhea a message.
router.post('/new', async(req,res) =>{
  const newLocationData = {
      createdAt:  Timestamp.fromDate(new Date(req.body.date)),
      equipmentAvailable: req.body.equipment, //should be array
      locationName: req.body.name,
      userId: req.params.userId
  };

  const reponse = await db.collection('Locations').set(newLocationData);
  res.redirect(`/locations`);
  //frontend: in the form make sure you are using the same ids as above: date, equipment, and name
  //also set method to post in form
})

// Handling POST request for creating a new location
router.post('/new', (req, res) => {
  // Logic to handle form submission and add the new location
  res.redirect('/');
});

module.exports = router
*/ 
