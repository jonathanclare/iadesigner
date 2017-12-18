/**
 * Time Chart.
 *
 * @author J Clare
 * @class ia.TimeChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.TimeChart = function(id)
{
	ia.TimeChart.baseConstructor.call(this, id);

    this.limitsColor = "#cccccc"
    this.limitsWidth = 1;
    this.limitsContainer = $j("<div id='timeLimitsContainer' style='display:none' class='ia-chart-limits'>");
    this.container.append(this.limitsContainer);
};
ia.extend(ia.ChartBase, ia.TimeChart);
	
/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.TimeChart.prototype.render = function()
{
	// Clear the canvas.
	this.clear();

    // * BUG-FIX FF and IE dont recognize border-color but will pick up borderRightColor which is set to be same as border-color in css. *
    if (this.limitsContainer.css("borderRightColor")) this.limitsColor = ia.Color.toHex(this.limitsContainer.css("borderRightColor"));
    if (this.limitsContainer.css("borderRightWidth"))
    {
        this.limitsWidth = this.limitsContainer.css("borderRightWidth");
        if (this.limitsWidth.indexOf("px") > -1) this.limitsWidth = this.limitsWidth.substring(0, this.limitsWidth.indexOf("px"));
        this.limitsWidth = parseFloat(this.limitsWidth);
    }

	// Update the layers so we can calculate the min and max value for all layers.
	var minValue = Infinity;
	var maxValue = -Infinity;
	var layers = this.getLayers();

	for (var i = 0; i < layers.length; i++)  
	{
		var layer =  layers[i]
		layer.update();
		if (ia.isNumber(layer.minValue))
			minValue = Math.min(minValue, layer.minValue);
		if (ia.isNumber(layer.maxValue))
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
		this.centerXAxisLabels = true;
		this.centerYAxisLabels = false;
		this.showXAxisGrid = false;
		this.showYAxisGrid = true;
		this.renderAxes(bb.getXMin(), bb.getXMax(), minValue, maxValue);
	}
	else
	{
		this.centerXAxisLabels = false;
		this.centerYAxisLabels = true;
		this.showXAxisGrid = true;
		this.showYAxisGrid = false;
		this.renderAxes(minValue, maxValue, bb.getYMin(), bb.getYMax());
	}

	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};