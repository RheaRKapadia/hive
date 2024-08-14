const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('user page')
})

router.get('/new', (req, res) => {
    res.send('new user page')
})

router.post('/', (req, res) => {
    res.send('Create user')
})

// router
//     .route('/:id')
//     .get((req, res) => {
//         res.send(`Get user ${req.user.name}`)
//     })
//     .put( (req, res) => {
//         res.send(`Update user with ID ${req.params.id}`)
//     })
//     .delete((req, res) => {
//         res.send(`Delete user with ID ${req.params.id}`)
//     })

const users = [{ name: 'Jane'}, { name: 'John'}]
router.param( 'id', (req, res, next, id) =>{
    req.user = users[id]
    next()
})



module.exports = router

