var fs = require('fs');  //fs是读取文件的模板工具
let Star = require('../models/star');
let Story = require('../models/story');

let ratings_flatten = []
let stories_flatten = []
let users_flatten = []

module.exports = class initData {
    readFiles(url) {
        fs.readFile(url, function (err, data) {//读取同目录下的book.json文件
            if (err) {
                throw err;
            }

            var jsonObj = JSON.parse(data);//获取json文件对象
            let users = jsonObj.users;
            let stories = jsonObj.stories;
            let flatten_data;


            users.forEach(item => {
                item.ratings.forEach(rating => {
                    flatten_data = {
                        user_id: item.userId,
                        story_id: rating.storyId,
                        rate: rating.rating
                    };
                    ratings_flatten.push(flatten_data)
                })

                users_flatten.push({
                    user_id: item.userId,
                    username: tem.userId,
                })

            });

            stories.forEach(item => {
                flatten_data = {
                    story_id: item.storyId,
                    pics: [],
                    user_id: item.userId,
                    username: item.userId,
                    mention: item.text,
                    time: new Date(),
                };
                stories_flatten.push(flatten_data)
            });

            Star.insertMany(ratings_flatten);
            Story.insertMany(stories_flatten);
        });
    }
}
