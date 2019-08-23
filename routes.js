const router = require('express').Router();
const login = require('./login');
const jwt = require('jsonwebtoken');

router.use('/login', login);

//Middleware for tocken verification
router.use((req, res, next) => {
    
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret', (err, decode) => {
        if(err)
            res.send({msg: 'Session Expired'});
        else
            next(null, req.body.userDetails = decode);           
    });

});

module.exports = router;