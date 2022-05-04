/* LOGIQUE DE ROUTE DES USERS */

//IMPORTS
const express = require('express');
const userCtrl = require('../controllers/user');
const validPassword = require('../middlewares/password-validation')

//Création du routeur
const router = express.Router();

//Middlewares
router.post('/signup',validPassword  ,userCtrl.signup);
router.post('/login', userCtrl.login)

//EXPORT
module.exports = router