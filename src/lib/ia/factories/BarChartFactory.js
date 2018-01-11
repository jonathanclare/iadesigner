/** 
 * Factory for creating bar charts.
 *
 * @author J Clare
 * @class ia.BarChartFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.BarChartFactory = function(config, report, componentGroup)
{
	ia.BarChartFactory.baseConstructor.call(this, config, report, componentGroup);

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
		if (barChart.isVisible)
		{
			iaExportPanelWithChart(panel, barChart, false, e);
			//var dataUrl = barChart.exportData();
			//iaExportDataUrl(dataUrl, e);
		}
		else if (countChart.isVisible)
		{
			iaExportPanelWithChart(panel, countChart, false, e);
			//var dataUrl = countChart.exportData();
			//iaExportDataUrl(dataUrl, e);
		}
	};  

	// Bar chart components.
	var barChart;
	var barLayer;
	var comparisonBarLayer;

	// Count chart components.
	var countChart;
	var countLayer;

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

		// Count Chart.
		var countChartId = "countChart"+dataGroup.suffix;
		countChart = new ia.BarChart(countChartId);

		// Count layer.
		countLayer = new ia.CountLayer();
		countLayer.thematic = dataGroup.thematic;

		// Add common chart properties.
		me.buildChart(countChart, countLayer);

		// Bar chart.
		barChart = new ia.BarChart(config.id);

		// Bar layer.
		barLayer = new ia.BarLayer();
		barLayer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};

		// Comparison Layer.
		comparisonBarLayer = new ia.ComparisonLineLayer();
		comparisonBarLayer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};

		// Add common chart properties.
		me.buildChart(barChart, barLayer, comparisonBarLayer);

		// Wait till charts ready before returning.
		var index = 0;
		barChart.addEventListener(ia.Event.MAP_READY, function() 
		{
			if (callbackFunction != undefined) 
			{
				index++;
				if (index == 2) callbackFunction.call(null, config.id);
			}
		});
		countChart.addEventListener(ia.Event.MAP_READY, function() 
		{
			if (callbackFunction != undefined) 
			{
				index++;
				if (index == 2) callbackFunction.call(null, config.id);
			}
		});

 		// Append the charts.
		panel.append(barChart.container);
		panel.append(countChart.container); 
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{
		var indicator = dataGroup.indicator;
		var dataType = indicator.getDataType(config.getProperty('data'));

 		// Count chart.

		// Update common chart properties.
		me.updateChart(countChart, countLayer);

		// Chart settings.
		countChart.drawBarsFromZero = config.getProperty("drawBarsFromZero");

		// Layer settings.
		countLayer.sortDirection = config.getProperty("sortDirection");

		// Bar chart.

		// Update common chart properties.
		me.updateChart(barChart, barLayer, comparisonBarLayer);

		// Chart settings.
		barChart.drawBarsFromZero = config.getProperty("drawBarsFromZero");

		// Layer settings.
		barLayer.errorBarColor = config.getProperty("errorBarColor");
		barLayer.sortDirection = config.getProperty("sortDirection");
		
		if (dataType == ia.Thematic.CATEGORIC) // Count chart.
		{
			// Set layer data.
			countLayer.setData(dataGroup.indicatorData);
		}
		else // Bar chart.
		{ 

			// Set layer data.
			barLayer.setData(dataGroup.indicatorData);

			// Set cmoparison layer data.
			comparisonBarLayer.setData(dataGroup.comparisonData);
		}

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
		var dataType = indicator.getDataType(barLayer.dataField);

		if (dataType == ia.Thematic.CATEGORIC)
		{
			// Hide bar chart.
			barChart.hide();	
			panel.text("");		

			// Show count chart.
			countChart.container.css({visibility: "visible"});
			countChart.show();	
			countChart.render();
		}
		else
		{
			// Hide count chart.
			countChart.hide();
			countChart.container.css({visibility: "hidden"});

			// Show bar chart.
			panel.text("");
			barChart.show();
			barChart.render();
		}

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.BarChartFactory);