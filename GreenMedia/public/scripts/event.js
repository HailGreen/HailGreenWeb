/**
 * When the client gets off-line, it hides release button
 */
window.addEventListener('offline', function (e) {
    // Queue up events for server.
    showOffline();
}, false);

/**
 * When the client gets online, it show release button
 */
window.addEventListener('online', function (e) {
    // Resync data with server.
    hideOffline();
    getStories();
}, false);


/**
 * the function to hide release button
 */
function showOffline() {
    localStorage.setItem("isOnline", "false");
}


/**
 * the function to display release button
 */
function hideOffline() {
    localStorage.setItem("isOnline", "true");
}