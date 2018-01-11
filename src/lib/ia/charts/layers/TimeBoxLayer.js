/** 
 * The base class for time series box and whisker layers.
 *
 * @author J Clare
 * @class ia.TimeBoxLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.TimeBoxLayer = function()
{
	ia.TimeBoxLayer.baseConstructor.call(this);
};
ia.extend(ia.TimeLayer, ia.TimeBoxLayer);

/**
 * Updates the data.
 *
 * @method update
 */
ia.TimeBoxLayer.prototype.update = function() 
{
	if (this.dataFields.length > 0) this.update_multi();
	else
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
				for (var i = 0; i < data.dates.length; i++)
				{
					var date = data.dates[i];
					var p = data.profiles[i];

					if (this.dropDates.indexOf(date) == -1)
					{
						var chartItem = {};
						chartItem.id = i + '_box';
						chartItem.name = i + '_box';
						chartItem.date = date;
						chartItem.state = ia.ItemLayer.UNSELECTED;
						chartItem.parent = this;
						chartItem.layer = this;
						chartItem.rect = new ia.Rectangle();
						chartItem.hitArea = new ia.Rectangle();

						if (this.dataField == 'value')
						{
						    chartItem.lowerQuartile = p.lowerQuartile;
						    chartItem.upperQuartile = p.upperQuartile;
						    chartItem.median = p.median;
						    chartItem.minValue = p.minValue;
						    chartItem.maxValue = p.maxValue;
						    chartItem.ninetyFifth = p.ninetyFifth;
						    chartItem.fifth = p.fifth;
						    chartItem.lowerQuartile_formatted = p.lowerQuartile_formatted;
						    chartItem.upperQuartile_formatted = p.upperQuartile_formatted;
						    chartItem.median_formatted = p.median_formatted;
						    chartItem.minValue_formatted = p.minValue_formatted;
						    chartItem.maxValue_formatted = p.maxValue_formatted;
						    chartItem.ninetyFifth_formatted = p.ninetyFifth_formatted;
						    chartItem.fifth_formatted = p.fifth_formatted;
						    chartItem.range_formatted = p.range_formatted;
						    chartItem.interquartileRange_formatted = p.interquartileRange_formatted;
						    chartItem.range_95_5_formatted = p.range_95_5_formatted;
						}
						else
						{
						    chartItem.lowerQuartile = p[this.dataField + '_lowerQuartile'];
						    chartItem.upperQuartile = p[this.dataField + '_upperQuartile'];
						    chartItem.median = p[this.dataField + '_median'];
						    chartItem.minValue = p[this.dataField + '_minValue'];
						    chartItem.maxValue = p[this.dataField + '_maxValue'];
						    chartItem.ninetyFifth = p[this.dataField + '_ninetyFifth'];
						    chartItem.fifth = p[this.dataField + '_fifth'];
						    chartItem.lowerQuartile_formatted = p[this.dataField + '_lowerQuartile_formatted'];
						    chartItem.upperQuartile_formatted = p[this.dataField + '_upperQuartile_formatted'];
						    chartItem.median_formatted = p[this.dataField + '_median_formatted'];
						    chartItem.minValue_formatted = p[this.dataField + '_minValue_formatted'];
						    chartItem.maxValue_formatted = p[this.dataField + '_maxValue_formatted'];
						    chartItem.ninetyFifth_formatted = p[this.dataField + '_ninetyFifth_formatted'];
						    chartItem.fifth_formatted = p[this.dataField + '_fifth_formatted'];
						    chartItem.range_formatted = p[this.dataField + '_range_formatted'];
						    chartItem.interquartileRange_formatted = p[this.dataField + '_interquartileRange_formatted'];
						    chartItem.range_95_5_formatted = p[this.dataField + '_range_95_5_formatted'];
						}

						this.minValue = Math.min(this.minValue, chartItem.minValue);
						this.maxValue = Math.max(this.maxValue, chartItem.maxValue);

						this.items[chartItem.id] = chartItem;
						this.itemArray.push(chartItem);
					}
				}
			}
			this.dataChanged = false;
		}
	}
}

