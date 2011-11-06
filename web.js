var http = require('http');
var url = require('url');
var data = {
    'kwame': {
	't_pic': 'kwamescigar.jpg',
	't_top': 'INTRA DOWN ?',
	't_bot': 'DEAL WITH IT' },
    'roxan': {
	't_pic': 'roxanclasse.jpg',
	't_top': 'MES DEUX PASSIONS?',
	't_bot': 'LA MODE ET LA PéDAGOGIE' },
    'sadirac': {
	't_pic': 'sadiracrobot.jpg',
	't_top': "J'AI FAIT UNE PRéPA",
	't_bot': 'JE SORTAIS TOUS LES SOIRS' },
    'shawan': {
	't_pic': 'shawanboss.jpg',
	't_top': 'I CAN HAZ',
	't_bot': 'SHIZBURGER?' },
    'pintade': {
	't_pic': 'pintadelulz.jpg',
	't_top': "VOLAILLE D'ORNEMENT",
	't_bot': 'APPRECIéE POUR SA CHAIR' }
}

function displayIndex(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Node.js > Nginx > Apache > Wordpress > Fred Christian\n');
    res.end();
}

function displayStats(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Stats!');
    res.end();
}

function display404(res, path) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('<h1>404! This shit is hosted on the intranet, bitch!</h1>');
    res.write('<hr />');
    res.write("Seriously dude, I don't have <strong>http://epilol.dreamleaves.org"+path+"</strong> here.<br />");
    res.write('<br />');
    res.write('Just go back to the <a href="/">index</a>, bro!<br />');
    res.end();
}

function renderPicture(res, face, top, bot) {
    var img = require('imagemagick')
    var pic = data[face]['t_pic'];
    console.log('CALL_' + pic);

    img.convert([pic, '-font', './Impact.ttf', '-pointSize', '54', '-fill', 'white', '-stroke', 'black', '-strokewidth', '4',
		 '-gravity', 'north', '-annotate', '0', top,
		 '-gravity', 'south', '-annotate', '0', bot,
		 'PNG:-'],
		function(err, stdout, stderr) {
		    console.log('DONE_' + pic);
		    res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stdout.length});
		    res.end(stdout, 'binary');
		    console.log('WRITTEN!' + stdout.length);
		    console.log('ERROR:' + err);
		    console.log('STDERR:' + stderr);
		});
}

function displayPicture(res, path) {
    var face;
    var text_pic, text_top, text_bot;
    var text;

    text = path.substring(1, path.length-4).split('%1C');
    if ((text.length == 3) || (text.length == 1))
    {
	var t = text[0];
	face = ((data[t]) ? t : 'kwame');
	text.shift();
    }
    if ((text.length == 2) || (text.length == 0))
    {
	text_top = ((text[0]) ? unescape(text[0]) : data[face]['t_top']);
	text_bot = ((text[1]) ? unescape(text[1]) : data[face]['t_bot']);
	renderPicture(res, face, text_top.toUpperCase(), text_bot.toUpperCase());
    } else {
	display404(res, path);
    }
}

function itsPicture(path) {
    return (path.match(/^\/[a-z\%0-9\_\-\!\?\x1C]+\.png$/i));
}

http.createServer(function (req, res) {
    var pathname = escape(req.url);
    if (pathname == '/') { displayIndex(res); }
    else if (pathname == '/stats/') { displayStats(res); }
    else if (itsPicture(pathname)) { displayPicture(res, pathname); }
    else { display404(res, pathname); }
}).listen(process.env.PORT || 3000);