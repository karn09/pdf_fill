var childPrc = require('child_process');

for (var i = 1; i <= 306; i++) {
  var pdfFileName = __dirname + '/filled/' + 'filledRec' + i + '.pdf';
  var fileName = 'record' + i + '.fdf';
  var tempFdfFile = __dirname + '/temp/' + fileName;
  childPrc.spawn('pdftk', ['reviewFinal.pdf', 'input_pw', 'eval2014', 'fill_form', tempFdfFile, 'output', pdfFileName, 'user_pw', 'eval2014']);
};
