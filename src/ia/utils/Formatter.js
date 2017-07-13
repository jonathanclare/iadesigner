/** 
 * Provides functions for formatting numbers and strings.
 *
 * @author J Clare
 * @class ia.Formatter
 * @constructor
 */
ia.Formatter = function() 
{
	this.language = "en";
	this.noDataValue = "No Data";
	this.decimalSeparatorTo = ".";
	this.thousandsSeparatorTo = ",";
};

/** 
 * The language.
 *
 * @property language
 * @type String
 * @default "en"
 */
ia.Formatter.prototype.language = undefined;

/** 
 * The no data value.
 *
 * @property noDataValue
 * @type String
 * @default "No Data"
 */
ia.Formatter.prototype.noDataValue = undefined;

/** 
 * The precision.
 *
 * @property precision
 * @type Number
 */
ia.Formatter.prototype.precision = undefined;

/** 
 * The decimal separator
 *
 * @property decimalSeparatorTo
 * @type String
 * @default "."
 */
ia.Formatter.prototype.decimalSeparatorTo = undefined;

/** 
 * The thousands separator
 *
 * @property thousandsSeparatorTo
 * @type String
 * @default ","
 */
ia.Formatter.prototype.thousandsSeparatorTo = undefined;

/**
 * Formats a given string or number.
 *
 * @method format
 * @param {String|Number} value The value.
 * @param {Number} precision Number of decimals. Uses the default precision if no argument is passed in.
 * @return {String|Number} The formatted value.
 */
ia.Formatter.prototype.format = function(value, precision) 
{
	precision = (precision == undefined) ? this.precision : precision;

	if (ia.isNumber(value))  return this.formatNumber(value, precision);
	else return this.formatText(value);
};	

/**
 * Unformats a given string back to its number.
 *
 * @method unformat
 * @param {String} formattedValue The formatted value.
 * @return {Number} The value.
 */
ia.Formatter.prototype.unformat = function(formattedValue) 
{
	return parseFloat(formattedValue.split(this.thousandsSeparatorTo).join("").split(this.decimalSeparatorTo).join("."));
};	

/**
 * Get a suitably formatted number.
 *
 * @method formatNumber
 * @param {Number} value A number.
 * @param {Number} precision Number of decimals. Uses the default precision if no argument is passed in.
 * @return {Number} A number formatted for the current locale, for example
 * 1.2 would be formatted as 1.2 in English, but 1,2 in Español. If the
 * argument passed in is NOT a number, it is returned unchanged.
 */
ia.Formatter.prototype.formatNumber = function(value, precision) 
{
	var negative = value < 0 ? "-" : "";
	var base, mod;

	if (precision == undefined)
	{
		var splitNumber = String(value).split(".");
		base = Math.abs(splitNumber[0]) + "";
		mod = base.length > 3 ? base.length % 3 : 0;
		return negative + (mod ? base.substr(0, mod) + this.thousandsSeparatorTo : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + this.thousandsSeparatorTo) + (splitNumber.length==2 ? this.decimalSeparatorTo + splitNumber[1] : "");
	}
	else if (precision == 0)
	{
		base = Math.abs(parseInt(Math.abs(value || 0).toFixed(precision), 10)) + "";
		mod = base.length > 3 ? base.length % 3 : 0;
		return negative + (mod ? base.substr(0, mod) + this.thousandsSeparatorTo : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + this.thousandsSeparatorTo);
	}
	else
	{
		base = Math.abs(parseInt(Math.abs(value || 0).toFixed(precision), 10)) + "";
		mod = base.length > 3 ? base.length % 3 : 0;
		return negative + (mod ? base.substr(0, mod) + this.thousandsSeparatorTo : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + this.thousandsSeparatorTo) + (precision ? this.decimalSeparatorTo + Math.abs(value).toFixed(precision).split('.')[1] : "");
	}
};

/**
 * Get a suitably formatted string.
 *
 * @method formatText
 * @param {String} txt A string.
 * @return {String} A string formatted for the current locale.
 */
ia.Formatter.prototype.formatText = function(txt) 
{
	if ((txt === "null") || (txt === null) || (txt === "NaN") || (txt === "") || (txt === "No Data") || (txt === undefined)) 
	{
		return this.noDataValue;
	}
	else
	{ 
		return String(txt);
	}
};