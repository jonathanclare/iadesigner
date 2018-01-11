/** 
 * Creates a data tip.
 *
 * @author J Clare
 * @class ia.ChartTip
 * @constructor
 */
ia.ChartTip = function(container)
{		
	this._container = container;
	this._tipContainer = $j("<svg>").addClass('ia-datatip').hide();
	$j("body").append(this._tipContainer);
	//this._container.append(this._tipContainer);
};

/** 
 * Positions the tip.
 * 
 * @method position
 * @param {Number} x The x position relative to the container.
 * @param {Number} y The y position relative to the container.
 */	
ia.ChartTip.prototype.position = function(x, y)
{
	var tipWidth = this._tipContainer.outerWidth();
	var tipHeight = this._tipContainer.outerHeight();

	// Add the offset from the document.
	if (this._container != undefined)
	{
		x = x + this._container.offset().left;
		y = y + this._container.offset().top;
	}

	// Check the tip is within the specified document margins.
	var tipMargin = 10;
	if (x < tipMargin) x = tipMargin;
	else
	{
		var scrollLeft = $j(window).scrollLeft();
		var width = $j(window).width();
		var right = scrollLeft + width;

		var xOffset = (x + tipWidth) - (right - tipMargin);
		if (xOffset > 0) x = x - xOffset;
	}
	if (y < tipMargin) y = tipMargin;
	else
	{
		var scrollTop = $j(window).scrollTop();
		var height = $j(window).height();
		var bottom = scrollTop + height

		var yOffset = (y + tipHeight) - (bottom - tipMargin);
		if (yOffset > 0) y = y - yOffset;
	}
			
	this._tipContainer.css("left",x + "px").css("top",y + "px");
};
	
/** 
 * Sets the text.
 * 
 * @method text
 * @param {String} text The text.
 */
ia.ChartTip.prototype.text = function(text) {this._tipContainer.html(text);};

/** 
 * Returns the width of the tip container.
 *
 * @method getWidth
 * @return {Number} The width.
 */
ia.ChartTip.prototype.getWidth = function() {return this._tipContainer.outerWidth();};

/** 
 * Returns the height of the tip container.
 *
 * @method getHeight
 * @return {Number} The height.
 */
ia.ChartTip.prototype.getHeight = function() {return this._tipContainer.outerHeight();};
	
/** 
 * Shows tip.
 *
 * @method show
 */
ia.ChartTip.prototype.show = function() {this._tipContainer.css("display","inline");};

/** 
 * Hides the tip.
 *
 * @method hide
 */
ia.ChartTip.prototype.hide = function() {this._tipContainer.css("display","none")};