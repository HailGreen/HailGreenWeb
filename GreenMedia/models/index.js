var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IndexUser = new Schema(
    {
        username:{type: String, required: true, max: 100},
    }
);


var indexUserModel = mongoose.model('IndexUser', IndexUser,'user');

module.exports = indexUserModel;
