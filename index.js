const app = require('./app');
const fs = require('fs');
const path = require('path');
const check = app.check;
const csv = app.csv;
const pdf = app.pdf;

const CSVINPUT = check.csv(process.argv[2]);
const TEMPLATE = check.template(process.argv[3]) || '';
const ARGS = process.argv[4] !== undefined ? process.argv[4].split(' ') : '';

//todo: some checking on output path
const OUTPUT_PATH = process.argv[5] !== undefined ? path.join(__dirname + process.argv[5]) : './'

function fillBuffer(data, callback) {
  data.map(function(row) {
    let filePath = OUTPUT_PATH + '/' + row.Name + '_2016.pdf';
    pdf.generate(row, TEMPLATE, ARGS, function(file) {
      // console.log(file)
      callback(file);
    })
  })
}

csv.read(CSVINPUT, function(data) {
  var buffer = [];
  fillBuffer(data, function(dat) {
    buffer.push(dat)
  })

})
