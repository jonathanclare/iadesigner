/** 
 * The base class for bar layers.
 *
 * @author J Clare
 * @class ia.BarLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.BarLayer = function()
{
	ia.BarLayer.baseConstructor.call(this);

	this._maxBarWidth = 20;
	this._minBarWidthForStroke = 10;
	this._barSize = 10;
	
	this.sortDirection = "ascending";
};
ia.extend(ia.ItemLayer, ia.BarLayer);

/** 
 * The sort direction.
 *
 * @property sortDirection
 * @type String
 * @default "ascending"
 */
ia.BarLayer.prototype.sortDirection;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.BarLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.BarLayer.prototype.maxValue;

/**
 * Updates the data.
 *
 * @method update
 */
ia.BarLayer.prototype.update = function() 
{
	// Check if the data has changed
	if (this.map && this.dataChanged)
	{
		// Get the data.
		var data = this.getData();

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
				// Get the min and max bar values for the layer.
				this.minValue = Math.min(this.minValue, value);
				this.maxValue = Math.max(this.maxValue, value);
			
				// Create a new chart item.
				var chartItem =  {};
				chartItem.id = dataItem.id;
				chartItem.name = dataItem.name;
				chartItem.color = dataItem.color;
				chartItem.value = value;

				chartItem.state = ia.ItemLayer.UNSELECTED;
				if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
				chartItem.parent = this;
				chartItem.layer = this;

				chartItem.rect = new ia.Rectangle();
				chartItem.hitArea = new ia.Rectangle();
	
				this.items[id] = chartItem;
				this.itemArray.push(chartItem);

				// Limits data.
				if (dataItem.upperLimit && dataItem.lowerLimit) 
				{
					if (ia.isNumber(dataItem.upperLimit) && ia.isNumber(dataItem.lowerLimit)) 
					{
						chartItem.upperLimit = dataItem.upperLimit;
						chartItem.lowerLimit = dataItem.lowerLimit;
						this.maxValue = Math.max(this.maxValue, chartItem.upperLimit);
						this.minValue = Math.min(this.minValue, chartItem.lowerLimit);
					}
				}
			}
		}
		
		// Sort items if in sort direction.
		if (this.sortDirection != undefined)
		{
			var dir;
			if (this.sortDirection == "ascending") dir = 1
			else dir = -1;
			
			this.itemArray.sort(function(a, b)
			{
				if (parseFloat(a.value) < parseFloat(b.value)) return -dir;
				if (parseFloat(a.value) > parseFloat(b.value)) return dir;
				return 0; 
			});
		}

		this.dataChanged = false;
	}
}

/**
 * Renders the data.
 *
 * @method render
 */
ia.BarLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();

	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.selectionContext[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	
	this.selectionContext.strokeStyle = this.selectionColor;
	this.selectionContext.lineWidth = parseFloat(this.style.lineWidth) + 1;

	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
	this.highlightContext.lineWidth = parseFloat(this.style.lineWidth) + 1;
	
	var nItems = this.itemArray.length;
	if (this.map.orientation == "vertical")
		this._barSize = this.map.canvasWidth / nItems;
	else
		this._barSize = this.map.canvasHeight / nItems;
	
	if (this._barSize >= this._minBarWidthForStroke)  
	{
		this.selectionContext.fillStyle = "rgba(0, 0, 0, 0)";
		this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.3);
	}
	else 
	{
		this.selectionContext.fillStyle = ia.Color.toRGBA(this.selectionColor);
		this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor);
	}
	
	// Render the items.
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem, i);
		this._renderItem(chartItem);
	}

    // Render the limits.
	this.context.strokeStyle = this.map.limitsColor;
	this.context.lineWidth = this.map.limitsWidth;
	this.context.beginPath();
	for (var i = 0; i < nItems; i++)
	{
	    this._drawLimit(this.itemArray[i], this.context);
	}
	this.context.stroke();

	// Render the selection.
	this.renderSelection();
};

/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @param {Number} index The index of the item in the item array.
 * @private
 */
