/** 
 * Provides statistical information about an array of numbers (<code>data</code>).
 *
 * @author J Clare
 * @class ia.Statistics
 * @constructor
 * @param {Number[]} data An array of numbers.
 */
ia.Statistics = function(data) 
{
	if (data != undefined) this.setData(data);
};

/** 
 * An array in which any duplicated values in the data array are removed.
 *
 * @property unique
 * @type Number[]
 */
ia.Statistics.prototype.unique;

/** 
 * The data array sorted by numeric ascending, with none numeric values removed.
 *
 * @property sorted
 * @type Number[]
 */
ia.Statistics.prototype.sorted;

/** 
 * The count.
 *
 * @property count
 * @type Number
 */
ia.Statistics.prototype.count;

//--------------------------------------------------------------------------
//
// Central tendency of a dataset, i.e. the centre of a frequency distribution.
//
//--------------------------------------------------------------------------

/** 
 * The sum.
 *
 * @property sum
 * @type Number
 */
ia.Statistics.prototype.sum;

/** 
 * The average value of the dataset, i.e. the sum of all the data divided 
 * by the number of variables. The arithmetic mean is commonly called 
 * the "average". When the word "mean" is used without a modifier, it 
 * usually refers to the arithmetic mean.
 * 
 * <p>The mean is a good measure of central tendency for symmetrical 
 * (e.g. normal) distributions but can be misleading in skewed distributions 
 * since it is influenced by outliers. In general, the mean is larger 
 * than the median in positively skewed distributions and less than the median 
 * in negatively skewed distributions.</p>
 * 
 * <p>Therefore, other statistics such as the median may be more informative 
 * for distributions that are frequently very skewed. The mean, median, and 
 * mode are equal in symmetrical frequency distributions. The mean is higher 
 * than the median in positively (right) skewed distributions and lower than 
 * the median in negatively (left) skewed distributions.</p>
 *
 * @property mean
 * @type Number
 */
ia.Statistics.prototype.mean;

/** 
 * The middle value in the dataset, i.e. half the variables 
 * have values greater than the median and the other half 
 * values which are less. The median is less sensitive to 
 * outliers (extreme scores) than the mean and thus a 
 * better measure than the mean for highly skewed distributions.
 *
 * @property median
 * @type Number
 */
ia.Statistics.prototype.median;

/** 
 * The most frequently occurring value in the dataset. 
 * Easy to determine, but subject to variation and of limited value.
 *
 * @property mode
 * @type Number[]
 */
ia.Statistics.prototype.mode;

/** 
 * The most frequently occurring value in the dataset. 
 * Easy to determine, but subject to variation and of limited value.
 *
 * @property modeString
 * @type String
 */
ia.Statistics.prototype.modeString;

/** 
 * The number of occurrences of the mode value
 *
 * @property modeCount
 * @type Number
 */
ia.Statistics.prototype.modeCount;

//--------------------------------------------------------------------------
//
// Variability (or dispersion) measures the amount of scatter in a dataset.
//
//--------------------------------------------------------------------------

/** 
 * The minimum value.
 *
 * @property minValue
 * @type Number
 */
ia.Statistics.prototype.minValue;

/** 
 * The maximum value.
 *
 * @property maxValue
 * @type Number
 */
ia.Statistics.prototype.maxValue;

/** 
 * The difference between the largest and the smallest value in the dataset. 
 * Since the range only takes into account two values from the entire dataset, 
 * it may be heavily influenced by outliers in the data.
 *
 * @property modeString
 * @type Number
 */
ia.Statistics.prototype.range;

/** 
 * The lower quartile.
 *
 * @property lowerQuartile
 * @type Number
 */
ia.Statistics.prototype.lowerQuartile;

/** 
 * The upper quartile.
 *
 * @property upperQuartile
 * @type Number
 */
ia.Statistics.prototype.upperQuartile;

/** 
 * The interquartile range.
 *
 * @property interquartileRange
 * @type Number
 */
ia.Statistics.prototype.interquartileRange;

/** 
 * The variance for a population using the deviation score method.
 * Variance is the average squared deviation of the scores from the mean.
 *
 * @property variance
 * @type Number
 */
ia.Statistics.prototype.variance;

/** 
 * The standard deviation for a population using the deviation score method.
 * Standard Deviation is the average deviation of the scores from the mean.
 *
 * @property standardDeviation
 * @type Number
 */
ia.Statistics.prototype.standardDeviation;

/** 
 * Gets the data array.
 *
 * @method getData
 * @param {Number[]} the array.
 */
ia.Statistics.prototype.getData = function()
{
	return this._data;
};

/** 
 * Sets the data array.
 *
 * @method setData
 * @param {Number[]} data the array.
 */
ia.Statistics.prototype.setData = function(data)
{
	this._data = data;
	this._invalidateData();
};

/** 
 * Returns the percentile at the given position in the dataset.
 * Uses the sorted array.
 * 
 * @method getPercentile
 * @param {Number} percentile Valid values are 0 to 1.
 * <p>
 * <li>
 * <ul>Q1 (Lower Quartile): The 25th percentile (0.25).</ul>
 * <ul>Q2 (Median): The 50th percentile (0.5).</ul>
 * <ul>Q3 (Upper Quartile): The 75th percentile (0.75).</ul>
 * </li>
 * </p>
 * @param {Number[]} a The array of numbers to use - sorted or unique.
 * @return {Number} The value of the given percentile or NaN if
 * the percentile is outside the valid range (0 - 1).
 */
