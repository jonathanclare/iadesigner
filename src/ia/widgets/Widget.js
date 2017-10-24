/** 
 * Creates a widget.
 *
 * @author J Clare
 * @class ia.Widget
 * @constructor
 * @param id The id for the ia.Widget.
 */
ia.Widget = function(id)
{			
	this.id = id;
	/*this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;*/
	this._zIndex = undefined;
	this._xAnchor = "left";
	this._yAnchor = "top";
	this._visible = false;
	this._popup = false;
	this._stopPopup = false;
}
	
/**
 * The container that holds the object.
 *
 * @property container
 * @type JQUERY Element
 */
ia.Widget.prototype.container;

/** 
 * Resale.
 *
 * @property rescale
 * @type Boolean
 * @default true
 */
ia.Widget.prototype.rescale = true;

/** 
 * The id.
 *
 * @property id
 * @type String
 * @default ""
 */
ia.Widget.prototype.id = "";

/** 
 * The name.
 *
 * @property name
 * @type String
 * @default ""
 */
ia.Widget.prototype.name = "";

/** 
 * Get/Set the x location.
 *
 * @method x
 * @param {Number} value The value (%).
 */
ia.Widget.prototype.x = function(value)
{
	if (value != undefined)  
		this.setPosition(value, this._y, this._xAnchor, this._yAnchor);
	else 
		return this._x;
};

/** 
 * Get/Set the y location.
 *
 * @method y
 * @param {Number} value The value (%).
 */
ia.Widget.prototype.y = function(value)
{
	if (value != undefined) 
		this.setPosition(this._x, value, this._xAnchor, this._yAnchor);
	else 
		return this._y;
};

/** 
 * Get/Set the width.
 *
 * @method width
 * @param {Number} value The value (% or px for images).
 */
ia.Widget.prototype.width = function(value)
{
	if (value != undefined) 
		this.setSize(value, this._height);
	else 
		return this._width;
};

/** 
 * Get/Set the height.
 *
 * @method height
 * @param {Number} value The value (% or px for images).
 */
ia.Widget.prototype.height = function(value)
{
	if (value != undefined) 
		this.setSize(this._width, value);
	else 
		return this._height;
};

/** 
 * Get/Set the z index.
 *
 * @method zIndex
 * @param {Number} value The value
 */
ia.Widget.prototype.zIndex = function(value)
{
	if (value != undefined) 
	{
		this._zIndex = value;
		this.container.css({"z-index" : this._zIndex});
	}
	else 
	{
		if (this._zIndex == undefined) this._zIndex = this.container.css("z-index");
		return this._zIndex;
	}
};

/** 
 * Get/Set the anchor x.
 *
 * @method xAnchor
 * @param {Number} value The value
 */
ia.Widget.prototype.xAnchor = function(value)
{
	if (value != undefined) 
		this.setPosition(this._x, this._y, value, this._yAnchor);
	else 
		return this._xAnchor;
};

/** 
 * Get/Set the anchor x.
 *
 * @method yAnchor
 * @param {Number} value The value
 */
ia.Widget.prototype.yAnchor = function(value)
{
	if (value != undefined) 
		this.setPosition(this._x, this._y, this._xAnchor, value);
	else 
		return this._yAnchor;
};

/** 
 * Sets the dimensions.
 * 
 * @method setDimensions
 * @param {Number} x The x position.
 * @param {Number} y The y position.
 * @param {Number} width The width
 * @param {Number} height The height.
 * @param {String} xAnchor The anchor x - 'left' or 'right'.
 * @param {String} yAnchor The anchor y - 'top' or 'bottom'.
 */
ia.Widget.prototype.setDimensions = function(x, y, width, height, xAnchor, yAnchor)
{
	//ia.log(this.id+" "+x+" "+y+" "+width+" "+height)
	this.setSize(width, height);
	this.setPosition(x, y, xAnchor, yAnchor);
};

/** 
 * Restores to the current x, y, width, height.
 *
 * @method restore
 */
ia.Widget.prototype.restore = function()
{
	this.setDimensions(this._x, this._y, this._width, this._height, this._xAnchor, this._yAnchor);
	this.zIndex(this._zIndex);
};

