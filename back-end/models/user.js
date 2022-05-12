//IMPORTS
const mongoose = require ('mongoose')
const uniqueValidator = require ('mongoose-unique-validator') 

/* MODÈLE UTILISATEUR */
const userModel = mongoose.Schema ({
  email: { type: String, match : /^[a-zA-Z0-9]+((\-|\_|\.)?([a-zA-Z0-9])+)*([\-\_\.a-zA-Z0-9])?([@]{1})((\-|\_|\.)?([a-zA-Z0-9])+)+([.]{1}[a-zA_Z]{2,20})$/, required: true, unique: true }, 
  password: { type: String, required: true }
});

//Assure unicité d'un email dans la base de données 
// + signale erreurs
userModel.plugin(uniqueValidator); 

//EXPORT
module.exports = mongoose.model('User', userModel)