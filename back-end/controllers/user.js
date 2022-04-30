const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwToken = require('jsonwebtoken');
const user = require('../models/user');


const saltRounds = 10;

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds)
    .then( hash => {
        const user = new User ({
            email : req.body.email,
            password : hash
        });
        user.save()
        .then( () => res.status(201).json ({message : 'User created successfully !'}))
        .catch( (error) => res.status(400).json({error}))
    })
    .catch((error) => res.status(500).json({error : error}));
}


exports.login = (req, res, next) => {
    User.findOne({email : req.body.email})
    .then( user => {
        if(!user){
            return res.status(401).json({error : 'User unfind'});
        }
    
     bcrypt.compare(req.body.password, user.password)
        .then(valid => { //promise = boolean
            if(!valid){
                return res.status(401).json({error :" Password unvalid"})
            }
            res.status(200).json({
                userId : user._id,
                token : jwToken.sign(
                    {userId: user._id},
                    'KHta8wj_JRGOZzYV_fEilmCgTAnc6r_ZoZLF3dcGOLOS_i65mcpY2g',
                    {expiresIn :'24h'}
                )    
            });
        })
        .catch(error => res.status(500).json({ error }));
    })    
    .catch(error => res.status(500).json({ error }));
};