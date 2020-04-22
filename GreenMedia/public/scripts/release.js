// modal function
var uploadFiles = [];
var socket = io.connect('https://localhost:3000');

$("#add-pics").on("change", function () {
    if (uploadFiles.length === 3) {
        $("#upload-pics").hide();
    }
});


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
    sendAjaxInsert('/release-moments', onSubmit());
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
    formData.append("id",localStorage.getItem("user_id"));
    return formData;
}

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
}
