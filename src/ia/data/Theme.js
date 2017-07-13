/** 
 * Contains information about a ia.Theme.
 *
 * @author J Clare
 * @class ia.Theme
 * @extends ia.BaseData
 * @constructor
 * @param {ia.Geography} geography The geography the theme belongs to.
 * @param {ia.Theme} theme The parent theme the theme belongs to or undefined if its a child of the geography.
 * @param {JSON} data The json data describing the object.
 */
ia.Theme = function(geography, theme, data)
{
	var parent = theme || geography;
	ia.Theme.baseConstructor.call(this, data, parent);

	this.hasThemes = false;
	this.geography = geography;

	if (data.fileName != undefined || this.geography.reportData.model != undefined) this.hasData = false;
	else this.hasData = true;

	this.parseData(data);
};
ia.extend(ia.BaseData, ia.Theme);

/** 
 * Indicates if this theme contains nested themes.
 *
 * @property hasThemes
 * @type Boolean
 * @default false
 */
ia.Theme.prototype.hasThemes;

/** 
 * Returns the theme data formatted as csv.
 *
 * @method getCSV
 * @param {String} indicatorId An optional indicator id.
 * @param {String[]} featureIds An optional list of feature ids to get data for.
 * @return {String} A string containing the csv.
 */
ia.Theme.prototype.getCSV = function(indicatorId, featureIds)
{
	var r = new Array(), i = -1;

	// Get the data.
	var data = this.getData(indicatorId, featureIds);

	// First off get the list of ids to loop through.
	var dates = data.dates;
	var noDates = dates.length;
	var indData = data[dates[0]];

	// Headers.
	r[++i] = '"id","name",';
	// Loop through dates.
	for (var j = 0; j < noDates; j++)
	{
		var date = dates[j];
		r[++i] = '"'+date+'"';
		if (j != noDates-1) r[++i] = ','
	}
	r[++i] = '\n';

	// Loop through feature ids.
	for (var id in indData)
	{
		var dataItem = indData[id];
		r[++i] = '"'+dataItem.id+'",';
		r[++i] = '"'+dataItem.name+'",';

		// Loop through dates.
		for (var j = 0; j < noDates; j++)
		{
			var date = dates[j];
			var dataItem = data[date][id];
			var value = dataItem.value;

			if (ia.isNumber(value)) r[++i] = value;
			else 					r[++i] = '"'+value+'"';

			if (j != noDates-1) r[++i] = ','
		}
		r[++i] = '\n';
	}

	var str = r.join("");
};

/** 
 * Parses the JSON data.
 *
 * @method parseData
 * @param {JSON} data The json data describing the object.
 */
ia.Theme.prototype.parseData = function(data) 
{
	// Parse the JSON data.
	if (this.data.fileName != undefined) this.fileName = this.geography.reportData.path + this.data.fileName;

	// Themes.
	this._themeArray = [];
	var themes = this.data.themes;
	if (themes != undefined) 
	{
		var n = themes.length;
		for (var i = 0; i < n; i++) 
		{ 
			this.hasThemes = true;
			this._themeArray[i] = new ia.Theme(this.geography, this, themes[i]);
		}
	}

	// Indicators.
	this._indicatorArray = [];
	this._indicatorHash = {};
	this._indicatorDateHash = {};
	var indicators = this.data.indicators;

	if (indicators != undefined) 
	{
		var dateArray = [];
		var prevId;

		var n = indicators.length;
		for (var i = 0; i < n; i++) 
		{ 
			var jsonInd = indicators[i];
			var ind = new ia.Indicator(this.geography, this, jsonInd);
			this._indicatorArray[i] = ind;

			if (ind.date)
			{
				this._indicatorHash[ind.id+"_"+ind.date] = ind;

				if (ind.id == prevId) 
					dateArray.push(ind.date);
				else 
				{
					dateArray = [];
					dateArray.push(ind.date);
				}

				prevId = ind.id;
				this._indicatorDateHash[ind.id] = dateArray;
			}
			else this._indicatorHash[ind.id] = ind;
		} 
	}
};

/** 
 * Returns the themes contained in the ia.Theme.  
 *
 * @method getThemes
 * @return {ia.Theme[]} An array of themes.
 */	
