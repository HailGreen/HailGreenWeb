/**
 * send star ajax
 * @param obj
 */
function updateStar(obj) {
    starValue = obj.getAttribute('value');
    storyId = obj.getAttribute('story-id');
    changeStarShow(starValue, storyId)

    var star = {};
    star['story_id'] = storyId;
    star['user_id'] = localStorage.getItem("user_id");
    star['rate'] = starValue;
    $.ajax({
        url: '/update-star',
        data: star,
        dataType: 'JSON',
        type: 'PUT',
        success: function () {
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * get star by story id
 * @param story_id
 */
function getStar(story_id) {
    var star = {};
    star['story_id'] = story_id;
    star["user_id"] = localStorage.getItem("user_id");
    $.ajax({
        url: '/get-star',
        data: star,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            dataR.forEach((item) => {
                changeStarShow(item.rate, item.story_id);
                // store like rate stars to indexedDB
                storeCachedData('story_id', item, STORE_STARS);
            })
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}


/**
 * get rate value by story id
 * @param story_id
 */
function getStoryStars(story_ids) {
    let story = {};
    // let user_likes = {};
    story['story_id'] = story_ids;
    $.ajax({
        url: '/get-story-stars',
        data: story,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            // dataR.forEach((star) => {
            //     let user_id = star.user_id;
            //     let rate = star.rate
            //
            //     let tempstr = `<span></span>` +
            //         '                   <div class="height-30">\n' +
            //         '                     <div class="float-right">\n' +
            //         '                       <a class="word-button"> \n' +
            //         `${user_id} : ` +
            //         '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
            //         `                                  value="1" story-id="${story_id}" user-name="${user_id}"></span>\n` +
            //         '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
            //         `                                  value="2" story-id="${story_id}" user-name="${user_id}"></span>\n` +
            //         '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
            //         `                                  value="3" story-id="${story_id}" user-name="${user_id}"></span>\n` +
            //         '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
            //         `                                  value="4" story-id="${story_id}" user-name="${user_id}"></span>\n` +
            //         '                       </a>\n' +
            //         '                     </div>\n' +
            //         '                     </div>\n'
            //     $(`.media-body[story-id=${story_id}]`).append(tempstr)
            //
            //     // for (var index = 0; index < 5; index++) {
            //     //     if (index <= star.rate) {
            //     //         $(`span[value=${index}][story-id=${story_id}][user-name=${user_id}]`).attr('class', 'glyphicon glyphicon-star')
            //     //     } else {
            //     //         $(`span[value=${index}][story-id=${story_id}][user-name=${user_id}]`).attr('class', 'glyphicon glyphicon-star glyphicon-star-empty')
            //     //     }
            //     // }
            // })
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}
