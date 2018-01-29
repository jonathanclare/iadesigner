var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.mapform = iad.mapform || {};

    // Passed in options.
    var options;

    // Container;
    var $container;

    // Handebars Template;
    var template;

    iad.mapform.init = function(o)
    {
        options = $.extend(true, {}, o);
        template = window.iadesigner[options.template];
        $container = $(options.container);
        iad.formcontrols.addControlHandlers($container);
    };

    iad.mapform.update = function(jsonMap)
    {
        var mapForm =  {'id':'MapLayers', 'forms':[]};
        for (var i = 0; i < jsonMap.layers.length; i++)
        {
            var jsonLayer = jsonMap.layers[i];
            var layerForm = {'name': jsonLayer.name, 'type':'MapLayers', 'id': jsonLayer.id, 'controls':[]};
            mapForm.forms.push(layerForm);

            for (var j = 0; j < options.json.length; j++)
            {
                var ctrl = options.json[j];
                if (jsonLayer[ctrl.id] !== undefined)
                {
                    var lyrCtrl = $.extend(true, {}, ctrl);
                    lyrCtrl.value = jsonLayer[ctrl.id];
                    layerForm.controls.push(lyrCtrl);
                }
            }
        }
        $container.html(template(options.json));
        iad.formcontrols.update($container);
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);