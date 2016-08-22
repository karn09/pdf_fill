const parse = require('csv-parse');
const fs = require('fs');
const path = require('path')
const root = path.join(__dirname, '..', '..', '/');

module.exports = {
  read: function(fileName, cb) {
    let file = root + fileName
    return fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        throw err
      }
      return parse(data, {
        columns: true,
        trim: true,
        auto_parse: true
      }, function(err, info) {
        return cb(info);
      })
    })
  }
}
