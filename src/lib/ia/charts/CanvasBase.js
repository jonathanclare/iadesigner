/**
 * <code>ia.CanvasBase</code> defines the basic layout behavior of chart or map.
 *
 * @author J Clare
 * @class ia.CanvasBase
 * @extends ia.CartesianSpace
 * @constructor
 * @param {String} id The id.
 */
ia.CanvasBase = function(id)
{
	ia.CanvasBase.baseConstructor.call(this, 0, 0, 100, 100);

	this._touchStart = 0;		// Timing of touch start.
	this._mouseDown = false; 	// Flag to indicate if the mouse is down. Used by the _mouseEventHandler() method.
	this._dragging = false;		// Flag to indicate if the mouse is being dragged. Used by the _mouseEventHandler() method.
	this._mouseDragged = false;	// Flag to indicate that the mouse was dragged. Used by the _mouseEventHandler() method.
	this._mouseOverMap = false;	// Flag to indicate if the mouse is over the map. Used by the _mouseEventHandler() method.
	this._pinching = false;		// Flag to indicate if the user is this._pinching the map. Used by the _mouseEventHandler() method.
	this._layers = new Array(); // Contains the map layers.
	this._mouseDownX = 0;		// Use these to test if the mouse has been dragged.
	this._mouseDownY = 0;

	this.id = id;
	this.isVisible = true;
	this.mouseX = 0;
	this.mouseY = 0;
	this.embeddedInGoogleMaps = false; 
	this.isDraggable = false;
	this.animationMode = false;

	// Create the container element.
	this.container = $j("<div id='"+id+"' class='ia-chart'>"); 

	this.mapContainer = $j("<div id='mapContainer'>"); 
	this.backgroundContainer = $j("<div id='backgroundContainer'>");
	this.layerContainer = $j("<div id='layercontainer'>")
	this.foregroundContainer = $j("<div id='foregroundContainer'>");
	
	this.mapContainer.append(this.backgroundContainer);
	this.mapContainer.append(this.layerContainer);
	this.mapContainer.append(this.foregroundContainer);
	this.container.append(this.mapContainer);

	// For styling map labels.
	this.labelStyle = $j("<div class='ia-map-labels' style='visibility:hidden'>");
	this.mapContainer.append(this.labelStyle);	
	
	this.canvas = this._createCanvas(this.backgroundContainer);
	this.context = this.canvas.getContext("2d");

	this.foregroundCanvas = this._createCanvas(this.foregroundContainer);
	this.foregroundContext = this.foregroundCanvas.getContext("2d");

	this.datatip = new ia.ChartTip(this.foregroundContainer);
	
	// Add listeners.
	this._addListeners();
	
	// Redraw the map on a resize - use a timeout to reduce number of redraws.
	var resizeTimeout;
	var mapReady = false;
	var me = this;
	this.container.resize(function(e) 
	{		
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function()
		{
			clearTimeout(resizeTimeout);

			var w = me.container.width();
			var h = me.container.height();
			
			me.foregroundContainer.width(w);
			me.foregroundContainer.height(h);
						
			me.canvas.width = w;
			me.canvas.height = h;

			me.foregroundCanvas.width = w;
			me.foregroundCanvas.height = h;

			me.canvasX = 0;
			me.canvasY = 0;
			me.canvasWidth = w;
			me.canvasHeight = h;
			
			var e = new ia.Event(ia.Event.MAP_RESIZE, me);
			me.dispatchEvent(e);

			if (me.maintainAspectRatio && me.originalBBox != undefined)
			{
				me.bBox.setXMin(me.originalBBox.xMin);
				me.bBox.setYMin(me.originalBBox.yMin);
				me.bBox.setXMax(me.originalBBox.xMax);
				me.bBox.setYMax(me.originalBBox.yMax);
			}
			
			me.commitChanges();

			if (mapReady == false)
			{
				mapReady = true;
				var e = new ia.Event(ia.Event.MAP_READY, me);
				me.dispatchEvent(e);
			}

		}, 500);
	}.bind(this));
};
ia.extend(ia.CartesianSpace, ia.CanvasBase);

/**
 * Animation mode.
 *
 * @property animationMode
 * @type Boolean
 * @default false
 */
ia.CanvasBase.prototype.animationMode;

/**
 * The id.
 * 
 * @property id
 * @type String
 */
ia.CanvasBase.prototype.id;

