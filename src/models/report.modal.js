const mongoose = require("mongoose");

const lessonReportSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    lessonTitle: String,

    reporterUserId: String,

    reporterName: String,

    reporterEmail: String,

    reportedUserEmail: String,

    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model("LessonReport", lessonReportSchema);

module.exports = Report;


