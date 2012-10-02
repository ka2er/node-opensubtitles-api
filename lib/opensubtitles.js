var fs = require('fs');

var os = module.exports = {


	computeHash : function(path) {



		fs.stat(path, function(err, stat) {

			console.log(stat.size);
		});
	}
};