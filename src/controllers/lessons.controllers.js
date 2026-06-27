const createError = require("http-errors");
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

        const query = {'visibility' : 'Public'};

        
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

            case "comments":
                sortOption = { commentsCount: -1 };
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
        console.log(error);
        next(error);
    }
};




const handleGetSingleLessons = async (req, res, next) => {
    try { 
        const id = req.params.id;

        const lesson = await Lesson.findOne({_id: id});



        return successResponse(res, {
            statusCode: 200,
            message: "Lesson fetched successfully.",
            payload: lesson,
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};




const handleUpdateLesson = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const {
          title,
          description,
          category,
          emotionalTone,
          visibility,
          accessLevel,
          image,
      } = req.body;

      

      const lesson = await Lesson.findById(id);
      console.log(lesson, req.body);

      if (!lesson) {
          throw createError(404, 'Lesson not found.');
      }

      // Owner check
      if (lesson.creatorId.toString() !== req.user.id) {
          throw createError(403, 'Unauthorized access.');
      }

      // Premium lesson protection
      if ( accessLevel === "Premium" && !req.user.isPremium ) {
          throw createError(403, 'Only premium users can create premium lessons')
      }

      const updatedLesson = await Lesson.findByIdAndUpdate(
          {_id: id},
          {
              title,
              description,
              category,
              emotionalTone,
              visibility,
              accessLevel,
              image,
          },
          {
              returnDocument: 'after',
              runValidators: true,
          }
      ); 

        return successResponse(res, {
            statusCode: 200,
            message: "Lesson updated successfully",
            payload: updatedLesson,
        });
    } catch (error) {
      next(error);
    }
};




const handleDeleteLesson = async (req, res, next) => {
    try {
      const { id } = req.params; 

      const lesson = await Lesson.findById(id); 

      if (!lesson) {
          throw createError(404, 'Lesson not found.');
      }

      // Owner check
      if (lesson.creatorId.toString() !== req.user.id) {
          throw createError(403, 'Unauthorized access.');
      } 

      const deletedLesson = await Lesson.findOneAndDelete(
          {_id: id} 
      ); 

        return successResponse(res, {
            statusCode: 200,
            message: "Lesson updated successfully",
            payload: deletedLesson,
        });
    } catch (error) {
      next(error);
    }
};




// get my lessons 
const handleGetMyLessons = async (req, res, next) => {
    try {
        const userId = req.user.id;

        console.log('get my lessons')

        const lessons = await Lesson.find({
          creatorId: userId,
        }).sort({
          createdAt: -1,
        });


        return successResponse(res, {
            statusCode: 200,
            message: "Lesson fetched successfully.",
            payload: lessons,
        });
    } catch (error) { 
      next(error);
    }
};




// get my lessons 
const handleGetRecentLessons = async (req, res, next) => {
    try {
        const userId = req.user.id; 

        const lessons = await Lesson.find(
            { creatorId: userId}
        ).sort({ createdAt: -1}).limit(5);
        console.log(lessons, 'recent lessons');


        return successResponse(res, {
            statusCode: 200,
            message: "Lesson fetched successfully.",
            payload: lessons,
        });
    } catch (error) { 
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




const handleSaveLessons = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const user = req.user;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw createError(404, "Lesson not found");
    }

    const alreadySave = lesson.favorites.includes(user.id);

    if (alreadySave) {
      lesson.favorites = lesson.favorites.filter(
        (id) => id.toString() !== user.id.toString()
      );

      lesson.favoritesCount = Math.max(0, lesson.favoritesCount - 1);
    } else {
      lesson.favorites.push(user.id);
      lesson.favoritesCount += 1;
    }

    await lesson.save();

    return successResponse(res, {
      statusCode: 200,
      message: alreadySave
        ? "Lesson unliked successfully."
        : "Lesson liked successfully.",
      payload: {
        likesCount: lesson.favoritesCount,
        isLiked: !alreadySave,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};




const handleFeaturedLessons = async (req, res, next) => {
    try {
        const lessons = await Lesson.find({isFeatured: true})
        if(!lessons){
            createError(404, 'Lessons not found!')
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Lesson return successfully.",
            payload: lessons,
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};















module.exports = { 
    handleCreateLessons, 
    handleGetAllLessons,
    handleGetSingleLessons,
    handleGetMyLessons,
    handleGetRecentLessons,

    handleLikeLessons, 
    handleSaveLessons,


    handleUpdateLesson, 
    handleDeleteLesson,
    handleFeaturedLessons
}