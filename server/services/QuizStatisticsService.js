const StatisticalResponse = require("../models/StatisticalResponse");
const Quiz = require("../models/Quiz");

class QuizStatisticsService {
  async getQuizStatistics(quizId) {
    const quiz = await Quiz.findById(quizId).populate("questions.question");
    const responses = await StatisticalResponse.find({ quizId });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    return {
      overview: await this.getOverviewStats(quiz, responses),
      questions: await this.getQuestionsStats(quiz, responses),
      demographics: await this.getDemographicsStats(quiz, responses),
      trends: await this.getTrendsStats(quiz, responses),
    };
  }

  async getOverviewStats(quiz, responses) {
    return {
      totalResponses: responses.length,
      averageYesRate: this.calculateAverageYesRate(responses),
      completionRate: await this.calculateCompletionRate(quiz._id),
      totalViews: await this.getTotalViews(quiz._id),
    };
  }

  async getQuestionsStats(quiz, responses) {
    const stats = {};

    for (const questionItem of quiz.questions) {
      const questionId = questionItem.question._id.toString();
      const questionResponses = responses.map((r) => r.answers.get(questionId));

      stats[questionId] = {
        totalAnswers: questionResponses.length,
        yesCount: questionResponses.filter((a) => a === true).length,
        noCount: questionResponses.filter((a) => a === false).length,
        yesPercentage: this.calculatePercentage(
          questionResponses.filter((a) => a === true).length,
          questionResponses.length
        ),
        noPercentage: this.calculatePercentage(
          questionResponses.filter((a) => a === false).length,
          questionResponses.length
        ),
      };
    }

    return stats;
  }

  calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100 * 10) / 10; // O decimală
  }

  calculateAverageYesRate(responses) {
    if (!responses || responses.length === 0) return 0;

    const yesResponses = responses.filter(
      (response) => response.answer === true
    );
    return (yesResponses.length / responses.length) * 100;
  }

  async getDemographicsStats(quiz, responses) {
    if (!quiz.settings.statistical.collectDemographics) {
      return null;
    }

    const stats = {};
    quiz.settings.statistical.demographicFields.forEach((field) => {
      stats[field.name] = this.calculateDemographicBreakdown(
        responses,
        field.name
      );
    });

    return stats;
  }

  calculateDemographicBreakdown(responses, fieldName) {
    const breakdown = {};
    responses.forEach((response) => {
      const value = response.demographics.get(fieldName);
      if (value) {
        breakdown[value] = (breakdown[value] || 0) + 1;
      }
    });
    return breakdown;
  }

  async getTrendsStats(quiz, responses) {
    const timeframes = {
      daily: {},
      weekly: {},
      monthly: {},
    };

    responses.forEach((response) => {
      const date = response.createdAt;
      this.addToTimeframe(timeframes.daily, date, response);
      this.addToTimeframe(timeframes.weekly, this.getWeekStart(date), response);
      this.addToTimeframe(
        timeframes.monthly,
        this.getMonthStart(date),
        response
      );
    });

    return timeframes;
  }

  addToTimeframe(timeframe, date, response) {
    const key = date.toISOString().split("T")[0];
    if (!timeframe[key]) {
      timeframe[key] = {
        total: 0,
        yesResponses: 0,
        noResponses: 0,
      };
    }

    timeframe[key].total++;
    response.answers.forEach((answer) => {
      if (answer) timeframe[key].yesResponses++;
      else timeframe[key].noResponses++;
    });
  }

  getWeekStart(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }

  getMonthStart(date) {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async calculateCompletionRate(quizId) {
    const responses = await StatisticalResponse.find({ quizId });
    const totalViews = await this.getTotalViews(quizId);

    if (totalViews === 0) return 0;
    return this.calculatePercentage(responses.length, totalViews);
  }

  async getTotalViews(quizId) {
    // For now, returning the total responses as views
    // You might want to implement a separate view tracking system later
    const responses = await StatisticalResponse.find({ quizId });
    return responses.length;
  }
}

module.exports = new QuizStatisticsService();
