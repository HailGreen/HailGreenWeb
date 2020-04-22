var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Star = new Schema(
    {
        user_id: {type: String, required: true, max: 100},
        story_id: {type: String, required: true, max: 100},
        rate: {type: Number},
    }
);


var starModel = mongoose.model('Star', Star,'star' );

module.exports = starModel;
