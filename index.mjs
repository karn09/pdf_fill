#!/usr/bin/env node

import FdfGenerator from "./fdf_generator.mjs";
import CSVReader from "./csv_reader.mjs";
import PDFGenerator from "./pdf_generator.mjs";

// Path to CSV input data
const CSVPath = "";
// path to PDF containing fillable fields (matches headers in CSV data)
const pdfTemplatePath = "";
// should consist of headers within CSV, output PDF/FDF files matching this pattern
const pdfFileNamePattern = "";
// delimiter if file name output contains special characters like _ or -
const delimiter = "_";
// where to place filled PDF files
const pdfOutputPath = "";
// password to set on PDF
const pdfPassword = "";

const fdf = new FdfGenerator(pdfFileNamePattern, delimiter);
const csvFileData = new CSVReader(CSVPath);
const pdf = new PDFGenerator(pdfTemplatePath, pdfOutputPath, pdfPassword);

const dataArr = await csvFileData.getData();

dataArr.forEach(async (data) => {
  await fdf.createFDF(data);
  await pdf.createPDF(fdf, data);
});
