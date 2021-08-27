import { parseStream } from "fast-csv";
import * as fs from "fs";
// const generator = require('utf8-fdf-generator').generator;
const fdfRoot = "temp";
const pdfRoot = "filled";
// const _ = require('lodash');
// var childPrc = require("child_process");
// const execa = require('execa');
const CSVINPUT = process.argv[2];
const PDF_FILE = process.argv[3];
const PASSWORD = process.argv[4];
const PDFTEMPLATE = PDF_FILE;

class CSV {
  static fdfTemplatePath = "/tmp/convert_csv/fdf";

  constructor(pathToCSV, pathToInputPDF) {
    this.csvStream = fs.createReadStream(pathToCSV);
    this.pathToInputPDF = pathToInputPDF;
    // this.outputFormat = outputFormat;
  }

  async getHeaders() {
    await this.#initialize();
    return this.csvData.headers;
  }

  async getData() {
    await this.#initialize();
    return this.csvData.data;
  }

  async #doInitialize() {
    this.csvData = await this.#readCSV();
  }

  async #initialize() {
    if (!this.initializationPromise) {
      this.initializationPromise = this.#doInitialize();
    }
    return this.initializationPromise;
  }

  async #readCSV() {
    let headersBuffer = [];
    let dataBuffer = [];

    return new Promise((resolve, reject) => {
      parseStream(this.csvStream, { headers: true })
        .on("headers", (headers) => {
          headersBuffer = headers;
        })
        .on("error", (err) => {
          reject(err);
        })
        .on("data", (data) => {
          dataBuffer.push(data);
        })
        .on("end", () => {
          resolve({
            headers: headersBuffer,
            data: dataBuffer,
          });
        });
    });
  }
}

class FdfFactory {}
let a = new CSV("./2021PR.csv");
console.log(await a.getHeaders());

// return;
// csv.fromPath(CSVINPUT, {
//     objectMode: true,
//     headers: true,
//     quote: null,
//     strictColumnHandling: false,
//     discardUnmappedColumns: true
// })
//     .on('data', async function(data) {
//         try {
//             const fdfName = `${data.Username}_for_${
//                 data.Name
//             }_PerformanceReview2018.fdf`;
//             // Username_for_Name_PerformanceReview2018
//             const pdfName = `${data.Username}_for_${
//                 data.Name
//             }_PerformanceReview2018.pdf`;
//             await generator(
//                 {
//                     Name: _.get(data, 'Name', '').trim(),
//                     Position: _.get(data, 'Position', '').trim(),
//                     Date: _.get(data, 'Date', '').trim(),
//                     Reviewer: _.get(data, 'Reviewer', '').trim()
//                 },
//                 `${fdfRoot}/${fdfName}`
//             );
//             await fillPdf(pdfName, fdfName);
//             console.log(pdfName);
//         } catch (err) {
//             console.log(err);
//         }
//     })
//     .on('end', function(numRecords) {
//         console.log(numRecords + ' forms created.');
//     });

// function fillPdf(pdfPath, fdfPath) {
//     var pdfFileName = `${pdfRoot}/${pdfPath}`;
//     var tempFdfFile = `${fdfRoot}/${fdfPath}`;

//     return execa('pdftk', [
//         PDFTEMPLATE,
//         'fill_form',
//         tempFdfFile,
//         'output',
//         pdfFileName,
//         "user_pw",
//         PASSWORD,
//         'allow',
//         'AllFeatures'
//         // "verbose"
//     ]);
// }
