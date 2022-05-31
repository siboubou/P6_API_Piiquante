//IMPORT
const mongoose = require("mongoose");
const validator = require("validator");

/* MODÈLE DE SAUCE */
const sauceModel = mongoose.Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[\w ]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Sauce name!  Only alphanumeric characters authorized`,
    },
    required: true,
  },
  manufacturer: { type: String,  validate: {
      validator: function (v) {
        return /^[\w ]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Sauce Manufacturer! Only alphanumeric characters authorized`,
    },
     required: true },
  description: { type: String,  validate: {
      validator: function (v) {
        return /^[\w\.Ççéû,!? ]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Sauce description!`,
    },
     required: true },
  mainPepper: { type: String,  validate: {
      validator: function (v) {
        return /^[\w ]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Sauce mainPepper! Only alphanumeric characters authorized`,
    },
     required: true },
  imageUrl: { type: String, required: true },
  previousImageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
});

//EXPORT
module.exports = mongoose.model("Sauce", sauceModel);
