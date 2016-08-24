const fs = require('fs');
const path = require('path')
const root = path.join(__dirname, '..', '..', '/');
const fillPdf = require('fill-pdf');

module.exports = {
  generate: function(data, template, args) {
    let templatePath = root + template;
    return new Promise(function(resolve, reject) {
      fillPdf.generatePdf(data, templatePath, args, function(err, output) {
        if (err) reject(err);
        resolve(output)
      })
    })
  },

  write: function (filePath, file, callback) {
    return fs.writeFile(filePath, file, function (err) {
      if (err) throw err
      callback(' pdf created.')
      console.log()
    })

  }

}
