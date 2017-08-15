/** 
 * Contains information about a map file which has been published 
 * through the InstantAtlas publisher.
 *
 * @author J Clare
 * @class ia.MapData
 * @extends ia.EventDispatcher
 * @constructor
 */
ia.MapData = function(report)
{		
	ia.MapData.baseConstructor.call(this);
	
	this._report = report;
	this._layerCount = -1;
	this._visibleLayers = new Array();
	this._callbackFnc = undefined;
	this._layerHash = new Object();
	this._layerProperties = new Object();

	this.tilePath = "./";
	this.useGoogleMaps = false;
	this.path = "";
	this.maintainLayerOrder = false;
};
ia.extend(ia.EventDispatcher, ia.MapData);

/** 
 * The template number.
 *
 * @property template
 * @type String
 */
ia.MapData.prototype.template;

/** 
 * Indicates layer order should be maintained.
 *
 * @property maintainLayerOrder
 * @type Boolean
 * @default false
 */
ia.MapData.prototype.maintainLayerOrder;

/** 
 * The version number.
 *
 * @property version
 * @type String
 */
ia.MapData.prototype.version;

/** 
 * The maps bounding box.
 *
 * @property mapBBox
 * @type ia.BoundingBox
 */
ia.MapData.prototype.mapBBox;

/** 
 * All layers.
 *
 * @property layers
 * @type ia.LayerBase[]
 */
ia.MapData.prototype.layers;

/** 
 * Base layers.
 *
 * @property baseLayers
 * @type ia.LayerBase[]
 */
ia.MapData.prototype.baseLayers;

/** 
 * The current base layer.
 *
 * @property baseLayer
 * @type ia.LayerBase
 */
ia.MapData.prototype.baseLayer;

/** 
 * None Base layers.
 *
 * @property noneBaseLayers
 * @type ia.LayerBase[]
 */
ia.MapData.prototype.noneBaseLayers;

/** 
 * The image layers.
 *
 * @property imageLayers
 * @type ia.ImageLayer[]
 */
ia.MapData.prototype.imageLayers;
/** 
 * Icon layers.
 *
 * @property iconLayers
 * @type ia.LayerBase[]
 */
ia.MapData.prototype.iconLayers;

/** 
 * The path to tiles for tile layers.
 *
 * @property tilePath
 * @type String
 */
ia.MapData.prototype.tilePath;

/** 
 * Set to true if using google maps.
 *
 * @property useGoogleMaps
 * @type Boolean
 * @default false
 */
ia.MapData.prototype.useGoogleMaps;

/** 
 * The google map type.
 *
 * @property googleMapType
 * @type String
 */
ia.MapData.prototype.googleMapType;

/** 
 * The google map api key.
 *
 * @property googleApiKey
 * @type String
 */
ia.MapData.prototype.googleApiKey;
	
/** 
 * The url of the data source.
 *
 * @property url
 * @type String
 */
ia.MapData.prototype.url;

/** 
 * The directory path to the data source.
 *
 * @property path
 * @type String
 * @default ""
 */
ia.MapData.prototype.path;

/** 
 * Loads and parses the source file then calls the given function with the ReportConfig object
 * as the first parameter.
 *
 * @method parseData
 * @param {String} url The url to the data. 
 * @param {Function} callbackFunction The call back function. 
 */
ia.MapData.prototype.loadSource = function(url, callbackFunction) 
{
	var me = this;
	this.url = url;
	this.path = ia.File.getFileDirectory(url);

	ia.File.load(
	{
		url: url,
		dataType: "json", 
		onSuccess:function(json)
		{
			me.parseData(json, callbackFunction);
		}
	});
};

/** 
 * Returns the layer that corresponds to the id.
 * 
 * @method getLayer
 * @param {String} id The layer id.
 * @return {ia.LayerBase} The layer for the given id.
 */
ia.MapData.prototype.getLayer = function(id) 
{
	return this._layerHash[id];
};

/** 
 * Updates the data.
 *
 * @method parseData
 * @param {JSON} data The raw data. 
 * @param {Function} callbackFunction The call back function. 
 */
