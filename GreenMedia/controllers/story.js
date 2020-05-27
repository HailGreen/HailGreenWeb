let Story = require('../models/story');


exports.insertStory = function (req, res) {
    let mention = req.body.mention;
    let pics = req.files;
    let id = req.body.id;
    let username = req.body.username;
    let story_id = req.body.story_id;
    try {
        let story = new Story({
            story_id: story_id,
            user_id: id,
            username: username,
            mention: mention,
            pics: pics,
            time: new Date(),
        });

        story.save(function (err) {

            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send({"code": 0, "msg": "success"});

        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getUserStories = function (req, res) {
    let user_id = req.body.user_id;
    try {
        Story.find({user_id: user_id},
            function (err, stories) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(stories));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getStories = function (req, res) {
    let story_number = req.body.story_number;
    try {
        Story.countDocuments(function (err, count) {
            if (!err) {
                let total_story = count;
                let query = Story.find().skip(total_story - Number (story_number) - 10).limit(10);
                query.exec(function(err,stories){
                    if(err){
                        res.send(err);
                    }else{
                        //计算数据总数
                        stories.reverse();
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(stories));
                    }
                });
            }
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
