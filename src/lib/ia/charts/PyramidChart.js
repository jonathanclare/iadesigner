/**
 * Pyramid Chart
 *
 * @author J Clare
 * @class ia.PyramidChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.PyramidChart = function(id)
{
	ia.PyramidChart.baseConstructor.call(this, id);

	this.drawBarsFromZero = false;
	this.isPyramidChart = true;
};
ia.extend(ia.ChartBase, ia.PyramidChart);

/** 
 * Should bars be drawn from zero.
 * 
 * @property drawBarsFromZero
 * @type Boolean
 * @default false
 */
ia.PyramidChart.prototype.drawBarsFromZero;

/** 
 * Indicates to ia.ChartBase that "-" sign should be removed from x-axis numbers.
 * 
 * @property isPyramidChart
 * @type Boolean
 * @default true
 */
ia.PyramidChart.prototype.isPyramidChart;

/**
 * Specifies a geography.
 * 
 * @property geography
 * @type ia.Geography
 */
ia.PyramidChart.prototype.geography;

/** 
 * The date.
 * 
 * @property date
 * @type String
 */
ia.PyramidChart.prototype.date;

/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.PyramidChart.prototype.render = function()
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
		layer.update(this.date);
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

	// Match m/f
	if (Math.abs(minValue) > maxValue) maxValue = Math.abs(minValue);
	else minValue = maxValue * -1;
	
	// Render the grid first as it adjusts the bbox.
	var bb = this.getBBox();
	this.centerYAxisLabels = true;
	this.showXAxisLabels = true;
	this.showXAxisGrid = true;
	this.showYAxisGrid = false;
	this.renderAxes(minValue, maxValue, bb.getYMin(), bb.getYMax());
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};