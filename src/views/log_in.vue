

<script>
import axios from "axios";
export default {
  name: "Log_in",
  data() {
    return {
      text: "Login system  กำลังนำไปหน้า ล็อกอิน",
      myTimeout: null,
    };
  },

  methods: {
    login() {
      axios.post("/login", { c: this.$route.query.c }).then((res) => {
        const data = res.data;

        if (data.msg === "ok") {
          localStorage.removeItem("MB-app");
          localStorage.setItem("MB-app", data.token);
          axios.defaults.headers.common["Authorization"] =
            localStorage.getItem("MB-app"); //for all request
          this.$router.push({ path: "/" }); // ส่งไปที่นี้
        } else {
          console.log("ไม่พบรายชื่อ");
          this.text = "โปรดติดต่อคุณ สุจิต ฝ่าย ITMB";
          alert("ไม่พบรายชื่อคุณในฐานข้อมูล");
        }
      });
    },
    force_login() {
      const { getWebUrl } = require("../service/getUrl");

      console.log(getWebUrl("mu_auth") + "/login" + "?src=fix")

      window.location = getWebUrl("mu_auth") + "/login" + "?src=fix";
    },
  },
  mounted() {
    if (this.$route.query.vfy === "pass" && this.$route.query.c !== null) {
      console.log("เข้ามา1");
      this.login();
    } else if (localStorage.getItem("MB-app")) {
      console.log("เข้ามา2");
      axios.post("/checktoken").then((res) => {
        if (res.data.msg === "token-ok") {
          this.$router.push({ path: "/home" }); // ส่งไปที่นี้
        } else {
          localStorage.removeItem("MB-app");
          const { getWebUrl } = require("../service/getUrl");

          window.location = getWebUrl("mu_auth") + "/login" + "?src=fix";
        }
      });
    } else {
      const { getWebUrl } = require("../service/getUrl");
      console.log("เข้ามา3");
      //this.myTimeout = setTimeout(function () {
        window.location = getWebUrl("mu_auth") + "/login" + "?src=fix";
      // }, 10000);
    }
  },
  beforeUnmount() {
    clearTimeout(this.myTimeout);
  },
};
</script>

