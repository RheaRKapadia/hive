const axios = require('axios');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });


const getAllExercises = async (req, res) => {
    const { page = 1, limit = 1324 } = req.query;
    const offset = (page - 1) * limit; // Calculate the offset
    console.log('rapidAPI key:' , process.env.X_RAPIDAPI_KEY)
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
  console.log(process.env.X_RAPIDAPI_KEY)
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
  console.log('rapidAPI key:' , process.env.X_RAPIDAPI_KEY)
  res.status(500).json({ error: 'Failed to fetch equipment data' });
  }
}

const getAllMuscles = async (req, res) => {
  console.log('API Key:', process.env.X_RAPIDAPI_KEY);
  try {
      const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
          headers: {
              'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
              'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
      };
      const response = await axios.request(options);
      return {
          data: response.data
      };
  } catch (error) {
      console.error('Error fetching muscles data:', error.message);
      if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
      }
      res.status(500).json({ error: 'Failed to fetch muscles data' });
  }
}


const getAllTargetMuscles = async (req, res) => {
    console.log('API Key:', process.env.X_RAPIDAPI_KEY);
    try {
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises/targetList',
            headers: {
                'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        return {
            data: response.data
        };
    } catch (error) {
        console.error('Error fetching muscles data:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        res.status(500).json({ error: 'Failed to fetch muscles data' });
    }
  }

module.exports = {getAllExercises, getAllEquipment, getAllMuscles, getAllTargetMuscles}

