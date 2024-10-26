require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { auth } = require("express-oauth2-jwt-bearer");
const sgMail = require("@sendgrid/mail");
const { jsPDF } = require("jspdf");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

// Middleware pentru parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware pentru logging
app.use((req, res, next) => {
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });
  next();
});

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Auth0 Middleware Configuration
const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

// Schema-uri
const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  feedbackYes: {
    type: String,
    required: true,
    trim: true,
  },
  feedbackNo: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  // Noi câmpuri
  usedInQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  category: {
    type: String,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);

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
  createdBy: {
    type: String, // auth0Id
    required: true,
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
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quiz-created", "quiz-completed", "question-added"],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

const quizCompletionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  answers: {
    type: Map,
    of: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizCompletion = mongoose.model("QuizCompletion", quizCompletionSchema);

const quizViewSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizView = mongoose.model("QuizView", quizViewSchema);

// Middleware pentru a obține/crea user-ul din MongoDB bazat pe Auth0 ID
const getUserMiddleware = async (req, res, next) => {
  try {
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Debug logging
    console.log("Full Auth0 Payload:", req.auth.payload);

    // Pentru Google OAuth, email-ul poate fi în alt loc
    const email =
      req.auth.payload.email ||
      req.auth.payload["https://example.com/email"] ||
      `${auth0Id}@placeholder.com`; // fallback

    const name =
      req.auth.payload.name ||
      req.auth.payload.nickname ||
      req.auth.payload["https://example.com/name"] ||
      email.split("@")[0]; // folosim partea din email ca nume dacă nu avem altceva

    console.log("Extracted user info:", { auth0Id, email, name });

    let user = await User.findOne({ auth0Id });

    if (!user) {
      console.log("Creating new user with:", { auth0Id, email, name });
      user = await User.create({
        auth0Id,
        email,
        name,
      });
      console.log("New user created:", user);
    } else {
      console.log("Found existing user:", user);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("User middleware error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      payload: req.auth?.payload,
    });
  }
};

app.get("/api/dashboard", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    // Găsim toate quiz-urile utilizatorului
    const userQuizzes = await Quiz.find({ createdBy: req.user.auth0Id });
    const quizIds = userQuizzes.map((q) => q._id);

    // Data pentru ultima lună
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Calculăm toate statisticile
    const [completions, views] = await Promise.all([
      // Numărul de completări
      QuizCompletion.countDocuments({
        quizId: { $in: quizIds },
        createdAt: { $gte: lastMonth },
      }),

      // Numărul de vizualizări
      QuizView.countDocuments({
        quizId: { $in: quizIds },
        createdAt: { $gte: lastMonth },
      }),
    ]);

    console.log("Dashboard Stats:", {
      quizIds,
      completions,
      views,
      userQuizzes: userQuizzes.length,
    });

    const stats = {
      totalQuizzes: userQuizzes.length,
      publishedQuizzes: userQuizzes.filter((q) => q.isPublished).length,
      totalQuestions: userQuizzes.reduce(
        (acc, quiz) => acc + quiz.questions.length,
        0
      ),
      totalCompletions: completions,
      completionRate: views > 0 ? Math.round((completions / views) * 100) : 0,
      totalViews: views,
    };

    // Obținem activitatea recentă
    const recentActivity = await Activity.find({
      userId: req.user.auth0Id,
    })
      .sort("-createdAt")
      .limit(5)
      .lean()
      .then((activities) =>
        activities.map((activity) => ({
          id: activity._id,
          type: activity.type,
          title: activity.title,
          time: new Date(activity.createdAt).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          }),
          details: activity.details,
        }))
      );

    console.log("Sending dashboard response:", { stats, recentActivity });
    res.json({ stats, recentActivity });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});

app.get("/api/quiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or not published" });
    }

    // Înregistrăm vizualizarea
    console.log("Recording view for quiz:", quiz._id);
    await new QuizView({
      quizId: quiz._id,
    }).save();

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Error fetching quiz" });
  }
});