/**
 * Renders the data.
 *
 * @method render
 */
ia.TimeBoxLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();

	// Reset the context styles in case the layer styles have changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.selectionContext[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor);
	this.selectionContext.strokeStyle = ia.Color.toRGBA(this.selectionColor);

	this.context.fillStyle = ia.Color.toRGBA(this.map.limitsColor, 0.5);
	this.context.strokeStyle = ia.Color.toRGBA(this.map.limitsColor, 1);
	this.context.lineWidth = this.map.limitsWidth;

	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.context.beginPath();
	    this.context.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.context.clip();
	}

	// Set the items shape.
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem, i, nItems);
		this._renderItem(chartItem);
	}
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
ia.TimeBoxLayer.prototype._setItemShape = function(item, index, nItems)
{	
	item.boxSize = this.markerSize * 3;

	if (ia.isNumber(item.median))
	{
		if (this.map.orientation == "vertical")
		{


			var startX = this.map.canvasX;
			var hSpace = this.map.canvasWidth;
			if (this.map.centerXAxisLabels)
			{
				var indent = this.map.canvasWidth / (nItems * 2);
				startX = this.map.canvasX + indent; 
				hSpace = this.map.canvasWidth - (indent * 2);
			}

			item.px;
			if (index == 0) item.px = startX;
			else  item.px = startX + (index / (nItems - 1)) * hSpace;

			// lowerQuartile / upperQuartile Box.
			item.rect.x = item.px - (item.boxSize / 2);
			item.rect.y = this.map.getPixelY(item.upperQuartile);
			item.rect.height = this.map.getPixelY(item.lowerQuartile) - item.rect.y;
			item.rect.width = item.boxSize;	

		 	// Min / Max / Median / 95 / 5.
		 	item.yMin = this.map.getPixelY(item.minValue);
		 	item.yMax = this.map.getPixelY(item.maxValue);
		 	item.yMedian = this.map.getPixelY(item.median);
		 	item.yNinetyFifth = this.map.getPixelY(item.ninetyFifth);
		 	item.yFifth = this.map.getPixelY(item.fifth);

			// The pixel hit area for the bar.
			// Stretches the full height of the chart and full width of area reserved for bar.
			item.hitArea.x = item.rect.x;
			item.hitArea.y = this.map.canvasY;
			item.hitArea.width = item.rect.width;
			item.hitArea.height = this.map.canvasHeight;
		}
		else
		{
			var startY = this.map.canvasY;
			var vSpace = this.map.canvasHeight;
			if (this.map.centerYAxisLabels)
			{
				var indent = this.map.canvasHeight / (nItems * 2);
				startY = this.map.canvasY + indent; 
				vSpace = this.map.canvasHeight - (indent * 2);
			}

			item.py;
			if (index == 0) item.py = startY;
			else  item.py = startY + (index / (nItems - 1)) * vSpace;

			// lowerQuartile / upperQuartile Box.
			item.rect.x = this.map.getPixelX(item.upperQuartile);
			item.rect.y = item.py - (item.boxSize / 2);
			item.rect.height = item.boxSize;
			item.rect.width = this.map.getPixelX(item.lowerQuartile) - item.rect.x;	

		 	// Min / Max / Median / 95 / 5.
		 	item.xMax = this.map.getPixelX(item.maxValue);
		 	item.xMin = this.map.getPixelX(item.minValue);
		 	item.xMedian = this.map.getPixelX(item.median);
		 	item.xNinetyFifth = this.map.getPixelX(item.ninetyFifth);
		 	item.xFifth = this.map.getPixelX(item.fifth);

			// The pixel hit area for the bar.
			// Stretches the full height of the chart and full width of area reserved for bar.
			item.hitArea.x = this.map.canvasX;
			item.hitArea.y = item.rect.y;
			item.hitArea.width = this.map.canvasWidth;
			item.hitArea.height = item.rect.height;
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
ia.TimeBoxLayer.prototype._renderItem = function(item)
{
	this._drawItem(item, this.context);
};
	
/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.TimeBoxLayer.prototype.selectItem = function(item)
{	

};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.TimeBoxLayer.prototype.highlightItem = function(item)
{	

};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.TimeBoxLayer.prototype._drawItem = function(item, ctx)
{
	if (this.map.orientation == "vertical")
	{
		ctx.beginPath();
			ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
	 	ctx.fill();

		ctx.beginPath();
			ctx.moveTo(item.px, item.rect.y);
			ctx.lineTo(item.px, item.yMax);
			ctx.moveTo(item.px - (item.boxSize / 2), item.yMax);
			ctx.lineTo(item.px + (item.boxSize / 2), item.yMax);

			ctx.moveTo(item.px, item.rect.y + item.rect.height);
			ctx.lineTo(item.px, item.yMin);
			ctx.moveTo(item.px - (item.boxSize / 2), item.yMin);
			ctx.lineTo(item.px + (item.boxSize / 2), item.yMin);

			ctx.moveTo(item.px - (item.boxSize / 2), item.yMedian);
			ctx.lineTo(item.px + (item.boxSize / 2), item.yMedian);

			ctx.moveTo(item.px - (item.boxSize / 2), item.yNinetyFifth);
			ctx.lineTo(item.px + (item.boxSize / 2), item.yNinetyFifth);

			ctx.moveTo(item.px - (item.boxSize / 2), item.yFifth);
			ctx.lineTo(item.px + (item.boxSize / 2), item.yFifth);
	 	ctx.stroke();
	}
	else
	{
		ctx.beginPath();
			ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
	 	ctx.fill();

		ctx.beginPath();
			ctx.moveTo(item.rect.x, item.py);
			ctx.lineTo(item.xMax, item.py);
			ctx.moveTo(item.xMax, item.py - (item.boxSize / 2));
			ctx.lineTo(item.xMax, item.py + (item.boxSize / 2));

			ctx.moveTo(item.rect.x + item.rect.width, item.py);
			ctx.lineTo(item.xMin, item.py);
			ctx.moveTo(item.xMin, item.py - (item.boxSize / 2));
			ctx.lineTo(item.xMin, item.py + (item.boxSize / 2));

			ctx.moveTo(item.xMedian, item.py - (item.boxSize / 2));
			ctx.lineTo(item.xMedian, item.py + (item.boxSize / 2));

			ctx.moveTo(item.xNinetyFifth, item.py - (item.boxSize / 2));
			ctx.lineTo(item.xNinetyFifth, item.py + (item.boxSize / 2));

			ctx.moveTo(item.xFifth, item.py - (item.boxSize / 2));
			ctx.lineTo(item.xFifth, item.py + (item.boxSize / 2));
	 	ctx.stroke();
	}
};

/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.TimeBoxLayer.prototype.hitItem = function(item, event)
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
ia.TimeBoxLayer.prototype.showTip = function(item, event)
{
	// Tip replacement.
	if (this.tipFunction != undefined) 
	{
		this.map.datatip.text(this.tipFunction(item));
	}
	else if (this.tip != "")
	{
		var label = this.tip;
		label = label.split("${date}").join(item.date);
		label = label.split("${lowerQuartile}").join(item.lowerQuartile_formatted);
		label = label.split("${upperQuartile}").join(item.upperQuartile_formatted);
		label = label.split("${median}").join(item.median_formatted);
		label = label.split("${minValue}").join(item.minValue_formatted);
		label = label.split("${maxValue}").join(item.maxValue_formatted);
		label = label.split("${ninetyFifth}").join(item.ninetyFifth_formatted);
		label = label.split("${fifth}").join(item.fifth_formatted);
		label = label.split("${range}").join(item.range_formatted);
		label = label.split("${interquartileRange}").join(item.interquartileRange_formatted);
		label = label.split("${range_95_5}").join(item.range_95_5_formatted);
		this.map.datatip.text(label);
	}
	else this.map.datatip.text(item.date);

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