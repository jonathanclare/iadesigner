/** 
 * Contains information about a geography.
 *
 * @author J Clare
 * @class ia.Geography
 * @extends ia.BaseData
 * @constructor
 * @param {ia.ReportData} reportData The report data that the geography belongs to.
 * @param {JSON} data The json data describing the object.
 */
ia.Geography = function(reportData, data)
{
	this.reportData = reportData;
	this.parseData(data);
};
ia.extend(ia.BaseData, ia.Geography);

/** 
 * The parent report data.
 *
 * @property reportData
 * @type ia.ReportData
 */
ia.Geography.prototype.reportData;

/** 
 * The geography index - this is the order the geography appears
 * in the data.js. It is used to find a matching base layer
 * which appears in the same position in map.js.
 *
 * @property index
 * @type Number
 */
ia.Geography.prototype.index;

/** 
 * Parses the geography data.  
 *
 * @method parseData
 * @param {JSON} data The json data describing the object.
 */	
ia.Geography.prototype.parseData = function(data) 
{
	ia.Geography.baseConstructor.call(this, data, this.reportData);
	
	// Features.
	this._featureArray = [];
	this._featureHash = {};

	var features = this.data.features;
	if (features != undefined) 
	{
		var n = features.length;
		for (var i = 0; i < n; i++) 
		{ 
			var f = new ia.Feature(features[i]);
			this._featureArray[i] = f;
			this._featureHash[f.id] = f;
		}	
	}

	// Comparison Features.
	this._comparisonArray = [];
	this._comparisonHash = {};
	var comparisonFeatures = this.data.comparisonFeatures;
	if (comparisonFeatures != undefined) 
	{
		var n = comparisonFeatures.length;
		for (var i = 0; i < n; i++) 
		{ 
			var f = new ia.Feature(comparisonFeatures[i]);
			f.isComparison = true;
			this._comparisonArray[i] = f;
			this._comparisonHash[f.id] = f;
		}	
	}

	// Filters.
	this._filterArray = [];
	this._filterHash = {};
	var filters = this.data.filters;
	if (filters != undefined) 
	{
		var n = filters.length;
		for (var i = 0; i < n; i++) 
		{ 
			var f = new ia.Filter(filters[i]);
			this._filterArray[i] = f;
			this._filterHash[f.id] = f;
		}
	}

	// Themes.
	this._themeArray = [];
	this._themeHash = {}
	var themes = this.data.themes;
	if (themes != undefined) 
	{
		var n = themes.length;
		for (var i = 0; i < n; i++) 
		{ 
			var t = new ia.Theme(this, undefined, themes[i]);
			this._themeArray[i] = t;
			this._themeHash[t.id] = t;
		}
	}
};

/** 
 * Returns the themes contained in the geography.  
 *
 * @method getThemes
 * @return {ia.Theme[]} An array of themes.
 */	
ia.Geography.prototype.getThemes = function() {return this._themeArray;};

/** 
 * Returns the theme that corresponds to the id provided.
 * 
 * @method getTheme
 * @param {string} id The id.
 * @return {ia.Theme} A theme object.
 */
ia.Geography.prototype.getTheme = function(id) {return this._themeHash[id];};

/** 
 * Returns the features contained in the geography.  
 *
 * @method getFeatures
 * @return {ia.Feature[]} An array of features.
 */	
ia.Geography.prototype.getFeatures = function() {return this._featureArray;};

/** 
 * Returns the feature that corresponds to the id provided.
 * Will also return a comparison feature.
 * 
 * @method getFeature
 * @param {string} id The id.
 * @return {ia.Feature} A feature object.
 */
ia.Geography.prototype.getFeature = function(id) 
{
	if (this._featureHash[id] != undefined) return this._featureHash[id]
	else return this.getComparisonFeature(id);
};

/** 
 * Returns the comparison features contained in the geography.  
 *
 * @method getComparisonFeatures
 * @return {ia.Feature[]} An array of features.
 */	
ia.Geography.prototype.getComparisonFeatures = function() {return this._comparisonArray;};

/** 
 * Returns the comparison feature that corresponds to the id provided.
 * 
 * @method getComparisonFeature
 * @param {string} id The id.
 * @return {ia.Feature} A comparison feature object.
 */
