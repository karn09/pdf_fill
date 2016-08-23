const app = require('./app');
const fs = require('fs');
const check = app.check;
const csv = app.csv;
const pdf = app.pdf;

const CSVINPUT = check.csv(process.argv[2]);
const TEMPLATE = check.template(process.argv[3]) || '';
const ARGS = process.argv[4] !== undefined ? process.argv[4].split(' ') : '';
console.log(ARGS)
return csv.read(CSVINPUT, function(data) {
  // console.log(data[0])
  return pdf.write(data[0], TEMPLATE, ARGS, function(pdf) {
    fs.writeFile('test.pdf', pdf, function(err) {
      if (err) throw err;
      console.log('saved!')
    })
  })
})
