const express = require("express");
const { handleCreateReport } = require("../controllers/report.controllers");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { handleGetProfileStatsAdmins, handleGetTopContributors, handleGetUserGrowth, handleGetLessonGrowth, handleGetAdminsStats, handleGetUsers, handleCreateAdmin, handleFeaturedLessons, handleReviewedLessons, handleGetAllLessonsAdmin, handleDeleteLessons, handleGetLessonsStats, handleGetReportsStats, handleGetReportsLessons, handleIgnoreLessons } = require("../controllers/Admins.container");


const adminRouter = express.Router();


// post api/admins
adminRouter.get(
    '/all-lessons', 
    isLoggedIn,
    isAdmin,
    handleGetAllLessonsAdmin
); 


// post api/admins
adminRouter.get(
    '/users', 
    isLoggedIn,
    isAdmin,
    handleGetUsers
); 



// post api/admins
adminRouter.get(
    '/admins-stats', 
    isLoggedIn,
    isAdmin,
    handleGetAdminsStats
); 


// post api/admins
adminRouter.get(
    '/user-stats', 
    isLoggedIn,
    isAdmin,
    handleGetProfileStatsAdmins
); 


// post api/admins
adminRouter.get(
    '/lessons-stats', 
    isLoggedIn,
    isAdmin,
    handleGetLessonsStats
); 


// post api/admins
adminRouter.get(
    '/top-contributors',
    handleGetTopContributors
); 


// post api/admins
adminRouter.get(
    '/user-growth',
    isLoggedIn,
    isAdmin,
    handleGetUserGrowth
); 


// post api/admins
adminRouter.get(
    '/lessons-growth',
    isLoggedIn,
    isAdmin,
    handleGetLessonGrowth
);




// post api/admins
adminRouter.patch(
    '/create-admin/:id', 
    isLoggedIn,
    isAdmin,
    handleCreateAdmin
);



// post api/admins
adminRouter.patch(
    '/feature-lesson/:id',
    isLoggedIn,
    isAdmin,
    handleFeaturedLessons
);


// post api/admins
adminRouter.patch(
    '/review-lesson/:id',
    isLoggedIn,
    isAdmin,
    handleReviewedLessons
);


// post api/admins
adminRouter.patch(
    '/delete-lesson/:id',
    isLoggedIn,
    isAdmin,
    handleDeleteLessons
);


// post api/admins
adminRouter.patch(
    '/ignore-lesson/:id',
    // isLoggedIn,
    // isAdmin,
    handleIgnoreLessons
);


// post api/admins
adminRouter.get(
    '/reports-stats', 
    isLoggedIn,
    isAdmin,
    handleGetReportsStats
); 


// post api/admins
adminRouter.get(
    '/reports-lessons', 
    isLoggedIn,
    isAdmin,
    handleGetReportsLessons
); 




module.exports = adminRouter;