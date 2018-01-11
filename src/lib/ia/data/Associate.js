/** 
 * Contains information about an this.
 *
 * @author J Clare
 * @class ia.Associate
 * @extends ia.BaseData
 * @constructor
 * @param {ia.Geography} geography The geography the associate belongs to.
 * @param {ia.Indicator} indicator The indicator the associate belongs to.
 * @param {JSON} data The json data describing the object.
 */
ia.Associate = function(geography, indicator, data)
{
	ia.Associate.baseConstructor.call(this, data, indicator);
	
	this._stats = new ia.Statistics();
	this.indicator = indicator;
	this.geography = geography;
	this.parseData(data);
};
ia.extend(ia.BaseData, ia.Associate);

/** 
 * The parent indicator.
 *
 * @property indicator
 * @type ia.Indicator
 */
ia.Associate.prototype.indicator;
	
/**
 * The minimum value.
 *
 * @property minValue
 * @type Number
 */
ia.Associate.prototype.minValue;

/**
 * The maximum value.
 *
 * @property maxValue
 * @type Number
 */
ia.Associate.prototype.maxValue;

/**
 * The mean.
 *
 * @property mean
 * @type Number
 */
ia.Associate.prototype.mean;

/**
 * The median.
 *
 * @property median
 * @type Number
 */
ia.Associate.prototype.median;

/**
 * The sum.
 *
 * @property sum
 * @type Number
 */
ia.Associate.prototype.sum;

/**
 * The range.
 *
 * @property range
 * @type Number
 */
ia.Associate.prototype.range;

/**
 * The lower quartile.
 *
 * @property lowerQuartile
 * @type Number
 */
ia.Associate.prototype.lowerQuartile;

/**
 * The upper quartile.
 *
 * @property upperQuartile
 * @type Number
 */
ia.Associate.prototype.upperQuartile;

/**
 * The interquartile range.
 *
 * @property interquartileRange
 * @type Number
 */
ia.Associate.prototype.interquartileRange;

/**
 * The variance.
 *
 * @property variance
 * @type Number
 */
ia.Associate.prototype.variance;

/**
 * The standard deviation.
 *
 * @property standardDeviation
 * @type Number
 */
ia.Associate.prototype.standardDeviation;

/** 
 * Parses the JSON data.
 *
 * @method parseData
 * @param {JSON} data The json data describing the object.
 */
ia.Associate.prototype.parseData = function(data) 
{
	// Parse the JSON data.
	this.id = this.data.name; // Override id setting for associate because it uses "name" rather than "id".

	this._indexHash = {};
	this._valueArray = [];
	this._fValueArray = [];

	// Values
	this.hasData = false;
	if (this.data.values && this.data.values.length > 0)
	{
		this.hasData = true;
		
		this._valueArray = this.data.values.concat();
		
		// Features
		var features = this.geography.getFeatures();
		var fLength = features.length;

		var v;
		var fv;
		var featureId;

		for (var i = 0; i < fLength; i++) 
		{ 
			featureId = features[i].id;
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
			var feaObj = this.indicator.featureProfiles[featureId];
			if (feaObj != undefined)
			{
				feaObj[this.name] = this._valueArray[i];
				feaObj[this.name+"_formatted"] = fv;
				feaObj[this.name+"_type"] = this.type;
			}
		}

		// Statistics.
		this._stats.setData(this._valueArray);
		this.mean = this._stats.mean;
		this.median = this._stats.median;
		this.count = this._stats.count;
		this.sum = this._stats.sum;
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
		this.indicator.profile[this.name+"_minValue"] = this.minValue;
		this.indicator.profile[this.name+"_maxValue"] = this.maxValue;
		this.indicator.profile[this.name+"_sum"] = this.sum;
		this.indicator.profile[this.name+"_count"] = this.count;
		this.indicator.profile[this.name+"_mean"]  = this.mean;
		this.indicator.profile[this.name+"_median"] = this.median;
		this.indicator.profile[this.name+"_range"] = this.range;
		this.indicator.profile[this.name+"_lowerQuartile"] = this.lowerQuartile;
		this.indicator.profile[this.name+"_upperQuartile"] = this.upperQuartile;
		this.indicator.profile[this.name+"_fifth"] = this.fifth;
		this.indicator.profile[this.name+"_ninetyFifth"] = this.ninetyFifth;
		this.indicator.profile[this.name+"_range_95_5"] = this.range_95_5;
		this.indicator.profile[this.name+"_interquartileRange"] = this.interquartileRange;
		this.indicator.profile[this.name+"_variance"] = this.variance;
		this.indicator.profile[this.name+"_standardDeviation"] = this.standardDeviation;
		this.indicator.profile[this.name+"_minValue_formatted"] = this.minValue_formatted;
		this.indicator.profile[this.name+"_maxValue_formatted"] = this.maxValue_formatted;
		this.indicator.profile[this.name+"_sum_formatted"] = this.sum_formatted;
		this.indicator.profile[this.name+"_mean_formatted"]  = this.mean_formatted;
		this.indicator.profile[this.name+"_median_formatted"] = this.median_formatted;
		this.indicator.profile[this.name+"_range_formatted"] = this.range_formatted;
		this.indicator.profile[this.name+"_lowerQuartile_formatted"] = this.lowerQuartile_formatted;
		this.indicator.profile[this.name+"_upperQuartile_formatted"] = this.upperQuartile_formatted;
		this.indicator.profile[this.name+"_interquartileRange_formatted"] = this.interquartileRange_formatted;
		this.indicator.profile[this.name+"_variance_formatted"] = this.variance_formatted;
		this.indicator.profile[this.name+"_standardDeviation_formatted"] = this.standardDeviation_formatted;
		this.indicator.profile[this.name+"_fifth_formatted"] = this.fifth_formatted;
		this.indicator.profile[this.name+"_ninetyFifth_formatted"] = this.ninetyFifth_formatted;
		this.indicator.profile[this.name+"_range_95_5_formatted"] = this.range_95_5_formatted;
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
			var feaObj = this.indicator.featureProfiles[featureId];
			if (feaObj != undefined)
			{
				feaObj[this.name] = v;
				feaObj[this.name+"_formatted"] = fv;
				feaObj[this.name+"_type"] = this.type;
			}
		}
	}
};

