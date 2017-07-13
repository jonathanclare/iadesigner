/**
 * <code>ia.Map</code> defines the basic layout behavior of map.
 *
 * @author J Clare
 * @class ia.ChartBase
 * @extends ia.CanvasBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.ChartBase = function(id)
{
	ia.ChartBase.baseConstructor.call(this, id);

	// This is only here so we can use it to apply styles to chart items and map labels.
	this.itemStyle = $j("<div class='ia-chart-items' style='visibility:hidden'>");
	this.mapContainer.append(this.itemStyle);
	
	this.orientation = "vertical";
	this.showXAxisLabels = true;
	this.xAxisTitle = undefined;
	this.showYAxisLabels = true;
	this.yAxisTitle = undefined;
	this.showBox = false;
	this.showBottomBorder = false;
	this.showTopBorder = false;
	this.showLeftBorder = false;
	this.showRightBorder = false;
	this.showXAxisGrid = true;
	this.showYAxisGrid = true;
	this.centerXAxisLabels = false;
	this.centerYAxisLabels = false;	
	this.showXAxisTickMarks = false;
	this.showYAxisTickMarks = false;
	this.useTightLabels = false;
	this.formatter = new ia.Formatter();
	this.wrapXAxisLabels = false;
	
	// Add event listener for bBoxChange.
	var me = this;
	var chartReady = false;
	me.addEventListener(ia.Event.MAP_READY, function()
	{
		chartReady = true;
	});
	me.addEventListener(ia.BBoxEvent.BBOX_TRANSLATE, function(event) 
	{
		if (chartReady) me.render();
	});
	me.addEventListener(ia.BBoxEvent.BBOX_SCALE, function(event) 
	{
		if (chartReady) me.render();
	});
};
ia.extend(ia.CanvasBase, ia.ChartBase);

/** 
 * The chart orientation.
 * 
 * @property orientation
 * @type String
 * @default "vertical"
 */
ia.ChartBase.prototype.orientation;

/** 
 * Show a box around the chart.
 * 
 * @property showBox
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showBox;

/** 
 * Show the top border.
 * 
 * @property showTopBorder
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showTopBorder;

/** 
 * Show the bottom border.
 * 
 * @property showBottomBorder
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showBottomBorder;

/** 
 * Show the left border.
 * 
 * @property showLeftBorder
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showLeftBorder;

/** 
 * Show the right border.
 * 
 * @property showRightBorder
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showRightBorder;

/** 
 * X axis labels.
 * 
 * @property xAxisLabels
 * @type String[]
 */
ia.ChartBase.prototype.xAxisLabels;

/** 
 * Y axis labels.
 * 
 * @property yAxisLabels
 * @type String[]
 */
ia.ChartBase.prototype.yAxisLabels;

/** 
 * Show the x axis labels.
 * 
 * @property showXAxisLabels
 * @type Boolean
 * @default true
 */
ia.ChartBase.prototype.showXAxisLabels;

/** 
 * Wrap the x axis labels.
 * 
 * @property wrapXAxisLabels
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.wrapXAxisLabels;

/** 
 * The x axis title.
 * 
 * @property xAxisTitle
 * @type String
 */
ia.ChartBase.prototype.xAxisTitle;

/** 
 * Show x axis tick marks.
 * 
 * @property showXAxisTickMarks
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showXAxisTickMarks;

/** 
 * Show the y axis labels.
 * 
 * @property showYAxisLabels
 * @type Boolean
 * @default true
 */
ia.ChartBase.prototype.showYAxisLabels;

/** 
 * The y axis title.
 * 
 * @property yAxisTitle
 * @type String
 */
ia.ChartBase.prototype.yAxisTitle;

/** 
 * Show the x axis grid.
 * 
 * @property showXAxisGrid
 * @type Boolean
 * @default true
 */
ia.ChartBase.prototype.showXAxisGrid;

/** 
 * Show the y axis grid.
 * 
 * @property showYAxisGrid
 * @type Boolean
 * @default true
 */
ia.ChartBase.prototype.showYAxisGrid;

/** 
 * Show y axis tick marks.
 * 
 * @property showYAxisTickMarks
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.showYAxisTickMarks;

/** 
 * Center the x axis labels.
 * 
 * @property centerXAxisLabels
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.centerXAxisLabels;
	
/** 
 * Center the y axis labels.
 * 
 * @property centerYAxisLabels
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.centerYAxisLabels;	

/** 
 * Should the chart use tight labels.
 * 
 * @property useTightLabels
 * @type Boolean
 * @default false
 */
