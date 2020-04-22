var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Release = new Schema(
    {

        user_id: {type: String, required: true, max: 100},
        username:{type:String,required: true},
        mention:{type:String,max:100},
        pics: {type: Array}
    }
);


var releaseModel = mongoose.model('Release', Release,'release' );

module.exports = releaseModel;
