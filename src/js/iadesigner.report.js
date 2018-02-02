var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    var path = require('path');
    var fs = require('fs');

    iad.report = iad.report || {};

    // Passed in options.
    var options;

    // Report object.
    var report;

    // Indicates if a user report has been loaded.
    iad.report.userReportLoaded = false;

    // Initialise.
    iad.report.init = function (o)
    {
        options = o;

        iad.report.configPath = options.path;
        iad.report.path = path.parse(options.path).dir;
        iad.report.lessPath = iad.report.path+'/style.json';
        iad.report.stylePath = iad.report.path+'/default.css';
        iad.report.customPath = iad.report.path+'/custom.js';
        iad.report.mapPath = iad.report.path+'/map.js';
        iad.report.dataPath = iad.report.path+'/data.js';

        iad.mapjson.read(iad.report.mapPath, function(jsonMap)
        {
            iad.file.readXml(options.path, function (xml)
            {
                ia.init(
                {
                    container: options.container,
                    data:
                    {
                        config      : {xml:xml},
                        attribute   : {source:iad.report.dataPath},
                        map         : {source:iad.report.mapPath} // we should really use jsonMap here but it triggers a bug in the template code.
                    },
                    onSuccess: function (r)
                    {
                        report = r;
                        iad.css.readLessVarsFile(iad.report.lessPath, function ()
                        {
                            readCustomFile(function ()
                            {
                                if (options && options.onReportInit) options.onReportInit.call(null, report);
                                if (options && options.onReportLoaded) options.onReportLoaded.call(null, options.path);
                            });
                        });
                    },
                    onFail: function(url, XMLHttpRequest, textStatus, errorThrown)
                    {
                        if (options && options.onReportFailed) options.onReportFailed.call(null, url, XMLHttpRequest, textStatus, errorThrown);
                    }
                });
            });
        });
    };

    // Load a new report.
    iad.report.load = function (configPath)
    { 
        preReportLoaded(function()
        {
            iad.report.configPath = configPath;
            iad.report.path = path.parse(configPath).dir;
            iad.report.lessPath = iad.report.path+'/style.json';
            iad.report.stylePath = iad.report.path+'/default.css';
            iad.report.customPath = iad.report.path+'/custom.js';
            iad.report.mapPath = iad.report.path+'/map.js';
            iad.report.dataPath = iad.report.path+'/data.js';

            iad.mapjson.read(iad.report.mapPath, function(jsonMap)
            {
                iad.file.readXml(configPath, function(xml)
                { 
                    ia.update(
                    {
                        data:
                        {
                            config      : {xml:xml},
                            attribute   : {source:iad.report.dataPath},
                            map         : {source:iad.report.mapPath} // we should really use jsonMap here but it triggers a bug in the template code.
                        }
                    }, 
                    function() 
                    {
                        iad.css.readLessVarsFile(iad.report.lessPath, function ()
                        {
                            readCustomFile(function ()
                            {
                                if (options && options.onReportLoaded) options.onReportLoaded.call(null, configPath);
                            });
                        });
                    });
                });
            });
        });
    };

    // Refresh the report.
    iad.report.refresh = function ()
    {
        iad.config.refresh(function ()
        {
            readCustomFile(function ()
            {
                if (options && options.onReportLoaded) options.onReportLoaded.call(null, options.path);
            });
        });
    };

    // Called before loading new report.
    function preReportLoaded(callback)
    {
        if (options && options.preReportLoaded) 
        {
            options.preReportLoaded.call(null, function()
            {
                callback.call(null);
            });
        }
    }

    // Load custom.js
    function readCustomFile(callback)
    {
        // Override any functions included in previous custom.js
        if (typeof iaOnReportComplete === "function") iaOnReportComplete = undefined;
        if (typeof onReportComplete === "function") onReportComplete = undefined;
        if (typeof onIAReportComplete === "function") onIAReportComplete = undefined;

        fs.stat(iad.report.customPath, function(err, stat) 
        {
            if (err === null) 
            {
                $.getScript(iad.report.customPath)
                .done(function( script, textStatus ) 
                {    
                    if (typeof iaOnReportComplete === "function") 
                    {
                        iaOnReportComplete(report);
                        callback.call(null);
                    }
                    else if (typeof onReportComplete === "function")
                    {
                        onReportComplete(report);
                        callback.call(null);
                    }
                    else if (typeof onIAReportComplete === "function")
                    {
                        onIAReportComplete(report);
                        callback.call(null);
                    }
                })
                .fail(function( jqxhr, settings, exception ) 
                {
                    callback.call(null);
                });
            }
            else callback.call(null);
        });
    }

    // Show a widget whose visibility is set to hidden.
    iad.report.showWidget = function(widgetId)
    {
        var panel = report.getPanel(widgetId);
        if (panel !== undefined)
        {
            var popup = iad.config.getWidgetProperty(widgetId, 'isPopUp');
            var vis = iad.config.getWidgetProperty(widgetId, 'visible');
            if (popup === 'true' || vis === 'false')
            {
                panel.popup(false);
                if (!panel.visible()) panel.visible(true);
            }
        }
    };

    // Hide a widget whose visibility is set to hidden.
    iad.report.hideWidget = function(widgetId)
    {
        var panel = report.getPanel(widgetId);
        if (panel !== undefined)
        {
            var popup = iad.config.getWidgetProperty(widgetId, 'isPopUp');
            var vis = iad.config.getWidgetProperty(widgetId, 'visible');
            if (popup === 'true' || vis === 'false')
            {
                var config = report.config.getWidget(widgetId);
                var widget = report.getWidget(widgetId);
                widget.update(config);
            }
        }
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
