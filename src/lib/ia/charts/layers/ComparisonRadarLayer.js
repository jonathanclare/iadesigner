/** 
 * The base class for comparison time series layers.
 *
 * @author J Clare
 * @class ia.ComparisonRadarLayer
 * @extends ia.TimeLayer
 * @constructor
 */
ia.ComparisonRadarLayer = function()
{
	ia.ComparisonRadarLayer.baseConstructor.call(this);

	this.isComparison = true;
	this.displayAll = false;
};
ia.extend(ia.RadarLayer, ia.ComparisonRadarLayer);
	
/**
 * Specifies a thematic for the layer.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.ComparisonRadarLayer.prototype.thematic;

/** 
 * Should all data be displayed.
 *
 * @property displayAll
 * @type Boolean
 * @default false
 */
ia.ComparisonRadarLayer.prototype.displayAll;

/** 
 * Shortcut to avoid verbose code - referenced in ia.TimeLayer.
 *
 * @property isComparison
 * @type Boolean
 * @default true
 */
ia.ComparisonRadarLayer.prototype.isComparison;

/**
 * Renders the data.
 *
 * @method render
 */
ia.ComparisonRadarLayer.prototype.render = function() 
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
	this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.1);

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
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonRadarLayer.prototype.clearSelection = function() {};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonRadarLayer.prototype._renderItem = function(item)
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
ia.ComparisonRadarLayer.prototype.selectItem = function(item)
{
	if (this.thematic)
	{
		var legendClass = this.thematic.getClass(item.id);
		if (legendClass) 
		{
			this.selectionContext.strokeStyle = legendClass.color;	
			this.selectionContext.fillStyle = ia.Color.toRGBA(legendClass.color, 0.2);
		}
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
ia.ComparisonRadarLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id) || this.displayAll)
	{
		if (this.map.type == 'radar') return this._hitPoint(item, event);
		else return this._hitSegment(item, event);
	}
	return false;
};