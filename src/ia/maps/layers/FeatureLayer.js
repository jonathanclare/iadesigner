/** 
 * The base class for feature layers (points, lines and polys).
 *
 * @author J Clare
 * @class ia.FeatureLayer
 * @extends ia.ItemLayer
 * @constructor
 * @param {String} inSource The spatial source.
 */
ia.FeatureLayer = function(inSource)
{
	ia.FeatureLayer.baseConstructor.call(this);

	this.renderDisabledFeatures = true;
	this.dataLabel = "";
	this.minLabelExtent = -Infinity;
	this.maxLabelExtent = Infinity;
	this.symbolSize = 15;
	this.iconPath = "";
	this.eval = true;
	this.uid = "";
	this.symbol = ia.Shape.CIRCLE;
	this.selectionOpacity = 0.3;
	this.highlightOpacity = 0.3;

	this.labelFunction = undefined;
	this.labelPosition = "top-right";
	this.displayLabelsOnly = false;

	var me = this;
	this.debounceDraw = ia.debounce(function () 
	{
		me._draw();
	}, 250);

	if (inSource != null) this.source = inSource;
};
ia.extend(ia.ItemLayer, ia.FeatureLayer);

/**
 * Specifies a thematic. Added for heatmap functionality.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.FeatureLayer.prototype.thematic;

/**
 * Indicates if disabled (filtered out) features should be rendered.
 *
 * @property renderDisabledFeatures
 * @type Boolean
 * @default true
 */
ia.FeatureLayer.prototype.renderDisabledFeatures;

/**
 * The layer data label.
 *
 * @property dataLabel
 * @type String
 * @default ""
 */
ia.FeatureLayer.prototype.dataLabel;

/**
 * The minimum display extent for labels.
 *
 * @property url
 * @type Number
 * @default Infinity
 */
ia.FeatureLayer.prototype.minLabelExtent;

/**
 * The maximum display extent for labels.
 *
 * @property maxLabelExtent
 * @type Number
 * @default Infinity
 */
ia.FeatureLayer.prototype.maxLabelExtent;

/**
 * The symbol size.
 *
 * @property symbolSize
 * @type Number
 * @default 15
 */
ia.FeatureLayer.prototype.symbolSize;

/**
 * The icon iconPath.
 *
 * @property url
 * @type String
 * @default ""
 */
ia.FeatureLayer.prototype.iconPath;

/**
 * The loaded icon derived from iconPath.
 *
 * @property icon
 * @type Image
 */
ia.FeatureLayer.prototype.icon;
	
/** 
 * Check if its eval data.
 *
 * @property eval
 * @type Boolean
 * @default true
 */
ia.FeatureLayer.prototype.eval;

/** 
 * Unique id.
 *
 * @property uid
 * @type String
 * @default ""
 */
ia.FeatureLayer.prototype.uid;

/** 
 * The spatial data source for the layer.
 *
 * @property source
 * @type String
 */
ia.FeatureLayer.prototype.source;

/** 
 * The geometry for the layer.
 *
 * @property geometry
 * @type String
 */
ia.FeatureLayer.prototype.geometry;

/**
 * The symbol used for point data.
 *
 * @property symbol
 * @type String
 * @default ia.Shape.CIRCLE
 */
ia.FeatureLayer.prototype.symbol;

/** 
 * The selection opacity.
 *
 * @property selectionOpacity
 * @type Number
 * @default 0.3
 */
ia.FeatureLayer.prototype.selectionOpacity;

/** 
 * The highlight opacity.
 *
 * @property highlightOpacity
 * @type Number
 * @default 0.3
 */
ia.FeatureLayer.prototype.highlightOpacity;

/**
 * Function for rendering labels. Supply your own function that returns text for the label.
 *
 * @property labelFunction
 * @type Function
 */
ia.FeatureLayer.prototype.labelFunction;

/**
 * The position of labels for point layers. 
 *
 * Options: 
 *
 * "top-left", "top", "top-right" 
 * "left", "center", "right" 
 * "bottom-left", "bottom", "bottom-right"
 *
 * @property labelPosition
 * @type String
 * @default "topRight"
 */
ia.FeatureLayer.prototype.labelPosition;

/**
 * Should only the layers be displayed. 
 *
 * @property displayLabelsOnly
 * @type Boolean
 * @default false
 */
