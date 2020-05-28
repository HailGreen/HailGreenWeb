/**
 * send ajax to the database and save the information of user
 */
$(function () {
    let userName = localStorage.getItem('user_name')
    if (userName && userName.length > 0) {
        $('#loginModel').css('display', 'none')
        $("#dropdownMenu1").text(localStorage.getItem("user_name"));
        syncIndexedDB2Remote()
        getStories()
    } else {
        $('#loginModel').css('display', 'block')
    }

});


/**
 * these are the global variables and function
 */
var uploadFiles = [];
var initData = {name:null,value:null};
var mediaStreamTrack = null; // the object of camera stream
var scrollTop = window.scrollY;
var isCanRun =true;
$("#add-pics").on("change", function () {
    if (uploadFiles.length === 3) {
        $("#upload-pics").hide();
        $("#camera").hide();
    }
});
$('#cameraModal').on('hide.bs.modal', function (e) {
    closeMedia();
});


/**
 * judge lazy load
 */
window.onscroll = () => {
    if (!isCanRun) {
        return
    }
    isCanRun = false;
    setTimeout(() => {
        scrollTop = window.scrollY;
        lazyLoad();
        isCanRun = true;
    }, 1000)

}


/**
 * import story part of the HTML
 */
function addComment(story_id) {
    // initStories()
    $(`.list-group[story-id=${story_id}]`).append('     <form id="uploadComment" onsubmit="return false;" enctype="multipart/form-data">' +
        '                            <li class="list-group-item" id="comment-li">\n' +
        '                                <textarea class="comment-textarea" name="text1" id="text1"></textarea>\n' +
        '                                <div class="float-right" onclick="removeComment()"><span class="glyphicon glyphicon-remove no-icon-word-button" aria-hidden="true"  ></span></div>\n' +
        `                                <button class="btn btn-primary btn-sm float-right"  id="submit-button" onclick="insertComment('${story_id}')">submit</button>\n` +
        '                            </li>' +
        '                          </form>');
}


/**
 * remove dom children in web to empty the li label
 */
function removeComment() {
    $("#comment-li").remove();
}


/**
 * click function to send data in release story
 */
