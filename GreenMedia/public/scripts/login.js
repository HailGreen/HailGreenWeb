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