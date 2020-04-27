var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'public/images/uploads/'})
var router = express.Router();
var release = require('../controllers/release');
var index = require('../controllers/index');
var comment = require('../controllers/comment');
var star = require('../controllers/star');
var bodyParser = require("body-parser");
var Ranking= require('../CollectiveIntelligence/Ranking');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/get-comments', comment.getComments);

/*post function*/

/*get the user*/
router.post('/get_user',index.getUser);

router.get('/get_user_list',index.getUserList);

/*send words & pics*/
router.post('/release-moments', upload.array('files', 3), release.insert);

/*get stories*/
router.post('/show-story', release.getStories);

/*get stories*/
router.post('/add-comment', comment.insert);

router.post('/get-star', star.getStar);

router.post('/get-stars', star.getStars);

router.put('/update-star', star.updateStar);

router.post('/get-recommendations', function (req, res, next) {
    let users = req.body.users;
    let user_id = req.body.user_id;
    let ranking= new Ranking();
    let results = ranking.getRecommendations(users, user_id, 'sim_pearson');
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify(results));
    res.send(JSON.stringify("yes"));
    console.log(JSON.stringify(results))
});

module.exports = router;