ia.Theme.prototype.getThemes = function() {return this._themeArray;};

/** 
 * Returns a list of the parent theme names including this one.  
 *
 * @method getParentThemes
 * @return {ia.Theme[]} An array of parent theme names.
 */	
ia.Theme.prototype.getParentThemes = function() 
{
	var hasThemes;
	var themeArray = [this.name];
	var thm = this.parent;
	while (thm.hasThemes == true) 
	{
		themeArray.push(thm.name);
		thm = thm.parent;
	}
	return themeArray.reverse();
};

/** 
 * Returns an array of data objects that are children of this object.
 *
 * @method getChildren
 * @return {Object[]} An array of data objects.
 */	
ia.Theme.prototype.getChildren = function() 
{
	if (this.hasThemes) 
	{
		var childArray = this._indicatorArray.concat(this._themeArray)
		return childArray;
	}
	else return this._indicatorArray;
};

/** 
 * Gets the themes indicator data.
 *
 * @method getData
 * @param {String} indicatorId An optional indicator id.
 * @param {String[]} featureIds An optional list of feature ids to get data for.
 * @return {Object[]} An array of data objects.
 */	
ia.Theme.prototype.getData = function(indicatorId, featureIds) 
{
	// Hashtable to contain the data
	var dataHash = {};
	dataHash.dates = [];
	dataHash.type = [];
	dataHash.profiles = [];

	// Get the indicators with the given id.
	var indList;
	if (indicatorId) indList = this.getIndicators(indicatorId);
	else  indList = this.getIndicators(); 

	var n = indList.length;
	for (var i = 0; i < n; i++) 
	{ 
		var ind = indList[i];
		if (ind.date != undefined)
		{
			dataHash.type[dataHash.type.length] = ind.type;
			dataHash.dates[dataHash.dates.length] = ind.date;
			dataHash.profiles[dataHash.profiles.length] = ind.profile;
			dataHash[ind.date] = ind.getData(featureIds);
		}
		else
		{
			dataHash.type[dataHash.type.length] = ind.type;
			dataHash.dates[dataHash.dates.length] = ind.name;
			dataHash.profiles[dataHash.profiles.length] = ind.profile;
			dataHash[ind.name] = ind.getData(featureIds);
		}
	}

	return dataHash;
};

/** 
 * Gets the themes indicator data with the given date.
 *
 * @method getDataForDate
 * @param {String} date The date.
 * @param {String[]} featureIds An optional list of feature ids to get data for.
 * @return {Object[]} An array of data objects.
 */	
ia.Theme.prototype.getDataForDate = function(date, featureIds) 
{
	// Hashtable to contain the data
	var dataHash = {};
	dataHash.dates = [];
	dataHash.type = [];

	// Get the indicators.
	var indList = this.getIndicators(); 
	var n = indList.length;
	for (var i = 0; i < n; i++) 
	{ 
		var ind = indList[i];
		if (ind.date == date)
		{
			dataHash.type[dataHash.type.length] = ind.type;
			dataHash.dates[dataHash.dates.length] = ind.name;
			dataHash[ind.name] = ind.getData(featureIds);
		}
	}

	return dataHash;
};

/** 
 * Gets the themes indicator comparison data.
 *
 * @method getComparisonData
 * @param {String} indicatorId The indicator id.
 * @return {Object[]} An array of data objects.
 */	
ia.Theme.prototype.getComparisonData = function(indicatorId) 
{
	// Hashtable to contain the data
	var dataHash = {};
	dataHash.dates = [];
	dataHash.type = [];

	// Get the indicators with the given id.
	var indList = this.getIndicators(indicatorId);
	
	var n = indList.length;
	for (var i = 0; i < n; i++) 
	{ 
		var ind = indList[i];
		if (ind.date != undefined)
		{
			dataHash.type[dataHash.type.length] = ind.type;
			dataHash.dates[dataHash.dates.length] = ind.date;
			dataHash[ind.date] = ind.getComparisonData();
		}
	}

	return dataHash;
};

/** 
 * Gets the themes indicators with the given date.
 *
 * @method getComparisonDataForDate
 * @param {String} date The date.
 * @return {Object[]} An array of data objects.
 */	