ia.FeatureLayer.prototype.displayLabelsOnly;

/** 
 * Loads the source data.
 *
 * @method loadSource
 */	
ia.FeatureLayer.prototype.loadSource = function(callback) 
{
	var me = this;

	ia.File.load(
	{
		url: me.source,
		dataType: "json", 
		onSuccess:function(json)
		{
			me.parseData(json);
			me.isLoaded = true;
			me.render();
			
			var e = new ia.Event(ia.Event.LAYER_READY, me);
			me.dispatchEvent(e);


   			if (callback != undefined) callback.call(null); // return.
		}
	});
};

/** 
 * Parses the data after its completed loading.
 *
 * @method parseData
 * @param {JSON} data The raw data. 
 */
ia.FeatureLayer.prototype.parseData = function(data)
{
	// This is all written for optimization - touch at your peril.
	this.items = {};
	this.itemArray = [];

	if (data.e != undefined) this.eval = false;
	if (data.uid != undefined) this.uid = data.uid;

	// This is the bBox that is used to adjust the layer coords and not the true bBox of the layer.
	var bb = data.boundingBox.split(" ");
	var bBox = new ia.BoundingBox(parseFloat(bb[0]),parseFloat(bb[1]),parseFloat(bb[2]),parseFloat(bb[3]));  

	var bx = bBox.getXMin();
	var by = bBox.getYMin();
	var bw = bBox.getWidth();
	var bh = bBox.getHeight();
	
	// Used to transform coordinates.
	var pixelWidth = parseFloat(data.pixelWidth);  
	var pixelHeight = parseFloat(data.pixelHeight);  
	
	var layerMinX = Infinity, layerMinY = Infinity, layerMaxX = -Infinity, layerMaxY = -Infinity;
	
	// JSON changes.
	// id > d
	// name > n
	// coords > p

	// Iterate through map features.
	var fLength = data.features.length;
	
	for (var i = 0; i < fLength; i++) 		
	{
		var feature = data.features[i];
	
		var item = {};
		item.state = ia.ItemLayer.UNSELECTED;
		item.layer = this;
		item.id = feature.d;
		item.name = feature.n;
		item.parent = this;
		item.symbolSize = this.symbolSize;
		if (this.geometry == "line") item.symbolSize =  this.style.lineWidth;
		
		if (this.geometry == "polygon" || this.geometry == "line") 
		{
			var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		
			// Iterate through all polygons in this feature.
			var pLength = feature.p.length;
			var shapes = new Array();		

			for (var j = 0; j < pLength; j++) 	
			{
				var coords = feature.p[j];
				var cLength = coords.length - 1;	

				var shape = new Array();			
				var cx = 0;
				var cy = 0;

				// Iterate through all points in this polygon.
				for (var k = 0; k < cLength; k+=2) 
				{
					var p = new Object()
					cx = cx + coords[k];
					cy = cy + coords[k+1];
					p.x = bx + ((cx / pixelWidth) * bw);
					p.y = by + ((cy / pixelHeight) * bh);
					shape.push(p);

					// Calculation to find bBox of item.
					minX = (p.x < minX) ? p.x : minX;
					minY = (p.y < minY) ? p.y : minY;
					maxX = (p.x > maxX) ? p.x : maxX;                       
					maxY = (p.y > maxY) ? p.y : maxY;
				}
				shapes.push(shape);
			}
			item.shapes = shapes;

			//if (this.showLabels)
			//{
				// Get the center of gravity which can be used for labelling.
				var largestShape = this._getLargestItemShape(item);
				item.centerOfGravity = this._getCenterOfGravity(largestShape);
			//}
		}
		else 
		{
			// Convert each point back to real coords.
			var p = new Object();
			p.x = bx + ((feature.p[0] / pixelWidth) * bw);
			p.y = by + ((feature.p[1] / pixelHeight) * bh);
		
			// Calculation to find bBox of item.
			minX = p.x;
			minY = p.y;
			maxX = p.x;                       
			maxY = p.y;
			
			item.shapes = [p];
		}
		
		// Set the calculated item bBox.
		item.bBox = new ia.BoundingBox(minX, minY, maxX, maxY);
		item.size = Math.max(item.bBox.getWidth(), item.bBox.getHeight());
		this.items[item.id] = item;
		this.itemArray.push(item);

		// Calculation to find bBox of layer.
		layerMinX = (minX < layerMinX) ? minX : layerMinX;
		layerMinY = (minY < layerMinY) ? minY : layerMinY;
		layerMaxX = (maxX > layerMaxX) ? maxX : layerMaxX;                       
		layerMaxY = (maxY > layerMaxY) ? maxY : layerMaxY;
	}
	
	// Set the real layer bBox.
	this.bBox = new ia.BoundingBox(layerMinX, layerMinY, layerMaxX, layerMaxY);  
	
	// Check if layer uses an icon.
	if (this.iconPath != "")
	{
		var me = this;
		this.icon = new Image();
		this.icon.onload = function()  {me.render();};
		this.icon.src = this.iconPath;
	}
};

