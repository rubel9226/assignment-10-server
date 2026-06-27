const createError = require("http-errors");
const Lesson = require("../models/lesson.modal");
const User = require("../models/users.modal");
const { successResponse } = require("./response.controllers");
const Report = require("../models/report.modal");




const handleGetAllLessonsAdmin = async (req, res, next) => {
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

        console.log(category, sort)

        const query = { };

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
            case "Reviewed":
                query.isReviewed = true;
                break;

            case "Featured":
                query.isFeatured = true;
                break;

            case "Public":
                query.visibility = 'Public';
                break;

            case "Private":
                query.visibility = 'Private';
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




const handleGetUsers = async (req, res, next) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: "lessons",
                    localField: "_id",
                    foreignField: "creatorId",
                    as: "lessons",
                },
            },
            {
                $addFields: {
                    totalLessons: {
                        $size: "$lessons",
                    },
                },
            },
            {
                $project: {
                    lessons: 0,
                },
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);


        return successResponse(res, {
            statusCode: 200,
            message: "Users stats returned successfully",
            payload: users,
        });
    } catch (error) {
        console.log(error?.message)
        next(error);
    }
};




const handleCreateAdmin = async (req, res, next) => {
    try {
        const {id} = req.params;
        const admin = await User.findByIdAndUpdate(
            {_id: id},
            {
                isAdmin: true,
            },
            {returnDocument: "after"}
        );
        

        return successResponse(res, {
            statusCode: 200,
            message: "Users stats returned successfully",
            payload: admin,
        });
    } catch (error) {
        console.log(error?.message)
        next(error);
    }
};



const handleGetAdminsStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalAdmins = await User.countDocuments({
            isAdmin: true,
        });

        const totalRegularUsers = await User.countDocuments({
            isAdmin: false,
        });

        return successResponse(res, {
            statusCode: 200,
            message: "Users stats returned successfully",
            payload: {
                totalUsers,
                totalAdmins,
                totalRegularUsers,
            },
        });
    } catch (error) {
        next(error);
    }
};



const handleGetProfileStatsAdmins = async (req, res, next) => {
    try { 
        const totalUser = await User.countDocuments({}); 
        const totalLessons = await Lesson.countDocuments({visibility: 'Public'}); 
        const totalReports = await Report.countDocuments({});


        const startOfDay = new Date();

        startOfDay.setHours(0, 0, 0, 0);

        const todayLessons = await Lesson.countDocuments({
            createdAt: { $gte: startOfDay,
            },
        });

        console.log(todayLessons);
        

        return successResponse(res, {
            statusCode: 200,
            message: "Stats returned successfully",
            payload: {
                totalUser,
                totalLessons,
                totalReports,
                todayLessons
            },
            
        }); 

    } catch (error) {
        next(error);
    }
};



const handleGetLessonsStats = async (req, res, next) => {
    try {  
        const totalPublicLessons = await Lesson.countDocuments({visibility: 'Public'}); 
        const totalPrivateLessons = await Lesson.countDocuments({visibility: 'Private'}); 
        const totalReports = await Report.countDocuments({});
        

        return successResponse(res, {
            statusCode: 200,
            message: "Stats returned successfully",
            payload: {
                totalPublicLessons,
                totalPrivateLessons,
                totalReports
            },
            
        }); 

    } catch (error) {
        next(error);
    }
};



const handleGetTopContributors = async (req, res, next) => {
    try { 
        const topContributors = await Lesson.aggregate([
            {
                $group: {
                    _id: "$creatorId",
                    creatorName: { $first: "$creatorName" },
                    creatorImage: { $first: "$creatorPhoto" },
                    totalLessons: { $sum: 1 },
                },
            },
            {
                $sort: {
                    totalLessons: -1,
                },
            },
            {
                $limit: 5,
            },
        ]); 

        return successResponse(res, {
            statusCode: 200,
            message: "Stats returned successfully",
            payload: topContributors ,
            
        }); 
    } catch (error) {
        next(error);
    }
};