ia.ChartBase.prototype.useTightLabels;

/** 
 * The formatter.
 * 
 * @property formatter
 * @type ia.Formatter
 */
ia.ChartBase.prototype.formatter;

/** 
 * The min value.
 * 
 * @property fixedMinValue
 * @type Number
 */
ia.ChartBase.prototype.fixedMinValue;

/** 
 * The max value.
 * 
 * @property fixedMaxValue
 * @type Number
 */
ia.ChartBase.prototype.fixedMaxValue;

/** 
 * Renders the grid and adjusts the bounding box.
 * 
 * @method renderAxes
 * @param {Number} xMin The min value along the x axis.
 * @param {Number} xMax The max value along the x axis.
 * @param {Number} yMin The min value along the y axis.
 * @param {Number} yMax The max value along the y axis.
 */
ia.ChartBase.prototype.renderAxes = function(xMin, xMax, yMin, yMax)
{
	if (ia.isNumber(xMin) 
		&& ia.isNumber(xMax) 
		&& ia.isNumber(yMin) 
		&& ia.isNumber(yMax)
		&& this.canvas.width > 0
		&& this.canvas.height > 0)
	{
		// Axis variables.	
		var vPadding = 10;	
		var hPadding = 20;	

		var axisFontStyle = "Verdana";
		var axisFontColor = "#AAAAAA";
		var axisFontSize = 10;
		var textLinePadding = 1;
		var labelPadding = 5;

		var xAxisNoLabels = 5;
		var yAxisNoLabels = 5;

		var gridStrokeStyle = "#E5E5E5"
		var gridLineWidth = 1;

		// Be sneaky and use ia-chart css to set properties of chart
		if (this.container.css("font-family")) axisFontStyle = this.container.css("font-family");
		if (this.container.css("color")) axisFontColor = ia.Color.toHex(this.container.css("color"));
		if (this.container.css("font-size")) 
		{
			axisFontSize = this.container.css("font-size");
			if (axisFontSize.indexOf("px") > -1) axisFontSize = axisFontSize.substring(0, axisFontSize.indexOf("px"));
			axisFontSize = ia.parseInt(axisFontSize);
		}
		// * BUG-FIX FF and IE dont recognize border-color but will pick up borderRightColor which is set to be same as border-color in css. *
		if (this.container.css("borderRightColor")) gridStrokeStyle = ia.Color.toHex(this.container.css("borderRightColor"));

		// Reset canvas dimensions.
		this.canvasX = 0;
		this.canvasY = 0;
		this.canvasWidth = this.canvas.width;
		this.canvasHeight = this.canvas.height; 
		
		// Grid.
		this.context.lineWidth = gridLineWidth;
		this.context.strokeStyle = gridStrokeStyle;
		
		// Font.
		this.context.font = ""+axisFontSize+"px "+axisFontStyle;
		this.context.fillStyle = axisFontColor;

		// This is the space a line of text takes up within a label that contains wrapped text.
		var textLineHeight = axisFontSize + (textLinePadding * 2);	

		// Single line label height. Y-axis labels will always be single line.
		var singleLineLabelHeight = textLineHeight + (labelPadding * 2); 	

		// Set the initial gutter size. distance from edge of container to grid borders.
		var leftGutter = hPadding;	
		var rightGutter = hPadding;
		var bottomGutter = vPadding;
		var topGutter = vPadding;

		// Calculate gutter sizes.

		// Calculate approximate space taken up by y-axis labels.
		if (this.showYAxisLabels)
		{
			var yAxisHeight = this.canvasHeight - (topGutter + bottomGutter);

			// Get the y labels.
			var yLabels = this._getYAxisLabels(yMin, yMax, yAxisNoLabels, yAxisHeight, singleLineLabelHeight);

			// Calculate the left gutter.
			leftGutter = leftGutter + this._getMaxLabelWidth(yLabels, labelPadding);

			// Calculate the top / bottom gutters.
			if (!this.centerYAxisLabels)
			{
				bottomGutter = bottomGutter + (singleLineLabelHeight / 2);
				topGutter = topGutter + (singleLineLabelHeight / 2);
			}
		}

		// Calculate approximate space taken up by x-axis labels.
		if (this.showXAxisLabels)
		{
			var xAxisWidth = this.canvasWidth - (leftGutter + rightGutter);

			// Get the x labels.
			var xLabels = this._getXAxisLabels(xMin, xMax, xAxisNoLabels, xAxisWidth, labelPadding);

			// Calculate the bottom gutter.
			var labelHeight = singleLineLabelHeight;
			if (this.wrapXAxisLabels) 
			{
				var availableSpace = (xAxisWidth / xLabels.length);
				labelHeight = this._getMaxLabelHeight(xLabels, labelPadding, textLineHeight, availableSpace);
			}
			bottomGutter = vPadding + labelHeight;

			// Calculate the left / right gutter.
			if (!this.centerXAxisLabels)
			{
				var labelWidth = this._getLabelWidth(xLabels[0], labelPadding);
				if (labelWidth > (leftGutter - hPadding)) leftGutter = (labelWidth / 2) + hPadding;

				var labelWidth = this._getLabelWidth(xLabels[xLabels.length-1], labelPadding);
				rightGutter = rightGutter + (labelWidth / 2);
			}
		}

		// Calculate approximate space taken up by x-axis title.
		if (this.xAxisTitle != undefined)
		{
			var availableSpace = this.canvasWidth - (leftGutter + rightGutter);
			var labelHeight = this._getLabelHeight(this.xAxisTitle, labelPadding, textLineHeight, availableSpace);
			bottomGutter = bottomGutter + labelHeight - labelPadding; // minus labelpadding because dont need padding under label.
		}

		// Calculate approximate space taken up by y-axis title.
		if (this.yAxisTitle != undefined)
		{
			var availableSpace = this.canvasHeight - (bottomGutter + topGutter);
			var labelHeight = this._getLabelHeight(this.yAxisTitle, labelPadding, textLineHeight, availableSpace);
			leftGutter = leftGutter + labelHeight - labelPadding;  // minus labelpadding because dont need padding under label.
		}

		// Calculate the x-axis width.
		var xAxisWidth = this.canvasWidth - (leftGutter + rightGutter);

		// Draw x labels.
		var xLabelsHeight = 0;
		if (this.showXAxisLabels)
		{
			// Get the x labels.
			var xLabels = this._getXAxisLabels(xMin, xMax, xAxisNoLabels, xAxisWidth, labelPadding);

			// Re-calculate the bottom gutter.
			xLabelsHeight = singleLineLabelHeight;
			if (this.wrapXAxisLabels) 
			{
				var availableSpace = (xAxisWidth / xLabels.length);
				xLabelsHeight = this._getMaxLabelHeight(xLabels, labelPadding, textLineHeight, availableSpace);
			}
			var titleHeight = 0;
			if (this.xAxisTitle != undefined)
			{
				var availableSpace = this.canvasWidth - (leftGutter + rightGutter);
				titleHeight = this._getLabelHeight(this.xAxisTitle, labelPadding, textLineHeight, availableSpace);
			}
			bottomGutter = vPadding + xLabelsHeight + titleHeight;

			this.context.textAlign = "center";
			this.context.textBaseline = "top";

			var nLabels = xLabels.length;
			var yText = this.canvasHeight - bottomGutter + labelPadding;
			
			var xText;
			var xTextGap;
			var xGridGap;
			var xGrid;
			
			if (this.centerXAxisLabels)
			{
				xTextGap = xAxisWidth / nLabels;
				xText = leftGutter + (xTextGap / 2);
				xGridGap = xTextGap;
				xGrid = leftGutter;
			}
			else
			{
				xTextGap = xAxisWidth / (nLabels - 1);
				xText = leftGutter;
				xGridGap = xTextGap;
				xGrid = xText;
			}
			
			for (var i = 0; i < nLabels; i++)
			{
				var text = xLabels[i];

				// Special case - pyramid chart, "-" sign should be removed from x-axis numbers.
				if (this.isPyramidChart == true && text.indexOf("-") != -1) text = text.substring(1);

				if (this.wrapXAxisLabels) 
					this._wrapText(text, xText, yText, (xTextGap - (labelPadding * 2)), textLineHeight);
				else 
					this.context.fillText(text, xText, yText);

				if (this.showXAxisTickMarks)
				{
					var x1 = xText;
					var y1 = Math.floor(this.canvasHeight - bottomGutter) + 0.5;
					var x2 = xText;
					var y2 = y1 + labelPadding;

					this.context.beginPath();
					this.context.moveTo(x1, y1);
					this.context.lineTo(x2, y2);
					this.context.stroke();
				}
				
				if (this.showXAxisGrid)
				{
					// The grid line
					var x1 = Math.floor(xGrid) + 0.5;
					var y1 = Math.floor(topGutter) + 0.5;
					var x2 = x1;
					var y2 = Math.floor(this.canvasHeight - bottomGutter) + 0.5;

					this.context.beginPath();
					this.context.moveTo(x1, y1);
					this.context.lineTo(x2, y2);
					this.context.stroke();
				}

				xText = xText + xTextGap;
				xGrid = xGrid + xGridGap;
			};
			
			if (this.showXAxisGrid && this.centerXAxisLabels)
			{
				// The grid line
				var x1 = Math.floor(xGrid) + 0.5;
				var y1 = Math.floor(topGutter) + 0.5;
				var x2 = x1;
				var y2 = Math.floor(this.canvasHeight - bottomGutter) + 0.5;

				this.context.beginPath();
				this.context.moveTo(x1, y1);
				this.context.lineTo(x2, y2);
				this.context.stroke();
			}
		}
		
		// Draw x title.
		if (this.xAxisTitle != undefined)
		{
			var availableSpace = this.canvasWidth - (leftGutter + rightGutter);

			if (!this.showXAxisLabels)
			{
				// Re-calculate the bottom gutter.
				var titleHeight = this._getLabelHeight(this.xAxisTitle, labelPadding, textLineHeight, availableSpace);
				bottomGutter = vPadding + titleHeight;
			}

			this.context.textAlign = "center";
			this.context.textBaseline = "top";
			
			var x = leftGutter + (availableSpace / 2);
 			var y = (this.canvasHeight - bottomGutter) + (xLabelsHeight + labelPadding);
			
			this._wrapText(this.xAxisTitle, x, y, availableSpace, textLineHeight);
		}

		// Calculate the y-axis height.
		var yAxisHeight = this.canvasHeight - (topGutter + bottomGutter);

		// Draw y labels.
		var yLabelsWidth = 0;
		if (this.showYAxisLabels)
		{
			// Get the y labels.
			var yLabels = this._getYAxisLabels(yMin, yMax, yAxisNoLabels, yAxisHeight, singleLineLabelHeight);
			yLabelsWidth = this._getMaxLabelWidth(yLabels, labelPadding);

			this.context.textAlign = "right";
			this.context.textBaseline = "middle";

			var nLabels = yLabels.length;
			var xText = leftGutter - labelPadding;
			
			var yText;
			var yTextGap;
			var yGridGap;
			var yGrid;
			if (this.centerYAxisLabels)
			{
				yTextGap = yAxisHeight / (nLabels);
				yText = topGutter + (yTextGap / 2);
				yGridGap = yTextGap;
				yGrid = topGutter;
			}
			else
			{
				yTextGap = yAxisHeight / (nLabels - 1);
				yText = topGutter;
				yGridGap = yTextGap;
				yGrid = yText;
			}

			for (var i = 0; i < nLabels; i++)
			{
				// The label.
				var text = yLabels[i];
				this.context.fillText(text, xText, yText);

				if (this.showYAxisTickMarks)
				{
					var x1 = Math.floor(leftGutter) + 0.5;
					var y1 = yText;
					var x2 = x1 - labelPadding;
					var y2 = yText;

					this.context.beginPath();
					this.context.moveTo(x1, y1);
					this.context.lineTo(x2, y2);
					this.context.stroke();
				}

				if (this.showYAxisGrid)
				{
					// The grid line
					var x1 = Math.floor(leftGutter) + 0.5;
					var y1 = Math.floor(yGrid) + 0.5;
					var x2 = Math.floor(this.canvasWidth - rightGutter) + 0.5;
					var y2 = y1;

					this.context.beginPath();
					this.context.moveTo(x1, y1);
					this.context.lineTo(x2, y2);
					this.context.stroke();
				}

				yText = yText + yTextGap;
				yGrid = yGrid + yGridGap;
			}
			
			// Extra grid line when labels are centred.
			if (this.showYAxisGrid && this.centerYAxisLabels)
			{
				// The grid line
				var x1 = Math.floor(leftGutter) + 0.5;
				var y1 = Math.floor(yGrid) + 0.5;
				var x2 = Math.floor(this.canvasWidth - rightGutter) + 0.5;
				var y2 = y1;

				this.context.beginPath();
				this.context.moveTo(x1, y1);
				this.context.lineTo(x2, y2);
				this.context.stroke();
			}
		}
				
		// Draw y title.
		if (this.yAxisTitle != undefined)
		{
			var availableSpace = this.canvasHeight - (bottomGutter + topGutter);
			var labelHeight = this._getLabelHeight(this.yAxisTitle, labelPadding, textLineHeight, availableSpace);
			
			var y = topGutter + (availableSpace / 2);
			var x = leftGutter - yLabelsWidth - labelHeight + labelPadding;
			
			this.context.save();
			this.context.translate(x, y);
			this.context.rotate(-Math.PI/2);
			this.context.textAlign = "center";
			this.context.textBaseline = "top";
			
			this._wrapText(this.yAxisTitle, 0, 0, availableSpace, textLineHeight);
			
			this.context.restore();
		}

		this.canvasX = leftGutter;
		this.canvasWidth = this.canvasWidth  - (leftGutter + rightGutter);
		this.canvasY = topGutter;
		this.canvasHeight = this.canvasHeight - (topGutter + bottomGutter);

		// Corners of chart.
		var l = Math.floor(leftGutter) + 0.5;
		var r = Math.floor(leftGutter + this.canvasWidth) + 0.5;
		var t = Math.floor(topGutter) + 0.5;
		var b = Math.floor(topGutter + this.canvasHeight) + 0.5;

		// Draws a box around the chart.
		if (this.showBox)
		{
			this.context.beginPath();
			this.context.moveTo(l, t);
			this.context.lineTo(r, t);
			this.context.lineTo(r, b);
			this.context.lineTo(l, b);
			this.context.closePath();
			this.context.stroke();
		}

		// Draws selected borders.
		if (this.showBottomBorder)
		{
			this.context.beginPath();
			this.context.moveTo(l, b);
			this.context.lineTo(r, b);
			this.context.closePath();
			this.context.stroke();
		}
		if (this.showTopBorder)
		{
			this.context.beginPath();
			this.context.moveTo(l, t);
			this.context.lineTo(r, t);
			this.context.closePath();
			this.context.stroke();
		}
		if (this.showLeftBorder)
		{
			this.context.beginPath();
			this.context.moveTo(l, t);
			this.context.lineTo(l, b);
			this.context.closePath();
			this.context.stroke();
		}
		if (this.showRightBorder)
		{
			this.context.beginPath();
			this.context.moveTo(r, t);
			this.context.lineTo(r, b);
			this.context.closePath();
			this.context.stroke();
		}
	}
};

