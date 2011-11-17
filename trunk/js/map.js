
if (typeof MorisOliverApp == 'undefined') {
  MorisOliverApp = {};
}

if (typeof MorisOliverApp.thGridPanel == 'undefined') {
  MorisOliverApp.thGridPanel = Ext.grid.GridPanel;
}

if (typeof MorisOliverApp.thGridView == 'undefined') {
  MorisOliverApp.thGridView = Ext.grid.GridView;
}

var loadedWms = {};
var maxAllowedFeatures = 25000;
var map;
var lyrBase          = [];
var mouseControl;
var scaleRatioControl;
var scaleLineControl;
var allLyr           = [];
var wmsStyl          = [];
var lyr2wms          = [];
var lyr2proj         = {};
var lyr2type         = {};
var wms2ico          = [];
var activeLyr        = {};
var lyrMetadata      = [];
var olMapPanel;
var olLayerTree;
var olLayerPanel;
var olActiveLayers;
var mapPanel;
var loadingPanel;
var lyrSearchCombo;
var lyrStoreSearchWizard;
var lyrCount         = 0;
var tstLyrCount      = 0;
var xmlDoc           = null;
var xmlFmt           = new OpenLayers.Format.XML();
var qryBounds;
var featureBbox;
var featureBboxSelect;
var featureBboxStore;
var featureBboxGridPanel;
var measureType = 'length';
var defaultCenter,defaultZoom;
var loadError = [];
var lyrGeoLocate = new OpenLayers.Layer.Vector('geoLoacate',{styleMap :  new OpenLayers.StyleMap({
  'default' : new OpenLayers.Style({
     fillColor     : "#996600"
    ,fillOpacity   : 0.1
    ,strokeColor   : "#0000ff"
    ,strokeWidth   : 1
    ,strokeOpacity : 0.5
    ,graphicZIndex : 100
    ,externalGraphic : 'img/balloon_blue.png'
    ,graphicWidth    : 32
    ,graphicHeight   : 32
    ,graphicOpacity  : 1
  })})
});
var geoLocateLonLat,geoLocateBnds;
var exportBbox = {
   minX  : 0
  ,minY  : 0
  ,maxX  : 0
  ,maxY  : 0
  ,verts : [] // these will always be in 26986
  ,units : defaultCoordUnit == 'm' ? 'EPSG:26986' : defaultCoordUnit == 'dd' ? 'EPSG:4326' : defaultCoordUnit == 'dms' ? 'EPSG:4326dms' : ''
};

Date.patterns = {
    SortableDateTime: "Y-m-d\\TH:i:s.ms"
};

var availableColors = {
   'FFFFFF' : 'White'
  ,'D7C29E' : 'Tan'
  ,'686868' : 'Grey'
  ,'FFBEBE' : 'Pink'
  ,'FF0000' : 'Red'
  ,'FFD37F' : 'Orange'
  ,'FFFF00' : 'Yellow'
  ,'55FF00' : 'Green'
  ,'00C5FF' : 'Blue'
  ,'005CE6' : 'Dark_Blue'
  ,'C500FF' : 'Purple'
};

OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
OpenLayers.Util.onImageLoadError = function() {
  var p = OpenLayers.Util.getParameters(this.src);
  olActiveLayers.getRootNode().cascade(function(n) {
    if (n.attributes.layer && n.attributes.layer.name == p['FOO']) {
      var wms = lyr2wms[p['FOO']];
      var cn = n.getUI().getIconEl().className.split(' ');
      var a = [];
      for (var i = 0; i < cn.length; i++) {
        if (cn[i].indexOf('type' + wms2ico[wms]) < 0) {
          a.push(cn[i]);
        }
      }
      a.push('type' + wms2ico[wms] + 'Red');
      n.getUI().getIconEl().className = a.join(' ');
      n.getUI().getIconEl().qtip = 'There was an error drawing this layer.';
      if (document.getElementById(n.attributes.layer.name + '.loading')) {
        document.getElementById(n.attributes.layer.name + '.loading').src = 'img/blank.png';
      }
    }
  });
  loadError[p['FOO']] = 1;
}

OpenLayers.Util.onImageLoad = function() {
  // we may need to clear out errors for layers who have magically come back to life
  var p = OpenLayers.Util.getParameters(this.src);
  if (olActiveLayers) {
    olActiveLayers.getRootNode().cascade(function(n) {
      if (n.attributes.layer && n.attributes.layer.name == p['FOO']) {
        var wms = lyr2wms[p['FOO']];
        var cn = n.getUI().getIconEl().className.split(' ');
        var a = [];
        var keepQtip = n.getUI().getIconEl().className.indexOf('type' + wms2ico[wms] + 'Gray') >= 0;
        for (var i = 0; i < cn.length; i++) {
          if (cn[i] !== 'type' + wms2ico[wms] + 'Red' || (map.getProjection().toLowerCase() != String(lyr2proj[p['FOO']]).toLowerCase()) && String(lyr2proj[p['FOO']]) != 'undefined') {
            a.push(cn[i]); 
          }
        }
        if (a.join(' ').indexOf('type' + wms2ico[wms]) < 0) {
          a.push('type' + wms2ico[wms]);
        }
        n.getUI().getIconEl().className = a.join(' ');
        if (!keepQtip) {
          n.getUI().getIconEl().qtip = undefined;
        }
      }
    });
    loadError[p['FOO']] = 0;
  }

  // original OL
  if (!this.viewRequestID ||
    (this.map && this.viewRequestID == this.map.viewRequestID)) {
    this.style.display = "";
  }
  OpenLayers.Element.removeClass(this, "olImageLoadError");
}

// test to see if any startup params were passed
var p = OpenLayers.Util.getParameters();
for (i in p) {
  if (i == 'lyrs') {
    defaultLyrs = [];
    var lyrs = String(p[i]).split('|');
    for (var j = 0; j < lyrs.length; j++) {
      var s = lyrs[j].split('~');
      defaultLyrs.push({wms : s[1],title : s[0],styles : s[2]});
    }
  }
  else if (i == 'bbox') {
    defaultBbox = String(p[i]).split(',');
  }
  else if (i == 'coordUnit') {
    defaultCoordUnit = p[i];
  }
  else if (i == 'measureUnit') {
    defaultMeasureUnit = p[i];
  }
  else if (i == 'base') {
    defaultBase = p[i];
  }
  else if (i == 'center') {
    defaultCenter = String(p[i]).split(',');
  }
  else if (i == 'zoom') {
    defaultZoom = p[i];
  }
}

// make sure we have a base
var okBase = /^(custom|googleSatellite|googleTerrain|googleRoadmap|googleHybrid|openStreetMap|bingRoads|bingAerial|bingHybrid)$/;
if (!okBase.test(defaultBase)) {
  defaultBase = 'custom';
}

// and a coord unit
var okUnit = /^(dms|dd|m)$/;
if (!okUnit.test(defaultCoordUnit)) {
  defaultCoordUnit = 'm';
}
var currentCoordUnit = defaultCoordUnit;

// and a measure unit
var okUnit = /^(m|mi|nm|yd|ft)$/;
if (!okUnit.test(defaultMeasureUnit)) {
  defaultMeasureUnit = 'm';
}

var qryLyrStore = new Ext.data.ArrayStore({
  fields : [
     {name : 'ico'  }
    ,{name : 'title'}
    ,{name : 'wfs'  }
    ,{name : 'busy' }
  ]
});

var qryWin = new Ext.Window({
   height      : 550
  ,width       : 475
  ,closeAction : 'hide'
  ,resizable   : false
  ,title       : 'Query results'
  ,bodyStyle   : 'background:white;padding:6px'
  ,constrainHeader : true
  ,items       : [
    {
       xtype : 'fieldset'
      ,title : 'At a glance'
      ,items : [
        {
           border : false
          ,html   : 'Select a row to highlight corresponding geometries on the map as well as to view detailed record information. Viewing up to 100 features allowed. To use your selected area of interest to launch the data export wizard, click <a href="javascript:launchExportWizard({typ : \'poly\'})">here</a> <a href="javascript:launchExportWizard({typ : \'poly\'})"><img style=\'margin-top:-10px;margin-bottom:-3px\' src=\'img/export.png\'></a>.<br>&nbsp;'
        }
        ,new MorisOliverApp.thGridPanel({
           height           : 150
          ,width            : 425
          ,store            : qryLyrStore
          ,id               : 'qryFeatureDetails'
          ,columns          : [
             {id : 'ico'  ,header : ''                              ,width : 25,renderer : ico2img                 }
            ,{id : 'title',header : 'Layer name'                                                                   }
            ,{id : 'wfs'  ,header : 'Feature(s) found?'                                                            }
            ,{id : 'busy' ,header : ''                              ,width : 30,renderer : busyIco                 }
          ]
          ,autoExpandColumn : 'title'
          ,loadMask         : true
          ,listeners        : {
            rowclick : function(grid,rowIndex,e) {
              if (qryLyrStore.getAt(rowIndex).get('wfs') == '0 feature(s)') {
                Ext.Msg.alert('Query details','This row has no features. No details will be fetched.');
                return;
              }
              else if (qryLyrStore.getAt(rowIndex).get('wfs') == 'not visible at scale') {
                Ext.Msg.alert('Query details','This datalayer is not visible at this scale.');
                return;
              }
              else if (qryLyrStore.getAt(rowIndex).get('wfs') == 'n/a') {
                featureBbox.unselectAll();
                title = qryLyrStore.getAt(rowIndex).get('title');
                var centerPx = map.getPixelFromLonLat(qryBounds.getBounds().getCenterLonLat());
                var gfiUrl = activeLyr[title].getFullRequestString({BBOX : map.getExtent().toBBOX(),X : centerPx.x,Y : centerPx.y,REQUEST : 'GetFeatureInfo',QUERY_LAYERS : lyr2wms[title],WIDTH : map.div.style.width.replace('px',''),HEIGHT : map.div.style.height.replace('px',''),FOO : ''}).replace('&FOO=','');
                var MIF = new Ext.ux.ManagedIFramePanel({
                   defaultSrc  : gfiUrl
                  ,bodyBorder  : false
                  ,bodyStyle   : 'background:white'
                  ,listeners   : {domready : function(frame){
                    var fbody = frame.getBody();
                    var w = Ext.getCmp('myFrameWin');
                    if (w && fbody){
                      // calc current offsets for Window body border and padding
                      var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
                      var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
                      // Window is rendered (has size) but invisible
                      w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
                      Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
                      // then show it sized to frame document
                      w.show();
                    }
                  }}
                });
                new Ext.Window({
                   title           : title
                  ,width           : mapPanel.getWidth() * 0.65
                  ,height          : mapPanel.getHeight() * 0.65
                  ,hideMode        : 'visibility'
                  ,hidden          : true   //wait till you know the size
                  ,plain           : true
                  ,constrainHeader : true
                  ,minimizable     : false
                  ,ddScroll        : false
                  ,border          : false
                  ,bodyBorder      : false
                  ,layout          : 'fit'
                  ,plain           : true
                  ,maximizable     : true
                  ,buttonAlign     : 'center'
                  ,items           : MIF
                }).show();
                return;
              }
              var p = qryLyrStore.getAt(rowIndex).get('wfs').split(' feature(s)');
              if (p.length == 2 && p[0] > 100) {
                Ext.Msg.alert('Query details','This row has over 100 features. No details will be fetched.');
                return;
              }
              grid.disable();
              featureBbox.unselectAll();
              title = qryLyrStore.getAt(rowIndex).get('title');
              loadLayerDescribeFeatureType(lyr2wms[title]);
              featureBbox.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(
                 activeLyr[title]
                ,{
                  // geometryName  : 'line_geom'
                   geometryName  : 'SHAPE'
                  ,featurePrefix : featurePrefix
                  ,version       : '1.1.0'
                  ,srs           : map.getProjection()
                }
              );
              featureBbox.setModifiers();
              map.addControl(featureBbox);
              featureBbox.activate();
              featureBbox.request(qryBounds);
              featureBbox.deactivate();
            }
          }
        })
      ]
    }
  ]
  ,listeners   : {
    hide : function() {
      featureBbox.unselectAll();
      if (Ext.getCmp('queryBox').pressed) {
        featureBoxControl.polygon.clear();
      }
      else if (Ext.getCmp('queryPoly').pressed) {
        featurePolyControl.polygon.layer.removeFeatures(featurePolyControl.polygon.layer.features);
      }
    }
    ,show : function() {
      Ext.getCmp('qryFeatureDetails').enable();
    }
  }
});

var messageContextMenuFeatureCtrlBbox;
var messageContextMenuActiveLyr;
var messageContextMenuAvailableLyr;
var messageContextMenuFolder;

var featureBoxControl = new OpenLayers.Control();
OpenLayers.Util.extend(featureBoxControl,{
  draw : function() {
    this.polygon = new OpenLayers.Handler.RegularPolygon(featureBoxControl,
      {'done' : function(g) {
        if (featureBboxGridPanel) {
          featureBboxGridPanel.getStore().removeAll();
        }
        var bounds = g.getBounds().clone();
        var boundsArr = bounds.toArray();
        var ll = new OpenLayers.LonLat(boundsArr[0],boundsArr[1]);
        var ur = new OpenLayers.LonLat(boundsArr[2],boundsArr[3]);
        var dx = Math.abs(map.getPixelFromLonLat(ur).x - map.getPixelFromLonLat(ll).x);
        var dy = Math.abs(map.getPixelFromLonLat(ur).y - map.getPixelFromLonLat(ll).y);
        // A 'point' query will have area of 4.  So grow it by 1 px on each side.
        if (dx * dy <= 4) {
          var ctr = map.getPixelFromLonLat(bounds.getCenterLonLat());
          bounds = new OpenLayers.Bounds();
          bounds.extend(map.getLonLatFromPixel(ctr));
          // increase the size of the query box
          bounds.extend(map.getLonLatFromPixel(new OpenLayers.Pixel(ctr.x + 4,ctr.y + 4)));
          bounds.extend(map.getLonLatFromPixel(new OpenLayers.Pixel(ctr.x - 4,ctr.y - 4)));
        }
        runQueryStats(bounds.toGeometry());
      }}
      ,{
         persist      : true
        ,irregular    : true
        ,layerOptions : {styleMap : new OpenLayers.StyleMap({
          'default' : new OpenLayers.Style(OpenLayers.Util.applyDefaults({
             'strokeWidth'  : 2
            ,'strokeColor'  : '#ff0000'
            ,'strokeOpacity': 0.5
            ,'fillColor'    : '#ff0000'
            ,'fillOpacity'  : 0.05
          }))
        })}
      }
    );
  }
});
var featurePolyControl = new OpenLayers.Control();
OpenLayers.Util.extend(featurePolyControl,{
  draw : function() {
    this.polygon = new OpenLayers.Handler.Polygon(featurePolyControl,
      {'done' : function(g) {
        if (featureBboxGridPanel) {
          featureBboxGridPanel.getStore().removeAll();
        }
        var bounds = g.getBounds().clone();
        var boundsArr = bounds.toArray();
        var ll = new OpenLayers.LonLat(boundsArr[0],boundsArr[1]);
        var ur = new OpenLayers.LonLat(boundsArr[2],boundsArr[3]);
        var dx = Math.abs(map.getPixelFromLonLat(ur).x - map.getPixelFromLonLat(ll).x);
        var dy = Math.abs(map.getPixelFromLonLat(ur).y - map.getPixelFromLonLat(ll).y);
        // A 'point' query will have area of <=  4.  So grow it by 1 px on each side.
        if (dx * dy <= 4) {
          var ctr = map.getPixelFromLonLat(bounds.getCenterLonLat());
          bounds = new OpenLayers.Bounds();
          bounds.extend(map.getLonLatFromPixel(ctr));
          // increase the size of the query box
          bounds.extend(map.getLonLatFromPixel(new OpenLayers.Pixel(ctr.x + 4,ctr.y + 4)));
          bounds.extend(map.getLonLatFromPixel(new OpenLayers.Pixel(ctr.x - 4,ctr.y - 4)));
          runQueryStats(bounds.toGeometry());
        }
        else {
          runQueryStats(g);
        }
      }}
      ,{
         persist      : true
        ,irregular    : true
        ,layerOptions : {styleMap : new OpenLayers.StyleMap({
          'default' : new OpenLayers.Style(OpenLayers.Util.applyDefaults({
             'strokeWidth'  : 2
            ,'strokeColor'  : '#ff0000'
            ,'strokeOpacity': 0.5
            ,'fillColor'    : '#ff0000'
            ,'fillOpacity'  : 0.05
          }))
        })}
      }
    );
  }
});

var measureUnits = defaultMeasureUnit;
var layerRuler   = new OpenLayers.Layer.Vector({});

var imgSpinner = new Image();
imgSpinner.src = 'img/spinner.gif';
var imgBg      = new Image();
imgBg.src      = 'img/bg16x16.png';

Proj4js.defs["EPSG:26986"] = "+title=Massachusetts Mainland NAD83 +proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";

var maxExtent900913 = new OpenLayers.Bounds(maxBbox[0],maxBbox[1],maxBbox[2],maxBbox[3]).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
var maxExtent26986  = new OpenLayers.Bounds(maxBbox[0],maxBbox[1],maxBbox[2],maxBbox[3]).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:26986"));

OpenLayers.ProxyHost = proxyLoc;

// I should be able to do this via a uiProviders w/i the olActiveLayers'
// LayerLoader, but I can't get that to work.  So override it here.
Ext.override(GeoExt.tree.LayerNodeUI,{
  render : function(bulkRender) {
    var a = this.node.attributes;
    if (a.checked === undefined) {
      a.checked = this.node.layer.getVisibility();
    }
    GeoExt.tree.LayerNodeUI.superclass.render.apply(this, arguments);
    var cb = this.checkbox;
    if(a.checkedGroup) {
      // replace the checkbox with a radio button
      var radio = Ext.DomHelper.insertAfter(cb,
        ['<input type="radio" name="', a.checkedGroup,
        '_checkbox" class="', cb.className,
        cb.checked ? '" checked="checked"' : '',
        '"></input>'].join(""));
      radio.defaultChecked = cb.defaultChecked;
      Ext.get(cb).remove();
      this.checkbox = radio;
    }
    var imgSrc = !a.layer.visibility || loadedWms[a.layer.name] || (String(lyr2proj[a.layer.name]).toLowerCase() != 'undefined' && map.getProjection().toLowerCase() != String(lyr2proj[a.layer.name]).toLowerCase()) ? 'img/blank.png' : 'img/loading.gif';
    Ext.DomHelper.insertBefore(cb,'<img id="' + a.layer.name + '.loading" height=12 width=12 style="margin-left:2px;margin-right:2px" src="' + imgSrc + '">');
    this.enforceOneVisible();
    // New icon part!
    wms = lyr2wms[a.layer.name];
    var scaleInfo = scaleOK(a.layer.name);
    var grayIcon  = '';
    var qtip      = undefined;
    if (map.getProjection().toLowerCase() != String(lyr2proj[a.layer.name]).toLowerCase() && String(lyr2proj[a.layer.name]) != 'undefined') {
      grayIcon = 'Red';
      qtip     = 'This layer cannot be drawn with this basemap.';
    }
    else if (loadError[a.layer.name] == 1) {
      grayIcon = 'Red';
      qtip     = 'There was an error drawing this layer.';
    }
    else if (!scaleInfo.isOK) {
      grayIcon = 'Gray';
      qtip     = 'Layer not visible at this scale. Available range is ' + scaleInfo.range.join(' and ') + '.';
    } 
    if (String('polyptlinerastergridlayergroup').indexOf(wms2ico[wms]) >= 0) {
      this.iconNode.className += ' type' + wms2ico[wms] + grayIcon;
    }
    else {
      this.iconNode.className += ' typedefault' + grayIcon;
    }
    this.iconNode.qtip = qtip;
  }
});

// stoping a cascade doesn't work out of the box
Ext.override(Ext.tree.TreeNode,{
  cascade : function(fn, scope, args){
    if(fn.call(scope || this, args || this) !== false){
      var cs = this.childNodes;
      for(var i = 0, len = cs.length; i < len; i++) {
        if (cs[i].cascade(fn, scope, args)==false) return false;
      }
    }
    else return false
  }
});

var triggerButton = function (toolbar, type, itemId) {
// use in keyMap, as triggerButton.createDelegate(....)
  var component = toolbar.getComponent(itemId);
  switch (type) {
    case 'menu':
      component.showMenu();
      break;
    case 'toggle':
      component.toggle(true);
      break;
    case 'basic':
      component.handler();
      break;
    default:
  }
  component.focus();
};

