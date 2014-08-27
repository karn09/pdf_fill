var csv = require('fast-csv');
var fdf = require('fdf.js');
var fs = require('fs');
var childPrc = require('child_process');
var stream = fs.createReadStream("perflist.csv");
var counter = 0;

var createFDFfromCSV = csv.fromStream(stream, {
  headers: ["Name", "Position", "Date", "Reviewer"]
}).on("record", function(data) {
  counter++;
  var newFdf = fdf.generate(data);
  var fileName = 'record' + counter + '.fdf';
  var tempFdfFile = __dirname + '/temp/' + fileName;
  fs.writeFile(tempFdfFile, newFdf);
}).on("end", function(numRecords) {
  counter = 0;
  console.log(numRecords + " forms created.");
});

for (var i = 1; i <= 297; i++) {
  var filledPdf = __dirname + '/filled/' + 'filledRec' + i + '.pdf';
  var fileName = 'record' + i + '.fdf';
  var tempFdfFile = __dirname + '/temp/' + fileName;
  childPrc.spawn('pdftk', ['df21.pdf', 'fill_form', tempFdfFile, 'output', filledPdf, 'user_pw', 'eval2014']);
}