/**
 * The canvas.
 * 
 * @property canvas
 * @type HTML Canvas
 */
ia.CanvasBase.prototype.canvas;

/**
 * The canvas context.
 * 
 * @property context
 * @type HTML Canvas Context
 */
ia.CanvasBase.prototype.context;

/**
 * The foreground canvas for drawing elements on top of the map/chart.
 * 
 * @property canvas
 * @type HTML Canvas
 */
ia.CanvasBase.prototype.foregroundCanvas;

/**
 * The foreground context for drawing elements on top of the map/chart.
 * 
 * @property context
 * @type HTML Canvas Context
 */
ia.CanvasBase.prototype.foregroundContext;

/**
 * The data tip.
 * 
 * @property datatip
 * @type ia.ChartTip
 */
ia.CanvasBase.prototype.datatip;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.CanvasBase.prototype.container;

/**
 * The container that holds all the divs.
 * 
 * @property mapContainer
 * @type JQUERY Element
 */
ia.CanvasBase.prototype.mapContainer; 

/**
 * Containers the map canvas.
 * 
 * @property backgroundContainer
 * @type JQUERY Element
 */
ia.CanvasBase.prototype.backgroundContainer; 

/**
 * The container that holds the layers.
 * 
 * @property layerContainer
 * @type JQUERY Element
 */
ia.CanvasBase.prototype.layerContainer; 

/**
 * Containers selection / highlight canvas.
 * 
 * @property foregroundContainer
 * @type JQUERY Element
 */
ia.CanvasBase.prototype.foregroundContainer; 

/**
 * The chart visibility.
 * 
 * @property isVisible
 * @type Boolean
 * @default true
 */
ia.CanvasBase.prototype.isVisible;

/** 
 * The x coordinate of the mouse (pixel units) relative to the map origin.
 * 
 * @property mouseX
 * @type Number
 * @default 0
 */
ia.CanvasBase.prototype.mouseX;

/** 
 * The y coordinate of the mouse (pixel units) relative to the map origin.
 * 
 * @property mouseY
 * @type Number
 * @default 0
 */
ia.CanvasBase.prototype.mouseY;

/**
 * Indicates if embedded in google maps.
 * 
 * @property embeddedInGoogleMaps
 * @type Boolean
 * @default false
 */
ia.CanvasBase.prototype.embeddedInGoogleMaps; 

/**
 * Indicates if its draggable ie Its a map - used by touch events.
 * 
 * @property isDraggable
 * @type Boolean
 * @default false
 */
ia.CanvasBase.prototype.isDraggable;

/** 
 * Creates a new canvas.
 *
 * @method _createCanvas
 * @return {HTML Canvas} The canvas.
 * @private
 */
ia.CanvasBase.prototype._createCanvas = function(container)
{
	var canvas = document.createElement('canvas');
	canvas.width = container.width();
	canvas.height = container.height();
	$j(canvas).css({ position: 'absolute', left: 0, top: 0 });
	container.append($j(canvas));
	return canvas;
};

/** 
 * Adds the listeners.
 *
 * @method _addListeners
 * @private
 */
ia.CanvasBase.prototype._addListeners = function()
{
	// Add touch listeners.
	this.mapContainer.on("touchstart.canvasbase touchmove.canvasbase touchend.canvasbase", this._touchEventHandler.bind(this));

	// Add mouse listeners.
	this.mapContainer.on("mousemove.canvasbase mouseup.canvasbase mouseenter.canvasbase mouseleave.canvasbase mousedown.canvasbase click.canvasbase", this._mouseEventHandler.bind(this)); 

	// FF doesn't recognize mousewheel as of FF3.x.
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

	// Mouse wheel for all other browsers.
	if(document.addEventListener) document.addEventListener(mousewheelevt, this._mouseEventHandler.bind(this), false);
};

/**
 * Responsible for handling mouse events and then
 * dispatching the relevant map event. 
 * 
 * @method _mouseEventHandler
 * @param {MouseEvent} event Dispatched by the mouse.
 * @private
 */
