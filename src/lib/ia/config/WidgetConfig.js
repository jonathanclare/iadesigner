/** 
 * Provides basic configuration information for report widgets.
 * These are Components, Tables, Buttons, Text and Images.
 *
 * @author J Clare
 * @class ia.WidgetConfig
 * @constructor
 * @param {XML} xml The XML data that describes the widget.
 */
ia.WidgetConfig = function(xml)
{
	this.xml = xml;
	this._parseWidgetXML(xml);
};

/** 
 * The raw xml data describing the object.
 *
 * @property xml
 * @type XML
 */
ia.WidgetConfig.prototype.xml;

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */	
ia.WidgetConfig.prototype.parseXML = function(xml) 
{
	this._parseWidgetXML(xml);
};

/** 
 * Protected method to be used by subclasses when parsing xml.  
 *
 * @method _parseButtonXML
 * @param {XML} xml The xml data.
 * @protected
 */	
ia.WidgetConfig.prototype._parseWidgetXML = function(xml) 
{
	var me = this;
	me.xml = xml;

	// Default settings
	this.anchor = "left";
	this.visible = true;

	// Read in attributes as properties of this object.
	$j.each(xml.attributes, function(i, attrib)
	{ 
		me[attrib.name] = attrib.value; 
		if (attrib.name == 'zIndex') me.zIndex = attrib.value;
	});
	
	// Read in any properties that exist.
	me.properties = {}; // Hashtable to hold properties, properties[propertyId] = property.
	var $properties = $j(xml).find("Property");
	$j.each($properties, function(i, xmlProperty)
	{
		// Create each property and add to the hashtable.
		var prop = new ia.PropertyConfig(xmlProperty, me);
		me.properties[prop.id] = prop;

		// Catch the z-index for components and tables.
		if (prop.id == 'zIndex') me.zIndex = prop.value;

		// Catch the visibility for components and tables.
		if (prop.id == 'visible') me.visible = prop.value;
	});

	// Resize dimensions from 800*600 to 100*100 then round to one dp.
	if (this.x != undefined) 
	{
		this.x = (parseFloat(this.x) / 800) * 100;
		this.x = Math.round(this.x * 10) / 10;
	}
	if (this.y != undefined)
	{
		this.y = (parseFloat(this.y) / 600) * 100;
		this.y = Math.round(this.y * 10) / 10;
	}
	if (this.rescale == 'false') // Images.
	{
		this.width = parseFloat(this.width);
		this.height = parseFloat(this.height);
	}
	else
	{
		if (this.width != undefined)
		{
			this.width = (parseFloat(this.width) / 800) * 100;
			this.width = Math.round(this.width * 10) / 10;
		}
		if (this.height != undefined)
		{
			this.height = (parseFloat(this.height) / 600) * 100;
			this.height = Math.round(this.height * 10) / 10;
		}
	}

	// IE9 converts node names to uppercase when local so just make them all lowercase.
	this.type = xml.nodeName.toLowerCase();
};

/** 
 * The raw XML data describing the widget.
 *
 * @property xml
 * @type XML
 */
ia.WidgetConfig.prototype.xml;

/** 
 * The widget node type 'component', 'table', 'button', 'text' or 'image'.
 *
 * @property type
 * @type String
 */
ia.WidgetConfig.prototype.type;

/** 
 * The widgets properties, properties[propertyId] = property.
 *
 * @property properties
 * @type Associative Array
 */
ia.WidgetConfig.prototype.properties;

/** 
 * Returns the widgets properties. 
 *
 * @method getProperties
 * @return {Associative Array} properties[propertyId] = property.
 */	
ia.WidgetConfig.prototype.getProperties = function() {return this.properties;};

/** 
 * Gets the value for the property with the given id.
 *
 * @method getProperty
 * @param {String} id The property id.
 * @return {Number|String} The property value.
 */
ia.WidgetConfig.prototype.getProperty = function(id) 
{
	var prop = this.properties[id];
	if (prop) return prop.value;
	else return undefined;
};

/** 
 * Sets the value for the property with the given id.
 * 
 * @method setProperty
 * @param {String} id The property id.
 * @param {Number|String} value The property value.
 * @param {Boolean} castValue Indicates the value is a string and needs to be cast to the correct data type.
 */
ia.WidgetConfig.prototype.setProperty = function(id, value, castValue) 
{
	var prop = this.properties[id];
	if (prop) 
	{
		if (castValue) prop.value = prop.castValue(value);
		else prop.value = value;
	}
};

/** 
 * Get the value for a widget attribute.
 *
 * @method getAttribute
 * @param {String} attribute The attribute.
 * @return {Number|String} The attribute value.
 */
ia.WidgetConfig.prototype.getAttribute = function(attribute)
{
    return $j(this.xml).attr(attribute);
};