var fs = require('fs');


fs.readFile('output.json', 'utf8', function (err, data) {

		if (err) throw err;
		obj = JSON.parse(data);
		console.log('length', obj.length);

	});