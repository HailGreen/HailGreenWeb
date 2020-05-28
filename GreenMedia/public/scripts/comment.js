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
