/** 
 * Factory for creating pie charts.
 *
 * @author J Clare
 * @class ia.PieChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.PieChartFactory = function(config, report, componentGroup)
{
	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// Event handlers.

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
	{
		me.update()
		me.render();
	});

	// This code executes every time the data groups thematic has changed.
	// The thematic will change after any data change so only render
	// here to avoid multiple rendering.
	dataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		me.update()
		me.render();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id);  
	panel.exportFunction = function(e) 
	{
		iaExportPanelWithChart(panel, chart, false, e);
		//var dataUrl = chart.exportData();
		//iaExportDataUrl(dataUrl, e);
	};  

	// Chart.
	var chart;
	var layer;

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
				
		// Chart.
		chart = new ia.PieChart(config.id);
		panel.append(chart.container);
		report.addComponent(config.id, chart);

		// Layer.
		layer = new ia.PieLayer();
		layer.thematic = dataGroup.thematic;
		layer.setVisible(true);
		layer.interactive = true;
		chart.addLayer(layer);
		interactionGroup.addComponent(layer);

		// Wait till charts ready before returning.
		chart.addEventListener(ia.Event.MAP_READY, function() 
		{
			if (callbackFunction != undefined) callbackFunction.call(null, config.id);
		});
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{
		layer.highlightColor = report.highlightColor;
		layer.selectionColor = report.selectionColor;
		layer.tip = config.getProperty("tip");

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
		if (dataGroup.thematic.numericClassifier.classificationName == ia.Thematic.CONTINUOUS || dataGroup.thematic.colorField != undefined)
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty("notAvailableText"));
		}
		else
		{
			// Show.
			panel.text("");
			chart.show();
			chart.render();
		}
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};