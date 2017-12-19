var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.colorpicker = iad.colorpicker || {};

    var $farb,              // Farbtastic color picker.
    $colorPicker,           // The color picker container.
    $colorPickerPalette,    // The color picker palette.
    $colorInput,            // The color picker input.
    $colorSwatch;           // The color picker swatch.

    // Execution starts here.
    iad.colorpicker.init = function()
    {
        $colorPicker        = $('#iad-color-picker');            
        $colorPickerPalette = $('#iad-color-picker-palette'); 
        $colorInput         = $('#iad-color-picker-input');      
        $colorSwatch        = $('#iad-color-picker-swatch');
        $farb               = $.farbtastic('#iad-color-picker-palette');    

        // Prevent click event propagation so that the 
        // color picker doesnt close when it is clicked on.
        $colorPicker.on('click', function(e)
        {
            e.preventDefault();
            e.stopPropagation();
        });

        // Color picker input - on return key press.
        $colorInput.keypress(function(e)
        {
            // Update color picker with value of input.
            if (e.which == 13) $farb.setColor($(this).val());
        });
    };

    function update(color)
    { 
        var isHex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
        if (!isHex) color = $colorPicker.data('color');
        color = color.toUpperCase();
        $colorPicker.data('color', color);              // Attach color to color picker data.
        $colorInput.val(color);                         // Update input color.
        $colorSwatch.css('background-color', color);    // Update swatch color.
        return color;
    }

    // Opens the color picker.
    iad.colorpicker.open = function($control, inColor, callbackFunction)
    {
        // Bind function to close the color picker if the user clicks outside of it.
        $('body').on('click.iad.colorpicker.close', iad.colorpicker.close);

        // Set the inital color to that of the clicked color swatch.
        $farb.setColor(ia.Color.toHex(inColor));
        update(ia.Color.toHex(inColor));

        // This function is run whenever the color picker value is changed.
        $farb.linkTo(function(color)
        {
            var fixedColor = update(color);
            callbackFunction.call(null, fixedColor);
        });

        // Position and open the color picker.
        var pos = $control.offset();
        var left = pos.left - 10;
        var top = pos.top + $control.outerHeight() - $colorPicker.outerHeight() + 10;
        $colorPicker.css({'left': left,'top': top}).show();
    };

    // Closes the color picker.
    iad.colorpicker.close = function()
    {
        $('body').off('click.iad.colorpicker.close', iad.colorpicker.close);  // Unbind function that closes color picker.
        $farb.linkTo(function(color) {});                                     // Clear the linked to function.
        $colorPicker.hide();                                                  // Hide the color picker.
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