/** 
 * Returns the value that corresponds to the feature id.
 * Will return a comparison value if the id starts with "#".
 * 
 * @method getValue
 * @param {String} id The feature id.
 * @return {Number|String} The value for the given id.
 */
ia.Associate.prototype.getValue = function(id) 
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
ia.Associate.prototype.getValues = function() {return this._valueArray;};

/** 
 * Returns the formatted value that corresponds to the feature id.
 * Will return a comparison value if the id starts with "#".
 * 
 * @method getFormattedValue
 * @param {String} id The feature id.
 * @return {String} The formatted value for the given id.
 */
ia.Associate.prototype.getFormattedValue = function(id) 
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
ia.Associate.prototype.getFormattedValues = function() {return this._fValueArray;};

/** 
 * Returns the comparison value that corresponds to the feature id.
 * 
 * @method getComparisonValue
 * @param {String} id The feature id.
 * @return {Number|String} The value for the given id.
 */
ia.Associate.prototype.getComparisonValue = function(id) 
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
ia.Associate.prototype.getComparisonValues = function() {return this._comparisonArray;};

/** 
 * Returns the formatted comparison value that corresponds to the feature id.
 * 
 * @method getFormattedComparisonValue
 * @param {String} id The feature id.
 * @return {String} The formatted value for the given id.
 */
ia.Associate.prototype.getFormattedComparisonValue = function(id) 
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
ia.Associate.prototype.getFormattedComparisonValues = function() {return this._fComparisonArray;};

/** 
 * Returns a hashtable of the associate data.
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
ia.Associate.prototype.getData = function(featureIds) 
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

	// Each loop is a new row in the data.
	for (var i = 0; i < fLength; i++) 
	{ 
		// Feature.
		var feature;
		if (featureIds != null)
			feature = this.geography.getFeature(featureIds[i]);
		else
			feature = featureArray[i];

		// Indicator.
		var obj = {};
		obj.id = feature.id;
		obj.name = feature.name;
		obj.value = this.getValue(feature.id);
		obj.value_formatted = this.getFormattedValue(feature.id);

		dataHash[feature.id] = obj;
	}

	return dataHash;
};

/** 
 * Returns a hashtable of the associate comparison data.
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
ia.Associate.prototype.getComparisonData = function(featureIds) 
{
	var dataHash = {};

	var fLength;
	var featureArray;
	if (featureIds != null)
		fLength = featureIds.length;
	else
	{
		featureArray = this.geography.getComparisonFeatures();
		fLength = featureArray.length;
	}

	// Each loop is a new row in the data.
	for (var i = 0; i < fLength; i++) 
	{ 
		// Feature.
		var feature;
		if (featureIds != null)
			feature = this.geography.getComparisonFeature(featureIds[i]);
		else
			feature = featureArray[i];

		// Indicator.
		var obj = {};
		obj.id = feature.id;
		obj.name = feature.name;
		obj.value = this.getComparisonValue(feature.id);
		obj.value_formatted = this.getFormattedComparisonValue(feature.id);

		dataHash[feature.id] = obj;
	}

	return dataHash;
};