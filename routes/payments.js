const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const ctrl = require('../controllers/payment');
const router = Router();

router.post('/create_payment', [validateJWT], ctrl.create_payment);
router.get('/read_payments', [validateJWT], ctrl.read_payments);
router.get('/read_payment_details/:id', [validateJWT], ctrl.read_payment_details);
router.put('/close_payment/:id', ctrl.close_payment);

module.exports = router;