Ext.onReady(function() {
  Ext.QuickTips.init();
  lyrBase['bingRoads'] = new OpenLayers.Layer.Bing({
     key  : bingKey
    ,type : 'Road'
    ,name : 'bingRoads'
  });
  lyrBase['bingAerial'] = new OpenLayers.Layer.Bing({
     key  : bingKey
    ,type : 'Aerial'
    ,name : 'bingAerial'
  });
  lyrBase['bingHybrid'] = new OpenLayers.Layer.Bing({
     key  : bingKey
    ,type : 'AerialWithLabels'
    ,name : 'bingHybrid'
  });
  lyrBase['googleSatellite'] = new OpenLayers.Layer.Google(
     'googleSatellite'
    ,{
       'sphericalMercator' : true
      ,type                : google.maps.MapTypeId.SATELLITE
      ,minZoomLevel        : 7
      ,maxZoomLevel        : 20
    }
  );
  lyrBase['googleTerrain'] = new OpenLayers.Layer.Google(
     'googleTerrain'
    ,{
       'sphericalMercator' : true
      ,type                : google.maps.MapTypeId.TERRAIN
      ,minZoomLevel        : 7
      ,maxZoomLevel        : 15
    }
  );
  lyrBase['googleRoadmap'] = new OpenLayers.Layer.Google(
     'googleRoadmap'
    ,{
       'sphericalMercator' : true
      ,type                : google.maps.MapTypeId.ROADMAP
      ,minZoomLevel        : 7
      ,maxZoomLevel        : 21
    }
  );
  lyrBase['googleHybrid'] = new OpenLayers.Layer.Google(
     'googleHybrid'
    ,{
       'sphericalMercator' : true
      ,type                : google.maps.MapTypeId.HYBRID
      ,minZoomLevel        : 7
      ,maxZoomLevel        : 20
    }
  );
  lyrBase['openStreetMap'] = new OpenLayers.Layer.OSM(
     'openStreetMap'
    ,'http://tile.openstreetmap.org/${z}/${x}/${y}.png'
  );
  lyrBase['custom'] = new OpenLayers.Layer.WMS.Untiled(
     'custom'
    ,'img/bg.png'
    ,{}
    ,{
       isBaseLayer : true
      ,maxScale    : 100
      ,minScale    : 5000000
      ,projection  : new OpenLayers.Projection("EPSG:26986")
      ,displayProjection : new OpenLayers.Projection("EPSG:4326")
      ,units             : 'm'
      ,maxExtent         : maxExtent26986
    }
  );

  scaleRatioControl = new OpenLayers.Control.Scale();
  scaleLineControl  = new OpenLayers.Control.ScaleLine({geodesic : true});

  mouseControl = new OpenLayers.Control.MousePosition();
  setMapCoord(defaultCoordUnit);

  // snazzy line measure controls
  
  var resetMeasureTally = function () {
  // reseting measureTally is done in numerous places, even when measure not being used.
  // check if measure used, if so, reset.
  if (!toolSettings || !toolSettings.measureTool || toolSettings.measureTool.status == 'show')  {
    Ext.getCmp('measureTally').reset();
  }
  
  };
  
  var mouseMovements = 0;
  OpenLayers.Control.Measure.prototype.EVENT_TYPES = ['measure','measurepartial','measuredynamic'];
  lengthControl = new OpenLayers.Control.Measure(
     OpenLayers.Handler.Path
    ,{
       textNodes     : null
      ,persist       : true
      ,geodesic      : true
      ,callbacks     : {
        create : function() {
          this.textNodes = [];
          layerRuler.removeFeatures(layerRuler.features);
          mouseMovements = 0;
        }
        ,modify : function(point,line) {
          if (mouseMovements++ < 5) {
            return;
          }
          var len  = line.geometry.components.length;
          var from = line.geometry.components[len - 2];
          var to   = line.geometry.components[len - 1];
          var ls   = new OpenLayers.Geometry.LineString([from,to]);
          var dist = this.getBestLength(ls);
          if (!dist[0]) {
            return;
          }
          var total = this.getBestLength(line.geometry);
          var label = niceMeasurementText(dist[0],dist[1]);
          var textNode = this.textNodes[len-2] || null;
          if (textNode && !textNode.layer) {
            this.textNodes.pop();
            textNode = null;
          }
          if (!textNode) {
            var c    = ls.getCentroid();
            textNode = new OpenLayers.Feature.Vector(
               new OpenLayers.Geometry.Point(c.x,c.y)
              ,{}
              ,{
                 label      : ''
                ,fontColor  : "#00F"
                ,fontSize   : "14px"
                ,fontFamily : "Arial"
                ,fontWeight : "bold"
                ,labelAlign : "cm"
              }
            );
            this.textNodes.push(textNode);
            layerRuler.addFeatures([textNode]);
          }
          textNode.geometry.x  = (from.x+to.x)/2;
          textNode.geometry.y  = (from.y+to.y)/2;
          textNode.style.label = label;
          textNode.layer.drawFeature(textNode);
          this.events.triggerEvent('measuredynamic',{
             measure  : dist[0]
            ,total    : total[0]
            ,units    : dist[1]
            ,order    : 1
            ,geometry : ls
          });
        }
      }
      ,handlerOptions : {
        layerOptions : {
          styleMap : new OpenLayers.StyleMap({'default' : {
             strokeColor   : "#00F"
            ,strokeOpacity : 0.3
            ,strokeWidth   : 5
            ,strokeLinecap : 'square'
            ,fillColor     : "#FFF"
            ,fillOpacity   : 0
            ,pointRadius   : 0
            ,pointerEvents : "visiblePainted"
            ,label         : ""
          }})
        }
      }
    }
  );
  var hasMeasure = false;
  lengthControl.events.on({
    measurepartial : function(evt) {
      if (hasMeasure) {
        resetMeasureTally();
        hasMeasure = false;
      }
    }
    ,measuredynamic : function(evt) {
      if (hasMeasure) {
        resetMeasureTally();
        hasMeasure = false;
      }
      var measure = evt.total;
      var units   = evt.units;
      var label   = niceMeasurementText(measure,units);
      Ext.getCmp('measureTally').setValue(label);
    }
    ,measure : function(evt) {
      var measure = evt.measure;
      var units   = evt.units;
      var label   = niceMeasurementText(measure,units);
      Ext.getCmp('measureTally').setValue(label);
    }
  });

  var areaControl = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon,{
     persist        : true
    ,geodesic       : true
    ,eventListeners : {
      measure : function(evt) {
        Ext.getCmp('measureTally').setValue(niceMeasurementText(evt.measure,evt.units));
      }
    }
    ,handlerOptions : {
      layerOptions : {
        styleMap : new OpenLayers.StyleMap({'default' : {
           strokeColor   : "#00F"
          ,strokeOpacity : 0.3
          ,strokeWidth   : 5
          ,strokeLinecap : 'square'
          ,fillColor     : "#00F"
          ,fillOpacity   : 0.1
          ,pointRadius   : 0
          ,pointerEvents : "visiblePainted"
          ,label         : ""
        }})
      }
    }
  });
  
  // end measure controls

  // no temporary style at all
  featureBboxSelect  = new OpenLayers.Layer.Vector('',{styleMap : new OpenLayers.StyleMap({'temporary' : new OpenLayers.Style({cursor : 'pointer',strokeColor : '#ff0000',strokeWidth : 2})})});
  featureBboxSelectHover = new OpenLayers.Control.SelectFeature(featureBboxSelect,{
     hover          : true
    ,highlightOnly  : true
    ,renderIntent   : "temporary"
  });

  map = new OpenLayers.Map('',{
    controls : [
       new OpenLayers.Control.Navigation()
      ,new OpenLayers.Control.PanZoomBar()
      ,featureBboxSelectHover
      ,mouseControl
      ,lengthControl
      ,areaControl
      ,featureBoxControl
      ,featurePolyControl
    ],projection:"EPSG:26986"
  });
  featureBboxSelectHover.activate();

  var ctrl = new OpenLayers.Control.NavigationHistory({autoActivate : false});
  map.addControl(ctrl);

  map.addControl(scaleRatioControl);
  map.addControl(scaleLineControl);

  featureBbox = new OpenLayers.Control.GetFeature({
     multiple   : true
    ,filterType : OpenLayers.Filter.Spatial.INTERSECTS
  });
  featureBbox.events.register('featureselected',this,function(e) {
    featureBboxSelect.addFeatures([e.feature]);
  });
  featureBbox.events.register('featureunselected',this,function(e) {
    featureBboxSelect.removeFeatures([e.feature]);
  });
  featureBboxSelect.events.register('featureadded',this,function(e) {
    if (!qryWin.findById('featureBboxGridPanel')) {
      qryWin.add({
         xtype : 'fieldset'
        ,title : 'Feature details'
        ,items : [featureBboxGridPanel]
      });
    }
    Ext.getCmp('qryFeatureDetails').enable();
    qryWin.doLayout();
  });

  map.events.register('preaddlayer',this,function(e) {
    if (!e.layer.isBaseLayer && !(e.layer instanceof OpenLayers.Layer.Vector) && (String(lyr2wms[e.layer.name]).indexOf(featurePrefix + ':') == 0 || lyr2type[e.layer.name] == 'layergroup')) {
      e.layer.events.register('loadstart',this,function(e) {
        if (document.getElementById(e.object.name + '.loading')) {
          document.getElementById(e.object.name + '.loading').src = 'img/loading.gif';
        }
        loadedWms[e.object.name] = false;
      });

      e.layer.events.register('loadend',this,function(e) {
        if (document.getElementById(e.object.name + '.loading')) {
          document.getElementById(e.object.name + '.loading').src = 'img/blank.png';
        }
        loadedWms[e.object.name] = true;
      });
    }
  });

  map.events.register('addlayer',this,function(e) {
    if (!e.layer.isBaseLayer && !(e.layer instanceof OpenLayers.Layer.Vector) && (String(lyr2wms[e.layer.name]).indexOf(featurePrefix + ':') == 0 || lyr2type[e.layer.name] == 'layergroup')) {
      // clear featureSelects on top
      if (featureBoxControl.polygon.layer) {
        map.setLayerIndex(featureBoxControl.polygon.layer,map.getNumLayers());
      }
      if (featurePolyControl.polygon.layer) {
        map.setLayerIndex(featurePolyControl.polygon.layer,map.getNumLayers());
      }
      map.setLayerIndex(layerRuler,map.getNumLayers());
      map.setLayerIndex(lyrGeoLocate,map.getNumLayers());
      layerRuler.removeFeatures(layerRuler.features);
    }
  });

  if (defaultBase == 'custom') {
    map.setOptions({maxExtent : maxExtent26986, fractionalZoom : true, projection:"EPSG:26986"});
  }
  else {
    map.setOptions({maxExtent : maxExtent900913, projection:"EPSG:900913"});
  }

  Ext.app.LayerLoader = Ext.extend(Ext.ux.tree.XmlTreeLoader, {
    processAttributes : function(attr) {
      attr.text = attr.title;
      if(attr.tagName == 'Folder') {
        attr.loaded = true;
        attr.expanded = false;
      }
      else {
        attr.iconCls = 'typedefault';
        if (String('polyptlinerastergridlayergroup').indexOf(attr.type) >= 0) {
          attr.iconCls = 'type' + attr.type;
        }

        wms2ico[attr.name] = '';
        if (attr.type !== undefined) {
          wms2ico[attr.name] = attr.type;
        }

        attr.leaf           = true;
        attr.wmsName        = attr.name;
        allLyr.push(attr.title);
        lyr2wms[attr.title]  = attr.name;
        lyr2proj[attr.title] = attr.only_project;
        lyr2type[attr.title] = attr.type;
        wmsStyl[attr.title]  = attr.style;
      }
    }
  });

  olLayerTree = new Ext.tree.TreePanel({
     split       : true
  ,tabIndex : -1
    ,height      : 200
    ,region      : 'north'
    ,autoScroll  : true
    ,rootVisible : false
    ,root        : new Ext.tree.AsyncTreeNode()
    ,loader      : new Ext.app.LayerLoader({
       dataUrl       : foldersetLoc
      ,requestMethod : 'GET'
    })
    ,listeners   : {
      load  : function() {
        var lyrStore = new Ext.data.ArrayStore({
           autoDestroy : true
          ,storeId     : 'lyrStore'
          ,idIndex     : 0
          ,fields      : [
             'id'
            ,{name : 'title',type : 'string'}
          ]
          ,filter : function(property,value) {
            if (value == '') {
              return true;
            }
            this.filterBy(function(record,id){
              return record.get('title').toLowerCase().indexOf(value.toLowerCase()) >= 0 }
            );
          }
        });
        // create the store for the wizard layer of interest search
        lyrStoreSearchWizard = new Ext.data.ArrayStore({
           storeId     : 'lyrStore'
          ,idIndex     : 0
          ,fields      : [
             'id'
            ,{name : 'title',type : 'string'}
          ]
          ,filter : function(property,value) {
            if (value == '') {
              return true;
            }
            this.filterBy(function(record,id){
              return record.get('title').toLowerCase().indexOf(value.toLowerCase()) >= 0 }
            );
          }
        });
        uniqAllLyr = allLyr.unique().sort();
        recUniqAllLyr = [];
        for (var i = 0; i < uniqAllLyr.length; i++) {
          recUniqAllLyr.push([i,uniqAllLyr[i]]);
        }
        lyrStore.loadData(recUniqAllLyr);
        lyrStoreSearchWizard.loadData(recUniqAllLyr);
        lyrSearchCombo = new Ext.form.ComboBox({
           store          : lyrStore
      ,itemId         : "layerSearch"
          ,forceSelection : true
          ,triggerAction  : 'all'
          ,emptyText      : 'Select / search data layers'
          ,selectOnFocus  : true
          ,mode           : 'local'
          ,valueField     : 'id'
          ,displayField   : 'title'
          ,listeners      : {
            select : function(comboBox,rec,i) {
              addLayer(lyr2wms[rec.get('title')],lyr2proj[rec.get('title')],rec.get('title'),true,1);
              olLayerTree.getRootNode().cascade(function(n) {
                if (n.attributes.text == rec.get('title')) {
                  olLayerTree.selectPath(n.getPath());
                  n.fireEvent('click',n);
                  n.ui.focus();
                  return false;
                }
              });
            }
          }
        });
        olLayerPanel.getTopToolbar().add(lyrSearchCombo);
    
    if (additionalSettings && additionalSettings.layerList && additionalSettings.layerList.searchBox  && additionalSettings.layerList.searchBox.keyMap) {
      var layerSearchKeyMap = {};
      Ext.apply(layerSearchKeyMap, additionalSettings.layerList.searchBox.keyMap, {fn:function () {olLayerPanel.getTopToolbar().getComponent("layerSearch").focus();} });
      new Ext.KeyMap(document, layerSearchKeyMap);
    } 
    
        olLayerPanel.addListener({
          resize : function() {
            lyrSearchCombo.setWidth(olLayerPanel.getWidth() - 5);
          }
        });
        olLayerPanel.doLayout();
        lyrSearchCombo.setWidth(olLayerPanel.getWidth() - 5);

        // set the default layers
        for (var i = 0; i < defaultLyrs.length; i++) {
          addLayer(defaultLyrs[i].wms,defaultLyrs[i].only_project,defaultLyrs[i].title,true,1,defaultLyrs[i].styles);
        } 
    
    // bad hack to fix tab Index issues.
    window.setTimeout(function () {
        olLayerTree.getRootNode().eachChild(  function (nd) {
        nd.getUI().anchor.tabIndex=-1;
        });  
      },2000);    
      },
      click : function(node,e){
        if (!node.isLeaf()) {
          return;
        }
        addLayer(node.attributes.wmsName,node.attributes.only_project,node.attributes.text,true,1);
      }
      ,contextmenu : function(n,e) {
        if (n.isLeaf()) {
          messageContextMenuAvailableLyr.findById('viewMetadataUrl').setHandler(function() {
            if (!lyrMetadata[n.attributes.text]) {
              loadLayerMetadata(n.attributes.wmsName,n.attributes.text,n.attributes.style,true,false);
            }
            else {
              if (Ext.getCmp('myFrameWin')) {
                Ext.getCmp('myFrameWin').close();
              }
              var MIF = new Ext.ux.ManagedIFramePanel({
                 defaultSrc  : lyrMetadata[n.attributes.text].metadataUrl
                ,bodyBorder  : false
                ,bodyStyle   : 'background:white'
                ,listeners   : {domready : function(frame){
                  var fbody = frame.getBody();
                  var w = Ext.getCmp('myFrameWin');
                  if (w && fbody){
                    // calc current offsets for Window body border and padding
                    var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
                    var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
                    // Window is rendered (has size) but invisible
                    w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
                    Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
                    // then show it sized to frame document
                    w.show();
                  }
                }}
              });
              new Ext.Window({
                 title           : n.attributes.text
                ,width           : mapPanel.getWidth() * 0.65
                ,height          : mapPanel.getHeight() * 0.65
                ,hideMode        : 'visibility'
                ,id              : 'myFrameWin'
                ,hidden          : true   //wait till you know the size
                ,plain           : true
                ,constrainHeader : true
                ,minimizable     : false
                ,ddScroll        : false
                ,border          : false
                ,bodyBorder      : false
                ,layout          : 'fit'
                ,plain           : true
                ,maximizable     : true
                ,buttonAlign     : 'center'
                ,items           : MIF
              }).show();
            }
          });
          messageContextMenuAvailableLyr.findById('addLayer').setHandler(function() {
            addLayer(n.attributes.wmsName,n.attributes.only_project,n.attributes.text,true,1);
          });
          messageContextMenuAvailableLyr.showAt(e.getXY());
        }
        else {
          var isGrandparent = false;
          for (var i = 0; i < n.childNodes.length; i++) {
            isGrandparent = isGrandparent || n.childNodes[i].hasChildNodes();
          }
          if (!isGrandparent) {
            messageContextMenuFolder.findById('addFolder').setHandler(function() {
              var a = [];
              n.eachChild(function(child) {
                a.push([child.attributes.wmsName,child.attributes.only_project,child.attributes.text,true,1]);
              });
              for (var i = a.length - 1; i >= 0; i--) {
                addLayer(a[i][0],a[i][1],a[i][2],a[i][3],a[i][4]);
              }
            });
            messageContextMenuFolder.showAt(e.getXY());
          }
        }
      }
    }
  });
  
  var olLegendPanel = new GeoExt.LegendPanel({
     title       : 'Active data legends'
  ,tabIndex : -1   
    ,region      : 'south'
    ,height      : 150
    ,split       : true
    ,autoScroll  : true
    ,filter      : function(record) {
      return !record.get('layer').isBaseLayer && !(record.get('layer') instanceof OpenLayers.Layer.Vector);
    }
    ,labelCls    : 'legendText'
  });

  var keyMaps = [];
  var topToolBar_items = [];
  var topToolBar_keyMaps = [], bottomToolBar_keyMaps = [];
  
  // navigation functionality.  (zoom in, out, pan, max extent, active extent, forward, backwards, zoom to scale)
  topToolBar_items.push(
      new GeoExt.Action({
         control      : new OpenLayers.Control.ZoomBox()
        ,map          : map
        ,toggleGroup  : 'navigation'
    ,enableToggle : true
        ,allowDepress : false
        ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Zoom in'
        ,icon         : 'img/zoom_in.png'
    ,itemId     : 'zoomIn'
        ,toggleHandler      : function() {
          if (navigator.appName == "Microsoft Internet Explorer") {
            Ext.getCmp('mappanel').body.applyStyles('cursor:url("img/zoom_in.cur")');
          }
          else {
            Ext.getCmp('mappanel').body.applyStyles('cursor:crosshair');
          }
        }
      })
      ,new GeoExt.Action({
         control      : new OpenLayers.Control.ZoomBox(Ext.apply({out: true}))
        ,map          : map
        ,toggleGroup  : 'navigation'
    ,enableToggle : true    
        ,allowDepress : false
        ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Zoom out'
        ,icon         : 'img/zoom_out.png'
    ,itemId     : 'zoomOut'   
        ,toggleHandler      : function() {
          if (navigator.appName == "Microsoft Internet Explorer") {
            Ext.getCmp('mappanel').body.applyStyles('cursor:url("img/zoom_out.cur")');
          }
          else {
            Ext.getCmp('mappanel').body.applyStyles('cursor:crosshair');
          }
        }
      })
      ,new GeoExt.Action({
         control      : new OpenLayers.Control.DragPan()
        ,map          : map
        ,id           : 'dragPanButton'
        ,toggleGroup  : 'navigation'
    ,enableToggle : true    
        ,allowDepress : false
        ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Pan'
        ,icon         : 'img/drag.gif'
        ,pressed      : true
    ,itemId     : 'pan'   
        ,toggleHandler: function() {
          Ext.getCmp('mappanel').body.setStyle('cursor','move');
        }
      })
      ,{
         iconCls     : 'buttonIcon'
        ,tooltip     : 'Zoom to initial extent'
        ,icon        : 'img/globe.png'
    ,itemId     : 'initExtent'    
        ,handler     : function() {
          map.zoomToExtent(new OpenLayers.Bounds(defaultBbox[0],defaultBbox[1],defaultBbox[2],defaultBbox[3]).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()));
        }
      }
      ,new Ext.Action({
         iconCls     : 'buttonIcon'
        ,tooltip     : 'Zoom to full extent of active data'
        ,icon        : 'img/zoom_extents.png'
    ,itemId     : 'maxExtent'   
        ,handler     : function() {
          var targetBounds = new OpenLayers.Bounds();
          for (var i in activeLyr) {
            if (String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0) {
              if (activeLyr[i].visibility) {
                var bnds = new OpenLayers.Bounds(lyrMetadata[i].maxExtent.left,lyrMetadata[i].maxExtent.bottom,lyrMetadata[i].maxExtent.right,lyrMetadata[i].maxExtent.top);
                targetBounds.extend(bnds.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()));
              }
            }
          }
          if (targetBounds.left && targetBounds.bottom && targetBounds.right && targetBounds.top) {
            map.zoomToExtent(targetBounds);
          }
        }
      })
      ,'-'
      ,new GeoExt.Action({
         control  : ctrl.previous
        ,disabled : true
        ,iconCls  : 'buttonIcon'
        ,tooltip  : 'Go back to previous extent'
        ,icon     : 'img/undo.png'
    ,itemId     : 'prevExtent'    
      })
      ,new GeoExt.Action({
         control  : ctrl.next
        ,disabled : true
        ,iconCls  : 'buttonIcon'
        ,tooltip  : 'Go to next extent'
        ,icon     : 'img/redo.png'
    ,itemId   : 'nextExtent'        
      })
      ,'-'
      ,{
     enableToggle: true
        ,text     : 'Zoom to a scale'
        ,id       : 'zoomToAScale'
        ,iconCls  : 'buttonIcon'
        ,icon     : 'img/Search-icon.png'
        ,disabled : defaultBase !== 'custom'
    ,itemId     : 'zoomScale'   
        ,menu     : [
          {
             text    : '1:1,000'
            ,handler : function () {
              map.zoomToScale(1000);
            }
          }
          ,{
             text    : '1:5,000'
            ,handler : function () {
              map.zoomToScale(5000);
            }
          }
          ,{
             text    : '1:10,000'
            ,handler : function () {
              map.zoomToScale(10000);
            }
          }
          ,{
             text    : '1:15,000'
            ,handler : function () {
              map.zoomToScale(15000);
            }
          }
          ,{
             text    : '1:24,000'
            ,handler : function () {
              map.zoomToScale(24000);
            }
          }
          ,{
             text    : '1:100,000'
            ,handler : function () {
              map.zoomToScale(100000);
            }
          }
          ,{
             text    : '1:250,000'
            ,handler : function () {
              map.zoomToScale(250000);
            }
          }
          ,'-'
          ,{
             text        : defaultBase == 'custom' ? 'Type a custom scale below and press enter.  A leading "1:" is optional.' : 'Custom scale disabled for current map projection.'
            ,id          : 'customScaleHeader'
            ,canActivate : false
            ,hideOnClick : false
            ,style       : {
               marginTop  : '-5px'
              ,fontSize   : '9px'
            }
          }
          ,{
             xtype     : 'textfield'
            ,emptyText : 'Custom scale'
            ,id        : 'customScale'
            ,cls       : 'x-menu-list-item'
            ,iconCls   : 'buttonIcon'
            ,disabled  : defaultBase !== 'custom'
            ,width     : 200
            ,listeners : {
              specialkey : function(f,e) {
                if (e.getKey() == e.ENTER) {
                  var v = f.getValue().replace('1:','').replace(/,/g,'');
                  if (!(100 <= v && v <= 5000000)) {
                    Ext.Msg.alert('Invalid custom scale','Acceptable scale values are between 100 and 5,000,000.');
                  }
                  else {
                    map.zoomToScale(v);
                  }
                }
              }
            }
          }
        ]
      }
   );

  if (toolSettings.navigationTools) {
    if (toolSettings.navigationTools.zoomIn && toolSettings.navigationTools.zoomIn.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.zoomIn.keyMap,
        itemId :'zoomIn' ,
        type   : 'toggle'
      });
    }
    if (toolSettings.navigationTools.zoomOut && toolSettings.navigationTools.zoomOut.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.zoomOut.keyMap,
        itemId :'zoomOut' ,
        type   : 'toggle'
      });
    }
    if (toolSettings.navigationTools.pan && toolSettings.navigationTools.pan.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.pan.keyMap,
        itemId :'pan' ,
        type   : 'toggle'
      });
    }
    if (toolSettings.navigationTools.nextExtent && toolSettings.navigationTools.nextExtent.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.nextExtent.keyMap,
        itemId :'nextExtent' ,
        type   : 'basic'
      });
    }
    if (toolSettings.navigationTools.initExtent && toolSettings.navigationTools.initExtent.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.initExtent.keyMap,
        itemId :'initExtent' ,
        type   : 'basic'
      });
    }
    if (toolSettings.navigationTools.prevExtent && toolSettings.navigationTools.prevExtent.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.prevExtent.keyMap,
        itemId :'prevExtent' ,
        type   : 'basic'
      });
    }
    if (toolSettings.navigationTools.maxExtent && toolSettings.navigationTools.maxExtent.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.maxExtent.keyMap,
        itemId :'maxExtent' ,
        type   : 'basic'
      });
    }   
    if (toolSettings.navigationTools.zoomScale && toolSettings.navigationTools.zoomScale.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.navigationTools.zoomScale.keyMap,
        itemId :'zoomScale' ,
        type   : 'menu'
      });
    }     
    



  }
        if (!toolSettings || !toolSettings.identify || toolSettings.identify.status == 'show') {
          // identify tool functionality
          identify = new GeoExt.Action({
             itemId       : "identify"
            ,tooltip      : 'Identify features by drawing a box'
            ,text         : 'Identify'
            ,iconCls      : 'buttonIcon'
            ,icon         : 'img/query-region.png'
            ,toggleGroup  : 'navigation'
            ,id           : 'queryBox'
            ,allowDepress : false
            ,control      : featureBoxControl
            ,enableToggle : true
            ,toggleHandler: function() {
              Ext.getCmp('mappanel').body.setStyle('cursor','help');
              featureBoxControl.polygon.activate();
              featurePolyControl.polygon.deactivate();
              // nuke any measurements
              lengthControl.deactivate();
              areaControl.deactivate();
              resetMeasureTally();
              layerRuler.removeFeatures(layerRuler.features);
            }
          });
          // identifyPoly tool functionality
          identifyPoly = new GeoExt.Action({
             itemId       : "identifyPoly"
            ,tooltip      : 'Identify features by drawing a polygon'
            ,text         : 'IdentifyPoly'
            ,iconCls      : 'buttonIcon'
            ,icon         : 'img/draw_polygon.png'
            ,toggleGroup  : 'navigation'
            ,id           : 'queryPoly'
            ,allowDepress : false
            ,control      : featurePolyControl
            ,enableToggle : true
            ,toggleHandler: function() {
              Ext.getCmp('mappanel').body.setStyle('cursor','help');
              featureBoxControl.polygon.deactivate();
              featurePolyControl.polygon.activate();
              // nuke any measurements
              lengthControl.deactivate();
              areaControl.deactivate();
              resetMeasureTally();
              layerRuler.removeFeatures(layerRuler.features);
            }
          });

          clearIdentify = new GeoExt.Action({
             itemId      : 'identifyClear'
            ,tooltip     : 'Clear identified features'
            ,iconCls     : 'buttonIcon'
            ,icon        : 'img/query-clear.png'
            ,handler     : function() {
              featureBbox.unselectAll();
              featureBoxControl.polygon.deactivate();
              if (Ext.getCmp('queryBox').pressed) {
                featureBoxControl.polygon.activate();
              }
              featurePolyControl.polygon.deactivate();
              if (Ext.getCmp('queryPoly').pressed) {
                featurePolyControl.polygon.activate();
              }
            }
          });

          if ( toolSettings.identify.identify_keymap) {
            topToolBar_keyMaps.push({
              keyMap:  toolSettings.identify.identify_keymap,
              itemId : "identify",
              type  : toggle
            });
          }

// don't know what I need to do here for Poly and topToolBar

          if ( toolSettings.identify.clearIdentify_keymap) {
            topToolBar_keyMaps.push({
               keyMap:  toolSettings.identify.clearIdentify_keymap,
               itemId : "identifyClear",
               type  : basic
            });
          }

          topToolBar_items.push(
             '-'
            ,identify
            ,identifyPoly
//            ,clearIdentify
          );
        }
	
	if (!toolSettings || !toolSettings.commentTool || toolSettings.commentTool.status == 'show') {
		commentSaveStrategy = new OpenLayers.Strategy.Save();	
		 
		commentSaveStrategy.events.register('success', null, function () {
			commentWFSLayer.destroyFeatures();
			commentWindow.hide();
		});
		commentSaveStrategy.events.register('fail', null, function () {
			alert('save failed');
		});
		
		var commentWFSLayer = new OpenLayers.Layer.Vector("Comments", {
			strategies: [commentSaveStrategy], 
			projection: new OpenLayers.Projection(toolSettings.commentTool.layer.srs),
			protocol: new OpenLayers.Protocol.WFS({
				version: "1.0.0",
				srsName: toolSettings.commentTool.layer.srs,
				url: wfsUrl,
				featureNS : namespaceUrl,
				featureType:  toolSettings.commentTool.layer.layerName,
				geometryName:  toolSettings.commentTool.layer.geometryName,
				featurePrefix: 'massgis',
				schema: wfsUrl + "DescribeFeatureType?version=1.1.0&typename=" + toolSettings.commentTool.layer.layerName
			})
		});
		if (toolSettings.commentTool.layer['submitUrl']) {
			commentWFSLayer.protocol.origCommit = commentWFSLayer.protocol.commit;
			commentWFSLayer.protocol.commit = function(features, options) {
				options.url = toolSettings.commentTool.layer.submitUrl;
				return commentWFSLayer.protocol.origCommit(features, options);
			};
			commentSaveStrategy.events.register("success",this,function() {
				var ls = map.layers;
				for (var i = 0; i < ls.length; i++) {
					if (ls[i].CLASS_NAME == 'OpenLayers.Layer.WMS') {
						if (ls[i].params.LAYERS.indexOf(toolSettings.commentTool.layer.layerName) !== -1) {
							// refresh this layer
							ls[i].redraw(true);
						}
					}
				}
			});
		}

		Ext.QuickTips.init(); 
		map.addLayer(commentWFSLayer);
		var commentWindow,commentForm,commentFeature;
		var drawComment = new OpenLayers.Control.DrawFeature(
			commentWFSLayer,
			OpenLayers.Handler.Point
			,{
				title: "Add comment",
				displayClass: "olControlDrawFeaturePoint",
				multi: true,
				featureAdded: function (feat) {
					commentFeature = feat;
					if (!commentForm) {
						var commentFields = [];
					
						commentForm = new Ext.form.FormPanel ({
							baseCls: 'x-plain',
							labelWidth:75,
							frame:true,
							monitorValid:true,
							buttonAlign: 'right',
							bodyStyle:'padding:10px 10px 0',
							layout: {
										type: 'vbox'
										,align: 'stretch'  // Child items are stretched to full width
									},
									defaults: {
										//msgTarget: 'side',
										//anchor: '95%',
										xtype: 'textfield',
										selectOnFocus: true,
										plugins: [ Ext.ux.FieldLabeler ]												
									},
							
									items: toolSettings.commentTool.fields
							
						});
					}
					if (!commentWindow) {
						commentWindow = new Ext.Window({
							title: "Enter comment",
							collapsible: false,
							maximizeable: false,
							width: 400,
							height: 500,
							minHeight: 300,
							minWidth: 200,
							layout: "fit",
							plain: true,
							items: commentForm,
							closeAction: 'hide',
							closable: false,
							modal:true,
							buttons: [{
								text: "Save",
								formBind: true,
								handler : function (d,e) {
									// need to check validation (length)
									if (commentForm.getForm().isValid()) {
										var dt = new Date();
										commentFeature.attributes = commentForm.getForm().getFieldValues();
										//commentFeature.attributes.OBJECTID = -1;
										commentFeature.attributes.DATENTERED = dt.format(Date.patterns.SortableDateTime);
										commentSaveStrategy.save();
									}
									
								}
							},{
								text: "Cancel",
								handler : function (d,e) {
									commentWFSLayer.destroyFeatures();
									commentWindow.hide();
								}										
							}]									
						
						});
						
						
					}
					
					
					commentWindow.show();
					// this triggers opening our panel, stores the feature, and which in turn allows us to saveStrategy.save
				}
			} 
		);
				
		
		topToolBar_items.push('-',
			new GeoExt.Action ({
			text: toolSettings.commentTool.layer.commentLabel,
			itemId : 'commentTool',
			map: map,
			control: drawComment
			,iconCls      : 'buttonIcon'
			,icon         : 'img/query-region.png'
			,toggleGroup  : 'navigation'	
			,enableToggle : true			
			,toolTip : toolSettings.commentTool.layer.commentDesc
			})
		);
	}

  if (!toolSettings || !toolSettings.editTool || toolSettings.editTool.status == 'show') {
    var editWindow = new Ext.Window({
      resizable: true,
      modal: false,
      closable: false,
      closeAction: 'hide',
      width: 550,
      height: 450,
      title: "WFSTFeatureEditing",
      layout: 'fit',
      items: []
    });

    var editManager = new GeoExt.ux.WFSTFeatureEditingManager({
      "layerConfigs" : toolSettings.editTool.layers,
      "map": map,
      "toolbarItems" : topToolBar_items,
      "url": wfsUrl,
      "actionGroup": "navigation",
      "mainPanelContainer": editWindow
    });
  }
  
  if (!toolSettings || !toolSettings.bingAddressSearch || toolSettings.bingAddressSearch.status == 'show') {
    // bing search functionality
    
    if (toolSettings.bingAddressSearch.keyMap) {
    topToolBar_keyMaps.push({
      keyMap: toolSettings.bingAddressSearch.keyMap,
      itemId :'bingSearch' ,
      type   : 'text'
    });
    }
    
      topToolBar_items.push( '-'
      ,{
         xtype     : 'textfield'
    ,itemId    : 'bingSearch'
        ,emptyText : 'Search for a location'
        ,disabled  : bingDisabled
        ,id        : 'searchLocation'
        ,width     : 150
        ,listeners : {
          specialkey : function(f,e) {
            if (e.getKey() == e.ENTER) {
              this.disable();
              YUI().use("io","json-parse",function(Y) {
                var handleSuccess = function(ioId,o,args) {
                  if (o.responseText == '') {
                    Ext.getCmp('searchLocation').enable();
                    return;
                  }
                  var loc = Y.JSON.parse(o.responseText);
                  if (loc.resourceSets[0].estimatedTotal == 0) {
                    Ext.Msg.alert('Location search results','The Bing service could not find any matching results.');
                    Ext.getCmp('searchLocation').enable();
                    return;
                  }
                  var bnds = new OpenLayers.Bounds(loc.resourceSets[0].resources[0].bbox[1],loc.resourceSets[0].resources[0].bbox[0],loc.resourceSets[0].resources[0].bbox[3],loc.resourceSets[0].resources[0].bbox[2]).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
                  var ctr = new OpenLayers.LonLat(loc.resourceSets[0].resources[0].point.coordinates[1],loc.resourceSets[0].resources[0].point.coordinates[0]).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
                  geoLocateLonLat = undefined;
                  geoLocateBnds = undefined;
                  var msg = [];
                  for (var i in loc.resourceSets[0].resources[0].address) {
                    if (loc.resourceSets[0].resources[0].address[i] !== '') {
                      msg.push(loc.resourceSets[0].resources[0].address[i]);
                    }
                  }
                  var locationWin = new Ext.Window({
                     title       : 'Location search results'
                    ,width       : 325
                    ,height      : 200
                    ,plain       : true
                    ,modal       : true
                    ,layout      : 'fit'
                    ,items       : [new Ext.FormPanel({
                       bodyStyle:'padding:5px 5px 0'
                      ,border : false
                      ,items     : [{
                         html : '<b>The Bing service found the following location with ' + loc.resourceSets[0].resources[0].confidence + ' confidence:</b><br>' + msg.join('<br>')
                        ,border : false
                      }]
                      ,buttons : [
                        {
                           text : 'Zoom to center point'
                          ,handler : function() {
                            map.setCenter(ctr);
                            map.zoomToScale(1000);
                            var f = lyrGeoLocate.features;
                            for (var i = 0; i < f.length; i++) {
                              lyrGeoLocate.removeFeatures(f[i]);
                            }
                            lyrGeoLocate.addFeatures(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(ctr.lon,ctr.lat)));
                            geoLocateLonLat = new OpenLayers.LonLat(loc.resourceSets[0].resources[0].point.coordinates[1],loc.resourceSets[0].resources[0].point.coordinates[0]);
                            locationWin.close();
                          }
                        }
                        ,{
                           text : 'Zoom to region'
                          ,handler : function() {
                            map.zoomToExtent(bnds);
                            var f = lyrGeoLocate.features;
                            for (var i = 0; i < f.length; i++) {
                              lyrGeoLocate.removeFeatures(f[i]);
                            }
                            lyrGeoLocate.addFeatures(new OpenLayers.Feature.Vector(bnds.toGeometry()));
                            geoLocateBnds =  new OpenLayers.Bounds(loc.resourceSets[0].resources[0].bbox[1],loc.resourceSets[0].resources[0].bbox[0],loc.resourceSets[0].resources[0].bbox[3],loc.resourceSets[0].resources[0].bbox[2]);
                            locationWin.close();
                          }
                        }
                        ,{
                           text : 'Cancel'
                          ,handler : function() {
                            locationWin.close();
                          }
                        }
                      ]
                    })]
                  });
                  locationWin.show();
                  Ext.getCmp('searchLocation').enable();
                }
                Y.on('io:success',handleSuccess,this,[]);
                if (Ext.getCmp('searchLocation').getValue() !== '') {
                  var request = Y.io(proxyLocBing + escape('http://dev.virtualearth.net/REST/v1/Locations?q=' + escape(Ext.getCmp('searchLocation').getValue()) + '&key=' + bingKey));
                }
              });
            }
          }
        }
      }
      ,{
         text    : 'Clear location'
    ,itemId  : 'bingSearchClear'
        ,tooltip : 'Clear location search results from map'
        ,iconCls : 'buttonIcon'
        ,icon    : 'img/clear_eraser.gif'
        ,handler : function() {
          Ext.getCmp('searchLocation').reset();
          var f = lyrGeoLocate.features;
          for (var i = 0; i < f.length; i++) {
            lyrGeoLocate.removeFeatures(f[i]);
    }
          geoLocateLonLat = undefined;
          geoLocateBnds = undefined;
        }
      });
  }
  
  if (!toolSettings || !toolSettings.quickZoomTools || toolSettings.quickZoomTools.status == 'show') {
    topToolBar_items.push('-');
    
    var quickZoomDefn = {},thisStore,thisComboBox,thisTool;
    quickZoomDefn.stores = {};
    quickZoomDefn.storeHandlers = {};
    quickZoomDefn.comboBoxes = {};
    
    var storeListener_beforeLoad;
    for (var i = 0; i < toolSettings.quickZoomTools.tools.length; i++) {
      thisTool = toolSettings.quickZoomTools.tools[i];
      
      if (thisTool.keyMap) {
        topToolBar_keyMaps.push({
        keyMap: thisTool.keyMap,
        itemId :'quickZoom'+thisTool.id ,
        type   : 'combo'
        });
        }     
        
      if (thisTool.restrict) {
        quickZoomDefn.storeHandlers[thisTool.id] = function (d) {
          var valueField = this.valueField;
          var thisTool = quickZoomDefn.comboBoxes[this.id];
          var restrictTool = quickZoomDefn.comboBoxes[this.restrict.restrictToolId];
          var restrictValue = (restrictTool.getValue() != '' && restrictTool.__selectedRecord ? restrictTool.__selectedRecord.json.properties[this.restrict.restrictedSourceField] : "");
          if (restrictValue == "") {
            if (this.restrict.required) {
              thisTool.store.removeAll();
              thisTool.lastQuery = null
              return false;
            } else {
              thisTool.lastQuery = null
              d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%'";
              return true;            
            }
          }
          thisTool.lastQuery = null
          var localRestrictField = this.restrict.restrictedValueField;
          d.baseParams.CQL_FILTER = valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%' AND "+localRestrictField +" = '"+restrictValue+"'";
          return true;
        }.createDelegate(thisTool);
      } else {
        quickZoomDefn.storeHandlers[thisTool.id] =  function (d)  {
          d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%'";
          return true;
        }.createDelegate(thisTool);
      }
      
      var fieldList = [];
      
      fieldList.push(thisTool.valueField);
      
      if (thisTool.additionalFields  && thisTool.additionalFields.length > 0) {
        fieldList = fieldList.concat(thisTool.additionalFields.split(','));
      }
      
      var sort = "";
      if (thisTool.sortBy) {
         sort = thisTool.sortBy;
        if (thisTool.sortOrder ) {
          sort += ' '+thisTool.sortOrder ;
        }
      }     
      thisStore = new Ext.data.Store ({
      // what about beforeLoad
        listeners: {
          beforeload : quickZoomDefn.storeHandlers[thisTool.id]
        },
        baseParams: {
          "request" : "getfeature",
          "version" : "1.0.0",
          "service" : "wfs",
          "propertyname" : fieldList.join(',') ,  
          "typename" : thisTool.layer,
          "outputformat" : "json",
          "sortBy" : sort
        },
        proxy : new Ext.data.Geoserver_ScriptTagProxy ({
          url: 'http://giswebservices.massgis.state.ma.us/geoserver/wfs',
          "method":"GET"  
        }),
        reader : new Ext.data.JsonReader ({
          root: "features",
          fields: [{name: 'properties', mapping: 'properties'}],
          idProperty: 'post_id'
          }
        ) 
      });   
    

    quickZoomDefn.stores[thisTool.id] = thisStore ;
      
      thisComboBox =  new Ext.form.ComboBox({
        itemId : 'quickZoom'+thisTool.id,
        id : 'quickZoom'+thisTool.id,
        emptyText: thisTool.label,
        fieldLabel: thisTool.label,
        triggerAction:'all',
        store : thisStore,
        displayField:'values.properties.'+thisTool.valueField,  // values. is wrong, and breaks typeahead, as below
        queryParam: 'CQL_FILTER',
        typeAhead: true,
        loadingText: 'Searching...',
        width: 200,
        autoSelect: false,
        forceSelection:true,
        minChars:0,
        mode:'remote',
        selectOnFocus:true,
        shadow: 'drop',
        //pageSize:10,
        hideTrigger:false,
        listeners : {
          select: function (that,record,idx) {
            this.__selectedRecord = record;
            this.setValue(record.json.properties[this.displayField.replace('values.properties.','')]); // this shouldn't be necessary
            var bbox = record.json.properties.bbox;
            var ll = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(bbox[0],bbox[1]), new OpenLayers.Projection("EPSG:26986"), map.getProjectionObject());
            var ur = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(bbox[2],bbox[3]), new OpenLayers.Projection("EPSG:26986"), map.getProjectionObject());
            var zoomTarget = new OpenLayers.Bounds();
            zoomTarget.extend(ll);
            zoomTarget.extend(ur);
            map.zoomToExtent(zoomTarget);
          },
          specialKey : function (field,e) {
            if (e.getKey() == e.ENTER ) {
              var record = this.store.getAt(0);
              if (!!record) {
                var recVal = record.json.properties[this.displayField.replace('values.properties.','')];
                if (recVal == this.getValue()) {
                  this.__selectedRecord = record;
                  // this code is modified from the select listener.  It'd be better to trigger the select event.
                  this.setValue(recVal); // this shouldn't be necessary
                  var bbox = record.json.properties.bbox;
                  var ll = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(bbox[0],bbox[1]), new OpenLayers.Projection("EPSG:26986"), map.getProjectionObject());
                  var ur = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(bbox[2],bbox[3]), new OpenLayers.Projection("EPSG:26986"), map.getProjectionObject());
                  var zoomTarget = new OpenLayers.Bounds();
                  zoomTarget.extend(ll);
                  zoomTarget.extend(ur);
                  map.zoomToExtent(zoomTarget);
                }
              } 
            }
          }
        },
        onTypeAhead : function(){
          if(this.store.getCount() > 0){
            var r = this.store.getAt(0);
            var newValue = r.data.properties[this.displayField.replace('values.properties.','')];
            var len = newValue.length;
            var selStart = this.getRawValue().length;
            if(selStart != len){
              this.setRawValue(newValue);
              this.selectText(selStart, newValue.length);
            }
          }
        }
      });
      
      quickZoomDefn.comboBoxes[thisTool.id] = thisComboBox ;
      topToolBar_items.push(thisComboBox);
    } 
  }
  
      topToolBar_items.push('->');

  if (!toolSettings || !toolSettings.exportData || toolSettings.exportData.status == 'show') {
  
    if (toolSettings.exportData.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.exportData.keyMap,
        itemId : "exportData",
        type   : "basic"
      });
    }

  // export data functionality
    topToolBar_items.push({
         text        : 'Export data'
  ,itemId      : "exportData"
        ,tooltip     : 'Launch the data export wizard'
        ,iconCls     : 'buttonIcon'
        ,icon        : 'img/export.png'
        ,handler     : function() {
          launchExportWizard({typ : 'bbox'});
        }
      });
  }

    topToolBar_items.push({
       text     : 'Print / Save'
      ,itemId   : 'printSave'
      ,iconCls  : 'buttonIcon'
      ,icon     : 'img/print.png'
      ,tooltip  : 'Print or save your map and layers'
      ,handler  : function() {printSave()}
   });

      if (toolSettings.help &&  toolSettings.help.keyMap) {
      topToolBar_keyMaps.push({
        keyMap: toolSettings.help.keyMap,
        itemId :'help' ,
        type   : 'menu'
      });
      
    }
      topToolBar_items.push({
         text : 'Help'
    ,itemId : 'help'
        ,iconCls      : 'buttonIcon'
        ,icon         : 'img/help.png'
        ,menu : new Ext.menu.Menu({
          items : [
            new GeoExt.Action({
               text     : 'Help HTML'
              ,iconCls  : 'buttonIcon'
              ,tooltip  : siteTitle + ' help'
              ,icon     : 'img/help.png'
              ,handler  : function () {
                if (Ext.getCmp('myFrameWin')) {
                  Ext.getCmp('myFrameWin').close();
                }
                var MIF = new Ext.ux.ManagedIFramePanel({
                   defaultSrc  : helpUrl1
                  ,bodyBorder  : false
                  ,bodyStyle   : 'background:white'
                  ,listeners   : {domready : function(frame){
                    var fbody = frame.getBody();
                    var w = Ext.getCmp('myFrameWin');
                    if (w && fbody){
                      // calc current offsets for Window body border and padding
                      var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
                      var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
                      // Window is rendered (has size) but invisible
                      w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
                      Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
                      // then show it sized to frame document
                      w.show();
                    }
                  }}
                });
                new Ext.Window({
                   title           : siteTitle + ' help'
                  ,width           : mapPanel.getWidth() * 0.65
                  ,height          : mapPanel.getHeight() * 0.65
                  ,hideMode        : 'visibility'
                  ,id              : 'myFrameWin'
                  ,hidden          : true   //wait till you know the size
                  ,plain           : true
                  ,constrainHeader : true
                  ,minimizable     : false
                  ,ddScroll        : false
                  ,border          : false
                  ,bodyBorder      : false
                  ,layout          : 'fit'
                  ,plain           : true
                  ,maximizable     : true
                  ,buttonAlign     : 'center'
                  ,items           : MIF
                }).show();
              }
            })
            ,new GeoExt.Action({
               text     : 'Help PDF'
              ,iconCls  : 'buttonIcon'
              ,tooltip  : siteTitle + ' help'
              ,icon     : 'img/help.png'
              ,handler  : function () {
                if (Ext.getCmp('myFrameWin')) {
                  Ext.getCmp('myFrameWin').close();
                }
                var MIF = new Ext.ux.ManagedIFramePanel({
                   defaultSrc  : helpUrl2
                  ,bodyBorder  : false
                  ,bodyStyle   : 'background:white'
                  ,listeners   : {domready : function(frame){
                    var fbody = frame.getBody();
                    var w = Ext.getCmp('myFrameWin');
                    if (w && fbody){
                      // calc current offsets for Window body border and padding
                      var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
                      var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
                      // Window is rendered (has size) but invisible
                      w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
                      Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
                      // then show it sized to frame document
                      w.show();
                    }
                  }}
                });
                new Ext.Window({
                   title           : siteTitle + ' help'
                  ,width           : mapPanel.getWidth() * 0.65
                  ,height          : mapPanel.getHeight() * 0.65
                  ,hideMode        : 'visibility'
                  ,id              : 'myFrameWin'
                  ,hidden          : true   //wait till you know the size
                  ,plain           : true
                  ,constrainHeader : true
                  ,minimizable     : false
                  ,ddScroll        : false
                  ,border          : false
                  ,bodyBorder      : false
                  ,layout          : 'fit'
                  ,plain           : true
                  ,maximizable     : true
                  ,buttonAlign     : 'center'
                  ,items           : MIF
                }).show();
              }
            })
            ,new Ext.Action({
               text     : 'About ' + siteTitle + ' (v. 0.77)'  // version
              ,tooltip  : 'About ' + siteTitle + ' (v. 0.77)'  // version
              ,handler  : function() {
                var winAbout = new Ext.Window({
                   id          : 'extAbout'
                  ,title       : 'About ' + siteTitle
                  ,width       : moreInfoWidth
                  ,plain       : true
                  ,modal       : true
                  ,html        : moreInfoHTML
                });
                winAbout.show();
              }
            })
          ]
        })
      }
     );
  
   olMapPanel_topToolBar = new Ext.Toolbar({
    items: topToolBar_items
  });
  
  
  keyMaps = [];
  for (var j = 0; j< topToolBar_keyMaps.length; j++) {
  topToolBar_keyMaps[j].keyMap.fn = triggerButton.createDelegate( this,[olMapPanel_topToolBar, topToolBar_keyMaps[j].type, topToolBar_keyMaps[j].itemId]);
  keyMaps.push ( topToolBar_keyMaps[j].keyMap);
  }
  new Ext.KeyMap(document, keyMaps );

  olMapPanel_bottomToolBar = [];
  bottomToolBar_items = [];
  
  if (!toolSettings || !toolSettings.measureTool || toolSettings.measureTool.status == 'show') 
  // if either there is no toolSetting or no toolSetting for measureTool, or there is a toolSetting and it is set to status = true
  {
  
    if (toolSettings.measureTool.keyMap) {
    bottomToolBar_keyMaps.push({
      keyMap: toolSettings.measureTool.keyMap,
      itemId :'measure' ,
      type   : 'menu'
    });
    }
    
    bottomToolBar_items.push(
      new Ext.Toolbar.Button({
       text         : '&nbsp;Measure'
      ,itemId       : 'measure'
      ,iconCls      : 'buttonIcon'
      ,icon         : 'img/measure20.gif'
      ,toggleGroup  : 'navigation'
      ,enableToggle : true      
      ,tooltip      : 'Measure by length or area (click to add vertices and double-click to finish)'
      ,allowDepress : false
      ,toggleHandler      : function() {
        Ext.getCmp('mappanel').body.applyStyles('cursor:crosshair');
        if (measureType == 'length') {
          areaControl.deactivate();
          featurePolyControl.polygon.deactivate();
          featureBoxControl.polygon.deactivate();
          lengthControl.activate();
          layerRuler.removeFeatures(layerRuler.features);
          Ext.getCmp('measureTally').emptyText = '0 ' + measureUnits;
          resetMeasureTally();
        }
        else {
          lengthControl.deactivate();
          featurePolyControl.polygon.deactivate();
          featureBoxControl.polygon.deactivate();
          areaControl.activate();
          layerRuler.removeFeatures(layerRuler.features);
          Ext.getCmp('measureTally').emptyText = '0 ' + measureUnits + '^2';
          resetMeasureTally();
        }
      }
      ,menu : [
        {
         text    : 'By length'
        ,iconCls : 'buttonIcon'
        ,icon    : 'img/layer-shape-line.png'
        ,handler : function() {
          areaControl.deactivate();
          featurePolyControl.polygon.deactivate();
          featureBoxControl.polygon.deactivate();
          lengthControl.activate();
          layerRuler.removeFeatures(layerRuler.features);
          Ext.getCmp('measureTally').emptyText = '0 ' + measureUnits;
          resetMeasureTally();
          measureType = 'length';
        }
        }
        ,{
         text    : 'By area'
        ,iconCls : 'buttonIcon'
        ,icon    : 'img/layer-shape-polygon.png'
        ,handler : function() {
          lengthControl.deactivate();
          featurePolyControl.polygon.deactivate();
          featureBoxControl.polygon.deactivate();
          areaControl.activate();
          layerRuler.removeFeatures(layerRuler.features);
          Ext.getCmp('measureTally').emptyText = '0 ' + measureUnits + '^2';
          resetMeasureTally();
          measureType = 'area';
        }
        }
        ,{
         text    : 'Units'
        ,iconCls : 'buttonIcon'
        ,icon    : 'img/compass-icon.png'
        ,menu    : [
          {
           text    : 'meters'
          ,group   : 'measureUnits'
          ,checked : defaultMeasureUnit == 'm'
          ,handler : function() {
            Ext.getCmp('measureTally').emptyText = '0 m';
            if (measureType == 'area') {
            Ext.getCmp('measureTally').emptyText += '^2';
            }
            resetMeasureTally();
            measureUnits = 'm';
            lengthControl.cancel();
            areaControl.cancel();
            layerRuler.removeFeatures(layerRuler.features);
          }
          }
          ,{
           text    : 'miles'
          ,group   : 'measureUnits'
          ,checked : defaultMeasureUnit == 'mi'
          ,handler : function() {
            Ext.getCmp('measureTally').emptyText = '0 mi';
            if (measureType == 'area') {
            Ext.getCmp('measureTally').emptyText += '^2';
            }
            resetMeasureTally();
            measureUnits = 'mi';
            lengthControl.cancel();
            areaControl.cancel();
            layerRuler.removeFeatures(layerRuler.features);
          }
          }
          ,{
           text    : 'nautical miles'
          ,group   : 'measureUnits'
          ,checked : defaultMeasureUnit == 'nm'
          ,handler : function() {
            Ext.getCmp('measureTally').emptyText = '0 nm';
            if (measureType == 'area') {
            Ext.getCmp('measureTally').emptyText += '^2';
            }
            resetMeasureTally();
            layerRuler.removeFeatures(layerRuler.features);
            measureUnits = 'nm';
            lengthControl.cancel();
            areaControl.cancel();
          }
          }
          ,{
           text    : 'yards'
          ,group   : 'measureUnits'
          ,checked : defaultMeasureUnit == 'mi'
          ,handler : function() {
            Ext.getCmp('measureTally').emptyText = '0 yd';
            if (measureType == 'area') {
            Ext.getCmp('measureTally').emptyText += '^2';
            }
            resetMeasureTally();
            layerRuler.removeFeatures(layerRuler.features);
            measureUnits = 'yd';
            lengthControl.cancel();
            areaControl.cancel();
          }
          }
          ,{
           text    : 'feet'
          ,group   : 'measureUnits'
          ,checked : defaultMeasureUnit == 'ft'
          ,handler : function() {
            Ext.getCmp('measureTally').emptyText = '0 ft';
            if (measureType == 'area') {
            Ext.getCmp('measureTally').emptyText += '^2';
            }
            resetMeasureTally();
            layerRuler.removeFeatures(layerRuler.features);
            measureUnits = 'ft';
            lengthControl.cancel();
            areaControl.cancel();
          }
          }
        ]
        }
      ]
      })
      ,new Ext.form.TextField({
       width     : 100
      ,readOnly  : true
      ,emptyText : '0 ' + defaultMeasureUnit
      ,id        : 'measureTally'
      })
      ,{
       iconCls      : 'buttonIcon'
      ,icon         : 'img/erase_measure20.gif'
      ,tooltip      : 'Clear measurement'
      ,allowDepress : false
      ,handler      : function() {
        lengthControl.cancel();
        areaControl.cancel();
        resetMeasureTally();
        layerRuler.removeFeatures(layerRuler.features);
      }
      });
    }
    
    // end measure specific buttonBar code
    
     bottomToolBar_items.push(
      '->'
  );
  
  if (!toolSettings || !toolSettings.permalink || toolSettings.permalink.status == 'show') 
  // if either there is no toolSetting or no toolSetting for permalink, or there is a toolSetting and it is set to status = true
  {
  
    if (toolSettings.permalink.keyMap) {
      bottomToolBar_keyMaps.push({
        keyMap: toolSettings.permalink.keyMap,
        itemId :'permalink' ,
        type   : 'basic'
      });
    }
    
    bottomToolBar_items.push(
      new Ext.Action({
       text     : 'Permalink'
      ,itemId   : 'permalink'
      ,tooltip  : 'Make permalink'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/favorite-icon.png'
      ,handler  : function() {
        Ext.Msg.alert('Permalink','Right-click this <a target=_blank href="' + mkPermalink() + '">permalink</a> and save it as a bookmark to launch the ' + siteTitle + ' application with the current map settings enabled.')
      }
      })
      );
      bottomToolBar_items.push('-');

  }
  
  if (!toolSettings || !toolSettings.scaleSettings || toolSettings.scaleSettings.status == 'show') 
  // if either there is no toolSetting or no toolSetting for scaleSettings, or there is a toolSetting and it is set to status = true
  { 
  
    if (toolSettings.scaleSettings.keyMap) {
      bottomToolBar_keyMaps.push({
        keyMap: toolSettings.scaleSettings.keyMap,
        itemId :'scalesettings' ,
        type   : 'menu'
      });
    } 
    
    bottomToolBar_items.push({
       text    : 'Scale settings'
      ,itemId  : 'scalesettings'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/settings.png'
      ,menu    : [
        {
         text         : 'Show scalebar?'
        ,checked      : true
        ,checkHandler : function(item,checked) {
          if (checked) {
          scaleLineControl = new OpenLayers.Control.ScaleLine({geodesic : true});
          map.addControl(scaleLineControl);
          scaleLineControl.div.style.left = '100px';
          }
          else {
          map.removeControl(scaleLineControl);
          }
        }
        }
        ,{
         text    : 'Show scale ratio?'
        ,checked : true
        ,checkHandler : function(item,checked) {
          if (checked) {
          scaleRatioControl = new OpenLayers.Control.Scale();
          map.addControl(scaleRatioControl);
          }
          else {
          map.removeControl(scaleRatioControl);
          }
        }
        }
      ]
    });
  }
  if (!toolSettings || !toolSettings.mapUnits || toolSettings.mapUnits.status == 'show') 
  // if either there is no toolSetting or no toolSetting for mapUnits, or there is a toolSetting and it is set to status = true
  {   
  
    if (toolSettings.mapUnits.keyMap) {
      bottomToolBar_keyMaps.push({
        keyMap: toolSettings.mapUnits.keyMap,
        itemId :'mapunits' ,
        type   : 'menu'
      });
    } 
    
    bottomToolBar_items.push({
         text     : 'Map units'
    ,itemId   : 'mapunits'
        ,iconCls  : 'buttonIcon'
        ,icon     : 'img/compass-icon.png'
        ,menu     : [
          {
             text    : 'Degrees, minutes, seconds'
            ,id      : 'unitsDMS'
            ,group   : 'unit'
            ,checked : defaultCoordUnit == 'dms'
            ,handler : function () {
              setMapCoord('dms');
            }
          }
          ,{
             text    : 'Decimal degrees'
            ,id      : 'unitsDD'
            ,group   : 'unit'
            ,checked : defaultCoordUnit == 'dd'
            ,handler : function () {
              setMapCoord('dd');
            }
          }
          ,{
             text    : 'MA State Plane meters'
            ,id      : 'unitsMeters'
            ,group   : 'unit'
            ,checked : defaultCoordUnit == 'm'
            ,handler : function () {
              setMapCoord('m');
            }
          }
        ]
      });
  }
  if (!toolSettings || !toolSettings.basemaps || toolSettings.basemaps.status == 'show') 
  // if either there is no toolSetting or no toolSetting for basemaps, or there is a toolSetting and it is set to status = true
  {   
    if (toolSettings.basemaps.keyMap) {
      bottomToolBar_keyMaps.push({
        keyMap: toolSettings.basemaps.keyMap,
        itemId :'basemaps' ,
        type   : 'menu'
      });
    }   
  
    bottomToolBar_items.push({
         text     : 'Basemaps'
    ,itemId   : 'basemaps'
        ,iconCls  : 'buttonIcon'
        ,icon     : 'img/layers.png'
        ,menu     : [
          {
             text     : 'Custom'
            ,group    : 'basemap'
            ,checked  : defaultBase == 'custom'
            ,handler  : function () {
              addBaseLayer('custom');
              map.setOptions({fractionalZoom : true});
              if (map.getProjection() == 'EPSG:26986') {
                map.setBaseLayer(lyrBase['custom']);
                Ext.getCmp('customScale').setDisabled(false);
                Ext.getCmp('customScaleHeader').setText('Type a custom scale below and press enter.  A leading "1:" is optional.');
                Ext.getCmp('zoomToAScale').setDisabled(false);
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:26986'));
                map.setBaseLayer(lyrBase['custom']);
                Ext.getCmp('customScale').setDisabled(false);
                Ext.getCmp('zoomToAScale').setDisabled(false);
                Ext.getCmp('customScaleHeader').setText('Type a custom scale below and press enter.  A leading "1:" is optional.');
                map.setOptions({maxExtent : maxExtent26986});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Bing Hybrid'
            ,group   : 'basemap'
            ,checked : defaultBase == 'bingHybrid'
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('bingHybrid');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['bingHybrid']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                return;
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['bingHybrid']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Bing Roads'
            ,group   : 'basemap'
            ,checked : defaultBase == 'bingRoads'
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('bingRoads');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['bingRoads']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                return;
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['bingRoads']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Bing Satellite'
            ,group   : 'basemap'
            ,checked : defaultBase == 'bingAerial'
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('bingAerial');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['bingAerial']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                return;
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['bingAerial']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Google Hybrid'
            ,group   : 'basemap'
            ,checked : defaultBase == 'googleHybrid'
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('googleHybrid');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['googleHybrid']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['googleHybrid']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Google Roadmap'
            ,group   : 'basemap'
            ,checked : defaultBase == 'googleRoadmap'
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('googleRoadmap');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['googleRoadmap']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['googleRoadmap']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Google Satellite'
            ,group   : 'basemap'
            ,checked : defaultBase == 'googleSatellite'
            ,menu    : {items : [{
               text : 'View metadata'
              ,iconCls : 'buttonIcon'
              ,icon    : 'img/info1.png'
              ,handler : function() {
                showBaseLayerMetadata('Google Satellite');
              }
            }]}
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('googleSatellite');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['googleSatellite']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['googleSatellite']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'Google Terrain'
            ,group   : 'basemap'
            ,checked : defaultBase == 'googleTerrain'
            ,menu    : {items : [{
               text : 'View metadata'
              ,iconCls : 'buttonIcon'
              ,icon    : 'img/info1.png'
              ,handler : function() {
                showBaseLayerMetadata('Google Terrain');
              }
            }]}
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('googleTerrain');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['googleTerrain']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                return;
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['googleTerrain']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text    : 'OpenStreetMap'
            ,group   : 'basemap'
            ,checked : defaultBase == 'openStreetMap'
            ,menu    : {items : [{
               text : 'View metadata'
              ,iconCls : 'buttonIcon'
              ,icon    : 'img/info1.png'
              ,handler : function() {
                showBaseLayerMetadata('OpenStreetMap');
              }
            }]}
            ,handler : function () {
              map.setOptions({fractionalZoom : false});
              addBaseLayer('openStreetMap');
              Ext.getCmp('opacitySliderBaseLayer').setValue(100);
              if (map.getProjection() == 'EPSG:900913') {
                map.setBaseLayer(lyrBase['openStreetMap']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
              }
              else {
                var ext = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:900913'));
                map.setBaseLayer(lyrBase['openStreetMap']);
                Ext.getCmp('customScale').setDisabled(true);
                Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
                Ext.getCmp('zoomToAScale').setDisabled(true);
                map.setOptions({maxExtent : maxExtent900913});
                map.zoomToExtent(ext);
                refreshLayers();
              }
            }
          }
          ,{
             text        : '0%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Opacity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100%'
            ,canActivate : false
            ,hideOnClick : false
            ,style       : {
               marginTop  : '-5px'
              ,fontSize   : '9px'
            }
          }
          ,new Ext.Slider({
             width    : 150
            ,minValue : 0
            ,maxValue : 100
            ,style    : {
              marginTop : '-10px'
            }
            ,iconCls   : 'buttonIcon'
            ,id        : 'opacitySliderBaseLayer'
            ,value     : defaultBase !== 'custom' ? 100 : lyrBase['googleTerrain'].opacity * 100
            ,listeners : {
              change : function(slider,newVal) {
                if (lyrBase['googleTerrain'].map) {
                  lyrBase['googleTerrain'].setOpacity(newVal/100);
                }
                if (lyrBase['googleSatellite'].map) {
                  lyrBase['googleSatellite'].setOpacity(newVal/100);
                }
                if (lyrBase['googleRoadmap'].map) {
                  lyrBase['googleRoadmap'].setOpacity(newVal/100);
                }
                if (lyrBase['googleHybrid'].map) {
                  lyrBase['googleHybrid'].setOpacity(newVal/100);
                }
                if (lyrBase['openStreetMap'].map) {
                  lyrBase['openStreetMap'].setOpacity(newVal/100);
                }
                if (lyrBase['bingAerial'].map) {
                  lyrBase['bingAerial'].setOpacity(newVal/100);
                }
                if (lyrBase['bingRoads'].map) {
                  lyrBase['bingRoads'].setOpacity(newVal/100);
                }
                if (lyrBase['bingHybrid'].map) {
                  lyrBase['bingHybrid'].setOpacity(newVal/100);
                }
              }
            }
          })
        ]
      });
  }
  
 
   olMapPanel_bottomToolBar = new Ext.Toolbar({
    items: bottomToolBar_items
  });  

  olMapPanelOpts = {
     region : 'center'
    ,id     : 'mappanel'
    ,xtype  : 'gx_mappanel'
    ,map    : map
    ,layers : new GeoExt.data.LayerStore({
       map    : map
      ,layers : [
         lyrBase[defaultBase]
        ,featureBboxSelect
        ,layerRuler
        ,lyrGeoLocate
      ]
    })
    ,split  : true
    ,tbar   : olMapPanel_topToolBar
    ,bbar   : olMapPanel_bottomToolBar
    ,border : false
  };
  if (defaultCenter && defaultZoom) {
    olMapPanelOpts.center = new OpenLayers.LonLat(defaultCenter[0],defaultCenter[1]);
    olMapPanelOpts.zoom   = defaultZoom;
  }
  else {
    olMapPanelOpts.extent = new OpenLayers.Bounds(defaultBbox[0],defaultBbox[1],defaultBbox[2],defaultBbox[3]).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
  }
 
  olMapPanel = new GeoExt.MapPanel(olMapPanelOpts);

  keyMaps = [];
  for (var k = 0; k< bottomToolBar_keyMaps.length; k++) {
  bottomToolBar_keyMaps[k].keyMap.fn = triggerButton.createDelegate( this,[olMapPanel_bottomToolBar, bottomToolBar_keyMaps[k].type, bottomToolBar_keyMaps[k].itemId]);
  keyMaps.push ( bottomToolBar_keyMaps[k].keyMap);
  }
  new Ext.KeyMap(document, keyMaps );  


  var colorPickerColors = [];
  for (var c in availableColors) {
    colorPickerColors.push(c);
  }
  
  messageContextMenuActiveLyr = new Ext.menu.Menu({
    items: [{
       text    : 'Zoom to layer'
      ,id      : 'zoomTo'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/zoom_in.png'
    }
    ,{
       text    : 'View metadata'
      ,id      : 'viewMetadataUrl'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/info1.png'
    }
    ,{
       text    : 'Choose a color'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/colors-icon.png'
      ,id      : 'setColor'
      ,menu    : new Ext.menu.ColorMenu({
         id     : 'layerColorPicker'
        ,colors : colorPickerColors
      })
    }
    ,{
       text    : 'Revert to original color'
      ,id      : 'revertColor'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/arrow_undo.png'
    }
    ,{
       text    : 'Remove layer'
      ,id      : 'remove'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/remove.png'
    }
    ,{
       text        : '0%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Opacity&nbsp;&nbsp;&nbsp;&nbsp;100%'
      ,canActivate : false
      ,hideOnClick : false
      ,style       : {
         marginTop  : '-5px'
        ,fontSize   : '9px'
      }
    }
    ,new Ext.Slider({
       width    : 100
      ,minValue : 0
      ,maxValue : 100
      ,style    : {
        marginTop : '-10px'
      }
      ,iconCls  : 'buttonIcon'
      ,id       : 'opacitySliderLayer'
    })
  ]});

  messageContextMenuFolder = new Ext.menu.Menu({
     items: [{
       text    : 'Add folder'
      ,id      : 'addFolder'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/addPlus.png'
    }]
  });

  messageContextMenuAvailableLyr = new Ext.menu.Menu({
     items: [{
       text    : 'Add layer'
      ,id      : 'addLayer'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/addPlus.png'
    },
     {
       text    : 'View metadata'
      ,id      : 'viewMetadataUrl'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/info1.png'
    }]
  });

  messageContextMenuFeatureCtrlBbox = new Ext.menu.Menu({
     items: [{
       text    : 'Zoom to feature'
      ,id      : 'zoomTo'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/zoom_in.png'
    }
    ,{
       text    : 'Clear feature'
      ,id      : 'remove'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/query-clear.png'
    }
    ,'-'
    ,{
       text    : 'Launch the data export wizard and restrict area of interest to this feature'
      ,id      : 'featureToExportWizard'
      ,iconCls : 'buttonIcon'
      ,icon    : 'img/export.png'
    }]
  });

  olActiveLayers = new Ext.tree.TreePanel({
     title        : 'Active data layers'
    ,region       : 'center'
    ,split        : true
    ,autoScroll   : true
    ,selModel    : new Ext.tree.MultiSelectionModel()
    ,tbar        : new Ext.Toolbar({ items: [
      {
         allowDepress : false
        // ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Turn all active layers on'
        // ,icon         : 'img/checkbox_s.gif'
        ,text         : 'Check all'
        ,handler      : function() {
          for (var i in activeLyr) {
            if ((!activeLyr[i] == '') && String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0) {
              activeLyr[i].setVisibility(true);
            }
          }
        }
      }
      ,'-'
      ,{
         allowDepress : false
        // ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Turn all active layers off'
        // ,icon         : 'img/checkbox.gif'
        ,text         : 'Uncheck all'
        ,handler      : function() {
          for (var i in activeLyr) {
            if (String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0) {
              if (activeLyr[i].visibility) {
                activeLyr[i].setVisibility(false);
              }
            }
          }
        }
      }
      ,'->'
      ,{
         allowDepress : false
        // ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Remove all active layers'
        // ,icon         : 'img/remove.png'
        ,text         : 'Remove all'
        ,handler      : function() {
          for (var i in activeLyr) {
            if ((!activeLyr[i] == '') && String(lyr2wms[i]).indexOf(featurePrefix) == 0) {
              map.removeLayer(activeLyr[i]);
              activeLyr[i] = '';
            }
          }
        }
      }

    ]})
    ,root         : new GeoExt.tree.LayerContainer({
       layerStore : olMapPanel.layers
      ,leaf       : false
      ,expanded   : true
      ,loader     : new GeoExt.tree.LayerLoader({
        filter : function(rec) {
          return !rec.get('layer').isBaseLayer && !(rec.get('layer') instanceof OpenLayers.Layer.Vector);
        }
      })
    })
    ,enableDD     : true
    ,rootVisible  : false
    ,listeners    : {
      contextmenu : function(n,e) {
        var sm = olActiveLayers.getSelectionModel();
        var nodes = sm.getSelectedNodes();
        // I have no idea why there may be a value of 'Layers' inside of nodes, but get rid of it.
        var layersIdx;
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].text == 'Layers') {
            layersIdx = i;
          }
        }
        if (layersIdx >= 0) {
          if (layersIdx == 0) {
            nodes.shift();
          }
          else if (layersIdx == nodes.length) {
            // I don't think this ever comes up, but just in case . . .
            nodes.pop();
          }
          else {
            // I don't think this ever comes up, but just in case . . .
            nodes = [nodes.slice(0,i),nodes.slice(i + 1)];
          }
        }

        // for the color picker
        var geom;
        switch (wms2ico[lyr2wms[n.layer.name]]) {
          case 'pt'   : geom = 'Points'; break;
          case 'poly' : geom = 'Polys'; break;
          case 'line' : geom = 'Lines'; break;
          default : ;
        }

        if (nodes.length > 1) {
          messageContextMenuActiveLyr.findById('zoomTo').disable();
          messageContextMenuActiveLyr.findById('setColor').disable();
          messageContextMenuActiveLyr.findById('revertColor').disable();
          messageContextMenuActiveLyr.findById('viewMetadataUrl').disable();
          messageContextMenuActiveLyr.findById('opacitySliderLayer').disable();
        }
        else {
          n.select();
          nodes.push(n);
          messageContextMenuActiveLyr.findById('zoomTo').enable();
          if (geom) {
            messageContextMenuActiveLyr.findById('setColor').enable();
            messageContextMenuActiveLyr.findById('revertColor').enable();
          }
          messageContextMenuActiveLyr.findById('viewMetadataUrl').enable();
          messageContextMenuActiveLyr.findById('opacitySliderLayer').enable();
        }

        messageContextMenuActiveLyr.findById('remove').setHandler(function() {
          for (var j = 0; j < nodes.length ; j++) {
            map.removeLayer(activeLyr[nodes[j].text]);
            activeLyr[nodes[j].text] = '';
          }
        });
        messageContextMenuActiveLyr.findById('zoomTo').setHandler(function() {
          if (!lyrMetadata[n.text].maxExtent) {
            Ext.Msg.alert('Zoom to layer','The bounding box for this layer has not been defined.  Zoom to layer is unavailable.');
          }
          else {
            var bnds = new OpenLayers.Bounds(lyrMetadata[n.text].maxExtent.left,lyrMetadata[n.text].maxExtent.bottom,lyrMetadata[n.text].maxExtent.right,lyrMetadata[n.text].maxExtent.top);
            map.zoomToExtent(bnds.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()));
          }
        });

        Ext.getCmp('layerColorPicker').purgeListeners();
        var curStyle = OpenLayers.Util.getParameters(n.layer.getFullRequestString({}))['STYLES'];
        for (var c in availableColors) {
          if (availableColors[c] == String(curStyle).replace('_' + geom,'')) {
            Ext.getCmp('layerColorPicker').palette.select(c,true);
          }
        }
        Ext.getCmp('layerColorPicker').addListener('select',function(cm,color) {
          // also pass a STYLE for the getlegendgrpaphic print support
          n.layer.mergeNewParams({STYLES : availableColors[color] + '_' + geom,STYLE : availableColors[color] + '_' + geom});
        });

        messageContextMenuActiveLyr.findById('revertColor').setHandler(function() {
          // there's no easy clear value, so do it the hard way
          if (Ext.getCmp('layerColorPicker').palette.value) {
            Ext.getCmp('layerColorPicker').palette.el.child('a.color-' + Ext.getCmp('layerColorPicker').palette.value).removeClass('x-color-palette-sel');
          }
          n.layer.mergeNewParams({STYLES : wmsStyl[n.layer.name],STYLE : ''});
          for (var c in availableColors) {
            if (availableColors[c] == String(wmsStyl[n.layer.name]).replace('_' + geom,'')) {
              Ext.getCmp('layerColorPicker').palette.select(c,true);
            }
          }
        });

        messageContextMenuActiveLyr.findById('opacitySliderLayer').purgeListeners();
        messageContextMenuActiveLyr.findById('opacitySliderLayer').setValue(n.layer.opacity*100);
        messageContextMenuActiveLyr.findById('opacitySliderLayer').addListener('change',function(slider,newVal) {
          n.layer.setOpacity(newVal/100);
        });
        messageContextMenuActiveLyr.findById('viewMetadataUrl').setHandler(function() {
          if (!lyrMetadata[n.text]) {
            loadLayerMetadata(n.layer.params.LAYERS,n.text,n.style,true,false);
          }
          else {
            if (Ext.getCmp('myFrameWin')) {
              Ext.getCmp('myFrameWin').close();
            }
            var MIF = new Ext.ux.ManagedIFramePanel({
               defaultSrc  : lyrMetadata[n.text].metadataUrl
              ,bodyBorder  : false
              ,bodyStyle   : 'background:white'
              ,listeners   : {domready : function(frame){
                var fbody = frame.getBody();
                var w = Ext.getCmp('myFrameWin');
                if (w && fbody){
                  // calc current offsets for Window body border and padding
                  var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
                  var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
                  // Window is rendered (has size) but invisible
                  w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
                  Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
                  // then show it sized to frame document
                  w.show();
                }
              }}
            });
            new Ext.Window({
               title           : n.text
              ,width           : mapPanel.getWidth() * 0.65
              ,height          : mapPanel.getHeight() * 0.65
              ,hideMode        : 'visibility'
              ,id              : 'myFrameWin'
              ,hidden          : true   //wait till you know the size
              ,plain           : true
              ,constrainHeader : true
              ,minimizable     : false
              ,ddScroll        : false
              ,border          : false
              ,bodyBorder      : false
              ,layout          : 'fit'
              ,plain           : true
              ,maximizable     : true
              ,buttonAlign     : 'center'
              ,items           : MIF
            }).show();
          }
        });
        messageContextMenuActiveLyr.showAt(e.getXY());
      }
    }
  /*  // retroactively enforcing tabIndex breaks the context menu 
  ,listeners: {
    insert : function ( tr, np, nn, refn) {
      // bad hack to try to fix tabIndex issues on dataTree
      var newNode = nn;
      window.setTimeout(function () {
        newNode.getUI().anchor.tabIndex = -1;
      },300);
      
    }   
  }
  */
  });

  olLayerPanel = new Ext.Panel({
     region      : 'east'
    ,split       : true
    ,width       : 300
    ,layout      : 'border'
    ,border      : false
    ,items       : [olLayerTree,olActiveLayers,olLegendPanel]
    ,collapsible : true
    ,title       : 'Available data layers'
    ,tbar        : {}
  });

  mapPanel = new Ext.Viewport({
     layout      : 'border'
    ,split       : true
    ,items       : [olMapPanel,olLayerPanel]
  });

  Ext.getCmp('mappanel').body.setStyle('cursor','move');

  map.events.register('zoomend',this,function() {
    syncIconScale();
  });

  ctrl.activate();
  
  // to get tab support to work, we need to start by focusing somewhere relevant.
  olMapPanel_topToolBar.items.items[0].focus();
  // we also need to select a node in our trees so that keys work properly without requiring clicks
  olLayerTree.getSelectionModel().select(olLayerTree.getRootNode());
  olActiveLayers.getSelectionModel().select(olActiveLayers.getRootNode());
  
  olLayerTree.setHeight(getVPSize()[1] * 0.30);
  olLegendPanel.setHeight(getVPSize()[1] * 0.40);
});

