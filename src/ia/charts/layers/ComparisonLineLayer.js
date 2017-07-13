/** 
 * The base class for comparison line layers.
 *
 * @author J Clare
 * @class ia.ComparisonLineLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.ComparisonLineLayer = function()
{
	ia.ComparisonLineLayer.baseConstructor.call(this);

	this.style = {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'};
	this.displayAll = false;
};
ia.extend(ia.ItemLayer, ia.ComparisonLineLayer);

/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'}
 */
ia.ComparisonLineLayer.prototype.style;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.ComparisonLineLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.ComparisonLineLayer.prototype.maxValue;

/** 
 * Should all data be displayed.
 *
 * @property displayAll
 * @type Boolean
 * @default false
 */
ia.ComparisonLineLayer.prototype.displayAll;

/**
 * Updates the data.
 *
 * @method update
 */
ia.ComparisonLineLayer.prototype.update = function() 
{
	// Check if the data has changed
	if (this.map && this.dataChanged)
	{
		// Get the data.
		var data = this.getData()

		// Clear the items.
		this.itemArray = [];
		this.clearItems();
		
		this.minValue = Infinity;
		this.maxValue = -Infinity;
		
		// Loop through the data.
		for (var id in data)
		{
			// Get the data item.
			var dataItem = data[id];

			// Has to be a number to be displayed in a bar chart
			var value = dataItem[this.dataField];
			if (ia.isNumber(value)) 
			{	
			
				// Create a new chart item.
				var chartItem =  {};
				chartItem.id = dataItem.id;
				chartItem.name = dataItem.name;
				chartItem.color = dataItem.color;
				chartItem.value = dataItem[this.dataField];
				chartItem.shape = new ia.Rectangle();
				chartItem.hitArea = new ia.Rectangle();

				chartItem.state = ia.ItemLayer.UNSELECTED;
				if (this.selectionIds.indexOf(chartItem.id) != -1) 
				{
					// Get the min and max bar values for the layer.
					this.minValue = Math.min(this.minValue, value);
					this.maxValue = Math.max(this.maxValue, value);
					chartItem.state = ia.ItemLayer.SELECTED;
				}
				if (this.displayAll)
				{
					// Get the min and max bar values for the layer.
					this.minValue = Math.min(this.minValue, value);
					this.maxValue = Math.max(this.maxValue, value);
				}
				chartItem.parent = this;
				chartItem.layer = this;

				this.items[id] = chartItem;
				this.itemArray.push(chartItem);
			}
		}
		
		this.dataChanged = false;
	}
};

/**
 * Renders the data.
 *
 * @method render
 */
ia.ComparisonLineLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();
	
	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
		this.selectionContext[p] = this.style[p];
	} 
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor);
	
	// Set the items shape.
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem);
		if (this.displayAll) this._renderItem(chartItem);
	}

	if (!this.displayAll) this.renderSelection();
};

/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonLineLayer.prototype._setItemShape = function(item)
{
	if (this.map.orientation == "vertical")
	{
		// Reset the pixel drawing area for the point.
		item.shape.x = this.map.canvasX;
		item.shape.y = this.map.getPixelY(item.value);
		item.shape.width = this.map.canvasWidth;
		item.shape.height = 0;

		// Reset the pixel hit area for the point.
		item.hitArea.x = item.shape.x;
		item.hitArea.y = item.shape.y - 1;
		item.hitArea.width = item.shape.width;
		item.hitArea.height = 2;
	}
	else
	{
		// Reset the pixel drawing area for the point.
		item.shape.x = this.map.getPixelX(item.value);
		item.shape.y = this.map.canvasY;
		item.shape.width = 0;
		item.shape.height = this.map.canvasHeight;

		// Reset the pixel hit area for the point.
		item.hitArea.x = item.shape.x - 1;
		item.hitArea.y = item.shape.y;
		item.hitArea.width = 2;
		item.hitArea.height = item.shape.height;
	}
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonLineLayer.prototype.clearSelection = function() {};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonLineLayer.prototype._renderItem = function(item)
{
	this.context.strokeStyle = item.color;
	this._drawItem(item, this.context);
};

/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.ComparisonLineLayer.prototype.selectItem = function(item)
{	
	this.selectionContext.strokeStyle = item.color;
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.ComparisonLineLayer.prototype.highlightItem = function(item)
{	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.highlightContext.beginPath();
	    this.highlightContext.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.highlightContext.clip();
	}
	
	this._drawItem(item, this.highlightContext);
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.ComparisonLineLayer.prototype._drawItem = function(item, ctx)
{
	ctx.beginPath();
		if (this.map.orientation == "vertical")
		{
			ctx.moveTo(item.shape.x, item.shape.y);
			ctx.lineTo(item.shape.x+item.shape.width, item.shape.y);
		}
		else
		{
			ctx.moveTo(item.shape.x, item.shape.y);
			ctx.lineTo(item.shape.x, item.shape.y+item.shape.height);
		
		}
	ctx.stroke();
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.ComparisonLineLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id) || this.displayAll)
	{
		return item.hitArea.intersects(event.x, event.y);	
	}
	return false;
};

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.ComparisonLineLayer.prototype.showTip = function(item, event)
{
	this.map.datatip.text(this.tipFunction(item));
	
	// Position above the bar.
	var px,py;

	if (event.isTouchEvent)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		if (this.map.orientation == "vertical")
		{
			px = event.x -  (this.map.datatip.getWidth() / 2);
			py = item.shape.y - this.map.datatip.getHeight() - 5;
		}
		else
		{
			px = (item.shape.x + item.shape.width) + 5;
			py = event.y -  (this.map.datatip.getHeight() / 2);
		}
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};