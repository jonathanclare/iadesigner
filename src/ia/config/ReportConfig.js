/** 
 * Used to load and parse a config.xml file.
 *
 * @author J Clare
 * @class ia.ReportConfig
 * @constructor
 * @param {String} source The url for the config.xml file.
 */
ia.ReportConfig = function() {};

/** 
 * The raw xml data describing the object.
 *
 * @property xml
 * @type XML
 */
ia.ReportConfig.prototype.xml;

/** 
 * Loads in a source file containing the configuration xml.
 *
 * @method loadSource
 * @param {String} url The url to the data. 
 * @param {Function} callbackFunction The call back function. 
 */
ia.ReportConfig.prototype.loadSource = function(url, callbackFunction) 
{
	var me = this;
	ia.File.load(
	{
		url: url,
		dataType: "xml", 
		onSuccess:function(xml)
		{
			me.parseXML(xml, callbackFunction);
		}
	});
};

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 * @param {Function} callbackFunction The call back function. 
 */	
ia.ReportConfig.prototype.parseXML = function(xml, callbackFunction) 
{
	var me = this;

	me.xml = xml;
	var $xml = $j(xml);

	// Read in AtlasInterface attributes as properties of this object.
	var xmlAtlasInterface = $xml.find("AtlasInterface").get(0);
	$j.each(xmlAtlasInterface.attributes, function(i, attrib)
	{ 
		me[attrib.name] = attrib.value; 
	});
	
	// For AGOL.
	var index = me.template.indexOf("::arcgisonline")
	if (index != -1) me.template = me.template.substring(0, index);

	me._componentArray = [];
	me._componentHash = {};

	// Comparison Tables - make sure comparison tables are first so comparison area palette is applied correctly to charts.
	var $xmlTables = $xml.find("Table[id^=comparisonTable]");
	$j.each($xmlTables, function(i, xmlTable)
	{
		// Check the tables visible.
		// It could be still in the config file if it
		// hasnt been processed in the designer.
		// ie When the atlas is first published.
		if ($j(xmlTable).attr("visible") == "true")
		{
			var c = new ia.TableConfig(xmlTable);
			me._componentArray[me._componentArray.length] = c;
			me._componentHash[c.id] = c;
		}
	});

	// Components.
	var $xmlComponents = $xml.find("Component");
	$j.each($xmlComponents, function(i, xmlComponent)
	{
		// Check the components visible.
		// It could be still in the config file if it
		// hasnt been processed in the designer.
		// ie When the atlas is first published.
		if ($j(xmlComponent).attr("visible") == "true")
		{
			var c = new ia.ComponentConfig(xmlComponent);
			me._componentArray[me._componentArray.length] = c;
			me._componentHash[c.id] = c;
		}
	});

	// Data tables and profiles - Add these after components so area profiles can pick up bar colour from feature legend.
	var $xmlTables = $xml.find("Table").not("[id^=comparisonTable]");
	$j.each($xmlTables, function(i, xmlTable)
	{
		// Check the tables visible.
		// It could be still in the config file if it
		// hasnt been processed in the designer.
		// ie When the atlas is first published.
		if ($j(xmlTable).attr("visible") == "true")
		{
			var c = new ia.TableConfig(xmlTable);
			me._componentArray[me._componentArray.length] = c;
			me._componentHash[c.id] = c;
		}
	});

	// Property Groups.
	me.properties = {};
	var $xmlGroups = $xml.find("PropertyGroup");
	$j.each($xmlGroups, function(i, xmlPropertyGroup)
	{
		var $properties = $j(xmlPropertyGroup).find("Property");
		$j.each($properties, function(j, propertyXml)
		{
			var p = new ia.PropertyConfig(propertyXml, me);
			me.properties[p.id] = p;
		});
	});

	// Buttons.
	me._buttonArray = [];
	me._buttonHash = {};
	var $xmlButtons = $xml.find("Button");
	$j.each($xmlButtons, function(i, xmlButton)
	{
		var c = new ia.ButtonConfig(xmlButton);
		me._buttonArray[me._buttonArray.length] = c;
		me._buttonHash[c.id] = c;
	});

	// Text.
	me._textArray = [];
	me._textHash = {};
	var $xmlTexts = $xml.find("Text");
	$j.each($xmlTexts, function(i, xmlText)
	{
		var c = new ia.TextConfig(xmlText);
		me._textArray[me._textArray.length] = c;
		me._textHash[c.id] = c;
	});

	// Images.
	me._imageArray = [];
	me._imageHash = {};
	var $xmlImages = $xml.find("Image");
	$j.each($xmlImages, function(i, xmlImage)
	{
		var c = new ia.ImageConfig(xmlImage);
		me._imageArray[me._imageArray.length] = c;
		me._imageHash[c.id] = c;
	});
	
	// ia.Map Palettes.
	me._palette = new ia.PaletteConfig($xml.find("MapPalettes"), me.getProperty("noDataColor"), me.getProperty("noDataValue"));

	callbackFunction.call(null, me); // Return.
};

