var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.handlers = iad.handlers || {};

    var electron = require('electron');
    var log = require('electron-log');
    var remote = electron.remote;
    var Menu = remote.Menu;
    var ipc = electron.ipcRenderer;

    // Listen for log messages from main process for debugging purposes.
    ipc.on('log', function(event, text) 
    {
        console.log(text);
    });

    // About modal.
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

    // Menu items.
    $('.iad-menuitem-open').on('click', function(e) {open();}); // Open.
    $('.iad-menuitem-open-color-palettes').on('click', function(e) {editWidget('MapPalettes');}); // Open.
    $('#iad-menuitem-save').on('click', function(e) {save();}); // Save.
    $('#iad-menuitem-exit').on('click', function(e) {exit();}); // Exit.
    $('#iad-menuitem-insert-image').on('click', function(e) {addWidget('Image');}); // Add image.
    $('#iad-menuitem-insert-text').on('click', function(e) {addWidget('Text');}); // Add widget.
    $('#iad-menuitem-insert-button').on('click', function(e) {addWidget('Button');}); // Add button.
    $('input[name="iad-radio-report-mode"]').on('click change', function(e) {setMode($(this).val());}); // Design / Published mode.
    $('#iad-btn-widget-remove').on('click', function(e) {removeWidget();}); // Remove widget.
    $('#iad-btn-widget-send-to-back').on('click', function(e) {sendToBack();}); // Send widget to back.
    $('#iad-btn-widget-bring-to-front').on('click', function(e) {bringToFront();}); // Bring widget to front.
    $('#iad-btn-widget-edit').on('click', function(e) {editWidget(iad.config.selectedWidgetId);}); // Edit widget button.
    $(document).on('click', '.iad-dropdown-option-widget-properties', function(e) {editWidget($(this).data('id'));}); // Edit widget dropdown option.
    $('#iad-btn-upload-configxml').on('click', function(e){uploadConfig();}); // Upload config.xml.
    $('#iad-btn-upload-stylejson').on('click', function (e) {uploadStyle();}); // Upload style.json.

    $('.iad-card').on('click', function(e)
    {
        $(this).closest('div.dropdown-menu').fadeOut();
    });

    // Key strokes.
    $(window).on('keydown', function(e) 
    {
        if (event.ctrlKey || e.metaKey) 
        {
            switch (String.fromCharCode(e.which).toLowerCase()) 
            {
                case 's':
                    e.preventDefault();
                    save();
                    break;
                case 'o':
                    e.preventDefault();
                    open();
                    break;
                case 'f':
                    e.preventDefault();
                    bringToFront();
                    break;
                case 'b':
                    e.preventDefault();
                    sendToBack();
                    break;
            }
        }
        else
        {
            switch (e.which) 
            {
                case 46: // Delete.
                    e.preventDefault();
                    removeWidget();
                    break;
            }
        }
    });

    // Pop up menu.
    var template = 
    [
        {
            label: 'Refresh',
            click: function()  
            {
                refresh();
            }
        },
        {
            label: 'Advanced',
            click: function()  
            {
                about();
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
        menu.popup(remote.getCurrentWindow());
    }, false);

    function about()
    {
        $('#iad-modal-advanced').modal('show');
    }

    function refresh()
    {
        iad.progress.start('load', function()
        {
            if (iad.report.loaded) 
                iad.report.refreshReport();
            else 
                iad.report.refreshConfig();
        });
    }

    function open()
    {
        iad.file.saveChangesBeforeContinuing(function()
        {
            iad.file.openConfigFile(function (filePath)
            {
                iad.progress.start('load', function()
                {
                    iad.report.loaded = true;
                    iad.report.loadReport(filePath);
                    iad.usersettings.set('reportPath', filePath);
                });
            });
        });
    }

    function save()
    {
        iad.file.saveChanges();
    }

    function exit()
    {
        iad.file.saveChangesBeforeContinuing(function() 
        {
            iad.win.close();
        });  
    }

    function setMode(mode)
    {
        var designMode = mode.toLowerCase() !== 'published';
        if (!designMode) iad.canvas.off();
        else iad.canvas.on();
    }

    function editWidget(id)
    {
        if (id !== undefined) iad.configform.show(id);
    }

    function addWidget(type)
    {
        iad.config.addWidget(type);
    }

    function removeWidget()
    {
        iad.config.removeWidget(iad.config.selectedWidgetId);
    }

    function bringToFront()
    {
        if (iad.config.selectedWidgetId !== undefined) iad.config.bringToFront(iad.config.selectedWidgetId);
    }

    function sendToBack()
    {
        if (iad.config.selectedWidgetId !== undefined) iad.config.sendToBack(iad.config.selectedWidgetId);
    }

    function uploadConfig()
    {
        iad.file.openConfigFile(function (filePath)
        {
            iad.progress.start('load', function()
            {
                iad.report.loadConfig(filePath);
            });
        });
    }

    function uploadStyle()
    {
        iad.file.openStyleFile(function (filePath)
        {
            iad.css.readLessVarsFile(filePath, function () {});
        });
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);
