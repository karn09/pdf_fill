// error checking for rest of app
module.exports = {
  csv: function(file) {

    const csvRegex = new RegExp(/.csv$/, 'gi')

    if (csvRegex.test(file)) {
      return file;
    } else {
      throw file + ' does not end in .csv'
    }
  },

  template: function(file) {

        const csvRegex = new RegExp(/.pdf$/, 'gi')

        if (csvRegex.test(file)) {
          return file;
        } else {
          throw file + ' does not end in .pdf'
        }
  }
}
