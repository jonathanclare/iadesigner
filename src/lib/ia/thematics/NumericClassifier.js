/** 
 * Classifies numeric data.
 *
 * @author J Clare
 * @class ia.NumericClassifier
 * @constructor
 * @param {Number[]} data The data array.
 */
ia.NumericClassifier = function(data)
{
    this._breaks = new Array();
    this._classes = new Array();
    this._adjustedNoClasses = 0;
    this._calculator = new ia.BreaksCalculator();
    this._data = new Array();

    this.formatter = new ia.Formatter();
    this.colorPalette = new ia.ColorPalette();
    this.sizePalette = new ia.SizePalette();
    this.classificationName = ia.Thematic.EQUAL_INTERVAL;
    this.labels = new Array();
    this.sdLabels = new Array("> 2 SD below mean",
            "1 - 2 SD below mean",
            "0 - 1 SD below mean",
            "0 - 1 SD above mean",
            "1 - 2 SD above mean",
            "> 2 SD above mean");
    this.noClasses = 5;

    this.minRule = ia.RangeClass.GREATER_THAN_OR_EQUAL_TO;
    this.maxRule = ia.RangeClass.LESS_THAN_OR_EQUAL_TO;

    if (data != undefined) this.setData(data);
};
    
/** 
 * The formatter. 
 * 
 * @property formatter
 * @type ia.Formatter
 */
ia.NumericClassifier.prototype.formatter;

/** 
 * Used to classify colors. 
 * 
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.NumericClassifier.prototype.colorPalette;

/** 
 * Used to classify sizes.
 * 
 * @property sizePalette
 * @type ia.SizePalette
 */
ia.NumericClassifier.prototype.sizePalette;

/**
 * The name of the classification to use when calculating breaks.
 * 
 * <p>Possible values include: 
 * <ul>
 * <li><code>ia.Thematic.CONTINUOUS</code></li>
 * <li><code>ia.Thematic.EQUAL_INTERVAL</code></li>
 * <li><code>ia.Thematic.QUANTILE</code></li>
 * <li><code>ia.Thematic.NATURAL</code></li>
 * <li><code>ia.Thematic.STANDARD_DEVIATION</code></li>
 * </ul>
 * </p>
 * 
 * @property classificationName
 * @type String
 * @default ia.Thematic.EQUAL_INTERVAL
 */
ia.NumericClassifier.prototype.classificationName;

/** 
 * A list of labels used in place of the default values.
 * 
 * @property labels
 * @type String[]
 */
ia.NumericClassifier.prototype.labels;

/** 
 * The list of standard deviation labels.
 * 
 * @property sdLabels
 * @type String[]
 * @default ["> 2 SD below mean","1 - 2 SD below mean","0 - 1 SD below mean","0 - 1 SD above mean","1 - 2 SD above mean","> 2 SD above mean"]
 */
ia.NumericClassifier.prototype.sdLabels;

/** 
 * The number of classes to calculate breaks for. 
 * 
 * @property noClasses
 * @type Number
 * @default 5
 */
ia.NumericClassifier.prototype.noClasses;

/** 
 * The precision.
 *
 * @property precision
 * @type Number
 */
ia.NumericClassifier.prototype.precision;

/** 
 * The minimum rule for range classes. Valid rules are "greaterThanOrEqual" or "greaterThan".
 * 
 * @property minRule
 * @type String
 * @default "greaterThanOrEqual"
 */
ia.NumericClassifier.prototype.minRule;

/** 
 * The maximum rule classes. Valid rules are "lessThanOrEqual" or "lessThan".
 * 
 * @property maxRule
 * @type String
 * @default "lessThanOrEqual"
 */
ia.NumericClassifier.prototype.maxRule;

/** 
 * Gets the data.
 *
 * @method getData
 * @return {Number[]} The data.
 */
ia.NumericClassifier.prototype.getData = function()
{
    return this._data;
};

/** 
 * Sets the data.
 *
 * @method setData
 * @param {Number[]} value The data.
 */
