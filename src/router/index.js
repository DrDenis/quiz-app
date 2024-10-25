import { createRouter, createWebHistory } from "vue-router";
import QuizPage from "../views/QuizPage.vue";

const routes = [
  {
    path: "/",
    name: "Quiz",
    component: QuizPage,
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AdminDashboard.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
