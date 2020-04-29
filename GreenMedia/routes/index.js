var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'public/images/uploads/'})
var router = express.Router();
var release = require('../controllers/release');
var index = require('../controllers/index');
var comment = require('../controllers/comment');
var star = require('../controllers/star');
var Ranking = require('../CollectiveIntelligence/Ranking');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* post function */

/* get the user */
router.post('/get_user', index.getUser);

/* get user list */
router.get('/get_user_list', index.getUserList);

/* get comments */
router.post('/get-comments', comment.getComments);

/* send words & pics */
router.post('/release-moments', upload.array('files', 3), release.insert);

/* get stories */
router.post('/show-story', release.getStories);

/* get stories */
router.post('/add-comment', comment.insert);

/* get like rate star */
router.post('/get-star', star.getStar);

/* get all stars */
router.post('/get-stars', star.getStars);

/* get stories by recommendation order */
router.post('/get-recommendations', function (req, res, next) {
    let users = JSON.parse(req.body.users);
    let user_id = req.body.user_id;
    let ranking = new Ranking();
    let results = ranking.getRecommendations(users, user_id, 'sim_pearson');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
});

/* put function */

/* update like rate star */
router.put('/update-star', star.updateStar);

module.exports = router;