ia.MapData.prototype.parseData = function(data, callbackFunction)
{
	this._layerCount = -1;
	this.useGoogleMaps = false;
	this._callbackFnc = callbackFunction;

	// delete any previous layers
	for (var id in this._layerHash) 
	{
		delete this._layerHash[id];
	};

	this._visibleLayers = new Array();
	this.layers = new Array();
	this.baseLayers = new Array();
	this.noneBaseLayers = new Array(); // Image and contextual.
	
	this.imageLayers = new Array();
	var contextualLayers = new Array();
	var referenceLayers = new Array();
	var pointLayers = new Array();
	var lineLayers = new Array();
	var polygonLayers = new Array();
	
	this._layerHash = new Object();
	this._layerProperties = new Object();
	
	// Map properties.
	if (data.template != undefined) this.template = data.template;
	if (data.version != undefined) this.version = data.version;
	if (data.boundingBox != undefined) 
	{
		var bb = data.boundingBox.split(" ");
		this.mapBBox = new ia.BoundingBox(parseFloat(bb[0]),
					parseFloat(bb[1]),
					parseFloat(bb[2]),
					parseFloat(bb[3]));  
	}

	if (this._report.config.template == ia.DOUBLE_BASELAYER_REPORT 
		|| this._report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
	{
		// Added this so that AGOL db-builder would work for double base layer templates.
		this.maintainLayerOrder = false;
	}
	else if (data.maintainLayerOrder != undefined) 
	{
		this.maintainLayerOrder = data.maintainLayerOrder;
	}
	
	// Layers.
	var layers = data.layers;
	if (layers != undefined) 
	{				
		// Check for google layer first.
		var n = layers.length;
		for (var i = 0; i < n; i++) 
		{ 
			var layerData = layers[i];
			if (layerData.type == "google-layer" && navigator.onLine) 
			{
				this.useGoogleMaps = true;
				this.googleMapType = layerData.mapType;
				this.googleApiKey =  layerData.apiKey;
			}
		}
		
		for (var i = 0; i < n; i++) 
		{ 
			var layerData = layers[i];				

			// Ignore background layers when using google maps.
			if (layerData.geometry == "image" && this.useGoogleMaps == false)
			{
				var layer;

				if (layerData.type == "tile-layer")
				{
					layer = new ia.TileLayer(this.path+layerData.url);
					layer.path = this.tilePath;
					this.setLayerJson(layerData, layer);
				}
				else if (layerData.type == "ags-layer" && navigator.onLine)
				{
					layerData.url = ia.FeatureServiceReader.getFeatureServiceUrl(layerData.url);
					if (layerData.tile == true)
 						layer = new ia.WebTileLayer(layerData.url);
					else 
						layer = new ia.AGSLayer(layerData.url);
					this.setLayerJson(layerData, layer);
				}
				else if (layerData.type == "wms-layer" && navigator.onLine)
				{
					layer = new ia.WMSLayer();
					this.setLayerJson(layerData, layer);
				}
					
				if (layerData.isReference) 
				{
					layer.isReference = true;
					referenceLayers[referenceLayers.length] = layer;
				}
				else this.imageLayers[this.imageLayers.length] = layer;

			}
			if (layerData.geometry != "image")
			{
				var layer;

				var isGeoJsonLayer = false;
				var isFeatureServiceLayer = false;

				if (layerData.dataType != undefined) 
				{
					isGeoJsonLayer = (layerData.dataType == 'geoJson');
					//isFeatureServiceLayer = (layerData.dataType == 'featureService');
				}
				else 
					isFeatureServiceLayer = (layerData.idField != undefined);

				if (layerData.type == "base-layer")
				{
					if (isGeoJsonLayer)
						layer = new ia.GeoJsonLayer(layerData.url);
					else if (isFeatureServiceLayer)
						layer = new ia.FeatureServiceLayer(layerData.url);
					else
						layer = new ia.FeatureLayer(this.path+layerData.url);
					
					this.baseLayers[this.baseLayers.length] = layer;
					
					// Make first base layer the active layer.
					if (this.baseLayers.length == 1) this.baseLayer = layer;
				}
				else if (layerData.type == "contextual-layer")
				{
					if (isGeoJsonLayer)
						layer = new ia.GeoJsonLayer(layerData.url);
					else if (isFeatureServiceLayer)
						layer = new ia.FeatureServiceLayer(layerData.url);
					else
						layer = new ia.FeatureLayer(this.path+layerData.url);
				}
				else if (layerData.type == "rss-layer")
				{
					layer = new ia.GeoRSSLayer(layerData.url);
				}

				this.setLayerJson(layerData, layer);
				
				// Remove extra base layers from visible layers list 
				// so theyre not loaded at startup. And set to invisible.
				if (layerData.type == "base-layer" && this.baseLayers.length > 1) 
				{
					var layer = this._visibleLayers.pop();

					// This was originally commented out but it caused a bug
					// where if the second base layer was point data you couldnt
					// select the first base layer in the map.
					layer.setVisible(false);
				}
				
				if (layerData.type != "base-layer")
				{
					contextualLayers[contextualLayers.length] = layer;
					if (layer.geometry == "point") pointLayers[pointLayers.length] = layer;
					else if (layer.geometry == "line") lineLayers[lineLayers.length] = layer;
					else if (layer.geometry == "polygon") polygonLayers[polygonLayers.length] = layer;
				}

				this._layerHash[layer.id] = layer;
			}
			if (this.maintainLayerOrder && layerData.isReference != true) 
			{
				this.layers[this.layers.length] = layer;
				if (layerData.type != "base-layer") this.noneBaseLayers[this.noneBaseLayers.length] = layer;
			}
		}

		if (data.maintainContextualLayerOrder) // For azure stuff.
		{
			contextualLayers.reverse();

			// None base layers.
			this.noneBaseLayers = this.imageLayers.concat(contextualLayers).concat(referenceLayers);

			// Add the base layers in the correct position.
			for (var i = this.baseLayers.length-1; i >= 0; i--) 
			{
				var layer = this.baseLayers[i];
				if (layer.geometry == "point") 			contextualLayers.push(layer);
				else if (layer.geometry == "line") 		contextualLayers.push(layer);
				else if (layer.geometry == "polygon") 	contextualLayers.unshift(layer);
			}

			this.layers = this.imageLayers.concat(contextualLayers).concat(referenceLayers);
		}
		else if (!this.maintainLayerOrder)
		{
			// None base layers.
			this.noneBaseLayers = this.imageLayers.concat(polygonLayers)
					.concat(lineLayers)
					.concat(pointLayers)
					.concat(referenceLayers);

			// Add the base layers in the correct position.
			for (var i = this.baseLayers.length-1; i >= 0; i--) 
			{
				var layer = this.baseLayers[i];
				if (layer.geometry == "point") 			pointLayers.unshift(layer);
				else if (layer.geometry == "line") 		lineLayers.unshift(layer);
				else if (layer.geometry == "polygon") 	polygonLayers.unshift(layer);
			}

			this.layers = this.imageLayers.concat(polygonLayers)
					.concat(lineLayers)
					.concat(pointLayers)
					.concat(referenceLayers);
		}
		else
		{
			// Add reference layers.
			this.layers = referenceLayers.concat(this.layers);
			this.noneBaseLayers = referenceLayers.concat(this.noneBaseLayers);
		}
	}	

	if (this.useGoogleMaps && ia.googleMapsLoaded == false)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		
		var protocol = window.location.protocol == "file:" ? "http:" : window.location.protocol;

		if (this.googleApiKey != "")
			script.src = protocol+"//maps.googleapis.com/maps/api/js?key="+this.googleApiKey+"&sensor=false&callback=ia.initGoogleMaps";
		else
			script.src = protocol+"//maps.google.com/maps/api/js?sensor=false&callback=ia.initGoogleMaps";
			
		document.body.appendChild(script);
	}
	else this.loadVisibleLayers();
};