ia.NumericClassifier.prototype.setData = function(value)
{
    this._data = value;
    this._calculator.setData(this._data);
};

/** 
 * The list of breaks
 *
 * @method getBreaks
 * @return {Number[]} The breaks.
 */
ia.NumericClassifier.prototype.getBreaks = function()
{
    return this._breaks;
};

/** 
 * The list of labels
 *
 * @method getLabels
 * @return {String[]} The labels.
 */
ia.NumericClassifier.prototype.getLabels = function()
{
    var labels = new Array();
    for (var i = 0; i < this._classes.length; i++)
    {
        labels[i] = this._classes[i].getLabel();
    }
    return labels;
};

/** 
 * Used for calculating the breaks.
 *
 * @method getCalculator
 * @return {ia.Calculator} The calculator.
 */
ia.NumericClassifier.prototype.getCalculator = function()
{
    return this._calculator;
};

/** 
 * An array of legend classes contained in the classifier. 
 *
 * @method getClasses
 * @return {ia.NumberClass[]} The classes.
 */
ia.NumericClassifier.prototype.getClasses = function()
{
    return this._classes;
};

/** 
 * Call this to commit any changes.
 *
 * @method commitChanges
 */
ia.NumericClassifier.prototype.commitChanges = function()
{   
    if (this.useEsriClassificationMethod)
        this._buildEsriClasses();
    else
        this._buildClasses();

    this._buildPalettes();
};

/** 
 * Gets the legend class for the given value.
 * 
 * @method getClass
 * @param {Number} value The value.
 * @return {ia.NumberClass} The legend class that contains the value.
 */
ia.NumericClassifier.prototype.getClass = function(value)
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
 * Rebuilds the classes usesing ESRI style classification.
 *
 * @method _buildEsriClasses
 * @param {Number} p An optional precision.
 * @private
 */
ia.NumericClassifier.prototype._buildEsriClasses = function(p)
{
    var nClasses;
    var nClass;
    var rangeError = false;
    var precision;
    this._classes = [];

    this._breaks = this._calculator.getBreaks(this.noClasses, this.classificationName);

    if (this._breaks != null)
    {
        if (p != undefined)                     precision = p;
        else if (this.precision != undefined)   precision = this.precision;
        else                                    precision = ia.getPrecision(this._breaks);

        if (this.classificationName == ia.Thematic.CONTINUOUS)
        {
            nClasses = this._breaks.length;
        }
        else
        {
            // When you get breaks the number of classes may change. 
            // So use the length of the returned breaks array - 1 as
            // the number of classes.
            if (this._breaks.length == 1) nClasses = 1;
            else nClasses = this._breaks.length - 1;
        }

        if (this._breaks.length == 1)
        {
            nClass = new ia.NumberClass(this._breaks[0]);
            nClass.formatter = this.formatter;
            this._classes.push(nClass);
        }
        else
        {
            for (var i = 0; i < nClasses; i++)
            {
                if (this.classificationName == ia.Thematic.CONTINUOUS)
                {
                    nClass = new ia.NumberClass(this._breaks[i]);
                    nClass.formatter = this.formatter;
                    this._classes.push(nClass);
                }
                else
                {
                    var minFormatted;
                    var maxFormatted;

                    if (i == 0)
                    {
                        // Only round down if the break has more decimal places than the precision.
                        var b = this._breaks[i];
                        var nDecimal = b.toString().split(".")[1] != undefined ? b.toString().split(".")[1].length : 0; 
                        if (nDecimal > precision) b = Math.floor((b/precision) * precision);

                        minFormatted = this.formatter.format(b, precision);
                    }
                    else  
                        minFormatted = this.formatter.format(this._breaks[i], precision);

                    if (i == nClasses - 1)  
                    {
                        // Only round up if the break has more decimal places than the precision.
                        var b = this._breaks[i+1];
                        var nDecimal = b.toString().split(".")[1] != undefined ? b.toString().split(".")[1].length : 0; 
                        if (nDecimal > precision) b = Math.ceil((b/precision) * precision);

                        maxFormatted = this.formatter.format(b, precision);
                    }
                    else 
                        maxFormatted = this.formatter.format(this._breaks[i+1], precision);

                    var minValue = this.formatter.unformat(minFormatted);
                    var maxValue = this.formatter.unformat(maxFormatted);

                    var rClass = new ia.RangeClass(minValue, maxValue);
                    if (i == 0)
                        rClass.minRule = ia.RangeClass.GREATER_THAN_OR_EQUAL_TO;
                    else  
                        rClass.minRule = ia.RangeClass.GREATER_THAN;

                    rClass.maxRule = ia.RangeClass.LESS_THAN_OR_EQUAL_TO;
                    rClass.formatter = this.formatter;
                    this._classes.push(rClass);
                    
                    if (this.labels.length > i) rClass.setLabel(this.labels[i]);
                    else if (this.classificationName == ia.Thematic.STANDARD_DEVIATION && this.sdLabels.length > i) 
                    {
                        rClass.setLabel(this.sdLabels[i]);
                    }
                    else
                    {
                        // Check the breaks are valid after adjustment.
                        if (minValue > maxValue)
                        {
                            rangeError = true;
                            break;
                        }
                        else if (minFormatted == maxFormatted) 
                            rClass.setLabel(minFormatted);
                        else 
                        {
                            if (i == 0)
                                rClass.setLabel(minFormatted + " - " + maxFormatted);
                            else  
                                rClass.setLabel(" > " + minFormatted + " - " + maxFormatted);
                        }

                    }
                }
            }
        }
    }
    else
    {
        this._breaks = [];
        this._classes = [];
        nClasses = 0;
    }

    this._adjustedNoClasses = nClasses;

    if (rangeError) this._buildEsriClasses(precision+1);
};


