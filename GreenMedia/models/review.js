var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Review = new Schema(
    {
        user_id: {type: String, required: true, max: 100},
        story_id: {type: String, required: true, max: 100},
        comment: {type: String,max: 100},
        like: {type: Number}
    }
);


var reviewModel = mongoose.model('Review', Review,'review' );

module.exports = reviewModel;
