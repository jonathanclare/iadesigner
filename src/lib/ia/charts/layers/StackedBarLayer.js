/** 
 * The base class for stacked time layers.
 *
 * @author J Clare
 * @class ia.StackedBarLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.StackedBarLayer = function()
{
	ia.StackedBarLayer.baseConstructor.call(this);
	
	this._minBarWidthForStroke = 10;
	this._renderTimeout = null;
	this.matchAxisToSelectedData = false;
};
ia.extend(ia.ItemLayer, ia.StackedBarLayer);
	
/** 
 * Indicates that the axis should be updated and matched to the selected features.
 * 
 * @property matchAxisToSelectedData
 * @type Boolean
 * @default false
 */
ia.StackedBarLayer.prototype.matchAxisToSelectedData;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.StackedBarLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.StackedBarLayer.prototype.maxValue;

/**
 * Specifies a list of legend classes for the layer.
 *
 * @property legendClasses
 * @type ia.CategoricClass[]
 */
ia.StackedBarLayer.prototype.legendClasses;

/**
 * A list of data fields.
 *
 * @property dataFields
 * @type String[]
 */
ia.StackedBarLayer.prototype.dataFields;

/**
 * Updates the data.
 *
 * @method update
 */
ia.StackedBarLayer.prototype.update = function() 
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
			var total = 0;

			for (var j = 0; j < this.dataFields.length; j++)
			{
				// Has to be a number to be displayed in a bar chart.
				var dataField = this.dataFields[j];
				var value = dataItem[dataField];

				var childItem = {};
				childItem.id = id+"~"+dataField;
				childItem.name = dataField;
				childItem.rect = new ia.Rectangle();
				childItem.hitArea = new ia.Rectangle();
				childItem.stackIndex = j;

				if (this.legendClasses)
				{
					for (var k = 0; k < this.legendClasses.length; k++)
					{
						var lc = this.legendClasses[k];
						if (lc.value == dataField)
						{
							childItem.name = lc.getLabel();
							childItem.color = lc.color; 
							break;
						}
					}
				}

				// Cant have negative or categoric values in a stack chart.
				if (ia.isNumber(value) && value >= 0)
					childItem.value = parseFloat(value);
				else
					childItem.value = 0;

				childItem.formattedValue = dataItem[dataField+"_formatted"];
				chartItem.childItems[chartItem.childItems.length] = childItem;
				total = total + parseFloat(childItem.value);
			}

			if (total != 0) 
			{	
				if (this.isComparison)
				{
					if (this.selectionIds.indexOf(chartItem.id) != -1) 
					{
						// Get the max bar values for the layer.
						this.maxValue = Math.max(this.maxValue, total);
						chartItem.state = ia.ItemLayer.SELECTED;
					}
					if (this.displayAll)
					{
						// Get the max bar values for the layer.
						this.maxValue = Math.max(this.maxValue, total);
					}
				}
				else if ((this.matchAxisToSelectedData == false) ||
							(this.matchAxisToSelectedData == true && chartItem.state == ia.ItemLayer.SELECTED))
				{ 
					// Get the max bar values for the layer.
					this.maxValue = Math.max(this.maxValue, total);
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
ia.StackedBarLayer.prototype.render = function() 
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
	
	var nFeatures = this.selectionIds.length;

	if (this.map.orientation == "vertical") 
	{
		this._maxBarWidth = ((this.map.canvasWidth / nFeatures)) * 0.7;
		this._barSize = this._maxBarWidth;
	}
	else 
	{
		this._maxBarWidth = ((this.map.canvasHeight / nFeatures)) * 0.7;
		this._barSize = this._maxBarWidth;
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
			if (childItem.value != undefined) this._setItemShape(childItem);
		}
	}

	// Render the selected features.
	for (var i = 0; i < nFeatures; i++)
	{
		// Get the data item.
		var id = this.selectionIds[i]
		var chartItem = this.items[id];
		if (chartItem)
		{
			var nChildItems = chartItem.childItems.length;
			for (var j = 0; j < nChildItems; j++)
			{
				var childItem = chartItem.childItems[j];
				if (childItem.value != undefined) 
				{
					this._setItemShape(childItem, i, nFeatures);
				}
			}
			this._renderItem(chartItem);
		}
	}
};

