/**
 * send ajax to the database and save the information of user
 */
$(function () {
    let userName = localStorage.getItem('user_name')
    if (userName && userName.length > 0) {
        $('#loginModel').css('display', 'none')
        $("#dropdownMenu1").text(localStorage.getItem("user_name"));
        syncIndexedDB2Remote()
    } else {
        $('#loginModel').css('display', 'block')
    }
});


/**
 * these are the global variables and function
 */
var uploadFiles = [];
var mediaStreamTrack = null; // the object of camera stream
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
 * When the client gets off-line, it hides release button
 */
window.addEventListener('offline', function (e) {
    // Queue up events for server.
    showOffline();
}, false);

/**
 * When the client gets online, it show release button
 */
window.addEventListener('online', function (e) {
    // Resync data with server.
    hideOffline();
    getStories();
}, false);


/**
 * the function to hide release button
 */
function showOffline() {
    localStorage.setItem("isOnline", "false");
    $("#release").css('display', 'none');
}


/**
 * the function to display release button
 */
function hideOffline() {
    localStorage.setItem("isOnline", "true");
    $("#release").css('display', 'block');
}


/**
 * send login ajax
 */
function login() {
    $.ajax({
        url: '/get-user',
        data: {username: $('#login-username').val()},
        dataType: 'JSON',
        type: 'post',
        success: function (dataR) {
            if (!dataR) {
                alert("this user does not exist")
            } else {
                localStorage.setItem('users', JSON.stringify(dataR));
                localStorage.setItem('user_id', dataR.user_id);
                localStorage.setItem('user_name', dataR.user_name);
                $('#loginModel').css('display', 'none')
                $('#dropdownMenu1').text(dataR.user_name)
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}


/**
 * import release button and model part of the HTML
 */
function changePic(obj) {
    if (uploadFiles.length < 3 && uploadFiles.length + obj.files.length <= 3) {
        Array.from(obj.files).forEach((value, index) => {
            addPics(value);
        });
    } else {
        alert("You can only add 3 pics");
    }

}


function addPics(value) {
    uploadFiles.push({value: value, name: value.name});
    var newsrc = getObjectURL(value);
    $("#add-pics").prepend(' <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4 pic" id="' + value.name.split(".")[0] + '-div">\n' +
        '\n' +
        '<img src="' + newsrc + '" alt="pics" height="100px" width="100%">\n' +
        '<span class="glyphicon glyphicon-remove remove-button-pics" aria-hidden="true" id="' + value.name.split(".")[0] + '" onclick="removePics(this.id)" style="position:absolute"></span>\n' +
        '</div>')

}


/**
 * remove the pics from the modal dialog
 */
function removePics(id) {
    var name = id + "-div";
    $("#" + name + "").remove();
    uploadFiles = uploadFiles.filter(obj => obj.name.indexOf(id) === -1);
    $("#upload-pics").show();
    $("#camera").show();
}


/**
 * use the uploaded file and find the current browser to get the url
 */
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


/**
 * click function to send data in release story
 */
function submitData() {
    // var form = document.getElementById('uploadData');
    let online = localStorage.getItem('isOnline')
    if (online && online === 'true') {
        sendAjaxInsert('/release-story', onSubmit());
    } else {
        // save stories to IndexedDB
        let item = {}
        item['mention'] = $('#mention').val()
        item['user_id'] = localStorage.getItem("user_id")
        item['user_name'] = localStorage.getItem("user_name")
        item['pics'] = new Array()
        uploadFiles.forEach(val => {
            item['pics'].push(val);
        })
        storeCachedData('_id', item, STORIES_TO_SYNC)
        $('#releaseModal').modal('hide');
    }
};

/**
 * sync the data cached in indexedDB to remote when online
 * listen online: upload files in indexed to remote and
 * then clear the cached data
 */
function syncIndexedDB2Remote() {
    var req = window.indexedDB.open(DB_NAME, 1);

    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORIES_TO_SYNC], 'readwrite');
        var store = tx.objectStore(STORIES_TO_SYNC);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);

                res.forEach(item => {
                    let formData = new FormData()
                    formData.append('mention', item.mention)
                    formData.append("id", item.user_id);
                    formData.append("username", localStorage.getItem("user_name"));
                    item.pics.forEach(val => {
                        formData.append('files', val.value, val.name);
                    })
                    sendAjaxInsert('/release-story', formData);
                })
            }
        }
        store.clear()
    }
}


/**
 * click function to send data in release story
 */
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


/**
 * send ajax to insert story to mongodb
 */
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
            $("#release").css('display', 'none')

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


            $("#results").prepend('<button onclick="getStories()">back</button>')
            $("#results").prepend(`<h3 style="text-align:center;">${dataR[0].username}\'s Personal Wall</h3>`)

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
            if (localStorage.getItem("isOnline") === "true") {
                alert('Error: ' + error.message);
                $("#release").css('display', 'block');
            } else {
                $("#release").css('display', 'none');
            }
            // get indexedDB cache
            getStoriesInIndexedDB();

        }
    });
}

/**
 * format the time zone
 * @param time
 */
function formatTime(time) {
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
        console.log(item)

        var imgsTempStr = ``
        item.pics.forEach((i) => {
            var tempStr = '<div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">\n' +
                `<a href="#" class="thumbnail"><img src="/images/uploads/${i.filename}" alt="pics"></a>` +
                '</div>'
            imgsTempStr += tempStr
        })

        let time = formatTime(item.time);

        $("#results").prepend(`<div class="media" story-id="${item._id}" >\n` +
            '                       <div class="media-left">\n' +
            '                         <a href="#">\n' +
            '                           <img class="media-object" src="/images/icons/user.svg" alt="user">\n' +
            '                     </a>\n' +
            '                   </div>\n' +
            `                       <div class="media-body" story-id="${item._id}">\n` +
            '                         <p class="media-heading">\n' +
            `                         <a href="#" class="user-name" user-id="${item.user_id}" onclick="getUserStories(${item.user_id})">${item.username}</a>\n` +
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
    for (var index = 0; index < 5; index++) {
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
 * open the camera
 */
function openMedia() {
    let constraints = {
        video: {},
        audio: false
    };
    //获得video摄像头
    let video = document.getElementById('video');
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then((mediaStream) => {
        mediaStreamTrack = typeof mediaStream.stop === 'function' ? mediaStream : mediaStream.getTracks()[0];
        video.srcObject = mediaStream;
        video.play();
    });
}

/**
 * take photos
 */
function takePhoto() {
    //获得Canvas对象
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let width = $('#video').width();
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, 200);
}

/**
 * close the camera
 */
function closeMedia() {
    if (uploadFiles.length === 3) {
        $("#upload-pics").hide();
        $("#camera").hide();
    }
    ;
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    mediaStreamTrack.stop();

}

/**
 * save photos to the dialog
 */
function savePhoto() {
    if (!isCanvasBlank(document.getElementById('canvas'))) {
        let img = document.getElementById('canvas').toDataURL();
        let blob = changeDataUrlToBlob(img);
        let file = new File([blob], Math.random().toString(36).slice(-8) + '.jpeg', {type: "image/jpeg"})
        addPics(file);
        $('#cameraModal').modal('hide');
    } else {
        alert("Please take a photo")
    }

}

/**
 * change base64 to blob
 */
function changeDataUrlToBlob(cutAvater) {
    let arr = cutAvater.split(',')
    let data = window.atob(arr[1])
    let mime = arr[0].match(/:(.*?);/)[1]
    let ia = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
    }
    return new Blob([ia], {type: mime})
}

/**
 * check if the user take photos
 */
function isCanvasBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() == blank.toDataURL();
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