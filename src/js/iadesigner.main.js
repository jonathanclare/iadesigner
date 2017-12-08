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
                    iad.report.loaded = true;
                    settings.report.path = userSettings.reportPath;
                }

                initCss(settings.css, function()
                {
                    initMapJson(settings.map);
                    initReport(settings.report, function()
                    {
                        iad.util.forceLinksToOpenInBrowserWindow();
                        initSidebar(settings);
                        initConfig();
                        initCanvas();
                        initColorPicker();
                        initFormControls();
                        initConfigForms(settings.configForms);
                        initFile();
                        updateDropdownMenus();
                        updateStyleDownloadButtons();
                        updateConfigDownloadButton();
                        iad.progress.end('load', function()
                        {
                            if (settings.onAppReady !== undefined) settings.onAppReady.call(null);
                        });
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
                if (id === 'iad-sidebar-widget') iad.canvas.clearSelection();
            },
            onHidden: function(id)
            {

            },
            onFirstShown: function(id)
            {
                if (id === 'iad-sidebar-templategallery') initTemplateGallery(options.templateGallery);
                else if (id === 'iad-sidebar-widgetgallery') initWidgetGallery(options.widgetGallery);
                else if (id === 'iad-sidebar-colorscheme') initColorScheme();
            },
            onShow: function(id)
            {
                if (id === 'iad-sidebar-css' || id === 'iad-sidebar-colorscheme') storedData = iad.css.getLessVars();
                else if (id === 'iad-sidebar-maplayer') storedData = iad.mapjson.toJson();
                else if (id === 'iad-sidebar-templategallery' || id === 'iad-sidebar-widgetgallery' || id === 'iad-sidebar-widget') storedData = iad.config.getXml();
            },
            onShown: function(id)
            {

            },
            onUndo: function(id)
            {
                if (id === 'iad-sidebar-css' || id === 'iad-sidebar-colorscheme') iad.css.setLessVars(storedData);
                else if (id === 'iad-sidebar-maplayer') iad.mapjson.parse(storedData);
                else if (id === 'iad-sidebar-templategallery' || id === 'iad-sidebar-widgetgallery' || id === 'iad-sidebar-widget') iad.report.parseConfig(storedData);
            }
        });
    }

    function initCss(options, callback)
    {
        iad.css.init(
        {
            lessFile: options.lessFile,
            lessVars: options.lessVars,
            onLessVarsChanged: function(lessVars)
            {
                iad.progress.start('load', function()
                {
                    // Update css form when color scheme has been changed.
                    iad.cssform.update('#iad-form-css-properties', 'forms.handlebars', options.form, lessVars);

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
                });
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
            if (iad.report.loaded) iad.file.onChangesMade();
            updateStyleDownloadButtons();
        }
    }

    function initMapJson(options)
    {
        iad.mapjson.init(
        {
            onLoad: function(jsonMap)
            {
                iad.mapform.update('#iad-form-layer-properties', 'forms.handlebars', options.form, jsonMap);
            },
            onParse: function(jsonMap)
            {
                iad.mapform.update('#iad-form-layer-properties', 'forms.handlebars', options.form, jsonMap);
                iad.progress.start('load', function()
                {
                    ia.parseMap(jsonMap, function()
                    {
                        iad.canvas.update();
                        iad.progress.end('load');
                    });
                });
            },
            onMapPropertyChanged: function(property, value)
            {

            },
            onLayerPropertyChanged: function(layerId, property, value)
            {
                iad.progress.start('load', function()
                {
                    ia.parseMap(iad.mapjson.toJson(), function()
                    {
                        iad.progress.end('load');
                    });
                });
            }
        });
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
        var storeSelectedWidgetId;
        iad.report.init(
        {
            container: 'iad-report',
            path: options.path,
            configPaths: options.configPaths,
            onReportInit: function (r)
            {
                iaReport = r;
                callback.call(null);
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
            onReportLoaded: function (configPath)
            {
                iad.file.onChangesSaved();
                iad.config.setXml(iaReport.config.xml);
                if (iad.report.loaded)
                {
                    // Reset title to show config file path.
                    var title = 'InstantAtlas Designer - ' + configPath;
                    iad.win.setTitle(title);
                    $('#iad-window-title').html(title);
                }
                updateConfigDownloadButton();
                iad.progress.end('load');
            },
            preConfigLoaded: function (callback)
            {      
                iad.progress.start('load', function()
                {
                    storeSelectedWidgetId = iad.config.selectedWidgetId;
                    iad.canvas.clearSelection();
                    callback.call(null);
                });          
            },
            onConfigLoaded: function ()
            {
                iad.config.setXml(iaReport.config.xml);
                updateDropdownMenus();
                //iad.legendform.update();
                iad.widgetgallery.update();
                iad.canvas.update();

                if (storeSelectedWidgetId !== undefined) 
                    iad.canvas.select(storeSelectedWidgetId);
                else 
                    iad.widgetproperties.refresh();
                storeSelectedWidgetId = undefined;

                iad.progress.end('load');
            }
        });
    }

    function initConfig(options)
    {
        iad.config.init(
        {
            xml: iaReport.config.xml,
            onNewConfig: function ()
            {
                onConfigChanged();
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
                updateDropdownMenus();
                iad.canvas.clearSelection();
                iad.canvas.update();
                iad.widgetgallery.update();
                onConfigChanged();
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
                            iad.report.refreshConfig();
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
                onConfigChanged();
            },
            onGroupPropertyChanged: function (groupId, propertyId)
            {
                iad.report.refreshConfig();
            },
            onPropertyAdded: function (widgetId, $xmlWidget)
            {
                onWidgetChanged(widgetId, $xmlWidget, function()
                {
                    iad.widgetproperties.refresh(true);
                });
            },
            onPropertyRemoved: function (widgetId, $xmlWidget)
            {
                onWidgetChanged(widgetId, $xmlWidget, function()
                {
                    iad.widgetproperties.refresh();
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

        function onWidgetAdded(widgetId, $xmlWidget)
        {
            updateDropdownMenus();
            iad.canvas.clearSelection();
            iad.canvas.update();
            iad.canvas.select(widgetId);
            onConfigChanged();
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
                    if (iad.report.loaded)
                    {
                        var tagName = $xmlWidget.prop('tagName');
                        if (tagName === 'Image')
                        {
                            var img = widget.container.find('img:first');
                            img.attr('src', iad.report.path  + '/' + img.attr('src'));
                        }
                        if (widgetId === iad.config.selectedWidgetId) iad.report.showWidget(widgetId); // Stop popup widgets from disappearing.

                        iad.canvas.update();
                        onConfigChanged();
                    }
                    if (callback !== undefined) callback.call(null);
                });
            });
        }
        function onConfigChanged()
        {
            if (iad.report.loaded) iad.file.onChangesMade();
            updateConfigDownloadButton();
        }
    }

    function initConfigForms(options)
    {
        iad.widgetproperties.init(
        {
            container: '#iad-form-widget-properties',
            template: 'forms.handlebars'
        });

        var cOptions = $.extend({}, options, {report : iaReport}); 
        iad.configforms.init(cOptions);
    }

    function initFormControls()
    {
        iad.formcontrols.init(
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
                else if (data.action === 'remove-column')       iad.config.removeColumn(data.controlId, data.controlIndex);
                else if (data.action === 'add-menuitem')        iad.config.addMenuItem(data.controlId);
                else if (data.action === 'remove-menuitem')     iad.config.removeMenuItem(data.controlId, data.controlIndex);
                else if (data.action === 'add-symbol')          iad.config.addSymbol(data.controlId);
                else if (data.action === 'remove-symbol')       iad.config.removeSymbol(data.controlId, data.controlIndex);
                else if (data.action === 'add-target')          iad.config.addTarget(data.controlId);
                else if (data.action === 'remove-target')       iad.config.removeTarget(data.controlId, data.controlIndex);
                else if (data.action === 'add-break')           iad.config.addBreak(data.controlId);
                else if (data.action === 'remove-break')        iad.config.removeBreak(data.controlId, data.controlIndex);
                else if (data.action === 'add-line')            iad.config.addPyramidLine(data.controlId);
                else if (data.action === 'remove-line')         iad.config.removePyramidLine(data.controlId, data.controlIndex);
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
                    iad.widgetproperties.edit(widgetId);
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
                iad.widgetproperties.edit('PropertyGroup');
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
                if (iad.report.loaded)
                    iad.report.loadConfig(filePath);
                else
                    iad.report.loadReport(filePath);
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
        Handlebars.registerPartial('control.groupcontrol', window.iadesigner['control.groupcontrol.handlebars']);
        Handlebars.registerPartial('control.button', window.iadesigner['control.button.handlebars']);
    }

    function updateDropdownMenus()
    {
        // Sort widgets by name.
        var $xmlWidgets = iad.config.getComponents();
        $xmlWidgets.sort(function(a, b)
        {
            if ($(a).attr('name') < $(b).attr('name')) return -1;
            if ($(a).attr('name') > $(b).attr('name')) return 1;
            return 0;
        });

        // Split components up by data source.
        var dataSources = new Array([], [], [], []);
        var moreThanOneDataSource = false;
        var arr;
        $.each($xmlWidgets, function(i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var id = $xmlWidget.attr('id');

            // If theres a number on the end of the id it means theres more than one data source.
            // eg. barChart2.
            var match = id.match(/\d+/);
            if (match)
            {
                moreThanOneDataSource = true;
                var index = parseInt(match[0], 10);
                arr = dataSources[index-1];
                arr[arr.length] = $xmlWidget;
            }
            else
            {
                arr = dataSources[0];
                arr[arr.length] = $xmlWidget;
            }
        });

        // General Properties.
        var options = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-id="PropertyGroup" class="iad-dropdown-option-widget-properties">General Properties</a></li>';
        options += '<li role="presentation" class="divider"></li>';

        // Add dropdown options to widget select dropdown.
        for (var i = 0; i < dataSources.length; i++)
        {
            var arrDataSources = dataSources[i];
            if (arrDataSources.length > 0)
            {
                if (moreThanOneDataSource)
                {
                    var index = i + 1;
                    if (index != 1) options += '<li role="presentation" class="divider"></li>';
                    //options += '<li role="presentation" class="dropdown-header">Data Source '+index+'</li>';
                }
                for (var j = 0; j < arrDataSources.length; j++)
                {
                    var $xmlWidget = arrDataSources[j];
                    var vis = $xmlWidget.attr('visible');
                    if (vis === 'true')
                    {
                        var id = $xmlWidget.attr('id');
                        var name = iad.config.getDisplayName(id);
                        options += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-id="'+ id + '" class="iad-dropdown-option-widget-properties">' + name + '</a></li>';
                    }
                }
            }
        }
        $('#iad-dropdown-widget-properties').html(options);
    }

    return iad;

})(iadesigner || {}, jQuery, bootbox, window, document);