/**
 * <code>ia.Map</code> defines the basic layout behavior of map.
 *
 * @author J Clare
 * @class ia.Map
 * @extends ia.CanvasBase
 * @constructor
 * @param {String} id The id of the map.
 */
ia.Map = function(id)
{
	ia.Map.baseConstructor.call(this, id);

	// Bitmap mode used for smooth navigation of vectors.
	this._bitmapMode = false;
	this._imageDataBBox = undefined;

	// Navigation.
	this._mouseDownCoords = undefined;		// The mouse position when the mouse is pressed (data units).
	this._mouseDownPixels = undefined;		// The mouse position when the mouse is pressed (pixel units).
	this._doPan = false;					// Flag to indicate a panning event.
	this._doZoom = false;					// Flag to indicate a zoom event.
	this._userDefinedRect = undefined;		// The rectangle that indicates the zoom region as defined by the user.
	this._doZoomWheel = false;  			// Flag to indicate a zoom wheel event.
	this._wheelTimeout = undefined;			// Mouse Wheel.

	// Pinch
	this._pinchDistance = undefined;
	this._pinchCentreX = undefined;
	this._pinchCentreY = undefined;

	// Add extra css for map.
	this.container.addClass("ia-map");
	
	// Set the cartesian space.
	this.maintainAspectRatio = true;
	
	// Add the map controller.
	this.controller = new ia.MapController(this);
	
	// Make it draggable
	this.isDraggable = true;
	
	// Add bbox listeners.
	var me = this
	me.addEventListener(ia.Event.MAP_READY, function()
	{
		me.addEventListener(ia.BBoxEvent.BBOX_TRANSLATE, me._bBoxChangeHandler.bind(me));
		me.addEventListener(ia.BBoxEvent.BBOX_SCALE, me._bBoxChangeHandler.bind(me));
	});

	// Marker layer.
	this.markerLayer = new ia.MarkerLayer();
	this.markerLayer.setMap(this, this.foregroundContainer);
	this.markerLayer.setVisible(true);
};
ia.extend(ia.CanvasBase, ia.Map);
	
/**
 * A special layer for drawing markers on top of the map layers.
 * 
 * @property markerLayer
 * @type ia.MarkerLayer
 */
ia.Map.prototype.markerLayer;

/** 
 * Controls the map.
 *
 * @property controller
 * @type ia.MapController
 */
ia.Map.prototype.controller;

/** 
 * Indicates whether to use navigation.
 * 
 * @method useNavigation
 * @param {Boolean} useNav True or false.
 */
ia.Map.prototype.useNavigation = function(useNav)
{
	if (useNav)
	{
		// ".bind(this)" 
		// see http://stackoverflow.com/questions/8100469/preserve-this-reference-in-javascript-prototype-event-handler
		// and https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind

		// Pan / Zoom.
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_MOVE, this._onMouseMove.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_DOWN, this._onMouseDown.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_DRAG, this._onMouseDrag.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_DRAG_UP, this._onMouseDragUp.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_UP, this._onMouseUp.bind(this));

		// Zoom wheel.
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_OVER, this._onMouseOver.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_OUT, this._onMouseOut.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_MOUSE_WHEEL, this._onMouseWheel.bind(this));

		// Pinch.
		this.addEventListener(ia.MapMouseEvent.MAP_PINCH_DOWN, this._onPinchDown.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_PINCH_MOVE, this._onPinchMove.bind(this));
		this.addEventListener(ia.MapMouseEvent.MAP_PINCH_UP, this._onPinchUp.bind(this));
	}
};

//--------------------------------------------------------------------------
//
// Methods - Graphics
//
//--------------------------------------------------------------------------

/** 
 * Renders the map on a bBox change.
 * 
 * @method _bBoxChangeHandler
 * @param {ia.BBoxEvent} event A BBoxEvent.
 * @private
 */
ia.Map.prototype._bBoxChangeHandler = function(event) 
{
	//ia.log(event.bBox.getXMin()+" "+event.bBox.getYMin()+" "+event.bBox.getXMax()+" "+event.bBox.getYMax());
	if (this._bitmapMode) this._drawBitmap();
	else this.render();
	/*{
		if (!this._runningAnimation) this.renderAnimation(event);
		else this.render();
	}*/
};


/** 
 * Clears and renders the map.
 * 
 * @method render
 */
