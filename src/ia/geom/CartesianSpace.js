/** 
 * Maps a data space to a pixel space and vice versa.
 * 
 * <p>The data space is defined by a {@link ia.BoundingBox}.</p>
 *
 * <p>The pixel space is defined by the <a href="#canvasX">canvasX</a>, <a href="#canvasY">canvasY</a>, 
 * <a href="#canvasWidth">canvasWidth</a> and <a href="#canvasHeight">canvasHeight</a> properties.</p>
 * 
 * <p>Pixel coords are relative to the top left corner of the view. 
 * Data coords are relative to the bottom left corner of the view.</p>
 *
 * <p>The data space may be adjusted to maintain its aspect ratio by setting 
 * the value of <a href="#maintainAspectRatio">maintainAspectRatio</a> to true.</p>
 *
 * @author J Clare
 * @class ia.CartesianSpace
 * @extends ia.EventDispatcher
 * @constructor
 * @param {Number} [canvasX=0] The x-coord of the pixel space.
 * @param {Number} [canvasY=0] The y-coord of the pixel space.
 * @param {Number} [canvasWidth=0] The width of the pixel space.
 * @param {Number} [canvasHeight=0] The height of the pixel space.
 */
ia.CartesianSpace = function(canvasX, canvasY, canvasWidth, canvasHeight)
{
	ia.CartesianSpace.baseConstructor.call(this);

	this.canvasX = canvasX || 0;
	this.canvasY = canvasY || 0;
	this.canvasWidth = canvasWidth || 0;
	this.canvasHeight = canvasHeight || 0;
	this.bBox = new ia.BoundingBox();
	this.oldBBox = new ia.BoundingBox();
	this._oldBBoxSet = false;
	this.minZoom = -1;
	this.maxZoom = -1;
	this.maintainAspectRatio = false;
};
ia.extend(ia.EventDispatcher, ia.CartesianSpace);

/** 
 * The pixel x-position.
 *
 * @property canvasX
 * @type Number
 * @default 0
 */
ia.CartesianSpace.prototype.canvasX;

/** 
 * The pixel y-position.
 *
 * @property canvasY
 * @type Number
 * @default 0
 */
ia.CartesianSpace.prototype.canvasY;

/** 
 * The pixel width.
 *
 * @property canvasWidth
 * @type Number
 * @default 0
 */
ia.CartesianSpace.prototype.canvasWidth;

/** 
 * The pixel height.
 *
 * @property canvasHeight
 * @type Number
 * @default 0
 */
ia.CartesianSpace.prototype.canvasHeight;

/** 
 * The minimum extent.
 *
 * @property minZoom
 * @type Number
 * @default -1
 */
ia.CartesianSpace.prototype.minZoom;

/** 
 * The maximum extent.
 *
 * @property maxZoom
 * @type Number
 * @default -1
 */
ia.CartesianSpace.prototype.maxZoom;

/** 
 * The data space will often be a different shape to the 
 * pixel space it has to fill. 
 * 
 * <p>If set to <code>true</code> the data space is
 * adjusted to maintain the aspect ratio.</p>
 * 
 * <p>If set to <code>false</code> the data space stretches
 * to fit the pixel space. This will generally result
 * in the aspect ratio changing (a stretching effect).</p>
 * 
 * @property maintainAspectRatio
 * @type Boolean
 * @default false
 */
ia.CartesianSpace.prototype.maintainAspectRatio;

/** 
 * Gets the bounding box.
 *
 * @method getBBox
 * @return {ia.BoundingBox} The bounding box.
 */
ia.CartesianSpace.prototype.getBBox = function()
{
	return this.bBox;
};

/** 
 * Sets the bounding box.
 * 
 * @method setBBox
 * @param {ia.BoundingBox} bBox The bounding box.
 */
ia.CartesianSpace.prototype.setBBox = function(bBox) 
{
	if (!this._oldBBoxSet) 	this.oldBBox = bBox.clone();
	else 					this.oldBBox = this.bBox.clone();
	this.bBox = bBox.clone();
	this._oldBBoxSet = true;

	this.originalBBox = 
	{
		xMin:this.bBox.getXMin(),
		yMin:this.bBox.getYMin(),
		xMax:this.bBox.getXMax(),
		yMax:this.bBox.getYMax()
	}

	this.commitChanges();
};

/** 
 * Converts a point from data units to pixel units.
 * 
 * @method getPixelPoint
 * @param {ia.Point} p A point (data units).
 * @return {ia.Point} A point (pixel units).
 */
