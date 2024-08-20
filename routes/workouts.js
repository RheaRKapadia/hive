const express = require('express')
const router = express.Router()
const axios = require('axios');


router.get('/', (req, res) => {
    res.render('10_workouts')
})

router.get('/workout', (req, res) => {
    res.render('11_workout')
})

router.get('/new', async (req, res) => {
    //not all of these are in english so will have to clean it further & change capitalization of some of them
    const apiUrl = 'https://wger.de/api/v2/exercise';
    // /?language=2&limit=50
    const limit = 50
    const page = parseInt(req.query.page)
    console.log('Requested Page:', page);
    const offset = (page - 1) * 50

    try {
        const response = await axios.get(apiUrl, {
            params: {
                language: 2,
                limit: limit,
                offset: offset
            }
        })
        const exercises = response.data.results
        const exerciseNames = exercises.map(exercise => exercise.name)

        const totalItems = response.data.count;
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).render('12_newworkout', {
            exerciseNames,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching exercises data:', error)
        res.status(500).json({ error: 'Failed to fetch exercises data' });
    }
})

router.get('/workout/log', (req, res) => {
    res.render('13_logworkout')
})

router.post('/new', (req,res) =>{
    res.redirect('/')
})


module.exports = router