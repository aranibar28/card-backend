const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const { tempUpload } = require('../middlewares/cloudinary');
const ctrl = require('../controllers/product');
const router = Router();

//[ http://localhost:3000/api/products ]
router.post('/create_product', [validateJWT, tempUpload], ctrl.create_product);
router.get('/search_products', ctrl.search_products);
router.get('/read_products', ctrl.read_products);
router.get('/read_product_by_id/:id', [validateJWT], ctrl.read_product_by_id);
router.get('/read_products_by_category/:id', ctrl.read_products_by_category);
router.put('/update_product/:id', [validateJWT, tempUpload], ctrl.update_product);
router.delete('/delete_product/:id', [validateJWT], ctrl.delete_product);

module.exports = router;
