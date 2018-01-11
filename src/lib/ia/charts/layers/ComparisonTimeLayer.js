/** 
 * The base class for comparison time series layers.
 *
 * @author J Clare
 * @class ia.ComparisonTimeLayer
 * @extends ia.TimeLayer
 * @constructor
 */
ia.ComparisonTimeLayer = function()
{
	ia.ComparisonTimeLayer.baseConstructor.call(this);

	this.isComparison = true;
	this.displayAll = false;
	this.selectedDate = "";
};
ia.extend(ia.TimeLayer, ia.ComparisonTimeLayer);
	
/**
 * Specifies a thematic for the layer.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.ComparisonTimeLayer.prototype.thematic;

/** 
 * Should all data be displayed.
 *
 * @property displayAll
 * @type Boolean
 * @default false
 */
ia.ComparisonTimeLayer.prototype.displayAll;

/** 
 * Shortcut to avoid verbose code - referenced in ia.TimeLayer.
 *
 * @property isComparison
 * @type Boolean
 * @default true
 */
ia.ComparisonTimeLayer.prototype.isComparison;

/**
 * The selected date.
 *
 * @property selectedDate
 * @type String
 * @default ""
 */
ia.ComparisonTimeLayer.prototype.selectedDate;

/**
 * Renders the data.
 *
 * @method render
 */
ia.ComparisonTimeLayer.prototype.render = function() 
{
	if (this.dataFields.length > 0) this.render_multi();
	else
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
	}
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonTimeLayer.prototype.clearSelection = function() {};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonTimeLayer.prototype._renderItem = function(item)
{
	if (this.thematic)
	{
		var legendClass = this.thematic.getClass(item.id);
		if (legendClass) this.context.strokeStyle = legendClass.color;	
	}
	this._drawItem(item, this.context);
};

/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.ComparisonTimeLayer.prototype.selectItem = function(item)
{
	if (this.thematic)
	{
		var legendClass = this.thematic.getClass(item.id);
		if (legendClass) this.selectionContext.strokeStyle = legendClass.color;	
	}
	this._highlightMode = false;
	
	this._drawItem(item, this.selectionContext);
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.ComparisonTimeLayer.prototype.hitItem = function(item, event)
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

// For multi-line mode.

/**
 * Renders the data.
 *
 * @method render_multi
 */
ia.ComparisonTimeLayer.prototype.render_multi = function() 
{
	// Get the data.
	var data = this.getData();
	
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

		var index = 0;
		var nChildItems = chartItem.childItems.length;
		var currentDataField;
		for (var j = 0; j < nChildItems; j++)
		{
			var childItem = chartItem.childItems[j];
			if (childItem.dataField != currentDataField) 
			{
				index = 0;
				currentDataField = childItem.dataField;
			}
			else index++;

			if (childItem.value != undefined) this._setItemShape(childItem, index, data.dates.length);
		}
		if (this.displayAll) this._renderItem(chartItem);
	}

	this.renderSelection();
};
