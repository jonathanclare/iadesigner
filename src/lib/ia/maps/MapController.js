/**
 * Used to control chart navigation.
 *
 * @author J Clare
 * @class ia.MapController
 * @constructor
 * @param {ia.Map} m The this._map
 */
ia.MapController = function(m)
{
	// The map associated with the controller
	this._map = m;
}

/** 
 * A default <code>BoundingBox</code> for the view.
 * 
 * @property defaultBBox
 * @type ia.BoundingBox
 */
ia.MapController.prototype.defaultBBox;

/** 
 * Pans North.
 *
 * @method panN
 */		
ia.MapController.prototype.panN = function() {this.pan(0);};

/** 
 * Pans North-East.
 *
 * @method panNE
 */		
ia.MapController.prototype.panNE = function() {this.pan(45);};

/** 
 * Pans East.
 *
 * @method panE
 */		
ia.MapController.prototype.panE = function() {this.pan(90);};

/** 
 * Pans South-East.
 *
 * @method panSE
 */		
ia.MapController.prototype.panSE = function() {this.pan(135);};

/** 
 * Pans South.
 *
 * @method panS
 */		
ia.MapController.prototype.panS = function() {this.pan(180);};

/** 
 * Pans South-West.
 *
 * @method panSW
 */		
ia.MapController.prototype.panSW = function() {this.pan(225);};

/** 
 * Pans West.
 *
 * @method panW
 */		
ia.MapController.prototype.panW = function() {this.pan(270);};

/** 
 * Pans North-West.
 *
 * @method panNW
 */		
ia.MapController.prototype.panNW = function() {this.pan(315);};

/** 
 * Pans the given direction and distance.
 * 
 * @method pan
 * @param {Number} direction The direction in degrees. Valid values are >=0 and <=360.
 * @param {Number} ratio <p>To calculate the distance moved, <code>ratio</code> is multiplied by the
 * <code>bBox</code> width or height (depending on the direction of the pan).
 * 
 * <p>The <code>bBox</code> is then shifted by the calculated distance.</p> 
 * 
 * <p>Valid values are > 0.</p>
 */
ia.MapController.prototype.pan = function(direction, ratio)
{
	if (ratio == null) ratio = 0.5;
	var r = Math.abs(ratio);
	var distance;

	if (((direction >= 45) && (direction <= 135)) 
		|| ((direction >= 225) && (direction <= 315)))
		distance = this._map.getBBox().getWidth() * r;
	else
		distance = this._map.getBBox().getHeight() * r;

	this.panDistance(direction, distance);
};

/** 
 * Pans the given direction and distance.
 * 
 * @method panDistance
 * @param {Number} direction The direction in degrees. Valid values are >=0 and <=360.
 * @param {Number} distance The distance (data units). 
 */
ia.MapController.prototype.panDistance = function(direction, distance)
{
	if ((direction >= 0) && (direction <= 360))
	{
		var rad = direction * (Math.PI/180);
		var dx = Math.sin(rad) * distance;
		var dy = Math.cos(rad) * distance;
		this.translate(dx, dy);
	}
};

/** 
 * Centers the view on the cursor position.
 *
 * @method centerOnCursor
 */
ia.MapController.prototype.centerOnCursor = function() 
{
	this.centerOnPoint(this._map.mouseCoords());
};

/** 
 * Centers the view on a point.
 * 
 * @method centerOnPoint
 * @param {ia.Point} p The point (data units).
 */
ia.MapController.prototype.centerOnPoint = function(p) 
{
	this.centerOnCoords(p.x, p.y);
};

/** 
 * Centers the view on a pair of coordinates.
 * 
 * @method centerOnCoords
 * @param {Number} px The x-coord (data units).
 * @param {Number} py The y-coord (data units).
 */
ia.MapController.prototype.centerOnCoords = function(px, py) 
{
	var centerX = this._map.getBBox().getXMin() + (this._map.getBBox().getWidth() / 2);
	var centerY = this._map.getBBox().getYMin() + (this._map.getBBox().getHeight() / 2);
	var dx = px - centerX;
	var dy = py - centerY;
	this.translate(dx, dy);
};

