/** 
 * The base class for map layers.
 *
 * @author J Clare
 * @class ia.LayerBase
 * @extends ia.EventDispatcher
 * @constructor
 */
ia.LayerBase = function()
{
	ia.LayerBase.baseConstructor.call(this);

	this._visible = false;
	this._mapMouseEventListenersAdded = false;

	this.showInLayerList = false;
	this.isLoaded = false;

	this.exportable = true;
	this.interactive = false;
	this.highlightable = false;
	this.selectable = true;
	this.showLabels = false;
	this.showDataTips = true;
};
ia.extend(ia.EventDispatcher, ia.LayerBase);
	
/** 
 * The id of the layer.
 *
 * @property id
 * @type String
 * @default ""
 */
ia.LayerBase.prototype.id;

/** 
 * The name of the layer.
 *
 * @property name
 * @type String
 * @default ""
 */
ia.LayerBase.prototype.name;

/** 
 * The map associated with this layer.
 *
 * @property map
 * @type ia.Map
 */
ia.LayerBase.prototype.map;

/** 
 * The canvas associated with this layer.
 *
 * @property canvas
 * @type HTML Canvas
 */
ia.LayerBase.prototype.canvas;

/** 
 * The canvas context associated with this layer.
 *
 * @property context
 * @type HTML Canvas Context
 */
ia.LayerBase.prototype.context;

/** 
 * The bounding box for the layer.
 *
 * @property bBox
 * @type ia.BoundingBox
 */
ia.LayerBase.prototype.bBox;

/** 
 * Should the layer be displayed ina layer list.
 *
 * @property showInLayerList
 * @type Boolean
 * @default false
 */
ia.LayerBase.prototype.showInLayerList;

/**
 * Indicates whether the layer is loaded.
 *
 * @property isLoaded
 * @type Boolean
 * @default false
 */
ia.LayerBase.prototype.isLoaded;

/** 
 * Is selection and highlighting switched on.
 * Call commitChanges() if this is changed after the layer added to the map.
 *
 * @property interactive
 * @type Boolean
 * @default false
 */
ia.LayerBase.prototype.interactive;

/** 
 * Is programmatic selection and highlighting switched on (but not on mouse interaction). 
 * Call commitChanges() if this is changed after the layer added to the map.
 *
 * @property highlightable
 * @type Boolean
 * @default false
 */
ia.LayerBase.prototype.highlightable;

/** 
 * Is the layer selectable on a mouse click. 
 * Call commitChanges() if this is changed after the layer added to the map.
 *
 * @property selectable
 * @type Boolean
 * @default true
 */
ia.LayerBase.prototype.selectable;

/**
 * Show labels. 
 * Call commitChanges() if this is changed after the layer added to the map.
 * 
 * @property showLabels 
 * @type Boolean
 * @default false
 */
ia.LayerBase.prototype.showLabels;

/**
 * Are data tips displayed. 
 * Call commitChanges() if this is changed after the layer added to the map.
 *
 * @property showDataTips
 * @type Boolean
 * @default true
 */
ia.LayerBase.prototype.showDataTips;

/**
 * Is the layer exportable.
 *
 * @property exportable
 * @type Boolean
 * @default true
 */
ia.LayerBase.prototype.exportable;

/** 
 * Loads the source data.
 *
 * @method loadSource
 */	
ia.LayerBase.prototype.loadSource = function() 
{
	// Default dispatch for layers which dont load data such as background layers.
	this.isLoaded = true;
	var e = new ia.Event(ia.Event.LAYER_READY, this);
	this.dispatchEvent(e);
};

/**
 * Gets the visibility of the layer.
 * 
 * @method getVisible
 * @return {Boolean} true/false.
 */
ia.LayerBase.prototype.getVisible = function()
{
	return this._visible;
};

/**
 * Sets the visibility of the layer.
 * 
 * @method setVisible
 * @param {Boolean} value true/false.
 */
