const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["self-evaluation", "statistical"],
    default: "self-evaluation",
  },
  createdBy: {
    type: String,
    required: true,
    index: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  questions: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      order: Number,
      statisticalData: {
        showInResults: {
          type: Boolean,
          default: true,
        },
        chartType: {
          type: String,
          enum: ["pie", "bar", "line"],
          default: "pie",
        },
        includeInOverall: {
          type: Boolean,
          default: true,
        },
      },
    },
  ],
  settings: {
    statistical: {
      allowAnonymous: {
        type: Boolean,
        default: true,
      },
      collectDemographics: {
        type: Boolean,
        default: false,
      },
      demographicFields: [
        {
          name: String,
          type: {
            type: String,
            enum: ["text", "number", "select", "date"],
          },
          required: Boolean,
          options: [String],
        },
      ],
      showResults: {
        type: Boolean,
        default: true,
      },
      resultsVisibility: {
        type: String,
        enum: ["public", "private", "after-completion"],
        default: "after-completion",
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
