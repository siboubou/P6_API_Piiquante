const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({error}))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;

    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes: 0,
        usersliked :[],
        usersdisliked:[]
    });

    sauce.save()
    .then(()=> res.status(201).json({message : 'Sauce created successfully'}))
    .catch((error) => res.status(400).json({error}))

}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceModified = req.file ? // on vérifie s'il y une image dans la nouvelle requête image modifié ou pas
    {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }

    Sauce.updateOne({_id: req.params.id}, { ...sauceModified, _id: req.params.id})
    .then(() => res.status(201).json({message :" Sauce modified !"}))
    .catch((error) => res.status(400).json({error}))
}

const fs = require('fs');

exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({_id : req.params.id})
    .then( (sauce) => {
        if(!sauce){
            res.status(404).json({error : 'Sauce not found'})
        }
        if(sauce.userId !== req.auth.userId){
            res.status(401).json({error: 'Unauthorized request!'})
        }

        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { // fichier à supprimer + callback qui est notre logique delet
            Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: "Sauce deleted !" }))
            .catch((error) => res.status(400).json({ error }));
        })        
    })
    .catch(error => res.status(500).json({error}))
}

/*exports.likingSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    console.log(req.body)

    //Sauce.findOne(_id : req.params.id)
}*/