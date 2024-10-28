import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@auth0/auth0-vue";
import HomeView from "../views/HomeView.vue";
import QuizPage from "../views/QuizPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/quiz/:id",
    name: "Quiz",
    component: QuizPage,
  },
  {
    path: "/quiz/:id/edit",
    name: "EditQuiz",
    component: () => import("../views/EditQuizView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/questions",
    name: "Questions",
    component: () => import("../views/QuestionsView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/my-quizzes",
    name: "MyQuizzes",
    component: () => import("../views/MyQuizzesView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/questions/bank",
    name: "QuestionBank",
    component: () => import("../views/QuestionBankView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/ProfileView.vue"),
    beforeEnter: authGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
