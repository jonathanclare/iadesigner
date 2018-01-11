/** 
 * Point object.
 *
 * @author J Clare
 * @class ia.Point
 * @constructor
 * @param {Number} [x=0] The x coordinate of the origin.
 * @param {Number} [y=0] The y coordinate of the origin.
 */
ia.Point = function(x, y)
{
	this.x = x || 0;
	this.y = y || 0;
}

/** 
 * The x coord.
 *
 * @property x
 * @type Number
 * @default 0
 */
ia.Point.prototype.x;

/** 
 * The y coord.
 *
 * @property y
 * @type Number
 * @default 0
 */
ia.Point.prototype.y;

/** 
 * Subtracts another point from this one.
 *
 * @method subtract
 * @param {ia.Point} p The point to subtract.
 * @return {ia.Point} A new point.
 */
ia.Point.prototype.subtract = function(p)
{
	return new ia.Point((this.x - p.x), (this.y - p.y));
};

/** 
 * Get a simple text representation of this object.
 *
 * @method toString
 * @return {String} A text String.
 */
ia.Point.prototype.toString = function()
{
	return "[object Point x='" + this.x + "' y='" + this.y + "']";
};