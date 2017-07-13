/** 
 * Factory for creating time series charts.
 *
 * @author J Clare
 * @class ia.TimeSeriesFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.TimeSeriesFactory = function(config, report, componentGroup)
{
	ia.TimeSeriesFactory.baseConstructor.call(this, config, report, componentGroup);

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
	var boxLayer;
	var comparisonLayer;
	var dataFields;
	var lineLegend;
	var lineLegendPanel;

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
		// Legend.
		var legendConfig = report.config.getComponent("timeSeriesLineLegend"+dataGroup.suffix);
		if (legendConfig && lineLegend == undefined)
		{
			//lineLegend = new ia.ProfileLegend(legendConfig.id);
			lineLegend = new ia.ProfileLegend(legendConfig.id);
			lineLegendPanel = report.getWidget(legendConfig.id);
			lineLegendPanel.append(lineLegend.container);
			report.addComponent(legendConfig.id, lineLegend);

			lineLegendPanel.exportFunction = function(e) 
			{
		        ia.getDataUrl(lineLegendPanel.content, function(dataUrl)
		        {
					iaExportDataUrl(dataUrl, e);
		        });
			};  
		}

		// Empty panel.
		panel.content.empty();

		// Chart.
		chart = new ia.TimeChart(config.id);
		chart.wrapXAxisLabels = true;

		// Layer.		
		layer = new ia.TimeLayer();
		layer.tipFunction = function(item, childItem)
		{
			var s = ia.timeTipFunction(item, childItem, config.id);
			return s;
		};

		// Box layer.
		if (config.getProperty('showBoxAndWhisker') == true)
		{
			boxLayer = new ia.TimeBoxLayer();
			boxLayer.setVisible(true);
			boxLayer.interactive = true;
			chart.addLayer(boxLayer);
		}

		// Comparison Layer.
		comparisonLayer = new ia.ComparisonTimeLayer();
		comparisonLayer.thematic = dataGroup.comparisonThematic;
		comparisonLayer.tipFunction = function(item, childItem)
		{
			var s = ia.timeTipFunction(item, childItem, config.id);
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

		// Update box layer.		
		if (boxLayer)
		{
			boxLayer.highlightColor = layer.highlightColor;
			boxLayer.selectionColor = layer.selectionColor;
			boxLayer.dataField = layer.dataField;
			boxLayer.matchAxisToSelectedData = layer.matchAxisToSelectedData;
			boxLayer.tip = config.getProperty('boxAndWhiskerTip');
		}

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
			layer.drawLinesThroughMissingValues = config.getProperty('drawLinesThroughMissingValues');
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

			// Include Associate data line (multi-line chart).
			if (config.getProperty('showAssociate') == true)
			{
				updateMultiLineChart()
			}
			else 
			{
				// Switch off multi-line mode.
				layer.dataFields = [];
				comparisonLayer.dataFields = [];
			}

			// Comparison layer settings.
			comparisonLayer.drawLinesThroughMissingValues = config.getProperty('drawLinesThroughMissingValues');

			// Set the layer data.
			layer.selectedDate = indicator.date;
			layer.setData(dataGroup.themeData);
			if (boxLayer) boxLayer.setData(dataGroup.themeData);

			// Set the comparison layer data.
			comparisonLayer.selectedDate = indicator.date;
			comparisonLayer.setData(dataGroup.comparisonThemeData);
		}

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	function updateMultiLineChart()
	{		
		var indicator = dataGroup.indicator;

		var arrIndicators = dataGroup.theme.getIndicators(dataGroup.indicator.id);

		dataFields = [];

		// Line legend (multi-line chart).
		var legendConfig = report.config.getComponent("timeSeriesLineLegend"+dataGroup.suffix);
		if (lineLegend && legendConfig && legendConfig.getProperty("layout")) lineLegend.layout = legendConfig.getProperty("layout");

		/* For coloured lines */
		var categoricClassifier = layer.thematic.categoricClassifier;
		categoricClassifier.colorPalette = report.config.getMapPalette().getColorScheme(config.getProperty("colorSchemeId"));

		// Clear matchColorsToValues - issue found in ecdc work.
		// Associates may change and colours may be stored twice for different
		// legend classes. Clearing out matchColorsToValues fixes this.
		categoricClassifier.colorPalette.matchColorsToValues = new Object();

		var themeData = {};
		var breaks = [];
		/* For coloured lines */

		// Dashed line settings.
		/*layer.dashWidth = config.getProperty('dashWidth');
		layer.gapWidthAsProportionOfDashWidth = config.getProperty('gapWidthAsProportionOfDashWidth');
		layer.dashedLineThicknessAsProportionOfSolidLine = config.getProperty('dashedLineThicknessAsProportionOfSolidLine');*/

		dataFields = [];

		if (layer.dataField != undefined) 
		{
			dataFields[dataFields.length] = layer.dataField; // Include datafield set in config.
			breaks[breaks.length] = "value";
			themeData['value'] = {"value":"value"};
		}

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
						dataFields[dataFields.length] = associate.id;

						/* For coloured lines */
						if (themeData[associate.id] == undefined)
						{
							breaks[breaks.length] = associate.id;
							themeData[associate.id] = {"value":associate.id};
						}
						/* For coloured lines */
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
						if (themeData[associate.id] == undefined)
						{
							dataFields[dataFields.length] = associate.id;

							/* For coloured lines */
							breaks[breaks.length] = associate.id;
							themeData[associate.id] = {"value":associate.id};
							/* For coloured lines */
						}
					}
				}
			}
		}
		layer.dataFields = dataFields;
		comparisonLayer.dataFields = dataFields;

		// Check for specified associate labels.
		var associateLabels = config.getProperty("associateLabels");

		// Match associate labels with names.
		if (associateLabels != undefined)
		{
			var associateHash = {};
			for (var i = 0; i < dataFields.length; i++) 
			{
				if (associateLabels.length > i) associateHash[dataFields[i]] = associateLabels[i];
			}
			layer.associateNames = associateHash;
			comparisonLayer.associateNames = associateHash;

			categoricClassifier.labels = associateLabels;
		}

		/* For coloured lines */
		categoricClassifier.breaks = breaks;
		layer.thematic.setData(themeData);
		layer.thematic.commitChanges();
		/* For coloured lines */


		// Multi-line legend.
		if (lineLegend) 
		{
			var dashWidth = layer.dashWidth;						// The initial dash width.
			var dashIncr = dashWidth / (dataFields.length - 1); 	// (dataFields.length - 1) First line is solid so dont include in calculation.

			// Line color.
			// If in single select mode and feature legend is present use the color of the selected feature.
			// If in multiple select mode and feature legend is present use the highlight color.
			// Otherwise use the selection color.
			var legendColor = layer.selectionColor;
			if (report.config.getComponent('featureLegend'+dataGroup.suffix) || report.config.getComponent('featureLegend'))
			{
				if (interactionGroup.selectionMode == 'single' )
					legendColor = layer.colorPalette.getColorAtIndex(0);
				else 
					legendColor = layer.highlightColor;
			}


			var legendClasses = new Array();
			for (var i = 0; i < dataFields.length; i++) 
			{		
				var legendClass = new ia.CategoricClass(dataFields[i]);
				legendClass.color = legendColor;

				/* For coloured lines */
				var cClass = categoricClassifier.getClass(dataFields[i]);
				if (cClass) legendClass.color = cClass.color;
				legendClass.size = layer.style.lineWidth;
				/* For coloured lines */

				legendClass.symbol = ia.Shape.LINE;


				/*
				commented out for coloured lines implementation
				if (i == 0) legendClass.size = layer.style.lineWidth; // First line is solid
				else
				{
					legendClass.size = layer.style.lineWidth * layer.dashedLineThicknessAsProportionOfSolidLine;
					legendClass.dashWidth = dashWidth;
					legendClass.gapWidth = legendClass.dashWidth * layer.gapWidthAsProportionOfDashWidth;
					dashWidth = dashWidth - dashIncr;
				}
				*/

				legendClass.value = dataFields[i];
				if (associateLabels && associateLabels.length > i) legendClass.setLabel(associateLabels[i]);
				legendClasses[legendClasses.length] = legendClass;
			}
			lineLegend.legendClasses = legendClasses;
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

			if (lineLegend) 
			{
				lineLegendPanel.text("");
				lineLegend.show();
				lineLegend.render();
			}
		}
		else
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty('notAvailableText'));
			if (lineLegend) 
			{
				lineLegend.hide();
				lineLegendPanel.text(config.getProperty("notAvailableText"));
			}
		}
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
ia.extend(ia.ChartFactory, ia.TimeSeriesFactory);