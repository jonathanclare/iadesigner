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
        var dispatchWidgetChange = iad.util.debounce(function (data) {dispatchChange(data);}, 250);

        // Called when a group property has been changed.
        var dispatchGroupPropertyChange = iad.util.debounce(function (data) {dispatchChange(data);}, 1000);

        // Dispatches the change.
        function dispatchChange(data) {if (options && options.onDataChanged) options.onDataChanged.call(null, data);}

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
        function onChange($control, newValue)
        {
            var data = getData($control);
            data.controlValue = newValue;
            if (data.formType === 'PropertyGroup' || data.formType === 'MapLayers') dispatchGroupPropertyChange(data);
            else dispatchWidgetChange(data);
        }

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

        // Text dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-replace a', function (e)
        {
            e.preventDefault();
            var selText = $(this).attr('data-value');
            var $input = $(this).parents('.input-group').find('.iad-control-text');
            $input.val(selText);
            onChange($input, $input.val());
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
            onChange($input, $input.val());
        });

        // Integer counter buttons.
        $(document).on('click', '.iad-control-integer-minus', function (e)
        {
            e.preventDefault();
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = ia.parseInt($input.val());
            value = value - 1;
            $input.val(value);
            onChange($input, value);
        });
        $(document).on('click', '.iad-control-integer-plus', function (e)
        {
            e.preventDefault();
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = ia.parseInt($input.val());
            value = value + 1;
            $input.val(value);
            onChange($input, value);
        });

        // Float counter buttons.
        $(document).on('click', '.iad-control-float-minus', function (e)
        {
            e.preventDefault();
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = parseFloat($input.val());
            value = value - 0.05;
            value = value.toFixed(2);
            $input.val(value);
            onChange($input, value);
        });
        $(document).on('click', '.iad-control-float-plus', function (e)
        {
            e.preventDefault();
            var $input = $(this).parents('.input-group').find('.iad-control-number');
            var value = parseFloat($input.val());
            value = value + 0.05;
            value = value.toFixed(2);
            $input.val(value);
            onChange($input, value);
        });

        // Color dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-colorpalette a', function (e)
        {
            e.preventDefault();
            var value = $(this).attr('data-value');
            onChange($(this), value);
        });

        // Open color scheme modal.
        $(document).on('click', '#iad-color-scheme-btn, #iad-quick-link-color-schemes', function (e)
        {
            e.preventDefault();
            $('#iad-modal-color-schemes').modal({show: true});
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

        // Add / Remove table columns.
        $(document).on('click', '.iad-control-add-column', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.addColumn(data.controlId);
        });
        $(document).on('click', '.iad-control-remove-column', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.removeColumn(data.controlId, data.controlIndex);
        });

        // Add / Remove spine chart symbol.
        $(document).on('click', '.iad-control-add-symbol', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.addSymbol(data.controlId);
        });
        $(document).on('click', '.iad-control-remove-symbol', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.removeSymbol(data.controlId, data.controlIndex);
        });

        // Add / Remove spine chart target.
        $(document).on('click', '.iad-control-add-target', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.addTarget(data.controlId);
        });
        $(document).on('click', '.iad-control-remove-target', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.removeTarget(data.controlId, data.controlIndex);
        });

        // Add / Remove spine chart break.
        $(document).on('click', '.iad-control-add-break', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.addBreak(data.controlId);
        });
        $(document).on('click', '.iad-control-remove-break', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.removeBreak(data.controlId, data.controlIndex);
        });

        // Add / Remove Menu item on menu bar.
        $(document).on('click', '.iad-control-add-menu-item', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.addMenuItem(data.controlId);
        });
        $(document).on('click', '.iad-control-remove-menu-item', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.removeMenuItem(data.controlId, data.controlIndex);
        });

        // Add / Remove pyramid line.
        $(document).on('click', '.iad-control-add-pyramid-line', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.addPyramidLine(data.controlId);
        });
        $(document).on('click', '.iad-control-remove-pyramid-line', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            iad.config.removePyramidLine(data.controlId, data.controlIndex);
        });
    }

	return iad;

})(iadesigner || {}, jQuery, window, document);