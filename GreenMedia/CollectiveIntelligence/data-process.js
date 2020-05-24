var fs = require('fs');  //fs是读取文件的模板工具

let ratings_flatten = []
let stories_flatten = []

module.exports = class initData{
    readFiles(url){
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
                    }
                    ratings_flatten.push(flatten_data)
                })
            })

            stories.forEach(item => {
                flatten_data = {
                    user_id: item.userId,
                    _id: item.storyId,
                    mention: item.text,
                    user_name: '',
                    time: '',
                    pics: []
                }
                stories_flatten.push(flatten_data)
            })


            console.log(ratings_flatten)
            console.log(stories_flatten)

        });
    }
}

