/** 
 * Creates IA data files from an AGOL web map.
 *
 * @author J Clare
 * @class ia.WebMap
 * @constructor
 */
ia.WebMap = function()
{
	this._iaData = {};
	this._iaMapData = {};
};

/** 
 * Parses the web map referenced by the url. The callbackFunction returns with
 * an iaData object and an iaMapData object.
 * 
 * @method parse
 * @param {String} url The url of the web map. 
 * @param {Function} callbackFunction The call back function. 
 */
ia.WebMap.prototype.parse = function(url, callbackFunction) 
{
	var me = this;

	// Initialise IA Data.
	this._iaData = {};
	this._iaData.version = '1.2';
	this._iaData.geographies = new Array();

	// Initialise IA MapData.
	this._iaMapData = {};
	this._iaMapData.layers = new Array();

	// Read in the web map data.
	ia.File.load(
	{
		url: url,
		dataType: "json", 
		onSuccess:function(json)
		{
			// Read in the first operational layer that we find.
			var operationalLayers = json.operationalLayers;
			if (operationalLayers != undefined && operationalLayers.length > 0)  
			{	
				me.parseOperationalLayer(operationalLayers[0], function()
				{
					callbackFunction.call(null, me._iaData, me._iaMapData); // return.
				});
			}
			else callbackFunction.call(null, me._iaData, me._iaMapData); // return. 
		}
	});
};

/** 
 * Parses an operational layer.  
 *
 * @method parseOperationalLayer
 * @param {JSON} operationalLayer The AGOL operationalLayer.
 * @param {Function} callbackFunction The call back function. 
 */
