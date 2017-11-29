var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.usersettings = iad.usersettings || {};

    var electron = require('electron');
    var ipc = electron.ipcRenderer;

    // Call once at startup.
    iad.usersettings.get = function(callback)
    {
        ipc.on('got-user-settings', function(event, json) 
        { 
            callback.call(null, json);
        });
        ipc.send('get-user-settings');
    };

    iad.usersettings.set = function(name, value)
    {
        ipc.send('set-user-setting', name, value);
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
