/**
 * socket io
 */
var socket = io.connect('https://localhost:3000');
socket.on('story-updated', function (count) {
    console.log("story-updated")
    $("#unread-stories").html(count)
})
socket.emit('connected')