function addLayer(wms,proj,title,viz,opacity,styles) {
  if (!activeLyr[title]) {
    activeLyr[title] = new OpenLayers.Layer.WMS(
       title
      ,wmsUrl + "?"
      ,{
         layers      : wms
        ,transparent : true
        ,styles      : styles != '' ? styles : wmsStyl[title]
        ,style       : styles != '' ? styles : wmsStyl[title]
        ,foo         : title
      }
      ,{
         projection         : map.getProjection()
        ,singleTile         : true
        ,isBaseLayer        : false
        ,opacity            : opacity
        ,addToLayerSwitcher : false
        ,visibility         : viz && !(String(proj) != 'undefined' && map.getProjection().toLowerCase() != String(proj).toLowerCase())
      }
    );
    if (!lyrMetadata[title]) {
      loadLayerMetadata(wms,title,wmsStyl[title],false,true,true);
    }
    else {
      map.addLayer(activeLyr[title]);
    }
  }
}

function refreshLayers() {
  var lyr = [];
  for (i in map.layers) {
    if (!map.layers[i].isBaseLayer && !(map.layers[i] instanceof OpenLayers.Layer.Vector) && !(map.layers[i].name == '') && !(map.layers[i].name == undefined)) {
      lyr.push({
         name    : map.layers[i].name
        ,viz     : map.layers[i].visibility
        ,opacity : map.layers[i].opacity
      });
    }
  }
  for (var i = 0; i < lyr.length; i++) {
    map.removeLayer(activeLyr[lyr[i].name]);
    activeLyr[lyr[i].name] = '';
  }
  for (var i = 0; i < lyr.length; i++) {
    addLayer(lyr2wms[lyr[i].name],lyr2proj[lyr[i].name],lyr[i].name,lyr[i].viz,lyr[i].opacity);
  }

  featureBbox.unselectAll();

  var f = lyrGeoLocate.features;
  for (var i = 0; i < f.length; i++) {
    lyrGeoLocate.removeFeatures(f[i]);
  }
  if (geoLocateLonLat) {
    var g = geoLocateLonLat.clone();
    g.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
    lyrGeoLocate.addFeatures(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(g.lon,g.lat)));
  }
  else if (geoLocateBnds) {
    var g = geoLocateBnds.clone();
    lyrGeoLocate.addFeatures(new OpenLayers.Feature.Vector(g.toGeometry().transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject())));
  }
}

