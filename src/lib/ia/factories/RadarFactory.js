/** 
 * Factory for creating radar chart.
 *
 * @author J Clare
 * @class ia.RadarFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.RadarFactory = function(config, report, componentGroup)
{
	ia.RadarFactory.baseConstructor.call(this, config, report, componentGroup);

	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// Event handlers.

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
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
	var comparisonLayer;
	var noIndicators;

	// Called when matching the data axis to the selected features.
	var onSelectionChanged = function()
	{
		layer.dataChanged = true;
		me.render();
	};

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
		chart = new ia.RadarChart(config.id);

		// Layer.
		layer = new ia.RadarLayer();

		// Comparison Layer.
		comparisonLayer = new ia.ComparisonRadarLayer();
		comparisonLayer.thematic = dataGroup.comparisonThematic;

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

		var displayMode = config.getProperty("displayMode"); 
		chart.radarPadding = config.getProperty("radarPadding"); 
		chart.startAxisFromZero = config.getProperty("startAxisFromZero");
		chart.type = config.getProperty("chartType");

		// Circular Axis Labels.
		var chartLabels = config.getProperty("chartLabels"); 
		chart.xAxisLabels = [];
		noIndicators = 0;
		if (displayMode == "All themes") 
		{
			var geog = dataGroup.geography.getIndicatorData(null, dataGroup.indicator.date);
			$j.each(geog.themes, function(tIndex, theme)
			{
				$j.each(theme.indicators, function(iIndex, indicator)
				{
					parseLabel(theme, indicator, chartLabels);
				});
			});
		}
		else if (displayMode == "Selected theme only") 
		{
			var theme = dataGroup.theme.getIndicatorData(null, dataGroup.indicator.date);
			$j.each(theme.indicators, function(iIndex, indicator)
			{
				parseLabel(theme, indicator, chartLabels);
			});
		}

		// Layer settings.
		layer.selectedDate = dataGroup.indicator.date;
		layer.markerSize = config.getProperty("markerSize"); 

		if (config.getProperty('matchAxisToSelectedData')) 
			interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, onSelectionChanged, this);
		else 
			interactionGroup.removeListener(this);

		// Color Scheme.
		// Use feature legend colours if its been included in the report.
		if (report.config.getComponent('featureLegend'+dataGroup.suffix))
		{
			var legendConfig = report.config.getComponent('featureLegend'+dataGroup.suffix);
			var colorSchemeId = legendConfig.getProperty('colorSchemeId');
			layer.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);
		}
		// Double plot and baselayer templates use only one feature legend.
		else if (report.config.getComponent('featureLegend'))
		{
			var	legendConfig = report.config.getComponent('featureLegend');
			var colorSchemeId = legendConfig.getProperty('colorSchemeId');
			layer.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);
		}

		var layerData;
		if (displayMode == "All themes") 
		 	layerData = dataGroup.geography.getFeatureData(null, dataGroup.indicator.date);
		else if (displayMode == "Selected theme only") 
		 	layerData = dataGroup.geography.getFeatureData(null, dataGroup.indicator.date, dataGroup.theme.id);
		layer.setData(layerData);

		// Set the comparison layer data.
		comparisonLayer.selectedDate = dataGroup.indicator.date;
		comparisonLayer.setData(dataGroup.comparisonThemeData);
		comparisonLayer.markerSize = config.getProperty("markerSize"); 

		var comparisonFeatures = dataGroup.geography.getComparisonFeatures();
		if (comparisonFeatures.length > 0)
		{
			var comparisonIds = [];
			for (var m = 0; m < comparisonFeatures.length; m++)
			{
				comparisonIds.push(comparisonFeatures[m].id);
			}

			var comparisonData;
			if (displayMode == "All themes") 
			 	comparisonData = dataGroup.geography.getFeatureData(comparisonIds, dataGroup.indicator.date);
			else if (displayMode == "Selected theme only") 
			 	comparisonData = dataGroup.geography.getFeatureData(comparisonIds, dataGroup.indicator.date, dataGroup.theme.id);
			comparisonLayer.setData(comparisonData);
		}

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	function parseLabel(theme, indicator, chartLabels)
	{
		var dataItem;
		if (layer.dataField == "value") dataItem = indicator;
		else 
		{
			for (var m = 0; m < indicator.features[0].associates.length; m++)
			{
				var associate = indicator.features[0].associates[m];
				if (associate.name == layer.dataField) 
				{
					dataItem = associate;
					break;
				}
			}
		}
		if (dataItem && dataItem.type != 'categoric')
		{
			noIndicators++;
			if (chartLabels == undefined) chart.xAxisLabels.push('');
			else
			{
				var label = chartLabels + '';
				label = label.split("${themeName}").join(theme.name);
				label = label.split("${indicatorName}").join(indicator.name);
				label = label.split("${date}").join(indicator.date);
				chart.xAxisLabels.push(label);
			}
		}
	};

	/** 
	 * Renders the component.
	 *
	 * @method render
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.render = function(callbackFunction)
	{
		if (noIndicators > 2)
		{
			// Show
			panel.text('');
			chart.show();
			chart.render();
		}
		else
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty('notAvailableText'));
		}
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.RadarFactory);