ia.CanvasBase.prototype._mouseEventHandler = function(event)
{
	// Check if parent panel is visible.
	var isPanelVisible = true;
	var parentPanel = $j("#widget-"+this.id);
	if (parentPanel)
	{
		if (parentPanel.css("visibility") == "hidden") isPanelVisible = false;
	}

	if (this.isVisible && isPanelVisible)
	{
		var eventType;
	
		// Set the map mouse coords.
		this.mouseX = event.pageX - this.container.offset().left;
		this.mouseY = event.pageY - this.container.offset().top;
			
		// Check if mouse is over the map.
		// this handles when the map is resized and cusrsor is
		// on the map but an enter event wasnt fired.
		/*if ((this.mouseX > this.canvasX && this.mouseX < (this.canvasX + this.canvasWidth))
		&& (this.mouseY >  this.canvasY && this.mouseY < (this.canvasY + this.canvasHeight)))
		{
			this._mouseOverMap = true;
		}
		else
		{
			this._mouseOverMap = false;
		}*/

		// Mouse event logic.
		if (event.type == "mouseenter") 
		{
			eventType = ia.MapMouseEvent.MAP_MOUSE_OVER;
			if (this._dragging) $j(document).off(".canvasbasedoc");
			this._mouseOverMap = true;
		}
		else if (event.type == "mouseleave") 
		{	
			eventType = ia.MapMouseEvent.MAP_MOUSE_OUT;
			if (this._dragging) $j(document).on("mousemove.canvasbasedoc mouseup.canvasbasedoc",  this._mouseEventHandler.bind(this));
			this._mouseOverMap = false;
		}
		else if (event.type == "mousemove")
		{
			this._mouseOverMap = true;
			
			// If the mouse was held down and moved over the map it
			// becomes a ia.MapMouseEvent.MAP_MOUSE_DRAG event, otherwise its a ia.MapMouseEvent.MAP_MOUSE_MOVE  
			// event, as long as the mouse is over the map.
			// A ia.MapMouseEvent.MAP_MOUSE_DRAG event can continue after the mouse is 
			// dragged outside the map.

			if (this._mouseDown && (this._mouseDownX != event.pageX || this._mouseDownY != event.pageY))
			{
				eventType = ia.MapMouseEvent.MAP_MOUSE_DRAG;
				this._dragging = true;
			}
			else if (this._mouseOverMap)
			{
				eventType = ia.MapMouseEvent.MAP_MOUSE_MOVE;
			}
		}
		else if (event.type == "mouseup") 
		{
			if (this._dragging)
			{
				eventType = ia.MapMouseEvent.MAP_MOUSE_DRAG_UP;
				$j(document).off(".canvasbasedoc");
				this._dragging = false;
				this._mouseDragged = true;
			}
			else if (this._mouseOverMap) eventType = ia.MapMouseEvent.MAP_MOUSE_UP;
			this._mouseDown = false;
		}
		else if (event.type == "mousedown") 
		{			 
			eventType = ia.MapMouseEvent.MAP_MOUSE_DOWN;

			this._mouseDownX = event.pageX;
			this._mouseDownY = event.pageY;

			this._mouseDragged = false;
			this._mouseDown = true;
		}
		else if (event.type == "mousewheel" 
			|| event.type == "onmousewheel"
			|| event.type == "DOMMouseScroll") 
		{
			if (this._mouseOverMap && this.isDraggable) event.preventDefault();
			eventType = ia.MapMouseEvent.MAP_MOUSE_WHEEL;
		}
		else if (event.type == "click") 
		{
			if (this._mouseDragged == false) eventType = ia.MapMouseEvent.MAP_MOUSE_CLICK;

			// Fix for when google maps stops propagation of events during this._dragging.
			this._dragging = false;
			this._mouseDown = false;
			this._mouseDragged = false;
		}

		if (eventType != null)
		{	
			var dataX = this.getDataX(this.mouseX);
			var dataY = this.getDataY(this.mouseY);
			var e = new ia.MapMouseEvent(this, event, eventType, dataX, dataY, this.mouseX, this.mouseY, undefined, undefined, event.pageX, event.pageY);
			this.dispatchEvent(e);
		}
	}
};

/**
 * Responsible for handling touch events and then
 * dispatching the relevant map event. 
 * 
 * @method _touchEventHandler
 * @param {TouchEvent} event Dispatched by the mouse.
 * @private
 */
