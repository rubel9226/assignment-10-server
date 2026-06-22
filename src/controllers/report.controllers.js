
const createError = require("http-errors");
const Report = require("../models/report.modal");
const Lesson = require("../models/lesson.modal");
const { successResponse } = require("./response.controllers");

const handleCreateReport = async (req, res, next) => {
    try {
        const {
            lessonId,
            lessonTitle, 
            reason,

            userId,
            userName,
            userEmail,

            reportedUserEmail
        } = req.body;

        const alreadyReported = await Report.findOne({
            lessonId,
            reporterUserId: userId,
        });
        
        if (alreadyReported) { 
            throw createError(400, 'Already reported.');
        }

        const lesson = await Report.create({
            lessonId: lessonId,
            lessonTitle: lessonTitle,

            reporterUserId: userId,
            reporterName: userName,
            reporterEmail: userEmail,

            reportedUserEmail: reportedUserEmail, 
            reason: reason,
        });

        await Lesson.findByIdAndUpdate(lessonId, {
            $inc: {
                reportsCount: 1,
            },
        });

        return successResponse(res, {
            statusCode: 200,
            message: "Report submitted",
            payload: lesson,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {handleCreateReport}
