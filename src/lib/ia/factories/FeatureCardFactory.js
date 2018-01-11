/** 
 * Factory for creating feature cards.
 *
 * @author J Clare
 * @class ia.FeatureCardFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.FeatureCardFactory = function(config, report, componentGroup)
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
		me.render();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 

	// Card.
	var card;
	var snippetURL;

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

		// Card.
		card = new ia.FeatureCard(config.id);
		panel.append(card.container);
		interactionGroup.addComponent(card);
		report.addComponent(config.id, card);
				
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
		card.noDataValue = report.config.getProperty("noDataValue");
		if (card.noDataValue == undefined) card.noDataValue = '';
		card.displayMode = config.getProperty("displayMode"); 
		card.dataOrder = config.getProperty("dataOrder"); 
		card.displaySelectedDateOnly = config.getProperty("displaySelectedDateOnly"); 
		card.displayFeatureHeader = config.getProperty("displayFeatureHeader"); 
		card.displayThemeHeader = config.getProperty("displayThemeHeader"); 
		if (config.getProperty("ignoreThemeIds") != undefined) card.ignoreThemeIds = config.getProperty("ignoreThemeIds"); 
		if (config.getProperty("ignoreIndicatorIds") != undefined) card.ignoreIndicatorIds = config.getProperty("ignoreIndicatorIds");  

		card.geography = dataGroup.geography;
		card.indicator = dataGroup.indicator;

		if (snippetURL != config.getProperty("snippet"))
		{
			snippetURL = config.getProperty("snippet")
			card.setSnippet(snippetURL, function()
			{
				if (callbackFunction != undefined) callbackFunction.call(null, config.id);
			})
		}
		else if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	/** 
	 * Renders the component.
	 *
	 * @method render
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.render = function(callbackFunction)
	{
		card.render();

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};