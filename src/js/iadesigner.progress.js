var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.progress = iad.progress || {};

    // Values for type: 'save', 'load'

    iad.progress.start = function(type, callback)
    {
        $('#iad-progress-'+type).fadeIn(function()
        {
            if (callback !== undefined) callback.call(null);
        });
    };

    iad.progress.end = function(type, callback)
    {
        $('#iad-progress-'+type).fadeOut(function()
        {
            if (callback !== undefined) callback.call(null);
        });
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