function syncIconScale() {
  olActiveLayers.getRootNode().cascade(function(n) {
    if (n.attributes.layer) {
      wms = lyr2wms[n.attributes.layer.name];
      var scaleInfo = scaleOK(n.attributes.layer.name);
      var qtip = undefined;
      // an erroring layer trumps scale
      if (!scaleInfo.isOK) {
        if (n.getUI().getIconEl().className.indexOf('type' + wms2ico[wms] + 'Gray') < 0) {
          n.getUI().getIconEl().className = n.getUI().getIconEl().className.replace('type' + wms2ico[wms],'type' + wms2ico[wms] + 'Gray');
        }
        qtip = 'Layer not visible at this scale. Available range is ' + scaleInfo.range.join(' and ') + '.';
      }
      else {
        n.getUI().getIconEl().className = n.getUI().getIconEl().className.replace('type' + wms2ico[wms] + 'Gray','type' + wms2ico[wms]);
      }
      n.getUI().getIconEl().qtip = qtip;
    }
  });
}

function niceMeasurementText(d,u) {
  var m = d;
  if (measureType == 'area') {
    if (u == 'km') {
      m = m * 1000000;
    }
    if (measureUnits == 'mi') {
      return Number(m * 0.000000386102159).toFixed(2) + ' mi^2';
    }
    else if (measureUnits == 'nm') {
      return Number(m * 0.00000029155335).toFixed(2) + ' nm^2';
    }
    else if (measureUnits == 'yd') {
      return Number(m * 1.19599005).toFixed(2) + ' yd^2';
    }
    else if (measureUnits == 'ft') {
      return Number(m * 10.7639104).toFixed(2) + ' ft^2';
    }
    else {
      return d.toFixed(2) + ' ' + u + '^2';
    }
  }
  else {
    if (u == 'km') {
      m = m * 1000;
    }
    if (measureUnits == 'mi') {
      return Number(m * 0.000621371192).toFixed(2) + ' mi';
    }
    else if (measureUnits == 'nm') {
      return Number(m * 0.000539956803).toFixed(2) + ' nm';
    }
    else if (measureUnits == 'yd') {
      return Number(m * 1.0936133).toFixed(2) + ' yd';
    }
    else if (measureUnits == 'ft') {
      return Number(m * 3.2808399).toFixed(2) + ' ft';
    }
    else {
      return d.toFixed(2) + ' ' + u;
    }
  }
}

