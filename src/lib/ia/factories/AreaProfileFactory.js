/** 
 * Factory for creating area profiles.
 *
 * @author J Clare
 * @class ia.AreaProfileFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.AreaProfileFactory = function(config, report, componentGroup)
{
	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// Event handlers.

	// This code executes every time a geography has changed.
	var geogChanged = true;
	dataGroup.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
	{
		geogChanged = true;
		profile.geography = dataGroup.geography;
	});

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
	{
		me.update();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 
	var legend;

	// Profile.
	var profile;

	/** 
	 * Builds the component.
	 *
	 * @method build
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.build = function(callbackFunction)
	{
		// Legend.
		var legendConfig = report.config.getComponent("profileLegend"+dataGroup.suffix);
		if (legendConfig && legend == undefined)
		{
			legend = new ia.ProfileLegend(legendConfig.id);
			var legendPanel = report.getWidget(legendConfig.id);
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
		if (profile == undefined)
		{
			// Empty panel.
			panel.content.empty();

			// Profile
			var useMouseClick = config.getProperty("useMouseClick");
			if (useMouseClick == undefined) useMouseClick = true;

			profile = new ia.Profile(config.id, useMouseClick, function(id)
			{
				//if (report.config.template != ia.ELECTION_REPORT) 
				//{
					// id of the form 'indicatorid~date'.
					var dataIds = id.split("~");
					dataGroup.setData(dataGroup.geography.id, dataIds[0], dataIds[1]);
				//}
			});
			profile.geography = dataGroup.geography;

			var featureLegend = report.getComponent("featureLegend");
			if (featureLegend) 
			{
				profile.colorPalette = featureLegend.colorPalette;
			}

			// Comparison data.
			profile.comparisonThematic = dataGroup.comparisonThematic;

			// Formatter.
			profile.formatter = report.locale.formatter;

			panel.append(profile.container);
			interactionGroup.addComponent(profile);
			comparisonInteractionGroup.addComponent(profile);
			report.addComponent(config.id, profile);
					
			if (callbackFunction != undefined) callbackFunction.call(null, config.id);
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
		var legendConfig = report.config.getComponent("profileLegend"+dataGroup.suffix);
		if (legend && legendConfig && legendConfig.getProperty("layout")) legend.layout = legendConfig.getProperty("layout");
		
		var properties = config.getProperties();
		var legendClasses = []; // For profile key.

		// Symbols.
		var symbols = [];
		for (var id in properties) 
		{
			var testId = 'symbol_shape_';
			if (id.indexOf(testId) != -1)
			{
				var index = id.substring(id.lastIndexOf("_")+1, id.length);

				var symbol = new Object();
				symbol.value = config.getProperty("symbol_value_"+index);
				if (symbol.value != undefined)
				{
					symbol.shape = config.getProperty("symbol_shape_"+index);
					symbol.color = config.getProperty("symbol_color_"+index);
					symbol.size = config.getProperty("symbol_size_"+index);
					symbol.label = config.getProperty("symbol_label_"+index);
					symbols[symbols.length] = symbol;

					// For profile key.
					var legendClass = new ia.CategoricClass(symbol.label);
					legendClass.color = symbol.color;
					legendClass.symbol = symbol.shape;
					legendClass.size = symbol.size;
					legendClass.value = symbol.label;
					legendClasses[legendClasses.length] = legendClass;
				}
			}
		}
		profile.symbols = symbols;
		
		// Targets.
		var targets = [];
		for (var id in properties) 
		{
			var testId = 'target_shape_';
			if (id.indexOf(testId) != -1)
			{
				var index = id.substring(id.lastIndexOf("_")+1, id.length);

				var target = new Object();
				target.data = config.getProperty("target_data_"+index);
				if (target.data != undefined)
				{
					target.shape = config.getProperty("target_shape_"+index);
					target.color = config.getProperty("target_color_"+index);
					target.size = config.getProperty("target_size_"+index);
					target.label = config.getProperty("target_label_"+index);
					targets[targets.length] = target;

					// For profile key.
					var legendClass = new ia.CategoricClass(target.label);
					legendClass.color = target.color;
					legendClass.symbol = target.shape;
					legendClass.size = target.size;
					legendClass.value = target.label;
					legendClasses[legendClasses.length] = legendClass;
				}
			}
		}
		profile.targets = targets;

		// Bar.
		var bar = new Object();
		bar.data = config.getProperty("barData");
		bar.color = config.getProperty("barColor") || '#ff00ff'; 
		bar.shape = config.getProperty("barShape"); 
		bar.symbolValue = config.getProperty("symbolValue"); 
		bar.height = config.getProperty("barHeight"); 
		bar.minValue = config.getProperty("minValue"); 
		bar.midValue = config.getProperty("midValue"); 
		bar.maxValue = config.getProperty("maxValue"); 
		bar.breaksData = config.getProperty("breakData");
		bar.breaksFlip = config.getProperty("breakFlipData"); 
		profile.bar = bar;

		profile.displayMode = config.getProperty("displayMode");  
		profile.displayDatesInProfile = config.getProperty("displayDatesInProfile");  
		if (config.getProperty("includeMinMaxColumns") != undefined) profile.includeMinMaxColumns = config.getProperty("includeMinMaxColumns");  

		profile.useMouseClick = config.getProperty("useMouseClick"); 
		
		// Breaks.
		var breaks = [];
		for (var id in properties) 
		{
			var testId = 'break_color_';
			if (id.indexOf(testId) != -1)
			{
				var index = id.substring(id.lastIndexOf("_")+1, id.length);

				var breakObj = new Object();
				breakObj.label = config.getProperty("break_label_"+index);
				if (breakObj.label != undefined)
				{
					breakObj.color = config.getProperty("break_color_"+index);
					breaks[breaks.length] = breakObj;
					
					// For profile key.
					var legendClass = new ia.CategoricClass(breakObj.label);
					legendClass.color = breakObj.color;
					legendClass.symbol = ia.Shape.SQUARE;
					legendClass.size = 10;
					legendClass.value = breakObj.label;
					legendClasses[legendClasses.length] = legendClass;
				}
			}
		}
		profile.breaks = breaks;

		if (legend)
		{
			legend.legendClasses = legendClasses;
			legend.render();
		}

		var indicator = dataGroup.indicator;
		profile.columns = config.getColumnsForIndicator(indicator, report.textSubstitution);
		profile.indicator = indicator;
		profile.render();

		if (geogChanged)
		{
			var expandedThemeIds = config.getProperty("expandedThemeIds");
			if (expandedThemeIds != undefined) profile.expandThemes(expandedThemeIds);
			geogChanged = false;
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
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};
