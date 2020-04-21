let Release = require('../models/release');


exports.insert = function (req, res) {
    let mention = req.body.mention;
    let pics = req.files;
    let id = req.body.id;
    try {
        let release = new Release({
            user_id: id,
            mention: mention,
            pics: pics
        });
        console.log('received: ' + release);

        release.save(function (err, results) {
            console.log(results._id);
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
    let userData = req.body;
    console.log(req.body)
    try {
        Release.find({user_id: userData.user_id},
            function (err, releases) {
                if (err)
                    res.status(500).send('Invalid data!');
                // var release =null;
                if (releases.length>0) {
                    var firstElem = releases[0];
                    console.log(firstElem);
                    var user_id = firstElem.user_id;
                    console.log(releases.length);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(user_id));
            });
    } catch (e) {
        res.status(500).send('error '+ e);
    }
}
