<template>
  <div>
    <br />
    <h1>{{text}}</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {

  data() {
    return {
      text: "Login system  กำลังนำไปหน้า ล็อกอิน"
    };
  },

  async mounted() {
    if (this.$route.query.vfy === "pass" && this.$route.query.c !== null) {
      console.log("เข้ามา1");
      this.login();
    }
    else if (localStorage.getItem("MB-app")) {
      console.log("เข้ามา2");
      axios.post("/checktoken").then((res) => {
        if (res.data.msg === "token-ok") {
          this.$router.push({ path: '/home' }) // ส่งไปที่นี้
        }
        else {
          localStorage.removeItem("MB-app");
          const { getWebUrl } = require("../service/getUrl");

          window.location = getWebUrl("mu_auth") + "/login" + "?src=mbasset";
        }
      });
    }
    else {
      const { getWebUrl } = require("../service/getUrl");
      console.log("เข้ามา3");
      setTimeout(function () {
        window.location = getWebUrl("mu_auth") + "/login" + "?src=mbasset";
      }, 500);

    }
  },

  methods: {
    async login() {
      await axios.post("/login", { c: this.$route.query.c }).then((res) => {
        console.log('c : ', this.$route.query.c)
        const data = res.data;
        console.log(data)

        if (data.msg === "ok") {
          localStorage.removeItem("MB-app");
          localStorage.setItem("MB-app", data.token);
          axios.defaults.headers.common["Authorization"] = localStorage.getItem("MB-app"); //for all request
          this.$router.push({ path: '/home' })   // ส่งไปที่นี้
        }
        else {
          console.log("ไม่พบรายชื่อ")
          this.text = "โปรดติดต่อคุณ สุจิต ฝ่าย ITMB"
          alert("ไม่พบรายชื่อคุณในฐานข้อมูล")
        }
      });


    },
  },
  
};
</script>

<style>
</style>