/*ia.Map.prototype._runningAnimation = false;
ia.Map.prototype.renderAnimation = function(event)
{
	this._runningAnimation = true;

	var frame = 0;
	var noFrames = 15;
	var myAnimation;

	var bBox = event.bBox; 
	var oldBBox = event.oldBBox;

	var xMin = oldBBox.getXMin();
	var yMin = oldBBox.getYMin();
	var xMax = oldBBox.getXMax();
	var yMax = oldBBox.getYMax();

	var xMinIncr = (bBox.getXMin() - oldBBox.getXMin()) / noFrames;
	var yMinIncr = (bBox.getYMin() - oldBBox.getYMin()) / noFrames;
	var xMaxIncr = (bBox.getXMax() - oldBBox.getXMax()) / noFrames;
	var yMaxIncr = (bBox.getYMax() - oldBBox.getYMax()) / noFrames;

	var me = this;

	function animate() 
	{
	    myAnimation = window.requestAnimationFrame(animate);

		xMin = xMin + xMinIncr;
		yMin = yMin + yMinIncr;
		xMax = xMax + xMaxIncr;
		yMax = yMax + yMaxIncr;

		oldBBox.setXMin(xMin)
		oldBBox.setYMin(yMin)
		oldBBox.setXMax(xMax)
		oldBBox.setYMax(yMax)

		me.setBBox(oldBBox);

	    frame++;
	    ia.log(frame)
	    if (frame == noFrames)
	    {
	    	ia.log("end")
			window.cancelAnimationFrame(myAnimation);
			me._runningAnimation = false;
			//me._bitmapMode = false;
			me.render();
	    }
	}
	animate();
};*/


/** 
 * Clears and renders the map.
 * 
 * @method render
 */
ia.Map.prototype.render = function()
{
	this.mapContainer.css(
	{
		'-moz-transform': 'matrix(1, 0, 0, 1, 0, 0)',
		'-webkit-transform': 'matrix(1, 0, 0, 1, 0, 0)',
		'-o-transform': 'matrix(1, 0, 0, 1, 0, 0)',
		msTransform: 'matrix(1, 0, 0, 1, 0, 0)',
		'transform': 'matrix(1, 0, 0, 1, 0, 0)'
	});
		
	var layers = this.getLayers()
	for (var i = 0; i < layers.length; i++)  {layers[i].render();}

	this.markerLayer.render()	
};

/** 
 * Draws the bitmap.
 *
 * @method _drawBitmap
 * @private
 */
ia.Map.prototype._drawBitmap = function() 
{
	var r = this.getPixelRect(this._imageDataBBox);
	var ox,oy,sx,sy,tx,ty;
				
	if (this._doPan)
	{
		ox = 0;
		oy = 0;
		sx = 1;
		sy = 1;
		tx = r.x;
		ty = r.y;
	}
	else
	{
		ox = this.mouseX;
		oy = this.mouseY;
		sx = this._imageDataBBox.getWidth() / this.bBox.getWidth();
		sy = this._imageDataBBox.getHeight() / this.bBox.getHeight();
		tx = 0;
		ty = 0;
	}
	
	this.mapContainer.css(
	{
		'transform-origin': ox+'px '+oy+'px',
		msTransformOrigin: ox+'px '+oy+'px',
		'-moz-transform-origin': ox+'px '+oy+'px',
		'-webkit-transform-origin': ox+'px '+oy+'px',
		'-o-transform-origin': ox+'px '+oy+'px',

		'-moz-transform': 'matrix('+sx+', 0, 0, '+sy+', '+tx+', '+ty+')',
		'-webkit-transform': 'matrix('+sx+', 0, 0, '+sy+', '+tx+', '+ty+')',
		'-o-transform': 'matrix('+sx+', 0, 0, '+sy+', '+tx+', '+ty+')',
		msTransform: 'matrix('+sx+', 0, 0, '+sy+', '+tx+', '+ty+')',
		'transform': 'matrix('+sx+', 0, 0, '+sy+', '+tx+', '+ty+')'
	});
};

/** 
 * Initialises the bitmap.
 * 
 * @method _initBitmap
 * @private
 */
ia.Map.prototype._initBitmap = function()
{
	this.datatip.hide();
	this._bitmapMode = true;
	
	// Get the bounding box of the created image.
	this._imageDataBBox = this.getBBox();
};

/** 
 * Draws a rectangle on the canvas in pixel units.
 * 
 * @method _drawRect
 * @param {HTML Canvas Context} ctx The context to draw to.
 * @param {ia.Rectangle} r The rectangle (pixel units).
 * @param {Object} s The style.
 * @private
 */