ia.Theme.prototype.getComparisonDataForDate = function(date) 
{
	// Hashtable to contain the data
	var dataHash = {};
	dataHash.dates = [];
	dataHash.type = [];

	// Get the indicators.
	var indList = this.getIndicators(); 
	var n = indList.length;
	for (var i = 0; i < n; i++) 
	{ 
		var ind = indList[i];
		if (ind.date == date)
		{
			dataHash.type[dataHash.type.length] = ind.type;
			dataHash.dates[dataHash.dates.length] = ind.name;
			dataHash[ind.name] = ind.getComparisonData();
		}
	}

	return dataHash;
};

/** 
 * Returns the indicators contained in the theme
 * or with the given id if that is supplied. 
 *
 * @method getIndicators
 * @param {String} indicatorId An optional indicator id.
 * @return {ia.Indicator[]} An array of indicators.
 */	
ia.Theme.prototype.getIndicators = function(indicatorId) 
{
	if (indicatorId == null || indicatorId == undefined) return this._indicatorArray;
	else
	{
		var dates = this.getIndicatorDates(indicatorId);
		var indArray = [];
		if (dates != undefined)
		{
			var n = dates.length;
			for (var i = 0; i < n; i++) 
			{ 
				indArray.push(this.getIndicator(indicatorId, dates[i]));
			}
		}
		else
		{
			indArray.push(this.getIndicator(indicatorId));
		}

		return indArray;
	}
};

/** 
 * Returns the indicators with the given date. 
 * Will include the latest date of an indicator if the specified date is unavailable.
 *
 * @method getIndicators
 * @param {String} date The date.
 * @return {ia.Indicator[]} An array of indicators.
 */	
ia.Theme.prototype.getIndicatorsWithDate = function(date) 
{
	var indicatorIds = this.getIndicatorIds();
	var indicators = new Array();
	for (var i = 0; i < indicatorIds.length; i++) 
	{ 
		var id = indicatorIds[i];
		indicators[indicators.length] = this.getIndicator(id, date);
	}
	return indicators;
};

/** 
 * Returns the first indicator - this can be within a nested ia.Theme.
 * Where dates are used the first indicator is the one with the most recent date
 * 
 * @method getFirstIndicator
 * @param {Boolean} reverseDates Should the dates be reversed.
 * @return {ia.Indicator} The indicator.
 */
ia.Theme.prototype.getFirstIndicator = function(reverseDates) 
{
	if (reverseDates == undefined) reverseDates = true;

	if (this._indicatorArray.length > 0)
	{
		var ind = this._indicatorArray[0];
		var indicatorList = this.getIndicators(ind.id);

		if (reverseDates) return indicatorList[indicatorList.length-1];
		else return indicatorList[0];
	}
	else if (this.hasThemes) // Nested themes.
	{
		var n = this._themeArray.length;
		for (var i = 0; i < n; i++)
		{ 
			var thm = this._themeArray[i];
			return thm.getFirstIndicator(reverseDates);
		}
	}
};

/** 
 * Returns the indicator that corresponds to the id and date provided.
 * Will include the latest date of an indicator if the specified date is unavailable.
 * 
 * @method getIndicator
 * @param {String} id The indicator id.
 * @param {String} date An optional date.
 * @return {ia.Indicator} The indicator.
 * @param {Boolean} reverseDates Should the dates be reversed.
 */
ia.Theme.prototype.getIndicator = function(id, date, reverseDates) 
{
	if (reverseDates == undefined) reverseDates = true;

	if (date != undefined && date != "" && this._indicatorHash[id+"_"+date] != undefined)
	{
		return this._indicatorHash[id+"_"+date];
	}
	else if (this._indicatorHash[id] != undefined)
	{
		return this._indicatorHash[id];
	}
	else // Try getting latest date for indicator
	{
		var dates = this.getIndicatorDates(id);
		if (dates) 
		{
			if (reverseDates) return this._indicatorHash[id+"_"+dates[dates.length-1]];
			else return this._indicatorHash[id+"_"+dates[0]];
		}
	}
};

/** 
 * Returns the indicator that corresponds to the name and date provided.
 * 
 * @method getIndicator
 * @param {String} name The indicator name.
 * @param {String} date An optional date.
 * @return {ia.Indicator} The indicator.
 */
