/** 
 * The base class for comparison plot layers.
 *
 * @author J Clare
 * @class ia.ComparisonPlotLayer
 * @extends ia.PlotLayer
 * @constructor
 */
ia.ComparisonPlotLayer = function()
{
	ia.ComparisonPlotLayer.baseConstructor.call(this);

	this.style = {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'};
	this.displayAll = false;
	this.isComparison = true;
};
ia.extend(ia.PlotLayer, ia.ComparisonPlotLayer);	
		
/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#ffffff', strokeStyle:'#888888', lineWidth:'2', lineJoin:'round'}
 */
ia.ComparisonPlotLayer.prototype.style;

/** 
 * Should all data be displayed.
 *
 * @property displayAll
 * @type Boolean
 * @default false
 */
ia.ComparisonPlotLayer.prototype.displayAll;

/** 
 * Shortcut to avoid verbose code - referenced in ia.PlotLayer.
 *
 * @property isComparison
 * @type Boolean
 * @default true
 */
ia.ComparisonPlotLayer.prototype.isComparison;

/**
 * Renders the data.
 *
 * @method render
 */
ia.ComparisonPlotLayer.prototype.render = function() 
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
	this.highlightContext.strokeStyle = this.highlightColor;
	this.selectionContext.strokeStyle = this.selectionColor;

	// Render the items.
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem);
		if (this.displayAll) this._renderItem(chartItem);
	}

	this.renderSelection();
};
	
/**
 * Sets an items dimensions.
 *
 * @method _setItemShape
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonPlotLayer.prototype._setItemShape = function(item)
{
	// Calculate the bounding box of the chart item.
	var x = this.map.getPixelX(item.xValue); 
	var y = this.map.getPixelY(item.yValue); 	
	//var w = 10;	
	//var h = 10;
	var w = item.symbolSize;	
	var h = item.symbolSize;

	// Reset the pixel drawing area for the point.
	item.shape.x = x;
	item.shape.y = y;
	item.shape.width = w;
	item.shape.height = h;

	// Reset the pixel hit area for the point.
	w = Math.max(15, w);	
	h = Math.max(15, h);
	if (ia.IS_TOUCH_DEVICE) // Larger hit area for touch devices.
	{
		w = Math.max(30, w);	
		h = Math.max(30, h);
	}
	item.hitArea.x = x - (w / 2);
	item.hitArea.y = y - (h / 2);
	item.hitArea.width = w;
	item.hitArea.height = h;
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonPlotLayer.prototype.clearSelection = function() {};
	
/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.ComparisonPlotLayer.prototype._renderItem = function(item)
{
	this.context.fillStyle = item.color;		
	this.context.strokeStyle = "#CCCCCC";
	this._drawItem(item, this.context);
};

/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.ComparisonPlotLayer.prototype.selectItem = function(item)
{	
	this.selectionContext.fillStyle = item.color;	
	this.selectionContext.strokeStyle = "#CCCCCC";
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.ComparisonPlotLayer.prototype.highlightItem = function(item)
{	
	if (item.xValue >= this.map.getBBox().getXMin()
		&& item.xValue <= this.map.getBBox().getXMax()
		&& item.yValue >= this.map.getBBox().getYMin()
		&& item.yValue <= this.map.getBBox().getYMax())
	{
		// Draw crosshairs.
		this.highlightContext.strokeStyle = item.color;
		var x1 = this.map.getPixelX(this.map.getBBox().getXMin());
		var x2 = this.map.getPixelX(this.map.getBBox().getXMax());
		var y1 = this.map.getPixelY(this.map.getBBox().getYMin());
		var y2 = this.map.getPixelY(this.map.getBBox().getYMax());
		this.highlightContext.beginPath();
			 this.highlightContext.moveTo(item.shape.x, y1);
			 this.highlightContext.lineTo(item.shape.x, y2);
			 this.highlightContext.moveTo(x1, item.shape.y);
			 this.highlightContext.lineTo(x2, item.shape.y);
		this.highlightContext.stroke();
		
		this.highlightContext.fillStyle = item.color;	
		this.highlightContext.strokeStyle = "#CCCCCC";
		this._drawItem(item, this.highlightContext, item.symbolSize);
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
ia.ComparisonPlotLayer.prototype._drawItem = function(item, ctx)
{
	ctx.beginPath();
		 ia.Shape.drawCircle(ctx, item.shape.x, item.shape.y, item.symbolSize);
	ctx.fill();
	ctx.stroke();
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.ComparisonPlotLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id) || this.displayAll)
	{
		return item.hitArea.intersects(event.x,event.y);
	}
	return false;
};