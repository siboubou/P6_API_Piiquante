//IMPORT
const jwt = require("jsonwebtoken");
require("dotenv").config();

/** EXPORT middleware
 * Cible headers athorization
 * * split et select [1]
 * * * [0] = Bearer et [1] = Token
 * Cible userId du token décodé
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
    res.status(401).json({ error: error | "request unauthorized" });
  }
};
