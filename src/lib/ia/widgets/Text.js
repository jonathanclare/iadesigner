/** 
 * Creates a text widget.
 *
 * @author J Clare
 * @class ia.Text
 * @extends ia.Widget
 * @constructor
 * @param {String} id The id for the widget.
 * @param {String} text The text for the widget.
 */
ia.Text = function(id, text)
{		
	ia.Text.baseConstructor.call(this, id);
	
	this.container = $j("<div>").addClass('ia-widget ia-text').attr('id', 'ia-widget-' + id);
	if (text != undefined) this.text(text);

	/*this.container.css(
	{
		'-moz-transform': 'rotate(-90deg)',
		'-webkit-transform': 'rotate(-90deg)',
		'-o-transform': 'rotate(-90deg)',
		msTransform: 'rotate(-90deg)',
		'transform': 'rotate(-90deg)'
	});*/
};
ia.extend(ia.Widget, ia.Text);
	
/** 
 * Sets the text.
 * 
 * @method text
 * @param {String} text The text.
 */
ia.Text.prototype.text = function(text)
{
	this.container.html(text);
};

/** 
 * Updates the text configuration.
 * 
 * @method update
 * @param {ia.TextConfig} c The text config.
 */
ia.Text.prototype.update = function(c)
{
	if (c != undefined)
	{
		var me = this;
		if (c.text != '') this.text(c.text);
		this.tooltip(c.tooltip);
		this.addCssClass(c['css-class']);
		if (c.href != '') 
		{
			this.onclick(c.href, c.target);
			this.addCssClass('ia-link');
		}
		$j.each(c.cssProps, function(key, value)  {me.container.css(key, value)});

		if (c.zIndex) this.zIndex(c.zIndex);

		this.updateWidget(c);
	}
};