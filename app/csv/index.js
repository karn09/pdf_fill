const parse = require('csv-parse');
const fs = require('fs');
const path = require('path')
const root = path.join(__dirname, '..', '..', '/');

module.exports = {
	read: function (fileName) {
		let file = root + fileName

		return new Promise(function (resolve, reject) {
				fs.readFile(file, 'utf8', function (err, data) {
					if (err) reject(err)
					resolve(data)
				});
			})
	},

	toObject: function (csvBuffer) {
		return new Promise(function (resolve, reject) {
			parse(csvBuffer, {
				columns: true,
				trim: true,
				auto_parse: true
			}, function (err, csvObject) {
				if (err) reject(err)
				resolve(csvObject)
			})
		})
	}
}
