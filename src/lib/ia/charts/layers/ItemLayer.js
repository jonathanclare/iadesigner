/** 
 * A <code>ia.ItemEvent</code> object.
 *
 * @author J Clare
 * @class ia.ItemEvent
 * @extends ia.Event
 * @constructor
 * @param eventType The event type.
 * @param {Object} item The item associated with the event.
 * @param {Object} evt A mouse event.
 * @param {Number} pixelX The pixel x coordinate of the mouse.
 * @param {Number} pixelY The pixel y coordinate of the mouse.
 * @param {Number} dataX The data x coordinate of the mouse.
 * @param {Number} dataY The data y coordinate of the mouse.
 * @param {Number} pageX The page x coordinate in pixels.
 * @param {Number} pageY The page y coordinate in pixels.
 */
ia.ItemEvent = function(eventType, item, evt, pixelX, pixelY, dataX, dataY, pageX, pageY)
{
	ia.ItemEvent.baseConstructor.call(this, eventType, item);

	this.item = item;
	this.x = pixelX;
	this.y = pixelY;
	this.dataX = dataX;
	this.dataY = dataY;
	this.pageX = pageX;
	this.pageY = pageY;

	if (evt && evt.mouseEvent.originalEvent) this.isTouchEvent = evt.mouseEvent.originalEvent.touches != undefined ? true : false;
	else this.isTouchEvent = false;
};
ia.extend(ia.Event, ia.ItemEvent);

/**
 * Indicates that the user clicked the mouse button over a canvas but not over an item.
 * 
 * @static
 * @final
 * @property NONE_ITEM_CLICK
 * @type String
 * @default "noneItemClick"
 */
ia.ItemEvent.NONE_ITEM_CLICK = "noneItemClick";

/**
 * Indicates that the user clicked the mouse button over a canvas item.
 * 
 * @static
 * @final
 * @property ITEM_CLICK
 * @type String
 * @default "itemClick"
 */
ia.ItemEvent.ITEM_CLICK = "itemClick";

/**
 * Indicates that the user pressed the mouse button over a canvas item.
 * 
 * @static
 * @final
 * @property ITEM_MOUSE_DOWN
 * @type String
 * @default "itemMouseDown"
 */
ia.ItemEvent.ITEM_MOUSE_DOWN = "itemMouseDown";

/**
 * Indicates that the user released the mouse button over a canvas item.
 * 
 * @static
 * @final
 * @property ITEM_MOUSE_UP
 * @type String
 * @default "itemMouseUp"
 */
ia.ItemEvent.ITEM_MOUSE_UP = "itemMouseUp";

/**
 * Indicates that the user moved the mouse pointer while hovering over a canvas.
 * 
 * @static
 * @final
 * @property ITEM_MOUSE_MOVE
 * @type String
 * @default "itemMouseMove"
 */
ia.ItemEvent.ITEM_MOUSE_MOVE = "itemMouseMove";

/**
 * Indicates that the user rolled the mouse pointer over a canvas item.
 * 
 * @static
 * @final
 * @property ITEM_MOUSE_OVER
 * @type String
 * @default "itemMouseOver"
 */
ia.ItemEvent.ITEM_MOUSE_OVER = "itemMouseOver";

/**
 * Indicates that the user rolled the mouse pointer out of a canvas item.
 * 
 * @static
 * @final
 * @property ITEM_MOUSE_OUT
 * @type String
 * @default "itemMouseOut"
 */
ia.ItemEvent.ITEM_MOUSE_OUT = "itemMouseOut";

/** 
 * The item.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.item;

/** 
 * The pixel x.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.x;

/** 
 * The pixel y.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.y;

/** 
 * The data x.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.dataX;

/** 
 * The data y.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.dataY;

/** 
 * The page x.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.pageX;

/** 
 * The page y.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemEvent.prototype.pageY;

/** 
 * Check if its a touch event
 *
 * @property isTouchEvent
 * @type Boolean
 */
ia.ItemEvent.prototype.isTouchEvent;

/** 
 * The base class for map layers.
 *
 * @author J Clare
 * @class ia.ItemLayer
 * @extends ia.LayerBase
 * @constructor
 * @param {String} inSource The spatial data source.
 */
