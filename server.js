const express = require('express')
const app = express()
const firestore = require('./firestore')
const path = require('path');
const bodyParser = require('body-parser');
const firebase = require('./firebaseLogin')
require('firebase/compat/auth');
require( 'firebase/compat/firestore');

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

//get the routes defined in the corresponding file
const otherRouter = require('./routes/other')
const userRouter = require('./routes/users')
const painPointsRouter = require('./routes/painpoints')
const locationsRouter = require('./routes/locations')
const workoutsRouter = require('./routes/workouts')

//define what the starting url would be for the given route
app.use('/', otherRouter)
app.use('/', userRouter)
app.use('/', painPointsRouter)
app.use('/:userid/locations', locationsRouter)
app.use('/:userid/workouts', workoutsRouter)


//simple logger for debugging, print the url used in the terminal
function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}

app.listen(3000)
