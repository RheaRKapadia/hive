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
        
        try {
            const limit = 50
            const page = parseInt(req.query.page) || 1
            console.log('Requested Page:', req.query.page);
            const offset = (page - 1) * 50
            console.log('offset', offset)
            const options = {
                method: 'GET',
                url: 'https://exercisedb.p.rapidapi.com/exercises',
                params: {
                    limit:  limit,
                    offset: offset
                },
                headers: {
                    'x-rapidapi-key': '6158129b3amshfe64fae492f2220p15a3ccjsn9ccef1f59794',
                    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
                }
                };
            const response = await axios.request(options);
            exercises = response.data
            console.log(exercises[1]);
            const totalItems = response.data.count;
            const totalPages = Math.ceil(totalItems / limit);
            res.status(200).render('12_newworkout', {
                exercises,
                currentPage: page,
                totalPages: totalPages
            })
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