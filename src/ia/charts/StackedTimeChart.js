/**
 * Stacked Time Chart.
 *
 * @author J Clare
 * @class ia.StackedTimeChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.StackedTimeChart = function(id)
{
	ia.StackedTimeChart.baseConstructor.call(this, id);

	this.drawBarsFromZero = false;
};
ia.extend(ia.ChartBase, ia.StackedTimeChart);

/** 
 * Should bars be drawn from zero.
 * 
 * @property drawBarsFromZero
 * @type Boolean
 * @default false
 */
ia.StackedTimeChart.prototype.drawBarsFromZero;

/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.StackedTimeChart.prototype.render = function()
{
	// Clear the canvas.
	this.clear();
	
	// Update the layers so we can calculate the min and max value for all layers.
	var minValue = Infinity;
	var maxValue = -Infinity;
	var layers = this.getLayers();
	
	for (var i = 0; i < layers.length; i++)  
	{
		var layer =  layers[i];
		layer.update();

		// Hack for ecdc so we could switch the line layer on and off (26/12/2015)
		if (layer.getVisible() == true)
		{
			minValue = Math.min(minValue, layer.minValue);
			maxValue = Math.max(maxValue, layer.maxValue);
		}
	}

	// Fudge for when percentage values add just over 100 eg. 100.00000000123
	// which forces max value to go up to 120 which we dont want.
	if (maxValue > 100 && maxValue < 101) maxValue = 100;

	if (this.fixedMinValue != undefined) minValue = this.fixedMinValue;
	if (this.fixedMaxValue != undefined) maxValue = this.fixedMaxValue;

	if (this.drawBarsFromZero)
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
	
	// Render the grid first as it adjusts the bbox.
	var bb = this.getBBox();
	if (this.orientation == "vertical")
	{
		this.showXAxisGrid = false;
		this.showYAxisGrid = true;
		this.centerXAxisLabels = true;
		this.centerYAxisLabels = false;
		this.renderAxes(bb.getXMin(), bb.getXMax(), minValue, maxValue);
	}
	else
	{
		this.showXAxisGrid = true;
		this.showYAxisGrid = false;
		this.centerXAxisLabels = false;
		this.centerYAxisLabels = true;
		this.renderAxes(minValue, maxValue, bb.getYMin(), bb.getYMax());
	}
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};