ia.Theme.prototype.getIndicatorByName = function(name, date) 
{
	var n = this._indicatorArray.length;
	for (var i = 0; i < n; i++) 
	{ 
		var indicator = this._indicatorArray[i];
		if (indicator.name == name)
		{
			if (date)
			{
				if (indicator.date == date) return indicator;
			}
			else return indicator;
		}
	}
};

/** 
 * Includes indicators in nested themes.
 * 
 * @method getNestedIndicator
 * @param {String} id The indicator id.
 * @param {String} date An optional date.
 * @param {Boolean} reverseDates Should the dates be reversed.
 * @return {ia.Indicator} The indicator.
 */
ia.Theme.prototype.getNestedIndicator = function(id, date, reverseDates) 
{
	var ind = this.getIndicator(id, date, reverseDates);
	if (ind != undefined) return ind;

	if (this.hasThemes) // Nested themes.
	{
		var n = this._themeArray.length;
		for (var i = 0; i < n; i++) 
		{ 
			var thm = this._themeArray[i];
			ind = thm.getNestedIndicator(id, date, reverseDates);
			if (ind != undefined) return ind;
		}
	}
};

/** 
 * Returns the indicators.
 * 
 * @method getIndicators
 * @return {ia.Indicator} The indicators.
 */
ia.Theme.prototype.getNestedIndicators = function() 
{
	var arrIndicators = this._indicatorArray.concat();
	if (this.hasThemes) // Nested themes.
	{
		var n = this._themeArray.length;
		for (var i = 0; i < n; i++) 
		{ 
			var thm = this._themeArray[i];
			arrIndicators = arrIndicators.concat(thm.getNestedIndicators());
		}
	}
	return arrIndicators;
};

/** 
 * Returns a list of dates for the indicator that matches
 * the id provided.
 * 
 * @method getIndicatorDates
 * @param {String} indicatorId The indicator id.
 * @return {String[]} A list of dates.
 */
ia.Theme.prototype.getIndicatorDates = function(indicatorId) 
{
	return this._indicatorDateHash[indicatorId];
};

/** 
 * Returns a list of indicator ids contained in the theme.
 * 
 * @method getIndicatorIds
 * @return {String[]} A list of indicator ids.
 */
ia.Theme.prototype.getIndicatorIds = function() 
{
	var n = this._indicatorArray.length;
	var indicatorIds = [];
	for (var i = 0; i < n; i++) 
	{ 
		var ind = this._indicatorArray[i];
		if (indicatorIds.indexOf(ind.id) == -1)
		indicatorIds.push(ind.id);
	}
	return indicatorIds;
};

/** 
 * Returns a list of indicator names contained in the theme.
 * 
 * @method getIndicatorNames
 * @return {String[]} A list of indicator names.
 */
ia.Theme.prototype.getIndicatorNames = function() 
{
	var n = this._indicatorArray.length;
	var indicatorNames = [];
	for (var i = 0; i < n; i++) 
	{ 
		var ind = this._indicatorArray[i];
		if (indicatorNames.indexOf(ind.name) == -1)
		indicatorNames.push(ind.name);
	}
	return indicatorNames;
};

/** 
 * Loads all data in the theme.
 * 
 * @method loadData
 * @param {Function} callbackFnc The callbackFnc gets called with the loaded object as the parameter.
 */
