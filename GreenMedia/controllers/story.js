let Story = require('../models/story');
let Star = require('../models/star');
let Ranking = require('../CollectiveIntelligence/Ranking');

/**
 * Insert one story
 * @param req
 * @param res
 */
exports.insertStory = function (req, res) {
    // story text;
    let mention = req.body.mention;
    // story pictures;
    let pics = req.files;
    let id = req.body.id;
    let username = req.body.username;
    let story_id = req.body.story_id;
    try {
        // The structure of the story.
        let story = new Story({
            story_id: story_id,
            user_id: id,
            username: username,
            mention: mention,
            pics: pics,
            time: new Date(),
        });

        // Save the story.
        story.save(function (err) {
            if (err)
                res.status(500).send('Cannot store the story!');
            res.setHeader('Content-Type', 'application/json');
            res.send({"code": 0, "msg": "success"});

        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

/**
 * Get stories of one user
 * @param req
 * @param res
 */
exports.getUserStories = function (req, res) {
    let user_id = req.body.user_id;
    try {
        Story.find({user_id: user_id},
            function (err, stories) {
                if (err)
                    res.status(500).send('The user has not released stories!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(stories));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

/**
 * Get all of the stories through different sort methods
 * @param req
 * @param res
 */
exports.getStories = function (req, res) {
    let user_id = req.body.user_id;
    let story_number = req.body.story_number;
    // sort method: recommended according to Pearson,
    //              recommended according to Euclidean,
    //              timeline
    let sort_method = req.body.sort_method;
    if (sort_method.indexOf('Pearson') > -1){
        sort_method = 'sim_pearson';
    } else if (sort_method.indexOf('Euclidean') > -1){
        sort_method = 'sim_euclidean';
    } else {
        sort_method = 'timeline';
    }
    try {
        if (sort_method === 'timeline') {
            // Every time is to skip 10 documents and get the following 10 documents.
            Story.countDocuments(function (err, count) {
                if (!err) {
                    // This query is to obtain the latest 10 documents after skipping the stories which have been displayed.
                    let query = Story.find().skip(count - Number (story_number) - 10).limit(10);
                    query.exec(function(err,stories){
                        if(err){
                            res.status(500).send('There are no stories!');
                            res.send(err);
                        }else{
                            stories.reverse();
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(stories));
                        }
                    });
                }
            });
        } else {
            Story.find(function (err, stories) {
                if (err)
                    res.status(500).send('There are no stories!');
                Star.find(function (err, stars) {
                    if (err)
                        res.status(500).send('There are no stars!');
                    // Obtain the values of users.
                    // The structure of users is: {["user_id"]:[{"story_id": rate}]}.
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
                    // Get the recommendations according to the user_id and users through different sort methods.
                    let ranking = new Ranking();
                    let results = ranking.getRecommendations(users, user_id, sort_method);
                    let recommendIdArray = [];
                    let result = [];
                    let ratedResult = [];
                    // Store the recommended story id.
                    results.forEach((item, index) => {
                        recommendIdArray[index] = item.story;
                    });
                    // Store the recommended stories at first and concat these with rated stories.
                    stories.forEach((item, index) => {
                        let rank_index = recommendIdArray.indexOf(item.story_id);
                        if (rank_index > -1) {
                            result[rank_index] = item
                        } else {
                            ratedResult.push(item)
                        }
                    });
                    result = result.concat(ratedResult);
                    // Show 10 stories for every time.
                    result = result.slice(Number (story_number), Number (story_number) + 10);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                })
            })
        }
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};