ia.CanvasBase.prototype._touchEventHandler = function(event)
{ 
	if (this.isVisible)
	{
		//event.stopPropagation();
		event.preventDefault();

		var eventType;
		if (!this.embeddedInGoogleMaps && this.isDraggable) event.preventDefault();

		var mx,my,mx2,my2;

		if (event.originalEvent.touches.length > 1)
		{
			var touch = event.originalEvent.touches[0];
			var touch2 = event.originalEvent.touches[1];

			mx = touch.pageX - this.container.offset().left;
			my = touch.pageY - this.container.offset().top;
			mx2 = touch2.pageX - this.container.offset().left;
			my2 = touch2.pageY - this.container.offset().top;

			if (this.isDraggable && this._dragging)
			{
				eventType = ia.MapMouseEvent.MAP_MOUSE_DRAG_UP;
				this._DispatchMapMouseEvent(event, eventType, touch, mx, my, mx2, my2);
			} 
				
			this._dragging = false;
			this._pinching = true;

			if (event.type == "touchstart") 	eventType = ia.MapMouseEvent.MAP_PINCH_DOWN;
			else if (event.type == "touchmove") eventType = ia.MapMouseEvent.MAP_PINCH_MOVE;

			this._DispatchMapMouseEvent(event, eventType, touch, mx, my, mx2, my2);
		}	
		else
		{
			var touch = event.originalEvent.changedTouches[0];

			// Get the map mouse coords.
			mx = touch.pageX - this.container.offset().left;
			my = touch.pageY - this.container.offset().top;
			mx2 = null;
			my2 = null; 

			if (event.type == "touchstart") 
			{			 
				this._touchStart = new Date().getTime();
				eventType = ia.MapMouseEvent.MAP_MOUSE_DOWN;
			}
			else if (event.type == "touchmove")
			{
				// Reduce sensitivity, so we can have a mouse click.
				if (this.isDraggable)
				{
					eventType = ia.MapMouseEvent.MAP_MOUSE_DRAG;
					this._pinching = false;
					this._dragging = true;
				} 
				else eventType = ia.MapMouseEvent.MAP_MOUSE_MOVE;
			}
			else if (event.type == "touchend") 
			{
				var tEnd = new Date().getTime();
				var touchTime = tEnd - this._touchStart;

				if (this._pinching) 		eventType = ia.MapMouseEvent.MAP_PINCH_UP;
				else if (this._dragging)
				{
					if (this.isDraggable) 	eventType = ia.MapMouseEvent.MAP_MOUSE_DRAG_UP;
					else 					eventType = ia.MapMouseEvent.MAP_MOUSE_UP;
				}
				else if (touchTime < 500) 	eventType = ia.MapMouseEvent.MAP_MOUSE_CLICK;
				else 						eventType = ia.MapMouseEvent.MAP_MOUSE_UP;

				this._pinching = false;
				this._dragging = false;
			}

			this._DispatchMapMouseEvent(event, eventType, touch, mx, my, mx2, my2);
		}

		if (event.originalEvent.touches.length == 1 && event.type == "touchend") // Second finger still down after first finger lift.
		{
			eventType = ia.MapMouseEvent.MAP_MOUSE_DOWN;
			var touch = event.originalEvent.touches[0];
			mx = touch.pageX - this.container.offset().left;
			my = touch.pageY - this.container.offset().top;
			mx2 = null;
			my2 = null; 

			if (this.isDraggable) this._dragging = true; // We do this to stop it counting as a click.

			this._DispatchMapMouseEvent(event, eventType, touch, mx, my, mx2, my2);
		}
	}
};


/** 
 * Builds and dispatches an ia.MapMouseEvent.
 * 
 * @method _DispatchMapMouseEvent
 * @private
 */
ia.CanvasBase.prototype._DispatchMapMouseEvent = function(event, eventType, touch, mx, my, mx2, my2)  
{
	if (eventType != null)
	{	
		if (mx2 != null)
		{
			var xMin = Math.min(mx, mx2);
			var yMin = Math.min(my, my2);
			var xMax = Math.max(mx, mx2);
			var yMax = Math.max(my, my2);
			this.mouseX = (xMin + xMax) / 2;
			this.mouseY = (yMin + yMax) / 2;
		}
		else
		{
			this.mouseX = mx;
			this.mouseY = my;
		}
		var dataX = this.getDataX(this.mouseX);
		var dataY = this.getDataY(this.mouseY);
		var e = new ia.MapMouseEvent(this, event, eventType, dataX, dataY, mx, my, mx2, my2, touch.pageX, touch.pageX);
		this.dispatchEvent(e);
	}
};

