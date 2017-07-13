/** 
 * Calculates breaks for various types of classification.
 *
 * @author J Clare
 * @class ia.BreaksCalculator
 * @constructor
 * @param {Number[]} data The data array.
 */
ia.BreaksCalculator = function(data)
{
	this._stats = new ia.Statistics();
	this._data = new Array();
	this._functions = new Object();

	this.sdSize = 1;
	this.errorMessage = "Legend error defaulting to equal interval.";

	this.addFunction(ia.Thematic.CONTINUOUS, ia.Thematic.CONTINUOUS);
	this.addFunction(ia.Thematic.EQUAL_INTERVAL, ia.Thematic.EQUAL_INTERVAL);
	this.addFunction(ia.Thematic.QUANTILE, ia.Thematic.QUANTILE);
	this.addFunction(ia.Thematic.NATURAL, ia.Thematic.NATURAL);
	this.addFunction(ia.Thematic.STANDARD_DEVIATION, ia.Thematic.STANDARD_DEVIATION);

	if (data != undefined) this.setData(data);
};

/**
 * The size of the interval to use for standard deviation calculators. 
 * 
 * @property sdSize
 * @type Number
 * @default 1
 */
ia.BreaksCalculator.prototype.sdSize;

/** 
 * The error message that appears when a calculator breaks and defaults to equal interval. 
 *
 * @property errorMessage
 * @type String
 * @default "Legend error defaulting to equal interval."
 */
ia.BreaksCalculator.prototype.errorMessage;

/** 
 * Adds a function. The function receives the number of classes as
 * a parameter and must return the calculated breaks.
 * 
 * @method addFunction
 * @param {String} classifierName The name of the classifier.
 * @param {Function} fnc The function.
 */
ia.BreaksCalculator.prototype.addFunction = function(classifierName, fnc)
{
	this._functions[classifierName] = fnc;
};

/** 
 * Gets the statistics.
 *
 * @method getStats
 * @return {ia.Statistics} The statistics.
 */
ia.BreaksCalculator.prototype.getStats = function()
{
	return this._stats;
};

/** 
 * Gets the data.
 *
 * @method getData
 * @return {Number[]} The data.
 */
ia.BreaksCalculator.prototype.getData = function()
{
	return this._data;
};

/** 
 * Sets the data.
 *
 * @method setData
 * @param {Number[]} value The data.
 */
ia.BreaksCalculator.prototype.setData = function(value)
{
	this._data = value;
	this._stats.setData(value);
};

/** 
 * Classifies a set of data values by setting the value ranges 
 * in each class to be equal in size.
 * 
 * @method getBreaks
 * @param {Number} numberOfClasses The number of classes to use in the classification.
 * @param {String} name The name of the classification to use.
 * @return {Number[]} The class breaks as an array of size (numberOfClasses + 1).
 * Returns null if unable to calculate the breaks. 
 * The lower and upper boundaries are included in the breaks.
 */
ia.BreaksCalculator.prototype.getBreaks = function(numberOfClasses, classificationType)
{
	if (numberOfClasses == null) numberOfClasses = 5;
	if (classificationType == null) classificationType = "equalInterval";
	var breaks;
	
	try 
	{			
		if (this._stats.range == 0 && classificationType != 'customClassifier')
		{
			breaks = [this._stats.minValue];
		}
		else
		{
			var fnc = this._functions[classificationType];
			if (fnc != undefined) 
			{
				if (fnc == ia.Thematic.CONTINUOUS) 				breaks = this.continuous(numberOfClasses);
				else if (fnc == ia.Thematic.EQUAL_INTERVAL) 	breaks = this.equalIntervals(numberOfClasses);
				else if (fnc == ia.Thematic.QUANTILE) 			breaks = this.quantiles(numberOfClasses);
				else if (fnc == ia.Thematic.NATURAL) 			breaks = this.natural(numberOfClasses);
				else if (fnc == ia.Thematic.STANDARD_DEVIATION) breaks = this.standardDeviation(numberOfClasses);
				else 											breaks = fnc.call(null, numberOfClasses);
			}
		}
	} 
	catch (error) 
	{
		// Default to equal interval.
		breaks = this.equalIntervals(numberOfClasses);
	}

	if (breaks)
	{
		// Final check is to remove any breaks that may have been repeated.
		var unique = breaks.filter(function (itm,i,a) {return i == a.indexOf(itm);});
		breaks = unique.concat();
	}

	return breaks;
};

/** 
 * Classifies a set of data values by continuous values.
 * 
 * @method continuous
 * @param {Number} numberOfClasses The number of classes to use in the classification
 * which is irrelevant in this case.
 * @return {Number[]} The array of continuous values.
 */
ia.BreaksCalculator.prototype.continuous = function(numberOfClasses)
{
	if (numberOfClasses == null) numberOfClasses = 5;
	
	if (this._stats.range > 0)
	{
		return this._stats.unique;
	}
	else
	{
		return null;
	}
};

