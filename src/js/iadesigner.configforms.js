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

    // Returns the form for the map palettes.
    iad.configforms.getMapPalettesForm = function()
    {
        updateAssociateOptions();
        updatePropertyOptions();
        updateJavaScriptOptions();

        var json = {'id': 'mappalettes','forms': []};

        // Colour Ranges.
        json.forms.push( 
        {
            'id'        : 'numeric',
            'name'      : 'Numeric',
            'type'      : 'MapPalettes',
            'controls'  : getPaletteControls(iad.config.getColourRanges())
        });
        // Add palette button.
        json.forms.controls[json.forms.controls.length] = 
        {
            'id'    : 'mappalettes',
            'name'  : 'New Palette',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-colourpalette'
        };

        // Colour Schemes.
        json.forms.push( 
        {
            'id'        : 'categoric',
            'name'      : 'Categoric',
            'type'      : 'MapPalettes',
            'controls'  : getPaletteControls(iad.config.getColourSchemes())
        });
        // Add sheme button.
        json.forms.controls[json.forms.controls.length] = 
        {
            'id'    : 'mappalettes',
            'name'  : 'New Palette',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-colourscheme'
        };
        
        console.log(json);
        return json;
    };

    // Returns the palette controls.
    function getPaletteControls($xmlColourRanges)
    {
        var controls = [];
        $.each($xmlColourRanges, function(i, xmlColourRange)
        {
            // Colour range.
            var $xmlColourRange = $(xmlColourRange);
            var id = $xmlColourRange.attr('id');
            var jsonControl = 
            {
                'id'            : id,
                'sortable'      : true,
                'removeable'    : true,
                'action'        : 'remove-colourpalette',
                'index'         : i,
                'name'          : id,
                'type'          : 'colour-palette',
                'value'         : id,
                'choices'       : [],
            };

            // Colors.
            var $xmlColours = iad.config.getPaletteColours(id);
            $.each($xmlColours, function(j, xmlColour)
            {
                var $xmlColour = $(xmlColour);
                jsonControl.choices[jsonControl.choices.length] = 
                {
                    'label' : $xmlColour.text(),
                    'value' : $xmlColour.text()
                };   
            });
            controls[controls.length] = jsonControl;
        });

        return controls;
    }

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
            'type'      : 'PropertyGroup',
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
            'type'          : 'Component',
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
            if (options.excludeProperties.indexOf(id) === -1 &&
                id.indexOf('target_') == -1 &&
                id.indexOf('symbol_') == -1 &&
                id.indexOf('break_') == -1 &&
                id.indexOf('line_') == -1)
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
        var componentIndex = widgetId.slice(-1);

        var control = 
        {
            'id'            : propId,
            'name'          : $xmlProperty.attr('name'),
            'type'          : $xmlProperty.attr('type'),
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
            'type': 'Button',
            'controls': [
            {
                'id'        : 'text',
                'type'      : 'string',
                'name'      : 'Text',
                'value'     : $xmlButton.attr('text')
            },
            {
                'id'        : 'href',
                'type'      : 'text-dropdown-replace',
                'name'      : 'Hyperlink',
                'value'     : $xmlButton.attr('href'),
                'choices'   : arrJavaScriptOptions
            },
            {
                'id'        : 'tooltip',
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
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Image',
            'type'      : 'Image',
            'controls'  : 
            [
                {
                    'id'    : 'src',
                    'type'  : 'string',
                    'name'  : 'Source',
                    'value' : $xmlImage.attr('src')
                },
                {
                    'id'    : 'href',
                    'type'  : 'string',
                    'name'  : 'Hyperlink',
                    'value' : $xmlImage.attr('href')
                },
                /*{
                    'id'        : 'target', 
                    'type'      : 'select', 
                    'name'      : 'Target', 
                    'value'     : $xmlImage.attr('target'),
                    'choices'   : [{'label':'_blank', 'value':'_blank'},{'label':'_self', 'value':'_self'},{'label':'_parent', 'value':'_parent'},{'label':'_top', 'value':'_top'}]
                },*/
                {
                    'id'    : 'rescale',
                    'type'  : 'boolean',
                    'name'  : 'Rescale?',
                    'value' : $xmlImage.attr('rescale'),
                    'description' : 'Should the image resize with the report, or should it stay a fixed size?'
                },
                {
                    'id'    : 'maintain-aspect-ratio',
                    'type'  : 'boolean',
                    'name'  : 'Maintain Aspect Ratio?',
                    'value' : $xmlImage.attr('maintain-aspect-ratio'),
                    'description' : 'Should the image maintain its aspect ratio?'
                },
                {
                    'id'    : 'anchor',
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
        var form = 
        {
            'id'        : widgetId,
            'name'      : 'Text',
            'type'      : 'Text',
            'controls'  : 
            [
                {
                    'id'        : 'nodevalue',
                    'type'      : 'textarea-dropdown-append',
                    'name'      : 'Text',
                    'value'     : $xmlText.text(),
                    'choices'   : options.subVarOptions
                },
                {
                    'id'        : 'href',
                    'type'      : 'string',
                    'name'      : 'Hyperlink',
                    'value'     : $xmlText.attr('href')
                },
                {
                    'id'        : 'fill',
                    'type'      : 'colour',
                    'name'      : 'Font Color',
                    'value'     : $xmlText.attr('fill')
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
                    ]
                },
                {
                    'id'        : 'font-size',
                    'type'      : 'integer',
                    'name'      : 'Font Size',
                    'value'     : $xmlText.attr('font-size')
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
                    ]
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
                    ]
                }
                /*{
                    'id'        : 'href', 
                    'type'      : 'select', 
                    'name'      : 'Target', 
                    'value'     : $xmlText.attr('target'),
                    'choices'   : [{'label':'_blank', 'value':'_blank'},{'label':'_self', 'value':'_self'},{'label':'_parent', 'value':'_parent'},{'label':'_top', 'value':'_top'}]
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
            'type'      : 'Component',
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
                    'id'            : widgetId,
                    'type'          : 'groupcontrol',
                    'sortable'      : true,
                    'removeable'    : true,
                    'action'        : 'remove-menuitem',
                    'index'         : index,
                    'controls'      :
                    [
                        {
                            'id'            : $menuItem.attr('id'),
                            'name'          : 'Label',
                            'type'          : 'string',
                            'value'         : $menuItem.attr('value'),
                            'description'   : $menuItem.attr('description')
                        },
                        {
                            'id'            : $menuFunc.attr('id'),
                            'name'          : 'Function',
                            'type'          : 'text-dropdown-replace',
                            'value'         : $menuFunc.attr('value'),
                            'choices'       : arrJavaScriptOptions,
                            'description'   : $menuFunc.attr('description')
                        }
                    ]
                };
            }
        });

        // Add item button.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'name'  : 'New Menu Item',
            'description'   : 'Add a new menu item',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-menuitem'
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
            'type'      : 'Component',
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
                    'id'            : widgetId,
                    'type'          : 'groupcontrol',
                    'sortable'      : false,
                    'removeable'    : true,
                    'action'        : 'remove-line',
                    'index'         : index,
                    'controls'      :
                    [
                        {
                            'id'            : $data.attr('id'),
                            'name'          : 'Data',
                            'type'          : 'select',
                            'value'         : $data.attr('value'),
                            'choices'       : dataChoices,
                            'description'   : $data.attr('description')
                        },
                        {
                            'id'            : $label.attr('id'),
                            'name'          : 'Label',
                            'type'          : 'string',
                            'value'         : $label.attr('value'),
                            'description'   : $label.attr('description')
                        },
                        {
                            'id'            : $color.attr('id'),
                            'name'          : 'Colour',
                            'type'          : 'colour',
                            'value'         : $color.attr('value'),
                            'description'   : $color.attr('description')
                        }
                    ]
                };
            }
        });

        // Add pyramid line button.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'name'  : 'New Line',
            'description'   : 'Add a new line',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-line'
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
            'type'      : 'Column',
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
                    'id'            : widgetId,
                    'type'          : 'groupcontrol',
                    'sortable'      : false,
                    'removeable'    : true,
                    'action'        : 'remove-symbol',
                    'index'         : index,
                    'controls'      :
                    [
                        {
                            'id'            : $value.attr('id'),
                            'name'          : 'Data Value',
                            'type'          : 'string',
                            'value'         : $value.attr('value'),
                            'description'   : $value.attr('description')
                        },
                        {
                            'id'            : $label.attr('id'),
                            'name'          : 'Label',
                            'type'          : 'string',
                            'value'         : $label.attr('value'),
                            'description'   : $label.attr('description')
                        },
                        {
                            'id'            : $shape.attr('id'),
                            'name'          : 'Shape',
                            'type'          : 'select',
                            'value'         : $shape.attr('value'),
                            'choices'       : shapeChoices,
                            'description'   : $shape.attr('description')
                        },
                        {
                            'id'            : $size.attr('id'),
                            'name'          : 'Size',
                            'type'          : 'integer-counter',
                            'value'         : $size.attr('value'),
                            'description'   : $size.attr('description')
                        },
                        {
                            'id'            : $color.attr('id'),
                            'name'          : 'Colour',
                            'type'          : 'colour',
                            'value'         : $color.attr('value'),
                            'description'   : $color.attr('description')
                        }
                    ]
                };
            }
        });

        // Add symbol button.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'name'  : 'New Symbol',
            'description'   : 'Add a new symbol',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-symbol'
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
            'type'      : 'Column',
            'controls'  : []
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
                    'id'            : widgetId,
                    'type'          : 'groupcontrol',
                    'sortable'      : false,
                    'removeable'    : true,
                    'action'        : 'remove-break',
                    'index'         : index,
                    'controls'      :
                    [
                        {
                            'id'            : $label.attr('id'),
                            'name'          : 'Label',
                            'type'          : 'string',
                            'value'         : $label.attr('value'),
                            'description'   : $label.attr('description')
                        },
                        {
                            'id'            : $color.attr('id'),
                            'name'          : 'Colour',
                            'type'          : 'colour',
                            'value'         : $color.attr('value'),
                            'description'   : $color.attr('description')
                        }
                    ]
                };
            }
        });

        // Add break button.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'name'  : 'New Break',
            'description'   : 'Add a new break',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-break'
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
            'type'      : 'Column',
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
                    'id'            : widgetId,
                    'type'          : 'groupcontrol',
                    'sortable'      : false,
                    'removeable'    : true,
                    'action'        : 'remove-target',
                    'index'         : index,
                    'controls'      :
                    [
                        {
                            'id'            : $data.attr('id'),
                            'name'          : 'Data',
                            'type'          : 'select',
                            'value'         : $data.attr('value'),
                            'choices'       : dataChoices,
                            'description'   : $data.attr('description')
                        },
                        {
                            'id'            : $label.attr('id'),
                            'name'          : 'Label',
                            'type'          : 'string',
                            'value'         : $label.attr('value'),
                            'description'   : $label.attr('description')
                        },
                        {
                            'id'            : $shape.attr('id'),
                            'name'          : 'Shape',
                            'type'          : 'select',
                            'value'         : $shape.attr('value'),
                            'choices'       : shapeChoices,
                            'description'   : $shape.attr('description')
                        },
                        {
                            'id'            : $size.attr('id'),
                            'name'          : 'Size',
                            'type'          : 'integer-counter',
                            'value'         : $size.attr('value'),
                            'description'   : $size.attr('description')
                        },
                        {
                            'id'            : $color.attr('id'),
                            'name'          : 'Colour',
                            'type'          : 'colour',
                            'value'         : $color.attr('value'),
                            'description'   : $color.attr('description')
                        }
                    ]
                };
            }
        });

        // Add target button.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'name'  : 'New Target',
            'description'   : 'Add a new target',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-target'
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
            'type'      : 'Column',
            'controls'  : []
        };

        var $xmlColumns = $xmlTable.find('Column');
        $.each($xmlColumns, function(i, xmlColumn)
        {
            var $xmlColumn = $(xmlColumn);
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

                var controls =  
                [
                    {
                        'id'            : 'alias',
                        'name'          : 'Column Title',
                        'type'          : 'text-dropdown-replace',
                        'value'         : alias,
                        'choices'       : options.subVarOptions,
                        'description'   : 'Column Title'
                    },
                    {
                        'id'            : 'width',
                        'name'          : 'Column Width',
                        'type'          : 'float-counter',
                        'value'         : width,
                        'description'   : 'Column Width'
                    }
                ];

                // Chart column.
                if (type === 'chart-column')
                {
                    // Health specific controls.
                    if ($xmlTable.find('Property#midValue').attr('value') !== undefined)
                    {
                        $min = $xmlTable.find('Property#minValue');
                        $mid = $xmlTable.find('Property#midValue');
                        $max = $xmlTable.find('Property#maxValue');

                        controls = controls.concat(
                        [
                            {
                                'name'          : 'Column Labels',
                                'type'          : 'bold-label',
                            },
                            {
                                'id'            : $min.attr('id'),
                                'name'          : 'Left Label',
                                'type'          : 'string',
                                'value'         : $min.attr('value'),
                                'description'   : $min.attr('description')
                            },
                            {
                                'id'            : $mid.attr('id'),
                                'name'          : 'Centre Label',
                                'type'          : 'string',
                                'value'         : $mid.attr('value'),
                                'description'   : $mid.attr('description')
                            },
                            {
                                'id'            : $max.attr('id'),
                                'name'          : 'Right Label',
                                'type'          : 'string',
                                'value'         : $max.attr('value'),
                                'description'   : $max.attr('description')
                            },
                            {
                                'name'          : 'Area Symbol',
                                'type'          : 'bold-label',
                            },
                            {
                                'id'            : 'name',
                                'name'          : 'Position Source',
                                'type'          : 'select',
                                'value'         : name,
                                'choices'       : symbolDataChoices,
                                'description'   : 'The data source containing the values that define the position of the symbol.'
                            },
                            {
                                'id'            : 'symbol',
                                'name'          : 'Symbol Source',
                                'type'          : 'select',
                                'value'         : symbolValue,
                                'choices'       : symbolDataChoices,
                                'description'   : 'The data source containing the values that define the symbol used to render the area symbol. Use the "Symbols" section below to map values in the data source to a symbol.'
                            }
                        ]);

                        // This was a later addition so may not be in older config files.
                        if ($xmlTable.find('Property#barColor').attr('value') !== undefined)
                        {
                            $color  = $xmlTable.find('Property#barColor');
                            controls = controls.concat(
                            [
                                {
                                    'id'            : $color.attr('id'),
                                    'name'          : 'Symbol Colour',
                                    'type'          : 'colour',
                                    'value'         : $color.attr('value'),
                                    'description'   : 'Symbol Colour'
                                }
                            ]);
                        }

                        if (nationalValue !== undefined)
                        {
                            controls = controls.concat(
                            [
                                {
                                    'id'            : 'national',
                                    'name'          : 'Centre Value',
                                    'type'          : 'select',
                                    'value'         : nationalValue,
                                    'choices'       : symbolDataChoices,
                                    'description'   : 'By default each chart is centred on the median value. You can override this by providing a data source. Use the "Chart Column Targets" section below to add a central line based on the values in your data source.'
                                }
                            ]);
                        }
                    }

                    // Area profile / Performance bar.
                    if ($xmlTable.find('Property#barHeight').attr('value') !== undefined)
                    {
                        // Area profile specific controls.
                        if ($xmlTable.find('Property#minValue').attr('value') !== undefined)
                        {
                            $min = $xmlTable.find('Property#minValue');
                            $max = $xmlTable.find('Property#maxValue');
                            controls = controls.concat(
                            [
                                {
                                    'name'          : 'Column Values',
                                    'type'          : 'bold-label',
                                },
                                {
                                    'id'            : $min.attr('id'),
                                    'name'          : 'Min Value',
                                    'type'          : 'integer',
                                    'value'         : $min.attr('value'),
                                    'description'   : $min.attr('description')
                                },
                                {
                                    'id'            : $max.attr('id'),
                                    'name'          : 'Max Value',
                                    'type'          : 'integer',
                                    'value'         : $max.attr('value'),
                                    'description'   : $max.attr('description')
                                }
                            ]);
                        }

                        $color  = $xmlTable.find('Property#barColor');
                        var $height = $xmlTable.find('Property#barHeight');
                        var $barData   = $xmlTable.find('Property#barData');
                        controls = controls.concat(
                        [
                            {
                                'name'          : 'Bar',
                                'type'          : 'bold-label',
                            },
                            {
                                'id'            : $barData.attr('id'),
                                'name'          : 'Data Source',
                                'type'          : 'select',
                                'value'         : $barData.attr('value'),
                                'choices'       : symbolDataChoices,
                                'description'   : 'Data to be associated with the bar.'
                            },
                            {
                                'id'            : $height.attr('id'),
                                'name'          : 'Height',
                                'type'          : 'integer-counter',
                                'value'         : $height.attr('value'),
                                'description'   : 'The height of the bar.'
                            },
                            {
                                'id'            : $color.attr('id'),
                                'name'          : 'Colour',
                                'type'          : 'colour',
                                'value'         : $color.attr('value'),
                                'description'   : 'The colour of the bar. "This is overridden if the Selected Features Legend" is included.'
                            }
                        ]);
                    }

                    form.controls[form.controls.length] = 
                    {
                        'id'            : widgetId,
                        'type'          : 'groupcontrol',
                        'sortable'      : true,
                        'removeable'    : false,
                        'index'         : i,
                        'controls'      : controls
                    };
                }
                else // Symbol column.
                {
                    form.controls[form.controls.length] = 
                    {
                        'id'            : widgetId,
                        'type'          : 'groupcontrol',
                        'sortable'      : true,
                        'removeable'    : true,
                        'action'        : 'remove-column',
                        'index'         : i,
                        'controls'      : 
                        [
                            {
                                'id'            : 'alias',
                                'name'          : 'Column Title',
                                'type'          : 'text-dropdown-replace',
                                'value'         : alias,
                                'choices'       : options.subVarOptions,
                                'description'   : 'Column Title'
                            },
                            {
                                'id'            : 'name',
                                'name'          : 'Data Source',
                                'type'          : 'select',
                                'value'         : name,
                                'choices'       : columnDataChoices,
                                'description'   : 'Data Source'
                            },
                            {
                                'id'            : 'symbol',
                                'name'          : 'Symbol Source',
                                'type'          : 'select',
                                'value'         : symbolValue,
                                'choices'       : symbolDataChoices,
                                'description'   : 'A data source that will be rendered as a symbol. Use the "Symbols" section below to map values in the data source to a symbol.'
                            },
                            {
                                'id'            : 'width',
                                'name'          : 'Column Width',
                                'type'          : 'float-counter',
                                'value'         : width,
                                'description'   : 'Column Width'
                            }
                        ]
                    };
                }
            }
            else
            {
                // Standard table column.
                form.controls[form.controls.length] = 
                {
                    'id'            : widgetId,
                    'type'          : 'groupcontrol',
                    'sortable'      : true,
                    'removeable'    : true,
                    'action'        : 'remove-column',
                    'index'         : i,
                    'controls'      :
                    [
                        {
                            'id'            : 'alias',
                            'name'          : 'Column Title',
                            'type'          : 'text-dropdown-replace',
                            'value'         : alias,
                            'choices'       : options.subVarOptions,
                            'description'   : 'Column Title'
                        },
                        {
                            'id'            : 'name',
                            'name'          : 'Data Source',
                            'type'          : 'text-dropdown-replace',
                            'value'         : name,
                            'choices'       : columnDataChoices,
                            'description'   : 'Data Source'
                        },
                        {
                            'id'            : 'width',
                            'name'          : 'Column Width',
                            'type'          : 'float-counter',
                            'value'         : width,
                            'description'   : 'Column Width'
                        }
                    ]
                };
            }
        });

        // Add column button.
        form.controls[form.controls.length] = 
        {
            'id'    : widgetId,
            'name'  : 'New Column',
            'description'   : 'Add a new column',
            'type'  : 'button',
            'icon'  : 'fa fa-fw fa-plus',
            'align' : 'right',
            'action': 'add-column'
        };

        return form;
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);