ia.Theme.prototype.loadData = function(callbackFnc) 
{
	var me = this;

	// Load the theme if there isnt any data yet.
	if (me.hasData == false) 
	{
		// Check for data model.
		var model = me.geography.reportData.model;
		if (model != undefined)
		{
			model.getTheme(me.geography.id, me.id, function(jsonTheme)
			{
				me.data = jsonTheme;
				me.hasData = true;
				me.parseData();
				if (me.hasThemes) // Load any nested themes.
				{
					var thmCount = 0;
					function onThemeReady()
					{
						thmCount++;
						if (thmCount == me._themeArray.length) callbackFnc.call(null, me); // Return after all nested themes have loaded.
						else
						{
							// Load next theme.
							var thm = me._themeArray[thmCount];
							thm.loadData(onThemeReady);
						}
					};
				
					// Load first theme.
					if (me._themeArray.length > 0)
					{
						var thm = me._themeArray[0];
						thm.loadData(onThemeReady);
					}
				}
				else callbackFnc.call(null, me); // Return after theme data has loaded.
			});
		}
		else
		{
			ia.File.load(
			{
				url: me.fileName,
				dataType: "json", 
				onSuccess:function(jsonTheme)
				{
					me.data = jsonTheme;
					me.hasData = true;
					me.parseData();

					if (me.hasThemes) // Load any nested themes.
					{
						var thmCount = 0;
						function onThemeReady()
						{
							thmCount++;
							if (thmCount == me._themeArray.length) callbackFnc.call(null, me); // Return after all nested themes have loaded.
							else
							{
								// Load next theme.
								var thm = me._themeArray[thmCount];
								thm.loadData(onThemeReady);
							}
						};
					
						// Load first theme.
						if (me._themeArray.length > 0)
						{
							var thm = me._themeArray[0];
							thm.loadData(onThemeReady);
						}
					}
					else callbackFnc.call(null, me); // Return after theme data has loaded.
				}
			});
		}
	}
	else callbackFnc.call(null, me);  // Return because theme already has data.
};

/** 
 * Loads the indicator that corresponds to the id and date provided.
 * The indicator can be in a nested ia.Theme.
 * Returns the indicator via the supplied callback function.
 * 
 * @method loadIndicator
 * @param {String} id The indicator id.
 * @param {String} date An optional date.
 * @param {Function} callbackFnc The callbackFnc gets called with the loaded object as the parameter.
 */
ia.Theme.prototype.loadIndicator = function(id, date, callbackFnc) 
{
	var me = this;
	var ind = me.getIndicator(id, date);
	if (ind != undefined) 
	{
		// Check if the theme has been loaded.
		if (me.hasData == false) 
		{
			// Load the theme if there isnt any data yet.
			me.loadData(function()
			{
				// Have to get indicator again because it will have 
				// had the data added to it.
				var ind = me.getIndicator(id, date);
				callbackFnc.call(null, ind);
			})
		}
		else callbackFnc.call(null, ind); // Indicator is already loaded so just return.
	}
};

/** 
 * A hashtable of the indicators/associates for a feature - used for profiles.
 *
 * <p>The returned data has the following structure:</p>
 *
 * <p>["t0"]{id:"t0", name:"theme0", type:"parent"}
 * <br/>["i0"]{id:"i0", name:"indicator0", value:2345, value_formatted:2345, associate1:25, associate1_formatted:25, type:"leaf"}
 * <br/>["i1"]{id:"i1", name:"indicator1", value:4347, value_formatted:4347, associate1:45, associate1_formatted:45, type:"leaf"}
 * <br/>["i2"]{id:"i2", name:"indicator1", value:2496, value_formatted:2496, associate1:25, associate1_formatted:25, type:"leaf"}</p>
 *
 * @method getProfileData
 * @param {String[]} featureIds A list of feature ids to get data for.
 * @param {Object[]} themeArray The array to add the theme objects to.
 * @param {String} date An optional date.
 * @param {Boolean} useLatestDate Use the latest date if the specified date is unavailable?
 */	
