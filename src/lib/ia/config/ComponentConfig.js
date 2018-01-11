/** 
 * Holds the configuration information for a report component.
 *
 * @author J Clare
 * @class ia.ComponentConfig
 * @extends ia.WidgetConfig
 * @constructor
 * @param {XML} xml The XML data that describes the component.
 */
ia.ComponentConfig = function(xml)
{
	ia.ComponentConfig.baseConstructor.call(this, xml);
	this._parseComponentXML(xml);
};
ia.extend(ia.WidgetConfig, ia.ComponentConfig);

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */	
ia.ComponentConfig.prototype.parseXML = function(xml) 
{
	this._parseWidgetXML(xml);
};

/** 
 * Protected method to be used by subclasses when parsing xml.  
 *
 * @method _parseComponentXML
 * @param {XML} xml The xml data.
 * @protected
 */	
ia.ComponentConfig.prototype._parseComponentXML = function(xml) 
{

};