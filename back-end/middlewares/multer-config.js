/* IMPLÉMENTATION TÉLÉCHARGEMENT DE FICHIER */
//Enregistrement des fichiers sur le serveur

//IMPORT
const multer = require("multer");

//Filtre fichiers autorisés
const MYME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/* Création d'un objet de configuration multer
 * Fixe le dossier de destination
 * Fixe le nom du fichier
 ** Si le nom du fichier envoyé contient des espaces ils sont remplacés par underscore
 */
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    const extension = MYME_TYPES[file.mimetype];
    const filename = file.originalname.split(" ").join("_");
    cb(null, filename + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: fileStorageEngine });

// EXPORT
//Un unique fichier envoyé
//'image' = nom du champ que multer doit chercher dans la requête entrante
module.exports = upload.single("image");