/** 
 * Returns the largest shape for an item.
 *
 * @method _getLargestItemShape
 * @param {Object[]} pts The points {x:x, y:y}.
 * @private
 */
ia.FeatureLayer.prototype._getLargestItemShape = function(item) 
{
	// Label centroid.
	var nShapes = item.shapes.length;
	var largestArea = 0;
	var largestShape = item.shapes[0];

	for (var j = 0; j < nShapes; j++) 
	{
		var shape = item.shapes[j];
		var area = this._getArea(shape);
		if (area > largestArea)
		{
			largestArea = area;
			largestShape = shape;
		}
	}

	return largestShape;
};

/** 
 * Returns the area of an array of point objects {x:x, y:y} that make up a poly.
 *
 * @method _getArea
 * @param {Object[]} pts The points {x:x, y:y}.
 * @return {Number} The area.
 * @private
 */
ia.FeatureLayer.prototype._getArea = function(pts) 
{
	// http://paulbourke.net/geometry/polygonmesh/
	var area = 0;
	var nPts = pts.length;
	var k = nPts - 1;
	var p1; 
	var p2;

	for (var i = 0; i < nPts; k = i++) 
	{
		p1 = pts[i]; 
		p2 = pts[k];
		area += p1.x * p2.y;
		area -= p1.y * p2.x;
	}

	area/=2;
	return area;
};

/** 
 * Returns the center of gravity of an array of point objects {x:x, y:y} that make up a poly.
 *
 * @method _getCenterOfGravity
 * @param {Object[]} pts The points {x:x, y:y}.
 * @return {Object} A point {x:x, y:y}.
 * @private
 */
ia.FeatureLayer.prototype._getCenterOfGravity = function(pts) 
{
	// http://paulbourke.net/geometry/polygonmesh/

	var nPts = pts.length;
	var x = 0; 
	var y = 0;
	var f;
	var j = nPts-1;
	var p1; 
	var p2;

	for (var i = 0; i < nPts; j = i++) 
	{
		p1 = pts[i]; 
		p2 = pts[j];
		f = p1.x * p2.y - p2.x * p1.y;
		x += (p1.x + p2.x) * f;
		y += (p1.y + p2.y) * f;
	}

	f = this._getArea(pts) * 6;
	return {x:x/f, y:y/f};
};

/** 
 * Renders the layer. Keep this simple so that it can be overridden but
 * we can still use the draw method defined below.
 *
 * @method render
 */
ia.FeatureLayer.prototype.render = function() 
{
	if (this.map && this.getVisible() && this.isLoaded)
	{
		this.clear();
		this.draw();
	};
};

ia.FeatureLayer.prototype.draw = function() 
{
	this.debounceDraw();
};

/** 
 * Draws the layer.
 *
 * @method draw
 */
