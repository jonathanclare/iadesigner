/** 
 * Factory for creating geography explorers.
 *
 * @author J Clare
 * @class ia.GeogExplorerFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.GeogExplorerFactory = function(config, report, componentGroup)
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

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
	{
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
		explorer = new ia.DataExplorer(config.id, function(geogId)
		{
			dataGroup.setData(geogId, dataGroup.indicator.id, dataGroup.indicator.date);
		});
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
		explorer.hideOnSelection = config.getProperty("hideOnSelection");

		explorer.data(report.data.getGeographyTree());
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