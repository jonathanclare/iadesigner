/** 
 * The base class for bar layers.
 *
 * @author J Clare
 * @class ia.ComparisonPyramidLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.ComparisonPyramidLayer = function()
{
	ia.ComparisonPyramidLayer.baseConstructor.call(this);

	this.style = {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'};
	this.sortDirection = "ascending";
	this.gender = "male";
	this.displayAll = false;
};
ia.extend(ia.ItemLayer, ia.ComparisonPyramidLayer);

/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'}
 */
ia.ComparisonPyramidLayer.prototype.style;

/** 
 * The sort direction.
 *
 * @property sortDirection
 * @type String
 * @default "ascending"
 */
ia.ComparisonPyramidLayer.prototype.sortDirection;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.ComparisonPyramidLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.ComparisonPyramidLayer.prototype.maxValue;

/** 
 * The gender.
 *
 * @property gender
 * @type String
 * @default "male"
 */
ia.ComparisonPyramidLayer.prototype.gender;

/**
 * Specifies a thematic for the layer.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.ComparisonPyramidLayer.prototype.thematic;

/** 
 * Should all data be displayed.
 *
 * @property displayAll
 * @type Boolean
 * @default false
 */
ia.ComparisonPyramidLayer.prototype.displayAll;

/**
 * Updates the data.
 *
 * @method update
 */
