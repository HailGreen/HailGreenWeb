var fs = require('fs');  //fs是读取文件的模板工具

let ratings_flatten = []
let stories_flatten = []


fs.readFile('usersStoriesAndRatings.json', function (err, data) {//读取同目录下的book.json文件
    if (err) {
        throw err;
    }

    var jsonObj = JSON.parse(data);//获取json文件对象
    users = jsonObj.users
    stories = jsonObj.stories


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


    console.log(ratings)
    console.log(stories_flatten)

});
