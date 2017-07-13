/** 
 * Rectangle object.
 *
 * @author J Clare
 * @class ia.Rectangle
 * @constructor
 * @param {Number} [x=0] The x coordinate of the origin.
 * @param {Number} [y=0] The y coordinate of the origin.
 * @param {Number} [width=0] The width.
 * @param {Number} [height=0] The height.
 */
ia.Rectangle = function(x, y, width, height)
{
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
}

/** 
 * The x coord.
 *
 * @property x
 * @type Number
 * @default 0
 */
ia.Rectangle.prototype.x;

/** 
 * The y coord.
 *
 * @property y
 * @type Number
 * @default 0
 */
ia.Rectangle.prototype.y;

/** 
 * The width.
 *
 * @property width
 * @type Number
 * @default 0
 */
ia.Rectangle.prototype.width;

/** 
 * The height.
 *
 * @property height
 * @type Number
 * @default 0
 */
ia.Rectangle.prototype.height;

/** 
 * The value of the left edge.  
 *
 * @method left
 * @return {Number}
 */
ia.Rectangle.prototype.left = function()
{
	return this.x;
};

/** 
 * The value of the right edge. 
 *
 * @method right
 * @return {Number}
 */
ia.Rectangle.prototype.right = function()
{
	return (this.x + this.width);
};

/** 
 * The value of the bottom edge.  
 *
 * @method bottom
 * @return {Number}
 */
ia.Rectangle.prototype.bottom = function()
{
	return (this.y + this.height);
};

/** 
 * The value of the top edge.  
 *
 * @method top
 * @return {Number}
 */
ia.Rectangle.prototype.top = function()
{
	return this.y;
};

/** 
 * Returns a clone of the rectangle.
 * 
 * @method clone
 * @return {ia.Rectangle} The rectangle.
 */
ia.Rectangle.prototype.clone = function()
{
	return new ia.Rectangle(this.x, this.y, this.width, this.height);
};	

/** 
 * Tests whether a point intersects the rectangle.
 * 
 * @method intersects
 * @param px {Number} The x coordinate.
 * @param py {Number} The y coordinate.
 * @return {Boolean} true if intercepts, otherwise false.
 */
ia.Rectangle.prototype.intersects = function(px, py)
{
	if (py < this.top()) return false;
	if (py > this.bottom()) return false;
	if (px > this.right()) return false;
	if (px < this.left()) return false;
	return true;
};

/** 
 * Tests whether a line segment intersects the rectangle.
 * 
 * @method intersectsLine
 * @param p1 {Object} First point {x, y}.
 * @param p2 {Object} Second point {x, y}.
 * @return {Boolean} true if intercepts, otherwise false.
 */
ia.Rectangle.prototype.intersectsLine = function(p1, p2)
{
	var isHit = this.lineIntersectsLine({x:this.left(), y:this.top()}, {x:this.right(), y:this.top()}, p1, p2) ||
	       this.lineIntersectsLine({x:this.right(), y:this.top()}, {x:this.right(), y:this.bottom()}, p1, p2) ||
	       this.lineIntersectsLine({x:this.right(), y:this.bottom()}, {x:this.left(), y:this.bottom()}, p1, p2) ||
	       this.lineIntersectsLine({x:this.left(), y:this.bottom()}, {x:this.left(), y:this.top()}, p1, p2) ||
	       (this.intersects(p1.x, p1.y) && this.intersects(p2.x, p2.y));
	return isHit;
};

/** 
 * Tests whether a line segment intersects another line.
 * 
 * @method lineIntersectsLine
 * @param a1 {Object} First point of line one {x, y}.
 * @param a2 {Object} Second point of line one {x, y}.
 * @param b1 {Object} First point of line two {x, y}.
 * @param b2 {Object} Second point of line two {x, y}.
 * @return {Boolean} true if intercepts, otherwise false.
 */
ia.Rectangle.prototype.lineIntersectsLine = function(a1, a2, b1, b2) 
{
	var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
	var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
	var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

	if ( u_b != 0 ) 
	{
		var ua = ua_t / u_b;
		var ub = ub_t / u_b;
		if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) return true
		else  return false
	} 
	return false;
};

/** 
 * Get a simple text representation of this object.
 *
 * @method toString
 * @return {String} A text String.
 */
ia.Rectangle.prototype.toString = function()
{
	return "[object Rectangle x='" + this.x + "' y='" + this.y + "' width='" + this.width + "' height='" + this.height + "']";
};