const handleGetUserGrowth = async (req, res, next) => {
    try {
        const currentMonth = new Date().getMonth() + 1;

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), 0, 1),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt",
                        },
                    },
                    users: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                "_id.month": 1,
                },
            },
        ]);

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const formattedData = months.slice(0, currentMonth)
        .map((month, index) => {
            const found = userGrowth.find(
                (item) => item._id.month === index + 1
            );

            return {
                month,
                users: found ? found.users : 0, 
            };
        });

        return successResponse(res, {
        statusCode: 200,
        message: "User growth returned successfully",
        payload: formattedData,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetLessonGrowth = async (req, res, next) => {
  try {
    const currentMonth = new Date().getMonth() + 1;

    const lessonGrowth = await Lesson.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              0,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          lessons: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = months
      .slice(0, currentMonth)
      .map((month, index) => {
        const found = lessonGrowth.find(
          (item) => item._id.month === index + 1
        );

        return {
          month,
          lessons: found ? found.lessons : 0,
        };
      });

    return successResponse(res, {
      statusCode: 200,
      message: "Lesson growth returned successfully",
      payload: formattedData,
    });
  } catch (error) {
    next(error);
  }
};



const handleFeaturedLessons = async (req, res, next) => {
    try {
        const {id} = req.params;
        const lesson = await Lesson.findOne({_id: id});

        if(!lesson){
            throw createError(404, 'Lesson not found.');
        } 
        
        if(lesson?.visibility === 'Private'){
            throw createError(404, 'Lesson was private!');
        } 
        const update ={isFeatured: !lesson?.isFeatured};
        console.log(update);

        const UpdatedLesson = await Lesson.findOneAndUpdate(
            {_id: id},
            update,
            {returnDocument: "after"}
        )
        
        return successResponse(res, {
            statusCode: 200,
            message: "Lesson growth returned successfully",
            payload: UpdatedLesson,
        });
    } catch (error) {
        next(error);
    }
};



const handleReviewedLessons = async (req, res, next) => {
    try {
        const {id} = req.params;
        const lesson = await Lesson.findOne({_id: id});

        if(!lesson){
            throw createError(404, 'Lesson not found.');
        } 
        
        if(lesson?.visibility === 'Private'){
            throw createError(404, 'Lesson was private!');
        } 
        const update ={isReviewed: !lesson?.isReviewed};
        console.log(update);

        const UpdatedLesson = await Lesson.findOneAndUpdate(
            {_id: id},
            update,
            {returnDocument: "after"}
        )
        
        return successResponse(res, {
            statusCode: 200,
            message: "Lesson growth returned successfully",
            payload: UpdatedLesson,
        });
    } catch (error) {
        next(error);
    }
};



const handleDeleteLessons = async (req, res, next) => {
    try {
        const {id} = req.params;
        const lesson = await Lesson.findByIdAndDelete({_id: id});
        
        return successResponse(res, {
            statusCode: 200,
            message: "Lesson growth returned successfully",
            payload: lesson,
        });
    } catch (error) {
        next(error);
    }
};



const handleIgnoreLessons = async (req, res, next) => {
    try {
        const {id} = req.params;
        const report = await Report.find({lessonId: id});
        
        return successResponse(res, {
            statusCode: 200,
            message: "Lesson returned successfully.",
            payload: report,
        });
    } catch (error) {
        next(error);
    }
};



const handleGetReportsStats = async (req, res, next) => {
    try {
        const totalReports = await Report.countDocuments({});
        const totalLessonsReports = await Lesson.countDocuments({reportsCount: !0});
        const totalPending = await Lesson.countDocuments({isReviewed: false});
        

        return successResponse(res, {
            statusCode: 200,
            message: "Stats returned successfully",
            payload: {
                totalLessonsReports,
                totalPending,
                totalReports
            },
            
        }); 

    } catch (error) {
        console.log(error?.message);
        next(error);
    }
};



const handleGetReportsLessons = async (req, res, next) => {
    try {
        const totalReports = await Report.countDocuments({});
        const totalLessonsReports = await Lesson.countDocuments({reportsCount: !0});
        const totalPending = await Lesson.countDocuments({isReviewed: false});
        const result = await Report.aggregate([
            {
                $group: {
                    _id: "$lessonId",
                    reportCount: { $sum: 1 },
                    reports: {
                        $push: {
                            _id: '$_id',
                            reporterEmail: "$reporterEmail",
                            reporterUserId: "$reporterUserId",
                            reason: "$reason",
                            timestamp: "$timestamp",
                        },
                    },
                },
            },

            {
                $lookup: {
                    from: "lessons",
                    localField: "_id",
                    foreignField: "_id",
                    as: "lesson",
                },
            },

            {
                $unwind: "$lesson",
            },

            {
                $project: {
                    _id: 1,
                    reportCount: 1,
                    reports: 1,

                    lessonTitle: "$lesson.title",
                    lessonCreator: "$lesson.creatorName",
                    lessonVisibility: "$lesson.visibility",
                },
            },

            {
                $sort: {
                    reportCount: -1,
                },
            },
        ]);
        

        return successResponse(res, {
            statusCode: 200,
            message: "Stats returned successfully",
            payload: result,
            
        }); 

    } catch (error) {
        console.log(error?.message);
        next(error);
    }
};



module.exports = {
    handleGetAllLessonsAdmin,
    handleGetUsers,
    handleCreateAdmin,
    handleGetAdminsStats,
    handleGetProfileStatsAdmins,
    handleGetTopContributors,
    handleGetUserGrowth,
    handleGetLessonGrowth,


    handleFeaturedLessons,
    handleReviewedLessons,
    handleDeleteLessons,
    handleGetLessonsStats,
    handleGetReportsStats,
    handleGetReportsLessons,
    handleIgnoreLessons
 }