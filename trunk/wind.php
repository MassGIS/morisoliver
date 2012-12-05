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
      var foldersetLoc = '/temp/wind_folderset.xml';
var moreInfoHTML = '<table border="0" width=100% cellpadding=0 cellspacing=10><tr><td align=left><a target="_blank" href="http://www.mass.gov/czm"><img border=none src="img/czm_sda2.png" alt="CZM Logo"></a></td><td align="center" <img border=none src="img/oliver_logo_lcase.jpg" alt="OLIVER logo"></td><td align="right"><a target="_blank" href="http://www.mass.gov/mgis"><img border=none src="img/massgis.png" alt="MassGIS Logo"></a></td></tr><tr><td colspan=3 class="dirText"><p style="text-align:justify"><a target="_blank" href="http://www.mass.gov/czm/mapping">The Massachusetts OnLIne ViewER (OLIVER)</a> is an online mapping tool created by the <a target="_blank" href="http://www.mass.gov/czm">Massachusetts Office of Coastal Zone Management (CZM)</a>, the <a target="_blank" href="http://www.mass.gov/mgis">Office of Geographic Information (MassGIS)</a>, <a target="_blank" href="http://www.seaplan.org">SeaPlan (formerly the Massachusetts Ocean Partnership)</a> and <a target="_blank" href="http://www.asascience.com">Applied Science Associates (ASA)</a>, <a href="http://2creek.com" target="_blank">Charlton Galvarino</a>, and <a href="http://peoplegis.com/" target="_blank">PeopleGIS</a>. OLIVER can be used to search, display, and share spatial data pertaining to Massachusetts.  Users can quickly create and share maps and download data for use in a Geographic Information System (GIS).  In 2011, the OLIVER system was upgraded to a new web-based thin client using <a target="_blank" href="http://www.geoext.org">GeoExt</a> and <a target="_blank" href="http://www.openlayers.org">OpenLayers<a>.  It continues to use <a target="_blank" href="http://www.geoserver.org">GeoServer</a>-based <a target="_blank" href="http://lyceum.massgis.state.ma.us">MassGIS web mapping services</a>.  The project was graciously funded by SeaPlan.<br/><br/>OLIVER was developed using open source technology - the OLIVER codebase is free for use and modification under the GNU General Public License.  More information about the open source nature of OLIVER can be found at the <a target="_blank" href="http://maps.massgis.state.ma.us/map_ol/moris_developers_documentation.htm">OLIVER Developer web site</a>.<br><br>The mission of CZM is to balance the impacts of human activity with the protection of coastal and marine resources.  As a networked program, CZM was specifically established to work with other state agencies, federal agencies, local governments, academic institutions, nonprofit groups, and the general public to promote sound management of the Massachusetts coast.  CZM is funded primarily through the <a target="_blank" href="http://www.mass.gov">Commonwealth of Massachusetts</a>, the <a target="_blank" href="http://www.noaa.gov">National Oceanic and Atmospheric Administration (NOAA)</a> and the <a target="_blank" href="http://www.epa.gov">U.S. Environmental Protection Agency (EPA)</a>.<br/><br/><a target="_blank" href="http://www.mass.gov/mgis">MassGIS</a> is the Office of Geographic Information, within the <a target="_blank" href="http://www.mass.gov/itd">Information Technology Division (ITD)</a>.</a>  Through MassGIS, the Commonwealth has created a comprehensive, statewide database of geospatial information.  The state legislature has established MassGIS as the official state agency assigned to the collection, storage and dissemination of geographic data.  In addition, the <a target="_blank" href="http://www.mass.gov/mgis/mandate.htm">legislative mandate</a> includes coordinating GIS activity within the Commonwealth and setting standards for geographic data to ensure universal compatibility.<br/><br/><a target="_blank" href="http://www.seaplan.org">SeaPlan</a> aims to advance science-based and stakeholder informed ocean management by enhancing knowledge, relationships and management tools through effective practice of ecosystem-based coastal and marine spatial planning (CMSP) and the dissemination of its products.  The application is one example of the initiative of SeaPlan to advance an integrated data network to improve the accessibility and interoperability of coastal and marine data for ocean management and other marine related uses.<br/><br/>Please contact <a href="mailto:Paul.Nutting@state.ma.us">Paul.Nutting@state.ma.us</a> with questions or comments.  Last Updated November 30, 2011</p></td></tr><tr><td align=left><a target="_blank" href="http://www.seaplan.org"><img border=none src="img/mop.png" alt="SeaPlan Logo"></a></td><td align=center><a target="_blank" href="http://www.asascience.com" <img border=none src="img/asa.png" alt="ASA Logo"></a></td></tr></table>';
      var helpUrl1       = 'http://maps.massgis.state.ma.us/map_ol/moris_users_documentation.htm';
      var helpUrl2       = 'http://maps.massgis.state.ma.us/map_ol/moris_users_documentation.pdf';
      var moreInfoWidth = 850;

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

      var defaultBase         = 'custom';   
      var defaultBaseOpacity  = 1;
      var defaultCoordUnit    = 'm';    // can be one of 'dms','dd','m'
      var defaultMeasureUnit  = 'm';      // can be one of 'm','mi','nm','yd','ft'

      var defaultLyrs         = [
        {wms : 'massgis:GISDATA.NEMASK_POLY_MASURVEY'                    ,title : 'States Bordering MA plus ME'}
       ,{wms : 'massgis:DMARRIER.WINDGRID200M_DISS70'                    ,title : 'Annual Mean Wind Speeds at 70 Meters'} 
       ,{wms : 'massgis:GISDATA.HYDRO25K_POLY'				 ,title : 'Lakes and Ponds'}
       ,{wms : 'massgis:GISDATA.HYDRO25K_ARC'				 ,title : 'Hydrography Linear Features'}
       ,{wms : 'massgis:GISDATA.WETLANDSDEP_POLY'			 ,title : 'DEP Wetlands Polygons'}
       ,{wms : 'massgis:GISDATA.WETLANDSDEP_ARC'			 ,title : 'DEP Wetlands Linear Features'}
       ,{wms : 'massgis:GISDATA.WINDSPEEDGRID200_POLY'                   ,title : 'Higher Wind Resources Annual Mean Wind Speeds at 70 Meters (Colored Cells)'}
       ,{wms : 'massgis:GISDATA.CONTOURS5K_ARC'				 ,title : 'Elevation Contour Intervals'}
       ,{wms : 'massgis:GISDATA.WINDSPEEDGRID200_POLY'			 ,title : 'Lower Wind Speed Area (Mask)'}
       ,{wms : 'massgis:GISDATA.OPENSPACE_POLY'				 ,title : 'Protected OpenSpace'}
       ,{wms : 'massgis:DMARRIER.RESBUFF1000'				 ,title : '1000 Ft. Residential Buffer'}
       ,{wms : 'massgis:DMARRIER.WINDGRID200M_DISS70'			 ,title : 'Higher Wind Resources Annual Mean Wind Speeds at 70 Meters (Dot Pattern)'}
       ,{wms : 'massgis:DMARRIER.HIGHWIND_BNDRY_70M'                     ,title : 'Higher Wind Resource (Boundary)'}
       ,{wms : 'massgis:l3_taxpar_poly_assess'				 ,title : 'Parcels Level 3 No Roads'}
       ,{wms : 'massgis:GISDATA.EOTMAJROADS_RTE_MAJOR'                   ,title : 'Major MassDOT Routes'}
       ,{wms : 'massgis:GISDATA.EOTROADS_ARC'                            ,title : 'MassDOT Roads by Admin'}
       ,{wms : 'massgis:GISDATA.EOTROADS_ARC'                            ,title : 'MassDOT Roads Shields'}
       ,{wms : 'massgis:GISDATA.EOTROADS_ARC'                            ,title : 'MassDOT Roads Street Names'}
       ,{wms : 'massgis:GISDATA.EXITS_PT'				 ,title : 'MassDOT Exits'}
       ,{wms : 'massgis:GISDATA.TOWNSSURVEY_POLYM'			 ,title : 'Town Boundaries'}
       ,{wms : 'massgis:GISDATA.TOWNSSURVEY_POLYM'                       ,title : 'Town Boundaries Labels'}
       ,{wms : 'massgis:GISDATA.AIRPORTS_PT'				 ,title : 'Airports'}
       ,{wms : 'massgis:GISDATA.GEONAMES_PT_PLACES'			 ,title : 'Place Names'}
       ,{wms : 'massgis:GISDATA.GEONAMES_PT_HYPSO'			 ,title : 'Land Feature Names'}
       ,{wms : 'massgis:GISDATA.GEONAMES_LINE_HYDRO'			 ,title : 'Hydrography Names'}
      ];

      var defaultBbox = [-73.939378,41.041696,-69.177200,43.038347];
      var maxBbox     = [-76.211689,39.586711,-67.191604,44.798225];
      var wfsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
      var wmsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms';
      var wcsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wcs';
      var kmlUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms/kml';
      var namespaceUrl = 'http://massgis.state.ma.us/featuretype';
      var featurePrefix = 'massgis';
