var designer = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.formcontrols = iad.formcontrols || {};

    // Passed in options.
    var options;

    // Timeout for controls to prevent memory issues.
    var controlChangeTimeout;

    // The index of the active collapsible panel.
    iad.formcontrols.activePanelIndex = 0;

    // Initialise.
    iad.formcontrols.init = function (o)
    {
        options = o;
        addControlHandlers();
    };

    // Called when a config property has been changed.
    function onPropertyChanged(controlId, newValue)
    {
        var arr = controlId.split('~');
        var tagName = arr[0];
        var widgetId = arr[1];
        var propertyId = arr[2];
        var attribute = arr[3];
        if (options && options.onPropertyChanged) options.onPropertyChanged.call(null, controlId, tagName, widgetId, propertyId, newValue, attribute); // On property changed.
    }

    // For add / remove below.
    function parseId($btn)
    {
        var info = $btn.attr('id').split('~');
        return { widgetId: info[1], index: info[2] };
    }

    // Adds the control handlers.
    function addControlHandlers()
    {
        // Text dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-replace a', function (e)
        {
            e.preventDefault();

            var selText = $(this).attr('data-value');

            var $input = $(this).parents('.input-group').find('.iad-control-text');
            $input.val(selText);

            var id = $input.attr('id');
            var value = $input.val();

            onPropertyChanged(id, value);
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

            var id = $input.attr('id');
            var value = $input.val();

            onPropertyChanged(id, value);
        });

        // Color dropdown input replace text.
        $(document).on('click', '.iad-dropdown-menu-colorpalette a', function (e)
        {
            e.preventDefault();

            var id = $(this).parents('.input-group').find('.dropdown-toggle').attr('id');
            var value = $(this).attr('data-value');

            onPropertyChanged(id, value);
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

        // Update config button.
        $(document).on('click', '.iad-update-config-btn', function (e)
        {
            e.preventDefault();
            $('.iad-update-config-btn').removeClass('btn-primary').addClass('btn-default');
            iad.config.update(db.xmlConfig);
        });

        // Z-Index.
        $(document).on('click', '#iad-send-to-back-btn', function (e)
        {
            e.preventDefault();
            iad.config.sendToBack(db.widgets.selectedId);
        });
        $(document).on('click', '#iad-bring-to-front-btn', function (e)
        {
            e.preventDefault();
            iad.config.bringToFront(db.widgets.selectedId);
        });

        // Text.
        $(document).on('keyup', '.iad-control-text', function (e) // Handle key entry.
        {
            var id = $(this).attr('id');
            var value = $(this).val();
            $(this).siblings().find('.iad-update-config-btn').removeClass('btn-default').addClass('btn-primary');

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 1000);
        });
        $(document).on('paste', '.iad-control-text', function (e) // Handle pasted text.
        {
            var $input = $(this);
            setTimeout(function ()
            {
                var id = $input.attr('id');
                var value = $input.val();
                $(this).siblings().find('.iad-update-config-btn').removeClass('btn-default').addClass('btn-primary');
                onPropertyChanged(id, value);
            }, 100);
        });

        // Choice.
        $(document).on('change', '.iad-control-select', function (e)
        {
            var id = $(this).attr('id');
            var value = $(this).val();
            onPropertyChanged(id, value);
        });
        $(document).on('change', '.iad-control-integer-select', function (e)
        {
            var id = $(this).attr('id');
            var value = $(this).val();
            onPropertyChanged(id, value);
        });

        // Boolean.
        $(document).on('change', '.iad-control-checkbox', function (e)
        {
            var id = $(this).attr('id');
            var value = $(this).is(':checked');
            onPropertyChanged(id, value);
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
                $colorSwatch.siblings('.iad-update-config-btn').removeClass('btn-default').addClass('btn-primary');

                clearTimeout(controlChangeTimeout);
                controlChangeTimeout = setTimeout(function() 
                {
                    onPropertyChanged($colorSwatch.attr('id'), outColor);
                }, 100);
            });
        });

        // Integer.
        $(document).on('keyup', '.iad-control-integer', function (e) // Handle key entry.
        {
            var id = $(this).attr('id');
            var value = $(this).val();

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 1000);
        });
        $(document).on('paste', '.iad-control-integer', function (e) // Handle pasted text.
        {
            var $input = $(this);
            setTimeout(function ()
            {
                var id = $input.attr('id');
                var value = $input.val();
                onPropertyChanged(id, value);
            }, 100);
        });

        // Float.
        $(document).on('keyup', '.iad-control-float', function (e) // Handle key entry.
        {
            var id = $(this).attr('id');
            var value = $(this).val();

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 1000);
        });
        $(document).on('paste', '.iad-control-float', function (e) // Handle pasted text.
        {
            var $input = $(this);
            setTimeout(function ()
            {
                var id = $input.attr('id');
                var value = $input.val();
                onPropertyChanged(id, value);
            }, 100);
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

            var id = $input.attr('id');

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 500);
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

            var id = $input.attr('id');

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 500);
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

            var id = $input.attr('id');

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 500);
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

            var id = $input.attr('id');

            clearTimeout(controlChangeTimeout);
            controlChangeTimeout = setTimeout(function() 
            {
                onPropertyChanged(id, value);
            }, 500);
        });

        // Range input
        $(document).on('change', '.iad-control-range', function (e)
        {
            var id = $(this).attr('id');
            var value = $(this).val();
            $(this).next().html(value);
            onPropertyChanged(id, value);
        });

        // Add / Remove table columns.
        $(document).on('click', '.iad-control-add-column', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.addColumn(o.widgetId);
        });
        $(document).on('click', '.iad-control-remove-column', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.removeColumn(o.widgetId, o.index);
        });
        // Add / Remove spine chart symbol.
        $(document).on('click', '.iad-control-add-symbol', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.addSymbol(o.widgetId);
        });
        $(document).on('click', '.iad-control-remove-symbol', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.removeSymbol(o.widgetId, o.index);
        });
        // Add / Remove spine chart target.
        $(document).on('click', '.iad-control-add-target', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.addTarget(o.widgetId);
        });
        $(document).on('click', '.iad-control-remove-target', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.removeTarget(o.widgetId, o.index);
        });
        // Add / Remove spine chart break.
        $(document).on('click', '.iad-control-add-break', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.addBreak(o.widgetId);
        });
        $(document).on('click', '.iad-control-remove-break', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.removeBreak(o.widgetId, o.index);
        });
        // Add / Remove Menu item on menu bar.
        $(document).on('click', '.iad-control-add-menu-item', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.addMenuItem(o.widgetId);
        });
        $(document).on('click', '.iad-control-remove-menu-item', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.removeMenuItem(o.widgetId, o.index);
        });
        // Add / Remove pyramid line.
        $(document).on('click', '.iad-control-add-pyramid-line', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.addPyramidLine(o.widgetId);
        });
        $(document).on('click', '.iad-control-remove-pyramid-line', function (e)
        {
            e.preventDefault();
            var o = parseId($(this));
            iad.config.removePyramidLine(o.widgetId, o.index);
        });

        // Collapsible panels.
        $(document).on('shown.bs.collapse', '.iad-collapse', function (e)
        {
            var id = e.target.id;
            var indexPos = id.lastIndexOf('-') + 1;
            iad.formcontrols.activePanelIndex = id.substring(indexPos);
        });
    }

	return iad;

})(designer || {}, jQuery, window, document);