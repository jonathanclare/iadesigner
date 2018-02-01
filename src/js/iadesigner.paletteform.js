var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.paletteform = iad.paletteform || {};

    // Passed in options.
    var options;

    // Initialise.
    iad.paletteform.init = function(o)
    {
        options = o; 
    };

    iad.paletteform.update = function()
    {
        if (options && options.container) 
        {
            iad.form.render(
            {
                container:options.container,
                template:options.template,
                json:iad.configform.getMapPalettesForm()
            });
        }
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);