var bannerHTML = '<table border="0" style="font-family:Arial"><tr><td><a target="_blank" href="http://www.mass.gov"><img src="img/MAseal_small.gif" alt="small state seal"/></a></td><td><a target="_blank" href="http://www.mass.gov/envir"><img src="img/eoeacolorlogosmall.gif" alt="small EOEA logo"/></a></td><td>&nbsp;</td><td><a target="_blank" href="http://www.mass.gov/mgis"><img src="img/massgis.gif" alt="small MassGIS logo"/></a></td><td>&nbsp;</td><td><font size="+1">Wind Energy Large Scale Site Screening Tool</font></td><td><font size="-1">&nbsp;&nbsp;&nbsp;Featured towns with both parcel and significant high wind will be highlighted in turquoise.  Map layers will draw and label at different scales.  <br/>&nbsp;&nbsp;&nbsp;<a target="_blank" href="http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/windspeed.html">Wind Speed Info</a>&nbsp;&nbsp;<a target="_blank" href="wind/help_map_large.htm">What is on the map?</a>&nbsp;&nbsp;Problems? <a href=mailto:Daniel.Marrier@state.ma.us>Dan Marrier</a> 617-626-4537</font></td></tr>';
      var bannerHeight = 75;
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
      siteTitle    = 'Wind Energy Large Scale Site Screening Tool';
      siteUrl      = 'http://maps.massgis.state.ma.us/map_ol/wind.php';
    </script>

	<!-- include a set of tool configs -->
	<script type="text/javascript" src="js/toolConfig_wind.js?<?php echo time(); ?>"></script>	
	
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