ia.Map.prototype._drawRect = function(ctx, r, s)
{
	for (var p in s) {ctx[p] = s[p];}

	ctx.beginPath();
	ctx.rect(r.x, r.y, r.width, r.height);
	ctx.fill();
	ctx.stroke();
};

/** 
 * Draws a bounding box on the map.
 * 
 * @method _drawBBox
 * @param {HTML Canvas Context} ctx The context to draw to.
 * @param {ia.BoundingBox} bb The bBox (data units).
 * @param {Object} s The style.
 * @private
 */
ia.Map.prototype._drawBBox = function(ctx, bb, s)
{
	var r = this.getPixelRect(bb);
	this._drawRect(ctx, r, s);
};

//--------------------------------------------------------------------------
//
// Zoom to feature
//
//--------------------------------------------------------------------------

/** 
 * Zooms to a feature in the map.
 * 
 * @method zoomToFeatureWithId
 * @param {String} featureId The id of the feature.
 * @param {ia.LayerBase[]} optLayers An optional list of layers to check.
 * @return {Boolean} true if the feature was found, otherwise false.
 */
ia.Map.prototype.zoomToFeatureWithId = function(featureId, optLayers)
{
	var layers = optLayers || this.getLayers();
	for (var i = 0; i < layers.length; i++)  
	{
		var items = layers[i].items;
		for (var id in items)
		{
			if (id == featureId)
			{		
				this.zoomToFeature(items[id]);
				return true;
			}
		}
	}
	return false;
};

/** 
 * Zooms to a feature in the map with the given name.
 * 
 * @method zoomToFeatureWithName
 * @param {String} featureName The name of the feature.
 * @param {ia.LayerBase[]} optLayers An optional list of layers to check.
 * @return {Boolean} true if the feature was found, otherwise false.
 */
ia.Map.prototype.zoomToFeatureWithName = function(featureName, optLayers) 
{
	var layers = optLayers || this.getLayers();
	for (var i = 0; i < layers.length; i++)  
	{
		var items = layers[i].items;
		for (var id in items)
		{
			var item = items[id];
			if (item.name == featureName)
			{
				this.zoomToFeature(item);
				return true;
			}
		}
	}
	return false;
};

/** 
 * Zooms to a feature in the map.
 * 
 * @method zoomToFeature
 * @param {Object} feature The feature.
 */
ia.Map.prototype.zoomToFeature = function(feature) 
{
	// Put this if statement in for cases where people click 
	// on table before layer is fully ready - noticed it on AGOL.
	if (feature.bBox && feature.bBox.getXMin() != Infinity)
	{
		var bb = feature.bBox.clone();
		var padding = 0.2;
		var paddingX = bb.getWidth() * padding;
		var paddingY = bb.getHeight() * padding;

		var cx = bb.getXCenter();
		var cy = bb.getYCenter();
		bb.setWidth(bb.getWidth() + (paddingX * 2));
		bb.setHeight(bb.getHeight() + (paddingY * 2));
		bb.setXCenter(cx);
		bb.setYCenter(cy);

		// Adjust for max zoom to force it to still zoom to feature
		// even if the poly is less than the maximum allowable zoom.
		if (this.maxZoom != -1)
		{
			var maxZoom = Math.min(bb.getWidth(), bb.getHeight());
			if (maxZoom < this.maxZoom) 
			{
				cx = bb.getXCenter();
				cy = bb.getYCenter();
				bb.setWidth(this.maxZoom);
				bb.setHeight(this.maxZoom);
				bb.setXCenter(cx);
				bb.setYCenter(cy);
			}
		}
		
		if (feature.layer.geometry == "point")
			this.controller.centerOnCoords(bb.getXCenter(),bb.getYCenter());
		else
			this.controller.zoomToBBox(bb);
	}
};

/** 
 * Zooms to a set of features in the map.
 * 
 * @method zoomToFeatures
 * @param {String[]} featureIds A list of feature ids.
 * @param {ia.LayerBase[]} optLayers An optional list of layers to check.
 */
