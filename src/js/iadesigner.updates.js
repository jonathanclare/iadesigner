var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.updates = iad.updates || {};

    var electron = require('electron');
    var ipc = electron.ipcRenderer;

    var $updateBar = $('#iad-update-bar');
    var $main = $('#iad-main');

    // Click handlers.
    $('#iad-update-close').on('click', function (e)
    {
        closeUpdateBar();
    });
    $('#iad-restart-now').on('click', function (e)
    {
        ipc.send('quit-and-install');
    });

    // Call once at startup.
    iad.updates.check = function (callback)
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
    };

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

    return iad;

})(iadesigner || {}, jQuery, window, document);
