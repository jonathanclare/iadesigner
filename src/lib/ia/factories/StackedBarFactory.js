/** 
 * Factory for creating stacked bar charts.
 *
 * @author J Clare
 * @class ia.StackedBarFactory
 * @extends ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.StackedBarFactory = function(config, report, componentGroup)
{
	ia.StackedBarFactory.baseConstructor.call(this, config, report, componentGroup);

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
	var dataFields;
	var legend;
	var legendPanel;

	// Called when matching the data axis to the selected features.
	var onSelectionChanged = function()
	{
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
			layer = new ia.StackedBarLayer();
			layer.tipFunction = function(item, childItem)
			{
				var s = ia.timeTipFunction(item, childItem, config.id);
				return s;
			};

			// Add common chart properties.
			me.buildChart(chart, layer);
			layer.interactive = false;

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

		interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, onSelectionChanged, this);

		// Color palette.
		var colorSchemeId = config.getProperty("colorSchemeId");
		var palette = report.config.getMapPalette().getColorScheme(colorSchemeId);

		var indicator = dataGroup.indicator;
		dataFields = [];

		var ignoreAssociateIds = config.getProperty("ignoreAssociateIds");
		if (ignoreAssociateIds) // Ignore specified associates.
		{
			var associates = indicator.getAssociates();

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
				}
			}
		}
		else // Use all associates
		{
			var associates = indicator.getAssociates();

			for (var i = 0; i < associates.length; i++) 
			{
				var associate = associates[i];
				if (associate.type != ia.Thematic.CATEGORIC)
				{
					dataFields[dataFields.length] = associate.id;
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

		// Layer data.
		layer.setData(dataGroup.indicatorData);

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
		if (config.getProperty('matchAxisToSelectedData')) layer.dataChanged = true;

		var selectedIds = interactionGroup.getSelection();
		var featureNames = [];
		for (var i = 0; i < selectedIds.length; i++) 
		{
			var id = selectedIds[i];
			var name =  dataGroup.geography.getFeature(id).name;
			if (featureNames.indexOf(name) == -1) featureNames[featureNames.length] = dataGroup.geography.getFeature(id).name;
		}

		if (featureNames.length == 0) featureNames[0] = '_';

		// Axis labels.
		if (chart.orientation == "vertical") 
		{
			chart.yAxisLabels = undefined;
			chart.xAxisLabels = featureNames;
		}
		else
		{
			chart.yAxisLabels = featureNames;
			chart.xAxisLabels = undefined;
		}

		if (dataFields.length > 0)
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
ia.extend(ia.ChartFactory, ia.StackedBarFactory);