ia.WebMap.prototype.parseOperationalLayer = function(operationalLayer, callbackFunction) 
{
	var me = this;

	if (operationalLayer.url)
	{
		if (operationalLayer.type == 'CSV') 		{callbackFunction.call(null);} // return.
		else if (operationalLayer.type == 'WMS') 	{callbackFunction.call(null);} // return.
		else if (operationalLayer.type == 'KML') 	{callbackFunction.call(null);} // return.
		else if (operationalLayer.url.indexOf('FeatureServer') != -1)
		{
			// Get the feature service description and objectIds.
			me.getObjectIds(operationalLayer.url, function(fsLayerDescription, objectIds)
			{
				// The maxRecordCount is the number of features a feature service will return per request.
				// If the feature service has a maxRecordCount set we have to make multiple
				// requests to the feature service. If the maxRecordCount is greater than
				// the number of features in the feature service then we only need to make one request.

				// Set the maxRecordCount.
				var maxRecordCount = Infinity;
				if (fsLayerDescription.maxRecordCount != undefined) maxRecordCount = ia.parseInt(fsLayerDescription.maxRecordCount);
				maxRecordCount = Math.min(objectIds.length, maxRecordCount);

				// Split the objectIds to take into account the maxRecordCount.
				var idArray = new Array();
				while (objectIds.length > 0) idArray[idArray.length] = objectIds.splice(0, maxRecordCount);

				// Makes multiple requests to the feature service until all the features have been returned.
				var features = new Array();
				var noRequests = idArray.length;
				var requestCount = 0;
				function onFeaturesReturned(requestedFeatures)
				{
					// Add the returned features to our master feature array.
					features = features.concat(requestedFeatures);
					requestCount++;

					// When the requestCount is equal to the noRequests we know that 
					// all the features have been returned.
					if (requestCount == noRequests) 
					{
						// Define a new iaGeography.
						iaGeography = {};
						iaGeography.id = fsLayerDescription.id; 
						if (operationalLayer.title != undefined 
							&& operationalLayer.title != '') 	iaGeography.name = operationalLayer.title;
						else  									iaGeography.name = fsLayerDescription.name; 
						iaGeography.themes = new Array();
						iaGeography.features = new Array();
						me._iaData.geographies[me._iaData.geographies.length] = iaGeography;
						
						// Geometry.
						iaGeography.type = 'polygon'; // default.
						if (fsLayerDescription.geometryType == 'esriGeometryPolygon' )		iaGeography.type = 'polygon';
						else if (fsLayerDescription.geometryType == 'esriGeometryPoint' 
							|| fsLayerDescription.geometryType == 'esriGeometryMultipoint')	iaGeography.type = 'point';
						else if (fsLayerDescription.geometryType == 'esriGeometryPolyline') iaGeography.type = 'line';

						// Define a single iaTheme that will hold all the iaIndicators.
						var iaTheme = {};
						iaTheme.id = 't0'; 
						iaTheme.name = fsLayerDescription.name;
						iaTheme.indicators = new Array();
						iaGeography.themes[iaGeography.themes.length] = iaTheme;

						// Get id and name fields.
						var idField = fsLayerDescription.objectIdField;
						var nameField = fsLayerDescription.displayField;
						if (nameField == undefined || nameField == '') nameField = idField;

						// Iterate through the fields to create a new iaIndicators for each field.
						var nFields = fsLayerDescription.fields.length;
						for (var i = 0; i < nFields; i++) 		
						{
							var field = fsLayerDescription.fields[i];

							// Exclude id and name fields.
							if (field.name != idField && field.name != nameField) 
							{
								var iaIndicator = {};
								iaIndicator.id = field.name;
								if (field.alias != undefined && field.alias != '') 	iaIndicator.name = field.alias
								else 												iaIndicator.name = iaIndicator.id; 
								iaIndicator.values = new Array();

								iaIndicator.type = '';
								if (field.type == 'esriFieldTypeSmallInteger' 
									|| field.type == 'esriFieldTypeInteger' 
									|| field.type == 'esriFieldTypeSingle' 
									|| field.type == 'esriFieldTypeDouble' 
									|| field.type == 'esriFieldTypeInteger') 	iaIndicator.type = 'numeric';
								else if (field.type == 'esriFieldTypeString') 	iaIndicator.type = 'categoric';

								// Only include fields that are numeric or categoric.
								if (iaIndicator.type != '') iaTheme.indicators[iaTheme.indicators.length] = iaIndicator;
							}
						}

						// Iterate through the features.
						var featureLength = features.length;
						for (var i = 0; i < featureLength; i++) 		
						{
							var fsFeature = features[i];

							// Define a new iaFeature.
							var iaFeature = {};
							iaFeature.id = String(fsFeature.attributes[idField]);
							if (nameField != undefined) iaFeature.name = String(fsFeature.attributes[nameField]);
							else 						iaFeature.name = iaFeature.id

							// Add the feature to the geography.
							iaGeography.features[iaGeography.features.length] = iaFeature;

							// Iterate through the indicators to fill in the values for each feature.
							var nIndicators = iaTheme.indicators.length;
							for (var j = 0; j < nIndicators; j++) 		
							{
								iaIndicator = iaTheme.indicators[j]
								iaIndicator.values[iaIndicator.values.length] =  fsFeature.attributes[iaIndicator.id];
							}
						}

						// Build the iaMap.
						var extent = fsLayerDescription.extent;
						me._iaMapData.boundingBox = extent.xmin+" "+extent.ymin+" "+extent.xmax+" "+extent.ymax;

						// Build the ia base layer
						var iaLayer = {};
						iaLayer.idField = idField;
						iaLayer.nameField = nameField;
						iaLayer.url = operationalLayer.url;
						iaLayer.srs = extent.spatialReference.wkid;
						iaLayer.boundingBox = extent.xmin+" "+extent.ymin+" "+extent.xmax+" "+extent.ymax;
						iaLayer.id = fsLayerDescription.id;
						iaLayer.name = fsLayerDescription.name;
						iaLayer.type = "base-layer";
						iaLayer.geometry = iaGeography.type
						iaLayer.visible = true;
						iaLayer.symbolSize = 15;
						iaLayer.fillColor = "#EFEFEF";
						iaLayer.fillOpacity = fsLayerDescription.opacity || 0.8;
						iaLayer.borderColor = "#cccccc";
						iaLayer.borderThickness = 1;
						iaLayer.showLabels = false;
						iaLayer.iconPath = "";
						iaLayer.showDataTips = true;
						iaLayer.showInLayerList = true;
						me._iaMapData.layers[me._iaMapData.layers.length] = iaLayer;

						callbackFunction.call(null); // return. 
					}
					else me.getAttributeData(operationalLayer.url, idArray[requestCount], onFeaturesReturned); 
				};
				me.getAttributeData(operationalLayer.url, idArray[requestCount], onFeaturesReturned);
			});
		}
		else callbackFunction.call(null); // return.
	}
	else if (operationalLayer.featureCollection != undefined) {callbackFunction.call(null);} // return.
	else callbackFunction.call(null); // return.
};

