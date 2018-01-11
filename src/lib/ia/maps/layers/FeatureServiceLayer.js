/** 
 * The base class for AGS Feature layers.
 *
 * @author J Clare
 * @class ia.FeatureServiceLayer
 * @extends ia.FeatureLayer
 * @constructor
 * @param {String} inSource The spatial source.
 */
ia.FeatureServiceLayer = function(inSource)
{
	ia.FeatureServiceLayer.baseConstructor.call(this, inSource);

	this._firstRender = true; 			// Indicates its the first time the layer is rendered.
	this._rendering = false;   			// indicates that the layer is this._rendering.
	this._renderQueue = false;  		// indicates that there have been multiple render requests.
	this._maxRecordCount = Infinity; 	// The maximum number of features a FeatureServer will return on one request.
	this._objectIdField = ""; 			// The field that holds the object ids for features.

	this.idField = "";
	this.nameField = "";
	this.srs = 102100;
	this.esriGeometryType = "";
};
ia.extend(ia.FeatureLayer, ia.FeatureServiceLayer);

/**
 * The id field.
 *
 * @property idField
 * @type String
 * @default ""
 */
ia.FeatureServiceLayer.prototype.idField;

/**
 * The name field.
 *
 * @property nameField
 * @type String
 * @default ""
 */
ia.FeatureServiceLayer.prototype.nameField;

/**
 * The field names.
 *
 * @property fieldNames
 * @type Array[String]
 */
ia.FeatureServiceLayer.prototype.fieldNames;

/**
 * The spatial reference system.
 *
 * @property srs
 * @type Number
 * @default 102100
 */
ia.FeatureServiceLayer.prototype.srs;

/**
 * The FeatureServer geometry type, used to differentiate between multi-point and single-point features.
 *
 * @property esriGeometryType
 * @type String
 */
ia.FeatureServiceLayer.prototype.esriGeometryType;

/**
 * A list of objectids to use.
 *
 * @property objectIds
 * @type String[]
 */
ia.FeatureServiceLayer.prototype.objectIds;

/** 
 * Overrides loadSource in FeatureLayer because we dont actually
 * load anything. The layer data is loaded and rendered every time the map is redrawn.
 *
 * @param {Function} callback Optional call back function. 
 * @method loadSource
 */	
ia.FeatureServiceLayer.prototype.loadSource = function(callback) 
{
	var me = this;
	me.eval = false; // Removes eval message.

	ia.FeatureServiceReader.getInfo(me.source, ia.accessToken, function(fsInfo, token)
	{	
		me.token = token;
		me.esriGeometryType = fsInfo.geometryType;

		me._objectIdField = fsInfo.objectIdField;
		if (me._objectIdField == undefined)
		{
	   		// No object ID field explicitly defined (VF!) - find one...
			for (var f in fsInfo.fields)
			{
				if (fsInfo.fields[f].type == 'esriFieldTypeOID')
				{
					me._objectIdField = fsInfo.fields[f].name;
					break;
				}
			}
		}

		me._maxRecordCount = Infinity;
		if (fsInfo.maxRecordCount != undefined) me._maxRecordCount = ia.parseInt(fsInfo.maxRecordCount);

		// Initialise the layer items.
		me.items = {};
		me.itemArray = [];	

		me.fieldNames = [];
		for (var f in fsInfo.fields)
		{
			me.fieldNames.push(fsInfo.fields[f].name);
		}

		if (me.geometry == "line") me.symbolSize = me.style.lineWidth;

		var outFields = new Array(); // Make sure outfields dont get repeated - it breaks the query.
		outFields[outFields.length] = me._objectIdField;
		if (me.idField != me._objectIdField) outFields[outFields.length] = me.idField;
		if (me.nameField != me._objectIdField 
			&& me.nameField != me.idField) outFields[outFields.length] = me.nameField;

		var queryUrl = ia.FeatureServiceReader.buildQuery(me.source, outFields);

		// ECDC fix 15/01/15 because it has repeated features.
		// Should work ok with db-builder as objectids are not defined for layers.
		if (me.objectIds != undefined) queryUrl = queryUrl + "&objectIds="+me.objectIds;

		me._buildFeatures(queryUrl, function()
		{
			if (callback) callback.call(null); // return

			// Dispatch layer ready event.
			if (me.isLoaded == false)
			{
				me.isLoaded = true;
				me.render();
				var e = new ia.Event(ia.Event.LAYER_READY, me);
				me.dispatchEvent(e);
			}
		});
	});	
};

