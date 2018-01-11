/**
 * Grid Chart.
 *
 * @author J Clare
 * @class ia.GridChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.GridChart = function(id)
{
	ia.GridChart.baseConstructor.call(this, id);
};
ia.extend(ia.ChartBase, ia.GridChart);
	
/** 
 * Clears and renders the chart.
 *
 * @method render
 */
ia.GridChart.prototype.render = function()
{
	// Clear the canvas.
	this.clear();
	
	// Update the layers so we can calculate the min and max value for all layers.
	var layers = this.getLayers();
	
	for (var i = 0; i < layers.length; i++)  
	{
		var layer =  layers[i];
		layer.update();
	}
	
	var bb = this.getBBox();
	/*this.yAxisLabels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	this.centerXAxisLabels = false;
	this.centerYAxisLabels = true;
	this.showXAxisLabels = false;
	this.showYAxisLabels = true;
	this.showXAxisGrid = false;
	this.showYAxisGrid = false;*/
	this.renderAxes(bb.getXMin(), bb.getXMax(), bb.getYMin(), bb.getYMax());
	
	// Render the layers.
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}
};