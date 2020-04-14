var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var router = express.Router();
var release = require('../controllers/release');
var index=require('../controllers/index');
var bodyParser = require("body-parser");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/head', function (req, res, next) {
    res.render('head', {});
})


router.get('/release', function (req, res, next) {
    res.render('release', {});
});


router.get('/show-story', function (req, res, next) {
    res.render('show-story', {});
})






/*post function*/


/*get the user*/
router.post('/get_user',index.getUser);


/*send words & pics*/
router.post('/release', upload.array('files', 3), release.insert);


module.exports = router;
