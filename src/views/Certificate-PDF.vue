<template >
  <v-row justify="center" class="fontSarabun">
    <v-form class="mx-auto" ref="form" lazy-validation align="center" rounded>
      <v-card ref="form" :height="345" :width="770">
        <v-card-text>
          <v-row
            ><v-col cols="12" md="6"
              ><v-text-field
                label="ชื่อโครงการ"
                v-model="form.pj_name"
                @change="saveCreatePDF"
                :rules="textRule"
                required
              ></v-text-field></v-col
            ><v-col
              ><v-row
                ><v-col cols="4">
                  <v-switch
                    v-model="form.language"
                    @change="saveCreatePDF"
                    hide-details
                    true-value="Eng"
                    false-value="TH"
                    color="indigo"
                    :label="`ฟอร์ม : ${form.language}`"
                  ></v-switch> </v-col
                ><v-col
                  ><v-checkbox
                    label="ผอ. เซ็น"
                    v-model="form.sign"
                    @change="saveCreatePDF"
                    color="indigo"
                    hide-details
                  ></v-checkbox></v-col
                ><v-col
                  ><v-checkbox
                    label="2 ลายเซ็น"
                    v-model="form.two_sign"
                    @change="saveCreatePDF"
                    color="indigo-darken-3"
                    hide-details
                  ></v-checkbox></v-col></v-row></v-col
          ></v-row>
          <v-row class="mt-n8">
            <v-col cols="12" md="6"
              ><v-text-field
                label="รหัสโครงการ"
                id="pj_name"
                v-model="form.pj_code"
                @change="saveCreatePDF"
                :rules="pjCodeRule"
                @input="handleInput"
                required
              ></v-text-field
            ></v-col>
            <v-col cols="6" md="1">
              <v-checkbox
                v-model="form.selectSign"
                @change="saveCreatePDF"
                color="indigo"
                hide-details
                :disabled="!form.two_sign"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="5">
              <v-select
                v-model="form.sign_add_id"
                label="เลือกลายเซ็นที่ 2"
                :items="dataSign"
                item-value="id"
                :item-title="form.language === 'TH' ? 'name_th' : 'name_eng'"
                :rules="selectSignRule"
                :disabled="!form.selectSign"
              />
            </v-col>
          </v-row>
          <v-row class="mt-n8"
            ><v-col cols="6"
              ><v-text-field
                label="รูปแบบการเข้าร่วม"
                v-model="form.participation_status"
                @change="saveCreatePDF"
                :rules="textRule"
                required
              ></v-text-field></v-col
            ><v-col cols="6"
              ><v-text-field
                label="ชื่อ"
                v-model="form.add_name"
                @change="saveCreatePDF"
                :rules="twoSignRule"
                :disabled="!form.two_sign"
              ></v-text-field></v-col
          ></v-row>
          <v-row class="mt-n8"
            ><v-col
              ><v-text-field
                label="วันที่"
                v-model="form.date_desc"
                @change="saveCreatePDF"
                :rules="textRule"
                required
              ></v-text-field></v-col
            ><v-col
              ><v-text-field
                label="ตำแหน่ง"
                v-model="form.add_position"
                @change="saveCreatePDF"
                :rules="twoSignRule"
                :disabled="!form.two_sign"
              ></v-text-field></v-col
          ></v-row>
          <v-row>
            <input
              class="mt-n5 ml-3"
              type="file"
              @change.left="add_file()"
              @change="saveCreatePDF"
              @click="this.$refs.myFiles.value = null"
              ref="myFiles"
              accept=".xls, .xlsx, .csv"
            />
            <v-spacer></v-spacer>
            <v-btn
              v-if="save_to_db"
              @change="saveCreatePDF"
              @click="create_CertificatePDF"
              class="mt-n7 mx-2"
              size="small"
              color="orange"
              icon="mdi-refresh"
            ></v-btn>
            <!-- @click="showDialog = true" -->
            <v-btn
              v-if="save_to_db"
              @change="saveCreatePDF"
              @click="validateCheck"
              class="mt-n7 mx-2"
              size="small"
              color="indigo"
              icon="mdi-cloud-upload"
            ></v-btn>
          </v-row>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
      </v-card>
    </v-form>

    <!-- 
    dialog confirm save data to db -->
    <v-dialog v-model="showDialog" max-width="300">
      <v-card>
        <v-card-title> save certificate to database </v-card-title>
        <v-card-text>
          Are you sure you want to perform this action?
        </v-card-text>
        <v-card-actions class="text-center">
          <v-btn color="red darken-1" text @click="showDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="green darken-1"
            :loading="loadingBtn"
            type="submit"
            @click="savePdfToDB"
            @change="saveCreatePDF"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <v-row justify="center">
    <div>
      <!-- ใช้ <iframe> เพื่อแสดงไฟล์ PDF -->
      <iframe
        :src="urlWithPreferences"
        class="mt-3"
        ref="pdfIframe"
        v-if="preview"
      ></iframe>
    </div>
  </v-row>
