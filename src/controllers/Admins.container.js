const createError = require("http-errors");
const Lesson = require("../models/lesson.modal");
const User = require("../models/users.modal");
const { successResponse } = require("./response.controllers");
const Report = require("../models/report.modal");



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


module.exports = {
    handleGetUsers,
    handleCreateAdmin,
    handleGetAdminsStats,
    handleGetProfileStatsAdmins,
    handleGetTopContributors,
    handleGetUserGrowth,
    handleGetLessonGrowth,


    handleFeaturedLessons,
 }