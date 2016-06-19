var express = require('express');
var fs = require('fs');

var app = express();

app.use('/static', express.static(__dirname));

app.get('/dashboard', function(req, res)
{
	var html = fs.readFileSync('dashboard/dashboard.html','utf8');
	res.send(html);
	//res.send("DUPA");
}
);

var server = app.listen(8081, function()
{
	console.log("Server started!");
})