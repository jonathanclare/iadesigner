/**
 * Time Bar Chart.
 *
 * @author J Clare
 * @class ia.TimeBarChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.TimeBarChart = function(id)
{
	ia.TimeBarChart.baseConstructor.call(this, id);

	this.drawBarsFromZero = false;
};
ia.extend(ia.ChartBase, ia.TimeBarChart);

/** 
 * Should bars be drawn from zero.
 * 
 * @property drawBarsFromZero
 * @type Boolean
 * @default false
 */
ia.TimeBarChart.prototype.drawBarsFromZero;

/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.TimeBarChart.prototype.render = function()
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
		minValue = Math.min(minValue, layer.minValue);
		maxValue = Math.max(maxValue, layer.maxValue);
	}

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