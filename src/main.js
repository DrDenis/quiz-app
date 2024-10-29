import { createApp } from "vue";
import { createAuth0 } from "@auth0/auth0-vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { createPinia } from "pinia";
import { useThemeStore } from "@/stores/theme";

const pinia = createPinia();

console.log("Environment:", process.env.NODE_ENV);
console.log("Auth0 Config:", {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  redirectUri: window.location.origin,
});

const app = createApp(App);

app.use(pinia);

const themeStore = useThemeStore();
themeStore.init();

app.use(
  createAuth0({
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: process.env.VUE_APP_AUTH0_AUDIENCE,
      scope: "openid profile email", // Important să avem scope-ul email
    },
  })
);

app.use(router);
app.mount("#app");
