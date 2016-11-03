var mongoose = require('mongoose');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./server/scripts/mongo_express_config')
var Device = require('./server/models/device');
var Measurments = require('./server/models/measurement');

var measurementsDb = require('./server/db_manager.js');

var mongoDbUrl = 'admin:***REMOVED***@ds025603.mlab.com:25603/dashboard';

module.exports = function(app)
{

  app.set('views', __dirname + '/server/views')
  app.set('view engine', 'jade')

  mongoose.connect(mongoDbUrl);

  var renderDashboard = function(req,res)
  {
  	Device.find({}, function(err, devices)
  	{
  		var ob = [];
  		devices.forEach(function(entry)
  		{
  			ob.push(entry.toObject({getters : false}));
  		});
  		res.render('dashboard',
  		{
  			devList : ob,
  			title : "SGM Test App",
  			page  : "dashboard"
  		});
  	});
  };

  app.get('/', renderDashboard);

  app.get('/dashboard', renderDashboard);

  app.get('/about', function(req, res)
  {
  	res.render('about',
  	{
  		title: "About application",
  		page : "about"
  	});
  });

  app.get('/test', function(req, res)
  {
  	Device.find({}, function(err, devices)
  	{
  		var ob = [];
  		devices.forEach(function(entry)
  		{
  			ob.push(entry.toObject({getters : false}));
  		});
  		res.render('test',
      {
        devList : ob,
        page : "test"
      });
  	});

  });

  app.get("/deviceList", function(req, res)
  {
    Device.find({}, function(err, devices)
  	{
  		var ob = [];
  		devices.forEach(function(entry)
  		{
  			ob.push(entry.toObject({getters : false}));
  		});
      res.end(JSON.stringify(ob,null,2));
  	});
  });

  app.get("/history", function(req, res)
    {
      console.log('GET query to historical data');
      measurementsDb.getMeasurementsHistory(function(entries)
      {
        var ob = [];
        entries.forEach(function(entry)
    		{
    			ob.push(entry.toObject({getters : false}));
    		});
        res.end(JSON.stringify(ob,null,2));
      });
    });

  app.post("/history", function(req, res)
    {
      console.log('POST query to historical data');
      measurementsDb.getMeasurementsHistory(function(entries)
      {
        var ob = [];
        entries.forEach(function(entry)
    		{
    			ob.push(entry.toObject({getters : false}));
    		});
        res.end(JSON.stringify(ob,null,2));
      }, req.body);
    });

  app.get("/recent", function(req, res)
    {
      measurementsDb.getRecentMeasurements(function(entries)
      {
        var ob = [];
        entries.forEach(function(entry)
    		{
    			ob.push(entry.toObject({getters : false}));
    		});
        res.end(JSON.stringify(ob,null,2));
      });
    });

  app.use('/mongo', mongo_express(mongo_express_config));
}
