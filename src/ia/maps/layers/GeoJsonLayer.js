/** 
 * The base class for geojson layers.
 *
 * @author J Clare
 * @class ia.GeoJsonLayer
 * @extends ia.FeatureLayer
 * @constructor
 * @param {String} inSource The spatial source.
 */
ia.GeoJsonLayer = function(inSource)
{
	ia.GeoJsonLayer.baseConstructor.call(this, inSource);
	this.idField = 'OBJECTID';
	this.nameField = 'NAME';
};
ia.extend(ia.FeatureLayer, ia.GeoJsonLayer);

/**
 * The id field.
 *
 * @property idField
 * @type String
 * @default "OBJECTID"
 */
ia.FeatureServiceLayer.prototype.idField;

/**
 * The name field.
 *
 * @property nameField
 * @type String
 * @default "NAME"
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
 * Parses the json after its completed loading.
 *
 * @method parseData
 * @param {JSON} json The raw json. 
 */
ia.GeoJsonLayer.prototype.parseData = function(json)
{
	if (json == undefined) json = this.data;
	else this.data = json;
	this.items = {};
	this.itemArray = [];
	this.fieldNames = [];
	this.eval = false; // Removes eval message.

	var layerMinX = Infinity, layerMinY = Infinity, layerMaxX = -Infinity, layerMaxY = -Infinity;

	// Iterate through features.
	for (var i = 0; i < json.features.length; i++) 		
	{
		var feature = json.features[i];

		// Make up the list of field names from the first 20 features (we dont need all of them).
		if (i < 20)
		{
			for (var prop in feature.properties) 
			{
				if (this.fieldNames.indexOf(prop) == -1) this.fieldNames.push(prop);
			}
		}
		
		var item = {};
		item.state 		= ia.FeatureLayer.UNSELECTED;
		item.layer 		= this;

		item.id 		= String(feature.properties[this.idField]);
		item.name 		= String(feature.properties[this.nameField]);

		// Probably dont need this but added for early testing when
		// idField and nameField werent being defined for contextual layers.
		if (feature.properties[this.idField] == undefined)
		{
			for (var prop in feature.properties) 
			{
				item.id = feature.properties[prop];
				break;
			}
		}
		if (feature.properties[this.nameField] == undefined)
		{
			for (var prop in feature.properties)
			{
				item.name = feature.properties[prop];
				break;
			}
		}

		item.parent 	= this;
		item.symbolSize = this.symbolSize;
		item.shapes 	= new Array();
		if (this.geometry == "line") item.symbolSize = this.style.lineWidth;

		var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

 		if (feature.geometry.type == 'Point')
		{
			var p = new Object();
			p.x = feature.geometry.coordinates[0];
			p.y = feature.geometry.coordinates[1];
		
			minX = p.x;
			minY = p.y;
			maxX = p.x;                       
			maxY = p.y;
			
			item.shapes = [p];
		}
 		else if (feature.geometry.type == 'LineString' || feature.geometry.type == 'MultiPoint')
		{
			var coords = feature.geometry.coordinates;
			var shape = new Array();
			for (var j = 0; j < coords.length; j++) 	
			{
				var coord = coords[j];

				var p = new Object();
				p.x = coord[0];
				p.y = coord[1];
				shape.push(p);

				minX = (p.x < minX) ? p.x : minX;
				minY = (p.y < minY) ? p.y : minY;
				maxX = (p.x > maxX) ? p.x : maxX;                       
				maxY = (p.y > maxY) ? p.y : maxY;
			}
			item.shapes.push(shape);
		}
		else if (feature.geometry.type == 'Polygon' || feature.geometry.type == 'MultiLineString')
		{ 
			var polys = feature.geometry.coordinates;
			for (var j = 0; j < polys.length; j++) 	
			{
				var shape = new Array();
				var coords = polys[j];

				// First set of coords is the polygon itself - subsequent polys are holes.
				// We need to reverse the hole coords.
				// TODO: Check if they really do need reversing.
				if (feature.geometry.type == 'Polygon' && j > 0) coords.reverse();

				for (var k = 0; k < coords.length; k++) 	
				{
					var coord = coords[k];	

					var p = new Object();
					p.x = coord[0];
					p.y = coord[1];
					shape.push(p);

					minX = (p.x < minX) ? p.x : minX;
					minY = (p.y < minY) ? p.y : minY;
					maxX = (p.x > maxX) ? p.x : maxX;                       
					maxY = (p.y > maxY) ? p.y : maxY;
				}
				item.shapes.push(shape);
			}
		}
		else if (feature.geometry.type == 'MultiPolygon')
		{
			var coordinates = feature.geometry.coordinates;
			for (var m = 0; m < coordinates.length; m++) 	
			{
				var polys = coordinates[m];
				for (var j = 0; j < polys.length; j++) 	
				{
					var shape = new Array();
					var coords = polys[j];

					// First set of coords is the polygon itself - subsequent polys are holes.
					// We need to reverse the hole coords.
					// TODO: Check if they really do need reversing.
					if (j > 0) coords.reverse();

					for (var k = 0; k < coords.length; k++) 	
					{
						var coord = coords[k];		

						var p = new Object();
						p.x = coord[0];
						p.y = coord[1];
						shape.push(p);

						minX = (p.x < minX) ? p.x : minX;
						minY = (p.y < minY) ? p.y : minY;
						maxX = (p.x > maxX) ? p.x : maxX;                       
						maxY = (p.y > maxY) ? p.y : maxY;
					}
					item.shapes.push(shape);
				}
			}
		}

		if (feature.geometry.type != 'Point')
		{
			// Get the center of gravity which can be used for labelling.
			var largestShape = this._getLargestItemShape(item);
			item.centerOfGravity = this._getCenterOfGravity(largestShape);
		}
		
		// Set the calculated item bBox.
		item.bBox = new ia.BoundingBox(minX, minY, maxX, maxY);
		item.size = Math.max(item.bBox.getWidth(), item.bBox.getHeight());
		this.items[item.id] = item;
		this.itemArray.push(item);

		// Calculation to find bBox of layer.
		layerMinX = (minX < layerMinX) ? minX : layerMinX;
		layerMinY = (minY < layerMinY) ? minY : layerMinY;
		layerMaxX = (maxX > layerMaxX) ? maxX : layerMaxX;                       
		layerMaxY = (maxY > layerMaxY) ? maxY : layerMaxY;
	}
	
	// Set the real layer bBox.
	this.bBox = new ia.BoundingBox(layerMinX, layerMinY, layerMaxX, layerMaxY);  
	
	// Check if layer uses an icon.
	if (this.iconPath != "")
	{
		this.icon = new Image();
		this.icon.onload = function() {};
		this.icon.src = this.iconPath;
	}
};