ia.Geography.prototype.getComparisonFeature = function(id) {return this._comparisonHash[id];};

/** 
 * Returns the filters contained in the geography.  
 *
 * @method getFilters
 * @return {ia.Filter[]} An array of filters.
 */	
ia.Geography.prototype.getFilters = function() {return this._filterArray;};

/** 
 * Returns the filter that corresponds to the id provided.
 * 
 * @method getFilter
 * @param {string} id The id.
 * @return {ia.Filter} A filter object.
 */
ia.Geography.prototype.getFilter = function(id) {return this._filterHash[id];};

/** 
 * Returns an array of data objects that are children of this object.
 *
 * @method getChildren
 * @return {Object[]} An array of data objects.
 */	
ia.Geography.prototype.getChildren = function() {return this._themeArray;};

/** 
 * Returns the first indicator - this can be within a nested theme.
 * Where dates are used the first indicator is the one with the most recent date
 * 
 * @method getFirstIndicator
 * @param {Boolean} reverseDates Should the dates be reversed.
 * @return {ia.Indicator} The indicator.
 */
ia.Geography.prototype.getFirstIndicator = function(reverseDates) 
{
	var thm = this._themeArray[0];
	return thm.getFirstIndicator(reverseDates);
};

/** 
 * Returns the indicator that corresponds to the id and date provided.
 * 
 * @method getIndicator
 * @param {string} id The indicator id.
 * @param {string} date An optional date.
 * @param {Boolean} reverseDates Should the dates be reversed.
 * @return {ia.Indicator} The indicator.
 */
ia.Geography.prototype.getIndicator = function(id, date, reverseDates) 
{
	// Iterate through themes.
	var n = this._themeArray.length;
	for (var i = 0; i < n; i++) 
	{ 
		var thm = this._themeArray[i];
		var ind = thm.getNestedIndicator(id, date, reverseDates);
		if (ind != undefined) return ind;
	}
};

/** 
 * Returns the indicators.
 * 
 * @method getIndicators
 * @return {ia.Indicator} The indicators.
 */
ia.Geography.prototype.getIndicators = function() 
{
	var arrIndicators = new Array();
	var n = this._themeArray.length;
	for (var i = 0; i < n; i++) 
	{ 
		var thm = this._themeArray[i];
		arrIndicators = arrIndicators.concat(thm.getNestedIndicators());
	}
	return arrIndicators;
};

/** 
 * Returns the indicator that corresponds to the name and date provided.
 * 
 * @method getIndicator
 * @param {String} name The indicator name.
 * @param {String} date An optional date.
 * @return {ia.Indicator} The indicator.
 */
ia.Geography.prototype.getIndicatorByName = function(name, date) 
{
	// Iterate through themes.
	var n = this._themeArray.length;
	for (var i = 0; i < n; i++) 
	{ 
		var thm = this._themeArray[i];
		var ind = thm.getIndicatorByName(name, date);
		if (ind != undefined) return ind;
	}
};

/** 
 * Loads the indicator that corresponds to the id and date provided.
 * Returns the indicator via the supplied callback function.
 * 
 * @method loadIndicator
 * @param {string} id The indicator id.
 * @param {string} date An optional date.
 * @param {Function} callbackFnc The callbackFnc gets called with the loaded object as the parameter.
 * @return {ia.Indicator} The indicator.
 */
/*ia.Geography.prototype.loadIndicator = function(id, date, callbackFnc) 
{
	var me = this;

	function onFeaturesReady()
	{
		var ind = me.getIndicator(id, date);
		if (ind)
		{
			var thm = ind.parent;
			thm.loadIndicator(id, date, callbackFnc);
		}
	};

	// Check for data model
	if (me.reportData.model != undefined)
	{
		// If theres no features it indicates that a new empty data structure has been parsed in to the report.
		// If hasGeographyData = false it indicates the data model has changed for that geography.
		//if (me.getFeatures().length == 0 || me.reportData.model.hasData(me.id) == false)
		if (me.getFeatures().length == 0)
		{
			me.reportData.model.getFeatures(me.id, function(jsonGeog)
			{
				me.parseData(jsonGeog);
				onFeaturesReady();
			});
		}
		else onFeaturesReady();
	}
	else onFeaturesReady();
};*/

