/** 
 * Contains the configuration information for a piece of report text.
 *
 * @author J Clare
 * @class ia.TextConfig
 * @extends ia.ButtonConfig
 * @constructor
 * @param {XML} xml The XML data that describes the text.
 * @constructor
 */
ia.TextConfig = function(xml)
{
	ia.TextConfig.baseConstructor.call(this, xml);
	this._parseTextXML(xml);
};
ia.extend(ia.ButtonConfig, ia.TextConfig);

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */	
ia.TextConfig.prototype.parseXML = function(xml) 
{
	this._parseTextXML(xml);
};

/** 
 * Protected method to be used by subclasses when parsing xml.  
 *
 * @method _parseTextXML
 * @param {XML} xml The xml data.
 * @protected
 */	
ia.TextConfig.prototype._parseTextXML = function(xml) 
{
	this._parseButtonXML(xml);
	
	this.cssProps = {};

	// Resize from 800*600 to 100*100, then round to one dp.
	if (this['wrap-width'] != '-1') 
	{
		this.width = (parseFloat(this['wrap-width']) / 800) * 100;
		this.width = Math.round(this.width * 10) / 10;
	}
	
	if (this['fill'] != undefined) this.cssProps["color"] = this['fill']
	if (this['font-family'] != undefined) this.cssProps["font-family"] = this['font-family'];
	if (this['font-size'] != undefined) this.cssProps["font-size"] = this['font-size'] + "px";
	if (this['font-style'] != undefined) this.cssProps["font-style"] = this['font-style'];
	if (this['font-weight'] != undefined) this.cssProps["font-weight"] = this['font-weight'];
	
	this.text = $j(xml).text();
};

/** 
 * Custom css properties.
 *
 * @property cssProps
 * @type Associative Array
 */
ia.TextConfig.prototype.cssProps;