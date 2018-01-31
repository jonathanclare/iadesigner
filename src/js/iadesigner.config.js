var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.config = iad.config || {};

    // A reference the the actual xml.
    var xmlConfig, $xmlConfig;

    // Passed in options.
    var options;

    // The id of the selected widget.
    iad.config.selectedWidgetId = undefined;

    // Initialise.
    iad.config.init = function (o)
    {
        options = o;
        this.setXml(options.xml);
    };

    // Set the xml.
    iad.config.setXml = function (xml)
    {
        xmlConfig = xml;
        $xmlConfig = $(xmlConfig);
        if (options && options.onNewConfig) options.onNewConfig.call(null);
    };

    // Return a copy of the xml.
    iad.config.getXml = function ()
    {
        return xmlConfig.cloneNode(true);
    };

    // Converts xml to string.
    iad.config.toString = function ()
    {
        var xmlString;
        if (typeof XMLSerializer == 'function')
        {
            xmlString = (new XMLSerializer()).serializeToString(xmlConfig); // Mozilla, Firefox, Opera, etc.
        }
        else if (window.ActiveXObject) xmlString = xmlConfig.xml; // IE (certain versions)
        return xmlString;
    };

    // Gets the display name for the widget by removing any extra spaces or data source numbers.
    iad.config.getDisplayName = function (widgetId)
    {
        if (widgetId === 'PropertyGroup') return 'General Properties';
        else if (widgetId === 'MapPalettes') return 'Map Palettes';
        else
        {
            var $xmlWidget = iad.config.getWidgetXml(widgetId);
            var tagName = $xmlWidget.prop('tagName');
            if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text')
            {
                return tagName;
            }
            else
            {
                var name = $xmlWidget.attr('name');
                var match = name.match(/\d+/);
                if (match)
                {
                    var index = parseInt(match[0], 10);
                    name = name.substring(0, name.indexOf(' ' + index));
                }

                var dataSource = iad.config.getDataSource(widgetId);
                if (dataSource > 1) name += ' ' + dataSource;

                return name;
            }
        }
    };

    // Gets the widget id without suffix.
    iad.config.getIdWithoutSuffix = function (widgetId)
    {
        return widgetId.replace(/[0-9]/g, '');
    };

    // Gets the index of the data source for the widget.
    iad.config.getDataSource = function (widgetId)
    {
        var match = widgetId.match(/\d+/);
        var index = 1;
        if (match) index = parseInt(match[0], 10);
        return index;
    };

    // Removes a widget.
    iad.config.removeWidget = function (widgetId)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        var tagName = $xmlWidget.prop('tagName');

        if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text') 
            $xmlWidget.remove();
        else if (tagName === 'Component' || tagName === 'Table') 
            $xmlWidget.attr('visible', false);

        if (options && options.onWidgetRemoved) options.onWidgetRemoved.call(null, widgetId, $xmlWidget); // On widget removed.
    };

    // On widget added.
    function onWidgetAdded(widgetId, $xmlWidget)
    {
        if (options && options.onWidgetAdded) options.onWidgetAdded.call(null, widgetId, $xmlWidget); // On widget added.
    }

    // Adds a widget.
    iad.config.addWidget = function (widgetId)
    {
        if (widgetId === 'Button')
        {
            widgetId = guid();
            addButton(widgetId);
        }
        else if (widgetId === 'Image')
        {
            widgetId = guid();
            addImage(widgetId);
        }
        else if (widgetId === 'Text')
        {
            widgetId = guid();
            addText(widgetId);
        }
        else
        {
            addComponent(widgetId);
        }
    };

    // Adds a component / table.
    function addComponent(widgetId)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        $xmlWidget.find('Property#zIndex').attr('value', iad.config.getMaxZIndex() + 1);
        $xmlWidget.attr('visible', true);
        onWidgetAdded(widgetId, $xmlWidget);
    }

    // Adds a button.
    function addButton(widgetId)
    {
        var zIndex = iad.config.getMaxZIndex() + 1;
        var strXML = '<Button id="' + widgetId + '" zIndex="' + zIndex + '" text="My Button" href="" tooltip="" x="276" y="270" width="204" height="54" editable="true" moveable="true" removeable="true" resizeable="true"/>';
        var $xmlWidget = $($.parseXML(strXML)).find('Button'); // Weird way of inserting xml was required for IE to work.
        $xmlConfig.find('AtlasInterface').append($xmlWidget);
        onWidgetAdded(widgetId, $xmlWidget);
    }

    // Adds text.
    function addText(widgetId)
    {
        var zIndex = iad.config.getMaxZIndex() + 1;
        var text = 'My Text';
        var strXML = '<Text id="' + widgetId + '" zIndex="' + zIndex + '" anchor="start" editable="true" fill="#000000" font-family="Arial" font-size="24" font-style="normal" font-weight="bold" href="" moveable="true" removeable="true" resizeable="true" rotate="0" target="_blank" wrap-width="96" x="330" y="283">' + text + '</Text>';
        var $xmlWidget = $($.parseXML(strXML)).find('Text'); // Weird way of inserting xml was required for IE to work.
        $xmlConfig.find('AtlasInterface').append($xmlWidget);
        onWidgetAdded(widgetId, $xmlWidget);
    }

    // Adds an image.
    function addImage(widgetId)
    {
        var zIndex = iad.config.getMaxZIndex() + 1;
        var strXML = '<Image id="' + widgetId + '" zIndex="' + zIndex + '" rescale="true" anchor="left" src="./image_placeholder.png" href="" target="_blank" x="294" y="216" width="156" height="157" moveable="true" editable="true" removeable="true" resizeable="true"/>';
        var $xmlWidget = $($.parseXML(strXML)).find('Image'); // Weird way of inserting xml was required for IE to work.
        $xmlConfig.find('AtlasInterface').append($xmlWidget);
        onWidgetAdded(widgetId, $xmlWidget);
    }

    // Returns the components.
    iad.config.getComponents = function ()
    {
        var $xmlWidgets = $xmlConfig.find('Component, Table');
        return $xmlWidgets;
    }; 

    // Returns the buttons.
    iad.config.getButtons = function ()
    {
        var $xmlWidgets = $xmlConfig.find('Button');
        return $xmlWidgets;
    };

    // Returns the text.
    iad.config.getText = function ()
    {
        var $xmlWidgets = $xmlConfig.find('Text');
        return $xmlWidgets;
    };

    // Returns the images.
    iad.config.getImages = function ()
    {
        var $xmlWidgets = $xmlConfig.find('Image');
        return $xmlWidgets;
    };

    // Returns the property groups.
    iad.config.getGroupProperties = function ()
    {
        var $xmlWidgets = $xmlConfig.find('PropertyGroup');
        return $xmlWidgets;
    };

    // Sets a group property to the given value.
    iad.config.setGroupProperty = function (groupId, propertyId, value)
    {
        // Set the new property value.
        var $xmlWidget = iad.config.getWidgetXml(groupId);
        if ($xmlWidget.length)
        {
            var $xmlProperty = $xmlWidget.find('Property#' + propertyId);
            if ($xmlProperty.length)
            {
                $xmlProperty.attr('value', value);
                if (options && options.onGroupPropertyChanged) options.onGroupPropertyChanged.call(null, groupId, propertyId); // On group property changed.
            }
        }
    };

    // Get the value for a group property.
    iad.config.getGroupProperty = function (widgetId, propertyId)
    {
       return iad.config.getWidgetProperty(widgetId, propertyId);
    };

    // Sets the widget dimensions.
    iad.config.setWidgetDimensions = function (widgetId, x, y, w, h)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length)
        {
            if (x !== undefined) $xmlWidget.attr('x', Math.round((x / 100) * 800));
            if (y !== undefined) $xmlWidget.attr('y', Math.round((y / 100) * 600));

            var tagName = $xmlWidget.prop('tagName');
            if (tagName === 'Image' && $xmlWidget.attr('rescale') === 'false' || $xmlWidget.attr('rescale') === false) // Image is a special case cos of weird anchoring in original designer.
            {
                if (w !== undefined && $xmlWidget.attr('width') !== undefined) $xmlWidget.attr('width', w);
                if (h !== undefined && $xmlWidget.attr('height') !== undefined) $xmlWidget.attr('height', h);
            }
            else
            {
                var cw = Math.round((w / 100) * 800);
                if (w !== undefined && $xmlWidget.attr('width') !== undefined) $xmlWidget.attr('width', Math.round((w / 100) * 800));
                if (h !== undefined && $xmlWidget.attr('height') !== undefined) $xmlWidget.attr('height', Math.round((h / 100) * 600));
            }
            if (w !== undefined && $xmlWidget.attr('wrap-width') !== undefined) $xmlWidget.attr('wrap-width', Math.round((w / 100) * 800));
                
            if (options && options.onWidgetDimensionsChanged) options.onWidgetDimensionsChanged.call(null, widgetId, $xmlWidget, x, y, w, h); // On widget dimensions changed.
        }
    };

    // Sets a widget property to the given value.
    iad.config.setWidgetProperty = function (widgetId, propertyId, value)
    {
        // Set the new property value.
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length)
        {
            var $xmlProperty = $xmlWidget.find('Property#' + propertyId);
            if ($xmlProperty.length)
            {
                // Clean up...
                if (value && (value !== '') && (typeof (value) === 'string') && (value.indexOf('${') >= 0))
                {
                    var vp = value.split('${');
                    var s = '';
                    for (var i = 0; i < vp.length; i++)
                    {
                        s += '${' + (vp[i].indexOf('}') < 0 ? '}' : '') + vp[i];
                    }
                    value = s.replace('${}', '');
                }
                $xmlProperty.attr('value', value);

                if (options && options.onWidgetPropertyChanged) options.onWidgetPropertyChanged.call(null, widgetId, $xmlWidget); // On widget changed.
            }
        }
    };

    // Get the value for a widget property.
    iad.config.getWidgetProperty = function (widgetId, propertyId)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length)
        {
            var $xmlProperty = $xmlWidget.find('Property#' + propertyId);
            return $xmlProperty.attr('value');
        }
        else return undefined;
    };

    // Sets a widget attribute to the give value.
    iad.config.setWidgetAttribute = function (widgetId, attribute, value)
    {
        // Set the new property value.
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length)
        {
            var tagName = $xmlWidget.prop('tagName');
            if (tagName === 'Image') // Image is a special case cos of weird anchoring in original designer.
            {
                if (options && options.onImageChanged) options.onImageChanged.call(null, widgetId, $xmlWidget, attribute, value);
            }
            if (attribute === 'nodevalue')
            {
                // Clean up...
                if (value && (value !== '') && (typeof (value) === 'string') && (value.indexOf('${') >= 0))
                {
                    var vp = value.split('${');
                    var s = '';
                    for (var i = 0; i < vp.length; i++)
                    {
                        s += '${' + (vp[i].indexOf('}') < 0 ? '}' : '') + vp[i];
                    }
                    value = s.replace('${}', '');
                }
                $xmlWidget.text(value); // Text changed.
            }
            else $xmlWidget.attr(attribute, value);
            if (options && options.onWidgetAttributeChanged) options.onWidgetAttributeChanged.call(null, widgetId, $xmlWidget, attribute, value);
        }
    };

    // Bring the widget to the front.
    iad.config.bringToFront = function(widgetId)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);

        var tagName = $xmlWidget.prop('tagName');
        if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text')
            iad.config.setWidgetAttribute(widgetId, 'zIndex', iad.config.getMaxZIndex() + 1);
        else
            iad.config.setWidgetProperty(widgetId, 'zIndex', iad.config.getMaxZIndex() + 1);

        if (options && options.onZIndexChanged) options.onZIndexChanged.call(null, widgetId); // On widget brought to front.
    };

    // Send the widget to the back.
    iad.config.sendToBack = function(widgetId)
    {
        var minZIndex = iad.config.getMinZIndex();

        // Components.
        var $xmlWidgets = iad.config.getComponents();
        $.each($xmlWidgets, function(i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);

            var id = $xmlWidget.attr('id');
            var vis = $xmlWidget.attr('visible');
            var zIndex = ia.parseInt($xmlWidget.find('Property#zIndex').attr('value'));

            if      (id === widgetId)   iad.config.setWidgetProperty(id, 'zIndex', minZIndex);
            else if (vis === 'true')    iad.config.setWidgetProperty(id, 'zIndex', zIndex + 1);
        });

        // Buttons, text and images.
        $xmlWidgets = $xmlConfig.find('Button, Image, Text');
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var zIndex = $xmlWidget.attr('zIndex');
            if (zIndex === undefined) zIndex = minZIndex;

            var id = $xmlWidget.attr('id');
            if (id === widgetId) 
                iad.config.setWidgetAttribute(id, 'zIndex', minZIndex);
            else 
                iad.config.setWidgetAttribute(id, 'zIndex', ia.parseInt(zIndex) + 1);
        });

        if (options && options.onZIndexChanged) options.onZIndexChanged.call(null, widgetId); // On widget sent to back.
    };

    // Get the value for a widget attribute.
    iad.config.getWidgetAttribute = function (widgetId, attribute)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length) return $xmlWidget.attr(attribute);
        else return undefined;
    };

    // Gets the xml for the widget.
    iad.config.getWidgetXml = function (widgetId)
    {
        var $xmlWidget = $xmlConfig.find('#' + widgetId);
        return $xmlWidget;
    };

    // Get min z-index.
    iad.config.getMinZIndex = function ()
    {
        var minZIndex = Infinity;

        // Components.
        var $xmlWidgets = iad.config.getComponents();
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var vis = $xmlWidget.attr('visible');
            var zIndex = ia.parseInt($xmlWidget.find('Property#zIndex').attr('value'));
            if (vis === 'true') minZIndex = Math.min(minZIndex, zIndex);
        });

        // Buttons, text and images.
        $xmlWidgets = $xmlConfig.find('Button, Image, Text');
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var zIndex = $xmlWidget.attr('zIndex');
            if (zIndex) minZIndex = Math.min(minZIndex, ia.parseInt(zIndex));
        });

        return minZIndex;
    };

    // Get max z-index.
    iad.config.getMaxZIndex = function ()
    {
        var maxZIndex = -Infinity;

        // Components.
        var $xmlWidgets = iad.config.getComponents();
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var vis = $xmlWidget.attr('visible');
            var zIndex = ia.parseInt($xmlWidget.find('Property#zIndex').attr('value'));
            if (vis === 'true') maxZIndex = Math.max(maxZIndex, zIndex);
        });

        // Buttons, text and images.
        $xmlWidgets = $xmlConfig.find('Button, Image, Text');
        $.each($xmlWidgets, function (i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var zIndex = $xmlWidget.attr('zIndex');
            if (zIndex) maxZIndex = Math.max(maxZIndex, ia.parseInt(zIndex));
        });

        return maxZIndex;
    };

    // Adds a menu item.
    iad.config.addMenuItem = function (widgetId)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        var index = s4();
        prependProperty(widgetId, '<Property id="menuFunc' + index + '" description="The function or url for the menu item" name="Menu Function" type="string" value="" />');
        prependProperty(widgetId, '<Property id="menuItem' + index + '" description="The label for the menu item" name="Menu Item" type="string" value="New Item" />');
        if (options && options.onPropertyAdded) options.onPropertyAdded.call(null, widgetId, $xmlComponent);
    };

    // Removes a menu item.
    iad.config.removeMenuItem = function (widgetId, index)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        $xmlComponent.find('Property#' + 'menuItem' + index).remove();
        $xmlComponent.find('Property#' + 'menuFunc' + index).remove();
        if (options && options.onPropertyRemoved) options.onPropertyRemoved.call(null, widgetId, $xmlComponent);
    };

    // Re-orders the menu items.
    iad.config.orderMenuItems = function (widgetId, items)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);

        for (var i = 0; i < items.length; i++)
        {
            var item = items[i];
            var $menuItem = item.menuItem;
            var $menuFunc = item.menuFunc;
            $menuItem.appendTo($xmlComponent);
            $menuFunc.appendTo($xmlComponent);
        }
        if (options && options.onWidgetPropertyChanged) options.onWidgetPropertyChanged.call(null, widgetId, $xmlComponent); // On widget changed.
    };

    // Adds a table column.
    iad.config.addColumn = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var strXML = '<Column alias="My Column" name="value" width="0.25" />';
        var xml = $($.parseXML(strXML)).find('Column');
        $xmlTable.prepend(xml);
        if (options && options.onPropertyAdded) options.onPropertyAdded.call(null, widgetId, $xmlTable);
    };

    // Removes a stable column.
    iad.config.removeColumn = function (widgetId, index)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var $column = iad.config.getWidgetXml(widgetId).find('Column').eq(index);
        $column.remove();
        if (options && options.onPropertyRemoved) options.onPropertyRemoved.call(null, widgetId, $xmlTable);
    };

    // Re-orders the columns.
    iad.config.orderColumns = function (widgetId, columns)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        for (var i = 0; i < columns.length; i++)
        {
            var $column = columns[i];
            $column.appendTo($xmlTable);
        }
        if (options && options.onWidgetPropertyChanged) options.onWidgetPropertyChanged.call(null, widgetId, $xmlTable); // On widget changed.
    };

    // Returns the table columns.
    iad.config.getColumns = function (widgetId)
    {
        var $columns = iad.config.getWidgetXml(widgetId).find('Column');
        return $columns;
    };

    // Adds a spine chart symbol.
    iad.config.addSymbol = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var index = s4();
        prependProperty(widgetId, '<Property id="symbol_value_' + index + '" description="Value that will be associated with symbol" name="Symbol Value" type="string" value="--" />');
        prependProperty(widgetId, '<Property id="symbol_label_' + index + '" description="Label that will be associated with symbol" name="Symbol Label" type="string" value="Symbol Label" />');
        prependProperty(widgetId, '<Property id="symbol_size_' + index + '" description="Size that will be used for symbol" name="Symbol Size" type="integer" value="14" />');
        prependProperty(widgetId, '<Property id="symbol_color_' + index + '" description="Colour that will be used for symbol" name="Symbol Colour" type="colour" value="#999999" />');
        prependProperty(widgetId, '<Property id="symbol_shape_' + index + '" choices="circle;square;vertical line;plus;minus;x;diamond;star;triangle up;triangle down;triangle right;triangle left;arrow up;arrow down;arrow right;arrow left" description="Shape that will be used for symbol"  name="Symbol Shape" type="string" value="circle" />');
        if (options && options.onPropertyAdded) options.onPropertyAdded.call(null, widgetId, $xmlTable);
    };

    // Removes a spine chart symbol.
    iad.config.removeSymbol = function (widgetId, index)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        $xmlTable.find('Property#' + 'symbol_shape_' + index).remove();
        $xmlTable.find('Property#' + 'symbol_color_' + index).remove();
        $xmlTable.find('Property#' + 'symbol_size_' + index).remove();
        $xmlTable.find('Property#' + 'symbol_label_' + index).remove();
        $xmlTable.find('Property#' + 'symbol_value_' + index).remove();
        if (options && options.onPropertyRemoved) options.onPropertyRemoved.call(null, widgetId, $xmlTable);
    };

    // Adds a spine chart target.
    iad.config.addTarget = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var index = s4();
        prependProperty(widgetId, '<Property id="target_data_' + index + '" description="The data for target" name="Target 1 Data" type="string" value="value" />');
        prependProperty(widgetId, '<Property id="target_label_' + index + '" description="Label that will be associated with target" name="Target Label" type="string" value="Target Label" />');
        prependProperty(widgetId, '<Property id="target_size_' + index + '" description="Size that will be used for target" name="Target Size" type="integer" value="14" />');
        prependProperty(widgetId, '<Property id="target_color_' + index + '" description="Colour that will be used for target" name="Target Colour" type="colour" value="#999999" />');
        prependProperty(widgetId, '<Property id="target_shape_' + index + '" choices="circle;square;vertical line;plus;minus;x;diamond;star;triangle up;triangle down;triangle right;triangle left;arrow up;arrow down;arrow right;arrow left" description="Shape that will be used for target" name="Target Shape" type="string" value="vertical line" />');
        if (options && options.onPropertyAdded) options.onPropertyAdded.call(null, widgetId, $xmlTable);
    };

    // Removes a spine chart target.
    iad.config.removeTarget = function (widgetId, index)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        $xmlTable.find('Property#' + 'target_shape_' + index).remove();
        $xmlTable.find('Property#' + 'target_color_' + index).remove();
        $xmlTable.find('Property#' + 'target_size_' + index).remove();
        $xmlTable.find('Property#' + 'target_label_' + index).remove();
        $xmlTable.find('Property#' + 'target_data_' + index).remove();
        if (options && options.onPropertyRemoved) options.onPropertyRemoved.call(null, widgetId, $xmlTable);
    };

    // Adds a spine chart break.
    iad.config.addBreak = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var index = s4();
        prependProperty(widgetId, '<Property id="break_label_' + index + '" description="Label that will be associated with break" name="Break Label" type="string" value="Break Label" />');
        prependProperty(widgetId, '<Property id="break_color_' + index + '" description="Colour that will be used for break" name="Break Colour" type="colour" value="#e7e7e7" />');
        if (options && options.onPropertyAdded) options.onPropertyAdded.call(null, widgetId, $xmlTable);
    };

    // Removes a spine chart break.
    iad.config.removeBreak = function (widgetId, index)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        $xmlTable.find('Property#' + 'break_color_' + index).remove();
        $xmlTable.find('Property#' + 'break_label_' + index).remove();
        if (options && options.onPropertyRemoved) options.onPropertyRemoved.call(null, widgetId, $xmlTable);
    };

    // Adds a line to the prramid chart.
    iad.config.addPyramidLine = function (widgetId)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        var index = s4();        
        prependProperty(widgetId, '<Property id="line_value_' + index + '" description="Value that will be associated with the line" name="Line Value" type="string" value="value" />');
        prependProperty(widgetId, '<Property id="line_label_' + index + '" description="Label that will be associated with the line" name="Line Label" type="string" value="Line Label" />');
        prependProperty(widgetId, '<Property id="line_color_' + index + '" description="Colour that will be used for the line" name="Line Colour" type="colour" value="#999999" />');
        if (options && options.onPropertyAdded) options.onPropertyAdded.call(null, widgetId, $xmlComponent);
    };

    // Removes a line from the pyramid chart.
    iad.config.removePyramidLine = function (widgetId, index)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        $xmlComponent.find('Property#' + 'line_color_' + index).remove();
        $xmlComponent.find('Property#' + 'line_label_' + index).remove();
        $xmlComponent.find('Property#' + 'line_value_' + index).remove();
        if (options && options.onPropertyRemoved) options.onPropertyRemoved.call(null, widgetId, $xmlComponent);
    };

    // Append property xml to a component - this includes a fix for IE weirdness when appending xml.
    function appendProperty(widgetId, strXML)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        var xml = $($.parseXML(strXML)).find('Property');
        $xmlComponent.append(xml);
    }

    // Append property xml to a component - this includes a fix for IE weirdness when appending xml.
    function prependProperty(widgetId, strXML)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        var xml = $($.parseXML(strXML)).find('Property');
        $xmlComponent.prepend(xml);
    }

    function updateColumnName(columnName, attr, newValue)
    {
        var arrColumnName = columnName.split(',');
        var arrTxt;
        var index;
        for (var i = 0; i < arrColumnName.length; i++)
        {
            var txt = arrColumnName[i];
            if (txt.indexOf(attr) !== -1)
            {
                arrTxt = txt.split(':');
                arrTxt[1] = newValue;
                index = i;
                break;
            }
        }
        if (arrTxt !== undefined)
        {
            arrColumnName[index] = arrTxt.join(':');
            var outColumnName = arrColumnName.join(',');
            // Check bracket is at the end.
            if (outColumnName.slice(-1) !== ')') outColumnName += ')';
            return outColumnName;
        }
        else return columnName;
    }

    // Set a column attribute.
    iad.config.setColumnAttribute = function (widgetId, colIndex, attribute, newValue)
    {
        // Check for special values.
        // symbol(symbolValue:state,textValue:value,symbolAlign:right)
        // symbol(symbolValue:trend,symbolAlign:center)
        // health(symbolValue:significance,areaValue:value,nationalValue:national)

        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        var $column = $xmlWidget.find('Column').eq(colIndex);
        var columnName = $column.attr('name');

        if (attribute === 'name')
        {
            if (columnName.indexOf('health(') !== -1)
            {
                // health(symbolValue:significance,areaValue:value,nationalValue:national)
                // Replace areaValue with the newValue.
                newValue = updateColumnName(columnName, 'areaValue', newValue);
            }
            else if (columnName.indexOf('symbol(') !== -1) 
            {
                // symbol(symbolValue:state,textValue:value,symbolAlign:right)
                // Replace textValue with the newValue.
                newValue = updateColumnName(columnName, 'textValue', newValue);
            }
        }

        else if (attribute === 'symbol')
        {
            attribute = 'name';
            // Replace symbolValue with the newValue.
            newValue = updateColumnName(columnName, 'symbolValue', newValue);
        }
        else if (attribute === 'national') // health.
        {
            attribute = 'name';
            // Replace nationalValue with the newValue.
            newValue = updateColumnName(columnName, 'nationalValue', newValue);
        }

        // Set the new value;
        $column.attr(attribute, newValue);

        if (options && options.onWidgetPropertyChanged) options.onWidgetPropertyChanged.call(null, widgetId, $xmlWidget); // On widget changed.
    };

    // Generate a guid.
    function guid()
    {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    function s4()
    {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    // Map Palettes.

    // Gets the palette type - ColourRange or ColorScheme.
    iad.config.getPaletteType = function (paletteId)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var $xmlColorRange = $xmlMapPalettes.find('ColourRange[id="'+paletteId+'"]'); 
        if ($xmlColorRange.length)  return 'ColourRange';
        else                        return 'ColourScheme';
    };

    // Gets the ColourSchemes.
    iad.config.getColourSchemes = function ()
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        return $xmlMapPalettes.find('ColourScheme');
    };

    // Gets the ColourRanges.
    iad.config.getColourRanges = function ()
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        return $xmlMapPalettes.find('ColourRange');
    };

    // Gets the ColourScheme ids.
    iad.config.getColourSchemeIds = function ()
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        return $xmlMapPalettes.find('ColourScheme').map(function() {return $(this).attr('id');});
    };

    // Gets the ColourRange ids.
    iad.config.getColourRangeIds = function ()
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        return $xmlMapPalettes.find('ColourRange').map(function() {return $(this).attr('id');});
    };

    // Gets a ColorRange or ColorScheme.
    iad.config.getPalette = function (paletteId)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var $xmlColorRange = $xmlMapPalettes.find('ColourRange[id="'+paletteId+'"]');  // ColorRange.
        if ($xmlColorRange.length) {}
        else
            $xmlColorRange = $xmlMapPalettes.find('ColourScheme[id="'+paletteId+'"]'); // ColorScheme.

        return $xmlColorRange;
    };

    // Gets the colours for a map palette.
    iad.config.getPaletteColours = function (paletteId)
    {
        var $xmlColorRange = iad.config.getPalette(paletteId);
        return $xmlColorRange.children();
    };

    // Sets the colours for a map palette.
    iad.config.setPaletteColours = function (paletteId, arrColors)
    {
        var $xmlColorRange  = iad.config.getPalette(paletteId);
        var $xmlColors      = $xmlColorRange.find("Colour");
        $.each($xmlColors, function(i, xmlColor)
        {
            if (i < arrColors.length) $(xmlColor).text(ia.Color.toHex(arrColors[i]));
        });
    };

    // Sets a palette colour.
    iad.config.setPaletteColour = function (paletteId, colorIndex, color)
    {
        var xmlColor = iad.config.getPaletteColour(paletteId, colorIndex);
        $(xmlColor).text(ia.Color.toHex(color));
    };

    // Gets a palette colour.
    iad.config.getPaletteColour = function (paletteId, colorIndex)
    {
        var $xmlColorRange  = iad.config.getPalette(paletteId);
        var xmlColor        = $xmlColorRange.children()[colorIndex];
        return xmlColor;
    };

    // Adds a palette colour.
    iad.config.addPaletteColour = function (paletteId, color)
    {
        var paletteType     = iad.config.getPaletteType(paletteId);
        var $xmlColorRange  = iad.config.getPalette(paletteId);
        var $xmlColor, strXML;
        if (paletteType === 'ColourRange')   // ColorRange.
        {
            strXML = '<Colour>'+ia.Color.toHex(color)+'</Colour>';
            $xmlColor = $($.parseXML(strXML)).find('Colour');   // Weird way of inserting xml was required for IE to work.
        }
        else
        {
            strXML = '<ColourMatch for="__next">'+ia.Color.toHex(color)+'</ColourMatch>';
            $xmlColor = $($.parseXML(strXML)).find('ColourMatch'); 
        }
        $xmlColorRange.append($xmlColor);
    };

    // Removes a palette colour.
    iad.config.removePaletteColour = function (paletteId, colorIndex)
    {
        var xmlColor = iad.config.getPaletteColour(paletteId, colorIndex);
        $(xmlColor).remove();
    };

    // Sets a palette colour 'for' value.
    iad.config.setPaletteForValue = function (paletteId, colorIndex, forValue)
    {
        var xmlColor = iad.config.getPaletteColour(paletteId, colorIndex);
        $(xmlColor).attr('for', forValue);
    };

    // Adds a new ColourRange.
    iad.config.addColourRange = function ()
    {
        var paletteId = guid();
        var arrColors = ['#ffffff', '#cccccc', '#000000'];

        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var strXML = '<ColourRange id="'+paletteId+'"></ColourRange>';
        var  $xmlColourRange = $($.parseXML(strXML)).find('ColourRange'); 
        $xmlMapPalettes.prepend($xmlColourRange);

        for (var i = 0; i < arrColors.length; i++)
        {
            iad.config.addPaletteColour(paletteId, ia.Color.toHex(arrColors[i]));
        }
        if (options && options.onColourRangeAdded) options.onColourRangeAdded.call(null);
    };

    // Adds a new ColorScheme.
    iad.config.addColourScheme = function ()
    {
        var paletteId = guid();
        var arrColors = ['#ffffff', '#cccccc', '#000000'];

        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var strXML = '<ColourScheme id="'+paletteId+'"></ColourScheme >';
        var  $xmlColourScheme = $($.parseXML(strXML)).find('ColourScheme'); 
        $xmlMapPalettes.prepend($xmlColourScheme);

        for (var i = 0; i < arrColors.length; i++)
        {
            iad.config.addPaletteColour(paletteId, ia.Color.toHex(arrColors[i]));
        }
        if (options && options.onColourSchemeAdded) options.onColourSchemeAdded.call(null);
    };

    // Sets the given palette as the default colour range.
    iad.config.setDefaultColourRange = function (paletteId)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        $xmlMapPalettes.attr('default', paletteId);    
    };

    // Sets the given palette as the default colour scheiad.config.
    iad.config.setDefaultColourScheme = function (paletteId)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        
        // Prepend selected xml ColorScheme so its used as the default categoric legend.
        var $xmlColorRange = iad.config.getPalette(paletteId);
        $xmlMapPalettes.prepend($xmlColorRange);
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
