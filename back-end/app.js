const express = require("express"); // on importe express

const app = express(); // on crée notre application express en appelant la méthode express
const mongoose = require("mongoose");
const path = require('path') 


mongoose
  .connect(
    "mongodb+srv://sibylle:P0dGqUiJACcxAE9A@cluster0.munzp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  //CORS
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //pour tous serveur
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

 app.use(express.json());
 app.use('/images', express.static(path.join(__dirname, 'images')));

  const userRoutes = require('./routes/user');  
  app.use('/api/auth', userRoutes);

  const sauceRoutes = require('./routes/sauces');
  app.use('/api/sauces', sauceRoutes)
  

  module.exports = app; //on exporte notre app pour pouvoir l'utiliser dans nos autres fichiers (node)