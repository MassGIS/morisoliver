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
      var foldersetLoc = '/temp/dcr_wspa_folderset.xml';
var moreInfoHTML = '<table border="0" width=100% cellpadding=0 cellspacing=10><tr><td align=left><a target="_blank" href="http://www.mass.gov/eea/agencies/dcr/"><img border=none src="img/dcr_logo_plant.jpg" alt="DCR Logo"></a><font size="+2">DCR</font></td></tr><tr><td colspan=3 class="dirText"><p style="text-align:justify">Welcome to the Mass.gov Watershed Protection Act (WsPA) Viewer.  You can use this viewer to find information on how the Watershed Protection Act (WsPA) affects parcels in the Quabbin, Ware and Wachusett watersheds.  <br/><br/>This viewer provides an initial interpretation of parcels affected by the WsPA. The DCR can not guarantee that all parcels are represented by this data viewer. The DCR utilizes field verification to determine the final boundaries of the WsPA protection zones. It is the responsibility of the land owner to be in compliance with the Watershed Protection Act. You are encouraged to contact the <a target="_blank" href="http://www.mass.gov/eea/agencies/dcr/water-res-protection/watershed-mgmt/">Department of Conservation and Recreation, Division of Water Supply Protection, Office of Watershed Management</a> if you intend to build on, or otherwise alter, a piece of property in the watershed system.  <br/><br/>Parcel data is not guaranteed to be the most recently available data. DCR is working to update this information in a timely manner. In the meantime, some parcels may not be represented or the parcel numbering system may be out-of-date. If you can not find a parcel by a map and lot number, please utilize the address search tool or the zoom tools.  Not all Bordering Vegetated Wetland (BVW) that may be regulated are shown on this map. The extent of BVWs is determined on a case by case basis by the local Conservation Commission. Low Yield Aquifers in the Wachusett Reservoir may also be regulated but are not shown on this map. Please consult with DCR to determine extent and applicability of the Watershed Protection Act.</p></td></tr></table>';
      var helpUrl1       = 'moris_users_documentation.htm';
      var helpUrl2       = 'moris_users_documentation.pdf';
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
         ,'Basemaps_Orthos_DigitalGlobe2011_2012'
	 ,'MassGIS_Basemap'
       ];


      var defaultBase         = 'MassGIS_Basemap';   
      var defaultBaseOpacity  = 1;
      var defaultCoordUnit    = 'm';    // can be one of 'dms','dd','m'
      var defaultMeasureUnit  = 'm';      // can be one of 'm','mi','nm','yd','ft'
      var defaultLyrs         = [
        {wms : 'massgis:GISDATA.QWWTOWNBUFFERD_POLY'      ,title : 'Watershed Protection Act Secondary Zone'}
        ,{wms : 'massgis:GISDATA.QWWTOWNBUFFERD_POLY'      ,title : 'Watershed Protection Act Primary Zone'}
        ,{wms : 'massgis:GISDATA.OPENSPACE_POLY_SV_DCR_FEE'    ,title : 'DCR Owned Property'}
        ,{wms : 'massgis:GISDATA.HYDRO25K_ARC'             ,title : 'Streams'}
        ,{wms : 'massgis:GISDATA.HYDRO25K_POLY'            ,title : 'Lakes'}
        ,{wms : 'massgis:GISDATA.TRAINS_ARC'               ,title : 'Railway'} 
        ,{wms : 'massgis:GISDATA.QWWAIRPORT_POLY'          ,title : 'Airport'}
        ,{wms : 'Basemaps_Structures'                      ,title : 'Structures'}
        ,{wms : 'Basemaps_L3Parcels'                       ,title : 'Tax Parcels'}
        ,{wms : 'massgis:GISDATA.QWWTOWNBUFFERD_POLY'      ,title : 'Watershed Protection Act Secondary Zone Outline'}
        ,{wms : 'massgis:GISDATA.QWWTOWNBUFFERD_POLY'      ,title : 'Watershed Protection Act Primary Zone Outline'}
        ,{wms : 'massgis:GISDATA.QWWBAS_POLY'              ,title : 'Quabbin, Ware, Wachusett Basins'}
        ,{wms : 'Basemaps_MassGISBasemapWithLabels2'       ,title : 'Detailed Features'}
        ,{wms : 'massgis:GISDATA.QWWBAS_POLY'              ,title : 'Quabbin, Ware, Wachusett Basins Labels'}
        ,{wms : 'massgis:GISDATA.L3_TAXPAR_POLY_ASSESS'    ,title : 'Tax Parcels for Query'}
      ];
      var defaultBbox = [-72.50345,42.22964,-71.62798,42.60425];
      var maxBbox     = [-72.50345,42.22964,-71.62798,42.60425];
      var wfsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
      var wmsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms';
      var wcsUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wcs';
      var kmlUrl = 'http://giswebservices.massgis.state.ma.us/geoserver/wms/kml';
      var namespaceUrl = 'http://massgis.state.ma.us/featuretype';
      var featurePrefix = 'massgis';
      var bannerHTML = '<table style="font-family:Arial"><tr><td><a target="_blank" href="http://www.mass.gov/eea/agencies/dcr/"><img src="img/dcr_logo_plant.jpg" alt="DCR logo"/></a></td><td>&nbsp;&nbsp;</td><td><font size="+2">DCR Watershed Protection Act (WsPA) Viewer</font></td><td>&nbsp;&nbsp;</td><td><a target="_blank" href="http://www.mass.gov/eea/agencies/dcr/water-res-protection/watershed-mgmt/the-watershed-protection-act.html">Watershed Protection Act Information</a></td></tr>';
      var bannerHeight = 75;
      var externalGetCaps = {
//        'http://egisws02.nos.noaa.gov/ArcGIS/services/MPA/MPA_Inventory/MapServer/WMSServer' : {
//         name    : 'NOAA : Marine Protected Areas'
//         ,getcaps : 'noaa_marine_protected_areas_getcaps.xml'
//         ,proj    : {'EPSG:900913' : 'EPSG:3857'}
//       },
        'http://mhc-macris.net:8080/geoserver/wms' : {
         name    : 'MHC Historic Inventory'
         ,getcaps : 'mhc_getcaps.xml'
         ,proj    : {'EPSG:900913' : 'EPSG:3857'}
       },
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
<!-- test new Bing key created 5/23/2013 to track usage -->
      bingKey      = 'AoSoMDQG3JYNMtfp-sviYC413l6OxvGzZHq4KX7zP6qJk8R-yQPTT_pfMelyo7Ur';
      xmlCacheLoc  = '/temp/OL_MORIS_cache/';  // don't forget to change the src path to getCapsBbox.js down below to /temp/OL_MORIS_cache/getCapsBbox.js
      siteTitle    = 'DCR Watershed Protection Act (WsPA) Viewer';
      siteUrl      = 'http://maps.massgis.state.ma.us/map_ol/dcr_wspa.php';
    </script>

	<!-- include a set of tool configs -->
	<script type="text/javascript" src="js/toolConfig_dcr_wspa.js?<?php echo time(); ?>"></script>	
	
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
