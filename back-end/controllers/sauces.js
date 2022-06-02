//----------- LOGIQUE MÉTIER POUR LES SAUCES ----------

//IMPORTS
const Sauce = require("../models/sauce");
const fs = require("fs"); // Donne accès au système de fichiers

/** ------- RÉCUPÉRATION des sauces -------
 * @method find
 */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/** ------- CRÉATION d'une sauce -------
 * On récupère les données du formulaire en format JSON @param req.body.sauce
 * On supprime l'id renvoyé par le front end de cet objet
 * On crée une nouvelle instance @constant sauce de la table sauces
 * le @field imageUrl est construit à partir de @param req.file.filename qui ne contient que filename
 * les @field qui ne font pas parties du formulaire (likes…) sont ajoutés
 * On enregistre dans la bdd @method save
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    previousImageUrl : `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce created successfully" }))
    .catch((error) => res.status(400).json({ error }));
};

/**  ------- RÉCUPÉRATION d'une sauce -------
 * @method findOne
 */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({ error: error + "This Sauce does not exist" })
    );
};

/**  ------- MODIFICATION d'une sauce -------
 * @method findOne vérifie que la sauce à modifier existe
 * On vérifie que l'utilisateur qui a créé la sauce est le même que celui authentifié
 * On vérifie s'il y a une image dans la nouvelle requête
 ** Si oui, on récupère un form-data avec deux clés (sauce et image)
 ** donc on parse req.body.sauce et on y ajoute le champs imageUrl en générant la nouvelle image
 ** Si non, on recupère le corps de la requête tel quel
 * @method updateOne modifie la sauce
 */
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "This Sauce does not exist" });
      };

      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: "This User can't modify this sauce" });
      };

      const sauceModified = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
            previousImageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }` 
          }
        : {
            ...req.body,
          };

// Si l'image est modifié on supprime l'anncienne
        const previousimg = sauce.previousImageUrl.split("/images/")[1];
        if (req.file){
          fs.unlink(`images/${previousimg}`, (err => {
            if (err) console.log(err);
            else {
              console.log("previous img deleted");
            }
          }));
        } 
        
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceModified, _id: req.params.id },
            {runValidators : true}
          )
    
            .then(() => res.status(201).json({ message: " Sauce modified !" }))
            .catch((error) => res.status(400).json({ error }));
        
         
        
      })    
     
    .catch((error) => res.status(500).json({ error }));
};

/**  ------- SUPRESSION d'une sauce -------
 * @method findOne vérifie que la sauce à supprimer existe
 * On vérifie que l'utilisateur qui a créé la sauce est le même que celui authentifié
 * @module fs @method unlink supprime le fichier image de notre serveur
 * @method deleteOne supprime la sauce de la bdd
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "This Sauce does not exist" });
      }

      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: "This user is not allowed to delete this sauce!" });
      }

      const filename = sauce.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        // callback = notre logique delete
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce deleted !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/** ------- GESTION DU SYSTÈME DE LIKES ------- 
* @param req.body.like prend trois valeurs renvoyées par le front
* en fonction de cette valeur @method updateOne on modifie l'objet sauce

** 1 Si click like 
* L'opérateur $inc de Mongodb incrémente le @field likes dans la bdd
* L'opérateur $push ajoute @var userId au @field userLiked 

** -1 Si clik dislike 
* L'opérateur $inc de Mongodb incrémente le @field dislikes dans la bdd
* L'opérateur $push ajoute @var userId au @field userDisliked

** 0 Si retire like ou dislike 
*  @method findOne on retrouve la sauce dont l'id est en paramètre
* si son @field usersLiked contient notre userId
* L'opérateur $inc de Mongodb décrémente le @field likes 
* L'opérateur $pull retire @var userId du @field userLiked
* si son @field usersDisliked contient notre userId
* L'opérateur $inc de Mongodb décrémente le @field dislikes 
* L'opérateur $pull retire @var userId du @field userDisliked
*/

exports.likingSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;

  console.log(req.body);

  if (like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: userId } }
    )
      .then(() =>
        res.status(201).json({ message: `User ${userId} likes the sauce` })
      )
      .catch((error) => res.status(400).json({ error }));
  }

  if (like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } }
    )
      .then(() =>
        res.status(201).json({ message: `User ${userId} dislikes the sauce` })
      )
      .catch((error) => res.status(400).json({ error }));
  }

  if (like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 } },
            { $pull: { usersLiked: userId } }
          )
            .then(() =>
              res
                .status(201)
                .json({ message: `User ${userId} has deleted his like` })
            )
            .catch((error) => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { dislikes: -1 } },
            { $pull: { usersDisliked: userId } }
          )
            .then(() =>
              res
                .status(201)
                .json({ message: `User ${userId} has deleted his dislike` })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
