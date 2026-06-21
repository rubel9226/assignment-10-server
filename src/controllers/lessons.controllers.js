const cloudinary = require("../config/cloudinary");
const Lesson = require("../models/lesson.modal");
const { successResponse } = require("./response.controllers");


const handleCreateLessons =async (req, res, next) => {
    try { 
        const {
            title,
            description,
            category,
            emotionalTone, 
            visibility,
            accessLevel,
        } = req.body;

        const user = req.user;
        const data = {
            title,
            description,
            category,
            emotionalTone, 
            visibility,
            accessLevel: accessLevel,

            creatorId: user?.id,
            creatorName: user?.name,
            creatorEmail: user?.email,
            creatorPhoto: user?.image,

            likes: [],
            likesCount: 0,
            favoritesCount: 0,
            commentsCount: 0,
            viewsCount: 0,
        }
        


        const image = req?.file?.path;
        let newImage = '';
        if(image){
            const response = await cloudinary.uploader.upload(image, {
                folder: 'assignment_10/images'
            }); 
            newImage = response.secure_url;
        }
        if(newImage){
            data.image = newImage;
        }
        console.log(data)

        const lesson = await Lesson.create( data );
        
        console.log(lesson);

        return successResponse(res, {
            statusCode: 200, 
            message: 'Lesson create successfully.',
            payload: lesson,
        }) 
    } catch (error) { 
      console.log(error.message)
        next(error)
    }
};




const handleGetAllLessons = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = "",
            category,
            emotionalTone,
            accessLevel,
            sort = "latest",
        } = req.query;

        const query = {};

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Filters
        if (category) {
            query.category = category;
        }

        if (emotionalTone) {
            query.emotionalTone = emotionalTone;
        }

        if (accessLevel) {
            query.accessLevel = accessLevel;
        }

        // Sort
        let sortOption = {};

        switch (sort) {
            case "likes":
                sortOption = { likesCount: -1 };
                break;

            case "views":
                sortOption = { viewsCount: -1 };
                break;

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            default:
            sortOption = { createdAt: -1 };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [lessons, total] = await Promise.all([
            Lesson.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit)),

            Lesson.countDocuments(query),
        ]);

        return successResponse(res, {
            statusCode: 200,
            message: "Lessons fetched successfully.",
            payload: {
                lessons,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};




const handleLikeLessons = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const user = req.user;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw createError(404, "Lesson not found");
    }

    const alreadyLiked = lesson.likes.includes(user.id);

    if (alreadyLiked) {
      lesson.likes = lesson.likes.filter(
        (id) => id.toString() !== user.id.toString()
      );

      lesson.likesCount = Math.max(0, lesson.likesCount - 1);
    } else {
      lesson.likes.push(user.id);
      lesson.likesCount += 1;
    }

    await lesson.save();

    return successResponse(res, {
      statusCode: 200,
      message: alreadyLiked
        ? "Lesson unliked successfully."
        : "Lesson liked successfully.",
      payload: {
        likesCount: lesson.likesCount,
        isLiked: !alreadyLiked,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};










module.exports = { 
    handleCreateLessons, 
    handleGetAllLessons,
    handleLikeLessons
}