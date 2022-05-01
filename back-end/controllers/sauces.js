//imports
const Sauce = require('../models/sauce');
const fs = require('fs');

//
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

exports.likingSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId

    console.log(req.body)  

    if (like === 1){
        Sauce.updateOne(
            {_id: req.params.id},  
            {$inc : {likes : +1}},
            {$push: {usersLiked : userId}} 
        )
        .then(()=> res.status(201).json({message : `User ${userId} likes the sauce`}))
        .catch((error) => res.status(400).json({error}))
    }

    if (like === -1){
        Sauce.updateOne(
            {_id: req.params.id},  
            {$inc : {dislikes : +1}},
            {$push: {usersDisliked : userId}} 
        )
        .then(()=> res.status(201).json({message : `User ${userId} dislikes the sauce`}))
        .catch((error) => res.status(400).json({error}))
        
    }

    if(like === 0){
        Sauce.findOne({_id : req.params.id})
        .then((sauce) => {
            if (sauce.usersliked.includes(userId)){
                Sauce.updateOne(
                    {_id: req.params.id},  
                    {$inc : {likes : -1}},
                    {$pull: {usersLiked : userId}} 
                )
                .then(()=> res.status(201).json({message : `User ${userId} has deleted his like`}))
                .catch((error) => res.status(400).json({error}))
            }
            if(sauce.usersDisliked.includes(userId)){
                Sauce.updateOne(
                    {_id: req.params.id},  
                    {$inc : {dislikes : -1}},
                    {$pull: {usersDisliked : userId}} 
                )
                .then(()=> res.status(201).json({message : `User ${userId} has deleted his dislike`}))
                .catch((error) => res.status(400).json({error}))
            }
        })      
        .catch((error) => res.status(400).json({error}))

    }
}