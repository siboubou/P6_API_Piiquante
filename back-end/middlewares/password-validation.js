const express = require('express');
const passwordValidator = require('password-validator');

const schemaPassword = new passwordValidator();

schemaPassword
.is().max(100, 'le mot-de-passe ne peut pas contenir plus de 100 caractères')                                  
.is().min(8, 'le mot-de-passe ne peut pas contenir moins de 8 caractères')                                   
.has().uppercase(1, 'le mot-de-passe doit contenir au moins une majuscule')                              
.has().lowercase(1, 'le mot-de-passe doit contenir au moins une minuscule')                               
.has().digits(2, 'le mot-de-passe doit contenir au moins deux chiffres')                               
.has().not().spaces()

//Vérification du password

module.exports = (req, res, next) => {
    if(schemaPassword.validate(req.body.password)){
        next();
    }else{
        console.log(schemaPassword.validate(req.body.password, { details: true }));
        console.log(typeof schemaPassword.validate(req.body.password, { details: true }));

        return res.status(400).json({error : "Le mot-de-passe n'est pas assez fort :" + `${schemaPassword.validate(req.body.password, {details : true})}`});
    }
}
