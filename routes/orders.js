const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const ctrl = require('../controllers/order');
const router = Router();

router.post('/create_order', ctrl.create_order);
router.get('/read_orders', ctrl.read_orders);
router.get('/read_orders_by_table/:table', ctrl.read_orders_by_table);
router.get('/read_orders_by_number/:number', ctrl.read_orders_by_number);
router.put('/update_order/:id', [validateJWT], ctrl.update_order);

module.exports = router;