/** 
 * Loads the indicator that corresponds to the id and date provided.
 * Returns the indicator via the supplied callback function.
 * 
 * @method loadIndicator
 * @param {string} id The indicator id.
 * @param {string} date An optional date.
 * @param {Function} callbackFnc The callbackFnc gets called with the loaded object as the parameter.
 * @return {ia.Indicator} The indicator.
 */
ia.Geography.prototype.loadIndicator = function(id, date, callbackFnc) 
{
	if (this.reportData.model != undefined) this._loadIndicatorFromModel(id, date, callbackFnc);
	else
	{
		var ind = this.getIndicator(id, date);
		if (ind)
		{
			var thm = ind.parent;
			thm.loadIndicator(id, date, callbackFnc);
		}
	}
};

/** 
 * Loads the indicator that corresponds to the id and date provided.
 * Returns the indicator via the supplied callback function.
 * 
 * @method _loadIndicatorFromModel
 * @param {string} id The indicator id.
 * @param {string} date An optional date.
 * @param {Function} callbackFnc The callbackFnc gets called with the loaded object as the parameter.
 * @return {ia.Indicator} The indicator.
 * @private
 */
ia.Geography.prototype._loadIndicatorFromModel = function(id, date, callbackFnc) 
{
	var me = this;
	var model = me.reportData.model;

	// Standard IA reports load all the data at once or by theme (if themefiles are used)
	// Db-builder reports using a data model will only load the indicators that are required
	// to render the report. 
	// 
	function onFeaturesReady()
	{
		if (me.reportData.loadByIndicator == true)
		{
			var ind = me.getIndicator(id, date);
			if (ind && ind.hasData)
			{
				callbackFnc.call(null, ind);
			}
			else
			{
				// Loads on an indicator by indicator basis - no guarantee that whole theme is loaded.
				model.getIndicator(me.id, id, date, function(arrJsonIndicators)
				{
					for (var i = 0; i < arrJsonIndicators.length; i++) 
					{
						var jsonIndicator = arrJsonIndicators[i];
						var ind = me.getIndicator(jsonIndicator.id, jsonIndicator.date);
						if (ind && !ind.hasData)
						{
							ind.data = jsonIndicator;
							ind.parseData();
						}
					}
					var ind = me.getIndicator(id, date)
					callbackFnc.call(null, ind);
				});
			}
		}
		else
		{
			var ind = me.getIndicator(id, date);
			if (ind)
			{
				var thm = ind.parent;
				thm.loadIndicator(id, date, callbackFnc);
			}
		}
	};

	// If theres no features it indicates that a new empty data structure has been parsed in to the report.
	// If hasGeographyData = false it indicates the data model has changed for that geography.
	//if (me.getFeatures().length == 0 || me.reportData.model.hasData(me.id) == false)
	if (me.getFeatures().length == 0)
	{
		model.getFeatures(me.id, function(jsonGeog)
		{
			me.parseData(jsonGeog);
			onFeaturesReady();
		});
	}
	else onFeaturesReady();
};

/** 
 * Returns the features ids that are contained in the given filter.
 * 
 * @method getFilteredFeatures
 * @param {string} filterId The filter id.
 * @param {string} filterValue The filter value.
 * @return {string[]} A list of feature ids.
 */
ia.Geography.prototype.getFilteredFeatures = function(filterId, filterValue) 
{
	var n = this._featureArray.length;
	var filteredFeatures = []
	for (var i = 0; i < n; i++) 
	{ 	
		var f = this._featureArray[i];
		var strFilterValue = f.getFilterValue(filterId);

		// Filter with multiple values ie. "name":"Midwest;South".
		if (strFilterValue != undefined)
		{
			if (strFilterValue.indexOf(';') != -1)
			{
				var arrFilterValues = strFilterValue.split(';')
				for (var m = 0; m < arrFilterValues.length; m++) 
				{ 	
					var fv = arrFilterValues[m];
					if (fv == filterValue) 
					{
						filteredFeatures.push(f.id);
						break;
					}
				}
			}
			// Filter with single value ie. "name":"Midwest".
			else if (strFilterValue == filterValue) filteredFeatures.push(f.id)
		}
	}
	return filteredFeatures;
};

