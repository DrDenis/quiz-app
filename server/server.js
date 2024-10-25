require("dotenv").config();
const express = require("express");
//const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const upload = multer();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Question Schema
const questionSchema = new mongoose.Schema({
  text: String,
  feedbackYes: String,
  feedbackNo: String,
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);

// Routes pentru întrebări
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort("-createdAt");
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Error fetching questions" });
  }
});

app.post("/api/questions", async (req, res) => {
  try {
    console.log("Received question data:", req.body);
    const question = new Question(req.body);
    await question.save();
    res.json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Error creating question" });
  }
});

// Email route
app.post("/api/send-results", upload.single("pdf"), async (req, res) => {
  console.log("Processing email request");
  try {
    if (!req.file) {
      throw new Error("No PDF file received");
    }

    if (!req.body.email) {
      throw new Error("No email address received");
    }

    const msg = {
      to: req.body.email,
      from: process.env.SENDGRID_VERIFIED_SENDER, // trebuie să fie un sender verificat în SendGrid
      subject: "Rezultatele Evaluării Tale",
      text: "Găsești atașat rezultatele evaluării tale.",
      attachments: [
        {
          content: req.file.buffer.toString("base64"),
          filename: "rezultate.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    console.log("Sending email via SendGrid");
    await sgMail.send(msg);
    console.log("Email sent successfully");

    res.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      error: "Error sending email",
      details: error.message,
    });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment variables check:");
  console.log(
    "SENDGRID_API_KEY:",
    process.env.SENDGRID_API_KEY ? "Set" : "Not set"
  );
  console.log(
    "SENDGRID_VERIFIED_SENDER:",
    process.env.SENDGRID_VERIFIED_SENDER ? "Set" : "Not set"
  );
});
