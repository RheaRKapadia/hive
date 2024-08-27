const express = require('express')
const app = express()
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const path = require('path');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
require('dotenv').config({ path: '.env' });

const port = process.env.PORT || 3000
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

console.log('Publishable Key:', clerkPublishableKey);
console.log('Publishable Key available:', !!clerkPublishableKey);
console.log('Secret Key available:', !!clerkSecretKey);


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "hive-3f18f.firebaseapp.com"
  });

// Initialize Firestore
const db = admin.firestore();

//middleware
app.use(logger)

// Clerk middleware
const clerkMiddleware = ClerkExpressWithAuth({
    secretKey: clerkSecretKey
  });

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

// Add logging middleware
app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
  });

console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

//log In page
// app.get('/login', (req, res) => {
//     res.render('2_login')
// })
// Public routes
app.get('/login', (req, res) => {
    console.log('Rendering login page with key:', clerkPublishableKey);
    res.render('2_login', {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublishableKey // Pass the key to the EJS template
    });
  });

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

// Dashboard page (protected route)
app.get('/user/dashboard', clerkMiddleware, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userDoc = await db.collection('Users').doc(userId).get();
        const user = userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : { name: 'Guest' };

        res.status(200).render('4_dashboard', { user }, (err, html) => {
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
});

// Settings page (protected route)
app.get('/user/settings', clerkMiddleware, (req, res) => {
    res.render('14_settings');
});

// User Profile page (protected route)
app.get('/userprofile', clerkMiddleware, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userDoc = await db.collection('Users').doc(userId).get();
        const user = userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : { name: 'Guest' };

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

app.use((req, res, next) => {
    res.locals.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    next();
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

// Apply Clerk middleware to all routes that require authentication
app.use('/user', clerkMiddleware, userRouter);
app.use('/user/painpoints', clerkMiddleware, painPointsRouter);
app.use('/user/locations', clerkMiddleware, locationsRouter);
app.use('/user/workouts', clerkMiddleware, workoutsRouter);

// Logger middleware
function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(3000)
