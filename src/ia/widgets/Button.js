/** 
 * Creates a button widget.
 *
 * @author J Clare
 * @class ia.Button
 * @extends ia.Widget
 * @constructor
 * @param {String} id The id for the widget.
 * @param {String} text The text for the widget.
 */
ia.Button = function(id, text)
{		
	ia.Button.baseConstructor.call(this, id);
	
	this.container = $j("<button type='button'>").addClass('ia-widget ia-button button').attr('id', 'ia-widget-' + id); 
	if (text != undefined) this.text(text);
};
ia.extend(ia.Widget, ia.Button);
	
/** 
 * Sets the text.
 * 
 * @method text
 * @param {String} text The text.
 */
ia.Button.prototype.text = function(text)
{
	this.container.html(text);
};

/** 
 * Updates the button configuration.
 * 
 * @method update
 * @param {ia.ButtonConfig} c The button config.
 */
ia.Button.prototype.update = function(c)
{
	if (c != undefined)
	{
		if (c.text != undefined) this.text(c.text);
		this.onclick(c.href, c.target);
		this.tooltip(c.tooltip);
		this.addCssClass(c['css-class']);	
		if (c.zIndex) this.zIndex(c.zIndex);
		this.updateWidget(c);
	}
};