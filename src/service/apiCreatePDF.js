import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// import sarabun from '../font/thSarabun_Font'
// import timeNewRoman from '../font/timeNewRoman_Font'

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// นำ Base64-encoded Font ไปใช้
// pdfMake.vfs["Sarabun-Regular.ttf"] = sarabun.normal;
// pdfMake.vfs["times.ttf"] = timeNewRoman.normal;
// pdfMake.vfs["timesbd.ttf"] = timeNewRoman.bold;
import imgFromBase64 from "../assets/img/logo_mu";

function isEnglish(char) {
  const charCode = char.charCodeAt(0);
  // ตรวจสอบว่ารหัส Unicode อยู่ในช่วงของตัวอักษรภาษาอังกฤษ
  return (
    (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  );
}

const certification_pdf = async (excel, form) => {
  // console.log('x : ',pdfMake.vfs)
  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",

    info: {
      title: "Certificate-" + form.language,
      author: "Bam",
      subject: "Certificate",
      keyword: "cer",
    },

    styles: {
      mid: {
        alignment: "center",
      },
      topic: {
        bold: true,
        fontSize: 12,
      },
      right: {
        alignment: "right",
      },
      // icon: { font: 'Fontello' }
    },
    //watermark: { text: 'ตัวอย่าง', color: 'blue', opacity: 0.2, fontSize: 50, bold: false, italics: false },
    content: run(excel, form),

    images: {
      logo: imgFromBase64.logo_mu,
      sign_th: imgFromBase64.sign_th,
      sign_eng: imgFromBase64.sign_eng,
      footer_th: imgFromBase64.myfoot_th,
      footer_eng: imgFromBase64.myfoot_eng,
    },
    defaultStyle: {
      lineHeight: 1.6,
      font: form.language === "TH" ? "THSarabunNew" : "TimeNewRoman",
      fontSize: form.language === "TH" ? 14 : 18,
      alignment: "center",
    },
  };
  pdfMake.fonts = {
    THSarabunNew: {
      normal: "Sarabun-Regular.ttf",
      bold: "Sarabun-Bold.ttf",
      italics: "Sarabun-Thin.ttf",
      bolditalics: "Sarabun-Light.ttf",
    },
    TimeNewRoman: {
      normal: "times.ttf",
      bold: "timesbd.ttf",
      italics: "times.ttf",
      bolditalics: "times.ttf",
    },

    Arial: {
      normal: "arial.ttf",
    },
  };

  //const result = await createPDF(docDefinition);
  const result = pdfMake.createPdf(docDefinition);
  return result;
};

function signOption(form) {
  let data = "";
  // TH
  if (form.language === "TH") {
    // 2 ลายเซ็น
    if (form.two_sign) {
      // ผอ. เซ็น
      if (form.sign) {
        // console.log('TH 2Sign Sign')
        data = {
          columns: [
            form.base64_sign_add_th
              ? [
                  {
                    image: form.base64_sign_add_th,
                    width: 170,
                    height: 70,
                    absolutePosition: { x: -215, y: 420 },
                  },
                ]
              : [],
            // ลายเซ็นที่ 2 (ผอ.)
            [
              // second column consists of paragraphs
              {
                image: "sign_th",
                width: 170,
                height: 70,
                absolutePosition: { x: 350, y: 420 },
              },
            ],
          ],
        };
      }
      // ผอ. ไม่เซ็น
      else {
        //TH 2 ลายเซ็น ผอ. ไม่เซ็น
        // add เพิ่มเซ็น
        if (form.base64_sign_add_th) {
          data = {
            columns: [
              [
                {
                  image: form.base64_sign_add_th,
                  width: 250,
                  height: 80,
                  absolutePosition: { x: -250, y: 395 },
                },
              ],
            ],
          };
        }
      }
    } else {
      // 1 ลายเซ็น
      if (form.sign) {
        // TH 1 ลายเซ็น ผอ. เซ็น
        data = [
          {
            image: "sign_th",
            width: 220,
            height: 70,
            absolutePosition: { x: 70, y: 410 },
          },
        ];
        // console.log('TH 1Sign Sign')
      } else {
        // 1 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('TH 1Sign Sign')
      }
    }
  } else {
    // ENG
    if (form.two_sign) {
      if (form.sign) {
        // console.log('ENG 2Sign Sign')
        data = [
          form.base64_sign_add_eng
            ? {
                image: form.base64_sign_add_eng,
                width: 250,
                height: 80,
                //absolutePosition: { x: -200, y: 410 },
                absolutePosition: { x: -250, y: 395 },
              }
            : {},
          {
            image: "sign_eng",
            width: 250,
            height: 80,
            //absolutePosition: { x: -200, y: 410 },
            absolutePosition: { x: 350, y: 400 },
          },
        ];
      } else {
        // ENG 2 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('ENG 2Sign NoSign')
        data = [
          // {
          //   text: '(............................................)',
          //   absolutePosition: { x: -205, y: 450 }
          // },
          // {
          //   text: '(............................................)',
          //   absolutePosition: { x: 335, y: 450 }
          // }
        ];
      }
    } else {
      // 1 ลายเซ็น
      if (form.sign) {
        // ENG 1 ลายเซ็น ผอ. เซ็น
        // console.log('ENG 1Sign Sign')
        data = [
          {
            image: "sign_eng",
            width: 250,
            height: 80,
            absolutePosition: { x: 60, y: 415 },
          },
        ];
      } else {
        // ENG 1 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('ENG 1Sign Sign')
        data = [
          // {
          //   text: '(............................................)',
          //   absolutePosition: { x: 70, y: 455 }
          // }
        ];
      }
    }
  }
  return data;
}

