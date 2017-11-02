var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    var path = require('path');
    var fs = require('fs');

    iad.report = iad.report || {};

    // A reference the the actual xml.
    var xmlConfig;

    // Passed in options.
    var options;

    // Report object.
    var report;

    // Indicates if a user report has been loaded.
    iad.report.loaded = false;

    // Initialise.
    iad.report.init = function (o)
    {
        options = o;

        iad.report.configPath = options.path;
        iad.report.path = path.parse(options.path).dir;
        iad.report.lessPath = iad.report.path+'/style.json';
        iad.report.stylePath = iad.report.path+'/default.css';
        iad.report.customPath = iad.report.path+'/custom.js';

        readXmlFile(options.path, function (xml)
        {
            addMissingComponentsToXml(xml, function()
            {
                ia.init(
                {
                    container: options.container,
                    onSuccess: function (r)
                    {
                        report = r;
                        loadStyleFile(function ()
                        {
                            loadCustomFile(function ()
                            {
                                if (options && options.onReportInit) options.onReportInit.call(null, report);
                                if (options && options.onReportLoaded) options.onReportLoaded.call(null, options.path);
                                onConfigLoaded();
                            });
                        });
                    },
                    onFail: function(url, XMLHttpRequest, textStatus, errorThrown)
                    {
                        if (options && options.onReportFailed) options.onReportFailed.call(null, url, XMLHttpRequest, textStatus, errorThrown);
                    },
                    data:
                    {
                        config      : {xml:xml},
                        attribute   : {source:iad.report.path+'/data.js'},
                        map         : {source:iad.report.path+'/map.js'}
                    }
                });
            });
        });
    };

    // Load a new report.
    iad.report.loadReport = function (configPath)
    { 
        iad.report.configPath = configPath;
        iad.report.path = path.parse(configPath).dir;
        iad.report.lessPath = iad.report.path+'/style.json';
        iad.report.stylePath = iad.report.path+'/default.css';
        iad.report.customPath = iad.report.path+'/custom.js';

        preConfigLoaded();
        readXmlFile(configPath, function (xml)
        {
            addMissingComponentsToXml(xml, function()
            {
                ia.update(
                {
                    data:
                    {
                        config      : {xml:xml},
                        attribute   : {source:iad.report.path+'/data.js'},
                        map         : {source:iad.report.path+'/map.js'}
                    }
                }, 
                function() 
                {
                    loadStyleFile(function ()
                    {
                        loadCustomFile(function ()
                        {
                            if (options && options.onReportLoaded) options.onReportLoaded.call(null, configPath);
                            onConfigLoaded(); 
                        });
                    });
                });
            });
        });
    };

    function readXmlFile(filePath, callback)
    {
        $.ajax(
        {
            type: 'GET',
            url: filePath,
            dataType: 'xml',
            success: function(xml) 
            {
                callback.call(null, xml);
            }
        });
    }

    function addMissingComponentsToXml(xml, callback)
    {
        var $xml = $(xml);
        var $AtlasInterface = $xml.find('AtlasInterface');
        var item = iad.util.getItem(options.configPaths, 'template', $AtlasInterface.attr('template'));

        readXmlFile(item.path, function (xmlTemplate)
        {
            var $xmlTemplate = $(xmlTemplate);
            var $xmlWidgets = $xmlTemplate.find('Component, Table');
            $.each($xmlWidgets, function(i, xmlWidget)
            {
                var $widget = $(xmlWidget);
                if ($xml.find('#' + $widget.attr('id')).length === 0) 
                {
                    $widget.attr('visible', false);
                    $widget.attr('x', 200);
                    $widget.attr('y', 150);
                    $widget.attr('width', 400);
                    $widget.attr('height', 300);
                    $AtlasInterface.append($widget);
                }
            });
            callback.call(null);
        });
    }

    // Load style.json
    function loadStyleFile(callback)
    {
        fs.stat(iad.report.lessPath, function(err, stat) 
        {
            if (err === null)  iad.css.readLessVarsFile(iad.report.lessPath, function()
            {
                callback.call(null);
            });
            else callback.call(null);
        });
    }

    // Load custom.js
    function loadCustomFile(callback)
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

    // Load a new config file.
    iad.report.loadConfig = function (configPath)
    {
        preConfigLoaded();
        readXmlFile(configPath, function (xml)
        {
            addMissingComponentsToXml(xml, function()
            {
                ia.parseConfig(xml, function ()
                {
                    onConfigLoaded();
                });
            });
        });
    };

    // Refresh the current config xml.
    iad.report.refreshConfig = function ()
    {
        preConfigLoaded();
        ia.parseConfig(xmlConfig, function ()
        {
            onConfigLoaded();
        });
    };

    // Refresh the report.
    iad.report.refreshReport = function ()
    {
        preConfigLoaded();
        ia.parseConfig(xmlConfig, function ()
        {
            loadCustomFile(function ()
            {
                onConfigLoaded();
            });
        });
    };

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

    // Called before loading new config.xml or report.
    function preConfigLoaded()
    {
        if (options && options.preConfigLoaded) options.preConfigLoaded.call(null);
    }

    // Called when config.xml has finished loading.
    function onConfigLoaded()
    {
        // Update the xml objects
        xmlConfig = report.config.xml;

        if (iad.report.loaded)
        {
            // Fix image paths.
            [].forEach.call(document.querySelectorAll('#'+options.container+' IMG'), function(img, index) 
            {
                var src = img.getAttribute('src');
                img.src = iad.report.path  + '/' + src;
            });
        }

        if (options && options.onConfigLoaded) options.onConfigLoaded.call(null, xmlConfig); 
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);
