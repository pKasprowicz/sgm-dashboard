/*global liveBoardApp*/
/*global fabric*/

liveBoardApp.factory('valueTile', function()
{
    function rgba2hex(r, g, b, a)
    {
      var rHex = parseInt(255 - a * (255 - r), 10);
      var gHex = parseInt(255 - a * (255 - g), 10);
      var bHex = parseInt(255 - a * (255 - b), 10);

      return '#' + ((rHex << 16) + (gHex << 8) + bHex).toString(16);
    }

    var factory = function(id, heading, postfix)
    {
        this.tileWidth = 300;
        this.tileHeight = 300;

        //Construct background

        this.background = new fabric.Rect({
          left: 0,
          top: 0,
          fill: rgba2hex(148, 193, 64, 1),
          width: this.tileWidth,
          height: this.tileHeight,
          selectable : false,
          lockMovementX : true,
          lockMovementY : true,
        });

        //Construct heading

        this.tileHeading = new fabric.Text(heading, {
          top: 55,
          fontFamily: 'Open Sans',
          fontSize : '24',
          fontWeight : 'bold',
          textAlign : 'center',
          fill : rgba2hex(148, 193, 64, 0.4),
          selectable : false,
          lockMovementX : true,
          lockMovementY : true,
        });

        this.tileHeading.setLeft((this.tileWidth - this.tileHeading.width) / 2);

        //Construct value text

        this.valueText = new fabric.Text('', {
          top: 120,
          fontFamily: 'Open Sans',
          fontSize : '75',
          fontWeight : 'bold',
          textAlign : 'center',
          fill : rgba2hex(148, 193, 64, 0.0),
          selectable : false,
          lockMovementX : true,
          lockMovementY : true,
        });
        this.valueText.setLeft((this.tileWidth - this.valueText.width) / 2);

        //Construct unit text

        this.unitText = new fabric.Text(postfix, {
          top: 200,
          fontFamily: 'Open Sans',
          fontSize : '30',
          fontWeight : 'bold',
          textAlign : 'center',
          fill : rgba2hex(148, 193, 64, 0.4),
          selectable : false,
          lockMovementX : true,
          lockMovementY : true,
        });
        this.unitText.setLeft((this.tileWidth - this.unitText.width) / 2);

        //Construct update timestamp text

        this.timestampText = new fabric.Text('Last updated at n/a', {
          top: 270,
          fontFamily: 'Open Sans',
          fontSize : '15',
          textAlign : 'center',
          fill : rgba2hex(50, 47, 32, 0.7),
          selectable : false,
          lockMovementX : true,
          lockMovementY : true,
        });
        this.timestampText.setLeft((this.tileWidth - this.timestampText.width) / 2);

        //Render content

        this.dash = new fabric.Canvas(id);
        this.dash.add(this.background);
        this.dash.add(this.tileHeading);
        this.dash.add(this.valueText);
        this.dash.add(this.unitText);
        this.dash.add(this.timestampText);

        this.update = function(value, timestamp)
        {
            this.valueText.setText(value);
            this.valueText.setLeft((this.tileWidth - this.valueText.width) / 2);

            // if(timestamp != "undefined")
            // {
                this.timestampText.setText('Last updated at ' + timestamp);
                this.timestampText.setLeft((this.tileWidth - this.timestampText.width) / 2);
            // }

            this.dash.renderAll();
        }
    }

    return factory;


})
.directive('ngWeather', function($interval, valueTile){

    return {
        restrict : 'EAC',
        scope : {
        //   id            : '=',
        //   quantity      : '=',
          timestamp     : '@',
          measurement   : '@',
        },
        link : function(scope, element, attrs)
                {
                    var caption = '';
                    var postfix = '';

                    var canvasId = attrs.id + "-tile";

                    var canvasElement = angular.element("<canvas id=\"" + canvasId + "\" width=300px height=300px>DUPA</canvas>");

                    element.append(canvasElement);

                    switch (attrs.quantity)
                    {
                        case 'temp':
                            caption = 'Air\nTemperature';
                            postfix = '\u00B0C';
                            break;

                        case 'press':
                            caption = 'Atmospheric\npressure';
                            postfix = 'hPa';
                            break;

                        case 'humid':
                            caption = 'Air\nHumidity';
                            postfix = '%';
                            break;
                    }

                    var tile = new valueTile(canvasId, caption, postfix);

                    scope.$watch('measurement', function(value){
                        tile.update(value, scope.timestamp);
                    });
                }
    };
});