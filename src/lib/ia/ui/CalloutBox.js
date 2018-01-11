/** 
 * Creates a callout box.
 *
 * @author J Clare
 * @class ia.CalloutBox
 * @constructor
 * @param {String} id The element id.
 * @param {String} notchPosition "top-bottom" or "left-right" or "none".
 */
ia.CalloutBox = function(id, notchPosition)
{	
	this.id = id;
	this.notchPosition = notchPosition || "left-right";
	this.container = $j('<div id="'+id+'" class="callout"></div>');

	this._px = 0; 
	this._py = 0;
	this._isVisible = false;
	this._popup = false;

	this._notchBorder =  $j('<div class="callout-notch"></div>');
	this._notchBorder.addClass("callout-notch-"+this.notchPosition)
	this.container.append(this._notchBorder);
	
	this._notchFill =  $j('<div class="callout-notch"></div>');
	this._notchFill.addClass("callout-notch-"+this.notchPosition);
	this.container.append(this._notchFill);
	
	if (this.notchPosition == "none") 
	{
		this._notchBorder.css({display:"none"});
		this._notchFill.css({display:"none"});
	}

	// Btns.
	var btns = $j("<div>").addClass('ia-panel-btns').attr('id', id +"-btns");	
	this.container.append(btns);

	var overBtns = false;
	this.container.mouseenter(function(e) 
	{
		if (!overBtns)
		{
			btns.stop();
			btns.css({visibility: "visible"}).animate({opacity: 0.4});
		}
	});
	this.container.mouseleave(function(e) 
	{
		btns.stop();
		btns.animate({opacity: 0}, function() 
		{
			btns.css({visibility: "hidden"});
		});
	});
	btns.mouseenter(function(e) 
	{
		overBtns = true;
		btns.animate({opacity: 1.0});
	});
	btns.mouseleave(function(e) 
	{
		overBtns = false;
		btns.stop();
		btns.animate({opacity: 0.4});
	});

	var btnsTimeout;
	this.container.bind("touchstart", function(e) 
	{
		btns.stop();
		btns.css({visibility: "visible"}).animate({opacity: 1.0});
		
		clearTimeout(btnsTimeout);
		btnsTimeout = setTimeout(function()
		{
			clearTimeout(btnsTimeout);
			btns.stop();
			btns.animate({opacity: 0}, function() 
			{
				btns.css({visibility: "hidden"});
			});
		}, 5000);
	});

	// Close button.	
	var me = this;			
	var closeBtn = $j("<div>").addClass('ia-panel-btn ia-panel-close-btn').attr('id', id +"-close");
	closeBtn.bind("click", function(e) 
	{
		e.stopPropagation();
		me.hide();
	});
	btns.append(closeBtn);
	
	var resizeTimeout;
	this.container.resize(function(e)
	{
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function()
		{
			clearTimeout(resizeTimeout);
			if (me._isVisible) {me.position();}
		}, 300);
	});
};
	
/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.CalloutBox.prototype.id;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type {JQUERY Element}
 */
ia.CalloutBox.prototype.container;
	
/**
 * "top-bottom" or "left-right".
 * 
 * @property notchPosition
 * @type String
 * @default "left-right"
 */
ia.CalloutBox.prototype.notchPosition;

/** 
 * Positions the callout.
 * 
 * @method position
 * @param {Number} x The x position.
 * @param {Number} y The y position.
 */
