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

/**
 * add pics in story
 */
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
    let formData = new FormData();
    formArray.forEach(val => {
        formData.append(val.name, val.value);
    });
    uploadFiles.forEach(val => {
        formData.append('files', val.value, val.name);
    })
    formData.append("id", localStorage.getItem("user_id"));
    formData.append("username", localStorage.getItem("user_name"));
    formData.append("story_id", new Date().getTime());
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

