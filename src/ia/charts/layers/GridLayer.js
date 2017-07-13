/** 
 * The base class for grid layers.
 *
 * @author J Clare
 * @class ia.GridLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.GridLayer = function()
{
	ia.GridLayer.baseConstructor.call(this);
	this._noRows = 7;
	this._noCols = 53;
};
ia.extend(ia.ItemLayer, ia.GridLayer);

/**
 * Updates the data.
 *
 * @method update
 */
ia.GridLayer.prototype.update = function() 
{
	// Check if the data has changed
	if (this.map && this.dataChanged)
	{
		// Get the data.
		var data = this.getData();

		ia.log(data)

		// Place in an array and sort by date - because they could be in any order as theyre features!.
		var arr = [];
		for (var id in data)
		{
			// Get the data item.
			arr[arr.length] = data[id];
		}
		arr.sort(function(a,b)
		{
			// Turn your strings into dates, and then subtract them
			// to get a value that is either negative, positive, or zero.
			return a.id - b.id;
		});

		// Clear the items.
		this.itemArray = [];
		this.clearItems();

		// Loop through the data.
		for (var i = 0; i < arr.length; i++) 
		{
			// Get the data item.
			var dataItem = arr[i];
			var id = dataItem.id;

			// Has to be a number to be displayed in a bar chart
			var value = dataItem[this.dataField];

			// Create a new chart item.
			var chartItem =  {};
			chartItem.id = dataItem.id;
			chartItem.name = dataItem.name;
			chartItem.color = dataItem.color;
			chartItem.value = value;

			chartItem.state = ia.ItemLayer.UNSELECTED;
			if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
			chartItem.parent = this;
			chartItem.layer = this;

			chartItem.rect = new ia.Rectangle();
			chartItem.hitArea = new ia.Rectangle();

			this.items[id] = chartItem;
			this.itemArray.push(chartItem);
		}
		this.dataChanged = false;
	}
};

/**
 * Renders the data.
 *
 * @method render
 */
ia.GridLayer.prototype.render = function() 
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
	
	this.selectionContext.strokeStyle = this.selectionColor;
	this.selectionContext.lineWidth = parseFloat(this.style.lineWidth) + 1;

	this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
	this.highlightContext.lineWidth = parseFloat(this.style.lineWidth) + 1;

	this.selectionContext.fillStyle = "rgba(0, 0, 0, 0)";
	this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, 0.3);

	this.context.lineWidth = 0;

	// Render the items.
	var row = 0;
	var col = 0;
	var nItems = this.itemArray.length;
	for (var i = 0; i < nItems; i++) 
	{
		var chartItem = this.itemArray[i];
		this._setItemShape(chartItem, row, col);
		this._renderItem(chartItem);

		if (row == (this._noRows-1)) 
		{
			row = 0;
			col++;
		}
		else row++;
	}

	// Render the selection.
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
ia.GridLayer.prototype._setItemShape = function(item, row, col)
{
	var w = this.map.canvasWidth / this._noCols;
	var x = this.map.canvasX + (col * w);
	var h = (this.map.canvasHeight / this._noRows); 
	var y = this.map.canvasY + (row * h);

	// The pixel drawing rectangle for the bar.
	item.rect.width = w;
	item.rect.height = h;
	item.rect.x = x;
	item.rect.y = y;

	// The pixel hit area for the bar.
	// Stretches the full width of the chart and full height of area reserved for bar.
	item.hitArea.x = item.rect.x;
	item.hitArea.y = item.rect.y;
	item.hitArea.width = item.rect.width;
	item.hitArea.height = item.rect.height;
};

/**
 * Renders the item to the given context.
 *
 * @method _renderItem
 * @param {Object} item The item.
 * @private
 */
ia.GridLayer.prototype._renderItem = function(item)
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
ia.GridLayer.prototype.selectItem = function(item)
{	
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.GridLayer.prototype.highlightItem = function(item)
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
ia.GridLayer.prototype._drawItem = function(item, ctx)
{
	ctx.beginPath();
		ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
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
ia.GridLayer.prototype.hitItem = function(item, event)
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
ia.GridLayer.prototype.showTip = function(item, event)
{
	this.map.datatip.text(this.tipFunction(item));

	// Position above the box.
	var px,py;
	
	if (event.isTouchEvent)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		px = (item.rect.x + (item.rect.width / 2)) - (this.map.datatip.getWidth() / 2);
		py = item.rect.y - this.map.datatip.getHeight() - 5;
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};