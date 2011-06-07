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
	toolSettings.identify.status = 'hide';
	
	toolSettings.bingAddressSearch = {};
	toolSettings.bingAddressSearch.status = 'hide';
	
	toolSettings.exportData = {};
	toolSettings.exportData.status = 'hide';		
	
	
	toolSettings.editLayerToolbar = {};
	toolSettings.editLayerToolbar.status = 'hide';

	toolSettings.quickZoomTools = {};
	toolSettings.quickZoomTools.status = 'show';
	toolSettings.quickZoomTools.tools = [
		{id: 1,   						// ids must be unique
		 label: 'Pick a town',
		 layer: 'massgis:GISDATA.TOWNS_POLYM',
		 valueField: 'TOWN',
		 additionalFields : 'TOWN_ID',	// optional will be requested, often used by other restriction filters
		 displayType: 'select-box', 	// acceptable values - text, select-box
		 hotkey: 'control,shift,t' 		// not required
		},
		{id: 2,
		 label: 'Pick an OpenSpace',
		 layer: 'massgis:GISDATA.OPENSPACE_POLY',
		 valueField: 'SITE_NAME',
		 displayType: 'text', 	// acceptable values - text, select-box
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
		 displayType: 'text', 	// acceptable values - text, select-box
		 restrict : {
			restrictToolId: 1,
			restrictedValueField: 'TOWN',  // name of the field in this layer
			restrictedSourceField: 'TOWN', // name of the field in the layer we're restricting based on
			required: false
		 }
		},		
	];	