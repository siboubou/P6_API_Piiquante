//IMPORTS
const express = require("express");
const mongoose = require("mongoose"); // Base de donnée
const path = require("path"); // Accès aux chemins du système de fichier
require("dotenv").config(); // Protection des données sensibles
const helmet = require("helmet"); //Sécurisation des requêtes - modifie headers
const rateLimit = require("express-rate-limit"); // Configuration du nombre de requêtes autorisées dans un laps de temps définiconst mongoSanitize = require('express-mongo-sanitize')// Remove $ sign

//Routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauces");

// Création de notre app express
const app = express();

/*----------- Configuration MongoDB -----------*/
mongoose
  .connect(
    "mongodb+srv://sibylle:" +
      process.env.MongoDB_Pw +
      "@cluster0.munzp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/*----------- Configuration CORS ---------- */
//Autorise requêtes venant de l'origine localhost:4200
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// ---------------- SÉCURITÉ --------------------------

/* --------- Configuration du Rate-Limiter --------- */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque adress IP à 100 requête par `window` (15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); //Applique le Rate-Limit à toutes les requêtes

/* ----------- Configuration Helmet -------------- */
//Diminue vulnérabilités d'Express en sécurisant les en-têtes http

app.use(helmet({
  crossOriginResourcePolicy: false, // sinon image ne peuvent pas être téléchargées
}));


//--------------------------------------------------------


//Chemin statique vers le répertoire images
app.use("/images", express.static(path.join(__dirname, "images")));

//Parse les requêtes JSON entrantes et les met dans req.body
app.use(express.json());

// Routes utilisées
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//EXPORT
module.exports = app;
