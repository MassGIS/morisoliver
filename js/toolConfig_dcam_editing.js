	// Set tools status and settings according to this pattern.  
	
	// It is recommended not to modify this file, but to create alternate 
	// toolConfigs and use those, so that toolConfig files may be shared across
	// different sites.

	// tools - measureTool, identify, bingAddressSearch, exportData
	// 		status - hide, show

	
	var toolSettings = {};

        toolSettings.externalWMS = {};
        toolSettings.externalWMS.status = 'hide';

	
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

        toolSettings.buffer = {};
        toolSettings.buffer.status = 'show';


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
		 label: 'Zoom to a Site',
		 layer: 'massgis:AFREEMAN.DCAM_BLDG_PTS_20120229_DISS',
		 valueField: 'FACILITYCO',
		 zoomOnSelect: true, // optional, defaults to true
		 sortBy : 'FACILITYCO', // optional, fieldname
		 sortOrder : 'A', // optional, acceptable values = A, D
		 additionalFields : 'FACILITYCO'	// optional will be requested, often used by other restriction filters
		}
	];	
	
	toolSettings.commentTool = {};
	toolSettings.commentTool.status = 'hide';
	toolSettings.commentTool.layer = {
		//commentLabel: "Add comment",
		commentDesc: "Leave a comment about an error in the data",
		layerName: 'AFREEMAN.GEOSERVER_TEST_PT_COMMENT',
		srs : 'EPSG:26986',
		geometryName : "SHAPE"
		};

	toolSettings.commentTool.keyMap = {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "c"
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
                        featureType: "AFREEMAN.DCAM_BLDG_PTS_20120229",
                        layerTitle : "Statewide Buildings Points", // must match whatever is found in folderset for this layer.
			allowGeomEdit : false,
                        fields : [
				{
					name : "ASSETCODE", 	
					fieldLabel: "Asset Code"
				},				
                                {
                                        name : "FACILITYCO",
                                        fieldLabel: "Facility Code",
					allowBlank: false
                                },
                                {
                                        name: "ASSETNAME",                   //field name
					fieldLabel: "Asset Name",
					allowBlank: false,
                                        xtype: 'combo',                 // override server data - make this a combobox/drop down
                                        triggerAction: 'all',
                                        store_remote : {
                                                layer : 'massgis:GISDATA.DCAMBLDGS_PT_FACS',
                                                valueField : 'ASSETNAME',
                                                sortBy : 'ASSETNAME',
                                                sortOrder : 'A',
                                                restrict : {
                                                        type : 'quickzoom' // or 'static', or 'url'
                                                        ,value : 1 // qzID (or string, or url param_name
                                                        ,def_val : 'foo'// only meaningful if type='url'
                                                        ,restrictedValueField: 'FACILITYCO'  // name of the field in this layer
                                                        ,restrictedSourceField: 'FACILITYCO' // name of the field in the layer we're restricting based on
                                                }
                                        }
                                },
                                {
                                        name : "MUNICIPALI",
                                        fieldLabel: "Municipality"
                                },
				{
                                        name : "COUNTY",
                                        fieldLabel: "County"
                                },
                                {
                                        name : "YCORDINATE",
                                        hidden: true
                                },
                                {
                                        name : "XCORDINATE",
                                        hidden: true
                                },
                                {
                                        name : "Y_DMS",
                                        hidden: true
                                },
                                {
                                        name : "X_DMS",
                                        hidden: true
                                },
                                {
                                        name : "Y_DD",
                                        hidden: true
                                },
                                {
                                        name : "X_DD",
                                        hidden: true
                                },
                                {
                                        name : "GPS_TRUE_F",
					fieldLabel: "GPS True/False"
                                },
                                {
                                        name : "TEAM",
					fieldLabel : "Team"
                                },
                                {
                                        name : "INSTATE",
                                        hidden: true
                                },
                                {
                                        name : "HOUSE_DIST",
					fieldLabel : "House District"
                                },
                                {
                                        name : "SENATEDIST",
                                        fieldLabel : "Senate District"
                                },
                                {
                                        name : "GISTOWN",
                                        hidden: true
                                },
                                {
                                        name : "MUNICHECK",
                                        hidden: true
                                },
                                {
                                        name : "FACILITY",
                                        fieldLabel : "Facility"
                                },
                                {
                                        name : "PROPSTATUS",
                                        fieldLabel : "Property Status"
                                },
                                {
                                        name : "DCAMNOTE",
                                        fieldLabel : "DCAM Note"
                                },
                                {
                                        name : "ASTCODE10",
                                        fieldLabel : "Ast Code 10"
                                },
                                {
                                        name : "MASIMPCODE",
                                        fieldLabel : "MA Simp Code"
                                },
                                {
                                        name : "GRSQFT",
                                        fieldLabel : "Gross Sq Ft"
                                },
                                {
                                        name : "IMPROVE_NA",
                                        fieldLabel : "Improved Name"
                                }
                        ]
                }
	];

	toolSettings.editTool.allowGeomEdit = false;
	
	toolSettings.navigationTools = {};
	toolSettings.navigationTools.zoomIn = {};
        toolSettings.navigationTools.zoomIn.status = 'show';
	toolSettings.navigationTools.zoomIn.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "z"
	};
	
	toolSettings.navigationTools.zoomOut = {};
        toolSettings.navigationTools.zoomOut.status = 'show';
	toolSettings.navigationTools.zoomOut.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "o"
	};	
	
	
	toolSettings.navigationTools.pan = {};
        toolSettings.navigationTools.pan.status = 'show';
	toolSettings.navigationTools.pan.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "p"
	};		
	
	toolSettings.navigationTools.nextExtent = {};
        toolSettings.navigationTools.nextExtent.status = 'show';
	toolSettings.navigationTools.nextExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "n"
	};	

	toolSettings.navigationTools.maxExtent = {};
        toolSettings.navigationTools.maxExtent.status = 'show';
	toolSettings.navigationTools.maxExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "m"
	};		
	
	toolSettings.navigationTools.initExtent = {};
        toolSettings.navigationTools.initExtent.status = 'show';
	toolSettings.navigationTools.initExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "i"
	};	
	
	toolSettings.navigationTools.prevExtent = {};
        toolSettings.navigationTools.prevExtent.status = 'show';
	toolSettings.navigationTools.prevExtent.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "r"
	};	
		
	toolSettings.navigationTools.zoomScale = {};
        toolSettings.navigationTools.zoomScale.status = 'show';
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