/** 
 * The callbackfunction is returned with the feature service description and the list of objectIds.
 *
 * @method getObjectIds
 * @param {JSON} url The url of the feature service.
 * @param {Function} callbackFunction The call back function. 
 */
ia.WebMap.prototype._useToken = true;
ia.WebMap.prototype.getObjectIds = function(url, callbackFunction) 
{
	var me = this;

	// Load the feature service description.
	var queryUrl = url + '?f=json';
	if (ia.accessToken != "" && me._useToken) queryUrl += "&token=" + ia.accessToken;

	ia.File.load(
	{
		url: queryUrl,
		dataType: "json", 
		onSuccess:function(fsLayerDescription)
		{
			if (fsLayerDescription.error) // Error thrown by feature service.
			{
				ia.log(fsLayerDescription.error);

				if (fsLayerDescription.error.code == 498) 
				{
					// Error: The feature service has thrown an error because even though the web map is 
					// protected and requires a token the feature service does not, so we drop the token.
					me._useToken = false;
					return me.getObjectIds(url, callbackFunction)
				}
				else if (fsLayerDescription.error.code == 499) 
				{
					// Error: The web map is protected and requires the user to log in using oauth2 to get a token.
					var authUrl = 'https://www.arcgis.com/sharing/oauth2/authorize?client_id=83wV2txRMBrDpKjq&response_type=token&redirect_uri=' + encodeURI(window.location.href);
		            window.location.href = authUrl;
				}
			}
			else // No errors.
			{
				// Get the object ids from the feature service layer.
				var queryUrl = url + '/query?where=1+%3D+1&f=json&returnIdsOnly=true';	
				if (ia.accessToken != "" && me._useToken) queryUrl += "&token=" + ia.accessToken;
				ia.File.load(
				{
					url: queryUrl,
					dataType: "json", 
					onSuccess:function(fsLayer)
					{
						callbackFunction.call(null, fsLayerDescription, fsLayer.objectIds); // return.
					}
				});
			}
		}
	});
};

/** 
 * Gets the features and their associated attribute data for the given objectIds of a feature service.
 *
 * @method getAttributeData
 * @param {String} url The url of the feature service.
 * @return {String[]} objectIds An array of ids.
 * @param {Function} callbackFunction The call back function. 
 * @return {Object[]} A list of features and their attributes.
 */
ia.WebMap.prototype.getAttributeData = function(url, objectIds, callbackFunction) 
{
	var me = this;

	// Get the attribute data.
	// Append a query to the url - 'where=1+%3D+1' is just a hack to get back all the features.
	var url = url + '/query';

	var stringifiedJSON = 'where=1+%3D+1&f=json'
				+ '&returnGeometry=false'
				+ '&returnIdsOnly=false'
				+ '&returnCountOnly=false'
				+ '&outFields=*'
				+ '&objectIds='+objectIds;
	if (ia.accessToken != "" && me._useToken) stringifiedJSON += "&token=" + ia.accessToken;

	ia.File.load(
	{
		url: url,
		type: "POST",
		dataType: "json",
		data: stringifiedJSON, 
		onSuccess:function(fsLayer)
		{
			callbackFunction.call(null, fsLayer.features); // return.
		}
	});
};