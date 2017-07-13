/** 
 * The base class for stacked features time series layers.
 *
 * @author J Clare
 * @class ia.StackedFeaturesLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.StackedFeaturesLayer = function()
{
	ia.StackedFeaturesLayer.baseConstructor.call(this);
	
	this._minBarWidthForStroke = 10;
	this.dropDates = [];
	this._renderTimeout = null;
	this.selectedDate = "";
	this.highlightSelectedDate = false;

	this._numericDates = new Array();
	this.colorPalette = new ia.ColorPalette();
	this._stackValues = new Array();
};
ia.extend(ia.ItemLayer, ia.StackedFeaturesLayer);

/**
 * Drop dates.
 *
 * @property dropDates
 * @type String[]
 */
ia.StackedFeaturesLayer.prototype.dropDates;

/**
 * The selected date.
 *
 * @property selectedDate
 * @type String
 */
ia.StackedFeaturesLayer.prototype.selectedDate;

/**
 * Should the selected date be highlighted.
 *
 * @property highlightSelectedDate
 * @type Boolean
 * @default false
 */
ia.StackedFeaturesLayer.prototype.highlightSelectedDate;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.StackedFeaturesLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.StackedFeaturesLayer.prototype.maxValue;

/**
 * Specifies a color palette for the layer.
 *
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.StackedFeaturesLayer.prototype.colorPalette;

/**
 * Updates the data.
 *
 * @method update
 */
