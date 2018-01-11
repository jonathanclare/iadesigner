/** 
 * COnverts to/from Google Mercator.
 *
 * @author J Clare
 * @class ia.GoogleMercatorProjection
 * @constructor
 */
ia.GoogleMercatorProjection = function()
{
	/* EPSG:7030=SPHEROID["WGS_84",6378137,298.257223563,AUTHORITY["EPSG","7030"]] */
	this._originLat = 0;
	this._originLon = 0;
	this._ellipsoid = new Object();
	this._ellipsoid["id"] = "WGS_84";
	this._ellipsoid["semiMajorAxis"] = 6378137;
	this._ellipsoid["inverseFlattening"] = 298.257223563;
	this._checkEllipsoid();
};

/** 
 * Checks the ellipsoid.
 *
 * @method _checkEllipsoid
 */
ia.GoogleMercatorProjection.prototype._checkEllipsoid = function() 
{
	if (this._ellipsoid["semiMinorAxis"] == undefined)
	{
		this._ellipsoid["semiMinorAxis"] = this._ellipsoid["semiMajorAxis"] - (this._ellipsoid["semiMajorAxis"] / this._ellipsoid["inverseFlattening"]);
	}
	if (this._ellipsoid["eccentricity"] == undefined) {
	
		var f = (this._ellipsoid["semiMajorAxis"] - this._ellipsoid["semiMinorAxis"]) / this._ellipsoid["semiMajorAxis"];
		var e2 = (2 * f) - (f * f);
		this._ellipsoid["eccentricity"] = Math.sqrt(e2);
	}
};

/** 
 * Projects coords.
 *
 * @method project
 * @param {Number} lon The longitude.
 * @param {Number} lat The latitude.
 * @param {Boolean} useEllipsoid true/false.
 * @return {x:0,y:0} The point.
 */
ia.GoogleMercatorProjection.prototype.project = function(lon, lat, useEllipsoid) 
{
	var useEllipsoid = useEllipsoid || false;
	var pt = new Object();
	var rLon = Math.PI * (lon / 180.0);
	var rLonOrigin = Math.PI * (this._originLon / 180.0);
	var rLat = Math.PI * (lat / 180.0);
	var rLatOrigin = Math.PI * (this._originLat / 180.0);
	var radius = this._ellipsoid["semiMajorAxis"];
	pt["x"] = (radius * (rLon - rLonOrigin));
	pt["y"] = (radius * Math.log(Math.tan((Math.PI / 4) + (rLat / 2))));
	return pt;	
};

/** 
 * Unprojects coords.
 *
 * @method project
 * @param {Number} xm The x coord.
 * @param {Number} ym The y coord.
 * @param {Boolean} useEllipsoid true/false.
 * @return {x:0,y:0} The point.
 */
ia.GoogleMercatorProjection.prototype.unproject = function(xm, ym, useEllipsoid) 
{
	var useEllipsoid = useEllipsoid || false;
	var pt = new Object();
	var rLonOrigin = Math.PI * (this._originLon / 180.0);
	var rLatOrigin = Math.PI * (this._originLat / 180.0);
	var radius = this._ellipsoid["semiMajorAxis"];
	var rLon = (xm / radius) + rLonOrigin;
	var d = (0 - ym) / radius;
	var rLat = (Math.PI / 2.0) - (2 * Math.atan(Math.pow(Math.E, d)));
	pt["longitude"] = (rLon * 180.0) / Math.PI;
	pt["latitude"] = (rLat * 180.0) / Math.PI;
	return pt;
};