/** 
 * Gets the label width for the given text.
 *
 * @method _getLabelWidth
 * @param {String[]} text The text.
 * @param {Number} labelPadding The label padding.
 * @param {Number} The width.
 * @private
 */
ia.ChartBase.prototype._getLabelWidth = function(text, labelPadding) 
{
	var labelWidth = this.context.measureText(text).width + (labelPadding * 2);
	return labelWidth;
};

/** 
 * Gets the maximum label width from a list of labels.
 *
 * @method _getMaxLabelWidth
 * @param {String[]} labels The labels.
 * @param {Number} labelPadding The label padding.
 * @param {Number} The width.
 * @private
 */
ia.ChartBase.prototype._getMaxLabelWidth = function(labels, labelPadding) 
{
	var maxLabelWidth = 0;
	for (var i = 0; i < labels.length; i++)
	{
		var text = labels[i];
		maxLabelWidth = Math.max(maxLabelWidth, this._getLabelWidth(text, labelPadding));
	}
	return maxLabelWidth;
};

/** 
 * Gets the label height for the given text.
 *
 * @method _getLabelHeight
 * @param {String[]} text The text.
 * @param {Number} labelPadding The label padding.
 * @param {Number} lineHeight The text line height.
 * @param {Number} availableSpace The available space for the label.
 * @param {Number} The height.
 * @private
 */
