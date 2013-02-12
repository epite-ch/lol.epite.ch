var http = require('http');
var url = require('url');
var querystring = require('querystring');
var img = require('imagemagick')

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
	't_bot': 'APPRECIéE POUR SA CHAIR' },
    'jog' : {
	't_pic': 'jogpirate.jpg',
	't_top': 'Aaaaaaarrrrrr !',
	't_bot': 'T\'ES KLAUS !' },
    'cyril' : {
	't_pic': 'cyrileicher.jpg',
	't_top': 'Avant d\'être directeur',
	't_bot': 'J\'étais Stephan Eicher!'
    }
};

function displayIndex(res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>epiLOL macro generator <span style="font-size:30%;"> by <a href="http://twitter.com/JoshLeaves">JoshLeaves</a></h1>');
    res.write('<hr />');
    res.write('<br />');
    res.write('Url scheme:<br / >');
    res.write('- /{face}.png<br />');
    res.write('- /{face}%1C{text_top}%1C{text_bot}.png<br />');
    res.write('Reminder: ? = %3F<br />');
    res.write('<br />');
    res.write('Url scheme (for promo 2016):<br />');
    res.write('- /kwame.png<br />');
    res.write('- /roxan%1Cfoo%20bar%20%3F%1CCa%20donne%20soif%20dis%20donc%20!.png<br />');
    res.write('- /sadirac%1Ccinq%20ans%20pour%1Cdevenir%20un%20robot%20reconnu.png<br />');
    res.write('- /shawan%1Cmiaou%1Cje%20suis%20un%20chat.png<br />');
    res.write('- /pintade.png<br />');
    res.write('- /jog%1CJ\'ai%20perdu%20mon%20oeil%1CEn%20voyant%20l\'intra%20up%20!.png<br />');
    res.write('- [NEW!] /cyril%1CJ\'aimerais%1CDejeuner en paix%20!.png<br />');
    res.write('<br />');
    res.write('<p style="font-size: 60%;">Written in <a href="http://nodejs.org">node.js</a>. For science! (You monster...)<br />');
    res.write('Node.js > Nginx > Apache > Wordpress > Fred Christian</p>');
    return res.end();
}

function displayStats(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Stats!');
    return res.end();
}

function display404(res, path) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('<h1>404! This shit is hosted on the intranet, bitch!</h1>');
    res.write('<hr />');
    res.write("Seriously dude, I don't have <strong>"+path+"</strong> here.<br />");
    res.write('<br />');
    res.write('Just go back to the <a href="/">index</a>, bro!<br />');
    return res.end();
}

function renderPicture(res, face, top, bot) {
    var pic = data[face]['t_pic'];

    img.convert([pic, '-font', './Impact.ttf', '-pointSize', '42', '-fill', 'white', '-stroke', 'black', '-strokewidth', '2',
		 '-gravity', 'north', '-annotate', '0', top,
		 '-gravity', 'south', '-annotate', '0', bot,
		 'PNG:-'],
		function (err, stdout, stderr) {
		    if (err) {
			res.writeHead(500, {'Content-Type': 'text/html'});
			res.write('<h1>500! It\'s not over 9000 but I failed all the way!</h1><br />');
			res.write('<br />');
			res.write('Best bet is the server failed. Just hit "retry" or w/ever.<br />');
			res.write('<br />');
			res.write('If this happens way too much, just contact me: josh DOT guthrie AT gmail DOT com<br />');
			if (err) console.dir(err);
			return res.end();
		    }
		    res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stdout.length});
		    return res.end(stdout, 'binary');
		});
}

function displayPicture(res, path) {
    var face = 'kwame';
    var text_pic, text_top, text_bot;
    var text;

    text = path.substring(1, path.length-4).replace(new RegExp('%5CN', 'gi'), '\n').split(new RegExp('%1C', 'i'));
    if (((text.length == 3) || (text.length == 1)) && (data[text[0]])) {
	face = text[0];
	text.shift();
	try {
	    text_top = ((text[0]) ? decodeURIComponent(text[0]) : data[face]['t_top']);
	    text_bot = ((text[1]) ? decodeURIComponent(text[1]) : data[face]['t_bot']);
	    return renderPicture(res, face, text_top.toUpperCase(), text_bot.toUpperCase());
	}
	catch (URIError)
	{
	    return display404(res, path)
	}
    }
    return display404(res, path);
}

function itsPicture(path) {
    return (path.match(/^\/[a-z\.\%0-9\,\;\|\>\<\_\-\!\?\[\]\(\)\\\/]+\.png$/i));
}

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == '/') return displayIndex(res);
    if (pathname == '/stats/') return displayStats(res);
    if (itsPicture(pathname)) return displayPicture(res, pathname);
    return display404(res, pathname);
}).listen(process.env.PORT || 3000);