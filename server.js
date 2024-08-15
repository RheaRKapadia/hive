const express = require('express')
const app = express()
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "hive-3f18f.firebaseapp.com"
  });

// Initialize Firestore
const db = admin.firestore();

//middleware
app.use(logger)
//allows you to parse info inputted through forms
app.use(express.urlencoded({extended: true}))
//allows you to parse json info through the body
app.use(express.json())

//use a view engine to view the ejs files
app.set('view engine', 'ejs')

//landing page 
app.get('/', (req, res) => {
    res.render('1_index')
})

//log In page 
app.get('/login', (req, res) => {
    res.render('2_login')
})

//log In page 
app.post('/login', (req, res) => {
    res.redirect('/dashboard')
})

//Sign Up page 
app.get('/signup', (req, res) => {
    res.render('3_signup')
})

//sign up page 
app.post('/signup', (req, res) => {
    res.redirect('user/dashboard')
})

//dashboard page 
app.get('/user/dashboard', async(req, res) => {
    // res.render('4_dashboard')
    try {
        const usersSnapshot = await db.collection('Users').get();
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log('Retrieved users:', usersList); // Check the logged data

        const user = usersList.length > 0 ? usersList[0] : { name: 'Guest' }
        res.status(200).render('4_dashboard', {user});
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
      }
})

//dashboard page 
app.get('/user/settings', (req, res) => {
    res.render('14_settings')
})

//get the routes defined in the corresponding file
const userRouter = require('./routes/users')
const painPointsRouter = require('./routes/painpoints')
const locationsRouter = require('./routes/locations')
const workoutsRouter = require('./routes/workouts')



//define what the starting url would be for the given route
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
