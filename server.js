const express = require('express')
const app = express()
const firestore = require('./firestore')
const path = require('path');
const bodyParser = require('body-parser');
const firebase = require('./firebaseLogin')
const axios = require('axios');
require('firebase/compat/auth');
require( 'firebase/compat/firestore');

const session = require('express-session');
const flash = require('connect-flash');

//middleware
app.use(logger)
//keep an account of the current user
// app.use((req, res, next) => {
//     var user = firebase.auth().currentUser;
//     console.log('middleware to detect user:', user)
//     res.locals.currentUser = user;
//     next();
//     })
//allows you to parse info inputted through forms
app.use(express.urlencoded({extended: true}))
//allows you to parse json info through the body
app.use(express.json())
//serve static files
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'))

//use a view engine to view the ejs files
app.set('view engine', 'ejs')

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));

  // Set up flash middleware
  app.use(flash());

  // Make flash messages available to all views
  app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
  });

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.type('application/javascript');
    }
    next();
  });

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

//get the routes defined in the corresponding file
const otherRouter = require('./routes/other')
const userRouter = require('./routes/users')
const painPointsRouter = require('./routes/painpoints')
const locationsRouter = require('./routes/locations')
const workoutsRouter = require('./routes/workouts')
const aiWorkoutsRouter = require('./routes/aiWorkouts')

//define what the starting url would be for the given route
app.use('/', otherRouter)
app.use('/', userRouter)
app.use('/', painPointsRouter)
app.use('/', locationsRouter)
app.use('/', workoutsRouter)
app.use('/', aiWorkoutsRouter)


//simple logger for debugging, print the url used in the terminal
function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}

app.listen(3000)
