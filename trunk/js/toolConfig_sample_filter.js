toolSettings.filter = {
   wmsLayerName : 'Real Property Verified Market Sales'
  ,columns      : {
    'SALEDATENUM' : {
       type     : 'number'
      ,label    : 'Sale date (YYYYMMDD)'
      ,required : true
      ,values   : [
         // 1st record = min; 2nd record = max
         20010101
        ,20121231
      ]
    }
    ,'NAL' : {
       type     : 'radioButtons'
      ,label    : 'Arms-length'
      ,values   : [
         // 1st member of each pair = dbValue; 2nd member of each pair = displayValue
         ['*'   ,'ALL']
        ,['A'   ,'Arms']
        ,['-999','Non-arms']
      ]
    }
    ,'PROP_TYPE_ID' : {
       type     : 'multiSelect'
      ,label    : 'Property type'
      ,required : true
      ,values   : [
         // 1st member of each pair = dbValue; 2nd member of each pair = displayValue
         ['*'  ,'ALL']
        ,['101','101']
        ,['102','102']
        ,['104','104 asdfas fsda fas df asdf asd fas df asdf asd fas df asd fasd fa sdf asd f']
        ,['111','111']
      ]
    }
    ,'SALE_PRICE' : {
       type     : 'number'
      ,label    : 'Sale price ($)'
      ,required : false
      ,values   : [
         0
        ,9999999999
      ]
    }
  }
  ,display : {
     labelWidth       : 150
    ,multiSelectWidth : 290
    ,winWidth         : 475
    ,winHeight        : 375
  }
  ,button : {
     icon    : 'img/filter.png'
    ,scale   : 'medium'
    ,tooltip : 'Create a custom layer filter'
    ,handler :  function() {
      function renderTip(val,metadata,rec) {
        metadata.attr = 'ext:qtip="' + val + '"';
        return val;
      }

      var win = Ext.getCmp('filterBuilder');
      if (win && !win.hidden) {
        win.hide();
      }

      var parser = new OpenLayers.Format.Filter.v1_1_0();
      var xml    = new OpenLayers.Format.XML();

      var lyr       = map.getLayersByName(toolSettings.filter.wmsLayerName)[0];
      var defaults  = {};
      if (lyr) {
        var xmlFilter = OpenLayers.Util.getParameters(lyr.getFullRequestString({}))['FILTER'];
        if (xmlFilter) {
          var f = xml.read(xmlFilter);
          var between = f.getElementsByTagName("ogc:PropertyIsBetween");
          for (var i = 0; i < between.length; i++) {
            defaults[OpenLayers.Util.getXmlNodeValue(between[i].getElementsByTagName("ogc:PropertyName")[0])] = {
               min : OpenLayers.Util.getXmlNodeValue(between[i].getElementsByTagName("ogc:LowerBoundary")[0].getElementsByTagName("ogc:Literal")[0])
              ,max : OpenLayers.Util.getXmlNodeValue(between[i].getElementsByTagName("ogc:UpperBoundary")[0].getElementsByTagName("ogc:Literal")[0])
            };
          }
          var equalTo = f.getElementsByTagName("ogc:PropertyIsEqualTo");
          for (var i = 0; i < equalTo.length; i++) {
            if (!defaults[OpenLayers.Util.getXmlNodeValue(equalTo[i].getElementsByTagName("ogc:PropertyName")[0])]) {
              defaults[OpenLayers.Util.getXmlNodeValue(equalTo[i].getElementsByTagName("ogc:PropertyName")[0])] = {};
            }
            defaults[OpenLayers.Util.getXmlNodeValue(equalTo[i].getElementsByTagName("ogc:PropertyName")[0])][OpenLayers.Util.getXmlNodeValue(equalTo[i].getElementsByTagName("ogc:Literal")[0])] = true;
          }
        }
      }

      var items = [{
         border : false
        ,html   : 'Complete the fields below to affect change in the ' + toolSettings.filter.wmsLayerName + ' layer. An asterisk (*) indicates a required field or a pair of required fields.<br>&nbsp;<br>'
      }];
      for (var c in toolSettings.filter.columns) {
        if (toolSettings.filter.columns[c].type == 'number') {
          items.push({
             border    : false
            ,layout    : 'column'
            ,defaults  : {border : false}
            ,bodyStyle : 'padding-bottom:4px'
            ,items : [
              {
                 width       : toolSettings.filter.display.labelWidth
                ,html        : toolSettings.filter.columns[c].label + (toolSettings.filter.columns[c].required ? '*' : '') + ':'
                ,cls         : 'x-form-item'
              }
              ,{
                 width       : 60
                ,html        : 'between'
                ,cls         : 'x-form-item'
              }
              ,new Ext.form.NumberField({
                 name       : c + '.min'
                ,id         : c + '.min'
                ,cls        : 'numberField'
                ,allowBlank : !toolSettings.filter.columns[c].required
                ,width      : 100
                ,minValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[0] : Number.NEGATIVE_INFINITY)
                ,maxValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[1] : Number.MAX_VALUE)
                ,listeners  : {afterrender : function(el) {
                  if (defaults[el.id.replace(/.min$/,'')]) {
                    el.setValue(defaults[el.id.replace(/.min$/,'')].min);
                  }
                  else {
                    el.setValue(toolSettings.filter.columns[el.id.replace(/.min$/,'')].values && toolSettings.filter.columns[el.id.replace(/.min$/,'')].values.length == 2 ? toolSettings.filter.columns[el.id.replace(/.min$/,'')].values[0] : Number.NEGATIVE_INFINITY);
                  }
                }}
              })
              ,{
                 width       : 35
                ,html        : '&nbsp;&nbsp;and'
                ,cls         : 'x-form-item'
              }
              ,new Ext.form.NumberField({
                 name       : c + '.max'
                ,id         : c + '.max'
                ,cls        : 'numberField'
                ,allowBlank : !toolSettings.filter.columns[c].required
                ,width      : 100
                ,minValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[0] : Number.NEGATIVE_INFINITY)
                ,maxValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[1] : Number.MAX_VALUE)
                ,listeners  : {afterrender : function(el) {
                  if (defaults[el.id.replace(/.max$/,'')]) {
                    el.setValue(defaults[el.id.replace(/.max$/,'')].max);
                  }
                  else {
                    el.setValue(toolSettings.filter.columns[el.id.replace(/.max$/,'')].values && toolSettings.filter.columns[el.id.replace(/.max$/,'')].values.length == 2 ? toolSettings.filter.columns[el.id.replace(/.max$/,'')].values[1] : Number.MAX_VALUE);
                  }
                }}
              })
            ]
          });
        }
        else if (toolSettings.filter.columns[c].type == 'radioButtons') {
          var cbItems = [];
          for (var i = 0; i < toolSettings.filter.columns[c].values.length; i++) {
            cbItems.push({
               name       : c
              ,boxLabel   : toolSettings.filter.columns[c].values[i][1]
              ,inputValue : toolSettings.filter.columns[c].values[i][0]
              ,checked    : (defaults[c] ? defaults[c][toolSettings.filter.columns[c].values[i][0]] : toolSettings.filter.columns[c].values[i][0] == '*')
            });
          }
          items.push(new Ext.form.RadioGroup({
             fieldLabel       : toolSettings.filter.columns[c].label + (toolSettings.filter.columns[c].required ? '*' : '')
            ,allowBlank       : !toolSettings.filter.columns[c].required
            ,columns          : 1
            ,id               : c
            ,items            : cbItems
          }));
        }
        else if (toolSettings.filter.columns[c].type == 'multiSelect') {
          items.push({html : '<img src="img/blank.png" height=3>',border : false});
          items.push(new Ext.grid.GridPanel({
             id               : c
            ,fieldLabel       : toolSettings.filter.columns[c].label + (toolSettings.filter.columns[c].required ? '*' : '')
            ,width            : toolSettings.filter.display.multiSelectWidth
            ,height           : 100
            ,autoExpandColumn : 'lbl'
            ,enableHdMenu     : false
            ,hideHeaders      : true
            ,columns          : [{id : 'lbl',dataIndex : 'lbl',renderer : renderTip}]
            ,store          : new Ext.data.ArrayStore({
               fields : ['val','lbl']
              ,data   : toolSettings.filter.columns[c].values
            })
            ,listeners        : {viewready : function(gp) {
              var rows = [];
              if (defaults[gp.id]) {
                var i = 0;
                gp.getStore().each(function(rec) {
                  if (defaults[gp.id][rec.get('val')]) {
                    rows.push(i);
                  }
                  i++;
                });
              }
              if (rows.length == 0) {
                gp.getSelectionModel().selectFirstRow();
              }
              else {
                gp.getSelectionModel().selectRows(rows);
              }
            }}
          }));
          items.push({html : '<img src="img/blank.png" height=3>',border : false});
        }
      }
      win = new Ext.Window({
         title    : toolSettings.filter.wmsLayerName + ' Filter Builder'
        ,id       : 'filterBuilder'
        ,width    : toolSettings.filter.display.winWidth
        ,height   : toolSettings.filter.display.winHeight
        ,defaults : {border : false}
        ,layout   : 'fit'
        ,constrainHeader : true
        ,items    : new Ext.FormPanel({
           bodyStyle    : 'padding:6px;border-bottom: 1px solid #99BBE8'
          ,monitorValid : true
          ,labelWidth   : toolSettings.filter.display.labelWidth
          ,items        : items 
          ,buttons      : [
            {
               text    : 'Cancel'
              ,handler : function() {
                win.hide();
              }
            }
            ,{
               text     : 'Apply'
              ,formBind : true
              ,handler  : function() {
                var f = [];
                for (var c in toolSettings.filter.columns) {
                  if (toolSettings.filter.columns[c].type == 'number') {
                    if (typeof Ext.getCmp(c + '.min').getValue() == 'number' && typeof Ext.getCmp(c + '.max').getValue() == 'number') {
                      f.push(new OpenLayers.Filter.Comparison({
                         type          : OpenLayers.Filter.Comparison.BETWEEN
                        ,property      : c
                        ,lowerBoundary : Ext.getCmp(c + '.min').getValue()
                        ,upperBoundary : Ext.getCmp(c + '.max').getValue()
                      }));
                    }
                  }
                  else if (toolSettings.filter.columns[c].type == 'radioButtons') {
                    if (Ext.getCmp(c).items.get(0).getGroupValue() != '*') {
                      f.push(new OpenLayers.Filter.Comparison({
                         type     : OpenLayers.Filter.Comparison.EQUAL_TO
                        ,property : c
                        ,value    : Ext.getCmp(c).items.get(0).getGroupValue()
                      }));
                    }
                  }
                  else if (toolSettings.filter.columns[c].type == 'multiSelect') {
                    var p = [];
                    var s = Ext.getCmp(c).getSelectionModel().getSelections();
                    var allSelected = false;
                    for (var i = 0; i < s.length; i++) {
                      allSelected = allSelected || s[i].get('val') == '*';
                    } 
                    if (!allSelected) {
                      for (var i = 0; i < s.length; i++) {
                        p.push(new OpenLayers.Filter.Comparison({
                           type     : OpenLayers.Filter.Comparison.EQUAL_TO
                          ,property : c
                          ,value    : s[i].get('val')
                        }));
                      }
                      if (s.length > 1) {
                        f.push(new OpenLayers.Filter.Logical({
                           type    : OpenLayers.Filter.Logical.OR
                          ,filters : p
                        }));
                      }
                      else {
                        f.push(p[0]);
                      }
                    }
                  }
                }

                f.unshift(new OpenLayers.Filter.Spatial({
                   type     : OpenLayers.Filter.Spatial.INTERSECTS
                  ,property : lyr2type[toolSettings.filter.wmsLayerName] == 'shp' ? 'the_geom' : 'SHAPE'
                  ,value    : map.getExtent().toGeometry()
                }));

                if (f.length > 1) {
                  f = [
                    new OpenLayers.Filter.Logical({
                       type    : OpenLayers.Filter.Logical.AND
                      ,filters : f
                    })
                  ]; 
                }

                addLayer(lyr2wms[toolSettings.filter.wmsLayerName],lyr2proj[toolSettings.filter.wmsLayerName],toolSettings.filter.wmsLayerName,true,1,wmsUrl);
                map.getLayersByName(toolSettings.filter.wmsLayerName)[0].mergeNewParams({FILTER : xml.write(parser.write(f[0])).replace('<gml:Polygon xmlns:gml="http://www.opengis.net/gml">','<gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="' + map.getProjectionObject() + '">')});
                Ext.getCmp('queryBox').toggle(true);
                runQueryStats(map.getExtent().toGeometry());
              }
            }
          ]
        })
        ,listeners : {hide : function(win) {win.destroy()}}
      });
      win.show();
    }
  }
};
