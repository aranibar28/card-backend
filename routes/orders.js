const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const ctrl = require('../controllers/order');
const router = Router();

router.get('/read_orders', [validateJWT], ctrl.read_orders);

module.exports = router;
