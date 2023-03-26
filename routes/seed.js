const { Router } = require("express");
const ctrl = require("../controllers/seed");
const router = Router();

//[ http://localhost:3000/api/seed ]
router.get("/", ctrl.seed_data);

module.exports = router;
