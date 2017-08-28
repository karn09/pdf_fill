const csv = require("fast-csv");
const fdf = require("fdf.js");
const generator = require("utf8-fdf-generator").generator;
const fdfRoot = "temp";
const pdfRoot = "filled";
var qpdf = require("node-qpdf");
const _ = require("lodash");
var childPrc = require("child_process");
var CSVINPUT = process.argv[2];
const PDFTEMPLATE = "perf.pdf"; // set me
csv
  .fromPath(CSVINPUT, {
    objectMode: true,
    headers: true,
    quote: null,
    strictColumnHandling: false,
    discardUnmappedColumns: true
  })
  .on("data", function(data) {
    const reviewers = _.values(
      _.pickBy(data, (value, key) => {
        if (key && _.startsWith(key, "reviewed") && value) {
          return key;
        }
      })
    );
    const reviewee = _.pickBy(data, (value, key) => {
      if (key && !_.startsWith(key, "reviewed") && value) {
        return key;
      }
    });
    const pdfs = reviewers.map(reviewer => {
      return {
        ...reviewee,
        reviewer
      };
    });

    pdfs.forEach(async pdf => {
      try {
        const fdfName = `${pdf.name}-${pdf.reviewer}.fdf`;
        const pdfName = `${pdf.reviewer}_for_${pdf.name}_2017.pdf`;
        await generator(
          {
            Name: _.get(pdf, "name", "").trim(),
            Position: _.get(pdf, "position", "").trim(),
            Date: _.get(pdf, "date", "").trim(),
            Reviewer: _.get(pdf, "reviewer", "").trim()
          },
          `${fdfRoot}/${fdfName}`
        );
        await fillPdf(pdfName, fdfName);
        console.log(pdfName);
      } catch (err) {
        console.log(err);
      }
    });
  })
  .on("end", function(numRecords) {
    console.log(numRecords + " forms created.");
  })

function qp(localFilePath) {
  var options = {
    keyLength: 128,
    password: "YOUR_PASSWORD_TO_ENCRYPT",
    print: "full",
    modify: "all",
    // restrictions: {
    // }
  };

  qpdf.encrypt(localFilePath, options);
}
function fillPdf(pdfPath, fdfPath) {
  var pdfFileName = `${pdfRoot}/${pdfPath}`;
  var tempFdfFile = `${fdfRoot}/${fdfPath}`;
  var writePdf = childPrc.spawnSync("pdftk", [
    PDFTEMPLATE,
    "fill_form",
    tempFdfFile,
    "output",
    pdfFileName,
    // "user_pw",
    // "2017​PerfRev",
    "allow",
    "AllFeatures",
    // "verbose"
  ]);
  // writePdf.on("exit", function(exitCode) {
  //   console.log(pdfFileName + " written to disk.");
  // });
  // writePdf.on("error", console.error);
}
