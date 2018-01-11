/** 
 * A utility class for creating scroll boxes.
 *
 * @author J Clare
 * @class ia.ScrollBox
 * @constructor
 * @param container The scrollbox container.
 */
ia.ScrollBox = function(container)
{		
	// Use this for touch scrolling.
	this._touchScroll = undefined;
	this.isScrolling = false;
	this.container = container;
	var me = this;
	this.container.resize(function(e){me._resize();});
};

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.ScrollBox.prototype.container;

/**
 * Indicates if scrolling is taking place.
 * Can be used by children to prevent default events during scrolling
 * 
 * @property isScrolling
 * @type Boolean
 * @default false
 */
ia.ScrollBox.prototype.isScrolling;

/** 
 * Refreshed scroll bars when content resized.
 *
 * @method _resize
 * @private
 */
ia.ScrollBox.prototype._resize = function()
{
	if (this._touchScroll != null) this._touchScroll.refresh()
};

/** 
 * Refreshes scroll bars when content changes.
 *
 * @method scrollToElement
 */
ia.ScrollBox.prototype.scrollToElement = function(ele)
{
	if (this._touchScroll != null) this._touchScroll.scrollToElement(ele, 300)
}

/** 
 * Refreshes scroll bars when content changes.
 *
 * @method refresh
 */
ia.ScrollBox.prototype.refresh = function()
{	
	var me = this;
	if (ia.IS_TOUCH_DEVICE && document.getElementById(me.container.attr("id")) != null) // Add check or iscroll breaks.
	{
		if (me._touchScroll != null)
		{
			me._touchScroll.destroy();
			me._touchScroll = null;
		}
		me._touchScroll = new iScroll(me.container.attr("id"), 
		{
			hideScrollbar: true,
			scrollbarClass: 'touchScrollbar',
			onScrollMove: function() {me.isScrolling = true;}, 
			onScrollEnd : function() {me.isScrolling = false;},
			onTouchEnd : function() {me.isScrolling = false;}
		});
	}
};