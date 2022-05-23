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

/** ------ Création d'un objet de configuration multer -----
 * @constant fileStorageEngine
 * Fixe le dossier de destination "image"
 * Fixe le nom du fichier @var filename
 ** Utilise la @constant MYME_TYPES pour résoudre l'extension de fichier
 ** Si le nom du fichier envoyé contient des espaces ils sont remplacés par underscore
 ** Ajoute un timestamp @method date.now
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
// Un unique fichier envoyé
//'image' = nom du champ que multer doit chercher dans la requête entrante
module.exports = upload.single("image");
