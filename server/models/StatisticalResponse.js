const mongoose = require("mongoose");

const statisticalResponseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
    index: true,
  },
  respondentId: {
    type: String,
    required: true,
  },
  demographics: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  answers: {
    type: Map,
    of: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model(
  "StatisticalResponse",
  statisticalResponseSchema
);
