/** 
 * The base class for time series layers.
 *
 * @author J Clare
 * @class ia.TimeLayer
 * @extends ia.ItemLayer
 * @constructor
 */
ia.TimeLayer = function()
{
	ia.TimeLayer.baseConstructor.call(this);

	this.style = {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'};
	this.dropDates = [];
	this.selectedDate = "";
	this.drawLinesThroughMissingValues = true;
	this.matchAxisToSelectedData = false;
	this.highlightSelectedDate = false;

	// For multi-line mode.
	this.dashWidth = 12;
	this.gapWidthAsProportionOfDashWidth = 0.3;
	this.dashedLineThicknessAsProportionOfSolidLine = 0.6;
	this.associateNames = {};
	this.dataFields = [];

	/* For coloured lines */
	this.thematic = new ia.Thematic();
	this.thematic.setDataType(ia.Thematic.CATEGORIC);
	this.thematic.setDataField("value");
	this._highlightMode = false;
	/* For coloured lines */
};
ia.extend(ia.ItemLayer, ia.TimeLayer);

/**
 * Drop dates.
 *
 * @property dropDates
 * @type String[]
 */
ia.TimeLayer.prototype.dropDates;

/**
 * The selected date.
 *
 * @property selectedDate
 * @type String
 */
ia.TimeLayer.prototype.selectedDate;

/**
 * Should the selected date be highlighted.
 *
 * @property highlightSelectedDate
 * @type Boolean
 * @default false
 */
ia.TimeLayer.prototype.highlightSelectedDate;

/** 
 * The layer style.
 *
 * @property style
 * @type Object
 * @default {fillStyle:'#ffffff', strokeStyle:'#ff0000', lineWidth:'2', lineJoin:'round'}
 */
ia.TimeLayer.prototype.style;

/** 
 * The min bar value.
 *
 * @property minValue
 * @type Number
 */
ia.TimeLayer.prototype.minValue;

/** 
 * The max bar value.
 *
 * @property maxValue
 * @type Number
 */
ia.TimeLayer.prototype.maxValue;

/**
 * Specifies a color palette for the layer.
 *
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.TimeLayer.prototype.colorPalette;

/**
 * Should lines be drawn through missing data values.
 *
 * @property drawLinesThroughMissingValues
 * @type Boolean
 * @default true
 */
ia.TimeLayer.prototype.drawLinesThroughMissingValues;

/** 
 * Indicates that the axis should be updated and matched to the selected features.
 * 
 * @property matchAxisToSelectedData
 * @type Boolean
 * @default false
 */
ia.TimeLayer.prototype.matchAxisToSelectedData;

/** 
 * The marker size.
 * 
 * @property markerSize
 * @type Number
 * @default 7
 */
ia.TimeLayer.prototype.markerSize = 7;

/**
 * Updates the data.
 *
 * @method update
 */
ia.TimeLayer.prototype.update = function() 
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
				var me = this;
				var dates = data.dates.filter( function( el ) 
				{
					return me.dropDates.indexOf( el ) < 0;
				});

				// First off get the list of ids to loop through.
				var indData = data[dates[0]];
				var dateLength = dates.length;

				// Loop through the data.
				for (var id in indData)
				{
					// Get the data item.
					var dataItem = indData[id];
					
					// Create a new chart item.
					var chartItem = {};
					chartItem.id = dataItem.id;
					chartItem.name = dataItem.name;
					chartItem.state = ia.ItemLayer.UNSELECTED;
					if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
					chartItem.parent = this;
					chartItem.layer = this;

					this.items[dataItem.id] = chartItem;
					this.itemArray.push(chartItem);
					
					// Now add child items for each date.
					chartItem.childItems = [];
					for (var i = 0; i < dateLength; i++)
					{
						var date = dates[i];
						var dataItem = data[date][id];
					
						// Has to be a number to be displayed in a time chart
						var value = dataItem[this.dataField];
						if (ia.isNumber(value)) 
						{
						    var childItem = {};

                            // Capture associates.
						    for (var j in dataItem)
						    {
						        childItem[j] = dataItem[j];
						    }

							childItem.id = id+"~"+date;
							childItem.name = date;
							childItem.shape = new ia.Rectangle();
							childItem.hitArea = new ia.Rectangle();
							childItem.value = value;
							childItem.formattedValue = dataItem[this.dataField+"_formatted"];

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
						else chartItem.childItems[chartItem.childItems.length] = {name:date, value:undefined};
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
ia.TimeLayer.prototype.render = function() 
{
	if (this.dataFields.length > 0) this.render_multi();
	else
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

		// Render selected date region.
		if (this.highlightSelectedDate)
		{
			var data = this.getData();
			if (data.dates)
			{
				this.context.fillStyle = ia.Color.toRGBA(this.selectionColor, 0.07);
				this.context.lineWidth = 0;
			
				var me = this;
				var dates = data.dates.filter(function (el)
				{
					return me.dropDates.indexOf( el ) < 0;
				});

				var index = dates.indexOf(this.selectedDate);
				if (index != -1)
				{
					var x, y, w, h;
					if (this.map.orientation == "vertical")
					{
						x = this.map.canvasX + ((index / dates.length) * this.map.canvasWidth);
						y = this.map.canvasY;
						w = this.map.canvasWidth / dates.length;
						h = this.map.canvasHeight; 	 
					}
					else
					{
						x = this.map.canvasX;
						y = this.map.canvasY + ((index / dates.length) * this.map.canvasHeight);
						w = this.map.canvasWidth;
						h = this.map.canvasHeight / dates.length; 	 
					}
					this.context.beginPath();
						this.context.rect(x, y, w, h);
					this.context.fill();
				}
			}
		}

		// Render the selection (which in this case is the only thing displayed on the chart).
		this.renderSelection();
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
ia.TimeLayer.prototype._setItemShape = function(item, index, nItems)
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

		var x;
		if (nItems == 1) x = startX;
		else  x = startX + (index / (nItems - 1)) * hSpace;

		var y = this.map.getPixelY(item.value); 	
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
		var x = this.map.getPixelX(item.value); 	

		var y;
		if (nItems == 1) y = startY;
		else y = startY + (index / (nItems - 1)) * vSpace;	
	}	
	var w = this.markerSize;	
	var h = this.markerSize;
	
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
	else
	{
		w = w * 2;	
		h = h * 2;
	}
	item.hitArea.x = x - (w / 2);
	item.hitArea.y = y - (h / 2);
	item.hitArea.width = w;
	item.hitArea.height = h;
};

/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.TimeLayer.prototype.selectItem = function(item)
{	
	var n = this.selectionIds.length;
	
	if (this.colorPalette)
	{
		var colorList = this.colorPalette.getColors(n);
		var index = this.selectionIds.indexOf(item.id);
		this.selectionContext.strokeStyle = colorList[index];	
	}
	this._highlightMode = false;
	
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.TimeLayer.prototype.highlightItem = function(item)
{	
	// Clip.
	if (!ia.IS_IE_TEN)
	{
		this.highlightContext.beginPath();
	    this.highlightContext.rect(this.map.canvasX, this.map.canvasY, this.map.canvasWidth, this.map.canvasHeight);
	    this.highlightContext.clip();
	}
	this._highlightMode = true;
	
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
ia.TimeLayer.prototype._drawItem = function(item, ctx)
{
	if (this.dataFields.length > 0) this._drawItem_multi(item, ctx);
	else
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
			if (this.map.animationMode && childItem.name == this.selectedDate) break;
		}
		ctx.stroke();
				
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
			if (this.map.animationMode && childItem.name == this.selectedDate) break;
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
ia.TimeLayer.prototype.hitItem = function(item, event)
{
	if (this.isSelected(item.id))
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

/** 
 * Supplies the default text for the layer. This can 
 * be replaced with a custom function
 * 
 * @method tipFunction
 * @param {Object} item The map item.
 * @param {Object} childItem The map child item.
 */
ia.TimeLayer.prototype.tipFunction = undefined;

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.TimeLayer.prototype.showTip = function(item, event)
{
	var n = item.childItems.length;
	for (var i = 0; i < n; i++)
	{
		var childItem = item.childItems[i];
		if (childItem.value != undefined) 
		{
			if (childItem.hitArea.intersects(event.x,event.y)) 
			{
				var label;
				// Backwards compatibility.
				if (this.tip.indexOf('${name} (${date}): ${value}') != -1)
				{
					label = this.tip;
					label = label.split("${name}").join(item.name);
					label = label.split("${date}").join(childItem.name);
					label = label.split("${value}").join(childItem.formattedValue);

					// Multi-line chart.
					// Replaced ${associateName} with ${lineLabel} in config files but keep in for backwards compatibility.
					if (childItem.associateName != undefined) 
						label = label.split("${associateName}").join(childItem.associateLabel);
					else 
						label = label.split("${associateName}").join('');
					if (childItem.associateLabel != undefined) 
						label = label.split("${lineLabel}").join(childItem.associateLabel);
					else 
						label = label.split("${lineLabel}").join('');

				    // Associates.
					for (var id in childItem) {label = label.split('${' + id + '}').join(childItem[id + '_formatted']);}
				}
				// Tip replacement.
				else if (this.tipFunction != undefined) 
				{
					label = this.tipFunction(item, childItem);
				}
				else label = item.name+" : "+childItem.name+" : "+childItem.formattedValue;

				this.map.datatip.text(label);

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

// For multi-line mode.

/**
 * Specifies a thematic for multi-line data.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.TimeLayer.prototype.thematic;

/** 
 * The size of the dashed for a dashed line.
 *
 * @property dashWidth
 * @type Number
 * @default 12
 */
ia.TimeLayer.prototype.dashWidth;

/** 
 * The size of the gaps relative to the size of the dash for dashed lines.
 *
 * @property gapWidthAsProportionOfDashWidth
 * @type Number
 * @default 0.3
 */
ia.TimeLayer.prototype.gapWidthAsProportionOfDashWidth;

/** 
 * The thickness of the dashed lines relative to the thickness of the first solid line when drawing associates.
 *
 * @property dashedLineThicknessAsProportionOfSolidLine
 * @type Number
 * @default 0.6
 */
ia.TimeLayer.prototype.dashedLineThicknessAsProportionOfSolidLine;

/**
 * A list of data fields.
 *
 * @property dataFields
 * @type String[]
 */
ia.TimeLayer.prototype.dataFields;

/**
 * A hash of associate names and labels associateNames[associateName] = associateLabel.
 *
 * @property associateNames
 * @type Obj
 */
ia.TimeLayer.prototype.associateNames;

/**
 * Updates the data.
 *
 * @method update_multi
 * @private
 */
ia.TimeLayer.prototype.update_multi = function() 
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
			var me = this;
			var dates = data.dates.filter( function( el ) 
			{
				return me.dropDates.indexOf( el ) < 0;
			});

			// First off get the list of ids to loop through.
			var indData = data[dates[0]];
			var dateLength = dates.length;

			// Loop through the data.
			for (var id in indData)
			{
				// Get the data item.
				var dataItem = indData[id];
				
				// Create a new chart item.
				var chartItem = {};
				chartItem.id = dataItem.id;
				chartItem.name = dataItem.name;
				chartItem.state = ia.ItemLayer.UNSELECTED;
				if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
				chartItem.parent = this;
				chartItem.layer = this;

				this.items[dataItem.id] = chartItem;
				this.itemArray.push(chartItem);

				// Now add child items for each date.
				chartItem.childItems = [];
				for (var j = 0; j < this.dataFields.length; j++)
				{
					// Has to be a number to be displayed in a bar chart.
					var dataField = this.dataFields[j];

					for (var i = 0; i < dateLength; i++)
					{
						var date = dates[i];
						var dataItem = data[date][id];

						// Has to be a number to be displayed in a time chart
						var value = dataItem[dataField];
						if (ia.isNumber(value)) 
						{	
						    var childItem = {};

						    // Capture associates.
						    for (var k in dataItem)
						    {
						        childItem[k] = dataItem[k];
						    }

							childItem.id = id+"~"+date+"~"+dataField;
							childItem.name = date;
							childItem.associateName = dataField;
							childItem.associateLabel = this.associateNames[dataField] || dataField;

							/* For coloured lines */
							var legendClass = this.thematic.categoricClassifier.getClass(dataField);
							if (legendClass) childItem.color = legendClass.color;
							/* For coloured lines */

							childItem.date = date;
							childItem.shape = new ia.Rectangle();
							childItem.hitArea = new ia.Rectangle();
							childItem.value = value;
							childItem.formattedValue = dataItem[dataField+"_formatted"];
							childItem.dataField = dataField;

							//ia.log(childItem.id+" "+childItem.value)

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
						else 
						{
							chartItem.childItems[chartItem.childItems.length] = {name:date, value:undefined, dataField:dataField};
							//ia.log(id +"~"+ date +"~"+ dataField  +" "+ value)
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
 * @method render_multi
 * @private
 */
ia.TimeLayer.prototype.render_multi = function() 
{
	// Get the data.
	var data = this.getData();

	var me = this;
	var dates = data.dates.filter( function( el ) 
	{
		return me.dropDates.indexOf( el ) < 0;
	});

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

		var index = 0;
		var nChildItems = chartItem.childItems.length;
		var currentDataField = undefined;

		for (var j = 0; j < nChildItems; j++)
		{
			var childItem = chartItem.childItems[j];
			if (childItem.dataField != currentDataField) 
			{
				index = 0;
				currentDataField = childItem.dataField;
			}
			else index++;

			if (childItem.value != undefined) this._setItemShape(childItem, index, dates.length);
		}
	}

	// Render selected date region.
	if (this.highlightSelectedDate)
	{
		if (dates && dates.length > 0)
		{
			this.context.fillStyle = ia.Color.toRGBA('#cccccc', 0.2);
			this.context.lineWidth = 0;
		
			var index = dates.indexOf(this.selectedDate);
			if (index != -1)
			{
				var x, y, w, h;
				if (this.map.orientation == "vertical")
				{
					x = this.map.canvasX + ((index / dates.length) * this.map.canvasWidth);
					y = this.map.canvasY;
					w = this.map.canvasWidth / dates.length;
					h = this.map.canvasHeight; 	 
				}
				else
				{
					x = this.map.canvasX;
					y = this.map.canvasY + ((index / dates.length) * this.map.canvasHeight);
					w = this.map.canvasWidth;
					h = this.map.canvasHeight / dates.length; 	 
				}
				this.context.beginPath();
					this.context.rect(x, y, w, h);
				this.context.fill();
			}
		}
	}

	// Render the selection (which in this case is the only thing displayed on the chart).
	this.renderSelection();
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem_multi
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.TimeLayer.prototype._drawItem_multi = function(item, ctx)
{
	var n = item.childItems.length;
	if (n > 0)
	{
		// Dash line setup. 
		var dashWidth = this.dashWidth;								// The initial dash width.
		var dashIncr = dashWidth / (this.dataFields.length - 1); 	// (this.dataFields.length - 1) First line is solid so dont include in calculation.
		dashWidth = dashWidth + dashIncr;

		var lineWidth = this.style.lineWidth;	// Initial line width.

		// Split into separate lines.
		var me = this;

	    // Get the data.
		var data = this.getData();
		var dates = data.dates.filter(function (el)
		{
			return me.dropDates.indexOf( el ) < 0;
		});
		var noDates = dates.length;
		var lineArrays = [];
		var i,j,temparray,index = 0;
		for (i = 0,j = item.childItems.length; i < j; i += noDates) 
		{
		    lineArrays[index] = item.childItems.slice(i,i+noDates);
		    index++;
		}

		// Draw each line separately - we have to do this because lineWidth
		// cant be changed in a loop through all the items.
		var count = -1;
		function onSuccess()
		{
			count++;
			if (count < lineArrays.length)
			{
				var arr = lineArrays[count];

				/* For coloured lines */
				for (var k = 0; k < arr.length; k++)
				{
					var color = arr[k].color;
					if (color != undefined) break;
				}
				ctx.strokeStyle = color;

				if (me._highlightMode)
					me._drawLine_multi(arr, ctx, 5, lineWidth * 0.65, onSuccess);
				else 
					me._drawLine_multi(arr, ctx, 0, lineWidth, onSuccess);
				/* For coloured lines */

				/*
				commented out for coloured lines implementation
				if (count == 0) // First line is solid.
				{
					me._drawLine_multi(arr, ctx, 0, lineWidth, onSuccess);
				}
				else // Subsequent lines are dashed with the dash reducing in length for each line.
				{
					dashWidth = dashWidth - dashIncr;
					lineWidth = me.style.lineWidth * me.dashedLineThicknessAsProportionOfSolidLine;
					me._drawLine_multi(arr, ctx, dashWidth, lineWidth, onSuccess);
				}*/
			}
		};
		onSuccess();
	}
};

/**
 * Does the actual drawing.
 *
 * @method _drawLine_multi
 * @param {Object[]} childItems The list of child item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @param {Number} dashWidth The width of the dash.
 * @param {Number} lineWidth The thickness of the line.
 * @param {Function} callback Callback function.
 * @private
 */
ia.TimeLayer.prototype._drawLine_multi = function(childItems, ctx, dashWidth, lineWidth, callback)
{
	var n = childItems.length;

	if (n > 0)
	{
		var doMoveTo = true; // Takes into account first value and missing values.
		var mx, my;

		// Dash line gap. 
		var gapWidth = dashWidth * this.gapWidthAsProportionOfDashWidth;

		// Lines.
		ctx.beginPath();
		ctx.lineWidth = lineWidth;

		for (var i = 0; i < n; i++)
		{
			var childItem = childItems[i];

			if (childItem.value != undefined) 
			{
				if (doMoveTo) ctx.moveTo(childItem.shape.x, childItem.shape.y);
				else 
				{
					if (dashWidth != 0)  
						ctx.dashedLine(mx, my, childItem.shape.x, childItem.shape.y, dashWidth, gapWidth);
					else 
						ctx.lineTo(childItem.shape.x, childItem.shape.y);
				}

				doMoveTo = false;
				mx = childItem.shape.x;
				my = childItem.shape.y;
			}
			else if (this.drawLinesThroughMissingValues != true) doMoveTo = true;
			if (this.map.animationMode && childItem.date == this.selectedDate) break;
		}

		ctx.stroke();

		// Circles.
		for (var i = 0; i < n; i++)
		{
			var childItem = childItems[i];
			if (childItem.value != undefined)
			{
				ctx.beginPath();
					 ia.Shape.drawCircle(ctx, childItem.shape.x, childItem.shape.y, childItem.shape.width);
				ctx.fill();
				ctx.stroke();
			}
			if (this.map.animationMode && childItem.date == this.selectedDate) break;
		}

		// Reset the line width
		ctx.lineWidth = this.style.lineWidth;

		callback.call(null); // return.
	}
};