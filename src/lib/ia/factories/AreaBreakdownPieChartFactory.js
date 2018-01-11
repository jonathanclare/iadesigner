/** 
 * Factory for creating area breakdown pie charts.
 *
 * @author J Clare
 * @class ia.AreaBreakdownPieChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.AreaBreakdownPieChartFactory = function(config, report, componentGroup)
{
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

	// Panel.
	var panel = report.getWidget(config.id); 
	panel.exportFunction = function(e) 
	{
	iaExportPanel(panel, e);
        /*ia.getDataUrl(panel.content, function(dataUrl)
        {
			iaExportDataUrl(dataUrl, e);
        });*/
	};  

	// Chart.
	var breaks = [];
	var chart;
	var legend;
	var legendPanel;

	/** 
	 * Builds the component.
	 *
	 * @method build
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.build = function(callbackFunction)
	{
		// Legend.
		var legendConfig = report.config.getComponent("areaBreakdownPieLegend"+dataGroup.suffix);
		if (legendConfig && legend == undefined)
		{
			// Legend.
			legend = new ia.DiscreteLegend(legendConfig.id);
			legend.container.addClass("ia-profile-legend");
			legend.interactive = false;
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

			chart = new ia.AreaBreakdownPieComponent(config.id, config.getProperty("layout"));
			chart.tip = config.getProperty("tip");
			chart.title1 = config.getProperty("title1");
			chart.title2 = config.getProperty("title2");
			chart.build(function()
			{
				if (callbackFunction != undefined) callbackFunction.call(null, config.id);
			});
			panel.append(chart.container);
			report.addComponent(config.id, chart);
			interactionGroup.addComponent(chart);
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
		var legendConfig = report.config.getComponent("areaBreakdownPieLegend"+dataGroup.suffix);
		if (legend && legendConfig && legendConfig.getProperty("layout")) legend.layout = legendConfig.getProperty("layout");

		chart.highlightColor = report.highlightColor;
		chart.selectionColor = report.selectionColor;
		chart.layout = config.getProperty("layout");
		chart.tip = config.getProperty("tip");
		chart.title1 = config.getProperty("title1");
		chart.title2 = config.getProperty("title2");
		chart.thematic.categoricClassifier.colorPalette = report.config.getMapPalette().getColorScheme(config.getProperty("colorSchemeId"));

		var theme = dataGroup.theme;
		var indicator = dataGroup.indicator;

		breaks = [];
		var pieThemeData = {};

		var datasource = config.getProperty("datasource");
		if (datasource == "associate") // Use indicator associates.
		{
			chart.setData(dataGroup.indicatorData);

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
						breaks[breaks.length] = associate.id;
						pieThemeData[associate.id] = {"value":associate.id};
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
						pieThemeData[associate.id] = {"value":associate.id};
						breaks[breaks.length] = associate.id;
					}
				}
			}

			// Check for specified associate labels.
			var associateLabels = config.getProperty("associateLabels");
			if (associateLabels) chart.thematic.categoricClassifier.labels = associateLabels;
		}
		else
		{
			if (indicator.date != undefined) // Use indicator with matching dates in theme.
			{
				var data = theme.getDataForDate(indicator.date);
				chart.setData(data);
				var indicators = theme.getIndicators();

				for (var i = 0; i < indicators.length; i++) 
				{
					var ind = indicators[i];
					if ((ind.date == indicator.date) && (ind.type != ia.Thematic.CATEGORIC))
					{
						pieThemeData[ind.name] = {"value":ind.name};
						breaks[breaks.length] = ind.name;
					}
				}
			}
			else  // Use all indicators in theme.
			{
				var data = theme.getData();
				chart.setData(data);
				var indicators = theme.getIndicators();

				for (var i = 0; i < indicators.length; i++) 
				{
					var ind = indicators[i];
					if (ind.type != ia.Thematic.CATEGORIC)
					{
						breaks[breaks.length] = ind.name;
						pieThemeData[ind.name] = {"value":ind.name};
					}
				}
			}
		}

		chart.thematic.categoricClassifier.breaks = breaks;
		chart.thematic.setData(pieThemeData);
		chart.thematic.commitChanges();

		if (legend) legend.thematic = chart.thematic;

		chart.build(function() // Needs re-building in case the layout has changed.
		{
			if (callbackFunction != undefined) callbackFunction.call(null, config.id);
		});
	};

	/** 
	 * Renders the component.
	 *
	 * @method render
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.render = function(callbackFunction)
	{
		if (breaks.length > 0)
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