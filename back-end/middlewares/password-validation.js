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
  .not(/[='$<>{}].*/, "No vulnerable characters") //contre injections

/** ---- Middleware de Vérification du mot-de-passe
 * @method validate vérifie que @param req.body.password remplisse les critères de @constant schemaPassword
 */
module.exports = (req, res, next) => {
  if (schemaPassword.validate(req.body.password)) {
    next();
  } else {

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