function insertComment(story_id) {
    let comment = {};
    comment["user_id"] = localStorage.getItem("user_id");
    comment["story_id"] = story_id;
    comment["user_name"] = localStorage.getItem("user_name");
    comment["text"] = $("#text1").val();
    $.ajax({
        url: '/insert-comment',
        data: comment,
        dataType: 'json',
        type: 'POST',
        success: function () {
            console.log("insert successfully");
            removeComment()
            getComments(comment.story_id)
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

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
 * get stories posted by certain user
 * @param user_id
 */
function getUserStories(user_id) {
    var user = {};
    user['user_id'] = user_id
    $.ajax({
        url: '/show-personal-wall',
        data: user,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            console.log(dataR);
            $("#sortDiv").css('display', 'none')
            // $("#release").css('display', 'none')

            $("#results").html('')

            dataR.forEach((item) => {

                var imgsTempStr = ``
                item.pics.forEach((i) => {
                    var tempStr = '<div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">\n' +
                        `<a href="#" class="thumbnail"><img src="/images/uploads/${i.filename}" alt="pics"></a>` +
                        '</div>'
                    imgsTempStr += tempStr
                })

                let time = formatTime(item.time);

                $("#results").prepend(`<div class="media" story-id="${item._id}" >\n` +
                    `                       <div class="media-body" story-id="${item._id}">\n` +
                    '                         <p class="media-heading">\n' +
                    `                         <p class="time">${time}</p></p>\n` +
                    `                         <p id="text">${item.mention}</p>\n` +
                    '                     <div class="row">\n' +
                    imgsTempStr +
                    '                       </div>\n' +
                    '                     <div>\n' +
                    `                       <ul class="list-group" id="ul1" story-id="${item._id}">\n` +
                    '                       </ul>\n' +
                    '                     </div>\n' +
                    '                   </div>\n' +
                    '                     </div>')

                getStoryStars(item._id)
            });

            $("#results").prepend(`<h3 style="text-align:center;">${dataR[0].username}\'s Personal Wall</h3>`)
            $("#results").prepend('<button class="btn" onclick="backToIndex()"> &lt;back</button>')

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * init method: get stories form remote, sort by different labels
 */
function getStories(storyNumbers=0) {
    let url = '/show-story';
    let storyType = {};
    storyType['user_id'] = localStorage.getItem('user_id');
    storyType['story_number']=storyNumbers;
    // if ($('#dropdownMenu2').text().indexOf('recommend') > -1) {
    //     storyType['sort_method'] = 'recommend';
    // } else {
    //     storyType['sort_method'] = 'timeline';
    // }
    storyType['sort_method'] = $('#dropdownMenu2').text()
    sendAjaxQuery(url, storyType);
}

function backToIndex() {
    $("#results").html('');
    $("#sortDiv").css('display','block');
    getStories()
}

/**
 * toggle order of stories
 * @param sortMethod
 */
function sortBy(sortMethod) {
    $("#dropdownMenu2").text('Sort by: ' + sortMethod);
    $("#results").html('')
    getStories()
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
function getStoryStars(story_id) {
    let story = {};
    let user_likes = {};
    story['story_id'] = story_id;
    $.ajax({
        url: '/get-story-stars',
        data: story,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            dataR.forEach((star) => {
                let user = {};
                user['user_id'] = star.user_id;
                $.ajax({
                    url: '/get-user-id',
                    data: user,
                    dataType: 'JSON',
                    type: 'POST',
                    success: function (user) {
                        user_likes[user[0].username] = star.rate;

                        let tempstr = `<span></span>` +
                            '                   <div class="height-30">\n' +
                            '                     <div class="float-right">\n' +
                            '                       <a class="word-button"> \n' +
                            `${user[0].username} : ` +
                            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
                            `                                  value="1" story-id="${story_id}" user-name="${user[0].username}"></span>\n` +
                            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
                            `                                  value="2" story-id="${story_id}" user-name="${user[0].username}"></span>\n` +
                            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
                            `                                  value="3" story-id="${story_id}" user-name="${user[0].username}"></span>\n` +
                            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty"\n' +
                            `                                  value="4" story-id="${story_id}" user-name="${user[0].username}"></span>\n` +
                            '                       </a>\n' +
                            '                     </div>\n' +
                            '                     </div>\n'

                        $(`.media-body[story-id=${story_id}]`).append(tempstr)
                        for (var index = 0; index < 5; index++) {
                            if (index <= star.rate) {
                                $(`span[value=${index}][story-id=${story_id}][user-name=${user[0].username}]`).attr('class', 'glyphicon glyphicon-star')
                            } else {
                                $(`span[value=${index}][story-id=${story_id}][user-name=${user[0].username}]`).attr('class', 'glyphicon glyphicon-star glyphicon-star-empty')
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        alert('Error: ' + error.message);
                    }
                });
            })
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}



/**
 * get comments by story id, success: save
 * @param story_id
 */
function getComments(story_id) {
    var story = {};
    story['story_id'] = story_id;
    $.ajax({
        url: '/get-comments',
        data: story,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            $(`.list-group[story-id=${story_id}]`).html('')
            dataR.forEach((item) => {
                changeCommentShow(item.text, item.user_name, story_id)
                // store comment to indexedDB
                storeCachedData('_id', item, STORE_COMMENTS)
            })
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * get stories list from remote
 * @param url
 * @param storyType
 */
function sendAjaxQuery(url, storyType) {
    $.ajax({
        url: url,
        data: storyType,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            const result = Object.values({...dataR});
            showStoriesList(result);
            showCommentAndLikeAccordingToStoryId(result);
        },
        error: function (xhr, status, error) {
            if (localStorage.getItem("isOnline") === "true") {
                alert('Error: ' + error.message);
                // $("#release").css('display', 'block');
            } else {
                // $("#release").css('display', 'none');
            }
            // get indexedDB cache
            getStoriesInIndexedDB();

        }
    });
}

/**
 * show / append stories on the main page
 * @param result
 */
function showStoriesList(result) {
    result.forEach((item) => {
        // store stories to indexedDB
        storeCachedData('_id', item, STORE_STORIES)
        console.log(item)

        var imgsTempStr = ``
        item.pics.forEach((i) => {
            var tempStr = '<div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">\n' +
                `<a href="#" class="thumbnail"><img src="/images/uploads/${i.filename}" alt="pics"></a>` +
                '</div>'
            imgsTempStr += tempStr
        })

        let time = formatTime(item.time);

        $("#results").append(`<div class="media" story-id="${item.story_id}" >\n` +
            '                       <div class="media-left">\n' +
            '                         <a href="#">\n' +
            '                           <img class="media-object" src="/images/icons/user.svg" alt="user">\n' +
            '                     </a>\n' +
            '                   </div>\n' +
            `                       <div class="media-body" story-id="${item.story_id}">\n` +
            '                         <p class="media-heading">\n' +
            `                         <a href="#" class="user-name" user-id="${item.user_id}" onclick="getUserStories('${item.user_id}')">${item.username}</a>\n` +
            `                         <p class="time">${time}</p></p>\n` +
            `                         <p id="text">${item.mention}</p>\n` +
            '                     <div class="row">\n' +
            imgsTempStr +
            '                       </div>\n' +
            '                   <div class="height-30">\n' +
            '                     <div class="float-right">\n' +
            `                       <a onclick="addComment('${item.story_id}')" class="word-button"><span class="glyphicon glyphicon-comment"\n` +
            `                                                                            aria-hidden="true"></span> comment</a> &nbsp \n` +
            '                       <a class="word-button"> \n' +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="1" story-id="${item.story_id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="2" story-id="${item.story_id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="3" story-id="${item.story_id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="4" story-id="${item.story_id}"></span>\n` +
            '                       </a>\n' +
            '                     </div>\n' +
            '                     </div>\n' +
            '                     <div>\n' +
            `                       <ul class="list-group" id="ul1" story-id="${item.story_id}">\n` +
            '                       </ul>\n' +
            '                     </div>\n' +
            '                   </div>\n' +
            '                     </div>')

    });

}

/**
 * send ajax to get star and comments
 * @param result
 */
function showCommentAndLikeAccordingToStoryId(result) {
    result.forEach((item) => {
        getComments(item.story_id);
        getStar(item.story_id);
    })
    $("#unread-stories").html(0)
}






function lazyLoad() {
    if ($("#main").height() < window.innerHeight + scrollTop+50) {
        let currentStoryNumbers=$(".media").length;
        getStories(currentStoryNumbers);
    }

}