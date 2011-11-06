var http = require('http');
var url = require('url');

function displayIndex(res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Node.js > Nginx > Apache > Wordpress > Fred Christian\n');
}

function displayStats(res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Stats!');
}
function display404(res, path) {
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.write('<h1>404! This shit is hosted on the intranet, bitch!</h1>');
  res.write('<hr />');
  res.write("Seriously dude, I don't have <strong>http://epilol.dreamleaves.org"+path+"</strong> here.<br />");
  res.write('<br />');
  res.write('Just go back to the <a href="/">index</a>, bro!<br />');
}

function displayPicture(res, path) {
  var text_face = 'kwame';
  var text_top = '';
  var text_bot = '';
  var text;
  
  text = path.substring(1, path.length-4).split('%1C');
  if ((text.length == 3) || (text.length == 1))
  {
    text_face = text[0];
    text.shift();
  }
  if (text.length == 2)
  {
    text_top = unescape(text[0]);
    text_bot = unescape(text[1]);
  }
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h2>Picture!</h2>');
  res.write('<strong>Face:</strong> '+text_face+'<br />');
  res.write('<strong>TOP:</strong> '+text_top+'<br />');
  res.write('<strong>BOT:</strong> '+text_bot+'<br />');
}

function itsPicture(path) {
  return (path.match(/^\/[a-z\%0-9\_\-\!\?\x1C]+\.png$/i));
}

http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname == '/') { displayIndex(res); }
  else if (pathname == '/stats/') { displayStats(res); }
  else if (itsPicture(pathname)) { displayPicture(res, pathname); }
  else { display404(res, pathname); }
  res.end();
}).listen();