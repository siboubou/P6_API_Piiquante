/* IMPLÉMENTATION SÉCURITÉ CRÉATION MOT-DE-PASSE */

//IMPORTS
const express = require("express");
const passwordValidator = require("password-validator");

// Schema de mot-de-passe autorisé
const schemaPassword = new passwordValidator();


schemaPassword
  .is().max(100, "Maximum lenght 100 ")
  .is().min(8, "Minimum lenght 8")
  .has().uppercase(1, "At least One Uppercase")
  .has().lowercase(1, "At least One Lowercase")
  .has().digits(2, "At least Two numbers")
  .has().not().spaces()
  //.has().not().symbols()
  .not(/['$<>{}].*/, "No vulnerable characters")

//Middleware de Vérification du mot-de-passe
module.exports = (req, res, next) => {
  if (schemaPassword.validate(req.body.password)) {
    next();
  } else {
    console.log(schemaPassword.validate(
      req.body.password,
      { details: true }
    ))
    console.log(schemaPassword.validate(
      req.body.password,
      { list: true }
    ))
    return res
      .status(400)
      .json({
        error:
          "Le mot-de-passe n'est pas assez fort :" +
          `${JSON.stringify(
            schemaPassword.validate(
              req.body.password,
              { details: true }
            )
          )}`,
      });
  }
};
