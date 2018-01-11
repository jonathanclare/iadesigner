/** 
 * Contains information about an indicator.
 *
 * @author J Clare
 * @class ia.Indicator
 * @extends ia.BaseData
 * @constructor
 * @param {ia.Geography} geography The geography the indicator belongs to.
 * @param {ia.Theme} theme The theme the indicator belongs to.
 * @param {JSON} data The json data describing the object.
 */
ia.Indicator = function(geography, theme, data)
{
	ia.Indicator.baseConstructor.call(this, data, theme);
	this._stats = new ia.Statistics();
	this.theme = theme;
	this.geography = geography;
	this.profile = {};
	this.featureProfiles = {};

	this.parseData(data);
};
ia.extend(ia.BaseData, ia.Indicator);

/** 
 * The indicator date.
 *
 * @property date
 * @type String
 */
ia.Indicator.prototype.date;

/** 
 * The parent theme.
 *
 * @property theme
 * @type ia.Theme
 */
ia.Indicator.prototype.theme;

/**
 * The count.
 *
 * @property count
 * @type Number
 */
ia.Indicator.prototype.count;

/**
 * The minimum value.
 *
 * @property minValue
 * @type Number
 */
ia.Indicator.prototype.minValue;

/**
 * The maximum value.
 *
 * @property maxValue
 * @type Number
 */
ia.Indicator.prototype.maxValue;

/**
 * The mean.
 *
 * @property mean
 * @type Number
 */
ia.Indicator.prototype.mean;

/**
 * The median.
 *
 * @property median
 * @type Number
 */
ia.Indicator.prototype.median;

/**
 * The sum.
 *
 * @property sum
 * @type Number
 */
ia.Indicator.prototype.sum;

/**
 * The range.
 *
 * @property range
 * @type Number
 */
ia.Indicator.prototype.range;

/**
 * The lower quartile.
 *
 * @property lowerQuartile
 * @type Number
 */
ia.Indicator.prototype.lowerQuartile;

/**
 * The upper quartile.
 *
 * @property upperQuartile
 * @type Number
 */
ia.Indicator.prototype.upperQuartile;

/**
 * The interquartile range.
 *
 * @property interquartileRange
 * @type Number
 */
ia.Indicator.prototype.interquartileRange;

/**
 * The variance.
 *
 * @property variance
 * @type Number
 */
ia.Indicator.prototype.variance;

/**
 * The standard deviation.
 *
 * @property standardDeviation
 * @type Number
 */
ia.Indicator.prototype.standardDeviation;

/** 
 * Parses the JSON data.
 *
 * @method parseData
 * @param {JSON} data The json data describing the object.
 */
