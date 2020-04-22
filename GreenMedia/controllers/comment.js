let Comment = require('../models/comment');


exports.insert = function (req, res) {
    let user_id = req.body.user_id;
    let story_id = req.body.story_id;
    let text = req.body.text;
    try {
        let comment = new Comment({
            user_id: user_id,
            story_id: story_id,
            text: text
        });
        comment.save(function (err, results) {

            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send({"code": 0, "msg": "success"});

        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getComments = function (req, res) {
    let story_id = req.body.story_id;
    try {
        Comment.find({story_id: story_id},
            function (err, reviews) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(reviews));
            });
    } catch (e) {
        res.status(500).send('error '+ e);
    }
}