/** 
 * Removes a widget.  
 *
 * @method removeWidget
 * @param {String} id The id.
 */	
ia.ReportConfig.prototype.removeWidget = function(id) 
{
	var widget = this.getWidget(id);
	if (widget != undefined)
	{
		delete this._textHash[id];
		delete this._buttonHash[id];
		delete this._imageHash[id];
		delete this._componentHash[id];

		for (var i = 0; i < this._textArray.length; i++) 
		{
			var widget = this._textArray[i];
			if (widget.id == id)
			{
				this._textArray.splice(i,1)
				break;
			}
		}
		for (var i = 0; i < this._buttonArray.length; i++) 
		{
			var widget = this._buttonArray[i];
			if (widget.id == id)
			{
				this._buttonArray.splice(i,1)
				break;
			}
		}
		for (var i = 0; i < this._imageArray.length; i++) 
		{
			var widget = this._imageArray[i];
			if (widget.id == id)
			{
				this._imageArray.splice(i,1)
				break;
			}
		}
		for (var i = 0; i < this._componentArray.length; i++) 
		{
			var widget = this._componentArray[i];
			if (widget.id == id)
			{
				this._componentArray.splice(i,1)
				break;
			}
		}
	}
};

/** 
 * Returns all widgets in the config ie a concatenation of all components, tables, buttons, text and images.  
 *
 * @method getWidgets
 * @return {ia.ComponentConfig|ia.TableConfig|ia.ButtonConfig|ia.TextConfig|ia.ImageConfig[]} An array of widgets.
 */	
ia.ReportConfig.prototype.getWidgets = function() {return this._componentArray.concat(this._buttonArray).concat(this._textArray).concat(this._imageArray);};
	
/** 
 * Returns the widget that corresponds to the id.
 * 
 * @method getComponent
 * @param {String} id The id.
 * @return {ia.ComponentConfig|ia.TableConfig|ia.ButtonConfig|ia.TextConfig|ia.ImageConfig} The widget.
 */
ia.ReportConfig.prototype.getWidget = function(id) 
{
	if (this.getComponent(id)) return this.getComponent(id);
	else if (this.getButton(id)) return this.getButton(id);
	else if (this.getText(id)) return this.getText(id);
	else if (this.getImage(id)) return this.getImage(id);
};

/** 
 * Adds a component.  
 *
 * @method addComponent
 * @param {XML} xml The xml that defines the component.
 * @return {ia.ComponentConfig} The config object.
 */	
ia.ReportConfig.prototype.addComponent = function(xml) 
{
	var c = new ia.ComponentConfig(xml);
	this._componentArray[this._componentArray.length] = c;
	this._componentHash[c.id] = c;
	return c;
};

/** 
 * Adds a table.  
 *
 * @method addTable
 * @param {XML} xml The xml that defines the table.
 * @return {ia.TableConfig} The config object.
 */	
ia.ReportConfig.prototype.addTable = function(xml) 
{
	var c = new ia.TableConfig(xml);
	this._componentArray[this._componentArray.length] = c;
	this._componentHash[c.id] = c;
	return c;
};

