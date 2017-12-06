var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.cssform = iad.cssform || {};

    iad.cssform.update = function(container, templateName, jsonForm, lessVars)
    {
        for (var property in lessVars)
        {
            var id = property.substring(1); // Remove @
            var value = lessVars[property];
            var pos = value.indexOf('px');
            if (pos != -1) value = value.substring(0, pos);
            for (var i = 0; i < jsonForm.forms.length; i++)
            {
                var form = jsonForm.forms[i];
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
        var template = window.iadesigner[templateName];
        $(container).html(template(jsonForm));
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);