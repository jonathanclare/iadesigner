var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.configforms = iad.configforms || {};

    // Passed in options.
    var options;

    // Lists the available data properties for dropdown lists.
    var arrPropertyOptions = [];  

    // Lists the available data associates for dropdown lists.
    var arrAssociateOptions = [];  

    // Lists the available javascript functions for dropdown lists.
    var arrJavaScriptOptions = []; 

    // Initialise.
    iad.configforms.init = function(o)
    {
        options = o; 
    };

    // Returns the form for the property groups.
    iad.configforms.getPropertyGroupsForm = function()
    {
        updateAssociateOptions();
        updatePropertyOptions();
        updateJavaScriptOptions();

        var json = {'id': 'generalproperties','forms': []};

        var $xmlPropGroups = iad.config.getGroupProperties();
        $.each($xmlPropGroups, function(i, xmlPropGroup)
        {
            var $xmlPropGroup = $(xmlPropGroup);
            var jsonForm = getPropertyGroupForm($xmlPropGroup);
            if (jsonForm.controls.length > 0) json.forms[json.forms.length] = jsonForm;
        });

        return json;
    };

    // Returns the form for the given widget.
    iad.configforms.getWidgetForm = function(widgetId)
    {
        updateAssociateOptions();
        updatePropertyOptions();
        updateJavaScriptOptions();

        var $xmlWidget = iad.config.getWidgetXml(widgetId);
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

        return json;
    };

    // Update javascript dropdown options.
    function updateJavaScriptOptions()
    {
        arrJavaScriptOptions = options.javaScriptOptions.concat();
        var $xmlWidgets = iad.config.getComponents();
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var id = $xmlWidget.attr('id');
            var name = $xmlWidget.attr('name');
            var vis = $xmlWidget.attr('visible');
            if (vis == 'true') arrJavaScriptOptions[arrJavaScriptOptions.length] = { 'label': 'Toggle ' + name, 'value': 'javascript:iaToggle(' + id + ')' };
        });
    }

    // Update the associate dropdown options.
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

    // Update the property dropdown options.
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

    // Returns a property group form.
    function getPropertyGroupForm($xmlPropGroup)
    {
        var form = 
        {
            'id'        : $xmlPropGroup.attr('id'),
            'name'      : $xmlPropGroup.attr('name'),
            'controls'  : []
        };
        
        // Get the controls for the properties in the PropertyGroup.
        var $xmlProperties = $xmlPropGroup.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);
            var id = $xmlProperty.attr('id');
            if (options.excludeProperties.indexOf(id) === -1)
            {
                var control = getPropertyControl($xmlPropGroup, $xmlProperty);
                control.PropertyGroup = true;
                form.controls[form.controls.length] = control;
            }
        });

        return form;
    }

    // Returns a component form.
    function getComponentForm($xmlComponent)
    {
        var id = $xmlComponent.attr('id');
        var name = $xmlComponent.attr('name');
        var $desc = $xmlComponent.find('Description');

        // Adjust the name if its a component not using the first data source.
        var adjustedName = iad.config.getDisplayName(id);

        var form = 
        {
            'id'            : id,
            'name'          : adjustedName,
            'description'   : ($desc && ($desc.length > 0) ? $desc.text() : ''),
            'title'         : ($desc && ($desc.length > 0) ? adjustedName : ''),
            'controls'      : []
        };

        // Get the controls for the properties in the component.
        var $xmlProperties = $xmlComponent.find('Property');
        $.each($xmlProperties, function(i, xmlProperty)
        {
            var $xmlProperty = $(xmlProperty);
            var id = $xmlProperty.attr('id');
            if (options.excludeProperties.indexOf(id) === -1)
            {
                var control = getPropertyControl($xmlComponent, $xmlProperty);
                form.controls[form.controls.length] = control;
            }
        });

        return form;
    }

    // Returns a property form.
    function getPropertyControl($xmlWidget, $xmlProperty)
    {
        var propId = $xmlProperty.attr('id');
        var widgetId = $xmlWidget.attr('id');
        var tagName = $xmlWidget.prop('tagName');
        var componentIndex = widgetId.slice(-1);

        var control = 
        {
            'id'            : propId,
            'type'          : $xmlProperty.attr('type'),
            'name'          : $xmlProperty.attr('name'),
            'value'         : $xmlProperty.attr('value'),
            'description'   : $xmlProperty.attr('description'),
            'form'          : tagName,
            'widgetId'      : widgetId
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
        else if (options.requireDataDropdown.indexOf(propId) !== -1)
        {
            control.type = 'select';
            control.choices = [
            {
                'label' : 'Indicator value',
                'value' : 'value'
            }];
            if (arrAssociateOptions.length > 0) control.choices = control.choices.concat(arrAssociateOptions);
        }
        else if (options.requirePropertiesDropdown.indexOf(propId) !== -1)
        {
            control.choices = arrPropertyOptions.concat();
            control.type = 'select';
        }
        else if (options.requireSubVarDropdown.indexOf(propId) !== -1)
        {
            if (componentIndex === '2')         control.choices = options.subVarOptions2.concat();
            else                                control.choices = options.subVarOptions.concat();
            control.type = 'text-dropdown-append';
        }
        else if (options.requireTipDropdown.indexOf(propId) !== -1)
        {  
            if (propId === 'tip2')                  control.choices = options.tooltipOptions2.concat();
            else if (componentIndex === '2')    control.choices = options.tooltipOptions2.concat();
            else                                control.choices = options.tooltipOptions.concat();
            control.type = 'text-dropdown-append';
        }
        else if (options.requireJavaScriptDropdown.indexOf(propId) !== -1)
        {
            control.choices = arrJavaScriptOptions.concat();
            control.type = 'text-dropdown-replace';
        }
        else if (propId === 'sortColumnName')
        {
            control.type = 'select';
            control.choices = [];

            var $columns = iad.config.getColumns(widgetId);
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
        else if (propId === 'colorSchemeId')
        {
            control.type = 'select';
            control.choices = [];

            var colorSchemeIds = iad.config.getColourSchemeIds();
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
        if (options.useTextArea.indexOf(propId) !== -1)
        {
            control.type = 'textarea-dropdown-append';
        }
        if (propId === 'snippet') control.type = 'textarea-large';
        if (propId === 'ndecimal' || propId === 'legendPrecision') control.type = 'integer-select';

        return control;
    }

    // Returns a button form.
    function getButtonForm($xmlButton)
    {
        var widgetId = $xmlButton.attr('id');
        var form = 
        {
            'id': widgetId,
            'name': 'Button',
            'controls': [
            {
                'id'        : 'text',
                'type'      : 'string',
                'name'      : 'Text',
                'value'     : $xmlButton.attr('text'),
                'form'          : 'Button',
                'widgetId'      : widgetId
            },
            {
                'id'        : 'href',
                'type'      : 'text-dropdown-replace',
                'name'      : 'Hyperlink',
                'value'     : $xmlButton.attr('href'),
                'choices'   : arrJavaScriptOptions,
                'form'          : 'Button',
                'widgetId'      : widgetId
            },
            {
                'id'        : 'tooltip',
                'type'      : 'string',
                'name'      : 'Tooltip',
                'value'     : $xmlButton.attr('tooltip'),
                'form'          : 'Button',
                'widgetId'      : widgetId
            }]
        };
        return form;
    }

    // Returns an image form.
    function getImageForm($xmlImage)
    {
        var widgetId = $xmlImage.attr('id');
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Image',
            'controls'  : 
            [
                {
                    'id'    : 'src',
                    'type'  : 'string',
                    'name'  : 'Source',
                    'value' : $xmlImage.attr('src'),
                    'form'          : 'Image',
                    'widgetId'      : widgetId
                },
                {
                    'id'    : 'href',
                    'type'  : 'string',
                    'name'  : 'Hyperlink',
                    'value' : $xmlImage.attr('href'),
                    'form'          : 'Image',
                    'widgetId'      : widgetId
                },
                /*{
                    'id'        : 'target', 
                    'type'      : 'select', 
                    'name'      : 'Target', 
                    'value'     : $xmlImage.attr('target'),
                    'choices'   : [{'label':'_blank', 'value':'_blank'},{'label':'_self', 'value':'_self'},{'label':'_parent', 'value':'_parent'},{'label':'_top', 'value':'_top'}],
                    'form'          : 'Image',
                    'widgetId'      : widgetId
                },*/
                {
                    'id'    : 'rescale',
                    'type'  : 'boolean',
                    'name'  : 'Rescale?',
                    'value' : $xmlImage.attr('rescale'),
                    'description' : 'Should the image resize with the report, or should it stay a fixed size?',
                    'form'          : 'Image',
                    'widgetId'      : widgetId
                },
                {
                    'id'    : 'maintain-aspect-ratio',
                    'type'  : 'boolean',
                    'name'  : 'Maintain Aspect Ratio?',
                    'value' : $xmlImage.attr('maintain-aspect-ratio'),
                    'description' : 'Should the image maintain its aspect ratio?',
                    'form'          : 'Image',
                    'widgetId'      : widgetId
                },
                {
                    'id'    : 'anchor',
                    'type'  : 'select',
                    'name'  : 'Anchor',
                    'value' : $xmlImage.attr('anchor'),
                    'description' : 'Anchor',
                    'choices'   : [{'label':'left', 'value':'left'},{'label':'center', 'value':'center'},{'label':'right', 'value':'right'}],
                    'form'          : 'Image',
                    'widgetId'      : widgetId
                }
            ]
        };
        return form;
    }

    // Returns a text form.
    function getTextForm($xmlText)
    {
        var widgetId = $xmlText.attr('id');
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Text',
            'controls'  : 
            [
                {
                    'id'        : 'nodevalue',
                    'type'      : 'textarea-dropdown-append',
                    'name'      : 'Text',
                    'value'     : $xmlText.text(),
                    'choices'   : options.subVarOptions,
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },
                {
                    'id'        : 'href',
                    'type'      : 'string',
                    'name'      : 'Hyperlink',
                    'value'     : $xmlText.attr('href'),
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },
                {
                    'id'        : 'fill',
                    'type'      : 'colour',
                    'name'      : 'Font Color',
                    'value'     : $xmlText.attr('fill'),
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },
                {
                    'id'        : 'font-family',
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
                    ],
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },
                {
                    'id'        : 'font-size',
                    'type'      : 'integer',
                    'name'      : 'Font Size',
                    'value'     : $xmlText.attr('font-size'),
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },
                {
                    'id'        : 'font-style',
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
                    ],
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },
                {
                    'id'        : 'font-weight',
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
                    ],
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                }
                /*{
                    'id'        : 'href', 
                    'type'      : 'select', 
                    'name'      : 'Target', 
                    'value'     : $xmlText.attr('target'),
                    'choices'   : [{'label':'_blank', 'value':'_blank'},{'label':'_self', 'value':'_self'},{'label':'_parent', 'value':'_parent'},{'label':'_top', 'value':'_top'}],
                    'form'          : 'Text',
                    'widgetId'      : widgetId
                },*/
            ]
        };
        return form;
    }

    // Returns a menu bar form.
    function getMenuBarForm($xmlComponent)
    {
        var widgetId = $xmlComponent.attr('id');
        var form = 
        {
            'id'        : widgetId,
            'name'      : $xmlComponent.attr('name'),
            'controls'  : []
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
                    'id'                : widgetId + index,
                    'type'              : 'menu-bar',
                    'label-id'          : $menuItem.attr('id'),
                    'label-value'       : $menuItem.attr('value'),
                    'label-description' : $menuItem.attr('description'),
                    'func-id'           : $menuFunc.attr('id'),
                    'func-value'        : $menuFunc.attr('value'),
                    'func-choices'      : arrJavaScriptOptions,
                    'func-description'  : $menuFunc.attr('description'),
                    'form'          : 'Component',
                    'widgetId'      : widgetId
                };
            }
        });

        // Menu addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'type'  : 'menu-bar-add'
        };

        return form;
    }

    // Returns a symbol form.
    function getSymbolForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');

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
                    'id'            : widgetId + index,
                    'type'          : 'profile-symbol',
                    'shape-id'      : $shape.attr('id'),
                    'shape-value'   : $shape.attr('value'),
                    'shape-choices' : shapeChoices,
                    'color-id'      : $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'size-id'       : $size.attr('id'),
                    'size-value'    : $size.attr('value'),
                    'label-id'      : $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'data-id'       : $value.attr('id'),
                    'data-value'    : $value.attr('value'),
                    'form'          : 'Table',
                    'widgetId'      : widgetId
                };
            }
        });

        // Symbol addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'type'  : 'symbol-add'
        };

        return form;
    }

    // Returns a breaks form.
    function getBreaksForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');

        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Chart Column Breaks',
            'controls'  : []
        };

        /*form.controls[form.controls.length] = 
        {
            'type'  : 'open-data-properties-form',
            'label' : 'Add Custom Indicator Breaks'
        };*/

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
                    'id'            : widgetId + index,
                    'type'          : 'profile-break',
                    'color-id'      : $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'label-id'      : $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'form'          : 'Table',
                    'widgetId'      : widgetId
                };
            }
        });

        // Break addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'type'  : 'break-add'
        };

        return form;
    }

    // Returns a target form.
    function getTargetForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');

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
                    'id'            : widgetId + index,
                    'type'          : 'profile-target',
                    'shape-id'      : $shape.attr('id'),
                    'shape-value'   : $shape.attr('value'),
                    'shape-choices' : shapeChoices,
                    'color-id'      : $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'size-id'       : $size.attr('id'),
                    'size-value'    : $size.attr('value'),
                    'label-id'      : $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'data-id'       : $data.attr('id'),
                    'data-value'    : $data.attr('value'),
                    'data-choices'  : dataChoices,
                    'form'          : 'Table',
                    'widgetId'      : widgetId
                };
            }
        });

        // Target addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'type'  : 'target-add'
        };

        return form;
    }

    // Returns a column form for table or spine chart.
    function getColumnForm($xmlTable)
    {
        var widgetId = $xmlTable.attr('id');

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
                    'id'            : widgetId + i,
                    'type'          : type,
                    'alias-id'      : 'alias',
                    'alias-value'   : alias,
                    'alias-choices' : options.subVarOptions,
                    'data-id'       : 'name',
                    'data-value'    : name,
                    'data-choices'  : columnDataChoices,
                    'width-id'      : 'width',
                    'width-value'   : width,
                    'symbol-id'     : 'symbol',
                    'symbol-value'  : symbolValue,
                    'symbol-choices': symbolDataChoices,
                    'form'          : 'Column',
                    'widgetId'      : widgetId,
                    'columnIndex'   : i
                };

                if (nationalValue !== undefined)
                {
                    $.extend(control, 
                    {
                        'national-id'       : 'national',
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
                        'health-min-id'             : $min.attr('id'),
                        'health-min-value'          : $min.attr('value'),
                        'health-min-description'    : $min.attr('description'),
                        'health-mid-id'             : $mid.attr('id'),
                        'health-mid-value'          : $mid.attr('value'),
                        'health-mid-description'    : $mid.attr('description'),
                        'health-max-id'             : $max.attr('id'),
                        'health-max-value'          : $max.attr('value'),
                        'health-max-description'    : $max.attr('description')
                    });

                    // This was a later addition so may not be in older config files.
                    if ($xmlTable.find('Property#barColor').attr('value') !== undefined)
                    {
                        $color  = $xmlTable.find('Property#barColor');
                        $.extend(control, 
                        {
                            'health-symbol-color-id'        : $color.attr('id'),
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
                        'profile-min-id'            : $min.attr('id'),
                        'profile-min-value'         : $min.attr('value'),
                        'profile-min-description'   : $min.attr('description'),
                        'profile-max-id'            : $max.attr('id'),
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
                        'profile-color-id'      : $color.attr('id'),
                        'profile-color-value'   : $color.attr('value'),
                        'profile-height-id'     : $height.attr('id'),
                        'profile-height-value'  : $height.attr('value'),
                        'profile-data-id'       : $data.attr('id'),
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
                    'id'            : widgetId + i,
                    'type'          : 'column',
                    'alias-id'      : 'alias',
                    'alias-value'   : alias,
                    'alias-choices' : options.subVarOptions,
                    'data-id'       : 'name',
                    'data-value'    : name,
                    'data-choices'  : columnDataChoices,
                    'width-id'      : 'width',
                    'width-value'   : width,
                    'form'          : 'Column',
                    'widgetId'      : widgetId,
                    'columnIndex'   : i
                };
            }
        });

        // Column addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : 'Column~' + widgetId,
            'type'  : 'column-add',
        };

        return form;
    }

    // Returns a pyramid line form.
    function getPyramidLineForm($xmlComponent)
    {
        var widgetId = $xmlComponent.attr('id');

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
                    'id'            : widgetId + index,
                    'type'          : 'pyramid-line',
                    'color-id'      : $color.attr('id'),
                    'color-value'   : $color.attr('value'),
                    'label-id'      : $label.attr('id'),
                    'label-value'   : $label.attr('value'),
                    'data-id'       : $value.attr('id'),
                    'data-value'    : $value.attr('value'),
                    'data-choices'  : dataChoices,
                    'form'          : 'Component',
                    'widgetId'      : widgetId
                };
            }
        });

        // Symbol addition control.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'type'  : 'pyramid-line-add'
        };

        return form;
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);