ia.FeatureLayer.prototype._draw = function() 
{
	// Dont bother drawing if the bBox isnt set or the layer isnt visible.
	if (this.map && this.getVisible() && this.isLoaded)
	{
		// Reset the context styles in case the layer styles has changed.
		for (var p in this.style) 
		{
			this.context[p] = this.style[p];
			if (this.interactive || this.highlightable)
			{
				if (this.selectionContext) this.selectionContext[p] = this.style[p];
				if (this.highlightContext) this.highlightContext[p] = this.style[p];
			}
		} 
		
		if (this.interactive || this.highlightable)
		{
			if (this.selectionContext) 
			{
				this.selectionContext.strokeStyle = this.selectionColor;
				this.selectionContext.fillStyle = ia.Color.toRGBA(this.selectionColor, this.selectionOpacity);
				this.selectionContext.lineWidth = Math.max(2, parseFloat(this.style.lineWidth) + 1.5);
			}
			if (this.highlightContext) 
			{
				this.highlightContext.strokeStyle = ia.Color.toRGBA(this.highlightColor, 0.8);
				this.highlightContext.fillStyle = ia.Color.toRGBA(this.highlightColor, this.highlightOpacity);
				this.highlightContext.lineWidth = Math.max(2, parseFloat(this.style.lineWidth) + 1.5);
			}
		}
	
		// Get the data.
		var data = this.getData();

		// Dont bother drawing if its outside the map bBox.
		var mapBBox = this.map.getBBox();
		//if (this.bBox.intersects(mapBBox))	
		//{
			// Check display extent for labelling.
			var withinExtents = false;
			var minExtent = Math.min(mapBBox.getWidth(), mapBBox.getHeight());
			var maxExtent = Math.max(mapBBox.getWidth(), mapBBox.getHeight());
			if ((minExtent >= this.minLabelExtent) && (maxExtent <= this.maxLabelExtent)) withinExtents = true;
			
			var n = this.itemArray.length;
			for (var i = 0; i < n; i++) 
			{
				var item = this.itemArray[i];
				
				// Update data if needed.
				if (this.dataChanged)
				{
					var dataItem = data[item.id];
					if (dataItem)
					{
						item.name = dataItem.name;
						item.disabled = false;
						var alpha = ia.Color.a(this.style.fillStyle);
						if (dataItem.color) item.color = ia.Color.toRGBA(dataItem.color, alpha);
						item.symbolSize = dataItem.symbolSize;
					}
					else 
					{
						item.disabled = true;
						item.color = this.style.fillStyle;
						item.symbolSize = 0;
					}
				}	

				if (this.geometry != "point")
				{
					if (item.bBox && item.bBox.intersects(mapBBox))   
					{
						this.renderItem(item);
						if (this.showLabels && withinExtents) this.renderItemLabel(item);
					}
				}
			}

			// Points get rendered after theyve been sorted by symbol size
			if (this.geometry == "point") 
			{
				if (this.thematic && this.thematic.heatmap) 	this._drawHeatmap(data, mapBBox, withinExtents);
				else  											this._drawPoints(data, mapBBox, withinExtents);

			}

			if (this.dataChanged) this.dataChanged = false;
		//}
		
		// Render selection.
		this.renderSelection();
	}
};

/** 
 * Draws the points.
 *
 * @method _drawPoints
 * @private
 */
ia.FeatureLayer.prototype._drawPoints = function(data, mapBBox, withinExtents) 
{
	var dir = -1;
	this.itemArray.sort(function(a, b)
	{
		if (a.symbolSize < b.symbolSize) return -dir;
		if (a.symbolSize > b.symbolSize) return dir;
		return 0; 
	});
	var n = this.itemArray.length;
	for (var i = 0; i < n; i++) 
	{
		var item = this.itemArray[i];
		if (item.bBox && item.bBox.intersects(mapBBox) && (item.symbolSize > 0  || this.displayLabelsOnly))   
		{
			this.renderItem(item);
			if (this.showLabels && withinExtents) this.renderItemLabel(item);
		}
	}
};

/** 
 * Draws the heatmap.
 *
 * @method _drawHeatmap
 * @private
 */
