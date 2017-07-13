/** 
 * Factory for creating menu bars.
 *
 * @author J Clare
 * @class ia.MenuBarFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.MenuBarFactory = function(config, report, componentGroup)
{
	var me = this;

	// Panel.
	var panel = report.getWidget(config.id); 

	// Menu Bar;
	var menuBar;

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

		// Menu.
		menuBar = new ia.MenuBar(config.id, config);
		panel.content.empty();
		panel.append(menuBar.container);
		report.addComponent(config.id, menuBar);

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
		menuBar.render(config);
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