ia.ChartBase.prototype._getLabelHeight = function(text, labelPadding, lineHeight, availableSpace) 
{
	var lineWidth = availableSpace - (labelPadding * 2);
	var noLines = this._getNoLines(text, lineWidth);
	var labelHeight = (noLines * lineHeight) + (labelPadding * 2);
	return labelHeight;
};

/** 
 * Gets the maximum label height from a list of labels.
 *
 * @method _getMaxLabelHeight
 * @param {String[]} labels The labels.
 * @param {Number} labelPadding The label padding.
 * @param {Number} The width.
 * @private
 */
ia.ChartBase.prototype._getMaxLabelHeight = function(labels, labelPadding, lineHeight, availableSpace) 
{
	var maxLabelHeight = 0;
	for (var i = 0; i < labels.length; i++)
	{
		var text = labels[i];
		maxLabelHeight = Math.max(maxLabelHeight, this._getLabelHeight(text, labelPadding, lineHeight, availableSpace));
	}
	return maxLabelHeight;
};

/** 
 * Gets the number of lines a piece of text will take up given the line width.
 *
 * @method _getNoLines
 * @param {String} text The text.
 * @param {Number} lineWidth The line width.
 * @param {Number} The number of lines.
 * @private
 */
ia.ChartBase.prototype._getNoLines = function(text, lineWidth) 
{
	// Split the text.
	var words = text.split(" ");
	var line = "";
	var noLines = 1;

	// Loop through each word and add it to the line if it still
	// fits the line width, otherwise create a new line.
	for(var n = 0; n < words.length; n++) 
	{
		var textLine = line + words[n] + " ";
		var metrics = this.context.measureText(textLine);
		var textWidth = metrics.width;
		if(textWidth > lineWidth) 
		{
			line = words[n] + " ";
			noLines++;
		}
		else 
		{
			line = textLine;
		}
	}
	return noLines;
};