/** 
 * Returns the cursor position in data units.
 * 
 * @method mouseCoords
 * @return {ia.Point} The cursor position (data units).
 */
ia.CanvasBase.prototype.mouseCoords = function()  
{
	var dataX = this.getDataX(this.mouseX);
	var dataY = this.getDataY(this.mouseY);
	var p = new ia.Point(dataX, dataY);
	return p;
};

/** 
 * Adds a copyright in the bottom-right corner on export.
 * 
 * @method setCopyright
 * @param {String} copyright copyright.
 */
ia.CanvasBase.prototype.setCopyright = function(copyright)
{
	this._copyright = copyright;
};

/** 
 * Adds a logo in the bottom-right corner on export.
 * 
 * @method addLogo
 * @param {String} src The url of the logo.
 */
ia.CanvasBase.prototype.addLogo = function(src)
{
	this._logo = new Image();
	this._logo.src = ia.getDomainSafeUrl(src);
};

/** 
 * Returns the data url for the chart.
 * 
 * @method exportData
 * @return {String} A data url.
 */
ia.CanvasBase.prototype.exportData = function(includeLogo)
{
	for (var i = 0; i < this._layers.length; i++) 
	{
		var layer = this._layers[i];

		if (layer.canvas && layer.exportable)
		{
			this.context.drawImage(layer.canvas,0,0);
			if (layer.selectionCanvas) this.context.drawImage(layer.selectionCanvas,0,0);
			if (layer.labelCanvas) this.context.drawImage(layer.labelCanvas,0,0);
		}
	}

	if (this._logo != undefined && includeLogo)
	{
		var w = this._logo.width;
		var h = this._logo.height;
		var x = this.canvas.width - w;
		var y = this.canvas.height - h;
		this.context.drawImage(this._logo, x, y);
	}

	if (this._copyright != undefined && this._copyright != '')
	{
		var axisFontStyle = "Verdana";
		var axisFontColor = "#AAAAAA";
		var axisFontSize = 10;

		var $copyright = $j("#map-copyright");
		if ($copyright.length)
		{
			if ($copyright.css("font-family")) axisFontStyle = $copyright.css("font-family");
			if ($copyright.css("color")) axisFontColor = ia.Color.toHex($copyright.css("color"));
			if ($copyright.css("font-size")) 
			{
				axisFontSize = $copyright.css("font-size");
				if (axisFontSize.indexOf("px") > -1) axisFontSize = axisFontSize.substring(0, axisFontSize.indexOf("px"));
				axisFontSize = ia.parseInt(axisFontSize);
			}
		}
		this.context.font = ""+axisFontSize+"px "+axisFontStyle;
		this.context.fillStyle = axisFontColor;

		var textLinePadding = 1;
		var labelPadding = 5;
		var textLineHeight = axisFontSize + (textLinePadding * 2);	
		var w = this.canvas.width - (labelPadding * 2);
		if (this._logo != undefined && includeLogo) w = w - this._logo.width;
		this._wrapText(this._copyright, labelPadding, this.canvas.height - labelPadding, w, textLineHeight, "bottom");
	}

	var dataURL = this.canvas.toDataURL("image/png")
	//window.open().document.write('<div style="font-family:Verdana;font-size:12px;color:#888888;">'+txt+'</div><p><img style="border-width:1px;border-style:solid;border-color:#DCDCDC;" src="'+dataURL+'"/></p>');
	
	this.clear();
	this.render();

	return dataURL;
};

/** 
 * Wraps text given the space available.
 *
 * @method _wrapText
 * @param {String} text The text.
 * @param {Number} x The x position of the text.
 * @param {Number} y The y position of the text
 * @param {Number} maxWidth The available width.
 * @param {Number} lineHeight The line height.
 * @param {String} textBaseline The middle, bottom or top - default is top.
 * @private
 */
