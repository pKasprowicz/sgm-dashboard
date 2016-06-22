var express = require('express');
var mongoose = require('mongoose');
var mongo_express = require('mongo-express/lib/middleware');
//var mongo_express_config = require('./mongo_express_config')

var Device = require('./models/device')



var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))

var mongoDbUrl = 'mongodb://' + process.env.ME_CONFIG_MONGODB_SERVER + ':' + process.env.ME_CONFIG_MONGODB_PORT + '/';

mongoose.connect(mongoDbUrl);

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

//app.use('/mongo', mongo_express(mongo_express_config));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = app.listen(server_port, server_ip_address, function()
{
	console.log("Server started on address ", server_ip_address, " on port ", server_ip_address);
})