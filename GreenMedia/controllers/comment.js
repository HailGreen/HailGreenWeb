let Comment = require('../models/comment');


/**
 * Insert one comment of the story
 * @param req
 * @param res
 */
exports.insertComment = function (req, res) {
    let user_id = req.body.user_id;
    let story_id = req.body.story_id;
    let user_name = req.body.user_name;
    // The comment's text
    let text = req.body.text;
    try {
        // The structure of the comment
        let comment = new Comment({
            user_id: user_id,
            story_id: story_id,
            user_name: user_name,
            text: text
        });
        comment.save(function (err, results) {
            if (err)
                res.status(500).send('Cannot save this comment!');
            res.setHeader('Content-Type', 'application/json');
            res.send({"code": 0, "msg": "success"});

        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

/**
 * Get comments of the story
 * @param req
 * @param res
 */
exports.getComments = function (req, res) {
    let story_id = req.body.story_id;
    try {
        Comment.find({story_id: story_id},
            function (err, reviews) {
                if (err)
                    res.status(500).send('Cannot obtain the comments!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(reviews));
            });
    } catch (e) {
        res.status(500).send('error '+ e);
    }
};
