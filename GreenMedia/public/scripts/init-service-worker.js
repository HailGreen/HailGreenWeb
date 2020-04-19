var path = window.location.pathname;
console.log("current path", path);

if ("serviceWorker" in navigator) {
    // note: need to notice the scriptURL -- it is a relative path;
    // note: need to notice the scope -- need to register different url in different pages (current url)
    navigator.serviceWorker.register("/service-worker.js", {scope: path}).then(function (reg) {
        // registration worked
        console.log("Registration succeeded. Scope is " + reg.scope);
    }).catch(function (error) {
        // registration failed
        console.log("Registration failed with " + error);
    });
}