ia.LayerBase.prototype.setVisible = function(value)
{
	this._visible = value;
	
	if (this.map) 
	{
		if (this._visible) 
		{
			//$j(this.canvas).css("display", "inline");

			this.addCanvases();
			this.render();
		}
		else 
		{
			//$j(this.canvas).css("display", "none");
			//this.clear();

			this.removeCanvases();
		}
	}
	
	var e = new ia.Event(ia.Event.LAYER_VISIBLE_CHANGED, this);
	this.dispatchEvent(e);
};

/** 
 * Sets the map and canvas for the layer.
 * 
 * @method setMap
 * @param {ia.Map} map The map.
 * @param {HTML Element} map The container.
 */
ia.LayerBase.prototype.setMap = function(map, container)
{
	// The parent map.
	this.map = map;
	var me = this;

	this._canvasContainer = $j("<div>"); 
	container.append(this._canvasContainer);

	// Add map mouse listeners.
	this.addMapMouseEventListeners();

	if (this._visible) this.addCanvases();

	map.addEventListener(ia.Event.MAP_RESIZE, function(event)
	{
		var w = me.map.container.width();
		var h = me.map.container.height();	
			
		if (me.canvas)
		{
			me.canvas.width = w;
			me.canvas.height = h;
		}
		if (me.selectionCanvas)
		{
			me.selectionCanvas.width = w;
			me.selectionCanvas.height = h;
		}
		if (me.highlightCanvas)
		{
			me.highlightCanvas.width = w;
			me.highlightCanvas.height = h;
		}
		if (me.showLabels && me.labelCanvas)
		{
			me.labelCanvas.width = w;
			me.labelCanvas.height = h;
		}
	}, this);
};

/** 
 * Ensures the correct event listeners and canvas are added if interactive properties
 * such as showDataTips and showLabels are changed after the layer has been added to the map.
 *
 * @method commitChanges
 */
ia.LayerBase.prototype.commitChanges = function()
{
	this.addMapMouseEventListeners();
	this.addCanvases();
};

/** 
 * Adds drawing canvases for the layer when the layer is shown.
 * This method was introduced to fix a bug a chrome when
 * multiple canvases were affecting rendering. It basically reduces
 * the number of unused canvases which are taking up memory.
 * 
 * @method addCanvases
 */
ia.LayerBase.prototype.addCanvases = function()
{
	var w = this.map.container.width();
	var h = this.map.container.height();

	// Create the main canvas.
	if (this.canvas == undefined)
	{
		this.canvas = this.createCanvas(this._canvasContainer);
		this.context = this.canvas.getContext("2d");		
		this.canvas.width = w;
		this.canvas.height = h;
	}

	// If "this.interactive" isnt set before the layer is added to the map
	// this wont work. This was part of a fix to reduce the number of redundant
	// canvases that was causing rendering issues in chrome
	if (this.interactive || this.highlightable)
	{
		if (this.selectionCanvas == undefined) this.addSelectionCanvas(); // Create the selection canvas.
		if (this.highlightCanvas == undefined) this.addHighlightCanvas(); // Create the highlight canvas.
	}
	else
	{
		this.removeHighlightCanvas();
		this.removeSelectionCanvas();
	}

	// Create the label canvas.
	if (this.showLabels && this.labelCanvas == undefined) this.addLabelCanvas();
	else this.removeLabelCanvas();
};

/** 
 * Adds mouse event listeners to the map.
 * 
 * @method addMapMouseEventListeners
 */
ia.LayerBase.prototype.addMapMouseEventListeners = function()
{
	if (!this._mapMouseEventListenersAdded & (this.interactive || this.showDataTips))
	{
		this._mapMouseEventListenersAdded = true;

		this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_MOVE, this._mapEventHandler.bind(this), this);
		this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_OVER, this._mapEventHandler.bind(this), this);
		this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_OUT, this._mapEventHandler.bind(this), this);
		this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_WHEEL_END, this._mapEventHandler.bind(this), this);
		if (this.selectable)
		{
			this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_CLICK, this._mapEventHandler.bind(this), this);
			this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_DOWN, this._mapEventHandler.bind(this), this);
			this.map.addEventListener(ia.MapMouseEvent.MAP_MOUSE_UP, this._mapEventHandler.bind(this), this);
		}
	}
};

