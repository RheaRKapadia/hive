const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the serviceAccountKey.json file
const serviceAccountKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../serviceAccountKey.json'), 'utf8'));
const wgerApiKey = serviceAccountKey.wger_api_key;

const WGER_API_BASE_URL = 'https://wger.de/api/v2';

router.get('/:id', async (req, res) => {
    try {
        const exerciseId = req.params.id;

        // Fetch exercise data from wger API
        const exerciseResponse = await axios.get(`${WGER_API_BASE_URL}/exercise/${exerciseId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${wgerApiKey}`
            }
        });

        const exerciseData = exerciseResponse.data;

        // Fetch muscle information
        const musclePromises = exerciseData.muscles.map(muscleId =>
            axios.get(`${WGER_API_BASE_URL}/muscle/${muscleId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${wgerApiKey}`
                }
            })
        );
        const muscleResponses = await Promise.all(musclePromises);
        const muscles = muscleResponses.map(response => response.data.name);

        // Fetch equipment information
        const equipmentPromises = exerciseData.equipment.map(equipmentId =>
            axios.get(`${WGER_API_BASE_URL}/equipment/${equipmentId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${wgerApiKey}`
                }
            })
        );
        const equipmentResponses = await Promise.all(equipmentPromises);
        const equipment = equipmentResponses.map(response => response.data.name);

        // Prepare the data for the template
        const exerciseForTemplate = {
            name: exerciseData.name,
            description: exerciseData.description,
            muscles: muscles,
            equipment: equipment.join(', '),
        };

        // Render the exercise page with the fetched data
        res.render('exercise', { exercise: exerciseForTemplate });
    } catch (error) {
        console.error('Error fetching exercise:', error);
        res.status(500).send('Error fetching exercise data');
    }
});

module.exports = router;