</template>

<script>
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import createPDF from "../service/apiCreatePDF";
import apiCertificate from "../service/apiCertificate";

export default {
  data() {
    return {
      textRule: [(v) => !!v || "กรุณาใส่ข้อความ"],
      pjCodeRule: [
        (v) => !!v || "กรุณาใส่รหัสโครงการ",
        (v) =>
          /^[A-Z0-9-]*$/.test(v) ||
          "กรุณาใส่ตัวอักษรพิมพ์ใหญ่ ตัวเลข หรือเครื่องหมายลบเท่านั้น",
      ],
      twoSignRule: [
        (v) => (this.form.two_sign ? !!v || "กรุณาใส่ข้อความ" : true),
      ],

      selectSignRule: [
        (v) => (this.form.selectSign ? !!v || "กรุณาเลือก" : true),
      ],

      form: {
        pj_name: "",
        pj_code: "",
        participation_status: "",
        date_desc: "",
        currentYear: "",
        add_name: "",
        add_position: "",
        base64_sign_add_th: "",
        base64_sign_add_eng: "",
        language: "TH",
        sign: false,
        two_sign: false,
        selectSign: false,
        sign_add_id: null,
      },

      newForm: {},

      file: {
        name: "",
        size: "",
        type: "",
        lastModified: "",
        lastModifiedDate: "",
        webkitRelativePath: "",
      },

      dataSign: [],

      base_64: null,
      excel_array: null,
      preview: false,
      save_to_db: false,
      showDialog: false,
      loadingBtn: false,
    };
  },

  async mounted() {
    this.dataSign = await apiCertificate.dataSign();
    const dataFormLocal = JSON.parse(localStorage.getItem("create_pdf")) || {};
    this.form = { ...this.form, ...dataFormLocal }; //กำหนดค่าทุก property ของ dataFormLocal ลงใน this.form.

  },
  methods: {
    //บันทักข้อมูลสำเร็จ ต้องการไปยังหน้า Detail เพื่อ Print หรือไม่
    showAler_AfterSuccess() {
      Swal.fire({
        title: "บันทักข้อมูลสำเร็จ",
        text: "ต้องการไปยังหน้า PDF เพื่อสั่ง Print หรือไม่",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ไปหน้า PDF",
      }).then((result) => {
        if (result.isConfirmed) {
          this.setData(this.form);
          this.clearCreatePDF();
        } else {
          this.clearCreatePDF();
          this.preview = false;
        }
      });
    },

    showAlert(icon, title) {
      Swal.fire({
        position: "center",
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 2000,
      });
    },

    saveCreatePDF() {
      localStorage.setItem("create_pdf", JSON.stringify(this.form));
    },

    clearCreatePDF() {
      this.form = {
        pj_code: "",
        pj_name: "",
        date_desc: "",
        currentYear: "",
        add_name: "",
        add_position: "",
        language: "TH",
        sign: false,
        two_sign: false,
      };
      this.saveCreatePDF();
    },

    //handleInput(event) {
    handleInput() {
      // แปลงเป็นตัวพิมพ์ใหญ่
      //this.form.pj_code = event.target.value.toUpperCase();

      // กรองเฉพาะภาษาอังกฤษและเครื่องหมาย "-"
      this.form.pj_code = this.form.pj_code.replace(/[^A-Za-z0-9-]/g, "");

      // จำกัดจำนวนตัวอักษรไม่เกิน 12 ตัว
      this.form.pj_code = this.form.pj_code.slice(0, 12);
    },

    async add_file() {
      const file = this.$refs.myFiles.files[0];
      const data = await file.arrayBuffer();
      // console.log("data : ", data);
      const workbook = XLSX.read(data);
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const result = XLSX.utils.sheet_to_json(ws, {});
      this.excel_array = result;
    },

    async create_CertificatePDF() {
      const currentDate = new Date();
      this.form.currentYear = currentDate.getFullYear();

      const pdfDocGenerator = await createPDF.certification_pdf(
        this.excel_array,
        this.form
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
      this.save_to_db = true;
    },

    // เช็กเมื่อกดปุ่ม save to db
    validateCheck() {
      this.$refs.form.validate();

      this.$refs.form.validate().then((result) => {
        // ตรวจสอบค่า valid
        if (result.valid) {
          // ตรวจสอบผ่าน
          if (this.form.pj_code && this.form.pj_name && this.form.date_desc) {
            if (
              !this.form.two_sign ||
              (this.form.add_name && this.form.add_position)
            ) {
              this.showDialog = true;
            }
          }
        }
      });
    },

    async savePdfToDB() {
      this.loadingBtn = true;
      setTimeout(async () => {
        // check ว่า code ใบเซอร์ซ้ำมั้ย
        const result = await apiCertificate.duplicateCheck(this.form.pj_code);
        // console.log(this.form);
        // กรณีไม่ซ้ำ
        if (result.data.msg === "ok") {

          // เอาค่า base64_sign_add_th, base64_sign_eng ออกก่อนส่ง เพื่อลดขนาดข้อมูล
          this.newForm = {
            ...this.form,
            base64_sign_add_th: undefined,
            base64_sign_add_eng: undefined,
          };

          const resultInsert = await apiCertificate.createCertificate(
            this.newForm,
            this.excel_array
          );
          // กรณี insert master เเละ detail สำเร็จ
          if (resultInsert.data.msg === "ok") {
            await apiCertificate.getDataCertificate_master();
            this.showAler_AfterSuccess();
          } else {
            this.showAlert("error", "บันทึกไม่สำเร็จ");
          }
          // กรณีซ้ำ
        } else {
          this.showAlert("error", "รหัสโครงการนี้ซ้ำ");
        }

        this.loadingBtn = false;
        this.showDialog = false;
      }, 1500);
    },

    // เก็บค่ากรณีผู้ใช้จะกดไปหน้า print ให้ส่งไปหน้า showpdf
    setData(data) {
      this.$router.push({
        path: "/show-pdf/path",
        query: { param1: data.pj_code },
      });

      // แปลง 0 กับ 1 เป็น true กับ false
      // data.sign = data.sign === 1;
      // data.two_sign = data.two_sign === 1;
      // localStorage.setItem("certificate_data", JSON.stringify(data));
      // this.$store.state.certificate_data = data;
      // this.$router.push({
      //   name: "Certificate-Edit",
      // });
    },
  },

  computed: {
    urlWithPreferences() {
      // เพิ่ม viewer preferences ลงใน URL
      return `${this.base_64}#toolbar=0&navpanes=0&scrollbar=0`;
    },
  },

  watch: {
    excel_array() {
      this.create_CertificatePDF();
    },

    "form.language": {
      handler() {
        const objectWithId = this.dataSign.find(
          (obj) => obj.id === this.form.sign_add_id
        );
        if (
          this.form.selectSign === true &&
          this.form.sign_add_id >= 1 
        ) {
          this.form.add_name =
            this.form.language === "TH"
              ? objectWithId.name_th
              : objectWithId.name_eng;
          this.form.add_position =
            this.form.language === "TH"
              ? objectWithId.position_th
              : objectWithId.position_eng;
          this.form.base64_sign_add_th = objectWithId.base64_sign_th;
          this.form.base64_sign_add_eng = objectWithId.base64_sign_eng;
          this.saveCreatePDF();
        }
      },
      immediate: true, // ให้ทำงานทันทีเมื่อ component ถูก mount
    },

    // 2 sign check
    "form.two_sign": {
      handler(newValue) {
        if (!newValue) {
          this.form.add_name = null;
          this.form.add_position = null;
          this.form.sign_add_id = null;
          this.form.selectSign = false;
          this.form.base64_sign_add_th = null;
          this.form.base64_sign_add_eng = null;
        }
      },
      immediate: true, // เพื่อให้ทำการเช็คค่าเมื่อ component ถูก mount
    },

    // v-check
    "form.selectSign": {
      handler(newValue) {
        if (!newValue) {
          this.form.add_name = null;
          this.form.add_position = null;
          this.form.sign_add_id = null;
          this.form.base64_sign_add_th = null;
          this.base64_sign_add_eng = null;
        }
      },
      immediate: true, // เพื่อให้ทำการเช็คค่าเมื่อ component ถูก mount
    },

    // v-select
    "form.sign_add_id": {
      handler(newValue) {
        // ตรวจสอบว่า form.sign_add_id มีค่าหรือไม่
        if (newValue) {
          const objectWithId = this.dataSign.find(
            (obj) => obj.id === this.form.sign_add_id
          );

          if (objectWithId) {
            this.form.add_name =
              this.form.language === "TH"
                ? objectWithId.name_th
                : objectWithId.name_eng;
            this.form.add_position =
              this.form.language === "TH"
                ? objectWithId.position_th
                : objectWithId.position_eng;
            this.form.base64_sign_add_th = objectWithId.base64_sign_th; // เอาใน db มาใส่ในตัวแปรใหม่
            this.form.base64_sign_add_eng = objectWithId.base64_sign_eng;
            this.saveCreatePDF();
          }
        }
      },
      immediate: true, // ให้ทำงานทันทีเมื่อ component ถูก mount
    },
  },
};
</script>

<style scoped>
.text-center {
  display: flex;
  justify-content: right;
}
</style>



