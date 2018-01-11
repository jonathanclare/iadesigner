/** 
 * Provides information common to all data objects.
 *
 * @author J Clare
 * @class ia.BaseData
 * @constructor
 * @param {JSON} data The json data describing the object.
 * @param {Object} parent The parent data object (eg ia.Theme is a parent of ia.Indicator and ia.Associate).
 */
ia.BaseData = function(data, parent)
{
	this.data = data;	
	this.parent = parent;	
	this._properties = {};

	//this.hasData = true;
	this.hasData = false;
	this.type = "categoric";

	// Parse the JSON data.
	
	// Inherit type and precision and custom properties from parent.
	if (this.parent != undefined)
	{	
		this.type = this.parent.type;  
		this.precision = this.parent.precision; 

		// Custom properties.
		var props = this.parent.getProperties();
		if (props != undefined) 
		{
			var n = props.length;
			for (var key in props) 
			{ 
				this._properties[key] = props[key];
			}
		}
	}

	// Attributes - override attributes inherited from parent
	this.id = this.data.themeId || this.data.id;		// Use themeId for ThemeFiles
	this.name = this.data.themeName || this.data.name;	// Use themeName for ThemeFiles 
	this.href = this.data.href;
	this.id = '' + this.id;
	
	this.fileName = this.data.fileName;
	//if (this.data.fileName != undefined) this.hasData = false;
	if (this.data.type != undefined) this.type = this.data.type;  
	if (this.data.precision != undefined) this.precision = ia.parseInt(this.data.precision);
	
	// Custom properties.
	var props = this.data.properties;
	if (props != undefined) 
	{
		var n = props.length;
		for (var i = 0; i < n; i++) 
		{ 
			var propertyData = props[i]
			this._properties[propertyData.name] = propertyData.value;
		}
	}

	// Loop through the properties to check for custom table columns.
	this.customColumns = [];
	for (var name in this._properties)
	{
		if (name.indexOf("column_") != -1)
		{
			var col = {};
			col.id = name.substring(name.indexOf("_") + 1, name.length);
			if (col.id == "indicator") col.id = "value"; // Include this because this is the way it was stored in flex reports.
			col.formattedId = col.id != "name" ? col.id+"_formatted" : col.id;
			col.label = this._properties[name];
			this.customColumns.push(col)
			//ia.log("> "+this.name+" "+col.id+" "+col.label)
		}
	}
};

/** 
 * The parent object.
 *
 * @property parent
 * @type Object
 */
ia.BaseData.prototype.parent;

/** 
 * The parent geography.
 *
 * @property geography
 * @type ia.Geography
 */
ia.BaseData.prototype.geography;

/** 
 * The raw json data describing the object.
 *
 * @property data
 * @type JSON
 */
ia.BaseData.prototype.data;

/** 
 * Indicates if this object contains data.
 *
 * @property hasData
 * @type Boolean
 * @default true
 */
ia.BaseData.prototype.hasData;

/** 
 * The id.
 *
 * @property id
 * @type String
 */
ia.BaseData.prototype.id;

/** 
 * The name.
 *
 * @property name
 * @type String
 */
ia.BaseData.prototype.name;

/** 
 * The href.
 *
 * @property href
 * @type String
 */
ia.BaseData.prototype.href;

/** 
 * The data type. Inherited from parent if undefined.
 *
 * @property type
 * @type Number
 * @default "categoric"
 */
ia.BaseData.prototype.type;

/** 
 * The custom columns that can be used in the data table.
 * 
 * @property customColumns
 * @type {Object[]}} Array of columns.
 */
ia.BaseData.prototype.customColumns;

/** 
 * The file name.
 *
 * @property fileName
 * @type String
 */
ia.BaseData.prototype.fileName;

/** 
 * The precision. Inherited from parent if undefined.
 *
 * @property precision
 * @type Number
 */
ia.BaseData.prototype.precision;

/** 
 * Returns a value for a custom property.
 * 
 * @method getProperty
 * @param {String} propName The name of the property.
 * @return {Number|String} The value of the property, or undefined if it doesnt exist.
 */
ia.BaseData.prototype.getProperty = function(propName) {return this._properties[propName];};

/** 
 * Sets a value for a custom property.
 * 
 * @method setProperty
 * @param {String} propName The name of the property.
 * @param {Number|String} propValue The value of the property.
 */
ia.BaseData.prototype.setProperty = function(propName, propValue) {this._properties[propName] = propValue;};

/** 
 * Returns the custom properties. An associative array of the form: [propName] = propValue.
 * 
 * @method getProperties
 * @return {Associative Array} The properties.
 */
ia.BaseData.prototype.getProperties = function(propName) {return this._properties;};

/** 
 * Returns an array of data objects that are children of this object.
 *
 * @method getChildren
 * @return {Object[]} An array of data objects.
 */	
ia.BaseData.prototype.getChildren = function() {};

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
 * @param {Associative Array} dataHash An associative array as described.
 * @param {String} parentId The parent id.
 */	
ia.BaseData.prototype.getDataTree = function(showDates, reverseDates, dataHash, parentId) 
{
	var dHash;
	if (dataHash == undefined) dHash = {};
	else dHash = dataHash;

	var o = {};
	if (this.geography)
		o.id = this.geography.id + "~" + this.id;
	else
		o.id = this.id; // Its a geography.

	o.label = this.name;
	if (this.href != undefined) o.href = this.href;  
	if (parentId != undefined) o.parent = parentId;

	var children = this.getChildren();
	var childIds = [];
	if (children != null)
	{
		o.type = "branch";

		var child = children[0];
		if (child instanceof ia.Theme) o.childtype = "theme";
		else if (child instanceof ia.Indicator) o.childtype = "indicator";

		var n = children.length;
		var prevId;
		for (var i = 0; i < n; i++) 
		{ 	
			var data = children[i];

			// Stops repeat indicators with same id.
			if (data.id != prevId)
			{
				if (this.geography)
					childIds.push(this.geography.id + "~" + data.id);
				else
					childIds.push(this.id + "~" + data.id); // Its a geography.
					
				data.getDataTree(showDates, reverseDates, dHash, o.id);
			}
			prevId = data.id;
		}
		if (childIds.length > 0) o.children = childIds;
	}
	// Take care of dates if its an indicator with dates.
	else if (showDates != false && this.date != undefined)
	{
		o.type = "branch"; 
		o.childtype = "date";

		var indicatorArray = this.theme.getIndicators(this.id);
		var n = indicatorArray.length;

		if (reverseDates)
		{
			for (var i = n-1; i >= 0; i--) 			
			{
				var indicator = indicatorArray[i];

				var dateObj = {};
				dateObj.id = this.geography.id + "~" + indicator.id + "~" + indicator.date;
				dateObj.label = indicator.date;
				dateObj.type = "leaf";
				dateObj.parent = o.id;
				if (indicator.href != undefined) dateObj.href = indicator.href;  

				childIds.push(dateObj.id);
				dHash[dateObj.id] = dateObj;
			}
		}
		else
		{
			for (var i = 0; i < n; i++) 			
			{
				var indicator = indicatorArray[i];

				var dateObj = {};
				dateObj.id = this.geography.id + "~" + indicator.id + "~" + indicator.date;
				dateObj.label = indicator.date;
				dateObj.type = "leaf";
				dateObj.parent = o.id;
				if (indicator.href != undefined) dateObj.href = indicator.href;  

				childIds.push(dateObj.id);
				dHash[dateObj.id] = dateObj;
			}
		}
		if (childIds.length > 0) o.children = childIds;
	}
	else o.type = "leaf";

	dHash[o.id] = o;
	return dHash;
};