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
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        Character.find({first_name: userData.firstname, family_name: userData.lastname},
            'first_name family_name dob age',
            function (err, characters) {
                if (err)
                    res.status(500).send('Invalid data!');
                var character = null;
                if (characters.length > 0) {
                    var firstElem = characters[0];
                    character = {
                        name: firstElem.first_name, surname: firstElem.family_name,
                        dob: firstElem.dob, age: firstElem.age
                    };
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(character));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
