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
