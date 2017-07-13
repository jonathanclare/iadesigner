/** 
 * For handling Web Tile layers.
 * 
 * @author J Clare
 * @class ia.WebTileLayer
 * @extends ia.LayerBase
 * @constructor
 * @param {String} url The url of the map service.
 */
ia.WebTileLayer = function(url)
{
	ia.WebTileLayer.baseConstructor.call(this);

	this._tileCache = [];
	this._noTiles = 0;

	// Default tile info - works for openstreetmap and esri.
	this._tileInfo = 
	{
		rows : 256, 
		cols : 256,
		origin : 
		{
			x 	: -20037508.342787,
			y 	: 20037508.342787
		},
		lods : 
		[
			{"level" : 0, "resolution" : 156543.033928, "scale" : 591657527.591555}, 
			{"level" : 1, "resolution" : 78271.5169639999, "scale" : 295828763.795777}, 
			{"level" : 2, "resolution" : 39135.7584820001, "scale" : 147914381.897889}, 
			{"level" : 3, "resolution" : 19567.8792409999, "scale" : 73957190.948944}, 
			{"level" : 4, "resolution" : 9783.93962049996, "scale" : 36978595.474472}, 
			{"level" : 5, "resolution" : 4891.96981024998, "scale" : 18489297.737236}, 
			{"level" : 6, "resolution" : 2445.98490512499, "scale" : 9244648.868618}, 
			{"level" : 7, "resolution" : 1222.99245256249, "scale" : 4622324.434309}, 
			{"level" : 8, "resolution" : 611.49622628138, "scale" : 2311162.217155}, 
			{"level" : 9, "resolution" : 305.748113140558, "scale" : 1155581.108577}, 
			{"level" : 10, "resolution" : 152.874056570411, "scale" : 577790.554289}, 
			{"level" : 11, "resolution" : 76.4370282850732, "scale" : 288895.277144}, 
			{"level" : 12, "resolution" : 38.2185141425366, "scale" : 144447.638572}, 
			{"level" : 13, "resolution" : 19.1092570712683, "scale" : 72223.819286}, 
			{"level" : 14, "resolution" : 9.55462853563415, "scale" : 36111.909643}, 
			{"level" : 15, "resolution" : 4.77731426794937, "scale" : 18055.954822}, 
			{"level" : 16, "resolution" : 2.38865713397468, "scale" : 9027.977411}, 
			{"level" : 17, "resolution" : 1.19432856685505, "scale" : 4513.988705}, 
			{"level" : 18, "resolution" : 0.597164283559817, "scale" : 2256.994353}, 
			{"level" : 19, "resolution" : 0.298582141647617, "scale" : 1128.497176}
		]
    };

    this._fullExtent = 
    {
    	'xmin':-20037507.067161843,
    	'ymin':-19971868.880408604,
    	'xmax':20037507.067161843,
    	'ymax':19971868.8804085
    };

    // Get the tile info if its a standard map service.
	if (url.indexOf('MapServer') != -1)
	{
		var me = this;
		ia.FeatureServiceReader.getInfo(url, ia.accessToken, function(fsInfo, token)
		{
			me.token = token;
			me._tileInfo = fsInfo.tileInfo;
			me._fullExtent = fsInfo.fullExtent;
			me.isLoaded = true;
			me.render();
		});
	}
	else this.isLoaded = true;
};
ia.extend(ia.LayerBase, ia.WebTileLayer);
 
ia.WebTileLayer.prototype._noTiles = 0;
ia.WebTileLayer.prototype._tileCache = [];
ia.WebTileLayer.prototype._renderTimeout = undefined;	

/** 
 * Draws or renders the tiles.
 *
 * @method render
 */