ia.ItemLayer = function()
{
	ia.ItemLayer.baseConstructor.call(this);

	this._data = new Object();
	this._rollOverItem = undefined;
	this._redrawSelectionTimeout = null;

	this.items = {};
	this.itemArray = [];
	this.doHitTest = true;
	this.style = {fillStyle:'#ffffff', strokeStyle:'#bbbbbb', lineWidth:'1', lineJoin:'round'};
	this.selectionColor = "#ff0000";
	this.highlightColor = "#00ff00";
	this.selectionIds = [];
	this.dataField = "value";
	this.dataChanged = false;
	this.tip = "";
};
ia.extend(ia.LayerBase, ia.ItemLayer);

/**
 * Value that indicates the <code>Feature</code> appears selected.
 * 
 * @static
 * @final
 * @property SELECTED
 * @type String
 * @default "selected"
 */
ia.ItemLayer.SELECTED = "selected";

/**
 * Value that indicates the <code>Feature</code> appears as if the mouse is
 * over it and is selected.
 * 
 * @static
 * @final
 * @property ROLLOVER_SELECTED
 * @type String
 * @default "rollOverSelected"
 */
ia.ItemLayer.ROLLOVER_SELECTED = "rollOverSelected";

/**
 * Value that indicates the <code>Feature</code> appears as if the mouse is
 * over it.
 * 
 * @static
 * @final
 * @property ROLLOVER
 * @type String
 * @default "rollOver"
 */
ia.ItemLayer.ROLLOVER = "rollOver";

/**
 * Value that indicates the <code>Feature</code> appears unselected.
 * 
 * @static
 * @final
 * @property UNSELECTED
 * @type String
 * @default "unselected"
 */
ia.ItemLayer.UNSELECTED = "unselected";

/**
 * Animation mode.
 *
 * @property animationMode
 * @type Boolean
 * @default false
 */
ia.ItemLayer.prototype.animationMode;
	
/** 
 * The label canvas associated with this layer.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ItemLayer.prototype.labelCanvas;

/** 
 * The label canvas context associated with this layer.
 *
 * @property labelContext
 * @type HTML Canvas Context
 */
ia.ItemLayer.prototype.labelContext;	

/** 
 * The highlight canvas associated with this layer.
 *
 * @property highlightCanvas
 * @type HTML Canvas
 */
ia.ItemLayer.prototype.highlightCanvas;

/** 
 * The highlight canvas context associated with this layer.
 *
 * @property highlightContext
 * @type HTML Canvas Context
 */
ia.ItemLayer.prototype.highlightContext;	

/** 
 * The selection canvas associated with this layer.
 *
 * @property selectionCanvas
 * @type HTML Canvas
 */
ia.ItemLayer.prototype.selectionCanvas;

/** 
 * The selection canvas context associated with this layer.
 *
 * @property selectionContext
 * @type HTML Canvas Context
 */
ia.ItemLayer.prototype.selectionContext;	

/**
 * An associate array containing the layer items.
 *
 * @property items
 * @type Associative Array
 */
ia.ItemLayer.prototype.items;

/**
 * An array containing the layer items.
 *
 * @property itemArray
 * @type Object[]
 */
ia.ItemLayer.prototype.itemArray;

/**
 * Indicates whether to carry out a hit test.
 *
 * @property doHitTest
 * @type Boolean
 * @default true
 */
ia.ItemLayer.prototype.doHitTest;
	
/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#EFEFEF', strokeStyle:'#CCCCCC', lineWidth:'1', lineJoin:'round'}
 */
ia.ItemLayer.prototype.style;

/** 
 * The item selection color.
 *
 * @property selectionColor
 * @type String
 * @default "#ff0000"E
 */
ia.ItemLayer.prototype.selectionColor;

/** 
 * The item highlight color.
 *
 * @property highlightColor
 * @type String
 * @default "#00ff00"
 */
ia.ItemLayer.prototype.highlightColor;

/** 
 * An array of selected ids.
 *
 * @property selectionIds
 * @type String[]
 */
ia.ItemLayer.prototype.selectionIds;
	
/**
 * Specifies the field of the data provider that provides the values.
 *
 * @property dataField
 * @type String
 * @default "value"
 */
ia.ItemLayer.prototype.dataField;

/** 
 * Indicates the data has changed.
 *
 * @property dataChanged
 * @type Boolean
 * @default false
 */
ia.ItemLayer.prototype.dataChanged;

/**
 * The data tip - used by charts that have fixed tip templates.
 *
 * @property tip
 * @type String
 * @default ""
 */
ia.ItemLayer.prototype.tip;

