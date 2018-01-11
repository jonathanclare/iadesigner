/** 
 * Factory for creating scatter plots.
 *
 * @author J Clare
 * @class ia.ScatterPlotFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {ia.DataGroup[]} dataGroups The associated data groups.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 * @param {ia.InteractionGroup} comparisonInteractionGroup The associated comparison interaction group.
 */
ia.ScatterPlotFactory = function(config, report, dataGroups, interactionGroup, comparisonInteractionGroup)
{
	var me = this;

	// Event handlers.
	var colorDataGroup;
	var sizeDataGroup;
	var xDataGroup;
	var yDataGroup;
	if (dataGroups.length == 1)
	{
		xDataGroup = dataGroups[0];
		yDataGroup = dataGroups[0];
	}
	else if (dataGroups.length == 2)
	{
		xDataGroup = dataGroups[0];
		yDataGroup = dataGroups[1];
	}
	else if (dataGroups.length == 3)
	{
		colorDataGroup = dataGroups[0];
		xDataGroup = dataGroups[1];
		yDataGroup = dataGroups[2];
	}
	else if (dataGroups.length == 4)
	{
		colorDataGroup = dataGroups[0];
		sizeDataGroup = dataGroups[1];
		xDataGroup = dataGroups[2];
		yDataGroup = dataGroups[3];
	}

	if (colorDataGroup)
	{
		colorDataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
		{
			triggerUpdate();
		});
	}
	if (sizeDataGroup)
	{
		sizeDataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
		{
			triggerUpdate();
		});
	}
	xDataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		triggerUpdate();
	});
	yDataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		triggerUpdate();
	})

	// This code executes every time the comparison selection has changed.
	comparisonInteractionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event) 
	{
		triggerUpdate();
	});

	// Trigger a chart update. Use this to prevent multiple rendering of the chart
	// when multiple data groups are updated at the same time.
	var timeout = null;
	function triggerUpdate()
	{
		clearTimeout(timeout);
		timeout = setTimeout(function()
		{
			me.update();
			me.render();
		}, 250);
	};

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
	var sizeThematic;
	var arrLineLayers;

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
		chart = new ia.Plot(config.id);
		chart.formatter = report.locale.formatter;
		panel.append(chart.container);
		report.addComponent(config.id, chart);

		// Layer.
		layer = new ia.PlotLayer();
		layer.setVisible(true);
		layer.interactive = true;
		layer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};
		chart.addLayer(layer);
		interactionGroup.addComponent(layer);

		// Comparison Layer.
		comparisonLayer = new ia.ComparisonPlotLayer();
		comparisonLayer.setVisible(true);
		comparisonLayer.interactive = true;
		comparisonLayer.tipFunction = function(item)
		{
			var s = ia.tipFunction(item, config.id);
			return s;
		};
		chart.addLayer(comparisonLayer);		
		comparisonInteractionGroup.addComponent(comparisonLayer);

		// Funnel plot.
		arrLineLayers = [];
		for (var i = 1; i < 6; i++) 
		{
			var xField = config.getProperty("line_xfield_"+i);
			var yField = config.getProperty("line_yfield_"+i);
			if (xField != undefined && yField != undefined )
			{
				var lineLayer = new ia.LineLayer();
				lineLayer.setVisible(true);
				lineLayer.interactive = true;
				chart.addLayer(lineLayer);
				arrLineLayers.push(lineLayer)
			}
		}

		// Size thematic for single variable reports.
		if (config.getProperty("sizeData") != undefined)
		{
			sizeThematic = new ia.Thematic();
			sizeThematic.setDataField(config.getProperty("sizeData"));
			sizeThematic.numericClassifier.classificationName = ia.Thematic.CONTINUOUS;
			var pal = sizeThematic.numericClassifier.sizePalette;
			pal.minSize = config.getProperty("minBubbleSize");
			pal.maxSize = config.getProperty("maxBubbleSize");
			sizeThematic.categoricClassifier.symbolSize = 8;
		}
				
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
		clearTimeout(timeout);
		//timeout = null
		
		layer.highlightColor = report.highlightColor;
		layer.selectionColor = report.selectionColor;
		comparisonLayer.highlightColor = report.highlightColor;
		comparisonLayer.selectionColor = report.selectionColor;	
		for (var i = 0; i < arrLineLayers.length; i++) 
		{
			var index = i+1;

			var l = arrLineLayers[i];
			l.highlightColor = report.highlightColor;
			l.selectionColor = report.selectionColor;
			l.highlightColor = report.highlightColor;
			l.selectionColor = report.selectionColor;
			l.style.strokeStyle = config.getProperty("line_color_"+index);			

			(function() // Execute immediately
			{ 
				var label =  config.getProperty("line_label_"+index)
				l.tipFunction = function(item)
				{
					return label;
				};
			})();
		}

		// Size thematic for single variable reports.
		if (config.getProperty("sizeData") != undefined)
		{
			var pal = sizeThematic.numericClassifier.sizePalette;
			sizeThematic.setDataField(config.getProperty("sizeData"));
			pal.minSize = config.getProperty("minBubbleSize");
			pal.maxSize = config.getProperty("maxBubbleSize");
		}

		layer.pointSize = config.getProperty("minBubbleSize") || config.getProperty("pointSize");
		layer.xDataField = config.getProperty("xData");
		layer.yDataField = config.getProperty("yData");
		layer.showCorrelationLine = config.getProperty("showCorrelationLine");

		comparisonLayer.pointSize = config.getProperty("minBubbleSize") || config.getProperty("pointSize");
		comparisonLayer.xDataField = config.getProperty("xData");
		comparisonLayer.yDataField = config.getProperty("yData");
		comparisonLayer.displayAll = config.getProperty("showComparison");

		var colorIndicator;
		if (colorDataGroup) colorIndicator = colorDataGroup.indicator;
		var sizeIndicator;
		if (sizeDataGroup) sizeIndicator = sizeDataGroup.indicator;
		var xIndicator = xDataGroup.indicator;
		var yIndicator = yDataGroup.indicator;

		// Update size data.
		var sizeData, comparisonSizeData;
		if (sizeDataGroup && config.getProperty("sizeData") != undefined) 
		{
			if (sizeDataGroup.getFilteredFeatures().length > 0) 
				sizeData = sizeIndicator.getData(sizeDataGroup.getFilteredFeatures());
			else 
				sizeData = sizeIndicator.getData();

			comparisonSizeData = sizeIndicator.getComparisonData(); 

			sizeThematic.setData(sizeData);
			sizeThematic.commitChanges();
		}

		var xDataType = xIndicator.getDataType(layer.xDataField);
		var yDataType = yIndicator.getDataType(layer.yDataField);

		if (xDataType == ia.Thematic.CATEGORIC || yDataType == ia.Thematic.CATEGORIC)
		{
			// Hide.
			chart.hide();
			panel.text(config.getProperty("notAvailableText"));
		}
		else
		{
			// Check for custom fixed values.
			chart.fixedMinValueX = xIndicator.getProperty(config.getProperty("minChartValueX"));
			chart.fixedMaxValueX = xIndicator.getProperty(config.getProperty("maxChartValueX"));
			chart.fixedMinValueY = yIndicator.getProperty(config.getProperty("minChartValueY"));
			chart.fixedMaxValueY = yIndicator.getProperty(config.getProperty("maxChartValueY"));

			if (chart.fixedMinValueX != undefined && 
			chart.fixedMaxValueX != undefined && 
			chart.fixedMinValueY != undefined && 
			chart.fixedMaxValueY != undefined)
			{
				chart.useTightLabels = true;
			}
			else
			{
				// If theres no custom values then check for config.xml fixed values.
				if (config.getProperty("useFixedValues"))
				{
					chart.useTightLabels = true;
					chart.fixedMinValueX = config.getProperty("fixedMinValueX");
					chart.fixedMaxValueX = config.getProperty("fixedMaxValueX");
					chart.fixedMinValueY = config.getProperty("fixedMinValueY");
					chart.fixedMaxValueY = config.getProperty("fixedMaxValueY");
				}
				else chart.useTightLabels = config.getProperty("useTightLabels");
			}

			// Axis titles.
			var xTitle = config.getProperty("xAxisTitle");
			if (xTitle) chart.xAxisTitle = report.textSubstitution.formatMessage(xTitle);
			var yTitle = config.getProperty("yAxisTitle");
			if (yTitle) chart.yAxisTitle = report.textSubstitution.formatMessage(yTitle);

			// Show.
			chart.show();
			panel.text("");

			layer.setXData(xDataGroup.indicatorData);
			layer.setYData(yDataGroup.indicatorData);
			if (colorDataGroup) layer.setColorData(colorDataGroup.indicatorData);
			if (sizeData && config.getProperty("sizeData") != undefined) 
			{
				layer.setSizeData(sizeData);

				var pal = sizeThematic.numericClassifier.sizePalette;
				var breaks = sizeThematic.numericClassifier.getBreaks();
				var range = breaks[breaks.length-1] - breaks[0];
				var sourceData = config.getProperty("sizeData");

				comparisonLayer.setSizeData(comparisonSizeData);
				for (var id in comparisonSizeData)
				{
					var cf = comparisonSizeData[id];
					var f = (cf[sourceData] - breaks[0]) / range;
            		if (!ia.isNumber(f)) f = 0;
					cf.symbolSize = pal.getSize(f);
				}
			}

			comparisonLayer.setXData(xDataGroup.comparisonData);
			comparisonLayer.setYData(yDataGroup.comparisonData);
			if (colorDataGroup) comparisonLayer.setColorData(colorDataGroup.comparisonData);

			// Funnel plot.
			var xList = [];
			var yList = [];
			for (var i = 1; i < 6; i++) 
			{
				var xField = config.getProperty("line_xfield_"+i);
				var yField = config.getProperty("line_yfield_"+i);
				if (xField != undefined && yField != undefined )
				{
					xList.push(xField);
					yList.push(yField);
				}
			}
			var layers = chart.getLayers();
			for (var i = 0; i < xList.length; i++) 
			{
				var l = layers[i+2]; // Skip 2 bubble layers.

				var xProp = xIndicator.getProperty(xList[i]);
				var yProp = yIndicator.getProperty(yList[i]);
				if (xProp != undefined && yProp != undefined )
				{
					var xValues = xProp.split(",");

					var yValues = new Array();
					if (ia.isNumber(yProp)) // National avg is single values.
					{
						for (var j = 0; j < xValues.length; j++)  {yValues.push(yProp); }
					}
					else // All others are arrays,
					{
						yValues = yProp.split(",");
					}

					l.setXData(xValues);
					l.setYData(yValues);
				}
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
		chart.render();

		// Correlation.
		var xIndicator = xDataGroup.indicator;
		var p = xIndicator.precision || 2;
		var f = report.locale.formatter;
		var cinf = layer.correlationInfo;
		report.textSubstitution.setVariable("correlationCoeff", f.format(cinf.correlationCoeff, p));
		report.textSubstitution.setVariable("rSquare", f.format(cinf.rSquare, p));
		report.textSubstitution.setVariable("gradient", f.format(cinf.gradient, p));
		report.textSubstitution.setVariable("intercept", f.format(cinf.intercept, p));
		report.updateDynamicText(report.textSubstitution);

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};