const mongoose = require("mongoose");

const quizCompletionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  answers: {
    type: Map,
    of: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexuri pentru performanță
quizCompletionSchema.index({ quizId: 1, email: 1 });
quizCompletionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("QuizCompletion", quizCompletionSchema);
