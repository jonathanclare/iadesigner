/** 
 * Factory for creating area breakdown bar charts.
 *
 * @author J Clare
 * @class ia.AreaBreakdownBarChartFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.AreaBreakdownBarChartFactory = function(config, report, componentGroup)
{
	ia.AreaBreakdownBarChartFactory.baseConstructor.call(this, config, report, componentGroup);

	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
	{
		me.update();
		me.render();
	});

	// This code executes every time the comparison selection has changed.
	comparisonInteractionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event) 
	{
		comparisonLayer.dataChanged = true;
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
	var barLabels = [];
	var chart;
	var layer;
	var comparisonLayer;

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
		chart = new ia.TimeBarChart(config.id);
		chart.wrapXAxisLabels = true;

		// Layer.		
		layer = new ia.TimeBarLayer();
		layer.tipFunction = function(item, childItem)
		{
			var s = ia.breakdownTipFunction(item, childItem, config.id);
			return s;
		};

		// Comparison Layer.
		comparisonLayer = new ia.ComparisonTimeBarLayer();
		comparisonLayer.thematic = dataGroup.comparisonThematic;
		comparisonLayer.tipFunction = function(item, childItem)
		{
			var s = ia.breakdownTipFunction(item, childItem, config.id);
			return s;
		};

		// Add common chart properties.
		me.buildChart(chart, layer, comparisonLayer);
		layer.interactive = false;

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

		chart.drawBarsFromZero = config.getProperty("drawBarsFromZero");

		if (config.getProperty('matchAxisToSelectedData')) 
			interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, onSelectionChanged, this);
		else 
			interactionGroup.removeListener(this);

		// Color Scheme.
		var colorBarsByCategory = false;
		if (config.getProperty("colorBarsByCategory") != undefined) colorBarsByCategory = config.getProperty("colorBarsByCategory");
		layer.colorBarsByCategory = colorBarsByCategory;
		// Use feature legend colours if its been included in the report.
		if (report.config.getComponent("featureLegend"+dataGroup.suffix) && !colorBarsByCategory)
		{
			var legendConfig = report.config.getComponent("featureLegend"+dataGroup.suffix);
			var colorSchemeId = legendConfig.getProperty("colorSchemeId");
			layer.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);
		}
		// Double plot and baselayer templates use only one feature legend.
		else if (report.config.getComponent("featureLegend") && !colorBarsByCategory)
		{
			var	legendConfig = report.config.getComponent("featureLegend");
			var colorSchemeId = legendConfig.getProperty("colorSchemeId");
			layer.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);
		}
		// Use the component config color scheme.
		else if (config.getProperty("colorSchemeId")) 		
		{
			layer.colorPalette = report.config.getMapPalette().getColorScheme(config.getProperty("colorSchemeId"));
		}

		var theme = dataGroup.theme;
		var indicator = dataGroup.indicator;
		barLabels = [];

		var datasource = config.getProperty("datasource");
		if (datasource == "associate") // Use indicator associates.
		{
			var ignoreAssociateIds = config.getProperty("ignoreAssociateIds");
			var associates = indicator.getAssociates();
			if (ignoreAssociateIds) // Ignore specified associates.
			{
				for (var i = 0; i < associates.length; i++) 
				{
					var associate = associates[i];
					var includeAssociate = true;

					for (var j = 0; j < ignoreAssociateIds.length; j++) 
					{
						if (associate.id == ignoreAssociateIds[j])
						{
							includeAssociate = false;
							break;
						}
					}

					if (includeAssociate && (associate.type != ia.Thematic.CATEGORIC)) 
						barLabels[barLabels.length] = associate.id;
				}
			}
			else // Use all associates
			{
				for (var i = 0; i < associates.length; i++) 
				{
					var associate = associates[i];
					if (associate.type != ia.Thematic.CATEGORIC)
						barLabels[barLabels.length] = associate.id;
				}
			}

			var data = indicator.getAssociateData(barLabels);
			layer.setData(data);

			var comparisonData = indicator.getAssociateComparisonData(barLabels);
			comparisonLayer.setData(comparisonData);

			// Check for specified associate barLabels.
			var associateLabels = config.getProperty("associateLabels");
			if (associateLabels) 
			{
				// Check number of labels isnt greater than number of associates.
				// At this point bar labels contains the associate ids.
				var index = 0;
				for (var i = 0; i < barLabels.length; i++) 
				{
					if (index < associateLabels.length)
					{
						barLabels[i] = associateLabels[index];
						index++;
					}
				}
			}
		}
		else
		{
			if (indicator.date != undefined) // Use indicator with matching dates in theme.
			{
				var data = theme.getDataForDate(indicator.date);
				layer.setData(data);

				var comparisonData = theme.getComparisonDataForDate(indicator.date);
				comparisonLayer.setData(comparisonData);

				var indicators = theme.getIndicators();

				for (var i = 0; i < indicators.length; i++) 
				{
					var ind = indicators[i];
					if ((ind.date == indicator.date) && (ind.type != ia.Thematic.CATEGORIC))
						barLabels[barLabels.length] = ind.name;
				}
			}
			else  // Use all indicators in theme.
			{
				var data = theme.getData();
				layer.setData(data);

				var comparisonData = theme.getComparisonData();
				comparisonLayer.setData(comparisonData);

				var indicators = theme.getIndicators();

				for (var i = 0; i < indicators.length; i++) 
				{
					var ind = indicators[i];
					if (ind.type != ia.Thematic.CATEGORIC)
						barLabels[barLabels.length] = ind.name;
				}
			}
		}

		// Axis labels.
		if (barLabels.length > 0)
		{
			chart.orientation = config.getProperty("orientation");
			if (chart.orientation == "vertical") 
			{
				chart.xAxisLabels = barLabels;
				chart.yAxisLabels = undefined;
			}
			else 
			{
				chart.xAxisLabels = undefined;
				chart.yAxisLabels = barLabels;
			}
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
		if (barLabels.length > 0)
		{
			// Show.
			panel.text("");
			chart.show();
			chart.render();
		}
		else
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty("notAvailableText"));
		}
		if (callbackFunction) 
		{
			callbackFunction.call(null, config.id);
			callbackFunction = undefined;
		}
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.AreaBreakdownBarChartFactory);