ia.Theme.prototype.getProfileData = function(featureIds, themeArray, date, useLatestDate) 
{
	// Theme.
	var thmObj = {};
	thmObj.id = this.id;
	thmObj.name = this.name;
	thmObj.indicators = [];
	themeArray[themeArray.length] = thmObj;
	
	if (this.hasThemes) // Nested themes.
	{
		var n = this._themeArray.length;
		for (var i = 0; i < n; i++) 
		{ 
			var thm = this._themeArray[i];
			thm.getProfileData(featureIds, themeArray, date, useLatestDate);
		}
	}
	
	// Indicators.
	var indList;

	if (useLatestDate && date != undefined) // Selected date.
	{
		indList = this.getIndicatorsWithDate(date);
	}
	else if (useLatestDate && date == undefined) // Most recent date.
	{
		var indicatorIds = this.getIndicatorIds();
		indList = new Array();
		for (var i = 0; i < indicatorIds.length; i++) 
		{ 
			var id = indicatorIds[i];
			indList[indList.length] = this.getIndicator(id, undefined, true);
		}
	}
	else // All dates.
	{
		indList = this.getIndicators();
	} 

	var iLength = indList.length;
	for (var i = 0; i < iLength; i++) 
	{ 
		var ind = indList[i];

		var indObj = ind.profile;
		indObj.features = [];

		// Features.
		var fLength = featureIds.length;
		for (var j = 0; j < fLength; j++) 
		{ 
			// Feature.
			var feaObj = ind.featureProfiles[featureIds[j]];
			if (feaObj) indObj.features[indObj.features.length] = feaObj;
		}
		thmObj.indicators[thmObj.indicators.length] = indObj;

		/*var indObj = {};
		indObj.id = ind.id;
		indObj.name = ind.name;
		indObj.date = ind.date;
		indObj.type = ind.type;
		indObj.href = ind.href;
		indObj.features = [];
		thmObj.indicators[thmObj.indicators.length] = indObj;

		// Stats
		indObj.minValue = ind.minValue;
		indObj.maxValue = ind.maxValue;
		indObj.count = ind.count;
		indObj.sum = ind.sum;
		indObj.mean = ind.mean;
		indObj.median = ind.median;
		indObj.range = ind.range;
		indObj.lowerQuartile = ind.lowerQuartile;
		indObj.upperQuartile = ind.upperQuartile;
		indObj.interquartileRange = ind.interquartileRange;
		indObj.variance = ind.variance;
		indObj.standardDeviation = ind.standardDeviation;
		indObj.minValue_formatted = ind.minValue_formatted;
		indObj.maxValue_formatted = ind.maxValue_formatted;
		indObj.sum_formatted = ind.sum_formatted;
		indObj.mean_formatted = ind.mean_formatted;
		indObj.median_formatted = ind.median_formatted;
		indObj.range_formatted = ind.range_formatted;
		indObj.lowerQuartile_formatted = ind.lowerQuartile_formatted;
		indObj.upperQuartile_formatted = ind.upperQuartile_formatted;
		indObj.interquartileRange_formatted = ind.interquartileRange_formatted;
		indObj.variance_formatted = ind.variance_formatted;
		indObj.standardDeviation_formatted = ind.standardDeviation_formatted;

		// Features.
		var fLength = featureIds.length;
		for (var j = 0; j < fLength; j++) 
		{ 
			// Feature.
			var feature = this.geography.getFeature(featureIds[j]);
			if (feature)
			{
				var feaObj = {};
				feaObj.id = feature.id;
				feaObj.name = feature.name;
				feaObj.value = ind.getValue(feature.id);
				feaObj.isComparison = feature.isComparison;
				feaObj.value_formatted = ind.getFormattedValue(feature.id);

				// Associates
				var associates = ind.getAssociates();
				var aLength = associates.length;
				for (var k = 0; k < aLength; k++) 
				{		
					var associate = associates[k];
					feaObj[associate.name] = associate.getValue(feature.id);
					feaObj[associate.name+"_formatted"] = associate.getFormattedValue(feature.id);
					feaObj[associate.name+"_type"] = associate.type;

					// Stats
					indObj[associate.name+"_minValue"] = associate.minValue;
					indObj[associate.name+"_maxValue"] = associate.maxValue;
					indObj[associate.name+"_sum"] = associate.sum;
					indObj[associate.name+"_count"] = associate.count;
					indObj[associate.name+"_mean"]  = associate.mean;
					indObj[associate.name+"_median"] = associate.median;
					indObj[associate.name+"_range"] = associate.range;
					indObj[associate.name+"_lowerQuartile"] = associate.lowerQuartile;
					indObj[associate.name+"_upperQuartile"] = associate.upperQuartile;
					indObj[associate.name+"_interquartileRange"] = associate.interquartileRange;
					indObj[associate.name+"_variance"] = associate.variance;
					indObj[associate.name+"_standardDeviation"] = associate.standardDeviation;
					indObj[associate.name+"_minValue_formatted"] = associate.minValue_formatted;
					indObj[associate.name+"_maxValue_formatted"] = associate.maxValue_formatted;
					indObj[associate.name+"_sum_formatted"] = associate.sum_formatted;
					indObj[associate.name+"_mean_formatted"]  = associate.mean_formatted;
					indObj[associate.name+"_median_formatted"] = associate.median_formatted;
					indObj[associate.name+"_range_formatted"] = associate.range_formatted;
					indObj[associate.name+"_lowerQuartile_formatted"] = associate.lowerQuartile_formatted;
					indObj[associate.name+"_upperQuartile_formatted"] = associate.upperQuartile_formatted;
					indObj[associate.name+"_interquartileRange_formatted"] = associate.interquartileRange_formatted;
					indObj[associate.name+"_variance_formatted"] = associate.variance_formatted;
					indObj[associate.name+"_standardDeviation_formatted"] = associate.standardDeviation_formatted;
				}

				// Properties
				var props = ind.getProperties();
				for (var propName in props) 
				{
					feaObj[propName] = props[propName];
					feaObj[propName+"_formatted"] = this.geography.reportData.formatter.format(props[propName]);
					feaObj[propName+"_type"] = ia.Thematic.CATEGORIC;
				}

				indObj.features[indObj.features.length] = feaObj;
			}
		}*/
	}
};

