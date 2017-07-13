var designer = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.colorscheme = iad.colorscheme || {};

    // Passed in options.
    var options;

    // The color schemes container.
    var $colorSchemes;

    // The types of color scheme.
    var colorSchemeTypes = ['mono', 'complement', 'analogic', 'greyscale'];

    // The list of color schemes. These provide the hue values for the different color schemes.
    var colorSchemeTemplates = [
    {
        '@background-color'             : '#ffffff',
        '@font-color'                   : '#2B484A',
        '@panel-background-color'       : '#f7fbfd',
        '@panel-border-color'           : '#BBD6DD',
        '@panel-header-background-color': '#d9f1f7',
        '@panel-header-font-color'      : '#2B484A',
        '@button-background-color'      : '#be6161',
        '@button-border-color'          : '#883939',
        '@button-font-color'            : '#ffffff',
        '@chart-font-color'             : '#2B484A',
        '@chart-grid-color'             : '#BBD6DD',
        '@highlight-color'              : '#be6161',
        '@selection-color'              : '#883939'
    },
    {
        '@background-color'             : '#f7fbfd',
        '@font-color'                   : '#2B484A',
        '@panel-background-color'       : '#ffffff',
        '@panel-border-color'           : '#BBD6DD',
        '@panel-header-background-color': '#d9f1f7',
        '@panel-header-font-color'      : '#2B484A',
        '@button-background-color'      : '#be6161',
        '@button-border-color'          : '#883939',
        '@button-font-color'            : '#ffffff',
        '@chart-font-color'             : '#2B484A',
        '@chart-grid-color'             : '#BBD6DD',
        '@highlight-color'              : '#be6161',
        '@selection-color'              : '#883939'
    },
    {
        '@background-color'             : '#ffffff',
        '@font-color'                   : '#8f3333',
        '@panel-background-color'       : '#f7fbfd',
        '@panel-border-color'           : '#be7e7e',
        '@panel-header-background-color': '#be7e7e',
        '@panel-header-font-color'      : '#ffffff',
        '@button-background-color'      : '#be6161',
        '@button-border-color'          : '#883939',
        '@button-font-color'            : '#ffffff',
        '@chart-font-color'             : '#8f3333',
        '@chart-grid-color'             : '#be7e7e',
        '@highlight-color'              : '#be6161',
        '@selection-color'              : '#883939'
    },
    {
        '@background-color'             : '#f9fcfd',
        '@font-color'                   : '#8f3333',
        '@panel-background-color'       : '#f9fcfd',
        '@panel-border-color'           : '#BBD6DD',
        '@panel-header-background-color': '#f9fcfd',
        '@panel-header-font-color'      : '#8f3333',
        '@button-background-color'      : '#be6161',
        '@button-border-color'          : '#883939',
        '@button-font-color'            : '#ffffff',
        '@chart-font-color'             : '#8f3333',
        '@chart-grid-color'             : '#BBD6DD',
        '@highlight-color'              : '#be6161',
        '@selection-color'              : '#883939'
    },
    {
        '@background-color'             : '#e5f3f7',
        '@font-color'                   : '#8f3333',
        '@panel-background-color'       : '#fdfdfd',
        '@panel-border-color'           : '#d9f1f7',
        '@panel-header-background-color': '#d26b6b',
        '@panel-header-font-color'      : '#ffffff',
        '@button-background-color'      : '#d26b6b',
        '@button-border-color'          : '#883939',
        '@button-font-color'            : '#ffffff',
        '@chart-font-color'             : '#8f3333',
        '@chart-grid-color'             : '#d9f1f7',
        '@highlight-color'              : '#be6161',
        '@selection-color'              : '#883939'
    }];

    // Initialises the color schemes.
    iad.colorscheme.init = function(o)
    {
        options = o; 

        // Get the container elements.
        var $container = $(options.container);

        // Add the color swatches.
        var noHues = 84;
        var hueIncr = 360 / noHues;
        var $swatches = $('<div id="iad-color-scheme-swatches" class="row"></div>').appendTo($container);

        for (var i = 0; i < noHues; i++) 
        {
            var hue = hueIncr * i;
            var hsv = ia.Color.toHSVA('#be6161');
            hsv[0] = hue;
            var bgColor = ia.Color.toHex(ia.Color.HSVtoRGB(hsv)); 
            var $swatch = $('<div style="background-color:'+bgColor+'" class="iad-color-scheme-swatch col-xs-1"></div>').appendTo($swatches);
            onSwatchClick($swatch, bgColor);
        }

        // Add the color schemes container.
        $colorSchemes = $('<div id="iad-color-scheme-selectors" class="row"></div>').appendTo($container);

        var startColor = '#59AFCF';
        renderColorSchemes(getColorSchemes(startColor));
    };

    function onSwatchClick($swatch, bgColor)
    {
        (function() // Execute immediately
        { 
            $swatch.on('click', function(e)
            {
                renderColorSchemes(getColorSchemes(bgColor));
            });
        })();
    }

    // Gets a set of color schemes.
    function getColorSchemes(inColor)
    {
        var inHSV   = ia.Color.toHSVA(inColor);
        var inHue   = inHSV[0];
        var inSat   = inHSV[1];
        var inValue = inHSV[2];
        if (inHue === 0) inHue = 199;

        //ia.log(inHue+" "+inSat+" "+inValue)

        // Holds the list of returned color schemes.
        var colorSchemes = [];

        // Loop through the color schemes.
        for (var i = 0; i < colorSchemeTemplates.length; i++)
        {
            // Loop through the color scheme types.
            for (var j = 0; j < colorSchemeTypes.length; j++)
            {
                var type = colorSchemeTypes[j];

                // Create a new color scheme.
                var ts = colorSchemeTemplates[i];
                var cs = {};

                // Loop through the less variables.
                for (var property in ts)
                {
                    var color = ts[property];

                    // Get a new color by incrementing the hue value.
                    var hsv = ia.Color.toHSVA(color);
                    hsv[0] = inHue;
                    var hex = ia.Color.toHex(ia.Color.HSVtoRGB(hsv)); 

                    // If its the button background and border get the complementary hue value.
                    if (type === 'complement')
                    {
                        if (property === '@button-background-color' || property === '@button-border-color' || property === '@button-border-color') 
                            hex = ia.Color.complement(hex);
                    }
                    else if (type === 'analogic')
                    {
                        if (property === '@button-background-color' || property === '@button-border-color' || property === '@font-color' || property === '@chart-font-color') 
                            hex = ia.Color.analogic(hex)[1];

                        if (property === '@panel-border-color' || property === '@chart-grid-color')  
                            hex = ia.Color.analogic(hex)[0];
                    }
                    else if (type === 'greyscale')
                    {

                        if (property === '@panel-header-background-color' || property === '@background-color' || 
                            property === '@panel-background-color' || property === '@panel-border-color' || property === '@chart-grid-color')    
                        {
                            hsv = ia.Color.toHSVA(hex);
                            hsv[1] = 0;
                            hex = ia.Color.toHex(ia.Color.HSVtoRGB(hsv)); 
                        }
                    }

                    if (property === '@highlight-color' || property === '@selection-color')    
                    { 
                        hex = ia.Color.complement(hex);
                    }

                    // Add the color to the color scheme.
                    cs[property] = hex;
                    // Add the color to the color scheme.
                    cs[property] = hex;
                }

                // Add the color scheme.
                colorSchemes[colorSchemes.length] = cs;
            }
        }

        return colorSchemes;
    }

    function onColorSchemeClick($colorScheme)
    {
        $colorScheme.on('click', function(e)
        {
            var colorScheme = $(this).data('colorScheme');

            if (options && options.onChange) options.onChange.call(null, colorScheme); // Return.
        });
    }

    // Renders the html elements for a set of color schemes and appends them to the $colorSchemes element.
    function renderColorSchemes(colorSchemes)
    {
        $colorSchemes.empty();

        // Build the html for the color schemes.
        for (var i = 0; i < colorSchemes.length; i++)
        {
            // Get the color scheme.
            var obj = colorSchemes[i];

            // Create a new color scheme html element.
            var $colorScheme = $('<div class="iad-color-scheme col-xs-3">');
            $colorScheme.css(
            {
                'background-color': obj['@background-color']
            })
            .data('colorScheme', obj)
            .appendTo($colorSchemes);
            onColorSchemeClick($colorScheme);

            // Add the nested html elements.

            // Button.
            $('<div class="iad-color-scheme-btn">')
            .css(
            {
                'background-color'  : obj['@button-background-color'],
                'border-color'      : obj['@button-border-color'],
                'border-width'      : '0px',
                'border-radius'     : '0px',
                'color'             : obj['@button-font-color'],
                'font-size'         : '11px',
                'font-family'       : 'Verdana, Geneva, sans-serif'
            })
            .html('Button')
            .appendTo($colorScheme);

            // Panel Header.
            $('<div class="iad-color-scheme-panel-header">')
            .css(
            {
                'background-color'  : obj['@panel-header-background-color'],
                'border-color'      : obj['@panel-border-color'],
                'border-width'      : '1px 1px 0px 1px',
                'border-radius'     : '0px',
                'color'             : obj['@panel-header-font-color'],
                'font-size'         : '11px',
                'font-family'       : 'Verdana, Geneva, sans-serif'
            })
            .html('Title')
            .appendTo($colorScheme);

            // Panel.
            $('<div class="iad-color-scheme-panel">')
            .css(
            {
                'background-color'  : obj['@panel-background-color'],
                'border-color'      : obj['@panel-border-color'],
                'border-width'      : '0px 1px 1px 1px',
                'border-radius'     : '0px',
                'color'             : obj['@font-color'],
                'font-size'         : '11px',
                'font-family'       : 'Verdana, Geneva, sans-serif'
            })
            .html('Text')
            .appendTo($colorScheme);
        }
    }
    
    return iad;

})(designer || {}, jQuery, window, document);
