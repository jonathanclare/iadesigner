/**
 * Box Chart.
 *
 * @author J Clare
 * @class ia.BoxChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.BoxChart = function(id)
{
	ia.BoxChart.baseConstructor.call(this, id);
};
ia.extend(ia.ChartBase, ia.BoxChart);
	
/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.BoxChart.prototype.render = function()
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
		this.showXAxisLabels = false;
		this.showYAxisLabels = true;
		this.renderAxes(bb.getXMin(), bb.getXMax(), minValue, maxValue);
	}
	else
	{
		this.showXAxisLabels = true;
		this.showYAxisLabels = false;
		this.renderAxes(minValue, maxValue, bb.getYMin(), bb.getYMax());
	}
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};