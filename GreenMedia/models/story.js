var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema(
    {

        user_id: {type: String, required: true, max: 100},
        username:{type:String,required: true},
        mention:{type:String,max:100},
        pics: {type: Array},
        time:{type:Date},
    }
);


var storyModel = mongoose.model('Story', Story,'story' );

module.exports = storyModel;