/** 
 * Removes drawing canvases for the layer when the layer is hidden.
 * This method was introduced to fix a bug a chrome when
 * multiple canvases were affecting rendering. It basically reduces
 * the number of unused canvases which are taking up memory.
 * 
 * @method removeCanvases
 */
ia.LayerBase.prototype.removeCanvases = function()
{
	if (this.canvas != undefined) 
	{
		$j(this.canvas).remove();
		this.canvas = undefined;
		this._heatmap = undefined; // Hack to make heatmaps work in FeatureLayer.
	}
	if (this.selectionCanvas != undefined) 
	{
		$j(this.selectionCanvas).remove();
		this.selectionCanvas = undefined;
	}
	if (this.highlightCanvas != undefined) 
	{
		$j(this.highlightCanvas).remove();
		this.highlightCanvas = undefined;
	}
	if (this.labelCanvas != undefined) 
	{
		$j(this.labelCanvas).remove();
		this.labelCanvas = undefined;
	}
};

/** 
 * Adds the highlight canvas.
 * 
 * @method addSelectionCanvas
 */
ia.LayerBase.prototype.addSelectionCanvas = function()
{
	this.selectionCanvas = this.createCanvas(this.map.foregroundContainer);
	this.selectionContext = this.selectionCanvas.getContext("2d");
	this.selectionCanvas.width = this.map.container.width();
	this.selectionCanvas.height = this.map.container.height();
};

/** 
 * Removes the label canvas.
 * 
 * @method removeSelectionCanvas
 */
ia.LayerBase.prototype.removeSelectionCanvas = function()
{
	if (this.selectionCanvas != undefined) 
	{
		$j(this.selectionCanvas).remove();
		this.selectionCanvas = undefined;
	}
};

/** 
 * Adds the highlight canvas.
 * 
 * @method addHighlightCanvas
 */
ia.LayerBase.prototype.addHighlightCanvas = function()
{
	this.highlightCanvas = this.createCanvas(this.map.foregroundContainer);
	this.highlightContext = this.highlightCanvas.getContext("2d");
	this.highlightCanvas.width = this.map.container.width();
	this.highlightCanvas.height = this.map.container.height();
};

/** 
 * Removes the label canvas.
 * 
 * @method removeHighlightCanvas
 */
ia.LayerBase.prototype.removeHighlightCanvas = function()
{
	if (this.highlightCanvas != undefined) 
	{
		$j(this.highlightCanvas).remove();
		this.highlightCanvas = undefined;
	}
};

/** 
 * Adds the label canvas.
 * 
 * @method addLabelCanvas
 */
ia.LayerBase.prototype.addLabelCanvas = function()
{
	this.labelCanvas = this.createCanvas(this._canvasContainer);
	this.labelContext = this.labelCanvas.getContext("2d");
	this.labelCanvas.width = this.map.container.width();
	this.labelCanvas.height = this.map.container.height();
	this._setLabelStyle();
};

/** 
 * Removes the label canvas.
 * 
 * @method removeLabelCanvas
 */
ia.LayerBase.prototype.removeLabelCanvas = function()
{
	if (this.labelCanvas != undefined) 
	{
		$j(this.labelCanvas).remove();
		this.labelCanvas = undefined;
	}
};

/**
 * Handles when to carry out hit tests. 
 * 
 * @method _mapEventHandler
 * @param {ia.MapMouseEvent} event A <code>ia.MapMouseEvent</code>.
 * @private
 */
ia.LayerBase.prototype._mapEventHandler = function(event)
{

};

/** 
 * Creates a new canvas.
 *
 * @method createCanvas
 * @return {HTML Canvas} The canvas.
 */
ia.LayerBase.prototype.createCanvas = function(container)
{
	var canvas = document.createElement('canvas');
	canvas.width = container.width();
	canvas.height = container.height();
	$j(canvas).css({position: 'absolute', left: 0, top: 0});
	container.append($j(canvas));
	return canvas;
};

/** 
 * Renders the layer.
 *
 * @method render
 */
ia.LayerBase.prototype.render = function() {};

/** 
 * Clears all canvases in the layer.
 *
 * @method clear
 */
ia.LayerBase.prototype.clear = function() 
{
	if (this.canvas) this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};