function ico2img(val) {
  if (val == 'NONE') {
    return '';
  }
  var isGray = false;
  if (val.indexOf('Gray') >= 0) {
    isGray = true;
    val = val.replace('Gray',''); 
  }
  var img = 'layers.png';
  if (val == 'poly') {
    img = 'polygon.gif';
  }
  else if (val == 'pt') {
    img = 'point.gif';
  }
  else if (val == 'line') {
    img = 'line.gif';
  }
  else if (val == 'raster') {
    img = 'raster.png';
  }
  else if (val == 'grid') {
    img = 'grid.png';
  }
  else if (val == 'layergroup') {
    img = 'layers.png';
  }
  if (isGray) {
    img = img.replace('.','-gray.');
  }
  return '<img src="img/' + img + '">';
};

function url2lnk(val) {
  if (val == 'NONE') {
    return '';
  }
  return '<a target=_blank href="' + encodeURI(val) + '"><img src="img/new_window.png"></a>';
}

function busyIco(val) {
  if (val == 'done') {
    return '<img src="img/bg16x16.png">';
  }
  else {
    return '<img src="img/spinner.gif">';
  }
}

function okIco(val) {
  if (val == 'Y') {
    return '<img src="img/Check-icon.png">';
  }
  else if (val == 'N') {
    return '<img src="img/Delete-icon.png">';
  }
  else {
    return '<img src="img/bg16x16.png">';
  }
}

