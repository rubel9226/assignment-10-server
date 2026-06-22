const express = require('express'); 
const { isLoggedIn } = require('../middlewares/auth');
const { handleCreateLessons, handleGetAllLessons, handleLikeLessons, handleGetSingleLessons, handleSaveLessons, handleGetMyLessons, handleUpdateLesson, handleDeleteLesson, handleGetRecentLessons } = require('../controllers/lessons.controllers');
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



// post api/lessons/
lessonRouter.get(
    '/single-lesson/:id', 
    handleGetSingleLessons
);


// post api/lessons/
lessonRouter.put(
    '/update-lesson/:id',
    isLoggedIn,
    handleUpdateLesson
);


// delete api/lessons/delete-lesson/:id
lessonRouter.delete(
    '/delete-lesson/:id',
    isLoggedIn,
    handleDeleteLesson
);


// post api/lessons/
lessonRouter.get(
    '/my-lessons', 
    isLoggedIn,
    handleGetMyLessons
);


// get api/lessons/
lessonRouter.get(
    '/recent-lessons', 
    isLoggedIn,
    handleGetRecentLessons
);


// put api/lessons/
lessonRouter.put(
    '/like-lesson/:lessonId', 
    isLoggedIn,
    handleLikeLessons
);


// put api/lessons/
lessonRouter.put(
    '/save-unsave/:lessonId', 
    isLoggedIn,
    handleSaveLessons
);



module.exports = lessonRouter;