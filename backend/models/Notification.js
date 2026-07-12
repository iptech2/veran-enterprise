const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    title:{
        type:String,
        required:true,
    },

    message:{
        type:String,
        required:true,
    },

    type:{
        type:String,
        enum:[
            "deposit",
            "withdrawal",
            "investment",
            "profit",
            "referral",
            "system",
        ],
        default:"system",
    },

    isRead:{
        type:Boolean,
        default:false,
    },

},
{
    timestamps:true,
}
);

module.exports=mongoose.model(
"Notification",
NotificationSchema
);