/** 
 * Adds a button.  
 *
 * @method addButton
 * @param {XML} xml The xml that defines the button.
 * @return {ia.ButtonConfig} The config object.
 */	
ia.ReportConfig.prototype.addButton = function(xml) 
{
	var c = new ia.ButtonConfig(xml);
	this._buttonArray[this._buttonArray.length] = c;
	this._buttonHash[c.id] = c;
	return c;
};

/** 
 * Adds text.  
 *
 * @method addText
 * @param {XML} xml The xml that defines the text.
 * @return {ia.TextConfig} The config object.
 */	
ia.ReportConfig.prototype.addText = function(xml) 
{
	var c = new ia.TextConfig(xml);
	this._textArray[this._textArray.length] = c;
	this._textHash[c.id] = c;
	return c;
};

/** 
 * Adds an image.  
 *
 * @method addImage
 * @param {XML} xml The xml that defines the image.
 * @return {ia.ImageConfig} The config object.
 */	
ia.ReportConfig.prototype.addImage = function(xml) 
{
	var c = new ia.ImageConfig(xml);
	this._imageArray[this._imageArray.length] = c;
	this._imageHash[c.id] = c;
	return c;
};

/** 
 * Returns the components.  
 *
 * @method getComponents
 * @return {ia.ComponentConfig[]} An array of components.
 */	
ia.ReportConfig.prototype.getComponents = function() {return this._componentArray;};
	
/** 
 * Returns the component that corresponds to the id.
 * 
 * @method getComponent
 * @param {String} id The id.
 * @return {ia.ComponentConfig} The component.
 */
ia.ReportConfig.prototype.getComponent = function(id) {return this._componentHash[id];};

/** 
 * Returns the buttons.  
 *
 * @method getButtons
 * @return {ia.ButtonConfig[]} An array of buttons.
 */	
ia.ReportConfig.prototype.getButtons = function() {return this._buttonArray;};

/** 
 * Returns the button that corresponds to the id.
 * 
 * @method getButton
 * @param {String} id The id.
 * @return {ia.ButtonConfig} The button.
 */
ia.ReportConfig.prototype.getButton = function(id) {return this._buttonHash[id];};
		
/** 
 * Returns the text.  
 *
 * @method getTexts
 * @return {ia.TextConfig[]} An array of text.
 */	
ia.ReportConfig.prototype.getTexts = function() {return this._textArray;};

/** 
 * Returns the text that corresponds to the id.
 * 
 * @method getText
 * @param {String} id The id.
 * @return {ia.TextConfig} The text.
 */
ia.ReportConfig.prototype.getText = function(id) {return this._textHash[id];};

/** 
 * Returns the images.  
 *
 * @method getImages
 * @return {ia.ImageConfig[]} An array of images.
 */	
ia.ReportConfig.prototype.getImages = function() {return this._imageArray;};

/** 
 * Returns the image that corresponds to the id.
 * 
 * @method getImage
 * @param {String} id The id.
 * @return {ia.ImageConfig} The image.
 */
ia.ReportConfig.prototype.getImage = function(id) {return this._imageHash[id];};

/** 
 * Returns the palette.  
 *
 * @method getMapPalette
 * @return {ia.PaletteConfig} The palette object.
 */	
ia.ReportConfig.prototype.getMapPalette = function() {return this._palette;};

/** 
 * The widgets properties, properties[propertyId] = property.
 *
 * @property properties
 * @type Associative Array
 */
ia.ReportConfig.prototype.properties;

/** 
 * Returns the widgets properties. 
 *
 * @method getProperties
 * @return {Associative Array} properties[propertyId] = property.
 */	
ia.ReportConfig.prototype.getProperties = function() {return this.properties;};

/** 
 * Gets the value for the property with the given id.
 *
 * @method getProperty
 * @param {String} id The property id.
 * @return {Number|String} The property value.
 */
ia.ReportConfig.prototype.getProperty = function(id) 
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
ia.ReportConfig.prototype.setProperty = function(id, value, castValue) 
{
	var prop = this.properties[id];
	if (prop) 
	{
		if (castValue) prop.value = prop.castValue(value);
		else prop.value = value;
	}
};