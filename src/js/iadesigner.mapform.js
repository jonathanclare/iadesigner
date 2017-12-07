var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.mapform = iad.mapform || {};

    iad.mapform.update = function(container, templateName, jsonForm, jsonMap)
    {
        var mapForm =  {'id':'MapLayers', 'forms':[]};
        for (var i = 0; i < jsonMap.layers.length; i++)
        {
            var jsonLayer = jsonMap.layers[i];
            var layerForm = {'name': jsonLayer.name, 'type':'MapLayers', 'id': jsonLayer.id, 'controls':[]};
            mapForm.forms.push(layerForm);

            for (var j = 0; j < jsonForm.length; j++)
            {
                var ctrl = jsonForm[j];
                if (jsonLayer[ctrl.id] !== undefined)
                {
                    var lyrCtrl = $.extend(true, {}, ctrl);
                    lyrCtrl.value = jsonLayer[ctrl.id];
                    layerForm.controls.push(lyrCtrl);
                }
            }
        }
        var template = window.iadesigner[templateName];
        $(container).html(template(mapForm));
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);