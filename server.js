var express = require('express');
var fs = require('fs');

var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))

app.get('/dashboard', function(req, res)
{
	res.render('dashboard',
	{
		title : "SGM Test App",
		page  : "dashboard"
	});
});

app.get('/about', function(req, res)
{
	res.render('about',
	{
		title: "About application",
		page : "about"
	});
})

var server = app.listen(process.env.PORT, function()
{
	console.log("Server started!");
})