ia.WebTileLayer.prototype.render = function()
{
	var me = this;

	if (me.map && me.getVisible() && me.isLoaded)
	{
		var protocol = window.location.protocol == "file:" ? "http:" : window.location.protocol;

		// Draw cached images straight away to avoid blank background.
		me.clear();
		me.draw(me.context);

		clearTimeout(me._renderTimeout);
		me._renderTimeout = setTimeout(function()
		{
			// Resolution of one pixel (meters).
			var res = me.map.getDataWidth(1);

			// Get the closest zoom level.
			var lods = me._tileInfo.lods;
			var lod = lods[0]; 
            var diff = Math.abs(res - lod.resolution);
            for (var i = 0; i < lods.length; i++) 
            {
                var newdiff = Math.abs(res - lods[i].resolution);
                if (newdiff < diff) 
                {
                    diff = newdiff;
                    lod = lods[i];
                }
            }

			// Real world tile dimensions (meters).
			var realTileWidth 	= lod.resolution * me._tileInfo.rows;
			var realTileHeight 	= lod.resolution * me._tileInfo.cols;

			// Adjust bbox so we dont go outside tile coverage.
			var origin = me._tileInfo.origin;
			var bb = me.map.getBBox();
			var x1 = Math.max(bb.getXMin(), me._fullExtent.xmin);
			var y1 = Math.min(bb.getYMax(), me._fullExtent.ymax); 
			var x2 = Math.min(bb.getXMax(), me._fullExtent.xmax);
			var y2 = Math.max(bb.getYMin(), me._fullExtent.ymin); 

			// Find tiles to use (tiles start from top left corner).
			var startCol = Math.floor((x1 - origin.x) / realTileWidth);
			var startRow = Math.floor((origin.y - y1) / realTileHeight);
			var endCol = Math.floor((x2 - origin.x) / realTileWidth);
			var endRow = Math.floor((origin.y - y2) / realTileHeight);

			if (startCol < 0) startCol = 0;
			if (startRow < 0) startRow = 0;

			//var nTiles = Math.pow(2, lod.level);
			//if (endCol > nTiles) endCol = nTiles;
			//if (endRow > nTiles) endRow = nTiles;
			//ia.log(nTiles)

			me._noTiles = ((endCol + 1) - startCol) * ((endRow + 1) - startRow);

			//ia.log("level: "+lod.level);
			//ia.log("col: "+startCol+" - "+endCol);
			//ia.log("row: "+startRow+" - "+endRow);
			//ia.log("tiles: "+me._noTiles);

			// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
			// Generally several subdomains (server names) are provided to get around 
			// browser limitations on the number of simultaneous HTTP connections to each host. 
			// Browser-based applications can thus request multiple tiles from multiple 
			// subdomains faster than from one subdomain.
			var serverIndex = 0;
			var servers = [];
			if (me.url.indexOf('OpenStreetMap') != -1) servers = ['a', 'b', 'c'];
			else if (me.url.indexOf('MapQuest') != -1) servers = ['1', '2', '3', '4'];

			// Create tiles.
			me._tileCache = [];
			for (var i = startCol; i <= endCol; i++)  
			{
				for (var j = startRow; j <= endRow; j++)  
				{
					var tile = {};

					var tileXMin = origin.x + (i * realTileWidth);
					var tileYMax = origin.y - (j * realTileHeight);
					var tileXMax = tileXMin + realTileWidth;
					var tileYMin = tileYMax - realTileHeight;

					if (me.url.indexOf('OpenStreetMap') != -1) 		// openstreetmap.
					{
						// eg. "http://[server].tile.openstreetmap.org/[level]/[col]/[row].png
						tile.url = protocol+'//'+servers[serverIndex]+'.tile.openstreetmap.org/'+lod.level+'/'+i+'/'+j+'.png';
					}
					else if (me.url.indexOf('MapQuestSat') != -1)  	// mapquest satellite.
					{
						// eg. "http://otile[server].mqcdn.com/tiles/1.0.0/sat/[level]/[col]/[row].png
						tile.url = protocol+'//otile'+servers[serverIndex]+'.mqcdn.com/tiles/1.0.0/sat/'+lod.level+'/'+i+'/'+j+'.png';
					}
					else if (me.url.indexOf('MapQuestOsm') != -1)  	// mapquest osm.
					{
						// eg. "http://otile[server].mqcdn.com/tiles/1.0.0/osm/[level]/[col]/[row].png
						tile.url = protocol+'//otile'+servers[serverIndex]+'.mqcdn.com/tiles/1.0.0/osm/'+lod.level+'/'+i+'/'+j+'.png';
					}
					else 											// esri map service.
					{
						// eg. http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/[level]/[row]/[col]
						tile.url = me.url+'/tile/'+lod.level+'/'+j+'/'+i;
					}

					// Add token if required.
					if (me.token != undefined) tile.url += '?token=' + me.token;

					tile.bBox = new ia.BoundingBox(tileXMin, tileYMin, tileXMax, tileYMax);
					me._loadTile(tile);

					serverIndex++
					if (serverIndex >= servers.length) serverIndex = 0;
				}
			}
		}, 100);
	}
};

/**
 * Draws the image without reloading it.
 *
 * @method draw
 * @param {HTML Canvas Context} ctx The context to render to.
 */
ia.WebTileLayer.prototype.draw = function(ctx)
{
	for (var i = 0; i < this._tileCache.length; i++)  
	{
		this._drawTile(this._tileCache[i])
	}
};

ia.WebTileLayer.prototype._drawTile = function(tile)
{
	if (tile.img) 
	{
		this.context.save();
		this.context.globalAlpha = this.opacity;
		var r = this.map.getPixelRect(tile.bBox);
		this.context.drawImage(tile.img, r.x, r.y, r.width, r.height);
		this.context.restore();
	}
};

ia.WebTileLayer.prototype._loadTile = function(tile)
{	
	var me = this;

	var img = new Image();
	img.onload = function() 
	{
		tile.img = this;
		me._tileCache.push(tile);
		me._drawTile(tile);

		// Make sure previous layers are fully removed once all new tiles are loaded. 
		// Because if tiles are transparent (reference layers) you can see previous tiles through them.
		if (me._tileCache.length >= me._noTiles) 
		{
			me.clear();
			me.draw(me.context);
		}
	};

	if (!me.exportable)
	{
		img.src = ia.getDomainSafeUrl(tile.url);
	}
	else
	{
		// Get image as data (implemented so that images could be exported in canvas).
		var xhr = new XMLHttpRequest();
		xhr.onload = function(e) 
		{
			if (this.status == 200) 
			{
				var uInt8Array = new Uint8Array(this.response);
				var i = uInt8Array.length;
				var binaryString = new Array(i);
				while (i--)
				{
					binaryString[i] = String.fromCharCode(uInt8Array[i]);
				}
				var data = binaryString.join('');
				var base64 = window.btoa(data);
				img.src = "data:image/png;base64,"+base64;
			}
			else
			{
				me._noTiles--;
				if (me._tileCache.length >= me._noTiles) 
				{
					me.clear();
					me.draw(me.context);
				}
			}
		};
		xhr.onerror = function(e) 
		{
			// Backup if WMS has incorrect headers for CORS.
			me.exportable = false;
			me.render();
		};
		xhr.open('GET', ia.getDomainSafeUrl(tile.url), true);
		xhr.responseType = 'arraybuffer';
		xhr.send();
	}
};