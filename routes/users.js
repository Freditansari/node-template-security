const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const keys = require('../configs/mongo-db');
const passport = require('passport');

const User = require('../Schemas/User');

var cookieParser = require('cookie-parser')



// route get /api/users/check 
router.get('/check',(req, res)=>{
    res.send('Hello World!')
})


//todo register user route 
//@route POST /api/users/register
//@desc Register user
//@access Public 

router.post('/register', (req, res)=>{
    User
    .findOne({email : req.body.email})
    .then(user =>{
        //check email is exist or not
        if(user){
            return res.status(500).json('Email already exist');
        }else{
            const newUser = new User({
                name : req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10 , (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if (err) throw err;
                    newUser.password=hash;
                    newUser.save().then(user => res.json(user)).catch(err => console.log(err))
                })
            })


        }


    })
})

//todo login 
//@route POST /api/users/login 
// @desc Login user
// @access public 

router.post('/login', (req,res)=>{
    const {email, password} = req.body;

    User
    .findOne({email})
    .then(user =>{
        if (!user) {
            return res.status(404).json('User Not Found!');            
        }

        bcrypt.compare(password, user.password).then(isMatch =>{
            if (isMatch) {
                const payload ={id : user.id, name : user.name};

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: 3600},
                    (err, token)=>{
                        res
                        .cookie(
                            'login-token','Bearer '+ token, {maxAge:3600000}
                        )
                        .json({
                            success: true, 
                            token : 'Bearer '+ token
                        })
                        
                    }
                )


                // res.cookie('login-token', JSON.stringify(signedToken).toString()).send(JSON.stringify(signedToken).toString())
              
                
            }else{
                res.status(404).json('Incorrect password')
            }
        })
    })
})


router.get('/login-test', (req,res)=>{
    const email = "banana@gmail.com"
    const password = "supersecretpassword"
    User
    .findOne({email})
    .then(user =>{
        if (!user) {
            return res.status(404).json('User Not Found!');            
        }

        bcrypt.compare(password, user.password).then(isMatch =>{
            if (isMatch) {
                const payload ={id : user.id, name : user.name};

                //signature in seconds
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: 3600},
                    (err, token)=>{
                        res
                        .cookie(
                            'login-token','Bearer '+ token, {maxAge:3600} //in ms
                        )
                        .json({
                            success: true, 
                            token : 'Bearer '+ token
                        })
                        
                    }
                )


                // res.cookie('login-token', JSON.stringify(signedToken).toString()).send(JSON.stringify(signedToken).toString())
              
                
            }else{
                res.status(404).json('Incorrect password')
            }
        })
    })
})

module.exports=router;