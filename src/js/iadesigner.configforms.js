var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.configforms = iad.configforms || {};

    // Passed in options.
    var options;

    // Container.
    var $container;

    // Current widget id.
    var activeWidgetId;

    // Lists the config properties to exclude.
    var arrExcludeProperties =
    [
        'minChartValue', 'maxChartValue', 'minChartValueX', 'minChartValueY', 'maxChartValueX', 'maxChartValueY', 'metadataKey',
        'customClassifierKey', 'customColoursKey', 'customBreaksKey', 'customLabelsKey', 'customPaletteKey',
        'customClassifierKey2', 'customColoursKey2', 'customBreaksKey2', 'customLabelsKey2', 'customPaletteKey2',
        'breakData', 'breakFlipData', 'useMouseClick', 'expandedThemeIds',
        'googleGreyscaleText', 'googleOffText', 'includeSearchTool', 'backgroundMappingPath', 'clearButtonText', 'filterButtonText',
        'sd1', 'sd2', 'sd3', 'sd4', 'sd5', 'sd6', 'sdSize',
        'equalInterval', 'quantile', 'natural', 'continuous', 'standardDeviation',
        'legendBreaks', 'legendLabels', 'legendBreaks2', 'legendLabels2', 'mapPalette2',
        'saveImageText', 'emailReportText', 'embedReportText',
        'showLegendTypePanel', 'showLegendTools', 'showPalettePanel', 'showSizePanel',
        'zIndex', 'isExportable', 'notAvailableText', 'allowUserSorting',
        'barData', 'barHeight', 'barColor',
        'minValue', 'midValue', 'maxValue',
        'ignoreThemeIds', 'ignoreIndicatorIds',
        'syncDates',
        'target_','symbol_','break_','line_'
    ];

    // CONFIG PROPERTIES THAT REQUIRES DROPDOWN MENUS.
    // Lists the config properties that require a data dropdown menu.
    var arrRequireDataDropdown =                
    [
        'data', 'data2', 'xData', 'yData', 'sizeData',
        'largestObservationField', 'upperQuartileField', 'medianField', 'lowerQuartileField', 'smallestObservationField',
        'target_data_1', 'target_data_2', 'target_data_3', 'target_data_4', 'barData'
    ];
    // Lists the config properties that require a substitution variable dropdown menu. 
    var arrRequireSubVarDropdown =              
    [
        'title', 'xAxisTitle', 'yAxisTitle', 'text'
    ];
    // Lists the config properties that require a tootltip dropdown menu. 
    var arrRequireTipDropdown =           
    [
        'tip', 'tip2'
    ];
    // Lists the config properties that require a data properties dropdown menu.
    var arrRequirePropertiesDropdown =             
    [
        'minChartValue', 'maxChartValue', 'minChartValueX', 'minChartValueY', 'maxChartValueX', 'maxChartValueY', 'metadataKey',
        'customClassifierKey', 'customColoursKey', 'customBreaksKey', 'customLabelsKey', 'customPaletteKey',
        'customClassifierKey2', 'customColoursKey2', 'customBreaksKey2', 'customLabelsKey2', 'customPaletteKey2',
        'breakData', 'breakFlipData'
    ];
    // Lists the config properties that require a javascript functions dropdown menu.
    var arrRequireJavaScriptDropdown =           
    [
        'menuFunc1', 'menuFunc2', 'menuFunc3', 'menuFunc4', 'menuFunc5', 'menuFunc6', 'menuFunc7'
    ];

    // OPTIONS FOR DROPDOWN LISTS.
    // Lists the available data properties.
    var arrPropertyOptions = [];   
    // Lists the available data associates.
    var arrAssociateOptions = [];  
    // Lists the available javascript functions.
    var arrJavaScriptOptions = []; 
    // Lists the available substitution variables for tooltips for data source 1.
    var arrTooltipOptions =            
    [
        { 'header': 'Substitution variables' },
        { 'label': 'Feature name', 'value': '${featureName}' },
        { 'label': 'Indicator value', 'value': '${indicatorValue}' }
    ];
     // Lists the available substitution variables for tooltips for data source 2.
    var arrTooltipOptions2 =          
    [
        { 'header': 'Substitution variables' },
        { 'label': 'Feature name', 'value': '${featureName2}' },
        { 'label': 'Indicator value', 'value': '${indicatorValue2}' }
    ];
    // Lists the available substitution variables for data source 1.
    var arrSubVarOptions =    
    [
        { 'header': 'Substitution variables' },
        { 'divider': 'true', 'header': 'Updated when the data changes' },
        { 'label': 'Geography name', 'value': '${geogName}' },
        { 'label': 'Theme name', 'value': '${themeName}' },
        { 'label': 'Indicator name', 'value': '${indicatorName}' },
        { 'label': 'Date', 'value': '${date}' },
        { 'divider': 'true', 'header': 'Updated when the legend type changes' },
        { 'label': 'Legend type', 'value': '${legendType}' },
        { 'divider': 'true', 'header': 'Updated when the selected feature changes' },
        { 'label': 'Selected feature', 'value': '${selectedFeature}' },
        { 'divider': 'true', 'header': 'Stats - updated when the data changes' },
        { 'label': 'Mean', 'value': '${mean}' },
        { 'label': 'Median', 'value': '${median}' },
        { 'label': 'Sum', 'value': '${sum}' },
        { 'label': 'Min value', 'value': '${minValue}' },
        { 'label': 'Max value', 'value': '${maxValue}' },
        { 'label': 'Range', 'value': '${range}' },
        { 'label': 'Lower quartile', 'value': '${lowerQuartile}' },
        { 'label': 'Upper quartile', 'value': '${upperQuartile}' },
        { 'label': 'Interquartile range', 'value': '${interquartileRange}' },
        { 'label': 'Variance', 'value': '${variance}' },
        { 'label': 'Standard deviation', 'value': '${standardDeviation}' }
    ];
    // Lists the available substitution variables for data source 2.
    var arrSubVarOptions2 =   
    [
        { 'header': 'Substitution variables' },
        { 'divider': 'true', 'header': 'Updated when the data changes' },
        { 'label': 'Geography name', 'value': '${geogName2}' },
        { 'label': 'Theme name', 'value': '${themeName2}' },
        { 'label': 'Indicator name', 'value': '${indicatorName2}' },
        { 'label': 'Date', 'value': '${date2}' },
        { 'divider': 'true', 'header': 'Updated when the legend type changes' },
        { 'label': 'Legend type', 'value': '${legendType2}' },
        { 'divider': 'true', 'header': 'Updated when the selected feature changes' },
        { 'label': 'Selected feature', 'value': '${selectedFeature2}' },
        { 'divider': 'true', 'header': 'Stats - updated when the data changes' },
        { 'label': 'Mean', 'value': '${mean2}' },
        { 'label': 'Median', 'value': '${median2}' },
        { 'label': 'Sum', 'value': '${sum2}' },
        { 'label': 'Min value', 'value': '${minValue2}' },
        { 'label': 'Max value', 'value': '${maxValue2}' },
        { 'label': 'Range', 'value': '${range2}' },
        { 'label': 'Lower quartile', 'value': '${lowerQuartile2}' },
        { 'label': 'Upper quartile', 'value': '${upperQuartile2}' },
        { 'label': 'Interquartile range', 'value': '${interquartileRange2}' },
        { 'label': 'Variance', 'value': '${variance2}' },
        { 'label': 'Standard deviation', 'value': '${standardDeviation2}' }
    ];

    // Lists the config properties that should use a text area for long text.
    var arrUseTextArea =             
    [
        'title', 'tip', 'tip2', 'xAxisTitle', 'yAxisTitle', 'text'
    ];

    // Update data options.
    iad.configforms.updateDataLists = function ()
    {
        updateAssociateOptions();
        updatePropertyOptions();
    };

    // Update javascript options.
    iad.configforms.updateJavaScriptOptions = function ()
    {
        arrJavaScriptOptions =
        [
            {'label': 'Print Preview', 'value': 'javascript:iaOpenPrintPreview()'},
            {'label': 'Toggle Share', 'value': 'javascript:iaToggleShare()'},
            {'label': 'Toggle Legend Editor', 'value': 'javascript:iaToggleLegendEditor()'}
        ];
        var $xmlWidgets = iad.report.getComponents();
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var id = $xmlWidget.attr('id');
            var name = $xmlWidget.attr('name');
            var vis = $xmlWidget.attr('visible');
            if (vis == 'true') arrJavaScriptOptions[arrJavaScriptOptions.length] = { 'label': 'Toggle ' + name, 'value': 'javascript:iaToggle(' + id + ')' };
        });
    };

    // Update the associate options.
    function updateAssociateOptions()
    {
        var arr = [];
        var arrAssociateOptions = [];

        var geos = options.report.data.getGeographies();
        for (var g = 0; g < geos.length; g++)
        {
            var themes = geos[g].getThemes();
            for (var i = 0; i < themes.length; i++)
            {
                var indicators = themes[i].getIndicators();
                for (var j = 0; j < indicators.length; j++)
                {
                    var associates = indicators[j].getAssociates();
                    for (var k = 0; k < associates.length; k++)
                    {
                        var ass = associates[k];
                        if (arr.indexOf(ass.id) == -1)
                        {
                            arr[arr.length] = ass.id;
                            arrAssociateOptions[arrAssociateOptions.length] = { 'label': ass.id, 'value': ass.id };
                        }
                    }
                }
            }
        }
    }

    // Update the property options.
    function updatePropertyOptions()
    {
        var arr = [];
        var arrPropertyOptions = [];

        var geos = options.report.data.getGeographies();
        for (var g = 0; g < geos.length; g++)
        {
            var themes = geos[g].getThemes();
            for (var i = 0; i < themes.length; i++)
            {
                var indicators = themes[i].getIndicators();
                for (var j = 0; j < indicators.length; j++)
                {
                    var properties = indicators[j].getProperties();
                    for (var propName in properties)
                    {
                        if (arr.indexOf(propName) == -1 && propName != 'undefined')
                        {
                            arr[arr.length] = propName;
                            arrPropertyOptions[arrPropertyOptions.length] = { 'label': propName, 'value': propName };
                        }
                    }
                }
            }
        }
    }

    // Initialise.
    iad.configforms.init = function(o)
    {
        options = o; 

        // Get the container element.
        if (options && options.container) $container = $(options.container);
    };

    // Refreshes the current form.
    iad.configforms.refreshForm = function()
    {
        if (activeWidgetId !== undefined)
        	iad.configforms.showWidgetForm(activeWidgetId);
        else                                	
        	iad.configforms.showPropertyGroupForm();
    };

    // Displays the form for the property groups.
    iad.configforms.showPropertyGroupForm = function()
    {
        activeWidgetId = undefined;

        //$('#iad-general-properties-apply-btn').removeClass('btn-primary').addClass('btn-default');

        var json = {'id': 'generalproperties','forms': []};

        var $xmlPropGroups = iad.report.getGroupProperties();
        $.each($xmlPropGroups, function(i, xmlPropGroup)
        {
            var $xmlPropGroup = $(xmlPropGroup);

            // These ones go in the legend tab.
            var id = $xmlPropGroup.attr('id');
            if (id !== 'thematics' && id !== 'pointSymbols' && id !== 'lineSymbols' && id !== 'thematics2' && id !== 'pointSymbols2' && id !== 'lineSymbols2')
            {
                var jsonForm = iad.configforms.getPropertyGroupForm($xmlPropGroup);
                if (jsonForm.controls.length > 0) json.forms[json.forms.length] = jsonForm;
            }
        });

        //$('#iad-send-to-back-btn').hide();
        //$('#iad-bring-to-front-btn').hide();

        updateForm(json);
    };

    // Displays the form for the given widget.
    iad.configforms.showWidgetForm = function(widgetId)
    {
        activeWidgetId = widgetId;

        //$('#iad-send-to-back-btn').show();
        //$('#iad-bring-to-front-btn').show();

        var $xmlWidget = iad.report.getWidgetXml(widgetId);
        var tagName = $xmlWidget.prop('tagName');

        var json = {'id': 'widget','forms': []};

        if (tagName === 'Component')
        {
            if (widgetId === 'menuBar')
                json.forms[json.forms.length] = getMenuBarForm($xmlWidget);
            else 
                json.forms[json.forms.length] = getComponentForm($xmlWidget);

            if (widgetId === 'pyramidChart') json.forms[json.forms.length] = getPyramidLineForm($xmlWidget);
            if (widgetId === 'legend' || widgetId === 'legend2') 
            {
                //json.forms = json.forms.concat(db.legendform.getForm(widgetId, json.forms[0]));
            }     
        }
        else if (tagName === 'Table')
        {
            if (widgetId === 'spineChart')
            {
                json.forms[json.forms.length] = getComponentForm($xmlWidget);
                json.forms[json.forms.length] = getColumnForm($xmlWidget);
                json.forms[json.forms.length] = getTargetForm($xmlWidget);

                if ($xmlWidget.find('Property#breakFlipData').attr('value') !== undefined)
                {
                    json.forms[json.forms.length] = getBreaksForm($xmlWidget);
                }

                json.forms[json.forms.length] = getSymbolForm($xmlWidget);
            }
            else
            {
                json.forms[json.forms.length] = getComponentForm($xmlWidget);
                json.forms[json.forms.length] = getColumnForm($xmlWidget);
            }
        }
        else if (tagName === 'Button')   json.forms[json.forms.length] = getButtonForm($xmlWidget);
        else if (tagName === 'Image')    json.forms[json.forms.length] = getImageForm($xmlWidget);
        else if (tagName === 'Text')     json.forms[json.forms.length] = getTextForm($xmlWidget);

        updateForm(json);
    };

    // Updates a form with the passed in json.
    var scrollPos = 0;
    function updateForm(jsonForm)
    {
        if (jsonForm.forms.length === 1) jsonForm.forms[0].name = undefined;

        // Store the current scroll position so we can go back to it after the form has refreshed
        scrollPos = $('.iad-form').scrollTop();

        // Apply handlebars template for forms.
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
            update: function()
            {
                // New order.
                var columns = [];
                var widgetId;

                $('.iad-sortable', $(this)).each(function(index, elem) 
                {
                    var controlId = $(elem).attr('id');
                    var arr = controlId.split('~');

                    var tagName = arr[0];
                    widgetId = arr[1];
                    var colIndex = arr[2];

                    var $column = iad.report.getWidgetXml(widgetId).find('Column').eq(colIndex);
                    columns[columns.length] = $column;
                });

                iad.report.orderColumns(widgetId, columns);
            }
        });
        //$('.draggableList').disableSelection();

        // Scroll to original position
        $('.iad-form').scrollTop(scrollPos);
    }

    // Returns a property group form.
    iad.configforms.getPropertyGroupForm = function($xmlPropGroup)
    {
        var form = 
        {
            'id'        : $xmlPropGroup.attr('id'),
            'name'      : $xmlPropGroup.attr('name'),
            'controls'  : []
        };

        var $xmlProperties = $xmlPropGroup.find('Property');
        var controlPrefix = 'PropertyGroup~' + $xmlPropGroup.attr('id');
        getPropertyForm(form, controlPrefix, $xmlProperties);

        for (var i = 0; i < form.controls.length; i++)
        {
            var control = form.controls[i];
            control.PropertyGroup = true;
        }

        return form;
    };

    // Returns a component form.
    function getComponentForm($xmlComponent)
    {
        var id = $xmlComponent.attr('id');
        var name = $xmlComponent.attr('name');
        var $desc = $xmlComponent.find('Description');

        // Adjust the name if its a component not using the first data source.
        var adjustedName = iad.report.getDisplayName(id);

        var form = 
        {
            'id'            : id,
            'name'          : adjustedName,
            'description'   : ($desc && ($desc.length > 0) ? $desc.text() : ''),
            'title'         : ($desc && ($desc.length > 0) ? adjustedName : ''),
            'controls'      : []
        };

        var $xmlProperties = $xmlComponent.find('Property');
        var controlPrefix = 'Component~' + $xmlComponent.attr('id');
        getPropertyForm(form, controlPrefix, $xmlProperties);

        return form;
    }

    // Returns a property form - used by getComponentForm() and getPropertyGroupForm() for their properties.
    function getPropertyForm(form, controlPrefix, $xmlProperties)
    {   
    	var componentIndex;

        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);
            var id = $xmlProperty.attr('id');
            if (arrExcludeProperties.indexOf(id) === -1)
            {
                var control = 
                {
                    'id'            : controlPrefix + '~' + id,
                    'type'          : $xmlProperty.attr('type'),
                    'name'          : $xmlProperty.attr('name'),
                    'value'         : $xmlProperty.attr('value'),
                    'description'   : $xmlProperty.attr('description')
                };
                if ($xmlProperty.attr('choices'))
                {
                    control.choices = [];
                    control.type = 'select';

                    var arr = $xmlProperty.attr('choices').split(';');
                    for (var j = 0; j < arr.length; j++)
                    {
                        var value = arr[j];
                        control.choices[control.choices.length] = 
                        {
                            'label' : value,
                            'value' : value
                        };
                    }
                }
                else if (arrRequireDataDropdown.indexOf(id) !== -1)
                {
                    control.type = 'select';
                    control.choices = [
                    {
                        'label' : 'Indicator value',
                        'value' : 'value'
                    }];
                    if (arrAssociateOptions.length > 0) control.choices = control.choices.concat(arrAssociateOptions);
                }
                else if (arrRequirePropertiesDropdown.indexOf(id) !== -1)
                {
                    control.choices = arrPropertyOptions.concat();
                    control.type = 'select';
                }
                else if (arrRequireSubVarDropdown.indexOf(id) !== -1)
                {
                    componentIndex = controlPrefix.slice(-1);
                    if (componentIndex === '2')      	control.choices = arrSubVarOptions2.concat();
                    else                            	control.choices = arrSubVarOptions.concat();
                    control.type = 'text-dropdown-append';
                }
                else if (arrRequireTipDropdown.indexOf(id) !== -1)
                {  
                    componentIndex = controlPrefix.slice(-1);
                    if (id === 'tip2')               	control.choices = arrTooltipOptions2.concat();
                    else if (componentIndex === '2') 	control.choices = arrTooltipOptions2.concat();
                    else                            	control.choices = arrTooltipOptions.concat();
                    control.type = 'text-dropdown-append';
                }
                else if (arrRequireJavaScriptDropdown.indexOf(id) !== -1)
                {
                    control.choices = arrJavaScriptOptions.concat();
                    control.type = 'text-dropdown-replace';
                }
                else if (id === 'sortColumnName')
                {
                    control.type = 'select';
                    control.choices = [];

                    var $columns = iad.report.getColumns(activeWidgetId);
                    $.each($columns, function(i, xmlColumn)
                    {
                        var alias = options.report.textSubstitution.formatMessage($(xmlColumn).attr('alias'));
                        var name = $(xmlColumn).attr('name');
                        control.choices.push(
                        {
                            'label' : alias,
                            'value' : name
                        });
                    });
                }
                else if (id === 'colorSchemeId')
                {
                    control.type = 'select';
                    control.choices = [];

                    var colorSchemeIds = iad.report.getColourSchemeIds();
                    for (var k = 0; k < colorSchemeIds.length; k++)
                    {
                        var colorSchemeId = colorSchemeIds[k];
                        control.choices.push(
                        {
                            'label' : colorSchemeId,
                            'value' : colorSchemeId
                        });
                    }
                }

                // Special cases.
                if (arrUseTextArea.indexOf(id) !== -1)
                {
                    control.type = 'textarea-dropdown-append';
                }
                if (id === 'snippet') control.type = 'textarea-large';
                if (id === 'ndecimal' || id === 'legendPrecision') control.type = 'integer-select';
                form.controls[form.controls.length] = control;
            }
        });
    }

    // Returns a menu bar form.
    function getMenuBarForm($xmlComponent)
    {
        var widgetId = $xmlComponent.attr('id');
        var controlId = 'Component~' + widgetId + '~';

        var form = 
        {
            'id'        : widgetId,
            'name'      : $xmlComponent.attr('name'),
            'controls'  : []
        };

        // Menu addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : controlId,
            'type'  : 'menu-bar-add'
        };

        var $xmlProperties = $xmlComponent.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);

            var testId = 'menuItem';
            var id = $xmlProperty.attr('id');

            if (id.indexOf(testId) !== -1)
            {
                var index = id.substring(8, id.length);

                var $menuItem = $xmlComponent.find('Property#' + 'menuItem' + index);
                var $menuFunc = $xmlComponent.find('Property#' + 'menuFunc' + index);

                form.controls[form.controls.length] = 
                {
                    'id'                : controlId + index,
                    'type'              : 'menu-bar',
                    'label-id'          : controlId + $menuItem.attr('id'),
                    'label-value'       : $menuItem.attr('value'),
                    'label-description' : $menuItem.attr('description'),
                    'func-id'           : controlId + $menuFunc.attr('id'),
                    'func-value'        : $menuFunc.attr('value'),
                    'func-choices'      : arrJavaScriptOptions,
                    'func-description'  : $menuFunc.attr('description')
                };
            }
        });

        return form;
    }

    // Returns a symbol form.
    function getSymbolForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');
        var controlId = 'Table~' + widgetId + '~';

        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Symbols',
            'controls'  : []
        };

        form.controls[form.controls.length] = 
        {
            'type' : 'label',
            'name' : 'Use this section to link symbols to values in the data. The symbol replaces the data value in the column.'
        };

        // Symbol addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : controlId,
            'type'  : 'symbol-add'
        };

        var $xmlProperties = $xmlTable.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);

            var testId = 'symbol_color_';
            var id = $xmlProperty.attr('id');

            if (id.indexOf(testId) !== -1)
            {
                var index = id.substring(id.lastIndexOf("_") + 1, id.length);

                var $shape  = $xmlTable.find('Property#' + 'symbol_shape_' + index);
                var $color  = $xmlTable.find('Property#' + 'symbol_color_' + index);
                var $size   = $xmlTable.find('Property#' + 'symbol_size_' + index);
                var $label  = $xmlTable.find('Property#' + 'symbol_label_' + index);
                var $value  = $xmlTable.find('Property#' + 'symbol_value_' + index);

                var shapeChoices = [];
                var arr = $shape.attr('choices').split(';');
                for (var j = 0; j < arr.length; j++)
                {
                    var value = arr[j];
                    shapeChoices[shapeChoices.length] = 
                    {
                        'label' : value,
                        'value' : value
                    };
                }

                form.controls[form.controls.length] = 
                {
                    'id'            : controlId + index,
                    'type'          : 'profile-symbol',
                    'shape-id'      : controlId + $shape.attr('id'),
                    'shape-value'   : $shape.attr('value'),
                    'shape-choices' : shapeChoices,
                    'color-id'      : controlId + $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'size-id'       : controlId + $size.attr('id'),
                    'size-value'    : $size.attr('value'),
                    'label-id'      : controlId + $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'data-id'       : controlId + $value.attr('id'),
                    'data-value'    : $value.attr('value'),
                };
            }
        });

        return form;
    }

    // Returns a breaks form.
    function getBreaksForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');
        var controlId = 'Table~' + widgetId + '~';

        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Chart Column Breaks',
            'controls'  : []
        };

        form.controls[form.controls.length] = 
        {
            'type'  : 'open-data-properties-form',
            'label' : 'Add Custom Indicator Breaks'
        };

        // Break addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : controlId,
            'type'  : 'break-add'
        };

        var $xmlProperties = $xmlTable.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);

            var testId = 'break_color_';
            var id = $xmlProperty.attr('id');

            if (id.indexOf(testId) !== -1)
            {
                var index = id.substring(id.lastIndexOf("_") + 1, id.length);

                var $color = $xmlTable.find('Property#' + 'break_color_' + index);
                var $label = $xmlTable.find('Property#' + 'break_label_' + index);

                form.controls[form.controls.length] = 
                {
                    'id'            : controlId + index,
                    'type'          : 'profile-break',
                    'color-id'      : controlId + $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'label-id'      : controlId + $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                };
            }
        });

        return form;
    }

    // Returns a target form.
    function getTargetForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');
        var controlId = 'Table~' + widgetId + '~';

        var dataChoices = [
        {
            'label' : '',
            'value' : ''
        },
        {
            'label' : 'Indicator value',
            'value' : 'value'
        }];
        if (arrAssociateOptions.length > 0) dataChoices = dataChoices.concat(arrAssociateOptions);
        
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Chart Column Targets',
            'controls'  : []
        };

        // Target addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : controlId,
            'type'  : 'target-add'
        };

        var $xmlProperties = $xmlTable.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);

            var testId = 'target_shape_';
            var id = $xmlProperty.attr('id');
            if (id.indexOf(testId) !== -1)
            {
                var index = id.substring(id.lastIndexOf("_") + 1, id.length);

                var $shape  = $xmlTable.find('Property#' + 'target_shape_' + index);
                var $color  = $xmlTable.find('Property#' + 'target_color_' + index);
                var $size   = $xmlTable.find('Property#' + 'target_size_' + index);
                var $label  = $xmlTable.find('Property#' + 'target_label_' + index);
                var $data   = $xmlTable.find('Property#' + 'target_data_' + index);

                var shapeChoices = [];
                var arr = $shape.attr('choices').split(';');
                for (var j = 0; j < arr.length; j++)
                {
                    var value = arr[j];
                    shapeChoices[shapeChoices.length] = 
                    {
                        'label' : value,
                        'value' : value
                    };
                }

                form.controls[form.controls.length] = 
                {
                    'id'            : controlId + index,
                    'type'          : 'profile-target',
                    'shape-id'      : controlId + $shape.attr('id'),
                    'shape-value'   : $shape.attr('value'),
                    'shape-choices' : shapeChoices,
                    'color-id'      : controlId + $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'size-id'       : controlId + $size.attr('id'),
                    'size-value'    : $size.attr('value'),
                    'label-id'      : controlId + $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'data-id'       : controlId + $data.attr('id'),
                    'data-value'    : $data.attr('value'),
                    'data-choices'  : dataChoices
                };
            }
        });

        return form;
    }

    // Returns a column form for table or spine chart.
    function getColumnForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');
        var controlId = 'Column~' + widgetId + '~';

        var columnDataChoices;
        if (widgetId.indexOf('table') !== -1) // Table.
        {
            columnDataChoices = [
            {
                'label' : 'Feature name',
                'value' : 'name'
            },
            {
                'label' : 'Indicator value',
                'value' : 'value'
            }];
        }
        else // Spine Chart.
        {
            columnDataChoices = [
            {
                'label' : '',
                'value' : ''
            },
            {
                'label' : 'Feature name',
                'value' : 'name'
            },
            {
                'label' : 'Indicator name',
                'value' : 'indicatorName'
            },
            {
                'label' : 'Indicator value',
                'value' : 'value'
            }];
        }
        if (arrAssociateOptions.length > 0) columnDataChoices = columnDataChoices.concat(arrAssociateOptions);

        var symbolDataChoices = [
        {
            'label' : '',
            'value' : ''
        },
        {
            'label' : 'Indicator value',
            'value' : 'value'
        }];
        if (arrAssociateOptions.length > 0) symbolDataChoices = symbolDataChoices.concat(arrAssociateOptions);

        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Columns',
            'controls'  : []
        };

        // Column addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : 'Column~' + widgetId,
            'type'  : 'column-add',
        };

        var $xmlColumns = $xmlTable.find('Column');
        $.each($xmlColumns, function(i, xmlColumn)
        {
            var $xmlColumn = $(xmlColumn);
            var columnIndex = i + 1;

            var alias   = $xmlColumn.attr('alias');
            var name    = $xmlColumn.attr('name');
            var width   = $xmlColumn.attr('width');

            // Column controls.
            if (widgetId === 'spineChart')
            {
                var symbolValue = '';
                var nationalValue, $color, $min, $mid, $max, type;

                if (name.indexOf('symbol(') !== -1 || name.indexOf('health(') !== -1)
                {
                    if (name.indexOf('health(') !== -1) type = 'chart-column';
                    else type = 'symbol-column';

                    // symbol(symbolValue:state,textValue:value,symbolAlign:right)
                    // symbol(symbolValue:trend,symbolAlign:center)
                    // health(symbolValue:significance,areaValue:value,nationalValue:national)

                    var propsString = name.substring(name.indexOf("(") + 1, name.indexOf(")"));
                    var propsArray = propsString.split(",");
                    var o = {'symbolAlign': 'right'};

                    for (var j = 0; j < propsArray.length; j++)
                    {
                        var prop = propsArray[j].split(":");
                        var propName = prop[0];
                        var propValue = prop[1];
                        o[propName] = propValue;
                    }

                    if (o.textValue !== undefined) name = o.textValue; // symbol.
                    else name = '';

                    if (o.areaValue !== undefined) name = o.areaValue; // health.
                    if (o.nationalValue !== undefined) nationalValue = o.nationalValue;

                    symbolValue = o.symbolValue;
                }
                else if (name === 'performance' || name === 'profile') type = 'chart-column';
                else type = 'symbol-column';

                var control = 
                {
                    'id'            : controlId + i,
                    'type'          : type,
                    'alias-id'      : controlId + i + '~alias',
                    'alias-value'   : alias,
                    'alias-choices' : arrSubVarOptions,
                    'data-id'       : controlId + i + '~name',
                    'data-value'    : name,
                    'data-choices'  : columnDataChoices,
                    'width-id'      : controlId + i + '~width',
                    'width-value'   : width,
                    'symbol-id'     : controlId + i + '~symbol',
                    'symbol-value'  : symbolValue,
                    'symbol-choices': symbolDataChoices
                };

                if (nationalValue !== undefined)
                {
                    $.extend(control, 
                    {
                        'national-id'       : controlId + i + '~national',
                        'national-value'    : nationalValue,
                        'national-choices'  : symbolDataChoices,
                        'data-choices'      : symbolDataChoices
                    });
                }

                // Health labels.
                if (type === 'chart-column' && $xmlTable.find('Property#midValue').attr('value') !== undefined)
                {
                    $min = $xmlTable.find('Property#minValue');
                    $mid = $xmlTable.find('Property#midValue');
                    $max = $xmlTable.find('Property#maxValue');

                    $.extend(control, 
                    {
                        'health-min-id'             : controlId + $min.attr('id'),
                        'health-min-value'          : $min.attr('value'),
                        'health-min-description'    : $min.attr('description'),
                        'health-mid-id'             : controlId + $mid.attr('id'),
                        'health-mid-value'          : $mid.attr('value'),
                        'health-mid-description'    : $mid.attr('description'),
                        'health-max-id'             : controlId + $max.attr('id'),
                        'health-max-value'          : $max.attr('value'),
                        'health-max-description'    : $max.attr('description')
                    });

                    // This was a later addition so may not be in older config files.
                    if ($xmlTable.find('Property#barColor').attr('value') !== undefined)
                    {
                        $color  = $xmlTable.find('Property#barColor');
                        $.extend(control, 
                        {
                            'health-symbol-color-id'        : controlId + $color.attr('id'),
                            'health-symbol-color-value'     : $color.attr('value')
                        });
                    }
                }
                // Profile labels.
                else if (type === 'chart-column' && $xmlTable.find('Property#minValue').attr('value') !== undefined)
                {
                    $min = $xmlTable.find('Property#minValue');
                    $max = $xmlTable.find('Property#maxValue');

                    $.extend(control, 
                    {
                        'profile-min-id'            : controlId + $min.attr('id'),
                        'profile-min-value'         : $min.attr('value'),
                        'profile-min-description'   : $min.attr('description'),
                        'profile-max-id'            : controlId + $max.attr('id'),
                        'profile-max-value'         : $max.attr('value'),
                        'profile-max-description'   : $max.attr('description')
                    });
                }
                // Profile bar
                if (type === 'chart-column' && $xmlTable.find('Property#barHeight').attr('value') !== undefined)
                {
                    $color  = $xmlTable.find('Property#barColor');
                    var $height = $xmlTable.find('Property#barHeight');
                    var $data   = $xmlTable.find('Property#barData');

                    $.extend(control, 
                    {
                        'profile-color-id'      : controlId + $color.attr('id'),
                        'profile-color-value'   : $color.attr('value'),
                        'profile-height-id'     : controlId + $height.attr('id'),
                        'profile-height-value'  : $height.attr('value'),
                        'profile-data-id'       : controlId + $data.attr('id'),
                        'profile-data-value'    : $data.attr('value'),
                        'profile-data-choices'  : symbolDataChoices
                    });
                }
            
                form.controls[form.controls.length] = control;
            }
            else
            {
                form.controls[form.controls.length] = 
                {
                    'id'            : controlId + i,
                    'type'          : 'column',
                    'alias-id'      : controlId + i + '~alias',
                    'alias-value'   : alias,
                    'alias-choices' : arrSubVarOptions,
                    'data-id'       : controlId + i + '~name',
                    'data-value'    : name,
                    'data-choices'  : columnDataChoices,
                    'width-id'      : controlId + i + '~width',
                    'width-value'   : width
                };
            }
        });

        return form;
    }

    // Returns a button form.
    function getButtonForm($xmlButton)
    {
        var widgetId = $xmlButton.attr('id');
        var controlId = 'Button~' + widgetId + '~';
        var form = 
        {
            'id': widgetId,
            'name': 'Button',
            'controls': [
            {
                'id'        : controlId + 'text',
                'type'      : 'string',
                'name'      : 'Text',
                'value'     : $xmlButton.attr('text')
            },
            {
                'id'        : controlId + 'href',
                'type'      : 'text-dropdown-replace',
                'name'      : 'Hyperlink',
                'value'     : $xmlButton.attr('href'),
                'choices'   : arrJavaScriptOptions
            },
            {
                'id'        : controlId + 'tooltip',
                'type'      : 'string',
                'name'      : 'Tooltip',
                'value'     : $xmlButton.attr('tooltip')
            }]
        };
        return form;
    }

    // Returns an image form.
    function getImageForm($xmlImage)
    {
        var widgetId = $xmlImage.attr('id');
        var controlId = 'Image~' + widgetId + '~';
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Image',
            'controls'  : 
            [
                {
                    'id'    : controlId + 'src',
                    'type'  : 'string',
                    'name'  : 'Source',
                    'value' : $xmlImage.attr('src')
                },
                {
                    'id'    : controlId + 'href',
                    'type'  : 'string',
                    'name'  : 'Hyperlink',
                    'value' : $xmlImage.attr('href')
                },
                /*{
                    'id'        : controlId + 'target', 
                    'type'      : 'select', 
                    'name'      : 'Target', 
                    'value'     : $xmlImage.attr('target'),
                    'choices'   : [{'label':'_blank', 'value':'_blank'},{'label':'_self', 'value':'_self'},{'label':'_parent', 'value':'_parent'},{'label':'_top', 'value':'_top'}]
                },*/
                {
                    'id'    : controlId + 'rescale',
                    'type'  : 'boolean',
                    'name'  : 'Rescale?',
                    'value' : $xmlImage.attr('rescale'),
                    'description' : 'Should the image resize with the report, or should it stay a fixed size?'
                },
                {
                    'id'    : controlId + 'maintain-aspect-ratio',
                    'type'  : 'boolean',
                    'name'  : 'Maintain Aspect Ratio?',
                    'value' : $xmlImage.attr('maintain-aspect-ratio'),
                    'description' : 'Should the image maintain its aspect ratio?'
                },
                {
                    'id'    : controlId + 'anchor',
                    'type'  : 'select',
                    'name'  : 'Anchor',
                    'value' : $xmlImage.attr('anchor'),
                    'description' : 'Anchor',
                    'choices'   : [{'label':'left', 'value':'left'},{'label':'center', 'value':'center'},{'label':'right', 'value':'right'}]
                }
            ]
        };
        return form;
    }

    // Returns a text form.
    function getTextForm($xmlText)
    {
        var widgetId = $xmlText.attr('id');
        var controlId = 'Text~' + widgetId + '~';
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Text',
            'controls'  : 
            [
                {
                    'id'        : controlId + 'nodevalue',
                    'type'      : 'textarea-dropdown-append',
                    'name'      : 'Text',
                    'value'     : $xmlText.text(),
                    'choices'   : arrSubVarOptions
                },
                {
                    'id'        : controlId + 'href',
                    'type'      : 'string',
                    'name'      : 'Hyperlink',
                    'value'     : $xmlText.attr('href')
                },
                {
                    'id'        : controlId + 'fill',
                    'type'      : 'colour',
                    'name'      : 'Font Color',
                    'value'     : $xmlText.attr('fill')
                },
                {
                    'id'        : controlId + 'font-family',
                    'type'      : 'select',
                    'name'      : 'Font Family',
                    'value'     : $xmlText.attr('font-family'),
                    'choices'   :  
                    [
                        { 'label': 'Arial', 'value': 'Arial, Helvetica, sans-serif' },
                        { 'label': 'Helvetica', 'value': 'Helvetica, sans-serif' },
                        { 'label': 'sans-serif', 'value': 'sans-serif' },
                        { 'label': 'Verdana', 'value': 'Verdana, Geneva, sans-serif' },
                        { 'label': 'Calibri', 'value': 'Calibri' },
                        { 'label': 'Tahoma', 'value': 'Tahoma, Geneva, sans-serif' },
                        { 'label': 'Trebuchet MS', 'value': '"Trebuchet MS", Helvetica, sans-serif' },
                        { 'label': 'Lucida Sans Unicode', 'value': '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
                        { 'label': 'Droid Sans', 'value': '"Droid Sans", Helvetica, sans-serif' },
                        { 'label': 'Lato', 'value': 'Lato, Helvetica, sans-serif' },
                        { 'label': 'Open Sans', 'value': '"Open Sans", Helvetica, sans-serif' },
                        { 'label': 'Oswald', 'value': 'Oswald, Helvetica, sans-serif' },
                        { 'label': 'PT Sans', 'value': '"PT Sans", Helvetica, sans-serif' },
                        { 'label': 'Roboto', 'value': 'Roboto, Helvetica, sans-serif' },
                        { 'label': 'Georgia', 'value': 'Georgia, serif' },
                        { 'label': 'Times New Roman', 'value': '"Times New Roman", Times, serif' },
                        { 'label': 'Bitter', 'value': 'Bitter, Helvetica, sans-serif' },
                        { 'label': 'Droid Serif', 'value': '"Droid Serif", Helvetica, sans-serif' },
                        { 'label': 'Roboto Slab', 'value': '"Roboto Slab", Helvetica, sans-serif' }
                    ]
                },
                {
                    'id'        : controlId + 'font-size',
                    'type'      : 'integer',
                    'name'      : 'Font Size',
                    'value'     : $xmlText.attr('font-size')
                },
                {
                    'id'        : controlId + 'font-style',
                    'type'      : 'select',
                    'name'      : 'Font Style',
                    'value'     : $xmlText.attr('font-style'),
                    'choices'   : 
                    [
                        {
                            'label' : 'normal',
                            'value' : 'normal'
                        },
                        {
                            'label' : 'italic',
                            'value' : 'italic'
                        }
                    ]
                },
                {
                    'id'        : controlId + 'font-weight',
                    'type'      : 'select',
                    'name'      : 'Font Weight',
                    'value'     : $xmlText.attr('font-weight'),
                    'choices'   :
                    [
                        {
                            'label' : 'normal',
                            'value' : 'normal'
                        },
                        {
                            'label' : 'bold',
                            'value' : 'bold'
                        }
                    ]
                }
                /*{
                    'id'        : 'controlId + 'href', 
                    'type'      : 'select', 
                    'name'      : 'Target', 
                    'value'     : $xmlText.attr('target'),
                    'choices'   : [{'label':'_blank', 'value':'_blank'},{'label':'_self', 'value':'_self'},{'label':'_parent', 'value':'_parent'},{'label':'_top', 'value':'_top'}]
                },*/
            ]
        };
        return form;
    }

    // Returns a pyramid line form.
    function getPyramidLineForm($xmlComponent)
    {
        var widgetId = $xmlComponent.attr('id');
        var controlId = 'Component~' + widgetId + '~';

        var dataChoices = [
        {
            'label' : '',
            'value' : ''
        },
        {
            'label' : 'Indicator value',
            'value' : 'value'
        }];
        if (arrAssociateOptions.length > 0) dataChoices = dataChoices.concat(arrAssociateOptions);

        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Additional Data Lines',
            'controls'  : []
        };

        form.controls[form.controls.length] = 
        {
            'type' : 'label',
            'name' : 'Use this section to add data lines to the pyramid chart.'
        };

        // Symbol addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : controlId,
            'type'  : 'pyramid-line-add'
        };

        var $xmlProperties = $xmlComponent.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);

            var testId = 'line_color_';
            var id = $xmlProperty.attr('id');

            if (id.indexOf(testId) !== -1)
            {
                var index = id.substring(id.lastIndexOf("_") + 1, id.length);

                var $color  = $xmlComponent.find('Property#' + 'line_color_' + index);
                var $label  = $xmlComponent.find('Property#' + 'line_label_' + index);
                var $value  = $xmlComponent.find('Property#' + 'line_value_' + index);

                form.controls[form.controls.length] = 
                {
                    'id'            : controlId + index,
                    'type'          : 'pyramid-line',
                    'color-id'      : controlId + $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'label-id'      : controlId + $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'data-id'       : controlId + $value.attr('id'),
                    'data-value'    : $value.attr('value'),
                    'data-choices'  : dataChoices
                };
            }
        });

        return form;
    }

	return iad;

})(iadesigner || {}, jQuery, window, document);