app.post("/api/quiz/submit", async (req, res) => {
  try {
    const { quizId, answers, email } = req.body;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    console.log("Recording quiz completion:", { quizId, email });

    // Salvăm completarea
    const completion = await new QuizCompletion({
      quizId,
      email,
      answers,
    }).save();

    console.log("Completion saved:", completion);

    // Înregistrăm activitatea
    await new Activity({
      type: "quiz-completed",
      userId: quiz.createdBy,
      title: `Quiz completat: ${quiz.title}`,
      details: {
        quizId: quiz._id,
        quizTitle: quiz.title,
        completedBy: email,
      },
    }).save();

    // Generate PDF
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.text("Rezultate Quiz", 105, yPos, { align: "center" });
    yPos += 10;

    // Quiz Title
    doc.setFontSize(16);
    doc.text(quiz.title, 105, yPos, { align: "center" });
    yPos += 20;

    // Date
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString("ro-RO")}`, 20, yPos);
    yPos += 15;

    // Questions and Answers
    doc.setFontSize(12);
    quiz.questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const answer = answers[question._id];

      // Question
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${question.text}`, 20, yPos);
      yPos += 10;

      // Answer
      doc.setFont(undefined, "normal");
      doc.text(`Răspuns: ${answer ? "Da" : "Nu"}`, 20, yPos);
      yPos += 10;

      // Feedback
      const feedback = answer ? question.feedbackYes : question.feedbackNo;
      const splitFeedback = doc.splitTextToSize(feedback, 170);
      splitFeedback.forEach((line) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 7;
      });

      yPos += 10;
    });

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Send email with SendGrid
    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER, // trebuie să fie un sender verificat în SendGrid
      subject: `Rezultate Quiz: ${quiz.title}`,
      text: `Mulțumim pentru completarea quizului "${quiz.title}". Găsești atașat rezultatele tale.`,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: "rezultate.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    res.json({ success: true, message: "Results sent successfully" });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Error submitting quiz results" });
  }
});

// Creare quiz nou
app.post("/api/quizzes", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    const quiz = new Quiz({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.auth0Id,
      questions: [],
    });
    await quiz.save();

    // Înregistrăm activitatea
    await new Activity({
      type: "quiz-created",
      userId: req.user.auth0Id,
      title: `Quiz nou creat: ${quiz.title}`,
      details: {
        quizId: quiz._id,
        quizTitle: quiz.title,
      },
    }).save();

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obține toate quizurile unui user
app.get("/api/quizzes", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.auth0Id }).sort(
      "-createdAt"
    );
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obține un quiz specific
app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rută publică pentru vizualizarea unui quiz
app.get("/api/public/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      isPublished: true, // returnează doar quizurile publicate
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or not published" });
    }

    // Returnăm doar informațiile necesare pentru completare
    const publicQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        text: q.text,
      })),
    };

    res.json(publicQuiz);
  } catch (error) {
    console.error("Error fetching public quiz:", error);
    res.status(500).json({ error: "Error fetching quiz" });
  }
});

// Adaugă o întrebare la quiz
app.post(
  "/api/quizzes/:id/questions",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({
        _id: req.params.id,
        createdBy: req.user.auth0Id,
      });

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      quiz.questions.push({
        text: req.body.text,
        feedbackYes: req.body.feedbackYes,
        feedbackNo: req.body.feedbackNo,
      });

      await quiz.save();

      // Înregistrăm activitatea
      await new Activity({
        type: "question-added",
        userId: req.user.auth0Id,
        title: `Întrebare nouă adăugată în ${quiz.title}`,
        details: {
          quizId: quiz._id,
          quizTitle: quiz.title,
          questionText: req.body.text,
        },
      }).save();

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Publică/Depublică quiz
app.patch(
  "/api/quizzes/:id/publish",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.auth0Id },
        { isPublished: req.body.isPublished },
        { new: true }
      );

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Routes protejate
app.get("/api/questions", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    console.log("Fetching questions for user:", req.user.auth0Id);

    const questions = await Question.find({ createdBy: req.user.auth0Id }).sort(
      "-createdAt"
    );

    // Log complet al întrebărilor găsite
    console.log(
      "Questions found (complete objects):",
      JSON.stringify(questions, null, 2)
    );

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/questions", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    console.log("Headers:", req.headers);
    console.log("Raw body:", req.body);

    const { text, feedbackYes, feedbackNo } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Întrebarea este obligatorie" });
    }
    if (!feedbackYes?.trim()) {
      return res
        .status(400)
        .json({ error: "Feedback-ul pentru DA este obligatoriu" });
    }
    if (!feedbackNo?.trim()) {
      return res
        .status(400)
        .json({ error: "Feedback-ul pentru NU este obligatoriu" });
    }

    const questionData = {
      text: text.trim(),
      feedbackYes: feedbackYes.trim(),
      feedbackNo: feedbackNo.trim(),
      createdBy: req.user.auth0Id,
    };

    console.log("Creating question with data:", questionData);

    const question = new Question(questionData);
    const savedQuestion = await question.save();

    console.log("Question saved successfully:", savedQuestion);
    res.json(savedQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({
      error: "Error creating question",
      details: error.message,
      stack: error.stack,
    });
  }
});

