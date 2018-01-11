/** 
 * The base class for Image layers - ags and wms.
 *
 * @author J Clare
 * @class ia.ImageLayer
 * @extends ia.LayerBase
 * @constructor
 */
ia.ImageLayer = function()
{
	ia.ImageLayer.baseConstructor.call(this, "");

	var me = this;
	
	$j.support.cors = true;

	this.url = "";
	this.params = "";
	this.layers = "";
	this.srs = "";
	this.version = "";
	this.opacity = 1;
	this._items = new Array();

};
ia.extend(ia.LayerBase, ia.ImageLayer);

/**
 * The url.
 *
 * @property url
 * @type String
 * @default ""
 */
ia.ImageLayer.prototype.url;

/**
 * Any additional params.
 *
 * @property params
 * @type String
 * @default ""
 */
ia.ImageLayer.prototype.params;

/**
 * Determines which layers appear on the exported map.
 *
 * @property layers
 * @type String
 * @default ""
 */
ia.ImageLayer.prototype.layers;

/**
 * The spatial reference system. 
 *
 * @property srs
 * @type String
 * @default ""
 */
ia.ImageLayer.prototype.srs;

/**
 * The version number. 
 *
 * @property version
 * @type String
 * @default ""
 */
ia.ImageLayer.prototype.version;

/**
 * The opacity of the layer. 
 *
 * @property opacity
 * @type Number
 * @default 1
 */
ia.ImageLayer.prototype.opacity;

/** 
 * Renders the image.
 *
 * @method render
 */
ia.ImageLayer.prototype._items = [];
ia.ImageLayer.prototype._renderTimeout = undefined;
ia.ImageLayer.prototype.render = function() 
{
	var me = this;
	if (me.map && me.getVisible())  
	{
		// Draw cached images straight away to avoid blank background.
		me.clear();
		me.draw(me.context);

		clearTimeout(this._renderTimeout);
		this._renderTimeout = setTimeout(function()
		{

				// Check if the bounding box has changed.
				var bb = me.map.getBBox();
				var bBoxChanged = true;
				if (me._items.length > 0)
				{
					var item = me._items[me._items.length-1];
					if (bb.equals(item.bbox)) bBoxChanged = false;
				}

				// Only load a new image if the bounding box has changed.
				if (bBoxChanged)
				{
					// Remove older items to prevent array getting too long
					while(me._items.length > 10)  me._items.shift();

					// Draw image on load.
					var item = {};
					item.img = new Image();
					item.bbox = bb.clone()

					// On image load.
					item.img.onload = function() 
					{
						me._items[me._items.length] = item;
						me.clear();
						me.draw(me.context);
					};

					if (!me.exportable)
					{
						var url = me.getUrl(item.bbox, me.map.canvasWidth, me.map.canvasHeight)
						item.img.src = ia.getDomainSafeUrl(url);
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
								item.img.src = "data:image/png;base64,"+base64;
							}
						};
						xhr.onerror = function(e) 
						{
							// Backup if WMS has incorrect headers for CORS.
							me.exportable = false;
							me.render();
						};
						var url = me.getUrl(item.bbox, me.map.canvasWidth, me.map.canvasHeight)
						xhr.open('GET', ia.getDomainSafeUrl(url), true);
						xhr.responseType = 'arraybuffer';
						xhr.send();
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
ia.ImageLayer.prototype.draw = function(ctx)
{
	try 
	{		
		if (this._items.length > 0)
		{
			var item = this._items[this._items.length-1];
			var r = this.map.getPixelRect(item.bbox);

			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(item.img, r.x, r.y, r.width, r.height);
			ctx.restore()
		}
	} 
	catch (error) 
	{
		ia.log(error)
	}
};

/**
 * Returns the required url.
 * 
 * @method getUrl
 * @return The url for retrieving the layer info.
 */
ia.ImageLayer.prototype.getUrl = function(bb, w, h) {};