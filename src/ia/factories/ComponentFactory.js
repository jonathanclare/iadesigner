/** 
 * A Factory objects for building components.
 *
 * @author J Clare
 * @class ia.ComponentFactory
 * @constructor
 * @param {ia.Config} config The config.
 * @param {ia.Report} report The report.
 * @param {ia.DataGroup[]} dataGroups A list of associated datagroups.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 * @param {ia.InteractionGroup} comparisonInteractionGroup The associated comparison interaction group.
 */
ia.ComponentFactory = function(config, report, componentGroups)
{
	this._config = config;
	this._report = report;
	this._componentGroups = componentGroups;
	this._dataGroups = [];
	this._factories = {};

	// Build the interaction groups.
	for (var i = 0; i < this._componentGroups.length; i++)
	{
		var g = componentGroups[i];
		this.buildInteractionGroups(report, g.dataGroup, g.interactionGroup, g.comparisonInteractionGroup);
		this._dataGroups[i] = g.dataGroup;
	}
};

/** 
 * Updates the component.
 * 
 * @method update
 * @param {String} id The id of the component.
 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
 */
ia.ComponentFactory.prototype.update = function(id, onComponentReady) 
{
	// Hack for legends which use same factory as parent chart.
	id = this._getParentComponentId(id); 

	var factory = this._factories[id];
	if (factory != undefined ) 
	{
		factory.update(function()
		{
			onComponentReady.call(null, id); // Return.
		});
	}
	else onComponentReady.call(null, id); // Return.
};

/** 
 * Renders the component.
 * 
 * @method render
 * @param {String} id The id of the component.
 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
 */
ia.ComponentFactory.prototype.render = function(id, onComponentReady) 
{
	// Hack for legends which use same factory as parent chart.
	id = this._getParentComponentId(id); 

	var factory = this._factories[id];
	if (factory != undefined ) 
	{
		factory.render(function()
		{
			onComponentReady.call(null, id); // Return.
		});
	}
	else onComponentReady.call(null, id); // Return.
};

/** 
 * Registers a new factory class.
 * 
 * @method registerRuntimeFactory
 * @param {String} id The id of the component.
 * @param {Object} objFactory A factory object.
 */
ia.ComponentFactory.registerRuntimeFactory = function(id, objFactory) 
{
	ia.ComponentFactory._runtimeFactories[id] = objFactory;
};
ia.ComponentFactory._runtimeFactories = {};

/** 
 * Builds the component.
 * 
 * @method build
 * @param {String} id The id of the component.
 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
 */