ia.Indicator.prototype.parseData = function(data) 
{
	// Parse the JSON data.
	if (this.data.fileName != undefined) this.fileName = this.geography.reportData.path + this.data.fileName;
	if (this.data.date != undefined) this.date = this.data.date;

	// Values
	this.hasData = false;
	if (this.data.values && this.data.values.length > 0)
	{
		this.hasData = true;

		this._indexHash = {};
		this._valueArray = this.data.values.concat();
		this._fValueArray = [];
	
		// Features
		var fArray = []
		var features = this.geography.getFeatures();
		var fLength = features.length;

		var v;
		var fv;
		var featureId;
		this.featureProfiles = {};

		for (var i = 0; i < fLength; i++) 
		{ 
			var f = features[i];
			featureId = f.id;

			v = this._valueArray[i];

			if (this.type == 'categoric')
				fv = this.geography.reportData.formatter.formatText(v);	
			else
				fv = this.geography.reportData.formatter.format(v, this.precision);

			// So we dont get repeated "no data" legend classes.
			if (fv == this.geography.reportData.formatter.noDataValue)
			{
				this._valueArray[i] = fv;
			}

			this._indexHash[featureId] = i;
			this._fValueArray.push(fv);

			// For area profiles.
			var feaObj =
			{
				id : f.id,
				name : f.name,
				value : this._valueArray[i],
				value_formatted : fv,
				isComparison : f.isComparison
			};
			var props = this.getProperties();
			for (var propName in props) 
			{
				feaObj[propName] = props[propName];
				feaObj[propName+"_formatted"] = this.geography.reportData.formatter.format(props[propName]);
				feaObj[propName+"_type"] = ia.Thematic.CATEGORIC;
			}
			this.featureProfiles[f.id] = feaObj;
		}

		// Statistics.
		this._stats.setData(this._valueArray);
		this.mean = this._stats.mean;
		this.median = this._stats.median;
		this.sum = this._stats.sum;
		this.count = this._stats.count;
		this.minValue = this._stats.minValue;
		this.maxValue = this._stats.maxValue;
		this.range = this._stats.range;
		this.lowerQuartile = this._stats.lowerQuartile;
		this.upperQuartile = this._stats.upperQuartile;
		this.interquartileRange = this._stats.interquartileRange;
		this.fifth = this._stats.getPercentile(0.05);
		this.ninetyFifth = this._stats.getPercentile(0.95);
		this.range_95_5 = this.ninetyFifth - this.fifth;
		this.variance = this._stats.variance;
		this.standardDeviation = this._stats.standardDeviation;
		this.mean_formatted = this.geography.reportData.formatter.format(this.mean, this.precision);
		this.median_formatted = this.geography.reportData.formatter.format(this.median, this.precision);
		this.sum_formatted = this.geography.reportData.formatter.format(this.sum, this.precision);
		this.minValue_formatted = this.geography.reportData.formatter.format(this.minValue, this.precision);
		this.maxValue_formatted = this.geography.reportData.formatter.format(this.maxValue, this.precision);
		this.range_formatted = this.geography.reportData.formatter.format(this.range, this.precision);
		this.lowerQuartile_formatted = this.geography.reportData.formatter.format(this.lowerQuartile, this.precision);
		this.upperQuartile_formatted = this.geography.reportData.formatter.format(this.upperQuartile, this.precision);
		this.interquartileRange_formatted = this.geography.reportData.formatter.format(this.interquartileRange, this.precision);
		this.variance_formatted = this.geography.reportData.formatter.format(this.variance, this.precision);
		this.standardDeviation_formatted = this.geography.reportData.formatter.format(this.standardDeviation, this.precision);
		this.fifth_formatted = this.geography.reportData.formatter.format(this.fifth, this.precision);
		this.ninetyFifth_formatted = this.geography.reportData.formatter.format(this.ninetyFifth, this.precision);
		this.range_95_5_formatted = this.geography.reportData.formatter.format(this.range_95_5, this.precision);

		// For area profiles.
		this.profile = 
		{
			id : this.id,
			name : this.name,
			date : this.date,
			type : this.type,
			href : this.href,
			minValue : this.minValue,
			maxValue : this.maxValue,
			count : this.count,
			sum : this.sum,
			mean : this.mean,
			median : this.median,
			range : this.range,
			lowerQuartile : this.lowerQuartile,
			upperQuartile : this.upperQuartile,
			fifth : this.fifth,
			ninetyFifth : this.ninetyFifth,
			range_95_5 : this.range_95_5,
			interquartileRange : this.interquartileRange,
			variance : this.variance,
			standardDeviation : this.standardDeviation,
			minValue_formatted : this.minValue_formatted,
			maxValue_formatted : this.maxValue_formatted,
			sum_formatted : this.sum_formatted,
			mean_formatted : this.mean_formatted,
			median_formatted : this.median_formatted,
			range_formatted : this.range_formatted,
			lowerQuartile_formatted : this.lowerQuartile_formatted,
			upperQuartile_formatted : this.upperQuartile_formatted,
			interquartileRange_formatted : this.interquartileRange_formatted,
			variance_formatted : this.variance_formatted,
			standardDeviation_formatted : this.standardDeviation_formatted,
			fifth_formatted : this.fifth_formatted,
			ninetyFifth_formatted : this.ninetyFifth_formatted,
			range_95_5_formatted : this.range_95_5_formatted
		};
	}

	// Comparison Values
	this._comparisonIndexHash = {};
	this._comparisonArray = [];
	this._fComparisonArray = [];
	if (this.data.comparisonValues && this.data.comparisonValues.length > 0)
	{
		this._comparisonArray = this.data.comparisonValues.concat();

		// Comparison Features
		var comparisonFeatures = this.geography.getComparisonFeatures();
		var cLength = comparisonFeatures.length;

		for (var i = 0; i < cLength; i++) 
		{ 
			featureId = comparisonFeatures[i].id;
			v = this._comparisonArray[i];
			this._comparisonIndexHash[featureId] = i;

			fv = this.geography.reportData.formatter.format(v, this.precision);
			this._fComparisonArray.push(fv);

			// For area profiles.
			var f = comparisonFeatures[i];
			var feaObj =
			{
				id : f.id,
				name : f.name,
				value : v,
				value_formatted : fv,
				isComparison : f.isComparison
			};
			var props = this.getProperties();
			for (var propName in props) 
			{
				feaObj[propName] = props[propName];
				feaObj[propName+"_formatted"] = this.geography.reportData.formatter.format(props[propName]);
				feaObj[propName+"_type"] = ia.Thematic.CATEGORIC;
			}
			this.featureProfiles[f.id] = feaObj;
		}
	}

	// Associates.
	this._associateArray = [];
	this._associateHash = {};
	var associates = this.data.associates;
	if (associates != undefined) 
	{	
		var n = associates.length;
		for (var i = 0; i < n; i++) 
		{ 
			var a = new ia.Associate(this.geography, this, associates[i]);
			this._associateArray[i] = a;
			this._associateHash[a.id] = a;

			if (associates[i].name.toLowerCase() == 'lowerlimit' || associates[i].name.toLowerCase() == 'lowerlimits') 
			{
				this._lowerLimits = new ia.Limits(this.geography, this, associates[i].values);
			}
			if (associates[i].name.toLowerCase() == 'upperlimit' || associates[i].name.toLowerCase() == 'upperlimits') 
			{
				this._upperLimits = new ia.Limits(this.geography, this, associates[i].values);
			}
		}
	}

	// Limits.
	if (this.data.limits != undefined) 
	{	
		this._lowerLimits = new ia.Limits(this.geography, this, this.data.limits.lower);
		this._upperLimits = new ia.Limits(this.geography, this, this.data.limits.upper);
	}
};

