const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

const multer = require ('../middlewares/multer-config');
const auth = require('../middlewares/auth')

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id', saucesCtrl.likingSauce)


module.exports = router;