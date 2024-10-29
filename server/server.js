require("dotenv").config();

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

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

const allowedOrigins = ["http://localhost:8080", "https://quiz-app.online"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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

quizSchema.index({ "questions.question": 1 });

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

const Profile = mongoose.model("Profile", profileSchema);

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

app.get("/api/profile", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ auth0Id: req.user.auth0Id });

    if (!profile) {
      profile = await Profile.create({
        auth0Id: req.user.auth0Id,
        name: req.user.name || "User",
      });
    }

    // Calculează statisticile
    const stats = {
      totalQuizzes: await Quiz.countDocuments({ createdBy: req.user.auth0Id }),
      totalQuestions: await Question.countDocuments({
        createdBy: req.user.auth0Id,
      }),
      totalCompletions: await QuizCompletion.countDocuments({
        quiz: {
          $in: await Quiz.find({ createdBy: req.user.auth0Id }).distinct("_id"),
        },
      }),
    };

    res.json({
      ...profile.toObject(),
      stats,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

app.put("/api/profile", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    const allowedUpdates = ["name", "emailPreferences", "theme"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updatedAt = new Date();

    const profile = await Profile.findOneAndUpdate(
      { auth0Id: req.user.auth0Id },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

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
    }).populate("questions.question");

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or not published" });
    }

    // Transformăm datele pentru interfața publică
    const publicQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        _id: q.question._id,
        text: q.question.text,
        feedbackYes: q.question.feedbackYes,
        feedbackNo: q.question.feedbackNo,
      })),
    };

    res.json(publicQuiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Error fetching quiz" });
  }
});

app.patch(
  "/api/quizzes/:id/assign-questions",
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

      const { questionIds } = req.body;
      const questions = await Question.find({ _id: { $in: questionIds } });

      // Adăugăm întrebările la quiz
      const newQuestions = questions.map((q, index) => ({
        question: q._id,
        order: quiz.questions.length + index,
      }));

      quiz.questions.push(...newQuestions);
      await quiz.save();

      // Populăm întrebările pentru răspuns
      await quiz.populate("questions.question");

      res.json(quiz);
    } catch (error) {
      console.error("Error assigning questions:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.post("/api/quiz/submit", async (req, res) => {
  try {
    const { quizId, answers, email } = req.body;

    // Găsim quiz-ul
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Salvăm completarea
    const completion = new QuizCompletion({
      quizId,
      email,
      answers,
    });
    await completion.save();

    // Înregistrăm activitatea
    const activity = new Activity({
      type: "quiz-completed",
      userId: quiz.createdBy,
      title: `Quiz completat: ${quiz.title}`,
      details: {
        quizId: quiz._id,
        quizTitle: quiz.title,
        completedBy: email,
      },
    });
    await activity.save();

    // Generăm PDF-ul și trimitem email-ul
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.text("Rezultate Quiz", 105, yPos, { align: "center" });
    yPos += 20;

    doc.setFontSize(14);
    doc.text(quiz.title, 105, yPos, { align: "center" });
    yPos += 20;

    // Data
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString("ro-RO")}`, 20, yPos);
    yPos += 10;

    // Questions and answers
    quiz.questions.forEach((question, index) => {
      const answer = answers[question._id];

      // Verifică spațiul disponibil pe pagină
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${question.text}`, 20, yPos);
      yPos += 10;

      doc.setFont(undefined, "normal");
      doc.text(`Răspuns: ${answer ? "Da" : "Nu"}`, 20, yPos);
      yPos += 10;

      const feedback = answer ? question.feedbackYes : question.feedbackNo;
      const lines = doc.splitTextToSize(feedback, 170);
      lines.forEach((line) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 7;
      });

      yPos += 10;
    });

    // Trimite email cu PDF
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: `Rezultate Quiz: ${quiz.title}`,
      text: "Găsești atașat rezultatele tale pentru quiz-ul completat.",
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

    res.json({ success: true });
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
    // Obținem toate quizurile userului
    const quizzes = await Quiz.find({ createdBy: req.user.auth0Id });

    // Obținem completările pentru fiecare quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const completions = await QuizCompletion.countDocuments({
          quizId: quiz._id,
        });
        return {
          ...quiz.toObject(),
          completions,
        };
      })
    );

    // Sortăm quizurile - publicate primele, apoi după dată
    const sortedQuizzes = quizzesWithStats.sort((a, b) => {
      if (a.isPublished === b.isPublished) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.isPublished - a.isPublished;
    });

    res.json(sortedQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obține un quiz specific
app.get("/api/quizzes/:id", checkJwt, getUserMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.auth0Id,
    }).populate("questions.question"); // Populate detaliile întrebărilor

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete(
  "/api/quizzes/:id",
  checkJwt,
  getUserMiddleware,
  async (req, res) => {
    try {
      // Găsim quiz-ul și verificăm dacă aparține userului curent
      const quiz = await Quiz.findOne({
        _id: req.params.id,
        createdBy: req.user.auth0Id,
      });

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Ștergem completările asociate
      await QuizCompletion.deleteMany({ quizId: quiz._id });

      // Ștergem quiz-ul
      await Quiz.deleteOne({ _id: quiz._id });

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ error: "Error deleting quiz" });
    }
  }
);

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
        .lean();

      // Pentru fiecare întrebare, găsim quizurile în care e folosită
      const questionsWithUsage = await Promise.all(
        questions.map(async (question) => {
          const quizzes = await Quiz.find(
            { "questions.question": question._id },
            "title"
          ).lean();

          return {
            ...question,
            usedInQuizzes: quizzes,
          };
        })
      );

      res.json(questionsWithUsage);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.post(
  "/api/questions/bank/:id/detach",
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

      // Găsește toate quizurile care folosesc această întrebare
      const quizzes = await Quiz.find({ "questions.question": question._id });

      // Elimină întrebarea din fiecare quiz
      await Promise.all(
        quizzes.map((quiz) => {
          quiz.questions = quiz.questions.filter(
            (q) => q.question.toString() !== question._id.toString()
          );
          return quiz.save();
        })
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error detaching question:", error);
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
      console.log("Attempting to delete question:", req.params.id);

      const question = await Question.findOne({
        _id: req.params.id,
        createdBy: req.user.auth0Id,
      });

      if (!question) {
        console.log("Question not found");
        return res.status(404).json({ error: "Question not found" });
      }

      // Verificăm dacă întrebarea e folosită în quizuri
      const quizzesUsingQuestion = await Quiz.find({
        "questions.question": question._id,
      });

      console.log("Quizzes using question:", quizzesUsingQuestion.length);

      if (quizzesUsingQuestion.length > 0) {
        const quizTitles = quizzesUsingQuestion.map((q) => q.title).join(", ");
        return res.status(400).json({
          error: "Cannot delete question that is used in quizzes",
          details: `Question is used in: ${quizTitles}`,
        });
      }

      await question.deleteOne();
      console.log("Question deleted successfully");

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.put(
  "/api/quizzes/:quizId",
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

      // Actualizăm lista de întrebări
      quiz.questions = req.body.questions;

      await quiz.save();
      await quiz.populate("questions.question");

      res.json(quiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
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
