/** 
 * Factory for creating time controls.
 *
 * @author J Clare
 * @class ia.TimeControlFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.TimeControlFactory = function(config, report, componentGroup)
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

	// Control.
	var timeControl;

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

		timeControl = new ia.TimeControl(config.id, dataGroup, function(isRunning)
		{
			if (report.getComponent("timeSeries"+dataGroup.suffix)) 
				report.getComponent("timeSeries"+dataGroup.suffix).animationMode = isRunning;
			if (report.getComponent("discreteTimeSeries"+dataGroup.suffix)) 
				report.getComponent("discreteTimeSeries"+dataGroup.suffix).animationMode = isRunning;
			if (report.getComponent("stackedTimeSeries"+dataGroup.suffix)) 
				report.getComponent("stackedTimeSeries"+dataGroup.suffix).animationMode = isRunning;
			if (report.getComponent("stackedFeaturesTimeSeries"+dataGroup.suffix)) 
				report.getComponent("stackedFeaturesTimeSeries"+dataGroup.suffix).animationMode = isRunning;
		});
		panel.append(timeControl.container);
		report.addComponent(config.id, timeControl);

		timeControl.dropDates = config.getProperty('dropDates');
		timeControl.setData(dataGroup.indicator);
				
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
	    timeControl.delay = config.getProperty("delay");
	    timeControl.dropDates = config.getProperty('dropDates');

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
		var indicator = dataGroup.indicator;
		if (indicator.date == undefined)
		{
			// Hide.
			timeControl.container.hide();
			panel.text(config.getProperty("notAvailableText"));
		}
		else
		{
			// Show.
			timeControl.container.show();
			panel.text("");
		}

		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};