ia.CanvasBase.prototype._wrapText = function(text, x, y, maxWidth, lineHeight, textBaseline) 
{
	// Split the text.
	var words = text.split(" ");
	var line = "";

	if (textBaseline == "middle" || textBaseline == "bottom")
	{
		var noLines = 0;

		// Get number of lines.
		for(var i = 0; i < words.length; i++) 
		{
			var word = words[i];

			var textLine;
			if (i == 0) textLine = word;
			else  		textLine = line + " " + word;

			var metrics = this.context.measureText(textLine);
			var textWidth = metrics.width;

			if (i != 0 && (textWidth > maxWidth)) 
			{
				line = word;
				noLines++;
			}
			else  line = textLine;
		}
		noLines++;
		var totalHeight = noLines * lineHeight;
		if (textBaseline == "middle") y = (y - (totalHeight / 2)) + (lineHeight / 2);
		else if (textBaseline == "bottom") y = (y - totalHeight) + lineHeight;
	}

	// Loop through each word and add it to the line if it still
	// fits the line width, otherwise create a new line.
	for(var i = 0; i < words.length; i++) 
	{
		var word = words[i];

		var textLine;
		if (i == 0) textLine = word;
		else  		textLine = line + " " + word;

		var metrics = this.context.measureText(textLine);
		var textWidth = metrics.width;

		if (i != 0 && (textWidth > maxWidth)) 
		{
			this.context.fillText(line, x, y);
			line = word;
			y += lineHeight;
		}
		else line = textLine;
	}
	this.context.fillText(line, x, y);
};


/** 
 * Clears and renders the map.
 *
 * @method render
 */
ia.CanvasBase.prototype.render = function()
{
	this.datatip.hide();
	for (var i = 0; i < this._layers.length; i++) {this._layers[i].render();}
};

/** 
 * Clears the canvas.
 *
 * @method clear
 */
ia.CanvasBase.prototype.clear = function()  
{
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for (var i = 0; i < this._layers.length; i++) {this._layers[i].clear();}
};

/** 
 * Clears the foreground canvas.
 *
 * @method clear
 */
ia.CanvasBase.prototype.clearForeground = function()  
{
	this.foregroundContext.clearRect(0, 0, this.foregroundCanvas.width, this.foregroundCanvas.height);
};

/** 
 * Adds a layer to the map.
 * 
 * @method addLayer
 * @param {ia.LayerBase} layer The layer to add.
 */
ia.CanvasBase.prototype.addLayer = function(layer) 
{
	this._layers.push(layer);
	layer.setMap(this, this.layerContainer);
};

/** 
 * Gets the map layers.
 * 
 * @method getLayers
 * @return {ia.LayerBase[]} The layers in the map.
 */
ia.CanvasBase.prototype.getLayers = function() 
{
	return this._layers;
};

/** 
 * Removes all layers from the map.
 * 
 * @method removeLayers
 */
ia.CanvasBase.prototype.removeLayers = function() 
{
	for (var i = 0; i < this._layers.length; i++)  
	{
		var layer = this._layers[i];
		layer.removeCanvases();
		this.removeListener(layer);
	}
	this._layers = new Array();
};

/** 
 * Gets the map layer with the given id.
 * 
 * @method getLayer
 * @param {String} id The layer id.
 * @return {ia.LayerBase} The layer, or undefined.
 */
ia.CanvasBase.prototype.getLayer = function(id) 
{
	for (var i = 0; i < this._layers.length; i++)  
	{
		var layer = this._layers[i]
		if (layer.id == id) return layer;
	}
	return undefined;
};

/** 
 * Starts a map drag.
 * 
 * @method startDrag
 */
ia.CanvasBase.prototype.startDrag = function()  
{
	// Fix for when google maps stops propagation of events during this._dragging.
	this._dragging = true;
};

/** 
 * Ends a map drag.
 * 
 * @method endDrag
 */
ia.CanvasBase.prototype.endDrag = function()  
{
	$j(document).off(".canvasbasedoc");
	this._dragging = false;
	this._mouseDragged = true;
	this._mouseDown = false;
};

/**
 * Toggles the chart visibility.
 * 
 * @method toggle
 */
ia.CanvasBase.prototype.toggle = function(visible)
{
	if (this.isVisible) this.hide();
	else this.show();
};

/**
 * Hides the chart.
 * 
 * @method hide
 */
ia.CanvasBase.prototype.hide = function()
{
	if (this.isVisible)
	{
		var me = this;
		me.isVisible = false;
		me.container.stop();
		me.container.animate({opacity: 0}, function() {me.clear();});
	}
};

/**
 * Shows the chart.
 * 
 * @method show
 */
ia.CanvasBase.prototype.show = function()
{
	if (!this.isVisible)
	{
		this.isVisible = true;
		this.container.stop();
		this.container.animate({opacity: 1}, function() {});
	}
};