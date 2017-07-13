/** 
 * The base class for radar chart layers.
 *
 * @author J Clare
 * @class ia.RadarLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.RadarLayer = function()
{
	ia.RadarLayer.baseConstructor.call(this);
};
ia.extend(ia.TimeLayer, ia.RadarLayer);

/**
 * Updates the data.
 *
 * @method update
 */
ia.RadarLayer.prototype.update = function() 
{
	// Check if the data has changed
	if (this.map && this.dataChanged)
	{
		// Get the data.
		var data = this.getData();
		if (data)
		{
			// Clear the items.
			this.itemArray = [];
			this.clearItems();
			
			this.minValue = Infinity;
			this.maxValue = -Infinity;

			if (data.features)
			{
				for (var i = 0; i < data.features.length; i++)
				{
					var feature = data.features[i];

					// Create a new chart item.
					var chartItem = {};
					chartItem.id = feature.id;
					chartItem.name = feature.name;
					chartItem.state = ia.ItemLayer.UNSELECTED;
					if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
					chartItem.parent = this;
					chartItem.layer = this;


					this.items[feature.id] = chartItem;
					this.itemArray.push(chartItem);
					
					chartItem.childItems = [];

					for (var j = 0; j < feature.themes.length; j++)
					{
						var theme = feature.themes[j];

						for (var k = 0; k < theme.indicators.length; k++)
						{
							var indicator = theme.indicators[k];

							if (indicator.date == this.selectedDate || this.selectedDate == undefined)
							{
								var dataItem = undefined;
								if (this.dataField == "value") dataItem = indicator;
								else 
								{
									for (var m = 0; m < indicator.associates.length; m++)
									{
										var associate = indicator.associates[m];
										if (associate.name == this.dataField) 
										{
											dataItem = associate;
											break;
										}
									}
								}

								if (dataItem && dataItem.type != 'categoric')
								{
									// Has to be a number to be displayed in a time chart
									var value = dataItem.value;
									if (ia.isNumber(value)) 
									{	
										var childItem = {};
										childItem.id = indicator.id;
										childItem.name = indicator.name;
										childItem.themeName = theme.name;
										childItem.shape = new ia.Rectangle();
										childItem.hitArea = new ia.Rectangle();
										childItem.value = value;
										childItem.formattedValue = dataItem.formattedValue;

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
									else chartItem.childItems[chartItem.childItems.length] = {name:indicator.name, value:undefined};
								}
							}
						}
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
ia.RadarLayer.prototype.render = function() 
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
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor);
	this.selectionContext.strokeStyle = ia.Color.toRGBA(this.selectionColor);

	// Set the items shape.
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

	// Render the selection (which in this case is the only thing displayed on the chart).
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
ia.RadarLayer.prototype._setItemShape = function(item, index, nItems)
{
	var bb = this.map.getBBox();

	var startAngle = 1.5 * Math.PI;
	var segmentSize =  Math.PI * 2 * (1 / nItems);
	var angle = startAngle + (segmentSize * (index));
	var r = this.map.radarRadius * ((item.value - bb.getYMin()) / (bb.getYMax() - bb.getYMin()))
	var x = this.map.radarCenterX + r * Math.cos(angle);
	var y = this.map.radarCenterY + r * Math.sin(angle);

	var w = this.markerSize;	
	var h = this.markerSize;
	
	// Reset the pixel drawing area for the point.
	item.shape.startAngle = angle;
	item.shape.endAngle = angle + segmentSize;
	item.shape.radius = r;
	item.shape.x = x;
	item.shape.y = y;
	item.shape.width = w;
	item.shape.height = h;
	
	// Reset the pixel hit area for the point.
	if (ia.IS_TOUCH_DEVICE) // Larger hit area for touch devices.
	{
		w = 30;	
		h = 30;
	}
	else
	{
		w = w * 2;	
		h = h * 2;
	}
	w = Math.max(w, 10); 
	h = Math.max(h, 10);
	item.hitArea.x = x - (w / 2);
	item.hitArea.y = y - (h / 2);
	item.hitArea.width = w;
	item.hitArea.height = h;
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.RadarLayer.prototype.highlightItem = function(item)
{	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.highlightContext.beginPath();
			ia.Shape.drawCircle(this.highlightContext, this.map.radarCenterX, this.map.radarCenterY, this.map.radarRadius*2);
	    this.highlightContext.clip();
	}
	this._highlightMode = true;

	this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.1);
	
	this._drawItem(item, this.highlightContext);
};

/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.RadarLayer.prototype.selectItem = function(item)
{	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.selectionContext.beginPath();
			ia.Shape.drawCircle(this.selectionContext, this.map.radarCenterX, this.map.radarCenterY, this.map.radarRadius*2);
	    this.selectionContext.clip();
	}

	var n = this.selectionIds.length;
	
	this.selectionContext.fillStyle = ia.Color.toRGBA(this.selectionColor, 0.2);
	if (this.colorPalette)
	{
		var colorList = this.colorPalette.getColors(n);
		var index = this.selectionIds.indexOf(item.id);
		this.selectionContext.strokeStyle = colorList[index];	
		this.selectionContext.fillStyle = ia.Color.toRGBA(colorList[index], 0.2);
	}
	this._highlightMode = false;

	
	this._drawItem(item, this.selectionContext);
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.RadarLayer.prototype._drawItem = function(item, ctx)
{
	if (this.map.type == 'radar') this._drawLine(item, ctx);
	else this._drawSegment(item, ctx);
};

/**
 * Draws a line.
 *
 * @method _drawLine
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.RadarLayer.prototype._drawLine = function(item, ctx)
{
	var doMoveTo = true; // Takes into account first value and missing values.

	var n = item.childItems.length;

	ctx.beginPath();
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (doMoveTo) 
				ctx.moveTo(childItem.shape.x, childItem.shape.y);
			else 
				ctx.lineTo(childItem.shape.x, childItem.shape.y);
			doMoveTo = false;
		}
		else if (this.drawLinesThroughMissingValues != true) doMoveTo = true;
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = this.style.fillStyle;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined)
		{
			ctx.beginPath();
				 ia.Shape.drawCircle(ctx, childItem.shape.x, childItem.shape.y, childItem.shape.width);
			ctx.fill();
			ctx.stroke();
		}
	}
};

/**
 * Draws a segment.
 *
 * @method _drawSegment
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.RadarLayer.prototype._drawSegment = function(item, ctx)
{
	var n = item.childItems.length;

	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			ctx.beginPath();
				ctx.moveTo(this.map.radarCenterX, this.map.radarCenterY);
				ctx.lineTo(childItem.shape.x, childItem.shape.y);
				ctx.arc(this.map.radarCenterX, this.map.radarCenterY, childItem.shape.radius, childItem.shape.startAngle, childItem.shape.endAngle, false);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
				ctx.arc(this.map.radarCenterX, this.map.radarCenterY, childItem.shape.radius, childItem.shape.startAngle, childItem.shape.endAngle, false);
			ctx.stroke();
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
ia.RadarLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id))
	{
		if (this.map.type == 'radar') return this._hitPoint(item, event);
		else return this._hitSegment(item, event);
	}
	return false;
};

/**
 * Runs a hit test on an item point. 
 * 
 * @method _hitPoint
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 * @private
 */
ia.RadarLayer.prototype._hitPoint = function(item, event)
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
};


/**
 * Runs a hit test on an item segment. 
 * 
 * @method _hitSegment
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 * @private
 */
ia.RadarLayer.prototype._hitSegment = function(item, event)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (this._pointInSlice(childItem, event.x, event.y)) return true;
		}
	}
};

/** 
 * Query if a point lies completely within a pie slice.
 *
 * @method _pointInSlice
 * @param {Object} item The item to hit test.
 * @param {Number} pointX The x coordinate of the test point.
 * @param {Number} pointY The y coordinate of the test point.
 * @private
 */
ia.RadarLayer.prototype._pointInSlice = function(item, pointX, pointY)
{
	var angle = item.shape.endAngle - item.shape.startAngle
	
	var p0X = this.map.radarCenterX;
	var p0Y = this.map.radarCenterY;
	var p1X = p0X + (item.shape.radius * Math.cos(item.shape.startAngle));
	var p1Y = p0Y + (item.shape.radius * Math.sin(item.shape.startAngle));
	var p2X = p0X + (item.shape.radius * Math.cos(item.shape.startAngle+(angle/4)));
	var p2Y = p0Y + (item.shape.radius * Math.sin(item.shape.startAngle+(angle/4)));
	var p3X = p0X + (item.shape.radius * Math.cos(item.shape.startAngle+(angle/2)));
	var p3Y = p0Y + (item.shape.radius * Math.sin(item.shape.startAngle+(angle/2)));
	var p4X = p0X + (item.shape.radius * Math.cos(item.shape.startAngle+(angle/1.5)));
	var p4Y = p0Y + (item.shape.radius * Math.sin(item.shape.startAngle+(angle/1.5)));
	var p5X = p0X + (item.shape.radius * Math.cos(item.shape.startAngle+angle));
	var p5Y = p0Y + (item.shape.radius * Math.sin(item.shape.startAngle+angle));
	
	var coords = [{x:p0X,y:p0Y},{x:p1X,y:p1Y},{x:p2X,y:p2Y},{x:p3X,y:p3Y},{x:p4X,y:p4Y},{x:p5X,y:p5Y},{x:p0X,y:p0Y}];
	return this._pointInPoly(coords, pointX, pointY);
};

/** 
 * Query if a point lies completely within a polygon.
 *
 * @method _pointInPoly
 * @param {Number[]} coords The coords to hit test.
 * @param {Number} pointX The x coordinate of the test point.
 * @param {Number} pointY The y coordinate of the test point.
 * @private
 */
ia.RadarLayer.prototype._pointInPoly = function(coords, pointX, pointY)
{
	var i, j, c = 0;
	for (i = 0, j = coords.length - 1; i < coords.length; j = i++)
	{
		if (((coords[i].y > pointY) != (coords[j].y > pointY)) && (pointX < (coords[j].x - coords[i].x) * (pointY - coords[i].y) / (coords[j].y - coords[i].y) + coords[i].x))
		{
			c = !c;
		}
	}
	return c;
};


/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.RadarLayer.prototype.showTip = function(item, event)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if ((this.map.type == 'radar' && childItem.hitArea.intersects(event.x,event.y))
				|| (this.map.type == 'rose' && this._pointInSlice(childItem, event.x, event.y)))
			{
				// Tip replacement.
				if (this.tipFunction != undefined) 
				{
					this.map.datatip.text(this.tipFunction(item, childItem));
				}
				else if (this.tip != "")
				{
					var label = this.tip;
					label = label.split("${featureName}").join(item.name);
					label = label.split("${themeName}").join(childItem.themeName);
					label = label.split("${indicatorName}").join(childItem.name);
					label = label.split("${value}").join(childItem.formattedValue);
					this.map.datatip.text(label);
				}
				else this.map.datatip.text(item.name+" : "+childItem.name+" : "+childItem.formattedValue);

				var px,py;
				if (event.isTouchEvent)
				{
					px = event.x - (this.map.datatip.getWidth() / 2);
					py = event.y - (this.map.datatip.getHeight() + 30);
				}
				else
				{
					px = (childItem.shape.x + childItem.shape.width / 2) - (this.map.datatip.getWidth() / 2);
					py = (childItem.shape.y - childItem.shape.height / 2) - (this.map.datatip.getHeight() + 5);
				}

				this.map.datatip.position(px, py);
				this.map.datatip.show();
				break;
			}
		}
	}
};