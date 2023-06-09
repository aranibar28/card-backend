const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const { tempUpload } = require('../middlewares/cloudinary');
const ctrl = require('../controllers/uploads');
const router = Router();

router.post('/upload_image/:type/:id', [validateJWT, tempUpload], ctrl.upload_image);

module.exports = router;