/** 
 * Returns a hashtable of the form:
 *
 * <p>["i1"]{id:"i1"; label:"Home"; type:"branch"; children:["i2"; "i3"; "i4"]}
 * <br/>["i2"]{id:"i2"; label:"ia.Indicator 1"; type:"branch"; parent:"i1"; children:["i5"; "i6"; "i7"]}
 * <br/>["i5"]{id:"i5~2004"; label:"2004"; type:"leaf"; parent:"i2"}</p>
 *
 * <p>Used by filter explorers.</p>
 *
 * @method getFilterTree
 * @return {Object} A hashtable of filter objects.
 */	
ia.Geography.prototype.getFilterTree = function() 
{
	var fHash = {};

	var topObj = {};
	topObj.id = "topLevel";
	topObj.label = "topLevel";
	topObj.type = "branch";
	fHash[topObj.id] = topObj;

	var filterNames = [];

	var n = this._filterArray.length;
	var fn = this._featureArray.length;
	for (var i = 0; i < n; i++) 
	{ 	
		var f = this._filterArray[i];

		if (n != 1)
		{
			var nameObj = {};
			nameObj.id = f.id;
			nameObj.label = f.name;
			nameObj.type = "branch";
			nameObj.parent = topObj.id;
			fHash[nameObj.id] = nameObj;
			filterNames.push(nameObj.id);
		}

		var filterValues = [];
		for (var j = 0; j < fn; j++) 
		{ 	
			var feature = this._featureArray[j];
			var filterValue = feature.getFilterValue(f.id);

			// Filter with multiple values ie. "name":"Midwest;South".
			if (filterValue != undefined)
			{
				if (filterValue.indexOf(';') != -1)
				{
					var arrFilterValues = filterValue.split(';')
					for (var m = 0; m < arrFilterValues.length; m++) 
					{ 	
						var fv = arrFilterValues[m];
						if (fv != undefined && (filterValues.indexOf(f.id+"~"+fv) == -1))
						{
							var valueObj = {};
							valueObj.id = f.id+"~"+fv;
							valueObj.label = fv;
							valueObj.type = "leaf";
							if (n != 1) valueObj.parent = f.id;
							fHash[valueObj.id] = valueObj;
							filterValues.push(valueObj.id);
						}
					}
				} 
				// Filter with single value ie. "name":"Midwest".
				else if (filterValues.indexOf(f.id+"~"+filterValue) == -1)
				{
					var valueObj = {};
					valueObj.id = f.id+"~"+filterValue;
					valueObj.label = filterValue;
					valueObj.type = "leaf";
					if (n != 1) valueObj.parent = f.id;
					fHash[valueObj.id] = valueObj;
					filterValues.push(valueObj.id);
				}
			}
		}
		filterValues.sort();
		
		if (n != 1) nameObj.children = filterValues;
		else topObj.children = filterValues; 
	}
	if (n != 1) topObj.children = filterNames;
	return fHash;
};

/** 
 * Loads all data in the geography.
 * 
 * @method loadData
 * @param {Function} callbackFnc The callbackFnc gets called with the loaded object as the parameter.
 */
ia.Geography.prototype.loadData = function(callbackFnc) 
{
	var me = this;

	var thmCount = 0;
	function onThemeReady()
	{
		thmCount++;
		if (thmCount == me._themeArray.length) callbackFnc.call(null, me);
		else
		{
			// Load next theme.
			var thm = me._themeArray[thmCount];
			thm.loadData(onThemeReady);
		}
	};

	// Load first theme.
	if (this._themeArray.length > 0)
	{
		var thm = this._themeArray[0];
		thm.loadData(onThemeReady);
	}
};

/** 
 * Returns the data for a list of feature ids - listed by feature.
 *
 * @method getFeatureData
 * @param {string[]} featureIds A list of feature ids to get data for.
 * @param {string} date An optional date.
 * @param {string} themeId An optional theme id.
 * @return {JSON} As described above.
 */	
