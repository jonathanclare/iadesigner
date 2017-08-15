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
	//this.container = $j('<img>').addClass('ia-widget ia-image').attr('id', 'ia-widget-' + id).attr('src', src);	
	this.container = $j('<div>').addClass('ia-widget ').attr('id', 'ia-widget-' + id);	
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
	//this.container.attr('src', src);
	this.container.find('img:first').attr('src', src);
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
		this.container.empty();

		if (c['maintain-aspect-ratio'] == 'true')
		{
			if (this._xAnchor == "end" || this._xAnchor == "right")
				this.container.css({'text-align':'right'});
			else if (this._xAnchor == "start" || this._xAnchor == "left")
				this.container.css({'text-align':'left'});
			else  		
				this.container.css({'text-align':'center'});

			this.container.append('<span style="display: inline-block;height: 100%;vertical-align: middle;">');
			this.container.append('<img style="vertical-align: middle;max-height: 100%;max-width: 100%;" class="ia-image">');
		}	
		else
		{
			this.container.css({'text-align':''});
			this.container.append('<img style="height: 100%;width: 100%;" class="ia-image">');
		}

		if (c.src != undefined) this.src(c.src);
		this.onclick(c.href, c.target);
		this.tooltip(c.tooltip);
		this.addCssClass(c['css-class']);
		this.rescale = c.rescale;	
		if (c.zIndex) this.zIndex(c.zIndex);
		this.updateWidget(c);
	}
};