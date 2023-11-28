<template>
  <h1>test</h1>
</template>

<script>
import createPDF from '../service/apiCreatePDF'
export default {
  async mounted() {
    await createPDF.generatePDF()
  }
}
</script>

<style>

</style>