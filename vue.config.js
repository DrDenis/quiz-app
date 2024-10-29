const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  // Asigură că variabilele de mediu sunt disponibile în build
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      Object.assign(args[0]["process.env"], {
        VUE_APP_AUTH0_DOMAIN: JSON.stringify(process.env.VUE_APP_AUTH0_DOMAIN),
        VUE_APP_AUTH0_CLIENT_ID: JSON.stringify(
          process.env.VUE_APP_AUTH0_CLIENT_ID
        ),
        VUE_APP_AUTH0_AUDIENCE: JSON.stringify(
          process.env.VUE_APP_AUTH0_AUDIENCE
        ),
        VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL),
      });
      return args;
    });
  },
});
