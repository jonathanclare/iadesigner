/** 
 * Factory for creating maps.
 *
 * @author J Clare
 * @class ia.MapFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.dataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.MapFactory = function(config, report, componentGroup)
{
	var me = this;

	// Data and Interaction groups that the components belongs to.
	var interactionGroup = componentGroup.interactionGroup;
	var dataGroup = componentGroup.dataGroup;
	var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;
	
	// This code executes every time the map data has changed.
	dataGroup.mapData.addEventListener(ia.DataEvent.MAP_DATA_CHANGED, function(event)
	{
		onMapDataChange();
	});

	// This code executes every time the data groups thematic has changed.
	// The thematic will change after any data change so only render
	// here to avoid multiple rendering.
	dataGroup.addEventListener(ia.Event.THEMATIC_CHANGED, function(event)
	{
		if (buildingMap) thematicChanged = true;
		else
		{
			me.update();
			mapData.baseLayer.render()
			//me.render();
		}
	});

	// This code executes every time a filter has changed.
	dataGroup.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
	{
	    var zoomOnFilter = report.config.getProperty("zoomOnFilter");
	    if (zoomOnFilter == undefined || zoomOnFilter == true)
	    {
	        if (event.filterFeatures.length > 0)
	        {
	            if (report.config.template == ia.DOUBLE_BASELAYER_REPORT || report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
	            {
	                activeMap.zoomToFeatures(event.filterFeatures, [mapData.baseLayers[0]]); 	// Zoom to filtered features.
	            }
	            else activeMap.zoomToFeatures(event.filterFeatures, [mapData.baseLayer]); 		// Zoom to filtered features.
	        }
	        else
	            activeMap.controller.zoomFull(); 												// Zoom full when filter is removed.
	    }
	});

	// Panel.
	var panel;

	// Map.
	var thematicChanged = false; 	// Indicates that the thematic has changed.
	var buildingMap = false; 		// Indicates that the map is currently being built.
	var mapData; 					// ia.MapData
	var map; 						// ia.Map
	var gMap;						// ia.GoogleMap
	var activeMap; 					// Can be and ia.Map or ia.GoogleMap.
	var $copyright; 				// Map copyright.
	var $esriLogo;					// ESRI Logo.
	var agsHash = {};				// Holds copyright text for ESRI background mapping.
	var exportEsriLogo = false; 	// idicates whether esri logo should be included when map is exported.		
			

	// Bounding box set from url parameters.
	var bBoxFromParams;
	if (report.url.params["bbox"+dataGroup.suffix])
	{
		var bb = report.url.params["bbox"+dataGroup.suffix].split(",");
		bBoxFromParams = new ia.BoundingBox(parseFloat(bb[0]),
				parseFloat(bb[1]),
				parseFloat(bb[2]),
				parseFloat(bb[3]));  
	}

	// Updates the map when the map data has changed
	function onMapDataChange()
	{
		// Second layer of double base layer reports are added to same map as first layer.
		if (config == undefined) 
		{
			updateDoubleBaseLayer();
		}
		else
		{	
			// Remove any previous layers from the interaction group.
			var mapLayers = map.getLayers();
			for (var i = 0; i < mapLayers.length; i++)
			{
				var layer = mapLayers[i];
				interactionGroup.removeComponent(layer);
			}

			// Remove map layers.
			map.removeLayers();

			// Set special properties for baselayers.
			for (var i = 0; i < mapData.baseLayers.length; i++)
			{
				var layer = mapData.baseLayers[i];

				layer.dataLabel = report.config.getComponent(config.id).getProperty("tip");
				if (!layer.displayLabelsOnly) layer.interactive = true;
				layer.tipFunction = function(item)
				{
					var s = ia.tipFunction(item, config.id);
					return s;
				};

				layer.dataField = dataGroup.thematic.getDataField();
				layer.highlightColor = report.highlightColor;
				layer.selectionColor = report.selectionColor;
				layer.highlightOpacity = report.highlightOpacity;
				layer.selectionOpacity = report.selectionOpacity;

				interactionGroup.addComponent(layer);
			}

			// Set special properties for contextual layers if they interact with comparison table.
			var comparisonConfig = report.config.getComponent("comparisonTable"+dataGroup.suffix);
			if (comparisonConfig)
			{
 				var linkToMap = comparisonConfig.getProperty("linkToMap");
 				if (linkToMap)
 				{
					for (var i = 0; i < mapData.noneBaseLayers.length; i++)
					{
						var layer = mapData.noneBaseLayers[i];
						if (layer.geometry != "image") 
						{
							layer.highlightable = true;
							layer.highlightColor = report.highlightColor;
							layer.selectionColor = report.selectionColor;
							layer.highlightOpacity = 0;
							layer.selectionOpacity = 0;
							comparisonInteractionGroup.addComponent(layer);
						}
					}
 				}
			}

			// Add layers to map first to maintain layer order.
			var n = mapData.layers.length;
			var baseLayerAdded = false;
			if (mapData.maintainLayerOrder)
			{	
				for (var i = n-1; i >= 0; i--) 
				{
					var layer = mapData.layers[i];

					// Prevent second base layer being added for double base layer templates.
					// Its added in updateDoubleBaseLayer().
					if ((report.config.template == ia.DOUBLE_BASELAYER_REPORT
						|| report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
						&& layer.type == 'base-layer')
					{
						if (!baseLayerAdded) 
						{
							baseLayerAdded = true;
							map.addLayer(layer);
						}
					}
					else map.addLayer(layer);				
				}
			}
			else
			{
				for (var i = 0; i < n; i++)
				{
					var layer = mapData.layers[i];

					// Prevent second base layer being added for double base layer templates.
					// Its added in updateDoubleBaseLayer().
					if ((report.config.template == ia.DOUBLE_BASELAYER_REPORT
						|| report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
						&& layer.type == 'base-layer')
					{
						if (!baseLayerAdded) 
						{
							baseLayerAdded = true;
							map.addLayer(layer);
						}
					}
					else map.addLayer(layer);
				}
			}

			// Set the bounding box.
			map.controller.defaultBBox = mapData.mapBBox;
			if (!mapData.useGoogleMaps) 
			{
				if (bBoxFromParams) map.controller.zoomToBBox(bBoxFromParams);
				else map.controller.zoomFull();
			}
			else map.render();
			bBoxFromParams = undefined;

			// AGS Copyright.
			var imageLayers = mapData.imageLayers;
			if (imageLayers.length > 0)
			{
				// Add function to listen for when layer visibilty changes
				for (var i = 0; i < imageLayers.length; i++)
				{
					var layer = imageLayers[i];
					if (layer.type == 'ags-layer')
					{
						layer.addEventListener(ia.Event.LAYER_VISIBLE_CHANGED, updateCopyrightText);
					}
				}
			}

			if (thematicChanged)
			{
				thematicChanged = false;
				me.update();
				me.render();
			}
		}
	};

	// Update copyright text.
	function updateCopyrightText()
	{
		if (config) 
		{
			// Startup - Add the copyright of the base map.
			getBasemapCopyrightText(function(layerText)
			{
				var txt = config.getProperty("copyrightText");
				if (txt == undefined) txt = '';

				if (txt == '' && layerText == '') 
				{
					if ($esriLogo) 
					{
						$esriLogo.hide();
						exportEsriLogo = false;
					}
					$copyright.hide();
					$copyright.empty();
					map.setCopyright(' ');
				}
				else
				{
					if (txt != '' && layerText != '') 	
					{
						$copyright.html(txt+' '+layerText);
						map.setCopyright(txt+' '+layerText);
					}
					else if (txt != '') 		
					{
						$copyright.html(txt);
						map.setCopyright(txt);
					}
					else 							
					{
						$copyright.html(layerText);
						map.setCopyright(layerText);
					}

					if ($esriLogo) 
					{
						if (layerText != '') 	
						{
							$esriLogo.show();
							exportEsriLogo = true;
						}
						else 					
						{
							$esriLogo.hide();
							exportEsriLogo = false;
						}
					}
					$copyright.show();
				}
			});
		}
	};

	// Returns the top visible ags layer copyright.
	var logoAdded = false;
	function getBasemapCopyrightText(callback)
	{
		var topVisibleLayer;
		var imageLayers = mapData.imageLayers;
		if (imageLayers.length > 0)
		{
			var layer = imageLayers[0];
			if (layer.type == 'ags-layer' && layer.getVisible()) topVisibleLayer = layer;
		}
		if (topVisibleLayer != undefined)
		{
			var txt = agsHash[topVisibleLayer.id];
			if (txt != undefined) callback.call(null, txt); // Return stored copyright text from hash.
			else
			{
				var url = ia.getDomainSafeUrl(topVisibleLayer.url);
				if (url.indexOf('MapServer') != -1)
				{
					ia.FeatureServiceReader.getInfo(url, ia.accessToken, function(fsInfo, token)
					{	
						if (fsInfo.error == undefined)
						{
							// ESRI Logo.
							if (!logoAdded && fsInfo.documentInfo && (fsInfo.documentInfo.Author == 'Esri'))
							{
								$esriLogo = $j('<div id="esri-logo" class="ia-esri-logo"><img src="' + ia.IAS_PATH + 'esri-logo.png"></div>');
								map.addLogo(ia.IAS_PATH + 'esri-logo.png');
								panel.append($esriLogo);
								exportEsriLogo = true;
								logoAdded = true;
							}
							agsHash[topVisibleLayer.id] = fsInfo.copyrightText; // Store in a hash to reduce feature service calls.
						}
						else fsInfo.copyrightText = '';
						callback.call(null, fsInfo.copyrightText); // Return copyright text.
					});
				}
				else callback.call(null, ''); 
			}
		}
		else callback.call(null, ''); // Return (no visible ags layers - return empty string).
	};

	// Returns the top visible ags layer copyright.
	function getTopVisibleLayerCopyrightText(callback)
	{
		var topVisibleLayer;
		var imageLayers = mapData.imageLayers;
		for (var i = 0; i < imageLayers.length; i++)
		{
			var layer = imageLayers[i];
			if (layer.type == 'ags-layer' && layer.getVisible()) topVisibleLayer = layer;
		}
		if (topVisibleLayer != undefined)
		{
			var txt = agsHash[topVisibleLayer.id];
			if (txt != undefined) callback.call(null, txt); // Return stored copyright text from hash.
			else
			{
				var url = ia.getDomainSafeUrl(topVisibleLayer.url);
				if (url.indexOf('MapServer') != -1)
				{
					ia.FeatureServiceReader.getInfo(url, ia.accessToken, function(fsInfo, token)
					{	
						agsHash[topVisibleLayer.id] = fsInfo.copyrightText; // Store in a hash to reduce feature service calls.
						callback.call(null, fsInfo.copyrightText); // Return copyright text.
					});
				}
				else callback.call(null, '');
			}
		}
		else callback.call(null, ''); // Return (no visible ags layers - return empty string).
	};

	// Updates the double base layer.
	function updateDoubleBaseLayer()
	{
		map = report.getComponent("map");
		activeMap = report.getComponent("activeMap");
		mapData.noneBaseLayers = []; // Remove non-base layers from layer list.

		if (mapData.baseLayers.length > 1)
		{
			var layer = mapData.baseLayers[1];
			layer.dataField = dataGroup.thematic.getDataField();
			layer.highlightColor = report.highlightColor;
			layer.selectionColor = report.selectionColor;
			layer.highlightOpacity = report.highlightOpacity;
			layer.selectionOpacity = report.selectionOpacity;
			if (!layer.displayLabelsOnly) layer.interactive = true;
			layer.dataLabel = report.config.getComponent("map").getProperty("tip"+dataGroup.suffix);
			layer.tipFunction = function(item)
			{
				var s = ia.tipFunction(item, "map", dataGroup.suffix);
				return s;
			};

			if (report.config.template == ia.DOUBLE_BASELAYER_REPORT)
			{
				interactionGroup.addComponent(layer);
			}
			if (report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
			{
				layer.selectable = false;
			}
			map.addLayer(layer);
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
		mapData = dataGroup.mapData;

		// Second layer of double base layer reports are added to same map as first layer.
		if (config == undefined) 
		{
			updateDoubleBaseLayer();
			if (callbackFunction != undefined) callbackFunction.call(null, config ? config.id : 'map'); // Return
		}
		else
		{	
			buildingMap = true;

			// Panel.
			panel = report.getWidget(config.id);  
			panel.exportFunction = function(e) 
			{
    			iaExportPanelWithChart(panel, map, exportEsriLogo, e);
    			
				//var dataUrl = map.exportData(exportEsriLogo);
				//iaExportDataUrl(dataUrl, e);

				/*ia.getDataUrl(panel.content, function(dataUrl)
	            {
	            	iaExportDataUrl(dataUrl, e);
	            });*/
			};  
	
			// Empty panel.
			panel.content.empty();

			// Map.
			map = new ia.Map(config.id);
			report.addComponent(config.id, map);

			// Add listeners for map bounding box events.
			function bBoxEventHandler(event)
			{
				// Update the map bbox url param.
				var bb = map.getBBox();
				report.url.params["bbox"+dataGroup.suffix] = bb.getXMin() + "," + bb.getYMin()  + "," + bb.getXMax() + "," + bb.getYMax();
			}
			map.addEventListener(ia.BBoxEvent.BBOX_TRANSLATE, bBoxEventHandler);
			map.addEventListener(ia.BBoxEvent.BBOX_SCALE, bBoxEventHandler);

			var minZoom = config.getProperty("minZoomAllowed"); 	
			var maxZoom = config.getProperty("maxZoomAllowed"); 

			if (mapData.useGoogleMaps) 
			{
				gMap = new ia.GoogleMap(config.id, 
							mapData.googleMapType, 
							mapData.googleApiKey, 
							minZoom, 
							maxZoom,
							config.getProperty("googleGreyscaleText"),
							config.getProperty("googleOffText"));
				activeMap = gMap;

				gMap.addEventListener(ia.Event.MAP_READY, function()
				{
					// Set map bounding box.
					if (mapData.mapBBox.getXMin() < -20000000) mapData.mapBBox.setXMin(-20000000);
					if (mapData.mapBBox.getXMax() > 20000000) mapData.mapBBox.setXMax(20000000);

					gMap.controller.defaultBBox = mapData.mapBBox;
					if (bBoxFromParams) gMap.controller.zoomToBBox(bBoxFromParams);
					else gMap.controller.zoomFull();

					// Add IA Map as an overlay.
					gMap.addMapOverlay(map);
				});

				report.addComponent("gMap"+dataGroup.suffix, gMap);
			}
			else
			{
				if (minZoom != -1) map.minZoom = minZoom;
				if (maxZoom != -1) map.maxZoom = maxZoom
				map.useNavigation(true);
				activeMap = map;
			}

			map.addEventListener(ia.Event.MAP_READY, function()
			{
				onMapDataChange();
				buildingMap = false;
				if (callbackFunction != undefined) callbackFunction.call(null, config.id);
			});

			// Append the map panel - this will trigger the MAP_READY event.
			report.addComponent("activeMap"+dataGroup.suffix, activeMap);
			panel.append(activeMap.container);

			// Map copyright.
			$copyright = $j('<div id="map-copyright" class="ia-map-copyright"></div>');
			var expandCopyright = false;
			$copyright.on('click', function(e)
			{
				expandCopyright = !expandCopyright
				if (expandCopyright) 	$copyright.addClass('ia-map-copyright-expand');
				else  					$copyright.removeClass('ia-map-copyright-expand');
			});
			panel.append($copyright);

			// Evaluation message.
			if (report.evaluation) report.displayEvaluationMessage(panel);

			// Map Tools.
			var includeSearchTool = config.getProperty("includeSearchTool");
			if (includeSearchTool == undefined) includeSearchTool = false;

			if (includeSearchTool && dataGroup.suffix == "")
			{
				var protocol = window.location.protocol == "file:" ? "http:" : window.location.protocol;

				// For geocoding autocomplete ui.
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = protocol+"//code.jquery.com/ui/1.9.2/jquery-ui.js";
				document.body.appendChild(script);
			}

			var mapTools = new ia.MapTools(activeMap, dataGroup, interactionGroup, mapData.useGoogleMaps, includeSearchTool);
			mapTools.clearButtonText = config.getProperty("clearButtonText");
			mapTools.filterButtonText = config.getProperty("filterButtonText");
			mapTools.filterFunction = function()
			{
				if (interactionGroup.getSelection().length > 0)
					dataGroup.setFilteredFeatures(interactionGroup.getSelection());
				else if (dataGroup.getFilteredFeatures().length > 0)
					dataGroup.clearFilter();
			}
			mapTools.clearFunction = function()
			{
				interactionGroup.clearSelection();
			}

			panel.append(mapTools.container);
			report.addComponent("mapTools"+dataGroup.suffix, mapTools);
			mapTools.render();
		}
	};

	/** 
	 * Updates the component.
	 *
	 * @method update
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.update = function(callbackFunction)
	{
		// Set special properties for baselayers.
		for (var i = 0; i < mapData.baseLayers.length; i++)
		{
			var layer = mapData.baseLayers[i];
			layer.dataField = dataGroup.thematic.getDataField();
			layer.highlightColor = report.highlightColor;
			layer.selectionColor = report.selectionColor;
			layer.highlightOpacity = report.highlightOpacity;
			layer.selectionOpacity = report.selectionOpacity;
		}

		if (config) 
		{
			var minZoom = config.getProperty("minZoomAllowed"); 	
			var maxZoom = config.getProperty("maxZoomAllowed"); 
			if (minZoom != -1) map.minZoom = minZoom;
			else map.minZoom = undefined; 
			if (maxZoom != -1) map.maxZoom = maxZoom;
			else map.maxZoom = undefined; 
		}

		// Set special properties for contextual layers if they interact with comparison table.
		var comparisonConfig = report.config.getComponent("comparisonTable"+dataGroup.suffix);
		if (comparisonConfig)
		{
			var linkToMap = comparisonConfig.getProperty("linkToMap");
			if (linkToMap)
			{
				for (var i = 0; i < mapData.noneBaseLayers.length; i++)
				{
					var layer = mapData.noneBaseLayers[i];
					if (layer.geometry != "image") 
					{
						layer.highlightable = true;
						layer.highlightColor = report.highlightColor;
						layer.selectionColor = report.selectionColor;
						layer.highlightOpacity = 0;
						layer.selectionOpacity = 0;
					}
					else
					{
						layer.highlightable = false;
					}
				}
			}
		}

		updateCopyrightText();
		mapData.baseLayer.setData(dataGroup.indicatorData); 
		if (callbackFunction != undefined) callbackFunction.call(null, config ? config.id : 'map');
	};

	/** 
	 * Renders the component.
	 *
	 * @method render
 	 * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
	 */
	this.render = function(callbackFunction)
	{
		map.render();
		
		if (callbackFunction != undefined) callbackFunction.call(null, config ? config.id : 'map');
	};
};