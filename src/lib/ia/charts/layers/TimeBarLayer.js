/** 
 * The base class for time series layers.
 *
 * @author J Clare
 * @class ia.TimeBarLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.TimeBarLayer = function()
{
	ia.TimeBarLayer.baseConstructor.call(this);
	
	this._minBarWidthForStroke = 10;
	this.dropDates = [];
	this._renderTimeout = null;
	this.selectedDate = "";
	this.highlightSelectedDate = false;
	this.matchAxisToSelectedData = false;
	this.colorBarsByCategory = false;

	this._numericDates = new Array();
	
	this.colorPalette = new ia.ColorPalette();
};
ia.extend(ia.ItemLayer, ia.TimeBarLayer);

/**
 * Drop dates.
 *
 * @property dropDates
 * @type String[]
 */
ia.TimeBarLayer.prototype.dropDates;

/** 
 * Indicates that the axis should be updated and matched to the selected features.
 * 
 * @property matchAxisToSelectedData
 * @type Boolean
 * @default false
 */
ia.TimeBarLayer.prototype.matchAxisToSelectedData;

/**
 * Should the bars be coloured by category.
 *
 * @property colorBarsByCategory
 * @type Boolean
 * @default false
 */
ia.TimeBarLayer.prototype.colorBarsByCategory;

/**
 * The selected date.
 *
 * @property selectedDate
 * @type String
 */
ia.TimeBarLayer.prototype.selectedDate;

/**
 * Should the selected date be highlighted.
 *
 * @property highlightSelectedDate
 * @type Boolean
 * @default false
 */
ia.TimeBarLayer.prototype.highlightSelectedDate;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.TimeBarLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.TimeBarLayer.prototype.maxValue;

/**
 * Specifies a color palette for the layer.
 *
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.TimeBarLayer.prototype.colorPalette;

/**
 * Updates the data.
 *
 * @method update
 */
ia.TimeBarLayer.prototype.update = function() 
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

		if (data.dates)
		{
		    var me = this;

		    // Remove categoric indicators.
		    var dates = new Array()
		    for (var i = 0; i < data.type.length; i++)
		    {
		        var type = data.type[i];
		        var date = data.dates[i];
		        if (type != ia.Thematic.CATEGORIC) dates.push(date);
		    }

		    this._numericDates = dates.filter(function (el)
			{
				return me.dropDates.indexOf( el ) < 0;
			});

			if (this._numericDates.length > 0)
			{

				// First off get the list of ids to loop through.
				var indData = data[this._numericDates[0]];
				var dateLength = this._numericDates.length;

				// Loop through the data.
				for (var id in indData)
				{
					// Get the data item.
					var dataItem = indData[id];
					
					// Create a new chart item.
					var chartItem = {};
					chartItem.id = dataItem.id;
					chartItem.name = dataItem.name;
					chartItem.state = ia.ItemLayer.UNSELECTED;
					if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
					chartItem.parent = this;
					chartItem.layer = this;

					if (this.isComparison)
					{
						var legendClass = this.thematic.getClass(chartItem.id);
						if (legendClass) chartItem.color = legendClass.color;
					}

					this.items[dataItem.id] = chartItem;
					this.itemArray.push(chartItem);
					
					// Now add child items for each date.
					chartItem.childItems = [];
					for (var i = 0; i < dateLength; i++)
					{
					    var date = this._numericDates[i];
						var dataItem = data[date][id];
					
						// Has to be a number to be displayed in a bar chart
						var value = dataItem[this.dataField];
						if (ia.isNumber(value)) 
						{	
						    var childItem = {};

						    // Capture associates.
						    for (var j in dataItem)
						    {
						        childItem[j] = dataItem[j];
						    }

							childItem.id = id+"~"+date;
							childItem.name = date;
							childItem.rect = new ia.Rectangle();
							childItem.hitArea = new ia.Rectangle();
							childItem.value = value;
							childItem.formattedValue = dataItem[this.dataField+"_formatted"];

							if (this.isComparison)
							{
								if (this.selectionIds.indexOf(chartItem.id) != -1 ) 
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
							}
							else if ((this.matchAxisToSelectedData == false) ||
								(this.matchAxisToSelectedData == true && chartItem.state == ia.ItemLayer.SELECTED))
							{
								// Get the min and max bar values for the layer.
								this.minValue = Math.min(this.minValue, childItem.value);
								this.maxValue = Math.max(this.maxValue, childItem.value);
							}

							chartItem.childItems[chartItem.childItems.length] = childItem;
						}
						else chartItem.childItems[chartItem.childItems.length] = {name:date, value:undefined};
					}
				}
			}
		}
		this.dataChanged = false;
	}

}

