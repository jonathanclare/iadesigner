/** 
 * Creates an image widget.
 *
 * @author J Clare
 * @class ia.Image
 * @extends ia.Widget
 * @constructor
 * @param {String} id The id for the widget.
 * @param {String} src The source for the image.
 */
ia.Image = function(id, src)
{		
	ia.Image.baseConstructor.call(this, id);
	this.container = $j('<img>').addClass('ia-widget ia-image').attr('id', 'ia-widget-' + id).attr('src', src);	
};
ia.extend(ia.Widget, ia.Image);
	
/** 
 * Sets the src.
 * 
 * @method src
 * @param {String} src The src.
 */
ia.Image.prototype.src = function(src)
{
	this.container.attr('src', src);
};

/** 
 * Updates the image configuration.
 * 
 * @method update
 * @param {ia.ImageConfig} c The image config.
 */
ia.Image.prototype.update = function(c)
{	
	if (c != undefined)
	{
		if (c.src != undefined) this.src(c.src);
		this.onclick(c.href, c.target);
		this.tooltip(c.tooltip);
		this.addCssClass(c['css-class']);
		this.rescale = c.rescale;	
		if (c.zIndex) this.zIndex(c.zIndex);
		
		this.updateWidget(c);
	}
};