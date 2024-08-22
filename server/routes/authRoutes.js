const express = require('express');
const router = express.Router();
const cors = require('cors');
const {registerOwner, registerAgent, loginUser, updateUser, deleteUser, signOut, getUserListings, getUser} = require('../controllers/authControllers');
const {verifyToken} = require('../utils/verifyUser');

//middleware

router.use(
    cors({
        credentials: true,
        origin: 'https://keystate.onrender.com'
    })
)


//post routes

//owner signUproute route
router.post('/signUpOwner', registerOwner);

//agent signUproute route
router.post('/signUpAgent', registerAgent);
 
//login for the users
router.post('/login', loginUser);

//update your details
router.post('/update/:id', verifyToken, updateUser);

//delete routes
router.delete('/delete/:id', verifyToken, deleteUser);

//get route for signing out
router.get('/signout', signOut)

//get the user listing
router.get('/listings/:id', verifyToken, getUserListings);

//getting the user details
router.get('/:id', verifyToken, getUser);

module.exports = router;