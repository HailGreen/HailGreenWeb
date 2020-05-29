let param = new getRequest();
$('#personalWallTitle').text(param.user_name + '')
getUserStories(param.user_id)


/**
 * get param from url
 * @returns {Object}
 * @constructor
 */
function getRequest() {
    const url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/**
 * get stories posted by certain user,
 * show someone's personal wall
 * @param user_id
 */
function getUserStories(user_id) {
    if (localStorage.getItem('isOnline') === 'false') {
        alert('You are OFFLINE now')
    } else {
        var user = {};
        user['user_id'] = user_id
        $.ajax({
            url: '/show-personal-wall',
            data: user,
            dataType: 'JSON',
            type: 'POST',
            success: function (dataR) {
                $("#results").html('')
                let storyIds = []
                dataR.forEach(item=>{
                    storyIds.push(item.story_id)
                })

                getStoryStars(storyIds)




                // dataR.forEach((item) => {
                //     let time = formatTime(item.time);
                //     let imgsTempStr = ``
                //     item.pics.forEach((i) => {
                //         let tempStr = '<div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">\n' +
                //             `<a href="#" class="thumbnail"><img src="/images/uploads/${i.filename}" alt="pics"></a>` +
                //             '</div>'
                //         imgsTempStr += tempStr
                //     })
                //
                //
                //     $("#results").prepend(`<div class="media" story-id="${item.story_id}" >\n` +
                //         `                       <div class="media-body" story-id="${item.story_id}">\n` +
                //         '                         <p class="media-heading">\n' +
                //         `                         <p class="time">${time}</p></p>\n` +
                //         `                         <p id="text">${item.mention}</p>\n` +
                //         '                     <div class="row">\n' +
                //         imgsTempStr +
                //         '                       </div>\n' +
                //         '                     <div>\n' +
                //         `                       <ul class="list-group" id="ul1" story-id="${item.story_id}">\n` +
                //         '                       </ul>\n' +
                //         '                     </div>\n' +
                //         '                   </div>\n' +
                //         '                     </div>')
                //
                //     getStoryStars(item.story_id)
                // });
            },
            error: function (xhr, status, error) {
                alert('Error: ' + error.message);
            }
        });
    }
}


/**
 * When the client gets off-line
 */
window.addEventListener('offline', function (e) {
    localStorage.setItem("isOnline", "false");
}, false);

/**
 * When the client gets online
 */
window.addEventListener('online', function (e) {
    localStorage.setItem("isOnline", "true");
}, false);