/** 
 * Contains information about a report.
 *
 * @author J Clare
 * @class ia.ReportData
 * @extends ia.EventDispatcher
 * @constructor
 */
ia.ReportData = function()
{
	ia.ReportData.baseConstructor.call(this);
	
	this._propertyHash = {};

	this.loadByIndicator = false;
	this.url = "";
	this.path = "";
	this.formatter = new ia.Formatter();
};
ia.extend(ia.EventDispatcher, ia.ReportData);

/** 
 * The raw json data describing the object.
 *
 * @property data
 * @type JSON
 */
ia.ReportData.prototype.data;

/** 
 * An optional data model used build and retrieve data.
 *
 * @property model
 * @type Object
 */
ia.ReportData.prototype.model;

/** 
 * The url of the data source.
 *
 * @property url
 * @type String
 * @default ""
 */
ia.ReportData.prototype.url;

/** 
 * The directory path to the data source.
 *
 * @property path
 * @type String
 * @default ""
 */
ia.ReportData.prototype.path;
	
/** 
 * The formatter
 *
 * @property getValue
 * @type ia.Formatter
 */
ia.ReportData.prototype.formatter;

/** 
 * The precision. Inherited from parent if undefined.
 *
 * @property precision
 * @type Number
 */
ia.ReportData.prototype.precision;
	
/** 
 * Returns the geographies contained in the data.  
 *
 * @method getGeographies
 * @return {ia.Geography[]} An array of geographies.
 */	
ia.ReportData.prototype.getGeographies = function() {return this._geogArray;};

/** 
 * Get a value for a custom property.
 * 
 * @method getProperty
 * @param {String} propName The name of the property.
 * @return {Object} The value for that property, or null.
 */
ia.ReportData.prototype.getProperty = function(propName) {return this._propertyHash[propName];};

/** 
 * Set a value for a custom property. Use this to set any default
 * properties to be inherited by all data types beneath.
 * 
 * @method setProperty
 * @param {String} propName The name of the property.
 * @param {Object} propValue The value of the property.
 */
ia.ReportData.prototype.setProperty = function(propName, propValue) {this._propertyHash[propName] = propValue;};

/** 
 * Gets the properties.
 * 
 * @method getProperties
 * @return {Object[]} A hashtable of properties.
 */
ia.ReportData.prototype.getProperties = function(propName) {return this._propertyHash;};

/** 
 * Returns the geography that corresponds to the geography id.
 * 
 * @method getGeography
 * @param {String} id The geography id.
 * @return {ia.Geography} The geography for the given id.
 */
ia.ReportData.prototype.getGeography = function(id) {return this._geogHash[id];};


/** 
 * Adds a new geography.
 * 
 * @method addGeography
 * @param {JSON} jsonGeog The json for the geography.
 * @return {ia.Geography} The geography.
 */
ia.ReportData.prototype.addGeography = function(jsonGeog) 
{
	// Attach json to the data.
	this.data.geographies[this.data.geographies.length] = jsonGeog;

	// Create the geog object.
	var g = new ia.Geography(this, jsonGeog);	
	g.index = this._geogArray.length;
	this._geogArray[g.index] = g;
	this._geogHash[g.id] = g;

	return g;
};

/** 
 * Loads and parses the source file then calls the given function.
 *
 * @method loadSource
 * @param {String} url The url to the data. 
 * @param {Function} callbackFunction The call back function. 
 */
ia.ReportData.prototype.loadSource = function(url, callbackFunction) 
{
	var me = this;
	this.url = url;
	this.path = ia.File.getFileDirectory(url);
	ia.File.load(
	{
		url: url,
		dataType: "json", 
		onSuccess:function(json)
		{
			me.parseData(json, callbackFunction);
		}
	});
};

/** 
 * Parses the geography data.  
 *
 * @method parseData
 * @param {JSON} data The json data describing the object.
 * @param {Function} callbackFunction The call back function. 
 */	
ia.ReportData.prototype.parseData = function(data, callbackFunction) 
{
	this.data = data;

	// Parse the JSON.
	// Geographies.
	this._geogArray = [];
	this._geogHash = new Object();
	var geographies = data.geographies;

	if (geographies != undefined) 
	{	
		var n = geographies.length;
		for (var i = 0; i < n; i++) 
		{ 
			var g = new ia.Geography(this, geographies[i]);
			g.index = i;
			this._geogArray[i] = g;
			this._geogHash[g.id] = g;
		};
	}
	callbackFunction.call(null, this);
};

/** 
 * Refreshes the data.
 *
 * @method refresh
 * @param {Function} callbackFunction The call back function. 
 */
ia.ReportData.prototype.refresh = function(callbackFunction) 
{
	var me = this;
	me.parseData(me.data, function()
	{
		callbackFunction.call(null, me);
	});
};

/** 
 * Returns an associative array of the form:
 *
 * <p>["i1"]{id:"i1"; label:"Home"; type:"branch"; children:["i2"; "i3"; "i4"]}
 * <br/>["i2"]{id:"i2"; label:"ia.Indicator 1"; type:"branch"; parent:"i1"; children:["i5"; "i6"; "i7"]}
 * <br/>["i5"]{id:"i5~2004"; label:"2004"; type:"leaf"; parent:"i2"}</p>
 *
 * <p>Used by data explorers. Dates are returned as part of the tree.</p>
 *
 * @method getDataTree
 * @param {Boolean} showDates Should the dates be displayed.
 * @param {Boolean} reverseDates Should the dates be reversed.
 * @return {Associative Array} An associative array as described.
 */	
ia.ReportData.prototype.getDataTree = function(showDates, reverseDates) 
{
	var dHash = {};

	var o = {};
	o.id = "topLevel";
	o.label = "topLevel";
	o.type = "branch";
	o.childtype = "geography";
	dHash[o.id] = o;
	
	var geogIds = [];
	for (var id in this._geogHash)
	{ 	
		geogIds.push(id);
		this._geogHash[id].getDataTree(showDates, reverseDates, dHash, o.id);
	}
	o.children = geogIds;

	return dHash;
};

/** 
 * Returns an associative array of the form:
 *
 * <p>["i1"]{id:"i1"; label:"Home"; type:"branch"; children:["i2"; "i3"; "i4"]}
 * <br/>["i2"]{id:"i2"; label:"ia.Indicator 1"; type:"branch"; parent:"i1"; children:["i5"; "i6"; "i7"]}
 * <br/>["i5"]{id:"i5~2004"; label:"2004"; type:"leaf"; parent:"i2"}</p>
 *
 * <p>Used by data explorers. Dates are returned as part of the tree.</p>
 *
 * @method getGeographyTree
 * @param {Associative Array} dataHash An associative array as described.
 * @param {String} parentId The parent id.
 */	
ia.ReportData.prototype.getGeographyTree = function() 
{
	var dHash  = {};

	var o = {};
	o.id = "topLevel";
	o.label = "topLevel";
	o.type = "branch";
	dHash[o.id] = o;
	
	var geogIds = [];
	for (var i = 0; i < this._geogArray.length; i++) 
	{ 	
		var geog  = this._geogArray[i]
		var obj = {};
		obj.id = geog.id;
		obj.label = geog.name;
		obj.type = "leaf";
		dHash[obj.id] = obj;
		geogIds.push(geog.id);
	}
	o.children = geogIds;

	return dHash;
};
