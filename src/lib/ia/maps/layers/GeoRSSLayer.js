/** 
 * The base class for geoRSS layers.
 *
 * @author J Clare
 * @class ia.GeoRSSLayer
 * @extends ia.FeatureLayer
 * @constructor
 * @param {String} inSource The spatial source.
 */
ia.GeoRSSLayer = function(inSource)
{
	ia.GeoRSSLayer.baseConstructor.call(this, inSource);
	
	// For projecting coordinates
	this._mp = new ia.GoogleMercatorProjection();
	this._layerMinX = Infinity, 
	this._layerMinY = Infinity, 
	this._layerMaxX = -Infinity, 
	this._layerMaxY = -Infinity;
	
	// IE doesnt work without this
	// http://stackoverflow.com/questions/5241088/jquery-call-to-webservice-returns-no-transport-error
	$j.support.cors = true;
};
ia.extend(ia.FeatureLayer, ia.GeoRSSLayer);

/** 
 * Loads the source data.
 *
 * @method loadSource
 */	
ia.GeoRSSLayer.prototype.loadSource = function() 
{
	var me = this;
	$j.ajax({
		url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&num=10&callback=?&q=' + encodeURIComponent(me.source),
		dataType: 'json',
		success: function onSuccess(data)
		{
			me.parseData(data.responseData.xmlString);
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
ia.GeoRSSLayer.prototype.parseData = function(data)
{
	var d = $j(data);
	this.items = {};
	this.itemArray = [];
	var me = this;

	// RSS.
	var items = d.find("item");
	$j.each(items, function(i, itemXml)
	{
		 me._toFeature(itemXml);
	});

	// ATOM.
	var items = d.find("atom\\:entry, entry")
	$j.each(items, function(i, itemXml)
    {
		 me._toFeature(itemXml);
	});

	// Set the real layer bBox.
	this.bBox = new ia.BoundingBox(this._layerMinX, this._layerMinY, this._layerMaxX, this._layerMaxY);  

	// Check if layer uses an icon.
	if (this.iconPath != "")
	{
		this.icon = new Image();
		this.icon.onload = function() {};
		this.icon.src = this.iconPath;
	}
};

/** 
 * Parses xml into a feature.
 *
 * @method _toFeature
 * @param {XML} itemXml The raw data. 
 * @private
 */
ia.GeoRSSLayer.prototype._toFeature = function(itemXml)
{
	var item = {};
	item.state = ia.ItemLayer.UNSELECTED;
	item.layer = this;

	item.id = $j(itemXml).find("guid").text();
	item.name = $j(itemXml).find("title").text();
	item.description = $j(itemXml).find("description").text();
	item.parent = this;
	item.symbolSize = this.symbolSize;

	// Convert each point back to real coords.
	var p = this._toPoint(itemXml);

	// Calculation to find bBox of item.
	minX = p.x;
	minY = p.y;
	maxX = p.x;                       
	maxY = p.y;

	item.shapes = [p];

	// Set the calculated item bBox.
	item.bBox = new ia.BoundingBox(minX, minY, maxX, maxY);
	item.size = Math.max(item.bBox.getWidth(), item.bBox.getHeight());
	this.items[item.id] = item;
	this.itemArray.push(item);

	// Calculation to find bBox of layer.
	this._layerMinX = (minX < this._layerMinX) ? minX : this._layerMinX;
	this._layerMinY = (minY < this._layerMinY) ? minY : this._layerMinY;
	this._layerMaxX = (maxX > this._layerMaxX) ? maxX : this._layerMaxX;                       
	this._layerMaxY = (maxY > this._layerMaxY) ? maxY : this._layerMaxY;
};

/** 
 * Parses xml into a point.
 *
 * @method _toPoint
 * @param {XML} itemXml The raw data. 
 * @private
 */
ia.GeoRSSLayer.prototype._toPoint = function(itemXml)
{
	// Default point.
    var p = new Object();
	p.x = 0;
	p.y = 0;

	var lng = $j(itemXml).find("geo\\:long, long");
	var lat = $j(itemXml).find("geo\\:lat, lat");
    if (lng.length > 0 && lat.length > 0)
    {
    	p.x = parseFloat($j(lng).text());
    	p.y = parseFloat($j(lat).text());
		var pp = this._mp.project(p.x, p.y, true);
        return pp;
    }

    var georssPoint = $j(itemXml).find("georss\\:point, point");
    if (georssPoint.length > 0)
    {
        var tokens = jQuery.trim($j(georssPoint).text()).split(" ");
    	p.x = parseFloat(tokens[0]);
    	p.y = parseFloat(tokens[1]);
		var pp = this._mp.project(p.x, p.y, true);
        return pp;
    }

    var gmlPoint = $j(itemXml).find("gml\\:pos, pos");
    if (gmlPoint.length > 0)
    {
        var tokens = jQuery.trim($j(gmlPoint).text()).split(" ");
    	p.x = parseFloat(tokens[0]);
    	p.y = parseFloat(tokens[1]);
		var pp = this._mp.project(p.x, p.y, true);
        return pp;
    }

    return p;
};