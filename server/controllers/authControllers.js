const Owner = require('../models/owners'); 
const Agent = require('../models/agents');
const uuid = require('uuid');
const { hashPassword, comparePassword} = require('../helpers/auth');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { access } = require('fs');
const bcrypt = require('bcrypt');
const Listing = require('../models/listing.model');
const { response } = require('express');

//registering users who are owners
const registerOwner = async (req, res) => {
    //extarct the owner details from the request object
    const {firstName, lastName, email, password, confirmPassword} = req.body;

    try {
        
        // check password
        if( !password){
            return res.status(400).json({
                error: 'Password is required'
            })
        };

        // check confirm password
        if( confirmPassword !== password ){
            return res.status(400).json({
                error: 'Password does not match'
            })
        };

        // check user first name
        if( !firstName ){
            return res.status(400).json({
                error: 'First name is required'
            })
        };

        // check user last name
        if( !lastName ){
            return res.status(400).json({
                error: 'Last name is required'
            })
        };
        // check email
        const exist = await Owner.findOne({email})
        if(exist){
            return res.status(400).json({
                error: 'Email already exists'
            })
        }

        // validating if the email is correct
        if(!validator.isEmail(email)){
            return res.status(400).json({
                error: 'Invalid email'
            })
        }
        //checking if password is strong or not
        if(!validator.isStrongPassword(password)){   
            return res.status(400).json({
                error: 'Password is not strong enough'
            })
        }
        //hashing the password i.e., creating extra layer of protection
        const hashedPassword = await hashPassword(password);

        //creating a new owner account
        const user = await Owner.create({
            firstName,
            lastName,
            email, 
            password: hashedPassword, 
            confirmPassword: hashedPassword,
        })

        return res.json(user);
        

    } catch (error) {
        console.log(error);
    }
}

//registering users who are agents
const registerAgent = async (req, res) => {
    //extract agent details from the request object
    const {firstName, lastName, agencyName, email, password, confirmPassword} = req.body;

    try {
        // Generate a unique agent ID
        const agentId = uuid.v4(); // Generate a random UUID

        // check password
        if( !password){
            return res.status(400).json({
                error: 'Password is required'
            })
        };

        // check confirm password
        if( confirmPassword !== password ){
            return res.status(400).json({
                error: 'Password does not match'
            })
        };

        // check user first name
        if( !firstName ){
            return res.status(400).json({
                error: 'First name is required'
            })
        };

        // check user last name
        if( !lastName ){
            return res.status(400).json({
                error: 'Last name is required'
            })
        };

        // check agency name
        if( !agencyName ){
            return res.status(400).json({
                error: 'Agency Name is required'
            })
        };

        // check email
        const exist = await Agent.findOne({email})
        if(exist){
            return res.status(400).json({
                error: 'Email already exists'
            })
        }

        // validating if the email is correct
        if(!validator.isEmail(email)){
            return res.status(400).json({
                error: 'Invalid email'
            })
        }
        //checking if password is strong or not
        if(!validator.isStrongPassword(password)){   
            return res.status(400).json({
                error: 'Password is not strong enough'
            })
        }

        //hashing the password i.e., creating extra layer of protection
        const hashedPassword = await hashPassword(password);

        //creating a new agent account
        const user = await Agent.create({
            firstName,
            lastName,
            agencyName,
            agentId,
            email, 
            password: hashedPassword, 
            confirmPassword: hashedPassword,
        })

        return res.json(user);
        
    } catch (error) {
        console.log(error);
    }
}

//login endpoin for the users
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        

        // Determine which schema to use based on the role
        const UserModel = role === 'agent' ? Agent : Owner;

        // Find the user with the provided email
        const validUser = await UserModel.findOne({ email });   
        
        if (!validUser) {
            return res.status(400).json({
                 error: 'Invalid email or password' 
            });
        }
        
        // Verify the password
        const isPasswordValid = await comparePassword(password, validUser.password); 
        
        if (!isPasswordValid) {
            return res.status(400).json({
                 error: 'Invalid password' 
            });
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        const {password: pass, confirmPassword: confirmPass, ...rest} = validUser._doc;
        res
            .status(200)
            .json({...rest, token : token });
        
    } catch (error) {
        console.log(error);
    }
}


//updating user
const updateUser = async (req, res) =>{
    const userId = req.params.id; // User ID from the URL

    // Check if the authenticated user's ID matches the requested user's ID
    if (req.user.id !== userId) {
        return res.status(400).json({ error: "You can only update your account" });
    }

    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (decodedToken.id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Determine which schema to update based on the role
        const UserModel = req.body.role === 'agent' ? Agent : Owner;

        // Update user in the database
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );

        // Omit sensitive fields from the response
        const { password, ...rest } = updatedUser._doc;

        // Send the updated user information as the response
        res.status(200).json(rest);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            console.error('Internal server error:', error); // Log the error
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

//deleting user
const deleteUser = async (req, res) => {
    const userId = req.params.id; // User ID from the URL
     
    // Check if the authenticated user's ID matches the requested user's ID
    if (req.user.id !== userId) {
        return res.status(400).json({ error: "You can only delete your account" });
    }

    try {
        // Determine which schema to update based on the role
        const UserModel = req.body.role === 'agent' ? Agent : Owner;

        // Find the user by ID and delete
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the user" });
    }
}

//logic for users to sign ou
const signOut = async (req, res) => {
    try {
        res.status(200).json('User has been logged out!');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the user" });
    }
}

const getUserListings = async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {     
            console.error(error);
            res.status(500).json({ error: "An error occurred while deleting the user" });
        }
    }   else{
            return res.status(400).json({error: 'You can only view your own listings'});
    }
}

const getUser = async (req, res) => {
    try {
        // Determine which schema to update based on the role
        const UserModel = req.body.role === 'agent' ? Agent : Owner;

        // Find the user by ID and delete
        const user = await UserModel.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
     
        // Omit sensitive fields from the response
        const { password, ...rest } = user._doc;

        // Send the updated user information as the response
        res.status(200).json(rest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while finding the user" });
    }
}

module.exports = {
    registerOwner,
    registerAgent,
    loginUser,
    updateUser,
    deleteUser,
    signOut,
    getUserListings,
    getUser,
}