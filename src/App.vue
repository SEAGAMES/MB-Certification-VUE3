<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
const { getWebUrl } = require("./service/getUrl");
export default {
  name: "App",

  data: () => ({
    //
  }),
  created() {
    axios.defaults.baseURL = getWebUrl("api");
    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("MB-app");
    axios.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (!error.response) {
          console.log("error at app.use");
        } else if (
          error.response &&
          error.response.status &&
          error.response.status === 401
        ) {
          localStorage.removeItem("MB-app");
          //this.$router.push({ name: "log_in", query: { action: "logout" } });
        }
        return Promise.reject(error);
      }
    );
  },

  mounted() {
    document.title = "Certificate";
  },
};
</script>
