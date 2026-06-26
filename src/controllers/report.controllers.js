
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

            reporterUserId,
            reporterName,
            userEmail,

            reportedUserEmail
        } = req.body;

        console.log({
            lessonId,
            lessonTitle, 
            reason,

            reporterUserId,
            reporterName,
            reporterEmail,

            reportedUserEmail
        });
        console.log(req?.body, 'reporter body');

        const alreadyReported = await Report.findOne({
            lessonId,
            reporterUserId: reporterUserId,
        });
        
        if (alreadyReported) { 
            throw createError(400, 'Already reported.');
        }

        const lesson = await Report.create({
            lessonId: lessonId,
            lessonTitle: lessonTitle,

            reporterUserId: reporterUserId,
            reporterName: reporterName,
            reporterEmail: reporterEmail,

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