/**
 * Renders the data.
 *
 * @method render
 */
ia.TimeBarLayer.prototype.render = function() 
{
	this._renderTimeout = null;

	// Clear the canvas.
	this.clear();
	
	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
	this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.1);
	this.highlightContext.lineWidth = parseFloat(this.style.lineWidth) + 1;
	
	// Render the items.
	var data = this.getData();
	if (this._numericDates.length > 0)
	{
		var nDates = this._numericDates.length;

		if (this.map.orientation == "vertical") this._maxBarWidth = ((this.map.canvasWidth / nDates)) * 0.7;
		else this._maxBarWidth = ((this.map.canvasHeight / nDates)) * 0.7;
	
		if (this.map.orientation == "vertical")
			this._barSize = this._maxBarWidth / this.selectionIds.length;
		else
			this._barSize = this._maxBarWidth / this.selectionIds.length;

		// Render selected date region.
		if (this.highlightSelectedDate)
		{
			var dates = this._numericDates;
			var index = dates.indexOf(this.selectedDate);

			if (index != -1)
			{
				this.context.fillStyle = ia.Color.toRGBA(this.selectionColor, 0.07);
				this.context.lineWidth = 0;
		
				var x, y, w, h;
				if (this.map.orientation == "vertical")
				{
					x = this.map.canvasX + ((index / dates.length) * this.map.canvasWidth);
					y = this.map.canvasY;
					w = this.map.canvasWidth / dates.length;
					h = this.map.canvasHeight; 	 
				}
				else
				{
					x = this.map.canvasX;
					y = this.map.canvasY + ((index / dates.length) * this.map.canvasHeight);
					w = this.map.canvasWidth;
					h = this.map.canvasHeight / dates.length; 	 
				}

				this.context.beginPath();
					this.context.rect(x, y, w, h);
				this.context.fill();
			}
		}
			
		// Set the items shape for all features - so they can be drawn when highlighted.
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
		}

		// Render the selected features.
		var nColors; 
		if (this.colorBarsByCategory) nColors = nDates;
		else nColors = this.selectionIds.length;
		var colorList = this.colorPalette.getColors(nColors);

		for (var i = 0; i < this.selectionIds.length; i++)
		{
			// Get the data item.
			var id = this.selectionIds[i]
			var chartItem = this.items[id];

			if (chartItem)
			{
				if (!this.colorBarsByCategory) chartItem.color = colorList[i];
				var nChildItems = chartItem.childItems.length;
				for (var j = 0; j < nChildItems; j++)
				{
					var childItem = chartItem.childItems[j];
					if (this.colorBarsByCategory) childItem.color = colorList[j];
					if (childItem.value != undefined) this._setItemShape(childItem, j, nChildItems, i);
				}
				this._renderItem(chartItem);
			}
		}
	}
};

/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @param {Number} childIndex The index of the child item.
 * @param {Number} nChildItems The number of child items.
 * @param {Number} itemIndex The index of the item.
 * @private
 */
