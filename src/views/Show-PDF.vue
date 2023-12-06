<template>
  <v-row justify="center">
    <div>
      <!-- ใช้ <iframe> เพื่อแสดงไฟล์ PDF -->
      <iframe :src="base_64" ref="pdfIframe" v-if="preview"></iframe>
    </div>
  </v-row>
</template>

<script>
import Swal from "sweetalert2";
import dataQrCode from "../service/apiCertificate";
import createPDF from "@/service/apiCreatePDF";
export default {
  data() {
    return {
      preview: false,
      base_64: "",
    };
  },
  async mounted() {
    // console.log(this.$route.query);
    // console.log(this.$route.query.param1, this.$route.query.param2)

    const { data } = await dataQrCode.getDataQrCode(this.$route.query.param1, this.$route.query.param2);
    if (data.msg === "not found") {
      this.showAlert("error", "Certificate Not Found !!");
    } else {
      const name = [];
      name.push({ prefix: data.data[0].prefix, name: data.data[0].name });
      await this.createPDF(data.data[0], name);
      this.preview = true;
    }
  },
  methods: {
    showAlert(icon, title) {
      Swal.fire({
        position: "center",
        icon: icon,
        title: title,
        showConfirmButton: false,
        allowOutsideClick: false, // ปิดการคลิกที่พื้นหลัง
      });
    },

    async createPDF(data, name) {
      const pdfDocGenerator = await createPDF.certification_pdf(name, data);
      this.base_64 = pdfDocGenerator;

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.base_64 = dataUrl;
        const iframe = this.$refs.pdfIframe;
        iframe.src = dataUrl;
        iframe.style.width = `${window.innerWidth}px`;
        iframe.style.height = `${window.innerHeight}px`;
      });
    },
  },
};
</script>

<style>
</style>