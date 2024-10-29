import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    theme: localStorage.getItem("theme") || "dark", // Default la dark
  }),

  getters: {
    isDark: (state) => {
      if (state.theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return state.theme === "dark";
    },
  },

  actions: {
    setTheme(newTheme) {
      this.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      this.applyTheme();
    },

    applyTheme() {
      const isDark = this.isDark;

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },

    init() {
      // Aplică tema inițială (dark by default)
      this.applyTheme();

      // Ascultă pentru schimbări de system theme
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          if (this.theme === "system") {
            this.applyTheme();
          }
        });
    },
  },
});
