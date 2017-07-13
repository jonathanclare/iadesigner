var designer = (function (iad, $, bootbox, window, document, undefined)
{
    'use strict';

    iad = iad || {};

    var electron = require('electron');
    var fs = require('fs');
    var remote = electron.remote;
    var Menu = electron.Menu || remote.Menu;
    var dialog = electron.dialog || remote.dialog;
    var ipcRenderer = electron.ipcRenderer;

    var settings; 
    var changesSaved = true;
    var selectedWidgetId;
    var report;
    
    var version = window.location.hash.substring(1);
    document.getElementById('version').innerText = version;

    // Listen for messages
    ipcRenderer.on('message', function(event, text) 
    {
        //console.log(text);
        /*var container = document.getElementById('messages');
        var message = document.createElement('div');
        message.innerHTML = text;
        container.appendChild(message);*/
    });

    iad.init = function(options)
    {
        settings = $.extend({}, this.defaults, options); // Merge to a blank object.

        //setApplicationMenu();
        //setPopupMenu();
        registerHelperFunctions();
        initCss(settings.css, function()
        {
            initReport(settings.report.path);
        });
    };

    function onReportReady(r)
    {
        report = r;
        initCanvas(report);
        initColorPicker();
        initColorSchemes(settings.colorSchemes);
        initConfig(report);
        initFormControls();
        initConfigForms(report, settings.configForms);
        initConfigGallery(settings.configGallery);
        initWidgetGallery(settings.widgetGallery);
        addMenuHandlers();
        addFileDragAndDrop();
        updateWidgetPropertiesDropdown();

        iad.configforms.updateJavaScriptOptions();
    }

    function addMenuHandlers()
    {
        var configPath;

        // Open.
        $('#iad-menuitem-open').on('click', function(e)
        {
            openConfigFile(function (filePath)
            {
                iad.canvas.clearSelection();
                iad.config.loadReport(dirPath(filePath), function ()
                {
                    configPath = filePath;
                });
            });
        });

        // Save.
        $('#iad-menuitem-save').on('click', function(e)
        {
            saveFile(configPath, iad.config.toString(), function ()
            {
                changesSaved = true;
                console.log('saved');
            });
        });

        // Design / Published mode.
        $('input[name="iad-radio-report-mode"]').on('click change', function(e)
        {
            var designMode = $(this).val().toLowerCase() !== 'published';
            if (!designMode)
            {
                // Edit off.
                iad.canvas.off();
            }
            else
            {
                // Edit on.
                iad.canvas.on();
            }
        });

        // Widget dropdown option.
        $(document).on('click', '.iad-dropdown-option-widget-properties', function(e)
        {
            e.preventDefault();
            var widgetId = $(this).data('id');
            openConfigProperties(widgetId);
            if (widgetId === 'PropertyGroup')
            {
                iad.canvas.clearSelection();
                iad.configforms.showPropertyGroupForm();
            }
            else
            {
                iad.canvas.select(widgetId);
                iad.configforms.showWidgetForm(widgetId);
            }
        });

        // Edit widget.
        $('#iad-btn-widget-edit').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) 
            {
                openConfigProperties(selectedWidgetId);
                iad.configforms.showWidgetForm(selectedWidgetId);      
            }
        });

        // Send widget to back.
        $('#iad-btn-widget-send-to-back').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) iad.config.sendToBack(selectedWidgetId);
        });

        // Bring widget to front.
        $('#iad-btn-widget-bring-to-front').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) iad.config.bringToFront(selectedWidgetId);
        });

        // Close slide panels.
        $('#iad-btn-close-slide-panel-widget-properties').on('click', function (e)
        {
            closeSlidePanel('widget');
        });
        $('#iad-btn-close-slide-panel-css-properties').on('click', function (e)
        {
            closeSlidePanel('css');
        });
        $('#iad-btn-close-slide-panel-color-scheme').on('click', function (e)
        {
            closeSlidePanel('colorscheme');
        });

        // Open slide panels.
        $('#iad-menuitem-open-slide-panel-css-properties').on('click', function (e)
        {
            closeSlidePanel('widget');
            closeSlidePanel('colorscheme');
            if ($('#iad-slide-panel-css-properties').is(":visible")) closeSlidePanel('css');
            else openSlidePanel('css');
        });
        $('#iad-menuitem-open-slide-panel-color-scheme-properties').on('click', function (e)
        {
            closeSlidePanel('widget');
            closeSlidePanel('css');
            if ($('#iad-slide-panel-color-scheme').is(":visible")) closeSlidePanel('colorscheme');
            else openSlidePanel('colorscheme');
        });
    }

    function closeSlidePanel (name)
    {
        var $panel;
        if (name === 'widget') $panel = $('#iad-slide-panel-widget-properties');
        else if (name === 'css') $panel = $('#iad-slide-panel-css-properties');
        else if (name === 'colorscheme') $panel = $('#iad-slide-panel-color-scheme');
        var w = ($panel.outerWidth() + 20) * -1;
        $panel.animate({left: w + 'px'}, {duration: 400,queue: false, complete: function() {$panel.hide();}});
    }

    function openSlidePanel (name)
    {
        var $panel;
        if (name === 'widget') $panel = $('#iad-slide-panel-widget-properties');
        else if (name === 'css') $panel = $('#iad-slide-panel-css-properties');
        else if (name === 'colorscheme') $panel = $('#iad-slide-panel-color-scheme');
        $panel.show();
        $panel.animate({left: '0px'}, {duration: 400,queue: false});
    }

    function openConfigProperties(widgetId)
    {
        var title = iad.config.getDisplayName(widgetId);
        $('#iad-slide-panel-widget-properties-title').text(title);
        closeSlidePanel('css');
        closeSlidePanel('colorscheme');
        openSlidePanel('widget');
    }

    function initCss(options, callback)
    {
        // Apply the handlebars template for the css form.
        var template = window.designer[options.template];
        var html = template(options.form);
        $(options.container).html(html);

        iad.css.init(
        {
            lessFile: options.lessFile,
            lessVars: options.lessVars,
            onLessVarsChanged: function(lessVars)
            {
                // Update css form when color scheme has been changed.
                for (var property in lessVars)
                {
                    var $control = $('#' + property.substring(1)); // Substring to remove'@'.
                    var value = lessVars[property];
                    if (ia.Color.isHex(value))  $control.css('background-color', value); // Color.
                    else                
                    {
                        var pos = value.indexOf('px');
                        if (pos != -1) value = value.substring(0, pos);
                        if ($control.hasClass('iad-control-range'))  $control.next().html(value);
                        $control.val(value); // Numeric / Select.
                    }       
                }

                // Highlight/selection and chart color changes need report refresh.
                if (report !== undefined)
                {
                    var factory = report.getComponent('factory');
                    report.highlightColor = lessVars['@highlight-color'];
                    report.selectionColor = lessVars['@selection-color'];
                    factory.updateComponents(function ()
                    {
                        factory.renderComponents(function () 
                        {
                            iad.changesSaved = false;
                        });
                    });
                }
            },
            onPropertyChanged: function(property, value)
            {
                // Refresh report if necessary when the user has changed a property in the css form.
                if (report !== undefined)
                {
                    var factory = report.getComponent('factory');
                    if ((property === '@highlight-color' || property === '@selection-color') || property === undefined) 
                    {
                        if (property === '@highlight-color') report.highlightColor = value;
                        if (property === '@selection-color') report.selectionColor = value;
                        factory.updateComponents(function ()
                        {
                            factory.renderComponents(function () 
                            {
                                iad.changesSaved = false;
                            });
                        });
                    }
                    else if (property === '@chart-font-color' || property === '@chart-font-size' || property === '@chart-grid-color') 
                    {
                        factory.renderComponents(function() 
                        {
                            iad.changesSaved = false;
                        });
                    } 
                }
            },
            onReady: function()
            {
                if (callback !== undefined) callback.call(null);
            }
        });
    }

    function initColorPicker()
    {
        iad.colorpicker.init({});
    }

    function initColorSchemes(options)
    {
        iad.colorscheme.init(
        {
            container: options.container,
            onChange: function(jsonColorScheme)
            {
                iad.css.setLessVars(jsonColorScheme);
            }
        });
    }

    function initConfig(report)
    {
        iad.config.init(
        {
            report : report,
            onConfigLoaded: function ()
            {
                iad.configforms.updateJavaScriptOptions();
                updateWidgetPropertiesDropdown();
                // Update widget and legend forms to pick up any changes in data lists for dropdowns.
                //iad.legendform.update();
                iad.configforms.refreshForm();
                iad.canvas.update();
            },
            onWidgetRemoved: function (widgetId)
            {
                iad.configforms.updateJavaScriptOptions();
                updateWidgetPropertiesDropdown();
                iad.canvas.update();
            },
            onWidgetAdded: function (widgetId)
            {
                iad.configforms.updateJavaScriptOptions();
                updateWidgetPropertiesDropdown();
                iad.canvas.update();
                iad.canvas.select(widgetId);
            },
            onWidgetChanged: function (widgetId, type)
            {
                if (type === 'property-added' || type === 'property-removed' || type === 'column-changed') iad.configforms.showWidgetForm(widgetId);
            },
            onZIndexChanged: function (widgetId)
            {
                iad.canvas.select(widgetId);
                //$('#ia-widget-tab').tab('show');
            },
            onGroupPropertyChanged: function (propertyGroupId, propertyId)
            {
                if (propertyGroupId.indexOf('thematics') === -1 &&      // Thematics are now dynamically updated via the legend tab so dont require a full config update.
                    propertyGroupId.indexOf('pointSymbols') === -1 && 
                    propertyGroupId.indexOf('lineSymbols') === -1)
                {
                    iad.config.refreshConfig();
                }
            },
            onConfigChanged: function ()
            {
                changesSaved = false;
            }
        });
    }

    function initConfigForms(report, options)
    {
        iad.configforms.init(
        {
            report : report,
            container: options.container,
            template: options.template
        });
    }

    function initFormControls()
    {
        iad.formcontrols.init(
        {
            onPropertyChanged: function (controlId, tagName, widgetId, propertyId, newValue, attribute)
            {
                /*
                console.log('controlId: '+controlId);
                console.log('tagName: '+tagName);
                console.log('widgetId: '+widgetId);
                console.log('propertyId: '+propertyId);
                console.log('newValue: '+newValue);
                console.log('attribute: '+attribute);
                */

                if (tagName === 'Column')
                {
                    if (attribute === 'alias' || attribute === 'name' || attribute === 'symbol' || attribute === 'width' || attribute === 'national')
                    {
                        iad.config.setColumnProperty(controlId, widgetId, propertyId, attribute, newValue);
                    }
                    else
                    {
                        iad.config.setWidgetProperty(widgetId, propertyId, newValue); // Special spine chart column properties like min, mid ,max labels.
                    }
                }
                else if (tagName === 'Component' || tagName === 'Table' || tagName === 'Button' || tagName === 'Image' || 
                         tagName === 'Text' || tagName === 'PropertyGroup' || tagName === 'MapPalettes')
                {
                    iad.config.setWidgetProperty(widgetId, propertyId, newValue);
                }
                else // Css control.    
                {
                    if (ia.isNumber(newValue))
                    {
                        if (newValue < 0) newValue = 0;
                        newValue = newValue + 'px';
                    }
                    iad.css.setProperty(tagName, newValue);
                }

                // Dynamically update thematics.
                if (widgetId && (widgetId.indexOf('thematics') !== -1 || widgetId.indexOf('pointSymbols') !== -1 || widgetId.indexOf('lineSymbols') !== -1))
                {
                    iad.legendform.updateProperty(propertyId, attribute, newValue);
                }
            }
        });
    }

    function initCanvas(report)
    {
        var $nav = $('#iad-nav-widgets');
        iad.canvas.init(
        {
            report : report,
            onSelect: function (widgetId)                   // Computational select.
            {
                $nav.show();
                if (widgetId !== selectedWidgetId)
                {
                    iad.formcontrols.activePanelIndex = 0;
                    selectedWidgetId = widgetId;
                    iad.config.showWidget(widgetId);
                }
            },
            onUnselect: function (widgetId)
            {
                iad.config.hideWidget(widgetId);
                $nav.hide();
                selectedWidgetId = undefined;
            },
            onClearSelection: function ()
            {           
                $nav.hide();
                selectedWidgetId = undefined;
            },
            onDragEnd: function (widgetId, x, y)            // Dimensions are % values.
            {
                iad.config.setWidgetDimensions(widgetId, x, y);
            },
            onResizeEnd: function (widgetId, x, y, w, h)    // Dimensions are % values.
            {
                iad.config.setWidgetDimensions(widgetId, x, y, w, h);
            },
            onRemoveBtnClick: function (widgetId)
            {
                bootbox.confirm(
                {
                    title: "Confirm Delete?",
                    message: "Are you sure you want to delete this widget?",
                    buttons: 
                    {
                        cancel: 
                        {
                            label: '<i class="fa fa-times"></i> No'
                        },
                        confirm: 
                        {
                            label: '<i class="fa fa-check"></i> Yes'
                        }
                    },
                    callback: function (result) 
                    {
                        if (result === true)
                        {
                            iad.canvas.clearSelection();
                            iad.config.removeWidget(widgetId);
                            //closeSlidePanel('widget');
                        }
                    }
                });
            },
            onEditBtnClick: function (widgetId)
            {
                openConfigProperties(widgetId);
                iad.configforms.showWidgetForm(widgetId);      
            },
            onActivated: function ()
            {
                if (selectedWidgetId !== undefined) $nav.show();
            },
            onDeactivated: function ()
            {
                $nav.hide();
            }
        });
    }

    function initConfigGallery(options)
    {
        var configPath;
        var $menuitem = $(options.menuitem);
        var $modal = $(options.modal);

        $menuitem.on('click', function(e)
        {
            $modal.modal({show: true});
        });
        $modal.on('shown.bs.modal', function ()
        {
            configPath = undefined;
            if (!iad.configgallery.initialised)
            {
                iad.configgallery.init(
                {
                    template: options.template,
                    container: options.container,
                    reportPath: options.reportPath,
                    configPath: options.configPath,
                    json: options.json,
                    onApply: function (filePath)
                    {
                        showWarning(
                        {
                            onContinue: function ()
                            {
                                configPath = filePath;
                                $modal.modal('hide');
                            }
                        });
                    },
                    onPreview: function (filePath)
                    {
                        openWin(filePath);
                    },
                    onLoad: function ()
                    {
                        showWarning(
                        {
                            onContinue: function ()
                            {
                                openConfigFile(function (filePath)
                                {
                                    configPath = filePath;
                                    $modal.modal('hide');
                                });
                            }
                        });
                    }
                });
            }
        });
        $modal.on('hidden.bs.modal', function ()
        {
            if (configPath !== undefined)
            {
                iad.canvas.clearSelection();
                iad.config.loadConfig(configPath, function ()
                {

                });
            }
        });

        function showWarning(o)
        {
            bootbox.confirm(
            {
                title: "Continue?",
                message: "Any changes to widget properties (including table columns) will be lost if you apply a new template. Do you wish to continue?",
                buttons: 
                {
                    cancel: 
                    {
                        label: '<i class="fa fa-times"></i> No'
                    },
                    confirm: 
                    {
                        label: '<i class="fa fa-check"></i> Yes'
                    }
                },
                callback: function (result) 
                {
                    if (result === true && o && o.onContinue) o.onContinue.call(null);
                    else if (options && o.onCancel) o.onCancel.call(null);
                }
            });
        }
    }

    function initWidgetGallery(options)
    {
        var widgetId;
        var $menuitem = $(options.menuitem);
        var $modal = $(options.modal);

        $menuitem.on('click', function(e)
        {
            $modal.modal({show: true});
        });
        $modal.on('shown.bs.modal', function ()
        {
            widgetId = undefined;
            if (!iad.widgetgallery.initialised)
            {
                iad.widgetgallery.init(
                {
                    template: options.template,
                    container: options.container,
                    json: options.json,
                    onAdd: function (id)
                    {
                        widgetId = id;
                        $modal.modal('hide');
                    }
                });
            }

            iad.widgetgallery.update();
        });
        $modal.on('hidden.bs.modal', function ()
        {
            if (widgetId !== undefined) iad.config.addWidget(widgetId);
        });
    }

    function initReport(dirPath)
    {
        // Initialise IA Report.
        ia.init(
        {
            container   : settings.report.id,
            onSuccess   : function (report)
            {
                onReportReady(report);
                if (settings.onAppReady !== undefined) settings.onAppReady.call(null);
            },
            onFail      : function(url, XMLHttpRequest, textStatus, errorThrown)
            {
                console.log(url);
                console.log(XMLHttpRequest.status);
                console.log(textStatus);
                console.log(errorThrown);
            },
            data:
            {
                config      : {source:dirPath+'/config.xml'},
                attribute   : {source:dirPath+'/data.js'},
                map         : {source:dirPath+'/map.js'}
                /*style       : {source:dirPath+'/default.css'}*/
            }
        });
    }

    function dirPath(filePath)
    {
        return filePath.substring(0,filePath.lastIndexOf('\\')+1);
    }

    function addFileDragAndDrop()
    {
		// File upload drag and drop.
		$('#'+settings.report.id).on('drop', function (e) 
		{
			e.stopPropagation();
			e.preventDefault();

            if (e.originalEvent.dataTransfer.files.length > 0)
            {
                var f = e.originalEvent.dataTransfer.files[0];
                var fileName = escape(f.name);
                var fileType = f.type;
                var fileSize = f.size + ' bytes';
                var filePath = f.path;
                var lastModified = 'last modified: '+f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a';
                ia.log(fileName+' '+fileType+' '+fileSize+' '+lastModified);

                if (fileType.match('text/xml')) // config.xml
                {
                    iad.canvas.clearSelection();
                    iad.config.loadConfig(f.path, function ()
                    {

                    });
                }
                else if (fileName.indexOf('.json') != -1) // json-less-vars.json - file type doesnt seem to work for json.
                {

                }
            }
		});
		$('#'+settings.report.id).on('dragover', function (e) 
		{
			e.stopPropagation();
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		});
    }

    // Registers handlebars helper functions.
    function registerHelperFunctions()
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
            if (val1 === val2) return options.fn(this);
            return options.inverse(this);
        });
        // For stripes.
        Handlebars.registerHelper('ifEven', function (conditional, options)
        {
            if ((conditional % 2) === 0) return options.fn(this);
            else return options.inverse(this);
        });
        // For active collapsible panel.
        Handlebars.registerHelper('isActive', function (index, options)
        {
            if (index ===  iad.formcontrols.activePanelIndex) return options.fn(this);
            return options.inverse(this);
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
    }

    // Updates the widget dropdowns.
    function updateWidgetPropertiesDropdown()
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
        var options = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-id="PropertyGroup" class="iad-dropdown-option-widget-properties iad-dropdown-option">General Properties</a></li>';
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
                        options += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-id="'+ id + '" class="iad-dropdown-option-widget-properties iad-dropdown-option">' + name + '</a></li>';
                    }
                }
            }
        }
        $('#iad-dropdown-widget-properties').html(options);
    }

    function openWin(filePath)
    {  
        var win = new remote.BrowserWindow({ width: 1000, height: 800});

        // Open the DevTools.
        //win.webContents.openDevTools();

        win.loadURL('file://' + __dirname + filePath);

        // Emitted when the window is closed.
        win.on('closed', function() 
        {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null;
        });
    }

    function openConfigFile(callback)
    {
        var files = dialog.showOpenDialog(remote.getCurrentWindow(), 
        {
            title: 'Open config.xml',
            properties: ['openFile'],
            filters: [{name: 'config', extensions: ['xml']}]
        });

        if (!files) 
        {
            return;
        }
        else 
        {
            if (callback !== undefined) callback.call(null, files[0]);
        }
    }

    function saveFile(filePath, strFileContent, callback)
    {
        if (filePath !== undefined)
        {
            fs.writeFile(filePath, strFileContent, function (err) 
            {
                if (err === null) 
                {
                    if (callback !== undefined) callback.call(null);
                } 
                else 
                {
                    dialog.showErrorBox('File save error', err.message);
                }
            });
        }
    }

    function setApplicationMenu() 
    {
        var template = 
        [
            {
                label: 'File',
                submenu: 
                [
                    {
                        label: 'Open',
                        accelerator: 'Shift+CmdOrCtrl+O',
                        click: function() 
                        {
                            openConfigFile(function (filePath)
                            {
                                iad.config.loadReport(dirPath(filePath), function ()
                                {

                                });
                            });
                        }
                    },
                    {
                        label: 'Save',
                        accelerator: 'Shift+CmdOrCtrl+S',
                        click: function()  
                        {
                            console.log('Save');
                        }
                    },
                    {type: 'separator'},
                    {
                        label: 'Exit',
                        role:'close'
                    }
                ]
            },
            {
                label: 'Help',
                submenu: 
                [
                    {
                        label: 'Help on InstantAtlas Designer',
                        click: function()  
                        {
                            console.log('Help on Designer');
                        }
                    },
                    {type: 'separator'},
                    {
                        label: 'About',
                        role:'about'
                    }
                ]
            }
            /*
            {
                label: 'Layout',
                submenu: 
                [
                    {
                        label: 'Change Layout',
                        click: function() 
                        {
                            console.log('Change Layout');
                        }
                    },
                    {
                        label: 'Add Widget',
                        click: function()  
                        {
                            console.log('Add Widget');
                        }
                    }
                ]
            },
            {
                label: 'Style',
                submenu: 
                [
                    {
                        label: 'Edit Styles',
                        click: function() 
                        {
                            console.log('Edit Styles');
                        }
                    },
                    {
                        label: 'Choose Colour Scheme',
                        click: function()  
                        {
                            console.log('Choose Colour Scheme');
                        }
                    }
                ]
            },
            {
                label: 'View',
                submenu: 
                [
                    {
                        label: 'Design View',
                        accelerator: 'Shift+CmdOrCtrl+D',
                        type:'radio',
                        click: function() 
                        {
                            console.log('Design View');
                        }
                    },
                    {
                        label: 'Published View',
                        accelerator: 'Shift+CmdOrCtrl+P',
                        type:'radio',
                        click: function()  
                        {
                            console.log('Published View');
                        }
                    }
                ]
            },
            */
        ];
        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }

    function setPopupMenu() 
    {   
        var template = 
        [
            {
                label: 'Help',
                submenu: 
                [
                    {
                        label: 'Help on Designer',
                        click: function()  
                        {
                            console.log('Help on Designer');
                        }
                    },
                    {type: 'separator'},
                    {
                        label: 'About',
                        role:'about'
                    }
                ]
            }
        ];
        var menu = Menu.buildFromTemplate(template);
        
        window.addEventListener('contextmenu', function (e)
        {
            e.preventDefault();
            menu.popup(remote.getCurrentWindow());
        }, false);
    }

    return iad;

})(designer || {}, jQuery, bootbox, window, document);