(function () {
    var strings = require('./strings.js');


    function routeIdx (res) {
        res.writeHead(200, {'Content-Type': 'text/html' });
        return res.end(strings.routeIdx);
    };


    function route404 (res, path) {
        res.writeHead(404, {'Content-Type': 'text/html' });
        return res.end(strings.route404.replace('%path%', path));
    };


    function route500 (res, path) {
        res.writeHead(500, {'Content-Type': 'text/html' });
        return res.end(strings.route500);
    };


    module.exports = {
        routeIdx: routeIdx,
        route404: route404,
        route500: route500
    };

})();
