const express = require('express');
const pagesController = require('../controllers/pagesController');
const router = express.Router();

router.get('/', pagesController.showIndex);

module.exports = router;
