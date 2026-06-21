const express = require('express'); 
const { isLoggedIn } = require('../middlewares/auth');
const { handleCreateLessons, handleGetAllLessons, handleLikeLessons } = require('../controllers/lessons.controllers');
const { upload } = require('../middlewares/upload');
const lessonRouter = express();

// post api/lessons/
lessonRouter.post(
    '/',
    upload.single('image'),
    isLoggedIn,
    handleCreateLessons
);


// post api/lessons/
lessonRouter.get(
    '/all-lessons', 
    isLoggedIn,
    handleGetAllLessons
);


// put api/lessons/
lessonRouter.put(
    '/like-lesson/:lessonId', 
    isLoggedIn,
    handleLikeLessons
);



module.exports = lessonRouter;