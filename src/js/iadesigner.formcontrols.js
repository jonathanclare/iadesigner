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

        // Add / Remove buttons.
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


    // Form display properties for each widget (scroll position and expanded panel index).
    var oFormProps = {};

    // Do scroll after panel has been opened.
    var doScroll = false;

    // Current widget id.
    var activeWidgetId;

    // Renders the form with the passed in json.
    iad.formcontrols.renderForm = function(jsonForm)
    {
        if (options && options.container) 
        {
            if (jsonForm.forms.length === 1) jsonForm.forms[0].name = undefined;

            // Apply handlebars template for forms.
            $container.parent().css('visibility','hidden');
            $container.empty();
            var template = window.iadesigner[options.template];
            var html = template(jsonForm);
            $container.append(html); 

            // Enable control tooltips.
            $('.iad-tooltip-control').tooltip(
            {
                placement: 'bottom',
                trigger: 'hover'
            });

            $('.iad-popover').popover();

            // Apply auto size to text areas.
            var $textarea = $('.iad-control-textarea');
            $textarea.autosize({append: '\n'});
            $textarea.trigger('autosize.resize');
            $textarea.resize(function(e) {$textarea.trigger('autosize.resize');});

            // Make columns sortable.
            $('.draggableList').sortable(
            {
                handle: '.iad-sort-handle', 
                axis:'y',
                update: function()
                {
                    // New order.
                    var widgetId;
                    var columns = [];
                    $('.iad-sortable', $(this)).each(function(i, elem) 
                    {
                        var $control = $(elem);
                        widgetId = $control.data('control-id');
                        var index = $control.data('control-index');
                        $control.data('control-index', i); // Update the column index.
                        
                        if (widgetId.indexOf('menuBar') !== -1)
                        {
                            var $menuItem = iad.config.getWidgetXml(widgetId).find('#menuItem' + index);
                            var $menuFunc = iad.config.getWidgetXml(widgetId).find('#menuFunc' + index);
                            columns[columns.length] = {menuItem:$menuItem, menuFunc:$menuFunc};
                        }
                        else
                        {
                            var $column = iad.config.getWidgetXml(widgetId).find('Column').eq(index);
                            columns[columns.length] = $column;
                        }
                    });

                    if (widgetId.indexOf('menuBar') !== -1)
                        iad.config.orderMenuItems(widgetId, columns);
                    else
                        iad.config.orderColumns(widgetId, columns);
                }
            });

            // Form display properties for each widget (scroll position and expanded panel index).
            if (oFormProps[activeWidgetId] !== undefined)         
            {
                if (oFormProps[activeWidgetId].panelIndex !== undefined) 
                {
                    doScroll = true;
                    $container.find('.iad-collapse:eq('+oFormProps[activeWidgetId].panelIndex+')').collapse('show');
                }
                else if (oFormProps[activeWidgetId].scrollPos !== undefined) 
                {
                    scrollTo(oFormProps[activeWidgetId].scrollPos);
                    $container.parent().css('visibility','visible');
                    if (propertyWasAdded) scrollToBottom();
                }
            }   
            else 
            {
                if ($container.find('.iad-collapse').length > 1)
                {
                    doScroll = true;
                    oFormProps[activeWidgetId] = {scrollPos:0, panelIndex:0};
                    $container.find('.iad-collapse:eq(0)').collapse('show');
                }        
                else
                {
                    scrollTo(0);
                    $container.parent().css('visibility','visible');
                    if (propertyWasAdded) scrollToBottom();
                }    
            }
        }
    };

    function addHandlers($container)
    {
        // Fix for accordion collapse bug https://github.com/openam/bootstrap-responsive-tabs/issues/45
        $container.on('show.bs.collapse', '.iad-collapse', function (e) 
        {
            $(e.target).closest('.panel').siblings().find('.panel-collapse').collapse('hide');
        });
        $container.on('shown.bs.collapse', '.iad-collapse', function (e)
        {
            // Do scroll after collapse has expanded to scroll to correct position.
            if (doScroll)
            {
                doScroll = false;
                if (oFormProps[activeWidgetId].scrollPos !== undefined) 
                    scrollTo(oFormProps[activeWidgetId].scrollPos);

                $container.parent().css('visibility','visible');
                if (propertyWasAdded) scrollToBottom();
            }
            // Store the index of the expanded panel.
            var panelIndex = $container.find('.iad-collapse').index(this);
            if (oFormProps[activeWidgetId] !== undefined)
                oFormProps[activeWidgetId].panelIndex = panelIndex;
            else
                oFormProps[activeWidgetId] = {scrollPos:0, panelIndex:panelIndex};
        });
        $container.on('hidden.bs.collapse', '.iad-collapse', function (e)
        {
            // Remove the index of the expanded panel.
            if (oFormProps[activeWidgetId] !== undefined)
                oFormProps[activeWidgetId].panelIndex = undefined;
            else
                oFormProps[activeWidgetId] = {scrollPos:0, panelIndex:undefined};
        });
        $container.parent().on('scroll', function (e)
        {
            if (doScroll === false)
            {
                // Store the current scroll position so we can go back to it after the form has refreshed.
                var scrollPos = $(this).scrollTop();
                if (oFormProps[activeWidgetId] !== undefined)
                    oFormProps[activeWidgetId].scrollPos = scrollPos;
                else
                    oFormProps[activeWidgetId] = {scrollPos:scrollPos, panelIndex:undefined};
            }
        });
    }

	return iad;

})(iadesigner || {}, jQuery, window, document);