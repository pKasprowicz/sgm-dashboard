var pm2 = require('pm2');

var processName = 'SGMdashboard';

var options = {
    script : './app.js',
    name : processName,
    execMode : 'fork',
    output : '/var/log/SGMdashboard.log',
    error : '/var/log/SGMdashboard.log',
    logDateFormat : 'YYYY-MM-DD HH:mm Z',
};

var startCallback = function(err, proc)
{
    if(err)
    {
        console.error('Could not start SGMdashboard process');
        console.error(err);
        process.exit(2);
    }

    console.log('SGMdashboard process started successfully');
    process.exit(0);

}

var stopCallback = function(err, proc)
{
    if(err)
    {
        console.error('Could not stop SGMdashboard process');
        console.error(err);
    }

    if (proc != 'undefined')
    {
        console.warn('SGMdashboard not running, attempting to start it');
    }
    else
    {
        process.exit(2);
    }

    console.log('SGMdashboard process stopped successfully');
    console.log('Starting SGMdashboard process..');
    pm2.start(options, startCallback);
}

var connectionCallback = function(err)
{
    if(err)
    {
        console.error(err);
        process.exit(1);
    }


    console.log('Stopping SGMdashboard process..');
    pm2.delete(processName, stopCallback);
}


pm2.connect(connectionCallback);