	// Set tools status and settings according to this pattern.  
	
	// It is recommended not to modify this file, but to create alternate 
	// toolConfigs and use those, so that toolConfig files may be shared across
	// different sites.

	// tools - measureTool, identify, bingAddressSearch, exportData
	// 		status - hide, show

	
	var toolSettings = {};
	
	toolSettings.measureTool = {};
	toolSettings.measureTool.status = 'show';
	toolSettings.measureTool.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "a"
	};	

        toolSettings.clearMeasure = {};
        toolSettings.clearMeasure.keyMap = {   // not required
                "ctrl":true,                    // not required if false
                "alt": true,                    // not required if false
                "key": "h"
        };

	toolSettings.permalink = {};
	toolSettings.permalink.status = 'show';
	toolSettings.permalink.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "k"
	};	
	
	toolSettings.scaleSettings = {};
	toolSettings.scaleSettings.status = 'show';
	toolSettings.scaleSettings.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "g"
	};	


	toolSettings.mapUnits = {};
	toolSettings.mapUnits.status = 'show';
	toolSettings.mapUnits.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "u"
	};	


	toolSettings.basemaps = {};
	toolSettings.basemaps.status = 'show';
	toolSettings.basemaps.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "b"
	};	
	

        toolSettings.identify = {};
        toolSettings.identifyPoly = {};
        toolSettings.identify.status = 'show';
        toolSettings.identifyPoly.status = 'show';

        toolSettings.identify.identify_keymap = {
                "ctrl":true,                    // not required if false
                "alt": true,                    // not required if false
                "key": "f"
        };

        toolSettings.identifyPoly.identifyPoly_keymap = {
                "ctrl":true,                    // not required if false
                "alt": true,                    // not required if false
                "key": "v"
        };
	
	toolSettings.bingAddressSearch = {};
	toolSettings.bingAddressSearch.status = 'show';
	toolSettings.bingAddressSearch.keyMap = {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "l"
	};	

        toolSettings.bingSearchClear = {};
        toolSettings.bingSearchClear.keyMap = {   // not required
                "ctrl":true,                    // not required if false
                "alt": true,                    // not required if false
                "key": "j"
        };
	
	toolSettings.exportData = {};
	toolSettings.exportData.status = 'show';	
	toolSettings.exportData.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "x"
	};	

        toolSettings.printSave = {};
        toolSettings.printSave.status = 'show';
        toolSettings.printSave.keyMap =  {                                     // not required
                "ctrl":true,                    // not required if false
                "alt": true,                    // not required if false
                "key": "w"
        };

	
	toolSettings.quickZoomTools = {};
	toolSettings.quickZoomTools.status = 'show';
	toolSettings.quickZoomTools.tools = [
		{id: 1,   						// ids must be unique
		 label: 'Pick a town',
		 layer: 'massgis:GISDATA.TOWNS_POLYM',
		 valueField: 'TOWN',
		 sortBy : 'TOWN', // optional, fieldname
		 sortOrder : 'A', // optional, acceptable values = A, D
		 additionalFields : 'TOWN_ID',	// optional will be requested, often used by other restriction filters
		 keyMap: {					// not required
			"ctrl":true,			// not required if false
			"alt": true,			// not required if false
			"key": "t"
			}
		}
/*		,
		{id: 2,
		 label: 'Pick an OpenSpace',
		 layer: 'massgis:GISDATA.OPENSPACE_POLY',
		 valueField: 'SITE_NAME',
		 sortBy : 'SITE_NAME', // optional, fieldname
		 sortOrder : 'D', // optional, acceptable values = A, D		 
		 restrict : {
			restrictToolId: 1,
			restrictedValueField: 'TOWN_ID',  // name of the field in this layer
			restrictedSourceField: 'TOWN_ID', // name of the field in the layer we're restricting based on
			required: true
		 },
		 keyMap: {					// not required
			"ctrl":true,			// not required if false
			"alt": true,			// not required if false
			"key": "o"
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
		}		*/
	];	
	
	toolSettings.commentTool = {};
	toolSettings.commentTool.status = 'show';
	toolSettings.commentTool.layer = {
		//commentLabel: "Add comment",
		commentDesc: "Leave a comment about an error in the data",
		layerName: 'AFREEMAN.GEOSERVER_TEST_PT_COMMENT2',
		srs : 'EPSG:26986',
		geometryName : "SHAPE",
                submitUrl : "/map_ol_mop/test_comment.php",
                onSubmitRefreshLayer : true
		};

	toolSettings.commentTool.keyMap = {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "c"
	};
	
	toolSettings.commentTool.fields = [
		{
			name : "PLACENAME",
			optionalField: true,
			optionalText : "Place Name",
			fieldLabel : "Place Name",
			maxLength  : 150 // optional
		
		},
                {
                        name : "NOTES",
                        optionalField: false,
                        optionalText : "Notes",
                        fieldLabel : "Notes",
                        maxLength  : 250 // optional

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
		
		}		
	];
	
	toolSettings.editTool = {};
	toolSettings.editTool.status = 'hide';

	toolSettings.editTool.keyMap_draw = {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "d"
	};

	toolSettings.editTool.keyMap_edit = {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "e"
	};
	
	toolSettings.editTool.layers = [
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_LINE",
			layerTitle : "Geoserver Editable Line", // must match whatever is found in folderset for this layer.
			split: true,
			snapTo: ["AFREEMAN.GEOSERVER_TEST_LINE","AFREEMAN.GEOSERVER_TEST_PT_COMMENT"]
		}
/*,
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_POLY",
			layerTitle : "Geoserver Editable Polygon" // must match whatever is found in folderset for this layer.
		},
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_PT",
			layerTitle : "Geoserver Editable Point - HTTPS" // must match whatever is found in folderset for this layer.
		}
		*/
		,{
			featureType: "AFREEMAN.GEOSERVER_TEST_PT_COMMENT",
			layerTitle : "Geoserver Editable Comments" // must match whatever is found in folderset for this layer.
		}
	/*
		,{
			featureType: "test_geoserver_line",
			layerTitle : "MapsOnline Geoserver Line", // must match whatever is found in folderset for this layer.
			split: true
		}
*/
	];
	
	toolSettings.navigationTools = {};
	toolSettings.navigationTools.zoomIn = {};
	toolSettings.navigationTools.zoomIn.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "z"
	};
	
	toolSettings.navigationTools.zoomOut = {};
	toolSettings.navigationTools.zoomOut.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "o"
	};	
	
	
	toolSettings.navigationTools.pan = {};
	toolSettings.navigationTools.pan.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "p"
	};		
	
	toolSettings.navigationTools.nextExtent = {};
	toolSettings.navigationTools.nextExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "n"
	};	

	toolSettings.navigationTools.maxExtent = {};
	toolSettings.navigationTools.maxExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "m"
	};		
	
	toolSettings.navigationTools.initExtent = {};
	toolSettings.navigationTools.initExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "i"
	};	
	
	toolSettings.navigationTools.prevExtent = {};
	toolSettings.navigationTools.prevExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "r"
	};	
		
	toolSettings.navigationTools.zoomScale = {};
	toolSettings.navigationTools.zoomScale.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "s"
	};		
	
	toolSettings.help = {};
	toolSettings.help.keyMap ={					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "q" // because ctrl-alt-h was a conflict
	};		
	
	var additionalSettings = {};
	additionalSettings.layerList = {};
	additionalSettings.layerList.searchBox = {};
	additionalSettings.layerList.searchBox.keyMap = {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "y"
	};
