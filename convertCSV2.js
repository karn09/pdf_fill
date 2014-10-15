var csv = require('fast-csv');
var fdf = require('fdf.js');
var fs = require('fs');
var childPrc = require('child_process');
var stream = fs.createReadStream("8.28.csv");
var counter = 0;


var csvData = [];

var createFDFfromCSV = csv.fromStream(stream, {
  headers: ["Name", "Position", "Date", "Reviewer"]
});


createFDFfromCSV.on("record", function(data) {
  counter++;
  var newFdf = fdf.generate(data);
  var fileName = 'record' + counter + '.fdf';
  var pdfFileName = __dirname + '/filled/' + (data['Reviewer'] + '-' + data['Name']).split(' ').join('') + '.pdf';
  //  console.log(pdfFileName);
  var tempFdfFile = __dirname + '/temp/' + fileName;
  fs.writeFile(tempFdfFile, newFdf);
  //  generatePDF(pdfFileName, tempFdfFile); // attempt to call spawn processes as templates creaed
  // not working, gives some unknown error and stops
}).on("end", function(numRecords) {
  counter = 0;
  console.log(numRecords + " forms created.");
});


// var generatePDF = function(pdfFileName, tempFdfFile) {
//   //  var filledPdf = __dirname + '/filled/' + 'filledRec' + i + '.pdf';
//   //  var fileName = 'record' + i + '.fdf';
//   //  var tempFdfFile = __dirname + '/temp/' + fileName;
//   childPrc.spawn('pdftk', ['template.pdf', 'input_pw', 'eval2014', 'fill_form', tempFdfFile, 'output', pdfFileName, 'user_pw', 'eval2014', 'allow', 'AllFeatures']);
// };
for (var i = 1; i <= 309; i++) {
  var pdfFileName = __dirname + '/filled/' + 'filledRec' + i + '.pdf';
  var fileName = 'record' + i + '.fdf';
  var tempFdfFile = __dirname + '/temp/' + fileName;
  childPrc.spawn('pdftk', ['template.pdf', 'input_pw', 'eval2014', 'fill_form', tempFdfFile, 'output', pdfFileName, 'user_pw', 'eval2014', 'allow', 'AllFeatures']);
}
