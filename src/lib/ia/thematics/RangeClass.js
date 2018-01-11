/** 
 * The <code>ia.RangeClass</code> extends the <code>ia.LegendClass</code> 
 * to include a min value, a max value and a range. The <code>value</code>
 * property of a range class is equal to null.
 * 
 * @author J Clare
 * @class ia.RangeClass
 * @extends ia.LegendClass
 * @constructor
 * @param {Number} inMinValue The min value.
 * @param {Number} inMaxValue The max value.
 * @param {String} inColor The color.
 * @param {Number} inSize The size.
 */
ia.RangeClass = function(inMinValue, inMaxValue, inColor, inSize)
{			
	ia.RangeClass.baseConstructor.call(this, NaN, inColor, inSize);
	
	this._label = undefined;
	this._range = undefined;

	this.minValue = inMinValue;
	this.maxValue = inMaxValue;
	this.minRule = ia.RangeClass.GREATER_THAN_OR_EQUAL_TO;
	this.maxRule = ia.RangeClass.LESS_THAN_OR_EQUAL_TO;
};
ia.extend(ia.LegendClass, ia.RangeClass);

/**
 * Constant indicating a "<" rule.
 * 
 * @static
 * @final
 * @property LESS_THAN
 * @type String
 * @default "lessThan"
 */
ia.RangeClass.LESS_THAN = "lessThan";

/**
 * Constant indicating a "<=" rule.
 * 
 * @static
 * @final
 * @property LESS_THAN_OR_EQUAL_TO
 * @type String
 * @default "lessThanOrEqual"
 */
ia.RangeClass.LESS_THAN_OR_EQUAL_TO = "lessThanOrEqual";

/**
 * Constant indicating a ">" rule.
 * 
 * @static
 * @final
 * @property GREATER_THAN
 * @type String
 * @default "greaterThan"
 */
ia.RangeClass.GREATER_THAN = "greaterThan";

/**
 * Constant indicating a ">=" rule.
 * 
 * @static
 * @final
 * @property GREATER_THAN_OR_EQUAL_TO
 * @type String
 * @default "greaterThanOrEqual"
 */
ia.RangeClass.GREATER_THAN_OR_EQUAL_TO = "greaterThanOrEqual";

/** 
 * The minimum value.
 * 
 * @property minValue
 * @type Number
 * @default 0
 */
ia.RangeClass.prototype.minValue;

/** 
 * The maximum value.
 * 
 * @property maxValue
 * @type Number
 * @default 0
 */
ia.RangeClass.prototype.maxValue;

/** 
 * The minimum rule. Valid rules are ">=" or ">".
 * 
 * @property minRule
 * @type String
 * @default ">="
 */
ia.RangeClass.prototype.minRule;

/** 
 * The maximum rule. Valid rules are "<=" or "<".
 * 
 * @property maxRule
 * @type String
 * @default "<="
 */
ia.RangeClass.prototype.maxRule;

/** 
 * Get the label.
 *
 * @method getLabel
 * @return {String} The label.
 */
ia.RangeClass.prototype.getLabel = function()
{	
	if (this._label != undefined)
	{
		return this._label;
	}
	else
	{
		var minFormatted = this.formatter.format(this.minValue);
		var maxFormatted = this.formatter.format(this.maxValue);
		var l = minFormatted + " - " + maxFormatted;
		return l;
	}
};

/** 
 * Set the label.
 *
 * @method setLabel
 * @param {String} label The label.
 */
ia.RangeClass.prototype.setLabel = function(value)
{
	this._label = value;
};

/** 
 * The difference between the min and max value.
 *
 * @method getRange
 * @return {Number} The range.
 */
ia.RangeClass.prototype.getRange = function()
{
	return (maxValue - minValue);
};

/** 
 * Checks if a value is contained in the class.
 * 
 * @method contains
 * @param {Number} value The value.
 * @return {Boolean} true / false.
 */
ia.RangeClass.prototype.contains = function(value)
{
	if (ia.isNumber(value)) 
	{
		if (this.minRule == ia.RangeClass.GREATER_THAN)
		{
			if (!(parseFloat(value) > this.minValue)) return false;
		}
		else
		{
			if (!(parseFloat(value) >= this.minValue)) return false;
		}
		if (this.maxRule == ia.RangeClass.LESS_THAN)
		{
			if (!(parseFloat(value) < this.maxValue)) return false;
		}
		else
		{
			if (!(parseFloat(value) <= this.maxValue)) return false;
		}
		// If you get this far the value is contained in the class.
		return true;
	}
	else return false;
};