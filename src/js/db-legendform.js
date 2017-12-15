var builder = (function(db, $)
{
    var me = db.legendform = db.legendform || {};

    var dataGroup;
    var categoricPalette;
    var numericPalette;

    // Passed in options.
    var options;
    var isLegend2 = false;


    // Initialise.
    me.init = function(o)
    {
        options = o; 

        // Add palette color.
        $(document).on('click', '.ia-control-add-color-range', function (e)
        {
            e.preventDefault();

            // Add color to palette
            numericPalette.addColor('#999999');

            // Add the color to the xml.
            db.config.addPaletteColour(numericPalette.id, '#999999')

            updateForm(numericPalette);
        });

        // Remove palette color.
        $(document).on('click', '.ia-control-remove-color-range', function (e)
        {
            e.preventDefault();

            // Get the position of the color.
            var colorIndex = $(this).attr('id').split('~')[2];

            // Remove the color from the palette.
            numericPalette.getColorList().splice(colorIndex, 1);

            // Remove the color from the xml.
            db.config.removePaletteColour(numericPalette.id, colorIndex);

            updateForm(numericPalette);
        });

        // Add scheme color.
        $(document).on('click', '.ia-control-add-color-scheme', function (e)
        {
            e.preventDefault();

            // Add color to palette
            categoricPalette.addColor('#999999');

            // Add the color to the xml.
            db.config.addPaletteColour(categoricPalette.id, '#999999');

            updateForm(categoricPalette);
        });

        // Remove scheme color.
        $(document).on('click', '.ia-control-remove-color-scheme', function (e)
        {
            e.preventDefault();

            // Get the position of the color.
            var colorIndex = $(this).attr('id').split('~')[2];

            // Remove the color from the palette.
            categoricPalette.getColorList().splice(colorIndex, 1);

            // Remove the color from the xml.
            db.config.removePaletteColour(categoricPalette.id, colorIndex);

            updateForm(categoricPalette);
        });
        addWebmapPalette();
    };

    // Updates the editable colors form.
    function updateForm(pal)
    {
        // Update match values to colour hash.
        updateMatchColorsToValues(pal);

        // Dynamic update of report.
        updateThematics();        

        // Update session config xml.
        sessionStorage.setItem('iaoConfig', db.util.xmlToString(db.xmlConfig));    

        // Update the legend form.
        if (isLegend2)  db.configform.showWidgetForm('legend2');
        else            db.configform.showWidgetForm('legend')
    };

    // Dynamic update of thematics.
    function updateThematics()
    {
        // Dynamic update of thematics.
        var dGroup = db.report.getComponent('dataGroup');
        dGroup.thematic.commitChanges();
        var dGroup2 = db.report.getComponent('dataGroup2');
        if (dGroup2) dGroup2.thematic.commitChanges();
    };

    // Update match values to colour hash.
    function updateMatchColorsToValues(pal)
    {
        // CategoricClassifier stores the colors in matchColorsToValues, so we have to clear it.
        pal.matchColorsToValues = {};

        // Then add back in matching 'for' colors from xml.
        var $xmlColorRange  = db.config.getColourRange(pal.id);
        var $xmlColors      = $xmlColorRange.find("ColourMatch");
        $.each($xmlColors, function(i, xmlColor)
        {
            var color = $(xmlColor).text();
            var forValue = $(xmlColor).attr('for');
            if (forValue != '__next') pal.matchColorsToValues[forValue] = color;
        });
    };

    // Updates the legend form when the config has changed - leave this in to stop errors.
    me.update = function() {};

    // Updates the given property with the new value.
    me.updateProperty = function(property, index, newValue)
    {
        //ia.log(property+' '+index+' '+newValue);

        var paletteConfig = db.report.config.getMapPalette();

        if (property == 'noClasses')               // The color range has changed.
        {
            var $xmlMapPalettes = db.$xmlConfig.find('MapPalettes');
            $xmlMapPalettes.attr('classes', newValue); 

            var dGroup = db.report.getComponent('dataGroup');
            dGroup.thematic.numericClassifier.noClasses = newValue;
            var dGroup2 =db.report.getComponent('dataGroup2');
            if (dGroup2) dGroup2.thematic.numericClassifier.noClasses = newValue;

            updateThematics();
        }
        if (property == 'colorRange')               // The color range has changed.
        {
            // Add palette to xml.
            if (isLegend2)
                db.config.setGroupProperty('thematics2', 'mapPalette2', newValue);
            else 
            {
                db.config.setDefaultColourRange(newValue);
                paletteConfig.defaultPaletteId = newValue;
            }

            // Update palette in report.
            numericPalette = paletteConfig.getColorPalette(newValue);
            dataGroup.legendSettings.paletteId = newValue;
            dataGroup.thematic.numericClassifier.colorPalette = numericPalette;

            updateForm(numericPalette);
        }
        else if (property == 'colorScheme')         // The color scheme has changed.
        {
            // Add palette to xml.
            db.config.setDefaultColourScheme(newValue);

            // Update scheme in report.
            categoricPalette = paletteConfig.getColorScheme(newValue);
            paletteConfig.defaultSchemeId = newValue;

            var dGroup = db.report.getComponent('dataGroup');
            dGroup.thematic.categoricClassifier.colorPalette = categoricPalette;
            dGroup.legendSettings.schemeId = newValue;
            var dGroup2 = db.report.getComponent('dataGroup2');
            if (dGroup2) 
            {
                dGroup2.legendSettings.schemeId = newValue;
                dGroup2.thematic.categoricClassifier.colorPalette = categoricPalette;
            }

            updateForm(categoricPalette);
        }
        else if (property == 'numericColor')        // 'A Numeric Colour' has changed.
        {
            var color = newValue;

            // Update palette color.
            numericPalette.setColorAtIndex(index, color);

            // Update color in the xml.
            db.config.setPaletteColour(numericPalette.id, index, color);

            updateForm(numericPalette);
        } 
        else if (property == 'categoricColor')      // 'A Categoric Colour' has changed.
        {
            var color = newValue;

            // Update palette color.
            categoricPalette.setColorAtIndex(index, color);

            // Update color in the xml.
            db.config.setPaletteColour(categoricPalette.id, index, color);

            updateForm(categoricPalette);
        }
        else if (property == 'for')                 // 'For' value has changed.
        {
            var forValue = newValue;
            if (forValue == '') forValue = '__next';

            // Update 'for' value in the xml.
            db.config.setPaletteForValue(categoricPalette.id, index, forValue);

            // Update match values to colour hash.
            updateMatchColorsToValues(categoricPalette);

            updateThematics();
        }
        else if (property == 'legendPrecision') 
        {
            if (newValue < 0) newValue = undefined;

            var dGroup = db.report.getComponent('dataGroup');
            dGroup.thematic.numericClassifier.precision = newValue;
            var dGroup2 = db.report.getComponent('dataGroup2');
            if (dGroup2) dGroup2.thematic.numericClassifier.precision = newValue;
            updateThematics();
        }
        else if (property.indexOf('symbolShape') != -1)  
        {
            dataGroup.mapData.baseLayer.symbol = newValue;
            dataGroup.thematic.symbol = newValue;
            updateThematics();
        }
        else if (property.indexOf('minSymbolSize') != -1)  
        {
            var pal = dataGroup.thematic.numericClassifier.sizePalette;
            pal.minSize = newValue;
            updateThematics();
        }
        else if (property.indexOf('maxSymbolSize') != -1)  
        {
            var pal = dataGroup.thematic.numericClassifier.sizePalette;
            pal.maxSize = newValue;
            updateThematics();
        }
        else if (property.indexOf('legendClassifier') != -1) 
        {
            dataGroup.thematic.numericClassifier.classificationName = newValue;
            dataGroup.legendSettings.legendType = newValue;
            updateThematics();
        }
        else if (property == 'data' || property == 'data2')  db.config.update(db.xmlConfig);

        // Update session config xml.
        sessionStorage.setItem('iaoConfig', db.util.xmlToString(db.xmlConfig));
    };

    me.getForm = function(widgetId, legendComponentForm)
    {
        var paletteConfig = db.report.config.getMapPalette();
        if (widgetId == "legend2") 
        {
            dataGroup = db.report.getComponent('dataGroup2');
            var paletteId = db.config.getGroupProperty('thematics2', 'mapPalette2');
            numericPalette = paletteConfig.getColorPalette(paletteId);
            isLegend2 = true;
        }
        else 
        {
            dataGroup = db.report.getComponent('dataGroup');
            numericPalette = paletteConfig.getColorPalette(paletteConfig.defaultPaletteId);
            isLegend2 = false;
        }
        categoricPalette = paletteConfig.getColorScheme(paletteConfig.defaultSchemeId);

        var forms = [];

        // Thematics data.
        var $xmlPropGroup = db.$xmlConfig.find('PropertyGroup#thematics');
        if (isLegend2) $xmlPropGroup = db.$xmlConfig.find('PropertyGroup#thematics2');
        var thematicsForm = db.configform.getPropertyGroupForm($xmlPropGroup);

        // Numeric Legend Form.
        var controlId = 'MapPalettes~numericLegend~';
        var numericForm = 
        {
            'id'        : 'numericLegend',
            'name'      : 'Numeric Legend',
            'controls'  :  []
        };

        // Transfer thematicsForm controls to other forms.
        for (var i = 0; i < thematicsForm.controls.length; i++) 
        {
            var ctrl = thematicsForm.controls[i];
            if (ctrl.id.indexOf('legendClassifier') != -1 || ctrl.id.indexOf('legendPrecision') != -1 )
            {
                numericForm.controls[numericForm.controls.length] = ctrl;
            }
            else
            {
                legendComponentForm.controls[legendComponentForm.controls.length] = ctrl;
            }
        }

        // No classes.
        var $xmlMapPalettes = db.$xmlConfig.find('MapPalettes');
        var control = 
        {
            'id'            : controlId + 'noClasses',
            'type'          : 'range',
            'name'          : 'Number of Classes',
            'min'           : 2,
            'max'           : 10,
            'value'         : $xmlMapPalettes.attr('classes')
        };
        numericForm.controls[numericForm.controls.length] = control;

        // Palette dropdown.
        var control = 
        {
            'id'            : controlId + 'colorRange',
            'name'          : 'Color Palette',
            'type'          : 'colour-dropdown',
            'choices'       : [],
            'value'         : numericPalette.id
        };
        var palettes = paletteConfig.getColorPalettes();
        for (var i = 0; i < palettes.length; i++) 
        {
            var p = palettes[i];
            control.choices[control.choices.length] = 
            {
                'label' : p.id,
                'value' : p.id,
                'colors' : p.getColorList()
            };
        }
        numericForm.controls[numericForm.controls.length] = control;
             
        // Color edit controls.  
        // Dont allow them to edit the webmap palette.
        if (numericPalette.id.indexOf('webmap') == -1)
        {
            var paletteType     = db.config.getPaletteType(numericPalette.id);
            var $xmlColorRange  = db.config.getColourRange(numericPalette.id);
            var $xmlColors      = $xmlColorRange.children();
            $.each($xmlColors, function(i, xmlColor)
            {
                var $xmlColor   = $(xmlColor);
                var color       = $xmlColor.text();
                var control = 
                {
                    'id'            : controlId + i,
                    'type'          : 'map-palettes-color-range',
                    'color-id'      : controlId + 'numericColor~' + i,
                    'color-value'   : color
                }
                numericForm.controls[numericForm.controls.length] = control;
            });

            // Color addition control.
            numericForm.controls[numericForm.controls.length] = 
            {
                'id'    : controlId + 'addColor',
                'type'  : 'map-palettes-color-range-add'
            };
        }
        forms[forms.length] = numericForm;

        // Categoric Legend Form.
        var controlId = 'MapPalettes~categoricLegend~';
        var categoricForm = 
        {
            'id'        : 'categoricLegend',
            'name'      : 'Categoric Legend',
            'controls'  :  []
        };

        // Scheme dropdown.
        var control = 
        {
            'id'            : controlId + 'colorScheme',
            'name'          : 'Color Palette',
            'type'          : 'colour-dropdown',
            'choices'       : [],
            'value'         : categoricPalette.id   
        };
        var schemes = paletteConfig.getColorSchemes();
        for (var i = 0; i < schemes.length; i++) 
        {
            var p = schemes[i];
            control.choices[control.choices.length] = 
            {
                'label' : p.id,
                'value' : p.id,
                'colors' : p.getColorList()
            };
        }
        categoricForm.controls[categoricForm.controls.length] = control;

        // Color edit controls.
        var paletteType     = db.config.getPaletteType(categoricPalette.id);
        var $xmlColorRange  = db.config.getColourRange(categoricPalette.id);
        var $xmlColors      = $xmlColorRange.children();
        $.each($xmlColors, function(i, xmlColor)
        {
            var $xmlColor   = $(xmlColor);
            var color       = $xmlColor.text();
            var control = 
            {
                'id'            : controlId + i,
                'type'          : 'map-palettes-color-range',
                'color-id'      : controlId + 'categoricColor~' + i,
                'color-value'   : color
            }
            categoricForm.controls[categoricForm.controls.length] = control;

            var forValue = $xmlColor.attr('for');
            control['type']         = 'map-palettes-color-scheme';
            control['for-id']       = controlId + 'for~' + i
            control['for-value']    = '';
            if (forValue != '__next') control['for-value'] = forValue;
        });

        // Color addition control.
        categoricForm.controls[categoricForm.controls.length] = 
        {
            'id'    : controlId + 'addColor',
            'type'  : 'map-palettes-color-scheme-add'
        };
        forms[forms.length] = categoricForm;

        // Point symbols.
        var $xmlPropGroup = db.$xmlConfig.find('PropertyGroup#pointSymbols');
        if (isLegend2) $xmlPropGroup = db.$xmlConfig.find('PropertyGroup#pointSymbols2');
        var symbolForm = db.configform.getPropertyGroupForm($xmlPropGroup);
        forms[forms.length] = symbolForm;

        // Line symbols.
        var $xmlPropGroup = db.$xmlConfig.find('PropertyGroup#lineSymbols');
        if (isLegend2) $xmlPropGroup = db.$xmlConfig.find('PropertyGroup#lineSymbols2');
        var symbolForm = db.configform.getPropertyGroupForm($xmlPropGroup);
        forms[forms.length] = symbolForm;

        return forms;
    };

    // If we're creating the webmap palette for the first time make it the
    // default palette. Otherwise just leave the default as is.
    function addWebmapPalette()
    {
        if (db.data.webmapPalettes != undefined)
        {
            if (db.report.config.template == ia.DOUBLE_BASELAYER_REPORT
                 || db.report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW
                 || db.report.config.template == ia.DOUBLE_GEOG_REPORT)
            {
                var dGroup2 = db.report.getComponent('dataGroup2');
                if (dGroup2)
                {
                    // Check if the webmap2 palette exists.
                    var $xmlColorRange = db.config.getColourRange('webmap2');
                    if ($xmlColorRange.length) {}
                    else  
                    {
                        // It doesnt exist. As this is first time opening
                        // the config make the webmap2 palette the default for dataGroup2.
                        if (db.data.webmapPalettes.length > 1) db.config.setGroupProperty('thematics2', 'mapPalette2', 'webmap2');
                    }
                    // Add / update the webmap2 palette.
                    if (db.data.webmapPalettes.length > 1) db.config.addColourRange('webmap2', db.data.webmapPalettes[1]);
                }
            }

            // Check if the webmap palette exists.
            var $xmlColorRange = db.config.getColourRange('webmap');
            if ($xmlColorRange.length) {}
            else  
            {
                // It doesnt exist. As this is first time opening
                // the config make the webmap palette the default.
                if (db.data.webmapPalettes.length > 0) db.config.setDefaultColourRange('webmap');
            }
            // Add / update the webmap palette.
            if (db.data.webmapPalettes.length > 0) db.config.addColourRange('webmap', db.data.webmapPalettes[0]);

            // Update the palette config.
            var paletteConfig = db.report.config.getMapPalette();
            var $xmlMapPalettes = db.$xmlConfig.find('MapPalettes');
            paletteConfig.parseXML($xmlMapPalettes.get(0))
            sessionStorage.setItem('iaoConfig', db.util.xmlToString(db.xmlConfig));

            // Update the thematics palette colours if customColours for the displayed indicator havent been set.
            var dGroup = db.report.getComponent('dataGroup');
            if (dGroup.indicator.getProperty('customColours') == undefined)
            {
                dGroup.legendSettings.paletteId = paletteConfig.defaultPaletteId;
                dGroup.thematic.numericClassifier.colorPalette = paletteConfig.getColorPalette(dGroup.legendSettings.paletteId);
                dGroup.thematic.commitChanges();

                // Update the thematics for map 2 if its there.
                if (db.report.config.template == ia.DOUBLE_BASELAYER_REPORT
                     || db.report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW
                     || db.report.config.template == ia.DOUBLE_GEOG_REPORT)
                {
                    var dGroup2 = db.report.getComponent('dataGroup2');
                    if (dGroup2)
                    {
                        dGroup2.legendSettings.paletteId = db.config.getGroupProperty('thematics2', 'mapPalette2');
                        if (dGroup2.legendSettings.paletteId == undefined) dGroup2.legendSettings.paletteId = dGroup.legendSettings.paletteId;
                        dGroup2.thematic.numericClassifier.colorPalette = paletteConfig.getColorPalette(dGroup2.legendSettings.paletteId);
                        dGroup2.thematic.commitChanges();
                    }
                }
            }
        }
    };

    return db;
}) (builder || {}, window.jQuery);