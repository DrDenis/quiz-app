import { defineStore } from "pinia";
import axios from "axios";

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    questions: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchQuestions() {
      this.loading = true;
      try {
        const response = await axios.get("/admin/questions");
        this.questions = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addQuestion(question) {
      try {
        const response = await axios.post("/admin/questions", question);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async updateQuestion(id, question) {
      try {
        const response = await axios.put(`/admin/questions/${id}`, question);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteQuestion(id) {
      try {
        await axios.delete(`/admin/questions/${id}`);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
