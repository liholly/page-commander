var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime-types');

var defaultIndex = 'example/page/index.html';

function getContentType(pathname) {
	return {'Content-Type': mime.lookup(pathname)};
}

http.createServer(function (request, response) {
	var pathname = url.parse(request.url).pathname;

	console.log("Request for " + pathname + " received.");

	var __pathname = pathname.substr(1) || defaultIndex;
	fs.readFile(__pathname, function (err, data) {
		var __type = getContentType(pathname);

		if (err) {
			console.log(err);
			response.writeHead(404, __type);
		} else {
			response.writeHead(200, __type);
			response.write(data.toString());
		}

		response.end();
	});
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');