ia.StackedFeaturesLayer.prototype.update = function() 
{
	// Check if the data has changed
	if (this.map && this.dataChanged)
	{
		// Get the data.
		var data = this.getData();

		// Clear the items.
		this.itemArray = [];
		this.clearItems();
		
		this._stackValues = new Array();

		this.minValue = 0;
		this.maxValue = 100;

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
		        return me.dropDates.indexOf(el) < 0;
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
							childItem.dateIndex = i;

							// Get the max bar values for the layer.
							if (chartItem.state == ia.ItemLayer.SELECTED)
							{
								var stackValue = this._stackValues[i];
								if (stackValue != undefined) 	stackValue = stackValue + childItem.value;
								else 							stackValue = childItem.value;
								this._stackValues[i] = stackValue;
								this.maxValue =	Math.max.apply(Math, this._stackValues);
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
};

/**
 * Renders the data.
 *
 * @method render
 */
ia.StackedFeaturesLayer.prototype.render = function() 
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

		if (this.map.orientation == "vertical") 
		{
			this._maxBarWidth = ((this.map.canvasWidth / nDates)) * 0.7;
			this._barSize = this._maxBarWidth;
		}
		else 
		{
			this._maxBarWidth = ((this.map.canvasHeight / nDates)) * 0.7;
			this._barSize = this._maxBarWidth;
		}

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

		this._stackValues = new Array();

		// Render the selected features.
		var n = this.selectionIds.length;
		var colorList = this.colorPalette.getColors(n);
		for (var i = 0; i < n; i++)
		{
			// Get the data item.
			var id = this.selectionIds[i]
			var chartItem = this.items[id];
			if (chartItem)
			{
				chartItem.color = colorList[i];
				var nChildItems = chartItem.childItems.length;
				for (var j = 0; j < nChildItems; j++)
				{
					var childItem = chartItem.childItems[j];
					if (childItem.value != undefined) this._setItemShape(childItem, j, nChildItems);
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
ia.StackedFeaturesLayer.prototype._setItemShape = function(item, childIndex, nChildItems)
{
	if (this.map.orientation == "vertical")
	{
		var stackValue = this._stackValues[childIndex];
		if (stackValue != undefined) 	stackValue = stackValue + item.value;
		else 							stackValue = item.value;
		this._stackValues[childIndex] = stackValue;

		if ((stackValue - item.value) >= this.map.getBBox().getYMax())
		{
			item.rect.x = 0;
			item.rect.y = 0;
			item.rect.width = 0;
			item.rect.height = 0;
			item.hitArea.x = 0;
			item.hitArea.y = 0;
			item.hitArea.width = 0;
			item.hitArea.height = 0;
		}
		else
		{
			var barY = this.map.getPixelY(stackValue);
			var barHeight = this.map.getPixelHeight(item.value);

			// Adjust for when bar value is outside fixed max value.
			if (stackValue > this.map.getBBox().getYMax()) 
			{
				barY = this.map.canvasY;
				barHeight = barHeight - this.map.getPixelHeight(stackValue - this.map.getBBox().getYMax());
			}

			// The pixel drawing rectangle for the bar.
			item.rect.y = barY
			item.rect.height = barHeight;
			item.rect.width = this._barSize;	
			var availableSpace = this.map.canvasWidth / nChildItems;
			item.rect.x = this.map.canvasX + (childIndex * availableSpace) + ((availableSpace - item.rect.width) / 2);

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

			// The pixel hit area for the bar.
			item.hitArea.x = item.rect.x;
			item.hitArea.y = item.rect.y;
			item.hitArea.width = item.rect.width;
			item.hitArea.height = item.rect.height;
		}
	}
	else
	{
		var stackValue = this._stackValues[childIndex];
		if (stackValue == undefined) stackValue = 0;

		if (stackValue >= this.map.getBBox().getXMax())
		{
			item.rect.x = 0;
			item.rect.y = 0;
			item.rect.width = 0;
			item.rect.height = 0;
			item.hitArea.x = 0;
			item.hitArea.y = 0;
			item.hitArea.width = 0;
			item.hitArea.height = 0;
		}
		else
		{
			var barX = this.map.getPixelX(stackValue);
			var barWidth = this.map.getPixelWidth(item.value);

			// Adjust for when bar value is outside fixed max value.
			if ((stackValue + item.value) > this.map.getBBox().getXMax()) 
			{
				barWidth = barWidth - this.map.getPixelWidth((stackValue + item.value) - this.map.getBBox().getXMax());
			}

			// The pixel drawing rectangle for the bar.
			item.rect.x = barX
			item.rect.width = barWidth;
			item.rect.height = this._barSize;	
			var availableSpace = this.map.canvasHeight / nChildItems;
			item.rect.y = this.map.canvasY + (childIndex * availableSpace) + ((availableSpace - item.rect.height) / 2);
			
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

			// The pixel hit area for the bar.
			item.hitArea.x = item.rect.x;
			item.hitArea.y = item.rect.y;
			item.hitArea.width = item.rect.width;
			item.hitArea.height = item.rect.height;

			this._stackValues[childIndex] = stackValue + item.value;
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
ia.StackedFeaturesLayer.prototype._renderItem = function(item)
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
ia.StackedFeaturesLayer.prototype.selectItem = function(item) {this._triggerRender();};

/**
 * Unselects an item.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.StackedFeaturesLayer.prototype.unselect = function(id)
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
ia.StackedFeaturesLayer.prototype.clearSelection = function()
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
ia.StackedFeaturesLayer.prototype._triggerRender = function()
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
ia.StackedFeaturesLayer.prototype.highlightItem = function(item)
{	
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined && childItem.value != 0) 
		{
			this.highlightContext.fillStyle = childItem.color;
			this.highlightContext.beginPath();
				this.highlightContext.rect(childItem.rect.x, childItem.rect.y, childItem.rect.width, childItem.rect.height);
			this.highlightContext.stroke();
			if (this.map.animationMode && childItem.name == this.selectedDate) break;
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
ia.StackedFeaturesLayer.prototype._drawItem = function(item, ctx)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined && childItem.value != 0) 
		{
			ctx.fillStyle = childItem.color;
			ctx.beginPath();
				ctx.rect(childItem.rect.x, childItem.rect.y, childItem.rect.width, childItem.rect.height);
			ctx.fill();
			if (this.map.animationMode && childItem.name == this.selectedDate) break;
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
ia.StackedFeaturesLayer.prototype.hitItem = function(item, event)
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
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.StackedFeaturesLayer.prototype.showTip = function(item, event)
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