/** 
 * For handling Web Mapping Server layers.
 *
 * <p>Mandatory parameters as of 1.3:</p>
 *
 * <p>VERSION=1.3.0
 * <br/>REQUEST=GetMap
 * <br/>LAYERS=layer_list
 * <br/>STYLES=style_list
 * <br/>CRS=namespace:identifier
 * <br/>BBOX=minx,miny,maxx,maxy
 * <br/>WIDTH=output_width
 * <br/>HEIGHT=output_height
 * <br/>FORMAT=output_format</p> 
 *
 * @author J Clare
 * @class ia.WMSLayer
 * @extends ia.ImageLayer
 * @constructor
 */
ia.WMSLayer = function()
{
	ia.WMSLayer.baseConstructor.call(this);
	this.requiresAxisSwitch = false;
};
ia.extend(ia.ImageLayer, ia.WMSLayer);
 	
/**
 * Should the axes be switched (bizarre but true!).
 *
 * @property requiresAxisSwitch
 * @type Boolean
 * @default false
 */
ia.WMSLayer.prototype.requiresAxisSwitch;

/**
 * Returns the required url.
 *
 * @method getUrl
 * @return {String} The url for retrieving the wms image.
 */
ia.WMSLayer.prototype.getUrl = function(bb, w, h)
{
	var imageUrl = this.url;			

	if (this.url.indexOf("?") == -1) imageUrl += "?";

	if ((this.url.charAt(this.url.length - 1) != "&")
	&& (this.url.charAt(this.url.length - 1) != "?")) imageUrl += "&";

	if (this.requiresAxisSwitch == true)	
		imageUrl += "request=GetMap&bbox=" + bb.getYMin() + "," + bb.getXMin()  + "," + bb.getYMax() + "," + bb.getXMax();
	else
		imageUrl += "request=GetMap&bbox=" + bb.getXMin() + "," + bb.getYMin()  + "," + bb.getXMax() + "," + bb.getYMax();

	if (this.params.toLowerCase().indexOf("layers=") < 0)
		imageUrl += "&layers=" + this.layers;

	if (this.params.toLowerCase().indexOf("srs=") < 0)
		imageUrl += "&srs=" + this.srs;

	if (this.params.toLowerCase().indexOf("crs=") < 0)
		imageUrl += "&crs=" + this.srs;

	if (this.params.toLowerCase().indexOf("width=") < 0)
		imageUrl += "&width=" + Math.round(w);

	if (this.params.toLowerCase().indexOf("height=") < 0)
		imageUrl += "&height=" + Math.round(h);

	if (this.params.toLowerCase().indexOf("version=") < 0)
		imageUrl += "&version=" + this.version;

	if (this.params.toLowerCase().indexOf("format=") < 0)
		imageUrl += "&format=image/jpeg";

	if (this.params.toLowerCase().indexOf("exceptions=") < 0)
		imageUrl += "&exceptions=application/vnd.ogc.se_blank";

	if (this.params.toLowerCase().indexOf("service=") < 0)
		imageUrl += "&service=WMS";

	if (this.params.toLowerCase().indexOf("styles=") < 0)
		imageUrl += "&styles=";

	if (this.params.indexOf("&") != 0) imageUrl += "&";
	
	imageUrl += this.params;

	return imageUrl;
};