ia.CartesianSpace.prototype.getPixelPoint = function(p)
{
	return new ia.Point(this.getPixelX(p.x), this.getPixelY(p.y));
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @method getPixelRect
 * @param {ia.BoundingBox} bb A bounding box (data units).
 * @return {ia.Rectangle} A rectangle (pixel units).
 */
ia.CartesianSpace.prototype.getPixelRect = function(bb)
{
	var pixelRect = new ia.Rectangle(this.getPixelX(bb.getXMin()),
					this.getPixelY(bb.getYMax()),
					this.getPixelWidth(bb.getWidth()),
					this.getPixelHeight(bb.getHeight()));
	return pixelRect;
};

/** 
 * Converts an x-coord from data units to pixel units.
 * 
 * @method getPixelX
 * @param {Number} x An x-coord (data units).
 * @return {Number} An x-coord (pixel units).
 */
ia.CartesianSpace.prototype.getPixelX = function(x)
{
	var px = this.canvasX + this.getPixelWidth(x - this.bBox.getXMin());
	//return Math.floor(px) + 0.5; // Remove antialiasing.
	return px;
};

/** 
 * Converts a y-coord from data units to pixel units.
 * 
 * @method getPixelY
 * @param {Number} y A y-coord (data units).
 * @return {Number} A y-coord (pixel units).
 */
ia.CartesianSpace.prototype.getPixelY = function(y)
{
	var py =  this.canvasY + this.canvasHeight - this.getPixelHeight(y - this.bBox.getYMin());
	//return Math.floor(py) + 0.5; // Remove antialiasing.
	return py;
};

/** 
 * Converts a width from data units to pixel units.
 * 
 * @method getPixelWidth
 * @param {Number} x A width (data units).
 * @return {Number} A width (pixel units).
 */
ia.CartesianSpace.prototype.getPixelWidth = function(dimension)
{
	if (dimension == 0) return 0;
	var pixelDistance  = (dimension / this.bBox.getWidth()) * this.canvasWidth;
	//return Math.floor(pixelDistance) + 0.5; // Remove antialiasing.
	return pixelDistance;
};

/** 
 * Converts a height from data units to pixel units.
 * 
 * @method getPixelHeight
 * @param {Number} y A height (data units).
 * @return {Number} A height (pixel units).
 */
ia.CartesianSpace.prototype.getPixelHeight = function(dimension)
{
	if (dimension == 0) return 0;
	var pixelDistance = (dimension / this.bBox.getHeight()) * this.canvasHeight;
	//return Math.floor(pixelDistance) + 0.5; // Remove antialiasing.
	return pixelDistance;
};

/** 
 * Converts a point from pixel units to data units.
 * 
 * @method getDataPoint
 * @param {ia.Point} p A point (pixel units).
 * @return {ia.Point} A point (data units).
 */
ia.CartesianSpace.prototype.getDataPoint = function(p)
{
	var dataPoint = new ia.Point(this.getDataX(p.x),this.getDataY(p.y));
	return dataPoint;
};

/** 
 * Converts a rectangle (pixel units) to a bBox (data units).
 * 
 * @method getDataBBox
 * @param {ia.Rectangle} rect A rectangle (pixel units).
 * @return {ia.BoundingBox} A bBox (data units).
 */
ia.CartesianSpace.prototype.getDataBBox = function(pixelRect)
{
	var xMin = this.getPixelX(pixelRect.left());
	var yMin = this.getPixelY(pixelRect.bottom());
	var xMax = xMin + this.getPixelWidth(pixelRect.width);
	var yMax = yMin + this.getPixelHeight(pixelRect.height);

	var dataBBox = new ia.BoundingBox(xMin, yMin, xMax, yMax);
	return dataBBox;
};

/** 
 * Converts an x-coord from pixel units to data units.
 * 
 * @method getDataX
 * @param {Number} x An x-coord (pixel units).
 * @return {Number} An x-coord (data units).
 */
ia.CartesianSpace.prototype.getDataX = function(x)
{
	var dataX = this.bBox.getXMin() + this.getDataWidth(x);
	return dataX;
};

/** 
 * Converts a y-coord from pixel units to data units.
 * 
 * @method getDataY
 * @param {Number} y A y-coord (pixel units).
 * @return {Number} A y-coord (data units).
 */
ia.CartesianSpace.prototype.getDataY = function(y)
{
	var dataY = this.bBox.getYMin() + this.getDataHeight(this.canvasHeight - y);
	return dataY;
};

/** 
 * Converts a width from pixel units to data units.
 * 
 * @method getDataWidth
 * @param {Number} dimension A width (pixel units).
 * @return {Number} A width (data units).
 */
ia.CartesianSpace.prototype.getDataWidth = function(dimension)
{
	if (dimension == 0) return 0;
	var dataDistance = (dimension / this.canvasWidth) * this.bBox.getWidth();
	return dataDistance;
};

/** 
 * Converts a height from pixel units to data units.
 * 
 * @method getDataHeight
 * @param {Number} dimension A height (pixel units).
 * @return {Number} A height (data units).
 */
ia.CartesianSpace.prototype.getDataHeight = function(dimension)
{
	if (dimension == 0)return 0;
	var dataDistance = (dimension / this.canvasHeight) * this.bBox.getHeight();
	return dataDistance;
};

/** 
 * A call to <code>commitChanges</code> commits any changes made to
 * <a href="#canvasWidth">canvasWidth</a>, <a href="#canvasHeight">canvasHeight</a> or <a href="#bBox">bBox</a>.
 * 
 * <p>This function exists to allow properties to be changed  
 * without continuous updates to the object.</p>
 *
 * @method commitChanges
 */
ia.CartesianSpace.prototype.commitChanges = function()
{
	// Store the unadjusted bounding box to use when the map frame is resized.
	// This stops the map becoming smaller and smaller.
	if (this.maintainAspectRatio) this.adjustBBox(this.bBox);
		
	var withinExtents = true;
	if (this.minZoom != -1)
	{
		var minZoom = Math.max(this.bBox.getWidth(), this.bBox.getHeight());
		if (minZoom > this.minZoom) withinExtents = false;
	}
	if (this.maxZoom != -1)
	{
		var maxZoom = Math.min(this.bBox.getWidth(), this.bBox.getHeight());
		if (maxZoom < this.maxZoom) withinExtents = false;
	}
	
	if (withinExtents)
	{
		// Test against rounded pixels - due to problems with 
		// precision in real world coords.
		var oldRect = this.getPixelRect(this.oldBBox);
		var newRect = this.getPixelRect(this.bBox);
		var w = Math.round(newRect.width);
		var h = Math.round(newRect.height);
		var ow = Math.round(oldRect.width);
		var oh = Math.round(oldRect.height);

		if((w == ow)
		&& (h == oh))
		{
			// Pan.
			eventType = ia.BBoxEvent.BBOX_TRANSLATE;
		}
		else
		{
			// Zoom.
			eventType = ia.BBoxEvent.BBOX_SCALE;
		}
	}
	else 
	{
		this.bBox = this.oldBBox.clone();
		if (this.maintainAspectRatio) this.adjustBBox(this.bBox);
		eventType = ia.BBoxEvent.BBOX_SCALE;
	}

	// Inform listeners that the bBox has changed.
	var e = new ia.BBoxEvent(eventType, this, this.bBox, this.oldBBox)
	this.dispatchEvent(e);
};

/** 
 * Adjusts the bounding box to fit the pixel space whilst maintaining its aspect ratio.
 * 
 * @method adjustBBox
 * @param {ia.BoundingBox} bb The bounding box.
 */
ia.CartesianSpace.prototype.adjustBBox = function(bb)
{
	var sy = bb.getHeight() / this.canvasHeight;
	var sx = bb.getWidth() / this.canvasWidth;

	var sBBoxX;
	var sBBoxY;
	var sBBoxW;
	var sBBoxH; 

	if (sy > sx)
	{
		sBBoxY = bb.getYMin();
		sBBoxH = bb.getHeight();
		sBBoxW = (this.canvasWidth / this.canvasHeight) * sBBoxH;
		sBBoxX = bb.getXMin() - ((sBBoxW - bb.getWidth()) / 2);
	}
	else if (sx > sy)
	{
		sBBoxX = bb.getXMin();
		sBBoxW = bb.getWidth();
		sBBoxH = (this.canvasHeight / this.canvasWidth) * sBBoxW;
		sBBoxY = bb.getYMin() - ((sBBoxH - bb.getHeight()) / 2);
	}
	else
	{
		sBBoxX = bb.getXMin();
		sBBoxY = bb.getYMin();
		sBBoxW = bb.getWidth();
		sBBoxH = bb.getHeight();
	}

	bb.setXMin(sBBoxX);
	bb.setYMin(sBBoxY);
	bb.setWidth(sBBoxW);
	bb.setHeight(sBBoxH);
};

/** 
 * Adjusts the y coords to fit the pixel space whilst maintaining x coords.
 * 
 * @method adjustY
 * @param {ia.BoundingBox} bb The bounding box.
 */
ia.CartesianSpace.prototype.adjustY = function(bb)
{
	var sBBoxX = bb.getXMin();
	var sBBoxW = bb.getWidth();
	var sBBoxH = (this.canvasHeight / this.canvasWidth) * sBBoxW;
	var sBBoxY = bb.getYMin() - ((sBBoxH - bb.getHeight()) / 2);

	bb.setXMin(sBBoxX);
	bb.setYMin(sBBoxY);
	bb.setWidth(sBBoxW);
	bb.setHeight(sBBoxH);
};