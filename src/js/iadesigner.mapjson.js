var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.mapjson = iad.mapjson || {};

    // The json for the map.
    var jsonMap = {};

    // Passed in options.
    var options;

    // Initialise.
    iad.mapjson.init = function(o)
    {
        options = o; 
        if (options && options.filepath) iad.mapjson.read(options.filepath);
    };

    // Read in a json file.
    iad.mapjson.read = function(filepath, callback)
    {
        $.getJSON(filepath)
        .done(function(json)
        {
            iad.mapjson.parse(json);
            if (callback !== undefined) callback.call(null, jsonMap); 
        })
        .fail(function(jqXHR, textStatus, errorThrown)
        {
            console.error(errorThrown);
        });
    };

    // Parse in the json.
    iad.mapjson.parse = function(json)
    {
        jsonMap = $.extend({}, json);
        if (options && options.onJsonChanged) options.onJsonChanged.call(null, jsonMap);
    };

    // Get a copy of the json.
    iad.mapjson.toJson = function()
    {
        return $.extend({}, jsonMap);
    };

    // Get the json as a string.
    iad.mapjson.toString = function()
    {
        return JSON.stringify(jsonMap);
    };

    // Sets a property.
    iad.mapjson.setProperty = function(property, value)
    {
        jsonMap[property] = value;
        if (options && options.onPropertyChanged) options.onPropertyChanged.call(null, property, value);
    };

    // Sets a layer property.
    iad.mapjson.setLayerProperty = function(layerId, property, value)
    {
        var jsonLayer = iad.util.getItem(jsonMap.layers, 'id', layerId);
        if (jsonLayer !== undefined)
        {
            jsonLayer[property] = value;
            if (options && options.onLayerPropertyChanged) options.onLayerPropertyChanged.call(null, layerId, property, value);
        }
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);