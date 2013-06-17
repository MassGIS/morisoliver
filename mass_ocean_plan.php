<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
  <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7;">
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
      var foldersetLoc = '/temp/mass_ocean_plan_folderset.xml';
var moreInfoHTML='<table border="0" cellspacing="10" cellpadding="0" width="100%"><tr><td style="font-family:Lucida Sans Unicode;font-size:17px;font-weight:400; background:url(img/czm_banner.png);width:100%;height:24px;text-shadow:-1px 1px #fff;vertical-align:top"><a href="http://www.mass.gov/czm/mapping/index.htm" target="_blank" title="Massachusetts Ocean Resource Information System: CZM&rsquo;s Online Mapping Tool" style="text-decoration:none;color:#000"><img src="img/czm_wave.png" alt="CZM" style="border:0px;vertical-align:top" /> &nbsp;MORIS: CZM&rsquo;s Online Mapping Tool</a></td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:14px;font-weight:400;width:100%;font-weight:bold">About MORIS</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;">The <a href="http://www.mass.gov/czm/mapping" target="_blank">Massachusetts Ocean Resource Information System</a> (MORIS) is an online mapping tool created by the <a href="http://www.mass.gov/czm" target="_blank">Massachusetts Office of Coastal Zone Management</a> (CZM), the <a href="http://www.mass.gov/mgis" target="_blank">Office of Geographic Information</a> (MassGIS), <a href="http://www.seaplan.org/" target="_blank">SeaPlan</a> (formerly Massachusetts Ocean Partnership), <a href="http://www.asascience.com" target="_blank">Applied Science Associates</a> (ASA), <a href="http://2creek.com" target="_blank">Charlton Galvarino</a>, and <a href="http://peoplegis.com/" target="_blank">PeopleGIS</a>. MORIS can be used to search, display, and share spatial data pertaining to Massachusetts coastal and ocean resources. Users can quickly create and share maps and download data for use in a Geographic Information System (GIS). In 2011, the MORIS system was upgraded to a new web-based thin client using <a href="http://www.geoext.org" target="_blank">GeoExt</a> and <a href="http://www.openlayers.org" target="_blank">OpenLayers<a>. It continues to use <a href="http://www.geoserver.org" target="_blank">GeoServer</a>-based <a href="https://wiki.state.ma.us/confluence/display/massgis/Home" target="_blank">MassGIS web mapping services</a>. The project was graciously funded by SeaPlan.</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;"><strong style="font-weight:bold">Terms and Conditions:</strong> By using MORIS you agree to the following <a href="http://www.mass.gov/czm/mapping/index.htm#disclaimer" target="_blank">terms</a>.</td></tr><tr>	<td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;">MORIS was developed using open source technology&#151;the MORIS codebase is free for use and modification under the GNU General Public License. More information about the open source nature of MORIS can be found in the <a href="http://maps.massgis.state.ma.us/map_ol/moris_developers_documentation.htm" target="_blank">MORIS Developers Documentation</a> or at <a href="http://code.google.com/p/morisoliver" target="_blank">Google Code</a>.</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;">The mission of CZM is to balance the impacts of human activity with the protection of coastal and marine resources. As a networked program, CZM was specifically established to work with other state agencies, federal agencies, local governments, academic institutions, nonprofit groups, and the general public to promote sound management of the Massachusetts coast. CZM is funded primarily through the Commonwealth of Massachusetts, the National Oceanic and Atmospheric Administration (NOAA), and the U.S. Environmental Protection Agency (EPA).</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;">MassGIS is the Office of Geographic Information within the Information Technology Division (ITD). Through MassGIS, the Commonwealth has created a comprehensive, statewide database of geospatial information. The state legislature has established MassGIS as the official state agency assigned to the collection, storage, and dissemination of geographic data. In addition, the legislative mandate includes coordinating GIS activity within the Commonwealth and setting standards for geographic data to ensure universal compatibility.</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;">SeaPlan aims to advance science-based and stakeholder-informed ocean management by enhancing knowledge, relationships, and management tools through effective practice of ecosystem-based coastal and marine spatial planning (CMSP) and the dissemination of its products. The MORIS application is one example of the initiative of SeaPlan to advance an integrated data network to improve the accessibility and interoperability of coastal and marine data for ocean management and other marine related-uses.</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;">Please contact <a href="mailto:Daniel.Sampson@state.ma.us">Daniel.Sampson@state.ma.us</a> with questions or comments. Last updated January 9, 2012.</td></tr><tr><td style="font-family:Lucida Sans Unicode;font-size:12px;font-weight:400;width:100%;text-align:center;"><a href="http://www.mass.gov/czm" target="_blank" title="Massachusetts Office of Coastal Zone Management"><img src="img/czm_sda2.png" alt="CZM Logo" style="height:55px;border:0px;margin:0px 10px;"></a><a href="http://www.mass.gov/mgis" target="_blank" title="Office of Geographic Information"><img src="img/massgis.png" alt="MassGIS Logo" style="height:55px;border:0px;margin:0px 10px;"></a><a href="http://www.seaplan.org/" target="_blank" title="SeaPlan"><img src="img/mop.png" alt="SeaPlan Logo" style="height:55px;border:0px;margin:0px 10px;"></a></td></tr></table>';
      var moreInfoWidth = 850;
      var helpUrl1       = 'moris_users_documentation.htm';
      var helpUrl2       = 'moris_users_documentation.pdf';

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
         ,'MassGIS_Basemap'
       ];

      var defaultBase         = 'custom';   
      var defaultBaseOpacity  = 1;
      var defaultCoordUnit    = 'dd';    // can be one of 'dms','dd','m'
      var defaultMeasureUnit  = 'nm';      // can be one of 'm','mi','nm','yd','ft'
      var defaultLyrs         = [
         {wms : 'massgis:GISDATA.OCEANMASK_POLY_MASURVEYCOAST' ,title : 'Ocean'}
        ,{wms : 'massgis:GISDATA.NEMASK_POLY_MASURVEY'         ,title : 'New England'}
        ,{wms : 'massgis:GISDATA.TOWNSSURVEY_POLY'             ,title : 'Massachusetts Municipal Boundaries Polygons'}
        ,{wms : 'massgis:MORIS.OM_PLANNING_AREA_POLY'          ,title : 'Massachusetts Ocean Management Planning Area'}
      ];
      var defaultBbox         = [-72.12520730140146,41.01594581045086,-68.7766982052202,43.029064493971575];  // decimal degrees E
      var maxBbox             = [-76.211689,39.586711,-67.191604,44.798225];  // decimal degrees E
      var wfsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
      var wmsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms';
      var wcsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wcs';
      var kmlUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms/kml';
      var namespaceUrl = 'http://massgis.state.ma.us/featuretype';
      var featurePrefix = 'massgis';
      var bannerHTML='<table border="0" cellspacing="0" cellpadding="0" width="100%"><tr style="font-family:Lucida Sans Unicode;font-size:1.0625em;font-weight:400; background:url(img/mass_ocean_plan_banner.png);width:100%;height:24px;text-shadow:-1px 1px #fff;vertical-align:top"><td><a href="http://www.mass.gov/eea/ocean-coastal-management/mass-ocean-plan/" target="_blank" title="Massachusetts Ocean Management Plan" style="text-decoration:none;color:#000"><img src="img/czm_wave.png" style="border:0px;vertical-align:top" /> &nbsp;MORIS: Massachusetts Ocean Management Plan Data</a></td></tr></table>';
      var bannerHeight = 26;
      var externalGetCaps = {
//        'http://egisws02.nos.noaa.gov/ArcGIS/services/MPA/MPA_Inventory/MapServer/WMSServer' : {
//         name    : 'NOAA : Marine Protected Areas'
//         ,getcaps : 'noaa_marine_protected_areas_getcaps.xml'
//         ,proj    : {'EPSG:900913' : 'EPSG:3857'}
//       },
        'http://egisws02.nos.noaa.gov/ArcGIS/services/RNC/NOAA_RNC/MapServer/WMSServer' : {
         name    : 'NOAA Raster Navigational Charts (RNC)'
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
      bingKey      = 'AoSoMDQG3JYNMtfp-sviYC413l6OxvGzZHq4KX7zP6qJk8R-yQPTT_pfMelyo7Ur';
      xmlCacheLoc  = '/temp/OL_MORIS_cache/';  // don't forget to change the src path to getCapsBbox.js down below to /temp/OL_MORIS_cache/getCapsBbox.js
      siteTitle    = 'MORIS';
      siteUrl      = 'http://maps.massgis.state.ma.us/map_ol/moris.php';
    </script>
	
	<!-- include a set of tool configs -->
	<script type="text/javascript" src="js/toolConfig_moris.js?<?php echo time(); ?>"></script>

    <script>
      document.title = siteTitle;
    </script>
    <script src="http://maps.google.com/maps/api/js?sensor=false"></script>
	<link rel="stylesheet" type="text/css" href="css/morisoliver.css?<?php echo time(); ?>" />	
    <link rel="stylesheet" type="text/css" href="http://maps.massgis.state.ma.us/ext-3.4.0/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="css/ext-ux-wiz.css" />

<script type="text/javascript" src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>

	<!-- editing tools -->
	<link rel="stylesheet" type="text/css" href="css/statusbar.css" />
	
    <script type="text/javascript" src="http://maps.massgis.state.ma.us/ext-3.4.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="http://maps.massgis.state.ma.us/ext-3.4.0/ext-all.js"></script>

	
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
    <script type="text/javascript" src="js/OpenLayers-2.12-rc7-ie10-fix.js"></script>
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
    <link rel="shortcut icon" href="http://www.mass.gov/czm/images/favicon.ico" type="image/x-icon">
  </head>
</html>
