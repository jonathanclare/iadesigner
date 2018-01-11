/** 
 * Factory for creating text boxes.
 *
 * @author J Clare
 * @class ia.TextBoxFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.TextBoxFactory = function(config, report, componentGroup)
{
	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	// Event handlers.

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
	{
		me.update();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 

	// Text box.
	var textBox;

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
				
		textBox = new ia.TextBox(config.id);
		panel.append(textBox.container);
		report.addComponent(config.id, textbox);

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
		var text = '';

		var propertyKey = config.getProperty("propertyKey");
		if (propertyKey != undefined)
		{
			var indicator = dataGroup.indicator;
			var property = indicator.getProperty(propertyKey);
			if (property != undefined) text = property;
			else text = '';
		}
		else if (config.getProperty("text"))
		{
			text = report.textSubstitution.formatMessage(config.getProperty("text"));
		}
		textBox.setHtml(text);

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