function loadLayerMetadata(wms,title,style,launchMetadataWin,addLayer,tstLyr) {
 
  YUI().use("io",function(Y) {
    var handleSuccess = function(ioId,o,args) {
      if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(o.responseText,"text/xml");
      }
      else {
        xmlDoc       = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(o.responseText);
      }
      var xmlBbox = xmlDoc.getElementsByTagName('LatLonBoundingBox')[0];
      lyrMetadata[args[1]]           = {};
      lyrMetadata[args[1]].title     = args[1];
      lyrMetadata[args[1]].maxExtent = {left : xmlBbox.getAttribute('minx'),bottom : xmlBbox.getAttribute('miny'),right : xmlBbox.getAttribute('maxx'),top : xmlBbox.getAttribute('maxy')};
      var xmlKeyword = xmlDoc.getElementsByTagName('Keyword');
      for (var i = 0; i < xmlKeyword.length; i++) {
        p = OpenLayers.Util.getXmlNodeValue(xmlKeyword[i]).split('=');
        if (p[0] == 'MassgisMetadataUrl') {
          lyrMetadata[args[1]].metadataUrl = p[1];
        }
        else if (p[0] == 'ExtractDoc') {
          if (!lyrMetadata[args[1]].extractDoc) {
            lyrMetadata[args[1]].extractDoc = new Array(p[1]);
          }
          else {
            lyrMetadata[args[1]].extractDoc.push(p[1]);
          }
        }
        else if (p[0] == 'UnitsPerPixel') {
          lyrMetadata[args[1]].imgUnitsPerPixel = p[1];
        }
        else if (p[0] == 'BytesPerPixel') {
          lyrMetadata[args[1]].imgBytesPerPixel = p[1];
        }
      }
      var xmlScale = xmlDoc.getElementsByTagName('Scale')[0];
      if (xmlScale) {
        lyrMetadata[args[1]].maxScaleDenominator = xmlScale.getAttribute('maxScaleDenominator');
        lyrMetadata[args[1]].minScaleDenominator = xmlScale.getAttribute('minScaleDenominator');
      }

      if (args[3]) {
        map.addLayer(activeLyr[args[1]]);
      }

      if (args[2]) {
        if (Ext.getCmp('myFrameWin')) {
          Ext.getCmp('myFrameWin').close();
        }
        var MIF = new Ext.ux.ManagedIFramePanel({
           defaultSrc  : lyrMetadata[args[1]].metadataUrl
          ,bodyBorder  : false
          ,bodyStyle   : 'background:white'
          ,listeners   : {domready : function(frame){
            var fbody = frame.getBody();
            var w = Ext.getCmp('myFrameWin');
            if (w && fbody){
              // calc current offsets for Window body border and padding
              var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
              var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
              // Window is rendered (has size) but invisible
              w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
              Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
              // then show it sized to frame document
              w.show();
            }
          }}
        });
        new Ext.Window({
           title           : args[1]
          ,width           : mapPanel.getWidth() * 0.65
          ,height          : mapPanel.getHeight() * 0.65
          ,hideMode        : 'visibility'
          ,id              : 'myFrameWin'
          ,hidden          : true   //wait till you know the size
          ,plain           : true
          ,constrainHeader : true
          ,minimizable     : false
          ,ddScroll        : false
          ,border          : false
          ,bodyBorder      : false
          ,layout          : 'fit'
          ,plain           : true
          ,maximizable     : true
          ,buttonAlign     : 'center'
          ,items           : MIF
        }).show();
      }

      if (args[4].store) {
        args[4].store.add(new args[4].store.recordType(
           {ico : wms2ico[args[0]],title : args[4].title}
          ,++tstLyrCount
        ));
      }
    };
    Y.on('io:success',handleSuccess,this,[wms,title,launchMetadataWin,addLayer,tstLyr]);
    var request = Y.io(xmlCacheLoc + wms.replace(/:/ig,'_') + '.' + style.replace(/:/ig,'_') + '.xml?' + new Date(),{sync : true});
  });
}

function loadLayerDescribeFeatureType(wms) {
  YUI().use("io",function(Y) {
    var handleSuccess = function(ioId,o,args) {
      if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(o.responseText,"text/xml");
      }
      else {
        xmlDoc       = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(o.responseText);
      }
      var allEle = getElementsByTagNameNS(xmlDoc,'http://www.w3.org/2001/XMLSchema','xsd','element');
      var fld = [];
      var col = [];
      for (var i = 0; i < allEle.length; i++) {
        typ = 'auto';
        if (allEle[i].getAttribute('type') == 'xsd:string') {
          typ = 'string';
        }
        else if (allEle[i].getAttribute('type') == 'xsd:int') {
          typ = 'int';
        }
        else if (allEle[i].getAttribute('type') == 'xsd:double' || allEle[i].getAttribute('type') == 'xsd:short') {
          typ = 'float';
        }
        else if (allEle[i].getAttribute('type') == 'xsd:dateTime') {
          typ = 'date';
        }
        // keep everything, including the SHAPE, internally
        fld.push({name : allEle[i].getAttribute('name'),type : typ});
        if (!(String(allEle[i].getAttribute('type')).indexOf('gml:') == 0) && !(String(allEle[i].getAttribute('type')).indexOf(featurePrefix + ':') == 0)) {
          col.push({
             header    : allEle[i].getAttribute('name')
            ,dataIndex : allEle[i].getAttribute('name')
            ,renderer  : function(value,metaData,record,rowIndex,colIndex,store) {
              if (String(value).indexOf('http://') == 0) {
                metaData.css = 'featureCellHref';
              }
              return value;
            }
          });
        }
      }
      // keep the fid internally
      fld.push({name : 'fid'});

      featureBboxStore = new GeoExt.data.FeatureStore({
         fields : fld
        ,layer  : featureBboxSelect
      });
      if (!featureBboxGridPanel) {
        // this is the 1st time a query has been requested
        featureBboxGridPanel = new MorisOliverApp.thGridPanel({
           store  : featureBboxStore
          ,tbar   : [
             {text : 'Select and highlight all',handler : function() {featureBboxGridPanel.getSelectionModel().selectAll()}}
            ,'-'
            ,{text : 'Unselect and unhighlight all',handler : function() {featureBboxGridPanel.getSelectionModel().clearSelections()}}
          ]
          ,height : 215
          ,width  : 425
          ,id     : 'featureBboxGridPanel'
          ,sm     : new GeoExt.grid.FeatureSelectionModel()
          ,cm     : new Ext.grid.ColumnModel({
            defaults : {
              sortable : true
            }
            ,columns : col
          })
          ,listeners    : {
            contextmenu : function(e) {
              e.stopEvent();
            }
            ,rowcontextmenu : function(g,row,e) {
              var fid = g.getStore().getAt(row).get('fid');
              var feature;
              for (var i = 0; i < featureBboxSelect.features.length; i++) {
                if (featureBboxSelect.features[i].fid == fid) {
                  feature = featureBboxSelect.features[i];
                }
              }
              messageContextMenuFeatureCtrlBbox.findById('zoomTo').setHandler(function() {
                map.zoomToExtent(feature.bounds);
              });
              messageContextMenuFeatureCtrlBbox.findById('remove').setHandler(function() {
                featureBbox.unselect(feature);
              });
              if (feature.geometry.CLASS_NAME.toLowerCase().indexOf('polygon') >= 0) {
                messageContextMenuFeatureCtrlBbox.findById('featureToExportWizard').setHandler(function() {
                  // pull out the geometry goodies as 26986
                  var gml = new OpenLayers.Format.GML.v3();
                  var f   = feature.clone();
                  f.geometry.transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:26986"));
                  var str = gml.write(f);
                  var res = /<(gml|feature):geometry>(.*)<\/(gml|feature):geometry>/.exec(str);
                  // exportBbox.verts is uually an array of length 4, but pass along the full geom in this case
                  exportBbox.verts = [res[2]];

                  // the polygon's bbox will serve as the standard bbox for non-shp queries
                  exportBbox.minX = feature.geometry.getBounds().toArray()[0];
                  exportBbox.minY = feature.geometry.getBounds().toArray()[1];
                  exportBbox.maxX = feature.geometry.getBounds().toArray()[2];
                  exportBbox.maxY = feature.geometry.getBounds().toArray()[3];

                  launchExportWizard({typ : 'poly'});
                });
                messageContextMenuFeatureCtrlBbox.findById('featureToExportWizard').enable();
              }
              else {
                messageContextMenuFeatureCtrlBbox.findById('featureToExportWizard').disable();
              }
              messageContextMenuFeatureCtrlBbox.showAt(e.getXY());
            }
            ,cellclick : function(g,row,col,e) {
              v = g.getStore().getAt(row).get(g.getColumnModel().getColumnHeader(col));
              if (String(v).indexOf('http://') == 0) {
                if (Ext.getCmp('myFrameWin')) {
                  Ext.getCmp('myFrameWin').close();
                }
                var MIF = new Ext.ux.ManagedIFramePanel({
                   defaultSrc  : v
                  ,bodyBorder  : false
                  ,bodyStyle   : 'background:white'
                  ,listeners   : {domready : function(frame){
                    var fbody = frame.getBody();
                    var w = Ext.getCmp('myFrameWin');
                    if (w && fbody){
                      // calc current offsets for Window body border and padding
                      var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
                      var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
                      // Window is rendered (has size) but invisible
                      w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
                      Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
                      // then show it sized to frame document
                      w.show();
                    }
                  }}
                });
                new Ext.Window({
                   title           : v
                  ,width           : mapPanel.getWidth() * 0.65
                  ,height          : mapPanel.getHeight() * 0.65
                  ,hideMode        : 'visibility'
                  ,id              : 'myFrameWin'
                  ,hidden          : true   //wait till you know the size
                  ,plain           : true
                  ,constrainHeader : true
                  ,minimizable     : false
                  ,ddScroll        : false
                  ,border          : false
                  ,bodyBorder      : false
                  ,layout          : 'fit'
                  ,plain           : true
                  ,maximizable     : true
                  ,buttonAlign     : 'center'
                  ,items           : MIF
                }).show();
              }
            }
          }
        });
      }
      else {
        // reuse an exiting grid panel but reconfig it w/ the new WFS hits
        featureBboxGridPanel.reconfigure(
          new GeoExt.data.FeatureStore({
             fields : fld
            ,layer  : featureBboxSelect
          })
          ,new Ext.grid.ColumnModel({
            defaults : {
              sortable : true
            }
            ,columns : col
          })
        );
        featureBboxGridPanel.getSelectionModel().unbind();
        featureBboxGridPanel.getSelectionModel().bind(featureBboxSelect);
      }
    };
    Y.on('io:success',handleSuccess,this,[]);
    var cfg = {
       method  : "POST"
      ,headers : {'Content-Type':'application/xml; charset=UTF-8'}
      ,data    : '<DescribeFeatureType version="1.0.0" service="WFS" xmlns="http://www.opengis.net/wfs" xmlns:topp="http://www.openplans.org/topp" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"><TypeName>' + wms + '</TypeName></DescribeFeatureType>'
    };
    var request = Y.io(proxyLoc + wfsUrl,cfg);
  });
}

function mkDataWizardURL(title,ico) {
  // bbox is the fall-through as well as the way to pull out rasters
  var bbox = new OpenLayers.Geometry.LinearRing([
     new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.minY)
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.minY)
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.maxY)
    ,new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.maxY)
  ]).getBounds().toArray();

  var poly26986 = new OpenLayers.Geometry.LinearRing([
     new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.minY)
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.minY)
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.maxY)
    ,new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.maxY)
  ]).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"));
  var poly26986bbox = poly26986.getBounds().toArray();

  if (ico == 'raster' || ico == 'grid') {
    if (Ext.getCmp('wizRasterFmt').items.get(0).getGroupValue() == 'geoTiff') {
      return Array(
         wmsUrl
        ,'?REQUEST=GetMap&VERSION=1.1.0&SERVICE=WMS&EXCEPTION=application/vnd.ogc.se_inimage&layers=' + lyr2wms[title]
        ,'&FORMAT=image/geotiff'
        ,'&bbox=' + poly26986bbox.join(',')
        ,'&srs=EPSG:26986'
        ,'&width=' + Math.round((poly26986bbox[2] - poly26986bbox[0]) / lyrMetadata[title].imgUnitsPerPixel)
        ,'&height=' + Math.round((poly26986bbox[3] - poly26986bbox[1]) / lyrMetadata[title].imgUnitsPerPixel)
      ).join('');
    }
    else {
      // not supporting grids, but leave it here for kicks
      return Array('');
    }
  }
  else {
    if (Ext.getCmp('wizVectorFmt').items.get(0).getGroupValue() == 'shp') {
      if (exportBbox.verts.length == 5) {
        var poly = [];
        for (var j = 0; j < exportBbox.verts.length; j++) {
          poly.push(exportBbox.verts[j].x + ' ' + exportBbox.verts[j].y);
        }
        return Array(
           wfsUrl
          ,'?request=getfeature&version=1.1.0&outputformat=SHAPE-ZIP&service=wfs&typename=' + lyr2wms[title]
          ,'&filter=<ogc:Filter xmlns:ogc="http://ogc.org" xmlns:gml="http://www.opengis.net/gml">'
            ,'<ogc:Intersects>'
              ,'<ogc:PropertyName>SHAPE</ogc:PropertyName>'
              ,'<gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:26986"><gml:exterior><gml:LinearRing><gml:posList>'
                ,poly.join(' ')
              ,'</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon>'
            ,'</ogc:Intersects>'
          ,'</ogc:Filter>'
          ,'&SRSNAME=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
        ).join('');
      }
      else {
        return Array(
           wfsUrl
          ,'?request=getfeature&version=1.1.0&outputformat=SHAPE-ZIP&service=wfs&typename=' + lyr2wms[title]
          ,'&filter=<ogc:Filter xmlns:ogc="http://ogc.org" xmlns:gml="http://www.opengis.net/gml">'
            ,'<ogc:Intersects>'
              ,'<ogc:PropertyName>SHAPE</ogc:PropertyName>'
              ,exportBbox.verts[0]
            ,'</ogc:Intersects>'
          ,'</ogc:Filter>'
          ,'&SRSNAME=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
        ).join('');
      }
    }
    else if (Ext.getCmp('wizVectorFmt').items.get(0).getGroupValue() == 'kml') {
      return Array(
        wmsUrl
        ,'?layers=' + lyr2wms[title]
        ,'&service=WMS&version=1.1.0&request=GetMap'
        ,'&bbox=' + poly26986bbox.join(',')
        ,'&srs=EPSG:26986'
        ,'&height=100&width=100&styles='
        ,'&format=application/vnd.google-earth.kml+xml'
      ).join('');
    }
   else {
     return Array(
     wmsUrl
     ,'?layers=' + lyr2wms[title]
     ,'&service=WMS&version=1.1.0&request=GetMap'
     ,'&bbox=' + bbox.join(',')
     ,'&srs=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
     ,'&height=100&width=100&styles='
     ,'&format=application/vnd.google-earth.kml+xml'
    ).join('');
    }
  }
}

function scaleOK(name) {
  if (!lyrMetadata[name]) {
    return {isOK : true,range : ['']};
  }
  var ok  = true;
  var rng = [];
  if (lyrMetadata[name].minScaleDenominator && lyrMetadata[name].minScaleDenominator !== 'undefined') {
    ok = ok && map.getScale() > lyrMetadata[name].minScaleDenominator;
    rng.push('>' + lyrMetadata[name].minScaleDenominator);
  }
  if (lyrMetadata[name].maxScaleDenominator && lyrMetadata[name].maxScaleDenominator !== 'undefined') {
    ok = ok && map.getScale() < lyrMetadata[name].maxScaleDenominator;
    rng.push('<' + lyrMetadata[name].maxScaleDenominator);
  }
  return {isOK : ok,range : rng};
}

function rasterOK(name) {
  // continue using bbox for rasters
  var bounds = new OpenLayers.Geometry.LinearRing([
     new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.minY)
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.minY)
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.maxY)
    ,new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.maxY)
  ]).getBounds().transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"));

  var bbox = bounds.toArray();
  var dx = bbox[2] - bbox[0];
  var dy = bbox[3] - bbox[1];
  if (lyrMetadata[name].imgBytesPerPixel || lyrMetadata[name].imgUnitsPerPixel) {
    return (2 * dx * dy * lyrMetadata[name].imgBytesPerPixel) / (lyrMetadata[name].imgUnitsPerPixel * 1048576) < 15;
  }
  else {
    return true;
  }
}

