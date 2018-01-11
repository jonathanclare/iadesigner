/** 
 * Factory for creating grid charts.
 *
 * @author J Clare
 * @class ia.GridChartFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.GridChartFactory = function(config, report, componentGroup)
{
	ia.GridChartFactory.baseConstructor.call(this, config, report, componentGroup);

	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;

	// This code executes every time the data groups thematic has changed.
	// The thematic will change after any data change so only render
	// here to avoid multiple rendering.
	dataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		me.update();
		me.render();
	});

	// Panel.
	var panel = report.getWidget(config.id); 
	panel.exportFunction = function(e) 
	{
		if (gridChart.isVisible) 
		{
			iaExportPanelWithChart(panel, chart, false, e);
			//var dataUrl = chart.exportData();
			//iaExportDataUrl(dataUrl, e);
		}
	}; 

	// Grid chart components.
	var gridChart;
	var gridLayer;

	/** 
	 * Builds the component.
	 *
	 * @method build
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.build = function(callbackFunction)
	{
		// Empty panel.
		panel.content.empty();

		// Grid chart.
		gridChart = new ia.GridChart(config.id);

		// Grid layer.
		gridLayer = new ia.GridLayer();
		gridLayer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};

		// Add common chart properties.
		me.buildChart(gridChart, gridLayer);

		// Wait till charts ready before returning.
		gridChart.addEventListener(ia.Event.MAP_READY, function() 
		{
			if (callbackFunction != undefined) callbackFunction.call(null, config.id);
		});

 		// Append the charts.
		panel.append(gridChart.container);
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{	
		// Update common chart properties.
		me.updateChart(gridChart, gridLayer);

		// Set layer data.
		gridLayer.setData(dataGroup.indicatorData);

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	/** 
	 * Renders the component.
	 *
	 * @method render
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.render = function(callbackFunction)
	{
		// Show grid chart.
		gridChart.render();

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.GridChartFactory);