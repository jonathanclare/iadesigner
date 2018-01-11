/**
 * Scatter Plot.
 *
 * @author J Clare
 * @class ia.Plot
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.Plot = function(id)
{
	ia.Plot.baseConstructor.call(this, id);
};
ia.extend(ia.ChartBase, ia.Plot);

/** 
 * The min value for the x-axis.
 * 
 * @property fixedMinValueX
 * @type Number
 */
ia.ChartBase.prototype.fixedMinValueX;

/** 
 * The max value for the x-axis.
 * 
 * @property fixedMaxValueX
 * @type Number
 */
ia.ChartBase.prototype.fixedMaxValueX;
	
/** 
 * The min value for the y-axis.
 * 
 * @property fixedMinValueY
 * @type Number
 */
ia.ChartBase.prototype.fixedMinValueY;

/** 
 * The max value for the y-axis.
 * 
 * @property fixedMaxValueY
 * @type Number
 */
ia.ChartBase.prototype.fixedMaxValueY;

/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.Plot.prototype.render = function()
{
	// Clear the canvas.
	this.clear();

	// Update the layers so we can calculate the min and max value for all layers.
	var xMinValue = Infinity;
	var xMaxValue = -Infinity;
	var yMinValue = Infinity;
	var yMaxValue = -Infinity;
	var layers = this.getLayers();

	for (var i = 0; i < layers.length; i++)  
	{
		var layer =  layers[i]
		layer.update();
		xMinValue = Math.min(xMinValue, layer.xMinValue);
		xMaxValue = Math.max(xMaxValue, layer.xMaxValue);
		yMinValue = Math.min(yMinValue, layer.yMinValue);
		yMaxValue = Math.max(yMaxValue, layer.yMaxValue);
	}

	if (this.fixedMinValueX != undefined) xMinValue = this.fixedMinValueX;
	if (this.fixedMaxValueX != undefined) xMaxValue = this.fixedMaxValueX;
	if (this.fixedMinValueY != undefined) yMinValue = this.fixedMinValueY;
	if (this.fixedMaxValueY != undefined) yMaxValue = this.fixedMaxValueY;
	
	// All data values are the same.
	if (xMinValue == xMaxValue)
	{
		if (xMaxValue < 0) xMaxValue = 0;
		else xMinValue = 0;
	}
	if (yMinValue == yMaxValue)
	{
		if (yMaxValue < 0) yMaxValue = 0;
		else yMinValue = 0;
	}
	
	// No data values set.
	if (xMinValue == Infinity || xMaxValue == -Infinity)
	{
		xMinValue = 0;
		xMaxValue = 100;
	}
	if (yMinValue == Infinity || yMaxValue == -Infinity)
	{
		yMinValue = 0;
		yMaxValue = 100;
	}

	// Render the grid first as it adjusts the bbox.
	this.renderAxes(xMinValue, xMaxValue, yMinValue, yMaxValue);
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};