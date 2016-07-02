angular.module('Liveboard',[])
  .service('mqtt', function()
  {
    this.run = function(updateCallback)
    {
      updateCallback(5);  
    }
  })
