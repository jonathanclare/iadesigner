/** 
 * Factory for creating stats boxes.
 *
 * @author J Clare
 * @class ia.StatsBoxFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.StatsBoxFactory = function(config, report, componentGroup)
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

	// Stats box.
	var statsbox;

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
				
		statsbox = new ia.Metadata(config.id);
		panel.append(statsbox.container);
		report.addComponent(config.id, statsbox);

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
		var indicator = dataGroup.indicator;
		var dataType = indicator.getDataType(dataGroup.thematic.getDataField());

		if (dataType != ia.Thematic.CATEGORIC)
		{
			var p = config.getProperty("ndecimal");
			if (p == -1)
			{
				var p = indicator.precision || 2;
				if (p == undefined) p = 2;
			}

			// Override report formatting of decimal places.
			var f = report.locale.formatter;
			var stats = dataGroup.thematic.numericClassifier.getCalculator().getStats();
			report.textSubstitution.setVariable("sum"+dataGroup.suffix, f.format(stats.sum, p));
			report.textSubstitution.setVariable("count"+dataGroup.suffix, f.format(stats.count, p));
			report.textSubstitution.setVariable("mean"+dataGroup.suffix, f.format(stats.mean, p));
			report.textSubstitution.setVariable("median"+dataGroup.suffix, f.format(stats.median, p));
			report.textSubstitution.setVariable("minValue"+dataGroup.suffix, f.format(stats.minValue, p));
			report.textSubstitution.setVariable("maxValue"+dataGroup.suffix, f.format(stats.maxValue, p));
			report.textSubstitution.setVariable("range"+dataGroup.suffix, f.format(stats.range, p));
			report.textSubstitution.setVariable("lowerQuartile"+dataGroup.suffix, f.format(stats.lowerQuartile, p));
			report.textSubstitution.setVariable("upperQuartile"+dataGroup.suffix, f.format(stats.upperQuartile, p));
			report.textSubstitution.setVariable("interquartileRange"+dataGroup.suffix, f.format(stats.interquartileRange, p));
			report.textSubstitution.setVariable("variance"+dataGroup.suffix, f.format(stats.variance, p));
			report.textSubstitution.setVariable("standardDeviation"+dataGroup.suffix, f.format(stats.standardDeviation, p));
			report.updateDynamicText(report.textSubstitution);
		}

		var s = report.textSubstitution.formatMessage(config.getProperty("text"));
		statsbox.setHtml(s);

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