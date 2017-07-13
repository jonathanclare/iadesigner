/**
 * Radar Chart.
 *
 * @author J Clare
 * @class ia.RadarChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.RadarChart = function(id)
{
	ia.RadarChart.baseConstructor.call(this, id);

	this.radarPadding = 60;
	this.radarRadius = 0;
	this.radarCenterX = 0;
	this.radarCenterY = 0;
	this.startAxisFromZero = false;
	this.type = 'radar';
}
ia.extend(ia.ChartBase, ia.RadarChart);
	
/** 
 * Should axis start from zero.
 * 
 * @property startAxisFromZero
 * @type Boolean
 * @default false
 */
ia.RadarChart.prototype.startAxisFromZero;
	
/** 
 * Type of radar chart. 'radar' or 'rose'
 * 
 * @property type
 * @type String
 * @default radar
 */
ia.RadarChart.prototype.type;

/** 
 * Clears and renders the map.
 *
 * @method render
 */
ia.RadarChart.prototype.render = function()
{
	// Clear the canvas.
	this.clear();
	
	// Update the layers so we can calculate the min and max value for all layers.
	var minValue = Infinity;
	var maxValue = -Infinity;
	var layers = this.getLayers();
	
	for (var i = 0; i < layers.length; i++)  
	{
		var layer =  layers[i]
		layer.update();
		minValue = Math.min(minValue, layer.minValue);
		maxValue = Math.max(maxValue, layer.maxValue);
	}
	
	if (this.fixedMinValue != undefined) minValue = this.fixedMinValue;
	if (this.fixedMaxValue != undefined) maxValue = this.fixedMaxValue;

	if (this.startAxisFromZero)
	{
		if (maxValue < 0) maxValue = 0;
		if (minValue > 0) minValue = 0;
	}
	
	// All data values are the same.
	if (minValue == maxValue)
	{
		if (maxValue < 0) maxValue = 0;
		else minValue = 0;
	}
	
	// No data values set.
	if (minValue == Infinity || maxValue == -Infinity)
	{
		minValue = 0;
		maxValue = 100;
	}

	// Prevent min value equalling max value.
	if (minValue == maxValue) 
	{
		var tempValue = minValue;
		minValue = tempValue - 1;
		maxValue = tempValue + 1;
	}
	
	// Render the grid lines.
	this.renderAxes(minValue, maxValue);
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};

/** 
 * Renders the grid and adjusts the bounding box.
 * 
 * @method renderAxes
 * @param {Number} yMin The min value along the y axis.
 * @param {Number} yMax The max value along the y axis.
 */
ia.RadarChart.prototype.renderAxes = function(yMin, yMax)
{
	if (ia.isNumber(yMin) 
		&& ia.isNumber(yMax)
		&& this.canvas.width > 0
		&& this.canvas.height > 0
		&& this.xAxisLabels)
	{
		// Axis variables.	
		var axisFontStyle = "Verdana";
		var axisFontColor = "#AAAAAA";
		var axisFontSize = 10;
		var textLinePadding = 1;
		var labelPadding = 3;

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

		// Reset radar dimensions.
		this.radarRadius = (Math.min(this.canvasWidth,this.canvasHeight) / 2) - this.radarPadding;
		this.radarCenterX = this.canvasWidth / 2;
	    this.radarCenterY = this.canvasHeight / 2;
		
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

		// Calculate the y-axis height.
		var yAxisHeight = this.radarRadius;

		// Get the y labels.
		var yLabels = this._getYAxisLabels(yMin, yMax, yAxisNoLabels, yAxisHeight, singleLineLabelHeight);

		this.context.textAlign = "right";
		this.context.textBaseline = "middle";

		// Vertical axis labels.
		var nLabels = yLabels.length;
		var xText = this.radarCenterX - labelPadding;
		
		var yText;
		var yTextGap;
		var yGridGap;
		var yGrid;

		yTextGap = yAxisHeight / (nLabels - 1);
		yText = this.radarCenterY - this.radarRadius;
		yGridGap = yTextGap;
		yGrid = yText;

		for (var i = 0; i < nLabels; i++)
		{
			// The label.
			var text = yLabels[i];
			this.context.textBaseline = "top";
			this.context.fillText(text, xText, yText);

			// The grid line.
			var y = Math.floor(yGrid);
			var radius = this.radarCenterY - y;

			this.context.beginPath();
				 ia.Shape.drawCircle(this.context, this.radarCenterX, this.radarCenterY, radius*2);
			this.context.stroke();

			yText = yText + yTextGap;
			yGrid = yGrid + yGridGap;
		}

		// Circular axis labels.
		var startAngle = 1.5 * Math.PI;

		var nLabels = this.xAxisLabels.length;
		var segmentSize =  Math.PI * 2 * (1 / nLabels);
		for (var i = 0; i < nLabels; i++)
		{
			var px = this.radarCenterX + this.radarRadius * Math.cos(startAngle);
			var py = this.radarCenterY + this.radarRadius * Math.sin(startAngle);

			// The grid line.
			this.context.beginPath();
				this.context.moveTo(this.radarCenterX, this.radarCenterY);
				this.context.lineTo(px, py);
			this.context.stroke();

			// The label.
			var text = this.xAxisLabels[i];
			var labelWidth = this._getLabelWidth(text, labelPadding);
			var wrapText = false;
			var availableSpace;

			if (this.type == 'rose')
			{
				px = this.radarCenterX + this.radarRadius * Math.cos(startAngle + (segmentSize/2));
				py = this.radarCenterY + this.radarRadius * Math.sin(startAngle + (segmentSize/2));
			}

			if ((px < (this.radarCenterX+2)) 
				&& (px > (this.radarCenterX-2))) 
			{
				this.context.textAlign = "center"; 		// North and South labels.
				availableSpace = this.canvas.width;

				if (py < this.radarCenterY)  	py = py - labelPadding;
				else 							py = py + labelPadding;
			}
			else if (px > this.radarCenterX)
			{
				this.context.textAlign = "left"; 		// Right side labels.
				px = px + labelPadding;
				availableSpace = this.canvas.width - px;
			}
			else 
			{
				this.context.textAlign = "right"; 		// Left side labels.
				px = px - labelPadding;
				availableSpace = px;
			}
				
			if ((py < (this.radarCenterY+2)) && (py > (this.radarCenterY-2))) 
				this.context.textBaseline = "middle"; 	// West and East labels.
			else if (py < this.radarCenterY) 
				this.context.textBaseline = "bottom"; 	// Top half labels.
			else 
				this.context.textBaseline = "top"; 		// Bottom half labels.

			availableSpace = Math.min(availableSpace, this.radarRadius);
			if (labelWidth > availableSpace) 
				this._wrapText(text, px, py, availableSpace, textLineHeight, this.context.textBaseline);
			else
				this.context.fillText(text, px, py);

			startAngle = startAngle + segmentSize;
		}
	}
};