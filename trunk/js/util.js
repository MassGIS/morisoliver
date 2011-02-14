  /**
   * Decimal to DMS conversion
   */
  convertDMS = function(coordinate, type, spaceOnly) {
    var coords = new Array();

    abscoordinate = Math.abs(coordinate)
    coordinatedegrees = Math.floor(abscoordinate);

    coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.round(coordinateseconds*10000);
    coordinateseconds /= 10000;

    if( coordinatedegrees < 10 )
      coordinatedegrees = "0" + coordinatedegrees;

    if( coordinateminutes < 10 )
      coordinateminutes = "0" + coordinateminutes;

    if( coordinateseconds < 10 )
      coordinateseconds = "0" + coordinateseconds;

    if (spaceOnly) {
      var factor = 1;
      if (coordinate < 0) {
        factor = -1;
      }
      return factor * coordinatedegrees + ' ' + coordinateminutes + ' ' + coordinateseconds + ' ';
    }
    else {
      return coordinatedegrees + '&deg; ' + coordinateminutes + "' " + coordinateseconds + '" ' + this.getHemi(coordinate, type);
    }
  }

  /**
   * Return the hemisphere abbreviation for this coordinate.
   */
  getHemi = function(coordinate, type) {
    var coordinatehemi = "";
    if (type == 'LAT') {
      if (coordinate >= 0) {
        coordinatehemi = "N";
      }
      else {
        coordinatehemi = "S";
      }
    }
    else if (type == 'LON') {
      if (coordinate >= 0) {
        coordinatehemi = "E";
      } else {
        coordinatehemi = "W";
      }
    }

    return coordinatehemi;
  }

  dms2dd = function(dms) {
    var p = dms.split(' ');
    if (p[0] < 0) {
      return -1 * (Math.abs(p[0]) + p[1] / 60 + p[2] / 3600);
    }
    else {
      return p[0] * 1 + p[1] / 60 + p[2] / 3600;
    }
  }

  function safeXML(s) {
    return s.replace(/&/g,'___AMP___').replace(/=/g,'___EQ___').replace(/</g,'___LT___').replace(/>/g,'___GT___').replace(/"/g,'___QUOT___');
  }

var updateScale = function() {
        var scale;
        if(this.geodesic === true) {
            var units = this.map.getUnits();
            if(!units) {
                return;
            }
            var inches = OpenLayers.INCHES_PER_UNIT;
            scale = (this.map.getGeodesicPixelSize().w || 0.000001) *
                    inches["km"] * OpenLayers.DOTS_PER_INCH;
        } else {
            scale = this.map.getScale();
        }

        if (!scale) {
            return;
        }
        this.element.innerHTML = '&nbsp;'+OpenLayers.i18n("scale", {'scaleDenom':addCommas(Math.round(scale))})+'&nbsp;';
};

function addCommas(sValue) {
  sValue = String(sValue);
  var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
  while(sRegExp.test(sValue)) {
    sValue = sValue.replace(sRegExp, '$1,$2');
  }
  return sValue;
}
