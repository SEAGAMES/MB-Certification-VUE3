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
    if (this.$route.query.param2) {
      const { data } = await apiCertificate.getDataQrCode(
        this.$route.query.param1,
        this.$route.query.param2
      );
      if (data.msg === "not found") {
        this.showAlert("error", "Certificate Not Found !!");
      } else {
        data.data[0].sign = true;
        name.push({ prefix: data.data[0].prefix, name: data.data[0].name });
        // await this.createPDF(data.data[0], name);
        // this.preview = true;

        this.dataLoad = data.data[0];

        if (this.dataLoad.language === "TH") {
          // console.log(this.dataLoad);
          this.dataSign.forEach((obj) => {
            if (obj.id === this.dataLoad.sign_add_id) {
              this.dataLoad.add_name = obj.name_th;
              this.dataLoad.add_position = obj.position_th;
              this.dataLoad.base64_sign_add_th = obj.base64_sign_th;
            }
          });
        }

        await this.createPDF(this.dataLoad, name);
        this.preview = true;
      }
    } else {
      const { data } = await apiCertificate.dataInPjcode(
        this.$route.query.param1
      );
      name = data.data;
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