/** 
 * Classifies a set of data values by setting the value ranges 
 * in each class to be equal in size.
 * 
 * @method equalIntervals
 * @param {Number} numberOfClasses The number of classes to use in the classification.
 * @return {Number[]} The class breaks as an array of size (numberOfClasses + 1).
 * Returns null if unable to calculate the breaks. 
 * The lower and upper boundaries are included in the breaks.
 */
ia.BreaksCalculator.prototype.equalIntervals = function(numberOfClasses)
{
	if (numberOfClasses == null) numberOfClasses = 5;

	if (this._stats.range > 0)
	{
		var nBreaks = numberOfClasses + 1;
		var breakArray = new Array(nBreaks);
		var classSize = this._stats.range / numberOfClasses;

		breakArray[0] = this._stats.minValue;
		for (var i = 1; i < numberOfClasses; i++)
		{
			breakArray[i] = parseFloat(this._stats.minValue) + (i * classSize);
		}
		breakArray[nBreaks-1] = this._stats.maxValue;

		return breakArray;
	}
	else
	{
		return null;
	}
}

/** 
 * Classifies a set of data values into classes with an equal number of units in each class.
 * 
 * @method quantiles
 * @param {Number} numberOfClasses The number of classes to use in the classification.
 * @return {Number[]} The class breaks as an array of size (numberOfClasses + 1).
 * Returns null if unable to calculate the breaks. 
 * The lower and upper boundaries are included in the breaks.
 */
ia.BreaksCalculator.prototype.quantiles = function(numberOfClasses)
{
	if (numberOfClasses == null) numberOfClasses = 5;
	
	var invalidBreaks = false;
	var breakArray = this._quantileFunc(numberOfClasses, this._stats.sorted);
	
	var n = breakArray.length;
	for (var j = 0; j < n-1; j++)
	{
		if (breakArray[j] >= breakArray[j+1])
		{
			invalidBreaks = true;
			break;
		}
	}
	
	while (invalidBreaks)
	{
		breakArray = this._quantileFunc(numberOfClasses, this._stats.unique);
		n = breakArray.length;

		if (n == 1) invalidBreaks = false;
		else
		{
			for (var j = 0; j < n-1; j++)
			{
				if (breakArray[j] >= breakArray[j+1])
				{
					numberOfClasses--;
					invalidBreaks = true;
					break;
				}
				else invalidBreaks = false;
			}
		}
	}

	return breakArray;
};

/** 
 * Classifies a set of data values into classes with an equal number of units in each class.
 * 
 * @method _quantileFunc
 * @param {Number} numberOfClasses The number of classes to use in the classification.
 * @param {Number[]} a The array of numbers to use - this._stats.sorted or this._stats.unique.
 * @return {Number[]} The class breaks as an array of size (numberOfClasses + 1).
 * Returns null if unable to calculate the breaks. 
 * The lower and upper boundaries are included in the breaks.
 * @private
 */
ia.BreaksCalculator.prototype._quantileFunc = function(numberOfClasses, a)
{
	if (this._stats.range > 0)
	{
		if (this._stats.unique.length < numberOfClasses)
			numberOfClasses = this._stats.unique.length;

		var nBreaks = numberOfClasses + 1;
		var breakArray = new Array(nBreaks);
		var percentileIncr = 1 / numberOfClasses;

		breakArray[0] = this._stats.minValue;
		for (var i = 1; i < numberOfClasses; i++)
		{
			var p = ia.round((percentileIncr*i), 2)
			//var p = percentileIncr*i;
			breakArray[i] = this._stats.getPercentile(p, a);
		}
		breakArray[nBreaks-1] = this._stats.maxValue;

		return breakArray;
	}
	else
	{
		return null;
	}
};

/** 
 * Classifies a set of data values into classes with a variable 
 * number of values in each class. Class breaks are placed where 
 * there are gaps between clusters of values using Jenks natural 
 * breaks classification. Uses the continuous array of the 
 * <code>data</code> object for optimization.
 * 
 * <p>Further information on Jenks classification can be found in:
 * Jenks, George F. 1967. "The Data Model Concept in Statistical Mapping", 
 * International Yearbook of Cartography 7: 186-190.</p>
 * 
 * @method natural
 * @param {Number} numberOfClasses The number of classes to use in the classification.
 * @return {Number[]} The class breaks as an array of size (numberOfClasses + 1).
 * Returns null if unable to calculate the breaks. 
 * The lower and upper boundaries are included in the breaks.
 */
