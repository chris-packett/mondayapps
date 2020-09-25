const express = require('express');
const router = express.Router();

const typeformController = require('../controllers/typeformController.js');
const { authenticationMiddleware } = require('../middlewares/authentication');

router.post('/typeform/upsert', authenticationMiddleware, typeformController.upsertDynamicTypeform);

module.exports = router;
