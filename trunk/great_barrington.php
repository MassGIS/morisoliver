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
      var foldersetLoc = '/temp/great_barrington_folderset.xml';
var moreInfoHTML = '<table border="0" width=100% cellpadding=0 cellspacing=10><tr><td align=left><a target="_blank" href="http://www.mass.gov/mgis"><img border=none src="img/munimapper_logo.jpg" alt="MuniMapper Logo"></a></td><td align="center"><img border=none src="img/state_seal.png" alt="MA State Seal"></td><td align="right"><a target="_blank" href="http://www.mass.gov"><img border=none src="img/massgis.png" alt="MassGIS Logo"></a></td></tr><tr><td colspan=3 class="dirText"><p style="text-align:justify">The Municipal Mapper (MuniMapper) is based on an online mapping tool called OLIVER, which was created for the <a target="_blank" href="http://www.mass.gov/czm">Massachusetts Office of Coastal Zone Management (CZM)</a>, the <a target="_blank" href="http://www.mass.gov/mgis">Office of Geographic Information (MassGIS)</a>, <a target="_blank" href="http://www.seaplan.org">SeaPlan (formerly the Massachusetts Ocean Partnership)</a> and <a target="_blank" href="http://www.asascience.com">Applied Science Associates (ASA)</a>, <a href="http://2creek.com" target="_blank">Charlton Galvarino</a>, and <a href="http://peoplegis.com/" target="_blank">PeopleGIS</a>. MuniMapper can be used to search, display, and share spatial data pertaining to municipalities.  Users can quickly create and share maps and download data for use in a Geographic Information System (GIS).  In 2011, the OLIVER system was upgraded to a new web-based thin client using <a target="_blank" href="http://www.geoext.org">GeoExt</a> and <a target="_blank" href="http://www.openlayers.org">OpenLayers<a>.  It continues to use <a target="_blank" href="http://www.geoserver.org">GeoServer</a>-based <a target="_blank" href="https://wiki.state.ma.us/confluence/display/massgis">MassGIS web mapping services</a>.  The project was graciously funded by <a target="_blank" href="http://www.seaplan.org">SeaPlan</a>.  OLIVER was developed using open source technology - the OLIVER codebase is free for use and modification under the GNU General Public License.  More information about the open source nature of OLIVER can be found at the <a target="_blank" href="https://wiki.state.ma.us/confluence/display/massgis/OLIVER+and+customizations">OLIVER Developer web site</a>.<br><br/><a target="_blank" href="http://www.mass.gov/mgis">MassGIS</a> is the Office of Geographic Information, within the <a target="_blank" href="http://www.mass.gov/itd">Information Technology Division (ITD)</a>.</a>  Through MassGIS, the Commonwealth has created a comprehensive, statewide database of geospatial information.  The state legislature has established MassGIS as the official state agency assigned to the collection, storage and dissemination of geographic data.  In addition, the <a target="_blank" href="http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/about-massgis/mandate.html">legislative mandate</a> includes coordinating GIS activity within the Commonwealth and setting standards for geographic data to ensure universal compatibility.<br/><br/>Please contact <a href="mailto:Paul.Nutting@state.ma.us">Paul.Nutting@state.ma.us</a> with questions or comments.  Last Updated October 2, 2012.</p></td></tr><tr><td></td><td></td><td align=right><a target="_blank" href="http://www.mass.gov"><img border=none src="img/itd-logo-200x91.jpg" alt="ITD Logo"></a></td></tr></table>';
      var helpUrl1       = 'munimapper_users_documentation.htm';
      var helpUrl2       = 'MuniMapper_users_documentation.pdf';
      var moreInfoWidth = 675;

       var availableBase       = [
         'openStreetMap'
         ,'bingAerial'
         ,'bingHybrid'
         ,'TopOSM-MA'
         ,'Basemaps_Orthos_DigitalGlobe2011_2012'
	 ,'MassGIS_Basemap'
       ];

      var defaultBase         = 'MassGIS_Basemap';   
      var defaultBaseOpacity  = 1;
      var defaultCoordUnit    = 'm';    // can be one of 'dms','dd','m'
      var defaultMeasureUnit  = 'm';      // can be one of 'm','mi','nm','yd','ft'
      var defaultLyrs         = [
         {wms : 'Basemaps_Structures'                       ,title : 'Structures'}
        ,{wms : 'Basemaps_L3Parcels'                        ,title : 'Tax Parcels'}
        ,{wms : 'Basemaps_MassGISBasemapWithLabels2'        ,title : 'Detailed Features'}
        ,{wms : 'massgis:GreatBarringtonEnvironsL3TaxParAssess'     ,title : 'Tax Parcels for Query'}
        ,{wms : 'massgis:GISDATA.NAVTEQRDS_ARC'             ,title : 'Roads for Query'}
//	,{wms : 'massgis:GISDATA.TOWNSSURVEY_POLYM'         ,title : 'MA Towns Survey Boundaries'  }
      ];
      var defaultBbox = [-73.41587,42.16842,-73.26069,42.25284];
      var maxBbox     = [-73.41587,42.16842,-73.26069,42.25284];
      var wfsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
      var wmsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms';
      var wcsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wcs';
      var kmlUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms/kml';
      var namespaceUrl = 'http://massgis.state.ma.us/featuretype';
      var featurePrefix = 'massgis';

var bannerHTML = '<table border="0" style="font-family:Arial;font-size:22"><tr><td><a target="_blank" href="http://www.townofgb.org"><img src="img/great_barrington_seal.png" alt="Great Barrington, MA town seal"/></a></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td><font size=+3>MuniMapper: Great Barrington, MA</font><br/><font size=-1><a target="_blank" href="http://www.townofgb.org">Town of Great Barrington Web Site</a><br/><a target="_blank" href="munimapper_disclaimer.html">Disclaimer<font></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td><img src="img/munimapper_web.png" alt="MuniMapper logo"></td></tr>';
      var bannerHeight = 117;
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
      bingKey      = 'AoSoMDQG3JYNMtfp-sviYC413l6OxvGzZHq4KX7zP6qJk8R-yQPTT_pfMelyo7Ur';
      xmlCacheLoc  = '/temp/OL_MORIS_cache/';  // don't forget to change the src path to getCapsBbox.js down below to /temp/OL_MORIS_cache/getCapsBbox.js
      siteTitle    = 'MuniMapper: Great Barrington, MA';
      siteUrl      = 'http://maps.massgis.state.ma.us/map_ol/great_barrington.php';
    </script>

	<!-- include a set of tool configs -->
	<script type="text/javascript" src="js/toolConfig_great_barrington.js?<?php echo time(); ?>"></script>	
	<script type="text/javascript" src="js/toolConfig_sample_filter_great_barrington.js?<?php echo time(); ?>"></script>	
    <script>
      document.title = siteTitle;
    </script>
    <script src="http://maps.google.com/maps/api/js?sensor=false"></script>       
	<link rel="stylesheet" type="text/css" href="css/morisoliver.css?<?php echo time(); ?>" />
    <link rel="stylesheet" type="text/css" href="http://maps.massgis.state.ma.us/ext-3.4.0/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="css/ext-ux-wiz.css" />

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
    <script type="text/javascript" src="js/jsts/javascript.util.js"></script>
    <script type="text/javascript" src="js/jsts/jsts.js"></script>


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
