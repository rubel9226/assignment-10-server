const createError = require("http-errors");
const { ObjectId } = require("mongodb");
const Lesson = require("../models/lesson.modal");
const { successResponse } = require("./response.controllers");



const handleGetProfileStats = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw createError(404, 'User not found.');
        }

        const totalLessons = await Lesson.countDocuments({
            creatorId: user.id.toString(),
        }); 


        const publicLessons = await Lesson.countDocuments({
            creatorId: user.id.toString(),
            visibility: "Public",
        }); 


        const totalLikes = await Lesson.countDocuments({
            likes: user.id.toString(),
        });


        const totalFavorites = await Lesson.countDocuments({
            favorites: user.id.toString(),
        }); 


        return successResponse(res, {
            statusCode: 200,
            message: "Stats returned successfully",
            payload: {
                totalLessons,
                publicLessons,
                totalFavorites,
                totalLikes, 
            },
        }); 
    } catch (error) {
        next(error);
    }
};



const handleGetFavoritesLessons = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw createError(404, 'User not found.');
        };


        const favorites = await Lesson.find({
            favorites: user.id.toString(),
        }); 


        return successResponse(res, {
            statusCode: 200,
            message: "Favorites returned successfully.",
            payload: favorites,
        }); 
    } catch (error) {
        next(error);
    }
};




// get my lessons 
const handleGetMyPublicLessons = async (req, res, next) => {
    try {
        const userId = req.user.id; 

        const lessons = await Lesson.find({
          creatorId: userId,
          visibility: 'Public'
        }).sort({createdAt: -1});


        return successResponse(res, {
            statusCode: 200,
            message: "Public lessons fetched successfully.",
            payload: lessons,
        });
    } catch (error) { 
      next(error);
    }
};






module.exports = {
  handleGetProfileStats,
  handleGetFavoritesLessons, 
  handleGetMyPublicLessons
};