ia.BarLayer.prototype._setItemShape = function(item, index)
{
	if (this.map.orientation == "vertical")
	{
		var nItems = this.itemArray.length;

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
		
		// The pixel drawing rectangle for the bar.
		item.rect.y = barY
		item.rect.height = barHeight;
		item.rect.x = this.map.canvasX + (index/nItems) * this.map.canvasWidth;
		item.rect.width = this.map.canvasWidth / nItems;	

		// The pixel hit area for the bar.
		// Stretches the full height of the chart and full width of area reserved for bar.
		item.hitArea.x = item.rect.x;
		item.hitArea.y = this.map.canvasY;
		item.hitArea.width = item.rect.width;
		item.hitArea.height = this.map.canvasHeight;
		
		// Limits data.
		if (item.upperLimit && item.lowerLimit) 
		{
			item.ul = {};
			item.ll = {};
			item.ul.x = item.rect.x + (item.rect.width/2);
			item.ul.y = this.map.getPixelY(item.upperLimit);
			item.ll.x = item.rect.x + (item.rect.width/2);
			item.ll.y = this.map.getPixelY(item.lowerLimit);
		}

		// Check bar width is within accepted size limits.
		if (item.rect.width > this._maxBarWidth) 
		{	
			item.rect.x = item.rect.x + ((item.rect.width  - this._maxBarWidth) / 2);
			item.rect.width = this._maxBarWidth;
		}
		else if (item.rect.width < this._minBarWidthForStroke) 
		{
			//  Creates a slight bar overlap so you dont get whiteline rendering problem.
			item.rect.width++;
		}
	}
	else
	{
		var nItems = this.itemArray.length;

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

		// The pixel drawing rectangle for the bar.
		item.rect.x = barX;
		item.rect.width = barWidth;
		item.rect.y = this.map.canvasY + (index/nItems) * this.map.canvasHeight;
		item.rect.height = this.map.canvasHeight / nItems;

		// The pixel hit area for the bar.
		// Stretches the full width of the chart and full height of area reserved for bar.
		item.hitArea.x = this.map.canvasX;
		item.hitArea.y = item.rect.y;
		item.hitArea.width = this.map.canvasWidth;
		item.hitArea.height = item.rect.height;
		
		// Limits data.
		if (item.upperLimit && item.lowerLimit) 
		{
			item.ul = {};
			item.ll = {};
			item.ul.x = this.map.getPixelX(item.upperLimit);
			item.ul.y = item.rect.y + (item.rect.height/2);
			item.ll.x = this.map.getPixelX(item.lowerLimit);
			item.ll.y = item.rect.y + (item.rect.height/2);
		}
		
		// Check bar width is within accepted size limits.
		if (item.rect.height > this._maxBarWidth) 
		{	
			item.rect.y = item.rect.y + ((item.rect.height  - this._maxBarWidth) / 2);
			item.rect.height = this._maxBarWidth;
		}
		else if (item.rect.height < this._minBarWidthForStroke) 
		{
			//  Creates a slight bar overlap so you dont get whiteline rendering problem.
			item.rect.height++;
		}
	}
};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.BarLayer.prototype._renderItem = function(item)
{
	this.context.fillStyle = item.color;
	this._drawItem(item, this.context);
};
	
/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.BarLayer.prototype.selectItem = function(item)
{	
    this._drawItem(item, this.selectionContext);

    /*this.selectionContext.beginPath();
    this._drawLimit(item, this.selectionContext);
    this.selectionContext.stroke();*/
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.BarLayer.prototype.highlightItem = function(item)
{	
    this._drawItem(item, this.highlightContext);

    /*this.highlightContext.beginPath();
    this._drawLimit(item, this.highlightContext);
    this.highlightContext.stroke();*/
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.BarLayer.prototype._drawItem = function(item, ctx)
{
	ctx.beginPath();
		ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
	ctx.fill();
	if (this._barSize >= this._minBarWidthForStroke) ctx.stroke();
	
	// Limits data.
	/*if (item.ul && item.ll) 
	{
		ctx.beginPath();
			ctx.moveTo(item.ul.x, item.ul.y);
			ctx.lineTo(item.ll.x, item.ll.y);

			if (this._barSize >= this._minBarWidthForStroke)
			{
				if (this.map.orientation == "vertical")
				{
					ctx.moveTo(item.rect.x, item.ul.y);
					ctx.lineTo((item.rect.x + item.rect.width), item.ul.y);
					ctx.moveTo(item.rect.x, item.ll.y);
					ctx.lineTo((item.rect.x + item.rect.width), item.ll.y);
				}
				else
				{
					ctx.moveTo(item.ul.x, item.rect.y);
					ctx.lineTo(item.ul.x, item.rect.y + item.rect.height);
					ctx.moveTo(item.ll.x, item.rect.y);
					ctx.lineTo(item.ll.x, item.rect.y + item.rect.height);
				}
			}
		ctx.stroke();
	}*/
};

/**
 * Does the actual drawing.
 *
 * @method _drawLimit
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.BarLayer.prototype._drawLimit = function (item, ctx)
{
    // Limits data.
    if (item.ul && item.ll)
    {
        ctx.moveTo(item.ul.x, item.ul.y);
        ctx.lineTo(item.ll.x, item.ll.y);

        if (this._barSize >= this._minBarWidthForStroke)
        {
            if (this.map.orientation == "vertical")
            {
                ctx.moveTo(item.rect.x, item.ul.y);
                ctx.lineTo((item.rect.x + item.rect.width), item.ul.y);
                ctx.moveTo(item.rect.x, item.ll.y);
                ctx.lineTo((item.rect.x + item.rect.width), item.ll.y);
            }
            else
            {
                ctx.moveTo(item.ul.x, item.rect.y);
                ctx.lineTo(item.ul.x, item.rect.y + item.rect.height);
                ctx.moveTo(item.ll.x, item.rect.y);
                ctx.lineTo(item.ll.x, item.rect.y + item.rect.height);
            }
        }
    }
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.BarLayer.prototype.hitItem = function(item, event)
{
	return item.hitArea.intersects(event.x, event.y);
};

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.BarLayer.prototype.showTip = function(item, event)
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
			px = (item.rect.x + (item.rect.width / 2)) - (this.map.datatip.getWidth() / 2);

			if (item.value < 0)
				py = item.rect.y + item.rect.height + 5;
			else
				py = item.rect.y - this.map.datatip.getHeight() - 5;
		}
		else
		{
			if (item.value < 0)
				px = item.rect.x - (this.map.datatip.getWidth() + 5);
			else
				px = (item.rect.x + item.rect.width) + 5;

			py = (item.rect.y + (item.rect.height / 2)) -  (this.map.datatip.getHeight() / 2);
		}
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};