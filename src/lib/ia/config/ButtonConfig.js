/** 
 * Contains the configuration information for a report button.
 *
 * @author J Clare
 * @class ia.ButtonConfig
 * @extends ia.WidgetConfig
 * @constructor
 * @param {XML} xml The XML data that describes the button.
 */
ia.ButtonConfig = function(xml)
{
	ia.ButtonConfig.baseConstructor.call(this, xml);
	this._parseButtonXML(xml);
};
ia.extend(ia.WidgetConfig, ia.ButtonConfig);

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */	
ia.ButtonConfig.prototype.parseXML = function(xml) 
{
	this._parseButtonXML(xml);
};

/** 
 * Protected method to be used by subclasses when parsing xml.  
 *
 * @method _parseButtonXML
 * @param {XML} xml The xml data.
 * @protected
 */	
ia.ButtonConfig.prototype._parseButtonXML = function(xml) 
{
	this._parseWidgetXML(xml);
	
	// Default settings
	this['css-class'] = this['css-class'] || "";

	// Format some properties.
	this.text = this.text || "";
	this.target = this.target || "_blank";
	this.tooltip = this.tooltip || "";

	this.href = this.href || "";
	if (this.href != "" && this.href.indexOf("http") == -1 && this.href.indexOf("javascript") == -1)
		this.href = ia.IAS_PATH + this.href;
};