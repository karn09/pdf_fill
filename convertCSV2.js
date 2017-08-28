const csv = require("fast-csv");
const fdf = require("fdf.js");
const generator = require("utf8-fdf-generator").generator;
const fdfRoot = './temp';
const pdfRoot = './filled';
const _ = require("lodash");
var childPrc = require("child_process");
var CSVINPUT = process.argv[2];
const PDFTEMPLATE = '2017perf.pdf'; // set me
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
        console.log(pdf)
        const fdfName = `${pdf.name}-${pdf.reviewer}.fdf`;
        const pdfName = `${pdf.reviewer}_for_${pdf.name}.pdf`;
        await generator({
          Name: pdf.name,
          Position: pdf.position,
          Date: pdf.date,
          Reviewer: pdf.reviewer
        }, `${fdfRoot}/${fdfName}`);
        await fillPdf(pdfName, fdfName);
      } catch (err) {
        console.log(err);
      }
    });
  })
  .on("end", function(numRecords) {
    console.log(numRecords + " forms created.");
  });

function fillPdf(pdfPath, fdfPath) {
  var pdfFileName =
    `${pdfRoot}/${pdfPath}`;
  var tempFdfFile =
    `${fdfRoot}/${fdfPath}`;
  var writePdf = childPrc.spawn("pdftk", [
    PDFTEMPLATE,
    "fill_form",
    tempFdfFile,
    "output",
    pdfFileName,
    "allow",
    "AllFeatures"
  ]);
  writePdf.on("exit", function(exitCode) {
    console.log(pdfFileName + " written to disk.");
  });
  writePdf.on('error', console.error);
}
