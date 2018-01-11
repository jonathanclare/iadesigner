/** 
 * The base class for comparison time bar series layers.
 *
 * @author J Clare
 * @class ia.ComparisonTimeBarLayer
 * @extends ia.TimeLayer
 * @constructor
 */
ia.ComparisonTimeBarLayer = function()
{
	ia.ComparisonTimeBarLayer.baseConstructor.call(this);

	this.isComparison = true;
	this.displayAll = false;
	this.selectedDate = "";
};
ia.extend(ia.TimeBarLayer, ia.ComparisonTimeBarLayer);
	
/**
 * The selected date.
 *
 * @property selectedDate
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.ComparisonTimeBarLayer.prototype.selectedDate;
	
/**
 * Specifies a thematic for the layer.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.ComparisonTimeBarLayer.prototype.thematic;

/** 
 * Should all data be displayed.
 *
 * @property displayAll
 * @type Boolean
 * @default false
 */
ia.ComparisonTimeBarLayer.prototype.displayAll;

/** 
 * Shortcut to avoid verbose code - referenced in ia.TimeLayer.
 *
 * @property isComparison
 * @type Boolean
 * @default true
 */
ia.ComparisonTimeBarLayer.prototype.isComparison;

/**
 * Renders the data.
 *
 * @method render
 */
ia.ComparisonTimeBarLayer.prototype.render = function() 
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
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
	this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.1);
	this.highlightContext.lineWidth = parseFloat(this.style.lineWidth) + 1.5;
	this.selectionContext.lineWidth = parseFloat(this.style.lineWidth) + 1.5;
	this.context.lineWidth = parseFloat(this.style.lineWidth) + 1.5;

	// Render the items.
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];

		var nChildItems = chartItem.childItems.length;
		for (var j = 0; j < nChildItems; j++)
		{
			var childItem = chartItem.childItems[j];
			if (childItem.value != undefined) this._setItemShape(childItem, j, nChildItems);
		}
		
		if (this.displayAll) this._renderItem(chartItem);
	}

	this.renderSelection();
};


/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @param {Number} index The index of the item in the item array.
 * @param {Number} nItems The number of items.
 * @private
 */