/** 
 * Sets the properties (JSON) for the layer with the given id.
 *
 * @method setLayerJson
 * @param {JSON} data The raw data for the layer. 
 * @param {ia.LayerBase} layer The layer. 
 * @param {Boolean} ignoreVisibility Indicates if the visibilty propert shuld be ignore. Added for db-builder map properties. 
 */
ia.MapData.prototype.setLayerJson = function(data, layer, ignoreVisibility)
{
	layer.id = data.id;
	this._layerProperties[layer.id] = data;
	layer.name = data.name; 
	layer.type = data.type; 
	layer.showInLayerList = data.showInLayerList; 
	
	// Visibility
	if (data.visible != undefined && ignoreVisibility != true) 
	{
		layer.setVisible(data.visible);

		// Base layer is included whether its visible or not so that we can read in whether its an evaluation version.
		if (data.visible == true || data.type == "base-layer") this._visibleLayers[this._visibleLayers.length] = layer;
	}	

	// Feature layers.
	if (data.displayLabelsOnly != undefined) layer.displayLabelsOnly = data.displayLabelsOnly;  
	if (data.labelPosition != undefined) layer.labelPosition = data.labelPosition;  
	if (data.labelFunction != undefined) layer.labelFunction = data.labelFunction;  
	if (data.minLabelExtent != undefined) layer.minLabelExtent = data.minLabelExtent;  
	if (data.maxLabelExtent != undefined) layer.maxLabelExtent = data.maxLabelExtent;  
	if (data.showLabels != undefined) layer.showLabels = data.showLabels;  
	if (data.showDataTips != undefined) layer.showDataTips = data.showDataTips;  
	if (data.iconPath != undefined && data.iconPath != "") 
	{
		layer.iconPath = data.iconPath;  
		if (layer.iconPath.indexOf("http") == -1 && layer.iconPath.indexOf("javascript") == -1)
			layer.iconPath = ia.IAS_PATH + layer.iconPath;
	}

	// GeoJson.
	if (data.dataType != undefined) layer.dataType = data.dataType;   		

	// AGOL FeatureServer layers.
	if (data.idField != undefined) layer.idField = data.idField;   		// GeoJson. 
	if (data.nameField != undefined) layer.nameField = data.nameField;  // GeoJson.
	if (data.srs != undefined) layer.srs = data.srs;  
	if (data.featureIds != undefined) layer.featureIds = data.featureIds; 
	if (data.objectIds != undefined) layer.objectIds = data.objectIds;   
	if (data.boundingBox != undefined) 
	{
		var bb = data.boundingBox.split(" ");
		layer.bBox = new ia.BoundingBox(parseFloat(bb[0]),
					parseFloat(bb[1]),
					parseFloat(bb[2]),
					parseFloat(bb[3])); 
	}
	if (data.themeColors != undefined) layer.themeColors = data.themeColors;  // For dashboard builder.

	// Styles
	layer.geometry = data.geometry; 
	if (data.geometry != "image")
	{	
		var style = layer.style;
		if (data.symbolSize != undefined) layer.symbolSize = data.symbolSize;
		if (data.fillColor != undefined) 
		{
			// Convert to rgba.
			style.fillStyle = ia.Color.toRGBA(data.fillColor, data.fillOpacity);
		}
		if (data.borderThickness != undefined) style.lineWidth = data.borderThickness;
		if (data.borderColor != undefined) 
		{
			// Convert to rgba.
			var alpha = 1;
			if (style.lineWidth == 0) alpha = 0
			style.strokeStyle = ia.Color.toRGBA(data.borderColor, alpha);
		}
		layer.style = style;
	}	
	else
	{
		if (data.opacity != undefined) layer.opacity = data.opacity;
	}
	
	// WMS / AGS layers.
	if (data.url != undefined) layer.url = data.url;  
	if (data.layers != undefined) layer.layers = data.layers;  
	if (data.srs != undefined) layer.srs = data.srs;  
	if (data.version != undefined) layer.version = data.version;  
	if (data.params != undefined) layer.params = data.params;  
	if (data.requiresAxisSwitch != undefined) layer.requiresAxisSwitch = data.requiresAxisSwitch;  
	
	// Tile layers
	if (data.minExtent != undefined) layer.minExtent = data.minExtent;  
	if (data.maxExtent != undefined) layer.maxExtent = data.maxExtent;  	
};

/** 
 * Gets the layer properties (JSON) for the layer with the given id.
 *
 * @method getLayerJson
 * @param {String} layerId The ralayer id. 
 * @return {JSON} The layer JSON. 
 */
ia.MapData.prototype.getLayerJson = function(layerId)
{
	return this._layerProperties[layerId]
};

/** 
 * Loads the visible data layers.
 *
 * @method loadVisibleLayers
 */
ia.MapData.prototype.loadVisibleLayers = function()
{
	this._layerCount++;
	var me = this;

	// Ensures all layers are loaded before moving on.
	if (this._visibleLayers.length > this._layerCount)
	{
		var layer = this._visibleLayers[this._layerCount];
		layer.addEventListener(ia.Event.LAYER_READY, function ()
		{
			me.loadVisibleLayers();
		});
		layer.loadSource();
	}
	else
	{
		// callback function
		this._callbackFnc.call(null, this);
		me.dispatchEvent(new ia.DataEvent(ia.DataEvent.MAP_DATA_CHANGED, me));
	}
};