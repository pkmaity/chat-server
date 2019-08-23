const router = require('express').Router();
const mongoose = require('mongoose');
      mongoose.set('useCreateIndex', true);

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database');

let model = db.model('usersauths', mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
}));


router.post('/', async (req, res, next) => {

    var userDetails = await model.find({ username: req.body.username }).lean();
    
    if(!!userDetails[0]){

        bcrypt.compare(`${req.body.password}`, `${userDetails[0].password}`, function(err, result) {
            //If login succeed then send the tocken
            if(!!result){
                delete userDetails[0]._id;
                delete userDetails[0].password;
                res.json({token: jwt.sign(userDetails[0], 'secret', { expiresIn: 60 * 60 })});
            }
            else{
                res.json({msg: "Wrong Password"});
            }
        });

    }
    else{
        res.json({msg: "Wrong Username"});
    }

});

module.exports = router;