/** 
 * Returns the features from the feature service.
 *
 * @param {String} queryUrl The url. 
 * @param {Function} callback Optional call back function. 
 * @method _buildFeatures
 * @private
 */	
ia.FeatureServiceLayer.prototype._buildFeatures = function(queryUrl, callback) 
{
	var me = this;
	ia.FeatureServiceReader.sendQuery(queryUrl, me.token, function(fsFeatures)
	{	
		var n = fsFeatures.length;
		for (var i = 0; i < n; i++) 		
		{
			var feature = fsFeatures[i];
			var item = {};
			item.objectId = String(feature.attributes[me._objectIdField]);
			item.id = String(feature.attributes[me.idField]);
			item.name = String(feature.attributes[me.nameField]);
			item.parent = me;
			item.state = ia.ItemLayer.UNSELECTED;
			item.layer = me;
			item.symbolSize = me.symbolSize;
			item.shapes = new Array();

			// Only add if it isnt a comparison area.
			if (item.id.indexOf("#") != 0)
			{
				me.items[item.id] = item;
				me.itemArray.push(item);
			}
		}

		if (callback) callback.call(null); // return
	});
};

/** 
 * Renders the layer.
 *
 * @method render
 */
ia.FeatureServiceLayer.prototype.render = function() 
{
	if (this.map && this.getVisible() && this.isLoaded)
	{
		var me = this
		// This code allows for multiple calls to render().
		// It allows the current render to end gracefully
		// then call a new render if one was requested.

		// Check if the layer is already being rendered.
		if (this._rendering == false)
		{
			this._rendering = true;
			this._updateItems(function()
			{
				this._rendering = false;

				// If render has called multiple times this._renderQueue will be true.
				// So the layer will be re-rendered.
				if (this._renderQueue)
				{
					this._renderQueue = false;
					this.render();
				}
			}.bind(this));
		}
		else 
		{
			// If its the first time the layer is being rendered we need to
			// redraw it otherwise features will be drawn in the wrong position.
			if (this._firstRender) 
			{
				this.clear();
				this.draw();
			}

			// If render is called multiple times indicate theres a render queue.
			// The render in progress will be notified of this and will execute
			// its callbackfunction.
			this._renderQueue = true;
		}
	}
};

/** 
 * Updates the layer items.
 *
 * @method _updateItems
 * @private
 */
