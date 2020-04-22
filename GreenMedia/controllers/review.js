let Review = require('../models/review');


exports.insert = function (req, res) {
    let user_id = req.body.user_id;
    let story_id = req.body.story_id;
    let comment = req.body.comment;
    let like = req.body.like;
    try {
        let review = new Review({
            user_id: user_id,
            story_id: story_id,
            comment: comment,
            like: like
        });
        review.save(function (err, results) {

            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send({"code": 0, "msg": "success"});

        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getReviews = function (req, res) {
    // let userData = req.body;
    // console.log(req.body)
    try {
        Review.find(
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
