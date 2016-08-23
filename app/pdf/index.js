const fs = require('fs');
const path = require('path')
const root = path.join(__dirname, '..', '..', '/');
const fillPdf = require('fill-pdf');

module.exports = {
  write: function(data, template, args, callback) {
    let templatePath = root + template;
    return fillPdf.generatePdf(data, templatePath, args, function(err, output) {
      if (!err) {
        return callback(output)
      }
    })
  },

  read: function () {

  }

}