ia.FeatureLayer.prototype._drawHeatmap = function(data, mapBBox, withinExtents) 
{
	if (typeof h337 !== 'undefined')
	{
		if (this._heatmap == undefined) this._heatmap = h337.create({canvas: this.canvas});

		var r = this.symbolSize / 2;

		/*var fw = this.map.controller.defaultBBox.getWidth();
		var w = this.map.getBBox().getWidth();
		r = (fw / w) * r;

		var rMin = 1;
		var rMax = this.map.canvasWidth;
		r = Math.max(r, rMin);
		r = Math.min(r, rMax);*/

		// Heat map radius defined in real world map coords.
		var heatmapradius = this.thematic.heatmapradius;
		if (heatmapradius != undefined && ia.isNumber(heatmapradius)) 
		{
			r = this.map.getPixelWidth(heatmapradius);
			r = Math.max(r, 1);
			r = Math.min(r, this.map.canvasWidth);
		}

		// Loop through data points to get pixel positions.
	    var minValue = Infinity;
	    var maxValue = -Infinity;
	    var arrPoints = [];

	    var n = this.itemArray.length;
	    for (var i = 0; i < n; i++) 
	    {
	        var item = this.itemArray[i];
	        var dataItem = data[item.id]

	        var nShapes = item.shapes.length;
	        for (var j = 0; j < nShapes; j++) 
	        {
	            if (dataItem != undefined) 
	            {
	                var coords = item.shapes[j];
	                var px = this.map.getPixelX(coords.x);
	                var py = this.map.getPixelY(coords.y);
	                var value = dataItem[this.dataField];

	                if (ia.isNumber(value))
	                {
	                    minValue = Math.min(minValue, value);
	                    maxValue = Math.max(maxValue, value);
	                    arrPoints.push({x: px, y: py, value: value, radius:r});
	                    //arrPoints.push({x: px, y: py, value: value});
	                }
	            }
	        }

	        if (this.showLabels && withinExtents) this.renderItemLabel(item);
	    }

	    // Color gradient.
	    var colorList = this.thematic.numericClassifier.colorPalette.getColorList();
	    var n = colorList.length;
	    var oGradient = {};
	    for (var i = 0; i < n; i++) 
	    {
	        pos = i / (n-1);
	        oGradient[pos] = colorList[i];
	    }

	    // Build heat map.
		this._heatmap._renderer.setDimensions(this.map.canvasWidth, this.map.canvasHeight);
	    this._heatmap.configure({gradient: oGradient});
	    this._heatmap.setData(
	    {
	        max:maxValue,
	        min:minValue,
	        data: arrPoints
	    });
	}
};

/**
 * Selects the item.
 *
 * @method selectItem
 * @param {Object} item The item.
 */
ia.FeatureLayer.prototype.selectItem = function(item) 
{
	this._drawItem(item, this.selectionContext);
};

/**
 * Highlights the item.
 *
 * @method highlightItem
 * @param {Object} item The item.
 */
ia.FeatureLayer.prototype.highlightItem = function(item) 
{
	this._drawItem(item, this.highlightContext);
};

/**
 * Renders the item to the given context.
 *
 * @method renderItem
 * @param {Object} item The item.
 */
ia.FeatureLayer.prototype.renderItem = function(item)
{
	if (item != undefined && this.renderDisabledFeatures == true || item.disabled == false)
	{
		if (!this.displayLabelsOnly)
		{
			if (item.color) 
			{
				this.context.fillStyle = item.color;
				if (this.geometry == "line") this.context.strokeStyle = item.color;
			}
			this._drawItem(item, this.context);
		}
	}
};

/**
 * Does the actual drawing.
 *
 * @method _drawItem
 * @param {Object} item The item.
 * @param {HTML Canvas Context} ctx The context to render to.
 * @private
 */
ia.FeatureLayer.prototype._drawItem = function(item, ctx)
{
	if (item != undefined && this.getVisible() && ctx && !this.displayLabelsOnly)
	{
		ctx.beginPath();

			var nShapes = item.shapes.length;

			// Draw polygons.
			if (this.geometry == "polygon")
			{
				for (var j = 0; j < nShapes; j++) 
				{
					var coords = item.shapes[j];
					var nCoords = coords.length;

					ctx.moveTo(this.map.getPixelX(coords[0].x), this.map.getPixelY(coords[0].y));
					for (var i = 1; i < nCoords; i++) 
					{
						ctx.lineTo(this.map.getPixelX(coords[i].x), this.map.getPixelY(coords[i].y));
					}
				}
			}
			// Draw points.
			else if (this.geometry == "point")
			{
				for (var j = 0; j < nShapes; j++) 
				{
					var coords = item.shapes[j];
					var px = this.map.getPixelX(coords.x);
					var py = this.map.getPixelY(coords.y);

					if (this.thematic && this.thematic.heatmap)
                		ia.Shape.draw(this.symbol, ctx, px, py, 15);
					else if (this.icon != undefined) 
						ctx.drawImage(this.icon, (px - (this.icon.width/2)), (py - (this.icon.height/2)), this.icon.width, this.icon.height);
					else if (this.type == 'contextual-layer') 
						ia.Shape.draw(this.symbol, ctx, px, py, this.symbolSize);
					else if (item.symbolSize > 0  || this.displayLabelsOnly) 
						ia.Shape.draw(this.symbol, ctx, px, py, item.symbolSize);
				}
			}
			// Draw lines.
			else if (this.geometry == "line")
			{
				if (item.symbolSize > 0  || this.displayLabelsOnly) 
				{
					for (var j = 0; j < nShapes; j++) 
					{
						var coords = item.shapes[j];
						var nCoords = coords.length;

						ctx.moveTo(this.map.getPixelX(coords[0].x), this.map.getPixelY(coords[0].y));
						for (var i = 1; i < nCoords; i++) 
						{
							ctx.lineTo(this.map.getPixelX(coords[i].x), this.map.getPixelY(coords[i].y));
						}
					}
					ctx.lineWidth = item.symbolSize;
				}
			}

		if (this.geometry != "line") ctx.fill();
		ctx.stroke();
	}
};