/** 
 * Returns the lower limits
 * 
 * @method getLowerLimits
 * @return {ia.Limits} A Limits object.
 */
ia.Indicator.prototype.getLowerLimits = function() {return this._lowerLimits; };

/** 
 * Returns the upper limits
 * 
 * @method getUpperLimits
 * @return {ia.Limits} A Limits object.
 */
ia.Indicator.prototype.getUpperLimits = function() {return this._upperLimits; };

/** 
 * Returns the value that corresponds to the feature id.
 * Will also return a comparison value.
 * 
 * @method getValue
 * @param {String} id The feature id.
 * @return {Number|String} The value for the given id.
 */
ia.Indicator.prototype.getValue = function(id) 
{
	if (this._indexHash[id] != undefined) return this._valueArray[this._indexHash[id]]
	else return this.getComparisonValue(id);
};

/** 
 * Returns the list of values.  
 *
 * @method getValues
 * @return {Number|String[]} An array of values.
 */	
ia.Indicator.prototype.getValues = function() {return this._valueArray;};

/** 
 * Returns the formatted value that corresponds to the feature id.
 * Will also return a comparison value.
 * 
 * @method getFormattedValue
 * @param {String} id The feature id.
 * @return {String} The formatted value for the given id.
 */
ia.Indicator.prototype.getFormattedValue = function(id) 
{
	if (this._indexHash[id] != undefined) return this._fValueArray[this._indexHash[id]]
	else return this.getFormattedComparisonValue(id);
};

/** 
 * Returns the list of formatted values.  
 *
 * @method getFormattedValues
 * @return {String[]} An array of formatted values.
 */	
ia.Indicator.prototype.getFormattedValues = function() {return this._fValueArray;};

/** 
 * Returns the comparison value that corresponds to the feature id.
 * 
 * @method getComparisonValue
 * @param {String} id The feature id.
 * @return {Number|String} The value for the given id.
 */
ia.Indicator.prototype.getComparisonValue = function(id) 
{
	if (this._comparisonIndexHash[id] != undefined)
		return this._comparisonArray[this._comparisonIndexHash[id]];
		
	return undefined;
};

/** 
 * Returns the list of comparison values.  
 *
 * @method getComparisonValues
 * @return {Number|String[]} An array of values.
 */	
ia.Indicator.prototype.getComparisonValues = function() {return this._comparisonArray;};

/** 
 * Returns the formatted comparison value that corresponds to the feature id.
 * 
 * @method getFormattedComparisonValue
 * @param {String} id The feature id.
 * @return {String} The formatted value for the given id.
 */
ia.Indicator.prototype.getFormattedComparisonValue = function(id) 
{
	if (this._comparisonIndexHash[id] != undefined)
		return this._fComparisonArray[this._comparisonIndexHash[id]];
		
	return undefined;
};

/** 
 * Returns the list of formatted comparison values.  
 *
 * @method getFormattedComparisonValues
 * @return {String[]} An array of formatted values.
 */	
