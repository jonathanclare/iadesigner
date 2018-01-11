/** 
 * For handling Background Tile layers.
 *
 * @author J Clare
 * @class ia.TileLayer
 * @extends ia.LayerBase
 * @constructor
 * @param {String} inSource The spatial source.
 */
ia.TileLayer = function(inSource)
{
	ia.TileLayer.baseConstructor.call(this);
	
	this._tileCache = [];

	this.path = "./";
	this.minExtent = -Infinity;
	this.maxExtent = Infinity;

	if (inSource != null) this.source = inSource;
};
ia.extend(ia.LayerBase, ia.TileLayer);

/**
 * The path to tiles.
 *
 * @property url
 * @type String
 * @default "./"
 */
ia.TileLayer.prototype.path;

/**
 * The minimum display extent.
 *
 * @property url
 * @type Number
 * @default -Infinity
 */
ia.TileLayer.prototype.minExtent;

/**
 * The maximum display extent.
 *
 * @property url
 * @type Number
 * @default Infinity
 */
ia.TileLayer.prototype.maxExtent;

/** 
 * The spatial data source for the layer.
 *
 * @property url
 * @type String
 */
ia.TileLayer.prototype.source;

/** 
 * Draws or renders the tiles.
 *
 * @method render
 */
ia.TileLayer.prototype.render = function()
{
	if (this.map && this.getVisible() && this.isLoaded)
	{
		this.clear();
	
		var mapBBox = this.map.getBBox();
		var displayExtent = Math.min(mapBBox.getWidth(), mapBBox.getHeight());
		
		if ((displayExtent > this.minExtent) && (displayExtent < this.maxExtent))  
		{
			var mapBBox = this.map.getBBox();
			var n = this._tileCache.length;
			for (var i = 0; i < n; i++) 
			{
				var tile = this._tileCache[i];
				if (tile.bBox.intersects(mapBBox)) this._renderTile(tile);
			}
		}
	}
};
	
/**
 * Renders a tile image.
 *
 * @method _renderTile
 * @param {Object} tile The tile object.
 * @private
 */
ia.TileLayer.prototype._renderTile = function(tile)
{	
	if (tile.image) 
	{
		var r = this.map.getPixelRect(tile.bBox);
		this.context.drawImage(tile.image, r.x, r.y, r.width, r.height);
	}
	else
	{
		var me = this;
		var img = new Image();
		img.onload = function() 
		{
			tile.image = img;
			me._renderTile(tile);
		};
		img.src = tile.path;
	}
};

/** 
 * Loads the source data.
 *
 * @method loadSource
 */	
ia.TileLayer.prototype.loadSource = function() 
{
	var me = this;

	ia.File.load(
	{
		url: me.source,
		dataType: "json", 
		onSuccess:function(json)
		{
			me.parseData(json);
			me.isLoaded = true;
			me.render();

			var e = new ia.Event(ia.Event.LAYER_READY, me);
			me.dispatchEvent(e);
		}
	});
};

/** 
 * Parses the data after its completed loading.
 *
 * @method parseData
 * @param {JSON} data The raw data. 
 */
ia.TileLayer.prototype.parseData = function(data)
{
	var suffix = "/"
	if (this.path.indexOf(suffix, this.path.length - suffix.length) == -1) this.path = this.path + suffix;

	var dirPath = ia.File.getFileDirectory(this.source) + this.path;

	// This is the bBox that is used to adjust the layer coords and not the true bBox of the layer.
	var bb = data.boundingBox.split(" ");
	var bBox = new ia.BoundingBox(parseFloat(bb[0]),parseFloat(bb[1]),parseFloat(bb[2]),parseFloat(bb[3]));  

	var pixelWidth = parseFloat(data.pixelWidth);  
	var pixelHeight = parseFloat(data.pixelHeight);  
	var bBoxW = (data.tileWidth / pixelWidth) * bBox.getWidth();
	var bBoxH = (data.tileHeight / pixelHeight) * bBox.getHeight();

	var me = this;
	// Iterate through map tiles.
	$j.each(data.tiles, function(i,tile)
	{
		// Convert bBox to real coords.
		var minX = bBox.getXMin() + ((tile.x / pixelWidth) * bBox.getWidth());
		var maxX = minX + bBoxW;
		var maxY = bBox.getYMax() - ((tile.y / pixelHeight) * bBox.getHeight()); // tile.y is the top left pixel value.
		var minY = maxY - bBoxH;
	
		var tileObj = {};
		tileObj.id = tile.id;
		tileObj.bBox = new ia.BoundingBox(minX, minY, maxX, maxY);
		tileObj.path = dirPath+tileObj.id+"."+data.tileExtension;
		me._tileCache[me._tileCache.length] = tileObj;
	});
};