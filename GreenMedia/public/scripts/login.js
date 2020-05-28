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
                localStorage.setItem("isOnline", "true");
                localStorage.setItem("sort_by", "timeline");
                getStories()
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * logout
 */
function logout() {
    localStorage.clear()
    $('#loginModel').css('display', 'block')
}

/**
 * import init json
 */
function importData(obj) {
    console.log(initData);
    if (initData.name === null) {
        console.log(obj.files);
        Array.from(obj.files).forEach((value, index) => {
            initData.value = value;
            initData.name = value.name;
            $('#initFile').text(value.name);
            $("#removeInitFileButton").css('display', 'block')
        })

    } else {
        alert("You have upload init data")
    }


}



/**
 * submit init json
 */
function submitImportData() {
    let formData = new FormData();
    formData.append('initFile', initData.value, initData.name);

    $.ajax({
        url: '/init-data',
        data: formData,
        dataType: 'JSON',
        contentType: false,
        processData: false,
        type: 'post',
        success: function (dataR) {
            alert("Load successfully!");
            $('#initModal').modal('hide');
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}


/**
 * remove init json
 */
function removeInitFile() {
    initData.value = null;
    initData.name = null;
    $('#initFile').text("null");
    $('#initUpload').val(null);
    $("#removeInitFileButton").css('display', 'none')
}
