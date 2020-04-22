let Index = require('../models/index');



exports.getUser = function (req, res) {
    let userData=req.body;
    try {

        Index.find({username: userData.userName},
            'user_id username',
            function (err, users) {
                if (err)
                    res.status(500).send('Invalid data!');
                var user = null;
                if (users.length > 0) {
                    var firstElem = users[0];
                    user = {
                        user_id:firstElem.user_id, user_name:firstElem.username
                    };
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(user));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
