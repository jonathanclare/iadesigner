var iadesigner = (function (iad, $, bootbox, window, document, undefined)
{
    'use strict';

    iad = iad || {};

    var electron = require('electron');
    var log = require('electron-log');

    var fs = require('fs');

    var ipc = electron.ipcRenderer;
    var shell = electron.shell;

    // Access modules in the main process.
    var remote = electron.remote;
    var Menu = remote.Menu;
    var dialog = remote.dialog;
    var app = remote.app;

    var $main = $('#iad-main');
    var $report = $('#iad-report');
    var $updateBar = $('#iad-update-bar');

    var $sidebarWidget = $('#iad-sidebar-widget');
    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $sidebarCss = $('#iad-sidebar-css');
    var $sidebarColorscheme = $('#iad-sidebar-colorscheme');
    var $sidebarTemplate = $('#iad-sidebar-template');
    var $sidebarWidgetGallery = $('#iad-sidebar-widgetgallery');

    var $editWidgetBtn = $('#iad-btn-widget-edit');
    var $progressSave = $('#iad-progress-save');
    var $progressLoad = $('#iad-progress-load');

    var report;
    var storedLessVars; // Stores the less vars so that any css changes can be undone.
    var storedConfig; // Stores the config so that any changes can be undone.
    var selectedWidgetId; // The id of the currently selected widget.
    var changesSaved = true; // Indicates that all changes have been saved.
    var widgetPropertiesDisplayed = false; // Indicates that the widget form is displayed.
    var onPropertyAdded = true; // Indicates a column, target, symbol, menu item etc. has been added to a table.

    // Reference to main window.
    var win = remote.getCurrentWindow();

    // Handle whether restore or maximize window button is displayed.
    win.on('maximize', showRestoreBtn);
    win.on('unmaximize', showMaximizeBtn);
    if (win.isMaximized()) showRestoreBtn();
    function showRestoreBtn()
    {
        $("#iad-window-maximize").addClass('iad-window-btn-hidden');
        $("#iad-window-restore").removeClass('iad-window-btn-hidden');
    }
    function showMaximizeBtn()
    {
        $("#iad-window-maximize").removeClass('iad-window-btn-hidden');
        $("#iad-window-restore").addClass('iad-window-btn-hidden');
    }

    // Open links in default browser window.
    $(document).on('click', 'a[href^="http"]', function(event) 
    {
        event.preventDefault();
        shell.openExternal(this.href);
    });
    $(document).on('click', '.nav li.disabled a', function(event) 
    {
        event.preventDefault();
        shell.openExternal(this.href);
    });

    // Listen for log messages from main process for debugging purposes.
    ipc.on('log', function(event, text) 
    {
        console.log(text);
    });

    iad.init = function(options)
    {
        var settings = $.extend({}, this.defaults, options); // Merge to a blank object.

        registerHandlebarsHelperFunctions();

        checkForUpdate(function()
        {
            getUserSettings(function(userSettings)
            {
                // Set all user settings here.
                if (fs.existsSync(userSettings.reportPath)) 
                {
                    iad.report.loaded = true;
                    settings.report.path = userSettings.reportPath;
                }

                initCss(settings.css, function()
                {
                    initReport(settings.report, function()
                    {
                        initConfig();
                        initCanvas();
                        initColorPicker();
                        initColorSchemes();
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
                        endLoadProgress(function()
                        {
                            if (settings.onAppReady !== undefined) settings.onAppReady.call(null);
                        });
                    });
                });
            });
        });
    };

    function startSaveProgress(callback)
    {
        $progressSave.fadeIn(function()
        {
            if (callback !== undefined) callback.call(null);
        });
    }
    function endSaveProgress(callback)
    {
        $progressSave.fadeOut(function()
        {
            if (callback !== undefined) callback.call(null);
        });
    }
    function startLoadProgress(callback)
    {
        $progressLoad.fadeIn(function()
        {
            if (callback !== undefined) callback.call(null);
        });
    }
    function endLoadProgress(callback)
    {
        $progressLoad.fadeOut(function()
        {
            if (callback !== undefined) callback.call(null);
        });
    }

    function setUserSetting(name, value)
    {
        ipc.send('set-user-setting', name, value);
    }
    // Call once.
    function getUserSettings(callback)
    {
        ipc.on('got-user-settings', function(event, json) 
        { 
            callback.call(null, json);
        });
        ipc.send('get-user-settings');
    }

    // Call once.
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
        if (iad.report.loaded) changesSaved = false;
    }

    function saveChanges(callback)
    {
        if (iad.report.loaded)
        {
            startSaveProgress(function()
            {
                saveFile(iad.report.configPath, iad.config.toString(), function ()
                { 
                    saveFile(iad.report.lessPath, iad.css.getLessVarsAsString(), function ()
                    {
                        iad.css.getCssAsString(function (strCss)
                        {
                            saveFile(iad.report.stylePath, strCss, function ()
                            {      
                                // Copy ia-min.js because they might not have the latest one and the standalone report may break.
                                copyFile(__dirname + '/lib/ia/ia-min.js', iad.report.path + '/ia-min.js', function () 
                                {
                                    endSaveProgress(function()
                                    {
                                        changesSaved = true;
                                        if (callback !== undefined) callback.call(null);  
                                    });
                                });
                            });
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
            bootbox.dialog(
            {
                title: "Save Changes?",
                message: "Save changes before continuing?",
                buttons: 
                {
                    cancel: 
                    {
                        label: 'Cancel',
                        className: 'btn-default',
                        callback: function ()
                        {
                            // Dont return anything.
                        }
                    },
                    no: 
                    {
                        label: "No",
                        className: 'btn-default',
                        callback: function ()
                        {
                            setTimeout(function()
                            {
                                callback.call(null);
                            }, 500);
                        }
                    },
                    ok: 
                    {
                        label: "Yes",
                        className: 'btn-primary',
                        callback: function ()
                        {
                            setTimeout(function()
                            {
                                saveChanges(function()
                                {
                                    callback.call(null); 
                                });
                            }, 500);
                        }
                    }
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

        // Open.
        $('#iad-menuitem-open').on('click', function(e)
        {
            saveChangesBeforeContinuing(function()
            {
                openConfigFile(function (filePath)
                {
                    iad.report.loaded = true;
                    iad.report.loadReport(filePath);
                    setUserSetting('reportPath', filePath);
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
            showWidgetProperties(widgetId);
        });

        // Remove widget button.
        $('#iad-btn-widget-remove').on('click', function(e)
        {
            iad.config.removeWidget(selectedWidgetId);
            /*bootbox.confirm(
            {
                title: iad.config.getDisplayName(selectedWidgetId) + ' - Confirm Removal?',
                message: 'Are you sure you want to remove this widget?',
                buttons: 
                {
                    confirm: 
                    {
                        label: 'Yes'
                    },
                    cancel: 
                    {
                        label: 'No'
                    }
                },
                callback: function (result) 
                {
                    if (result === true) iad.config.removeWidget(selectedWidgetId);
                }
            });*/
        });

        // Edit widget button.
        $('#iad-btn-widget-edit').on('click', function(e)
        {
            if (selectedWidgetId !== undefined) showWidgetProperties(selectedWidgetId);
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

        // Close sidebar buttons.
        $('.iad-btn-close-widget-sidebar').on('click', function (e)
        {
            hideSidebar('widget');
        });
        $('.iad-btn-close-css-sidebar').on('click', function (e)
        {
            hideSidebar('css');
        });
        $('.iad-btn-close-color-scheme-sidebar').on('click', function (e)
        {
            hideSidebar('colorscheme');
        });
        $('.iad-btn-close-template-sidebar').on('click', function (e)
        {
            hideSidebar('template');
        });
        $('.iad-btn-close-widgetgallery-sidebar').on('click', function (e)
        {
            hideSidebar('widgetgallery');
        });

        // Open sidebars.
        $('#iad-menuitem-open-css-sidebar').on('click', function (e)
        {
            showSidebar('css');
        });
        $('#iad-menuitem-open-color-scheme-sidebar').on('click', function (e)
        {
            showSidebar('colorscheme');
        });

        // Undo sidebar buttons.
        $('.iad-btn-undo-css-sidebar').on('click', function (e)
        {
            iad.css.setLessVars(storedLessVars);
        });
        $('.iad-btn-undo-template-sidebar').on('click', function (e)
        {
            iad.report.parseConfig(storedConfig);
        });

        // Upload config.
        $('#iad-btn-upload-configxml').on('click', function(e)
        {
            openConfigFile(function (filePath)
            {
                iad.report.loadConfig(filePath);
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

        // Menu bar hover dropdowns.
        $('ul.nav > li.dropdown').on('mouseover', function(e)
        {
            $(this).find('.dropdown-menu').show();
        });
        $('ul.nav > li.dropdown').on('mouseout', function(e)
        {
            $(this).find('.dropdown-menu').hide();
        });
        $('ul.nav > li.dropdown > ul.dropdown-menu > li > a').on('click', function(e)
        {
            $(this).closest('ul.dropdown-menu').fadeOut();
        });
        $('.iad-card').on('click', function(e)
        {
            $(this).closest('div.dropdown-menu').fadeOut();
        });
    }

    function setPopupMenu() 
    {   
        var template = 
        [
            {
                label: 'Refresh',
                click: function()  
                {
                    if (iad.report.loaded) 
                        iad.report.refreshReport();
                    else 
                        iad.report.refreshConfig();
                }
            },
            {
                label: 'Advanced',
                click: function()  
                {
                    $('#iad-modal-advanced').modal('show');
                }
            }
            /*{
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
            }*/
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
        var childWin = new remote.BrowserWindow({ width: 1000, height: 800});
        childWin.loadURL(url);
        childWin.on('closed', function() {childWin = null;});
    }

    // File handling.
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
    function copyFile(readFile, writeFile, callback)
    {
        var wf = fs.createWriteStream(writeFile);
        wf.on('finish', function() 
        {
            if (callback !== undefined) callback.call(null);  
        });
        wf.on('error', function(err) 
        {
            dialog.showErrorBox('File save error', err.message);
        });
        var rf = fs.createReadStream(readFile);
        rf.on('error', function(err) 
        {
            dialog.showErrorBox('File save error', err.message);
        });
        rf.pipe(wf);
    }

    // Sidebars.
    function getSidebar(name)
    {
        if (name === 'widget') return $sidebarWidget;
        else if (name === 'css') return $sidebarCss;
        else if (name === 'template') return $sidebarTemplate;
        else if (name === 'widgetgallery') return $sidebarWidgetGallery;
        else if (name === 'colorscheme') return $sidebarColorscheme;
        return undefined;
    }
    function hideSidebar(name)
    {
        if (name === 'widget') 
        {
            widgetPropertiesDisplayed = false;
            if (selectedWidgetId !== undefined) $editWidgetBtn.show();
        }
        var $sidebar = getSidebar(name);
        var w = $sidebar.outerWidth() * -1;
        $sidebar.animate({left: w + 'px'}, {duration: 400,queue: false, complete: function() {$sidebar.hide();}});
        $report.animate({left:'0px'}, {duration: 400, queue: false});
    }
    function fadeOutSidebar(name)
    {
        if (name === 'widget') 
        {
            widgetPropertiesDisplayed = false;
            if (selectedWidgetId !== undefined) $editWidgetBtn.show();
        }
        var $sidebar = getSidebar(name);
        if ($sidebar.is(":visible"))
        {
            var l = $sidebar.outerWidth() * -1;
            $sidebar.fadeOut({duration: 400,queue: false, complete: function() {$sidebar.css('left', l + 'px');}});
        }
    }
    function showSidebar(name)
    {
        var $sidebar = getSidebar(name);

        // Check if a sidebar is already visible.
        if ($sidebarCss.is(":visible") || 
            $sidebarColorscheme.is(":visible") || 
            $sidebarWidget.is(":visible") || 
            $sidebarTemplate.is(":visible") || 
            $sidebarWidgetGallery.is(":visible"))
        {
            // Close any other open sidebars.
            if (name === 'widget')
            {
                fadeOutSidebar('css');
                fadeOutSidebar('colorscheme');
                fadeOutSidebar('template');
                fadeOutSidebar('widgetgallery');
            }
            else if (name === 'css')
            {
                fadeOutSidebar('widget');
                fadeOutSidebar('colorscheme');
                fadeOutSidebar('template');
                fadeOutSidebar('widgetgallery');
            }
            else if (name === 'template')
            {
                fadeOutSidebar('widget');
                fadeOutSidebar('colorscheme');
                fadeOutSidebar('css');
                fadeOutSidebar('widgetgallery');
            }
            else if (name === 'widgetgallery')
            {
                fadeOutSidebar('widget');
                fadeOutSidebar('colorscheme');
                fadeOutSidebar('css');
                fadeOutSidebar('template');
            }
            else if (name === 'colorscheme')
            {
                fadeOutSidebar('widget');
                fadeOutSidebar('css');
                fadeOutSidebar('template');
                fadeOutSidebar('widgetgallery');
            }
            $sidebar.css('left', '0px');
            $sidebar.fadeIn({duration: 400,queue: false});
        }
        else
        {
            var w = $sidebar.outerWidth();
            $sidebar.show();
            $sidebar.animate({left: '0px'}, {duration: 400,queue: false});
            $report.animate({left: w + 'px'}, {duration: 400, queue: false});
        }

        if (name === 'css' || name === 'colorscheme') storedLessVars = iad.css.getLessVars();
        else if (name === 'template' || name === 'widgetgallery' || name === 'widget') storedConfig = iad.config.getXml();
    }

    function editGeneralProperties()
    {
        if (widgetPropertiesDisplayed)
        {
            var title = iad.config.getDisplayName('PropertyGroup');
            $sidebarWidgetTitle.text(title);
            iad.configform.showPropertyGroupForm();
        }
    }

    function editWidgetProperties(widgetId)
    {
        if (widgetPropertiesDisplayed)
        {
            var title = iad.config.getDisplayName(widgetId);
            $sidebarWidgetTitle.text(title);
            iad.configform.showWidgetForm(widgetId);
        }
        else $editWidgetBtn.show();
    }

    function showWidgetProperties(widgetId)
    {
        $editWidgetBtn.hide();

        widgetPropertiesDisplayed = true;
        var title = iad.config.getDisplayName(widgetId);
        $sidebarWidgetTitle.text(title);
        if (widgetId === 'PropertyGroup')
        {
            iad.canvas.clearSelection();
            iad.configform.showPropertyGroupForm();
        }
        else
        {
            iad.canvas.select(widgetId);
            iad.configform.showWidgetForm(widgetId);
        }
        showSidebar('widget');
    }

    function initCss(options, callback)
    {
        // Apply the handlebars template for the css form.
        var template = window.iadesigner['forms.handlebars'];
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

    function initReport(options, callback)
    {
        iad.report.init(
        {
            container: 'iad-report',
            path: options.path,
            configPaths: options.configPaths,
            onReportInit: function (r)
            {
                report = r;
                callback.call(null);
            },
            onReportFailed: function (url, XMLHttpRequest, textStatus, errorThrown)
            {
                endLoadProgress(function()
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
                changesSaved = true;
                iad.config.setXml(report.config.xml);
                if (iad.report.loaded)
                {
                    // Reset title to show config file path.
                    var title = 'InstantAtlas Designer - ' + configPath;
                    win.setTitle(title);
                    $('#iad-window-title').html(title);
                }
                updateConfigDownloadButton();
                endLoadProgress();
            },
            preConfigLoaded: function (callback)
            {      
                startLoadProgress(function()
                {
                    iad.canvas.clearSelection();
                    callback.call(null);
                });          
            },
            onConfigLoaded: function ()
            {
                iad.config.setXml(report.config.xml);
                updateDropdownMenus();
                //iad.legendform.update();
                iad.configform.refresh();
                iad.canvas.update();
                endLoadProgress();
            },
        });
    }

    function initConfig(options)
    {
        iad.config.init(
        {
            xml: report.config.xml,
            onConfigUpdated: function ()
            {
                onConfigChanged();
            },
            onWidgetRemoved: function (widgetId, $xmlWidget)
            {  
                var widget = report.getWidget(widgetId);
                var tagName = $xmlWidget.prop('tagName');
                if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text')
                {
                    report.config.removeWidget(widgetId);
                    report.removeWidget(widgetId);
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
                    config = report.config.addButton($xmlWidget.get(0));
                    widget = new ia.Button(widgetId);
                    report.addButton(widget, config);
                    onWidgetAdded(widgetId, $xmlWidget);
                }
                else if (tagName === 'Image')
                {
                    config = report.config.addImage($xmlWidget.get(0));
                    widget = new ia.Image(widgetId, "./image_placeholder.png");
                    report.addImage(widget, config); 
                    onWidgetAdded(widgetId, $xmlWidget);
                }
                else if (tagName === 'Text')
                {
                    config = report.config.addText($xmlWidget.get(0));
                    widget = new ia.Text(widgetId);
                    report.addText(widget, config);
                    onWidgetAdded(widgetId, $xmlWidget);
                }
                else // Component or Table.
                {
                    // Check if its already been built and added.
                    widget = report.getWidget(widgetId);
                    if (widget !== undefined)
                    {
                        widget.container.show();
                        onWidgetAdded(widgetId, $xmlWidget);
                    }
                    else
                    {
                        if (tagName === 'Table') config = report.config.addTable($xmlWidget.get(0));
                        else config = report.config.addComponent($xmlWidget.get(0));

                        widget = new ia.Panel(widgetId);
                        report.addPanel(widget, config);

                        // These components require a full update because more data may need to be read in for them to work.
                        if (widgetId.indexOf('featureCard') !== -1 || 
                            widgetId.indexOf('pyramidChart') !== -1 || 
                            widgetId.indexOf('spineChart') !== -1 || 
                            widgetId.indexOf('radarChart') !== -1 || 
                            widgetId.indexOf('areaBreakdownBarChart') !== -1 || 
                            widgetId.indexOf('areaBreakdownPieChart') !== -1)
                        {
                            iad.report.refreshConfig(function ()
                            {
                                onWidgetAdded(widgetId, $xmlWidget);
                            });
                        }
                        else 
                        {
                            // Build.
                            var factory = report.getComponent('factory');
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
                /*if (groupId.indexOf('thematics') === -1 &&      // Thematics are now dynamically updated via the legend tab so dont require a full config update.
                    groupId.indexOf('pointSymbols') === -1 && 
                    groupId.indexOf('lineSymbols') === -1)
                {*/
                    iad.report.refreshConfig(function ()
                    {
                        onConfigChanged();
                    });

                //}
               // else onConfigChanged();
            },
            onPropertyAdded: function (widgetId, $xmlWidget)
            {
                onPropertyAdded = true;
                onWidgetChanged(widgetId, $xmlWidget, function()
                {
                    iad.configform.refresh();
                });
            },
            onPropertyRemoved: function (widgetId, $xmlWidget)
            {
                onWidgetChanged(widgetId, $xmlWidget, function()
                {
                    iad.configform.refresh();
                });
            },
            onImageChanged: function (widgetId, $xmlWidget, attribute, value)
            {
                if (attribute === 'rescale')
                { 
                    $xmlWidget.attr(attribute, value);

                    var widget = report.getWidget(widgetId);
                    var $widget = widget.container;

                    // Resize the active widget.
                    var x = $widget.position().left, y = $widget.position().top, w = $widget.outerWidth(), h = $widget.outerHeight();
                    var xAnchor = widget.xAnchor();
                    if (xAnchor === 'end' ||  xAnchor === 'right') x = x + w; 

                    // Calculate percentage dimensions.
                    var xPerc = (x / report.container.width()) * 100;
                    var yPerc = (y / report.container.height()) * 100;
                    var wPerc = (w / report.container.width()) * 100;
                    var hPerc = (h / report.container.height()) * 100;

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
                    if ($xmlWidget.attr('rescale') === 'false' || $xmlWidget.attr('rescale') === false) cw = (cw / report.container.width()) * 800;

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
            var config = report.config.getWidget(widgetId);
            config.parseXML($xmlWidget.get(0));

            // Update the widget.
            var widget = report.getWidget(widgetId);
            widget.update(config);

            // Update any dynamic text that may have changed.
            report.updateDynamicText(report.textSubstitution);

            // Update and render the widget.
            var factory = report.getComponent('factory');
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
                        if (widgetId === selectedWidgetId) iad.report.showWidget(widgetId); // Stop popup widgets from disappearing.

                        iad.canvas.update();
                        onConfigChanged();
                    }
                    if (callback !== undefined) callback.call(null);
                });
            });
        }
        function onConfigChanged()
        {
            onChangesMade();
            updateConfigDownloadButton();
        }
    }

    function initConfigForms()
    {
        iad.configform.init(
        {
            report : report,
            container: '#iad-form-widget-properties',
            template: 'forms.handlebars',
            onFormChanged: function (widgetId)
            {
                if (onPropertyAdded === true) 
                {
                    onPropertyAdded = false;
                    iad.configform.scrollToBottom();
                }
            }
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
                    if (iad.util.isNumeric(newValue))
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
            onSelect: function (widgetId)
            {
                $nav.show();
                if (widgetId !== selectedWidgetId)
                {
                    selectedWidgetId = widgetId;
                    editWidgetProperties(widgetId);
                    iad.report.showWidget(widgetId);
                }
            },
            onUnselect: function (widgetId)
            {
                $nav.hide();
                iad.report.hideWidget(widgetId);
                selectedWidgetId = undefined;
            },
            onClearSelection: function ()
            {     
                $nav.hide();
                selectedWidgetId = undefined;
                editGeneralProperties();
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
        $('#iad-menuitem-config-gallery').on('click', function(e)
        {
            showSidebar('template');
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
                        if (iad.report.loaded)
                            iad.report.loadConfig(filePath);
                        else
                            iad.report.loadReport(filePath);
                    },
                    onPreview: function (filePath, name)
                    {
                        openWin('file://' + __dirname + '/' + filePath);
                    }
                });
            }
        });
    }

    function initWidgetGallery(options)
    {
        $('#iad-menuitem-insert-widget').on('click', function(e)
        {
            showSidebar('widgetgallery');
            if (!iad.widgetgallery.initialised)
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
            }
            iad.widgetgallery.update();
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
                        iad.report.loaded = true;
                        iad.report.loadReport(f.path);
                        setUserSetting('reportPath', f.path);
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
    }

    function updateDropdownMenus()
    {
        iad.configform.updateJavaScriptOptions();

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

})(iadesigner || {}, jQuery, bootbox, window, document);