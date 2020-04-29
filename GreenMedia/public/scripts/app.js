/**
 * send ajax to the databse and save the information of user
 */
$(function () {
    let url = '/get_user';
    let data = {userName: 'sysadmin'};
    getUserList();
    // await addNameList();
});

function getUserList() {
    $.ajax({
        url: '/get_user_list',
        data: null,
        dataType: 'JSON',
        type: 'get',
        success: function (dataR) {
            localStorage.setItem('users', JSON.stringify(dataR));
            localStorage.setItem('user_id', dataR[0].user_id);
            localStorage.setItem('user_name', dataR[0].user_name);
            addNameList()
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function addNameList() {
    $("#name-list").empty();
    $("#dropdownMenu1").text(localStorage.getItem("user_name"));
    let nameList = JSON.parse(localStorage.getItem("users"));
    nameList.forEach(item => {
        if (item.user_name !== localStorage.getItem("user_name")) {
            $("#name-list").append(`<li><a onclick=changeUser(this.name) name=${item.user_name}>${item.user_name}</a></li>`)
        }

    })
}


function changeUser(username) {
    $("#dropdownMenu1").text(username);
    let userList = JSON.parse(localStorage.getItem("users"));
    userList.forEach(item => {
        if (username === item.user_name) {
            localStorage.setItem('user_id', item.user_id);
            localStorage.setItem('user_name', item.user_name);
        }

    });
    addNameList();
    getStories();
}


var uploadFiles = [];
var socket = io.connect('https://localhost:3000');

$("#add-pics").on("change", function () {
    if (uploadFiles.length === 3) {
        $("#upload-pics").hide();
    }
});



/**
 * import release button and model part of the HTML
 */
function changePic(obj) {
    if (uploadFiles.length < 3 && uploadFiles.length + obj.files.length <= 3) {
        Array.from(obj.files).forEach((value, index) => {
            uploadFiles.push({value: value, name: value.name});
            var newsrc = getObjectURL(obj.files[index]);
            $("#add-pics").prepend(' <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4 pic" id="' + value.name.split(".")[0] + '-div">\n' +
                '\n' +
                '<img src="' + newsrc + '" alt="pics" height="100px" width="100%">\n' +
                '<span class="glyphicon glyphicon-remove remove-button-pics" aria-hidden="true" id="' + value.name.split(".")[0] + '" onclick="removePics(this.id)" style="position:absolute"></span>\n' +
                '</div>')
        });
    } else {
        alert("You can only add 3 pics");
    }

}


function removePics(id) {
    var name = id + "-div";
    $("#" + name + "").remove();
    uploadFiles = uploadFiles.filter(obj => obj.name.indexOf(id) === -1);
    $("#upload-pics").show();
}


function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


function submitData() {
    // var form = document.getElementById('uploadData');
    sendAjaxInsert('/release-story', onSubmit());
};

function onSubmit() {
    var formArray = $("form").serializeArray();
    var formData = new FormData();
    formArray.forEach(val => {
        formData.append(val.name, val.value);
    });
    uploadFiles.forEach(val => {
        formData.append('files', val.value, val.name);
    })
    formData.append("id", localStorage.getItem("user_id"));
    formData.append("username", localStorage.getItem("user_name"));
    return formData;
};

function sendAjaxInsert(url, submitData) {
    $.ajax({
        url: url,
        data: submitData,
        dataType: 'JSON',
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            $('#releaseModal').modal('hide');
            $("#mention").val("");
            uploadFiles = [];
            $('.pic').remove();

            // socket io emit event
            socket.emit('new-story');
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
};


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

function removeComment() {
    $("#comment-li").remove();
}

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
 * init method: get stories form remote
 */
function getStories() {
    var url = '/show-story';
    var user = {};
    user['user_id'] = localStorage.getItem('user_id');
    var sortMethod = $('#dropdownMenu2').text()
    if (sortMethod.indexOf('recommend') > -1) {
        sendAjaxQuery(url, user, 'recommend');
    } else {
        sendAjaxQuery(url, user, 'timeline');
    }
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
                changeStarShow(item.rate, item.story_id)
                // store like rate stars to indexedDB
                storeCachedData('_id', item, STORE_STARS)
            })
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * get all stars and display by recommend
 * @param stories
 */
function getStars(stories) {
    $.ajax({
        url: '/get-stars',
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {
            let users = {};
            dataR.forEach(item => {
                if (!users[item.user_id]) {
                    users[item.user_id] = [];
                }
                let story = item.story_id;
                let rate = item.rate;
                let object = {};
                object[story] = rate;
                users[item.user_id].push(object);
            })
            getRecommendations(users, stories);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * get recommend from remote
 * @param users
 * @param stories
 */
function getRecommendations(users, stories) {
    // users = {users: users};
    users = JSON.stringify(users);
    let user_id = localStorage.getItem("user_id");
    let input = {users: users, user_id: user_id}
    $.ajax({
        url: '/get-recommendations',
        data: input,
        dataType: 'JSON',
        type: 'POST',
        success: function (dataR) {

            //  compare and then display
            var recommendIdArray = new Array()
            var result = new Array()
            var ratedResult = new Array()

            dataR.forEach((item, index) => {
                recommendIdArray[index] = item.story
            })

            stories.forEach((item, index) => {
                let rank_index = recommendIdArray.indexOf(item._id)
                if (rank_index > -1) {
                    result[rank_index] = item
                } else {
                    ratedResult.push(item)
                }
            })

            result = result.concat(ratedResult)
            console.log('sorted', result)

            // display
            showStoriesList(result.reverse())
            showCommentAndLikeAccordingToStoryId(result.reverse())

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * display stories by selected method
 * @param sortMethod
 */
function sortBy(sortMethod) {
    $("#dropdownMenu2").text('Sort by: ' + sortMethod);
    var url = '/show-story';
    var user = {};
    user['user_id'] = localStorage.getItem('user_id');
    sendAjaxQuery(url, user, sortMethod)
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
 * @param user
 */
function sendAjaxQuery(url, user, sortBy) {
    $.ajax({
        url: url,
        data: user,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            const result = Object.values({...dataR})
            // catch response data to indexedDB & show response to the main page
            $("#results").html('')
            // display method
            if (sortBy === 'recommend') {
                getStars(result)
            } else {
                showStoriesList(result)
                showCommentAndLikeAccordingToStoryId(result)
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
            // get indexedDB cache
            getStoriesInIndexedDB()
        }
    });
}

function formatTime(time) {
    console.log(time);
    return time.replace("T", " ").slice(0, -8);
}

/**
 * show / append stories on the main page
 * @param result
 */
function showStoriesList(result) {
    result.forEach((item) => {
        // store stories to indexedDB
        storeCachedData('_id', item, STORE_STORIES)

        var imgsTempStr = ``
        item.pics.forEach((i) => {
            var tempStr = '<div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">\n' +
                `<a href="#" class="thumbnail"><img src="/images/uploads/${i.filename}" alt="pics"></a>` +
                '</div>'
            imgsTempStr += tempStr
        })

        let time = formatTime(item.time);

        $("#results").prepend(`<div class="media" story-id="${item._id}">\n` +
            '                       <div class="media-left">\n' +
            '                         <a href="#">\n' +
            '                           <img class="media-object" src="/images/icons/user.svg" alt="user">\n' +
            '                     </a>\n' +
            '                   </div>\n' +
            `                       <div class="media-body" story-id="${item._id}">\n` +
            '                         <p class="media-heading">\n' +
            `                         <p class="user-name">${item.username}</p>\n` +
            `                         <p class="time">${time}</p></p>\n` +
            `                         <p id="text">${item.mention}</p>\n` +
            '                     <div class="row">\n' +
            imgsTempStr +
            '                       </div>\n' +
            '                   <div class="height-30">\n' +
            '                     <div class="float-right">\n' +
            `                       <a onclick="addComment('${item._id}')" class="word-button"><span class="glyphicon glyphicon-comment"\n` +
            `                                                                            aria-hidden="true"></span> comment</a> &nbsp \n` +
            '                       <a class="word-button"> \n' +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="1" story-id="${item._id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="2" story-id="${item._id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="3" story-id="${item._id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="4" story-id="${item._id}"></span>\n` +
            '                         <span class="glyphicon glyphicon-star glyphicon-star-empty" onclick="updateStar(this)"\n' +
            `                                  value="5" story-id="${item._id}"></span>\n` +
            '                       </a>\n' +
            '                     </div>\n' +
            '                     </div>\n' +
            '                     <div>\n' +
            `                       <ul class="list-group" id="ul1" story-id="${item._id}">\n` +
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
        getComments(item._id)
        getStar(item._id)
    })
    $("#unread-stories").html(0)
}

/**
 * change how many star empty, show rate
 * @param starValue
 * @param storyId
 */
function changeStarShow(starValue, storyId) {
    for (var index = 1; index <= 5; index++) {
        if (index <= starValue) {
            $(`span[value=${index}][story-id=${storyId}]`).attr('class', 'glyphicon glyphicon-star')
        } else {
            $(`span[value=${index}][story-id=${storyId}]`).attr('class', 'glyphicon glyphicon-star glyphicon-star-empty')
        }
    }
}

/**
 * change / amount the comment to stories
 * @param text
 * @param user_name
 * @param story_id
 */
function changeCommentShow(text, user_name, story_id) {
    $(`.list-group[story-id=${story_id}]`).append(
        `<li style="list-style-type:none">${user_name} : ${text}</li>`)
}

/**
 * get stories from indexedDB -> display -> get comments & stars
 */
function getStoriesInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORE_STORIES], "readonly");
        var store = tx.objectStore(STORE_STORIES);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);
                showStoriesList(res)
                getCommentInIndexedDB()
                getStarsInIndexedDB()
            }
        }
    }
}

/**
 * get comments from indexedDB -> amount to story
 */
function getCommentInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORE_COMMENTS], "readonly");
        var store = tx.objectStore(STORE_COMMENTS);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);
                // showStoriesList(res)
                res.forEach(item => {
                    changeCommentShow(item.text, item.user_name, item.story_id)
                })
            }
        }
    }
}

/**
 * get stars from indexedDB -> amount to story
 */
function getStarsInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORE_STARS], "readonly");
        var store = tx.objectStore(STORE_STARS);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);
                res.forEach((item) => {
                    changeStarShow(item.rate, item.story_id)
                })
            }
        }
    }
}


/**
 * socket io
 */
var socket = io.connect('https://localhost:3000');
socket.on('story-updated', function (count) {
    console.log("story-updated")
    $("#unread-stories").html(count)
})
socket.emit('connected');
