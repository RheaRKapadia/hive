const express = require('express')
const app = express()
const firestore = require('./firestore')
const path = require('path');

//middleware
app.use(logger)
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
app.use('/user', userRouter)
app.use('/user/painpoints', painPointsRouter)
app.use('/user/locations', locationsRouter)
app.use('/user/workouts', workoutsRouter)


//simple logger for debugging, print the url used in the terminal
function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}

app.listen(3000)