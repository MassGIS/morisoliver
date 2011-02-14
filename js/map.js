var maxAllowedFeatures = 25000;
var map;
var lyrBase          = [];
var mouseControl;
var scaleRatioControl;
var scaleLineControl;
var allLyr           = [];
var wmsStyl          = [];
var lyr2wms          = [];
var lyr2proj         = [];
var wms2ico          = [];
var activeLyr        = [];
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
          if (cn[i] !== 'type' + wms2ico[wms] + 'Red') {
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
      defaultLyrs.push({wms : s[1],title : s[0]}); 
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
var okBase = /^(custom|googleSatellite|googleTerrain|openStreetMap)$/;
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
   height      : 530
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
          ,html   : 'Select a row to highlight corresponding geometries on the map as well as to view detailed record information. Viewing up to 100 features allowed.<br>&nbsp;'
        }
        ,new Ext.grid.GridPanel({
           height           : 150
          ,width            : 425
          ,store            : qryLyrStore
          ,id               : 'qryFeatureDetails'
          ,columns          : [
             {id : 'ico'  ,header : ''                              ,width : 25,renderer : ico2img                 }
            ,{id : 'title',header : 'Layer name'                                                                   }
            ,{id : 'wfs'  ,header : 'Feature(s) found?'                                                            }
            ,{id : 'busy' ,header : ''                              ,width : 25,renderer : busyIco                 }
          ]
          ,autoExpandColumn : 'title'
          ,loadMask         : true
          ,listeners        : {
            rowclick : function(grid,rowIndex,e) {
              if (qryLyrStore.getAt(rowIndex).get('wfs') == '0 feature(s)') {
                Ext.Msg.alert('Query details','This row has no features. No details will be fetched.');
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
            }
          }
        })
      ]
    }
  ]
  ,listeners   : {
    hide : function() {
      featureBbox.unselectAll();
      featureBoxControl.polygon.deactivate();
      if (Ext.getCmp('queryBox').pressed) {
        featureBoxControl.polygon.activate();
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

var featureBoxControl = new OpenLayers.Control();
OpenLayers.Util.extend(featureBoxControl,{
  draw : function() {
    this.polygon = new OpenLayers.Handler.RegularPolygon(featureBoxControl,
      {'done' : function(e) {
        runQueryStats(e.getBounds());
      }}
      ,{
         persist   : true
        ,irregular : true
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
    this.enforceOneVisible();
    // New icon part!
    wms = lyr2wms[a.layer.name];
    var scaleInfo = scaleOK(a.layer.name);
    var grayIcon  = '';
    var qtip      = undefined;
    if (loadError[a.layer.name] == 1) {
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

Ext.onReady(function() {
  Ext.QuickTips.init();

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
//      ,scales      : [
//         5000000
//        ,1000000
//        ,500000
//        ,250000
//        ,100000
//        ,63360 // (1 inch equals 1 mile)
//        ,25000 // (new USGS topo quads)
//        ,24000 // (old USGS topo quads)
//        ,15000
//        ,10000
//        ,5000
//        ,2400 // (1 inch = 200 feet)
//        ,1000
//        ,500
//        ,250
//        ,100
//      ]
      ,projection  : new OpenLayers.Projection("EPSG:26986")
      ,displayProjection : new OpenLayers.Projection("EPSG:4326")
      ,units             : 'm'
      ,maxExtent         : maxExtent26986
    }
  );

  scaleRatioControl = new OpenLayers.Control.Scale();
  scaleRatioControl.updateScale = updateScale;
  scaleLineControl  = new OpenLayers.Control.ScaleLine({geodesic : true});

  mouseControl = new OpenLayers.Control.MousePosition();
  setMapCoord(defaultCoordUnit);

  // snazzy line measure controls
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
        Ext.getCmp('measureTally').reset();
        hasMeasure = false;
      }
    }
    ,measuredynamic : function(evt) {
      if (hasMeasure) {
        Ext.getCmp('measureTally').reset();
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

  map = new OpenLayers.Map('',{
    controls : [
       new OpenLayers.Control.Navigation()
      ,new OpenLayers.Control.PanZoomBar()
      ,mouseControl
      ,lengthControl
      ,areaControl
      ,featureBoxControl
    ]
  });
  map.setOptions({maxExtent : maxExtent900913});

  var ctrl = new OpenLayers.Control.NavigationHistory({autoActivate : false});
  map.addControl(ctrl);

  map.addControl(scaleRatioControl);
  map.addControl(scaleLineControl);

  featureBboxSelect  = new OpenLayers.Layer.Vector('');

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

  map.events.register('addlayer',this,function(e) {
    if (!e.layer.isBaseLayer && !e.layer.isVector && lyr2wms[e.layer.name].indexOf(featurePrefix + ':') == 0) {
      // keep featureSelects on top
      map.setLayerIndex(featureBboxSelect,map.getNumLayers());
      map.setLayerIndex(layerRuler,map.getNumLayers());
      layerRuler.removeFeatures(layerRuler.features);
      map.setLayerIndex(lyrGeoLocate,map.getNumLayers());
    }
  });

  var olLayerStore = new GeoExt.data.LayerStore({
     map    : map
    ,layers : [
       lyrBase['custom']    // don't add google until absolutely necessary; fractionalZoom cauases problems
      ,featureBboxSelect
      ,layerRuler
      ,lyrGeoLocate
    ]
  });
  map.setCenter(maxExtent26986.getCenterLonLat(),5);
  map.setOptions({maxExtent : maxExtent26986,fractionalZoom : true});

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
        wmsStyl[attr.title]  = attr.style;
      }
    }
  });

  olLayerTree = new Ext.tree.TreePanel({
     split       : true
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
          ,forceSelection : true
          ,triggerAction  : 'all'
          ,emptyText      : 'Select / search data layers'
          ,selectOnFocus  : true
          ,mode           : 'local'
          ,valueField     : 'id'
          ,displayField   : 'title'
          ,listeners      : {
            select : function(comboBox,rec,i) {
              addLayer(lyr2wms[rec.get('title')],lyr2proj[rec.get('title')],rec.get('title'),true);
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
        olLayerPanel.addListener({
          resize : function() {
            lyrSearchCombo.setWidth(olLayerPanel.getWidth() - 5);
          }
        });
        olLayerPanel.doLayout();
        lyrSearchCombo.setWidth(olLayerPanel.getWidth() - 5);

        // set the default layers
        for (var i = 0; i < defaultLyrs.length; i++) {
          addLayer(defaultLyrs[i].wms,defaultLyrs[i].proj_only,defaultLyrs[i].title,true);
        }
      },
      click : function(node,e){
        if (!node.isLeaf()) {
          return;
        }
        addLayer(node.attributes.wmsName,node.attributes.proj_only,node.attributes.text,true);
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
                ,minimizable     : true
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
            addLayer(n.attributes.wmsName,n.attributes.proj_only,n.attributes.text,true);
          });
          messageContextMenuAvailableLyr.showAt(e.getXY());
        }
      }
    }
  });
  
  var olLegendPanel = new GeoExt.LegendPanel({
     title       : 'Active data legends'
    ,region      : 'south'
    ,height      : 150
    ,split       : true
    ,autoScroll  : true
    ,filter      : function(record) {
      return !record.get('layer').isBaseLayer && !record.get('layer').isVector;
    }
    ,labelCls    : 'legendText'
  });

  var olToolbar = new Ext.Toolbar({
    items: [
      new GeoExt.Action({
         control      : new OpenLayers.Control.ZoomBox()
        ,map          : map
        ,toggleGroup  : 'navigation'
        ,allowDepress : false
        ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Zoom in'
        ,icon         : 'img/zoom_in.png'
        ,handler      : function() {
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
        ,allowDepress : false
        ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Zoom out'
        ,icon         : 'img/zoom_out.png'
        ,handler      : function() {
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
        ,allowDepress : false
        ,iconCls      : 'buttonIcon'
        ,tooltip      : 'Pan'
        ,icon         : 'img/drag.gif'
        ,pressed      : true
        ,handler      : function() {
          Ext.getCmp('mappanel').body.setStyle('cursor','move');
        }
      })
      ,{
         iconCls     : 'buttonIcon'
        ,tooltip     : 'Zoom to initial extent'
        ,icon        : 'img/globe.png'
        ,handler     : function() {
          map.zoomToExtent(new OpenLayers.Bounds(defaultBbox[0],defaultBbox[1],defaultBbox[2],defaultBbox[3]).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()));
        }
      }
      ,new Ext.Action({
         iconCls     : 'buttonIcon'
        ,tooltip     : 'Zoom to full extent of active data'
        ,icon        : 'img/zoom_extents.png'
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
      })
      ,new GeoExt.Action({
         control  : ctrl.next
        ,disabled : true
        ,iconCls  : 'buttonIcon'
        ,tooltip  : 'Go to next extent'
        ,icon     : 'img/redo.png'
      })
      ,'-'
      ,{
         text     : 'Zoom to a scale'
        ,id       : 'zoomToAScale'
        ,iconCls  : 'buttonIcon'
        ,icon     : 'img/Search-icon.png'
        ,disabled : defaultBase !== 'custom'
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
             text        : 'Type a custom scale below and press enter.  A leading "1:" is optional.'
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
      ,'-'
      ,new GeoExt.Action({
         tooltip      : 'Identify features by drawing a box'
        ,text         : 'Identify'
        ,iconCls      : 'buttonIcon'
        ,icon         : 'img/query-region.png'
        ,toggleGroup  : 'navigation'
        ,id           : 'queryBox'
        ,allowDepress : false
        ,control      : featureBoxControl
        ,handler      : function() {
          Ext.getCmp('mappanel').body.setStyle('cursor','help');
          featureBoxControl.polygon.activate();
          // nuke any measurements
          lengthControl.deactivate();
          areaControl.deactivate();
          Ext.getCmp('measureTally').reset();
          layerRuler.removeFeatures(layerRuler.features);
        }
      })
      ,new GeoExt.Action({
         tooltip     : 'Clear identified features'
        ,iconCls     : 'buttonIcon'
        ,icon        : 'img/query-clear.png'
        ,handler     : function() {
          featureBbox.unselectAll();
          featureBoxControl.polygon.deactivate();
          if (Ext.getCmp('queryBox').pressed) {
            featureBoxControl.polygon.activate();
          }
        }
      })
      ,'-'
      ,{
         xtype     : 'textfield'
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
                            // the target zoomLevel is based on the active baseLayer foo
                            var zoomLevel = map.getNumZoomLevels();
                            for (var i = 0; i < map.layers.length; i++) {
                              if (map.layers[i].isBaseLayer && map.layers[i].visibility) {
                                if (map.layers[i].name == 'custom') {
                                  zoomLevel -= 4;
                                }
                                else if (map.layers[i].name == 'googleSatellite') {
                                  zoomLevel -= 3;
                                }
                                else if (map.layers[i].name == 'googleTerrain') {
                                  zoomLevel -= 0;
                                }
                                else if (map.layers[i].name == 'openStreetMap') {
                                  zoomLevel -= 3;
                                }
                              }
                            }
                            map.setCenter(ctr,zoomLevel);
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
                  var request = Y.io(proxyLocBing + 'http://dev.virtualearth.net/REST/v1/Locations?q=' + Ext.getCmp('searchLocation').getValue() + '&key=' + bingKey);
                }
              });
            }
          }
        }
      }
      ,{
         text    : 'Clear location'
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
      }
      ,'->'
      ,{
         text        : 'Export data'
        ,tooltip     : 'Launch the data export wizard'
        ,iconCls     : 'buttonIcon'
        ,icon        : 'img/export.png'
        ,handler : function() {
          var tstLyrStore = new Ext.data.ArrayStore({
            fields : [
               {name : 'ico'  }
              ,{name : 'title'}
            ]
          });
          for (var i in activeLyr) {
            if ((!activeLyr[i] == '') && String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0) {
              if (tstLyrStore.find('title',activeLyr[i].name) == -1) {
                tstLyrStore.add(new tstLyrStore.recordType(
                   {ico : wms2ico[lyr2wms[activeLyr[i].name]],title : activeLyr[i].name}
                  ,++tstLyrCount
                ));
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
          var downloadLyrCount = 0;
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
            ,closeAction     : 'hide'
            ,cardPanelConfig : {
              defaults : {
                 border      : false
                ,bodyStyle   : 'padding:6px'
                ,labelWidth  : 75
              }
            }
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
                              new Ext.grid.GridPanel({
                                 height           : 200
                                ,width            : 272
                                ,title            : 'Data layers of interest'
                                ,store            : tstLyrStore
                                ,hideHeaders      : true
                                ,columns          : [
                                   {id : 'ico'  ,header :'Icon'       ,width : 25,renderer : ico2img}
                                  ,{id : 'title',header : 'Layer name'                              }
                                ]
                                ,autoExpandColumn : 'title'
                                ,tbar             : [
                                  {
                                     iconCls  : 'buttonIcon'
                                    ,tooltip  : "Import active map's active data layers"
                                    ,text     : 'Import active layers'
                                    ,icon     : 'img/import.png'
                                    ,handler     : function() {
                                      for (var i in activeLyr) {
                                        if ((!activeLyr[i] == '') && String(lyr2wms[i]).indexOf(featurePrefix + ':') == 0) {
                                          if (tstLyrStore.find('title',activeLyr[i].name) == -1) {
                                            tstLyrStore.add(new tstLyrStore.recordType(
                                               {ico : wms2ico[lyr2wms[activeLyr[i].name]],title : activeLyr[i].name}
                                              ,++tstLyrCount
                                            ));
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
                                    if (tstLyrStore.find('title',node.attributes.text) == -1) {
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
                                }
                              })
                            ]
                          }
                        ]
                      }
                    ]
                  }
                  ,{
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
                                // ,value      : Math.round(map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:26986')).toArray()[0]*1000000)/1000000
                              }
                              ,{
                                 xtype      : 'textfield'
                                ,fieldLabel : 'Min Y'
                                ,id         : 'minY'
                                ,allowBlank : false
                                // ,value      : Math.round(map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:26986')).toArray()[1]*1000000)/1000000
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
                                // ,value      : Math.round(map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:26986')).toArray()[2]*1000000)/1000000
                              }
                              ,{
                                 xtype      : 'textfield'
                                ,fieldLabel : 'Max Y'
                                ,id         : 'maxY'
                                ,allowBlank : false
                                // ,value      : Math.round(map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:26986')).toArray()[3]*1000000)/1000000
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
                          render : function() {
                            var proj = 'EPSG:26986';
                            if (defaultCoordUnit == 'dd' || defaultCoordUnit == 'dms') {
                              proj = 'EPSG:4326';
                            }
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
                            var bbox = map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue().replace('dms',''))).toArray();
                            if (Ext.getCmp('radioUnits').items.get(0).getGroupValue().indexOf('dms') >= 0) {
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
                ]
              })
              ,new Ext.ux.Wiz.Card({
                 title     : 'Query results'
                ,listeners : {
                  show : function() {
                    bboxLyrStore.removeAll();
                    var tstBbox;
                    if (Ext.getCmp('radioUnits').items.get(0).getGroupValue().indexOf('dms') >= 0) {
                      tstBbox =  new OpenLayers.Bounds(
                         dms2dd(Ext.getCmp('minX').getValue())
                        ,dms2dd(Ext.getCmp('minY').getValue())
                        ,dms2dd(Ext.getCmp('maxX').getValue())
                        ,dms2dd(Ext.getCmp('maxY').getValue())
                      ).transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue().replace('dms','')),new OpenLayers.Projection("EPSG:4326"));
                    }
                    else {
                      tstBbox =  new OpenLayers.Bounds(
                         Ext.getCmp('minX').getValue()
                        ,Ext.getCmp('minY').getValue()
                        ,Ext.getCmp('maxX').getValue()
                        ,Ext.getCmp('maxY').getValue()
                      ).transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue()),new OpenLayers.Projection("EPSG:4326"));
                    }
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
                      if (tstBbox.intersectsBounds(getCapsBbox[lyr2wms[title]])) {
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
                          if (xmlDoc.getElementsByTagName('wfs:FeatureCollection')[0]) {
                            var hits = xmlDoc.getElementsByTagName('wfs:FeatureCollection')[0].getAttribute('numberOfFeatures');
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
                        // always pull data back in terms of 26986
                        var bbox26986;
                        if (Ext.getCmp('radioUnits').items.get(0).getGroupValue().indexOf('dms') >= 0) {
                          bbox26986 = new OpenLayers.Bounds(
                             dms2dd(Ext.getCmp('minX').getValue())
                            ,dms2dd(Ext.getCmp('minY').getValue())
                            ,dms2dd(Ext.getCmp('maxX').getValue())
                            ,dms2dd(Ext.getCmp('maxY').getValue())
                          ).transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue().replace('dms','')),new OpenLayers.Projection("EPSG:26986")).toArray();
                        }
                        else {
                          bbox26986 = new OpenLayers.Bounds(
                             Ext.getCmp('minX').getValue()
                            ,Ext.getCmp('minY').getValue()
                            ,Ext.getCmp('maxX').getValue()
                            ,Ext.getCmp('maxY').getValue()
                          ).transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue()),new OpenLayers.Projection("EPSG:26986")).toArray();
                        }
                        var cfg = {
                           method  : "POST"
                          ,headers : {'Content-Type':'application/xml; charset=UTF-8'}
                          ,data    : '<wfs:GetFeature resultType="hits" xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><wfs:Query typeName="' + lyr2wms[title] + '" srsName="EPSG:26986" xmlns:' + featurePrefix + '="' + namespaceUrl + '"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:Intersects><ogc:PropertyName>SHAPE</ogc:PropertyName><gml:Envelope xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:26986"><gml:lowerCorner>' + bbox26986[0] + ' ' + bbox26986[1] + '</gml:lowerCorner><gml:upperCorner>' + bbox26986[2] + ' ' + bbox26986[3] + '</gml:upperCorner></gml:Envelope></ogc:Intersects></ogc:Filter></wfs:Query></wfs:GetFeature>'
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
                  ,new Ext.grid.GridPanel({
                     height           : 395
                    ,title            : 'Query results'
                    ,store            : bboxLyrStore
                    ,disableSelection : true
                    ,columns          : [
                       {id : 'ico'   ,dataIndex : 'ico'   ,header : ''                              ,width : 25,renderer : ico2img                 }
                      ,{id : 'title' ,dataIndex : 'title' ,header : 'Layer name'                                                                   }
                      ,{id : 'wfs'   ,dataIndex : 'wfs'   ,header : 'Feature(s) found?'                                                            }
                      ,{id : 'export',dataIndex : 'export',header : 'OK to export?'                 ,align : 'center',renderer: okIco              }
                      ,{id : 'busy'  ,dataIndex : 'busy'  ,header : ''                              ,width : 25,renderer : busyIco                 }
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
                           {boxLabel : 'MA State Plane (m) - EPSG:26986'        ,name : 'epsg',inputValue : 'EPSG:26986',checked : true                }
                          ,{boxLabel : 'MA State Plane (ft) - EPSG:2249'        ,name : 'epsg',inputValue : 'EPSG:2249'                                }
                          ,{boxLabel : 'Lat / Long (WGS84) - EPSG:4326'         ,name : 'epsg',inputValue : 'EPSG:4326'                                }
                          ,{boxLabel : 'UTM Zone 18 Western MA (m) - EPSG:26718',name : 'epsg',inputValue : 'EPSG:26718'                               }
                          ,{boxLabel : 'UTM Zone 19 Eastern MA (m) - EPSG:26719',name : 'epsg',inputValue : 'EPSG:26719'                               }
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
                                   {boxLabel : 'ESRI shape (.shp)'             ,name : 'vectorFormat',inputValue : 'shp',checked : true}
                                  ,{boxLabel : 'Keyhole Markup Language (.kml)',name : 'vectorFormat',inputValue : 'kml'               }
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
                ]
              })
              ,new Ext.ux.Wiz.Card({
                 title     : 'Download data'
                ,items     : [
                  {
                     html      : 'Links have been created that will allow you to download the data layers of interest as well as related metadata.  Clicking on each link will attempt to open a new browser window.  Depending on your browser settings, you may be prompted to save the file to disk, or the link may be directly visible within the browser.'
                    ,bodyStyle : 'padding:10px'
                    ,border    : false
                  }
                  ,{
                     xtype : 'fieldset'
                    ,border : false
                    ,items  : [
                      {
                         layout    : 'fit'
                        ,height    : 30
                        ,border    : false
                        ,bodyStyle : 'padding-right:100px;padding-left:100px'
                        ,items     : [{
                           xtype   : 'button'
                          ,text    : 'Download everything as one ZIP file'
                          ,handler : function() {
                            if (!mkzipCGI) {
                              Ext.Msg.alert('ZIP unavailable','Sorry, this functionality is currently unavailable.');
                              return;
                            }
                            var downloadWin = new Ext.Window({
                               title       : 'ZIP filename'
                              ,width       : 250
                              ,height      : 120
                              ,plain       : true
                              ,modal       : true
                              ,layout      : 'fit'
                              ,items       : [new Ext.FormPanel({
                                 bodyStyle  : 'padding:5px 5px 0'
                                ,border      : false
                                ,defaultType : 'textfield'
                                ,labelAlign  : 'top'
                                ,items     : [{
                                   name       : 'zipName'
                                  ,id         : 'zipName'
                                  ,allowBlank : false
                                  ,fieldLabel : 'Please enter a name for the ZIP file'
                                }]
                                ,buttons : [
                                  {
                                     text : 'Download File'
                                    ,handler : function() {
                                      var dataURL = [];
                                      var lastTitle;
                                      downloadLyrStore.each(function(rec) {
                                        var title = rec.get('title').replace('&nbsp;&nbsp;&nbsp;&nbsp;','');
                                        if (!dataURL[title] & title.indexOf('http://') < 0) {
                                          dataURL[title] = {
                                             base     : safeXML(rec.get('url'))
                                            ,metadata : []
                                          };
                                          lastTitle = title;
                                        }
                                        else {
                                          dataURL[lastTitle].metadata.push(safeXML(rec.get('url')));
                                        }
                                      });

                                      var dataXML = '';
                                      for (var i in dataURL) {
                                        if (dataURL[i].base) {
                                          dataXML += '<layer name="' + safeXML(i) + '" baseURL="' + dataURL[i].base + '"><metadata>' + dataURL[i].metadata.join('</metadata><metadata>') + '</metadata>' + '</layer>';
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
                                      downloadWin.close();
                                    }
                                  }
                                  ,{
                                     text : 'Cancel'
                                    ,handler : function() {
                                      downloadWin.close();
                                    }
                                  }
                                ]
                              })]
                            }).show();
                          }
                        }]
                      }
                    ]
                  }
                  ,{xtype : 'fieldset',title : 'Advanced - Download individual layers',collapsible : true,collapsed : true,items : [new Ext.grid.GridPanel({
                     height           : 310
                    ,store            : downloadLyrStore
                    ,disableSelection : true
                    ,columns          : [
                       {id : 'ico'  ,header : ''                              ,width : 25,renderer : ico2img               }
                      ,{id : 'title',header : 'Layer name'                                                                 }
                      ,{id : 'url'  ,header : 'Download link'                 ,width : 80,renderer : url2lnk,align:'center'}
                    ]
                    ,autoExpandColumn : 'title'
                    ,loadMask         : true
                  })]}
                ]
                ,listeners : {
                  show : function() {
                    downloadLyrStore.removeAll();
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
                  }
                }
              })
            ]
          });
          wizGetData.show();
        }
      }
      ,{
         text : 'Help'
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
                  ,minimizable     : true
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
                  ,minimizable     : true
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
               text     : 'About ' + siteTitle + ' (v. 0.35)'  // version
              ,tooltip  : 'About ' + siteTitle + ' (v. 0.35)'  // version
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
    ]
  });

  olMapPanel = new GeoExt.MapPanel({
     region : 'center'
    ,id     : 'mappanel'
    ,xtype  : 'gx_mappanel'
    ,map    : map
    ,layers : olLayerStore
    ,zoom   : 1
    ,split  : true
    ,tbar   : olToolbar
    ,bbar   : [
      new Ext.Toolbar.Button({
         text         : '&nbsp;Measure'
        ,iconCls      : 'buttonIcon'
        ,icon         : 'img/measure20.gif'
        ,toggleGroup  : 'navigation'
        ,tooltip      : 'Measure by length or area (click to add vertices and double-click to finish)'
        ,allowDepress : false
        ,menu : [
          {
             text    : 'By length'
            ,iconCls : 'buttonIcon'
            ,icon    : 'img/layer-shape-line.png'
            ,handler : function() {
              areaControl.deactivate();
              lengthControl.activate();
              layerRuler.removeFeatures(layerRuler.features);
              Ext.getCmp('measureTally').emptyText = '0 ' + measureUnits;
              Ext.getCmp('measureTally').reset();
              measureType = 'length';
            }
          }
          ,{
             text    : 'By area'
            ,iconCls : 'buttonIcon'
            ,icon    : 'img/layer-shape-polygon.png'
            ,handler : function() {
              lengthControl.deactivate();
              areaControl.activate();
              layerRuler.removeFeatures(layerRuler.features);
              Ext.getCmp('measureTally').emptyText = '0 ' + measureUnits + '^2';
              Ext.getCmp('measureTally').reset();
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
                  Ext.getCmp('measureTally').reset();
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
                  Ext.getCmp('measureTally').reset();
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
                  Ext.getCmp('measureTally').reset();
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
                  Ext.getCmp('measureTally').reset();
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
                  Ext.getCmp('measureTally').reset();
                  layerRuler.removeFeatures(layerRuler.features);
                  measureUnits = 'ft';
                  lengthControl.cancel();
                  areaControl.cancel();
                }
              }
            ]
          }
        ]
        ,listeners : {
          toggle : function(button,pressed) {
            if (!pressed) {
              // commenting out next 2 lines since we want measurements to hang around even w/ other map actions
              // areaControl.deactivate();
              // lengthControl.deactivate();
            }
            else {
              Ext.getCmp('mappanel').body.applyStyles('cursor:crosshair');
            }
          }
        }
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
          Ext.getCmp('measureTally').reset();
          layerRuler.removeFeatures(layerRuler.features);
        }
      }
      ,'->'
      ,new Ext.Action({
         text     : 'Permalink'
        ,tooltip  : 'Make permalink'
        ,iconCls : 'buttonIcon'
        ,icon    : 'img/favorite-icon.png'
        ,handler  : function() {
          Ext.Msg.alert('Permalink','Right-click this <a target=_blank href="' + mkPermalink() + '">permalink</a> and save it as a bookmark to launch the ' + siteTitle + ' application with the current map settings enabled.')
        }
      })
      ,'-'
      ,{
         text    : 'Scale settings'
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
      }
      ,{
         text     : 'Map units'
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
      }
      ,{
         text     : 'Basemaps'
        ,iconCls  : 'buttonIcon'
        ,icon     : 'img/layers.png'
        ,menu     : [
          {
             text     : 'Custom'
            ,group    : 'basemap'
            ,checked  : defaultBase == 'custom'
            ,handler  : function () {
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
             text    : 'Google Terrain'
            ,group   : 'basemap'
            ,checked : defaultBase == 'googleTerrain'
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
             text    : 'Google Satellite'
            ,group   : 'basemap'
            ,checked : defaultBase == 'googleSatellite'
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
             text    : 'OpenStreetMap'
            ,group   : 'basemap'
            ,checked : defaultBase == 'openStreetMap'
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
            ,value     : lyrBase['googleTerrain'].opacity * 100
            ,listeners : {
              change : function(slider,newVal) {
                if (lyrBase['googleTerrain'].map) {
                  lyrBase['googleTerrain'].setOpacity(newVal/100);
                }
                if (lyrBase['googleSatellite'].map) {
                  lyrBase['googleSatellite'].setOpacity(newVal/100);
                }
                if (lyrBase['openStreetMap'].map) {
                  lyrBase['openStreetMap'].setOpacity(newVal/100);
                }
              }
            }
          })
        ]
      }
    ]
    ,border : false
  });

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
    }]
  });

  olActiveLayers = new Ext.tree.TreePanel({
     title        : 'Active data layers'
    ,region       : 'center'
    ,split        : true
    ,autoScroll   : true
    ,tbar        : [
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

    ]
    ,root         : new GeoExt.tree.LayerContainer({
       layerStore : olMapPanel.layers
      ,leaf       : false
      ,expanded   : true
      ,loader     : new GeoExt.tree.LayerLoader({
        filter : function(rec) {
          return !rec.get('layer').isBaseLayer && !rec.get('layer').isVector;
        }
      })
    })
    ,enableDD     : true
    ,rootVisible  : false
    ,listeners    : {
      contextmenu : function(n,e) {
        n.select();
        messageContextMenuActiveLyr.findById('remove').setHandler(function() {
          map.removeLayer(n.layer);
          activeLyr[n.text] = '';
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
              ,minimizable     : true
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

  // set the base layer & initial zoom if not 'custom'
  if (defaultBase !== 'custom') {
    map.setOptions({fractionalZoom : false});
    addBaseLayer(defaultBase);
    map.setBaseLayer(lyrBase[defaultBase]);
    Ext.getCmp('customScale').setDisabled(true);
    Ext.getCmp('customScaleHeader').setText('Custom scale disabled for current map projection.');
    Ext.getCmp('zoomToAScale').setDisabled(true);
    map.setOptions({maxExtent : maxExtent900913});
    Ext.getCmp('opacitySliderBaseLayer').setValue(100);
  }
  if (defaultCenter && defaultZoom) {
    map.setCenter(new OpenLayers.LonLat(defaultCenter[0],defaultCenter[1]),defaultZoom);
  }
  else {
    map.zoomToExtent(new OpenLayers.Bounds(defaultBbox[0],defaultBbox[1],defaultBbox[2],defaultBbox[3]).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()));
  }
  Ext.getCmp('mappanel').body.setStyle('cursor','move');

  map.events.register('zoomend',this,function() {
    syncIconScale();
  });

  ctrl.activate();
});

function addLayer(wms,proj,title,viz) {
  if (proj && map.getProjection().toLowerCase() !== proj.toLowerCase()) {
    Ext.Msg.alert('Error adding layer',"The '" + title + "' layer is not supported in the current map projection.");
    return;
  }
  if (!activeLyr[title]) {
    activeLyr[title] = new OpenLayers.Layer.WMS(
       title
      ,wmsUrl + "?"
      ,{
         layers      : wms
        ,transparent : true
        ,styles      : wmsStyl[title]
        ,foo         : title
      }
      ,{
         projection         : map.getProjection()
        ,singleTile         : true
        ,isBaseLayer        : false
        ,opacity            : 1
        ,addToLayerSwitcher : false
        ,visibility         : viz
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
    if (!map.layers[i].isBaseLayer && !map.layers[i].isVector && !(map.layers[i].name == '') && !(map.layers[i].name == undefined)) {
      lyr.push({
         name : map.layers[i].name
        ,viz  : map.layers[i].visibility
      });
    }
  }
  for (var i = 0; i < lyr.length; i++) {
    map.removeLayer(activeLyr[lyr[i].name]);
    activeLyr[lyr[i].name] = '';
  }
  for (var i = 0; i < lyr.length; i++) {
    addLayer(lyr2wms[lyr[i].name],lyr2proj[lyr[i].name],lyr[i].name,lyr[i].viz);
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
          ,minimizable     : true
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
      var allEle = xmlDoc.getElementsByTagName('xsd:element');
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
        ,listeners : {
          add : function(store,rec,idx) {
            featureBboxGridPanel.getSelectionModel().selectRow(idx,true,false);
          }
        }
      });
      if (!featureBboxGridPanel) {
        // this is the 1st time a query has been requested
        featureBboxGridPanel = new Ext.grid.GridPanel({
           store  : featureBboxStore
          ,height : 215
          ,width  : 425
          ,id     : 'featureBboxGridPanel'
          ,sm     : new GeoExt.grid.FeatureSelectionModel({
            layer : featureBboxSelect
          })
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
                  ,minimizable     : true
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
  var bbox = new Array(
     Ext.getCmp('minX').getValue()
    ,Ext.getCmp('minY').getValue()
    ,Ext.getCmp('maxX').getValue()
    ,Ext.getCmp('maxY').getValue()
  );
  if (Ext.getCmp('radioUnits').items.get(0).getGroupValue().indexOf('dms') >= 0) {
    bbox = new Array(
       dms2dd(Ext.getCmp('minX').getValue())
      ,dms2dd(Ext.getCmp('minY').getValue())
      ,dms2dd(Ext.getCmp('maxX').getValue())
      ,dms2dd(Ext.getCmp('maxY').getValue())
    );
  }
  var bbox26986;
  if (Ext.getCmp('radioUnits').items.get(0).getGroupValue().indexOf('dms') >= 0) {
    bbox26986 =  new OpenLayers.Bounds(
       dms2dd(Ext.getCmp('minX').getValue())
      ,dms2dd(Ext.getCmp('minY').getValue())
      ,dms2dd(Ext.getCmp('maxX').getValue())
      ,dms2dd(Ext.getCmp('maxY').getValue())
    ).transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue().replace('dms','')),new OpenLayers.Projection("EPSG:26986")).toArray();
  }
  else {
    bbox26986 =  new OpenLayers.Bounds(
       Ext.getCmp('minX').getValue()
      ,Ext.getCmp('minY').getValue()
      ,Ext.getCmp('maxX').getValue()
      ,Ext.getCmp('maxY').getValue()
    ).transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue()),new OpenLayers.Projection("EPSG:26986")).toArray();
  }

  if (ico == 'raster' || ico == 'grid') {
    if (Ext.getCmp('wizRasterFmt').items.get(0).getGroupValue() == 'geoTiff') {
      return Array(
         wmsUrl
        ,'?REQUEST=GetMap&VERSION=1.1.0&SERVICE=WMS&EXCEPTION=application/vnd.ogc.se_inimage&layers=' + lyr2wms[title]
        ,'&FORMAT=image/geotiff'
        ,'&bbox=' + bbox.join(',')
        ,'&srs=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
        ,'&width=' + Math.round((bbox26986[2] - bbox26986[0]) / lyrMetadata[title].imgUnitsPerPixel)
        ,'&height=' + Math.round((bbox26986[3] - bbox26986[1]) / lyrMetadata[title].imgUnitsPerPixel)
      ).join('');
    }
    else {
      // not supporting grids, but leave it here for kicks
      return Array(
         wcsUrl
        ,'?REQUEST=GetCoverage&VERSION=1.0.0&SERVICE=WCS&coverage=' + lyr2wms[title]
        ,'&FORMAT=arcgrid'
        ,'&bbox=' + bbox.join(',')
        ,'&crs=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
        ,'&width=' + (bbox26986[2] - bbox26986[0]) / lyrMetadata[title].imgUnitsPerPixel
        ,'&height=' + (bbox26986[3] - bbox26986[1]) / lyrMetadata[title].imgUnitsPerPixel
      ).join('');
    }
  }
  else {
    if (Ext.getCmp('wizVectorFmt').items.get(0).getGroupValue() == 'shp') {
      return Array(
         wfsUrl
        ,'?request=getfeature&version=1.0.0&outputformat=SHAPE-ZIP&service=wfs&typename=' + lyr2wms[title]
        ,'&filter=<ogc:Filter xmlns:ogc="http://ogc.org" xmlns:gml="http://www.opengis.net/gml">'
          ,'<ogc:Intersects>'
            ,'<ogc:PropertyName>SHAPE</ogc:PropertyName>'
            ,'<gml:Box srsName="EPSG:26986">'
              ,'<gml:coordinates>' + Array(
                 bbox26986[0] + ',' + bbox26986[1] 
                ,bbox26986[2] + ',' + bbox26986[3]
              ).join(' ')+'</gml:coordinates>'
            ,'</gml:Box>'
          ,'</ogc:Intersects>'
        ,'</ogc:Filter>'
        ,'&SRSNAME=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
      ).join('');
    }
    else {
      return Array(
         kmlUrl
        ,'?layers=' + lyr2wms[title]
        ,'&bbox=' + bbox.join(',')
        ,'&srs=' + Ext.getCmp('radioEpsg').items.get(0).getGroupValue()
      ).join('');
    }
  }
}

function scaleOK(name) {
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
  var bounds = new OpenLayers.Bounds(
     Ext.getCmp('minX').getValue()
    ,Ext.getCmp('minY').getValue()
    ,Ext.getCmp('maxX').getValue()
    ,Ext.getCmp('maxY').getValue()
  );
  if (Ext.getCmp('radioUnits').items.get(0).getGroupValue().indexOf('dms') >= 0) {
    bounds = new OpenLayers.Bounds(
       dms2dd(Ext.getCmp('minX').getValue())
      ,dms2dd(Ext.getCmp('minY').getValue())
      ,dms2dd(Ext.getCmp('maxX').getValue())
      ,dms2dd(Ext.getCmp('maxY').getValue())
    );
  }
  bounds.transform(new OpenLayers.Projection(Ext.getCmp('radioUnits').items.get(0).getGroupValue().replace('dms','')),new OpenLayers.Projection("EPSG:26986"));
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
  qryWin.show();
  // populate store w/ the basics
  var queryLyrCount = 0;
  qryLyrStore.removeAll();
  for (var i = map.layers.length - 1; i >= 0; i--) {
    var title = map.layers[i].name;
    if (String(lyr2wms[title]).indexOf(featurePrefix + ':') == 0 && activeLyr[title].visibility) {
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
        if (xmlDoc.getElementsByTagName('wfs:FeatureCollection')[0]) {
          qryLyrStore.getAt(args[0]).set('wfs',xmlDoc.getElementsByTagName('wfs:FeatureCollection')[0].getAttribute('numberOfFeatures') + ' feature(s)');
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
      Y.on('io:success',handleSuccess,this,[i,ico]);
      var title = rec.get('title');
      var bbox = bounds.toArray();
      var cfg = {
         method  : "POST"
        ,headers : {'Content-Type':'application/xml; charset=UTF-8'}
        ,data    : '<wfs:GetFeature resultType="hits" xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><wfs:Query typeName="' + lyr2wms[title] + '" srsName="' + map.getProjectionObject() + '" xmlns:' + featurePrefix + '="' + namespaceUrl + '"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:Intersects><ogc:PropertyName>SHAPE</ogc:PropertyName><gml:Envelope xmlns:gml="http://www.opengis.net/gml" srsName="' + map.getProjectionObject() + '"><gml:lowerCorner>' + bbox[0] + ' ' + bbox[1] + '</gml:lowerCorner><gml:upperCorner>' + bbox[2] + ' ' + bbox[3] + '</gml:upperCorner></gml:Envelope></ogc:Intersects></ogc:Filter></wfs:Query></wfs:GetFeature>'
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
      lyrs.push(map.layers[i].name + '~' + lyr2wms[map.layers[i].name]);
    }
  }

  return siteUrl + '?lyrs=' + lyrs.join('|') + '&bbox=' + map.getExtent().transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:4326')).toArray() + '&coordUnit=' + currentCoordUnit + '&measureUnit=' + measureUnits + '&base=' + base + '&center=' + map.getCenter().lon + ',' + map.getCenter().lat + '&zoom=' + map.getZoom();
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
