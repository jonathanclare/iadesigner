var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.win = iad.win || {};

    var electron = require('electron');
    var remote = electron.remote;
    var win = remote.getCurrentWindow();

    var $min = $('#iad-window-minimize');
    var $max = $('#iad-window-maximize');
    var $restore = $('#iad-window-restore');
    var $close = $('#iad-window-close');

    // Click handlers.
    $min.on('click', function (e) 
    {
        iad.win.minimize();
    });
    $close.on('click', function (e) 
    {
        iad.file.saveChangesBeforeContinuing(function()
        {
            iad.win.close();
        });
    });
    $max.on('click', function (e) 
    {
        iad.win.maximize();
    });
    $restore.on('click', function (e) 
    {
        iad.win.unmaximize();
    });

    // Handle whether restore or maximize window button is displayed.
    win.on('maximize', showRestoreBtn);
    win.on('unmaximize', showMaximizeBtn);
    if (win.isMaximized()) showRestoreBtn();
    function showRestoreBtn()
    {
        $max.addClass('iad-window-btn-hidden');
        $restore.removeClass('iad-window-btn-hidden');
    }
    function showMaximizeBtn()
    {
        $max.removeClass('iad-window-btn-hidden');
        $restore.addClass('iad-window-btn-hidden');
    }

    iad.win.minimize = function()
    {
        win.minimize();
    };

    iad.win.maximize = function()
    {
        win.maximize();
    };

    iad.win.unmaximize = function()
    {
        win.unmaximize();
    };

    iad.win.setTitle = function(title)
    {
        win.setTitle(title);
    };

    iad.win.close = function()
    {
        win.close();
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