/** 
 * Moves the view by the given distance.
 * 
 * @method translate
 * @param {Number} dx The distance in the x direction (data units).
 * @param {Number} dy The distance in the y direction (data units).
 */
ia.MapController.prototype.translate = function(dx, dy)
{
	var bx = this._map.getBBox().getXMin() + dx;
	var by = this._map.getBBox().getYMin() + dy;
	var bw = this._map.getBBox().getWidth();
	var bh = this._map.getBBox().getHeight();
	this.resetBBox(bx, by, bw, bh);
};

/** 
 * Zooms in around the center of the view.
 *
 * @method zoomIn
 */
ia.MapController.prototype.zoomIn = function()
{
	this.zoomOnCenter(0.5); 
};

/** 
 * Zooms out around the center of the view. 
 *
 * @method zoomOut
 */
ia.MapController.prototype.zoomOut = function()
{
	this.zoomOnCenter(2);
};

/** 
 * Zooms around the center of the view.
 * 
 * @method zoomOnCenter
 * @param {Number} ratio To calculate the distance zoomed, the <code>bBox</code> 
 * width and height are multiplied by the <code>ratio</code>.
 * 
 * <p>Valid values are > 0.</p>
 * 
 * <p>Values > 1 will cause the view to zoom out.
 * values < 1 will cause the view to zoom in.
 */
ia.MapController.prototype.zoomOnCenter = function(ratio)
{
	if (ratio == null) ratio = 0.5;
	var centerX = this._map.getBBox().getXMin() + (this._map.getBBox().getWidth() / 2);
	var centerY = this._map.getBBox().getYMin() + (this._map.getBBox().getHeight() / 2);
	this.zoomOnCoords(centerX, centerY, ratio);
};

/** 
 * Zooms in around the cursor position.
 *
 * @method zoomInOnCursor
 */
ia.MapController.prototype.zoomInOnCursor = function() 
{
	this.zoomOnPoint(this._map.mouseCoords(), 0.5);
};

/** 
 * Zooms out around the cursor position.
 *
 * @method zoomOutOnCursor
 */
ia.MapController.prototype.zoomOutOnCursor = function() 
{
	this.zoomOnPoint(this._map.mouseCoords(), 2);
};

/** 
 * Zooms around the cursor position by the given ratio.
 * 
 * @method zoomOnCursor
 * @param {Number} ratio To calculate the distance zoomed, the <code>bBox</code> 
 * width and height are multiplied by the <code>ratio</code>.
 * 
 * <p>Valid values are > 0.</p>
 * 
 * <p>Values > 1 will cause the view to zoom out.
 * values < 1 will cause the view to zoom in.
 */
ia.MapController.prototype.zoomOnCursor = function(ratio) 
{
	if (ratio == null) ratio = 0.5;
	this.zoomOnPoint(this._map.mouseCoords(), ratio);
};

/** 
 * Zooms in around a point.
 * 
 * @method zoomOnPoint
 * @param {ia.Point} px The point (data units).
 * @param {Number} ratio To calculate the distance zoomed, the <code>bBox</code> 
 * width and height are multiplied by the <code>ratio</code>.
 * 
 * <p>Valid values are > 0.</p>
 * 
 * <p>Values > 1 will cause the view to zoom out.
 * values < 1 will cause the view to zoom in.
 */
ia.MapController.prototype.zoomOnPoint = function(p, ratio) 
{	
	if (ratio == null) ratio = 0.5;
	this.zoomOnCoords(p.x, p.y, ratio);
};

/** 
 * Zooms in around a pair of coordinates.
 * 
 * @method zoomOnCoords
 * @param {Number} px The x-coord (data units).
 * @param {Number} py The y-coord (data units).
 * @param {Number} ratio To calculate the distance zoomed, the <code>bBox</code> 
 * width and height are multiplied by the <code>ratio</code>.
 * 
 * <p>Valid values are > 0.</p>
 * 
 * <p>Values > 1 will cause the view to zoom out.
 * values < 1 will cause the view to zoom in.
 */
