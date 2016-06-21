var express = require('express');
var mongoose = require('mongoose');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./mongo_express_config')

var Device = require('./models/device')



var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))

mongoose.connect('mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/');

var renderDashboard = function(req,res)
{
	res.render('dashboard',
	{
		title : "SGM Test App",
		page  : "dashboard"
	});
}

app.get('/', renderDashboard);

app.get('/dashboard', renderDashboard);

app.get('/about', function(req, res)
{
	res.render('about',
	{
		title: "About application",
		page : "about"
	});
})

app.get('/test', function(req, res)
{
	Device.find({}, function(err, devices)
	{
		var ob = [];
		devices.forEach(function(entry)
		{
			ob.push(entry.toObject({getters : false}));
		});
		res.render('test', {devList : ob});
	});

});

app.use('/mongo', mongo_express(mongo_express_config));

var server = app.listen(8080, function()
{
	console.log("Server started!");
})