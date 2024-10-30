const express = require("express");
const router = express.Router();
const QuizStatisticsService = require("../services/QuizStatisticsService");
const { auth } = require("express-oauth2-jwt-bearer");

const Quiz = require("../models/Quiz");
const QuizCompletion = require("../models/QuizCompletion");
const QuizView = require("../models/QuizView");
const StatisticalResponse = require("../models/StatisticalResponse");

// Middleware-ul Auth0
const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

// Obține statisticile pentru un quiz
router.get("/quiz/:quizId", checkJwt, async (req, res) => {
  try {
    const statistics = await QuizStatisticsService.getQuizStatistics(
      req.params.quizId
    );
    if (!statistics) {
      return res
        .status(404)
        .json({ error: "No statistics found for this quiz" });
    }
    res.json(statistics);
  } catch (error) {
    console.error("Error fetching quiz statistics:", error);
    res.status(500).json({
      error: "Error fetching statistics",
      details: error.message,
    });
  }
});

// Obține statistici filtrate după demografice
router.get("/quiz/:quizId/demographics/:field", checkJwt, async (req, res) => {
  try {
    const statistics = await QuizStatisticsService.getDemographicBreakdown(
      req.params.quizId,
      req.params.field
    );
    if (!statistics) {
      return res.status(404).json({ error: "No demographic statistics found" });
    }
    res.json(statistics);
  } catch (error) {
    console.error("Error fetching demographic statistics:", error);
    res.status(500).json({
      error: "Error fetching demographic statistics",
      details: error.message,
    });
  }
});

router.patch(
  "/api/quizzes/:quizId/assign-questions",
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

      const { questionIds } = req.body;

      // Verificăm dacă întrebările există
      const questions = await Question.find({ _id: { $in: questionIds } });

      if (questions.length !== questionIds.length) {
        return res.status(400).json({ error: "Some questions were not found" });
      }

      // Adăugăm întrebările cu configurație statistică corectă
      const newQuestions = questions.map((q, index) => ({
        question: q._id,
        order: quiz.questions.length + index,
        statisticalData: {
          showInResults: true,
          chartType: "pie",
          includeInOverall: true,
        },
      }));

      // Adăugăm noile întrebări
      quiz.questions.push(...newQuestions);

      // Salvăm și populăm imediat pentru a returna datele complete
      await quiz.save();
      await quiz.populate("questions.question");

      // Actualizăm și referințele în întrebări
      await Question.updateMany(
        { _id: { $in: questionIds } },
        { $addToSet: { usedInQuizzes: quiz._id } }
      );

      res.json(quiz);
    } catch (error) {
      console.error("Error assigning questions:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint pentru submit răspunsuri statistice
router.post("/api/quiz/statistical/submit", async (req, res) => {
  try {
    const { quizId, answers, demographics, respondentId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.type !== "statistical") {
      return res.status(400).json({ error: "This quiz is not statistical" });
    }

    // Validăm datele demografice dacă sunt necesare
    if (quiz.settings.statistical.collectDemographics) {
      const requiredFields = quiz.settings.statistical.demographicFields
        .filter((field) => field.required)
        .map((field) => field.name);

      const missingFields = requiredFields.filter(
        (field) => !demographics?.[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: "Missing required demographic fields",
          fields: missingFields,
        });
      }
    }

    // Salvăm răspunsul
    const response = await StatisticalResponse.create({
      quizId,
      respondentId: respondentId || "anonymous",
      demographics: demographics
        ? new Map(Object.entries(demographics))
        : undefined,
      answers: new Map(Object.entries(answers)),
    });

    // Returnăm statistici dacă e configurat așa
    if (quiz.settings.statistical.resultsVisibility === "after-completion") {
      const statistics = await QuizStatisticsService.getQuizStatistics(quizId);
      return res.json({
        success: true,
        statistics,
        responseId: response._id,
      });
    }

    res.json({
      success: true,
      responseId: response._id,
    });
  } catch (error) {
    console.error("Error submitting statistical quiz:", error);
    res.status(500).json({
      error: "Error submitting quiz results",
      details: error.message,
    });
  }
});

module.exports = router;