/** 
 * Gets the x-axis labels.
 *
 * @method _getXAxisLabels
 * @param {Number} minValue The min value.
 * @param {Number} maxValue The max value.
 * @param {Number} noLabels The number of labels.
 * @param {Number} axisSize The pixel area reserved for all the labels.
 * @param {Number} labelPadding The label padding.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._getXAxisLabels = function(minValue, maxValue, noLabels, axisSize, labelPadding)
{
	var xLabels;
	if (this.xAxisLabels)
	{
		xLabels = this._dropXLabels(this.xAxisLabels, axisSize, labelPadding);
	}
	else xLabels = this._calculateXAxisLabels(minValue, maxValue, noLabels, axisSize, labelPadding);

	return xLabels;
};

/** 
 * Calculates the x-axis labels. Keeps reducing the number of labels till they dont overlap.
 *
 * @method _calculateXAxisLabels
 * @param {Number} minValue The min value.
 * @param {Number} maxValue The max value.
 * @param {Number} noLabels The number of labels.
 * @param {Number} axisSize The pixel area reserved for all the labels.
 * @param {Number} labelPadding The label padding.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._calculateXAxisLabels = function(minValue, maxValue, noLabels, axisSize, labelPadding)
{
	var o;
	var labelsOverlap = true;
	var labelCount = noLabels;
	
	while(labelsOverlap)
	{
		if (this.useTightLabels)
			o = this._getTightLabels(minValue, maxValue, labelCount);
		else
			o = this._getLooseLabels(minValue, maxValue, labelCount);
			
		var labels = o.labels;
		var values = o.values;
		noLabels = labels.length; // no labels can change when this._getLooseLabels() is called.
		
		if (noLabels < 3) // For cases where no labels drops from above 3 to below 3.
		{
			labels = [this.formatter.format(minValue),this.formatter.format(maxValue)];
			values = [minValue,maxValue]; 
			labelsOverlap = false;
		}
		else if (noLabels == 3) labelsOverlap = false;
		else
		{
			var totalLabelWidth = 0;
			for (var i = 0; i < noLabels; i++)
			{
				var label = labels[i];
				var labelWidth = this.context.measureText(label).width + (labelPadding * 2);
				totalLabelWidth = totalLabelWidth + labelWidth;
			}
			if (totalLabelWidth > axisSize)  labelCount--;
			else labelsOverlap = false;
		}
	}

	var bb = this.getBBox();
	bb.setXMin(values[0]);
	bb.setXMax(values[values.length-1]);

	return labels;
};
		
/** 
 * Removes labels from xAxisLabels if they overlap.
 *
 * @method _dropXLabels
 * @param {String[]} labels The labels.
 * @param {Number} axisSize The pixel area reserved for all the labels.
 * @param {Number} labelPadding The label padding.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._dropXLabels = function(labels, axisSize, labelPadding)
{
	// Find the longest word in each label.
	var wordArray = new Array();
	var nLabels = labels.length;
	for (var i = 0; i < nLabels; i++)
	{
		// The label.
		var text = labels[i];

		// Split the text.
		var words = text.split(" ");
		var line = "";

		// Loop through each and find the longest word.
		var nWords = words.length;
		var maxWidth = 0;
		for(var j = 0; j < nWords; j++) 
		{
			var word = words[j];
			var metrics = this.context.measureText(word);
			var wordWidth = metrics.width;
			if(wordWidth > maxWidth) 
			{
				maxWidth = wordWidth;
				wordArray[i] = word;
			}
		}
	}

	// Copy the word array.
	var returnedLabels = wordArray.concat();

	var labelsOverlap = true;
	while(labelsOverlap)
	{
		labelsOverlap = false;

		// Get the number of labels
		var noLabels = 0;
		for (var i = 0; i < returnedLabels.length; i++) 
		{
			var label = returnedLabels[i];
			if (label != '') noLabels++;
		}
		
		if (noLabels <= 2) 
		{
			for (var i = 0; i < wordArray.length; i++) {returnedLabels[i] = '';}
			returnedLabels[0] = wordArray[0];
			returnedLabels[returnedLabels.length-1] = wordArray[wordArray.length-1];
		}
		else
		{
			// Get the available space for each label.
			var availableSpace = (axisSize / noLabels);

			// Check thta each label fits in the space available for it
			for (var i = 0; i < returnedLabels.length; i++) 
			{
				var label = returnedLabels[i];
				if (label != '')
				{
					var labelWidth = this.context.measureText(label).width + (labelPadding * 2);
					if (labelWidth > availableSpace)
					{
						labelsOverlap = true;
						break;
					}
				}
			}

			// Remove every second label if one doesnt fit.
			if (labelsOverlap)
			{
				var index = 0;
				for (var i = 0; i < returnedLabels.length; i++) 
				{
					var label = returnedLabels[i];
					if (label != '')
					{
						if (index%2 == 0) returnedLabels[i] = '';
						index++;
					}
				}
			}
		}
	}

	// Need to substitute back in full labels.
	for (var i = 0; i < wordArray.length; i++)
	{
		var label = labels[i];
		var adjustedLabel = returnedLabels[i];
		if (adjustedLabel != '') returnedLabels[i] = label;
	}

	return returnedLabels;
};

/** 
 * Gets the y-axis labels.
 *
 * @method _getYAxisLabels
 * @param {Number} minValue The min value.
 * @param {Number} maxValue The max value.
 * @param {Number} noLabels The number of labels.
 * @param {Number} axisSize The pixel area reserved for all the labels.
 * @param {Number} labelSize The pixel area reserved for each individual label.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._getYAxisLabels = function(minValue, maxValue, noLabels, axisSize, labelSize)
{
	var yLabels;
	if (this.yAxisLabels) 
	{
		yLabels = this.yAxisLabels.concat();
		yLabels = this._dropYLabels(yLabels, axisSize, labelSize);
	}
	else
	{
		yLabels = this._calculateYAxisLabels(minValue, maxValue, noLabels, axisSize, labelSize).concat();
		yLabels.reverse(); // Reverse y-labels so can draw from top down.
	}

	return yLabels;
};

/** 
 * Calculates the y-axis labels. Keeps reducing the number of labels till they dont overlap.
 *
 * @method _calculateYAxisLabels
 * @param {Number} minValue The min value.
 * @param {Number} maxValue The max value.
 * @param {Number} noLabels The number of labels.
 * @param {Number} axisSize The pixel area reserved for all the labels.
 * @param {Number} labelSize The pixel area reserved for each individual label.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._calculateYAxisLabels = function(minValue, maxValue, noLabels, axisSize, labelSize)
{
	var o;
	var labelsOverlap = true;
	var labelCount = noLabels;

	while(labelsOverlap)
	{
		if (this.useTightLabels)
			o = this._getTightLabels(minValue, maxValue, labelCount);
		else
			o = this._getLooseLabels(minValue, maxValue, labelCount);

		var labels = o.labels;
		var values = o.values;
		noLabels = labels.length; // no labels can change when this._getLooseLabels() is called.

		if (noLabels < 3) // For cases where no labels drops from above 3 to below 3.
		{
			labels = [this.formatter.format(minValue),this.formatter.format(maxValue)];
			values = [minValue,maxValue]; 
			labelsOverlap = false;
		}
		else if (noLabels == 3) labelsOverlap = false;
		else
		{
			// Check the labels dont overlap.	
			var h = axisSize / noLabels;
			if (h < labelSize)  labelCount--;
			else labelsOverlap = false;
		}
	}

	var bb = this.getBBox();
	bb.setYMin(values[0]);
	bb.setYMax(values[values.length-1]);

	return labels;
};

/** 
 * Removes labels from yAxisLabels if they overlap.
 *
 * @method _dropYLabels
 * @param {String[]} labels The labels.
 * @param {Number} axisSize The pixel area reserved for all the labels.
 * @param {Number} labelHeight The label height.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._dropYLabels = function(labels, axisSize, labelHeight)
{
	// Copy the label array.
	var returnedLabels = [];
	for (var i = 0; i < labels.length; i++)
	{
		var label = labels[i];
		returnedLabels[i] = label;
	}
	
	var labelsOverlap = true;
	while(labelsOverlap)
	{
		var count = 0;
		for (var i = 0; i < returnedLabels.length; i++) 
		{
			var label = returnedLabels[i];
			if (label != '') count++;
		}
		
		if (count <= 2) 
		{
			for (var i = 0; i < labels.length; i++) {returnedLabels[i] = "";}
			returnedLabels[0] = labels[0];
			returnedLabels[returnedLabels.length-1] = labels[labels.length-1];
			labelsOverlap = false;
		}
		else
		{
			var totalLabelHeight = 0;
			for (var i = 0; i < returnedLabels.length; i++) 
			{
				var label = returnedLabels[i];
				if (label != '') totalLabelHeight = totalLabelHeight + labelHeight;
			}

			if (totalLabelHeight > axisSize)
			{
				var index = 0;
				for (var i = 0; i < returnedLabels.length; i++) 
				{
					var label = returnedLabels[i];
					if (label != '')
					{
						if (index%2 == 0) returnedLabels[i] = '';
						index++;
					}
				}
			}
			else labelsOverlap = false;	
		}
	}

	return returnedLabels;
};

/** 
 * Returns the given number of equally spaced values along an axis.
 *
 * @method getAxisValues
 * @param {Number} minValue The min value.
 * @param {Number} minValue The max value.
 * @param {Number} noValues The number of values.
 * @return {Number[]} A list of values.
 */
