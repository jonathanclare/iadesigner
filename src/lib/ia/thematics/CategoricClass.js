/** 
 * A <code>ia.CategoricClass</code> consists of a value, style and size.
 * 
 * @author J Clare
 * @class ia.CategoricClass
 * @extends ia.LegendClass
 * @constructor
 * @param {Number[]} data The data array.
 * @param {String} inValue The value.
 * @param {String} inColor The color.
 * @param {Number} inSize The size.
 */
ia.CategoricClass = function(inValue, inColor, inSize)
{			
	ia.CategoricClass.baseConstructor.call(this, inValue, inColor, inSize);
	this._label = undefined;
}
ia.extend(ia.LegendClass, ia.CategoricClass);

/** 
 * Get the label.
 *
 * @method getLabel
 * @return {String} The label.
 */
ia.CategoricClass.prototype.getLabel = function()
{
	if (this._label != undefined) return this._label
	else return this.formatter.formatText(this.value);
};

/** 
 * Set the label.
 *
 * @method setLabel
 * @param {String} label The label.
 */
ia.CategoricClass.prototype.setLabel = function(label)
{
	this._label = label;
};

/** 
 * Checks if a value is contained in the class.
 * 
 * @method contains
 * @param {String} value The value.
 * @return {Boolean} true / false.
 */
ia.CategoricClass.prototype.contains = function(value)
{
	if (value == this.value) return true;
	else return false;
};