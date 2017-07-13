// Closure to hide setup functions from outside world.
(function()
{
	var report; 			// The report object.
	var onReportComplete; 	// A function to call when the report has completed loading.
	var tipSubstitution; 	// Substitution for tool tip.
	var dataGroups = []; 	// Holds list of ia.DataGroup objects.
	var mapDatas = []; 		// Holds list of ia.MapData objects.
	var factories = []; 	// Holds list of ia.ComponentFactory objects.

	// Data.
	var configSource, configXML, dataSource, dataJSON, mapSource, mapJSON, styleSource, styleText, printBar;

	/** 
	 * Called by the report container to initialize the report.
	 * This code only ever runs once when the report is first loaded.
	 *
	 * @method init
	 * @param {Object} options An object literal.
	 */
	ia.init = function(options, callbackFunction, startParams)
	{
		/***********  Backwards compatibility for 671 ************/

		/** 
		 * Called by report.html to start creating the report.
		 *
		 * @method init
		 * @param {String} id The id of the element to attach the report to - usually an empty div.
		 * @param {Function} callbackFunction Gets called when the report has completed loading
		 * with the report object as a parameter.
		 * @param {String} startParams Equivalent to url params - used by server.
		 */
		/* ia.init = function(id, callbackFunction, startParams) */
		if (callbackFunction != undefined)
		{
			var id = options;

			// Initialise IA Report.
			options = 
			{
				container 	: id,
				onSuccess 	: callbackFunction,
				data:
				{
					config 		: {source:"./config.xml"},
					attribute 	: {source:"./data.js"},
					map 		: {source:"./map.js"}
				}
			};

			if (startParams != undefined) options.params = startParams;
		}

		/*********** End Backwards compatibility for 671 ************/

		// Create a new report - with a config object, container for the report and a callback
		// function to be called when the report has completed loading.
		report = new ia.Report($j('#'+options.container));

		report.startProgress('init', function()
		{ 
			// Report data.
			report.data = new ia.ReportData(); 

			// Substitution for tool tip.
			tipSubstitution = new ia.TextSubstitution();

			// Fix for bug in IE 10 - http://bugzilla.geowise.co.uk/show_bug.cgi?id=8205
			if (BrowserDetect.browser == "Explorer" && BrowserDetect.version == "10") ia.IS_IE_TEN = true;

			// Check the device type.
			if (ia.isTouchDevice()) ia.IS_TOUCH_DEVICE = true;
		
			// IE doesnt work without this.
			// To make cross-domain stuff work.
			// http://stackoverflow.com/questions/5241088/jquery-call-to-webservice-returns-no-transport-error
			$j.support.cors = true;

			// Process the start params.
			processStartParams(options, function()
			{
				// Load the config file.
				loadConfig(function()
				{
					// Check for property parameters.
					for (var param in report.url.params)
					{
						// Property group property parameters.
						if (param.indexOf("prop_") == 0)
						{
							var propName = param.split("_")[1];
							var propValue = report.url.params[param];
							report.config.setProperty(propName, propValue, true);
						}
						// Component property parameters.
						if (param.indexOf("comp_") == 0)
						{
							var componentId = param.split("_")[1];
							var propName = param.split("_")[2];
							var propValue = report.url.params[param];

							var component = report.config.getComponent(componentId)
							if (component != undefined) 
							{
								// Could be a property or an attribute.
								// Set both to be sure.
								component.setProperty(propName, propValue, true);
								component[propName] = propValue;
							}
						}
						// Palette property parameters.
						if (param.indexOf("pal_") == 0)
						{
							var paletteConfig = report.config.getMapPalette();
							var propName = param.split("_")[1];
							var propValue = report.url.params[param];
							paletteConfig[propName] = propValue;
						}
					}

					// Check if any data has been specified or if it is an empty report.
					if (options.data.attribute == undefined)
					{
						report.build(function() 
						{
							onReportReady();
						});
					}
					else
					{
						// Build report widgets.
						report.build(function() 
						{
							// Load the data.
							loadData(function() 
							{
								// Build report components.
								buildComponents(function() 
								{
									// Responsive design.
									updateResponsiveDesign();
									
									onReportReady();
								});
							});
						});
					}
				});
			});
		});
	};

	// Called on completion of initialisation.
	function onReportReady()
	{
		// Add report info.
		addReportInfo();

		// Add menubar components.
		addShareBox();
		addHelp();

		// Add global functions that can be referenced in the config file.
		iaAddGlobalFunctions(report);

		// Check if theres been a selection set by the url params.
		if (report.url.params["select"] != undefined) // select=_00CE,_00CF,_00DA
		{
			var arr = report.url.params["select"].toString().split(",");
			if (report.getComponent("interactionGroup")) 
				report.getComponent("interactionGroup").setSelection(arr);
		}
		if (report.url.params["select2"] != undefined) // select=_00CE,_00CF,_00DA
		{
			var arr = report.url.params["select2"].toString().split(",");
			if (report.getComponent("interactionGroup2")) 
				report.getComponent("interactionGroup2").setSelection(arr);
		}
		if (report.url.params["comparisonSelect"] != undefined) // select=_00CE,_00CF,_00DA
		{
			var arr = report.url.params["comparisonSelect"].toString().split(",");
			if (report.getComponent("comparisonInteractionGroup")) 
				report.getComponent("comparisonInteractionGroup").setSelection(arr);
		}
		if (report.url.params["comparisonSelect2"] != undefined) // select=_00CE,_00CF,_00DA
		{
			var arr = report.url.params["comparisonSelect2"].toString().split(",");
			if (report.getComponent("comparisonInteractionGroup2")) 
				report.getComponent("comparisonInteractionGroup2").setSelection(arr);
		}
		// Check if theres been a filter set by the url params.
		if (report.url.params["filter"] != undefined || report.url.params["filteredFeatures"] != undefined)
		{
			var activeMap = report.getComponent("activeMap")
			if (activeMap) activeMap.zoomToFeatures(dataGroups[0].getFilteredFeatures(), [mapDatas[0].baseLayer]);
		}
		// Check if theres been a filter set by the url params.
		if (report.url.params["filter2"] != undefined || report.url.params["filteredFeatures2"] != undefined)
		{
			var activeMap = report.getComponent("activeMap2")
			if (report.config.template == ia.DOUBLE_BASELAYER_REPORT || report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
			{
				  activeMap = report.getComponent("activeMap")
			}
			if (activeMap) activeMap.zoomToFeatures(dataGroups[1].getFilteredFeatures(), [mapDatas[1].baseLayer]);
		}

		// Opening in print preview mode.
		if (report.url.params["printmode"])
		{
			printBar.loadDragScript();
		}

		// This is used by sample reports when the custom code is in a different location from the atlas.
		if (report.url.params["custom"]) onReportComplete = iaOnReportComplete;

		report.endProgress('init'); // Allow user input.

		// Call any custom code.
		if (onReportComplete) onReportComplete.call(null, report);
	};

	// Update the responsive design after the config has changed
	function updateResponsiveDesign()
	{
		// Responsive design.
		if (report.config.getProperty("isResponsive") != undefined && report.url.params["printmode"] != true)
		{
			var isResponsive 			= report.config.getProperty("isResponsive");
			var flowLayoutMaxWidth 		= report.config.getProperty("flowLayoutMaxWidth");
			var flowLayoutIncludeImages = report.config.getProperty("flowLayoutIncludeImages");
			report.setResponsive(isResponsive, flowLayoutMaxWidth, flowLayoutIncludeImages);
		}
	};

	// Data loading functions.
	function processStartParams(options, callbackFunction)
	{
		if (options.onSuccess) 	onReportComplete = options.onSuccess;
		if (options.onFail) 	ia.File.errorHandler = options.onFail;

		// Set the report params.
		setReportParams(options.params);

		// Location of files.
		if (options.data)
		{
			var config = options.data.config;
			if (config)
			{
				if (config.source) 			configSource = config.source;
				else if (config.xml) 		configXML = config.xml;
			}
			var attribute = options.data.attribute;
			if (attribute)
			{
				if (attribute.source) 		dataSource = attribute.source; 
				else if (attribute.json) 	dataJSON = attribute.json;
			}
			var model = options.data.model;
			if (model)
			{
				report.data.model = model;
			}
			var map = options.data.map;
			if (map)
			{
				if (map.source) 			mapSource = map.source; 
				else if (map.json) 			mapJSON = map.json; 
			}
			var style = options.data.style;
			if (style)
			{
				if (style.source) 			styleSource = style.source; 
				else if (style.text) 		styleText = style.text; 
			}
		}

		// Data path.
		if (report.url.params["dataPath"] != undefined)
		{
			if (dataSource != undefined) 	dataSource = report.url.params["dataPath"] + dataSource;
			if (mapSource != undefined) 	mapSource = report.url.params["dataPath"] + mapSource;
		}

		// Url params can override start param options.
		if (report.url.params["config"] != undefined) 
			configSource = report.url.params["config"] + ".xml";

		if (report.url.params["data"] != undefined)
			dataSource = report.url.params["dataPath"] + report.url.params["data"] + ".js";

		if (report.url.params["map"] != undefined) 
			mapSource = report.url.params["dataPath"] + report.url.params["map"] + ".js";

		ia.log("-----------------------------------");
		ia.log("CONFIG SOURCE : "+configSource);
		ia.log("  DATA SOURCE : "+dataSource);
		ia.log("   MAP SOURCE : "+mapSource);
		ia.log("-----------------------------------");
		ia.log("   CONFIG XML : "+configXML);
		ia.log("    DATA JSON : "+dataJSON);
		ia.log("    MAP JSON  : "+mapJSON);
		ia.log("-----------------------------------");

		if (styleSource) 
			ia.loadCssfile(styleSource, function() {callbackFunction.call(null);});
		else if (styleText) 
			ia.appendCss(styleText, function() {callbackFunction.call(null);});
		else 
			callbackFunction.call(null);
	};
	function loadData(callbackFunction)
	{
		if (dataJSON) 			report.data.parseData(dataJSON, callbackFunction);
		else if (dataSource) 	report.data.loadSource(dataSource, callbackFunction);
		else 					callbackFunction.call(null);
	};
	function loadMapData(mapData, callbackFunction)
	{
		if (mapJSON) 		mapData.parseData(mapJSON, callbackFunction);
		else if (mapSource) mapData.loadSource(mapSource, callbackFunction);
		else 				callbackFunction.call(null);
	};
	function loadConfig(callbackFunction)
	{
		if (configXML) 			report.config.parseXML(configXML, onConfigChange);
		else if (configSource) 	report.config.loadSource(configSource, onConfigChange);
		else 					callbackFunction.call(null);

		function onConfigChange()  
		{
			// Check whether we have a component that requires all the data to be loaded.
			// Update this list in db-config.js function addComponent(widgetId) as well.
			if (report.config.getComponent("featureCard") != undefined
				|| report.config.getComponent("pyramidChart") != undefined
				|| report.config.getComponent("spineChart") != undefined
				|| report.config.getComponent("radarChart") != undefined
				|| report.config.getComponent("featureCard2") != undefined
				|| report.config.getComponent("pyramidChart2") != undefined
				|| report.config.getComponent("spineChart2") != undefined
				|| report.config.getComponent("radarChart2") != undefined)
				report.url.params["loadAllData"] = true;
			else 
				report.url.params["loadAllData"] = false;


			// Check whether we have a component that requires full themes to be loaded to be loaded.
			// Update this list in db-config.js function addComponent(widgetId) as well.
			if (report.data.model != undefined)
			{
				report.data.loadByIndicator = true;
				if (report.config.getComponent("areaBreakdownBarChart") != undefined
					|| report.config.getComponent("areaBreakdownPieChart") != undefined
					|| report.config.getComponent("areaBreakdownBarChart2") != undefined
					|| report.config.getComponent("areaBreakdownPieChart2") != undefined)
				{
					report.data.loadByIndicator = false;
				}
			}
			else report.data.loadByIndicator = false;

			// Report Locale.
			report.locale = new ia.Locale(report.config.getProperty("locale"));
			report.locale.formatter.noDataValue = report.config.getProperty("noDataValue");
			report.data.formatter = report.locale.formatter;

			// These need to be set before the data is loaded otherwise the properties wont be inherited.

			// These properties will be inherited by all indicators.
			var nDecimal = report.config.getProperty("ndecimal");
			if (nDecimal > -1) report.data.precision = nDecimal;
			else report.data.precision = undefined;
			report.data.setProperty(report.config.getProperty("customBreaksKey"), report.config.getProperty("legendBreaks"));
			report.data.setProperty(report.config.getProperty("customLabelsKey"), report.config.getProperty("legendLabels"));
			report.data.setProperty(report.config.getProperty("customBreaksKey2"), report.config.getProperty("legendBreaks2"));
			report.data.setProperty(report.config.getProperty("customLabelsKey2"), report.config.getProperty("legendLabels2"));

			callbackFunction.call(null);
		};
	};

	/**
	 * Builds the report components.
	 *
	 * @method buildComponents
 	 * @param {Function} callbackFunction Called on completion of function.
	 * @private
	 */
	function buildComponents(callbackFunction)  
	{
		dataGroups = [];
		mapDatas = [];

		var selectionMode = report.config.getProperty("selectionMode");

		// First component factory;
		var factory;

		var mapData1 = new ia.MapData(report); // MapData 1.
		mapDatas[mapDatas.length] = mapData1;
		var c = report.config.getComponent("map");
		if (c != undefined) mapData1.tilePath = c.getProperty("backgroundMappingPath");

		loadMapData(mapData1, function()
		{
			var interactionGroup1 = new ia.InteractionGroup();
			if (selectionMode) interactionGroup1.selectionMode = selectionMode;
			var comparisonInteractionGroup1 = new ia.InteractionGroup();

			// First data group.
			var dataGroup1 = new ia.DataGroup(report,"");
			dataGroup1.mapData = mapData1;
			dataGroups[dataGroups.length] = dataGroup1;
			report.addComponent("dataGroup", dataGroup1);
			
			dataGroup1.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
			{
				updateResponsiveDesign()
			});

			// Report evaluation.
			report.template = mapData1.template;
			report.version = mapData1.version;
			report.evaluation = mapData1.baseLayers[0].eval;
			report.uid = mapData1.baseLayers[0].uid;

			dataGroup1.build(function()
			{
				if (report.config.template == ia.SINGLE_MAP_REPORT
				|| report.config.template == ia.PYRAMID_REPORT
				|| report.config.template == ia.SPINE_REPORT
				|| report.config.template == ia.ELECTION_REPORT) 
				{

					var componentGroups = 
					[
						{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
					];

					factory = new ia.ComponentFactory(report.config, report, componentGroups);
					report.addComponent('factory', factory);
					factory.buildComponents(function()
					{
						if (callbackFunction != undefined) callbackFunction.call(null);
					});
				}
				else if (report.config.template == ia.BUBBLE_PLOT_REPORT_SINGLE) 
				{
					var componentGroups = 
					[
						{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
						,{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
						,{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
						,{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
					];

					factory = new ia.ComponentFactory(report.config, report, componentGroups);
					report.addComponent('factory', factory);
					factory.buildComponents(function()
					{
						if (callbackFunction != undefined) callbackFunction.call(null);
					});
				}
				else
				{
					var mapData2 = new ia.MapData(report); // MapData 2.
					mapDatas[mapDatas.length] = mapData2;
					var c = report.config.getComponent("map2");
					if (c != undefined) mapData2.tilePath = c.getProperty("backgroundMappingPath");

					loadMapData(mapData2, function()
					{
						// Second data group.
						var dataGroup2 = new ia.DataGroup(report,"2");
						dataGroup2.mapData = mapData2;
						dataGroups[dataGroups.length] = dataGroup2;
						report.addComponent("dataGroup2", dataGroup2);
						dataGroup2.build(function()
						{
							if (report.config.template == ia.DOUBLE_GEOG_REPORT) 
							{
								var interactionGroup2 = new ia.InteractionGroup();
								if (selectionMode) interactionGroup2.selectionMode = selectionMode;
								var comparisonInteractionGroup2 = new ia.InteractionGroup();
								
								// Sync data between the 2 layers only if theres no second data explorer.
								var explorer = report.config.getComponent("dataExplorer2");
								if (explorer == undefined) 
								{
									dataGroup1.addEventListener(ia.DataEvent.INDICATOR_CHANGED, function(event)
									{
										var indicatorId = dataGroup2.geography.getIndicator(dataGroup1.indicator.id);
										if (indicatorId == undefined) // Fix for db-builder which doesnt have matching indicator ids.
										{
											var indicator = dataGroup2.geography.getIndicatorByName(dataGroup1.indicator.name, dataGroup1.indicator.date);
											if (indicator != undefined) dataGroup2.setData(dataGroup2.geography.id, indicator.id, indicator.date);
										}
										else dataGroup2.setData(dataGroup2.geography.id, dataGroup1.indicator.id, dataGroup1.indicator.date);
									});
								}
								// Sync filters between the 2 layers only if theres no second filter explorer.
								var explorer = report.config.getComponent("filterExplorer2");
								if (explorer == undefined) 
								{	
									dataGroup1.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
									{
										if (event.filterId != "") dataGroup2.setFilter(event.filterId, event.filterValue);
										else dataGroup2.clearFilter();
									});
								}

								var componentGroups = 
								[
									{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
									,{dataGroup:dataGroup2,interactionGroup:interactionGroup2,comparisonInteractionGroup:comparisonInteractionGroup2}
								];

								factory = new ia.ComponentFactory(report.config, report, componentGroups);
								report.addComponent('factory', factory);
								factory.buildComponents(function()
								{
									var mapConfig = report.config.getComponent("map");
									if (mapConfig && mapConfig.getProperty("syncMaps")) syncMaps();
									if (callbackFunction != undefined) callbackFunction.call(null);
								});
							}
							else if (report.config.template == ia.DOUBLE_PLOT_REPORT)
							{
								dataGroup1.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
								{
									dataGroup2.setData(event.geography.id, dataGroup2.indicator.id, dataGroup2.indicator.date);
								});
								dataGroup1.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
								{
									dataGroup2.setFilteredFeatures(event.filterFeatures);
								});
								
								var c = report.config.getComponent("dataExplorer");
								if (c && c.getProperty("syncDates") == true) 
								{
									dataGroup1.addEventListener(ia.DataEvent.INDICATOR_CHANGED, function(event)
									{
										dataGroup2.setData(event.geography.id, dataGroup2.indicator.id, dataGroup1.indicator.date);
									});
								}

								var componentGroups = 
								[
									{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
									,{dataGroup:dataGroup2,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
								];

								factory = new ia.ComponentFactory(report.config, report, componentGroups);
								report.addComponent('factory', factory);
								factory.buildComponents(function()
								{
									var mapConfig = report.config.getComponent("map");
									if (mapConfig && mapConfig.getProperty("syncMaps")) syncMaps();
									if (callbackFunction != undefined) callbackFunction.call(null);
								});
							}
							else if (report.config.template == ia.BUBBLE_PLOT_REPORT)
							{
								// Third data group.
								var dataGroup3 = new ia.DataGroup(report,"3");
								dataGroup3.mapData = mapData1;
								dataGroups[dataGroups.length] = dataGroup3;
								report.addComponent("dataGroup3", dataGroup3);
								dataGroup3.build(function()
								{
									// Fourth data group.
									var dataGroup4 = new ia.DataGroup(report,"4");
									dataGroup4.mapData = mapData1;
									dataGroups[dataGroups.length] = dataGroup4;
									report.addComponent("dataGroup4", dataGroup4);
									dataGroup4.build(function()
									{
										dataGroup1.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
										{
											var geogId = event.geography.id;

											dataGroup2.setData(geogId, dataGroup2.indicator.id, dataGroup2.indicator.date, function()
											{
												dataGroup3.setData(geogId, dataGroup3.indicator.id, dataGroup3.indicator.date, function()
												{
													dataGroup4.setData(geogId, dataGroup4.indicator.id, dataGroup4.indicator.date, function()
													{

													});
												});
											});
										});
										dataGroup1.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
										{
											dataGroup2.setFilteredFeatures(event.filterFeatures);
											dataGroup3.setFilteredFeatures(event.filterFeatures);
											dataGroup4.setFilteredFeatures(event.filterFeatures);
										});

										var c = report.config.getComponent("dataExplorer");
										if (c && c.getProperty("syncDates") == true) 
										{
											dataGroup1.addEventListener(ia.DataEvent.INDICATOR_CHANGED, function(event)
											{
												var geogId = event.geography.id;

												dataGroup2.setData(event.geography.id, dataGroup2.indicator.id, dataGroup1.indicator.date);
												dataGroup3.setData(event.geography.id, dataGroup3.indicator.id, dataGroup1.indicator.date);
												dataGroup4.setData(event.geography.id, dataGroup4.indicator.id, dataGroup1.indicator.date);

												/*dataGroup2.setData(geogId, dataGroup2.indicator.id, dataGroup1.indicator.date, function()
												{
													dataGroup3.setData(geogId, dataGroup3.indicator.id, dataGroup1.indicator.date, function()
													{
														dataGroup4.setData(geogId, dataGroup4.indicator.id, dataGroup1.indicator.date, function()
														{

														});
													});
												});*/
											});
										}

										var componentGroups = 
										[
											{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
											,{dataGroup:dataGroup2,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
											,{dataGroup:dataGroup3,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
											,{dataGroup:dataGroup4,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
										];

										factory = new ia.ComponentFactory(report.config, report, componentGroups);
										report.addComponent('factory', factory);
										factory.buildComponents(function()
										{
											if (callbackFunction != undefined) callbackFunction.call(null);
										});
									}); // End dataGroup3.build()
								}); // End dataGroup4.build()
							}
							else if (report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
							{
								dataGroup1.addEventListener(ia.DataEvent.INDICATOR_CHANGED, function(event)
								{
									dataGroup2.setData(dataGroup2.geography.id, dataGroup1.indicator.id, dataGroup1.indicator.date);
								});
								dataGroup2.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
								{
									var map = report.getComponent("map");
									if (map) map.render();
								});
								dataGroup1.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
								{
									dataGroup2.setFilteredFeatures(event.filterFeatures);
								});
										
								var componentGroups = 
								[
									{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
									,{dataGroup:dataGroup2,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
								];
								
								factory = new ia.ComponentFactory(report.config, report, componentGroups);
								report.addComponent('factory', factory);
								factory.buildComponents(function()
								{
									var map = report.getComponent("map");
									if (map) map.render();
									if (callbackFunction != undefined) callbackFunction.call(null);
								});
							}
							else if (report.config.template == ia.DOUBLE_BASELAYER_REPORT)
							{
								var interactionGroup2 = new ia.InteractionGroup();
								if (selectionMode) interactionGroup2.selectionMode = selectionMode;
								var comparisonInteractionGroup2 = new ia.InteractionGroup();
								
								dataGroup2.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
								{
									var map = report.getComponent("map");
									if (map) map.render();
								});

								// Sync data between the 2 layers only if theres no second data explorer.
								var explorer = report.config.getComponent("dataExplorer2");
								if (explorer == undefined) 
								{
									dataGroup1.addEventListener(ia.DataEvent.INDICATOR_CHANGED, function(event)
									{
										var indicatorId = dataGroup2.geography.getIndicator(dataGroup1.indicator.id);
										if (indicatorId == undefined) // Fix for db-builder which doesnt have matching indicator ids.
										{
											var indicator = dataGroup2.geography.getIndicatorByName(dataGroup1.indicator.name, dataGroup1.indicator.date);
											if (indicator != undefined) dataGroup2.setData(dataGroup2.geography.id, indicator.id, indicator.date);
										}
										else dataGroup2.setData(dataGroup2.geography.id, dataGroup1.indicator.id, dataGroup1.indicator.date);
									});
								}
								// Sync filters between the 2 layers only if theres no second filter explorer.
								var explorer = report.config.getComponent("filterExplorer2");
								if (explorer == undefined) 
								{	
									dataGroup1.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
									{
										if (event.filterId != "") dataGroup2.setFilter(event.filterId, event.filterValue);
										else dataGroup2.clearFilter();
									});
								}

								var componentGroups = 
								[
									{dataGroup:dataGroup1,interactionGroup:interactionGroup1,comparisonInteractionGroup:comparisonInteractionGroup1}
									,{dataGroup:dataGroup2,interactionGroup:interactionGroup2,comparisonInteractionGroup:comparisonInteractionGroup2}
								];

								factory = new ia.ComponentFactory(report.config, report, componentGroups);
								report.addComponent('factory', factory);
								factory.buildComponents(function()
								{
									var map = report.getComponent("map");
									if (map) map.render();
									if (callbackFunction != undefined) callbackFunction.call(null);
								});
							}
						}); // End dataGroup2.build()
					}); // End MapData2
				}
			}); // End dataGroup1.build()
		}); // End MapData1
	};

	/** 
	 * Loads a new css source file.
	 *
	 * @method loadStyle
	 * @param {String} source The style source.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.loadStyle = function(source, callbackFunction) 
	{
		report.startProgress('loadStyle', function()
		{
			report.url.params["style"] = source.substring(0, source.lastIndexOf("."));

			ia.loadCssfile(source, function()
			{
				report.endProgress('loadStyle');
				if (callbackFunction != undefined) callbackFunction.call(null);
			}); 	
		});										
	};

	/** 
	 * Loads a new config source file.
	 *
	 * @method loadConfig
	 * @param {String} source The config source.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.loadConfig = function(source, callbackFunction) 
	{
		report.startProgress('loadConfig', function()
		{
			report.url.params = {};
			report.url.params["config"] = source.substring(0, source.lastIndexOf("."));

			configSource = source;
			configXML = undefined;

			loadConfig(function()
			{
				// Refresh the report data as the new config may have changed custom data settings.
				report.data.refresh(function() 
				{
					// Build report widgets.
					report.build(function() 
					{
						// Build report components.
						buildComponents(function() 
						{
							// Responsive design.
							updateResponsiveDesign();

							// Add menubar components.
							addShareBox();
							addHelp();

							report.endProgress('loadConfig');
							if (callbackFunction != undefined) callbackFunction.call(null);
						});
					});
				});
			}); 	
		});		
	};

	/**
	 * Parses a new config source.
	 *
	 * @method parseConfig
	 * @param {XML} xml The xml data.
 	 * @param {Function} callbackFunction Called on completion of function.
	 * @private
	 */
	ia.parseConfig = function(xml, callbackFunction)  
	{
		report.startProgress('parseConfig', function()
		{	
			report.url.params = {};		
			configSource = undefined;
			configXML = xml;

			loadConfig(function()
			{
				// Refresh the report data as the new config  may have changed custom data settings.
				report.data.refresh(function() 
				{
					// Build report widgets.
					report.build(function() 
					{
						// Build report components.
						buildComponents(function() 
						{
							// Responsive design.
							updateResponsiveDesign();

							// Add menubar components.
							addShareBox();
							addHelp();

							report.endProgress('parseConfig');
							if (callbackFunction != undefined) callbackFunction.call(null);
						});
					});
				});
			});	
		});		
	};

	/**
	 * Loads a new data source file.
	 *
	 * @method loadData
	 * @param {String} source The data source.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.loadData = function(source, callbackFunction) 
	{
		report.startProgress('loadData', function()
		{
			report.url.params["data"] =  source.substring(0, source.lastIndexOf("."));

			dataSource = source;
			dataJSON = undefined;

			loadData(function()
			{
				updateDataGroups(function()
				{
					report.endProgress('loadData');
					if (callbackFunction != undefined) callbackFunction.call(null);
				})
			});
		});		
	};

	/**
	 * Parses a new data source.
	 *
	 * @method parseData
	 * @param {JSON} json The json data.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.parseData = function(json, callbackFunction) 
	{
		report.startProgress('parseData', function()
		{
			dataSource = undefined;
			dataJSON = json;

			loadData(function()
			{
				updateDataGroups(function()
				{
					report.endProgress('parseData');
					if (callbackFunction != undefined) callbackFunction.call(null);
				})
			});
		});		
	};

	/** 
	 * Loads a new map source file.
	 *
	 * @method loadMap
	 * @param {String} source The map source.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.loadMap = function(source, callbackFunction) 
	{
		report.startProgress('loadMap', function()
		{
			report.url.params["map"] =  source.substring(0, source.lastIndexOf("."));

			mapSource = source;
			mapJSON = undefined;

			var count = 0;
			function onSuccess()
			{
				if (count == mapDatas.length)
				{
					updateDataGroups(function()
					{
						report.endProgress('loadMap');
						if (callbackFunction != undefined) callbackFunction.call(null);
					})
				}
				else
				{
					var mapData = mapDatas[count];
					count++;
					loadMapData(mapData, onSuccess);
				}
			};
			onSuccess();
		});		
	};

	/** 
	 * Parses a new map data source.
	 *
	 * @method parseMap
	 * @param {JSON} json The json data.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.parseMap = function(json, callbackFunction) 
	{
		report.startProgress('parseMap', function()
		{
			mapSource = undefined;
			mapJSON = json;

			var count = 0;
			function onSuccess()
			{
				if (count == mapDatas.length)
				{
					updateDataGroups(function()
					{
						report.endProgress('parseMap');
						if (callbackFunction != undefined) callbackFunction.call(null);
					})
				}
				else
				{
					var mapData = mapDatas[count];
					count++;
					loadMapData(mapData, onSuccess);
				}
			};
			onSuccess();
		});		
	};

	/** 
	 * Use this to update the report options.
	 *
	 * @method update
	 * @param {String} options The report options.	 
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.update = function(options, callbackFunction) 
	{
		report.startProgress('update', function()
		{
			// Process the start params.
			processStartParams(options, function()
			{
				// Load the config file.
				loadConfig(function()
				{
					// Load the data.
					loadData(function() 
					{
						// Build report widgets.
						report.build(function() 
						{
							// Build report components.
							buildComponents(function() 
							{
								// Responsive design.
								updateResponsiveDesign();

								// Add menubar components.
								addShareBox();
								addHelp();
							
								report.endProgress('update');
								if (callbackFunction != undefined) callbackFunction.call(null);
							});
						});
					});
				});
			});
		});
	};

	/** 
	 * Loads new data and map sources.
	 *
	 * @method load
	 * @param {String} dataSource The data source.	 
	 * @param {String} mapSource The map source.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.load = function(dataSource, mapSource, callbackFunction) 
	{
		report.startProgress('load', function()
		{
			report.url.params["data"] = dataSource.substring(0, dataSource.lastIndexOf("."));

			report.data.loadSource(dataSource, function()
			{
				ia.loadMap(mapSource, function()
				{
					report.endProgress('load');
					if (callbackFunction != undefined) callbackFunction.call(null);
				});
			});
		});		
	};

	/** 
	 * Parses new data and map json.
	 *
	 * @method load
	 * @param {JSON} jsonData The data source.	 
	 * @param {JSON} jsonMap The map source.
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	ia.parse = function(jsonData, jsonMap, callbackFunction) 
	{
		report.startProgress('parse', function()
		{
			report.data.parseData(jsonData, function()
			{
				ia.parseMap(jsonMap, function()
				{
					report.endProgress('parse');
					if (callbackFunction != undefined) callbackFunction.call(null);
				});
			});
		});		
	};

	/** 
	 * Updates the data groups when one of the the map or data sources have changed.
	 *
	 * @method updateDataGroups
 	 * @param {Function} callbackFunction Called on completion of function.
	 */
	function updateDataGroups(callbackFunction)
	{
		// Check for when no data has been added at initialisation.
		// This was added so that we could draw the component panels and add the map and data later.
		// Makes perceived speed of dashboard builder faster.
		if (dataGroups.length == 0)  
		{
			buildComponents(function()
			{
				// Responsive design.
				updateResponsiveDesign();
				onDataGroupUpdate(callbackFunction);
			}); 
		}
		else onDataGroupUpdate(callbackFunction);
	};
	function onDataGroupUpdate(callbackFunction)
	{
		var count = 0;
		function onSuccess()
		{
			if (count == dataGroups.length)
			{
				if (callbackFunction != undefined) callbackFunction.call(null);
			}
			else
			{
				var dataGroup = dataGroups[count];
				count++;
				dataGroup.update(onSuccess);
			}
		};
		onSuccess();
	};

	/**
	 * Sets the report parameters.
	 *
	 * @method setReportParams
	 * @param {Object} reportParams Parameters for the report (key/value pairs) 
	 * eg. {"dataPath":"./data/","config":"./configs/config-single/config"}.
	 * @private
	 */
	function setReportParams(reportParams)
	{
		// Get Url Parameters.			
		report.url = new ia.UrlParams(window.location.href);

		// For IA Server.
		if (reportParams)
		{
			// Convert start params into normal params.
			for (var p in reportParams) 																
			{
				if (!report.url.params[p] 
					&& (p != "errorHandler") 
					&& (p != "style")
					&& (p != "printmode")) 
				{
					report.url.params[p] = reportParams[p];
				}
			}
			//if (reportParams["errorHandler"]) ia.File.errorHandler = reportParams["errorHandler"]; 	// Sets an error function to call.
			if (report.url.params["config"]) ia.IAS_PATH = ia.File.getFileDirectory(report.url.params["config"]);	// Link to file path for IAS.
		}

		report.url.params["dataPath"] =  report.url.params["dataPath"] || ""; 		// Set the data path.

		// Set the style.css.
		if (report.url.params["style"])
		{
			ia.loadCssfile(report.url.params["style"]+".css"); 											
		}
		
		// This is used by sample reports when the custom code is in a different location from the atlas.
		report.url.params["custom"] = report.url.params["custom"] || "";
		if (report.url.params["custom"])
		{
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = report.url.params["custom"]+".js";
			document.body.appendChild(script);
		}

		// Opening in print preview mode.
		if (report.url.params["printmode"])
		{
			report.container.addClass("ia-report-printmode");
			printBar = new ia.PrintBar(report);
			printBar.render();
			$j("body").prepend(printBar.container);
		}
	};

	/**
	 * Synchronize map navigation.
	 *
	 * @method syncMaps
	 * @private
	 */
	function syncMaps()
	{
		var map = report.getComponent("gMap");
		var map2 = report.getComponent("gMap2");
		if (map && map2) // Using google maps
		{
			var map1Zooming = false;
			var map2Zooming = false;
			google.maps.event.addListener(map.gMap, 'bounds_changed', function(event) 	
			{
				if (map2Zooming == false)
				{
					map1Zooming = true;
					map2.gMap.setZoom(map.gMap.getZoom());
					map2.gMap.setCenter(map.gMap.getCenter());
				}
			});
			google.maps.event.addListener(map.gMap, 'idle', function(event) 	
			{
				map1Zooming = false;
			});
			google.maps.event.addListener(map2.gMap, 'bounds_changed', function(event) 	
			{
				if (map1Zooming == false)
				{
					map2Zooming = true;
					map.gMap.setZoom(map2.gMap.getZoom());
					map.gMap.setCenter(map2.gMap.getCenter());
				}
			});
			google.maps.event.addListener(map2.gMap, 'idle', function(event) 	
			{
				map2Zooming = false;
			});
		}
		else
		{
			var map = report.getComponent("map");
			var map2 = report.getComponent("map2");
			if (map && map2)
			{
				var mapZoomed = false;
				
				function bBoxEventHandler(event)
				{
					if (mapZoomed == false)
					{
						mapZoomed = true;
						map2.controller.zoomToBBox(event.bBox);
						mapZoomed = false;
					}
				}
				map.addEventListener(ia.BBoxEvent.BBOX_TRANSLATE, bBoxEventHandler);
				map.addEventListener(ia.BBoxEvent.BBOX_SCALE, bBoxEventHandler);
				function bBoxEventHandler2(event)
				{
					if (mapZoomed == false)
					{
						mapZoomed = true;
						map.controller.zoomToBBox(event.bBox);
						mapZoomed = false;
					}
				}
				map2.addEventListener(ia.BBoxEvent.BBOX_TRANSLATE, bBoxEventHandler2);
				map2.addEventListener(ia.BBoxEvent.BBOX_SCALE, bBoxEventHandler2);
			}
		}
	};

	/**
	 * Feature tip function.
	 *
	 * @method tipFunction
	 * @param {Object} item The item.
	 * @param {String} componentId The component id.
	 * @param {String} suffix Used by double geog single map.
	 * @return {String} The tip.
	 */
	ia.tipFunction = function(item, componentId, suffix)
	{
		tipSubstitution.clearVariables();

		var subText = report.config.getComponent(componentId).getProperty("tip");
		if (suffix) subText = report.config.getComponent(componentId).getProperty("tip"+suffix);

		var suffix = "";

		for (var i = 0; i < dataGroups.length; i++) // Loop for double plot and double baselayer.
		{
			var dataGroup = dataGroups[i];
			var indicator = dataGroup.indicator;
			var theme = dataGroup.theme;
			if (i != 0) suffix = i+1;
			updateTip(item, dataGroup, indicator, suffix);
		}

		var s = tipSubstitution.formatMessage(subText);
		return s;
	};

	/**
	 * Time tip function.
	 *
	 * @method tipFunction
	 * @param {Object} item The item.
	 * @param {Object} childItem The child item.
	 * @param {String} componentId The component id.
	 * @return {String} The tip.
	 */
	ia.timeTipFunction = function(item, childItem, componentId)
	{
		tipSubstitution.clearVariables();

		var suffix = "";

		for (var i = 0; i < dataGroups.length; i++) // Loop for double plot and double baselayer.
		{

			var dataGroup = dataGroups[i];
			var indicator = dataGroup.theme.getIndicator(dataGroup.indicator.id, childItem.name)
			if (i != 0) suffix = i+1;
			updateTip(item, dataGroup, indicator, suffix);
		}

		var subText = report.config.getComponent(componentId).getProperty("tip");
		var s = tipSubstitution.formatMessage(subText);
		return s;
	};

	/**
	 * Breakdown tip function.
	 *
	 * @method tipFunction
	 * @param {Object} item The item.
	 * @param {Object} childItem The child item.
	 * @param {String} componentId The component id.
	 * @return {String} The tip.
	 */
	ia.breakdownTipFunction = function(item, childItem, componentId)
	{
		tipSubstitution.clearVariables();

		var suffix = "";

		for (var i = 0; i < dataGroups.length; i++) // Loop for double plot and double baselayer.
		{

			var dataGroup = dataGroups[i];
			var indicator = dataGroup.theme.getIndicatorByName(childItem.name, dataGroup.indicator.date)
			if (i != 0) suffix = i+1;
			updateTip(item, dataGroup, indicator, suffix);
		}

		var subText = report.config.getComponent(componentId).getProperty("tip");
		var s = tipSubstitution.formatMessage(subText);
		return s;
	};

	function updateTip(item, dataGroup, indicator, suffix)
	{
		tipSubstitution.setVariable("featureName"+suffix, item.name);

		// Feature properties.
		var feature = dataGroup.geography.getFeature(item.id);
		if (feature)
		{
			tipSubstitution.setVariable("feature-id", feature.id);
			tipSubstitution.setVariable("feature-name", feature.name);
			tipSubstitution.setVariable("feature-href", feature.href);

			var props = feature.getProperties();
			for (var propName in props) 
			{
				tipSubstitution.setVariable(propName+suffix, props[propName]);
				tipSubstitution.setVariable(propName+"-value", props[propName]);
			}
		}

		// Geography.
    	tipSubstitution.setVariable("geog-name"+suffix, dataGroup.geography.name);
    	tipSubstitution.setVariable("geogName"+suffix, dataGroup.geography.name);

		// Theme.
		tipSubstitution.setVariable("theme-name"+suffix, dataGroup.theme.name);
		tipSubstitution.setVariable("themeName"+suffix, dataGroup.theme.name);
	
		// Indicator.
		var formattedValue = indicator.getFormattedValue(item.id);
		tipSubstitution.setVariable("indicatorValue"+suffix, formattedValue);
		tipSubstitution.setVariable("indicator-id"+suffix, indicator.id);
		tipSubstitution.setVariable("indicator-name"+suffix, indicator.name);
		tipSubstitution.setVariable("indicatorName"+suffix, indicator.name);
		tipSubstitution.setVariable("indicator-type"+suffix, indicator.type);
		tipSubstitution.setVariable("indicator-href"+suffix, indicator.href);
		tipSubstitution.setVariable("indicator-value"+suffix, indicator.getValue(item.id));
		tipSubstitution.setVariable("indicator-formatted-value"+suffix, formattedValue);
		tipSubstitution.setVariable("indicator-date"+suffix, indicator.date);
		tipSubstitution.setVariable("date"+suffix, indicator.date);

		// Indicator properties.
		var props = indicator.getProperties();
		for (var propName in props) 
		{
			tipSubstitution.setVariable(propName+suffix, props[propName]);
			tipSubstitution.setVariable(propName+"-value"+suffix, props[propName]);
		}

		// Associate.
		var associates = indicator.getAssociates();
		var n = associates.length;
		for (var j = 0; j < n; j++) 
		{		
			var associate = associates[j];
			tipSubstitution.setVariable(associate.name+""+suffix, associate.getFormattedValue(item.id));

			tipSubstitution.setVariable(associate.name+"-value"+suffix, associate.getValue(item.id));
			tipSubstitution.setVariable(associate.name+"-formatted-value"+suffix, associate.getFormattedValue(item.id));
			tipSubstitution.setVariable(associate.name+"-type"+suffix, associate.type);
		}

		// Limits.
		var lowerLimits = indicator.getLowerLimits();
		var upperLimits = indicator.getUpperLimits();
		if (lowerLimits && upperLimits)
		{
			tipSubstitution.setVariable("lowerLimit"+suffix, lowerLimits.getFormattedValue(item.id));
			tipSubstitution.setVariable("upperLimit"+suffix, upperLimits.getFormattedValue(item.id));
		}
		else
		{
			tipSubstitution.setVariable("lowerLimit"+suffix, "");
			tipSubstitution.setVariable("upperLimit"+suffix, "");
		}

	};

	/** 
	 * Called after the google maps api has been loaded.
	 *
	 * @method initGoogleMaps
	 */
	ia.initGoogleMaps = function() 
	{
		ia.googleMapsLoaded = true;
		mapDatas[0].loadVisibleLayers()
	};
	ia.googleMapsLoaded = false;

	/** 
	 * Returns the url for the current report settings.
	 *
	 * @method getUrl
	 * @return {String} The report url.
	 */
	ia.getUrl = function()
	{
		return report.url.getReportUrl();
	};
	
	/**
	 * Toggles the visibility of the callout with the passed id.
	 *
	 * @method toggleCallout
	 * @param {String} id The callout id.
	 * @param {Event} e The associated event.
	 */
	ia.toggleCallout = function(id, e)
	{
		var callout = report.getCallout(id);

		if (callout != undefined) 
		{
			if (e.originalEvent.touches)
			{
				var touchEvent = e.originalEvent.changedTouches[0];
				callout.position(touchEvent.pageX, touchEvent.pageY);
			}
			else callout.position(e.pageX, e.pageY);
			callout.toggle();
		}
	};

	/**
	 * Adds the share callout box.
	 *
	 * @method addShareBox
	 * @private
	 */
	function addShareBox()
	{
		var shareCallout = new ia.CalloutBox("shareCallout", "top-bottom");
		shareCallout.popup(true);
		report.addCallout(shareCallout);
	
		var container = $j('<div></div>');
		shareCallout.container.append(container);

		var thumbnail =  $j('<div id="ia-thumbnail-callout"></div>');
		container.append(thumbnail);

		var emailText =  $j('<div class="ia-share-text"></div>').html(report.config.getProperty("emailReportText"));
		container.append(emailText);

		var emailInput =  $j('<input id="ia-share-callout" type="text" style="width:100%" class="ia-input" value="'+document.URL+'"/>');
		container.append(emailInput);
		emailInput.bind("click", function(e) {e.stopPropagation();this.select();});

		var embedText =  $j('<div class="ia-share-text"></div>').html(report.config.getProperty("embedReportText"));
		container.append(embedText);

		var embedCode = "<iframe src='"+document.URL+"' style='width:800px;height:600px;border-width:0px'></iframe>"
		var embedInput =  $j('<input id="ia-embed-callout" type="text" style="width:100%" class="ia-input" value="'+embedCode+'"/>');
		container.append(embedInput);
		embedInput.bind("click", function(e) {e.stopPropagation();this.select();});
	};

	/**
	 * Adds the help panel.
	 *
	 * @method addHelp
	 * @private
	 */
	function addHelp()
	{
		var helpPanel = new ia.Panel("popup");
		helpPanel.setDimensions(15, 15, 70, 70);
		helpPanel.closeable(true);
		helpPanel.popup(true);
		helpPanel.resizeable(true);
		helpPanel.zIndex(300);
		report.addPanel(helpPanel);

		var content = new ia.HTMLContainer("popup");
		helpPanel.append(content.container);
		report.addComponent("popup", content);
	};

	/**
	 * Adds information about the report - viewed in an alert box
	 * when the user presses ctrl-i.
	 *
	 * @method addReportInfo
	 * @private
	 */
	function addReportInfo()
	{
		$j("body").keydown(function(event) 
		{
			// Ctrl-i.
			if (event.which == 73 && event.ctrlKey == true)
			{
				var iaInfo = "About This InstantAtlas Report";

				iaInfo += "\n___________________________________________________________\n";

				iaInfo += "\nTemplate";
				iaInfo += "\n";
				iaInfo += "\nName: "+report.template;
				iaInfo += "\nVersion: "+report.version;
				iaInfo += "\nEvaluation: "+report.evaluation;
				iaInfo += "\nUID: "+report.uid;

				iaInfo += "\n___________________________________________________________\n";

				iaInfo += "\nConfig";
				iaInfo += "\n";
				iaInfo += "\nName: "+report.config.name;
				iaInfo += "\nVersion: "+report.config.version;
				iaInfo += "\nId: "+report.config.template;
				alert(iaInfo);
			}
		});
	};
}());