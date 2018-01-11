/** 
 * The base class for line layers - used by the funnel plot.
 *
 * @author J Clare
 * @class ia.LineLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.LineLayer = function()
{
	ia.LineLayer.baseConstructor.call(this);

	this._xData = new Array();
	this._yData = new Array();

	this.style = {fillStyle:'#ffffff', strokeStyle:'#888888', lineWidth:'2', lineJoin:'round'};
	this.connectMissingValues = false;
};
ia.extend(ia.ItemLayer, ia.LineLayer);
	
/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#ffffff', strokeStyle:'#888888', lineWidth:'2', lineJoin:'round'}
 */
ia.LineLayer.prototype.style;

/** 
 * The min x value.
 *
 * @property xMinValue
 * @type Number
 */
ia.LineLayer.prototype.xMinValue;

/** 
 * The max x value.
 *
 * @property xMaxValue
 * @type Number
 */
ia.LineLayer.prototype.xMaxValue;

/** 
 * The min y value.
 *
 * @property yMinValue
 * @type Number
 */
ia.LineLayer.prototype.yMinValue;

/** 
 * The max y value.
 *
 * @property yMaxValue
 * @type Number
 */
ia.LineLayer.prototype.yMaxValue;

/**
 * Should a line be drawn through missing values.
 *
 * @property connectMissingValues
 * @type Boolean
 * @default false
 */
ia.LineLayer.prototype.connectMissingValues;

/**
 * Gets a data object for the x-axis.
 *
 * @method getXData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.LineLayer.prototype.getXData = function()
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
ia.LineLayer.prototype.setXData = function(value)
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
ia.LineLayer.prototype.getYData = function()
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
ia.LineLayer.prototype.setYData = function(value)
{
	this._yData = value;
	this.dataChanged = true;
};

/**
 * Updates the data.
 *
 * @method update
 */
ia.LineLayer.prototype.update = function() 
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

		// Just one item to represent the line.
		var chartItem =  {};
		chartItem.id = "myLineId";
		chartItem.name = "myLineName";
		chartItem.state = ia.ItemLayer.UNSELECTED;
		chartItem.parent = this;
		chartItem.layer = this;
		this.items[chartItem.id] = chartItem;
		this.itemArray.push(chartItem);

		this.dataChanged = false;
	}
};

/**
 * Renders the data.
 *
 * @method render
 */
ia.LineLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();
	
	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style)  
	{
		this.context[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor);

	// Render the items.
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._renderItem(chartItem);
	}
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.LineLayer.prototype.highlightItem = function(item)
{	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.highlightContext.beginPath();
	    this.highlightContext.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.highlightContext.clip();
	}

	this._drawItem(item, this.highlightContext);
};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.LineLayer.prototype._renderItem = function(item)
{
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.context.beginPath();
	    this.context.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.context.clip();
	}

	this._drawItem(item, this.context);
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.LineLayer.prototype._drawItem = function(item, ctx)
{
	// Loop through the data.
	ctx.beginPath();
	var n = this._xData.length;
	var moveToDone = false;
	for (var i = 0; i < n; i++)
	{
		var xValue = this._xData[i];
		var yValue = this._yData[i];
		if (ia.isNumber(xValue) && ia.isNumber(yValue)) 
		{	
			var x = this.map.getPixelX(xValue); 
			var y = this.map.getPixelY(yValue); 

			// Cut off points outside chart. Dont need this now using clip instead.
			/*if (x > this.map.canvasX && x < (this.map.canvasX + this.map.canvasWidth) 
			&&	(y > this.map.canvasY && y < (this.map.canvasY + this.map.canvasHeight)))
			{*/
				if (moveToDone == false) 
				{
					moveToDone = true;
					ctx.moveTo(x, y);
				}
				else ctx.lineTo(x, y);
			/*}*/
		}
	}
	ctx.stroke();
};
	
/**
 * Runs a hit test on an item. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.LineLayer.prototype.hitItem = function(item, event)
{
	var isHit = this._pointInLine(event.x, event.y);
	return isHit;
};

/** 
 * Query if a point lies completely within a polygon.
 *
 * @method _pointInLine
 * @param {Number} pointX The pixel x coordinate of the test point.
 * @param {Number} pointY The pixel y coordinate of the test point.
 * @private
 */
ia.LineLayer.prototype._pointInLine = function(pointX, pointY)
{
	var buffer = 4;
	var r = new ia.Rectangle(pointX - buffer, pointY - buffer, (buffer*2), (buffer*2))
	
	var n = this._xData.length;
	for (var i = 0; i < n - 1; i++) 
	{
		var x1 = this.map.getPixelX(this._xData[i]);
		var y1 = this.map.getPixelY(this._yData[i]);
		var x2 = this.map.getPixelX(this._xData[i+1]);
		var y2 = this.map.getPixelY(this._yData[i+1]);
		if (r.intersectsLine({x:x1,y:y1}, {x:x2,y:y2})) return true;
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
ia.LineLayer.prototype.showTip = function(item, event)
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
		px = event.x + 10;
		py = event.y - this.map.datatip.getHeight();
	}

	this.map.datatip.position(px, py);
	this.map.datatip.show();
};