ia.Indicator.prototype.getFormattedComparisonValues = function() {return this._fComparisonArray;};

/** 
 * Returns the associate that corresponds to the name.
 * 
 * @method getAssociate
 * @param {String} associateName The associate name.
 * @return {ia.Associate} An associate.
 */
ia.Indicator.prototype.getAssociate = function(associateName) {return this._associateHash[associateName];};

/** 
 * Returns the associates contained in the indicator.  
 *
 * @method getAssociates
 * @return {ia.Associate[]} An array of associates.
 */	
ia.Indicator.prototype.getAssociates = function() {return this._associateArray;};

/** 
 * Gets the data type for the passed data field.
 * 
 * @method getDataType
 * @param {String} dataField The data field as a String eg "value"; "associate1"; "name" etc.
 * @return {String} The data type or undefined.
 */
ia.Indicator.prototype.getDataType = function(dataField)
{
	if (dataField == "value")
	{
		return this.type;
	}
	else if (this.getAssociate(dataField) != undefined)
	{	
		return this.getAssociate(dataField).type
	}
	else if (dataField == "name")
	{
		return ia.Thematic.CATEGORIC;
	}
	else return undefined;
};

/** 
 * Gets the data precision for the passed data field.
 * 
 * @method getDataPrecision
 * @param {String} dataField The data field as a String eg "value"; "associate1"; "name" etc.
 * @return {Number} The data precision or undefined.
 */
ia.Indicator.prototype.getDataPrecision = function(dataField)
{
	if (dataField == "value")
	{
		return this.precision;
	}
	else if (this.getAssociate(dataField) != undefined)
	{	
		return this.getAssociate(dataField).precision;
	}
	else
	{
		return undefined;
	}
};

/** 
 * Returns a hashtable of the indicator plus associate data.
 *
 * <p>The returned data has the following structure:</p>
 *
 * <p>["eh11"]{id:"eh11", name:"polwarth", value:2345, value_formatted:2345, associate1:25, associate1_formatted:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, value_formatted:4347, associate1:45, associate1_formatted:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, value_formatted:2496, associate1:25, associate1_formatted:25}</p>
 *
 * @method getData
 * @param {String[]} featureIds An optional list of feature ids to get data for.
 * @return {Associative Array} As described above.
 */	
ia.Indicator.prototype.getData = function(featureIds) 
{
	var dataHash = {};

	var fLength;
	var featureArray;
	if (featureIds != null)
		fLength = featureIds.length;
	else
	{
		featureArray = this.geography.getFeatures();
		fLength = featureArray.length;
	}

	var associates = this.getAssociates();
	var aLength = associates.length;
	
	var lowerLimits = this.getLowerLimits();
	var upperLimits = this.getUpperLimits();

	// Each loop is a new row in the data.
	for (var i = 0; i < fLength; i++) 
	{ 
		// Feature.
		var feature;
		if (featureIds != null)
			feature = this.geography.getFeature(featureIds[i]);
		else
			feature = featureArray[i];

		if (feature != undefined)
		{
			// Indicator.
			var obj = {};
			obj.id = feature.id;
			obj.name = feature.name;
			obj.value = this.getValue(feature.id);
			obj.value_formatted = this.getFormattedValue(feature.id);

			// Feature properties.
			var props = feature.getProperties();
			for (var propName in props) 
			{
				obj[propName] = props[propName];
				obj[propName+"_formatted"] = this.geography.reportData.formatter.format(props[propName]);
			}

			// Limits.
			if (lowerLimits) 
			{
				obj.lowerLimit = lowerLimits.getValue(feature.id); 
				obj.lowerLimit_formatted = lowerLimits.getFormattedValue(feature.id); 
			}
			if (upperLimits) 
			{
				obj.upperLimit = upperLimits.getValue(feature.id); 
				obj.upperLimit_formatted = upperLimits.getFormattedValue(feature.id); 
			}
			
			// Notes.
			if (feature.href)  obj.href = feature.href;

			// Associates
			for (var j = 0; j < aLength; j++) 
			{		
				obj[associates[j].name] = associates[j].getValue(feature.id);
				obj[associates[j].name+"_formatted"] = associates[j].getFormattedValue(feature.id);
			}

			dataHash[feature.id] = obj;
		}
	}

	return dataHash;
};