ia.ComponentFactory.prototype.build = function(id, onComponentReady) 
{
	var me = this;
	var component = this._config.getComponent(id);
	if (component)
	{
		var suffix = this._getSuffix(id);
		var type = this._getType(id);

		// Get the correct component group.
		var index = suffix - 1;
		if (suffix == '') index = 0;
		var componentGroup = this._componentGroups[index];

		if (componentGroup != undefined)
		{
			var factory;

			// Components that require single data group.
			if (type == "legend") 							factory = new ia.LegendFactory(component, this._report, componentGroup);
			else if (type == "featureLegend") 				factory = new ia.FeatureLegendFactory(component, this._report, componentGroup);
			else if (type == "areaBreakdownBarChart") 		factory = new ia.AreaBreakdownBarChartFactory(component, this._report, componentGroup);
			else if (type == "areaBreakdownLineChart") 		factory = new ia.AreaBreakdownLineChartFactory(component, this._report, componentGroup);
			else if (type == "areaBreakdownPieChart") 		factory = new ia.AreaBreakdownPieChartFactory(component, this._report, componentGroup);
			else if (type == "barChart") 					factory = new ia.BarChartFactory(component, this._report, componentGroup);
			else if (type == "gridChart") 					factory = new ia.GridChartFactory(component, this._report, componentGroup);
			else if (type == "boxAndWhisker") 				factory = new ia.BoxAndWhiskerFactory(component, this._report, componentGroup);
			else if (type == "timeSeries") 					factory = new ia.TimeSeriesFactory(component, this._report, componentGroup);
			else if (type == "discreteTimeSeries") 			factory = new ia.DiscreteTimeSeriesFactory(component, this._report, componentGroup);
			else if (type == "stackedTimeSeries") 			factory = new ia.StackedTimeSeriesFactory(component, this._report, componentGroup);
			else if (type == "stackedFeaturesTimeSeries") 	factory = new ia.StackedFeaturesFactory(component, this._report, componentGroup);
			else if (type == "stackedBarChart") 			factory = new ia.StackedBarFactory(component, this._report, componentGroup);
			else if (type == "pyramidChart") 				factory = new ia.PyramidChartFactory(component, this._report, componentGroup);
			else if (type == "timeControl") 				factory = new ia.TimeControlFactory(component, this._report, componentGroup);
			else if (type == "featureCard") 				factory = new ia.FeatureCardFactory(component, this._report, componentGroup);
			else if (type == "metadata") 					factory = new ia.MetadataFactory(component, this._report, componentGroup);
			else if (type == "textbox") 					factory = new ia.TextBoxFactory(component, this._report, componentGroup);
			else if (type == "statsbox") 					factory = new ia.StatsBoxFactory(component, this._report, componentGroup);
			else if (type == "advancedPieChart") 			factory = new ia.AdvancedPieChartFactory(component, this._report, componentGroup);
			else if (type == "pieChart") 					factory = new ia.PieChartFactory(component, this._report, componentGroup);
			else if (type == "dataExplorer") 				factory = new ia.DataExplorerFactory(component, this._report, componentGroup);
			else if (type == "geogExplorer") 				factory = new ia.GeogExplorerFactory(component, this._report, componentGroup);
			else if (type == "filterExplorer") 				factory = new ia.FilterExplorerFactory(component, this._report, componentGroup);
			else if (type == "menuBar") 					factory = new ia.MenuBarFactory(component, this._report, componentGroup);
			else if (type == "spineChart") 					factory = new ia.AreaProfileFactory(component, this._report, componentGroup);
			else if (type == "radarChart") 					factory = new ia.RadarFactory(component, this._report, componentGroup);
			else if (type == "map") 						factory = new ia.MapFactory(component, this._report, componentGroup);		
			else if (type == "dimensionsExplorer") 			factory = new ia.DimensionsFactory(component, this._report, componentGroup);					
			// Components that require multiple data groups.
			else if (type == "scatterPlot") 			factory = new ia.ScatterPlotFactory(component, this._report, this._dataGroups, componentGroup.interactionGroup, componentGroup.comparisonInteractionGroup);
			else if (type == "table") 	
			{
				if (this._config.template == ia.DOUBLE_GEOG_REPORT
					|| this._config.template == ia.DOUBLE_BASELAYER_REPORT)		
				{
					var dGroup = this._dataGroups[index];
					factory = new ia.DataTableFactory(component, this._report, [dGroup], componentGroup.interactionGroup, componentGroup.comparisonInteractionGroup);
				}
				else factory = new ia.DataTableFactory(component, this._report, this._dataGroups, componentGroup.interactionGroup, componentGroup.comparisonInteractionGroup);
			}
			else if (type == "comparisonTable") 		
			{
				if (this._config.template == ia.DOUBLE_GEOG_REPORT
					|| this._config.template == ia.DOUBLE_BASELAYER_REPORT)		
				{
					var dGroup = this._dataGroups[index];
					factory = new ia.ComparisonTableFactory(component, this._report, [dGroup], componentGroup.interactionGroup, componentGroup.comparisonInteractionGroup);
				}
				else factory = new ia.ComparisonTableFactory(component, this._report, this._dataGroups, componentGroup.interactionGroup, componentGroup.comparisonInteractionGroup);
			}	
			else if (type && ia.ComponentFactory._runtimeFactories[type]) 
			{
				/*function getReference(string, root) 
				{ 
					root = root || this; 
					return string.split(".").reduce(function(ref, item) {return ref[item] }, root) 
				}
				var ref = getReference(ia.ComponentFactory._runtimeFactories[type]);
				factory = new ref(component, this._report, componentGroup);*/
				factory = new (ia.ComponentFactory._runtimeFactories[type])(component, this._report, componentGroup);
			}

			if (factory != undefined ) 
			{
				this._factories[component.id] = factory; // Add to factories hashtable.

				if (type == "map" && (this._config.template == ia.DOUBLE_BASELAYER_REPORT  // Special case for double base layer templates.
					|| this._config.template == ia.DOUBLE_BASELAYER_REPORT_NEW))
				{
					factory.build(function()
					{
						factory.update(function()
						{
							factory.render(function()
							{
								factory2 = new ia.MapFactory(undefined, me._report, me._componentGroups[1]); // Add second layer.
								factory2.build(function()
								{
									factory2.update(function()
									{
										factory2.render(function()
										{
				 							onComponentReady.call(null, id); // Return.
										});
									});
								});
							});
						});
					});
				}
				else
				{
					factory.build(function()
					{
						factory.update(function()
						{
							factory.render(function()
							{
	 							onComponentReady.call(null, id); // Return.
							});
						});
					});
				}
			}
			else
			{
				// Hack for legends which use same factory as parent chart.
				var parentId = this._getParentComponentId(id); 
				var factory = this._factories[parentId]; // Add to factories hashtable.
				if (factory)
				{
					factory.build(function()
					{
						factory.update(function()
						{
							factory.render(function()
							{
	 							onComponentReady.call(null, id); // Return.
							});
						});
					});
				}
				else onComponentReady.call(null, id); // Return.
			}
		}
		else onComponentReady.call(null, id); // Return.
	}
	else onComponentReady.call(null, id); // Return.
};

