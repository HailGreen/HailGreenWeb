var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var router = express.Router();
var release = require('../controllers/release');
var bodyParser= require("body-parser");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/', upload.array('files', 3), release.insert);


module.exports = router;