/** 
 * A hashtable of the indicators/associates for a feature - used by feature card.
 *
 * @method getFeatureData
 * @param {Object} feature A feature  object.
 * @param {String} date An optional date.
 * @return {JSON} As described above.
 */	
ia.Theme.prototype.getFeatureData = function(feature, date) 
{
	// Theme.
	var thmObj = {};
	thmObj.id = this.id;
	thmObj.name = this.name;
	thmObj.href = this.href;
	thmObj.precision = this.precision;
	thmObj.themes = [];
	thmObj.indicators = [];
	
	if (this.hasThemes) // Nested themes.
	{
		var n = this._themeArray.length;
		for (var i = 0; i < n; i++) 
		{ 
			var thm = this._themeArray[i];
			if (thm.hasData)
			{
				var nestedThmObj = thm.getFeatureData(feature, date);
				thmObj.themes[thmObj.themes.length] = nestedThmObj;
			}
		}
	}
	
	// Indicators.
	var indList = this.getIndicators();
	var iLength = indList.length;
	for (var i = 0; i < iLength; i++) 
	{ 
		var ind = indList[i];
		if (date == undefined || date == ind.date)
		{
			var indObj = {};
			indObj.id = ind.id;
			indObj.name = ind.name;
			indObj.date = ind.date;
			indObj.type = ind.type;
			indObj.href = ind.href;
			indObj.precision = ind.precision;
			indObj.value = ind.getValue(feature.id);
			indObj.formattedValue = ind.getFormattedValue(feature.id);

			indObj.associates = [];
			indObj.properties = [];

			// Associates
			var associates = ind.getAssociates();
			var aLength = associates.length;
			for (var k = 0; k < aLength; k++) 
			{		
				var associate = associates[k];
				var assObj = {};
				assObj.name = associate.name;
				assObj.type = associate.type;
				assObj.precision = associate.precision;
				assObj.value = associate.getValue(feature.id);
				assObj.formattedValue = associate.getFormattedValue(feature.id);
				indObj.associates[indObj.associates.length] = assObj;
			}

			// Limits
			var lowerLimits = ind.getLowerLimits();
			if (lowerLimits) 
			{
				var lmtObj = {};
				lmtObj.value = lowerLimits.getValue(feature.id);
				lmtObj.precision = lowerLimits.precision;
				lmtObj.formattedValue = lowerLimits.getFormattedValue(feature.id);
				indObj.lowerLimit = lmtObj;
			}
			var upperLimits = ind.getUpperLimits();
			if (upperLimits) 
			{
				var lmtObj = {};
				lmtObj.value = upperLimits.getValue(feature.id);
				lmtObj.precision = upperLimits.precision;
				lmtObj.formattedValue = upperLimits.getFormattedValue(feature.id);
				indObj.upperLimit = lmtObj;
			}

			// Properties
			var props = ind.getProperties();
			for (var propName in props) 
			{
				var propObj = {};
				propObj.name = propName;
				propObj.value = props[propName];
				propObj.formattedValue = this.geography.reportData.formatter.format(propObj.value);
				indObj.properties[indObj.properties.length] = propObj;
			}

			thmObj.indicators[thmObj.indicators.length] = indObj;
		}
	}

	return thmObj;
};

