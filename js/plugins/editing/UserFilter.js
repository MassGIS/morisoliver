/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control/GetFeature.js
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Protocol/WFS/v1_0_0.js
 * @requires OpenLayers/Protocol/WFS/v1_1_0.js
 */

/**
 * Class: OpenLayers.Control.UserFilter
 * Applies a spacial filter using a dragged box to the WFS protocol of a vector
 *     layer.
 *
 * Inherits from:
 *  - <OpenLayers.Control.GetFeature>
 */
OpenLayers.Control.UserFilter = OpenLayers.Class(OpenLayers.Control.GetFeature, {
    /**
     * Constant: EVENT_TYPES
     * {Array(String)} Supported application event types.
     *
     *  - *filtermerged* Triggered when a new filter was merged with the layer
     *                   protocol
     */
    EVENT_TYPES: ["filtermerged"],

    /* Public properties */

    /**
     * APIProperty: layer
     * {<OpenLayers.Layer.Vector>} The layer containing the
     *                             OpenLayers.Protocol.WFS to apply the filter.
     */
    layer: null,

    /**
     * APIProperty: autoRefresh
     * {Boolean} Whether to automatically refresh the layer when a filter is
     *           applied or not.  Defaults to true.
     */
    autoRefresh: true,

    /**
     * APIProperty: autoVisibility
     * {Boolean} Whether to automatically show the layer when a a filter is
     *           applied or not.  Defaults to true.
     */
    autoVisibility: true,

    /* Private properties */

    /**
     * Property: hasBlankFilter
     * {Boolean} Whether the current protocol filter is blank or not.
     */
    hasBlankFilter: false,

    /**
     * Constructor: OpenLayers.Control.UserFilter
     * Create a new userfilter control
     *
     * Parameters:
     * options - {Object} Optional object with non-default properties to set on
     *           the control.
     *
     * Returns:
     * {<OpenLayers.Control.UserFilter>} A new userfilter control
     */
    initialize: function(options) {
        this.EVENT_TYPES =
            OpenLayers.Control.UserFilter.prototype.EVENT_TYPES.concat(
                OpenLayers.Control.prototype.EVENT_TYPES,
                OpenLayers.Control.GetFeature.prototype.EVENT_TYPES
        );

        if (options.layer) options.layers = [options.layer];
    	if (options.layer) delete options.layer;

        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        this.handlers = {};
        
        if(this.click) {
            this.handlers.click = new OpenLayers.Handler.Click(this,
                {click: this.selectClick}, this.handlerOptions.click || {});
        }

        if(this.box) {
            this.handlers.box = new OpenLayers.Handler.Box(
                this,
                {done: this.selectBox},
                OpenLayers.Util.extend(this.handlerOptions.box, {
                    boxDivClassName: "olHandlerBoxSelectFeature"
                })
            ); 
        }
    },

    /**
     * Method: request
     * Sends a GetFeature request to the WFS
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} bounds for the protocol BBOX filter
     * options - {Object} additional options for this method.
     */
    request: function(bounds, options) {
        options = options || {};
        var filter = new OpenLayers.Filter.Spatial({
            type: this.filterType, 
            value: bounds
        });
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            layer.protocol.defaultFilter = filter;
            this.hasBlankFilter = false;
            this.events.triggerEvent("filtermerged", {
                  layer: layer, filter: filter, control: this});
            this.autoRefresh && layer.refresh({force:true});
            this.autoVisibility && layer.setVisibility(true);
        }
    },

    /**
     * Method: activateHandlers
     * Activate all the handlers of this control.
     */
    activateHandlers: function() {
        for(var key in this.handlers) {
            this.handlers[key].activate();
        }
    },

    /**
     * Method: deactivateHandlers
     * Deactivate all the handlers of this control.
     */
    deactivateHandlers: function() {
        for(var key in this.handlers) {
            this.handlers[key].deactivate();
        }
    },

    /**
     * Method: setMap
     * Set the map property for the control and apply a blank filter.
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.GetFeature.prototype.setMap.apply(this, arguments);
        this.applyBlankFilter();
    },

    /**
     * Method: activate
     * Activates the control and apply a blank filter.
     */
    activate: function() {
        OpenLayers.Control.GetFeature.prototype.activate.apply(this, arguments);
        this.applyBlankFilter();
    },

    /**
     * Method: deactivate
     * Deactivates the control and apply a blank filter.
     */
    deactivate: function() {
        OpenLayers.Control.GetFeature.prototype.deactivate.apply(
            this, arguments);
        this.applyBlankFilter();
    },

    /**
     * Method: applyBlankFilter
     * Apply a blank spatial filter to the layer protocol.
     *
     * Parameters:
     * options - {Object} Hash of options 
     */
    applyBlankFilter: function(options) {
        options = options || {};
        if (options.force === true || this.hasBlankFilter === false) {
            var filter = new OpenLayers.Filter.Spatial({
                type: this.filterType, 
                value: new OpenLayers.Bounds(0,0,0,0)
            });
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                layer.protocol.defaultFilter = filter;
                if (layer.getVisibility()) {
                    layer.refresh({force:true});
                } else {
                    layer.setVisibility(true);
                    layer.refresh({force:true});
                    layer.setVisibility(false);
                }
            }
            this.hasBlankFilter = true;
        }
    },

    CLASS_NAME: "OpenLayers.Control.UserFilter"
});