ia.Map.prototype.zoomToFeatures = function(featureIds, optLayers) 
{
	if (featureIds.length > 0)
	{
		if (featureIds.length == 1) 
			this.zoomToFeatureWithId(featureIds[0], optLayers);
		else
		{
			var xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;

			var layers = optLayers || this.getLayers();
			for (var i = 0; i < layers.length; i++)  
			{
				var items = layers[i].items;

				if (items != undefined)
				{
					for (var j = 0; j < featureIds.length; j++)  
					{
						var id = featureIds[j]
						var item = items[id];
						if (item && item.bBox)
						{
							xMin = (item.bBox.getXMin() < xMin) ? item.bBox.getXMin() : xMin;
							yMin = (item.bBox.getYMin() < yMin) ? item.bBox.getYMin() : yMin;
							xMax = (item.bBox.getXMax() > xMax) ? item.bBox.getXMax() : xMax;                       
							yMax = (item.bBox.getYMax() > yMax) ? item.bBox.getYMax() : yMax;
						}
					}
				}
			}


			if (xMin != Infinity 
				&& yMin != Infinity 
				&& xMax != Infinity 
				&& yMax != Infinity)
			{
				var bbox = new ia.BoundingBox(xMin, yMin, xMax, yMax);
				var bb = bbox.addMargin();

				// Adjust for max zoom to force it to still zoom to feature
				// even if the poly is less than the maximum allowable zoom.
				if (this.maxZoom != -1)
				{
					var maxZoom = Math.min(bb.getWidth(), bb.getHeight());
					if (maxZoom < this.maxZoom) 
					{
						cx = bb.getXCenter();
						cy = bb.getYCenter();
						bb.setWidth(this.maxZoom);
						bb.setHeight(this.maxZoom);
						bb.setXCenter(cx);
						bb.setYCenter(cy);
					}
				}
				this.controller.zoomToBBox(bb);
			}
		}
	}
};

/** 
 * Centers a feature on the map.
 *
 * @method centerOnFeature
 * @param {String} featureId The id of the feature.
 * @return {Boolean} true if the feature was found, otherwise false.
 */
ia.Map.prototype.centerOnFeature = function(featureId) 
{
	var layers = this.getLayers();
	for (var i = 0; i < layers.length; i++)  
	{
		var items = layers[i].items;
		for (var id in items)
		{
			if (id == featureId)
			{		
				var bb = items[id].bBox;
				this.controller.centerOnCoords(bb.getXCenter(),bb.getYCenter());
				return true;
			}
		}
	}
	return false;
};

/** 
 * Zooms to the bounding box of a layer.
 * 
 * @method zoomToLayer
 * @param {ia.LayerBase} layer The layer to zoom to.
 */
ia.Map.prototype.zoomToLayer = function(layer) 
{
	var bb = layer.bBox.addMargin();
	this.controller.zoomToBBox(bb);
};

//--------------------------------------------------------------------------
//
// ia.Event handlers - Navigation
//
//--------------------------------------------------------------------------

/**
 * Handles mouseover events.
 *
 * @method _onMouseOver
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseOver = function(event) 
{
	this._doZoomWheel = true;
};

/**
 * Handles mouseout events.
 *
 * @method _onMouseOut
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseOut = function(event) 
{
	this.datatip.hide();
	this._doZoomWheel = false;
};

/**
 * Handles mousedown events.
 *
 * @method _onMouseDown
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseDown = function(event)  
{
	ia.disableTextSelection($j("body"));
	
	this._mouseDownCoords = this.mouseCoords(); 
	this._mouseDownPixels = new ia.Point(this.mouseX, this.mouseY);

	this._doPan = false;
	this._doZoom = false;
	
	// Zoom.
	/*if (event.shiftKey) this._doZoom = true;*/
	// Pan.
	/*else this._doPan = true;*/
	
	this._doPan = true;
};

