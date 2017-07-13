/** 
 * The base class for bar layers.
 *
 * @author J Clare
 * @class ia.BoxLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.BoxLayer = function()
{
	ia.BoxLayer.baseConstructor.call(this);
	
	this._maxBarWidth = 20;
	this._minBarWidthForStroke = 2;
	this._barSize = 10;

	this.sortDirection = "ascending";
};
ia.extend(ia.ItemLayer, ia.BoxLayer);
	
/** 
 * The sort direction.
 *
 * @property sortDirection
 * @type String
 * @default "ascending"
 */
ia.BoxLayer.prototype.sortDirection;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.BoxLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.BoxLayer.prototype.maxValue;

/** 
 * The largest observation field.
 *
 * @property largestObservationField
 * @type Number
 */
ia.BoxLayer.prototype.largestObservationField;

/** 
 * The upper quartile field.
 *
 * @property upperQuartileField
 * @type Number
 */
ia.BoxLayer.prototype.upperQuartileField;

/** 
 * The median field.
 *
 * @property medianField
 * @type Number
 */
ia.BoxLayer.prototype.medianField;

/** 
 * The lower quartile field.
 *
 * @property lowerQuartileField
 * @type Number
 */
ia.BoxLayer.prototype.lowerQuartileField;

/** 
 * The smallest observation field.
 *
 * @property smallestObservationField
 * @type Number
 */
ia.BoxLayer.prototype.smallestObservationField;
	
/**
 * Updates the data.
 *
 * @method update
 */
ia.BoxLayer.prototype.update = function() 
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
			var value = dataItem[this.medianField];
			if (ia.isNumber(value)) 
			{	
				// Create a new chart item.
				var chartItem =  {};
				chartItem.id = dataItem.id;
				chartItem.name = dataItem.name;

				chartItem.state = ia.ItemLayer.UNSELECTED;
				if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
				chartItem.parent = this;
				chartItem.layer = this;
				chartItem.color = dataItem.color;

				chartItem.rect = new ia.Rectangle();
				chartItem.hitArea = new ia.Rectangle();
	
				this.items[id] = chartItem;
				this.itemArray.push(chartItem);

				chartItem.median = dataItem[this.medianField];
				chartItem.largestObservation = dataItem[this.largestObservationField];
				chartItem.upperQuartile = dataItem[this.upperQuartileField];
				chartItem.lowerQuartile = dataItem[this.lowerQuartileField];
				chartItem.smallestObservation = dataItem[this.smallestObservationField];
				
				this.maxValue = Math.max(this.maxValue, chartItem.largestObservation);
				this.minValue = Math.min(this.minValue, chartItem.smallestObservation);
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
				if (a.median < b.median) return -dir;
				if (a.median > b.median) return dir;
				return 0; 
			});
		}

		this.dataChanged = false;
	}

};
	
/**
 * Renders the data.
 *
 * @method render
 */
