var csv = require('fast-csv');
var fdf = require('fdf.js');
var fs = require('fs');
var childPrc = require('child_process');

var CSVINPUT = process.argv[1]
var PDFTEMPLATE = '2015_perf_temp.pdf';
// command line arguments:
// CSV input
// headers array
// template name

var stream = fs.createReadStream(CSVINPUT);

var createFDFfromCSV = csv.fromStream(stream, {
  headers: ["Name", "Date", "Position", "Reviewer"]
});


createFDFfromCSV.on("record", function(data) {
  var newFdf = fdf.generate(data);
  var fileName = data['Name'] + '-' + data['Reviewer'] + '.fdf';
  //var pdfFileName = __dirname + '/filled/' + (data['Reviewer'] + '-' + data['Name']).split(' ').join('') + '.pdf';
  var tempFdfFile = __dirname + '/temp/' + fileName;
  fs.writeFile(tempFdfFile, newFdf);
  fillPdf(data)
}).on("end", function(numRecords) {
  console.log(numRecords + " forms created.");
});

function fillPdf (data) {

  var pdfFileName = __dirname + '/filled/' + data['Name'] + '-' + data['Reviewer'] + '.pdf';
  var tempFdfFile = __dirname + '/temp/' + data['Name'] + '-' + data['Reviewer'] + '.fdf';

//var proc = 'pdftk ' + pdfTemplate  + ' input_pw eval2015 fill_form ' + tempFdfFile + ' output ' + pdfFileName + ' user_pw eval2015 allow AllFeatures ';
//  childPrc.exec(proc,
//   function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });
  var writePdf = childPrc.spawn('pdftk', [PDFTEMPLATE, 'input_pw', 'eval2015', 'fill_form', tempFdfFile, 'output', pdfFileName, 'user_pw', 'eval2015', 'allow', 'AllFeatures']);
  writePdf.on('exit', function (exitCode) {
    console.log(pdfFileName + ' written to disk.');
  })
}
