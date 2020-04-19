var dbPromise;

var DB_NAME = "db-green-media";
var STORE_BLOG = "store-blog";
var STORE_IMAGE = "store-image";


/**
 * Init IDB
 */
function initDB() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDB) {
        if (!upgradeDB.objectStoreNames.contains(DB_NAME)) {
            initBlogDB(upgradeDB);
            initImageDB(upgradeDB);
        }
    })
}

/**
 * init blog storage
 * @param upgradeDB
 */
function initBlogDB(upgradeDB) {
    var blogDB = upgradeDB.createObjectStore(STORE_BLOG, {keyPath: "_id"});
    blogDB.createIndex("_id", "_id", {unique: true});
    blogDB.createIndex("blog.id", "event.id", {unique: false, multiEntry: true});
    blogDB.createIndex("blog.name", "event.name", {unique: false, multiEntry: true});
    blogDB.createIndex("date", "date", {unique: false, multiEntry: true});
    blogDB.createIndex("user.id", "user.id", {unique: false, multiEntry: true})
}

/**
 * init image storage
 * @param upgradeDB
 */
function initImageDB(upgradeDB) {
    var imageDB = upgradeDB.createObjectStore(STORE_IMAGE, {keyPath: "path"});
    imageDB.createIndex("path", "path", {unique: true});
    imageDB.createIndex("id", "id", {unique: false, multiEntry: true})
}

if ("indexedDB" in window) {
    initDB()
} else {
    console.log("This browser doesn't support IndexedDB")
}