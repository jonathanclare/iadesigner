/** 
 * Factory for creating comparison tables.
 *
 * @author J Clare
 * @class ia.DataTableFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {ia.DataGroup[]} dataGroups The associated data groups.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 * @param {ia.InteractionGroup} comparisonInteractionGroup The associated comparison interaction group.
 */
ia.ComparisonTableFactory = function(config, report, dataGroups, interactionGroup, comparisonInteractionGroup)
{
	var me = this;
	var arrRowOrder = [];

	// Event handlers.
	for (var i = 0; i < dataGroups.length; i++)
	{
		var dataGroup = dataGroups[i];

		// This code executes every time the data groups data has changed.
		dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
		{
			triggerUpdate();
		});

		// This code executes every time the data groups thematic has changed.
		// The thematic will change after any data change so only render
		// here to avoid multiple rendering.
		dataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
		{
			triggerRender();
		});
	}

	// Trigger a table update. Use this to prevent multiple table updates
	// when multiple data groups are updated at the same time.
	var updateTimeout = null;
	function triggerUpdate()
	{
		if (!updateTimeout) 
		{
			updateTimeout = setTimeout(function()
			{
				me.update();
			}, 250);
		}
	};

	// Trigger a table render. Use this to prevent multiple table renders
	// when multiple data groups are updated at the same time.
	var renderTimeout = null;
	function triggerRender()
	{
		if (!renderTimeout) 
		{
			renderTimeout = setTimeout(function()
			{
				me.render();
			}, 250);
		}
	};

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 

	// Panel.
	var panel = report.getWidget(config.id); 
	panel.exportFunction = function(e) 
	{
		var csvString = table.exportData();
		iaExportCSV(csvString, e);
	};   

	// Table.
	var table;

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
				
		// Table.
		table = new ia.ComparisonTable(config.id);
		table.thematic = dataGroups[0].comparisonThematic;
		panel.append(table.container);
		comparisonInteractionGroup.addComponent(table);
		report.addComponent(config.id, table);

		table.addEventListener(ia.ItemEvent.ITEM_CLICK, function (event)
		{
			if (config.getProperty("linkToMap"))
			{
				// Zoom to all selected features - zoom full if selection is cleared.
				var activeMap = report.getComponent("activeMap"+dataGroup.suffix);
				if (activeMap)
				{
					var selectedIds = comparisonInteractionGroup.getSelection();

					// Remove '#' if it exists for db-builder compatibility.
					var arrSelectedIds = selectedIds.map(function(str)
					{ 
						if (str.indexOf('#') == 0) 	return str.substr(1);
						else 						return str;
					});

					if (arrSelectedIds.length > 0) 
						activeMap.zoomToFeatures(arrSelectedIds); 	// Zoom to selected features.
					else 
						activeMap.controller.zoomFull(); 			// Zoom full when selection is cleared.
				}
			}
		});

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{	
		table.highlightColor = report.highlightColor;
		table.selectionColor = report.selectionColor;
		table.showLegendColor = config.getProperty("showLegendColor");
		table.allowUserSorting = config.getProperty("allowUserSorting");

		var colorSchemeId = config.getProperty("colorSchemeId");
		dataGroups[0].comparisonThematic.categoricClassifier.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);
		dataGroups[0].comparisonThematic.commitChanges();

		updateTimeout = null;

		// Check for custom columns.
		config.customColumns = dataGroups[0].indicator.customColumns;

		// Get the column info from the indicators.
		var indicators = [];
		for (var i = 0; i < dataGroups.length; i++) 
		{
			var dataGroup = dataGroups[i];
			indicators[i] = dataGroup.indicator;
		}
		table.columns = config.getColumnsForIndicators(indicators, report.textSubstitution);

		// Update the data.
		table.setData(dataGroups[0].comparisonData);
		for (var i = 1; i < dataGroups.length; i++)  // i = 1,#; Dont need to set first data group.
		{
			var dataGroup = dataGroups[i];
			var index = i + 1;
			table["data"+index] = dataGroup.comparisonData;
		}

		// Comparison data original order (added because order of data gets lost in dataGroup.comparisonData).
		arrRowOrder = [];
    	var comparisonFeatures = dataGroups[0].geography.getComparisonFeatures();
        for (var i = 0; i < comparisonFeatures.length; i++) 
        {
            var feature = comparisonFeatures[i];
            arrRowOrder.push(feature.id);
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
		renderTimeout = null;
		table.render(arrRowOrder);
		
		if (callbackFunction != undefined) 
		{
			if (config.getProperty("sortColumnName") != "") // Only sort on initialization because table handles sorting after that.
				table.sort(config.getProperty("sortColumnName"), config.getProperty("sortDirection"));

			callbackFunction.call(null, config.id);
		}
	};
};
