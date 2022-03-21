const express = require('express');
const router = express.Router();

// Controller 
const controller = require('../controllers/motel.controller')

router.get('/detail/:id', controller.getMotelDetail)

module.exports = router