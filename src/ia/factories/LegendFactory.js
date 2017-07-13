/** 
 * Factory for creating legends.
 *
 * @author J Clare
 * @class ia.LegendFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.LegendFactory = function(config, report, componentGroup)
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

	// This code executes every time the data groups thematic has changed.
	// The thematic will change after any data change so only render
	// here to avoid multiple rendering.
	dataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		me.update();
		me.render();
	});

	// Components.

	// Panel.
	var panel = report.getWidget(config.id); 
	panel.settingsFunction = function(e) 
	{
	    if (config.getProperty("showLegendEditorButton") == true) updateLegendSettings();
		iaToggleCallout(config.id + "-callout", e);
	}; 
	panel.exportFunction = function(e) 
	{
		
			iaExportPanel(panel, e);
		        /*ia.getDataUrl(panel.content, function(dataUrl)
		        {
					iaExportDataUrl(dataUrl, e);
        });*/
	};  

	// Legend.
	var discreteLegend;
	var gradientLegend;
	var layerList;
	var legendCallout;
	var legendEditor;

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

		// Discrete legend.
		discreteLegend = new ia.DiscreteLegend(config.id+"-discrete"); // Discrete Legend component.

		// Switch off legend interactivity for profile reports as causes freezing with large numbers of features
		if (report.config.template == ia.SPINE_REPORT
		|| report.config.template == ia.ELECTION_REPORT)
		{
			discreteLegend.interactive = false
		}

		discreteLegend.thematic = dataGroup.thematic;
		interactionGroup.addComponent(discreteLegend);

		// Continuous legend.
		gradientLegend = new ia.GradientLegend(config.id+"-gradient"); // Continuous legend component.
		gradientLegend.thematic = dataGroup.thematic;
		interactionGroup.addComponent(gradientLegend);

		// Layer list.
		layerList = new ia.LayerList(config.id);
		layerList.discreteLegend = discreteLegend;
		layerList.gradientLegend = gradientLegend;
		panel.append(layerList.container);
		report.addComponent(config.id, layerList);

		// Legend Editor.		
		legendCallout = new ia.CalloutBox(config.id+"-callout", "left-right");
		legendCallout.popup(true);
		report.addCallout(legendCallout);

		legendEditor = new ia.LegendEditor(dataGroup.thematic, report.config, dataGroup.legendSettings); // Legend Editor.
		legendCallout.container.append(legendEditor.container);
				
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};

	function updateLegendSettings()
	{
		var customBreaks = dataGroup.indicator.getProperty(report.config.getProperty("customBreaksKey"+dataGroup.suffix));
		if (dataGroup.thematic.heatmap == true)
		{
			legendEditor.showLegendTypePanel = false;
			legendEditor.showPalettePanel = true;
			legendEditor.showSizePanel = false;
		}
		else if (customBreaks)
		{
			legendEditor.showLegendTypePanel = false;
			legendEditor.showLegendTools = false;
			legendEditor.showPalettePanel = true;
			legendEditor.showSizePanel = false;
		}
		else 
		{
			// Which panels should be included.
			var showLegendTypePanel = report.config.getProperty("showLegendTypePanel");
			if (showLegendTypePanel == undefined) showLegendTypePanel = true;
			var showLegendTools = report.config.getProperty("showLegendTools");
			if (showLegendTools == undefined) showLegendTools = true;
			var showPalettePanel = report.config.getProperty("showPalettePanel");
			if (showPalettePanel == undefined) showPalettePanel = true;
			var showSizePanel = report.config.getProperty("showSizePanel");
			if (showSizePanel == undefined) showSizePanel = true;

			legendEditor.showLegendTypePanel = showLegendTypePanel;
			legendEditor.showLegendTools = showLegendTools;
			legendEditor.showPalettePanel = showPalettePanel;
			legendEditor.showSizePanel = showSizePanel;
		}
		legendEditor.render();
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{
		discreteLegend.highlightColor = report.highlightColor;
		discreteLegend.selectionColor = report.selectionColor;
		gradientLegend.highlightColor = report.highlightColor;
		gradientLegend.selectionColor = report.selectionColor;

		if (config.getProperty("showLegendEditorButton") == true)
		{
			updateLegendSettings();
			panel.hasSettings(true);

			/*var customBreaks = dataGroup.indicator.getProperty(report.config.getProperty("customBreaksKey"+dataGroup.suffix));
			if (customBreaks) panel.hasSettings(false);
			else panel.hasSettings(true);*/
		}
		else panel.hasSettings(false);

		// Apply legend editor changes.
		legendEditor.render();

		layerList.mapData = dataGroup.mapData;
		discreteLegend.style = dataGroup.mapData.baseLayer.style;

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
		var thematic = dataGroup.thematic;
		var dataType = indicator.getDataType(thematic.getDataField());

		layerList.render(); // Render layer list before legends.

		if (dataType != ia.Thematic.CATEGORIC 
			&& thematic.numericClassifier.classificationName == ia.Thematic.CONTINUOUS)
		{
			gradientLegend.precision = indicator.precision;

			// Show continuous legend.
			gradientLegend.show();
			gradientLegend.render();
			discreteLegend.renderCategoric();
		}
		else
		{
			// Show discrete legend.
			gradientLegend.hide();
			discreteLegend.render();
		}
		if (callbackFunction != undefined) callbackFunction.call(null, config.id);
	};
};