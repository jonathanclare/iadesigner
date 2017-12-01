var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.mapform = iad.mapform || {};

    var controls = 
    [
        {'id':'name', 'name':'Name', 'type':'string'},
        {'id':'visible', 'name':'Visible', 'type':'boolean'},
        {'id':'fillColor', 'name':'Fill Colour', 'type':'colour'},
        {'id':'fillOpacity', 'name':'Fill Opacity', 'type':'range', 'min':0, 'max':1, 'step':0.1},
        {'id':'borderThickness', 'name':'Border Thickness', 'type':'range', 'min':0, 'max':10, 'step':1},
        {'id':'borderColor', 'name':'Border Colour', 'type':'colour'},
        {'id':'showInLayerList', 'name':'Show In Legend', 'type':'boolean'},
        {'id':'showDataTips', 'name':'Show Tool Tips', 'type':'boolean'},
        {'id':'showLabels', 'name':'Show Labels', 'type':'boolean'},
        {'id':'labelPosition', 'name':'Label Position', 'type':'select', 'choices':[
                                                                                        {'label':'Top Left', 'value':'top-left'},
                                                                                        {'label':'Top', 'value':'top'},
                                                                                        {'label':'Top Right', 'value':'top-right'},
                                                                                        {'label':'Left', 'value':'left'},
                                                                                        {'label':'Center', 'value':'center'},
                                                                                        {'label':'Right', 'value':'right'},
                                                                                        {'label':'Bottom Left', 'value':'bottom-left'},
                                                                                        {'label':'Bottom', 'value':'bottom'},
                                                                                        {'label':'Bottom Right', 'value':'bottom-right'}
                                                                                    ]},
        {'id':'displayLabelsOnly', 'name':'Hide Symbols', 'type':'boolean'},
        {'id':'minLabelExtent', 'name':'Minimum Label Extent', 'type':'integer'},
        {'id':'maxLabelExtent', 'name':'Maximum Label Extent', 'type':'integer'},
        {'id':'symbolSize', 'name':'Symbol Size', 'type':'integer-counter'},
        {'id':'iconPath', 'name':'Icon Path For Symbols', 'type':'string'}
    ];

    iad.mapform.getForm = function(jsonMap)
    {
        var mapForm =  {'id':'map', 'forms':[]};
        for (var i = 0; i < jsonMap.layers.length; i++)
        {
            var jsonLayer = jsonMap.layers[i];
            var layerForm = {'name': jsonLayer.name, 'controls':[]};
            mapForm.forms.push(layerForm);

            for (var j = 0; j < controls.length; j++)
            {
                var ctrl = controls[j];
                if (jsonLayer[ctrl.id] !== undefined)
                {
                    var lyrCtrl = $.extend({}, ctrl);
                    lyrCtrl.value = jsonLayer[ctrl.id];
                    layerForm.controls.push(lyrCtrl);
                }
            }
        }
        return mapForm;
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);