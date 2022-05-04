/* LOGIQUE DE ROUTE DES SAUCES */

//IMPORTS
const express = require("express");
const saucesCtrl = require("../controllers/sauces");
const multer = require("../middlewares/multer-config");
const auth = require("../middlewares/auth");

//Création du routeur
const router = express.Router();

//Middlewares
router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likingSauce);

//EXPORT
module.exports = router;
