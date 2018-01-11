/** 
 * Factory for creating data tables.
 *
 * @author J Clare
 * @class ia.DataTableFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {ia.DataGroup[]} dataGroups The associated data groups.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 * @param {ia.InteractionGroup} comparisonInteractionGroup The associated comparison interaction group.
 */
ia.DataTableFactory = function(config, report, dataGroups, interactionGroup, comparisonInteractionGroup)
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
	panel.exportFunction = function(e) 
	{
		var csvString = table.exportData();
		iaExportCSV(csvString, e);
	};  

	// Table.
	var table;
	var zoomOnSelection;
	
	// Table tools.
	var tableTools;

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
		table = new ia.Table(config.id);
		if (report.url.params["stickToTop"] != undefined) 
		{
			var arr = report.url.params["stickToTop"].toString().split(",");
			table.stickToTop(arr);
		}
		panel.append(table.container);
		interactionGroup.addComponent(table);
		report.addComponent(config.id, table);

		// Center feature on map after selection
		table.addEventListener(ia.ItemEvent.ITEM_CLICK, function (event)
		{
			/*var item = event.item;
			if (item.state == ia.ItemLayer.SELECTED
			|| item.state == ia.ItemLayer.ROLLOVER_SELECTED) 
			{
				var activeMap = report.getComponent("activeMap"+dataGroup.suffix);
				if (activeMap) activeMap.zoomToFeatureWithId(item.id);
			}*/

			if (zoomOnSelection)
			{
				// Zoom to all selected features - zoom full if selection is cleared.
				var activeMap = report.getComponent("activeMap"+dataGroup.suffix);

				// http://bugzilla.geowise.co.uk/show_bug.cgi?id=10053.
				if (report.config.template == ia.BUBBLE_PLOT_REPORT)  activeMap = report.getComponent("activeMap");

				if (activeMap)
				{
					var selectedIds = interactionGroup.getSelection();
					if (selectedIds.length > 0)
						activeMap.zoomToFeatures(selectedIds, [dataGroups[0].mapData.baseLayer]); 	// Zoom to selected features.
					else 
						activeMap.controller.zoomFull(); 											// Zoom full when selection is cleared.
				}
			}
		});

		// Table Tools
		tableTools = new ia.TableTools(dataGroups[0], interactionGroup);
		tableTools.filterFunction = function()
		{
			if (interactionGroup.getSelection().length > 0)
				dataGroups[0].setFilteredFeatures(interactionGroup.getSelection());
			else if (dataGroups[0].getFilteredFeatures().length > 0)
				dataGroups[0].clearFilter();
		}
		tableTools.clearFunction = function()
		{
			interactionGroup.clearSelection();
			
			var activeMap = report.getComponent("activeMap"+dataGroup.suffix);
			if (activeMap) activeMap.controller.zoomFull(); 	// Zoom full when selection is cleared.
		}

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
		updateTimeout = null;

		zoomOnSelection = config.getProperty("zoomOnSelection");
		table.highlightColor = report.highlightColor;
		table.selectionColor = report.selectionColor;
		table.showLegendColor = config.getProperty("showLegendColor");
		table.allowUserSorting = config.getProperty("allowUserSorting");

		if (tableTools)
		{
			tableTools.clearButtonText = config.getProperty("clearButtonText");
			tableTools.filterButtonText = config.getProperty("filterButtonText");

			if ((tableTools.clearButtonText == undefined || tableTools.clearButtonText == '' ) 
				&& (tableTools.filterButtonText == undefined || tableTools.filterButtonText == '' ))
			{
				tableTools.container.remove();
			}
			else
			{
				panel.appendToFooter(tableTools.container);
			}

			tableTools.render();
		}

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
		table.setData(dataGroups[0].indicatorData);
		for (var i = 1; i < dataGroups.length; i++)  // i = 1,#; Dont need to set first data group.
		{
			var dataGroup = dataGroups[i];
			var index = i + 1;
			table["data"+index] = dataGroup.indicatorData;
		}

		// Data original order (added because order of data gets lost in dataGroup.indicatorData).
		arrRowOrder = [];
    	var features = dataGroups[0].geography.getFeatures();
        for (var i = 0; i < features.length; i++) 
        {
            var feature = features[i];
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

		var indicator = dataGroups[0].indicator;
		if (indicator.getProperty('sortColumnName') != undefined) 
		{
			var sortColumnName = indicator.getProperty('sortColumnName');
			var sortDirection = indicator.getProperty('sortDirection') ? indicator.getProperty('sortDirection') : config.getProperty("sortDirection");
			table.sort(sortColumnName, sortDirection);
			if (callbackFunction != undefined) callbackFunction.call(null, config.id);
		}
		else if (callbackFunction != undefined) 
		{
			if (config.getProperty("sortColumnName") != "") // Only sort on initialization because table handles sorting after that.
				table.sort(config.getProperty("sortColumnName"), config.getProperty("sortDirection"));
			callbackFunction.call(null, config.id);
		}
	};
};