/** 
 * A hashtable of the indicators/associates for a list of features - used by feature card.
 *
 * @param {string[]} featureIds A list of feature ids to get data for.
 * @param {string} date An optional date.
 * @return {JSON} As described above.
 */	
ia.Theme.prototype.getIndicatorData = function(featureIds, date) 
{
	// Theme.
	var thmObj = {};
	thmObj.id = this.id;
	thmObj.name = this.name;
	thmObj.href = this.href;
	thmObj.precision = this.precision;
	thmObj.themes = [];
	thmObj.indicators = [];
	
	if (this.hasThemes) // Nested themes.
	{
		var n = this._themeArray.length;
		for (var i = 0; i < n; i++) 
		{ 
			var thm = this._themeArray[i];
			if (thm.hasData)
			{
				var nestedThmObj = thm.getIndicatorData(feature, date);
				thmObj.themes[thmObj.themes.length] = nestedThmObj;
			}
		}
	}

	var fLength;
	var featureArray;
	if (featureIds != null)
		fLength = featureIds.length;
	else
	{
		featureArray = this.geography.getFeatures();
		fLength = featureArray.length;
	}

	// Indicators.
	var indList = this.getIndicators();
	var iLength = indList.length;
	for (var i = 0; i < iLength; i++) 
	{ 
		var ind = indList[i];
		if (date == undefined || date == ind.date)
		{
			var indObj = {};
			indObj.id = ind.id;
			indObj.name = ind.name;
			indObj.date = ind.date;
			indObj.type = ind.type;
			indObj.href = ind.href;
			indObj.precision = ind.precision;

			// Indicator Properties.
			indObj.properties = [];
			var props = ind.getProperties();
			for (var propName in props) 
			{
				var propObj = {};
				propObj.name = propName;
				propObj.value = props[propName];
				propObj.formattedValue = this.geography.reportData.formatter.format(propObj.value);
				indObj.properties[indObj.properties.length] = propObj;
			}

			// Features.
			indObj.features = [];
			for (var j = 0; j < fLength; j++) 
			{ 
				// Feature.
				var feature;
				if (featureIds != null)
					feature = this.geography.getFeature(featureIds[j]);
				else
					feature = featureArray[j];

				var featObj = {};
				featObj.id = feature.id;
				featObj.name = feature.name;
				featObj.href = feature.href;
				featObj.value = ind.getValue(feature.id);
				featObj.formattedValue = ind.getFormattedValue(feature.id);

				featObj.associates = [];
				featObj.properties = [];

				// Feature Properties
				var props = feature.getProperties();
				for (var propName in props) 
				{
					var propObj = {};
					propObj.name = propName;
					propObj.value = props[propName];
					propObj.formattedValue = this.geography.reportData.formatter.format(propObj.value);
					featObj.properties[featObj.properties.length] = propObj;
				}

				// Associates
				var associates = ind.getAssociates();
				var aLength = associates.length;
				for (var k = 0; k < aLength; k++) 
				{		
					var associate = associates[k];
					var assObj = {};
					assObj.name = associate.name;
					assObj.type = associate.type;
					assObj.precision = associate.precision;
					assObj.value = associate.getValue(feature.id);
					assObj.formattedValue = associate.getFormattedValue(feature.id);
					featObj.associates[featObj.associates.length] = assObj;
				}

				// Limits
				var lowerLimits = ind.getLowerLimits();
				if (lowerLimits) 
				{
					var lmtObj = {};
					lmtObj.value = lowerLimits.getValue(feature.id);
					lmtObj.precision = lowerLimits.precision;
					lmtObj.formattedValue = lowerLimits.getFormattedValue(feature.id);
					featObj.lowerLimit = lmtObj;
				}
				var upperLimits = ind.getUpperLimits();
				if (upperLimits) 
				{
					var lmtObj = {};
					lmtObj.value = upperLimits.getValue(feature.id);
					lmtObj.precision = upperLimits.precision;
					lmtObj.formattedValue = upperLimits.getFormattedValue(feature.id);
					featObj.upperLimit = lmtObj;
				}

				indObj.features[indObj.features.length] = featObj;
			}

			thmObj.indicators[thmObj.indicators.length] = indObj;
		}
	}

	return thmObj;
};