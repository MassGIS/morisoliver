	// Set tools status and settings according to this pattern.  
	
	// It is recommended not to modify this file, but to create alternate 
	// toolConfigs and use those, so that toolConfig files may be shared across
	// different sites.

	// tools - measureTool, identify, bingAddressSearch, exportData
	// 		status - hide, show

	
	var toolSettings = {};


        toolSettings.externalWMS = {}
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

	toolSettings.permalink = {};
	toolSettings.permalink.status = 'show';
	toolSettings.permalink.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "k"
	};	
	
	toolSettings.scaleSettings = {};
	toolSettings.scaleSettings.status = 'hide';
	toolSettings.scaleSettings.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "g"
	};	


	toolSettings.mapUnits = {};
	toolSettings.mapUnits.status = 'hide';
	toolSettings.mapUnits.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "u"
	};	


	toolSettings.basemaps = {};
	toolSettings.basemaps.status = 'hide';
	toolSettings.basemaps.keyMap =  {					// not required
		"ctrl":true,			// not required if false
		"alt": true,			// not required if false
		"key": "b"
	};	
	

        toolSettings.identify = {};
        toolSettings.identifyPoly = {};
        toolSettings.identify.status = 'show';
        toolSettings.identifyPoly.status = 'hide';

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
	toolSettings.quickZoomTools.status = 'hide';
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
		},
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
			required:true, // adds red asterisk for comment only
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
			featureType: "DAR.FIELDS_PONDS_ORG1000",
			layerTitle : "DAR Organic Farms ORG1000", // must match whatever is found in folderset for this layer.
			fields : [
				{
					name : "ENTITY_ID", 	
					fieldLabel: "User Name",
					allowBlank : false,  
					readOnly: true,
					value: "ORG1000"
				},
				{
					name: "SHAPE_LENG",
					hidden: true
				},
				{
					name: "SPRAY_NOT_",	
					fieldLabel: "Spray or Not",
					allowBlank : false,
					triggerAction: 'all',
					xtype: 'combo',		
					store: ["Do not spray","Spray"]
				},
				{
					name: "FLD_PD_NAM",
					fieldLabel: "Field/Pond Name",
					allowBlank : false		
				},
				{
					name: "LOC_DESC",
					fieldLabel: "Address/Location",
					allowBlank: false
				},
                                {
                                        name: "LOC_TOWN",                   //field name
					fieldLabel: "Town",
					allowBlank: false,
                                        xtype: 'combo',                 // override server data - make this a combobox/drop down
                                        triggerAction: 'all',
                                        store_remote : {
                                                layer : 'massgis:GISDATA.TOWNS_POLYM',
                                                valueField : 'TOWN',
                                                sortBy : 'TOWN',
                                                sortOrder : 'A'
                                        }
                                },
                         	{
 					name: "APROX_ACRE",
					fieldLabel: "Approximate acres"			
				},
				{
					name: "MAP_DATE",
					auto_timestamp : "Y-m-d\\TH:i:s",
					hidden: true
				},
				{
					name: "MAP_NOTES",
					fieldLabel: "Notes"
				},
				{
					name: "LOC_SCORE",
					hidden: true
				},
				{
					name: "GIS_ACRES",
					fieldLabel: "GIS Acres",
					readOnly: true
				},
				{
					name: "FLD_PND_ID",
                                        readOnly: true,
					hidden: true
				},
                                {
                                        name: "CERT_ORG",
					allowBlank : false,
					fieldLabel: "Certification Org.",
					triggerAction: 'all',
					xtype: 'combo',
					store: ["Baystate Organic Certifiers","Stellar Cerfication Services","USDA","California Certified Organic Farms","Other"]
                                }
			]
		}
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
