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
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>epiLOL macro generator <span style="font-size:30%;"> by <a href="http://twitter.com/JoshLeaves">JoshLeaves</a></h1>');
    res.write('<hr />');
    res.write('<br />');
    res.write('Url scheme:<br / >');
    res.write('- /{face}.png<br />');
    res.write('- /{face}%1C{text_top}%1C{text_bot}.png<br />');
    res.write('Rappel: ? = %3F<br />');
    res.write('<br />');
    res.write('Url scheme (for promo 2016):<br />');
    res.write('- /kwame.png<br />');
    res.write('- /roxan%1Cfoo%1Cbar.png<br />');
    res.write('- /sadirac%1Ccinq%20ans%20pour%1Cdevenir%20un%20robot%20reconnu.png<br />');
    res.write('- /shawan%1Cmiaou%1Cje%20suis%20un%20chat.png<br />');
    res.write('- /pintade.png<br />');
    res.write('<br />');
    res.write('<p style="font-size: 60%;">Written in node.js. Deal with it.<br />');
    res.write('Node.js > Nginx > Apache > Wordpress > Fred Christian</p>');
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

    img.convert([pic, '-font', './Impact.ttf', '-pointSize', '42', '-fill', 'white', '-stroke', 'black', '-strokewidth', '2',
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
    var face = 'kwame';
    var text_pic, text_top, text_bot;
    var text;

    text = path.substring(1, path.length-4).split(new RegExp('%1C', 'i'));
    if (((text.length == 3) || (text.length == 1)) && (data[text[0]]))
    {
	face = text[0];
	text.shift();
	text_top = ((text[0]) ? unescape(text[0]) : data[face]['t_top']);
	text_bot = ((text[1]) ? unescape(text[1]) : data[face]['t_bot']);
	renderPicture(res, face, text_top.toUpperCase(), text_bot.toUpperCase());
    } else {
	display404(res, path);
    }
}

function itsPicture(path) {
    return (path.match(/^\/[a-z\.\%0-9\,\;\|\>\<\_\-\!\?]+\.png$/i));
}

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == '/') { displayIndex(res); }
    else if (pathname == '/stats/') { displayStats(res); }
    else if (itsPicture(pathname)) { displayPicture(res, pathname); }
    else { display404(res, pathname); }
}).listen(process.env.PORT || 3000);