/** 
 * Builds all components in the config.
 * 
 * @method buildComponents
 * @param {Function} onComponentsReady Gets called when the build is complete.
 */
ia.ComponentFactory.prototype.buildComponents = function(onComponentsReady) 
{
	var me = this;
	var components = me._config.getComponents();
	var noComponents = components.length;
	var index = 0;

	function onComponentReady(componentId)
	{
		index++;
		if (index == noComponents) onComponentsReady.call(null); 	// Return
		else me.build(components[index].id, onComponentReady); 		// Build next component.

	}
	if (noComponents > 0) me.build(components[0].id, onComponentReady); // Build first component.
	else onComponentsReady.call(null); 
};

/** 
 * Renders all components in the config.
 * 
 * @method renderComponents
 * @param {Function} onComponentsReady Gets called when the build is complete.
 */
ia.ComponentFactory.prototype.renderComponents = function(onComponentsReady) 
{
	var me = this;
	var components = me._config.getComponents();
	var noComponents = components.length;
	var index = 0;

	function onComponentReady(componentId)
	{
		index++;
		if (index == noComponents) onComponentsReady.call(null); 	// Return
		else me.render(components[index].id, onComponentReady); 		// Build next component.

	}
	if (noComponents > 0) me.render(components[0].id, onComponentReady); // Build first component.
	else onComponentsReady.call(null); 
};

/** 
 * Updates all components in the config.
 * 
 * @method updateComponents
 * @param {Function} onComponentsReady Gets called when the build is complete.
 */
ia.ComponentFactory.prototype.updateComponents = function(onComponentsReady) 
{
	var me = this;
	var components = me._config.getComponents();
	var noComponents = components.length;
	var index = 0;

	function onComponentReady(componentId)
	{
		index++;
		if (index == noComponents) onComponentsReady.call(null); 	// Return
		else me.update(components[index].id, onComponentReady); 		// Build next component.

	}
	if (noComponents > 0) me.update(components[0].id, onComponentReady); // Build first component.
	else onComponentsReady.call(null); 
};

/** 
 * Returns the id of the parent component (eg. A legend that relies on a chart to work).
 * 
 * @method _getParentComponentId
 * @param {String} id The id of the component.
 * @return {String} The parent component id.
 * @private
 */
ia.ComponentFactory.prototype._getParentComponentId = function(id) 
{
	var parentId = id; 
	if (id.indexOf('areaBreakdownPieLegend') != -1) parentId = id.replace("areaBreakdownPieLegend", "areaBreakdownPieChart");
	if (id.indexOf('pyramidLegend') != -1) parentId = id.replace("pyramidLegend", "pyramidChart");
	if (id.indexOf('profileLegend') != -1) parentId = id.replace("profileLegend", "spineChart");
	if (id.indexOf('stackedLegend') != -1) 
	{
		if (this._factories["stackedTimeSeries"] != undefined)
			parentId = id.replace("stackedLegend", "stackedTimeSeries");
		else
			parentId = id.replace("stackedLegend", "stackedBarChart");
	}

	return parentId;
};

/** 
 * Extracts the suffix from the component id.
 * 
 * @method _getSuffix
 * @param {String} id The id of the component.
 * @return {String} The suffix.
 * @private
 */
ia.ComponentFactory.prototype._getSuffix = function(id) 
{
	// Extract the suffix from the id.
	var suffix = id.slice(-1);
	if (!ia.isNumber(suffix)) suffix = "";

	// An underscore represents an extra version of a component eg 'barChart_2' or 'barChart2_2'.
	// The first number represents the data group the component is associated with.
	// The second number is simply to make the id unique.
	// This has been added so we can eventually add in multiple versions of components.
	if (id.indexOf("_") != -1)
	{
		suffix = id.slice(-3).charAt(0);
		if (!ia.isNumber(suffix)) suffix = "";
	}

	return suffix;
};

/** 
 * Extracts the type from the component id.
 * 
 * @method _getType
 * @param {String} id The id of the component.
 * @return {String} The type.
 * @private
 */
ia.ComponentFactory.prototype._getType = function(id) 
{
	var type = id;

	// Extract the suffix from the id.
	var suffix = id.slice(-1);
	if (ia.isNumber(suffix)) type = type.substring(0,type.length-1);

	// An underscore represents an extra version of a component eg 'barChart_2' or 'barChart2_2'.
	// The first number represents the data group the component is associated with.
	// The second number is simply to make the id unique.
	// This has been added so we can eventually add in multiple versions of components.
	if (id.indexOf("_") != -1)
	{
		type = id;
		suffix = id.slice(-3).charAt(0);
		if (ia.isNumber(suffix)) type = type.substring(0,type.length-3);
		else type = type.substring(0,type.length-2)
	}

	return type;
};