const { Router } = require('express');
const { validateJWT } = require('../middlewares/authenticated');
const ctrl = require('../controllers/table');
const router = Router();

router.post('/create_table', [validateJWT], ctrl.create_table);
router.get('/read_tables', [validateJWT], ctrl.read_tables);
router.get('/read_table_by_number/:id', ctrl.read_table_by_number);
router.put('/update_table/:id', [validateJWT], ctrl.update_table);
router.delete('/delete_table/:id', [validateJWT], ctrl.delete_table);

module.exports = router;
