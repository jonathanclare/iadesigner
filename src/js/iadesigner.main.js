var iadesigner = (function (iad, $, bootbox, window, document, undefined)
{
    'use strict';

    iad = iad || {};

    var electron = require('electron');

    // Access modules in the main process.
    var remote = electron.remote;
    var app = remote.app;

    var iaReport; // The IA report object.

    iad.init = function(options)
    {
        var settings = $.extend({}, this.defaults, options); // Merge to a blank object.

        registerHandlebarsHelperFunctions();

        iad.updates.check(function()
        {
            iad.usersettings.get(function(userSettings)
            {
                // Set all user settings here.
                if (iad.file.fileExists(userSettings.reportPath)) 
                {
                    iad.report.userReportLoaded = true;
                    settings.report.path = userSettings.reportPath;
                }

                initCss(settings.css, function()
                {
                    initMapJson(settings.map);
                    initConfig(settings.config);
                    initReport(settings.report, function()
                    {
                        iad.util.forceLinksToOpenInBrowserWindow();
                        initSidebar(settings);
                        initCanvas();
                        initColorPicker();
                        initForms();
                        initConfigForm(settings.configForms);
                        initFile();
                        updateStyleDownloadButtons();
                        if (settings.onAppReady !== undefined) settings.onAppReady.call(null);
                    });
                });
            });
        });
    };

    function updateStyleDownloadButtons()
    {
        // colorscheme.json
        var lessBlob = new Blob([iad.css.getLessVarsAsString()], {type: 'application/json' }); 
        var lessUrl = URL.createObjectURL(lessBlob);
        $('#iad-btn-download-stylejson').attr('href', lessUrl);

        // default.css
        iad.css.getCssAsString(function (strCss)
        {
            var cssBlob = new Blob([strCss], {type: 'text/css' }); 
            var cssUrl = URL.createObjectURL(cssBlob);
            $('#iad-btn-download-defaultcss').attr('href', cssUrl);
        });
    }

    function updateConfigDownloadButton()
    {
        // config.xml
        var configBlob = new Blob([iad.config.toString()], {type: 'text/xml' }); 
        var configUrl = URL.createObjectURL(configBlob);
        $('#iad-btn-download-configxml').attr('href', configUrl);
    }

    function initSidebar(options)
    {
        var storedData; // Stores the data so that any changes can be undone.

        iad.sidebar.init(
        {
            container: '#iad-report',
            onHide: function(id)
            {

            },
            onHidden: function(id)
            {
                if (id === 'iad-sidebar-widget') iad.canvas.clearSelection();
                else if (id === 'iad-sidebar-mappalette') 
                {
                    iad.config.setXml(storedData);
                    iad.paletteform.update();
                }
            },
            onFirstShown: function(id)
            {
                if (id === 'iad-sidebar-templategallery') initTemplateGallery(options.templateGallery);
                else if (id === 'iad-sidebar-widgetgallery') initWidgetGallery(options.widgetGallery);
                else if (id === 'iad-sidebar-colorscheme') initColorScheme();
                else if (id === 'iad-sidebar-mappalette') initPaletteForm();
            },
            onShow: function(id)
            {
                if (id === 'iad-sidebar-css' || id === 'iad-sidebar-colorscheme') storedData = iad.css.getLessVars();
                else if (id === 'iad-sidebar-maplayer') storedData = iad.mapjson.toJson();
                else if (id === 'iad-sidebar-templategallery' || id === 'iad-sidebar-widgetgallery' || id === 'iad-sidebar-widget' || id === 'iad-sidebar-mappalette') storedData = iad.config.getXml();
            },
            onShown: function(id)
            {

            },
            onUndo: function(id)
            {   
                if (id === 'iad-sidebar-mappalette')  
                {
                    iad.config.setXml(storedData);
                    iad.paletteform.update();
                } 
                else
                {
                    iad.progress.start('load', function()
                    {
                        if (id === 'iad-sidebar-css' || id === 'iad-sidebar-colorscheme') iad.css.setLessVars(storedData);
                        else if (id === 'iad-sidebar-maplayer') iad.mapjson.parse(storedData); 
                        else if (id === 'iad-sidebar-templategallery' ||  id === 'iad-sidebar-widgetgallery' || id === 'iad-sidebar-widget') iad.config.parse(storedData);
                    });
                }
            },
            onApply: function(id)
            {
                iad.progress.start('load', function()
                {
                    if (id === 'iad-sidebar-mappalette') 
                    {
                        storedData = iad.config.getXml();
                        iad.config.refresh();
                    }
                });
            }
        });
    }

    function initCss(options, callback)
    {
        iad.cssform.init(
        {
            container:'#iad-form-css-properties', 
            template:'forms.handlebars', 
            json:options.form 
        });

        iad.css.init(
        {
            lessFile: options.lessFile,
            lessVars: options.lessVars,
            onLessVarsChanged: function(lessVars)
            {
                // Update css form when color scheme has been changed.
                iad.cssform.update(lessVars);

                // Highlight/selection and chart color changes need iaReport update.
                if (iaReport !== undefined)
                {
                    var factory = iaReport.getComponent('factory');
                    iaReport.highlightColor = lessVars['@highlight-color'];
                    iaReport.selectionColor = lessVars['@selection-color'];
                    factory.updateComponents(function ()
                    {
                        factory.renderComponents(function () 
                        {
                            onStyleChanged();
                            iad.progress.end('load');
                        });
                    });
                }
            },
            onPropertyChanged: function(property, value)
            {
                // Refresh iaReport if necessary when the user has changed a property in the css form.
                if (iaReport !== undefined)
                {
                    var factory = iaReport.getComponent('factory');
                    if ((property === '@highlight-color' || property === '@selection-color') || property === undefined) 
                    {
                        if (property === '@highlight-color') iaReport.highlightColor = value;
                        if (property === '@selection-color') iaReport.selectionColor = value;
                        factory.updateComponents(function ()
                        {
                            factory.renderComponents(function () 
                            {
                                onStyleChanged();
                            });
                        });
                    }
                    else if (property === '@chart-font-color' || property === '@chart-font-size' || property === '@chart-grid-color') 
                    {
                        factory.renderComponents(function() 
                        {
                            onStyleChanged();
                        });
                    }
                    else onStyleChanged();
                }
            },
            onReady: function()
            {
                if (callback !== undefined) callback.call(null);
            }
        });

        function onStyleChanged()
        {
            if (iad.report.userReportLoaded) iad.file.onChangesMade();
            updateStyleDownloadButtons();
        }
    }

    function initMapJson(options)
    {
        iad.mapform.init(
        {
            container:'#iad-form-layer-properties', 
            template:'forms.handlebars', 
            json:options.form 
        });

        iad.mapjson.init(
        {
            onRead: function(jsonMap)
            {
                iad.mapform.update(jsonMap);
            },
            onParse: function(jsonMap)
            {
                iad.mapform.update(jsonMap);
                debounceParseMap();
            },
            onMapPropertyChanged: function(property, value)
            {

            },
            onLayerPropertyChanged: function(layerId, property, value)
            {
                debounceParseMap();
            }
        });

        var debounceParseMap = iad.util.debounce(function () 
        {
            ia.parseMap(iad.mapjson.toJson(), function()
            {
                iad.canvas.update();
                iad.progress.end('load');
            });
        }, 1000);
    }

    function initColorPicker()
    {
        iad.colorpicker.init({});
    }

    function initFile()
    {
        iad.file.init({dragAndDrop: '#iad-report'});
    }

    function initColorScheme()
    {
        iad.colorscheme.init(
        {
            container: '#iad-form-color-scheme',
            onChange: function(jsonColorScheme)
            {
                iad.css.setLessVars(jsonColorScheme);
            }
        });
    }

    function initReport(options, callback)
    {
        iad.report.init(
        {
            container: 'iad-report',
            path: options.path,
            onReportInit: function (r)
            {
                iaReport = r;
            },
            onReportFailed: function (url, XMLHttpRequest, textStatus, errorThrown)
            {
                iad.progress.end('load', function()
                {
                    bootbox.alert(
                    {
                        message: "Could not find file: " +url,
                        backdrop: true
                    });
                });
            },
            preReportLoaded: function (callback)
            {      
                iad.canvas.clearSelection();
                callback.call(null);
            },
            onReportLoaded: function (configPath)
            {
                iad.config.setXml(iaReport.config.xml);
                iad.file.onChangesSaved();

                if (iad.report.userReportLoaded)
                {
                    // Reset title to show config file path.
                    var title = 'InstantAtlas Designer - ' + configPath;
                    iad.win.setTitle(title);
                    $('#iad-window-title').html(title);
                }

                if (callback !== undefined) 
                {
                    callback.call(null);
                    callback = undefined;
                }

                onConfigLoaded();
            }
        });
    }

    function onConfigLoaded()
    {
        iad.widgetsidebar.updateDropdown();
        iad.widgetgallery.update();
        iad.paletteform.update();
        iad.widgetsidebar.update();
        iad.canvas.update();

        if (iad.report.userReportLoaded)
        {
            // Fix image paths.
            [].forEach.call(document.querySelectorAll('#iad-report IMG'), function(img, index) 
            {
                var src = img.getAttribute('src');
                img.src = iad.report.path  + '/' + src;
            });
        }
        iad.progress.end('load');
    }

    function initConfig(options)
    {
        var storedSelectedWidgetId, storedCanvasIsActivated;

        iad.config.init(
        {
            paths:options.paths,
            preConfigLoaded: function (callback)
            {      
                storedSelectedWidgetId = iad.config.selectedWidgetId;
                storedCanvasIsActivated = iad.canvas.isActive;
                iad.canvas.off();
                callback.call(null);
            },
            onConfigChanged: function (xml) // The config can change without the report being reloaded.
            {
                if (iad.report.userReportLoaded) iad.file.onChangesMade();
                updateConfigDownloadButton();
            },
            onConfigLoaded: function (xml)
            {
                ia.parseConfig(xml, function ()
                {
                    if (storedCanvasIsActivated) iad.canvas.on();
                    if (storedSelectedWidgetId !== undefined)  iad.canvas.select(storedSelectedWidgetId);
                    onConfigLoaded();
                });
            },
            onWidgetRemoved: function (widgetId, $xmlWidget)
            {  
                var widget = iaReport.getWidget(widgetId);
                var tagName = $xmlWidget.prop('tagName');
                if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text')
                {
                    iaReport.config.removeWidget(widgetId);
                    iaReport.removeWidget(widgetId);
                }
                else if (tagName === 'Component' || tagName === 'Table')
                {
                    widget.container.hide();
                }
                iad.canvas.clearSelection();
                iad.canvas.update();
                iad.widgetsidebar.updateDropdown();
                iad.widgetgallery.update();
            },
            onWidgetAdded: function (widgetId, $xmlWidget)
            {
                var config, widget;
                var tagName = $xmlWidget.prop('tagName');
                if (tagName === 'Button') 
                {
                    config = iaReport.config.addButton($xmlWidget.get(0));
                    widget = new ia.Button(widgetId);
                    iaReport.addButton(widget, config);
                    onWidgetAdded(widgetId, $xmlWidget);
                }
                else if (tagName === 'Image')
                {
                    config = iaReport.config.addImage($xmlWidget.get(0));
                    widget = new ia.Image(widgetId, "./image_placeholder.png");
                    iaReport.addImage(widget, config); 
                    onWidgetAdded(widgetId, $xmlWidget);
                }
                else if (tagName === 'Text')
                {
                    config = iaReport.config.addText($xmlWidget.get(0));
                    widget = new ia.Text(widgetId);
                    iaReport.addText(widget, config);
                    onWidgetAdded(widgetId, $xmlWidget);
                }
                else // Component or Table.
                {
                    // Check if its already been built and added.
                    widget = iaReport.getWidget(widgetId);
                    if (widget !== undefined)
                    {
                        widget.container.show();
                        onWidgetAdded(widgetId, $xmlWidget);
                    }
                    else
                    {
                        if (tagName === 'Table') config = iaReport.config.addTable($xmlWidget.get(0));
                        else config = iaReport.config.addComponent($xmlWidget.get(0));

                        widget = new ia.Panel(widgetId);
                        iaReport.addPanel(widget, config);

                        // These components require a full update because more data may need to be read in for them to work.
                        if (widgetId.indexOf('featureCard') !== -1 || 
                            widgetId.indexOf('pyramidChart') !== -1 || 
                            widgetId.indexOf('spineChart') !== -1 || 
                            widgetId.indexOf('radarChart') !== -1 || 
                            widgetId.indexOf('areaBreakdownBarChart') !== -1 || 
                            widgetId.indexOf('areaBreakdownPieChart') !== -1)
                        {
                            iad.config.selectedWidgetId = widgetId;
                            debounceRefreshConfig();
                        }
                        else 
                        {
                            // Build.
                            var factory = iaReport.getComponent('factory');
                            factory.build(widgetId, function ()
                            {
                                onWidgetAdded(widgetId, $xmlWidget);
                            });
                        }
                    }
                }
                iad.widgetgallery.update();
            },
            onWidgetAttributeChanged: function (widgetId, $xmlWidget, attribute, value)
            {
                onWidgetChanged(widgetId, $xmlWidget);
            },
            onWidgetPropertyChanged: function (widgetId, $xmlWidget)
            {
                onWidgetChanged(widgetId, $xmlWidget);
            },
            onWidgetDimensionsChanged: function (widgetId, $xmlWidget, x, y, w, h)
            {
                onWidgetChanged(widgetId, $xmlWidget);
            },
            onZIndexChanged: function (widgetId)
            {
                iad.canvas.select(widgetId);
            },
            onGroupPropertyChanged: function (groupId, propertyId)
            {
                debounceRefreshConfig();
            },
            onMapPaletteChanged: function ()
            {
                iad.paletteform.update();
            },
            onPropertyAdded: function (widgetId, $xmlWidget)
            {
                onWidgetChanged(widgetId, $xmlWidget, function()
                {
                    iad.widgetsidebar.update();
                });
            },
            onPropertyRemoved: function (widgetId, $xmlWidget)
            {
                onWidgetChanged(widgetId, $xmlWidget, function()
                {
                    iad.widgetsidebar.update();
                });
            },
            onImageChanged: function (widgetId, $xmlWidget, attribute, value)
            {
                if (attribute === 'rescale')
                { 
                    $xmlWidget.attr(attribute, value);

                    var widget = iaReport.getWidget(widgetId);
                    var $widget = widget.container;

                    // Resize the active widget.
                    var x = $widget.position().left, y = $widget.position().top, w = $widget.outerWidth(), h = $widget.outerHeight();
                    var xAnchor = widget.xAnchor();
                    if (xAnchor === 'end' ||  xAnchor === 'right') x = x + w; 

                    // Calculate percentage dimensions.
                    var xPerc = (x / iaReport.container.width()) * 100;
                    var yPerc = (y / iaReport.container.height()) * 100;
                    var wPerc = (w / iaReport.container.width()) * 100;
                    var hPerc = (h / iaReport.container.height()) * 100;

                    if (widget.height() === undefined) hPerc = undefined;

                    if (value === true) 
                        iad.config.setWidgetDimensions(widgetId, xPerc, yPerc, wPerc, hPerc);
                    else  
                        iad.config.setWidgetDimensions(widgetId, xPerc, yPerc, w, h); // Fixed width and height images. 
                }
                else if (attribute === 'anchor')
                {
                    var cx = parseFloat($xmlWidget.attr('x')); 
                    var cw = parseFloat($xmlWidget.attr('width')); 
                    if ($xmlWidget.attr('rescale') === 'false' || $xmlWidget.attr('rescale') === false) cw = (cw / iaReport.container.width()) * 800;

                    var anchor = $xmlWidget.attr('anchor');
                    if (anchor === 'center')
                    {
                        if (value === 'left') cx = cx - (cw  / 2);
                        else if (value === 'right') cx = cx + (cw  / 2);
                    }
                    else if (anchor === 'right')
                    {
                        if (value === 'left') cx = cx - cw;
                        else if (value === 'center') cx = cx - (cw  / 2);
                    }
                    else
                    {
                        if (value === 'center') cx = cx + (cw  / 2);
                        else if (value === 'right') cx = cx + cw;
                    }
                    $xmlWidget.attr('x', cx);
                }
            }
        });

        var debounceRefreshConfig = iad.util.debounce(function () 
        {
            iad.progress.start('load', function()
            {
                iad.config.refresh();
            });
        }, 1000);

        function onWidgetAdded(widgetId, $xmlWidget)
        {
            iad.widgetsidebar.updateDropdown();
            iad.canvas.clearSelection();
            iad.canvas.update();
            iad.canvas.select(widgetId);
        }
        function onWidgetChanged(widgetId, $xmlWidget, callback)
        {
            // Update the widget config.
            var config = iaReport.config.getWidget(widgetId);
            config.parseXML($xmlWidget.get(0));

            // Update the widget.
            var widget = iaReport.getWidget(widgetId);
            widget.update(config);

            // Update any dynamic text that may have changed.
            iaReport.updateDynamicText(iaReport.textSubstitution);

            // Update and render the widget.
            var factory = iaReport.getComponent('factory');
            factory.update(widgetId, function ()
            {
                factory.render(widgetId, function ()
                {
                    if (iad.report.userReportLoaded)
                    {
                        var tagName = $xmlWidget.prop('tagName');
                        if (tagName === 'Image')
                        {
                            var img = widget.container.find('img:first');
                            img.attr('src', iad.report.path  + '/' + img.attr('src'));
                        }
                        if (widgetId === iad.config.selectedWidgetId) iad.report.showWidget(widgetId); // Stop popup widgets from disappearing.

                        iad.canvas.update();
                    }
                    if (callback !== undefined) callback.call(null);
                });
            });
        }
    }

    function initConfigForm(options)
    {
        iad.widgetsidebar.init( 
        {
            container: '#iad-form-widget-properties',
            template: 'forms.handlebars'
        });
        iad.widgetsidebar.updateDropdown();

        var cOptions = $.extend({}, options, 
        {
            report : iaReport, 
        }); 
        iad.configform.init(cOptions);
    }

    function initPaletteForm()
    {
        iad.paletteform.init( 
        {
            container: '#iad-form-palette-properties',
            template: 'forms.handlebars'
        });
        iad.paletteform.update();
    }

    function initForms()
    {
        iad.form.init(
        {
            onDataChanged: function (data)
            {
                console.log(data);
                if (data.formType === 'Column')
                {
                    if (data.controlId === 'alias' || data.controlId === 'name' || data.controlId === 'symbol' || data.controlId === 'width' || data.controlId === 'national')
                        iad.config.setColumnAttribute(data.formId, data.controlIndex, data.controlId, data.controlValue);
                    else
                        iad.config.setWidgetProperty(data.formId, data.controlId, data.controlValue); // Special spine chart column properties like min, mid ,max labels.
                }
                else if (data.formType === 'Component' || data.formType === 'Table')
                {          
                    iad.config.setWidgetProperty(data.formId, data.controlId, data.controlValue);
                }  
                else if (data.formType === 'Button' || data.formType === 'Image' || data.formType === 'Text') 
                {
                    iad.config.setWidgetAttribute(data.formId, data.controlId, data.controlValue);
                }
                else if (data.formType == 'PropertyGroup')
                {
                    iad.config.setGroupProperty(data.formId, data.controlId, data.controlValue);
                }
                else if (data.formType == 'MapPalettes')
                {
                    iad.config.setPaletteColour(data.controlId, data.colorIndex, data.controlValue)
                }
                else if (data.formType == 'MapLayers')
                {
                    iad.mapjson.setLayerProperty(data.formId, data.controlId, data.controlValue);
                }
                else if (data.formType == 'CSS')    
                {
                    iad.css.setProperty(data.controlId, data.controlValue);
                }
            },
            onButtonClicked: function (data)
            {
                console.log(data);
                if (data.action === 'add-column')               iad.config.addColumn(data.controlId);
                else if (data.action === 'add-menuitem')        iad.config.addMenuItem(data.controlId);
                else if (data.action === 'add-symbol')          iad.config.addSymbol(data.controlId);
                else if (data.action === 'add-target')          iad.config.addTarget(data.controlId);
                else if (data.action === 'add-break')           iad.config.addBreak(data.controlId);
                else if (data.action === 'add-line')            iad.config.addPyramidLine(data.controlId);
                else if (data.action === 'add-colourrange')     iad.config.addColourRange();
                else if (data.action === 'add-colourscheme')    iad.config.addColourScheme();
                else if (data.action === 'remove-column')       iad.config.removeColumn(data.controlId, data.controlIndex);
                else if (data.action === 'remove-menuitem')     iad.config.removeMenuItem(data.controlId, data.controlIndex);
                else if (data.action === 'remove-symbol')       iad.config.removeSymbol(data.controlId, data.controlIndex);
                else if (data.action === 'remove-target')       iad.config.removeTarget(data.controlId, data.controlIndex);
                else if (data.action === 'remove-break')        iad.config.removeBreak(data.controlId, data.controlIndex);
                else if (data.action === 'remove-line')         iad.config.removePyramidLine(data.controlId, data.controlIndex);
                else if (data.action === 'remove-palette')      iad.config.removePalette(data.controlId);
            },
            onControlOrderChanged: function (arrData)
            {
                var items = [];
                if (arrData.length > 0)
                {
                    for (var i = 0; i < arrData.length; i++)
                    {
                        var data = arrData[i];
                        if (data.formId.indexOf('menuBar') !== -1)
                        {
                            items[items.length] = 
                            {
                                menuItem: iad.config.getWidgetXml(data.formId).find('#menuItem' + data.prevControlIndex), 
                                menuFunc: iad.config.getWidgetXml(data.formId).find('#menuFunc' + data.prevControlIndex)
                            };
                        }
                        else if (data.formId.indexOf('table') !== -1)
                        {
                            items[items.length] = iad.config.getWidgetXml(data.formId).find('Column').eq(data.prevControlIndex);
                        }
                        else if (data.formType == 'MapPalettes')
                        {
                            items[items.length] = iad.config.getPalette(data.controlId);
                        }
                    }

                    var d = arrData[0];
                    if (arrData[0].formId.indexOf('menuBar') !== -1)    iad.config.orderMenuItems(d.formId, items);
                    else if (arrData[0].formId.indexOf('table') !== -1) iad.config.orderColumns(d.formId, items);
                    else if (arrData[0].formType === 'MapPalettes')     iad.config.orderPalettes(items);
                }
            }
        });
    }

    function initCanvas()
    {
        var $nav = $('#iad-nav-widgets');
        iad.canvas.init(
        {
            report : iaReport,
            onSelect: function (widgetId)
            {
                $nav.show();
                if (widgetId !== iad.config.selectedWidgetId)
                {
                    iad.config.selectedWidgetId = widgetId;
                    iad.widgetsidebar.edit(widgetId);
                    iad.report.showWidget(widgetId);
                }
            },
            onUnselect: function (widgetId)
            {
                $nav.hide();
                iad.report.hideWidget(widgetId);
                iad.config.selectedWidgetId = undefined;
            },
            onClearSelection: function ()
            {     
                $nav.hide();
                iad.config.selectedWidgetId = undefined;
                iad.widgetsidebar.edit('PropertyGroup');
            },
            onDragEnd: function (widgetId, x, y)
            {
                iad.config.setWidgetDimensions(widgetId, x, y);
            },
            onResizeEnd: function (widgetId, x, y, w, h)
            {
                iad.config.setWidgetDimensions(widgetId, x, y, w, h);
            },
            onActivated: function ()
            {
                if (iad.config.selectedWidgetId !== undefined) $nav.show();
            },
            onDeactivated: function ()
            {
                $nav.hide();
            }
        });
    }

    function initTemplateGallery(options)
    {
        iad.templategallery.init(
        {
            template: 'template-gallery.handlebars',
            container: '#iad-template-gallery',
            reportPath: options.reportPath,
            configPath: options.configPath,
            json: options.json,
            onApply: function (filePath, name)
            {
                iad.progress.start('load', function()
                {
                    if (iad.report.userReportLoaded)
                        iad.config.load(filePath);
                    else
                        iad.report.load(filePath);
                });
            },
            onPreview: function (filePath, name)
            {
                iad.util.openWin('file://' + __dirname + '/' + filePath);
            }
        });
    }

    function initWidgetGallery(options)
    {
        iad.widgetgallery.init(
        {
            template: 'widget-gallery.handlebars',
            container: '#iad-widget-gallery',
            json: options.json,
            onAdd: function (widgetId)
            {
                iad.config.addWidget(widgetId);
            }
        });
        iad.widgetgallery.update();
    }

    function registerHandlebarsHelperFunctions()
    {
        // Checks if its a string control.
        Handlebars.registerHelper('ifTextControl', function (type, options)
        {
            if (type === undefined) return options.fn(this);
            if (type === 'string') return options.fn(this);
            if (type === 'string-array') return options.fn(this);
            if (type === 'float-array') return options.fn(this);
            if (type === 'integer-array') return options.fn(this);
            if (type === 'colour-array') return options.fn(this);
            if (type === 'boolean-array') return options.fn(this);
            return options.inverse(this);
        });
        // Checks if value is greater than.
        Handlebars.registerHelper('ifGreaterThan', function (val1, val2, options)
        {
            if (val1 > val2) return options.fn(this);
            return options.inverse(this);
        });
        // Checks what kind of control it is.
        Handlebars.registerHelper('ifEqualTo', function (val1, val2, options)
        {
            val1 = val1 + '';
            val2 = val2 + '';
            if (val1 === val2) return options.fn(this);
            return options.inverse(this);
        });
        // For stripes.
        Handlebars.registerHelper('ifEven', function (conditional, options)
        {
            if ((conditional % 2) === 0) return options.fn(this);
            else return options.inverse(this);
        });
        // For map palettes.
        Handlebars.registerHelper('noOfColorsGreaterThanTwo', function(items, options) 
        {
            // Use 3 because it includes two color controls and the add color control.
            if (items)
            {
                if (items.length > 3) return options.fn(this);
                return options.inverse(this);
            }
            else return options.fn(this);
        });
        // Checks strings for partial match - useful for changing tooltip/popver behaviour.
        Handlebars.registerHelper('ifStartsWith', function (val1, val2, options)
        {
            if (val1 && val2 && ((val1 === val2) || (val1.indexOf(val2) === 0))) return options.fn(this);
            return options.inverse(this);
        });
        Handlebars.registerHelper('ifEndsWith', function (val1, val2, options)
        {
            if (val1 && val2 && ((val1 === val2) || (val1.indexOf(val2) === (val1.length - val2.length)))) return options.fn(this);
            return options.inverse(this);
        });
        Handlebars.registerHelper('substring', function (s, i)
        {
            return s.substring(i);
        });
        // For nested templates.
        Handlebars.registerPartial('control.logic', window.iadesigner['control.logic.handlebars']);
        Handlebars.registerPartial('control.text', window.iadesigner['control.text.handlebars']);
        Handlebars.registerPartial('control.textarea', window.iadesigner['control.textarea.handlebars']);
        Handlebars.registerPartial('control.textarea', window.iadesigner['control.textarealarge.handlebars']);
        Handlebars.registerPartial('control.label', window.iadesigner['control.label.handlebars']);
        Handlebars.registerPartial('control.boldlabel', window.iadesigner['control.boldlabel.handlebars']);
        Handlebars.registerPartial('control.integer', window.iadesigner['control.integer.handlebars']);
        Handlebars.registerPartial('control.float', window.iadesigner['control.float.handlebars']);
        Handlebars.registerPartial('control.integercounter', window.iadesigner['control.integercounter.handlebars']);
        Handlebars.registerPartial('control.integerselect', window.iadesigner['control.integerselect.handlebars']);
        Handlebars.registerPartial('control.floatcounter', window.iadesigner['control.floatcounter.handlebars']);
        Handlebars.registerPartial('control.boolean', window.iadesigner['control.boolean.handlebars']);
        Handlebars.registerPartial('control.select', window.iadesigner['control.select.handlebars']);
        Handlebars.registerPartial('control.colour', window.iadesigner['control.colour.handlebars']);
        Handlebars.registerPartial('control.text', window.iadesigner['control.text.handlebars']);
        Handlebars.registerPartial('control.range', window.iadesigner['control.range.handlebars']);
        Handlebars.registerPartial('control.textdropdownreplace', window.iadesigner['control.textdropdownreplace.handlebars']);
        Handlebars.registerPartial('control.textdropdownappend', window.iadesigner['control.textdropdownappend.handlebars']);
        Handlebars.registerPartial('control.textareadropdownappend', window.iadesigner['control.textareadropdownappend.handlebars']);
        Handlebars.registerPartial('control.separator', window.iadesigner['control.separator.handlebars']);
        Handlebars.registerPartial('control.button', window.iadesigner['control.button.handlebars']);
        Handlebars.registerPartial('control.colourpalette', window.iadesigner['control.colourpalette.handlebars']);
    }

    return iad;

})(iadesigner || {}, jQuery, bootbox, window, document);