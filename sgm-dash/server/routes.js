var measurementsDb = require('db-manager');
var restApi = require('./rest-api');

module.exports = function(app)
{

  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')

  var renderDashboard = function(req,res)
  {
      measurementsDb.getRegisteredPublishers(function(err, devices)
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

  app.get("/deviceList", function(req, res)
  {
      measurementsDb.getRegisteredPublishers(function(err, devices)
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

  app.get("/weather", function(req, res)
  {
    restApi.getWeather(function(weatherData)
    {
      var collection = [];
      for (var id in weatherData)
      {
        collection.push(weatherData[id]);
      }
      res.json(collection);
      //res.end(JSON.stringify(weatherData,null,2));
    });
  });

}
