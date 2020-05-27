let Story = require('../models/story');


exports.insertStory = function (req, res) {
    let mention = req.body.mention;
    let pics = req.files;
    let id = req.body.id;
    let username = req.body.username;

    try {
        let story = new Story({
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
        let query = Story.find().skip(story_number).limit(10);
        query.exec(function(err,stories){
            if(err){
                res.send(err);
            }else{
                //计算数据总数
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(stories));
            }
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
