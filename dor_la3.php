<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
<!--
(c) 2010 Third Sector New England, Inc. on behalf of the Massachusetts Ocean Partnership.
This code was developed by Applied Science Associates, Inc. and Charlton Galvarino

License:  This  program is free software; you can redistribute it and/or modify  it  under
the terms of the GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or (at your  option)  any  later version. This program is
distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
Public License for more details.  In addition to the terms of the GNU General Public License,
licensee agrees to be subject to this Additional Term: Licensee shall notify and provide
Third Sector New England and the Massachusetts Ocean Partnership via email to info@tsne.org
and info@massoceanpoartnership.org, with a copy of all "modified versions" of the earlier
work that is subject this license or a work "based on" the earlier work that is subject to
this license.
-->
    <script>
      //
      // DO NOT MODIFY THE FOLLOWING VARIABLES
      var mkzipCGI     = false;
      var mkzipLoc     = false;
      var bingDisabled = true;
      var bingKey;
      var xmlCacheLoc;
      var siteTitle;
      var siteUrl;

      //
      // site-specific variables which may be modified but MUST be set
      var foldersetLoc = '/temp/dor_la3_folderset.xml';
      var moreInfoHTML = '<table border="0" width="100%" cellpadding=0 cellspacing=10><tr><td align=left><a target="_blank" href="dor_la3/DOR_LA3_Filter_Instructions.pdf">DOR LA3 Filter Instructions</a></td></tr></table>';
      var helpUrl1       = 'http://maps.massgis.state.ma.us/map_ol/moris_users_documentation.htm';
      var helpUrl2       = 'http://maps.massgis.state.ma.us/map_ol/moris_users_documentation.pdf';
      var moreInfoWidth = 300;

      var availableBase       = [
          'custom'
         ,'googleSatellite'
         ,'googleTerrain'
         ,'googleRoadmap'
         ,'googleHybrid'
         ,'openStreetMap'
         ,'bingRoads'
         ,'bingAerial'
         ,'bingHybrid'
         ,'CloudMade'
         ,'TopOSM-MA'
       ];
      var defaultBase         = 'googleRoadmap';   
      var defaultBaseOpacity  = 1;
      var defaultCoordUnit    = 'm';    // can be one of 'dms','dd','m'
      var defaultMeasureUnit  = 'm';      // can be one of 'm','mi','nm','yd','ft'
      var defaultLyrs         = [
	{wms : 'massgis:GISDATA.TOWNSSURVEY_ARC'		,title : 'Massachusetts Towns Survey Boundaries' }
      ];
      var defaultBbox = [-73.72672,41.17411,-69.55191,42.90172];
      var maxBbox     = [-73.72672,41.17411,-69.55191,42.90172];
      var wfsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
      var wmsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms';
      var wcsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wcs';
      var kmlUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms/kml';
      var namespaceUrl = 'http://massgis.state.ma.us/featuretype';
      var featurePrefix = 'massgis';
      var bannerHTML = '<table style="font-family:Arial"><tr><td><img src="../images/ma_state_seal_small.gif" alt="Commonwealth of MA seal"/></td><td>&nbsp;&nbsp;</td><td><font size="+1">Massachusetts Real Property Verified Market Sales Mapping Application</font></td><td>&nbsp;&nbsp;</td><td><a target="_blank" href="http://www.mass.gov/dor/local-officials/">DOR Division of Local Services</td><td>&nbsp;&nbsp;</td><td><a target="_blank" href="dor_la3/DOR_LA3_Filter_Instructions.pdf">DOR LA3 Filter Instructions</a></td><td>&nbsp;&nbsp;</td><td><a target="_blank" href="https://dlsgateway.dor.state.ma.us/gateway/Public/WebForms/LA3/LA3Search.aspx">LA3 Parcel Search</a></td><td>&nbsp;&nbsp;</td><td><a target="_blank" href="http://www.mass.gov/dor/docs/dls/bla/classificationcodebook.pdf">Property Type Classification Codes</a></td></tr>';
      var bannerHeight = 65;
      var externalGetCaps = {
//        'http://egisws02.nos.noaa.gov/ArcGIS/services/MPA/MPA_Inventory/MapServer/WMSServer' : {
//         name    : 'NOAA : Marine Protected Areas'
//         ,getcaps : 'noaa_marine_protected_areas_getcaps.xml'
//         ,proj    : {'EPSG:900913' : 'EPSG:3857'}
//       },
        'http://egisws02.nos.noaa.gov/ArcGIS/services/RNC/NOAA_RNC/MapServer/WMSServer' : {
         name    : 'NOAA Charts (RNC)'
         ,getcaps : 'noaa_charts_wms_getcaps.xml'
         ,proj    : {'EPSG:900913' : 'EPSG:3857'}
       }
      };
    </script>

    <!-- pick one of the following blocks & make sure it's not commented out -->

    <!-- maps.massgis.state.ma.us -->
    <script>
      proxyLoc     = '/cgi-bin/proxy.cgi?url=';
      //proxyLocBing = 'http://maps.massgis.state.ma.us/cgi-bin/get?';
	  proxyLocBing = proxyLoc;
      mkzipCGI     = '/cgi-bin/mkzip';
      mkzipLoc     = 'http://maps.massgis.state.ma.us';
      bingDisabled = false;
      bingKey      = 'Avo1GLPTTAaJF5bVkdgItDS4bHAjqDOp3euXU9tcQzi8fwyiWnQOlZEbTTFv3idb';
      xmlCacheLoc  = '/temp/OL_MORIS_cache/';  // don't forget to change the src path to getCapsBbox.js down below to /temp/OL_MORIS_cache/getCapsBbox.js
      siteTitle    = 'Massachusetts Real Property Verified Market Sales Mapping Application';
      siteUrl      = 'http://maps.massgis.state.ma.us/map_ol/dor_la3.php';
    </script>

	<!-- include a set of tool configs -->
	<script type="text/javascript" src="js/toolConfig_dor_la3.js?<?php echo time(); ?>"></script>	
        <script type="text/javascript" src="js/toolConfig_sample_filter_dor.js?<?php echo time(); ?>"></script>	 
    <script>
      document.title = siteTitle;
    </script>
    <script src="http://maps.google.com/maps/api/js?sensor=false"></script>       
	<link rel="stylesheet" type="text/css" href="css/morisoliver.css?<?php echo time(); ?>" />
    <link rel="stylesheet" type="text/css" href="http://maps.massgis.state.ma.us/extjs-3.3.1/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="css/ext-ux-wiz.css" />

	<!-- editing tools -->
	<link rel="stylesheet" type="text/css" href="css/statusbar.css" />
	
    <script type="text/javascript" src="http://maps.massgis.state.ma.us/extjs-3.3.1/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="http://maps.massgis.state.ma.us/extjs-3.3.1/ext-all.js"></script>

	
	<!-- editing tools -->
    <script type="text/javascript" src="js/plugins/editing/StatusBar.js"></script>
	
	<script type="text/javascript" src="js/plugins/Ext.ux.FieldLabeler.js"></script>
	<script type="text/javascript" src="js/Geoserver_ScriptTagProxy.js?<?php echo time(); ?>"></script>	
    <script type="text/javascript" src="js/wizard/CardLayout.js"></script>
    <script type="text/javascript" src="js/wizard/Wizard.js"></script>
    <script type="text/javascript" src="js/wizard/Header.js"></script>
    <script type="text/javascript" src="js/wizard/Card.js"></script>
    <script type="text/javascript" src="http://yui.yahooapis.com/3.1.2/build/yui/yui-min.js"></script>
    <script type="text/javascript" src="js/miframe/build/miframe-debug.js"></script>
    <script type="text/javascript" src="js/XmlTreeLoader.js"></script>
    <link rel="stylesheet" type="text/css" href="css/ogcsearch.css?20100805a">
    <script src="http://maps.massgis.state.ma.us/proj4js/proj4js-compressed.js"></script>
    <script type="text/javascript" src="http://maps.massgis.state.ma.us/OpenLayers-2.12-rc7/OpenLayers-closure.js"></script>
    <script type="text/javascript" src="js/cloudmade.js"></script>
    <script type="text/javascript" src="js/util.js?<?php echo time()?>"></script>
    <script type="text/javascript" src="js/GeoExt.js"></script>

	<!-- editing tools -->
    <script type="js/plugins/editing/StatusBar.js"></script>
    <script type="text/javascript" src="js/plugins/editing/widgets/WFSTFeatureEditingStatusBar.js"></script>	
	<script type="text/javascript" src="js/plugins/editing/widgets/WFSTFeatureEditingManager.js"></script>
    <script type="text/javascript" src="js/plugins/editing/widgets/grid/FeatureGrid.js"></script>
    <script type="text/javascript" src="js/plugins/editing/FeatureEditorGrid.js"></script>
    <script type="text/javascript" src="js/plugins/editing/UserFilter.js"></script>	


    <script type="text/javascript" src="/temp/OL_MORIS_cache/getCapsBbox.js?<?php echo time()?>"></script>
    <script type="text/javascript" src="js/map.js?<?php echo time()?>"></script>
  </head>
</html>
