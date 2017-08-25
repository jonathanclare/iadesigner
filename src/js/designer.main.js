var designer = (function (iad, $, bootbox, window, document, undefined)
{
    'use strict';

    iad = iad || {};

    var electron = require('electron');
    var remote = electron.remote;
    var Menu = electron.Menu || remote.Menu;
    var dialog = electron.dialog || remote.dialog;
    var ipcRenderer = electron.ipcRenderer;

    var win = remote.getCurrentWindow();
    var version = window.location.hash.substring(1);

    var path = require('path');
    var fs = require('fs');

    var selectedWidgetId, editedWidgetId, report, configPath, changesSaved = true;
    
    var $widgetPanel = $('#iad-slide-panel-widget-properties');
    var $cssPanel = $('#iad-slide-panel-css-properties');
    var $colorschemePanel = $('#iad-slide-panel-color-scheme');
    var $widgetPanelTitle = $('#iad-slide-panel-widget-properties-title');

    // Listen for messages from main process.
    ipcRenderer.on('message', function(event, text) 
    {
        console.log(text);
    });

    iad.init = function(options)
    {
        var settings = $.extend({}, this.defaults, options); // Merge to a blank object.

        registerHandlebarsHelperFunctions();
        initCss(settings.css, function()
        {
            ia.init(
            {
                container   : 'iad-report',
                onSuccess   : function (r)
                {
                    report = r;

                    initCanvas();
                    initColorPicker();
                    initColorSchemes();
                    initConfig();
                    initFormControls();
                    initConfigForms();
                    initConfigGallery(settings.configGallery);
                    initWidgetGallery(settings.widgetGallery);
                    initFileDragAndDrop();
                    updateDropdownMenus();
                    iad.configforms.updateJavaScriptOptions();
                    updateStyleDownloadButtons();
                    updateConfigDownloadButton();
                    initMenuHandlers();
                    setPopupMenu();

                    if (settings.onAppReady !== undefined) settings.onAppReady.call(null);
                },
                onFail      : function(url, XMLHttpRequest, textStatus, errorThrown)
                {
                    bootbox.alert(
                    {
                        message: "Could not find file: " +url,
                        backdrop: true
                    });
                    /*console.log(url);
                    console.log(XMLHttpRequest.status);
                    console.log(textStatus);
                    console.log(errorThrown);*/
                },
                data:
                {
                    config      : {source:settings.report.path+'\\config.xml'},
                    attribute   : {source:settings.report.path+'\\data.js'},
                    map         : {source:settings.report.path+'\\map.js'}
                    /*style       : {source:settings.report.path+'/default.css'}*/
                }
            });
        });
    };

    function onChangesMade()
    {
        console.log("onChangesMade");
        if (configPath !== undefined) changesSaved = false;
    }

    function saveChanges(callback)
    {
        if (configPath !== undefined)
        {
            var reportPath = path.parse(configPath).dir;
            var lessPath = reportPath+'\\style.json';
            var stylePath = reportPath+'\\default.css';

            saveFile(configPath, iad.config.toString(), function ()
            { 
                saveFile(lessPath, iad.css.getLessVarsAsString(), function ()
                {
                    iad.css.getCssAsString(function (strCss)
                    {
                        saveFile(stylePath, strCss, function ()
                        {              
                            changesSaved = true;
                            if (callback !== undefined) callback.call(null);  
                        });
                    });
                });
            });
        } 
        else
        {
            bootbox.alert(
            {
                message: 'You need to load a valid InstantAtlas Report before you can use this functionality.' +
                ' See <a target="_blank" href="http://www.instantatlas.com/">www.instantatlas.com</a> for further details',
                backdrop: true
            });
        }
    }

    function saveChangesBeforeContinuing(callback)
    {
        if (changesSaved) callback.call(null); 
        else
        {
            bootbox.confirm(
            {
                title: "Save Changes?",
                message: "Save changes before continuing?",
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
                        saveChanges(function()
                        {
                            callback.call(null); 
                        });
                    }
                    else callback.call(null); 
                }
            });
        }
    }

    function updateStyleDownloadButtons()
    {
        // colorscheme.json
        var lessBlob = new Blob([iad.css.getLessVarsAsString()], {type: 'application/json' }); 
        var lessUrl = URL.createObjectURL(lessBlob);
        $('#iad-btn-download-less').attr('href', lessUrl);

        // default.css
        iad.css.getCssAsString(function (strCss)
        {
            var cssBlob = new Blob([strCss], {type: 'text/css' }); 
            var cssUrl = URL.createObjectURL(cssBlob);
            $('#iad-btn-download-css').attr('href', cssUrl);
        });
    }

    function updateConfigDownloadButton()
    {
        // config.xml
        var configBlob = new Blob([iad.config.toString()], {type: 'text/xml' }); 
        var configUrl = URL.createObjectURL(configBlob);
        $('#iad-btn-download-config').attr('href', configUrl);
    }

    function initMenuHandlers()
    {
        // Window buttons.
        $("#iad-min-btn").on("click", function (e) 
        {
            win.minimize();
        });
        $("#iad-close-btn").on("click", function (e) 
        {
            saveChangesBeforeContinuing(function()
            {
                win.close();
            });
        });
        $("#iad-max-btn").on("click", function (e) 
        {
            if (win.isMaximized()) win.unmaximize();
            else win.maximize();
        });
        win.on('maximize', function (e) 
        {
            $("#iad-max-btn").html('<i class="fa fa-window-restore"></i>');
        });
        win.on('unmaximize', function (e)
        {
            $("#iad-max-btn").html('<i class="fa fa-window-maximize"></i>');
        });

        // Open.
        $('#iad-menuitem-open').on('click', function(e)
        {
            openConfigFile(function (configPath)
            {
                iad.config.loadReport(configPath);
            });
        });

        // Save.
        $('#iad-menuitem-save').on('click', function(e)
        {
            saveChanges();
        });

        // Exit.
        $('#iad-menuitem-exit').on('click', function(e)
        {
            saveChangesBeforeContinuing(function()
            {
                win.close();
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

        // Refresh report.
        $('#iad-menuitem-refresh-report').on('click', function(e)
        {
            if (configPath !== undefined)
            {
                saveChangesBeforeContinuing(function()
                {
                    iad.config.loadReport(configPath);
                });
            }
            else iad.config.refreshConfig();
        });

        // Insert widgets.
        $(document).on('click', '#iad-menuitem-insert-image', function(e)
        {
            iad.config.addWidget('Image');
        });
        $(document).on('click', '#iad-menuitem-insert-text', function(e)
        {
            iad.config.addWidget('Text');
        });
        $(document).on('click', '#iad-menuitem-insert-button', function(e)
        {
            iad.config.addWidget('Button');
        });

        // Edit widget dropdown option.
        $(document).on('click', '.iad-dropdown-option-widget-properties', function(e)
        {
            e.preventDefault();
            var widgetId = $(this).data('id');
            editWidgetProperties(widgetId);
        });

        // Edit widget button.
        $('#iad-btn-widget-edit').on('click', function(e)
        {
            if (selectedWidgetId !== undefined)
            {
                if (selectedWidgetId === editedWidgetId) closeSlidePanel('widget');
                else editWidgetProperties(selectedWidgetId);
            }
        });

        // Send widget to back button.
        $('#iad-btn-widget-send-to-back').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) iad.config.sendToBack(selectedWidgetId);
        });

        // Bring widget to front button.
        $('#iad-btn-widget-bring-to-front').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) iad.config.bringToFront(selectedWidgetId);
        });

        // Close slide panel buttons.
        $('#iad-btn-close-widget-panel').on('click', function (e)
        {
            closeSlidePanel('widget');
        });
        $('#iad-btn-close-css-panel').on('click', function (e)
        {
            closeSlidePanel('css');
        });
        $('#iad-btn-close-color-scheme-panel').on('click', function (e)
        {
            closeSlidePanel('colorscheme');
        });

        // Open slide panels.
        $('#iad-menuitem-open-css').on('click', function (e)
        {
            closeSlidePanel('widget');
            closeSlidePanel('colorscheme');
            if ($cssPanel.is(":visible")) closeSlidePanel('css');
            else openSlidePanel('css');
        });
        $('#iad-menuitem-open-color-scheme').on('click', function (e)
        {
            closeSlidePanel('widget');
            closeSlidePanel('css');
            if ($colorschemePanel.is(":visible")) closeSlidePanel('colorscheme');
            else openSlidePanel('colorscheme');
        });

        // Open less file.
        $('#iad-btn-upload-less').on('click', function (e)
        {
            openLessFile(function (filePath)
            {
                iad.css.readLessVarsFile(filePath, function () {});
            });
        });
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

    function openWin(url)
    {  
        var win = new remote.BrowserWindow({ width: 1000, height: 800});
        win.loadURL(url);
        win.on('closed', function() {win = null;});
    }

    function openConfigFile(callback)
    {
        var files = dialog.showOpenDialog(remote.getCurrentWindow(), 
        {
            title: 'Open IA Configuration File',
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

    function openLessFile(callback)
    {
        var files = dialog.showOpenDialog(remote.getCurrentWindow(), 
        {
            title: 'Open IA Style File',
            properties: ['openFile'],
            filters: [{name: 'style', extensions: ['json']}]
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

    function getSlidePanel(name)
    {
        if (name === 'widget') return $widgetPanel ;
        else if (name === 'css') return $cssPanel;
        else if (name === 'colorscheme') return $colorschemePanel;
        return undefined;
    }

    function closeSlidePanel(name)
    {
        if (name === 'widget') editedWidgetId = undefined;
        var $panel = getSlidePanel(name);
        var w = ($panel.outerWidth() + 20) * -1;
        $panel.animate({left: w + 'px'}, {duration: 400,queue: false, complete: function() {$panel.hide();}});
    }

    function openSlidePanel(name)
    {
        var $panel = getSlidePanel(name);
        $panel.show();
        $panel.animate({left: '0px'}, {duration: 400,queue: false});
    }

    function editWidgetProperties(widgetId)
    {
        editedWidgetId = widgetId;

        var title = iad.config.getDisplayName(widgetId);
        $widgetPanelTitle.text(title);

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

        closeSlidePanel('css');
        closeSlidePanel('colorscheme');
        openSlidePanel('widget');
    }

    function initCss(options, callback)
    {
        // Apply the handlebars template for the css form.
        var template = window.designer['forms.handlebars'];
        var html = template(options.form);
        $('#iad-form-css-properties').html(html);

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
                            onStyleChanged();
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
            onChangesMade();
            updateStyleDownloadButtons();
        }
    }

    function initColorPicker()
    {
        iad.colorpicker.init({});
    }

    function initColorSchemes()
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

    function initConfig()
    {
        iad.config.init(
        {
            report : report,
            preConfigLoaded: function ()
            {                
                closeSlidePanel('widget');
                iad.canvas.clearSelection();
            },
            onReportLoaded: function (filePath)
            {

        console.log("onReportLoaded");

                changesSaved = true;
                configPath = filePath;
                var reportPath = path.parse(configPath).dir;

                // Reset title to show config file path.
                var title = 'InstantAtlas Designer ' + version + ' - ' + configPath;
                remote.getCurrentWindow().setTitle(title);
                $('#iad-title').html(title);

                // Fix image paths.
                [].forEach.call(document.querySelectorAll('#iad-report IMG'), function(img, index) 
                {
                    var src = img.getAttribute('src');
                    img.src = reportPath  + '\\' + src;
                });

                updateConfigDownloadButton();
            },
            onConfigLoaded: function ()
            {
                updateDropdownMenus();
                //iad.legendform.update();
                iad.configforms.refreshForm();
                iad.canvas.update();
            },
            onWidgetRemoved: function (widgetId)
            {
                updateDropdownMenus();
                if (widgetId === selectedWidgetId) iad.canvas.clearSelection();
                if (widgetId === editedWidgetId) closeSlidePanel('widget');
                iad.canvas.update();
            },
            onWidgetAdded: function (widgetId)
            {
                updateDropdownMenus();
                iad.canvas.clearSelection();
                iad.canvas.update();
                iad.canvas.select(widgetId);
            },
            onWidgetChanged: function (widgetId, type)
            {
                if (widgetId === selectedWidgetId) iad.config.showWidget(widgetId); // Stop popup widgets from disappearing.
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
                onChangesMade();
                updateConfigDownloadButton();
            }
        });
    }

    function initConfigForms()
    {
        iad.configforms.init(
        {
            report : report,
            container: '#iad-form-widget-properties',
            template: 'forms.handlebars'
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
                else if (tagName === 'Component' || tagName === 'Table')
                {                    
                    iad.config.setWidgetProperty(widgetId, propertyId, newValue);
                }  
                else if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text') 
                {
                    iad.config.setWidgetAttribute(widgetId, propertyId, newValue);
                }
                else if (tagName == 'PropertyGroup')
                {
                    iad.config.setGroupProperty(widgetId, propertyId, newValue);
                }
                else if (tagName == 'MapPalettes')
                {

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
                    //iad.legendform.updateProperty(propertyId, attribute, newValue);
                }
            }
        });
    }

    function initCanvas()
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
                        if (result === true) iad.config.removeWidget(widgetId);
                    }
                });
            },
            onEditBtnClick: function (widgetId)
            {
                if (widgetId === editedWidgetId) closeSlidePanel('widget');
                else editWidgetProperties(widgetId);
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
        var cPath;
        var $menuitem = $('#iad-menuitem-config-gallery');
        var $modal = $('#iad-modal-config-gallery');

        $menuitem.on('click', function(e)
        {
            $modal.modal({show: true});
        });
        $modal.on('shown.bs.modal', function ()
        {
            cPath = undefined;
            if (!iad.configgallery.initialised)
            {
                iad.configgallery.init(
                {
                    template: 'config-gallery.handlebars',
                    container: '#iad-config-gallery',
                    reportPath: options.reportPath,
                    configPath: options.configPath,
                    json: options.json,
                    onApply: function (filePath)
                    {
                        showWarning(
                        {
                            onContinue: function ()
                            {
                                cPath = filePath;
                                $modal.modal('hide');
                            }
                        });
                    },
                    onPreview: function (filePath)
                    {
                        openWin('file://' + __dirname + filePath);
                    },
                    onLoad: function ()
                    {
                        showWarning(
                        {
                            onContinue: function ()
                            {
                                openConfigFile(function (filePath)
                                {
                                    cPath = filePath;
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
            if (cPath !== undefined)
            {
                iad.canvas.clearSelection();
                iad.config.loadConfig(cPath);
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
        var $menuitem = $('#iad-menuitem-insert-widget');
        var $modal = $('#iad-modal-widget-gallery');

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
                    template: 'widget-gallery.handlebars',
                    container: '#iad-widget-gallery',
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

    function initFileDragAndDrop()
    {
		// File upload drag and drop.
		$('#iad-report').on('drop', function (e) 
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
                    iad.config.loadReport(f.path);
                }
                else if (fileName.indexOf('.json') != -1) // json-less-vars.json - file type doesnt seem to work for json.
                {
                    iad.css.readLessVarsFile(f.path, function () {});
                }
            }
		});
		$('#iad-report').on('dragover', function (e) 
		{
			e.stopPropagation();
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		});
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

    function updateDropdownMenus()
    {
        iad.configforms.updateJavaScriptOptions();

        // Update widget properties.

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

})(designer || {}, jQuery, bootbox, window, document);