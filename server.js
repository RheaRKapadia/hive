const express = require('express')
const app = express()
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const path = require('path');


// // Initialize Firebase Admin SDK using environment variables
// admin.initializeApp({
//     credential: admin.credential.cert({
//       "type": process.env.FIREBASE_TYPE,
//       "project_id": process.env.FIREBASE_PROJECT_ID,
//       "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
//       "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//       "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//       "client_id": process.env.FIREBASE_CLIENT_ID,
//       "auth_uri": process.env.FIREBASE_AUTH_URI,
//       "token_uri": process.env.FIREBASE_TOKEN_URI,
//       "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//       "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
//     }),
//     databaseURL: process.env.FIREBASE_DATABASE_URL
//   });

//   // Initialize Firestore
//   const db = admin.firestore();

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
    res.redirect('/user/dashboard')
})

//Sign Up page
app.get('/signup', (req, res) => {
    res.render('3_signup')
})

//sign up page
app.post('/signup', (req, res) => {
    res.redirect('/user/dashboard')
})

//dashboard page
app.get('/user/dashboard', async(req, res) => {
    try {
        const usersSnapshot = await db.collection('Users').get();
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Retrieved users:', usersList);
        const user = usersList.length > 0 ? usersList[0] : { name: 'Guest' }
        res.status(200).render('4_dashboard', {user}, (err, html) => {
            if (err) {
                console.error('Error rendering dashboard:', err);
                res.status(500).send('Error rendering dashboard');
            } else {
                res.send(html);
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
})

app.get('/user/settings', (req, res) => {
    res.render('14_settings')
})

// User Profile page
app.get('/userprofile', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('Users').get();
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Retrieved users:', usersList);
        const user = usersList.length > 0 ? usersList[0] : { name: 'Guest' };
        res.status(200).render('15_userprofile', { user }, (err, html) => {
            if (err) {
                console.error('Error rendering user profile:', err);
                res.status(500).send('Error rendering user profile');
            } else {
                res.send(html);
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});


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

// app.listen(3000)

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404: Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

function logger(req, res, next){
    console.log(req.originalUrl);
    next();
}

// Export the Express app
module.exports = app;
