var designer = (function (iad, $, bootbox, window, document, undefined)
{
    'use strict';

    iad = iad || {};

    var electron = require('electron');
    var remote = electron.remote;
    var Menu = electron.Menu || remote.Menu;
    var dialog = electron.dialog || remote.dialog;
    var ipc = electron.ipcRenderer;
    var shell = electron.shell;
    var path = require('path');
    var fs = require('fs');

    var win = remote.getCurrentWindow();
    var $main = $('#iad-main');
    var $report = $('#iad-report');
    var $updateBar = $('#iad-update-bar');
    var $sidebarWidget = $('#iad-sidebar-widget');
    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $sidebarCss = $('#iad-sidebar-css');
    var $sidebarColorscheme = $('#iad-sidebar-colorscheme');
    var selectedWidgetId, editedWidgetId, report, configPath, changesSaved = true, userReportLoaded = false;

    // Listen for log messages from main process for debugging.
    ipc.on('log', function(event, text) 
    {
        console.log(text);
    });

    iad.init = function(options)
    {
        var settings = $.extend({}, this.defaults, options); // Merge to a blank object.
        registerHandlebarsHelperFunctions();

        // Open links in default browser window.
        $(document).on('click', 'a[href^="http"]', function(event) 
        {
            event.preventDefault();
            shell.openExternal(this.href);
        });

        checkForUpdate(function()
        {
            initCss(settings.css, function()
            {
                ia.init(
                {
                    container: 'iad-report',
                    onSuccess: function (r)
                    {
                        report = r;

                        initCanvas();
                        initColorPicker();
                        initColorSchemes();
                        initConfig(settings.config);
                        initFormControls();
                        initConfigForms();
                        initConfigGallery(settings.configGallery);
                        initWidgetGallery(settings.widgetGallery);
                        initFileDragAndDrop();
                        updateDropdownMenus();
                        updateStyleDownloadButtons();
                        updateConfigDownloadButton();
                        initMenuHandlers();
                        renderAboutModal();
                        setPopupMenu();

                        if (settings.onAppReady !== undefined) settings.onAppReady.call(null);
                    },
                    onFail: function(url, XMLHttpRequest, textStatus, errorThrown)
                    {
                        bootbox.alert(
                        {
                            message: "Could not find file: " +url,
                            backdrop: true
                        });
                    },
                    data:
                    {
                        config: {source:settings.report.path+'/config.xml'},
                        attribute: {source:settings.report.path+'/data.js'},
                        map : {source:settings.report.path+'/map.js'}
                    }
                });
            });
        });

    };

    function checkForUpdate(callback)
    {
        ipc.on('update-downloaded', function(event) 
        {
            showUpdateBar(function()
            {
                callback.call(null);
            });
        });
        ipc.on('update-not-available', function(event) 
        { 
            $updateBar.hide();
            callback.call(null);
        });
        ipc.send('check-for-update');
    }
    function showUpdateBar(callback)
    {
        var h = $updateBar.outerHeight();
        $main.animate({top:'+='+h+'px'}, {duration: 400, queue: false});
        $updateBar.animate({top: '+='+h+'px'}, {duration: 400,queue: false, complete: function() 
        {
            if (callback !== undefined) callback.call(null);
        }});
    }
    function closeUpdateBar(callback)
    {
        var h = $updateBar.outerHeight();
        $main.animate({top:'-='+h+'px'}, {duration: 400, queue: false});
        $updateBar.animate({top: '-='+h+'px'}, {duration: 400,queue: false, complete: function() 
        {
            $updateBar.hide();
            if (callback !== undefined) callback.call(null);
        }});
    }

    function onChangesMade()
    {
        if (userReportLoaded) changesSaved = false;
    }

    function saveChanges(callback)
    {
        if (userReportLoaded)
        {
            var reportPath = path.parse(configPath).dir;
            var lessPath = reportPath+'/style.json';
            var stylePath = reportPath+'/default.css';

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
                ' See <a target="_blank" href="http://www.instantatlas.com/">www.instantatlas.com</a> for further details.',
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

    function renderAboutModal()
    {
        ipc.on('got-app-info', function (event, arrAppInfo) 
        {
            var str = '<table class="table table-striped">';
                for (var i = 0; i < arrAppInfo.length; i++)
                {
                    var o = arrAppInfo[i];
                    str += '<tr>';
                        str += '<td>'+o.name+'</td>';
                        str += '<td>'+o.value+'</td>';                    
                    str += '</tr>';
                }
            str += '</table>';
            $('#iad-app-info').html(str);
        });
        ipc.send('get-app-info');
    }

    function initMenuHandlers()
    {
        // Window buttons.
        $("#iad-window-minimize").on("click", function (e) 
        {
            win.minimize();
        });
        $("#iad-window-close").on("click", function (e) 
        {
            saveChangesBeforeContinuing(function()
            {
                win.close();
            });
        });
        $("#iad-window-maximize").on("click", function (e) 
        {
            win.maximize();
        });
        $("#iad-window-restore").on("click", function (e) 
        {
            win.unmaximize();
        });
        win.on('maximize', function (e) 
        {
            $("#iad-window-maximize").addClass('iad-window-btn-hidden');
            $("#iad-window-restore").removeClass('iad-window-btn-hidden');
        });
        win.on('unmaximize', function (e)
        {
            $("#iad-window-maximize").removeClass('iad-window-btn-hidden');
            $("#iad-window-restore").addClass('iad-window-btn-hidden');
        });

        // Open.
        $('#iad-menuitem-open').on('click', function(e)
        {
            saveChangesBeforeContinuing(function()
            {
                openConfigFile(function (filePath)
                {
                    userReportLoaded = true;
                    iad.config.loadReport(filePath);
                });
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
            if (userReportLoaded) 
                iad.config.refreshReport(configPath);
            else 
                iad.config.refreshConfig();
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

        // Remove widget button.
        $('#iad-btn-widget-remove').on('click', function(e)
        {
            bootbox.confirm(
            {
                title: iad.config.getDisplayName(selectedWidgetId) + ' - Confirm Removal?',
                message: 'Are you sure you want to remove this widget?',
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
                    if (result === true) iad.config.removeWidget(selectedWidgetId);
                }
            });
        });

        // Edit widget button.
        $('#iad-btn-widget-edit').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) editWidgetProperties(selectedWidgetId);
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
            hideSidebar('widget');
        });
        $('#iad-btn-close-css-panel').on('click', function (e)
        {
            hideSidebar('css');
        });
        $('#iad-btn-close-color-scheme-panel').on('click', function (e)
        {
            hideSidebar('colorscheme');
        });

        // Open slide panels.
        $('#iad-menuitem-open-css').on('click', function (e)
        {
            showSidebar('css');
        });
        $('#iad-menuitem-open-color-scheme').on('click', function (e)
        {
            showSidebar('colorscheme');
        });

        // Upload config.
        $('#iad-btn-upload-configxml') .on('click', function(e)
        {
            openConfigFile(function (filePath)
            {
                iad.config.loadConfig(filePath);
            });
        });

        // Upload style.json.
        $('#iad-btn-upload-stylejson').on('click', function (e)
        {
            openLessFile(function (filePath)
            {
                iad.css.readLessVarsFile(filePath, function () {});
            });
        });

        // Updates.
        $('#iad-update-close').on('click', function (e)
        {
            closeUpdateBar();
        });
        $('#iad-restart-now').on('click', function (e)
        {
            ipc.send('quit-and-install');
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
            menu.popup(win);
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
        var files = dialog.showOpenDialog(win, 
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
        var files = dialog.showOpenDialog(win, 
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

    function getSidebar(name)
    {
        if (name === 'widget') return $sidebarWidget;
        else if (name === 'css') return $sidebarCss;
        else if (name === 'colorscheme') return $sidebarColorscheme;
        return undefined;
    }

    function hideSidebar(name)
    {
        if (name === 'widget') editedWidgetId = undefined;
        var $panel = getSidebar(name);
        var w = $panel.outerWidth() * -1;
        $panel.animate({left: w + 'px'}, {duration: 400,queue: false, complete: function() {$panel.hide();}});
        $report.animate({left:'0px'}, {duration: 400, queue: false});
    }

    function fadeSidebar(name)
    {
        if (name === 'widget') editedWidgetId = undefined;
        var $panel = getSidebar(name);
        if ($panel.is(":visible"))
        {
            var l = $panel.outerWidth() * -1;
            $panel.fadeOut({duration: 400,queue: false, complete: function() {$panel.css('left', l + 'px');}});
        }
    }

    function showSidebar(name)
    {
        var $panel = getSidebar(name);

        // Check if a panel is already visible.
        if ($sidebarCss.is(":visible") || $sidebarColorscheme.is(":visible") || $sidebarWidget.is(":visible"))
        {
            // Close any other open panels.
            if (name === 'widget')
            {
                fadeSidebar('css');
                fadeSidebar('colorscheme');
            }
            else if (name === 'css')
            {
                fadeSidebar('widget');
                fadeSidebar('colorscheme');
            }
            else if (name === 'colorscheme')
            {
                fadeSidebar('widget');
                fadeSidebar('css');
            }
            $panel.css('left', '0px');
            $panel.fadeIn({duration: 400,queue: false});
        }
        else
        {
            var w = $panel.outerWidth();
            $panel.show();
            $panel.animate({left: '0px'}, {duration: 400,queue: false});
            $report.animate({left: w + 'px'}, {duration: 400, queue: false});
        }
    }

    function editGeneralProperties()
    {
        editedWidgetId = 'PropertyGroup';
        var title = iad.config.getDisplayName('PropertyGroup');
        $sidebarWidgetTitle.text(title);
        iad.canvas.clearSelection();
        iad.configforms.showPropertyGroupForm();
    }

    function editWidgetProperties(widgetId)
    {
        editedWidgetId = widgetId;

        var title = iad.config.getDisplayName(widgetId);
        $sidebarWidgetTitle.text(title);

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

        showSidebar('widget');
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

    function initConfig(options)
    {
        iad.config.init(
        {
            paths:options.paths,
            report : report,
            preConfigLoaded: function ()
            {                
                editGeneralProperties();
            },
            onReportLoaded: function (filePath)
            {
                changesSaved = true;
                configPath = filePath;

                if (userReportLoaded)
                {
                    // Reset title to show config file path.
                    var title = 'InstantAtlas Designer - ' + configPath;
                    win.setTitle(title);
                    $('#iad-window-title').html(title);
                }
                
                updateConfigDownloadButton();
            },
            onConfigLoaded: function ()
            {
                if (userReportLoaded)
                {
                    // Fix image paths.
                    var reportPath = path.parse(configPath).dir;
                    [].forEach.call(document.querySelectorAll('#iad-report IMG'), function(img, index) 
                    {
                        var src = img.getAttribute('src');
                        img.src = reportPath  + '/' + src;
                    });
                }

                updateDropdownMenus();
                //iad.legendform.update();
                iad.configforms.refreshForm();
                iad.canvas.update();
            },
            onConfigChanged: function ()
            {
                onChangesMade();
                updateConfigDownloadButton();
            },
            onWidgetRemoved: function (widgetId)
            {
                updateDropdownMenus();
                if (widgetId === selectedWidgetId) iad.canvas.clearSelection();
                if (widgetId === editedWidgetId) editGeneralProperties();
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
            },
            onGroupPropertyChanged: function (propertyGroupId, propertyId)
            {
                if (propertyGroupId.indexOf('thematics') === -1 &&      // Thematics are now dynamically updated via the legend tab so dont require a full config update.
                    propertyGroupId.indexOf('pointSymbols') === -1 && 
                    propertyGroupId.indexOf('lineSymbols') === -1)
                {
                    iad.config.refreshConfig();
                }
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
                    title: iad.config.getDisplayName(widgetId) + ' - Confirm Removal?',
                    message: 'Are you sure you want to remove this widget?',
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
                editWidgetProperties(widgetId);
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
                    onApply: function (filePath, name)
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
                    onPreview: function (filePath, name)
                    {
                        openWin('file://' + __dirname + '/' + filePath);
                    }
                });
            }
        });
        $modal.on('hidden.bs.modal', function ()
        {
            if (cPath !== undefined) 
            {
                if (userReportLoaded)
                    iad.config.loadConfig(cPath);
                else
                    iad.config.loadReport(cPath);
            }
        });

        function showWarning(o)
        {
            if (userReportLoaded) 
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
            else o.onContinue.call(null);
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
		$report.on('drop', function (e) 
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
                //ia.log(fileName+' '+fileType+' '+fileSize+' '+lastModified);

                if (fileType.match('text/xml')) // config.xml
                {
                    saveChangesBeforeContinuing(function()
                    {
                        userReportLoaded = true;
                        iad.config.loadReport(f.path);
                    });
                }
                else if (fileName.indexOf('.json') != -1) // styles.json - file type doesnt seem to work for json.
                {
                    iad.css.readLessVarsFile(f.path, function () {});
                }
            }
		});
		$report.on('dragover', function (e) 
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