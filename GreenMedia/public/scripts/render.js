/**
 * DOM manipulation for render.
 */


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