/** 
 * An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and by its top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @author J Clare
 * @class ia.BoundingBox
 * @constructor
 * @param {Number} [xMin=0] The x-coord of the bottom-left corner.
 * @param {Number} [yMin=0] The y-coord of the bottom-left corner. 
 * @param {Number} [xMax=100] The x-coord of the top-right corner. 
 * @param {Number} [yMax=100] The y-coord of the top-right corner. 
 */
ia.BoundingBox = function(xMin, yMin, xMax, yMax)
{
	this.setXMin(xMin || 0);
	this.setYMin(yMin || 0);
	this.setXMax(xMax || 100);
	this.setYMax(yMax || 100);
};

/** 
 * Returns the left coord. 
 *
 * @method left
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.left = function()
{
	return this._xMin;
};

/** 
 * Returns the right coord. 
 *
 * @method right
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.right = function()
{
	return this._xMax;
};

/** 
 * Returns the bottom coord. 
 *
 * @method bottom
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.bottom = function()
{
	return this._yMin;
};

/** 
 * Returns the top coord. 
 *
 * @method top
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.top = function()
{
	return this._yMax;
};

/** 
 * Returns the x-coord of the left edge of the bounding box.
 *
 * @method getXMin
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.getXMin = function()
{
	return this._xMin;
};

/** 
 * Sets the x-coord of the left edge of the bounding box.
 *
 * @method setXMin
 * @param {Number} x The coordinate.
 */	
ia.BoundingBox.prototype.setXMin = function(x)
{
	this._xMin = x;
	this._width = Math.abs(this._xMax - this._xMin);
	this._xCenter = this._xMin + (this._width / 2);
};

/** 
 * Returns the x-coord of the right edge of the bounding box.
 *
 * @method getXMax
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.getXMax = function(){return this._xMax;};

/** 
 * Sets the x-coord of the right edge of the bounding box.
 *
 * @method setXMax
 * @param {Number} x The coordinate.
 */	
ia.BoundingBox.prototype.setXMax = function(x)
{
	this._xMax = x;
	this._width = Math.abs(this._xMax - this._xMin);
	this._xCenter = this._xMin + (this._width / 2);
};

/** 
 * Returns the x-coord of the center of the bounding box.
 *
 * @method getXCenter
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.getXCenter = function(){return this._xCenter;};

/** 
 * Sets the x-coord of the center of the bounding box.
 *
 * @method setXCenter
 * @param {Number} x The coordinate.
 */	
ia.BoundingBox.prototype.setXCenter = function(x)
{
	this._xCenter = x;
	this._xMin  = this._xCenter - (this._width / 2);
	this._xMax  = this._xCenter + (this._width / 2)
};

/** 
 * Returns the width of the bounding box.
 *
 * @method getWidth
 * @return {Number} The width.
 */
ia.BoundingBox.prototype.getWidth = function(){return this._width;};

/** 
 * Sets the width of the bounding box.
 *
 * @method setWidth
 * @param {Number} w The width.
 */	
ia.BoundingBox.prototype.setWidth = function(w)
{
	this._width = w;
	this._xMax = this._xMin + this._width;
	this._xCenter = this._xMin + (this._width / 2);
};

/** 
 * Returns the y-coord of the bottom edge of the bounding box.
 *
 * @method getYMin
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.getYMin = function(){return this._yMin;};

/** 
 * Sets the y-coord of the bottom edge of the bounding box.
 *
 * @method setYMin
 * @param {Number} y The coordinate.
 */	
ia.BoundingBox.prototype.setYMin = function(y)
{
	this._yMin = y;
	this._height = Math.abs(this._yMax - this._yMin);
	this._yCenter = this._yMin + (this._height / 2);
};

/** 
 * Returns the y-coord of the top edge of the bounding box.
 *
 * @method getYMax
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.getYMax = function(){return this._yMax;};

/** 
 * Sets the y-coord of the top edge of the bounding box.
 *
 * @method setYMax
 * @param {Number} y The coordinate.
 */	
ia.BoundingBox.prototype.setYMax = function(y)
{
	this._yMax = y;
	this._height = Math.abs(this._yMax - this._yMin);
	this._yCenter = this._yMin + (this._height / 2);
};

