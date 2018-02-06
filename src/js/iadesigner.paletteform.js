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
                json:getMapPalettesForm()
            });
        }
    };

    // Returns the form for the map palettes.
    function getMapPalettesForm()
    {
        var json = {'id': 'mappalettes','forms': []};

        // Numeric.
        var numericForm = 
        {
            'id'        : 'colorRanges',
            'name'      : 'Numeric',
            'type'      : 'MapPalettes',
            'controls'  : []
        };
        // Add range button.
        numericForm.controls[numericForm.controls.length] = 
        {
            'id'    : 'MapPalettes',
            'name'  : 'New Palette',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-colourrange'
        };
        // Ranges.
        numericForm.controls = numericForm.controls.concat(getPaletteControls(iad.config.getColourRanges()));
        json.forms.push(numericForm);

        // Categoric.
        var categoricForm = 
        {
            'id'        : 'colorSchemes',
            'name'      : 'Categoric',
            'type'      : 'MapPalettes',
            'controls'  : []
        };
        // Add scheme button.
        categoricForm.controls[categoricForm.controls.length] = 
        {
            'id'    : 'MapPalettes',
            'name'  : 'New Palette',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-colourscheme'
        };
        // Schemes.
        categoricForm.controls = categoricForm.controls.concat(getPaletteControls(iad.config.getColourSchemes()));
        json.forms.push(categoricForm);
        
        return json;
    }

    // Returns the palette controls.
    function getPaletteControls($xmlColourRanges)
    {
        var controls = [];
        $.each($xmlColourRanges, function(i, xmlColourRange)
        {
            // Colour range.
            var $xmlColourRange = $(xmlColourRange);
            var id = $xmlColourRange.attr('id');

            var removeable = true;
            if (id === iad.config.getDefaultColourRange()) removeable = false;

            var jsonControl = 
            {
                'id'            : id,
                'sortable'      : true,
                'removeable'    : removeable,
                'action'        : 'remove-palette',
                'index'         : i,
                'type'          : 'colour-palette',
                'value'         : id,
                'choices'       : [],
            };

            // Colors.
            var $xmlColours = iad.config.getPaletteColours(id);
            $.each($xmlColours, function(j, xmlColour)
            {
                var $xmlColour = $(xmlColour);
                jsonControl.choices[jsonControl.choices.length] = 
                {
                    'label' : $xmlColour.text(),
                    'value' : $xmlColour.text(),
                    'index' : j,
                };   
            });
            controls[controls.length] = jsonControl;
        });

        return controls;
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);