const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

//databse connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
})
.then(() => console.log("database connected"))
.catch((err) => console.log('database not connected', err))

app.use(express.json());
app.use(cors());

//
app.use('/', require('./routes/authRoutes')); // authentication routes
app.use('/api/listing', require('./routes/listingRoutes')); //listing routes

//running the server on port 8000
const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
