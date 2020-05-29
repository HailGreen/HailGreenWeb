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
    story['story_id'] = JSON.stringify(story_ids);
    $.ajax({
        url: '/get-story-stars',
        data: story,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            // console.log(dataR)
            for (let item in dataR) {
                console.log(dataR[item])
                for (let index in dataR[item]) {
                    let rate = dataR[item][index]
                    let tempstr = ''

                    switch (Number(index)) {

                        case 1:
                            console.log(Number(index))
                            tempstr = '          <div class="height-30">\n' +
                                '                     <div class="float-right">\n' +
                                '                       <a class="word-button"> \n' +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="1" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="2" story-id="${item} " ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="3" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="4" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="5" story-id="${item}" ></span>\n` +
                                `                         <span>: ${rate}</span>\n` +
                                '                       </a>\n' +
                                '                     </div>\n' +
                                '                     </div>\n'
                            $(`.media-body[story-id=${item}]`).append(tempstr)
                            break;
                        case 2:
                            tempstr = '          <div class="height-30">\n' +
                                '                     <div class="float-right">\n' +
                                '                       <a class="word-button"> \n' +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="1" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="2" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="3" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="4" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="5" story-id="${item}" ></span>\n` +
                                `                         <span>: ${rate}</span>\n` +
                                '                       </a>\n' +
                                '                     </div>\n' +
                                '                     </div>\n'
                            $(`.media-body[story-id=${item}]`).append(tempstr)
                            break;
                        case 3:
                            tempstr = '          <div class="height-30">\n' +
                                '                     <div class="float-right">\n' +
                                '                       <a class="word-button"> \n' +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="1" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="2" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="3" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="4" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="5" story-id="${item}" ></span>\n` +
                                `                         <span>: ${rate}</span>\n` +
                                '                       </a>\n' +
                                '                     </div>\n' +
                                '                     </div>\n'
                            $(`.media-body[story-id=${item}]`).append(tempstr)
                            break;
                        case 4:
                            tempstr = '          <div class="height-30">\n' +
                                '                     <div class="float-right">\n' +
                                '                       <a class="word-button"> \n' +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="1" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="2" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="3" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="4" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n` +
                                `                                  value="5" story-id="${item}" ></span>\n` +
                                `                         <span>: ${rate}</span>\n` +
                                '                       </a>\n' +
                                '                     </div>\n' +
                                '                     </div>\n'
                            $(`.media-body[story-id=${item}]`).append(tempstr)
                            break;
                        case 5:
                            tempstr = '          <div class="height-30">\n' +
                                '                     <div class="float-right">\n' +
                                '                       <a class="word-button"> \n' +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="1" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="2" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="3" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="4" story-id="${item}" ></span>\n` +
                                `                         <span class="glyphicon glyphicon-star"\n` +
                                `                                  value="5" story-id="${item}" ></span>\n` +
                                `                         <span>: ${rate}</span>\n` +
                                '                       </a>\n' +
                                '                     </div>\n' +
                                '                     </div>\n'
                            $(`.media-body[story-id=${item}]`).append(tempstr)
                            break;
                    }

                }
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}
