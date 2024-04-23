const mongoose = require('mongoose');
const {Schema} = mongoose;

//creating a schema for users who owns a property
const ownerSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Owner' // Default role for owners
    },
    avatar:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" //default image to display
    },
    accountBalance: {
        type: Number,
        default: 0 // Default account balance is 0
    }
}, {timestamps: true});

const OwnerModel = mongoose.model('Owner', ownerSchema);

module.exports = OwnerModel;