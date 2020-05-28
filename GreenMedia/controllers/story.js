let Story = require('../models/story');
let Star = require('../models/star');
let Ranking = require('../CollectiveIntelligence/Ranking');

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
    let user_id = req.body.user_id;
    let story_number = req.body.story_number;
    let sort_method = req.body.sort_method;
    console.log(sort_method);
    try {
        if (String(sort_method) === 'recommend') {
            Story.find(function (err, stories) {
                Star.find(function (err, stars) {
                    let users = {};
                    stars.forEach(item => {
                        if (!users[item.user_id]) {
                            users[item.user_id] = [];
                        }
                        let story = item.story_id;
                        let rate = item.rate;
                        let object = {};
                        object[story] = rate;
                        users[item.user_id].push(object);
                    });
                    users = JSON.stringify(users);
                    let ranking = new Ranking();
                    let results = ranking.getRecommendations(users, user_id, 'sim_pearson');
                    //  compare and then display
                    let recommendIdArray = [];
                    let result = [];
                    let ratedResult = [];

                    results.forEach((item, index) => {
                        recommendIdArray[index] = item.story
                    });

                    stories.forEach((item, index) => {
                        let rank_index = recommendIdArray.indexOf(item._id)
                        if (rank_index > -1) {
                            result[rank_index] = item
                        } else {
                            ratedResult.push(item)
                        }
                    });

                    result = result.concat(ratedResult);

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                })
            })
        } else {
            Story.countDocuments(function (err, count) {
                if (!err) {
                    let query = Story.find().skip(count - Number (story_number) - 10).limit(10);
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
        }
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
