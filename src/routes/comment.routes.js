const express = require("express");


const { isLoggedIn } = require("../middlewares/auth");
const { handleCreateComment, handleGetLessonComments } = require("../controllers/comment.controllers");


const commentRouter = express.Router();

// post api/comments
commentRouter.post(
    "/",
    isLoggedIn,
    handleCreateComment
);


// get api/comments/:lessonId
commentRouter.get(
    "/:lessonId", 
    handleGetLessonComments
);
 



module.exports = commentRouter;