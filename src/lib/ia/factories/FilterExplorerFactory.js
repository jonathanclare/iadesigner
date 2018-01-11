/** 
 * Factory for creating filter explorers.
 *
 * @author J Clare
 * @class ia.FilterExplorerFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.FilterExplorerFactory = function(config, report, componentGroup)
{
	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// Event handlers.

	// This code executes every time a geography has changed.
	dataGroup.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
	{
		me.update();
	});

	// This code executes every time a filter has changed.
	dataGroup.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
	{
		if (dataGroup.getFilteredFeatures().length == 0) explorer.clearSelection();
		if (explorer.hideOnSelection) panel.hide();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 

	// Explorer.
	var explorer;

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

		// Explorer.
		explorer = new ia.DataExplorer(config.id, function(id)
		{
			// id of the form 'filterId~filterValue'
			var arr = id.split("~");
			var filterId = arr[0];
			var filterValue = arr[1];

			// filterType = combined|single
			if (arr.length > 2) // ie. arr[2] = clearFilter.
			{
				if (explorer.filterType == "combined") 	dataGroup.removeFilter(filterId, filterValue);
				else 									dataGroup.clearFilter();
			}
			else 
			{
				if (explorer.filterType == "combined") 	dataGroup.appendFilter(filterId, filterValue);
				else 									dataGroup.setFilter(filterId, filterValue);
			}
		});
		explorer.isFilterExplorer = true;
		panel.append(explorer.container);
		report.addComponent(config.id, explorer);

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
		explorer.closeBranchesOnSelection = config.getProperty("closeBranchesOnSelection");
		explorer.hideOnSelection = config.getProperty("hideOnSelection");

		if (config.getProperty("filterType")) explorer.filterType =  config.getProperty("filterType");

		explorer.data(dataGroup.geography.getFilterTree());
		explorer.build();	

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