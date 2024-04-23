const mongoose = require('mongoose');
const {Schema} = mongoose;

//creating a schema for users who are agents
const agentSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    agencyName:{
        type: String,
        required: true
    },
    agentId:{
        type: String,
        required: true,
        unique: true
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
        default: 'Agent' // Default role for agents
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

const AgentModel = mongoose.model('Agent', agentSchema);

module.exports = AgentModel;