ia.FeatureServiceLayer.prototype._updateItems = function(callbackFunction) 
{
	// Dont bother drawing if the bBox isnt set or the layer isnt visible.
	if (this.map && this.getVisible())
	{
		var layerMinX = Infinity, layerMinY = Infinity, layerMaxX = -Infinity, layerMaxY = -Infinity;

		// Draw cached items whilst waiting for new items to to be loaded and parsed.
		this.clear();
		this.draw();

		var outFields = new Array(); // Make sure outfields dont get repeated - it breaks the query.
		outFields[outFields.length] = this._objectIdField;
		if (this.idField != this._objectIdField) outFields[outFields.length] = this.idField;
		if (this.nameField != this._objectIdField 
			&& this.nameField != this.idField) outFields[outFields.length] = this.nameField;

		// Get the data width of one pixel and use that as the maxAllowableOffset.
		var maxAllowableOffset = this.map.getDataWidth(1);

		// Hold multiple arrays containing the object ids of the features that need to be requested from the FeatureServer.
		var objectIdsToRequest = new Array();

		// Hold multiple arrays containing the items that need to be rendered.
		var itemsToRender = new Array();
		var allItemsToRender = new Array();

		var mapBBox = this.map.getBBox();
		var index = 0;

		var objectIdSubset = new Array(); 	// Holds the object ids of the features that need to be requested.
		var itemSubset = new Array();  		// Holds the items that need to be rendered.

		// Loop through the items.
		var n = this.itemArray.length;
		for (var i = 0; i < n; i++) 		
		{
			var item = this.itemArray[i];
			if (item.bBox == undefined) // Item hasnt had geometry returned yet.
			{
				itemSubset[itemSubset.length] = item;
				allItemsToRender[allItemsToRender.length] = item;
				objectIdSubset[objectIdSubset.length] = item.objectId;
				index++;
			}
			else if (item.bBox.intersects(mapBBox)) // If an item intersects the map bbox it needs to be rendered.
			{
				itemSubset[itemSubset.length] = item;
				allItemsToRender[allItemsToRender.length] = item;

				// If an item isnt of sufficient detail we need to request a more detailed version of it.
				if (item.maxAllowableOffset > maxAllowableOffset)
				{
					objectIdSubset[objectIdSubset.length] = item.objectId;
					index++;
				}
			}

			if (item.bBox != undefined)
			{
				// Calculation to find bBox of layer.
				layerMinX = (item.bBox.getXMin() < layerMinX) ? item.bBox.getXMin() : layerMinX;
				layerMinY = (item.bBox.getYMin() < layerMinY) ? item.bBox.getYMin() : layerMinY;
				layerMaxX = (item.bBox.getXMax() > layerMaxX) ? item.bBox.getXMax() : layerMaxX;                       
				layerMaxY = (item.bBox.getYMax() > layerMaxY) ? item.bBox.getYMax() : layerMaxY;
			}

			if (index == this._maxRecordCount || i == n-1 && objectIdSubset.length > 0)
			{
				objectIdsToRequest[objectIdsToRequest.length] = objectIdSubset;
				itemsToRender[itemsToRender.length] = itemSubset;

				index = 0;
				objectIdSubset = new Array();
				itemSubset = new Array();
			}
		}

		// Set the real layer bBox.
		this.bBox = new ia.BoundingBox(layerMinX, layerMinY, layerMaxX, layerMaxY);  

		if (objectIdsToRequest.length > 0)
		{
			var noRequests = objectIdsToRequest.length;
			var requestCount = 0;

			// Makes multiple requests to the FeatureServer until we have all the features.
			var me = this;
			function onFeaturesReturned(features)
			{
				if (me._firstRender && requestCount == 0) me.clear();
				me.parseData(features, maxAllowableOffset);

				// On the first render draw after each subset of features is parsed
				// so that the end user has something to look at.
				if (me._firstRender) 
				{
					me._renderItems(itemsToRender[requestCount]);

				}
				requestCount++;

				if (me._renderQueue == true)
				{
					callbackFunction.call(null);
					return;
				}

				if (requestCount == noRequests) 
				{
					// After the first complete render just render everything
					// in one go.
					if (!me._firstRender) 
					{
						me.clear();
						me._renderItems(allItemsToRender);
					}
					me.renderSelection();

					me._firstRender = false;
					callbackFunction.call(null);
				}
				else ia.FeatureServiceReader.getFeatureGeometry(me.source, me.token, objectIdsToRequest[requestCount], outFields, me.srs, maxAllowableOffset, onFeaturesReturned);
			};
			ia.FeatureServiceReader.getFeatureGeometry(me.source, me.token, objectIdsToRequest[requestCount], outFields, me.srs, maxAllowableOffset, onFeaturesReturned);
		}
		else
		{
			this.renderSelection();
			callbackFunction.call(null);
		}
	}
};

/** 
 * Parses the layerData every time the map is redrawn.
 *
 * @method parseData
 * @param {JSON} features The FeatureServer features. 
 * @param {Number} maxAllowableOffset How detailed the returned geometry should be. 
 */