/**
 * Gets a data object for the layer.
 *
 * @method getData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.ItemLayer.prototype.getData = function()
{
	return this._data;
};

/**
 * Sets a data object for the layer.
 *
 * @method setData
 * @param value ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.ItemLayer.prototype.setData = function(value)
{
	this._data = value;
	this.dataChanged = true;
};

/**
 * Sets the label style.
 *
 * @method _setLabelStyle
 * @private
 */
ia.ItemLayer.prototype._setLabelStyle = function()	
{
	// Set the map label style.
	var fontFamily = "Verdana";
	var fontSize = 10;
	var fontWeight = "normal";
	var fontFillColor = "#ffffff";
	var fontStrokeColor = "#333333"

	if (this.map.labelStyle)  
	{
		if (this.map.labelStyle.css("font-family")) fontFamily = this.map.labelStyle.css("font-family");
		if (this.map.labelStyle.css("color")) fontFillColor = ia.Color.toHex(this.map.labelStyle.css("color"));
		if (this.map.labelStyle.css("font-weight")) fontWeight = this.map.labelStyle.css("font-weight");
		if (this.map.labelStyle.css("font-size")) 
		{
			fontSize = this.map.labelStyle.css("font-size");
			if (fontSize.indexOf("px") > -1) fontSize = fontSize.substring(0, fontSize.indexOf("px"));
			fontSize = ia.parseInt(fontSize);
		}
		if (this.map.labelStyle.css("borderRightColor")) fontStrokeColor = ia.Color.toHex(this.map.labelStyle.css("borderRightColor"));
	}

	this.labelContext.font = fontWeight+" "+fontSize+"px "+fontFamily;
	this.labelContext.lineWidth = 2;
	this.labelContext.strokeStyle = fontStrokeColor;
	this.labelContext.fillStyle = fontFillColor;
};

/**
 * Gets an item with the given id.
 *
 * @method getItem
 * @param {String} id The id of the item to get.
 */
ia.ItemLayer.prototype.getItem = function(id)	
{
	return this.items[id];
};

/**
 * Clears the item list.
 *
 * @method clearItems
 */
ia.ItemLayer.prototype.clearItems = function(items)	
{
	for (var id in this.items) {delete this.items[id];}
};

/**
 * Handles when to carry out hit tests. 
 * 
 * @method _mapEventHandler
 * @param {ia.MapMouseEvent} event A <code>ia.MapMouseEvent</code>.
 * @private
 */
ia.ItemLayer.prototype._mapEventHandler = function(event)
{
	// Mouse event logic.
	if (event.type == ia.MapMouseEvent.MAP_MOUSE_OVER)
	{
		this.doHitTest = true;
	}
	else if (event.type == ia.MapMouseEvent.MAP_MOUSE_OUT)
	{
		this._hitTest(event);
		this.doHitTest = false;
	}
	else if (this.doHitTest || event.isTouchEvent)
	{
		this._hitTest(event);
	}
};

/**
 * Runs a hit test on the layer. 
 * 
 * @method _hitTest
 * @param {ia.MapMouseEvent} event A <code>ia.MapMouseEvent</code>.
 * @private
 */
