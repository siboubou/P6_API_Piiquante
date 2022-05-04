//----------- LOGIQUE MÉTIER POUR LES SAUCES ----------

//IMPORTS
const Sauce = require("../models/sauce");
const fs = require("fs"); // Donne accès au système de fichiers

/**RÉCUPÉRATION des sauces
 */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/** CRÉATION d'une sauce
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
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

/** RÉCUPÉRATION d'une sauce
 */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({ error: error + "This Sauce does not exist" })
    );
};

/** MODIFICATION d'une sauce
 * Vérifie que l'utilisateur qui a créé la sauce et le même que celui authentifié
 * Vérifie s'il y une image dans la nouvelle requête (image modifiée ou pas)
 ** Si oui, on récupère un form-data avec deux clés (sauce et image)
 ** donc on parse req.body.sauce et on y ajoute le champs imageUrl en générant la nouvelle image
 ** Si non, on recupère le corps de la requête tel quel
 */
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "This Sauce does not exist" });
      }

      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized Request!" });
      }

      const sauceModified = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : {
            ...req.body,
          };

      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceModified, _id: req.params.id }
      )

        .then(() => res.status(201).json({ message: " Sauce modified !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/** SUPRESSION d'une sauce
 * Vérifie que l'utilisateur qui a créé la sauce et le même que celui authentifié
 * Supprime le fichier image de notre serveur
 * Supprime la sauce de la base de données
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "This Sauce does not exist" });
      }

      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized Request!" });
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

/** GESTION DU SYSTÈME DE LIKES
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
