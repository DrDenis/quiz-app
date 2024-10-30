const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  emailPreferences: {
    quizCompleted: {
      type: Boolean,
      default: true,
    },
    weeklyStats: {
      type: Boolean,
      default: false,
    },
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
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

module.exports = mongoose.model("Profile", profileSchema);
