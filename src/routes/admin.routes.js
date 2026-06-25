const express = require("express");
const { handleCreateReport } = require("../controllers/report.controllers");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { handleGetProfileStatsAdmins, handleGetTopContributors, handleGetUserGrowth, handleGetLessonGrowth, handleGetAdminsStats, handleGetUsers, handleCreateAdmin } = require("../controllers/Admins.container");


const adminRouter = express.Router();


// post api/admins
adminRouter.get(
    '/users', 
    isLoggedIn,
    isAdmin,
    handleGetUsers
); 

// post api/admins
adminRouter.patch(
    '/create-admin/:id', 
    isLoggedIn,
    isAdmin,
    handleCreateAdmin
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


module.exports = adminRouter;