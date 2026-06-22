const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema(
{
    lessonId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Lesson",
        required:true
    },

    userId:{
        type:String,
        required:true
    },

    userName:{
        type:String,
        required:true
    },

    userPhoto:{
        type:String,
        default:""
    },

    text:{
        type:String,
        required:true,
        trim:true
    }

},
{
    timestamps:true
}
);

 
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;