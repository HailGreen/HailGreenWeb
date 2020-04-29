let Story = require('../models/story');


exports.insertStory = function (req, res) {
    let mention = req.body.mention;
    let pics = req.files;
    let id = req.body.id;
    let username=req.body.username;

    try {
        let release = new Story({
            user_id: id,
            username:username,
            mention: mention,
            pics: pics,
            time:new Date(),
        });

        release.save(function (err) {

            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send({"code": 0, "msg": "success"});

        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}


exports.getStories = function (req, res) {
    try {
        Story.find(
            function (err, stories) {
                if (err)
                    res.status(500).send('Invalid data!');

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(stories));
            });
    } catch (e) {
        res.status(500).send('error '+ e);
    }
}
