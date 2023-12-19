<template>
  <div class="d-flex justify-content-end">
    <div class>
      <!-- <span class="name">{{swapname}}</span> -->
      <!-- <select name="language" v-model="$i18n.locale" @change="swapName($event)">
        <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
      </select> -->
    </div>
    <div class="d-flex justify-content-end">
      <button class="ms-2 btn btn-color" @click="logout()">logout</button>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      langs: ["TH", "EN"],
      showname: "เปลี่ยนภาษา/Language"
    };
  },
  methods: {
    swapName(event) {

      if (event.target.value === 'EN') {

        this.$store.dispatch("setLanguage", event.target.value)

        this.$store.dispatch("swapName", this.$store.getters.userData.englishname)
        this.$store.dispatch("swapPosition", this.$store.getters.userData.job_eng)
        this.showname = this.$store.getters.showname
      }
      else {

        this.$store.dispatch("setLanguage", event.target.value)

        this.$store.dispatch("swapName", this.$store.getters.userData.thainame)
        this.$store.dispatch("swapPosition", this.$store.getters.userData.job_thai)
        this.showname = this.$store.getters.showname
      }
    },
    logout() {
      localStorage.removeItem("MB-app");
      const { getWebUrl } = require('@/service/getUrl')
      // alert(this.$t("goodbye"))
      window.location = getWebUrl("mu_auth") + "/logout";
    },

  },
  mounted() {


  },
  computed: {
    swapname() {
      return this.showname + ""
    }
  },

};
</script>

<style  scoped>
.floatR {
  margin-left: 5px;
  float: right;
}
.name {
  margin-right: 8px;
}
.btn-color {
  color: rgb(255, 255, 255);
  background-color: #200772;
}
@media only screen and (max-width: 425px) {
  .cover {
    float: left;
  }
  .floatR {
    float: none;
  }
}
</style>