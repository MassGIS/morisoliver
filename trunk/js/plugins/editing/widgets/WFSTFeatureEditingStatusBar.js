/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

Ext.namespace("GeoExt.ux");

/*
 * @requires Ext.ux/StatusBar.js
 */

/** api: (define)
 *  module = GeoExt.ux
 *  class = WFSTFeatureEditingStatusBar
 */
if (Ext.ux.StatusBar) {

    /** api: constructor
     *  .. class:: WFSTFeatureEditingStatusBar
     */
    GeoExt.ux.WFSTFeatureEditingStatusBar = Ext.extend(Ext.ux.StatusBar, {

        /* API */

        /* begin i18n */
        /** api: config[text] ``String`` i18n */
        text: 'Ready',

        /** api: config[busyText] ``String`` i18n */
        busyText: 'Saving in progress.  Please wait...',

        /** api: config[defaultText] ``String`` i18n */
        defaultText: 'Ready',
        /* end i18n */

        /** api: config[iconCls]
         *  ``String``  The default 'iconCls' value.
         */
        iconCls: 'x-status-valid',

        /** api: config[defaultIconCls]
         *  ``String``  The default 'defaultIconCls' value.
         */
        defaultIconCls: 'x-status-valid',

        /* PRIVATE*/
    
        manager: null,

        /** private: method[constructor]
         */
        constructor: function(config) {
            Ext.apply(this, config);
            arguments.callee.superclass.constructor.call(this, config);
            this.manager.on("commitstart", this.onCommitStart, this);
            this.manager.on("commitsuccess", this.onCommitSuccess, this);
            this.manager.on("commitfail", this.onCommitFail, this);
        },

        /** private: method[onCommitStart]
         *  Called when a "commitstart" event is fired by the 
         *      :class:`GeoExt.ux.WFSTFeatureEditingManager` widget.  Set the
         *      status bar to "busy".
         */
        onCommitStart: function() {
            this.showBusy();
        },

        /** private: method[onCommitSuccess]
         *  :param response: ``Object`` The response from the request
         *
         *  Called when a "commitsuccess" event is fired by the 
         *      :class:`GeoExt.ux.WFSTFeatureEditingManager` widget.  Shows the
         *      according success message.
         */
        onCommitSuccess: function(response) {
            this.setStatus({
                text: this.manager.commitSuccessText,
                iconCls: 'x-status-valid',
                clear: true
            });
        },

        /** private: method[onCommitFail]
         *  :param response: ``Object`` The response from the request
         *
         *  Called when a "commitfail" event is fired by the 
         *      :class:`GeoExt.ux.WFSTFeatureEditingManager` widget.  Shows the
         *      according failure message.
         */
        onCommitFail: function(response) {
            this.setStatus({
                text: this.manager.commitFailText,
                iconCls: 'x-status-error',
                clear: true
            });
        }
    });
}
