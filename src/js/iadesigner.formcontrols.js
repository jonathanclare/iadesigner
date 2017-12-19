var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.formcontrols = iad.formcontrols || {};

    // Passed in options.
    var options;

    // Initialise.
    iad.formcontrols.init = function (o)
    {
        options = o;
        addControlHandlers();
    };

    // Adds the control handlers.
    function addControlHandlers()
    {
        // Returns the data associated with the control.
        function getData($control)
        {
            var $form = $control.closest('.iad-form');
            var $formGroup = $control.closest('.iad-form-group');
            var data = {formId:$form.data('form-id'), formType:$form.data('form-type'), controlId:$formGroup.data('control-id')};
            var $controlGroup = $control.closest('.iad-control-group');
            if ($controlGroup.length) data.controlIndex = $controlGroup.data('control-index');
            return data;
        }

        // Called when a value has been changed.
        var onChange = iad.util.debounce(function ($control, newValue) 
        {
            var data = getData($control);
            data.controlValue = newValue;
            if (options && options.onDataChanged) options.onDataChanged.call(null, data);
        }, 250);

        // Close popovers on click outside.
        $(document).on('mousedown', function (e) 
        {
             $('[data-toggle="popover"]').each(function () 
             {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) 
                {
                    $(this).popover('hide');
                }
            });
        });

        // Handle key entry / paste.
        $(document).on('keyup paste', '.iad-control-text, .iad-control-integer, .iad-control-float', function (e) 
        {
            onChange($(this), $(this).val());
        });

        // Handle dropdowns.
        $(document).on('change', '.iad-control-select, .iad-control-integer-select', function (e)  
        {
            onChange($(this), $(this).val());}
        );

        // Handle checkbox.
        $(document).on('change', '.iad-control-checkbox', function (e)  
        {
            onChange($(this), $(this).is(':checked'));
        });

        // Range input
        $(document).on('change', '.iad-control-range', function (e) 
        {
            var value = $(this).val();
            $(this).next().html(value);
            onChange($(this), value);
        });

        // Text dropdown input replace text / append text.
        $(document).on('click', '.iad-dropdown-menu-replace a, .iad-dropdown-menu-append a', function (e)
        {
            e.preventDefault();

            var txt = $(this).attr('data-value');
            var $input = $(this).parents('.input-group').find('.iad-control-text');
            var inputValue = $input.val();

            if ($(this).closest('.iad-dropdown-menu-append').length && inputValue !== '') txt = inputValue + ' ' + txt;

            $input.val(txt);
            onChange($input, txt);
        });

        // Counter buttons.
        $(document).on('click', '.iad-control-integer-minus, .iad-control-integer-plus, .iad-control-float-minus, .iad-control-float-plus', function (e)
        {
            e.preventDefault();

            var $btn = $(this);
            var $input = $btn.parents('.input-group').find('.iad-control-number');
            var value;

            if ($btn.hasClass('iad-control-integer-minus'))
            {
                value = ia.parseInt($input.val());
                value = value - 1;
            }
            else if ($btn.hasClass('iad-control-integer-plus'))
            {
                value = ia.parseInt($input.val());
                value = value + 1;
            }
            else if ($btn.hasClass('iad-control-float-minus'))
            {
                value = parseFloat($input.val());
                value = value - 0.05;
                value = value.toFixed(2);
            }
            else if ($btn.hasClass('iad-control-float-plus'))
            {
                value = parseFloat($input.val());
                value = value + 0.05;
                value = value.toFixed(2);
            }

            $input.val(value);
            onChange($input, value);
        });

        // Add / Remove table columns.
        $(document).on('click', '.iad-control-btn, .iad-control-add, .iad-control-remove', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            var $btn = $(this);
            data.action = $btn.data('action');
            if (options && options.onButtonClicked) options.onButtonClicked.call(null, data);
        });

        // Color dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-colorpalette a', function (e)
        {
            e.preventDefault();
            var value = $(this).attr('data-value');
            onChange($(this), value);
        });

        // Color.
        $(document).on('click', '.iad-control-color-swatch', function (e)
        {
            // Prevent color picker from closing when clicked.
            e.stopPropagation();
            e.preventDefault();

            // Get the color swatch that was clicked.
            var $colorSwatch = $(this);

            // Open the color picker
            var inColor = $colorSwatch.css('background-color');
            iad.colorpicker.open($colorSwatch, inColor, function (outColor)
            {
                $colorSwatch.css('background-color', outColor); // Update the color swatch.
                onChange($colorSwatch, outColor);
            });
        });
    }

	return iad;

})(iadesigner || {}, jQuery, window, document);