ia.BoxLayer.prototype.render = function() 
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
		this.highlightContext.fillStyle = ia.Color.toRGBA(this.selectionColor);
		this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor);
	}
	
	// Render the items.
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem, i);
		this._renderItem(chartItem);
	}

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
ia.BoxLayer.prototype._setItemShape = function(item, index)
{
	if (this.map.orientation == "vertical")
	{
		var nItems = this.itemArray.length;

		// The pixel drawing rectangle for the bar.
		item.rect.y = this.map.getPixelY(item.upperQuartile);
		item.rect.height = this.map.getPixelY(item.lowerQuartile) - item.rect.y;
		item.rect.x = this.map.canvasX + (index/nItems) * this.map.canvasWidth;
		item.rect.width = this.map.canvasWidth / nItems;	
		
		// The pixel hit area for the bar.
		// Stretches the full height of the chart and full width of area reserved for bar.
		item.hitArea.x = item.rect.x;
		item.hitArea.y = this.map.canvasY;
		item.hitArea.width = item.rect.width;
		item.hitArea.height = this.map.canvasHeight;

		item.uq = {};
		item.uq.x = item.rect.x + (item.rect.width/2);
		item.uq.y = this.map.getPixelY(item.largestObservation);
		item.lq = {};
		item.lq.x = item.rect.x + (item.rect.width/2);
		item.lq.y = this.map.getPixelY(item.smallestObservation);
		item.m = {};
		item.m.x = item.rect.x + (item.rect.width/2);
		item.m.y = this.map.getPixelY(item.median);

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

		// The pixel drawing rectangle for the bar.
		item.rect.x = this.map.getPixelX(item.lowerQuartile);;
		item.rect.width =  this.map.getPixelX(item.upperQuartile) - item.rect.x;
		item.rect.y = this.map.canvasY + (index/nItems) * this.map.canvasHeight;
		item.rect.height = this.map.canvasHeight / nItems;
		
		// The pixel hit area for the bar.
		// Stretches the full height of the chart and full width of area reserved for bar.
		item.hitArea.x = this.map.canvasX;
		item.hitArea.y = item.rect.y;
		item.hitArea.width = this.map.canvasWidth;
		item.hitArea.height = item.rect.height;

		item.uq = {};
		item.uq.x = this.map.getPixelX(item.largestObservation);
		item.uq.y = item.rect.y + (item.rect.height/2);
		item.lq = {};
		item.lq.x = this.map.getPixelX(item.smallestObservation);
		item.lq.y = item.rect.y + (item.rect.height/2);
		item.m = {};
		item.m.x = this.map.getPixelX(item.median);
		item.m.y = item.rect.y + (item.rect.height/2);

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
ia.BoxLayer.prototype._renderItem = function(item)
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
ia.BoxLayer.prototype.selectItem = function(item)
{	
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.BoxLayer.prototype.highlightItem = function(item)
{	
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
ia.BoxLayer.prototype._drawItem = function(item, ctx)
{
	// Upper to lower quartile.
	ctx.beginPath();
		ctx.moveTo(item.uq.x, item.uq.y);
		ctx.lineTo(item.lq.x, item.lq.y);

		if (this.map.orientation == "vertical")
		{
			ctx.moveTo(item.rect.x, item.uq.y);
			ctx.lineTo((item.rect.x + item.rect.width), item.uq.y);
			ctx.moveTo(item.rect.x, item.lq.y);
			ctx.lineTo((item.rect.x + item.rect.width), item.lq.y);
		}
		else
		{
			ctx.moveTo(item.uq.x, item.rect.y);
			ctx.lineTo(item.uq.x, item.rect.y + item.rect.height);
			ctx.moveTo(item.lq.x, item.rect.y);
			ctx.lineTo(item.lq.x, item.rect.y + item.rect.height);
		}
	ctx.stroke();
	
	// Largest to highest observation.
	ctx.beginPath();
		ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
	ctx.fill();
	if (this._barSize >= this._minBarWidthForStroke) ctx.stroke();
	
	// Median
	ctx.beginPath();
		if (this.map.orientation == "vertical")
		{
			ctx.moveTo(item.rect.x, item.m.y);
			ctx.lineTo((item.rect.x + item.rect.width), item.m.y);
		}
		else
		{
			ctx.moveTo(item.m.x, item.rect.y);
			ctx.lineTo(item.m.x, item.rect.y + item.rect.height);
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
ia.BoxLayer.prototype.hitItem = function(item, event)
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
ia.BoxLayer.prototype.showTip = function(item, event)
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
			px = item.rect.x + item.rect.width;

			if (item.median < 0)
				py = item.rect.y + item.rect.height + 5;
			else
				py = item.rect.y - this.map.datatip.getHeight() - 5;
		}
		else
		{
			if (item.median < 0)
				px = item.rect.x - (this.map.datatip.getWidth() + 5);
			else
				px = (item.rect.x + item.rect.width) + 5;

			py = item.rect.y + item.rect.height;
		}
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};