/** 
 * Maximizes the component.
 *
 * @method maximize
 */
ia.Widget.prototype.maximize = function()
{
	this.container.css({ left: 0, top: 0, width: "100%", height: "100%", "z-index": 500 });
};

/** 
 * Sets the dimensions.
 * 
 * @method setSize
 * @param width The width.
 * @param height The height.
 */
ia.Widget.prototype.setSize = function(width, height)
{
	//ia.log(width+" "+height);
	var units = "%";
	if (this.rescale == 'false' || this.rescale == false) units = "px";
	this._width = width;
	this._height = height;
	if (this._width != undefined) this.container.css({"width" : this._width+units});
	if (this._height != undefined) this.container.css({"height" : this._height+units});
};

/** 
 * Sets the position.
 * 
 * @method setPosition
 * @param {Number} x The x position.
 * @param {Number} y The y position.
 * @param {String} xAnchor The anchor x - 'left' or 'right'.
 * @param {String} yAnchor The anchor y - 'top' or 'bottom'.
 */
ia.Widget.prototype._addedResizeListener = false
ia.Widget.prototype.setPosition = function(x, y, xAnchor, yAnchor)
{
	//ia.log(x+" "+y+" "+xAnchor+" "+yAnchor);
	this._x = x;
	this._y = y;
	this._xAnchor = xAnchor || this._xAnchor;
	this._yAnchor = yAnchor || this._yAnchor;

	// Reset.
	this.container.css({"left" : "", "margin-left" : "", "right" : "", "bottom" : "", "top" : ""});

	if (this._xAnchor == "end" || this._xAnchor == "right")
	{		
		var ax = 100 - this._x; 
		this.container.css({"right" : ax+"%"});
	}
	else if (this._xAnchor == "middle" || this._xAnchor == "center")
	{
		this.container.css({"left" : this._x+"%"});

		var aw = this._width;
		if (aw == undefined) // Text with no wrap width.
		{
			// Add a resize listener so we can reset the text when it has changed size.
			if (this._addedResizeListener == false)
			{
				this._addedResizeListener = true;
				var me = this;
				this.container.resize(function(e) 
				{		
					this.setPosition(this._x, this._y);
				}.bind(this));
			}
		}
		
		var  marginLeft = (this._width / 2) * -1;
		if (this.rescale == 'false' || this.rescale == false)
			this.container.css({"margin-left" : marginLeft+"px"});
		else
			this.container.css({"margin-left" : marginLeft+"%"});
	}
	else  this.container.css({"left" : this._x+"%"});

	if (this._yAnchor == "bottom") 
		this.container.css({"bottom" : this._y+"%"});
	else  
		this.container.css({"top" : this._y+"%"});
};

/** 
 * Toggles the visibility.
 *
 * @method toggle
 */
ia.Widget.prototype.toggle = function()
{
	this.visible(!this._visible);
};

/** 
 * Shows the widget.
 *
 * @method show
 */
ia.Widget.prototype.show = function()
{
	this.visible(true);
};

/** 
 * Hides the widget.
 *
 * @method hide
 */
ia.Widget.prototype.hide = function()
{
	this.visible(false);
};

/** 
 * Sets or gets the visibility.
 * 
 * @method visible
 * @param {Boolean} vis The visibility.
 */
ia.Widget.prototype.visible = function(vis)
{
	/*
	// "display" changes the dimensions which cocks things up.
	var displayValue = 'inline';
	if (visible == false) displayValue = 'none';
	this.container.css({"display" : displayValue});
	*/
	
	if (vis != undefined)
	{
		var me = this;
		me._visible = vis;
		me.container.stop();
		if (me._visible)
		{
			if (me._zIndex) me.container.css("z-index", me._zIndex);
			me.container.css("visibility","visible").animate({opacity: 1});
		}
		else
		{
			me.container.animate({opacity: 0}, function() 
			{
				if (me._zIndex) me.container.css("z-index", 0);
				me.container.css("visibility","hidden");
			});
		}
	}
	else return this._visible;
};

