/** 
 * Classifies categoric data.
 *
 * @author J Clare
 * @class ia.CategoricClassifier
 * @constructor
 * @param {String[]} data The data array.
 */
ia.CategoricClassifier = function(data)
{
	this._uniqueValues = new Array();
	this._classes = new Array();
	this._data = new Array();

	this.formatter = new ia.Formatter();
	this.colorPalette = new ia.ColorPalette();
	this.colorPalette.setColorList(ia.ColorPalette.CATEGORY_COLORS);
	this.symbolSize = 10;
	this.noClasses = 0;
	this.labels = [];
	this.breaks = [];
	this.uniqueValues = [];

	if (data != undefined) this.setData(data);
};
	
/** 
 * The formatter. 
 * 
 * @property formatter
 * @type ia.Formatter
 */
ia.CategoricClassifier.prototype.formatter;

/** 
 * Used to classify colors. 
 * 
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.CategoricClassifier.prototype.colorPalette;

/** 
 * The symbol size. 
 * 
 * @property symbolSize
 * @type number
 * @default 10;

 */
ia.CategoricClassifier.prototype.symbolSize;

/** 
 * The number of classes. 
 * 
 * @property noClasses
 * @type number
 * @default 0
 */
ia.CategoricClassifier.prototype.noClasses;

/** 
 * A list of labels used in place of the default values. 
 * 
 * @property labels
 * @type String[]
 */
ia.CategoricClassifier.prototype.labels;

/** 
 * A list of breaks used in place of the default values. 
 * 
 * @property breaks
 * @type Number[]
 */
ia.CategoricClassifier.prototype.breaks;

/** 
 * A list of sorted unique values in the classifier. 
 * 
 * @property uniqueValues
 * @type Number[]
 */
ia.CategoricClassifier.prototype.uniqueValues;

/** 
 * Gets the data.
 *
 * @method getData
 * @return {String[]} The data.
 */
ia.CategoricClassifier.prototype.getData = function()
{
	return this._data;
};

/** 
 * Sets the data.
 *
 * @method setData
 * @param {String[]} value The data.
 */
ia.CategoricClassifier.prototype.setData = function(value)
{
	this._data = value;
	
	if (this.breaks.length > 0) this._uniqueValues = this.breaks.concat();
	else this._uniqueValues = this._getUniqueValues(this._data);
};

/** 
 * An array of legend classes contained in the classifier. 
 *
 * @method getClasses
 * @param {ia.CategoricClass[]} value The data.
 */
ia.CategoricClassifier.prototype.getClasses = function()
{
	return this._classes;
};

/** 
 * Call this to commit any changes.
 *
 * @method commitChanges
 */
ia.CategoricClassifier.prototype.commitChanges = function()
{	
	this._buildClasses();
	this._buildPalettes();

	// This maintains the categoric legend colours.
	// So that if the indicator is changed or a filter is applied
	// the colours for each class remain constant.
	for (var i = 0; i < this._classes.length; i++)
	{
		var legendClass = this._classes[i];
		if (this.colorPalette.matchColorsToValues[legendClass.value] == undefined)
			this.colorPalette.matchColorsToValues[legendClass.value] = legendClass.color
	}
};

/** 
 * Gets the legend class for the given value.
 * 
 * @method getClass
 * @param {String} value The value.
 * @return {ia.CategoricClass} The legend class that contains the value.
 */
ia.CategoricClassifier.prototype.getClass = function(value)
{	
	for (var i = 0; i < this._classes.length; i++)
	{
		var legendClass = this._classes[i];
		if (legendClass.contains(value)) return legendClass;
	}

	// Return null if nothing found.
	return null;
};

/** 
 * Returns a sorted list of unique values for an array.
 * 
 * @method _getUniqueValues
 * @param {String[]} data The data array.
 * @return {String[]} An array of unique values.
 * @private
 */
ia.CategoricClassifier.prototype._getUniqueValues = function(data)
{
	var values = [];

	if (data.length > 0)
	{

		/*
		Potential fix to stop comparison areas being sorted by ids
		but it messes up the categoric legend for everything else. 
		uniqueArray = data.filter(function(elem, pos) 
		{
   			return data.indexOf(elem) == pos;
		});*/

		// Make a shallow copy of the data array.
		var sorted = data.concat();

		// Sort data.
		sorted.sort();

		// Unique data array variables.
		var prevValue;

		// Keep track of counts
		var index = 0;

		// Loop through the data.
		var n = sorted.length;
		for (var i = 0; i < n; i++)
		{
			var v = sorted[i];
			if (v != prevValue) 
			{
				values.push(v);
				index = 0;
			}
			prevValue = v;
			index++;
		}
	}
	return values;
};

/** 
 * Called when the <code>dataChanged</code> flag indicates that the
 * classifier has changed in some way so that the classes
 * have to be rebuilt.
 *
 * @method _buildClasses
 * @private
 */
ia.CategoricClassifier.prototype._buildClasses = function()
{
	this._classes = [];
			
	if (this.noClasses != this._uniqueValues.length) this.noClasses = this._uniqueValues.length;
	
	var index = 0;
	for (var i = 0; i < this.noClasses; i++)
	{
		var legendClass = new ia.CategoricClass(this._uniqueValues[i]);

		//if (this.labels.length > i) legendClass.setLabel(this.labels[i]);

        // Ensure labels dont get applied to no data values
		if (this.labels.length > index && legendClass.value != this.noDataValue) 
		{
			legendClass.setLabel(this.labels[index]);
			index++;
		}

		legendClass.formatter = this.formatter;
		this._classes.push(legendClass);
	}
};

/** 
 * Called when the style or one of the legend palettes has changed.
 *
 * @method _buildPalettes
 * @private
 */
ia.CategoricClassifier.prototype._buildPalettes = function()
{
	if (this._uniqueValues.length > 0)
	{
        // Ensure colours dont get applied to no data values.
        if (this.customColorsDefined)
        {
        	var colorList = this.colorPalette.getColorList();
            var index = 0;
            for (var i = 0; i < this._uniqueValues.length; i++)
            { 
                var value = this._uniqueValues[i]
                if (colorList.length > index && value != this.noDataValue) 
                {
                    this.colorPalette.matchColorsToValues[value] = colorList[index];
                    index++;
                }
            }
        }
        this.customColorsDefined = false;

		var colors = this.colorPalette.getMatchingColors(this._uniqueValues);
        var index = 0;
		for (var i = 0; i < this._classes.length; i++)
		{
			var legendClass = this._classes[i];
			legendClass.color = colors[i];
			legendClass.size = this.symbolSize;
		}
	}
};