/** 
 * Returns a hashtable of the indicator plus associate comparison data.
 *
 * <p>The returned data has the following structure:</p>
 *
 * <p>["eh11"]{id:"eh11", name:"polwarth", value:2345, value_formatted:2345, associate1:25, associate1_formatted:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, value_formatted:4347, associate1:45, associate1_formatted:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, value_formatted:2496, associate1:25, associate1_formatted:25}</p>
 *
 * @method getComparisonData
 * @return {Associative Array} As described above.
 */	
ia.Indicator.prototype.getComparisonData = function() 
{
	var dataHash = {};

	var featureArray = this.geography.getComparisonFeatures();
	var fLength = featureArray.length;

	var associates = this.getAssociates();
	var aLength = associates.length;

	var lowerLimits = this.getLowerLimits();
	var upperLimits = this.getUpperLimits();

	for (var i = 0; i < fLength; i++) 
	{ 
		var feature = featureArray[i];
			
		var obj = {};
		obj.id = feature.id;
		obj.name = feature.name;
		obj.value = this.getComparisonValue(feature.id);
		obj.value_formatted = this.getFormattedComparisonValue(feature.id);

		// Feature properties.
		var props = feature.getProperties();
		for (var propName in props) 
		{
			obj[propName] = props[propName];
			obj[propName+"_formatted"] = this.geography.reportData.formatter.format(props[propName]);
		}

	    // Limits.
		if (lowerLimits)
		{
		    obj.lowerLimit = lowerLimits.getValue(feature.id);
		    obj.lowerLimit_formatted = lowerLimits.getFormattedValue(feature.id);
		}
		if (upperLimits)
		{
		    obj.upperLimit = upperLimits.getValue(feature.id);
		    obj.upperLimit_formatted = upperLimits.getFormattedValue(feature.id);
		}

	    // Notes.
		if (feature.href) obj.href = feature.href;

	    // Associates
		for (var j = 0; j < aLength; j++) 
		{		
			obj[associates[j].name] = associates[j].getComparisonValue(feature.id);
			obj[associates[j].name+"_formatted"] = associates[j].getFormattedComparisonValue(feature.id);
		}

		dataHash[feature.id] = obj;
	}
	
	return dataHash;
};

/** 
 * Gets the indicators associate data.
 *
 * @method getData
 * @param {String} associateNames An optional list of associate ids.
 * @param {String[]} featureIds An optional list of feature ids to get data for.
 * @return {Object[]} An array of data objects.
 */	
ia.Indicator.prototype.getAssociateData = function(associateIds, featureIds) 
{
	// Hashtable to contain the data
	var dataHash = {};
	dataHash.dates = [];
	dataHash.type = [];

	var associates = this.getAssociates();
	var n = associates.length;
	for (var i = 0; i < n; i++) 
	{ 
		var associate = associates[i];

		if (associateIds != undefined)
		{
			if (associateIds.indexOf(associate.id) != -1)
			{
				dataHash.type[dataHash.type.length] = associate.type;
				dataHash.dates[dataHash.dates.length] = associate.id;
				dataHash[associate.name] = associate.getData(featureIds);
			}
		}
		else
		{
			dataHash.type[dataHash.type.length] = associate.type;
			dataHash.dates[dataHash.dates.length] = associate.id;
			dataHash[associate.name] = associate.getData(featureIds);
		}
	}

	return dataHash;
};

/** 
 * Gets the indicators associate comparison data.
 *
 * @method getData
 * @param {String} associateNames An optional list of associate ids.
 * @param {String[]} featureIds An optional list of feature ids to get data for.
 * @return {Object[]} An array of data objects.
 */	
ia.Indicator.prototype.getAssociateComparisonData = function(associateIds, featureIds) 
{
	// Hashtable to contain the data
	var dataHash = {};
	dataHash.dates = [];
	dataHash.type = [];

	var associates = this.getAssociates();
	var n = associates.length;
	for (var i = 0; i < n; i++) 
	{ 
		var associate = associates[i];

		if (associateIds != undefined)
		{
			if (associateIds.indexOf(associate.id) != -1)
			{
				dataHash.type[dataHash.type.length] = associate.type;
				dataHash.dates[dataHash.dates.length] = associate.id;
				dataHash[associate.name] = associate.getComparisonData(featureIds);
			}
		}
		else
		{
			dataHash.type[dataHash.type.length] = associate.type;
			dataHash.dates[dataHash.dates.length] = associate.id;
			dataHash[associate.name] = associate.getComparisonData(featureIds);
		}
	}

	return dataHash;
};