ia.BreaksCalculator.prototype.natural = function(numberOfClasses)
{
	if (numberOfClasses == null) numberOfClasses = 5;
	
	if (this._stats.range > 0)
	{
		// Get the number of observations.
		var n = this._stats.unique.length;

		if (this._stats.unique.length < numberOfClasses)
			numberOfClasses = this._stats.unique.length;

		// Create two matrices.
		// The first contains indexes to the continuous array, the second variances.
		var indexMatrix = new Array(n+1);
		var varianceMatrix = new Array(n+1);

		// Build and initialise the matrices.
		for (var i = 1; i <= n; i++) 
		{
			indexMatrix[i] = new Array(numberOfClasses+1);
			varianceMatrix[i] = new Array(numberOfClasses+1);

			for (var j = 1; j <= numberOfClasses; j++)
			{
				// First set of breaks initialised with 0.
				if (j == 1)
				{
					indexMatrix[i][j] = 1;
					varianceMatrix[i][j] = 0;
				}
				else
				{
					// Rest of variance matrix initialised with infinity. 
					varianceMatrix[i][j] = Infinity;
				}
			}
		}

		var variance;
		var noOfObservations;
		var sum;
		var mean;
		var meanSquared;
		var observationSquared;
		var sumOfObservationsSquared;
		var index;
		var prevIndex;
		var observation;

		for (i = 2; i <= n; i++) 
		{
			// Reset the this._stats for the next class.
			variance = 0
			noOfObservations = 0;
			sum = 0;
			mean = 0;
			meanSquared = 0;
			observationSquared = 0;
			sumOfObservationsSquared = 0;

			// Builds and tests variance for increasing class sizes on each loop.
			for (var l = 1; l <= i; l++) 
			{
				// Get the index.
				index = i - l + 1;

				// Get the observation.
				observation = this._stats.unique[index-1];

				// Increase observations.
				noOfObservations++;

				// Mean calculation.
				sum += parseFloat(observation);   
				mean = sum / noOfObservations;
				meanSquared = mean * mean;

				// Calculate variance within this class.
				observationSquared = observation * observation;
				sumOfObservationsSquared += parseFloat(observationSquared);
				variance = (sumOfObservationsSquared / noOfObservations) - meanSquared;

				// Compare against the variance for the previous class.
				prevIndex = index - 1;
				if (prevIndex != 0) 
				{
					for (j = 2; j <= numberOfClasses; j++) 
					{
						// Stick with the previous variance if this one is bigger.
						if (varianceMatrix[i][j] >= (varianceMatrix[prevIndex][j-1] + variance)) 
						{
							indexMatrix[i][j] = index;
							varianceMatrix[i][j] = varianceMatrix[prevIndex][j-1] + variance;
						};
					};
				};
			};
			indexMatrix[i][1] = 1;
			varianceMatrix[i][1] = variance;
		};

		// Get the indices of the natural breaks.
		var k = n;
		var indexList = new Array(numberOfClasses);
		indexList[numberOfClasses - 1] = n - 1;

		for (j = numberOfClasses; j >= 2; j--) 
		{
			index = indexMatrix[k][j] - 2;
			indexList[j-2] = index;
			k = indexMatrix[k][j] - 1;
		};

		// Get the breaks using the indices list.
		var breakArray = new Array();

		breakArray[0] = this._stats.minValue;
		for (i = 0; i <= (indexList.length - 2); i++)
		{
			var value = this._stats.unique[indexList[i]];
			breakArray[breakArray.length] = value;
		}
		breakArray[breakArray.length] = this._stats.maxValue;

		return breakArray;
	}
	else
	{
		return null;
	}
};

/** 
 * Classifies a set of data values by finding the mean value, 
 * and then placing class breaks above and below the mean at 
 * intervals of generally 0.25, 0.5 or 1 standard deviation. 
 * Makes use of the <code>sdSize</code> property to
 * determine the size of the standard deviation
 * 
 * <p>The standard deviation classifier differs from other
 * classifiers in that the number of standard deviations
 * above and below the mean are specified rather than the
 * number of classes.</p>
 * 
 * @method standardDeviation
 * @param {Number} numberOfStandardDeviations The number of standard deviations above and below the mean.
 * @return {Number[]} The class breaks as an array of size (numberOfStandardDeviations + 1).
 * The lower and upper boundaries are included in the breaks.
 * Returns null if unable to calculate the breaks.
 * @see #sdSize
 */
ia.BreaksCalculator.prototype.standardDeviation = function(numberOfClasses)
{
	if (numberOfClasses == null) numberOfClasses = 5;
	
	if (this._stats.range > 0)
	{
		// Multiply by 2 to get the actual number of classes.
		var numberOfStandardDeviations = 4;
		var breakValue;
		var breakArray = new Array(numberOfStandardDeviations + 1);
		var meanBreak = Math.ceil(breakArray.length/2);				
		var mean = this._stats.mean;
		var sd = this._stats.standardDeviation * this.sdSize;

		breakArray[0] = -Infinity;
		for (var i = 1; i <= (numberOfStandardDeviations + 1); i++)
		{
			if (i == meanBreak) breakValue = mean; // Center break is set to mean value.
			else 
			{
				// Number of standard deviations above / below the mean.
				var noOfSDsFromMean = i - meanBreak; 
				breakValue =  mean + (sd * noOfSDsFromMean);
			}
			breakArray[i] = breakValue;
		}
		breakArray[breakArray.length] = Infinity;

		return breakArray;
	}
	else
	{
		return null;
	}
};