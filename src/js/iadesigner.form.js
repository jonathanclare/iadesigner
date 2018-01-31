var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.form = iad.form || {};

    // Passed in options.
    var options;

    // Form display properties for each widget (scroll position and expanded panel index).
    var oFormProps = {};

    // Initialise.
    iad.form.init = function (o)
    {
        options = o; 
        addControlHandlers();
    };

    // Renders a new form.
    iad.form.render = function (o)
    {
        var $container = $(o.container);
        $container.parent().css('visibility','hidden');
        $container.html(window.iadesigner[o.template](o.json));

        // Enable control tooltips.
        $container.find('.iad-tooltip-control').tooltip(
        {
            placement: 'bottom',
            trigger: 'hover'
        });

        // Make columns sortable.
        $container.find('.draggableList').sortable(
        {
            handle: '.iad-sort-handle', 
            axis:'y',
            update: function()
            {
                // New order.
                var arrData = [];
                $('.iad-sortable', $(this)).each(function(i, elem) 
                {
                    var $control = $(elem);

                    var data = getData($control);
                    data.prevControlIndex = $control.data('control-index');
                    arrData.push(data);

                    $control.data('control-index', i); // Update the item index.
                });

                if (options && options.onControlOrderChanged) options.onControlOrderChanged.call(null, arrData);
            }
        });

        // Apply auto size to text areas.
        var $textarea = $container.find('.iad-control-textarea');
        $textarea.autosize({append: '\n'});
        $textarea.trigger('autosize.resize');
        $textarea.resize(function(e) {$textarea.trigger('autosize.resize');});

        // Scroll position and expanded panel logic to maintain view.
        var doScrollAfterPanelExpanded = false;
        var f = oFormProps[o.json.id];
        if (f === undefined) f = oFormProps[o.json.id] = {panelIndex:undefined, scrollPos:0};

        if (f.panelIndex !== undefined) // Open previous panel then scroll to correct position.
        {
            doScrollAfterPanelExpanded = true;
            $container.find('.iad-collapse:eq('+f.panelIndex+')').collapse('show');
        }
        else if ($container.find('.iad-collapse').length > 1) // Open first panel then scroll to correct position.
        {
            doScrollAfterPanelExpanded = true;
            f.panelIndex = 0;
            $container.find('.iad-collapse:eq(0)').collapse('show');
        }        
        else onRenderComplete($container, f, o); // Scroll to correct position.

        $container.off('show.bs.collapse');
        $container.off('shown.bs.collapse');
        $container.off('hidden.bs.collapse');
        $container.parent().off('.iadformscroll');

        $container.on('show.bs.collapse', '.iad-collapse', function (e) 
        {
            // Fix for accordion collapse bug https://github.com/openam/bootstrap-responsive-tabs/issues/45
            $(e.target).closest('.panel').siblings().find('.panel-collapse').collapse('hide');
        });
        $container.on('shown.bs.collapse', '.iad-collapse', function (e)
        {
            // Do scroll after collapse has expanded to scroll to correct position.
            if (doScrollAfterPanelExpanded)
            {
                doScrollAfterPanelExpanded = false;
                onRenderComplete($container, f, o);
            }
            // Store the index of the expanded panel.
            f.panelIndex = $container.find('.iad-collapse').index(this);
        });
        $container.on('hidden.bs.collapse', '.iad-collapse', function (e)
        {
            // Remove the index of the expanded panel.
            f.panelIndex = undefined;
        });
        $container.parent().on('scroll.iadformscroll', function (e)
        {
            if (doScrollAfterPanelExpanded === false) f.scrollPos = $(this).scrollTop();
        });
    };

    function onRenderComplete($container, f, o)
    {
        if (o.controlAdded) 
        {
            scrollToBottom($container);
            o.controlAdded = false;
        }
        else 
            scrollTo($container, f.scrollPos);

        $container.parent().css('visibility','visible');
    }

    // Scrolls to position in form.
    function scrollTo($container, scrollPos)
    {
        $container.parent().scrollTop(scrollPos);        
    }

    // Scrolls to bottom of form.
    function scrollToBottom($container)
    {
        scrollTo($container, $container.parent()[0].scrollHeight); 
    }

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

    // Adds the control handlers.
    function addControlHandlers()
    {
        // Called when a value has been changed.
        var onChange = iad.util.debounce(function ($control, newValue) 
        {
            var data = getData($control);
            data.controlValue = newValue;
            if (options && options.onDataChanged) options.onDataChanged.call(null, data);
        }, 250);

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

        // Add button.
        $(document).on('click', '.iad-control-btn, .iad-control-add, .iad-control-remove', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            var $btn = $(this);
            data.action = $btn.data('action');
            if (options && options.onButtonClicked) options.onButtonClicked.call(null, data);
        });

        // Remove button.
        $(document).on('click', '.iad-control-remove', function (e)
        {
            e.preventDefault();
            var data = getData($(this));
            var $btn = $(this);
            data.action = $btn.data('action');
            if (options && options.onControlRemoved) options.onControlRemoved.call(null, data);
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