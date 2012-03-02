	// Set tools status and settings according to this pattern.  
	
	// It is recommended not to modify this file, but to create alternate 
	// toolConfigs and use those, so that toolConfig files may be shared across
	// different sites.

	// tools - measureTool, identify, bingAddressSearch, exportData
	// 		status - hide, show

	
	var toolSettings = {};


        toolSettings.externalWMS = {}
        toolSettings.externalWMS.status = 'show';

	
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
		 width:125, // optional, defaults to 200
		 resetOnMove : false,  // optional, defaults to true
		 zoomOnSelect: true, // optional, defaults to true
		 sortBy : 'TOWN', // optional, fieldname
		 sortOrder : 'A', // optional, acceptable values = A, D
		 additionalFields : 'TOWN_ID',	// optional will be requested, often used by other restriction filters
		 spatialFilter : {
			type: "INTERSECT",
			geomField: "massgis:SHAPE",
			checkForSingleValueOnMapMove: true
		 },
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
	toolSettings.commentTool.status = 'show';
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
			featureType: "AFREEMAN.GEOSERVER_TEST_LINE",
			layerTitle : "Geoserver Editable Line", // must match whatever is found in folderset for this layer.
			split: true,
			//snapTo: ["AFREEMAN.GEOSERVER_TEST_LINE","AFREEMAN.GEOSERVER_TEST_PT_COMMENT"],
			fields : [
				{
					name : "TEST_ID",
					allowBlank: false,
					value:123// doesn't work
					
				
				},	
				{
					name : "NAME",
					//hidden : true,
				
					//store: ["Road name incorrect","Missing openspace"],
					store_val_labels: [["rd_inc","Road name incorrect"],["msg_os","Missing Openspace"],["wrong","Wrong stuff"],["oth","Other issue"]],	// vs. store_val_labels: [[val,label],[val,label],[val,label]]
					
					allowBlank: true,  // provides visual cue		 
					//readOnly:true,
					xtype: 'combo' // leave out for text
					//,value: "This is a test default value"// 			
				}	

			]
		},
		{
			featureType: "AFREEMAN.GEOSERVER_TEST_LINE2",
			layerTitle : "Geoserver Editable Line 2", // must match whatever is found in folderset for this layer.
			fields : [
				{
					name : "ID", 		// field name
					allowBlank : false  // required
				},
				{
					name: "ORGCODE",	//field name
					fieldLabel: "Overridden with a long field name that is long",
					xtype: 'combo',		// override server data - make this a combobox/drop down
					store_val_labels: [  // dropdown values, as an array of [val, label] pairs
						["org1","Organization 1 despite a field length of 5"],
						["org2","Organization 2 despite a field length of 5"],
						["org3","Organization 3 despite a field length of 5"],
						["org4","Organization 4 despite a field length of 5"],
						["org5","Organization 5 despite a field length of 5"]
					],
					triggerAction: 'all',
					value: "org5" // set default value
				},
				{
					name: "DATENTERED",		//field name
					auto_timestamp : "Y-m-d\TH:i:s.ms" // for more example timestamp formats, look at Date Patterns in http://docs.sencha.com/ext-js/3-4/#!/api/Date
				},
				{
					name: "COMMENTS",		//field name
					xtype: 'combo',		
					triggerAction : 'all',
					store_remote : {
						layer : 'massgis:GISDATA.OPENSPACE_POLY',
						valueField : 'SITE_NAME',
						sortBy : 'SITE_NAME', 
						sortOrder : 'D', 
						restrict : {
							type: 'url'
							,value: 'commenttown' // for url, this will become a url param of edit_<value>, ex: if value = commenttown, then edit_commenttown
							,def_val: '250'
							,restrictedValueField: 'TOWN_ID'  // name of the field in this layer
							,restrictedSourceField: 'TOWN_ID' // name of the field in the layer we're restricting based on										
						}
					},
					value: "URL based combobox" // set default value
				},
				{
					name: "EMAIL",
					value:"josh@peoplegis.com",
					readOnly: true
				},
				{
					name: "ISSUE",			//field name
					xtype: 'combo',			// override server data - make this a combobox/drop down
					triggerAction: 'all',
					store_remote : {
						layer : 'massgis:GISDATA.SCHOOLS_PT',
						valueField : 'NAME',
						sortBy : 'NAME', 
						sortOrder : 'D', 
						restrict : {
							type : 'quickzoom' // or 'static', or 'url'
							,value : 1 // qzID (or string, or url param_name
							,def_val : 'foo'// only meaningful if type='url'
							,restrictedValueField: 'TOWN'  // name of the field in this layer
							,restrictedSourceField: 'TOWN' // name of the field in the layer we're restricting based on			
						}
					}
				}
			
			]
		},

		{
			featureType: "AFREEMAN.GEOSERVER_TEST_POLY",
			layerTitle : "Geoserver Editable Polygon" // must match whatever is found in folderset for this layer.
		},
/*,		{
			featureType: "AFREEMAN.GEOSERVER_TEST_PT",
			layerTitle : "Geoserver Editable Point - HTTPS" // must match whatever is found in folderset for this layer.
		},
		*/
		{
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
