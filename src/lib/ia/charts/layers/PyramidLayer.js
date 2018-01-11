/** 
 * The base class for bar layers.
 *
 * @author J Clare
 * @class ia.PyramidLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.PyramidLayer = function()
{
	ia.PyramidLayer.baseConstructor.call(this);
	
	this._maxBarWidth = 20;
	this._minBarWidthForStroke = 10;
	this._barSize = 10;
	
	this.sortDirection = "ascending";
	this.gender = "male";
};
ia.extend(ia.ItemLayer, ia.PyramidLayer);

/** 
 * The sort sortDirection.
 *
 * @property symbol
 * @type String
 * @default "ascending"
 */
ia.PyramidLayer.prototype.sortDirection;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.PyramidLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.PyramidLayer.prototype.maxValue;

/** 
 * The gender.
 *
 * @property gender
 * @type String
 * @default "male"
 */
ia.PyramidLayer.prototype.gender;

/**
 * Updates the data.
 *
 * @method update
 */
ia.PyramidLayer.prototype.update = function(date) 
{
	// Check if the data has changed
	if (this.map)
	{
		// Get the data.
		var data = this.getData();

		// Clear the items.
		this.itemArray = [];
		this.clearItems();
		
		this.minValue = Infinity;
		this.maxValue = -Infinity;

		// Loop through the data.
		for (var i = 0; i < data.length; i++) 
		{
			var indicator = data[i];
			var dataItem = indicator.features[0];
			if (dataItem)
			{
				var value = dataItem[this.dataField];
				
				if (ia.isNumber(value)) 
				{
					if (this.gender == "male") value = value * -1;

					// Get the min and max bar values for all dates.
					this.minValue = Math.min(this.minValue, value);
					this.maxValue = Math.max(this.maxValue, value);
				}

				// But only draw selected data/indicator
				if (date == undefined || indicator.date == date)
				{
					// Create a new chart item.
					var chartItem = {};
					chartItem.id = dataItem.id;
					chartItem.name = dataItem.name;
					chartItem.ageGroup = indicator.name;
					if (ia.isNumber(value)) chartItem.value = value;
					else chartItem.value = 0; // Include no data values so theres no gaps.
					chartItem.formattedValue = dataItem[this.dataField+"_formatted"];
					chartItem.parent = this;
					chartItem.layer = this;
					chartItem.state = ia.ItemLayer.UNSELECTED;
					chartItem.rect = new ia.Rectangle();
					chartItem.hitArea = new ia.Rectangle();

					this.items[chartItem.id] = chartItem;
					this.itemArray.push(chartItem);
				}
			}
		}
		this.itemArray.reverse();
	}
};

/**
 * Renders the data.
 *
 * @method render
 */
ia.PyramidLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();
	
	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
	this.highlightContext.lineWidth = parseFloat(this.style.lineWidth) + 1;
	
	var nItems = this.itemArray.length;
	this._barSize = this.map.canvasHeight / nItems;
	
	if (this._barSize >= this._minBarWidthForStroke) 
		this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.3);
	else  
		this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor);
	
	// Render the items.
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem, i);
		this._renderItem(chartItem);
	}
};

/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @param {Number} index The index of the item in the item array.
 * @private
 */
ia.PyramidLayer.prototype._setItemShape = function(item, index)
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

	if (this.gender == "male")
	{
		item.hitArea.x = this.map.canvasX;
		item.hitArea.y = item.rect.y;
		item.hitArea.width = this.map.canvasWidth / 2;
		item.hitArea.height = item.rect.height;
	}
	else
	{
		item.hitArea.x = item.rect.x;
		item.hitArea.y = item.rect.y;
		item.hitArea.width = this.map.canvasWidth / 2;
		item.hitArea.height = item.rect.height;
	}
	
	if (item.rect.height < this._minBarWidthForStroke) 
	{
		//  Creates a slight bar overlap so you dont get whiteline rendering problem.
		item.rect.height++;
	}
};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.PyramidLayer.prototype._renderItem = function(item)
{
	this._drawItem(item, this.context);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.PyramidLayer.prototype.highlightItem = function(item)
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
ia.PyramidLayer.prototype._drawItem = function(item, ctx)
{
	ctx.beginPath();
		ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
	ctx.fill();
	if (this._barSize >= this._minBarWidthForStroke) ctx.stroke();
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.PyramidLayer.prototype.hitItem = function(item, event)
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
ia.PyramidLayer.prototype.showTip = function(item, event)
{
	// Tip replacement.
	if (this.tip != "")
	{
		var label = this.tip;
		label = label.split("${name}").join(item.name);
		label = label.split("${ageGroup}").join(item.ageGroup);
		label = label.split("${value}").join(item.formattedValue);
		this.map.datatip.text(label);
	}
	else this.map.datatip.text(item.name+" <br/> "+item.ageGroup+" <br/> "+item.formattedValue);

	// Position above the bar.
	var px,py;
	
	if (event.isTouchEvent)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		if (item.value < 0)
			px = item.rect.x - (this.map.datatip.getWidth() + 5);
		else
			px = (item.rect.x + item.rect.width) + 5;

		py = (item.rect.y + (item.rect.height / 2)) -  (this.map.datatip.getHeight() / 2);
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};