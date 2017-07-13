var designer = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.config = iad.config || {};

    // A reference the the actual xml.
    var xmlConfig, $xmlConfig;

    // Passed in options.
    var options;

    // Initialise.
    iad.config.init = function (o)
    {
        options = o;
        xmlConfig = options.report.config.xml;
        $xmlConfig = $(xmlConfig);
    };

    // Load a report.
    iad.config.loadReport = function (dirPath, callbackFunction)
    {
        // Params for IA report.
        var o = 
        {
            data:
            {
                config      : {source:dirPath+'/config.xml'},
                attribute   : {source:dirPath+'/data.js'},
                map         : {source:dirPath+'/map.js'}
               /*style       : {source:dirPath+'/default.css'}*/
            }
        };
        ia.update(o, function() 
        {
            onConfigLoaded(callbackFunction);
        });
    };

    // load a config file.
    iad.config.loadConfig = function (configPath, callbackFunction)
    {
        // Load in the config.
        ia.loadConfig(configPath, function ()
        {
            onConfigLoaded(callbackFunction);
        });
    };

    // Parse the config xml.
    iad.config.parseConfig = function (configXml, callbackFunction)
    {
        // Parse in the config.
        ia.parseConfig(configXml, function ()
        {
            onConfigLoaded(callbackFunction);
        });
    };

    // Update the config xml.
    iad.config.refreshConfig = function (callbackFunction)
    {
        // Parse in the config.
        ia.parseConfig(xmlConfig, function ()
        {
            // Update the xml objects
            xmlConfig = options.report.config.xml;
            $xmlConfig = $(xmlConfig);
            if (options && options.onConfigChanged) options.onConfigChanged.call(null);
            if (callbackFunction) callbackFunction.call(null); // Return.
        });
    };

    function onConfigLoaded(callbackFunction)
    {
        // Update the xml objects
        xmlConfig = options.report.config.xml;
        $xmlConfig = $(xmlConfig);

        if (options && options.onConfigLoaded) options.onConfigLoaded.call(null); // On config changed.
        if (options && options.onConfigChanged) options.onConfigChanged.call(null);
        if (callbackFunction) callbackFunction.call(null); // Return.
    }

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
        var widget = options.report.getWidget(widgetId);
        var tagName = $xmlWidget.prop('tagName');

        if (tagName === 'Button' || tagName === 'Image' || tagName === 'Text')
        {
            $xmlWidget.remove();
            options.report.config.removeWidget(widget.id);
            options.report.removeWidget(widget.id);
        }
        else if (tagName === 'Component' || tagName === 'Table')
        {
            $xmlWidget.attr('visible', false);
            widget.container.hide();
        }

        if (options && options.onWidgetRemoved) options.onWidgetRemoved.call(null, widgetId); // On widget removed.
        if (options && options.onConfigChanged) options.onConfigChanged.call(null);
    };

    // On widget added.
    function onWidgetAdded(widgetId)
    {
        if (options && options.onWidgetAdded) options.onWidgetAdded.call(null, widgetId); // On widget added.
        if (options && options.onConfigChanged) options.onConfigChanged.call(null);
    }

    // Adds a widget.
    iad.config.addWidget = function (widgetId)
    {
        if (widgetId === 'Button')
        {
            widgetId = guid();
            addButton(widgetId);
            onWidgetAdded(widgetId);
        }
        else if (widgetId === 'Image')
        {
            widgetId = guid();
            addImage(widgetId);
            onWidgetAdded(widgetId);
        }
        else if (widgetId === 'Text')
        {
            widgetId = guid();
            addText(widgetId);
            onWidgetAdded(widgetId);
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

        // Check if its already been built and added.
        var widget = options.report.getWidget(widgetId);
        if (widget !== undefined)
        {
            widget.container.show();
            onWidgetAdded(widgetId);
        }
        else
        {
            var tagName = $xmlWidget.prop('tagName');

            var config;
            if (tagName === 'Table') config = options.report.config.addTable($xmlWidget.get(0));
            else config = options.report.config.addComponent($xmlWidget.get(0));

            widget = new ia.Panel(widgetId);
            options.report.addPanel(widget, config);

            // These components require a full update because more data may need to be read in for them to work.
            if (widgetId.indexOf('featureCard') !== -1 || 
                widgetId.indexOf('pyramidChart') !== -1 || 
                widgetId.indexOf('spineChart') !== -1 || 
                widgetId.indexOf('radarChart') !== -1 || 
                widgetId.indexOf('areaBreakdownBarChart') !== -1 || 
                widgetId.indexOf('areaBreakdownPieChart') !== -1)
            {
                iad.config.refreshConfig(function()
                {
                    // Build.
                    var factory = options.report.getComponent('factory');
                    factory.build(widgetId, function ()
                    {
                        onWidgetAdded(widgetId);
                    });
                });
            }
            else 
            {
                // Build.
                var factory = options.report.getComponent('factory');
                factory.build(widgetId, function ()
                {
                    onWidgetAdded(widgetId);
                });
            }
        }
    }

    // Adds a button.
    function addButton(widgetId)
    {
        var zIndex = iad.config.getMaxZIndex() + 1;
        var strXML = '<Button id="' + widgetId + '" zIndex="' + zIndex + '" text="My Button" href="" tooltip="" x="0" y="0" width="200" height="50" editable="true" moveable="true" removeable="true" resizeable="true"/>';
        var xml = $($.parseXML(strXML)).find('Button'); // Weird way of inserting xml was required for IE to work.
        $xmlConfig.find('AtlasInterface').append(xml);

        var config = options.report.config.addButton(xml.get(0));
        var widget = new ia.Button(widgetId);
        options.report.addButton(widget, config);
    }

    // Adds text.
    function addText(widgetId)
    {
        var zIndex = iad.config.getMaxZIndex() + 1;
        var text = 'My Text';
        var strXML = '<Text id="' + widgetId + '" zIndex="' + zIndex + '" anchor="start" editable="true" fill="#000000" font-family="Arial" font-size="24" font-style="normal" font-weight="bold" href="" moveable="true" removeable="true" resizeable="true" rotate="0" target="_blank" wrap-width="100" x="0" y="0">' + text + '</Text>';
        var xml = $($.parseXML(strXML)).find('Text'); // Weird way of inserting xml was required for IE to work.
        $xmlConfig.find('AtlasInterface').append(xml);

        var config = options.report.config.addText(xml.get(0));
        var widget = new ia.Text(widgetId);
        options.report.addText(widget, config);
    }

    // Adds an image.
    function addImage(widgetId)
    {
        var zIndex = iad.config.getMaxZIndex() + 1;
        var strXML = '<Image id="' + widgetId + '" zIndex="' + zIndex + '" rescale="true" anchor="left" src="./image_placeholder.png" href="" target="_blank" x="0" y="0" width="150" height="150" moveable="true" editable="true" removeable="true" resizeable="true"/>';
        var xml = $($.parseXML(strXML)).find('Image'); // Weird way of inserting xml was required for IE to work.
        $xmlConfig.find('AtlasInterface').append(xml);

        var config = options.report.config.addImage(xml.get(0));
        var widget = new ia.Image(widgetId, "./image_placeholder.png");
        options.report.addImage(widget, config);
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
    iad.config.setGroupProperty = function (widgetId, propertyId, value)
    {
        // Set the new property value.
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length)
        {
            var $xmlProperty = $xmlWidget.find('Property#' + propertyId);
            if ($xmlProperty.length)
            {
                $xmlProperty.attr('value', value);
                if (options && options.onGroupPropertyChanged) options.onGroupPropertyChanged.call(null, widgetId, propertyId); // On group property changed.
                if (options && options.onConfigChanged) options.onConfigChanged.call(null);
            }
        }
    };

    // Get the value for a group property.
    iad.config.getGroupProperty = function (widgetId, propertyId)
    {
       return iad.config.getWidgetProperty(widgetId, propertyId);
    };

    // On widget changed.
    function onWidgetChanged(widgetId, type)
    {
        // Get the widget xml.
        var $xmlWidget = iad.config.getWidgetXml(widgetId);

        // Update the widget config.
        var config = iad.config.getWidgetConfig(widgetId);
        config.parseXML($xmlWidget.get(0));

        // Update the widget.
        var widget = options.report.getWidget(widgetId);
        widget.update(config);

        // Update any dynamic text that may have changed.
        options.report.updateDynamicText(options.report.textSubstitution);

        // Update and render the widget.
        var factory = options.report.getComponent('factory');
        factory.update(widgetId, function ()
        {
            factory.render(widgetId, function ()
            {
                //iad.config.showWidget(widgetId);
                if (options && options.onWidgetChanged) options.onWidgetChanged.call(null, widgetId, type); // On widget changed.
                if (options && options.onConfigChanged) options.onConfigChanged.call(null);
            });
        });
    }

    // Sets the widget dimensions.
    iad.config.setWidgetDimensions = function (widgetId, x, y, w, h)
    {
        var $xmlWidget = iad.config.getWidgetXml(widgetId);
        if ($xmlWidget.length)
        {
            if (x !== undefined) $xmlWidget.attr('x', Math.round((x / 100) * 800));
            if (y !== undefined) $xmlWidget.attr('y', Math.round((y / 100) * 600));
            if (w !== undefined && $xmlWidget.attr('width') !== undefined) $xmlWidget.attr('width', Math.round((w / 100) * 800));
            if (w !== undefined && $xmlWidget.attr('wrap-width') !== undefined) $xmlWidget.attr('wrap-width', Math.round((w / 100) * 800));
            if (h !== undefined && $xmlWidget.attr('height') !== undefined) $xmlWidget.attr('height', Math.round((h / 100) * 600));

            onWidgetChanged(widgetId); // On widget changed.
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

                onWidgetChanged(widgetId); // On widget changed.
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

            onWidgetChanged(widgetId); // On widget changed.
        }
    };

    // Gets the config object for the widget.
    iad.config.getWidgetConfig = function(widgetId)
    {
        var config = options.report.config.getWidget(widgetId);
        return config;
    };

    // Bring the widget to the front.
    iad.config.bringToFront = function(widgetId)
    {
        if (iad.config.getWidgetAttribute(widgetId, 'zIndex') !== undefined)
            iad.config.setWidgetAttribute(widgetId, 'zIndex', iad.config.getMaxZIndex() + 1);
        else
            iad.config.setWidgetProperty(widgetId, 'zIndex', iad.config.getMaxZIndex() + 1);


        if (options && options.onZIndexChanged) options.onZIndexChanged.call(null, widgetId); // On widget brought to front.
        if (options && options.onConfigChanged) options.onConfigChanged.call(null);
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
            if (zIndex) 
            {
                var id = $xmlWidget.attr('id');
                if (id === widgetId) 
                    iad.config.setWidgetAttribute(id, 'zIndex', minZIndex);
                else 
                    iad.config.setWidgetAttribute(id, 'zIndex', ia.parseInt(zIndex) + 1);
            }
        });

        if (options && options.onZIndexChanged) options.onZIndexChanged.call(null, widgetId); // On widget sent to back.
        if (options && options.onConfigChanged) options.onConfigChanged.call(null);
    };

    // Show a widget whose visibility is set to hidden.
    iad.config.showWidget = function(widgetId)
    {
        var panel = options.report.getPanel(widgetId);
        if (panel !== undefined)
        {
            var popup = iad.config.getWidgetProperty(widgetId, 'isPopUp');
            var vis = iad.config.getWidgetProperty(widgetId, 'visible');
            if (popup === 'true' || vis === 'false')
            {
                panel.popup(false);
                if (!panel.visible()) panel.visible(true);
            }
        }
    };

    // Hide a widget whose visibility is set to hidden.
    iad.config.hideWidget = function(widgetId)
    {
        var panel = options.report.getPanel(widgetId);
        if (panel !== undefined)
        {
            var popup = iad.config.getWidgetProperty(widgetId, 'isPopUp');
            var vis = iad.config.getWidgetProperty(widgetId, 'visible');
            if (popup === 'true' || vis === 'false')
            {
                var config = iad.config.getWidgetConfig(widgetId);
                var widget = options.report.getWidget(widgetId);
                widget.update(config);
            }
        }
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
        appendProperty(widgetId, '<Property id="menuItem' + index + '" description="The label for the menu item" name="Menu Item" type="string" value="New Item" />');
        appendProperty(widgetId, '<Property id="menuFunc' + index + '" description="The function or url for the menu item" name="Menu Function" type="string" value="" />');

        onWidgetChanged(widgetId, 'property-added'); // On widget changed.
    };

    // Removes a menu item.
    iad.config.removeMenuItem = function (widgetId, index)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        $xmlComponent.find('Property#' + 'menuItem' + index).remove();
        $xmlComponent.find('Property#' + 'menuFunc' + index).remove();

        onWidgetChanged(widgetId, 'property-removed'); // On widget changed.
    };

    // Adds a table column.
    iad.config.addColumn = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var strXML = '<Column alias="My Column" name="value" width="0.25" />';
        var xml = $($.parseXML(strXML)).find('Column');
        $xmlTable.append(xml);

        onWidgetChanged(widgetId, 'column-changed'); // On widget changed.
    };

    // Removes a stable column.
    iad.config.removeColumn = function (widgetId, index)
    {
        var $column = iad.config.getWidgetXml(widgetId).find('Column').eq(index);
        $column.remove();

        onWidgetChanged(widgetId, 'column-changed'); // On widget changed.
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
        onWidgetChanged(widgetId, 'column-changed'); // On widget changed.
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
        appendProperty(widgetId, '<Property id="symbol_shape_' + index + '" choices="circle;square;vertical line;plus;minus;x;diamond;star;triangle up;triangle down;triangle right;triangle left;arrow up;arrow down;arrow right;arrow left" description="Shape that will be used for symbol"  name="Symbol Shape" type="string" value="circle" />');
        appendProperty(widgetId, '<Property id="symbol_color_' + index + '" description="Colour that will be used for symbol" name="Symbol Colour" type="colour" value="#999999" />');
        appendProperty(widgetId, '<Property id="symbol_size_' + index + '" description="Size that will be used for symbol" name="Symbol Size" type="integer" value="14" />');
        appendProperty(widgetId, '<Property id="symbol_label_' + index + '" description="Label that will be associated with symbol" name="Symbol Label" type="string" value="Symbol Label" />');
        appendProperty(widgetId, '<Property id="symbol_value_' + index + '" description="Value that will be associated with symbol" name="Symbol Value" type="string" value="--" />');

        onWidgetChanged(widgetId, 'property-added'); // On widget changed.
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

        onWidgetChanged(widgetId, 'property-removed'); // On widget changed.
    };

    // Adds a spine chart target.
    iad.config.addTarget = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var index = s4();
        appendProperty(widgetId, '<Property id="target_shape_' + index + '" choices="circle;square;vertical line;plus;minus;x;diamond;star;triangle up;triangle down;triangle right;triangle left;arrow up;arrow down;arrow right;arrow left" description="Shape that will be used for target" name="Target Shape" type="string" value="vertical line" />');
        appendProperty(widgetId, '<Property id="target_color_' + index + '" description="Colour that will be used for target" name="Target Colour" type="colour" value="#999999" />');
        appendProperty(widgetId, '<Property id="target_size_' + index + '" description="Size that will be used for target" name="Target Size" type="integer" value="14" />');
        appendProperty(widgetId, '<Property id="target_label_' + index + '" description="Label that will be associated with target" name="Target Label" type="string" value="Target Label" />');
        appendProperty(widgetId, '<Property id="target_data_' + index + '" description="The data for target" name="Target 1 Data" type="string" value="value" />');

        onWidgetChanged(widgetId, 'property-added'); // On widget changed.
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

        onWidgetChanged(widgetId, 'property-removed'); // On widget changed.
    };

    // Adds a spine chart break.
    iad.config.addBreak = function (widgetId)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        var index = s4();
        appendProperty(widgetId, '<Property id="break_color_' + index + '" description="Colour that will be used for break" name="Break Colour" type="colour" value="#e7e7e7" />');
        appendProperty(widgetId, '<Property id="break_label_' + index + '" description="Label that will be associated with break" name="Break Label" type="string" value="Break Label" />');

        onWidgetChanged(widgetId, 'property-added'); // On widget changed.
    };

    // Removes a spine chart break.
    iad.config.removeBreak = function (widgetId, index)
    {
        var $xmlTable = iad.config.getWidgetXml(widgetId);
        $xmlTable.find('Property#' + 'break_color_' + index).remove();
        $xmlTable.find('Property#' + 'break_label_' + index).remove();

        onWidgetChanged(widgetId, 'property-removed'); // On widget changed.
    };

    // Adds a line to the prramid chart.
    iad.config.addPyramidLine = function (widgetId)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        var index = s4();
        appendProperty(widgetId, '<Property id="line_color_' + index + '" description="Colour that will be used for the line" name="Line Colour" type="colour" value="#999999" />');
        appendProperty(widgetId, '<Property id="line_label_' + index + '" description="Label that will be associated with the line" name="Line Label" type="string" value="Line Label" />');
        appendProperty(widgetId, '<Property id="line_value_' + index + '" description="Value that will be associated with the line" name="Line Value" type="string" value="value" />');

        onWidgetChanged(widgetId, 'property-added'); // On widget changed.
    };

    // Removes a line from the pyramid chart.
    iad.config.removePyramidLine = function (widgetId, index)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        $xmlComponent.find('Property#' + 'line_color_' + index).remove();
        $xmlComponent.find('Property#' + 'line_label_' + index).remove();
        $xmlComponent.find('Property#' + 'line_value_' + index).remove();

        onWidgetChanged(widgetId, 'property-removed'); // On widget changed.
    };

    // Append property xml to a component - this includes a fix for IE weirdness when appending xml.
    function appendProperty(widgetId, strXML)
    {
        var $xmlComponent = iad.config.getWidgetXml(widgetId);
        var xml = $($.parseXML(strXML)).find('Property');
        $xmlComponent.append(xml);
    }

    // Set a column attribute.
    iad.config.setColumnProperty = function (controlId, widgetId, colIndex, attribute, newValue)
    {
        // Check for symbol values in profiles.
        // symbol(symbolValue:state,textValue:value,symbolAlign:right)
        // symbol(symbolValue:trend,symbolAlign:center)
        // health(symbolValue:significance,areaValue:value,nationalValue:national)

        var symbolId, symbolValue, nameId, nameValue, nationalId, nationalValue;

        if (attribute === 'name')
        {
            nameValue = newValue;
            symbolId = controlId.replace("~name", "~symbol");
            symbolValue = $('*[id="' + symbolId + '"]').val();

            if (symbolValue !== undefined) // This will filter out normal tables.
            {
                nationalId = controlId.replace("~name", "~national");
                nationalValue = $('*[id="' + nationalId + '"]').val();

                if (nationalValue !== undefined) // health.
                {
                    newValue = 'health(symbolValue:' + symbolValue + ',areaValue:' + nameValue + ',nationalValue:' + nationalValue + ')';
                }
                else
                {
                    if (nameValue !== '' && symbolValue !== '') newValue = 'symbol(symbolValue:' + symbolValue + ',textValue:' + nameValue + ',symbolAlign:right)';
                    else if (symbolValue !== '') newValue = 'symbol(symbolValue:' + symbolValue + ',symbolAlign:center)';
                    else newValue = nameValue;
                }
            }
        }
        else if (attribute === 'symbol')
        {
            attribute = 'name';
            symbolValue = newValue;

            nameId = controlId.replace("~symbol", "~name");
            nameValue = $('*[id="' + nameId + '"]').val();
            nationalId = controlId.replace("~symbol", "~national");
            nationalValue = $('*[id="' + nationalId + '"]').val();

            if (nationalValue !== undefined) // health.
            {
                newValue = 'health(symbolValue:' + symbolValue + ',areaValue:' + nameValue + ',nationalValue:' + nationalValue + ')';
            }
            else
            {
                if (nameValue !== '' && symbolValue !== '') newValue = 'symbol(symbolValue:' + symbolValue + ',textValue:' + nameValue + ',symbolAlign:right)';
                else if (symbolValue !== '') newValue = 'symbol(symbolValue:' + symbolValue + ',symbolAlign:center)';
                else newValue = nameValue;
            }
        }
        else if (attribute === 'national') // health.
        {
            attribute = 'name';
            nationalValue = newValue;

            nameId = controlId.replace("~national", "~name");
            nameValue = $('*[id="' + nameId + '"]').val();
            symbolId = controlId.replace("~national", "~symbol");
            symbolValue = $('*[id="' + symbolId + '"]').val();


            newValue = 'health(symbolValue:' + symbolValue + ',areaValue:' + nameValue + ',nationalValue:' + nationalValue + ')';
        }

        var $column = iad.config.getWidgetXml(widgetId).find('Column').eq(colIndex);
        $column.attr(attribute, newValue);

        onWidgetChanged(widgetId); // On widget changed.
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

    // Gets the palette type - ColourRange or ColorScheiad.config.
    iad.config.getPaletteType = function (paletteId)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var $xmlColorRange = $xmlMapPalettes.find('ColourRange[id="'+paletteId+'"]'); 
        if ($xmlColorRange.length)  return 'ColourRange';
        else                        return 'ColourScheme';
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

    // Gets a ColorRange or ColourScheiad.config.
    iad.config.getColourRange = function (paletteId)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var $xmlColorRange = $xmlMapPalettes.find('ColourRange[id="'+paletteId+'"]');  // ColorRange.
        if ($xmlColorRange.length) {}
        else
            $xmlColorRange = $xmlMapPalettes.find('ColourScheme[id="'+paletteId+'"]'); // ColorScheiad.config.

        return $xmlColorRange;
    };

    // Gets a palette colour.
    iad.config.getPaletteColour = function (paletteId, colorIndex)
    {
        var $xmlColorRange  = iad.config.getColourRange(paletteId);
        var xmlColor        = $xmlColorRange.children()[colorIndex];
        return xmlColor;
    };

    // Sets a palette colour.
    iad.config.setPaletteColour = function (paletteId, colorIndex, color)
    {
        var xmlColor = iad.config.getPaletteColour(paletteId, colorIndex);
        $(xmlColor).text(ia.Color.toHex(color));
    };

    // Sets a palette colour 'for' value.
    iad.config.setPaletteForValue = function (paletteId, colorIndex, forValue)
    {
        var xmlColor = iad.config.getPaletteColour(paletteId, colorIndex);
        $(xmlColor).attr('for', forValue);
    };

    // Adds a palette colour.
    iad.config.addPaletteColour = function (paletteId, color)
    {
        var paletteType     = iad.config.getPaletteType(paletteId);
        var $xmlColorRange  = iad.config.getColourRange(paletteId);
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

    // Adds a new ColourRange.
    iad.config.addColourRange = function (paletteId, arrColors)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var $xmlColorRange  = iad.config.getColourRange(paletteId);
        if ($xmlColorRange.length)  // Palette already exists so empty it.
        {
            $xmlColorRange.empty();
        }
        else                        // Create a new palette.                
        {
            var strXML = '<ColourRange id="'+paletteId+'"></ColourRange>';
            var  $xmlColourRange = $($.parseXML(strXML)).find('ColourRange'); 
            $xmlMapPalettes.prepend($xmlColourRange);
        }
        for (var i = 0; i < arrColors.length; i++)
        {
            iad.config.addPaletteColour(paletteId, ia.Color.toHex(arrColors[i]));
        }
    };

    // Updates a ColourRange with new colors.
    iad.config.updateConfigColourRange = function (paletteId, arrColors)
    {
        var $xmlColorRange  = iad.config.getColourRange(paletteId);
        var $xmlColors      = $xmlColorRange.find("Colour");
        $.each($xmlColors, function(i, xmlColor)
        {
            if (i < arrColors.length) $(xmlColor).text(ia.Color.toHex(arrColors[i]));
        });
    };

    // Adds a new ColourScheiad.config.
    iad.config.addColourScheme = function (paletteId, arrColors)
    {
        var $xmlMapPalettes = $xmlConfig.find('MapPalettes');
        var $xmlColorRange  = iad.config.getColourRange(paletteId);
        if ($xmlColorRange.length)  // Palette already exists so empty it.
        {
            $xmlColorRange.empty();
        }
        else                        // Create a new palette.                
        {
            var strXML = '<ColourScheme id="'+paletteId+'"></ColourScheme >';
            var  $xmlColourRange = $($.parseXML(strXML)).find('ColourScheme'); 
            $xmlMapPalettes.prepend($xmlColourRange);
        }
        for (var i = 0; i < arrColors.length; i++)
        {
            iad.config.addPaletteColour(paletteId, ia.Color.toHex(arrColors[i]));
        }
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
        var $xmlColorRange = iad.config.getColourRange(paletteId);
        $xmlMapPalettes.prepend($xmlColorRange);
    };

    return iad;

})(designer || {}, jQuery, window, document);
