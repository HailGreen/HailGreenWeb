var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'public/images/uploads/'})
var router = express.Router();
var release = require('../controllers/release');
var index = require('../controllers/index');
var comment = require('../controllers/comment');
var star = require('../controllers/star');
var bodyParser = require("body-parser");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/get-comments', comment.getComments);

/*post function*/

/*get the user*/
router.post('/get_user',index.getUser);

/*send words & pics*/
router.post('/release-moments', upload.array('files', 3), release.insert);

/*get stories*/
router.post('/show-story', release.getStories);

/*get stories*/
router.post('/add-comment', comment.insert);

router.post('/get-star', star.getStar);

router.post('/get-stars', star.getStars);

router.put('/update-star', star.updateStar);

module.exports = router;