function run(excel, form) {
  let s = [];
  let valueX = 0;
  let valueMargin = 15;

  // console.log(form.signListSelect)

  //console.log(form.pj_code, form.no);

  //let url = "http://10.62.38.51:3300/";
  let url = "https://mb.mahidol.ac.th/mb_certificate/#/";

  if (form.pj_code.length === 7) {
    valueX = 613;
  } else if (form.pj_code.length === 8) {
    valueX = 608;
  } else if (form.pj_code.length === 9) {
    valueX = 603;
  } else if (form.pj_code.length === 10) {
    valueX = 599;
  } else if (form.pj_code.length === 11) {
    valueX = 596;
  } else if (form.pj_code.length === 12) {
    valueX = 590;
  }
  signOption(form);

  let hasSpecialChar = false;

  for (let i = 0; i < form.pj_name.length; i++) {
    const char = form.pj_name.charAt(i);

    // เช็คว่า char เป็นตัวอักษรพิเศษหรือไม่
    if (!/^[A-Za-z0-9ก-๙\s]*$/.test(char)) {
      hasSpecialChar = true;
      break; // หยุดลูปเมื่อเจอตัวอักษรพิเศษ
    }
  }

  excel.forEach((e, index) => {
    s.push(
      form.language === "TH"
        ? {
            image: "logo",
            width: 80,
          }
        : {
            image: "logo",
            width: 80,
            absolutePosition: { x: 50, y: 30 },
          },

      {
        text:
          excel.length === 1
            ? "CERTIFICATION NUMBER  " +
              form.currentYear +
              "-" +
              form.pj_code +
              "-" +
              form.no.toString().padStart(4, "0")
            : "CERTIFICATION NUMBER  " +
              form.currentYear +
              "-" +
              form.pj_code +
              "-" +
              String(index + 1).padStart(4, "0"),
        fontSize: 9,
        font: "THSarabunNew",
        absolutePosition: { x: valueX, y: 40 },
      },

      excel.length === 1
        ? {
            qr:
              `${url}` +
              "show-pdf/path?" +
              `param1=${form.pj_code}` +
              "&" +
              `param2=${form.no}`,
            fit: 60,
            absolutePosition: { x: 760, y: 60 },
          }
        : {
            qr:
              `${url}` +
              "show-pdf/path?" +
              `param1=${form.pj_code}` +
              "&" +
              `param2=${e.no}`,
            fit: 60,
            absolutePosition: { x: 760, y: 60 },
          },

      form.language === "Eng"
        ? {
            text: "Institute of  Molecular Biosciences",
            color: "#1565C0",
            fontSize: 24,
            absolutePosition: { x: 50, y: 120 },
          }
        : {},
      form.language === "Eng"
        ? {
            text: "Mahidol University ",
            color: "#1565C0",
            fontSize: 24,
            absolutePosition: { x: 50, y: 150 },
          }
        : {},

      form.language === "TH"
        ? {
            text: "เกียรติบัตรนี้ให้ไว้เพื่อแสดงว่า",
            margin: [0, 15, 0, 0],
            fontSize: 18,
          }
        : {
            text: "This is to certify that",
            absolutePosition: { x: 50, y: 180 + valueMargin },
          },

      form.language === "TH"
        ? {
            text: isEnglish(e.prefix.charAt(0))
              ? e.prefix + " " + e.name
              : e.prefix.trim() + e.name,
            color: "#0D47A1",
            fontSize: 28,
          }
        : {
            text: e.prefix + " " + e.name,
            color: "#0D47A1",
            fontSize: 34,
            absolutePosition: { x: 50, y: 215 + valueMargin },
            bold: true,
          },

      form.language === "Eng"
        ? {
            text: form.participation_status,
            alignment: "center",
            absolutePosition: { x: 50, y: 265 + valueMargin },
          }
        : { text: form.participation_status, alignment: "center" },

      form.language === "TH"
        ? {
            text: "“" + form.pj_name + "”",
            color: "#1565C0",
            fontSize: form.pj_name.length > 65 ? 22 : 24, // เพิ่มเงื่อนไขนี้
            absolutePosition: { x: 50, y: 250 + valueMargin },
            font: hasSpecialChar ? "Arial" : undefined,
          }
        : {
            text: form.pj_name,
            color: "#1565C0",
            fontSize: form.pj_name.length > 52 ? 26 : 28, // เพิ่มเงื่อนไขนี้
            absolutePosition: { x: 50, y: 300 + valueMargin },
            bold: true,
          },

      { text: form.date },

      form.language === "TH"
        ? {
            text: form.date_desc,
            absolutePosition: { x: 50, y: 300 + valueMargin },
          }
        : form.language === "Eng" &&
          (form.pj_code.substring(0, 3) === "PAR" ||
            form.pj_code.substring(0, 4) === "ASST")
        ? {
            text: form.date_desc,
            absolutePosition: { x: 50, y: 350 + valueMargin },
          }
        : {
            text: form.date_desc,
            absolutePosition: { x: 50, y: 340 + valueMargin },
          },

      form.language === "TH"
        ? {
            text: "ณ สถาบันชีววิทยาศาสตร์โมเลกุล มหาวิทยาลัยมหิดล",
            absolutePosition: { x: 50, y: 345 + valueMargin },
          }
        : {},

      signOption(form),

      form.two_sign
        ? // 2 ลายเซ็น
          {
            columns: [
              [
                // คนที่เพิ่ม
                // TH เเละ ENG
                form.sign_add_id
                  ? {
                      text: `${form.add_name}`,
                      fontSize: form.language === "TH" ? 11 : 13,
                      bolditalics: true,
                      absolutePosition: { x: -220, y: 495 },
                    }
                  : "",

                // ตำแหน่ง TH เเละ ENG
                form.sign_add_id
                  ? {
                      text: `${form.add_position}`,
                      fontSize: form.language === "TH" ? 11 : 13,
                      bolditalics: true,
                      absolutePosition: { x: -220, y: 520 },
                    }
                  : "",
              ],

              // ผอ. ชื่อ
              [
                {
                  text:
                    form.language === "TH"
                      ? "ศาสตราจารย์ ดร. นายแพทย์นรัตถพล เจริญพันธุ์"
                      : "Professor Narattaphol Charoenphandhu, M.D., Ph.D.",
                  fontSize: form.language === "TH" ? 11 : 13,
                  bolditalics: true,
                  absolutePosition: { x: 330, y: 495 },
                },
                // ผอ. ตำแหน่ง
                {
                  text:
                    form.language === "TH"
                      ? "ผู้อำนวยการสถาบันชีววิทยาศาสตร์โมเลกุล"
                      : "Director",
                  fontSize: form.language === "TH" ? 11 : 13,
                  bolditalics: true,
                  absolutePosition: { x: 335, y: 520 },
                },
              ],
            ],
          }
        : // 1 ลายเซ็น
          {
            columns: [
              [
                form.language === "TH"
                  ? {
                      text: "ศาสตราจารย์ ดร. นายแพทย์นรัตถพล เจริญพันธุ์",
                      fontSize: 11,
                      bolditalics: true,
                      absolutePosition: { x: 45, y: 495 },
                    }
                  : {
                      text: "Professor Narattaphol Charoenphandhu, M.D., Ph.D.",
                      fontSize: 13,
                      bolditalics: true,
                      absolutePosition: { x: 45, y: 495 },
                    },
                form.language === "TH"
                  ? {
                      text: "ผู้อำนวยการสถาบันชีววิทยาศาสตร์โมเลกุล",
                      fontSize: 11,
                      bolditalics: true,
                      absolutePosition: { x: 50, y: 520 },
                    }
                  : {
                      text: "Director",
                      fontSize: 13,
                      bolditalics: true,
                      absolutePosition: { x: 50, y: 520 },
                    },
              ],
            ],
          },
      {
        image: form.language === "TH" ? "footer_th" : "footer_eng",
        width: 810,
        height: 37,
        absolutePosition: { x: 40, y: 548 },
        pageBreak: excel.length === 1 ? "" : "after",
      }
    );
  });
  return s;
}

export default {
  certification_pdf,
};
