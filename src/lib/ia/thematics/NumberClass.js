/** 
 * A <code>ia.NumberClass</code> consists of a numeric value, style and size.
 *
 * @author J Clare
 * @class ia.NumberClass
 * @extends ia.LegendClass
 * @constructor
 * @param {Number} inValue The value.
 * @param {String} inColor The color.
 * @param {Number} inSize The size.
 */
ia.NumberClass = function(inValue, inColor, inSize)
{
	ia.NumberClass.baseConstructor.call(this, inValue, inColor, inSize);
	this._label = undefined;
};
ia.extend(ia.LegendClass, ia.NumberClass);
	
/** 
 * Get the label.
 *
 * @method getLabel
 * @return {String} The label.
 */
ia.NumberClass.prototype.getLabel = function()
{
	if (this._label != undefined) return this._label
	else return this.formatter.format(this.value);
};

/** 
 * Set the label.
 *
 * @method setLabel
 * @param {String} label The label.
 */
ia.NumberClass.prototype.setLabel = function(label)
{
	this._label = label;
};

/** 
 * Checks if a value is contained in the class.
 * 
 * @method contains
 * @param {Number} value The value.
 * @return {Boolean} true / false.
 */
ia.NumberClass.prototype.contains = function(value)
{
	if (parseFloat(value) == parseFloat(this.value)) return true;
	else return false;
};