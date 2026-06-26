const express = require("express");
const { handleCreateReport } = require("../controllers/report.controllers");
const { isLoggedIn } = require("../middlewares/auth");
const { handleGetProfileStats, handleGetFavoritesLessons, handleGetMyPublicLessons, handleRemoveFavorite } = require("../controllers/users.controllers");

const userRouter = express.Router();


// post api/users
userRouter.get(
    '/stats', 
    isLoggedIn, 
    handleGetProfileStats
);


// post api/users
userRouter.get(
    '/my-public-lessons', 
    isLoggedIn, 
    handleGetMyPublicLessons
);


// post api/users
userRouter.get(
    '/profile-stats', 
    isLoggedIn, 
    handleGetProfileStats
); 
 



module.exports = userRouter;