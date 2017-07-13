/** 
 * A layer that you can add markers to.
 *
 * @author J Clare
 * @class ia.MarkerLayer
 * @extends ia.LayerBase
 * @constructor
 */
ia.MarkerLayer = function()
{
	ia.MarkerLayer.baseConstructor.call(this);
	this._markers = new Array();
};
ia.extend(ia.LayerBase, ia.MarkerLayer);
	
/** 
 * Adds a new marker
 *
 * @method addMarker
 * @param {Image} icon The icon.
 * @param {Number} x The x-coord.
 * @param {Number} y The y-coord.
 */
ia.MarkerLayer.prototype.addMarker = function(icon, x, y)
{
	var marker = {};
	marker.icon = icon;
	marker.x = x;
	marker.y = y;
	this._markers[this._markers.length] = marker;
};

/** 
 * Clears all the markers.
 *
 * @method clearMarkers
 */
ia.MarkerLayer.prototype.clearMarkers = function()
{
	this._markers = new Array();
	this.clear();
};

/** 
 * Renders the layer.
 *
 * @method render
 */
ia.MarkerLayer.prototype.render = function() 
{
	this.clear();
	for (var i = 0; i < this._markers.length; i++) 		
	{
		var marker = this._markers[i];
		var px = this.map.getPixelX(marker.x) - (marker.icon.width / 2);
		var py = this.map.getPixelY(marker.y) - (marker.icon.height);
		this.context.drawImage(marker.icon, px, py);
	}
};