ia.CalloutBox.prototype.position = function(x, y)
{
	if (this.container.parent() != undefined)
	{
		// Position relative to parent container.
		if (x) 
		{
			x = x - this.container.parent().offset().left;
			this._px = x;
		}
		if (y) 
		{
			y = y - this.container.parent().offset().top;
			this._py = y;
		}

		
		// Clear styles.
		this._notchBorder.removeClass("callout-notch-left callout-notch-right callout-notch-border-left callout-notch-border-right");
		this._notchFill.removeClass("callout-notch-left callout-notch-right");
		this._notchBorder.css({left:"",right:"",top:"",bottom:""});
		this._notchFill.css({left:"",right:"",top:"",bottom:""});

		var cx = x || this._px;
		var cy = y || this._py;

		var parentWidth = this.container.parent().width();
		var parentHeight = this.container.parent().height();
		var calloutWidth = this.container.outerWidth();
		var calloutHeight = this.container.outerHeight();
		var xCentre = parentWidth / 2;
		var yCentre = parentHeight / 2;
	
		// Calculate notch offset.
		var notchSize = 10;
		var offset = 30;
		var xOffset, yOffset;
		if (this.notchPosition == "left-right")
		{
			xOffset = offset;
			yOffset = Math.min(offset, (calloutHeight/2));
			cy = cy - yOffset;
		}
		else
		{
			yOffset = offset;
			xOffset = Math.min(offset, (calloutWidth/2));
			cx = cx - xOffset;
		}
		
		// Position.
		if (this.notchPosition == "left-right")
		{
			if (cx < xCentre) // left
			{	
				if (this._notchBorder.hasClass("callout-notch-right"))
				{
					this._notchBorder.removeClass("callout-notch-right callout-notch-border-right");
					this._notchFill.removeClass("callout-notch-right");
				}
				cx = cx + xOffset;
				this._notchBorder.addClass("callout-notch-left callout-notch-border-left");
				this._notchFill.addClass("callout-notch-left");
				this._notchBorder.css({left: -notchSize-1 + "px"});
				this._notchFill.css({left: -notchSize + "px"});
			}
			else // right
			{
				if (this._notchBorder.hasClass("callout-notch-left"))
				{
					this._notchBorder.removeClass("callout-notch-left callout-notch-border-left");
					this._notchFill.removeClass("callout-notch-left");
				}
				cx = cx - calloutWidth - xOffset;
				this._notchBorder.addClass("callout-notch-right callout-notch-border-right");
				this._notchFill.addClass("callout-notch-right");
				this._notchBorder.css({right: -notchSize-1 + "px"});
				this._notchFill.css({right: -notchSize + "px"});
			}
		}
		else
		{
			if (cy < yCentre) // top
			{	
				if (this._notchBorder.hasClass("callout-notch-bottom"))
				{
					this._notchBorder.removeClass("callout-notch-bottom callout-notch-border-bottom");
					this._notchFill.removeClass("callout-notch-bottom");
				}
				cy = cy + yOffset;
				this._notchBorder.addClass("callout-notch-top callout-notch-border-top");
				this._notchFill.addClass("callout-notch-top");
				this._notchBorder.css({top: -notchSize-1 + "px"});
				this._notchFill.css({top: -notchSize + "px"});
			}
			else // bottom
			{
				if (this._notchBorder.hasClass("callout-notch-top"))
				{
					this._notchBorder.removeClass("callout-notch-top callout-notch-border-top");
					this._notchFill.removeClass("callout-notch-top");
				}
				cy = cy - calloutHeight - yOffset;
				this._notchBorder.addClass("callout-notch-bottom callout-notch-border-bottom");
				this._notchFill.addClass("callout-notch-bottom");
				this._notchBorder.css({bottom: -notchSize-1 + "px"});
				this._notchFill.css({bottom: -notchSize + "px"});
			}
		
		}
		
		// Reposition if near edge of window.
		var margin = 10;
			
		var xOffset = (cx + calloutWidth) - (parentWidth - margin);
		if (xOffset > 0) cx = cx - xOffset;
		if (cx < margin) cx = margin;

		var yOffset = (cy + calloutHeight) - (parentHeight - margin);
		if (yOffset > 0) cy = cy - yOffset;
		if (cy < margin) cy = margin;
		
		// Postion notch relative to box.
		var notchIndent;
		if (this.notchPosition == "left-right")
		{
			notchIndent = (this._py - cy) - (notchSize/2);
			this._notchBorder.css({top: notchIndent + "px"});
			this._notchFill.css({top: notchIndent + "px"});
		}
		else
		{
			notchIndent = (this._px - cx) - (notchSize/2);
			this._notchBorder.css({left: notchIndent + "px"});
			this._notchFill.css({left: notchIndent + "px"});
		}
				
		this.container.css({left: cx + "px",top: cy + "px"});
	}
};

/** 
 * Sets or gets if its a popup - closes on a click outside the callout.
 * 
 * @method popup
 * @param {Boolean} isPopup true/false.
 */
ia.CalloutBox.prototype.popup = function(isPopup)
{
	if (isPopup == true)
	{
		this._popup = true;

		var me = this;
		$j("body").bind("click", function(e) 
		{
			me.hide();
		});
		this.container.bind("click", function(e) 
		{
			e.stopPropagation();
		});
	}
	else if (isPopup == false)
	{
		this._popup = false;
	}
	else return this._popup
};

/** 
 * Appends an element.
 * 
 * @method append
 * @param {JQUERY Element} obj The jquery object.
 */
ia.CalloutBox.prototype.append = function(obj)
{
	this.container.append(obj);
};

/**
 * Toggles the visibility of the callout.
 *
 * @method toggle
 * @param {Boolean} visible true/false.
 */
ia.CalloutBox.prototype.toggle = function(visible)
{
	if (this._isVisible) this.hide();
	else this.show();
};

/**
 * Hide the callout.
 *
 * @method hide
 */
ia.CalloutBox.prototype.hide = function()
{	
	this._isVisible = false;
	this.container.hide();
};

/**
 * Show the callout.
 *
 * @method show
 */
ia.CalloutBox.prototype.show = function()
{
	this._isVisible = true;
	this.container.fadeIn();
};