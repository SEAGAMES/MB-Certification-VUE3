<template >
  <v-container class="fontSarabun">
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          width="100"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="dataLoad.data"
        :items-per-page="10"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr align="center">
            <td>{{ item.pj_code }}</td>
            <td>{{ item.pj_name }}</td>
            <!-- <td>{{ item.language }}</td> -->
            <v-chip :color="getColor(item.language)">
              {{ item.language }}
            </v-chip>
            <td>{{ item.currentYear }}</td>
            <td>{{ item.date_desc }}</td>
            <td>
              <div style="display: flex; gap: 10px">
                <v-icon @click="printPDF(item)" style="color: rgb(55, 136, 176)"
                  >mdi-printer</v-icon
                >
                <v-icon
                  @click="editCertificate(item)"
                  style="color: rgb(243, 156, 18)"
                  >mdi-pencil</v-icon
                >
                <v-icon
                  @click="deleteCertificate(item.pj_code)"
                  style="color: rgb(255, 0, 0)"
                  >mdi-delete</v-icon
                >
              </div>
            </td>
          </tr>
        </template></v-data-table
      >
    </v-card>

    <v-dialog
      v-model="preview"
      persistent
      max-height="800"
      max-width="800"
      width="80%"
    >
      <v-card elevation="0" dark class="custom-color">
        <v-toolbar dark class="custom-color" height="30">
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" @click="preview = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row justify="center">
          <div>
            <!-- ใช้ <iframe> เพื่อแสดงไฟล์ PDF -->
            <iframe :src="base_64" ref="pdfIframe"></iframe>
          </div>
        </v-row>
        <v-toolbar dark class="custom-color" height="25">
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import createPDF from "../service/apiCreatePDF";
import apiCertificate from "@/service/apiCertificate";

export default {
  data() {
    return {
      search: "",
      dataLoad: [],
      dataDetail: [],
      base_64: null,
      preview: false,
      dataSign: [],
      headers: [
        {
          align: "center",
          key: "pj_code",
          sortable: false,
          title: "รหัสโครงการ",
        },
        { align: "center", key: "pj_name", title: "ชื่อโครงการ" },
        { align: "center", key: "language", title: "ภาษา" },
        { align: "center", key: "currentYear", title: "ปี" },
        { align: "center", key: "date_desc", title: "อบรมวันที่" },
        { align: "center", title: "Action" },
      ],
    };
  },

  async mounted() {
    await this.getDataCertificateMaster();

    this.dataSign = await apiCertificate.dataSign();

    this.dataLoad.data.forEach((obj) => {
      if (obj.language === "TH") {
        console.log(obj)
        this.dataSign.forEach((obj_sign) => {
          if (obj_sign.id === obj.sign_add_id) {
            //console.log(obj_sign);
            obj.add_name = obj_sign.name_th
            obj.add_position = obj_sign.position_th
            obj.base64_sign_add_th = obj_sign.base64_sign_th
            //console.log(obj)
          }
        });
      }
    });

    // if(this.form.language === 'TH'){
    //   console.log('TH')
    // }
    // this.dataSign = await apiCertificate.dataSign()
    // console.log(this.dataSign)
  },

  methods: {
    getColor(language) {
      if (language === "TH") return "green";
      else return "red";
    },

    async dataStorage() {
      const data = await apiCertificate.getDataCertificate_detail(
        this.dataStorage
      );
      this.dataDetail = data.data;
    },

    async printPDF(data) {
      const result = await apiCertificate.getDataCertificate_detail(data);
      this.dataStorage = data;
      this.dataDetail = result.data;

      await this.createPDFShow();
    },

    async createPDFShow() {
      console.log(this.dataStorage);
      const pdfDocGenerator = await createPDF.certification_pdf(
        this.dataDetail.data,
        this.dataStorage
      );

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.base_64 = dataUrl;
        const iframe = this.$refs.pdfIframe;
        iframe.src = dataUrl;

        // กำหนดความกว้างและความสูงของ iframe ตรงนี้
        iframe.style.width = "770px"; // เปลี่ยนเป็นค่าที่คุณต้องการ
        iframe.style.height = "600px"; // เปลี่ยนเป็นค่าที่คุณต้องการ
      });
      this.preview = true;
    },

    deleteAlert(pj_code) {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่ที่จะลบ?",
        text: "การกระทำนี้ไม่สามารถยกเลิกได้!",
        icon: "warning",
        showCancelButton: true, // แสดงปุ่ม "Cancel"
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก", // ปุ่ม "Cancel" ที่กำหนดค่าข้อความเป็น 'ยกเลิก'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await apiCertificate.deleteCertificate(pj_code);
          if (result.data.msg === "ok") {
            this.getDataCertificateMaster();
            Swal.fire(
              `ลบ ${pj_code} แล้ว!"`,
              "ไฟล์ของคุณถูกลบแล้ว.",
              "success"
            );
          } else {
            Swal.fire(`การลบ ${pj_code} ผิดพลาด!"`, "", "error");
          }
        }
      });
    },

    async getDataCertificateMaster() {
      const data = await apiCertificate.getDataCertificate_master();
      //console.log(data)
      this.dataLoad = data.data;
      // console.log(this.dataLoad.data);
    },

    editCertificate(data) {
      // แปลง 0 กับ 1 เป็น true กับ false
      data.sign = data.sign === 1;
      data.two_sign = data.two_sign === 1;

      localStorage.setItem("certificate_data", JSON.stringify(data));
      this.$store.state.certificate_data = data;
      this.$router.push({
        name: "Certificate-Edit",
      });
    },

    async deleteCertificate(pj_code) {
      this.deleteAlert(pj_code);
    },
  },
  computed: {
    customItems() {
      return this.dataLoad.data.map((item) => ({
        ...item,
      }));
    },
  },
};
</script>

<style>
.custom-color {
  background-color: #ffffff;
}
</style>