ia.ComparisonTimeBarLayer.prototype._setItemShape = function(item, index, nItems)
{
	var h = 4;
		
	// Reset the pixel drawing area for the point.
	if (ia.IS_TOUCH_DEVICE) // Larger hit area for touch devices.
	{
		h = 8;
	}

	if (this.map.orientation == "vertical")
	{
		// Calculate the bounding box of the chart item.
		var barY, barHeight;
		if (this.map.getBBox().getYMin() < 0) // Chart with negative values.
		{
			if (item.value < 0) barY = this.map.getPixelY(0);
			else barY = this.map.getPixelY(item.value);
			barHeight = this.map.getPixelHeight(Math.abs(item.value));
		}
		else // Chart min is 0 or greater.
		{
			var barY = this.map.getPixelY(item.value);
			barHeight = this.map.getPixelHeight(Math.abs(item.value) - this.map.getBBox().getYMin());
		}	
		
		// Adjust for when bar value is outside fixed min/max values.
		if (item.value < this.map.getBBox().getYMin()) 
		{
			barY = this.map.canvasY + this.map.canvasHeight;
			barHeight = barHeight - this.map.getPixelHeight(Math.abs(item.value) - this.map.getBBox().getYMin());
		}
		if (item.value > this.map.getBBox().getYMax()) 
		{
			barY = this.map.canvasY;
			barHeight = barHeight - this.map.getPixelHeight(Math.abs(item.value) - this.map.getBBox().getYMax());
		}

		var barWidth = this.map.canvasWidth / nItems;
		var x = this.map.canvasX + (barWidth * index);

		// The pixel drawing rectangle for the bar.
		item.rect.y = barY
		item.rect.height = barHeight;
		item.rect.width = barWidth;	
		item.rect.x = x;
		
		// The pixel hit area for the bar.
		item.hitArea.x = item.rect.x;
		if (item.value > 0)
			item.hitArea.y = barY - h;
		else
			item.hitArea.y = (barY + barHeight) - h;
		item.hitArea.width = item.rect.width;
		item.hitArea.height = h * 2;
	}
	else
	{
		// Calculate the bounding box of the chart item.
		var barX, barWidth;
		if (this.map.getBBox().getXMin() < 0) // Chart with negative values.
		{
			if (item.value < 0) barX = this.map.getPixelX(item.value);
			else barX = this.map.getPixelX(0);
			barWidth = this.map.getPixelWidth(Math.abs(item.value));
		}
		else // Chart min is 0 or greater.
		{
			var barX = this.map.getPixelX(this.map.getBBox().getXMin());
			barWidth = this.map.getPixelWidth(Math.abs(item.value) - this.map.getBBox().getXMin());
		}
		
		// Adjust for when bar value is outside fixed min/max values.
		if (item.value < this.map.getBBox().getXMin()) 
		{
			barX = this.map.canvasX;
			barWidth = barWidth - this.map.getPixelWidth(Math.abs(item.value) - Math.abs(this.map.getBBox().getXMin()));
		}
		if (item.value > this.map.getBBox().getXMax()) 
		{
			barWidth = barWidth - this.map.getPixelWidth(Math.abs(item.value) - Math.abs(this.map.getBBox().getXMax()));
		}

		var barHeight = this.map.canvasHeight / nItems;
		var y = this.map.canvasY + (barHeight * index);
		
		// The pixel drawing rectangle for the bar.
		item.rect.x = barX;
		item.rect.width = barWidth;
		item.rect.height = barHeight;
		item.rect.y = y;


		// The pixel hit area for the bar.
		if (item.value < 0)
			item.hitArea.x = barX - h;
		else
			item.hitArea.x = (barX + barWidth) - h;
		item.hitArea.y = item.rect.y;
		item.hitArea.width = h * 2;
		item.hitArea.height = item.rect.height;
	}	
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonTimeBarLayer.prototype.clearSelection = function() {};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonTimeBarLayer.prototype._renderItem = function(item)
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
ia.ComparisonTimeBarLayer.prototype.selectItem = function(item)
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
ia.ComparisonTimeBarLayer.prototype.highlightItem = function(item)
{	
	this.highlightContext.strokeStyle = ia.Color.toRGBA(item.color, 0.8);
	this.highlightContext.fillStyle = ia.Color.toRGBA(item.color, 0.1);

	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		
		if (childItem.value != undefined) 
		{
			var drawStroke = false
			if (this.map.orientation == "vertical")
			{
				var x1 = this.map.canvasX + ((this.map.canvasWidth / n) * i);
				var x2 = this.map.canvasX + ((this.map.canvasWidth / n) * (i+1));
				var y1 = childItem.rect.y;
				if (childItem.value < 0) y1 = y1 + childItem.rect.height;
				var y2 = y1;

				if (childItem.value >= this.map.getBBox().getYMin()
				&& childItem.value <= this.map.getBBox().getYMax()) 
				{
					drawStroke = true;
				}
			}
			else
			{
				var x1 = childItem.rect.x + childItem.rect.width;
				if (childItem.value < 0) x1 = x1 - childItem.rect.width;
				var x2 = x1;
				var y1 = this.map.canvasY + ((this.map.canvasHeight / n) * i);
				var y2 = this.map.canvasY + ((this.map.canvasHeight / n) * (i+1));

				if (childItem.value >= this.map.getBBox().getXMin()
				&& childItem.value <= this.map.getBBox().getXMax()) 
				{
					drawStroke = true;
				}
			}
			if (drawStroke) 
			{
				this.highlightContext.beginPath();
				this.highlightContext.moveTo(x1, y1);
				this.highlightContext.lineTo(x2, y2);
				this.highlightContext.stroke();
			}

			this.highlightContext.beginPath();
				if (this.map.orientation == "vertical") this.highlightContext.rect(x1, childItem.rect.y, x2-x1, childItem.rect.height);
				else this.highlightContext.rect(childItem.rect.x, y1, childItem.rect.width, y2-y1);
			this.highlightContext.fill();
		}
	}
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.ComparisonTimeBarLayer.prototype._drawItem = function(item, ctx)
{
	var n = item.childItems.length;
	
	ctx.beginPath();
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (this.map.orientation == "vertical")
			{
				var x1 = childItem.rect.x;
				var x2 = childItem.rect.x + childItem.rect.width;
				var y1 = childItem.rect.y;
				if (childItem.value < 0) y1 = y1 + childItem.rect.height;
				var y2 = y1;
			}
			else
			{
				var x1 = childItem.rect.x + childItem.rect.width;
				if (childItem.value < 0) x1 = x1 - childItem.rect.width;
				var x2 = x1;
				var y1 = childItem.rect.y;
				var y2 = childItem.rect.y + childItem.rect.height;
			}

			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			if (this.map.animationMode && childItem.name == this.selectedDate) break;
		}
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
ia.ComparisonTimeBarLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id) || this.displayAll)
	{
		var n = item.childItems.length;
		for (var i = 0; i < n; i++)
		{
			var childItem = item.childItems[i];
			if (childItem.value != undefined) 
			{
				if (childItem.hitArea.intersects(event.x,event.y)) return true;
			}
		}
	}
	return false;
};