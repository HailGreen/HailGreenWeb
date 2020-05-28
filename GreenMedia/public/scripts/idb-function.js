var dbPromise;

var DB_NAME = "db-green-media";
var STORE_STORIES = "store-stories";
var STORE_COMMENTS = "store-comments";
var STORE_STARS = "store-stars"
var STORIES_TO_SYNC = "stories-to-sync"


/**
 * Init IDB
 */
function initDB() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDB) {
        if (!upgradeDB.objectStoreNames.contains(DB_NAME)) {
            initStoriesDB(upgradeDB)
            initCommentDB(upgradeDB)
            initStarsDB(upgradeDB)
            initStories2SyncDB(upgradeDB)
        }
    })
}

/**
 * init stories storage
 * @param upgradeDB
 */
function initStoriesDB(upgradeDB) {
    var blogDB = upgradeDB.createObjectStore(STORE_STORIES, {keyPath: "_id"});
    blogDB.createIndex("_id", "_id", {unique: true});
    blogDB.createIndex("pics", "pics", {unique: false, multiEntry: true});
    blogDB.createIndex("user_id", "user_id", {unique: false, multiEntry: true});
    blogDB.createIndex("mention", "mention", {unique: false, multiEntry: true});
}

/**
 * init stories storage
 * @param upgradeDB
 */
function initStories2SyncDB(upgradeDB) {
    var blogDB = upgradeDB.createObjectStore(STORIES_TO_SYNC, {keyPath: "_id", autoIncrement: true});
    blogDB.createIndex("pics", "pics", {unique: false, multiEntry: true});
    blogDB.createIndex("user_id", "user_id", {unique: false, multiEntry: true});
    blogDB.createIndex("mention", "mention", {unique: false, multiEntry: true});
}

/**
 * init comment db
 * @param upgradeDB
 */
function initCommentDB(upgradeDB) {
    var blogDB = upgradeDB.createObjectStore(STORE_COMMENTS, {keyPath: "_id"});
    blogDB.createIndex("_id", "_id", {unique: true});
    blogDB.createIndex("user_id", "user_id", {unique: false, multiEntry: true});
    blogDB.createIndex("story_id", "story_id", {unique: false, multiEntry: true});
    blogDB.createIndex("user_name", "user_name", {unique: false, multiEntry: true});
    blogDB.createIndex("text", "text", {unique: false, multiEntry: true});
    blogDB.createIndex("_v", "_v", {unique: false, multiEntry: true});

}

/**
 * init like rate stars db
 * @param upgradeDB
 */
function initStarsDB(upgradeDB) {
    var blogDB = upgradeDB.createObjectStore(STORE_STARS, {keyPath: "_id"});
    blogDB.createIndex("_id", "_id", {unique: true});
    blogDB.createIndex("user_id", "user_id", {unique: false, multiEntry: true});
    blogDB.createIndex("story_id", "story_id", {unique: false, multiEntry: true});
    blogDB.createIndex("rate", "rate", {unique: false, multiEntry: true});
    blogDB.createIndex("_v", "_v", {unique: false, multiEntry: true});

}

/**
 * Return a PROMISE for async putting date into the IDB.
 * @param db the store name of IDB
 * @param obj the object that is going to store in the IDB store.
 */
function putData(db, obj) {
    return new Promise(function (resolve, reject) {
        if (db) {
            db.put(obj);
            resolve()
        } else {
            reject()
        }
    })
}

/**
 * Store fetched data from sever side to a store in IDB.
 * @param index the IDB index
 * @param obj the storing object
 * @param STORE_NAME the specific IDB store name
 */
function storeCachedData(index, obj, STORE_NAME) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(STORE_NAME, "readwrite");
            var store = tx.objectStore(STORE_NAME);
            putData(store, obj).then(function (value) {
                return tx.complete
            }).catch(function (reason) {
                console.log("put error")
            })
        }).then(function (value) {
        }).catch(function () {
            localStorage.setItem(index, JSON.stringify(obj))
        });
    } else {
        localStorage.setItem(index, JSON.stringify(obj))
    }
}


/**
 * check if the window support indexedDB
 */
if ("indexedDB" in window) {
    initDB()
} else {
    console.log("IndexedDB is not supported by this browser!")
}


/**
 * get stories from indexedDB -> display -> get comments & stars
 */
function getStoriesInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORE_STORIES], "readonly");
        var store = tx.objectStore(STORE_STORIES);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);

                showStoriesList(res.reverse())
                getCommentInIndexedDB()
                getStarsInIndexedDB()
            }
        }
    }
}

/**
 * get comments from indexedDB -> amount to story
 */
function getCommentInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORE_COMMENTS], "readonly");
        var store = tx.objectStore(STORE_COMMENTS);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);
                // showStoriesList(res)
                res.forEach(item => {
                    changeCommentShow(item.text, item.user_name, item.story_id)
                })
            }
        }
    }
}

/**
 * get stars from indexedDB -> amount to story
 */
function getStarsInIndexedDB() {
    var req = window.indexedDB.open(DB_NAME, 1);
    req.onsuccess = function (ev) {
        console.log("indexed db connect success");
        var db = ev.target.result;
        var tx = db.transaction([STORE_STARS], "readonly");
        var store = tx.objectStore(STORE_STARS);
        var r = store.openCursor();
        var res = [];
        r.onsuccess = function (ev1) {
            var cursor = ev1.target.result;
            if (cursor) {
                res.push(cursor.value);
                cursor.continue()
            } else {
                console.log("res of posts", res);
                res.forEach((item) => {
                    changeStarShow(item.rate, item.story_id)
                })
            }
        }
    }
}
