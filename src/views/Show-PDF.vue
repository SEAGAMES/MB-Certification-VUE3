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
import apiCertificate from "../service/apiCertificate";
import createPDF from "@/service/apiCreatePDF";
export default {
  data() {
    return {
      preview: false,
      base_64: "",
      dataLoad: [],
      dataSign: [],
    };
  },
  async mounted() {
    this.dataSign = await apiCertificate.dataSign();
    // console.log(this.$route.query.param1, this.$route.query.param2)
    let name = [];
    if (this.$route.query.param2) { // ผ่านการย่อ code
      const { data } = await apiCertificate.getDataQrCode(
        this.$route.query.param1,
        this.$route.query.param2
      );

      if (data.msg === "not found") {
        this.showAlert("error", "Certificate Not Found !!");
      } else {
        data.data[0].sign = true;
        this.dataLoad = data.data[0];
        name.push({ prefix: this.dataLoad.prefix, name: this.dataLoad.name });

        const languageKey = this.dataLoad.language === "TH" ? "th" : "eng";

        this.dataSign.forEach((obj) => {
          if (obj.id === this.dataLoad.sign_add_id) {
            this.dataLoad.add_name = obj[`name_${languageKey}`];
            this.dataLoad.add_position = obj[`position_${languageKey}`];
            this.dataLoad[`base64_sign_add_${languageKey}`] =
              obj[`base64_sign_${languageKey}`];
          }
        });

        await this.createPDF(this.dataLoad, name);
        this.preview = true;
      }
    } else {
      // code หลังจากสร้างเสร็จเเล้วกดมาดูทันที // ผ่านการย่อ code
      const { data } = await apiCertificate.dataInPjcode(
        this.$route.query.param1
      );
      this.dataLoad = data.data;

      const index_id = this.dataLoad[0].sign_add_id - 1;
      const languageKey = this.dataLoad[0].language === "TH" ? "th" : "eng";

      this.dataLoad.forEach((obj) => {
        obj.add_name = this.dataSign[index_id][`name_${languageKey}`];
        obj.add_position = this.dataSign[index_id][`position_${languageKey}`];
        obj[`base64_sign_add_${languageKey}`] =
          this.dataSign[index_id][`base64_sign_${languageKey}`];
      });

      await this.createPDF(this.dataLoad[0], this.dataLoad);
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