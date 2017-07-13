/** 
 * Factory for creating discrete time series charts.
 *
 * @author J Clare
 * @class ia.DiscreteTimeSeriesFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.DiscreteTimeSeriesFactory = function(config, report, componentGroup)
{
	ia.DiscreteTimeSeriesFactory.baseConstructor.call(this, config, report, componentGroup);

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

		// Layer.
		layer = new ia.TimeBarLayer();
		layer.tipFunction = function(item, childItem)
		{
			var s = ia.timeTipFunction(item, childItem, config.id);
			return s;
		};

		// Comparison Layer.
		comparisonLayer = new ia.ComparisonTimeBarLayer();
		comparisonLayer.thematic = dataGroup.comparisonThematic;
		comparisonLayer.tipFunction = function(item, childItem)
		{
			var s = ia.timeTipFunction(item, childItem, config.id);
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
			
		var theme = dataGroup.theme;
		var indicator = dataGroup.indicator;
		var dataType = indicator.getDataType(layer.dataField);

		// Check its numeric, and that theres at least one date.
		var dates = theme.getIndicatorDates(indicator.id);
		if (dataType != ia.Thematic.CATEGORIC && dates != undefined && dates.length > 0)
		{
		    var dropDates = config.getProperty('dropDates');
		    var keepDates = dates.concat();
		    if (dropDates != undefined && dropDates.length > 0)
		    {
		        keepDates = dates.filter(function (el)
		        {
		            return dropDates.indexOf(el) < 0;
		        });
		    }

			chart.drawBarsFromZero = config.getProperty("drawBarsFromZero");

			// Get the dates for the axis labels.
			if (chart.orientation == 'vertical') 
			{
				chart.xAxisLabels = keepDates;
				chart.yAxisLabels = undefined;
			}
			else 
			{
				chart.xAxisLabels = undefined;
				chart.yAxisLabels = keepDates;
			}

			// Layer settings.
			if (dropDates != undefined && dropDates.length > 0) layer.dropDates = dropDates.concat();
			layer.highlightSelectedDate = config.getProperty('highlightSelectedDate');

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
			// Use the component config color scheme.
			else if (config.getProperty("colorSchemeId")) 		
			{
				layer.colorPalette = report.config.getMapPalette().getColorScheme(config.getProperty("colorSchemeId"));
			}

			// Set the layer data.
			layer.selectedDate = indicator.date;
			layer.setData(dataGroup.themeData);

			// Set the comparison layer data.
			comparisonLayer.selectedDate = indicator.date;
			comparisonLayer.setData(dataGroup.comparisonThemeData);
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
		var theme = dataGroup.theme;
		var indicator = dataGroup.indicator;
		var dataType = indicator.getDataType(layer.dataField);

		// Check its numeric.
		var dates = theme.getIndicatorDates(indicator.id);
		if (dataType != ia.Thematic.CATEGORIC && dates != undefined && dates.length > 0)
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
ia.extend(ia.ChartFactory, ia.DiscreteTimeSeriesFactory);