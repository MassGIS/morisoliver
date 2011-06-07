// This is just an extended version of Ext's ScriptTagProxy that hardwires 
// Geoserver's particular version of jsonp callback definition which is 
// nonstandard and not well supported by the major js libraries.

// ie: given a callback named callbackName####, hardwires
// &format_options=callback:callbackName#### for dynamic callbackNames

Ext.data.Geoserver_ScriptTagProxy= function(config){
    Ext.apply(this, config);

    Ext.data.Geoserver_ScriptTagProxy.superclass.constructor.call(this, config);

    this.head = document.getElementsByTagName("head")[0];

};

Ext.data.Geoserver_ScriptTagProxy.TRANS_ID = 1000;


Ext.extend(Ext.data.Geoserver_ScriptTagProxy, Ext.data.ScriptTagProxy,{
  doRequest : function(action, rs, params, reader, callback, scope, arg) {
        var p = Ext.urlEncode(Ext.apply(params, this.extraParams));

        var url = this.buildUrl(action, rs);
        if (!url) {
            throw new Ext.data.Api.Error('invalid-url', url);
        }
        url = Ext.urlAppend(url, p);

        if(this.nocache){
            url = Ext.urlAppend(url, '_dc=' + (new Date().getTime()));
        }
        var transId = ++Ext.data.ScriptTagProxy.TRANS_ID; // shared
        var trans = {
            id : transId,
            action: action,
            cb : "stcCallback"+transId,
            scriptId : "stcScript"+transId,
            params : params,
            arg : arg,
            url : url,
            callback : callback,
            scope : scope,
            reader : reader
        };
        window[trans.cb] = this.createCallback(action, rs, trans);

        url +="&format_options=callback:"+trans.cb;
        if(this.autoAbort !== false){
            this.abort();
        }

        trans.timeoutId = this.handleFailure.defer(this.timeout, this, [trans]);

        var script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("type", "text/javascript");
        script.setAttribute("id", trans.scriptId);
        this.head.appendChild(script);

        this.trans = trans;
    }

});