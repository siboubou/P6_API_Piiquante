//IMPORT
const mongoose = require("mongoose");

/* MODÈLE DE SAUCE */
const sauceModel = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, match : /^[\w].*$/, required: true },
  manufacturer: { type: String, match : /^[\w].*$/, required: true },
  description: { type: String, match : /^[\w].*$/, required: true },
  mainPepper: { type: String, match : /^[\w].*$/, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
});

//EXPORT
module.exports = mongoose.model("Sauce", sauceModel);