ia.ChartBase.prototype.getAxisValues = function(minValue, maxValue, noValues)
{
	var valueArray = [];
	if (noValues <= 2) valueArray = [minValue, maxValue];
	else
	{
		var w = maxValue - minValue;
		var incr = w / (noValues - 1);
		var v  = minValue;
		for (var i = 0; i < noValues; i++)
		{
			if (i == noValues-1) valueArray[i] = maxValue;
			else valueArray[i] = v;
			v = v + incr
		}
	}
	return valueArray;
};

/** 
 * Gets loose labels. The min and max value may change
 *
 * @method _getLooseLabels
 * @param {Number} minValue The min value.
 * @param {Number} maxValue The max value.
 * @param {Number} noLabels The number of labels.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._getLooseLabels = function(minVal, maxVal, noLabels)
{
	//var range = ia.getNiceNum(maxVal - minVal, false);
	var range = maxVal - minVal;

	// label spacing.
	var d = ia.getNiceNum((range / (noLabels-1)), true); 

	// Graph range min and max.
	var graphMin = Math.floor(minVal / d) * d;
	var graphMax = Math.ceil(maxVal / d) * d;

	// Number of fractional digits to show.
	var nFrac = Math.max(-1 * Math.floor(ia.log10(d)), 0);

	var values = new Array();
	var labels = new Array();
	for (var i = graphMin; i < (graphMax + (0.5 * d)); i+=d) 
	{	
		values[values.length] = ia.round(i, nFrac);
		labels[labels.length] = this.formatter.format(ia.round(i, nFrac));
	}
	return {values:values,labels:labels};
}

/** 
 * Gets tight labels. The min and max value are maintained.
 *
 * @method _getTightLabels
 * @param {Number} minValue The min value.
 * @param {Number} maxValue The max value.
 * @param {Number} noLabels The number of labels.
 * @return {String[]} The list of labels.
 * @private
 */
ia.ChartBase.prototype._getTightLabels = function(minVal, maxVal, noLabels)
{
	var range = maxVal - minVal;
	var incr = range / (noLabels-1);
	var value = parseFloat(minVal);

	var values = new Array();
	values.push(minVal);
	for (var i = 1; i < noLabels-1; i++) 
	{	
		value = value + incr;
		values.push(value);
	}
	values.push(maxVal);

	var labels = new Array();
	var precision = ia.getPrecision(values);
	for (var i = 0; i < noLabels; i++) 
	{	
		labels.push(this.formatter.format(values[i], precision));
	}
	return {values:values,labels:labels};

	/*var labels = this._getLooseLabels(minVal, maxVal, noLabels);
	labels[0] = minVal;
	labels[labels.length-1] = maxVal;
	return labels;*/
};