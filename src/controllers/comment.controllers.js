const Comment = require("../models/comment.modal");
const Lesson = require("../models/lesson.modal");
const { successResponse } = require("./response.controllers");


// create comment
const handleCreateComment = async(req, res, next)=>{
    try{
        const {
            lessonId,
            text,
            userId,
            userName,
            userPhoto
        } = req.body;

        console.log(req.body)


        const comment = await Comment.create({
            lessonId,
            text,
            userId,
            userName,
            userPhoto
        });


        await Lesson.findByIdAndUpdate(
            lessonId,
            {
                $inc:{
                    commentsCount:1
                }
            }
        );
 
        return successResponse(res, {
            statusCode: 200, 
            message: 'Comment create successfully.',
            payload: comment,
        });
    }catch(error){
        next(error);
    } 
}



// get comments 
const handleGetLessonComments = async(req, res, next)=>{
    try{
        const {lessonId} = req.params;
        console.log(lessonId);

        const comments = await Comment
            .find({
                lessonId: lessonId
            })
            .sort({
                createdAt:-1
            });
        console.log(comments); 

        return successResponse(res, {
            statusCode: 200, 
            message: 'Comments return successfully.',
            payload: comments,
        });
    }catch(error){
        next(error);

    } 
}




module.exports = { handleCreateComment, handleGetLessonComments }