ia.ItemLayer.prototype._hitTest = function(event)
{
	if ((this.showDataTips || this.interactive) && this.getVisible())
	{
		var eventType = event.type;
	
		// Only need to do hit test on mouse move.
		// Added map click for touch events.
		if (eventType == ia.MapMouseEvent.MAP_MOUSE_MOVE 
		|| eventType == ia.MapMouseEvent.MAP_MOUSE_DOWN) // Added mouse down for touch screens.
		{
			// Check in order of size  - smallest to largest.
			var n = this.itemArray.length;
			var hitItemList = []
			for (var i = n-1; i >= 0; i--) 
			{
				var item = this.itemArray[i];
				
				if (item.disabled != true)
				{
					// Only one item can ever be hit on a mouse move
					// so can break out of loop once its found.
					if (this.hitItem(item, event)) 
					{
						hitItemList[hitItemList.length] = item;
					}
				}
			}

			// Get smallest hit item because thats "on top";
			if (hitItemList.length > 0)
			{
				if (hitItemList[0].size) // Only map poly/line layers need this.
				{
					var dir = 1;
					hitItemList.sort(function(a, b)
					{
						if (a.size < b.size) return -dir;
						if (a.size > b.size) return dir;
						return 0; 
					});
				}
				
				var item = hitItemList[0];
				if (this._rollOverItem && (item != this._rollOverItem))  
				{
					this._dispatchItemEvent(event, false, this._rollOverItem);
				}

				this._rollOverItem = item;
				this._dispatchItemEvent(event, true, this._rollOverItem);
			
				return;
			}
			
			if (this._rollOverItem)
			{
				this._dispatchItemEvent(event, false, this._rollOverItem);
				this._rollOverItem = null;
			}
		}
		// Otherwise check for clicks, mousedowns, etc. on rollover item.
		else if (this._rollOverItem != null) 
		{
			this._dispatchItemEvent(event, true, this._rollOverItem);
		}
		else if (eventType == ia.MapMouseEvent.MAP_MOUSE_CLICK)
		{
			if (!ia.IS_TOUCH_DEVICE) this.dispatchEvent(new ia.ItemEvent(ia.ItemEvent.NONE_ITEM_CLICK, {parent:this}, event));
		}
	}
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event A <code>ia.MapMouseEvent</code>.
 * @private
 */
ia.ItemLayer.prototype.hitItem = function(item, event) {return false;};

/**
 * The hit logic for items in the layer. 
 * 
 * @method _dispatchItemEvent
 * @param {ia.MapMouseEvent} event A <code>ia.MapMouseEvent</code>.
 * @param {Boolean} isHit Indicates if the item was hit.
 * @param {Object} item The item that was hit.
 * @private
 */
ia.ItemLayer.prototype._dispatchItemEvent = function(event, isHit, item)
{
	var state = item.state;
	var eventType = event.type;
	var itemEventType;
	
	// Set the item event type.
	if (isHit)
	{
		if (eventType == ia.MapMouseEvent.MAP_MOUSE_MOVE)
		{
			if (state == ia.ItemLayer.ROLLOVER || state == ia.ItemLayer.ROLLOVER_SELECTED) itemEventType = ia.ItemEvent.ITEM_MOUSE_MOVE;
			else itemEventType = ia.ItemEvent.ITEM_MOUSE_OVER;
		}
		else if (eventType == ia.MapMouseEvent.MAP_MOUSE_CLICK) itemEventType = ia.ItemEvent.ITEM_CLICK;
		else if (eventType == ia.MapMouseEvent.MAP_MOUSE_UP) itemEventType = ia.ItemEvent.ITEM_MOUSE_UP;
		else if (eventType == ia.MapMouseEvent.MAP_MOUSE_DOWN)  itemEventType = ia.ItemEvent.ITEM_MOUSE_DOWN;
		else if (eventType == ia.MapMouseEvent.MAP_MOUSE_OUT) 
		{
			if (state == ia.ItemLayer.ROLLOVER) itemEventType = ia.ItemEvent.ITEM_MOUSE_OUT;
			else if (state == ia.ItemLayer.ROLLOVER_SELECTED) itemEventType = ia.ItemEvent.ITEM_MOUSE_OUT;
		}
		else if (eventType == ia.MapMouseEvent.MAP_MOUSE_WHEEL_END)  itemEventType = ia.ItemEvent.ITEM_MOUSE_OVER;
	}
	else if (eventType == ia.MapMouseEvent.MAP_MOUSE_MOVE)
	{
		if (state == ia.ItemLayer.ROLLOVER || state == ia.ItemLayer.ROLLOVER_SELECTED) itemEventType = ia.ItemEvent.ITEM_MOUSE_OUT;
	}
	
	// Set the item state.
	if (itemEventType == ia.ItemEvent.ITEM_MOUSE_OVER)
	{
		if (state == ia.ItemLayer.UNSELECTED) item.state = ia.ItemLayer.ROLLOVER;
		else if (state == ia.ItemLayer.SELECTED) item.state = ia.ItemLayer.ROLLOVER_SELECTED;
	}
	else if (itemEventType == ia.ItemEvent.ITEM_CLICK)
	{
		if (state == ia.ItemLayer.ROLLOVER_SELECTED || state == ia.ItemLayer.SELECTED)  item.state = ia.ItemLayer.UNSELECTED;
		else  item.state = ia.ItemLayer.ROLLOVER_SELECTED;
	}
	else if (itemEventType == ia.ItemEvent.ITEM_MOUSE_OUT) 
	{
		if (state == ia.ItemLayer.ROLLOVER) item.state = ia.ItemLayer.UNSELECTED;
		else if (state == ia.ItemLayer.ROLLOVER_SELECTED) item.state = ia.ItemLayer.SELECTED;
	}

	// Dispatch the item event.
	var event = new ia.ItemEvent(itemEventType, item, event, event.x, event.y, event.dataX, event.dataY, event.pageX, event.pageY);

	// This function is called rather than having it listen for item events to
	// give the layer time to update itself before everything is re-rendered
	// in reaction to the item event.
	this._itemEventHandler(event); 

	if (itemEventType != null) this.dispatchEvent(event);
};

/** 
 * Handles default selection / highlight functionality.
 * 
 * @method _itemEventHandler
 * @param event {ia.ItemEvent} An <code>ia.ItemEvent</code> dispatched by this layer.
 * @private
 */	
ia.ItemLayer.prototype._itemEventHandler = function(event) 
{
	var item = event.item;
	
	if (this.interactive)
	{
		if (event.type == ia.ItemEvent.ITEM_MOUSE_OVER)
		{
			ia.showPointerCursor();
			this.clearHighlight();
			this.highlightItem(item, this.highlightContext);
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_DOWN) 
		{
			if (event.isTouchEvent) 
			{
				this.clearHighlight();
				this.highlightItem(item, this.highlightContext);
			}
		}
		if (event.type == ia.ItemEvent.ITEM_CLICK)
		{
			if (item.state == ia.ItemLayer.UNSELECTED) 
			{
				this._removeFromSelection(item.id);
				this.renderSelection();
			}
			else 
			{
				this._addToSelection(item.id);
				this.selectItem(item);
			}
			this.clearHighlight();
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_OUT) 
		{
			ia.showDefaultCursor();
			this.clearHighlight();
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_UP) 
		{
			this.clearHighlight();
		}
		else if (event.type == ia.ItemEvent.NONE_ITEM_CLICK)
		{
			// This never gets called because not listening for this event
			// Its a bug really but left as is because the selection gets cleared  
			// externally by the InteractionGroup - meant KM could use in IAS 
			// where he didnt want a none item click to clear the map selection.
			this.clearSelection(); 
		}
	}
	if (this.showDataTips)
	{
		if (event.type == ia.ItemEvent.ITEM_MOUSE_OVER) 
		{
			ia.showPointerCursor();
			this.showTip(item, event);
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_DOWN) 
		{
			if (event.isTouchEvent) this.showTip(item, event);
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_MOVE) 
		{
			if (!event.isTouchEvent) this.showTip(item, event);
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_OUT)  
		{
			ia.showDefaultCursor();
			if (!event.isTouchEvent) this.hideTip();
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_UP) 
		{
			 this.hideTip();
		}
		else if (event.type == ia.ItemEvent.ITEM_CLICK) 
		{
			 this.hideTip();
		}
	}
};

/** 
 * Supplies the default text for the layer. This can 
 * be replaced with a custom function
 * 
 * @method tipFunction
 * @param {Object} item The map item.
 */
ia.ItemLayer.prototype.tipFunction = function(item)	
{
	return item.name;
};

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.ItemLayer.prototype.showTip = function(item, event) {};

/** 
 * Hides the tip.
 * 
 * @method hideTip
 */
ia.ItemLayer.prototype.hideTip = function() {this.map.datatip.hide()};

/**
 * Removes an id from the selection.
 *
 * @method _removeFromSelection
 * @param {String} id The id of the item.
 * @private
 */
ia.ItemLayer.prototype._removeFromSelection = function(id)
{  
	var index = this.selectionIds.indexOf(id);
	if (index != -1) this.selectionIds.splice(index, 1);
};

/**
 * Adds an id to the selection.
 *
 * @method _addToSelection
 * @param {String} id The id of the item.
 * @private
 */
ia.ItemLayer.prototype._addToSelection = function(id)
{  
	var index = this.selectionIds.indexOf(id);
	if (index == -1) this.selectionIds.push(id);
};

/**
 * Checks if an id is selected
 *
 * @method isSelected
 * @param {String} id The id of the item.
 */
ia.ItemLayer.prototype.isSelected = function(id)
{	
	var index = this.selectionIds.indexOf(id);
	if (index != -1) return true;
	else return false;
};

/**
 * Selects all the items in the layer.
 *
 * @method selectAll
 */
ia.ItemLayer.prototype.selectAll = function()
{	
	this.clearSelection()
	for (var id in this.items) 
	{
		this.select(id);
	}
};

/**
 * Selects an item.
 *
 * @method select
 * @param {String} id The id of the item.
 */
ia.ItemLayer.prototype.select = function(id)
{	
	var item = this.getItem(id);
	if (item) 
	{
		item.state = ia.ItemLayer.SELECTED;
		this._addToSelection(id);
		this.selectItem(item);
	}
};

/**
 * Unselects an item.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.ItemLayer.prototype.unselect = function(id)
{	
	var item = this.getItem(id);
	if (item) 
	{
		item.state = ia.ItemLayer.UNSELECTED;
		this._removeFromSelection(id);
		this._triggerRenderSelection();
	}
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ItemLayer.prototype.clearSelection = function()
{	
	this.selectionIds = [];
	for (var id in this.items) 
	{
		var item = this.items[id];
		if (item) {item.state = ia.ItemLayer.UNSELECTED;}	
	}
	this._clearSelectionGraphics();
};

/** 
 * Triggers a selection render. Prevents over rendering which results in a frozen browser.
 *
 * @method _triggerRenderSelection
 * @private
 */
ia.ItemLayer.prototype._triggerRenderSelection = function()
{
	var me = this;
	if (!this._redrawSelectionTimeout) 
	{
		this._redrawSelectionTimeout = setTimeout(function()
		{
			this.renderSelection()
		}.bind(this), 5);
	}
};

/** 
 * Renders the selection canvas.
 *
 * @method renderSelection
 */
ia.ItemLayer.prototype.renderSelection = function()
{
	this._redrawSelectionTimeout = null;
	this._clearSelectionGraphics();
	
	var n = this.selectionIds.length;
	for (var i = 0; i < n; i++) 
	{
		var id = this.selectionIds[i];
		var item = this.items[id]
		if (item) {this.selectItem(item);}	
	}
};
		
/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item to select.
 */
ia.ItemLayer.prototype.selectItem = function(item) {};
	
/**
 * Hightlights an item.
 *
 * @method highlight
 * @param {String} id The id of the item to highlight.
 */
ia.ItemLayer.prototype.highlight = function(id)
{		
	var item = this.getItem(id);
	if (item) this.highlightItem(item);		
};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.ItemLayer.prototype.clearHighlight = function()
{	
	this._clearHighlightGraphics();
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item to highlight.
 */
ia.ItemLayer.prototype.highlightItem = function(item) {};

/** 
 * Clears all canvases in the layer.
 *
 * @method clear
 */
ia.ItemLayer.prototype.clear = function()
{	
	/*if (this.map)
	{
		// This is set here because clear() is called by all subclasses when they are rendered.
		// Set the chart item style.
		// * BUG-FIX FF and IE dont recognize border-color but will pick up borderRightColor which is set to be same as border-color in css. *
		if (this.map.itemStyle && this.map.itemStyle.css("borderRightColor"))  this.style.strokeStyle = ia.Color.toHex(this.map.itemStyle.css("borderRightColor"));
		if (this.map.itemStyle && this.map.itemStyle.css("background-color"))  this.style.fillStyle = ia.Color.toHex(this.map.itemStyle.css("background-color"));
	}*/

	this.hideTip();
	this._rollOverItem = null;
	this._clearHighlightGraphics();
	this._clearSelectionGraphics();
	this._clearLayerGraphics();
	this._clearLabelGraphics();
};

/** 
 * Clears a canvas.
 *
 * @method _clearCanvas
 * @param {HTML Canvas} c The canvas to clear.
 * @param {HTML Canvas Context} ctx Its context.
 * @private
 */
ia.ItemLayer.prototype._clearCanvas = function(c, ctx) 
{
	if (c) ctx.clearRect(0, 0, c.width, c.height);
};

/** 
 * Clears the highlight canvas.
 *
 * @method _clearHighlightGraphics
 * @private
 */
ia.ItemLayer.prototype._clearHighlightGraphics = function() 
{
	if (this.showDataTips || this.interactive || this.highlightable) this._clearCanvas(this.highlightCanvas, this.highlightContext);
};

/** 
 * Clears the selection canvas.
 *
 * @method _clearSelectionGraphics
 * @private
 */
ia.ItemLayer.prototype._clearSelectionGraphics = function() 
{
	if (this.showDataTips || this.interactive || this.highlightable) this._clearCanvas(this.selectionCanvas, this.selectionContext);
};

/** 
 * Clears the label canvas.
 *
 * @method _clearLabelGraphics
 * @private
 */
ia.ItemLayer.prototype._clearLabelGraphics = function() 
{
	if (this.showLabels && this.labelCanvas) 
	{
		this._clearCanvas(this.labelCanvas, this.labelContext);
		this._setLabelStyle();
	}
};

/** 
 * Clears the layer canvases.
 *
 * @method _clearLayerGraphics
 * @private
 */
ia.ItemLayer.prototype._clearLayerGraphics = function() {this._clearCanvas(this.canvas, this.context);};