ia.FeatureServiceLayer.prototype.parseData = function(features, maxAllowableOffset)
{
	var layerMinX = Infinity, layerMinY = Infinity, layerMaxX = -Infinity, layerMaxY = -Infinity;

	// Polys and lines use same code so hold the geometry type in a variable.
	var geoType = "rings";
	if (this.geometry == "line") geoType = "paths";

	// Iterate through the features.
	var fLength = features.length;

	for (var i = 0; i < fLength; i++) 		
	{
		var feature = features[i];

		// Check if the item already exists.
		var id = String(feature.attributes[this.idField]);
		var item = this.items[id];
		if (item)
		{
			item.maxAllowableOffset = maxAllowableOffset;

			if (this.geometry == "polygon" || this.geometry == "line") 
			{
				var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

				// Because sometimes the features dont have geometry.
				if (feature.geometry)
				{
					// Iterate through all rings/paths in this feature.
					var noRings = feature.geometry[geoType].length;
					var shapes = new Array();		

					for (var j = 0; j < noRings; j++) 	
					{
						var ring = feature.geometry[geoType][j];
						var noPoints = ring.length;	

						var shape = new Array();			
						var cx = 0;
						var cy = 0;

						// Iterate through all points in this ring.
						for (var k = 0; k < noPoints; k++) 
						{
							var point = ring[k];
							var p = new Object()
							p.x = point[0];
							p.y = point[1];
							shape.push(p);

							// Calculation to find bBox of item.
							minX = (p.x < minX) ? p.x : minX;
							minY = (p.y < minY) ? p.y : minY;
							maxX = (p.x > maxX) ? p.x : maxX;                       
							maxY = (p.y > maxY) ? p.y : maxY;
						}
						shapes.push(shape);
					}
					item.shapes = shapes;

					//if (this.showLabels)
					//{
						// Get the centre of gravity which can be used for labelling.
						var largestShape = this._getLargestItemShape(item);
						item.centerOfGravity = this._getCenterOfGravity(largestShape);
					//}
				}
			}
			else 
			{
				if (this.esriGeometryType ==  "esriGeometryPoint") // Point.
				{
					// Because sometimes the features dont have geometry.
					if (feature.geometry)
					{
						var p = new Object();
						p.x = feature.geometry.x;
						p.y = feature.geometry.y;
					
						// Calculation to find bBox of item.
						minX = p.x;
						minY = p.y;
						maxX = p.x;
						maxY = p.y;
						
						item.shapes = [p];
					}
				}

				else // Multi-point
				{
					// Iterate through all points in this feature.
					var noPoints = feature.geometry.points.length;
					var shapes = new Array();		

					// Because sometimes the features dont have geometry.
					if (feature.geometry)
					{
						for (var j = 0; j < noPoints; j++) 	
						{
							var point =  feature.geometry.points[j];
							var p = new Object();
							p.x = point[0];
							p.y = point[1];
						
							// Calculation to find bBox of item.
							minX = p.x;
							minY = p.y;
							maxX = p.x;                       
							maxY = p.y;

							shapes.push(shape);
						}
						item.shapes = shapes;
					}
				}
			}

			// Set the calculated item bBox.
			item.bBox = new ia.BoundingBox(minX, minY, maxX, maxY);

			// Calculation to find bBox of layer.
			layerMinX = (minX < layerMinX) ? minX : layerMinX;
			layerMinY = (minY < layerMinY) ? minY : layerMinY;
			layerMaxX = (maxX > layerMaxX) ? maxX : layerMaxX;                       
			layerMaxY = (maxY > layerMaxY) ? maxY : layerMaxY;

			item.size = Math.max(item.bBox.getWidth(), item.bBox.getHeight());
		}
	}

	// Set the real layer bBox.
	this.bBox = new ia.BoundingBox(layerMinX, layerMinY, layerMaxX, layerMaxY);  
	
	// Check if layer uses an icon.
	if (this.iconPath != "")
	{
		var me = this;
		this.icon = new Image();
		this.icon.onload = function()  {me.render();};
		this.icon.src = this.iconPath;
	}
};

/** 
 * Renders the passed items.
 *
 * @method _renderItems
 * @param {Object[]} items An array of layer items to render. 
 * @private
 */
ia.FeatureServiceLayer.prototype._renderItems = function(items)
{
	if (items == undefined) items = this.itemArray.concat();

	// Check display extent for labelling.
	var mapBBox = this.map.getBBox();
	var withinExtents = false;
	var minExtent = Math.min(mapBBox.getWidth(), mapBBox.getHeight());
	var maxExtent = Math.max(mapBBox.getWidth(), mapBBox.getHeight());
	if ((minExtent >= this.minLabelExtent) && (maxExtent <= this.maxLabelExtent)) withinExtents = true;

	var n = items.length;
	for (var i = 0; i < n; i++) 
	{
		var item = items[i];
		if ((this.geometry != "point") || (this.geometry == "point" && item.symbolSize > 0) || (this.geometry == "point" && this.displayLabelsOnly))
		{
			this.renderItem(item);
			if (this.showLabels && withinExtents) this.renderItemLabel(item);
		}
	}
};