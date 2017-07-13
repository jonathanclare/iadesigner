/** 
 * Factory for creating feature legends.
 *
 * @author J Clare
 * @class ia.FeatureLegendFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.FeatureLegendFactory = function(config, report, componentGroup)
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
		me.render();
	});

	// Components.

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

	// Legend.
	var legend;

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
				
		// Legend.
		legend = new ia.FeatureLegend(config.id);
		panel.append(legend.container);
		interactionGroup.addComponent(legend);
		report.addComponent(config.id, legend);

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
		legend.highlightColor = report.highlightColor;
		legend.selectionColor = report.selectionColor;
		
		if (config.getProperty("layout")) legend.layout = config.getProperty("layout");
		var colorSchemeId = config.getProperty("colorSchemeId");
		legend.colorPalette = report.config.getMapPalette().getColorScheme(colorSchemeId);

		legend.geography = dataGroup.geography;
		legend.clearSelection();

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