ia.Statistics.prototype.getPercentile = function(percentile, a)
{	
	if ((percentile < 0) || (percentile > 1)) return NaN;

	if (a == undefined) a = this.sorted.concat();

	/*
	var value;
	var n = a.length;
	var pos = percentile * (n + 1);
	var fpos = Math.floor(pos);        
	var dif = pos - fpos;
	var lower = a[fpos - 1];
	var upper = a[fpos];
	value = parseFloat(lower) + (dif * (upper - lower));
	return value;
	*/

	// Updated after PHE work JC 06/06/17
    // https://github.com/jstat/jstat    
	var realIndex = percentile * (a.length - 1);
	var index = parseInt(realIndex);
	var frac = realIndex - index;
	if (index + 1 < a.length) return a[index] * (1 - frac) + a[index + 1] * frac;
	else return a[index];
};

/** 
 * Get a simple text representation of this object.
 * 
 * @method toString
 * @return {String} A text string.
 */
ia.Statistics.prototype.toString = function() 
{
	var txt =  "-----Data-----" +
		"\n Data: "+this.getData() +
		"\n Sorted data: "+this.sorted +
		"\n Unique data: "+this.unique +

		"\n\n -----Central tendency-----" + 
		"\n Mean: "+this.mean +
		"\n Median: "+this.median +
		"\n Mode: "+this.mode +
		"\n Mode Count: "+this.modeCount +

		"\n\n -----Variability-----" +
		"\n Min: "+this.minValue +
		"\n Max: "+this.maxValue +
		"\n Range: "+this.range +
		"\n Lower quartile: "+this.lowerQuartile +
		"\n Upper quartile: "+this.upperQuartile +
		"\n Interquartile range: "+this.interquartileRange +
		"\n Population Variance: "+this.variance +
		"\n Population Standard deviation: "+this.standardDeviation
	return txt;
};		

/** 
 * Get a simple text representation of the main statistics.
 * 
 * @method statsToString
 * @return {String} A text string.
 */
ia.Statistics.prototype.statsToString = function() 
{
	var txt = "-----Central tendency-----" +
		"\n Mean: "+this.mean +
		"\n Median: "+this.median +
		"\n Mode: "+this.mode +
		"\n Mode Count: "+this.modeCount +

		"\n\n -----Variability-----" +
		"\n Min: "+this.minValue +
		"\n Max: "+this.maxValue +
		"\n Range: "+this.range +
		"\n Lower quartile: "+this.lowerQuartile +
		"\n Upper quartile: "+this.upperQuartile +
		"\n Interquartile range: "+this.interquartileRange +
		"\n Population Variance: "+this.variance +
		"\n Population Standard deviation: "+this.standardDeviation
	return txt;
};

/** 
 * Called when the data has been changed to recalculate statistics.
 * 
 * @method _invalidateData
 * @private
 */
ia.Statistics.prototype._invalidateData = function() 
{
	this.sorted = new Array();
	var n = this._data.length;
	for (var i = 0; i < n; i++)
	{
		var value = this._data[i];
		if (ia.isNumber(value)) this.sorted[this.sorted.length] = value;
	}

	// Sort data.
	this.sorted.sort(function sortNumber(a,b) {return a - b;});

	// Calculate complex statistical info.
	// Unique data array variables.
	this.unique = [];
	var prevValue;

	// Count.
	this.count = this._data.length;

	// Mean variables.
	this.sum = 0;

	// Variance variables.
	var sumOfValuesSquared = 0;
	var vSquared;

	// Mode variables.
	this.mode = [];
	this.modeCount = 0;
	var duplicateCount = 1;

	// Loop through the data set only once
	// for all calculations.
	var n = this.sorted.length;
	for (var i = 0; i < n; i++)
	{
		var v = this.sorted[i];

		if (v != prevValue) 
		{
			// Unique data array.
			this.unique.push(v);

			// The prevValue is a mode if it
			// appears as often as the other modes.
			// Reset the mode array if it appears
			// more often than the previous modes.
			if (duplicateCount > this.modeCount) this.mode = [];
			if (duplicateCount == this.modeCount)
			{
				this.mode.push(prevValue);
				this.modeCount = duplicateCount;
			}

			// Reset duplicate value count.
			duplicateCount = 1;
		}
		else
			duplicateCount++;

		prevValue = v;

		// Mean.
		this.sum += parseFloat(v);

		// Variance.
		vSquared = v * v;
		sumOfValuesSquared = sumOfValuesSquared + vSquared;
	}

	// Mean calculation.
	this.mean = this.sum / n;

	// Percentile Calculation.
	this.lowerQuartile = this.getPercentile(0.25, this.sorted);
	this.median = this.getPercentile(0.5, this.sorted);
	this.upperQuartile = this.getPercentile(0.75, this.sorted);
	this.interquartileRange = this.upperQuartile - this.lowerQuartile;

	// Variance calculation.
	var meanSquared = this.mean * this.mean;
	var sumOfDeviationSquared = 0;

	for (i=0; i < n; i++)
	{
		v = this.sorted[i];
		var deviation = v - this.mean;
		var deviationSquared = deviation*deviation;
		sumOfDeviationSquared = sumOfDeviationSquared + deviationSquared;
	}

	// Standard deviation calculation.
	this.variance = sumOfDeviationSquared / (n-1);
	this.standardDeviation = Math.sqrt(Math.abs(this.variance));

	// Calculate simple statistical info.
	this.minValue = this.sorted[0];
	this.maxValue = this.sorted[n-1];
	this.range = this.maxValue - this.minValue;
};