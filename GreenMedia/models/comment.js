var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Comment = new Schema(
    {
        user_id: {type: String, required: true, max: 100},
        story_id: {type: String, required: true, max: 100},
        user_name: {type: String},
        text: {type: String,max: 100},
    }
);


var commentModel = mongoose.model('Comment', Comment,'comment' );

module.exports = commentModel;