ia.ComparisonPyramidLayer.prototype.update = function(date) 
{
	// Check if the data has changed
	if (this.map)
	{
		// Get the data.
		var data = this.getData();

		// Clear the items.
		this.itemArray = [];
		this.clearItems();
		
		this.minValue = Infinity;
		this.maxValue = -Infinity;

		if (data[0])
		{
			// Loop through the features.
			var features = data[0].features;
			for (var j = 0; j < features.length; j++) 
			{
				var feature = features[j];
				var nChildItems = 0; // Use this to cope with missing values.

				// Create a new chart item.
				var chartItem = {};
				chartItem.id = feature.id;
				chartItem.name = feature.name;
				chartItem.state = ia.ItemLayer.UNSELECTED;
				chartItem.parent = this;
				chartItem.layer = this;
				this.items[chartItem.id] = chartItem;
				this.itemArray.push(chartItem);

				// Now add child items for each date.
				chartItem.childItems = [];

				// Loop through the data.
				for (var i = 0; i < data.length; i++) 
				{
					var indicator = data[i];
					var dataItem = indicator.features[j];
					if (dataItem)
					{
						var value = dataItem[this.dataField];

						if (ia.isNumber(value)) 
						{	
							if (this.gender == "male") value = value * -1;

							// Get the min and max bar values for all dates.
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

						// But only draw selected data/indicator.
						if (date == undefined || indicator.date == date)
						{
							if (ia.isNumber(value)) 
							{
								var childItem = {};
								childItem.id = chartItem.id+"~"+indicator.name;
								childItem.name = indicator.name;
								childItem.ageGroup = indicator.name;
								childItem.shape = new ia.Rectangle();
								childItem.hitArea = new ia.Rectangle();
								childItem.value = value;
								childItem.index = nChildItems;
								childItem.formattedValue = dataItem[this.dataField+"_formatted"];
								chartItem.childItems[chartItem.childItems.length] = childItem;
							}
							nChildItems++;
						}
					}
				}
				chartItem.nChildItems = nChildItems;
				chartItem.childItems.reverse();
			}
		}
	}
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonPyramidLayer.prototype.clearSelection = function() {};

/**
 * Renders the data.
 *
 * @method render
 */
ia.ComparisonPyramidLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();
	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.highlightContext.beginPath();
	    this.highlightContext.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.highlightContext.clip();
	}

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
			var index = (chartItem.nChildItems - 1) - childItem.index;
			if (childItem != undefined) this._setItemShape(childItem, index, chartItem.nChildItems);
		}
		
		if (this.displayAll) this._renderItem(chartItem);
	}

	this.renderSelection();
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
ia.ComparisonPyramidLayer.prototype._setItemShape = function(item, index, nItems)
{
	// Calculate the bounding box of the chart item.
	var pw = this.map.canvasHeight / nItems;
	var x = this.map.getPixelX(item.value); 
	var y = this.map.canvasY + (pw / 2) + (pw * index);
	var w = 10;	
	var h = 10;
		
	// Reset the pixel drawing area for the point.
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
ia.ComparisonPyramidLayer.prototype._renderItem = function(item)
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
ia.ComparisonPyramidLayer.prototype.selectItem = function(item)
{
	if (this.thematic)
	{
		var legendClass = this.thematic.getClass(item.id);
		if (legendClass) this.selectionContext.strokeStyle = legendClass.color;	
	}
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.ComparisonPyramidLayer.prototype.highlightItem = function(item)
{	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.highlightContext.beginPath();
	    this.highlightContext.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.highlightContext.clip();
	}
    
	this._drawItem(item, this.highlightContext, true);
};

/**
 * Draws a spline.
 *
 * @method _drawSpline
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.ComparisonPyramidLayer.prototype._drawSpline = function(item, ctx)
{
	var t = 0.3;
	var cp = [];

	var n = item.childItems.length;
	for(var i = 0; i < n-2; i++)
    {
        cp = cp.concat(this._getControlPoints(item.childItems[i].shape.x,
        								item.childItems[i].shape.y,
        								item.childItems[i+1].shape.x,
        								item.childItems[i+1].shape.y,
        								item.childItems[i+2].shape.x,
        								item.childItems[i+2].shape.y,
        								t));
    }    
    for(var i = 1; i < n-2; i++)
    {
        ctx.beginPath();
        ctx.moveTo(item.childItems[i].shape.x,item.childItems[i].shape.y);
        ctx.bezierCurveTo(cp[4*i-2],
        					cp[4*i-1],
        					cp[4*i],
        					cp[4*i+1],
        					item.childItems[i+1].shape.x,
        					item.childItems[i+1].shape.y);
        ctx.stroke();
    }

    if (n > 0)
    {
	    //  For open curves the first and last arcs are simple quadratics.
	    ctx.beginPath();
	    ctx.moveTo(item.childItems[0].shape.x,item.childItems[0].shape.y);
	    ctx.quadraticCurveTo(cp[0],cp[1],item.childItems[1].shape.x,item.childItems[1].shape.y);
	    ctx.stroke();
	    
	    ctx.beginPath();
	    ctx.moveTo(item.childItems[n-1].shape.x,item.childItems[n-1].shape.y);
	    ctx.quadraticCurveTo(cp[4*n-10],cp[4*n-9],item.childItems[n-2].shape.x,item.childItems[n-2].shape.y);
	    ctx.stroke();
	}
};

/**
 * Draws a spline.
 *
 * @method _getControlPoints
 * @param {Number} x0 The coordinates of the end (knot) pts of this segment.
 * @param {Number} y0 The coordinates of the end (knot) pts of this segment.
 * @param {Number} x1 The coordinates of the end (knot) pts of this segment.
 * @param {Number} y1 The coordinates of the end (knot) pts of this segment.
 * @param {Number} x2 The coordinates of the next knot.
 * @param {Number} y2 The coordinates of the next knot.
 * @param {Number} t t is the 'tension' which controls how far the control points spread.
 * @return {Number[]} Four control points in an array [p1x,p1y,p2x,p2y].
 * @private
 */
ia.ComparisonPyramidLayer.prototype._getControlPoints = function(x0,y0,x1,y1,x2,y2,t)
{
    //  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
    //  x2,y2 is the next knot -- not connected here but needed to calculate p2
    //  p1 is the control point calculated here, from x1 back toward x0.
    //  p2 is the next control point, calculated here and returned to become the 
    //  next segment's p1.
    //  t is the 'tension' which controls how far the control points spread.
    
    //  Scaling factors: distances from this knot to the previous and following knots.
    var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
    var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
   
    var fa=t*d01/(d01+d12);
    var fb=t-fa;
  
    var p1x=x1+fa*(x0-x2);
    var p1y=y1+fa*(y0-y2);

    var p2x=x1-fb*(x0-x2);
    var p2y=y1-fb*(y0-y2);  
    
    return [p1x,p1y,p2x,p2y]
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @param {Boolean} highlight Is it a highlight?.
 * @private
 */
ia.ComparisonPyramidLayer.prototype._drawItem = function(item, ctx, highlight)
{
	this._drawSpline(item, ctx);

	/*ctx.beginPath();
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem != undefined) 
		{
			if (doMoveTo) 
				ctx.moveTo(childItem.shape.x, childItem.shape.y);
			else 
				ctx.lineTo(childItem.shape.x, childItem.shape.y);
			doMoveTo = false;
		}
		else doMoveTo = true;
	}
	ctx.stroke();*/
			
	if (highlight == true)
	{
		var doMoveTo = true; // Takes into account first value and missing values.
		var n = item.childItems.length;
		for (var i = 0; i < n; i++)
		{
			var childItem = item.childItems[i];
			if (childItem != undefined)
			{
				ctx.beginPath();
					 ia.Shape.drawCircle(ctx, childItem.shape.x, childItem.shape.y, 5);
				ctx.fill();
				ctx.stroke();
			}
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
ia.ComparisonPyramidLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id) || this.displayAll)
	{
		var n = item.childItems.length;
		for (var i = 0; i < n; i++)
		{
			var childItem = item.childItems[i];
			if (childItem != undefined) 
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
ia.ComparisonPyramidLayer.prototype.showTip = function(item, event)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem != undefined) 
		{
			if (childItem.hitArea.intersects(event.x,event.y)) 
			{
				// Tip replacement.
				if (this.tip != "")
				{
					var label = this.tip;
					label = label.split("${name}").join(item.name);
					label = label.split("${ageGroup}").join(childItem.ageGroup);
					label = label.split("${value}").join(childItem.formattedValue);
					this.map.datatip.text(label);
				}
				else this.map.datatip.text(item.name+" <br/> "+childItem.ageGroup+" <br/> "+childItem.formattedValue);

				var px,py;
				
				if (event.isTouchEvent)
				{
					px = event.x - (this.map.datatip.getWidth() / 2);
					py = event.y - (this.map.datatip.getHeight() + 30);
				}
				else
				{
					if (childItem.value < 0)
						px = childItem.shape.x - (this.map.datatip.getWidth() + 5);
					else
						px = (childItem.shape.x + childItem.shape.width) + 5;

					py = (childItem.shape.y + (childItem.shape.height / 2)) -  (this.map.datatip.getHeight() / 2);
				}
				this.map.datatip.position(px, py);
				this.map.datatip.show();

				break;
			}
		}
	}
};