/**
 * Renders the item label.
 *
 * @method renderItemLabel
 * @param {Object} item The item.
 */
ia.FeatureLayer.prototype.renderItemLabel = function(item)
{	
	// Check the label canvas has been added.
	if (this.labelCanvas == undefined) this.addLabelCanvas();

	var label = item.name;
	if (this.labelFunction != undefined) label = this.labelFunction.call(null, item); // Custom labelling.

	var x, y;
	if (this.geometry == 'polygon')
	{
		if (item.centerOfGravity)
		{
			x = this.map.getPixelX(item.centerOfGravity.x);
			y = this.map.getPixelY(item.centerOfGravity.y);
		}
		else
		{
			x = this.map.getPixelX(item.bBox.getXCenter());
			y = this.map.getPixelY(item.bBox.getYCenter());
		}
		this.labelContext.textBaseline = 'middle';
		this.labelContext.textAlign = 'center';
	}
	else
	{
		x = this.map.getPixelX(item.bBox.getXCenter());
		y = this.map.getPixelY(item.bBox.getYCenter());

		var symbolSize = item.symbolSize;
		if (this.type == 'contextual-layer') symbolSize = this.symbolSize;
	
		if (this.icon) symbolSize = this.icon.width;

		if (this.labelPosition.indexOf('left') != -1)
		{
			this.labelContext.textAlign = 'right';
			x = x - (symbolSize / 2);
		}
		else if (this.labelPosition.indexOf('right') != -1)
		{
			this.labelContext.textAlign = 'left';
			x = x + (symbolSize / 2);
		}
		else
		{
			this.labelContext.textAlign = 'center';
		}

		if (this.labelPosition.indexOf('top') != -1)
		{
			this.labelContext.textBaseline = 'bottom';
			y = y - (symbolSize / 2);
		}
		else if (this.labelPosition.indexOf('bottom') != -1)
		{
			this.labelContext.textBaseline = 'top';
			y = y + (symbolSize / 2);
		}
		else
		{
			this.labelContext.textBaseline = 'middle';
		}

		var padding = 5;
		if (this.labelPosition == 'left') 	x -= padding;
		if (this.labelPosition == 'right') 	x += padding;
	}

	this.labelContext.strokeText(label, x, y);
	this.labelContext.fillText(label, x, y);
};

//--------------------------------------------------------------------------
//
// Hit Test Methods
//
//--------------------------------------------------------------------------
	
/**
 * Runs a hit test on shapes. 
 * 
 * @method hitItem
 * @param {Object} item The item to hit test.
 * @param {ia.MapMouseEvent} event An <code>ia.MapMouseEvent</code>.
 */
