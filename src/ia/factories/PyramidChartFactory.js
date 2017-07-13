/** 
 * Factory for creating pyramid charts.
 *
 * @author J Clare
 * @class ia.PyramidChartFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.PyramidChartFactory = function(config, report, componentGroup)
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
		updateGeography();
		me.render();
	});

	// This code executes every time the data groups data has changed.
	dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
	{
		me.update();
		me.render();
	});

	// This code executes every time the selection has changed.
	interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event)
	{
		triggerUpdateSelection();
	});

	// This code executes every time the comparison selection has changed.
	comparisonInteractionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event) 
	{
		triggerUpdateSelection();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 
	panel.exportFunction = function(e) 
	{
		if (chart.isVisible) 
		{
			iaExportPanelWithChart(panel, chart, false, e);
			//var dataUrl = chart.exportData();
			//iaExportDataUrl(dataUrl, e);
		}
	}; 

	// Chart.
	var legendConfig;
	var legend;

	var chart;

	var mLayers;
	var mLayer;
	var mComparisonLayer;
	var mAssociateLayers;

	var fLayers;
	var fLayer;
	var fComparisonLayer;
	var fAssociateLayers;

	/** 
	 * Builds the component.
	 *
	 * @method build
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.build = function(callbackFunction)
	{
		// Legend.
		legendConfig = report.config.getComponent("pyramidLegend"+dataGroup.suffix);
		if (legendConfig && legend == undefined)
		{
			legend = new ia.ProfileLegend(legendConfig.id);
			var legendPanel = report.getWidget(legendConfig.id);
			legendPanel.append(legend.container);
			report.addComponent(legendConfig.id, legend);

			legendPanel.exportFunction = function(e) 
			{
		        iaExportPanel(legendPanel, e);
					        /*ia.getDataUrl(legendPanel.content, function(dataUrl)
					        {
								iaExportDataUrl(dataUrl, e);
		        });*/
			};  
		}

		// Chart.
		if (chart == undefined)
		{
			// Empty panel.
			panel.content.empty();

			// chart.
			chart = new ia.PyramidChart(config.id);
			chart.formatter = report.locale.formatter;
			panel.append(chart.container);

			addLayers();

			if (report.url.params["select"+dataGroup.suffix]) // select=_00CE,_00CF,_00DA
			{
				var arr = report.url.params["select"+dataGroup.suffix].toString().split(",");
				var id = arr[arr.length-1];
				var pData = dataGroup.geography.getProfileData([id]);
				for (var i = 0; i < mLayers.length; i++)
				{
					if (pData.themes.length > 0) mLayers[i].setData(pData.themes[0].indicators); // Males.
					if (pData.themes.length > 1) fLayers[i].setData(pData.themes[1].indicators); // Females.
				}
			}

			report.addComponent(config.id, chart);
		
			updateGeography(); 			
					
			// Wait till charts ready before returning.
			chart.addEventListener(ia.Event.MAP_READY, function() 
			{
				if (callbackFunction != undefined) callbackFunction.call(null, config.id);
			});
		}
		else if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{
		//addLayers();

		// Update associate layers.
		var properties = config.getProperties();
		var count = 0;
		for (var id in properties) 
		{
			var testId = 'line_value_';
			if (id.indexOf(testId) != -1)
			{
				var index = id.substring(id.lastIndexOf("_")+1, id.length);

				var dataField = config.getProperty("line_value_"+index);
				var color = config.getProperty("line_color_"+index);

				// Male Associate layer.
				var mAssociateLayer;
				if (mAssociateLayers.length > count) mAssociateLayer = mAssociateLayers[count];
				else 
				{
					mAssociateLayer = new ia.ComparisonPyramidLayer();
					mAssociateLayers[mAssociateLayers.length] = mAssociateLayer;
					mLayers[mLayers.length] = mAssociateLayer;
				}

				mAssociateLayer.dataField = dataField;
				mAssociateLayer.setVisible(true);
				mAssociateLayer.interactive = true;
				mAssociateLayer.displayAll = true;
				mAssociateLayer.tip = config.getProperty("tip");
				chart.addLayer(mAssociateLayer);
				mAssociateLayer.style.strokeStyle = color;

				// Female Associate layer.
				var fAssociateLayer;
				if (fAssociateLayers.length > count) fAssociateLayer = fAssociateLayers[count];
				else 
				{
					fAssociateLayer = new ia.ComparisonPyramidLayer();
					fAssociateLayers[fAssociateLayers.length] = fAssociateLayer;
					fLayers[fLayers.length] = fAssociateLayer;
				}

				fAssociateLayer.gender = "female";
				fAssociateLayer.dataField = dataField;
				fAssociateLayer.setVisible(true);
				fAssociateLayer.interactive = true;
				fAssociateLayer.displayAll = true;
				fAssociateLayer.tip = config.getProperty("tip");
				chart.addLayer(fAssociateLayer);
				fAssociateLayer.style.strokeStyle = color;

				count++;
			}
		}

		// Switch off extra layers we dont need.
		for (var i = count; i < mAssociateLayers.length; i++)
		{ 
			mAssociateLayer = mAssociateLayers[i];
			mAssociateLayer.setVisible(false);
			mAssociateLayer.interactive = false;
			mAssociateLayer.displayAll = false;

			fAssociateLayer = fAssociateLayers[i];
			fAssociateLayer.setVisible(false);
			fAssociateLayer.interactive = false;
			fAssociateLayer.displayAll = false;
		}

		// Legend.
		var legendConfig = report.config.getComponent("pyramidLegend"+dataGroup.suffix);
		if (legend && legendConfig && legendConfig.getProperty("layout")) legend.layout = legendConfig.getProperty("layout");

		var legendClasses = [];
		var label = config.getProperty("maleLabel")
		var legendClass = new ia.CategoricClass(label);
		legendClass.color = config.getProperty("maleColor");
		legendClass.symbol = ia.Shape.SQUARE;
		legendClass.size = 12;
		legendClass.value = label;
		legendClasses[legendClasses.length] = legendClass;

		var label = config.getProperty("femaleLabel")
		var legendClass = new ia.CategoricClass(label);
		legendClass.color = config.getProperty("femaleColor");
		legendClass.symbol = ia.Shape.SQUARE;
		legendClass.size = 12;
		legendClass.value = label;
		legendClasses[legendClasses.length] = legendClass;

		// Associate Layers.
		var properties = config.getProperties();
		for (var id in properties) 
		{
			var testId = 'line_value_';
			if (id.indexOf(testId) != -1)
			{
				var index = id.substring(id.lastIndexOf("_")+1, id.length);

				var value = config.getProperty("line_value_"+index);	 
				var label = config.getProperty("line_label_"+index);					
				var color = config.getProperty("line_color_"+index);

				if (value != undefined)
				{
					// For pyramid key.
					var legendClass = new ia.CategoricClass(label);
					legendClass.color = color;
					legendClass.symbol = ia.Shape.HORIZONTAL_LINE;
					legendClass.size = 12;
					legendClass.value = label;
					legendClasses[legendClasses.length] = legendClass;
				}
			}
		}

		// Associated legend created in above code.
		if (legend) 
		{
			legend.legendClasses = legendClasses;
			legend.render();
		}

		chart.orientation = "horizontal";
		chart.drawBarsFromZero = config.getProperty("drawBarsFromZero");
		chart.showYAxisLabels = config.getProperty("showYAxisLabels"); 

		mLayer.dataField = config.getProperty("data") || "value";
		mLayer.tip = config.getProperty("tip");
		mLayer.style.fillStyle = ia.Color.toRGBA(config.getProperty("maleColor"), 0.8);
		mLayer.style.strokeStyle = config.getProperty("maleColor");

		fLayer.dataField = config.getProperty("data") || "value";
		fLayer.tip = config.getProperty("tip");
		fLayer.style.fillStyle = ia.Color.toRGBA(config.getProperty("femaleColor"), 0.8);
		fLayer.style.strokeStyle = config.getProperty("femaleColor"); 

		mComparisonLayer.dataField = config.getProperty("data") || "value";
		mComparisonLayer.displayAll = config.getProperty("showComparison");
		mComparisonLayer.tip = config.getProperty("tip");
		mComparisonLayer.highlightColor = report.highlightColor;
		mComparisonLayer.selectionColor = report.selectionColor;

		fComparisonLayer.dataField = config.getProperty("data") || "value";
		fComparisonLayer.tip = config.getProperty("tip");
		fComparisonLayer.displayAll = config.getProperty("showComparison");
		fComparisonLayer.highlightColor = report.highlightColor;
		fComparisonLayer.selectionColor = report.selectionColor;

		for (var i = 0; i < mLayers.length; i++)
		{
			mLayers[i].highlightColor = report.highlightColor;
			mLayers[i].selectionColor = report.selectionColor;
			fLayers[i].highlightColor = report.highlightColor;
			fLayers[i].selectionColor = report.selectionColor;
		}

		var indicator = dataGroup.indicator;

		// Check for custom fixed values.
		var fixedMaxValue = indicator.getProperty(config.getProperty("maxChartValue"));
		if (fixedMaxValue)
		{
			chart.useTightLabels = true;
			chart.fixedMaxValue = fixedMaxValue;
		}
		else
		{
			// If theres no custom values then check for config.xml fixed values.
			if (config.getProperty("useFixedValues"))
			{
				chart.useTightLabels = true;
				chart.fixedMaxValue = config.getProperty("fixedMaxValue");
			}
			else chart.useTightLabels = config.getProperty("useTightLabels");
		}
		
		// Axis titles.
		// X-axis title.
		var xTitle = config.getProperty('xAxisTitle');
		if (xTitle) chart.xAxisTitle = report.textSubstitution.formatMessage(xTitle);
		else chart.xAxisTitle = undefined;

		// Y-axis title.
		var yTitle = config.getProperty('yAxisTitle');
		if (yTitle) chart.yAxisTitle = report.textSubstitution.formatMessage(yTitle);
		else chart.yAxisTitle = undefined;

		// Data.
		var themes = dataGroup.geography.getThemes();
		var mTheme = themes[0];
		chart.yAxisLabels = mTheme.getIndicatorNames().reverse();
		chart.date = indicator.date;

		// Do this here to make selected comparison areas stay selected when the indicator is changed.
		mComparisonLayer.update(chart.date);
		fComparisonLayer.update(chart.date);
		var arrIds = comparisonInteractionGroup.getSelection();
		if (arrIds.length > 0)  comparisonInteractionGroup.setSelection(arrIds);

		triggerUpdateSelection();

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
		chart.render();
		
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	// Update the data when the geography changes.
	function updateGeography()
	{
		var geography = dataGroup.geography;
		chart.geography = geography;

		var comparisonFeatures = geography.getComparisonFeatures();
		var comparisonFeatureIds = [];
		for (var i = 0; i < comparisonFeatures.length; i++)  
		{ 
			comparisonFeatureIds.push(comparisonFeatures[i].id)
		}

		var pData = geography.getProfileData(comparisonFeatureIds);
		if (pData.themes.length > 0) mComparisonLayer.setData(pData.themes[0].indicators); // Males.
		if (pData.themes.length > 1) fComparisonLayer.setData(pData.themes[1].indicators); // Females.
	};

	// Adds layers to the chart.
	function addLayers()
	{
		// Remove any previous layers from the interaction group.
		var layers = chart.getLayers();
		for (var i = 0; i < layers.length; i++)
		{
			var layer = layers[i];
			comparisonInteractionGroup.removeComponent(layer);
		}
		chart.removeLayers();

		// Arrays to hold the layers.
		fLayers = [];
		mLayers = [];
		fAssociateLayers = [];
		mAssociateLayers = [];

		// Male layer.
		mLayer = new ia.PyramidLayer();
		mLayer.setVisible(true);
		mLayer.interactive = true;

		// Set styles after layer added to chart otherwise it gets override by the ia-chart-item style.
		chart.addLayer(mLayer);
		mLayers[mLayers.length] = mLayer;

		// Female layer.
		fLayer = new ia.PyramidLayer();
		fLayer.gender = "female";
		fLayer.setVisible(true);
		fLayer.interactive = true;

		// Set styles after layer added to chart otherwise it gets override by the ia-chart-item style.
		chart.addLayer(fLayer);
		fLayers[fLayers.length] = fLayer;

		// Male Comparison layer.
		mComparisonLayer = new ia.ComparisonPyramidLayer();
		mComparisonLayer.setVisible(true);
		mComparisonLayer.interactive = true;
		mComparisonLayer.thematic = dataGroup.comparisonThematic;
		chart.addLayer(mComparisonLayer);
		comparisonInteractionGroup.addComponent(mComparisonLayer);

		// Female Comparison layer.
		fComparisonLayer = new ia.ComparisonPyramidLayer();
		fComparisonLayer.gender = "female";
		fComparisonLayer.setVisible(true);
		fComparisonLayer.interactive = true;
		fComparisonLayer.thematic = dataGroup.comparisonThematic;
		chart.addLayer(fComparisonLayer);
		comparisonInteractionGroup.addComponent(fComparisonLayer);

		//updateGeography();
	
		/*var properties = config.getProperties();
		for (var id in properties) 
		{
			var testId = 'line_value_';
			if (id.indexOf(testId) != -1)
			{
				var index = id.substring(id.lastIndexOf("_")+1, id.length);

				var dataField = config.getProperty("line_value_"+index);
				var color = config.getProperty("line_color_"+index);

				// Male Associate layer.
				var mAssociateLayer = new ia.ComparisonPyramidLayer();
				mAssociateLayer.dataField = dataField;
				mAssociateLayer.setVisible(true);
				mAssociateLayer.interactive = true;
				mAssociateLayer.displayAll = true;
				mAssociateLayer.tip = config.getProperty("tip");
				chart.addLayer(mAssociateLayer);
				mAssociateLayer.style.strokeStyle = color;

				// Female Associate layer.
				var fAssociateLayer = new ia.ComparisonPyramidLayer();
				fAssociateLayer.gender = "female";
				fAssociateLayer.dataField = dataField;
				fAssociateLayer.setVisible(true);
				fAssociateLayer.interactive = true;
				fAssociateLayer.tip = config.getProperty("tip");
				fAssociateLayer.displayAll = true;
				chart.addLayer(fAssociateLayer);
				fAssociateLayer.style.strokeStyle = color;

				fLayers[fLayers.length] = fAssociateLayer;
				mLayers[mLayers.length] = mAssociateLayer;
			}
		}*/
	};

	var timeout = null;
	function triggerUpdateSelection()
	{
		clearTimeout(timeout);
		timeout = setTimeout(function()
		{
				updateSelection();
		}, 250);
	};

	// Updates the chart selection.
	function updateSelection()
	{
		var selectedFeatures = interactionGroup.getSelection();
		if (selectedFeatures.length > 0) 
		{
			var id = selectedFeatures[0];
			var pData = dataGroup.geography.getProfileData([id]);
			for (var i = 0; i < mLayers.length; i++)
			{
				if (pData.themes.length > 0) mLayers[i].setData(pData.themes[0].indicators); // Males.
				if (pData.themes.length > 1) fLayers[i].setData(pData.themes[1].indicators); // Females.
			}
		}
		else
		{
			for (var i = 0; i < mLayers.length; i++)
			{
				mLayers[i].setData({}); // Males.
				fLayers[i].setData({}); // Females.
			}
		}

		me.render();
	}
};