/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @param {Number} itemIndex The index of the item.
 * @param {Number} nFeatures The number of features.
 * @private
 */
ia.StackedBarLayer.prototype._stackValue;
ia.StackedBarLayer.prototype._setItemShape = function(item, itemIndex, nFeatures)
{
	var nItems = this.selectionIds.length;
	if (this.map.orientation == "vertical")
	{
		if (item.stackIndex == 0) this._stackValue = item.value;
		else this._stackValue = this._stackValue + item.value;

		if ((this._stackValue - item.value) >= this.map.getBBox().getYMax())
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
			var barY = this.map.getPixelY(this._stackValue);
			var barHeight = this.map.getPixelHeight(item.value);

			// Adjust for when bar value is outside fixed max value.
			if (this._stackValue > this.map.getBBox().getYMax()) 
			{
				barY = this.map.canvasY;
				barHeight = barHeight - this.map.getPixelHeight(this._stackValue - this.map.getBBox().getYMax());
			}
			
			// The pixel drawing rectangle for the bar.
			item.rect.y = barY
			item.rect.height = barHeight;
			item.rect.width = this._barSize;	
			var availableSpace = this.map.canvasWidth / nFeatures;
			item.rect.x = this.map.canvasX + (itemIndex * availableSpace) + ((availableSpace - item.rect.width) / 2);

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
		if (item.stackIndex == 0)  this._stackValue = 0;

		if (this._stackValue >= this.map.getBBox().getXMax())
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
			var barX = this.map.getPixelX(this._stackValue);
			var barWidth = this.map.getPixelWidth(item.value);

			// Adjust for when bar value is outside fixed max value.
			if ((this._stackValue + item.value) > this.map.getBBox().getXMax()) 
			{
				barWidth = barWidth - this.map.getPixelWidth((this._stackValue + item.value) - this.map.getBBox().getXMax());
			}
			
			// The pixel drawing rectangle for the bar.
			item.rect.x = barX
			item.rect.width = barWidth;
			item.rect.height = this._barSize;	
			var availableSpace = this.map.canvasHeight / nFeatures;
			item.rect.y = this.map.canvasY + (itemIndex * availableSpace) + ((availableSpace - item.rect.height) / 2);
			
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

			this._stackValue = this._stackValue + item.value;
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
ia.StackedBarLayer.prototype._renderItem = function(item)
{
	this._drawItem(item, this.context);
};
	
/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.StackedBarLayer.prototype.selectItem = function(item) {this._triggerRender();};

/**
 * Unselects an item.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.StackedBarLayer.prototype.unselect = function(id)
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
ia.StackedBarLayer.prototype.clearSelection = function()
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
ia.StackedBarLayer.prototype._triggerRender = function()
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
ia.StackedBarLayer.prototype.highlightItem = function(item) 
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
ia.StackedBarLayer.prototype._drawItem = function(item, ctx)
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
ia.StackedBarLayer.prototype.hitItem = function(item, event)
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
ia.StackedBarLayer.prototype.showTip = function(item, event)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (childItem.hitArea.intersects(event.x,event.y)) 
			{
				// Tip replacement.
				/*if (this.tip != "")
				{
					var label = this.tip;
					label = label.split("${feature-name}").join(item.name);
					label = label.split("${date}").join(childItem.date);
					label = label.split("${associate-name}").join(childItem.name);
					label = label.split("${value}").join(childItem.formattedValue);
					this.map.datatip.text(label);
				}
				else this.map.datatip.text(item.name+" ("+childItem.date+") <br/> "+childItem.name+" : "+childItem.formattedValue);*/

				// Backwards compatibility.
				var label;
				if (this.tip.indexOf('${feature-name} (${date}) <br/> ${associate-name}: ${value}') != -1)
				{
					var label = this.tip;
					label = label.split("${feature-name}").join(item.name);
					label = label.split("${date}").join(childItem.date);
					label = label.split("${associate-name}").join(childItem.name);
					label = label.split("${value}").join(childItem.formattedValue);
				}
				else if (this.tipFunction != undefined) 
				{
					label = this.tipFunction(item, childItem);
				}
				else label = item.name+" ("+childItem.date+") <br/> "+childItem.name+" : "+childItem.formattedValue;

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