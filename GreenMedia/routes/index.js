var express = require('express');
var multer = require('multer')
var upload = multer({dest: 'public/images/uploads/'})
var router = express.Router();
var story = require('../controllers/story');
var index = require('../controllers/index');
var comment = require('../controllers/comment');
var star = require('../controllers/star');
var InitData = require('../CollectiveIntelligence/data-process')

/* get home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* get comments */
router.post('/get-comments', comment.getComments);

/* get the user */
router.post('/get-user', index.getUser);

/* get the user by id*/
router.post('/get-user-id', index.getUserById);

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

/* update like rate stars */
router.put('/update-star', star.updateStar);

/* init database*/
router.post('/init-data', upload.single('initFile'), function (req, res, next) {
    let file = req.file;
    let initMethod = new InitData();
    initMethod.readFiles(file.path);
    res.send(JSON.stringify("ok"));
});

/* personalwall route*/
router.get('/personalwall', function (req, res, next) {
    res.render('personalwall', {title: 'Express'});
});

module.exports = router;
