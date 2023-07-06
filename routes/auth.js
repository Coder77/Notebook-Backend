const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "AapkaHardikSwagatHai"
const fetchUser = require('../middleware/fetchUser')

// Create a User using: POST "/api/auth/createUser" . Doesn't require Auth
router.post('/createUser',[
    body('name','Name of min. length 3 is required').isLength({min: 1}),
    body('email','valid email isRequired').isEmail(),
    body('password','Password cannot be blank').isLength({min: 5})
],
async (req,res)=>{

    let success=false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success: success, error: errors.array()});
    }

    try {
        let user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(400).json({success: success, error: "Email already Registered" })
        }
        const salt = await bcrypt.genSalt(10);
        const SecuredPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: SecuredPass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success: success,authToken: authToken});
    }catch (error) {
        console.error(error);
        res.status(500).json({success: success, error:"Internal Server Error occured"});
    }
   
})


// Authenticate a User using: POST "/api/auth/login"  
router.post('/login',[
    body('email','valid email isRequired').isEmail(),
    body('password','Password of minimum length 5 is required').isLength({min: 5})
],
async (req,res)=>{
    const errors = validationResult(req);
    let success=false;
    if(!errors.isEmpty()){
        return res.status(400).json({success: success, errors: errors.array()});
    }

    const {email,password} = req.body;  // Destructuring in JS
    try{
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({success: success, error: "Invalid Credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare) {
            return res.status(400).json({success: success, error: "Invalid Credentials"});
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({success: success, authToken: authToken});
    }catch(error) {
        console.error(error);
        res.status(500).json({success: success, message: "Internal Server error occured"});
    }
});

// Get LoggedIn User Details using: POST "/api/auth/getuser"  LogIn Required
router.post('/getuser', fetchUser, async (req,res)=>{
    try {
        let userId= req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error occured");
    }
});

module.exports = router;