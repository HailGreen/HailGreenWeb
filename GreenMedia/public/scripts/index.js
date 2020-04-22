
/**
 * send ajax to the databse and save the information of user
 */
$(function(){
    let url='/get_user';
    let data={userName:'sysadmin'};
    $.ajax({
        url: url,
        data: data,
        dataType: 'JSON',
        type: 'Post',
        success: function (dataR) {
            console.log(dataR.user_name)
            localStorage.setItem('user_id', dataR.user_id);
            localStorage.setItem('user_name', dataR.user_name);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
});


/**
 * import head part of the HTML
 */
$("#head").load("/head");


/**
 * import release button and model part of the HTML
 */
$("#release").load("/release");


/**
 * import story part of the HTML
 */
$("#show-story").load("/show-story");


/**
 * socket io
 */
var socket = io.connect('https://localhost:3000');
socket.emit('connected');