/** 
 * Rebuilds the classes.
 *
 * @method _buildClasses
 * @param {Number} p An optional precision.
 * @private
 */
ia.NumericClassifier.prototype._buildClasses = function(p)
{
    var nClasses;
    var nClass;
    var rangeError = false;
    var precision;
    this._classes = [];

    this._breaks = this._calculator.getBreaks(this.noClasses, this.classificationName);
    
    if (this._breaks != null)
    {
        if (p != undefined)                     precision = p;
        else if (this.precision != undefined)   precision = this.precision;
        else                                    precision = ia.getPrecision(this._breaks);


        if (this.classificationName == ia.Thematic.CONTINUOUS)
        {
            nClasses = this._breaks.length;
        }
        else
        {
            // When you get breaks the number of classes may change. 
            // So use the length of the returned breaks array - 1 as
            // the number of classes.
            if (this._breaks.length == 1) nClasses = 1;
            else nClasses = this._breaks.length - 1;
        }

        if (this._breaks.length == 1)
        {
            nClass = new ia.NumberClass(this._breaks[0]);
            nClass.formatter = this.formatter;
            this._classes.push(nClass);
        }
        else
        {
            for (var i = 0; i < nClasses; i++)
            {
                if (this.classificationName == ia.Thematic.CONTINUOUS)
                {
                    nClass = new ia.NumberClass(this._breaks[i]);
                    nClass.formatter = this.formatter;
                    this._classes.push(nClass);
                }
                else
                {
                    var minValue = this._breaks[i];
                    var maxValue = this._breaks[i+1];
                    var rClass = new ia.RangeClass(minValue, maxValue);
                    rClass.minRule = this.minRule;
                    rClass.maxRule = this.maxRule;
                    rClass.formatter = this.formatter;
                    this._classes.push(rClass);
                    
                    if (this.labels.length > i) rClass.setLabel(this.labels[i]);
                    else if (this.classificationName == ia.Thematic.STANDARD_DEVIATION && this.sdLabels.length > i) 
                    {
                        rClass.setLabel(this.sdLabels[i]);
                    }
                    else
                    {
                        var minFormatted = this.formatter.format(minValue, precision);
                        var maxFormatted = this.formatter.format(maxValue, precision);

                        // If the precision has been specifically defined by the user we dont need to do this
                        // Its up to the user to use the right number of decimal places.
                        //if (this.precision == undefined) 
                        //{
                            // Adjust the break.
                            if (this.minRule == ia.RangeClass.GREATER_THAN_OR_EQUAL_TO
                                && this.maxRule == ia.RangeClass.LESS_THAN_OR_EQUAL_TO
                                && i != 0) minFormatted = this.formatter.format(this._adjustBreak(minFormatted), precision);

                            // Check the breaks are valid after adjustment.
                            if (this.formatter.unformat(minFormatted) > this.formatter.unformat(maxFormatted))
                            {
                                rangeError = true;
                                break;
                            }
                            else if (minFormatted == maxFormatted) 
                                rClass.setLabel(minFormatted);
                            else 
                                rClass.setLabel(minFormatted + " - " + maxFormatted);
                        //}
                        //else rClass.setLabel(minFormatted + " - " + maxFormatted);

                        // This resets the min and max value to the formatted value ie whatever the label is set to because
                        // we were having issues with features in wrong classes because of rounding. So although it means that
                        // strictly speaking we are potentially moving the feature into the wrong quantile it will actually appear more correct to the end user.
                        // http://bugzilla.geowise.co.uk/show_bug.cgi?id=8376
                        // http://bugzilla.geowise.co.uk/show_bug.cgi?id=9223
                        //rClass.minValue = this.formatter.unformat(minFormatted);
                        //rClass.maxValue = this.formatter.unformat(maxFormatted);
                    }
                }
            }
        }
    }
    else
    {
        this._breaks = [];
        this._classes = [];
        nClasses = 0;
    }

    this._adjustedNoClasses = nClasses;

    if (rangeError) this._buildClasses(precision+1);
};