ia.Geography.prototype.getFeatureData = function(featureIds, date, themeId) 
{
	var geogObj = {};
	geogObj.id = this.id;
	geogObj.name = this.name;
	geogObj.features = [];

	// Themes
	var thmList = this.getThemes();
	var tLength = thmList.length;

	// Features.
	var fLength;
	var featureArray;
	if (featureIds != null)
		fLength = featureIds.length;
	else
	{
		featureArray = this.getFeatures();
		fLength = featureArray.length;
	}

	for (var i = 0; i < fLength; i++) 
	{ 
		// Feature.
		var feature;
		if (featureIds != null)
			feature = this.getFeature(featureIds[i]);
		else
			feature = featureArray[i];

		if (feature != undefined)
		{
			var featObj = {};
			featObj.id = feature.id;
			featObj.name = feature.name;
			featObj.href = feature.href;

			// Properties
			featObj.properties = [];
			var props = feature.getProperties();
			for (var propName in props) 
			{
				var propObj = {};
				propObj.name = propName;
				propObj.value = props[propName];
				propObj.formattedValue = this.reportData.formatter.format(propObj.value);
				featObj.properties[featObj.properties.length] = propObj;
			}

			featObj.themes = [];
			geogObj.features[geogObj.features.length] = featObj;

			if (themeId != undefined)
			{
				var thm = this.getTheme(themeId);
				if (thm.hasData)
				{
					var thmObj = thm.getFeatureData(feature, date);
					featObj.themes[featObj.themes.length] = thmObj;
				}
			}
			else
			{
				for (var j = 0; j < tLength; j++) 
				{ 
					var thm = thmList[j]; 
					if (thm.hasData)
					{
						var thmObj = thm.getFeatureData(feature, date);
						featObj.themes[featObj.themes.length] = thmObj;
					}
				}
			}
		}
	}

	return geogObj;
};

/** 
 * Returns the data for a list of feature ids - listed by indicator.
 *
 * @method getIndicatorData
 * @param {string[]} featureIds A list of feature ids to get data for.
 * @param {string} date An optional date.
 * @return {JSON} As described above.
 */	
ia.Geography.prototype.getIndicatorData = function(featureIds, date) 
{
	var geogObj = {};
	geogObj.id = this.id;
	geogObj.name = this.name;
	geogObj.themes = [];

	// Themes
	var thmList = this.getThemes();
	var tLength = thmList.length;

	for (var j = 0; j < tLength; j++) 
	{ 
		var thm = thmList[j]; 
		if (thm.hasData)
		{
			var thmObj = thm.getIndicatorData(featureIds, date);
			geogObj.themes[geogObj.themes.length] = thmObj;
		}
	}

	return geogObj;
};

/** 
 * Returns a hashtable of the indicators/associates for a feature - used for profiles.
 *
 * <p>The returned data has the following structure:</p>
 *
 * <p>["t0"]{id:"t0", name:"theme0", type:"parent"}
 * <br/>["i0"]{id:"i0", name:"indicator0", value:2345, value_formatted:2345, associate1:25, associate1_formatted:25, type:"leaf"}
 * <br/>["i1"]{id:"i1", name:"indicator1", value:4347, value_formatted:4347, associate1:45, associate1_formatted:45, type:"leaf"}
 * <br/>["i2"]{id:"i2", name:"indicator1", value:2496, value_formatted:2496, associate1:25, associate1_formatted:25, type:"leaf"}</p>
 *
 * @method getProfileData
 * @param {string[]} featureIds A list of feature ids to get data for.
 * @param {string} date An optional date.
 * @param {Boolean} useLatestDate Use the latest date if the specified date is unavailable?
 * @return {JSON} As described above.
 */	
ia.Geography.prototype.getProfileData = function(featureIds, date, useLatestDate) 
{
	var geogObj = {};
	geogObj.id = this.id;
	geogObj.name = this.name;
	geogObj.themes = [];
		
	// Indicators
	var thmList = this.getThemes();
	var n = thmList.length;
	for (var i = 0; i < n; i++) 
	{ 
		var thm = thmList[i];
		thm.getProfileData(featureIds, geogObj.themes, date, useLatestDate);
	}

	return geogObj;
};