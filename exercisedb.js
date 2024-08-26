const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const getAllExercises = async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit; // Calculate the offset
    console.log(process.env.X_RAPIDAPI_KEY)
    try {
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',

            headers: {
                'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            },
            params: {
                limit: limit.toString(),
                offset: offset.toString()
              }
            };
        const response = await axios.request(options);
        //hard coded total, need to see how to access it
        const total = 1324
        const totalPages = Math.ceil(total / limit);


        return {
            data: response.data,
            pagination: {
              totalItems: total,
              totalPages: totalPages,
              currentPage: parseInt(page, 10),
              limit: parseInt(limit, 10)
            }
          }
    } catch (error) {
    console.error('Error fetching exercises data:', error)
    res.status(500).json({ error: 'Failed to fetch exercises data' });
    }
}

const getAllEquipment = async (req, res) => {

  try {
      const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/exercises/equipmentList',

          headers: {
              'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
              'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
          };
      const response = await axios.request(options);
      return {
          data: response.data,
        }
  } catch (error) {
  console.error('Error fetching equipment data:', error)
  res.status(500).json({ error: 'Failed to fetch equipment data' });
  }
}

module.exports = {getAllExercises, getAllEquipment}
