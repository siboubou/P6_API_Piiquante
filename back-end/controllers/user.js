//----------- LOGIQUE MÉTIER POUR LES UTILISATEURS ----------

//IMPORTS
const User = require("../models/user");
const bcrypt = require("bcrypt"); //hash + salt le mot-de-passe
const jwToken = require("jsonwebtoken"); //crée token de session
const crypto = require("crypto-js"); //crypte le mail
require("dotenv").config();

//CONSTANTES
const saltRounds = 10;

/** INSCRIPTION
 * Utilisateur enregistré dans la base de donées avec un
 * Email crypté
 * Un mot-de-passe hashé
 */
exports.signup = (req, res, next) => {
  const emailCrypted = crypto
    .HmacSHA3(req.body.email, `${process.env.Crypto_Key}`, {
      outputLength: 256,
    })
    .toString();

  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      const user = new User({
        email: emailCrypted,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "User created successfully !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error }));
};

/** CONNEXION
 * On crypte l'email pour vérifier que ce crypte existe dans la base de données
 * On compare le mot de passe hashé de l'utilisateur trouvé avec le mot-de-passe de la requête
 */
exports.login = (req, res, next) => {
  const emailCrypted = crypto
    .HmacSHA3(req.body.email, `${process.env.Crypto_Key}`, {
      outputLength: 256,
    })
    .toString();

  User.findOne({ email: emailCrypted })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User unfind" });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((validPassword) => {
          //promise return boolean
          if (!validPassword) {
            return res.status(401).json({ error: " Password unvalid" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwToken.sign({ userId: user._id }, process.env.Token_Key, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) =>
          res.status(500).json({ error: "PBM after bcryptCompare" })
        );
    })
    .catch((error) => res.status(500).json({ error: "PBM" }));
};
