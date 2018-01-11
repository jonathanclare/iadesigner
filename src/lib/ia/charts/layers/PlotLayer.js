/** 
 * The base class for scatter plot layers.
 *
 * @author J Clare
 * @class ia.PlotLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.PlotLayer = function()
{
	ia.PlotLayer.baseConstructor.call(this);

	this._xData = new Object();
	this._yData = new Object();

	this.style = {fillStyle:'#ffffff', strokeStyle:'#888888', lineWidth:'2', lineJoin:'round'};
	this.xDataField = "value";
	this.yDataField = "value";
	this.correlationInfo = {};
	this.showCorrelationLine = false;
	this.pointSize = 6;
};
ia.extend(ia.ItemLayer, ia.PlotLayer);

/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#ffffff', strokeStyle:'#888888', lineWidth:'2', lineJoin:'round'}
 */
ia.PlotLayer.prototype.style;

/** 
 * The min x value.
 *
 * @property xMinValue
 * @type Number
 */
ia.PlotLayer.prototype.xMinValue;

/** 
 * The max x value.
 *
 * @property xMaxValue
 * @type Number
 */
ia.PlotLayer.prototype.xMaxValue;

/** 
 * The min y value.
 *
 * @property yMinValue
 * @type Number
 */
ia.PlotLayer.prototype.yMinValue;

/** 
 * The max y value.
 *
 * @property yMaxValue
 * @type Number
 */
ia.PlotLayer.prototype.yMaxValue;

/**
 * Specifies the field of the data provider that provides the x values.
 *
 * @property xDataField
 * @type String
 * @default "value"
 */
ia.PlotLayer.prototype.xDataField;

/**
 * Specifies the field of the data provider that provides the y values.
 *
 * @property yDataField
 * @type String
 * @default "value"
 */
ia.PlotLayer.prototype.yDataField;

/**
 * Correlation info.
 * 
 * An object with the properties o.correlationCoeff, o.rSquare, o.gradient, o.intercept or null.
 *
 * @property correlationInfo
 * @type Object
 */
ia.PlotLayer.prototype.correlationInfo;

/**
 * Should the correlation line be displayed.
 *
 * @property showCorrelationLine
 * @type Boolean
 * @default false
 */
ia.PlotLayer.prototype.showCorrelationLine;

/**
 * The point size.
 *
 * @property pointSize
 * @type Number
 * @default 6
 */
ia.PlotLayer.prototype.pointSize;

/**
 * Gets a data object for the x-axis.
 *
 * @method getXData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.getXData = function()
{
	return this._xData;
};

/**
 * Sets a data object for the x-axis.
 *
 * @method setXData
 * @param value ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.setXData = function(value)
{
	this._xData = value;
	this.dataChanged = true;
};

/**
 * Gets a data object for the y-axis.
 *
 * @method getYData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.getYData = function()
{
	return this._yData;
};

/**
 * Sets a data object for the y-axis.
 *
 * @method setYData
 * @param value ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.setYData = function(value)
{
	this._yData = value;
	this.dataChanged = true;
};

/**
 * Gets a data object for the color.
 *
 * @method getColorData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.getColorData = function()
{
	return this._colorData;
};

/**
 * Sets a data object for the color.
 *
 * @method setColorData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.setColorData = function(value)
{
	this._colorData = value;
	this.dataChanged = true;
};

/**
 * Gets a data object for the size.
 *
 * @method getSizeData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.getSizeData = function()
{
	return this._sizeData;
};

/**
 * Sets a data object for the size.
 *
 * @method setSizeData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.PlotLayer.prototype.setSizeData = function(value)
{
	this._sizeData = value;
	this.dataChanged = true;
};

/**
 * Updates the data.
 *
 * @method update
 */