app.put("/api/questions/:id", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.auth0Id,
      },
      req.body,
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Error updating question" });
  }
});

app.delete(
  "/api/questions/:id",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const question = await Question.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.auth0Id,
      });

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Error deleting question" });
    }
  }
);

app.get("/api/quizzes/:userId", async (req, res) => {
  try {
    const questions = await Question.find({
      createdBy: req.params.userId,
      // Putem adăuga aici și alte filtre (ex: active: true)
    }).sort("createdAt");

    res.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete(
  "/api/quizzes/:quizId/questions/:questionIndex",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({
        _id: req.params.quizId,
        createdBy: req.user.auth0Id,
      });

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Verifică dacă indexul este valid
      const questionIndex = parseInt(req.params.questionIndex);
      if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
        return res.status(400).json({ error: "Invalid question index" });
      }

      // Șterge întrebarea din array folosind splice
      quiz.questions.splice(questionIndex, 1);
      await quiz.save();

      console.log(
        `Question at index ${questionIndex} deleted from quiz ${quiz._id}`
      );
      res.json(quiz);
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// GET toate întrebările (cu filtre și informații despre usage)
app.get(
  "/api/questions/bank",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const questions = await Question.find({ createdBy: req.user.auth0Id })
        .sort("-createdAt")
        .populate("usedInQuizzes", "title"); // Populăm informații despre quizurile în care e folosită

      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST - creează o întrebare nouă în banca de întrebări
app.post(
  "/api/questions/bank",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const question = new Question({
        text: req.body.text,
        feedbackYes: req.body.feedbackYes,
        feedbackNo: req.body.feedbackNo,
        category: req.body.category,
        tags: req.body.tags,
        createdBy: req.user.auth0Id,
      });
      await question.save();
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PATCH - asignează întrebări la un quiz
app.patch(
  "/api/quizzes/:quizId/assign-questions",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const { questionIds } = req.body; // Array de ID-uri de întrebări
      const quiz = await Quiz.findOne({
        _id: req.params.quizId,
        createdBy: req.user.auth0Id,
      });

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Adăugăm întrebările la quiz
      const newQuestions = questionIds.map((qId, index) => ({
        question: qId,
        order: quiz.questions.length + index,
      }));

      quiz.questions.push(...newQuestions);
      await quiz.save();

      // Actualizăm și referințele în întrebări
      await Question.updateMany(
        { _id: { $in: questionIds } },
        { $addToSet: { usedInQuizzes: quiz._id } }
      );

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE - șterge o întrebare din banca de întrebări
app.delete(
  "/api/questions/bank/:id",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const question = await Question.findOne({
        _id: req.params.id,
        createdBy: req.user.auth0Id,
      });

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      // Verificăm dacă întrebarea e folosită în vreun quiz
      if (question.usedInQuizzes?.length > 0) {
        return res.status(400).json({
          error: "Cannot delete question that is used in quizzes",
          quizzes: question.usedInQuizzes,
        });
      }

      await question.delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT - actualizează o întrebare din bancă
app.put(
  "/api/questions/bank/:id",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      const question = await Question.findOneAndUpdate(
        {
          _id: req.params.id,
          createdBy: req.user.auth0Id,
        },
        {
          text: req.body.text,
          feedbackYes: req.body.feedbackYes,
          feedbackNo: req.body.feedbackNo,
          category: req.body.category,
          tags: req.body.tags,
        },
        { new: true }
      );

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
