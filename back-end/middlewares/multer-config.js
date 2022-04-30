const multer = require('multer');

const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images");  
    },
    filename : (req, file,cb) =>{
        console.log(file.mimetype)
        const filename =  file.originalname.split(' ').join('_');
        cb(null, Date.now() + "." + filename);
    }
    
})

const upload = multer({storage : storageEngine})

module.exports = upload.single('image')