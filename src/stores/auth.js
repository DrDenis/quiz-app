// În stores/auth.js (crează acest fișier)
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    clearAuth() {
      this.user = null;
      this.token = null;
      localStorage.clear();
    },
  },
});
