/** 
 * Contains information about an upper or lower limit.
 *
 * @author J Clare
 * @class ia.Limits
 * @constructor
 * @param {ia.Geography} geography The geography the Limits belongs to.
 * @param {ia.Indicator} indicator The indicator the Limits belongs to.
 * @param {JSON} data The json data describing the object.
 */
ia.Limits = function(geography, indicator, data)
{	
	// Parse the JSON data.
	this._indexHash = {};
	this._valueArray = data;
	this._fValueArray = [];
	if (this._valueArray)
	{
		// Features
		var features = geography.getFeatures();
		var fLength = features.length;

		this.minValue = Infinity;
		this.maxValue = -Infinity;
		var v;
		var fv;
		var featureId;

		var i;
		for (i = 0; i < fLength; i++) 
		{ 
			featureId = features[i].id;
			v = this._valueArray[i];
			fv = geography.reportData.formatter.format(v, indicator.precision);

			this._indexHash[featureId] = i;
			this.minValue = (v < this.minValue) ? v : this.minValue;
			this.maxValue = (v > this.maxValue) ? v : this.maxValue;  

			this._fValueArray.push(fv);
		}

	    // Comparison Features
		var compFeatures = geography.getComparisonFeatures();
		var cLength = compFeatures.length;

		for (var j = 0; j < cLength; j++)
		{
		    featureId = compFeatures[j].id;
		    var index = i++;

		    if (this._valueArray.length >= (index + 1))
		    {
		        v = this._valueArray[index];
		        fv = geography.reportData.formatter.format(v, indicator.precision);
		        this._indexHash[featureId] = index;
		        this._fValueArray.push(fv);
		    }
		}
	}
};

/**
 * The minimum value.
 *
 * @property minValue
 * @type Number
 */
ia.Limits.prototype.minValue;

/**
 * The maximum value.
 *
 * @property maxValue
 * @type Number
 */
ia.Limits.prototype.maxValue;

/** 
 * Returns the value that corresponds to the feature id.
 * 
 * @method getValue
 * @param {String} id The feature id.
 * @return {Number|String} The value for the given id.
 */
ia.Limits.prototype.getValue = function(id) {return this._valueArray[this._indexHash[id]];};

/** 
 * Returns the list of values.  
 *
 * @method getValues
 * @return {Number|String[]} An array of values.
 */	
ia.Limits.prototype.getValues = function() {return this._valueArray;};

/** 
 * Returns the formatted value that corresponds to the feature id.
 * 
 * @method getFormattedValue
 * @param {String} id The feature id.
 * @return {String} The formatted value for the given id.
 */
ia.Limits.prototype.getFormattedValue = function(id) {return this._fValueArray[this._indexHash[id]];};

/** 
 * Returns the list of formatted values.  
 *
 * @method getFormattedValues
 * @return {String[]} An array of formatted values.
 */	
ia.Limits.prototype.getFormattedValues = function() {return this._fValueArray;};