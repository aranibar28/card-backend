const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const ctrl = require('../controllers/user');
const router = Router();

router.get('/search_users', [validateJWT], ctrl.search_users);
router.get('/read_users', [validateJWT], ctrl.read_users);
router.get('/read_user_by_id/:id', [validateJWT], ctrl.read_user_by_id);
router.post('/create_user', [validateJWT], ctrl.create_user);
router.put('/update_user/:id', [validateJWT], ctrl.update_user);
router.delete('/delete_user/:id', [validateJWT], ctrl.delete_user);

module.exports = router;
