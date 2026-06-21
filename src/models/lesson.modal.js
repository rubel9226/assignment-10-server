const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Personal Growth",
        "Career",
        "Relationships",
        "Mindset",
        "Mistakes Learned",
      ],
      required: true,
    },

    emotionalTone: {
      type: String,
      enum: [
        "Motivational",
        "Sad",
        "Realization",
        "Gratitude",
      ],
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private",
    },

    accessLevel: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    creatorName: {
      type: String,
      required: true,
    },

    creatorEmail: {
      type: String,
      required: true,
    },

    creatorPhoto: {
      type: String,
      default: "",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },

    reportsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;