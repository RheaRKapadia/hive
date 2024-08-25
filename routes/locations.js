const express = require('express');
const router = express.Router();

// Sample data for the 9_newlocation page (can be replaced with database logic)
const equipments = [
  {
    name: "Equipment 1",
    descriptions: [
      { className: "item-blue" },
      { className: "item-pink" }
    ]
  },
  {
    name: "Equipment 2",
    descriptions: [
      { className: "item-green" },
      { className: "item-blue" }
    ]
  },
];

const locations = [
    {
      title: "Jane's Gym",
      equipments: [
        {
          name: "Equipment 1",
          descriptions: [
            { className: "item-blue" },
            { className: "item-pink" }
          ]
        },
        {
          name: "Equipment 2",
          descriptions: [
            { className: "item-green" },
            { className: "item-blue" }
          ]
        }
      ], 
      location: "Gym", 
      tools:[]
    },
    // ... other locations
  ];
  

// Route for the main locations page
router.get('/', (req, res) => {
  res.render('6_locations');
});

// Route for a specific location
router.get('/location', (req, res) => {
    res.render('7_location', { locations }); // Pass locations directly
});

// Route to edit a location
router.get('/location/edit', (req, res) => {
  res.render('8_editlocation');
});

// Route to create a new location (assuming equipments are available here too)
router.get('/new', (req, res) => {
  res.render('9_newlocation', { equipments });
});

// Handling POST request for creating a new location
router.post('/new', (req, res) => {
  // You can add logic here to handle the form submission
  res.redirect('/');
});

module.exports = router;