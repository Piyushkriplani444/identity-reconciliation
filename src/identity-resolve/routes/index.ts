const express = require('express');
const identityController = require('../controllers/identityController');

const router = express.Router();

router.post('/identify', identityController.generateIdentity);

module.exports = router;
