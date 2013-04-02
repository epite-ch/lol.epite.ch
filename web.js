var http        = require('http');
var url         = require('url');
var querystring = require('querystring');
var imagemagick = require('imagemagick');
var cookie      = require('cookie');
var analytics   = require('node-ga')(process.env.EPITE_LOL_GA);

var data    = require('./data.js');
var strings = require('./strings.js');
var routes  = require('./routes.js');

var pictureRegex = /\/([a-z]+)(%1C(.*?)%1C(.*?))?\.png/i;

function displayPicture (res, path) {
	var texts = path.match(pictureRegex);
	texts[1] = texts[1].toLowerCase();
	if (!data[texts[1]]) return routes.route404(res, path);

	try {
		texts[3] = (texts[3] ? decodeURIComponent(texts[3]) : data[texts[1]]['t_top']).toUpperCase();
		texts[4] = (texts[4] ? decodeURIComponent(texts[4]) : data[texts[1]]['t_bot']).toUpperCase();
	} catch (URIError) {
		return routes.route404(res, path);
	}


	var args = [ 'pictures/' + data[texts[1]]['t_pic'],
		'-font', './Impact.ttf',
		'-pointSize', '42',
		'-fill', 'white',
		'-stroke', 'black',
		'-strokewidth', '2',
		'-gravity', 'north', '-annotate', '0', texts[3],
		'-gravity', 'south', '-annotate', '0', texts[4],
		'PNG:-'
	];
	return imagemagick.convert(args, pictureDone);

	function pictureDone (err, stdout, stderr) {
		if (err) {
			console.dir(err);
			return routes.route500(res);
		}
		res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stdout.length, 'Cookie': res.cookieGA });
		return res.end(stdout, 'binary');
	};
};

function handleServer (req, res) {
	req.cookie = cookie.parse(req.headers.cookie);
	return analytics(req, res, function () {
		var pathname = url.parse(req.url).pathname;
		if (pathname.indexOf('/index') === 0) pathname = '/';
		if (pathname === '/') {
			return routes.routeIdx(res);
		}
		if (pathname === '/favicon.ico') {
			return res.end('');
		}
		if (pictureRegex.test(pathname)) {
			return displayPicture(res, pathname);
		}
		return routes.route404(res, pathname);
	});
};

http.createServer(handleServer).listen(process.env.PORT || 3000);
console.log('Listening!');

