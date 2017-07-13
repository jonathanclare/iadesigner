/**
 * Pie Chart.
 *
 * @author J Clare
 * @class ia.PieChart
 * @extends ia.ChartBase
 * @constructor
 * @param {String} id The id of the chart.
 */
ia.PieChart = function(id)
{
	ia.PieChart.baseConstructor.call(this, id);
}
ia.extend(ia.ChartBase, ia.PieChart);
	
/** 
 * Clears and renders the map.
 *
 * @method render
 */
ia.PieChart.prototype.render = function()
{
	// Clear the canvas.
	this.clear();
	
	// Update and render the layers.
	var layers = this.getLayers();
	for (var i = 0; i < layers.length; i++)  
	{
		var layer =  layers[i]
		layer.update();
		layer.render();
	}
};