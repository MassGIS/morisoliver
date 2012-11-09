/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

Ext.namespace("GeoExt.ux");

/*
 * @requires GeoExt.ux/FeatureEditorGrid.js
 * @requires gxp/grid/FeatureGrid.js
 */

/** api: (define)
 *  module = GeoExt.ux
 *  class = WFSTFeatureEditingManager
 */

/** api: constructor
 *  .. class:: WFSTFeatureEditingManager
 */
GeoExt.ux.WFSTFeatureEditingManager = Ext.extend(Ext.util.Observable, {

/* CONSTANT */

    /** private: property[CUSTOM_EVENTS]
     *  ``Array(String)`` Array of custom events used by this widget
     */
    CUSTOM_EVENTS: [
        "commitstart",
        "commitsuccess",
        "commitfail"
    ],

    /** private: property[DEFAULT_CAPABILITIES_PARAMS]
     *  ``Object`` Hash of default parameters used for WFS GetCapabilities
     *             requests.
     */
    DEFAULT_CAPABILITIES_PARAMS: {
        'SERVICE': "WFS",
        'REQUEST': "GetCapabilities",
        'VERSION': "1.0.0"
    },

    /** private: property[DEFAULT_DESCRIBE_FEATURETYPE_PARAMS]
     *  ``Object`` Hash of default parameters used for WFS DescribeFeatureType
     *             requests.
     */
    DEFAULT_DESCRIBE_FEATURETYPE_PARAMS: {
        'SERVICE': "WFS",
        'REQUEST': "DescribeFeatureType",
        'VERSION': "1.0.0"
    },

    /** private: property[DEFAULT_PROTOCOL_OPTIONS]
     *  ``Object`` Hash of options to use when creating a new
     *             :class:`GeoExt.data.WFSCapabilitiesStore` object as the 
     *             "protocolOptions" property default values.
     */

    DEFAULT_PROTOCOL_OPTIONS: {
     //   featureNS: "http://localhost"
        url: wfsUrl,
        featureNS: "http://massgis.state.ma.us/featuretype",
        featurePrefix: "massgis",
        geometryName: "SHAPE",
        srsName: "EPSG:26986"
    },

/*
    DEFAULT_PROTOCOL_OPTIONS: {
        url: wfsUrl,
        featureNS: "http://www.mapsonline.net/peopleforms",
        featurePrefix: "peopleforms",
        geometryName: "line_geom",
        srsName: "EPSG:26986"
    },
*/

    /** private: method[DEFAULT_LAYER_OPTIONS]
     *  :return: ``Object`` The default layer options
     *
     *  If this.layerOptions was not defined by the user, this method is used
     *      as a default value when not using filter mode
     *      (this.useFilter eq false).
     *      Used as 'layerOptions' property value when creating new 
     *      :class:`GeoExt.data.WFSCapabilitiesStore` objects.
     */
    DEFAULT_LAYER_OPTIONS: {
        projection: new OpenLayers.Projection("EPSG:26986"),
        visibility: false,
        displayInLayerSwitcher: false
    },

    DEFAULT_STRATEGIES: 
        function(cfg) {
            var config = cfg || {};
            return [
                new OpenLayers.Strategy.BBOX(config),
                new OpenLayers.Strategy.Save(config)
            ];
        },

    DEFAULT_STRATEGIES_USE_FILTER:
        function(cfg) {
            var config = cfg || {};
            return [
                new OpenLayers.Strategy.Fixed(config),
                new OpenLayers.Strategy.Save(config)
            ];
        },

    /** private: method[DEFAULT_LAYER_OPTIONS_USE_FILTER]
     *  :return: ``Object`` The default layer options when using filter mode
     *
     *  If this.layerOptions was not defined by the user, this method is used
     *      as a default value when using filter mode (this.useFilter eq true).
     *      Used as 'layerOptions' property value when creating new 
     *      :class:`GeoExt.data.WFSCapabilitiesStore` objects.
     */
    DEFAULT_LAYER_OPTIONS_USE_FILTER: {
        projection: new OpenLayers.Projection("EPSG:26986"),
        visibility: false,
        displayInLayerSwitcher: false
    },

    /** private: property[DEFAULT_ACTION_GROUP]
     *  ``String`` Default group value to use when creating
     *             :class:`GeoExt.Action` objects.
     */
    //DEFAULT_ACTION_GROUP: "wfstFeatureEditing",
    DEFAULT_ACTION_GROUP: null,


/* i18n  */

    /** api: config[drawMenuButtonText] ``String`` i18n */
    drawMenuButtonText: "",

    /** api: config[drawMenuButtonTooltipText] ``String`` i18n */
    drawMenuButtonTooltipText: "Add Tool: Select a layer from the list then " +
        "digitalize a new feature by clicking on the map.",

    /** api: config[editMenuButtonText] ``String`` i18n */
    editMenuButtonText: "",

    /** api: config[editMenuButtonTooltipText] ``String`` i18n */
    editMenuButtonTooltipText: "Edit Tool: Select a layer from the list then " +
        "click on a feature on the map to edit it.",

    /** api: config[featureGridContainerTitleText] ``String`` i18n */
    featureGridContainerTitleText: "Features",

    /** api: config[featureEditorGridContainerTitleText] ``String`` i18n */
    featureEditorGridContainerTitleText: "Editing feature",

    /** api: config[returnToSelectionText] ``String`` i18n */
    returnToSelectionText: "Close Feature Editor",

    /** api: config[commitSuccessText] ``String`` i18n */
    commitSuccessText: "Changes successfully saved",

    /** api: config[commitFailText] ``String`` i18n */
    commitFailText: "An error occured.  The changes were not saved",

/* API */

    /** api: property[toolbar]
     *  :class:`Ext.Toolbar` The toolbar where the two main
     *                          :class:`Ext.Button` objects (draw and edit) are
     *                          added.  Mandatory.
     */
    toolbar: null,

    /** api: config[url]
     * ``String`` The url to the WFS service.  Mandatory.
     */
    url: null,

    /** api: config[map]
     * :class:`OpenLayers.Map` A reference to the map object.  Mandatory.
     */
    map: null,

    /** api: config[mainPanelContainer]
     * :class:`Ext.Panel` The main panel created by this widget is added to the
     *                    mainPanelContainer.  Mandatory.
     */
    mainPanelContainer: null,

    /** api: config[capabilitiesParams]
     *  ``Object`` Hash of parameters for WFS GetCapabilities requests in
     *             addition or replacement to the ones in
     *             this.DEFAULT_CAPABILITIES_PARAMS.
     */
    capabilitiesParams: null,

    /** api: config[describeFeatureTypeParams]
     *  ``Object`` Hash of parameters for WFS DescribeFeatureType requests in
     *             addition or replacement to the ones in
     *             this.DEFAULT_DESCRIBE_FEATURETYPE_PARAMS.
     */
    describeFeatureTypeParams: null,

    /** api: config[protocolOptions]
     *  ``Object`` Hash of options to use when creating a new
     *             :class:`GeoExt.data.WFSCapabilitiesStore` object as the 
     *             "protocolOptions" property values in addition or replacement
     *             to the ones in this.DEFAULT_PROTOCOL_OPTIONS.
     */
    protocolOptions: null,

    /** api: config[layerOptions]
     *  :return: ``Object`` The default layer options when using filter mode
     *
     *  You can set this property as a method returning layer option parameters
     *      when creating new :class:`GeoExt.data.WFSCapabilitiesStore` objects.
     *      If not set, one of these is used by default : 
     *      - this.DEFAULT_LAYER_OPTIONS_USE_FILTER
     *      - this.DEFAULT_LAYER_OPTIONS 
     */
    layerOptions: null,

    /** api: config[geomProperty]
     * ``String`` The name of the geometry property.  Used to default to "the_geom"
     *  following massgis standard, defaults to SHAPE
     */
    geomProperty: "SHAPE",

    /** api: config[actionGroup]
     * ``String`` "group" property value when creating new
     *            :class:`GeoExt.Action` objects. Defaults to
     *            this.DEFAULT_ACTION_GROUP.
     */
    actionGroup: null,

    /** api: config[useFilter]
     * ``Boolean`` Whether the "edit" tools should use a filter to get the
     *             vector features or not (all visible).  Defaults to true.
     */
    useFilter: true,

    /** api: config[ignoredAttributes]
     *  ``Object`` Hash of attributes we don't want the grids to display.
     */
    ignoredAttributes: {name:["SHAPE","the_geom", "id", "gid", "fid","line_geom"]},

/* PRIVATE*/

    /** private: property[mainPanel]
     *  :class:`Ext.Panel` The main panel of the widget.
     */
    mainPanel: null,

    /** private: property[featureGridContainer]
     *  :class:`Ext.TabPanel` The panel used as a container for the
     *                        :class:`gxp.grid.FeatureGrid`
     */
    featureGridContainer: null,

    /** private: property[featureEditorGridContainer]
     *  :class:`Ext.Panel` The panel used as a container for the
     *                     :class:`GeoExt.ux.FeatureEditorGrid`
     */
    featureEditorGridContainer: null,

    /** private: property[queries]
     *  ``Integer`` A query response counter.
     */
    queries: null,

    /** private: property[layers]
     *  ``Array`` of :class:`OpenLayers.Layer.Vector` object that were created
     *            by the :class:`GeoExt.data.WFSCapabilitiesStore`.  Each one
     *            is automatically added to the map.
     */
    layers: null,


    /** api: property[toolbar]
     *  :class:`Ext.Toolbar` The toolbar where the two main
     *                          :class:`Ext.Button` objects (draw and edit) are
     *                          added.  Mandatory.
     */

    /** private: property[drawMenuButton]
     *  :class:`Ext.Button` Button containing a :class:`Ext.menu.Menu` of
     *                      layer names.  When one is selected, it activates its
     *                      :class:`OpenLayers.Control.DrawFeature`, thus
     *                      enabling the addition of a new feature.
     */
    drawMenuButton: null,

    /** private: property[editMenuButton]
     *  :class:`Ext.Button` Button containing a :class:`Ext.menu.Menu` of
     *                      layer names.  When one is selected, it activates its
     *                      :class:`OpenLayers.Control.SelectFeature`, thus
     *                      enabling the selection of an existing feature for
     *                      edition.  When this.useFilter is set to true, it
     *                      activates the 
     *                      :class:`OpenLayers.Control.UserFilter` first.
     */
    editMenuButton: null,

    /** private: method[constructor]
     */
    constructor: function(config) {
        Ext.apply(this, config);
        arguments.callee.superclass.constructor.call(this, config);
        this.queries = 0;
        this.layers = [];
        this.layerOptions = this.layerOptions || ((this.useFilter)
             ? this.DEFAULT_LAYER_OPTIONS_USE_FILTER
             : this.DEFAULT_LAYER_OPTIONS);
        this.addEvents(this.CUSTOM_EVENTS);
        this.initMainTools();
        this.url && this.loadWFSFromConfig();
      //  this.url && this.createToolsFromURL(this.url);
    },

    /** private: method[initMainTools]
     *  Called by the constructor.  Creates all static components that are not
     *      directly related to the WFS service (buttons, menus, statusbar,
     *      containers, etc.)  Also add the main panel to the main panel
     *      container.
     */
    initMainTools: function() {
        // === Draw and Edit toolbar buttons and Menus ===
        this.drawMenuButton = new Ext.Button({
            "iconCls": "geoextux-wfstfeatureediting-button-draw",
            "text": this.drawMenuButtonText,
            "menu": new Ext.menu.Menu(),
            "tooltip": this.drawMenuButtonTooltipText,
            //"toggleGroup":this.actionGroup || this.DEFAULT_ACTION_GROUP
            //"group" : this.actionGroup || this.DEFAULT_ACTION_GROUP
        });
        // I'm dumbfounded, but the following listener (coupled with the definition of dummyMenuItem below
        // fixes one of MassGIS's persistent issues.
        this.drawMenuButton.addListener('click',function() {
            Ext.each(editManager.drawMenuButton.menu.items.items, function(item, idx) {
                item.baseAction.control.deactivate();
            });
            Ext.each(editManager.editMenuButton.menu.items.items, function(item, idx) {
                item.baseAction.control.deactivate();
            });
            dummyMenuItem.setChecked(true);
        });
    
        this.editMenuButton = new Ext.Button({
            "iconCls": this.useFilter
                ? "geoextux-wfstfeatureediting-button-filter"
                : "geoextux-wfstfeatureediting-button-edit",
            "text": this.editMenuButtonText,
            "menu": new Ext.menu.Menu(),
            "tooltip": this.editMenuButtonTooltipText,
            //"toggleGroup":this.actionGroup || this.DEFAULT_ACTION_GROUP
            //"group" : this.actionGroup || this.DEFAULT_ACTION_GROUP
        });

        // I'm dumbfounded, but the following listener (coupled with the definition of dummyMenuItem below
        // fixes one of MassGIS's persistent issues.
        this.editMenuButton.addListener('click',function() {
            Ext.each(editManager.drawMenuButton.menu.items.items, function(item, idx) {
                item.baseAction.control.deactivate();
            });
            Ext.each(editManager.editMenuButton.menu.items.items, function(item, idx) {
                item.baseAction.control.deactivate();
            });
            dummyMenuItem.setChecked(true);
        });

        this.toolbarItems.push("-",this.drawMenuButton, this.editMenuButton, "-");        
        
/*
        this.toolbar.addItem("-");
        this.toolbar.addItem(this.drawMenuButton);
        this.toolbar.addItem(this.editMenuButton);
        this.toolbar.addItem("-");
        this.toolbar.doLayout();
*/
        // === featureGrid and featureEditorGrid containers, mainPanel ===

        this.featureGridContainer = new Ext.TabPanel({
            "border": true,
            "region": "center",
            "resizable": true
        });

        this.featureEditorGridContainer = new Ext.Panel({
            "title": this.featureEditorGridContainerTitleText,
            "border": true,
            "region": "east",
            "width": 360, // expand this to increase the amount of the total modal devoted to the values, orig: 220
            "layout": "fit"
        });

        var mainPanelOptions = {
            "border": false, 
            "layout": "border",
            "items": [this.featureGridContainer,
                      this.featureEditorGridContainer]
        };
        if (GeoExt.ux.WFSTFeatureEditingStatusBar) {
            mainPanelOptions.tbar = new GeoExt.ux.WFSTFeatureEditingStatusBar({
                "manager": this});
        }
        this.mainPanel = new Ext.Panel(mainPanelOptions);
        this.mainPanelContainer && this.mainPanelContainer.add(this.mainPanel);
    },

    /** private: method[initMainTools]
     *  Called by the constructor.  Creates all dynamic components that are
     *      directly related to the WFS service (store, layers, controls, etc.)
     *      Everything is created asynchronously, except the 
     *      :class:`GeoExt.data.WFSCapabilitiesStore` object.
     */
    createToolsFromURL: function(url) {
        var wfsCapURL = Ext.urlAppend(url, Ext.urlEncode(Ext.applyIf(
            this.capabilitiesParams || {}, this.DEFAULT_CAPABILITIES_PARAMS
        )));
        
        wfsCapURL =  toolSettings.editTool.getCapURL;

        wfsCapStore = new GeoExt.data.WFSCapabilitiesStore( {
            url: wfsCapURL,
            listeners: {
                load: {
                    fn: this.onWFSCapabilitiesStoreLoad,
                    scope: this
                }
            },
            protocolOptions: Ext.applyIf(
                this.protocolOptions || {}, this.DEFAULT_PROTOCOL_OPTIONS),
            layerOptions: this.layerOptions
        });
    
        wfsCapStore.load();
    },

    /** private: method[loadWFSFromConfig]
     *  Formerly  method[onWFSCapabilitiesStoreLoad] 
     *  Callback method triggered on "load" of the
     *      :class:`GeoExt.data.WFSCapabilitiesStore` object.  At this point, 
     *      :class:`OpenLayers.Layer.Vector` object with their according
     *      :class:`OpenLayers.Protocol.WFS` protocols were created.
     *
     *      For each created layer :
     *        - its "wfstFeatureEditing" hash property set, which is used to
     *          reference everything created by this widget that is related to
     *          the layer so that it can access any of its widget directly from
     *          itself.
     *        - it is added to the :class:`OpenLayers.Map`
     *        - try to get a WMS layer sibling in order to refresh it when
     *          transactions are made to the vector one.
     *
     *      When finished, the 'triggerDescribeFeatureTypes' method is called.
     */
    //onWFSCapabilitiesStoreLoad: function(store, records, options) {
    loadWFSFromConfig : function () {
        var records, layerConfigs = [], protocolCfg = {};
        
        for (var i = 0; i < this.layerConfigs.length; i++) {
            if (this.layerConfigs[i] && this.layerConfigs[i].featureType && this.layerConfigs[i].layerTitle ) {
                protocolCfg = {
                    featureType : this.layerConfigs[i].featureType
                };
                
                Ext.apply(protocolCfg, {}, this.DEFAULT_PROTOCOL_OPTIONS);

                if (this.layerConfigs[i].color) {
                    var styleMap = new OpenLayers.StyleMap({"default": new OpenLayers.Style({'strokeColor': this.layerConfigs[i].color})} );
                    layerConfigs.push( new OpenLayers.Layer.Vector (this.layerConfigs[i].layerTitle,{
                        strategies: [new OpenLayers.Strategy.Fixed()],
                        projection: new OpenLayers.Projection(this.DEFAULT_PROTOCOL_OPTIONS.srsName),
                        protocol: new OpenLayers.Protocol.WFS( protocolCfg ),
                        styleMap: styleMap
                    }));
                } else {
                    layerConfigs.push( new OpenLayers.Layer.Vector (this.layerConfigs[i].layerTitle,{
                        strategies: [new OpenLayers.Strategy.Fixed()],
                        projection: new OpenLayers.Projection(this.DEFAULT_PROTOCOL_OPTIONS.srsName),
                        protocol: new OpenLayers.Protocol.WFS( protocolCfg )
                    }));
                }
            }
        }
        
        layerStore = new GeoExt.data.LayerStore ({
            //map: this.map,
            layers: layerConfigs
        });
        this.store = layerStore;
        records = layerStore.data.items;
        var layers = [];
        Ext.each(records, function(record, index) {
            var layer = record.getLayer().clone();
            layer.strategies = this.useFilter ? this.DEFAULT_STRATEGIES_USE_FILTER({"layer":layer}) : this.DEFAULT_STRATEGIES({"layer":layer}) ;
            layer.wfstFeatureEditing = {
                "manager": this,
                "wmsLayerSibling": this.getWMSLayerSibling(layer),
                "getWMSLayerSibling" : this.getWMSLayerSibling
            };
            
            // find the save strategy : keep a reference to it and add events
            Ext.each(layer.strategies, function(strategy, strategyIndex) {
                strategy.setLayer(layer);
                if (strategy instanceof OpenLayers.Strategy.Save) {
                    layer.wfstFeatureEditing.saveStrategy = strategy;
                    strategy.events.on({
                        "success": this.onCommitSuccess,
                        "fail": this.onCommitFail,
                        scope: {layer: layer, manager: this}
                    });
                    return false;
                }
            }, this);

            if (layer.wfstFeatureEditing.saveStrategy) {
                layers.push(layer);
            } else {
                // todo : log - layer had no save strategy...
            }
        }, this);
        this.map.addLayers(layers);
        Ext.each(layers, function(layer, index) {
            layer.setVisibility(false);
        });
        this.layers = layers;

        this.triggerDescribeFeatureTypes(layers);
    },

    /** private: method[triggerDescribeFeatureTypes]
     *  :param layers ``Array`` of :class:`OpenLayers.Layer.Vector`.  Defaults
     *                          to the layers property of this object.
     *
     *  For each layers, a WFSDescribeFeatureType is triggered with the
     *      "onDescribeFeatureTypeSuccess" callback using the layer protocol
     *      'featureType' property as the 'TYPENAME' parameter.
     */
    triggerDescribeFeatureTypes: function(layers) {
        layers = layers || this.layers;
        Ext.each(layers, function(layer, index) {
            var params = Ext.applyIf(Ext.applyIf(
                this.describeFeatureTypeParams || {},
                this.DEFAULT_DESCRIBE_FEATURETYPE_PARAMS),
                {'TYPENAME': (layer.protocol.featurePrefix ? (layer.protocol.featurePrefix+":"+ layer.protocol.featureType) : layer.protocol.featureType)});

            OpenLayers.Request.GET({
               method  : 'GET'
              ,url     : layer.protocol.url
              ,params  : params
              ,scope   : {layer : layer,manager : this}
              ,success : this.onDescribeFeatureTypeSuccess
              ,failure : this.onDescribeFeatureTypeFailure
            });
/*
  won't work w/ OL 2.12
            OpenLayers.loadURL(layer.protocol.url, params,
                {layer: layer, manager: this},
                this.onDescribeFeatureTypeSuccess,
                this.onDescribeFeatureTypeFailure);
*/
        }, this);
    },

    /** private: method[onDescribeFeatureTypeSuccess]
     *  Callback method triggered when a WFS DescribeFeatureType request is
     *      is completed.  The scope has a reference to the layer.  Used for :
     *      - detection the geometry type from the geometry property to create
     *        the appropriate :class:`OpenLayers.Handler` for the 
     *        :class:`OpenLayers.Control.DrawFeature`.
     *      - creation a field for each property (currently without any form of
     *        type detection).
     *  
     *  When all requests were received, trigger the createEditingTools method.
     */
    onDescribeFeatureTypeSuccess: function(response) {
        var format = new OpenLayers.Format.WFSDescribeFeatureType();
        format.setNamespace("xsd", "http://www.w3.org/2001/XMLSchema");

        var describe = format.read(response.responseXML);
        var fields = [];

        if (describe && describe.featureTypes && describe.featureTypes[0]) {
            Ext.each(describe.featureTypes[0].properties, function(property, index) {
                fields.push({"name": property.name});
                if (property.name == this.manager.geomProperty) {
                    var geomType;
                    switch (property.localType) {
                      case "PointPropertyType":
                        this.layer.wfstFeatureEditing.drawHandler =
                            OpenLayers.Handler.Point;
                        break;
                      case "LineStringPropertyType":
                        this.layer.wfstFeatureEditing.drawHandler =
                            OpenLayers.Handler.Path;
                        break;
                      case "PolygonPropertyType":
                        this.layer.wfstFeatureEditing.drawHandler =
                            OpenLayers.Handler.Polygon;
                        break;
                      case "MultiPointPropertyType":
                        this.layer.wfstFeatureEditing.drawHandler =
                            OpenLayers.Handler.Point;
                        this.layer.wfstFeatureEditing.multiGeometry =
                            OpenLayers.Geometry.MultiPoint;
                        break;
                      case "MultiLineStringPropertyType":
                        this.layer.wfstFeatureEditing.drawHandler =
                            OpenLayers.Handler.Path;
                        this.layer.wfstFeatureEditing.multiGeometry =
                            OpenLayers.Geometry.MultiLineString;
                        break;
                      case "MultiPolygonPropertyType":
                        this.layer.wfstFeatureEditing.drawHandler =
                            OpenLayers.Handler.Polygon;
                        this.layer.wfstFeatureEditing.multiGeometry =
                            OpenLayers.Geometry.MultiPolygon;
                        break;
                    }
                }
            }, this);
            this.layer.wfstFeatureEditing.fields = fields;
            this.layer.setVisibility(false);
        }

        this.manager.queries++;

        if (this.manager.queries == this.manager.layers.length) {
            this.manager.createEditingTools();
        }
    },

    /** private: method[onDescribeFeatureTypeFailure]
     *  Callback method triggered when a WFS DescribeFeatureType request has
     *      failed.
     */
    onDescribeFeatureTypeFailure: function(response) {},

    /** private: method[createEditingTools]
     *  Calls the createEditingToolsForLayer method for each layer, then 
     *  
     *  When all requests were received, trigger the createEditingTools method,
     *     redo the layout of the toolbar (because items added after it was
     *     rendered don't appear unless doing so) and reset query related 
     *     elements.
     */
    createEditingTools: function() {
        Ext.each(this.layers, function(layer, index) {
            this.createEditingToolsForLayer(layer);
        }, this);
//        this.toolbar.doLayout();
        this.resetAll();
    },

    /** private: method[createEditingToolsForLayer]
     *  :param layer :class:`OpenLayers.Layer.Vector` The vector layer.
     * 
     *  Creates all editing tools and event listeners for this layer :
     *      - draw control and action (added to the draw menu)
     *      - select feature control for select purpose
     *      - select feature control for highlight on mouse hover purpose
     *      - select feature action (added to the draw menu)
     *      - feature grid, used to contain all features (or all filtered
     *        features if this.useFilter is set to true)
     *      - feature editor grid, used to edit the currently selected feature
     *        attributes
     * 
     *  If this.useFilter is set to true :
     *      - user filter control for "GetFeature" purpose
     */
    createEditingToolsForLayer: function(layer) {
        var myLayerConfig = null, fieldList,thisTool, sort, thisField,restrictTool,restrictValue;
        for (var i = 0; i < this.layerConfigs.length; i++) {
            if (this.layerConfigs[i].layerTitle == layer.name) {
                layer.layerConfig = myLayerConfig = this.layerConfigs[i];
                break;
            }
        }
		// set up combobox layer stores as necessary
		if (typeof myLayerConfig !== 'undefined' && typeof myLayerConfig.fields !== 'undefined') {
			for (var k = 0; k< myLayerConfig.fields.length; k++) {
				thisField = myLayerConfig.fields[k];
				if (typeof thisField.xtype !== 'undefined' && 
					typeof thisField.store === 'undefined' &&
					typeof thisField.store_val_labels !== 'undefined' ) {
					// have component parts for a preset combo box with distinct stores and values
						thisField.store = new Ext.data.ArrayStore({
							storeId : myLayerConfig.featureType+'_'+k,
							idIndex : 0,
							fields : ['value','label'],
							data :  thisField.store_val_labels
						});
						thisField.mode = 'local';
						thisField.valueField = 'value';
						thisField.displayField = 'label';
				}
				
				// wfs driven edit combobox
				if (typeof thisField.xtype !== 'undefined' && 
					typeof thisField.store === 'undefined' &&
					typeof thisField.store_remote !== 'undefined' ) {
						fieldList = [];
				      fieldList.push(thisField.store_remote.valueField);

						sort = "";
						if (thisField.store_remote.sortBy) {
							sort = thisField.store_remote.sortBy;
							if (thisField.store_remote.sortOrder ) {
								sort += ' '+thisField.store_remote.sortOrder ;
							}
						} 
						thisField.store_remote.storeHandler = function (d)  {
							if (typeof this.restrict == 'undefined') {
								d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%'";
							} else if (this.restrict.type.toUpperCase() == 'URL') {
								d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%' AND "+this.restrict.restrictedValueField +" = '"+(editURLParams[this.restrict.value] ? editURLParams[this.restrict.value] : this.restrict.def_val ) +"'";							
							} else if (this.restrict.type == 'quickzoom') {
								restrictTool = MorisOliverApp.quickZoomDefn.comboBoxes[this.restrict.value];
								restrictValue = (restrictTool.getValue() != '' && restrictTool.__selectedRecord ? restrictTool.__selectedRecord.json.properties[this.restrict.restrictedSourceField] : "");									
								
								if (typeof restrictTool.__selectedRecord == 'undefined' || restrictValue == '' ) {
									//d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%'";	
									d.baseParams.CQL_FILTER	=  this.valueField + "='__not_a_valid_value__' " ;
								} else {
									d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%' AND "+this.restrict.restrictedValueField +" = '"+restrictValue+"'";								
								}

							} else if (this.restrict.type == 'static') {
								d.baseParams.CQL_FILTER = this.valueField+' like '+"'"+d.baseParams.CQL_FILTER+"%' AND "+this.restrict.restrictedValueField +" = '"+this.value+"'";
							
							}
							return true;
						}.createDelegate(thisField.store_remote);
						
						thisField.store = new Ext.data.Store ({
							listeners: {
							  beforeload : thisField.store_remote.storeHandler
							},
							baseParams: {
							  "request" : "getfeature",
							  "version" : "1.0.0",
							  "service" : "wfs",
							  "propertyname" : fieldList.join(',') ,  
							  "typename" : thisField.store_remote.layer,
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
						Ext.applyIf(thisField, {
							triggerAction:'all',
							displayField:'values.properties.'+thisField.store_remote.valueField,  // values. is wrong, and breaks typeahead, as below
							queryParam: 'CQL_FILTER',
							typeAhead: true,
							loadingText: 'Searching...',
							autoSelect: false,
							forceSelection:true,
							minChars:0,
							mode:'remote',
							selectOnFocus:true,
							shadow: 'drop',
							//pageSize:10,
							hideTrigger:false,	
							lastQuery : '',
							listeners : {
							   beforequery: function(qe){
								   delete qe.combo.lastQuery;
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
								},
							  select : function (that,record,idx) {
							    this.__selectedRecord = record;
					            this.setValue(record.json.properties[this.displayField.replace('values.properties.','')]); // this shouldn't be necessary
							  }
							}
						
						});
				}
				if (typeof thisField.auto_timestamp !== 'undefined') {
					thisField.readOnly = true;
				}
			}
		}	
	
        // ======================
        // DrawFeature and Action
        // ======================
        var handler = layer.wfstFeatureEditing.drawHandler ||
            OpenLayers.Handler.Point;
        var drawControl = new OpenLayers.Control.DrawFeature(layer, handler);
        drawControl.events.on({
            "activate": function() {
                //this.layer.setVisibility(true);
                this.drawMenuButtonActive = true;
            },
            "deactivate": function() {
                //this.layer.setVisibility(false);
                this.drawMenuButtonActive = false;
            },
            "featureadded": function(e) {
                var wfstFE = this.layer.wfstFeatureEditing;
                var feature = e.feature;
                if (feature) {
                    var multiGeom = wfstFE.multiGeometry;
    
                    // if we're dealing with a "MultiGeometry" layer, we
                    // must cast the geometry as "Multi" when the feature
                    // drawing is completed
                    if (multiGeom) {
                        this.layer.eraseFeatures([feature]);
                        feature.geometry = new multiGeom(feature.geometry);
                    }

                    feature.state == OpenLayers.State.INSERT &&
                        this.manager.toggleMainPanelContainer(true);

                    wfstFE.drawControl.deactivate();
                    if (this.manager.useFilter) {
                        wfstFE.userFilterControl.activate();
                        wfstFE.userFilterControl.deactivateHandlers();
                    }
                    wfstFE.highlightControl.activate();
                    feature._editSource = 'draw';
					
					// assign defaults here
					if (layer.layerConfig.fields) {
						for (var i = 0; i < layer.layerConfig.fields.length; i++) {
							if (typeof layer.layerConfig.fields[i].value !== 'undefined') {
								feature.attributes[layer.layerConfig.fields[i].name] = layer.layerConfig.fields[i].value;
							}
							
							if (typeof layer.layerConfig.fields[i].auto_timestamp !== 'undefined') {
								feature.attributes[layer.layerConfig.fields[i].name] = new Date().format(layer.layerConfig.fields[i].auto_timestamp);
							}
						}
					}
					
                    wfstFE.selectControl.select(feature);
                }
            },
            scope: {layer: layer, manager: this}
        });


        var drawToolControl = drawControl;

		
        var snappingLayers = [];
        if (myLayerConfig.snapTo) {
            snappingLayers = myLayerConfig.snapTo;
        }
        if (snappingLayers.length > 0) {
            var snapLayerConfigs = [];
            for (var i = 0; i < snappingLayers.length; i++) {
                var protocolCfg = {
                    featureType : snappingLayers[i]
                };
                
                Ext.apply(protocolCfg, {}, this.DEFAULT_PROTOCOL_OPTIONS);
                
                snapLayerConfigs.push( new OpenLayers.Layer.Vector (snappingLayers[i],{
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    projection: new OpenLayers.Projection(this.DEFAULT_PROTOCOL_OPTIONS.srsName),
                    protocol: new OpenLayers.Protocol.WFS( protocolCfg )
                }))
            }

            drawToolControl = new OpenLayers.Control.UserFilter({
                layers: snapLayerConfigs,
                box: true,
                autoVisibility: false,
                filterType: OpenLayers.Filter.Spatial.INTERSECTS
            });
            layer.wfstFeatureEditing.snappingFilterControl = drawToolControl;
            this.map.addLayers(snapLayerConfigs);
            Ext.each(snapLayerConfigs, function(layer) {
                layer.setVisibility(false);
            });
            var snap = new OpenLayers.Control.Snapping({
                layer: layer,
                targets: snapLayerConfigs,
                greedy: false
            });
            this.map.addControl(snap);

            drawToolControl.events.on({
                "activate": function(e) {
                    if (myLayerConfig.snapTo) {
                        alert("Snapping is enabled when drawing features in this layer.  Please draw a box around the area you will be drawing in, so that the system can enable snapping in that area");
                    }
                },
                "filtermerged": function(e) {
                    e.control.deactivateHandlers();
                    snap.activate();
                    drawControl.activate();
                },
                "deactivate": function(e) {
                    var layers = e.object.layers;
                    for( var i =0; i < layers.length; i++) {
                        var layer = layers[i];
                        layer.setVisibility(false);
                    }
                    snap.deactivate();
                },
                scope: this
            });
        }
        this.map.addControl(drawControl);

		// this is a "Dummy" menu item to use as the target for selection when we're done editing/drawing
		// due to *something* in the togglegroup needing to be selected (maybe?)
        var dummyAction = new GeoExt.Action({
            text: layer.name,
            hidden: true,
            control: new OpenLayers.Control(),
            map: this.map,
            disabled: !layer.inRange,
            // button options
            toggleGroup: this.actionGroup || this.DEFAULT_ACTION_GROUP,
            allowDepress: false,
            enableToggle: false,
            // check item options
            group: this.actionGroup || this.DEFAULT_ACTION_GROUP
        });
        dummyMenuItem = new Ext.menu.CheckItem(dummyAction);
        this.drawMenuButton.menu.addItem(dummyMenuItem);
        dummyMenuItem.hide();

        // create the action, add it to BOTH the toolbar and menu (hidden) to
        // allow the toogleGroup and group properties to work properly.  Show
        // the menu item after it has been added
        var drawAction = new GeoExt.Action({
            text: layer.name,
            hidden: true,
            control: drawToolControl,
            map: this.map,
            disabled: !layer.inRange,
            // button options
            toggleGroup: this.actionGroup || this.DEFAULT_ACTION_GROUP,
            allowDepress: false,
            // check item options
            group: this.actionGroup || this.DEFAULT_ACTION_GROUP
        });
        this.toolbarItems.push(drawAction);
        this.drawMenuButton.menu.addItem(new Ext.menu.CheckItem(drawAction));
        var drawMenuItem = this.drawMenuButton.menu.items.items[
            this.drawMenuButton.menu.items.getCount() - 1
        ];
        drawMenuItem.show();

        layer.wfstFeatureEditing.drawAction = drawAction;
        layer.wfstFeatureEditing.drawControl = drawControl;


        // ==================
        // UserFilter control
        // ==================
        var userFilterControl;
        if (this.useFilter) {
            userFilterControl = new OpenLayers.Control.UserFilter({
                layer: layer,
                box: true,
                filterType: OpenLayers.Filter.Spatial.INTERSECTS
            });
            layer.wfstFeatureEditing.userFilterControl = userFilterControl;

            userFilterControl.events.on({
                "activate" : function(e) {
                    layer.setVisibility(true);
                },
                "filtermerged": function(e) {
                    e.control.deactivateHandlers();
                    e.layer.wfstFeatureEditing.highlightControl.activate();
                    snap && snap.activate();
                },
                "deactivate": function(e) {
                    var layers = e.object.layers;
                    for( var i =0; i < layers.length; i++) {
                        var layer = layers[i];
                        layer.wfstFeatureEditing.highlightControl.deactivate();
                    }
                    snap && snap.deactivate();
                },
                scope: this
            });
        }

        // ===============================
        // SelectFeature (click selection)
        // ===============================
        var selectControl = new OpenLayers.Control.SelectFeature(layer, {
            clickout: false
        });
        selectControl.events.on({
            "activate": function() {
                this.layer.setVisibility(true);
                this.manager.useFilter === false &&
                    this.manager.toggleMainPanelContainer(true);

                this.layer.wfstFeatureEditing.featureGrid.enable();
                this.manager.featureGridContainer.setActiveTab(
                    this.manager.featureGridContainer.items.items.indexOf(
                        this.layer.wfstFeatureEditing.featureGrid)
                );
            },
            "deactivate": function() {
                this.layer.setVisibility(false);
                this.layer.wfstFeatureEditing.featureGrid.disable();
            },
            scope: {layer: layer, manager: this}
        });
        layer.wfstFeatureEditing.selectControl = selectControl;

        // ======================================================
        // SelectFeature (highlight and "click select" activator)
        // ======================================================
        var highlightControl = new OpenLayers.Control.SelectFeature(layer, {
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary"
        });
        highlightControl.events.on({
            "activate": function() {
                this.wfstFeatureEditing.selectControl.activate();
            },
            "deactivate": function() {
                this.wfstFeatureEditing.selectControl.deactivate();
            },
            "beforefeaturehighlighted": function(e) {
                // if hovered feature is already selected, do nothing
                return (this.selectedFeatures.indexOf(e.feature) == -1);
            },
            "featurehighlighted": function(e) {
                var feature = e.feature;
            },
            "featureunhighlighted": function(e) {
                var feature = e.feature;
            },
            scope: layer
        });
        layer.wfstFeatureEditing.highlightControl = highlightControl;

        // =============================
        // EditAction and control adding
        // =============================

        this.map.addControl(selectControl);
        this.useFilter && this.map.addControl(highlightControl);

        var editAction = new GeoExt.Action({
            text: layer.name,
            hidden: true,
            control: (this.useFilter) ? userFilterControl : highlightControl,
            map: this.map,
            disabled: !layer.inRange,
            // button options
            toggleGroup: this.actionGroup || this.DEFAULT_ACTION_GROUP,
            allowDepress: false,
            // check item options
            group: this.actionGroup || this.DEFAULT_ACTION_GROUP
        });
        this.toolbarItems.push(editAction);
        this.editMenuButton.menu.addItem(new Ext.menu.CheckItem(editAction));
        editMenuItem = this.editMenuButton.menu.items.items[
            this.editMenuButton.menu.items.getCount() - 1
        ];
        editMenuItem.show();

        layer.wfstFeatureEditing.editAction = editAction;

        // ============
        // Layer events
        // ============

        layer.events.on({
            "featureunselected" :function(e) {
                // only useful if SelectFeature ctrl has clickOut property set
                // to true
                this.manager.cancelEditing(this.layer);
            },
            "beforefeatureselected" :function(e) {
                // do not select feature if already selected
                if (this.layer.selectedFeatures.indexOf(e.feature) != -1) {
                    return false;
                }
            },
            "featureselected" :function(e) {
				var myLayerConfig;
                var feature = e.feature;

				for (var j = 0; j < this.manager.layerConfigs.length; j++) {
					if (this.manager.layerConfigs[j].layerTitle == feature.layer.name) {
						myLayerConfig = this.manager.layerConfigs[j];
						break;
					}
				}
								
			
                var editorGrid = this.manager.getNewFeatureEditorGrid(
                    feature, this.layer,myLayerConfig
					
					);

                // todo: is this useful ?
                this.layer.wfstFeatureEditing.editorGrid = editorGrid;

                this.manager.featureEditorGridContainer.add(editorGrid);
                this.manager.featureEditorGridContainer.doLayout();
            },
            scope: {layer: layer, manager: this}
        });


		
        // ===========
        // FeatureGrid
        // ===========
        var featureGrid = this.getNewFeatureGrid(layer);
        this.featureGridContainer.add(featureGrid);
        layer.wfstFeatureEditing.featureGrid = featureGrid
    },

    /** private: method[resetAll]
     *  Reset all query related elements.  Doesn't destroy anything.
     */
    resetAll: function() {
        // todo: if we want to support more than one WFS service, we could have
        //       an other property to keep all layers created by this widget and
        //       keep this one for "current service only".
        this.layers = [];
        this.queries = 0;
    },

    /** private: method[getWMSLayerSibling]
     *  :param layer :class:`OpenLayers.Layer.Vector` A vector layer.
     *  :return: :class:`OpenLayers.Layer.WMS`
     *
     *  Using a vector layer, try to find a WMS one having the same name
     */
    getWMSLayerSibling: function(layer) {
        var wmsLayerSibling;
        var map = this.map || this.manager.map;
        //var map =  ( typeof this.map == "undefined" ) ? this.manager.map : this.map;
        Ext.each(map.getLayersByName(layer.name), function(layerSibling) {
            if (layerSibling instanceof OpenLayers.Layer.WMS) {
                wmsLayerSibling = layerSibling;
                return false;
            }
        }, this);
        return wmsLayerSibling;
    },

    /** private: method[getNewFeatureEditorGrid]
     *  :param feature :class:`OpenLayers.Feature.Vector` A vectore feature.
     *  :param layer   :class:`OpenLayers.Layer.Vector`   A vector layer.
     *  :return: :class:`GeoExt.ux.FeatureEditorGrid`
     *
     *  Using a vector layer and a vector feature, create and return a new
     *      :class:`GeoExt.ux.FeatureEditorGrid` object with 'done', 'cancel'
     *      and store 'load' event listeners to respectively "save" or "cancel"
     *      changes made to a feature and focus on the first attribute cell
     *      upon edition starting.
     */
    getNewFeatureEditorGrid: function(feature, layer, myLayerConfig) {
		

		
// if adding a record, add defaults to feature here?  maybe before they go to featureGrid?
		
        var featureEditorGrid = new GeoExt.ux.FeatureEditorGrid({
			myLayerConfig: myLayerConfig,
            nameField: "name",
            store: this.getNewAttributeStore(feature),
            feature: feature,
            forceValidation: true,
            allowSave: true,
            allowCancel: true,
            allowDelete: true,
            border: false,
            listeners: {
                done: function(panel, e) {
                    var feature = e.feature, modified = e.modified, myLayerConfig = false, thisField;
                    for (var i = 0; i < this.manager.layerConfigs.length; i++) {
                        if (this.manager.layerConfigs[i].layerTitle == feature.layer.name) {
                            myLayerConfig = this.manager.layerConfigs[i];
                            break;
                        }
                    }
					
                    if (feature._editSource == 'draw' && myLayerConfig !== false && myLayerConfig.split === true) {
                        var filter = new OpenLayers.Filter.Logical({
                            type: OpenLayers.Filter.Spatial.INTERSECTS,
                            property: feature.layer.protocol.geometryName,
                            value: feature.geometry
                        });
                        var myFeature = feature;
                        var myGeom = feature.geometry;
                        var myLayer = feature.layer;
                        var cleanProtocol = new OpenLayers.Protocol.WFS(feature.layer.protocol.options);
                        cleanProtocol.read({
                            callback: function(response) {
                                var saveStrategy = new OpenLayers.Strategy.Save();
                                var bSplitHappened = false;
                                splitLayer = new OpenLayers.Layer.Vector("temp split layer",{protocol: cleanProtocol, strategy: saveStrategy, projection: "EPSG:26986"});
                                splitLayer.addFeatures(response.features);
                                saveStrategy.setLayer(splitLayer);

                                splitControl = new OpenLayers.Control.Split({layer: splitLayer,deferDelete: true});
                                splitControl.events.on({"split":function(e) {
                                    bSplitHappened = true;
                                }});
                                myFeature.geometry = myGeom;
                                splitControl.considerSplit(myFeature);
                                window.setTimeout(function() {
                                    if (bSplitHappened === true) alert("Your line caused another line to be split at the the point(s) where they overlapped");
                                    map.addLayer(splitLayer);
                                    saveStrategy.save();
                                    map.removeLayer(splitLayer);
                                },0);
                            },
                            filter: filter,
                            scope: this
                        });
                    }
                    this.manager.closeEditing(this.layer, {skipReturn: true});
                    this.manager.commitFeature(feature);
                },
                cancel: function(panel, e) {
                    this.manager.cancelEditing(this.layer);
                    return false;
                },
                scope: {"manager": this, "layer": layer}
            }
        });
        // focus (start editing) on first attribute cell when store has loaded
        //     new records
        featureEditorGrid.store.on("load", function(store, records, options) {
            this.editor.getStore().getCount() && this.editor.startEditing(0,1);
        }, {"editor": featureEditorGrid, "manager": this});
        return featureEditorGrid;
    },

    /** private: method[getNewAttributeStore]
     *  :param feature :class:`OpenLayers.Feature.Vector` A vectore feature.
     *  :return: :class:`GeoExt.data.AttributeStore`
     *
     *  Using a vector feature and the DescribeFeatureType parameters, create
     *      and return a new :class:`GeoExt.data.AttributeStore` object.
     */
    getNewAttributeStore: function(feature) {
		var myLayerConfig,
			aIgnoreFields = [];
			
		for (var i = 0; i < this.layerConfigs.length; i++) {
			if (this.layerConfigs[i].layerTitle == feature.layer.name) {
				myLayerConfig = this.layerConfigs[i];
				break;
			}
		}	
		// add to ignore fields for right panel
		if (typeof myLayerConfig.fields != 'undefined' ) {
			for (var j = 0; j < myLayerConfig.fields.length; j++) {
				if (myLayerConfig.fields[j].hidden === true) {
					aIgnoreFields.push(myLayerConfig.fields[j].name);
				}
			}	
		}
        var params = Ext.applyIf(Ext.applyIf(
            this.describeFeatureTypeParams || {},
            this.DEFAULT_DESCRIBE_FEATURETYPE_PARAMS),
            {'TYPENAME': (feature.layer.protocol.featurePrefix ? (feature.layer.protocol.featurePrefix+":"+ feature.layer.protocol.featureType) : feature.layer.protocol.featureType)});
        return new GeoExt.data.AttributeStore({
            feature: feature,
            url:  OpenLayers.ProxyHost+escape(Ext.urlAppend(feature.layer.protocol.url,
                               OpenLayers.Util.getParameterString(params))),
            ignore: {name: this.ignoredAttributes.name.concat(aIgnoreFields)},
            autoLoad: true
        });
    },

    /** private: method[getNewFeatureGrid]
     *  :param layer :class:`OpenLayers.Layer.Vector`   A vector layer.
     *  :return: :class:`gxp.grid.FeatureGrid`
     *
     *  Using a vector layer, create and return a new
     *      :class:`gxp.grid.FeatureGrid` object used to have complete list of
     *      the vector features currently visible on the map (from the vector
     *      layer).
     *
     *  Also, if this.useFilter is set to true, some listeners are added as
     *      well for various purposes.
     */
    getNewFeatureGrid: function(layer) {
		var myLayerConfig,
			aFieldLabelOverides = {},
			aIgnoreFields = ["the_geom","SHAPE"];
			
		for (var i = 0; i < this.layerConfigs.length; i++) {
			if (this.layerConfigs[i].layerTitle == layer.name) {
				myLayerConfig = this.layerConfigs[i];
				break;
			}
		}	
		
		
		// add to ignore fields for left panel
		if (typeof myLayerConfig.fields !== 'undefined' ) {
			for (var j = 0; j < myLayerConfig.fields.length; j++) {
				if (myLayerConfig.fields[j].hidden === true) {
					aIgnoreFields.push(myLayerConfig.fields[j].name);
				}
				if (typeof myLayerConfig.fields[j].fieldLabel !== 'undefined' && myLayerConfig.fields[j].fieldLabel.length > 0) {
					aFieldLabelOverides[myLayerConfig.fields[j].name] = myLayerConfig.fields[j].fieldLabel;
				}					
			}
		}
		
        var store = this.getNewFeatureStore(layer);
        var featureGrid = new gxp.grid.FeatureGrid({
            title: layer.name,
            disabled: true,
            border: false,
            layer: layer,
            store: store,
            cls: "geoextux-wfstfeatureediting-featuregrid",
            // todo: create a public property for this
            ignoreFields: aIgnoreFields,
			fieldLabelOverrides : aFieldLabelOverides,
            bbar: this.useFilter ? this.getNewFeatureGridToolbar(layer) : null,
            sm: new GeoExt.grid.FeatureSelectionModel({
                layerFromStore: true,
                selectControl: layer.wfstFeatureEditing.selectControl,
                listeners: {
                    beforerowselect: function(sm, row, keep, rec) {
                        // todo : validate that the currently selected record
                        //        doesn't have any unsaved changes...
                    }
                },
                scope: this
            })
        });

        // === events if using the 'userFilter' control ===

        // return to selection if no features were returned
        this.useFilter && layer.events.on({"loadend": function(e) {
            if (!this.layer.wfstFeatureEditing.userFilterControl.hasBlankFilter
                && this.grid.store.getCount() === 0) {
                this.manager.returnToSelection(this.layer)
            }
        }, "scope": {"manager": this, "grid": featureGrid, "layer": layer}});

        // select first row if only one record (only if grid is rendered).
        // Also display main panel ct.
        this.useFilter && store.on("load", function(store, records, options) {
            if (this.layer.wfstFeatureEditing.userFilterControl.active) {
                store.getCount() === 1 && this.grid.rendered &&
                    this.grid.getSelectionModel().selectFirstRow();
                store.getCount() >= 1 &&
                    this.manager.toggleMainPanelContainer(true);
            }
        }, {"manager": this, "grid": featureGrid, "layer": layer});

        // when the featureGrid is rendered, select the first row if there is
        // only one
        this.useFilter && featureGrid.on("render", function(grid) {
            grid.store.getCount() === 1 &&
                grid.getSelectionModel().selectFirstRow();
        }, this);

        return featureGrid;
    },

    /** private: method[getNewFeatureGridToolbar]
     *  :param layer :class:`OpenLayers.Layer.Vector` A vector layer.
     *  :return: :class:`Ext.Toolbar`
     *
     *  Using a vector layer, create and return a new
     *      :class:`Ext.Toolbar` object containing a button that, on click,
     *      returns to the selection mode.  Only used when this.useFilter is
     *      set to true.
     */
    getNewFeatureGridToolbar: function(layer) {
        return new Ext.Toolbar({
            "items": ["->", new Ext.Action({
                "text": this.returnToSelectionText,
                "iconCls": "geoextux-wfstfeatureediting-button-filter",
                "handler": function(action, event) {
                    this.manager.returnToSelection(this.layer);
                },
                "scope": {"manager": this, "layer": layer}
            })]
        });
    },

    /** private: method[returnToSelection]
     *  :param layer :class:`OpenLayers.Layer.Vector` A vector layer.
     *
     *  Only used when this.useFilter is set to true.  Returns to the selection
     *      using the filter mode.
     */
    returnToSelection: function(layer) {
        layer.wfstFeatureEditing.selectControl.unselectAll();
        layer.wfstFeatureEditing.highlightControl.deactivate();
        //layer.wfstFeatureEditing.userFilterControl.activateHandlers();
        this.toggleMainPanelContainer(false);
        this.drawMenuButton.toggle(false);
        this.editMenuButton.toggle(false);
        Ext.each(this.drawMenuButton.menu.items.items, function (record, index) {
            record.setChecked && record.setChecked(false, true);
        });
        Ext.each(this.editMenuButton.menu.items.items, function (record, index) {
            record.setChecked && record.setChecked(false, true);
        });
    },

    /** private: method[returnToSelection]
     *  :param layer :class:`OpenLayers.Layer.Vector` A vector layer.
     *  :return: :class:`GeoExt.data.FeatureStore`
     *
     *  Using a vector layer, create a new :class:`GeoExt.data.FeatureStore`
     *      object with its features as records.
     */
    getNewFeatureStore: function(layer) {
        return new GeoExt.data.FeatureStore({
            fields: layer.wfstFeatureEditing.fields,
            layer: layer,
            features: layer.features,
            autoLoad: true
        });
    },

    /** private: method[cancelEditing]
     *  :param layer :class:`OpenLayers.Layer.Vector` A vector layer.
     *
     *  Discard all changes from the feature of the editor grid store, close
     *      the editor grid and destroy the feature if it had an 'insert' state.
     */
    cancelEditing: function(layer) {
        if (layer.wfstFeatureEditing.editorGrid) {
            var feature = layer.wfstFeatureEditing.editorGrid.store.feature;
            layer.wfstFeatureEditing.editorGrid.dirty &&
                layer.wfstFeatureEditing.editorGrid.cancel();
            this.closeEditing(layer);
            if(feature && feature.state === OpenLayers.State.INSERT) {
                feature.layer && feature.layer.destroyFeatures([feature]);
            }
        }
    },

    /** private: method[cancelEditing]
     *  :param layer :class:`OpenLayers.Layer.Vector` A vector layer.
     *  :param options ``Object``                     A hash of options
     *
     *  Destroy all elements from editor grid container, unselect all features
     *      and check if we should return to selection (only used when
     *      this.useFilter is set to true).
     */
    closeEditing: function(layer, options) {
        options = options || {};
        // avoid reentrance
        if(!arguments.callee._in) {
            arguments.callee._in = true;
            this.featureEditorGridContainer.removeAll(true);
            layer.wfstFeatureEditing.editorGrid = null;
            layer.wfstFeatureEditing.selectControl.unselectAll();
            delete arguments.callee._in;
        }
        // returnToSelection if only one feature
        if (options.skipReturn !== true && this.useFilter &&
            layer.wfstFeatureEditing.featureGrid.store.getCount() <= 1) {
            this.returnToSelection(layer);
        }
    },

    /** private: method[commitFeature]
     *  :param feature  :class:`OpenLayers.Feature.Vector` A vector feature
     *
     *  Calls the :class:`OpenLayers.Strategy.Save` object 'save' method with
     *      current feature.
     */
    commitFeature: function(feature) {
        if (feature.state != null) { 
            this.fireEvent('commitstart');
            feature.layer.wfstFeatureEditing.saveStrategy.save([feature]);
        }
    },

    /** private: method[onCommitSuccess]
     *  :param e  ``Object`` Request response
     *
     *  Callback method when a "success" event is triggered by the 
     *      :class:`OpenLayers.Strategy.Save` linked to a layer :
     *      - fires a "commitsuccess" event
     *      - redraw the WMS layer sibling (if any)
     *      - cancel editing (just to return to selection, doesn't actually
     *        "cancels" anything).
     */
    onCommitSuccess: function(e) {
        this.manager.fireEvent('commitsuccess', e);
        var wfstFE = this.layer.wfstFeatureEditing;
        wfstFE.wmsLayerSibling = wfstFE.getWMSLayerSibling(this.layer);
        wfstFE.wmsLayerSibling && wfstFE.wmsLayerSibling.redraw(true);

        this.manager.cancelEditing(this.layer);

        // bug : there is currently a bug with newly inserted features... the
        //       record in the grid is invalid...
        if (e.response.insertIds.length) {
            if (this.manager.useFilter) {
                wfstFE.userFilterControl.applyBlankFilter({force: true});
            } else {
                this.layer.refresh({force:true});
            }
            // normally, the store should not contain anything at this point
            if (wfstFE.featureGrid.store.getCount() > 0){
                wfstFE.featureGrid.store.removeAll(true);
            }
        }

        if (this.manager.useFilter &&
            wfstFE.featureGrid.store.getCount() <= 1) {
            this.manager.returnToSelection(this.layer);
        }
    },

    /** private: method[onCommitFail]
     *  :param e  ``Object`` Request response
     *
     *  Callback method when a "fail" event is triggered by the 
     *      :class:`OpenLayers.Strategy.Save` linked to a layer.  Fires a
     *      "commitfail" event.
     */
    onCommitFail: function(e) {
        this.manager.fireEvent('commitfail', e);
    },

    /** private: method[toggleMainPanelContainer]
     *  :param display  ``Boolean`` Whether to display the panel or not
     *
     *  Utility method to display the main panel by detecting the type of its
     *      container.  If it's a window, it's shown/hidden.  If it's a panel
     *      with accordion layout, it's expanded/collapsed.
     */
    toggleMainPanelContainer: function(display) {
        var ct = this.mainPanel.ownerCt;
        if (ct instanceof Ext.Window) {
            display && ct.show();
            !display && ct.hide();
        } else if (ct.ownerCt && ct.ownerCt.layout === "accordion") {
            ct.toggleCollapse(display);
        }
    }
});
