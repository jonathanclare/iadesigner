/** 
 * Factory for creating charts.
 *
 * @author J Clare
 * @class ia.ChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.ChartFactory = function(config, report, componentGroup)
{
	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

	/** 
	 * Adds common chart properties.
	 *
	 * @method updateChart
	 */
	this.buildChart = function(chart, layer, comparisonLayer)
	{
		chart.formatter = report.locale.formatter;
		report.addComponent(config.id, chart);

		// Layer.		
		if (layer)
		{
			layer.setVisible(true);
			layer.interactive = true;
			chart.addLayer(layer);
			interactionGroup.addComponent(layer);
		}

		// Comparison Layer.	
		if (comparisonLayer)
		{
			comparisonLayer.setVisible(true);
			comparisonLayer.interactive = true;
			chart.addLayer(comparisonLayer);
			comparisonInteractionGroup.addComponent(comparisonLayer);
		}		
	};

	/** 
	 * Updates common chart properties.
	 *
	 * @method updateChart
	 */
	this.updateChart = function(chart, layer, comparisonLayer)
	{
		var indicator = dataGroup.indicator;

		chart.orientation = config.getProperty('orientation');

		// Check for custom fixed values.
		chart.fixedMinValue = indicator.getProperty(config.getProperty('minChartValue'));
		chart.fixedMaxValue = indicator.getProperty(config.getProperty('maxChartValue'));

		if (chart.fixedMinValue != undefined && chart.fixedMaxValue != undefined)
		{
			// Only use tight labels if both are defined.
			chart.useTightLabels = true;
		}
		else
		{
			// If theres no custom values then check the config fixed values.
			if (config.getProperty('useFixedValues'))
			{
				chart.useTightLabels = true;
				chart.fixedMinValue = config.getProperty('fixedMinValue');
				chart.fixedMaxValue = config.getProperty('fixedMaxValue');
			}
			else chart.useTightLabels = config.getProperty('useTightLabels');
		}
		
		// X-axis title.
		var xTitle = config.getProperty('xAxisTitle');
		if (xTitle) chart.xAxisTitle = report.textSubstitution.formatMessage(xTitle);
		else chart.xAxisTitle = undefined;

		// Y-axis title.
		var yTitle = config.getProperty('yAxisTitle');
		if (yTitle) chart.yAxisTitle = report.textSubstitution.formatMessage(yTitle);
		else chart.yAxisTitle = undefined;

		// Layer.		
		if (layer)
		{ 
			layer.highlightColor = report.highlightColor;
			layer.selectionColor = report.selectionColor;
			
			// Time series is special case so we can remove the indicator and just show associates (change done for ecdc 19/01/15)
			if (chart.id.indexOf("timeSeries") != -1) layer.dataField = config.getProperty('data')
			else layer.dataField = config.getProperty('data') || 'value'; // Default to 'value' for charts which dont have the datafield option (eg area breakdown chart)
			layer.tip = config.getProperty('tip');
			if (config.getProperty('matchAxisToSelectedData') != undefined) layer.matchAxisToSelectedData = config.getProperty('matchAxisToSelectedData');
		}

		// Comparison layer.	
		if (comparisonLayer)
		{
			comparisonLayer.highlightColor = report.highlightColor;
			comparisonLayer.selectionColor = report.selectionColor;	
			comparisonLayer.dataField = config.getProperty('data') || 'value';
			comparisonLayer.tip = config.getProperty('tip');
			comparisonLayer.displayAll = config.getProperty("showComparison");
			if (config.getProperty('matchAxisToSelectedData') != undefined) comparisonLayer.matchAxisToSelectedData = config.getProperty('matchAxisToSelectedData');
		}
	};

	/** 
	 * Builds the component.
	 *
	 * @method build
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.build = function(callbackFunction)
	{
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