var Release = require('../models/release');



exports.insert = function (req, res) {
    var mention = req.body.mention;
    var pics=req.files;

    try {
        var release = new Release({
            user_id: 1,
            mention:mention,
            pics: pics
        });
        console.log('received: ' + release);

        release.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send({"code":0,"msg":"success"});



        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
