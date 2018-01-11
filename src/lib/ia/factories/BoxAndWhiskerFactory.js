/** 
 * Factory for creating box and whisker charts.
 *
 * @author J Clare
 * @class ia.BoxAndWhiskerFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.BoxAndWhiskerFactory = function(config, report, componentGroup)
{
	ia.BoxAndWhiskerFactory.baseConstructor.call(this, config, report, componentGroup);

	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// This code executes every time the data groups thematic has changed.
	// The thematic will change after any data change so only render
	// here to avoid multiple rendering.
	dataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		me.update();
		me.render();
	});

	// This code executes every time the comparison selection has changed.
	comparisonInteractionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event) 
	{
		me.update();
		me.render();
	});

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
	var comparisonLayer;

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
		chart = new ia.BoxChart(config.id);

		// Layer.
		layer = new ia.BoxLayer();
		layer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};

		// Comparison Layer.
		comparisonLayer = new ia.ComparisonLineLayer();
		comparisonLayer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};

		// Add common chart properties.
		me.buildChart(chart, layer, comparisonLayer);

		// Wait till charts ready before returning.
		chart.addEventListener(ia.Event.MAP_READY, function() 
		{
			if (callbackFunction != undefined) callbackFunction.call(null, config.id);
		});

		panel.append(chart.container); // Append the chart.
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
		me.updateChart(chart, layer, comparisonLayer);

		// layer Settings
		layer.sortDirection = config.getProperty("sortDirection");
		layer.largestObservationField = config.getProperty("largestObservationField");
		layer.upperQuartileField = config.getProperty("upperQuartileField");
		layer.medianField = config.getProperty("medianField");
		layer.lowerQuartileField = config.getProperty("lowerQuartileField");
		layer.smallestObservationField = config.getProperty("smallestObservationField");

		// Set the layer data.
		layer.setData(dataGroup.indicatorData);

		// Set the compoarison layer data.
		comparisonLayer.setData(dataGroup.comparisonData);

		// Render.
		if (config.getProperty("showComparison")) comparisonLayer.selectAll();

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
		var indicator = dataGroup.indicator;
		var dataType = indicator.getDataType(layer.dataField);
		
		if (dataType == ia.Thematic.CATEGORIC || dataType == false) 
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty("notAvailableText"));
		}
		else 
		{
			// Show.
			chart.show();
			panel.text("");
			chart.render();
		}
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.BoxAndWhiskerFactory);