/**
 * Handles mouseup events.
 *
 * @method _onMouseUp
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseUp = function(event) 
{ 			
	this._doPan = false;
	this._doZoom = false;
	ia.enableTextSelection($j("body"));

	if (this._bitmapMode)
	{
		this._pinchDistance = undefined;
		this._bitmapMode = false;
		this.render();
	}
};

/**
 * Handles mousemove events.
 *
 * @method _onMouseMove
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseMove = function(event)  
{
	//ia.log(this.mouseX+" "+this.mouseY)
	//ia.log(this.mouseCoords().x+" "+this.mouseCoords().y)
};

/**
 * Handles mousedrag events.
 *
 * @method _onMouseDrag
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseDrag = function(event)  
{
	var mouseDragCoords = this.mouseCoords();
	var mouseDragPixels = new ia.Point(this.mouseX, this.mouseY);
	
	if (this._doPan)
	{		
		this.datatip.hide();
		if (this._bitmapMode == false) this._initBitmap();
		ia.showMoveCursor();
			
		// Translate.
		var d = this._mouseDownCoords.subtract(mouseDragCoords);
		this.controller.translate(d.x, d.y);
	}
	else if (this._doZoom)
	{		
		// Draw user defined rectangle.
		var rx = Math.min(this._mouseDownPixels.x, mouseDragPixels.x);
		var ry = Math.min(this._mouseDownPixels.y, mouseDragPixels.y);
		var rw = Math.abs(this._mouseDownPixels.x - mouseDragPixels.x);
		var rh = Math.abs(this._mouseDownPixels.y - mouseDragPixels.y);
		this._userDefinedRect = new ia.Rectangle(rx, ry, rw, rh);
		this._drawRect(this.context, this._userDefinedRect, {fillStyle:'rgba(255,255,255,0.5)', strokeStyle:'#CCCCCC', lineWidth:'0.5'});
	}
};

/**
 * Handles mousedragup events.
 *
 * @method _onMouseDragUp
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseDragUp = function(event)  
{ 	
	var mouseDragUpCoords = this.mouseCoords();

	this._pinchDistance = undefined;
	this._bitmapMode = false;
	
	if (this._doZoom)
	{
		// Only zoom when box is greater than 5 pixels.
		if ((this._userDefinedRect.width > 5) && (this._userDefinedRect.height > 5))
		{					
			this.controller.zoomToPointExtent(this._mouseDownCoords, mouseDragUpCoords);
		}
	}
	else this.render();

	ia.showDefaultCursor();
	this._doPan = false;
	this._doZoom = false;
	
	ia.enableTextSelection($j("body"));
};

//--------------------------------------------------------------------------
//
// Pinch
//
//--------------------------------------------------------------------------

// The bBox formed by touches on a pinch down.
//var downBBox = new ia.BoundingBox();

/**
 * Handles pinchdown events.
 *
 * @method _onPinchDown
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onPinchDown = function(event)  
{		
	this._doPan = false;
	this._doZoom = false;
	
	var o = this._getPinchInfo(event);
	this._pinchDistance = o.distance;
	this._pinchCentreX 	= o.centreX;
	this._pinchCentreY 	= o.centreY;
};

/**
 * Handles pinchmove events.
 *
 * @method _onPinchMove
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onPinchMove = function(event)  
{
	this.datatip.hide();
	if (this._bitmapMode == false) this._initBitmap();

	var o = this._getPinchInfo(event);
	this.mouseX = this._pinchCentreX;
	this.mouseY = this._pinchCentreY;

	if (this._pinchDistance != undefined)
	{
		var r = this._pinchDistance / o.distance; 
		this.controller.zoomOnCursor(r);
	}
	this._pinchDistance = o.distance;
};

/**
 * Handles pinchup events.
 *
 * @method _onPinchUp
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onPinchUp = function(event) 
{ 	
	this._pinchDistance = undefined;
	this._bitmapMode = false;
	this.render();
};

/**
 * Get pinch info.
 *
 * @method _getPinchDistance
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @return {Object} {x1, y1, x2, y2, distanceX, distanceX, distance, centreX, centreYy}.
 * @private
 */
ia.Map.prototype._getPinchInfo = function(event)  
{		
	var x1 = Math.min(event.x, event.x2);
	var y1 = Math.min(event.y, event.y2);
	var x2 = Math.max(event.x, event.x2);
	var y2 = Math.max(event.y, event.y2);

	var distX = x2 - x1;
	var distY = y2 - y1;
	var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
	var cx = (x1 + x2) / 2;
	var cy = (y1 + y2) / 2;

	return {x1:x1, y1:y1, x2:x2, y2:y2, distanceX:distX, distanceX:distY, distance:dist, centreX:cx, centreY:cy};
};

//--------------------------------------------------------------------------
//
// Mouse Wheel
//
//--------------------------------------------------------------------------

/**
 * Handles mousewheel events.
 *
 * @method _onMouseWheel
 * @param {ia.MapMouseEvent} event ia.MapMouseEvent.
 * @private
 */
ia.Map.prototype._onMouseWheel = function(event) 
{
	if (this._doZoomWheel)
	{
		this.datatip.hide();
		if (this._bitmapMode == false)  this._initBitmap();
		
		var z = 1.4;
		var r;
		if (event.delta > 0) r = 1/z;
		else r = z;
		this.controller.zoomOnCursor(r);
		
		clearTimeout(this._wheelTimeout);
		this._wheelTimeout = setTimeout(function()
		{
			clearTimeout(this._wheelTimeout);

			this._bitmapMode = false;
			this.render();

			var e = new ia.MapMouseEvent(this, event, ia.MapMouseEvent.MAP_MOUSE_WHEEL_END, this.mouseX, this.mouseY);
			this.dispatchEvent(e);
		
		}.bind(this), 250);
	}
};