function runQueryStats(bounds) {
  qryBounds = bounds;
  var vertices = bounds.getVertices();

  // save goodies in case query is thrown over to an extract
  exportBbox.units = map.getProjection();
  var posList = [];
  for (var i = 0; i < vertices.length; i++) {
    var v = vertices[i].clone().transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:26986"));
    posList.push(v.x + ' ' + v.y);
    exportBbox.verts.push(vertices[i].clone().transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:26986")));
  }
  var v = vertices[0].clone().transform(map.getProjectionObject(),new OpenLayers.Projection("EPSG:26986"));
  posList.push(v.x + ' ' + v.y);
  var gml = '<gml:MultiSurface><gml:surfaceMember><gml:Polygon><gml:exterior><gml:LinearRing><gml:posList>'
    + posList.join(' ')
    + '</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></gml:surfaceMember></gml:MultiSurface>';
  exportBbox.verts = [gml];

  // the polygon's bbox will serve as the standard bbox for non-shp queries
  exportBbox.minX = bounds.getBounds().toArray()[0];
  exportBbox.minY = bounds.getBounds().toArray()[1];
  exportBbox.maxX = bounds.getBounds().toArray()[2];
  exportBbox.maxY = bounds.getBounds().toArray()[3];

  qryWin.show();
  // populate store w/ the basics
  var queryLyrCount = 0;
  qryLyrStore.removeAll();
  for (var i = map.layers.length - 1; i >= 0; i--) {
    var title = map.layers[i].name;
  if (map.layers[i].wfstFeatureEditing) {
    continue;
  }
    if (String(lyr2wms[title]).indexOf(featurePrefix + ':') == 0 &&  activeLyr[title] && activeLyr[title].visibility) {
      var ico   = wms2ico[lyr2wms[title]];
      qryLyrStore.add(new qryLyrStore.recordType(
         {
            ico   : ico
           ,title : title
           ,wfs   : 'testing...'
        }
        ,++queryLyrCount
      ));
    }
  }

  // go back thru and fire WFS requests
  var i = 0;
  qryLyrStore.each(function(rec) {
    YUI().use("io",function(Y) {
      var handleSuccess = function(ioId,o,args) {
        if (window.DOMParser) {
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(o.responseText,"text/xml");
        }
        else {
          xmlDoc       = new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = "false";
          xmlDoc.loadXML(o.responseText);
        }
        // update the right row w/ the # of feature hits
        var el = getElementsByTagNameNS(xmlDoc,'http://www.opengis.net/wfs','wfs','FeatureCollection')[0];
        if (el) {
          if (args[2]) {
            qryLyrStore.getAt(args[0]).set('wfs',el.getAttribute('numberOfFeatures') + ' feature(s)');
          }
          else {
            qryLyrStore.getAt(args[0]).set('wfs','not visible at scale');
          }
        }
        else {
          if (!(args[1] == 'raster' || args[1] == 'grid')) {
            qryLyrStore.getAt(args[0]).set('wfs','none');
          }
        }
        qryLyrStore.getAt(args[0]).set('busy','done');
        qryLyrStore.commitChanges();
      };
      var ico = wms2ico[lyr2wms[rec.get('title')]];
      Y.on('io:success',handleSuccess,this,[i,ico,scaleOK(rec.get('title')).isOK]);
      var title = rec.get('title');
      var poly = [];
      for (var j = 0; j < vertices.length; j++) {
        poly.push(vertices[j].x + ' ' + vertices[j].y);
      }
      poly.push(vertices[0].x + ' ' + vertices[0].y);
      var cfg = {
         method  : "POST"
        ,headers : {'Content-Type':'application/xml; charset=UTF-8'}
        ,data    : '<wfs:GetFeature resultType="hits" xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><wfs:Query typeName="' + lyr2wms[title] + '" srsName="' + map.getProjectionObject() + '" xmlns:' + featurePrefix + '="' + namespaceUrl + '"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:Intersects><ogc:PropertyName>SHAPE</ogc:PropertyName><gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="' + map.getProjectionObject() + '"><gml:exterior><gml:LinearRing><gml:posList>' + poly.join(' ') + '</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></ogc:Intersects></ogc:Filter></wfs:Query></wfs:GetFeature>'
      };
      var request;
      if (ico.indexOf('raster') >= 0 || ico.indexOf('grid') >= 0) {
        qryLyrStore.getAt(i).set('wfs','n/a');
        qryLyrStore.getAt(i).set('busy','done');
        qryLyrStore.commitChanges();
      }
      else {
        request = Y.io(proxyLoc + wfsUrl,cfg);
      }
    });
    i++;
  });
}

function setMapCoord(c) {
  currentCoordUnit = c;
  if (c == 'dms') {
    mouseControl.displayProjection = new OpenLayers.Projection('EPSG:4326');
    mouseControl.formatOutput = function(lonLat) {
      return '&nbsp;' + convertDMS(lonLat.lat.toFixed(5), "LAT") + ' ' + convertDMS(lonLat.lon.toFixed(5), "LON") + '&nbsp;';
    }
  }
  else if (c == 'dd') {
    mouseControl.displayProjection = new OpenLayers.Projection('EPSG:4326');
    mouseControl.formatOutput = function(lonLat) {
      var ns = 'N';
      if (lonLat.lat < 0) {
        ns = 'S';
      }
      var we = 'E';
      if (lonLat.lon < 0) {
        we = 'W';
      }
      return '&nbsp;' + Math.abs(lonLat.lat).toFixed(5) + '&deg; ' + ns + ' ' + Math.abs(lonLat.lon).toFixed(5) + '&deg; ' + we + '&nbsp;';
    }
  }
  else {
    mouseControl.displayProjection = new OpenLayers.Projection('EPSG:26986');
    mouseControl.formatOutput = function(lonLat) {
      return '&nbsp;' + lonLat.lon.toFixed(2) + ' ' + lonLat.lat.toFixed(2) + '&nbsp;';
    };
  }
}

function mkPermalink() {
  var lyrs = [];
  var base;
  for (var i = 0; i < map.layers.length; i++) {
    if (map.layers[i].isBaseLayer && map.layers[i].visibility) {
      base = map.layers[i].name;
    }
    else if (String(lyr2wms[map.layers[i].name]).indexOf(featurePrefix) == 0 && map.layers[i].visibility) {
      lyrs.push(map.layers[i].name + '~' + lyr2wms[map.layers[i].name] + '~' + OpenLayers.Util.getParameters(map.layers[i].getFullRequestString({}))['STYLES']);
    }
  }

  return String('?lyrs=' + lyrs.join('|') + '&bbox=' + map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:4326')).toArray() + '&coordUnit=' + currentCoordUnit + '&measureUnit=' + measureUnits + '&base=' + base + '&center=' + map.getCenter().lon + ',' + map.getCenter().lat + '&zoom=' + map.getZoom()).replace(/ /g,'%20');
}

// Array.unique( strict ) - Remove duplicate values
Array.prototype.unique = function( b ) {
 var a = [], i, l = this.length;
 for( i=0; i<l; i++ ) {
  if( a.indexOf( this[i], 0, b ) < 0 ) { a.push( this[i] ); }
 }
 return a;
};

function addBaseLayer(name) {
  var exists = false;
  for (var i = 0; i < map.layers.length; i++) {
    if (map.layers[i].name == name) {
      exists = true;
    }
  }
  if (!exists) {
    map.addLayer(lyrBase[name]);
  }
}

function getElementsByTagNameNS(xmlDoc,nsUrl,nsTag,tag) {
  // we have namespaces, and browsers treat them differently
  if (document.getElementsByTagNameNS !== undefined) {
    return xmlDoc.getElementsByTagNameNS(nsUrl,tag);
  }
  else {
    return xmlDoc.getElementsByTagName(nsTag + ':' + tag);
  }
}

function printSave() {
  var l = {};
  var hits = 0;
  for (var j = 0; j < map.layers.length; j++) {
    for (var i in activeLyr) {
      if (map.layers[j].name == i && !activeLyr[i] == '' && String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0 && map.layers[j].visibility && scaleOK(i).isOK) {
        l[i] = {
           img     : activeLyr[i].getFullRequestString({})
          ,legend  : activeLyr[i].getFullRequestString({}).replace('GetMap','GetLegendGraphic').replace('LAYERS=','LAYER=')
          ,opacity : activeLyr[i].opacity
        };
        hits++;
      }
    }
  }
  if (hits > 0) {
    YUI().use("io","json-parse","json-stringify",function(Y) {
      var handleSuccess = function(ioId,o,args) {
        Ext.MessageBox.hide();
        var json = Y.JSON.parse(o.responseText);
        Ext.Msg.alert('Map ready','Please click <a target=_blank href="' + json.html + '">here</a> to open a new window containing your map and legend as separate images.  You can then either right-click each image and save them locally or print them through your browser.');
      };
      Y.on('io:success',handleSuccess,this,[]);
      var scaleLineTop    = getElementsByClassName('olControlScaleLineTop')[0];
      var scaleLineBottom = getElementsByClassName('olControlScaleLineBottom')[0];
      var cfg = {
         method  : 'POST'
        ,headers : {'Content-Type':'application/json'}
        ,data    : Y.JSON.stringify({
           w               : map.div.style.width
          ,h               : map.div.style.height
          ,extent          : map.getExtent().toArray()
          ,layers          : l
          ,scaleLineTop    : {w : scaleLineTop.style.width,val : scaleLineTop.innerHTML}
          ,scaleLineBottom : {w : scaleLineBottom.style.width,val : scaleLineBottom.innerHTML}
        })
      };
      promptForTitle(cfg,Y);
    });
  }
  else {
    Ext.Msg.alert('Print / Save error','There are no active data layers to print.');
  }
}

function promptForTitle(cfg,Y) {
  Ext.MessageBox.prompt('Print / Save','Please enter a title:',function(btn,txt) {
    if (btn == 'ok' && txt != '') {
      Ext.MessageBox.show({
         title        : 'Assembling map'
        ,msg          : 'Please wait...'
        ,progressText : 'Working...'
        ,width        : 300
        ,wait         : true
        ,waitConfig   : {interval:200}
      });
      var request = Y.io('print.php?title=' + txt,cfg);
    }
    else if (btn == 'ok') {
      promptForTitle(cfg,Y);
    }
  });
}

function launchExportWizard(aoi) {
  var tstLyrStore = new Ext.data.ArrayStore({
    fields : [
       {name : 'ico'  }
      ,{name : 'title'}
    ]
  });
  for (var j = map.layers.length - 1; j >= 0; j--) {
    for (var i in activeLyr) {
      if (map.layers[j].name == i && !activeLyr[i] == '' && String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0 && map.layers[j].visibility) {
        // a normal find wasn't working properly, so loop through the list to keep dups out
        var exists = false;
        tstLyrStore.each(function(rec) {
          exists = exists || rec.get('title') == activeLyr[i].name;
        });
        if (!exists) {
          tstLyrStore.add(new tstLyrStore.recordType(
             {ico : wms2ico[lyr2wms[activeLyr[i].name]],title : activeLyr[i].name}
            ,++tstLyrCount
          ));
        }
      }
    }
  }

  var bboxLyrStore = new Ext.data.ArrayStore({
    fields : [
       {name : 'ico'  }
      ,{name : 'title'}
      ,{name : 'bbox' }
      ,{name : 'wfs'  }
      ,{name : 'busy' }
      ,{name : 'export'}
    ]
  });
  var bboxLyrCount = 0;
  var downloadLyrStore = new Ext.data.ArrayStore({
    fields : [
       {name : 'ico'  }
      ,{name : 'title'}
      ,{name : 'url'  }
    ]
  });
  var wizGetData = new Ext.ux.Wiz({
     title           : 'Data export wizard'
    ,constrainHeader : true
    ,id              : 'getDataWiz'
    ,headerConfig    : {
      title : ''
    }
    ,width           : 700
    ,height          : 600
    ,resizable       : true
    ,maximizable     : true
    ,cardPanelConfig : {
      defaults : {
         border      : false
        ,bodyStyle   : 'padding:6px'
        ,labelWidth  : 75
        ,autoScroll  : true
      }
    }
    ,listeners    : {finish : function() {
      if (!mkzipCGI) {
        Ext.Msg.alert('ZIP unavailable','Sorry, this functionality is currently unavailable.');
        return;
      }
      downloadLyrStore.removeAll();
      var downloadLyrCount = 0;
      tstLyrStore.each(function(rec) {
        var title  = rec.get('title');
        var ico    = wms2ico[lyr2wms[title]];
        if (bboxLyrStore.getAt(bboxLyrStore.find('title',rec.get('title'))).get('wfs').indexOf('> max') < 0 && bboxLyrStore.getAt(bboxLyrStore.find('title',rec.get('title'))).get('bbox') == 'Y' && bboxLyrStore.getAt(bboxLyrStore.find('title',rec.get('title'))).get('wfs') !== '0 feature(s)') {
          downloadLyrStore.add(new downloadLyrStore.recordType(
             {ico : ico,title : title,url : mkDataWizardURL(title,ico)}
            ,++downloadLyrCount
          ));
          // add metadataUrl & everything for this layer for extractDoc
          if (lyrMetadata[title].metadataUrl) {
            downloadLyrStore.add(new downloadLyrStore.recordType(
               {ico : 'NONE',title : '&nbsp;&nbsp;&nbsp;&nbsp;' + lyrMetadata[title].metadataUrl,url : lyrMetadata[title].metadataUrl}
              ,++downloadLyrCount
            ));
          }
          if (lyrMetadata[title].extractDoc) {
            for (var i = 0; i < lyrMetadata[title].extractDoc.length; i++) {
              downloadLyrStore.add(new downloadLyrStore.recordType(
                 {ico : 'NONE',title : '&nbsp;&nbsp;&nbsp;&nbsp;' + lyrMetadata[title].extractDoc[i],url : lyrMetadata[title].extractDoc[i]}
                ,++downloadLyrCount
              ));
            }
          }
        }
      });

      if (downloadLyrCount == 0) {
        Ext.Msg.alert('Data export','Sorry, no layers were eligible for export.');
        return;
      }

      var dataURL = [];
      var lastTitle;
      downloadLyrStore.each(function(rec) {
        var title = rec.get('title').replace('&nbsp;&nbsp;&nbsp;&nbsp;','');
        if (!dataURL[title] & title.indexOf('http://') < 0) {
          dataURL[title] = {
             base     : safeXML(rec.get('url'))
            ,metadata : []
            ,layer    : rec.get('url').indexOf('application/vnd.google-earth.kml+xml') >= 0 || lyrMetadata[title].imgBytesPerPixel || lyrMetadata[title].imgUnitsPerPixel ? String(OpenLayers.Util.getParameters(rec.get('url'))['layers']).replace(featurePrefix + ':','') : ''
            ,style    : ''
          };
          // pass along style for kml
          if (rec.get('url').indexOf('application/vnd.google-earth.kml+xml') >= 0) {
            dataURL[title].style = wmsStyl[title];
          }
          lastTitle = title;
        }
        else {
          dataURL[lastTitle].metadata.push(safeXML(rec.get('url')));
        }
      });

      var dataXML = '';
      for (var i in dataURL) {
        if (dataURL[i].base) {
          dataXML += '<layer wmsStyle="' + safeXML(dataURL[i].style) + '" wmsLayer="' + safeXML(dataURL[i].layer) + '" name="' + safeXML(i) + '" baseURL="' + dataURL[i].base + '"><metadata>' + dataURL[i].metadata.join('</metadata><metadata>') + '</metadata>' + '</layer>';
        }
      }
      YUI().use("io",function(Y) {
        var handleSuccess = function(ioId,o,args) {
          Ext.MessageBox.hide();
          Ext.MessageBox.show({
             title     : 'Download exported data'
            ,msg       : 'Click <a href="' + mkzipLoc + '/' + o.responseText + '" target=_blank onclick="Ext.MessageBox.hide()">here</a> to download the ZIP file.'
            ,width     : 300
          });
        };
        Y.on('io:success',handleSuccess,this,[]);
        var cfg = {
           method  : 'POST'
          ,headers : {'Content-Type':'application/xml; charset=UTF-8'}
          ,data    : '<layers>' + dataXML + '<zip name="' + Ext.getCmp('zipName').getValue() + '"/></layers>'
        };
        Ext.MessageBox.show({
           title        : 'Exporting data'
          ,msg          : 'Exporting data, please wait...'
          ,progressText : 'Saving...'
          ,width        : 300
          ,wait         : true
          ,waitConfig   : {interval:200}
        });
        var request = Y.io(mkzipCGI,cfg);
      });
    }}
    ,cards           : [
      new Ext.ux.Wiz.Card({
         title     : 'How to export data'
        ,items     : [{
           bodyStyle : 'padding:30px'
          ,border    : false
          ,html      : '<h3>Welcome to the data export wizard.</h3><p style="text-align:justify"><br>This wizard may be used to export vector data as ESRI shapefiles or KMLs (Google Earth and other clients) and raster data as GeoTIFFs. Users may choose their area of interest and subsets of datasets may be downloaded. Metadata and other supporting documents are also packaged with the exported data. For information on accessing full datasets, please check the metadata of the layers of interest.<br><br>Click Next to continue.</p>'
        }]
      })
      ,new Ext.ux.Wiz.Card({
         title        : 'Select data layers and area of interest'
        ,monitorValid : true
        ,items        : [
          {
             html      : 'Click on one or more data layers to add them to the layers of interest list.  Then enter coordinates for the area of interest and click Next.'
            ,bodyStyle : 'padding:10px'
            ,border    : false
          }
          ,{
             xtype : 'fieldset'
            ,title : 'Data layers'
            ,items  : [
              {
                 layout   : 'column'
                ,border   : false
                ,items    : [
                  {
                     columnWidth : .5
                    ,bodyStyle   : 'padding-left:2px'
                    ,border      : false
                    ,items       : [
                      new MorisOliverApp.thGridPanel({
                         height           : 200
                        ,width            : 272
                        ,title            : 'Data layers of interest'
                        ,store            : tstLyrStore
                        ,hideHeaders      : true
                        ,columns          : [
                           {id : 'ico'  ,header :'Icon'       ,width : 25 ,renderer : ico2img}
                          ,{id : 'title',header : 'Layer name',width : 800                   }
                        ]
                        // ,autoExpandColumn : 'title'
                        ,tbar             : [
                          {
                             iconCls  : 'buttonIcon'
                            ,tooltip  : "Import active map's active data layers"
                            ,text     : 'Import active layers'
                            ,icon     : 'img/import.png'
                            ,handler     : function() {
                              tstLyrStore.removeAll();
                              for (var j = map.layers.length - 1; j >= 0; j--) {
                                for (var i in activeLyr) {
                                  if (map.layers[j].name == i && !activeLyr[i] == '' && String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0) {
                                    // a normal find wasn't working properly, so loop through the list to keep dups out
                                    var exists = false;
                                    tstLyrStore.each(function(rec) {
                                      exists = exists || rec.get('title') == activeLyr[i].name;
                                    });
                                    if (!exists) {
                                      tstLyrStore.add(new tstLyrStore.recordType(
                                         {ico : wms2ico[lyr2wms[activeLyr[i].name]],title : activeLyr[i].name}
                                        ,++tstLyrCount
                                      ));
                                    }
                                  }
                                }
                              }
                            }
                          }
                          ,'->'
                          ,{
                             iconCls  : 'buttonIcon'
                            ,tooltip  : 'Remove all layers'
                            ,text     : 'Remove all'
                            ,icon     : 'img/remove.png'
                            ,handler     : function() {
                              tstLyrStore.removeAll();
                            }
                          }
                        ]
                        ,listeners    : {
                          contextmenu     : function(e) {
                            e.stopEvent();
                          }
                          ,rowcontextmenu : function(g,row,e) {
                            var sel = g.getSelectionModel();
                            if (!sel.isSelected(row)) {
                              sel.selectRow(row);
                            }
                            var contextMenu = new Ext.menu.Menu({
                              items: [{
                                 text    : 'Remove layer(s)'
                                ,iconCls : 'buttonIcon'
                                ,icon    : 'img/remove.png'
                                ,handler : function() {
                                  var s = g.getSelectionModel().getSelections();
                                  for (var i = 0; i < s.length; i++) {
                                    g.getStore().remove(s[i]);
                                  }
                                }
                              }]
                            });
                            contextMenu.showAt(e.getXY())
                          }
                        }
                      })
                    ]
                  }
                  ,{
                     columnWidth : .5
                    ,bodyStyle   : 'padding-right:2px'
                    ,border      : false
                    ,items       : [
                      new Ext.tree.TreePanel({
                         height      : 200
                        ,width       : 272
                        ,title       : 'Advanced - Select additional data layers'
                        ,id          : 'availableDataLyrWiz'
                        ,collapsible : true
                        ,collapsed   : true
                        ,autoScroll  : true
                        ,rootVisible : false
                        ,root        : new Ext.tree.AsyncTreeNode()
                        ,loader      : new Ext.app.LayerLoader({
                           dataUrl       : foldersetLoc + '?a'
                          ,requestMethod : 'GET'
                        })
                        ,tbar        : {height : 27,items : [
                          new Ext.form.ComboBox({
                             store          : lyrStoreSearchWizard
                            ,id             : 'lyrSearchWizardCombo'
                            ,forceSelection : true
                            ,triggerAction  : 'all'
                            ,emptyText      : 'Select / search data layers'
                            ,selectOnFocus  : true
                            ,mode           : 'local'
                            ,valueField     : 'id'
                            ,displayField   : 'title'
                            ,width          : 265
                            ,listeners      : {
                              select : function(comboBox,rec,i) {
                                var olLayerTree = Ext.getCmp('availableDataLyrWiz');
                                olLayerTree.getRootNode().cascade(function(n) {
                                  if (n.attributes.text == rec.get('title')) {
                                    olLayerTree.selectPath(n.getPath());
                                    n.fireEvent('click',n);
                                    n.ui.focus();
                                  }
                                });
                              }
                            }
                          })
                        ]}
                        ,listeners   : {
                          click : function(node,e){
                            if (!node.isLeaf()) {
                              return;
                            }
                            // a normal find wasn't working properly, so loop through the list to keep dups out
                            var exists = false;
                            tstLyrStore.each(function(rec) {
                              exists = exists || rec.get('title') == node.attributes.text;
                            });
                            if (!exists) {
                              // grab the metadata if necessary and add when done
                              if (!lyrMetadata[node.attributes.text]) {
                                loadLayerMetadata(lyr2wms[node.attributes.text],node.attributes.text,node.attributes.style,false,false,{store : tstLyrStore,title : node.attributes.text});
                              }
                              else {
                                tstLyrStore.add(new tstLyrStore.recordType(
                                   {ico : wms2ico[lyr2wms[node.attributes.text]],title : node.attributes.text}
                                  ,++tstLyrCount
                                ));
                              }
                            }
                          }
                          ,contextmenu : function(n,e) {
                            if (n.isLeaf()) {
                            }
                            else {
                              var isGrandparent = false;
                              for (var i = 0; i < n.childNodes.length; i++) {
                                isGrandparent = isGrandparent || n.childNodes[i].hasChildNodes();
                              }
                              if (!isGrandparent) {
                                new Ext.menu.Menu({
                                  items: [{
                                     text    : 'Add folder'
                                    ,id      : 'addFolder'
                                    ,iconCls : 'buttonIcon'
                                    ,icon    : 'img/addPlus.png'
                                    ,handler : function() {
                                      var a = [];
                                      n.eachChild(function(child) {
                                        a.push({
                                           text  : child.attributes.text
                                          ,style : child.attributes.style
                                        });
                                        // a.push([child.attributes.wmsName,child.attributes.only_project,child.attributes.text,true,1]);
                                      });
                                      for (var i = 0; i < a.length; i++) {
                                        // a normal find wasn't working properly, so loop through the list to keep dups out
                                        var exists = false;
                                        tstLyrStore.each(function(rec) {
                                          exists = exists || rec.get('title') == a[i].text;
                                        });
                                        if (!exists) {
                                          // grab the metadata if necessary and add when done
                                          if (!lyrMetadata[a[i].text]) {
                                            loadLayerMetadata(lyr2wms[a[i].text],a[i].text,a[i].style,false,false,{store : tstLyrStore,title : a[i].text});
                                          }
                                          else {
                                            tstLyrStore.add(new tstLyrStore.recordType(
                                               {ico : wms2ico[lyr2wms[a[i].text]],title : a[i].text}
                                              ,++tstLyrCount
                                            ));
                                          }
                                        }
                                      }
                                    }
                                  }]
                                }).showAt(e.getXY());
                              }
                            }
                          }
                        }
                      })
                    ]
                  }
                ]
              }
            ]
          }
          ,mkAreaOfInterestFieldset(aoi)
        ]
      })
      ,new Ext.ux.Wiz.Card({
         title     : 'Query results'
        ,listeners : {
          show : function() {
            bboxLyrStore.removeAll();
            var tstBbox = new OpenLayers.Geometry.LinearRing([
               new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.minY)
              ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.minY)
              ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.maxY)
              ,new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.maxY)
            ]).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:4326"));

            // assume no hits
            Ext.getCmp('wizVectorFmt').disable();
            Ext.getCmp('wizRasterFmt').disable();

            tstLyrStore.each(function(rec) {
              var title     = rec.get('title');
              var bboxOK    = 'N';
              var exportOK  = '';
              var ico       = wms2ico[lyr2wms[title]];
              var rstrOK    = rasterOK(title);
              if (!rstrOK) {
                ico += 'Gray';
              }
              if (new OpenLayers.Geometry.Polygon(tstBbox).intersects(getCapsBbox[lyr2wms[title]].toGeometry())) {
                bboxOK = 'Y';
              }
              var wfsMsg = 'testing...';
              // turn on options based on the ico (layer type)
              if (ico.indexOf('poly') >= 0 || ico.indexOf('pt') >= 0 || ico.indexOf('line') >= 0) {
                Ext.getCmp('wizVectorFmt').enable();
              }
              else if (ico.indexOf('raster') >= 0 || ico.indexOf('grid') >= 0) {
                Ext.getCmp('wizRasterFmt').enable();
                if (!rstrOK) {
                  wfsMsg = '> max file size';
                  exportOK = 'N';
                }
                else {
                  wfsMsg = 'n/a';
                }
              }
              bboxLyrStore.add(new bboxLyrStore.recordType(
                 {'ico' : ico,'title' : title,'bbox' : bboxOK,'wfs' : wfsMsg,'export' : exportOK}
                ,++bboxLyrCount
              ));
            });

            // go back thru the layers and fire off a resultType=hits request for each one
            tstLyrStore.each(function(rec) {
              var ico = wms2ico[lyr2wms[rec.get('title')]];
              YUI().use("io",function(Y) {
                var handleSuccess = function(ioId,o,args) {
                  if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(o.responseText,"text/xml");
                  }
                  else {
                    xmlDoc       = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = "false";
                    xmlDoc.loadXML(o.responseText);
                  }
                  // update the right row w/ the # of feature hits
                  var el = getElementsByTagNameNS(xmlDoc,'http://www.opengis.net/wfs','wfs','FeatureCollection')[0];
                  if (el) {
                    var hits = el.getAttribute('numberOfFeatures');
                    if (hits > maxAllowedFeatures) {
                      bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('wfs','> max # features');
                      bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('export','N');
                    }
                    else {
                      bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('wfs',hits + ' feature(s)');
                      if (hits == 0) {
                        bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('export','N');
                      }
                    }
                  }
                  else {
                    if (!(args[1] == 'raster' || args[1] == 'grid')) {
                      bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('wfs','none');
                    }
                  }
                  bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('busy','done');
                  if (bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).get('export') !== 'N') {
                    bboxLyrStore.getAt(bboxLyrStore.find('title',args[0])).set('export','Y');
                  }
                  bboxLyrStore.commitChanges();
                };
                var title = rec.get('title');
                Y.on('io:success',handleSuccess,this,[title,ico]);
                if (exportBbox.verts.length == 5) {
                  var poly = [];
                  for (var j = 0; j < exportBbox.verts.length; j++) {
                    poly.push(exportBbox.verts[j].x + ' ' + exportBbox.verts[j].y);
                  }
                  data = '<wfs:GetFeature resultType="hits" xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><wfs:Query typeName="' + lyr2wms[title] + '" srsName="EPSG:26986" xmlns:' + featurePrefix + '="' + namespaceUrl + '"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:Intersects><ogc:PropertyName>SHAPE</ogc:PropertyName><gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:26986"><gml:exterior><gml:LinearRing><gml:posList>' + poly.join(' ') + '</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></ogc:Intersects></ogc:Filter></wfs:Query></wfs:GetFeature>'
                }
                else {
                  data = '<wfs:GetFeature resultType="hits" xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><wfs:Query typeName="' + lyr2wms[title] + '" srsName="EPSG:26986" xmlns:' + featurePrefix + '="' + namespaceUrl + '"><ogc:Filter xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc"><ogc:Intersects><ogc:PropertyName>SHAPE</ogc:PropertyName>' + exportBbox.verts[0] + '</ogc:Intersects></ogc:Filter></wfs:Query></wfs:GetFeature>'
                }
                var cfg = {
                   method  : "POST"
                  ,headers : {'Content-Type':'application/xml; charset=UTF-8'}
                  ,data    : data
                };
                var rstrOK    = rasterOK(rec.get('title'));
                var request;
                if (!rstrOK) {
                  bboxLyrStore.getAt(bboxLyrStore.find('title',rec.get('title'))).set('busy','done');
                  bboxLyrStore.commitChanges();
                }
                request = Y.io(proxyLoc + wfsUrl,cfg);
              });
            });
          }
        }
        ,items     : [
          {
             html      : 'Two geospatial boundary tests are being performed on the layers of interest.  Once testing is complete and you are satisfied with the results, click Next to continue.  Otherwise, click Previous to refine the search criteria.'
            ,bodyStyle : 'padding:10px'
            ,border    : false
          }
          ,new MorisOliverApp.thGridPanel({
             height           : 390
            ,title            : 'Query results'
            ,store            : bboxLyrStore
            ,disableSelection : true
            ,enableHdMenu     : false
            ,columns          : [
               {id : 'ico'   ,dataIndex : 'ico'   ,header : ''                              ,width : 25,renderer : ico2img                 }
              ,{id : 'title' ,dataIndex : 'title' ,header : 'Layer name'                                                                   }
              ,{id : 'wfs'   ,dataIndex : 'wfs'   ,header : 'Feature(s) found?'                                                            }
              ,{id : 'export',dataIndex : 'export',header : 'OK to export?'                 ,align : 'center',renderer: okIco              }
              ,{id : 'busy'  ,dataIndex : 'busy'  ,header : ''                              ,width : 30,renderer : busyIco                 }
            ]
            ,autoExpandColumn : 'title'
            ,loadMask         : true
          })
        ]
      })
      ,new Ext.ux.Wiz.Card({
         title        : 'Select output and download options'
        ,monitorValid : true
        ,items        : [
          {
             xtype : 'fieldset'
            ,title : 'Output coordinate system'
            ,items  : [
              {
                 xtype   : 'radiogroup'
                ,id      : 'radioEpsg'
                ,columns : 1
                ,items   : [
                   {boxLabel : 'NAD83/Massachusetts State Plane Coordinate System, Mainland Zone, meters - EPSG:26986',name : 'epsg',inputValue : 'EPSG:26986',checked : true                }
                  ,{boxLabel : 'NAD83/UTM zone 18N, meters (Western Massachusetts) - EPSG:26918'                      ,name : 'epsg',inputValue : 'EPSG:26918'                               }
                  ,{boxLabel : 'NAD83/UTM zone 19N, meters (Eastern Massachusetts) - EPSG:26919'                      ,name : 'epsg',inputValue : 'EPSG:26919'                               }
                  ,{boxLabel : 'WGS84 (Latitude-Longitude) - EPSG:4326'                                               ,name : 'epsg',inputValue : 'EPSG:4326'                                }
                ]
              }
            ]
          }
          ,{
             xtype : 'fieldset'
            ,title : 'Vector data output options'
            ,items  : [
              {
                 layout   : 'column'
                ,border   : false
                ,items    : [
                  {
                     columnWidth : 1
                    ,layout      : 'form'
                    ,border      : false
                    ,items       : [
                      {
                         xtype       : 'radiogroup'
                        ,id          : 'wizVectorFmt'
                        ,fieldLabel  : 'Format'
                        ,items       : [
                           {boxLabel : 'ESRI shape (.shp)'       ,name : 'vectorFormat',inputValue : 'shp',checked : true}
                          ,{boxLabel : 'Google Earth file (.kml)',name : 'vectorFormat',inputValue : 'kml'               }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
          ,{
             xtype : 'fieldset'
            ,title : 'Raster data output options'
            ,items  : [
              {
                 layout   : 'column'
                ,border   : false
                ,items    : [
                  {
                     columnWidth : .4
                    ,layout      : 'form'
                    ,border      : false
                    ,items       : [
                      {
                         xtype      : 'radiogroup'
                        ,id         : 'wizRasterFmt'
                        ,fieldLabel : 'Format'
                        ,items      : [
                           {boxLabel : 'GeoTiff',name : 'rasterFormat',inputValue : 'geoTiff',checked : true}
                          // ,{boxLabel : 'Grid'   ,name : 'rasterFormat',inputValue : 'grid'                  }
                        ]
                      }
                    ]
                  }
                  ,{
                     columnWidth : .6
                    ,layout      : 'form'
                    ,border      : false
                    ,items       : [{border : false,html : '&nbsp;'}]
                  }
                ]
              }
            ]
          }
          ,{
             xtype : 'fieldset'
            ,title : 'Name of the ZIP file to download'
            ,items : new Ext.form.TextField({
               name       : 'zipName'
              ,id         : 'zipName'
              ,allowBlank : false
              ,fieldLabel : 'File name'
            })
          }
        ]
      })
    ]
  });
  wizGetData.show();
}

function syncExportBboxVerts() {
  exportBbox.verts = [
     new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.minY).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"))
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.minY).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"))
    ,new OpenLayers.Geometry.Point(exportBbox.maxX,exportBbox.maxY).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"))
    ,new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.maxY).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"))
    ,new OpenLayers.Geometry.Point(exportBbox.minX,exportBbox.minY).transform(new OpenLayers.Projection(exportBbox.units.replace('dms','')),new OpenLayers.Projection("EPSG:26986"))
  ];
}

function mkAreaOfInterestFieldset(aoi) {
  if (aoi.typ == 'bbox') {
    return {
       xtype : 'fieldset'
      ,title : 'Area of interest'
      ,items  : [
        {
           html      : 'Click Next to export data that are within or overlap the current map window extent.  Click Advanced to change the area of interest.'
          ,bodyStyle : 'padding:0 5px 10px 5px'
          ,border    : false
        }
        ,{xtype : 'fieldset',title : 'Advanced - Change area of interest',collapsible : true,collapsed : true,items : [{
           layout : 'column'
          ,border : false
          ,items  : [
            {
               columnWidth : .5
              ,layout      : 'form'
              ,border      : false
              ,items       : [
                {
                   xtype      : 'textfield'
                  ,fieldLabel : 'Min X'
                  ,id         : 'minX'
                  ,allowBlank : false
                  ,listeners  : {valid : function(field) {
                    exportBbox.minX = exportBbox.units.indexOf('dms') >= 0 ? dms2dd(field.getValue()) : field.getValue();
                    syncExportBboxVerts();
                  }}
                }
                ,{
                   xtype      : 'textfield'
                  ,fieldLabel : 'Min Y'
                  ,id         : 'minY'
                  ,allowBlank : false
                  ,listeners  : {valid : function(field) {
                    exportBbox.minY = exportBbox.units.indexOf('dms') >= 0 ? dms2dd(field.getValue()) : field.getValue();
                    syncExportBboxVerts();
                  }}
                }
              ]
            }
            ,{
               columnWidth : .5
              ,layout      : 'form'
              ,border      : false
              ,items       : [
                {
                   xtype      : 'textfield'
                  ,fieldLabel : 'Max X'
                  ,id         : 'maxX'
                  ,allowBlank : false
                  ,listeners  : {valid : function(field) {
                    exportBbox.maxX = exportBbox.units.indexOf('dms') >= 0 ? dms2dd(field.getValue()) : field.getValue();
                    syncExportBboxVerts();
                  }}
                }
                ,{
                   xtype      : 'textfield'
                  ,fieldLabel : 'Max Y'
                  ,id         : 'maxY'
                  ,allowBlank : false
                  ,listeners  : {valid : function(field) {
                    exportBbox.maxY = exportBbox.units.indexOf('dms') >= 0 ? dms2dd(field.getValue()) : field.getValue();
                    syncExportBboxVerts();
                  }}
                }
              ]
            }
          ]
        }
        ,{
           xtype      : 'radiogroup'
          ,fieldLabel : 'Units'
          ,id         : 'radioUnits'
          ,items      : [
             {boxLabel : 'MA State Plane meters',name : 'units',inputValue : 'EPSG:26986'  ,checked : defaultCoordUnit == 'm'  }
            ,{boxLabel : 'Decimal degrees'      ,name : 'units',inputValue : 'EPSG:4326'   ,checked : defaultCoordUnit == 'dd' }
            ,{boxLabel : 'Deg min sec'          ,name : 'units',inputValue : 'EPSG:4326dms',checked : defaultCoordUnit == 'dms'}
          ]
          ,listeners   : {
            render : function(field) {
              var proj = 'EPSG:26986';
              if (defaultCoordUnit == 'dd' || defaultCoordUnit == 'dms') {
                proj = 'EPSG:4326';
              }
              exportBbox.units = field.items.get(0).getGroupValue();
              var bbox = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection(proj)).toArray();
              if (defaultCoordUnit == 'dms') {
                Ext.getCmp('minX').setValue(convertDMS(bbox[0],'',true));
                Ext.getCmp('minY').setValue(convertDMS(bbox[1],'',true));
                Ext.getCmp('maxX').setValue(convertDMS(bbox[2],'',true));
                Ext.getCmp('maxY').setValue(convertDMS(bbox[3],'',true));
              }
              else {
                Ext.getCmp('minX').setValue(Math.round(bbox[0]*1000000)/1000000);
                Ext.getCmp('minY').setValue(Math.round(bbox[1]*1000000)/1000000);
                Ext.getCmp('maxX').setValue(Math.round(bbox[2]*1000000)/1000000);
                Ext.getCmp('maxY').setValue(Math.round(bbox[3]*1000000)/1000000);
              }
            }
            ,valid : function(field) {exportBbox.units = field.items.get(0).getGroupValue()}
          }
        }
       ,{
           layout    : 'fit'
          ,height    : 30
          ,border    : false
          ,bodyStyle : 'padding-right:100px;padding-left:100px'
          ,items     : [{
             xtype   : 'button'
            ,text    : "Import active map's bounding box"
            ,handler : function() {
              var bbox = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection(exportBbox.units.replace('dms',''))).toArray();
              if (exportBbox.units.indexOf('dms') >= 0) {
                Ext.getCmp('minX').setValue(convertDMS(bbox[0],'',true));
                Ext.getCmp('minY').setValue(convertDMS(bbox[1],'',true));
                Ext.getCmp('maxX').setValue(convertDMS(bbox[2],'',true));
                Ext.getCmp('maxY').setValue(convertDMS(bbox[3],'',true));
              }
              else {
                Ext.getCmp('minX').setValue(Math.round(bbox[0]*1000000)/1000000);
                Ext.getCmp('minY').setValue(Math.round(bbox[1]*1000000)/1000000);
                Ext.getCmp('maxX').setValue(Math.round(bbox[2]*1000000)/1000000);
                Ext.getCmp('maxY').setValue(Math.round(bbox[3]*1000000)/1000000);
              }
            }
          }]
        }]}
      ]
    }
  }
  else if (aoi.typ == 'poly') {
    return {
       xtype : 'fieldset'
      ,title : 'Area of interest'
      ,items  : [
        {
           html      : 'The area you defined with the Identify button will be used as your area of interest.'
          ,bodyStyle : 'padding:0 5px 10px 5px'
          ,border    : false
        }
      ]
    };
  }
}