/** 
 * Adjusts a break for a range class.
 * 
 * @method _adjustBreak
 * @param {String} formattedValue The formatted value
 * @return {Number} The adjusted value.
 * @private
 */
ia.NumericClassifier.prototype._adjustBreak = function(formattedValue)
{   
    // Convert back to number.
    var value = this.formatter.unformat(formattedValue);
    
    var newValue; 
    var isDecimal = (formattedValue.indexOf(this.formatter.decimalSeparatorTo) > -1);
    if (isDecimal)
    {
        var noDecimalPlaces = formattedValue.length - formattedValue.toString().indexOf(this.formatter.decimalSeparatorTo) - 1;
        var valueString = "0"+".";
        for (var j = 0; j < noDecimalPlaces; j++)
        {
            if (j == (noDecimalPlaces-1)) valueString += "1"
            else valueString += "0"
        }
        newValue = parseFloat(value) + parseFloat(valueString);
    }
    else
    {
        newValue = parseFloat(value) + 1;
    }
    return newValue;
};

/** 
 * Rebuilds the breaks.
 *
 * @method _buildPalettes
 * @private
 */
ia.NumericClassifier.prototype._buildPalettes = function()
{
    var colors;
    var sizes;
    
    if (this.classificationName == ia.Thematic.CONTINUOUS)
    {
        var n = this._breaks.length;
        var range = this._breaks[n-1] - this._breaks[0];

        colors = [];
        this.sizePalette.useSqrRoot = true;
        sizes = [];

        for (var i = 0; i < n; i++)
        {
            var f = (this._breaks[i] - this._breaks[0]) / range;
            if (!ia.isNumber(f)) f = 0;
            colors.push(this.colorPalette.getColor(f));
            sizes.push(this.sizePalette.getSize(f));
        }
    }
    else
    {
        colors = this.colorPalette.getInterpolatedColors(this._adjustedNoClasses);
        this.sizePalette.useSqrRoot = false;
        sizes = this.sizePalette.getInterpolatedSizes(this._adjustedNoClasses); 
    }

    for (var i = 0; i < this._classes.length; i++)
    {
        var legendClass = this._classes[i];
        legendClass.color = colors[i];
        legendClass.size = sizes[i];
    }
};