/** 
 * Returns the y-coord of the center of the bounding box.
 *
 * @method getYCenter
 * @return {Number} The coordinate.
 */
ia.BoundingBox.prototype.getYCenter = function(){return this._yCenter;};

/** 
 * Sets the y-coord of the center of the bounding box.
 *
 * @method setYCenter
 * @param {Number} y The coordinate.
 */	
ia.BoundingBox.prototype.setYCenter = function(y)
{
	this._yCenter = y;
	this._yMin  = this._yCenter - (this._height / 2);
	this._yMax  = this._yCenter + (this._height / 2);
};

/** 
 * Returns the height of the bounding box.
 *
 * @method getHeight
 * @return {Number} The height.
 */
ia.BoundingBox.prototype.getHeight = function(){return this._height;};

/** 
 * Sets the height of the bounding box.
 *
 * @method setHeight
 * @param {Number} h The height.
 */	
ia.BoundingBox.prototype.setHeight = function(h)
{
	this._height = h;
	this._yMax = this._yMin + this._height;
	this._yCenter = this._yMin + (this._height / 2);
};

/** 
 * Gets a clone of this bounding box.		
 * 
 * @method clone
 * @return {ia.BoundingBox} The bounding box.	 
 */
ia.BoundingBox.prototype.clone = function()
{
	return new ia.BoundingBox(this._xMin, this._yMin, this._xMax, this._yMax);
};

/** 
 * Tests whether a bounding box is equal to this one.
 * 
 * @method equals
 * @param {ia.BoundingBox} bBox The bounding box.
 * @return {Boolean} true if bounding box is equal to this one, otherwise false.
 */
ia.BoundingBox.prototype.equals = function(bBox)
{
	if (bBox.getXMin() != this._xMin) return false;
	if (bBox.getYMin() != this._yMin) return false;
	if (bBox.getXMax() != this._xMax) return false;
	if (bBox.getYMax() != this._yMax) return false;
	return true;
};

/** 
 * Tests whether a bounding box intersects this one.
 * 
 * @method intersects
 * @param {ia.BoundingBox} bBox The bounding box.
 * @return {Boolean} true if bounding bounding boxes intercept, otherwise false.
 */
ia.BoundingBox.prototype.intersects = function(bBox)
{
	if (bBox.getXMin() > this._xMax) return false;
	if (bBox.getXMax() < this._xMin) return false;
	if (bBox.getYMin() > this._yMax) return false;
	if (bBox.getYMax() < this._yMin) return false;
	return true;
};	

/** 
 * Tests whether a bounding box is contained within this one.
 * 
 * @method contains
 * @param {ia.BoundingBox} bBox The bounding box.
 * @return {Boolean} true if bounding box is contained within this one, otherwise false.
 */
ia.BoundingBox.prototype.contains = function(bBox)
{
	if (bBox.getXMin() < this._xMin) return false;
	if (bBox.getXMax() > this._xMax) return false;
	if (bBox.getYMin() < this._yMin) return false;
	if (bBox.getYMax() > this._yMax) return false;
	return true;
};

/** 
 * Adds a margin to the bounding box.
 * 
 * @method addMargin
 * @param {Number} margin Optional margin defined as a value between 0 and 1 as a percentage of the original bBox.
 */
ia.BoundingBox.prototype.addMargin = function(margin)
{
	var bb = this.clone()
	var margin = margin || 0.2;
	var marginX = bb.getWidth() * margin;
	var marginY = bb.getHeight() * margin;
	var cx = bb.getXCenter();
	var cy = bb.getYCenter();
	bb.setWidth(bb.getWidth() + (marginX * 2));
	bb.setHeight(bb.getHeight() + (marginY * 2));
	bb.setXCenter(cx);
	bb.setYCenter(cy);
	return bb;	
};

/** 
 * Gets a simple text representation of this bounding box.
 * 
 * @method toString
 * @return {String} A text String.
 */
ia.BoundingBox.prototype.toString = function() 
{
	return "[object ia.BoundingBox xMin='" + this._xMin + "' yMin='" + this._yMin + "' xMax='" + this._xMax + "' yMax='" + this._yMax + "']";
};