function showBaseLayerMetadata(l) {
  var l2m = {
     'OpenStreetMap'    : 'http://www.openstreetmap.org/'
    ,'Google Terrain'   : 'http://en.wikipedia.org/wiki/Google_Maps'
    ,'Google Satellite' : 'http://en.wikipedia.org/wiki/Google_Maps#Satellite_view'
  };

  if (Ext.getCmp('baseLayerMetadataWin')) {
    Ext.getCmp('baseLayerMetadataWin').close();
  }
  var MIF = new Ext.ux.ManagedIFramePanel({
     defaultSrc  : l2m[l]
    ,bodyBorder  : false
    ,bodyStyle   : 'background:white'
    ,listeners   : {domready : function(frame){
      var fbody = frame.getBody();
      var w = Ext.getCmp('myFrameWin');
      if (w && fbody){
        // calc current offsets for Window body border and padding
        var bHeightAdj = w.body.getHeight() - w.body.getHeight(true);
        var bWidthAdj  = w.body.getWidth()  - w.body.getWidth(true);
        // Window is rendered (has size) but invisible
        w.setSize(Math.max(w.minWidth || 0, fbody.scrollWidth  +  w.getFrameWidth() + bWidthAdj) ,
        Math.max(w.minHeight || 0, fbody.scrollHeight +  w.getFrameHeight() + bHeightAdj) );
        // then show it sized to frame document
        w.show();
      }
    }}
  });
  new Ext.Window({
     title           : l + ' metadata'
    ,width           : mapPanel.getWidth() * 0.65
    ,height          : mapPanel.getHeight() * 0.65
    ,hideMode        : 'visibility'
    ,id              : 'baseLayerMetadataWin'
    ,hidden          : true   //wait till you know the size
    ,plain           : true
    ,constrainHeader : true
    ,minimizable     : false
    ,ddScroll        : false
    ,border          : false
    ,bodyBorder      : false
    ,layout          : 'fit'
    ,plain           : true
    ,maximizable     : true
    ,buttonAlign     : 'center'
    ,items           : MIF
  }).show();
}
