window.onload=function () {
    alert("yes")
}

function addComment() {
    initStories()
    $("#ul1").prepend('<li class="list-group-item" id="comment-li">\n' +
        '                                <textarea class="comment-textarea"></textarea>\n' +
        '                                <div class="float-right" onclick="removeComment()"><span class="glyphicon glyphicon-remove no-icon-word-button" aria-hidden="true"  ></span></div>\n' +
        '                                <button class="btn btn-primary btn-sm float-right"  id="submit-button" onclick="make()">submit</button>\n' +
        '                            </li>');
}

function removeComment() {
    $("#comment-li").remove();
}

function like() {
    alert("like")
}

function initStories() {
    console.log("initStories")
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register("/scripts/service-worker.js")
            .then(function () {
                console.log('Service Worker Registered')
            })
    }
}

function getStories() {
    var url = '/show-story';
    var user = {};
    user['user_id'] = '1';
    sendAjaxQuery(url, user);
    event.preventDefault();
}

function sendAjaxQuery(url, user) {
    $.ajax({
        url: url,
        data: user,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            console.log("get successfully")

            // catch response data to indexedDB
            const result = Object.values({...dataR})
            result.forEach((item) => {
                storeCachedData("_id", item, STORE_STORIES)
            })

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
            // get indexedDB cache

            getStoriesInIndexedDB()
        }
    });
}


function likeRate(obj) {
    starValue = obj.getAttribute('value')
    for (var index = 1; index <= 5; index++) {
        if (index <= starValue) {
            $(`span[value=${index}]`).attr('class', 'glyphicon glyphicon-star')
        } else {
            $(`span[value=${index}]`).attr('class', 'glyphicon glyphicon-star glyphicon-star-empty')
        }
    }
}


function getStoriesInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("post success");
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
                console.log(res)
            } else {
                console.log("res of posts", res);
            }
        }
    }
}

