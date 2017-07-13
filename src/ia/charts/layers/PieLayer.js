/** 
 * The base class for pie layers.
 *
 * @author J Clare
 * @class ia.PieLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.PieLayer = function()
{
	ia.PieLayer.baseConstructor.call(this);
	
	this._piePadding = 10;
	this._pieTotal = 0;
	this._pieRadius = 0;
	this._pieCenterX = 0;
	this._pieCenterY = 0;
	
	this.isLegendComponent = true;
};
ia.extend(ia.ItemLayer, ia.PieLayer);

/**
 * Specifies a thematic for the pie layer.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.PieLayer.prototype.thematic;

/**
 * Indicates this is a legend component.
 *
 * @property isLegendComponent
 * @type Boolean
 * @default true
 */
ia.PieLayer.prototype.isLegendComponent;

/**
 * Updates the data.
 *
 * @method update
 */
ia.PieLayer.prototype.update = function() 
{
	// Clear the items.
	this.itemArray = [];
	this.clearItems();

	var classes = this.thematic.getClasses();
	for (var i = 0; i < classes.length; i++) 
	{
		var legendClass = classes[i];

		// Create a new chart item.
		var chartItem = {};
		chartItem.id = legendClass.index;
		chartItem.legendClass = legendClass;
		chartItem.color = legendClass.color;
		chartItem.value = legendClass.items.length;
		chartItem.formattedValue = legendClass.items.length;
		chartItem.state = ia.ItemLayer.UNSELECTED;
		if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
		chartItem.parent = this;
		chartItem.layer = this;
		
		this.items[chartItem.id] = chartItem;
		this.itemArray.push(chartItem);
	}
	
	
};

/**
 * Renders the data.
 *
 * @method render
 */
ia.PieLayer.prototype.render = function() 
{
	// Clear the canvas.
	this.clear();
	
	this._pieRadius = (Math.min(this.map.canvasWidth,this.map.canvasHeight) / 2) - this._piePadding;
	this._pieCenterX = this.map.canvasWidth / 2;
    this._pieCenterY = this.map.canvasHeight / 2;
	
	// Reset the context styles in case the layer styles has changed.
	for (var p in this.style) 
	{
		this.context[p] = this.style[p];
		this.selectionContext[p] = this.style[p];
		this.highlightContext[p] = this.style[p];
	} 
	
	this.selectionContext.fillStyle = "rgba(0, 0, 0, 0)";
	this.selectionContext.strokeStyle = this.selectionColor;
	this.selectionContext.lineWidth = parseFloat(this.style.lineWidth) + 1;

	this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.3);
	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
	this.highlightContext.lineWidth = parseFloat(this.style.lineWidth) + 1;

	// Render the items.
	var startAngle = 1.5 * Math.PI;
	var endAngle = 0;
	
	var nItems = this.itemArray.length;
	if (nItems == 0)
	{
		// Draw empty circle for when theres no data.
		this.context.beginPath();
			 ia.Shape.drawCircle(this.context, this._pieCenterX, this._pieCenterY, this._pieRadius*2);
		this.context.stroke();
	}
	else
	{
		// Calculate the pie total.
		this._pieTotal = 0;
		for (var i = 0; i < nItems; i++) 
		{
			var chartItem = this.itemArray[i];
			var itemValue = parseFloat(chartItem.value);
			if (itemValue > 0) this._pieTotal = this._pieTotal + itemValue;
		}
	
		// Render the items.
		for (var i = 0; i < nItems; i++) 
		{
			var chartItem = this.itemArray[i];
			var itemValue = parseFloat(chartItem.value);

			if (itemValue > 0)
			{
				var perc = ia.round((itemValue / this._pieTotal) * 100, 2);
				
				// Tip replacement.
				if (this.tip != "")
				{
					var label = this.tip;
					label = label.split("${name}").join(chartItem.legendClass.getLabel());
					label = label.split("${value}").join(chartItem.formattedValue);
					label = label.split("${percentage}").join(perc);
					chartItem.label = label;
				}
				else chartItem.label = chartItem.legendClass.getLabel() + " : " + perc + "%";

				// Give the item a starting and ending angle
				// which will enable us to render a pie segment.

				endAngle = startAngle + Math.PI * 2 * (itemValue / this._pieTotal);

				chartItem.startAngle = startAngle
				chartItem.endAngle = endAngle
				chartItem.angleSize = endAngle - startAngle;

				startAngle = endAngle;

				this._renderItem(chartItem);
			}
		}

		// Render the selection.
		this.renderSelection();
	}
};
	
/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.PieLayer.prototype._renderItem = function(item)
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
ia.PieLayer.prototype.selectItem = function(item)
{	
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.PieLayer.prototype.highlightItem = function(item)
{	
	this._drawItem(item, this.highlightContext);
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.PieLayer.prototype._drawItem = function(item, ctx)
{
	if (this._pieRadius > 0)
	{
		ctx.beginPath();
			ctx.moveTo(this._pieCenterX, this._pieCenterY);
			ctx.arc(this._pieCenterX, this._pieCenterY, this._pieRadius, item.startAngle, item.endAngle, false);
			ctx.lineTo(this._pieCenterX, this._pieCenterY);
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
ia.PieLayer.prototype.hitItem = function(item, event)
{
	return this._pointInSlice(item, event.x, event.y);
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
ia.PieLayer.prototype._pointInSlice = function(item, pointX, pointY)
{
	var angle = item.endAngle - item.startAngle
	
	var p0X = this._pieCenterX;
	var p0Y = this._pieCenterY;
	var p1X = p0X + (this._pieRadius * Math.cos(item.startAngle));
	var p1Y = p0Y + (this._pieRadius * Math.sin(item.startAngle));
	var p2X = p0X + (this._pieRadius * Math.cos(item.startAngle+(angle/4)));
	var p2Y = p0Y + (this._pieRadius * Math.sin(item.startAngle+(angle/4)));
	var p3X = p0X + (this._pieRadius * Math.cos(item.startAngle+(angle/2)));
	var p3Y = p0Y + (this._pieRadius * Math.sin(item.startAngle+(angle/2)));
	var p4X = p0X + (this._pieRadius * Math.cos(item.startAngle+(angle/1.5)));
	var p4Y = p0Y + (this._pieRadius * Math.sin(item.startAngle+(angle/1.5)));
	var p5X = p0X + (this._pieRadius * Math.cos(item.startAngle+angle));
	var p5Y = p0Y + (this._pieRadius * Math.sin(item.startAngle+angle));
	
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
ia.PieLayer.prototype._pointInPoly = function(coords, pointX, pointY)
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
ia.PieLayer.prototype.showTip = function(item, event)
{
	this.map.datatip.text(item.label);
	
	var px,py;
	if (event.isTouchEvent)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		// Removed this to fix pointer-events issue in IE - can add back in when this is fixed.
		// http://bugzilla.geowise.co.uk/show_bug.cgi?id=7522
		/*var angle = item.endAngle - item.startAngle;
		px = this._pieCenterX + ((this._pieRadius * Math.cos(item.startAngle+(angle/2)))/2);
		py = this._pieCenterY + ((this._pieRadius * Math.sin(item.startAngle+(angle/2)))/2);
		if (px < this._pieCenterX) px = px - this.map.datatip.getWidth();
		if (py < this._pieCenterY) py = py - this.map.datatip.getHeight();*/

		px = event.x  / 2;
		py = event.y - (this.map.datatip.getHeight() + 5);
	}
	
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};