<template>
  <div class="home">{{ this.$store.getters }}</div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'HomeView',
  components: {

  },

  data() {
    return {
      ac_name: this.$store.getters.userData.accountname,
    }
  },
  mounted() {
    if(this.ac_name) {
      console.log(this.ac_name)
    }
  }
}
</script>