/** 
 * Sets the tooltip.
 * 
 * @method tooltip
 * @param {String} tip The tooltip text.
 */
ia.Widget.prototype.tooltip = function(tip)
{	
	this.container.attr('title', tip);
	/*if (tip != "" && !ia.IS_TOUCH_DEVICE) 
	{
		// These 2 variables determine tips distance from the cursor
		xOffset = 10;
		yOffset = 20;		
		
		this.container.unbind('hover mousemove');
		this.container.hover
		(
			function(e)
			{	
				$j("body").append("<div id='ia-tooltip' class='ia-tooltip'>"+ tip +"</div>");
				$j("#ia-tooltip").css("top",(e.pageY - yOffset) + "px").css("left",(e.pageX + xOffset) + "px");
				$j("#ia-tooltip").delay(1500).fadeIn("slow").delay(1500).fadeOut("slow"); 
			},
			function()
			{
				$j("#ia-tooltip").remove();
			}
		);	
		this.container.mousemove
		(
			function(e)
			{
				$j("#ia-tooltip").css("top",(e.pageY - yOffset) + "px").css("left",(e.pageX + xOffset) + "px");
			}
		);		
	}*/
};

/** 
 * Set the function to call when the widget is clicked.
 * 
 * @method onclick
 * @param {Function} fnc Can be a javascript function or a src
 * containing a link or a function such as "javascript:iaToggle(dataExplorer)".
 * @param {String} target The url target - used in conjunction with the onclick event. 
 * "_blank" for a new window or tab, "_self" for the current page,
 * top for the topmost frame container, or "_parent" for the parent of 
 * the current frame container. Default is "_blank".
 */
ia.Widget.prototype.onclick = function(fnc, target)
{
	var me = this;
	me.container.off("click");
	if (fnc)
	{
		me.container.css("cursor", "pointer");
		if (typeof(fnc) == "function") 
		{
			me.container.on("click", function(e) 
			{
				e.stopPropagation();
				fnc.call(null, e)
			});
		}
		else
		{
			(function() // Execute immediately
			{ 
				me.container.on("click", function(e) 
				{
					e.stopPropagation();
					ia.callFunction(fnc, target, e);
				});
			})();
		}
	}
};

/** 
 * Adds a css class to the widget.
 * 
 * @method addCssClass
 * @param {String} cssClass The class to add eg. "ia-title-text".
 */
ia.Widget.prototype.addCssClass = function(cssClass)
{
	if (cssClass && cssClass != "") this.container.addClass(cssClass);
};

/** 
 * Sets or gets if its a popup - closes on a click outside the panel.
 * 
 * @method popup
 * @param {Boolean} isPopup true/false.
 */
ia.Widget.prototype.popup = function(isPopup)
{
	var me = this;
	if (isPopup == true)
	{
		this._popup = true;
		this.container.addClass('ia-popup-panel');
		if (!this._stopPopup)
		{
			$j("body").bind("click"+'.popup-'+this.id, function(e) {me.hide();});
			this.container.bind("click"+'.popup-'+this.id, function(e) {e.stopPropagation();});
		}
	}
	else if (isPopup == false)
	{
		this._popup = false;
		this.container.removeClass('ia-popup-panel');
		$j("body").unbind("click"+'.popup-'+this.id); 
		this.container.unbind("click"+'.popup-'+this.id); 
	}
	else return this._popup;
};
ia.Widget.prototype.suspendPopup = function()
{
	this._stopPopup = true;
	$j("body").unbind("click"+'.popup-'+this.id); 
	this.container.unbind("click"+'.popup-'+this.id); 
};
ia.Widget.prototype.resumePopup = function()
{
	this._stopPopup = false;
	this.popup(this._popup);
};

/** 
 * Updates the widget configuration.
 * 
 * @method updateWidget
 * @param {ia.WidgetConfig} c The widget config.
 */
ia.Widget.prototype.updateWidget = function(c)
{
	if (c != undefined)
	{
		this.name = c.name;
		this.setDimensions(c.x, c.y, c.width, c.height, c.anchor, 'top');
	}
};