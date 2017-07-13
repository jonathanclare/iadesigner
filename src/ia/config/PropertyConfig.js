/** 
 * Contains the configuration information for a report property.
 *
 * @author J Clare
 * @class ia.PropertyConfig
 * @constructor
 * @param {XML} xml The XML data that describes the property.
 * @param {ia.ReportConfig|ia.ComponentConfig} parent The parent the property belongs to.
 */
ia.PropertyConfig = function(xml, parent)
{
	var me = this;
	this.parent = parent;
	this.xml = xml;

	// Read in attributes as properties of this object.
	$j.each(xml.attributes, function(i, attrib)
	{ 
		me[attrib.name] = attrib.value; 
	});

	me.value = me.castValue(me.value);
	if (me.choices) me.choices = me.choices.split(';');
};

/** 
 * The parent the property belongs to.
 *
 * @property parent
 * @type ia.ReportConfig|ia.ComponentConfig
 */
ia.PropertyConfig.prototype.parent;

/** 
 * The raw xml data describing the object.
 *
 * @property xml
 * @type XML
 */
ia.PropertyConfig.prototype.xml;

/** 
 * Casts the raw value to the correct data type.
 *
 * @method castValue
 * @param {String} rawValue The raw value.
 * @return {Number|String|Boolean|Number[]|String[]|Boolean[]} The value cast to the correct data type.
 */
ia.PropertyConfig.prototype.castValue = function(rawValue) 
{
	if (this.type == "float")
	{
		if (rawValue == "") return undefined;
		else return parseFloat(rawValue);
	}
	else if (this.type == "integer")
	{
		if (rawValue == "") return undefined;
		else return ia.parseInt(rawValue);
	}
	else if (this.type == "boolean")
	{
		if (rawValue == true || rawValue == false) return rawValue;
		else return (rawValue == "true");
	}
	else if ((this.type == "string-array") || (this.type == "colour-array")) 
	{
		if (rawValue == "") return undefined;
		var entries = rawValue.split(",");
		for (var i = 0; i < entries.length; i++) 
		{
			if (entries[i].substring(0, 1) == "'") 
			{
				entries[i] = entries[i].substring(1);
			}
			if (entries[i].substring(entries[i].length - 1) == "'") 
			{
				entries[i] = entries[i].substring(0, entries[i].length - 1);
			}
		}
		return entries;
	}
	else if (this.type == "float-array") 
	{
		if (rawValue == "") return undefined;
		var vals = rawValue.split(',');
		var numbers = new Array(vals.length);
		for (var i = 0; i < vals.length; i++) 
		{
			numbers[i] = parseFloat(vals[i]);
		}
		return numbers;
	}
	else if (this.type == "integer-array") 
	{
		if (rawValue == "") return undefined;
		vals = rawValue.split(',');
		var numbers = new Array(vals.length);
		for (var i = 0; i < vals.length; i++) 
		{
			numbers[i] = ia.parseInt(vals[i]);
		}
		return numbers;
	}
	else if (this.type == "boolean-array") 
	{
		vals = rawValue.split(',');
		var bools = new Array(vals.length);
		for (var i = 0; i < vals.length; i++) 
		{
			bools[i] = (vals[i] == "true");
		}
		return bools;
	}
	else
	{
		if (rawValue == "") return undefined;
		else return rawValue;
	}
};