var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'public/images/uploads/'})
var router = express.Router();
var story = require('../controllers/story');
var index = require('../controllers/index');
var comment = require('../controllers/comment');
var star = require('../controllers/star');
var Ranking = require('../CollectiveIntelligence/Ranking');
var InitData=require('../CollectiveIntelligence/data-process')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* get comments */
router.post('/get-comments', comment.getComments);

/* post function */
/* get the user */
router.post('/get-user', index.getUser);

router.post('/get-user-id', index.getUserById);

/* get user list */
router.get('/get-user-list', index.getUserList);

/* send words & pics */
router.post('/release-story', upload.array('files', 3), story.insertStory);

/* get stories */
router.post('/show-story', story.getStories);

/* personal wall */
router.post('/show-personal-wall', story.getUserStories);

/* insert comment */
router.post('/insert-comment', comment.insertComment);

/* get like rate */
router.post('/get-star', star.getStar);

/* get one story's starts */
router.post('/get-story-stars', star.getStoryStars);

/* get all stars dic for recommendation */
router.post('/get-stars', star.getStars);

/* get stories by recommended order */
router.post('/get-recommendations', function (req, res, next) {
    let users = JSON.parse(req.body.users);
    let user_id = req.body.user_id;
    let ranking = new Ranking();
    let results = ranking.getRecommendations(users, user_id, 'sim_pearson');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
});

/* update like rate stars */
router.put('/update-star', star.updateStar);

/*init database*/
router.post('/init-data',upload.single('initFile'),function (req,res,next) {
    let file=req.file;
    let initMethod = new InitData();
    // console.log(file);
    let results= initMethod.readFiles(file.path);
    res.send(JSON.stringify("ok"));
});

module.exports = router;
