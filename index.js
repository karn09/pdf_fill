const app = require('./app');
const check = app.check;
const csv = app.csv;

const CSVINPUT = check.csv(process.argv[2]);
const TEMPLATE = check.template(process.argv[3]);

csv.read(CSVINPUT, function(data) {
  console.log(data)
})
