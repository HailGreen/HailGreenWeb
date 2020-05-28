let Index = require('../models/index');

/**
 * Get the user according to the username;
 * @param req
 * @param res
 */
exports.getUser = function (req, res) {
    let user_data = req.body;
    try {
        Index.find({username: user_data.username},
            'user_id username',
            function (err, users) {
                if (err)
                    res.status(500).send('Invalid data!');
                let user = null;
                if (users.length > 0) {
                    user = {
                        user_id: users[0].user_id, user_name: users[0].username
                    };
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(user));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

/**
 * Get the user according to the user_id;
 * @param req
 * @param res
 */
exports.getUserById = function (req, res) {
    let user_id = req.body.user_id;
    try {
        Index.find({user_id: user_id},
            function (err, user) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(user));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}


// exports.getUserList = function (req, res) {
//     try {
//         Index.find({},
//             'user_id username',
//             function (err, users) {
//                 if (err)
//                     res.status(500).send('Invalid data!');
//                 let user = [];
//                 users.forEach(item => {
//                     user.push({user_id: item.user_id, user_name: item.username})
//                 })
//                 res.setHeader('Content-Type', 'application/json');
//                 res.send(JSON.stringify(user));
//             });
//     } catch (e) {
//         res.status(500).send('error ' + e);
//     }
// }