ia.MapController.prototype.zoomOnCoords = function(px, py, ratio) 
{	
	if (ratio == null) ratio = 0.5;
	var r = Math.abs(ratio);
	var bw = this._map.getBBox().getWidth() * r;
	var bh = this._map.getBBox().getHeight() * r;						
	var bx = px - (((px - this._map.getBBox().getXMin()) / this._map.getBBox().getWidth()) * bw);
	var by = py - (((py - this._map.getBBox().getYMin()) / this._map.getBBox().getHeight()) * bh);
	this.resetBBox(bx, by, bw, bh);
};

/** 
 * Zooms to an extent as defined by two points.
 * 
 * @method zoomToPointExtent
 * @param {ia.Point} p1 A point (data units).
 * @param {ia.Point} p2 A point (data units).
 */
ia.MapController.prototype.zoomToPointExtent = function(p1, p2)
{
	var bx = Math.min(p1.x, p2.x);
	var by = Math.min(p1.y, p2.y);
	var bw = Math.abs(p1.x - p2.x);
	var bh = Math.abs(p1.y - p2.y);
	this.resetBBox(bx, by, bw, bh);
};

/** 
 * Zooms to an extent around the center of the view.
 * 
 * @method {width=0,height=0)} zoomToExtent
 * @param extent The extent to zoom to (data units).
 */
ia.MapController.prototype.zoomToExtent = function(extent) 
{
	var centerX = this._map.getBBox().getXMin() + (this._map.getBBox().getWidth() / 2);
	var centerY = this._map.getBBox().getYMin() + (this._map.getBBox().getHeight() / 2);
	var bw = extent.width;
	var bh = extent.height;
	var bx = centerX - (bw / 2);
	var by = centerY - (bh / 2);
	this.resetBBox(bx, by, bw, bh);
};

/**
 * Changes the bounding box using the given distances.
 * 
 * @method changeBBox
 * @param {Number} dXMin The change in the xMin (data units).
 * @param {Number} dYMin The change in the yMin (data units).
 * @param {Number} dXMax The change in the xMax (data units).
 * @param {Number} dYMax The change in the yMax (data units).
 */
ia.MapController.prototype.changeBBox = function(dXMin, dYMin, dXMax, dYMax)
{
	var bx = this._map.getBBox().getXMin() + dXMin;
	var by = this._map.getBBox().getYMin() + dYMin;
	var bx2 = this._map.getBBox().getXMax() + dXMax;
	var by2 = this._map.getBBox().getYMax() + dYMax;
	var bw = bx2 - bx;
	var bh = by2 - by;
	this.resetBBox(bx, by, bw, bh);
};

/** 
 * Zooms to a rectangle if the rectangle is greater than 5*5 pixels.
 * 
 * @method zoomToRect
 * @param {ia.Rectangle} rect The rect (pixel units).
 */
ia.MapController.prototype.zoomToRect = function(rect) 
{
	if ((rect.width > 5) && (rect.height > 5)) this.zoomToBBox(this.getDataBBox(rect));
};

/** 
 * Zooms to full extents as defined by the default bBox.
 * 
 * @method zoomFull
 */
ia.MapController.prototype.zoomFull = function()
{
	this.zoomToBBox(this.defaultBBox);
};

/** 
 * Zooms to a bounding box.
 * 
 * @method zoomToBBox
 * @param {ia.BoundingBox} bb A boundingBox.
 */
ia.MapController.prototype.zoomToBBox = function(bb)
{
	if (bb) this._map.setBBox(bb);
};

/** 
 * Zooms to a bounding box as defined by the following parameters.
 * This is a utility function so that bounding boxes can be
 * dealt with in terms of their x, y, width and height;
 * 
 * @method resetBBox
 * @param {Number} bx The x position of the bBox.
 * @param {Number} by The y position of the bBox.
 * @param {Number} bw The width of the bBox.
 * @param {Number} bh The height of the bBox.
 */
ia.MapController.prototype.resetBBox = function(bx, by, bw, bh) 
{
	this.zoomToBBox(new ia.BoundingBox(bx, by, bx+bw, by+bh));
};