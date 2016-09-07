liveBoardApp.factory('LiveData', function()
    {

      var DataProvider = function(){
          this.socket = io("https://vps295754.ovh.net",{path: "/sgmeteo/socket.io"});

          var self = this;
          this.processValChangeCallback = function(){};

          this.socket.on('val change', function(msg)
          {
            console.log('Value changed');
            console.log(msg);
            self.processValChangeCallback(msg);
          });
      }

      return DataProvider;

    });