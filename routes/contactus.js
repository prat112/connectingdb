const express =require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const productsController = require('../controllers/admin');

router.use('/contactus',productsController.getContactPage);
module.exports = router;