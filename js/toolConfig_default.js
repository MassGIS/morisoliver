	// Set tools status and settings according to this pattern.  
	
	// It is recommended not to modify this file, but to create alternate 
	// toolConfigs and use those, so that toolConfig files may be shared across
	// different sites.

	// tools - measureTool, identify, bingAddressSearch, exportData
	// 		status - hide, show

	
	var toolSettings = {};
	
	toolSettings.measureTool = {};
	toolSettings.measureTool.status = 'show';
	
	toolSettings.identify = {};
	toolSettings.identify.status = 'show';
	
	toolSettings.bingAddressSearch = {};
	toolSettings.bingAddressSearch.status = 'hide';
	
	toolSettings.exportData = {};
	toolSettings.exportData.status = 'show';		
	
	
	toolSettings.editLayerToolbar = {};
	toolSettings.editLayerToolbar.status = 'hide';

	toolSettings.quickZoomTools = {};
	toolSettings.quickZoomTools.status = 'hide';
	toolSettings.quickZoomTools.tools = [
		{id: 1,   						// ids must be unique
		 label: 'Pick a town',
		 layer: 'massgis:GISDATA.TOWNS_POLYM',
		 valueField: 'TOWN',
		 additionalFields : 'TOWN_ID',	// optional will be requested, often used by other restriction filters
		 hotkey: {					// not required
			"ctrl":true,			// not required if false
			"shift": true,			// not required if false
			"key": "t"
			}
		},
		{id: 2,
		 label: 'Pick an OpenSpace',
		 layer: 'massgis:GISDATA.OPENSPACE_POLY',
		 valueField: 'SITE_NAME',
		 restrict : {
			restrictToolId: 1,
			restrictedValueField: 'TOWN_ID',  // name of the field in this layer
			restrictedSourceField: 'TOWN_ID', // name of the field in the layer we're restricting based on
			required: true
		 }
		},
		{id: 3,
		 label: 'Pick an school',
		 layer: 'massgis:GISDATA.SCHOOLS_PT',
		 valueField: 'NAME',
		 restrict : {
			restrictToolId: 1,
			restrictedValueField: 'TOWN',  // name of the field in this layer
			restrictedSourceField: 'TOWN', // name of the field in the layer we're restricting based on
			required: false
		 }
		}		
	];	
	
	toolSettings.commentTool = {};
	toolSettings.commentTool.status = 'show';
	toolSettings.commentTool.layer = {
		commentLabel: "Add comment",
		commentDesc: "Leave a comment about an error in the data",
		layerName: 'AFREEMAN.GEOSERVER_TEST_PT_COMMENT',
		srs : 'EPSG:26986',
		geometryName : "SHAPE"
		};
	toolSettings.commentTool.fields = [
		{
			name : "U_NAME",
			optionalField: true,
			optionalText : "This field is optional and is collected only to contact you for more information about your comment",
			fieldLabel : "Name",
			maxLength  : 100 // optional
		
		},
		{
			name : "U_ADDR",
			fieldLabel : "Address",
			optionalField: true,
			optionalText : "This field is optional and is collected only to contact you for more information about your comment",
			maxLength  : 100 // optional
		
		},
		{
			name : "U_PHONE",
			fieldLabel : "Phone #",
			optionalField: true,
			optionalText : "This field is optional and is collected only to contact you for more information about your comment",
			maxLength  : 100 // optional
		
		},
		{
			name : "U_EMAIL",
			fieldLabel : "Email",
			optionalField: true,
			optionalText : "This field is optional and is collected only to contact you for more information about your comment",
			maxLength  : 100 // optional
		
		},			
		{
			name : "ISSUE",
			fieldLabel : "Issue",
			maxLength : 100, // optional
			store: ["Road name incorrect","Missing openspace"],
			allowBlank: false,
			xtype: 'combo',
			required:true // adds red asterisk
		
		},
		{
			name : "OBJECTID",
			fieldLabel : "OBJECTID",
			hideLabel: true,
			plugins: [] , // necessary to override to avoid labelling this field
			maxLength : 100, // optional
			allowBlank: false,
			xtype: 'hidden'	,	
			value : -1
		
		},		
		{
			xtype: 'textarea',
			name : "COMMENTS",
			hideLabel: true,
			allowBlank: false,
			required:true, // adds red asterisk
			plugins: [] , // necessary to override to avoid labelling this field
			fieldLabel : "Comments",
			maxLength : 500,
			hideLabel: true,
			flex: 1  // Take up all *remaining* vertical space		
		}		
	];
	
	toolSettings.editTool = {};
	toolSettings.editTool.status = 'show';
	toolSettings.editTool.layers = [
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_LINE",
			layerTitle : "Geoserver Editable Line" // must match whatever is found in folderset for this layer.
		},
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_POLY",
			layerTitle : "Geoserver Editable Polygon" // must match whatever is found in folderset for this layer.
		},
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_PT",
			layerTitle : "Geoserver Editable Point" // must match whatever is found in folderset for this layer.
		},
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_PT_COMMENT",
			layerTitle : "Geoserver Editable Comments" // must match whatever is found in folderset for this layer.
		},		
	];
	toolSettings.editTool.getCapURL = './edit_config/getCapRawV100_single.xml';