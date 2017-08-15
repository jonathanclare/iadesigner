/** 
 * Factory for creating stacked time series charts.
 *
 * @author J Clare
 * @class ia.StackedTimeSeriesFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.StackedTimeSeriesFactory = function(config, report, componentGroup)
{
	ia.StackedTimeSeriesFactory.baseConstructor.call(this, config, report, componentGroup);

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
	/*comparisonInteractionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event) 
	{
		me.update();
		me.render();
	});*/

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
	var lineLayer;
	var dataFields;
	var legend;
	var legendPanel;

	// Called when matching the data axis to the selected features.
	var onSelectionChanged = function()
	{
		if (lineLayer) lineLayer.dataChanged = true;
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
		// Legend.
		var legendConfig = report.config.getComponent("stackedLegend"+dataGroup.suffix);
		if (legendConfig && legend == undefined)
		{
			legend = new ia.ProfileLegend(legendConfig.id);
			legendPanel = report.getWidget(legendConfig.id);
			legendPanel.append(legend.container);
			report.addComponent(legendConfig.id, legend);

			legendPanel.exportFunction = function(e) 
			{
				iaExportPanel(legendPanel, e);
		        /*ia.getDataUrl(legendPanel.content, function(dataUrl)
		        {
					iaExportDataUrl(dataUrl, e);
		        });*/
			};  
		}

		// Chart.
		if (chart == undefined)
		{
			// Empty panel.
			panel.content.empty();

			// Chart.
			chart = new ia.StackedTimeChart(config.id);
			chart.drawBarsFromZero = true;
			chart.wrapXAxisLabels = true;

			// Layer.
			layer = new ia.StackedTimeLayer();
			layer.tipFunction = function(item, childItem)
			{
				var s = ia.timeTipFunction(item, childItem, config.id);
				return s;
			};

			// Line Layer (implemented for ECDC 10/02/2015).
			if (config.getProperty("lineData") != undefined)
			{
				lineLayer = new ia.TimeLayer();
				lineLayer.thematic = dataGroup.comparisonThematic;
			}

			// Add common chart properties.
			me.buildChart(chart, layer);

			layer.interactive = false;

			// Line Layer.
			if (lineLayer)
			{
				lineLayer.setVisible(true);
				lineLayer.interactive = true;
				chart.addLayer(lineLayer);
				interactionGroup.addComponent(lineLayer);
			}		

			// Wait till charts ready before returning.
			chart.addEventListener(ia.Event.MAP_READY, function() 
			{
				if (callbackFunction != undefined) callbackFunction.call(null, config.id);
			});

			panel.append(chart.container); // Append the chart.
		}
		else if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{
		// Legend.
		var legendConfig = report.config.getComponent("stackedLegend"+dataGroup.suffix);
		if (legend && legendConfig && legendConfig.getProperty("layout")) legend.layout = legendConfig.getProperty("layout");

		// Update common chart properties.
		me.updateChart(chart, layer);

		// Line Layer.	
		if (lineLayer)
		{
			lineLayer.highlightColor = report.highlightColor;
			lineLayer.selectionColor = report.selectionColor;	
			lineLayer.dataField = config.getProperty("lineData");
			lineLayer.tip = '${name} (${date}): ${value}';
			if (config.getProperty('matchAxisToSelectedData') != undefined) lineLayer.matchAxisToSelectedData = config.getProperty('matchAxisToSelectedData');

			// Color Scheme.
			// Use feature legend colours if its been included in the report.
			if (report.config.getComponent('featureLegend'+dataGroup.suffix))
			{
				var legendConfig = report.config.getComponent('featureLegend'+dataGroup.suffix);
				var colorSchemeId = legendConfig.getProperty('colorSchemeId');
				lineLayer.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);
			}
		}

		if (config.getProperty("highlightSelectedDate") != undefined) layer.highlightSelectedDate = config.getProperty("highlightSelectedDate");

		if (config.getProperty('matchAxisToSelectedData')) 
			interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, onSelectionChanged, this);
		else 
			interactionGroup.removeListener(this);

		// Color palette.
		var colorSchemeId = config.getProperty("colorSchemeId");
		var palette = report.config.getMapPalette().getColorScheme(colorSchemeId);

		var theme = dataGroup.theme;
		var indicator = dataGroup.indicator;
		var arrIndicators = dataGroup.theme.getIndicators(dataGroup.indicator.id);
		dataFields = [];

		var ignoreAssociateIds = config.getProperty("ignoreAssociateIds");
		if (ignoreAssociateIds) // Ignore specified associates.
		{
			for (var k = 0; k < arrIndicators.length; k++) 
			{
				var associates = arrIndicators[k].getAssociates();

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
					{
						if (dataFields.indexOf(associate.id) == -1)
						{
							dataFields[dataFields.length] = associate.id;
						}
					}
				}
			}
		}
		else // Use all associates
		{
			for (var k = 0; k < arrIndicators.length; k++) 
			{

				var associates = arrIndicators[k].getAssociates();
				for (var i = 0; i < associates.length; i++) 
				{
					var associate = associates[i];
					if (associate.type != ia.Thematic.CATEGORIC)
					{
						if (dataFields.indexOf(associate.id) == -1)
						{
							dataFields[dataFields.length] = associate.id;
						}
					}
				}
			}
		}
		layer.dataFields = dataFields;

		// Check for specified associate labels.
		var associateLabels = config.getProperty("associateLabels");

		var legendClasses = new Array();
		for (var i = 0; i < dataFields.length; i++) 
		{		
			var legendClass = new ia.CategoricClass(dataFields[i]);
			legendClass.color = palette.getColorAtIndex(i);
			legendClass.symbol = ia.Shape.SQUARE;
			legendClass.size = 10;
			legendClass.value = dataFields[i];
			if (associateLabels && associateLabels.length > i) legendClass.setLabel(associateLabels[i]);
			legendClasses[legendClasses.length] = legendClass;
		}
		layer.legendClasses = legendClasses;

		// Associated legend created in above code.
		if (legend) legend.legendClasses = legendClasses;

		// Axis labels.
		var dates = theme.getIndicatorDates(indicator.id);
		if (dates != undefined && dates.length > 0)
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

		    if (chart.orientation == "vertical")
		    {
		        chart.yAxisLabels = undefined;
		        chart.xAxisLabels = keepDates;
		    }
		    else
		    {
		        chart.yAxisLabels = keepDates;
		        chart.xAxisLabels = undefined;
		    }

		    // Layer data.
		    if (dropDates != undefined && dropDates.length > 0) layer.dropDates = dropDates.concat();
		}

		layer.selectedDate = indicator.date;
		layer.setData(dataGroup.themeData);

		// Set the line layer data.
		if (lineLayer)
		{
			lineLayer.selectedDate = indicator.date;
			lineLayer.setData(dataGroup.themeData);
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
		if (dataGroup.indicator.date != undefined && dataFields.length > 0)
		{
			// Show.
			panel.text("");
			chart.show();
			chart.render();
			if (legend) 
			{
				legendPanel.text("");
				legend.show();
				legend.render();
			}
		}
		else
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty("notAvailableText"));
			if (legend) 
			{
				legend.hide();
				legendPanel.text(config.getProperty("notAvailableText"));
			}
		}
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.StackedTimeSeriesFactory);