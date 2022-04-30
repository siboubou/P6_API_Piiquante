const jwt = require ('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token , 'KHta8wj_JRGOZzYV_fEilmCgTAnc6r_ZoZLF3dcGOLOS_i65mcpY2g');
        const userId = decodedToken.userId;

    //req.auth ={userId : userID};    
        if (req.body.userId && req.body.userId !== userId){
            throw 'Unvalid User'
        } else {
            next();
        }

    } catch (error) {
        res.status(401).json({error : error | 'request unauthorized' })

    }

}