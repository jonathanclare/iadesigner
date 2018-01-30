var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.cssform = iad.cssform || {};

    // Passed in options.
    var options;

    // Container;
    var $container;

    // Handebars Template;
    var template;

    iad.cssform.init = function(o)
    {
        options = $.extend(true, {}, o);
    };

    iad.cssform.update = function(lessVars)
    {
        for (var property in lessVars)
        {
            var id = property.substring(1); // Remove @
            var value = lessVars[property];
            var pos = value.indexOf('px');
            if (pos != -1) value = value.substring(0, pos);
            for (var i = 0; i < options.json.forms.length; i++)
            {
                var form = options.json.forms[i];
                for (var j = 0; j < form.controls.length; j++)
                {
                    var ctrl = form.controls[j];
                    if (ctrl.id === id)
                    {
                        ctrl.value = value;
                        break;
                    }
                }
            }
        }
        iad.formcontrols.render(options);
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);