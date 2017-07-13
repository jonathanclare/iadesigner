/**
 * Bar Chart.
 *
 * @author J Clare
 * @class ia.BarChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.BarChart = function(id)
{
    ia.BarChart.baseConstructor.call(this, id);

    this.limitsColor = "#cccccc"
    this.limitsWidth = 1;
    this.limitsContainer = $j("<div id='limitsContainer' style='display:none' class='ia-chart-limits'>");
    this.container.append(this.limitsContainer);
	this.drawBarsFromZero = false;
};
ia.extend(ia.ChartBase, ia.BarChart);
	
/** 
 * Should bars be drawn from zero.
 * 
 * @property drawBarsFromZero
 * @type Boolean
 * @default false
 */
ia.BarChart.prototype.drawBarsFromZero;

/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.BarChart.prototype.render = function()
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
		this.showXAxisLabels = false;
		this.showYAxisLabels = true;
		this.showXAxisGrid = false;
		this.showYAxisGrid = true;
		this.renderAxes(bb.getXMin(), bb.getXMax(), minValue, maxValue);
	}
	else
	{
		this.showXAxisLabels = true;
		this.showYAxisLabels = false;
		this.showXAxisGrid = true;
		this.showYAxisGrid = false;
		this.renderAxes(minValue, maxValue, bb.getYMin(), bb.getYMax());
	}
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};