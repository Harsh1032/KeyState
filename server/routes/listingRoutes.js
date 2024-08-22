const express = require('express');
const {createListing, deleteListing, updateListing, getListing, getListings} = require('../controllers/listingControllers');
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();

const cors = require('cors');
//middleware
// router.use(
//     cors({
//         credentials: true,
//         origin: 'poetic-profiterole-0d157a.netlify.app'
//     })
// )

//getting more than one properties
router.get('/getAllListings', getListings);

//creating a post enpoint for listing properties
router.post('/create', verifyToken, createListing);

//updating the property listed by user
router.post('/updateListing/:id', verifyToken, updateListing);

//deleting the properties
router.delete('/deleteListing/:id', verifyToken, deleteListing);

//getting the property
router.get('/getListing/:id', getListing);

module.exports = router;
