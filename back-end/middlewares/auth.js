//IMPORT
const jwt = require("jsonwebtoken");
require("dotenv").config();

/** -----  middleware d'AUTHENTIFICATION -----
 * Cible headers authorization
 * [0] = Bearer et [1] = Token
 * récupère le token : Split et select [1]
 * Décode le token @package jwt @method verify
 * Cible userId du token décodé
 * Ajoute l'objet auth à l'objet de requête
 * Authentification réussie si userId de la requête est le même que celui du token
 */

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.Token_Key);
    const userId = decodedToken.userId;

    req.auth = { userId: userId };

    if (req.body.userId && req.body.userId !== userId) {
      throw "Unvalid User";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Request non authenticated" });
  }
};
