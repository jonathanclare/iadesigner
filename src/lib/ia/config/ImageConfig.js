/** 
 * Contains the configuration information for a report image.
 *
 * @author J Clare
 * @class ia.ImageConfig
 * @extends ia.ButtonConfig
 * @constructor
 * @param {XML} xml The XML data that describes the image.
 */
ia.ImageConfig = function(xml)
{
	ia.ImageConfig.baseConstructor.call(this, xml);
	this._parseImageXML(xml);
};
ia.extend(ia.ButtonConfig, ia.ImageConfig);

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */	
ia.ImageConfig.prototype.parseXML = function(xml) 
{
	this._parseImageXML(xml);
};

/** 
 * Protected method to be used by subclasses when parsing xml.  
 *
 * @method _parseImageXML
 * @param {XML} xml The xml data.
 * @protected
 */	
ia.ImageConfig.prototype._parseImageXML = function(xml) 
{
	this._parseButtonXML(xml);
	
	// Format some properties.
	this.src = this.src || "";
	if (this.src != "" && this.src.indexOf("http") == -1 && this.src.indexOf("javascript") == -1)
		this.src = ia.IAS_PATH + this.src;
};