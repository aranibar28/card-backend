const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const ctrl = require('../controllers/payment');
const router = Router();

router.post('/create_payment', [validateJWT], ctrl.create_payment);

module.exports = router;