ia.TimeBarLayer.prototype._setItemShape = function(item, childIndex, nChildItems, itemIndex)
{
	var nItems = this.selectionIds.length;
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
		
		// The pixel drawing rectangle for the bar.
		item.rect.y = barY
		item.rect.height = barHeight;
		item.rect.width = this._barSize;	
		var gap = ((this.map.canvasWidth / nChildItems) - (this._maxBarWidth)) / 2;
		item.rect.x = (this.map.canvasX + (childIndex / nChildItems) * this.map.canvasWidth) + gap + (itemIndex * item.rect.width);
		
		// The pixel hit area for the bar.
		// Stretches the full height of the chart and full width of area reserved for bar.
		item.hitArea.x = item.rect.x;
		item.hitArea.y = this.map.canvasY;
		item.hitArea.width = item.rect.width;
		item.hitArea.height = this.map.canvasHeight;
		
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
		item.rect.height = this._barSize;
		var gap = ((this.map.canvasHeight / nChildItems) - (this._maxBarWidth)) / 2;
		item.rect.y = (this.map.canvasY + (childIndex/nChildItems) * this.map.canvasHeight) + gap + (itemIndex * item.rect.height);

		// The pixel hit area for the bar.
		// Stretches the full width of the chart and full height of area reserved for bar.
		item.hitArea.x = this.map.canvasX;
		item.hitArea.y = item.rect.y;
		item.hitArea.width = this.map.canvasWidth;
		item.hitArea.height = item.rect.height;
		
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
ia.TimeBarLayer.prototype._renderItem = function(item)
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
ia.TimeBarLayer.prototype.selectItem = function(item) {this._triggerRender();};

/**
 * Unselects an item.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.TimeBarLayer.prototype.unselect = function(id)
{	
	var item = this.getItem(id);
	if (item) 
	{
		item.state = ia.ItemLayer.UNSELECTED;
		var index = this.selectionIds.indexOf(id);
		if (index != -1) this.selectionIds.splice(index, 1);
	}
	this._triggerRender();
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.TimeBarLayer.prototype.clearSelection = function()
{	
	this.selectionIds = [];
	for (var id in this.items) 
	{
		var item = this.items[id];
		if (item) {item.state = ia.ItemLayer.UNSELECTED;}	
	}
	this._triggerRender();
};

/** 
 * Triggers a render. Prevents over rendering which results in a frozen browser.
 *
 * @method _triggerRender
 * @private
 */
ia.TimeBarLayer.prototype._triggerRender = function()
{
	if (!this._renderTimeout) 
	{
		var me = this;
		this._renderTimeout = setTimeout(function()
		{
			me.render();
		}, 5);
	}
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.TimeBarLayer.prototype.highlightItem = function(item)
{	
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
ia.TimeBarLayer.prototype._drawItem = function(item, ctx)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (this.colorBarsByCategory) ctx.fillStyle = childItem.color;
			ctx.beginPath();
				ctx.rect(childItem.rect.x, childItem.rect.y, childItem.rect.width, childItem.rect.height);
			ctx.fill();
			if (this.map.animationMode && childItem.name == this.selectedDate) break;
			//if (this._barSize >= this._minBarWidthForStroke) ctx.stroke();
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
ia.TimeBarLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id))
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

/** 
 * Supplies the default text for the layer. This can 
 * be replaced with a custom function
 * 
 * @method tipFunction
 * @param {Object} item The map item.
 * @param {Object} childItem The map child item.
 */
ia.TimeBarLayer.prototype.tipFunction = undefined;

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.TimeBarLayer.prototype.showTip = function(item, event)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (childItem.hitArea.intersects(event.x,event.y)) 
			{
				var label;
				// Backwards compatibility.
				if (this.tip.indexOf('${name} (${date}): ${value}') != -1 || this.tip.indexOf('${name}: ${value}') != -1)
				{
					label = this.tip;
					label = label.split("${name}").join(item.name);
					label = label.split("${date}").join(childItem.name);
					label = label.split("${value}").join(childItem.formattedValue);

				    // Associates.
					for (var id in childItem) {label = label.split('${' + id + '}').join(childItem[id + '_formatted']);}
				}
				// Tip replacement.
				else if (this.tipFunction != undefined) 
				{
					label = this.tipFunction(item, childItem);
				}
				else label = item.name+" : "+childItem.name+" : "+childItem.formattedValue;

				this.map.datatip.text(label);
				
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
						px = (childItem.rect.x + (childItem.rect.width / 2)) -  (this.map.datatip.getWidth() / 2);

						if (childItem.value < 0)
							py = childItem.rect.y + childItem.rect.height + 5;
						else
							py = childItem.rect.y - this.map.datatip.getHeight() - 5;
					}
					else
					{
						if (childItem.value < 0)
							px = childItem.rect.x - (this.map.datatip.getWidth() + 5);
						else
							px = (childItem.rect.x + childItem.rect.width) + 5;

						py = (childItem.rect.y + (childItem.rect.height / 2)) -  (this.map.datatip.getHeight() / 2);
					}
				}
				this.map.datatip.position(px, py);
				this.map.datatip.show();
				
				break;
			}
		}
	}
};