ia.PlotLayer.prototype.update = function() 
{
	if (this.map && this.dataChanged)
	{
		// Clear the items.
		this.itemArray = [];
		this.clearItems();
		
		this.xMinValue = Infinity;
		this.xMaxValue = -Infinity;
		this.yMinValue = Infinity;
		this.yMaxValue = -Infinity;
		
		// Correlation Start.
		var x = 0;
		var sumOfX = 0;
		var sumOfXSquared = 0;
		var xSquared = 0;

		var y = 0;
		var sumOfY = 0;
		var sumOfYSquared = 0;
		var ySquared = 0;

		var xy = 0;
		var sumOfXY = 0;
		var sampleNo = 0;
		// Correlation End.

		// Loop through the data.
		for (var id in this._xData)
		{
			// Get the data item.
			var xDataItem = this._xData[id];
			var yDataItem = this._yData[id];
			
			// Has to be a number to be displayed in a bar chart
			var xValue = xDataItem[this.xDataField];
			var yValue = yDataItem[this.yDataField];
			if (ia.isNumber(xValue) && ia.isNumber(yValue)) 
			{	
				xValue = parseFloat(xValue);
				yValue = parseFloat(yValue);

				// Create a new chart item.
				var chartItem =  {};
				chartItem.id = xDataItem.id;
				chartItem.name = xDataItem.name;
				chartItem.xValue = xValue;
				chartItem.yValue = yValue;

				if (this._colorData != undefined) 
				{
					var colorDataItem = this._colorData[id];
					chartItem.color = colorDataItem.color;
				}
				else chartItem.color = xDataItem.color;
				if (this._sizeData != undefined)
				{
					var sizeDataItem = this._sizeData[id];
					chartItem.symbolSize = sizeDataItem.symbolSize;
				}
				else chartItem.symbolSize = this.pointSize;

				chartItem.state = ia.ItemLayer.UNSELECTED;
				if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
				chartItem.parent = this;
				chartItem.layer = this;

				chartItem.shape = new ia.Rectangle();
				chartItem.hitArea = new ia.Rectangle();
	
				this.items[id] = chartItem;
				this.itemArray.push(chartItem);
				
				// Correlation Start.
				xSquared = xValue * xValue;
				sumOfX = sumOfX + xValue;
				sumOfXSquared = sumOfXSquared + xSquared;

				ySquared = yValue * yValue;
				sumOfY = sumOfY + yValue;
				sumOfYSquared = sumOfYSquared + ySquared;

				xy = xValue * yValue;
				sumOfXY = sumOfXY + xy;
				sampleNo++;
				// Correlation End.

				// Get the min and max bar values for the layer.
				if (this.isComparison)
				{
					if (this.selectionIds.indexOf(chartItem.id) != -1 ) 
					{
						// Get the min and max bar values for the layer.
						this.xMinValue = Math.min(this.xMinValue, xValue);
						this.xMaxValue = Math.max(this.xMaxValue, xValue);
						this.yMinValue = Math.min(this.yMinValue, yValue);
						this.yMaxValue = Math.max(this.yMaxValue, yValue);
						chartItem.state = ia.ItemLayer.SELECTED;
					}
					if (this.displayAll)
					{
						// Get the min and max bar values for the layer.
						this.xMinValue = Math.min(this.xMinValue, xValue);
						this.xMaxValue = Math.max(this.xMaxValue, xValue);
						this.yMinValue = Math.min(this.yMinValue, yValue);
						this.yMaxValue = Math.max(this.yMaxValue, yValue);
					}
				}
				else
				{
					// Get the min and max bar values for the layer.
					this.xMinValue = Math.min(this.xMinValue, xValue);
					this.xMaxValue = Math.max(this.xMaxValue, xValue);
					this.yMinValue = Math.min(this.yMinValue, yValue);
					this.yMaxValue = Math.max(this.yMaxValue, yValue);
				}
			}
		}

		//ia.log("Building correlation from [sumOfXSquared=" + sumOfXSquared + ",sumOfYSquared=" + sumOfYSquared + ",sampleNo=" + sampleNo + ",sumOfX=" + sumOfX + ",sumOfY=" + sumOfY + "]"); // DEBUG

		// Correlation Start.
		var varianceOfX = (sumOfXSquared / sampleNo) - (Math.pow((sumOfX / sampleNo),2));
		var varianceOfY = (sumOfYSquared / sampleNo) - (Math.pow((sumOfY / sampleNo),2));
		var coariance = (sumOfXY / sampleNo) - (sumOfX * (sumOfY / Math.pow((sampleNo),2)));
		var correlationCoefficient = coariance / Math.sqrt(varianceOfX * varianceOfY);
		//correlationCoefficient = Math.round(correlationCoefficient*100)/100;
		var gradient = ((sumOfX * sumOfY) - (sampleNo * sumOfXY)) / ((Math.pow(sumOfX,2)) - (sampleNo * sumOfXSquared));
		var intercept = ((sumOfX * sumOfXY) - (sumOfY * sumOfXSquared)) / ((Math.pow(sumOfX,2)) - (sampleNo * sumOfXSquared));
		//intercept = Math.round(intercept*100)/100;

		this.correlationInfo.correlationCoeff = correlationCoefficient;
		this.correlationInfo.rSquare = Math.pow(correlationCoefficient,2);
		this.correlationInfo.gradient = gradient;
		this.correlationInfo.intercept = intercept;

		//ia.log("[coefficient=" + this.correlationInfo.correlationCoeff + ",rSquare=" + this.correlationInfo.rSquare + ",gradient=" + this.correlationInfo.gradient + ",intercept=" + this.correlationInfo.intercept + "]"); // DEBUG
		// Correlation End.
		
		if (this._sizeData != undefined)
		{
			var dir = -1;
			this.itemArray.sort(function(a, b)
			{
				if (a.symbolSize < b.symbolSize) return -dir;
				if (a.symbolSize > b.symbolSize) return dir;
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
ia.PlotLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();
	
	// Correlation line.
	if (this.showCorrelationLine)
	{
		// Clip.
   		this.context.save();
	    this.context.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.context.clip();

		this.context.strokeStyle = ia.Color.toRGBA(this.selectionColor, 0.3);
		this.context.lineWidth = 2;
		var x1 = this.map.getPixelX(this.map.getBBox().getXMin());
		var x2 = this.map.getPixelX(this.map.getBBox().getXMax());
		var y1 = this.map.getPixelY((this.map.getBBox().getXMin() * this.correlationInfo.gradient) + this.correlationInfo.intercept);
		var y2 = this.map.getPixelY((this.map.getBBox().getXMax() * this.correlationInfo.gradient) + this.correlationInfo.intercept);
		this.context.beginPath();
			 this.context.moveTo(x1, y1);
			 this.context.lineTo(x2, y2);
		this.context.stroke();

   		this.context.restore();
	}

	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.selectionContext[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	this.highlightContext.strokeStyle = this.highlightColor;
	this.selectionContext.strokeStyle = this.selectionColor;
	this.highlightContext.fillStyle = "rgba(0, 0, 0, 0)";
	this.selectionContext.fillStyle = "rgba(0, 0, 0, 0)";

	// Render the items.
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem);
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
 * @private
 */
ia.PlotLayer.prototype._setItemShape = function(item)
{
	// Calculate the bounding box of the chart item.
	var x = this.map.getPixelX(item.xValue); 
	var y = this.map.getPixelY(item.yValue); 	
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
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.PlotLayer.prototype._renderItem = function(item)
{
	if (this._colorData != undefined) // Identifies bubble plot.
	{
		this.context.fillStyle = item.color;
		this.context.strokeStyle = "#CCCCCC";
		this.context.lineWidth = 1;
	}
	this._drawItem(item, this.context, item.symbolSize);
};
	
/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.PlotLayer.prototype.selectItem = function(item)
{	
	this._drawItem(item, this.selectionContext, item.symbolSize);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.PlotLayer.prototype.highlightItem = function(item)
{	
	if (item.xValue >= this.map.getBBox().getXMin()
		&& item.xValue <= this.map.getBBox().getXMax()
		&& item.yValue >= this.map.getBBox().getYMin()
		&& item.yValue <= this.map.getBBox().getYMax())
	{
		// Draw crosshairs.
		this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.3);
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
		
		this.highlightContext.strokeStyle = this.highlightColor;
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
ia.PlotLayer.prototype._drawItem = function(item, ctx, radius)
{
	if (item.xValue >= this.map.getBBox().getXMin()
		&& item.xValue <= this.map.getBBox().getXMax()
		&& item.yValue >= this.map.getBBox().getYMin()
		&& item.yValue <= this.map.getBBox().getYMax())
	{
		ctx.beginPath();
			 ia.Shape.drawCircle(ctx, item.shape.x, item.shape.y, radius);
		ctx.fill();
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
ia.PlotLayer.prototype.hitItem = function(item, event)
{
	if (item.hitArea.intersects(event.x,event.y)) return true;
	else return false;
};

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.PlotLayer.prototype.showTip = function(item, event)
{
	this.map.datatip.text(this.tipFunction(item));

	var px,py;
	if (event.isTouchEvent)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		px = item.shape.x + item.shape.width / 2;
		py = item.shape.y - item.shape.height / 2 - this.map.datatip.getHeight();
	}

	this.map.datatip.position(px, py);
	this.map.datatip.show();
};
	
/** 
 * Get correlation information.
 * 
 * @method _getCorrelation
 * @return {Object} An object (o) with the properties o.correlationCoeff, o.rSquare, o.gradient, o.intercept or null.
 * @private
 */
ia.PlotLayer.prototype._getCorrelation = function() 
{		
	var x = 0;
	var sumOfX = 0;
	var sumOfXSquared = 0;
	var xSquared = 0;

	var y = 0;
	var sumOfY = 0;
	var sumOfYSquared = 0;
	var ySquared = 0;

	var xy = 0;
	var sumOfXY = 0;
	var sampleNo = 0;

	// Loop through the data.
	for (var id in xData)
	{
		// Get the data item.
		var xDataItem = xData[id];
		var yDataItem = yData[id];

		// Has to be a number to be displayed in a bar chart
		var xValue = xDataItem[xDataField];
		var yValue = yDataItem[yDataField];

		if (ia.isNumber(xValue) && ia.isNumber(yValue)) 
		{	
			xSquared = xValue * xValue;
			sumOfX = sumOfX + xValue;
			sumOfXSquared = sumOfXSquared + xSquared;

			ySquared = yValue * yValue;
			sumOfY = sumOfY + yValue;
			sumOfYSquared = sumOfYSquared + ySquared;

			xy = xValue * yValue;
			sumOfXY = sumOfXY + xy;
			sampleNo++;

		}
	}

	//ia.log("Building correlation from [sumOfXSquared=" + sumOfXSquared + ",sumOfYSquared=" + sumOfYSquared + ",sampleNo=" + sampleNo + ",sumOfX=" + sumOfX + ",sumOfY=" + sumOfY + "]"); // DEBUG

	var varianceOfX = (sumOfXSquared / sampleNo) - (Math.pow((sumOfX / sampleNo),2));
	var varianceOfY = (sumOfYSquared / sampleNo) - (Math.pow((sumOfY / sampleNo),2));
	var coariance = (sumOfXY / sampleNo) - (sumOfX * (sumOfY / Math.pow((sampleNo),2)));
	var correlationCoefficient = coariance / Math.sqrt(varianceOfX * varianceOfY);
	correlationCoefficient = Math.round(correlationCoefficient*100)/100;
	var gradient = ((sumOfX * sumOfY) - (sampleNo * sumOfXY)) / ((Math.pow(sumOfX,2)) - (sampleNo * sumOfXSquared));
	var intercept = ((sumOfX * sumOfXY) - (sumOfY * sumOfXSquared)) / ((Math.pow(sumOfX,2)) - (sampleNo * sumOfXSquared));
	intercept = Math.round(intercept*100)/100;

	var o = new Object()
	o.correlationCoeff = correlationCoefficient;
	o.rSquare = Math.pow(correlationCoefficient,2);
	o.gradient = gradient;
	o.intercept = intercept;

	ia.log("[coefficient=" + o.correlationCoeff + ",rSquare=" + o.rSquare + ",gradient=" + o.gradient + ",intercept=" + o.intercept + "]"); // DEBUG
	return o;
};