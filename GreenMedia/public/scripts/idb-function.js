var dbPromise;

var DB_NAME = "db-green-media";
var STORE_STORIES = "store-stories";


/**
 * Init IDB
 */
function initDB() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDB) {
        if (!upgradeDB.objectStoreNames.contains(DB_NAME)) {
            initStoriesDB(upgradeDB);
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
    // console.log("inserting:", JSON.stringify(obj));
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
            console.log("add to indexedDB", JSON.stringify(obj))
        }).catch(function () {
            localStorage.setItem(index, JSON.stringify(obj))
        });
    } else {
        localStorage.setItem(index, JSON.stringify(obj))
    }
}

if ("indexedDB" in window) {
    initDB()
} else {
    console.log("IndexedDB is not supported by this browser!")
}