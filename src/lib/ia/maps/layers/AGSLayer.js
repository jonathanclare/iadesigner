/** 
 * For handling ArcGIS Server layers. http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Export_Map/02r3000000v7000000/
 * 
 * <p>
 * <pre>
 * <b>f</b>
 * Description: The response format. The default response format is html. If the format is image, the image bytes are directly streamed to the client.
 * Values: html | json | image | kmz
 * 
 * <b>bbox</b>	
 * Required
 * Description: The extent (bounding box) of the exported image. Unless the bboxSR parameter has been specified, the bbox is assumed to be in the spatial reference of the map.
 * Syntax: <xmin>, <ymin>, <xmax>, <ymax>
 * Example: bbox=-104,35.6,-94.32,41
 * The bboxcoordinates should always use a period as the decimal separator even in countries where traditionally a comma is used.
 * 
 * <b>size</b>	
 * Description: The size (width * height) of the exported image in pixels. If the size is not specified, an image with a default size of 400 * 400 will be exported.
 * Syntax: <width>, <height>
 * Example: size=600,550
 * 
 * <b>dpi</b>	
 * Description: The device resolution of the exported image (dots per inch). If the dpi is not specified, an image with a default DPI of 96 will be exported.
 * Example: dpi=200
 * 
 * <b>imageSR</b>	
 * Description: The well-known ID of the spatial reference of the exported image. If the imageSR is not specified, the image will be exported in the spatial reference of the map.
 * 
 * <b>bboxSR</b>	
 * Description: The well-known ID of the spatial reference of the bbox. If the bboxSR is not specified, the bbox is assumed to be in the spatial reference of the map.
 * 
 * <b>format</b>	
 * Description: The format of the exported image. The default format is png.
 * Values: png | png8 | png24 | jpg | pdf | bmp | gif | svg | png32 
 * Note: Support for the png32 format was added at 9.3.1. This format is only available for map services whose supportedImageFormatTypes property includes PNG32
 * 
 * <b>layerDefs</b>	
 * Description: Allows you to filter the features of individual layers in the exported map 
 * by specifying definition expressions for those layers. 
 * Syntax: layerId1:layerDef1;layerId2:layerDef2
 * where layerId1, layerId2 are the layer ids returned by the map service resource 
 * Example: 0:POP2000 > 1000000;5:AREA > 100000
 * 
 * <b>layers</b>	
 * Description: Determines which layers appear on the exported map. There are four ways to specify which layers are shown:
 * show: Only the layers specified in this list will be exported.
 * hide: All layers except those specified in this list will be exported.
 * include: In addition to the layers exported by default, the layers specified in this list will be exported.
 * exclude: The layers exported by default excluding those specified in this list will be exported.
 * Syntax: [show | hide | include | exclude]:layerId1,layerId2
 * where layerId1, layerId2are the layer ids returned by the map service resource
 * Example: layers=show:2,4,7
 * 
 * <b>transparent</b>	
 * Description: If true, the image will be exported with the background color of the map set as its transparent color. 
 * The default is false. Only the png and gif formats support transparency.  
 * Internet Explorer 6 does not display transparency correctly for png24 image formats.
 * Values: true | false
 * </pre>
 * </p>
 *
 * @author J Clare
 * @class ia.AGSLayer
 * @extends ia.ImageLayer
 * @constructor
 * @param {String} url The url of the map service.
 */
ia.AGSLayer = function(url)
{
	ia.AGSLayer.baseConstructor.call(this);

	if (url.indexOf('MapServer') != -1)
	{
		var me = this;
		ia.FeatureServiceReader.getInfo(url, ia.accessToken, function(fsInfo, token)
		{
			if (fsInfo.copyrightText) me.copyrightText = fsInfo.copyrightText;
			if (fsInfo.documentInfo.Author) me.author = fsInfo.documentInfo.Author;
		});
	}
};
ia.extend(ia.ImageLayer, ia.AGSLayer);
 	
/**
 * Returns the required url.
 *
 * @method getUrl
 * @return {String} The url for retrieving the ags image.
 */
ia.AGSLayer.prototype.getUrl = function(bb, w, h)
{
	var imageUrl = this.url;	

	if (this.url.indexOf("?") == -1) imageUrl += "?";

	if ((this.url.charAt(this.url.length - 1) != "&")
	&& (this.url.charAt(this.url.length - 1) != "?")) imageUrl += "&";
		
	imageUrl += "bbox=" + bb.getXMin() + "," + bb.getYMin()  + "," + bb.getXMax() + "," + bb.getYMax();

	if (this.params.toLowerCase().indexOf("f=") < 0)
		imageUrl += "&f=image";

	if (this.params.toLowerCase().indexOf("layers=") < 0)
		imageUrl += "&layers=" + this.layers;

	if (this.params.toLowerCase().indexOf("bboxsr=") < 0)
		imageUrl += "&bboxSR=" + this.srs;

	if (this.params.toLowerCase().indexOf("imagesr=") < 0)
		imageUrl += "&imageSR=" + this.srs;

	if (this.params.toLowerCase().indexOf("format=") < 0)
		imageUrl += "&format=jpg";

	if (this.params.toLowerCase().indexOf("size=") < 0)
		imageUrl += "&size=" + Math.round(w)+","+Math.round(h);

	if (this.params.indexOf("&") != 0) imageUrl += "&";

	imageUrl += this.params;

	return imageUrl;
};