ia.FeatureLayer.prototype.hitItem = function(item, event)
{
	// Convert to data coords.
	var pointX = event.dataX;
	var pointY = event.dataY;
	
	if (this.geometry == "point")
	{
		var points = item.shapes;
		var coords;

		for (var i = 0; i < points.length; i++) 
		{
			coords = points[i];    
			
			var isHit;
			if (this.thematic && this.thematic.heatmap) 	
				isHit = this._pointInRect(15, 15, coords, pointX, pointY);
			else if (this.iconPath != "")
				isHit = this._pointInRect(this.icon.width, this.icon.height, coords, pointX, pointY);
			else
				isHit = this._pointInRect(item.symbolSize, item.symbolSize, coords, pointX, pointY);

			if (isHit) return true;
		}
	}
	else if (this.geometry == "polygon")
	{
		// Test bBox of item first.
		if (item.bBox)
		{
			if ((pointX < item.bBox.left()) || (pointX > item.bBox.right())) return false;
			else if ((pointY > item.bBox.top()) || (pointY < item.bBox.bottom())) return false;
		}

		var polys = item.shapes;

		for (var i = 0; i < polys.length; i++) 
		{
			var isHit = this._pointInPoly(polys[i], pointX, pointY);
			if (isHit) return true;
		}
	}
	else if (this.geometry == "line")
	{
		// Test bBox of item first.
		if (item.bBox)
		{
			if ((pointX < item.bBox.left()) || (pointX > item.bBox.right())) return false;
			else if ((pointY > item.bBox.top()) || (pointY < item.bBox.bottom())) return false;
		}
		
		var lines = item.shapes;

		for (var i = 0; i < lines.length; i++) 
		{
			var isHit = this._pointInLine(lines[i], event.x, event.y);
			if (isHit) return true;
		}
	}

	return false;
};

/** 
 * Query if a point lies completely within a polygon.
 *
 * @method _pointInLine
 * @param {Number[]} coords The coords to hit test.
 * @param {Number} pointX The pixel x coordinate of the test point.
 * @param {Number} pointY The pixel y coordinate of the test point.
 * @private
 */
ia.FeatureLayer.prototype._pointInLine = function(coords, pointX, pointY)
{
	var buffer = 4;
	var r = new ia.Rectangle(pointX - buffer, pointY - buffer, (buffer*2), (buffer*2))
	
	var n = coords.length;
	for (var i = 0; i < n - 1; i++) 
	{
		var x1 = this.map.getPixelX(coords[i].x);
		var y1 = this.map.getPixelY(coords[i].y);
		var x2 = this.map.getPixelX(coords[i+1].x);
		var y2 = this.map.getPixelY(coords[i+1].y);
		if (r.intersectsLine({x:x1,y:y1}, {x:x2,y:y2})) return true;
	}
	return false;
};

/** 
 * Query if a point lies completely within a polygon.
 *
 * @method _pointInPoly
 * @param {Number[]} coords The coords to hit test.
 * @param {Number} pointX The x coordinate of the test point.
 * @param {Number} pointY The y coordinate of the test point.
 * @private
 */
ia.FeatureLayer.prototype._pointInPoly = function(coords, pointX, pointY)
{
	var i, j, c = 0;
	for (i = 0, j = coords.length - 1; i < coords.length; j = i++)
	{
		if (((coords[i].y > pointY) != (coords[j].y > pointY)) && (pointX < (coords[j].x - coords[i].x) * (pointY - coords[i].y) / (coords[j].y - coords[i].y) + coords[i].x))
		{
			c = !c;
		}
	}
	return c;
};

/** 
 * Query if a point lies completely within a shape.
 *
 * @method _pointInRect
 * @param {Number} symbolWidth The symbol width.
 * @param {Number} symbolHeight The symbol height.
 * @param {Number[]} coords The coords to hit test.
 * @param {Number} pointX The x coordinate of the test point.
 * @param {Number} pointY The y coordinate of the test point.
 * @private
 */
ia.FeatureLayer.prototype._pointInRect = function(symbolWidth, symbolHeight, coords, pointX, pointY)
{
	// Now test the polygon.
	var x = coords.x;
	var y = coords.y;
	
	var w = this.map.getDataWidth(symbolWidth);
	var h = this.map.getDataHeight(symbolHeight);
	
	var x1 = x - (w/2);
	var x2 = x + (w/2);
	var y1 = y - (h/2);
	var y2 = y + (h/2);
	
	if (pointX >= x1 &&  pointX <= x2 && pointY >= y1 &&  pointY <= y2) return true
	
	return false;
};

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.FeatureLayer.prototype.showTip = function(item, event)
{
	this.map.datatip.text(this.tipFunction(item));
	var px, py;

	if (ia.IS_TOUCH_DEVICE)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		if (this.geometry == "point")
		{
			px = this.map.getPixelX(item.bBox.getXCenter()) + item.symbolSize / 2;
			py = this.map.getPixelY(item.bBox.getYCenter()) - item.symbolSize / 2 - this.map.datatip.getHeight();
		}
		else		
		{
			px = event.x + 10;
			py = event.y - this.map.datatip.getHeight();
		}
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};