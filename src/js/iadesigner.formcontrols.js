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
        // Called when a widget property has been changed.
        var dispatchWidgetChange = iad.util.debounce(function (formId, formType, controlId, newValue)
        {
            dispatchChange(formId, formType, controlId, newValue);
        }, 250);

        // Called when a group property has been changed.
        var dispatchGroupPropertyChange = iad.util.debounce(function (formId, formType, controlId, newValue)
        {
            dispatchChange(formId, formType, controlId, newValue);
        }, 1000);

        // Dispatches the change.
        function dispatchChange(formId, formType, controlId, newValue)
        { 
            if (options && options.onPropertyChanged) options.onPropertyChanged.call(null, formId, formType, controlId, newValue); // On property changed.
        }

        // Called when a property has been changed.
        function onPropertyChanged($control, controlId, newValue)
        {
            var $form = $control.closest('.iad-form');
            var formId = $form.data('id');
            var formType = $form.data('type');

            if (formType === 'PropertyGroup') 
                dispatchGroupPropertyChange(formId, formType, controlId, newValue);
            else
                dispatchWidgetChange(formId, formType, controlId, newValue);
        }

        // Handle key entry.
        $(document).on('keyup', '.iad-control-text, .iad-control-integer, .iad-control-float', function (e) 
        {
            onPropertyChanged($(this), $(this).data('id'), $(this).val());
        });

        // Handle pasted text.
        $(document).on('paste', '.iad-control-text, iad-control-integer, iad-control-float', function (e) 
        {
            onPropertyChanged($(this), $(this).data('id'), $(this).val());
        });

        // Handle dropdowns.
        $(document).on('change', '.iad-control-select, .iad-control-integer-select', function (e)  
        {
            onPropertyChanged($(this), $(this).data('id'), $(this).val());}
        );

        // Handle checkbox.
        $(document).on('change', '.iad-control-checkbox', function (e)  
        {
            onPropertyChanged($(this), $(this).data('id'), $(this).is(':checked'));
        });

        // Range input
        $(document).on('change', '.iad-control-range', function (e) 
        {
            var value = $(this).val();
            $(this).next().html(value);
            onPropertyChanged($(this), $(this).data('id'), value);
        });

        // Text dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-replace a', function (e)
        {
            e.preventDefault();

            var selText = $(this).attr('data-value');

            var $input = $(this).parents('.input-group').find('.iad-control-text');
            $input.val(selText);

            onPropertyChanged($input, $input.data('id'), $input.val());
        });

        // Text dropdown input append text.
        $(document).on('click', '.iad-dropdown-menu-append a', function (e)
        {
            e.preventDefault();

            var selText = $(this).attr('data-value');

            var $input = $(this).parents('.input-group').find('.iad-control-text');
            var inputValue = $input.val();

            if (inputValue === '') $input.val(selText);
            else $input.val($input.val() + ' ' + selText);

            onPropertyChanged($input, $input.data('id'), $input.val());
        });

        // Integer counter buttons.
        $(document).on('click', '.iad-control-integer-minus', function (e)
        {
            e.preventDefault();

            // Get the hidden input associated with the button to find the value.
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = ia.parseInt($input.val());

            value = value - 1;
            $input.val(value);

            onPropertyChanged($input, $input.data('id'), value);
        });
        $(document).on('click', '.iad-control-integer-plus', function (e)
        {
            e.preventDefault();

            // Get the hidden input associated with the button to find the value.
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = ia.parseInt($input.val());

            // Increase the value by one.
            value = value + 1;
            $input.val(value);

            onPropertyChanged($input, $input.data('id'), value);
        });

        // Float counter buttons.
        $(document).on('click', '.iad-control-float-minus', function (e)
        {
            e.preventDefault();

            // Get the hidden input associated with the button to find the value.
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = parseFloat($input.val());

            value = value - 0.05;
            value = value.toFixed(2);
            $input.val(value);

            onPropertyChanged($input, $input.data('id'), value);
        });
        $(document).on('click', '.iad-control-float-plus', function (e)
        {
            e.preventDefault();

            // Get the hidden input associated with the button to find the value.
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = parseFloat($input.val());

            // Increase the value by one.
            value = value + 0.05;
            value = value.toFixed(2);
            $input.val(value);

            onPropertyChanged($input, $input.data('id'), value);
        });

        // Color dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-colorpalette a', function (e)
        {
            e.preventDefault();

            var id = $(this).parents('.input-group').find('.dropdown-toggle').data('id');
            var value = $(this).attr('data-value');
            onPropertyChanged($(this), id, value);
        });

        // Open color scheme modal.
        $(document).on('click', '#iad-color-scheme-btn, #iad-quick-link-color-schemes', function (e)
        {
            e.preventDefault();
            $('#iad-modal-color-schemes').modal(
            {
                show: true
            });
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
                onPropertyChanged($colorSwatch, $colorSwatch.data('id'), outColor);
            });
        });

        // Add / Remove table columns.
        $(document).on('click', '.iad-control-add-column', function (e)
        {
            console.log($(this).data('id'));
            iad.config.addColumn($(this).data('id'));
        });
        $(document).on('click', '.iad-control-remove-column', function (e)
        {
            e.preventDefault();
            console.log($(this).data('id'));
            console.log($(this).data('index'));
            iad.config.removeColumn($(this).data('id'), $(this).data('index'));
        });

        // Add / Remove spine chart symbol.
        $(document).on('click', '.iad-control-add-symbol', function (e)
        {
            e.preventDefault();
            iad.config.addSymbol($(this).data('id'));
        });
        $(document).on('click', '.iad-control-remove-symbol', function (e)
        {
            e.preventDefault();
            iad.config.removeSymbol($(this).data('id'), $(this).data('index'));
        });

        // Add / Remove spine chart target.
        $(document).on('click', '.iad-control-add-target', function (e)
        {
            e.preventDefault();
            iad.config.addTarget($(this).data('id'));
        });
        $(document).on('click', '.iad-control-remove-target', function (e)
        {
            e.preventDefault();
            iad.config.removeTarget($(this).data('id'), $(this).data('index'));
        });

        // Add / Remove spine chart break.
        $(document).on('click', '.iad-control-add-break', function (e)
        {
            e.preventDefault();
            iad.config.addBreak($(this).data('id'));
        });
        $(document).on('click', '.iad-control-remove-break', function (e)
        {
            e.preventDefault();
            iad.config.removeBreak($(this).data('id'), $(this).data('index'));
        });

        // Add / Remove Menu item on menu bar.
        $(document).on('click', '.iad-control-add-menu-item', function (e)
        {
            e.preventDefault();
            iad.config.addMenuItem($(this).data('id'));
        });
        $(document).on('click', '.iad-control-remove-menu-item', function (e)
        {
            e.preventDefault();
            iad.config.removeMenuItem($(this).data('id'), $(this).data('index'));
        });

        // Add / Remove pyramid line.
        $(document).on('click', '.iad-control-add-pyramid-line', function (e)
        {
            e.preventDefault();
            iad.config.addPyramidLine($(this).data('id'));
        });
        $(document).on('click', '.iad-control-remove-pyramid-line', function (e)
        {
            e.preventDefault();
            iad.config.removePyramidLine($(this).data('id'), $(this).data('index'));
        });
    }

	return iad;

})(iadesigner || {}, jQuery, window, document);