/** 
 * An <code>ia.MapMouseEvent</code> object.
 *
 * @author J Clare
 * @class ia.MapMouseEvent
 * @extends ia.MouseEvent
 * @constructor
 * @param {ia.Map} map The map associated with the event.
 * @param {MouseEvent} evt A mouse event.
 * @param {String} eventType The event type.
 * @param {Number} dataX The data x coordinate of the mouse.
 * @param {Number} dataY The data y coordinate of the mouse.
 * @param {Number} mouseX The pixel x coordinate of the mouse.
 * @param {Number} mouseY The pixel y coordinate of the mouse.
 * @param {Number} mouseX The second pixel x coordinate (used for touch devices).
 * @param {Number} mouseY The second pixel y coordinate (used for touch devices).
 * @param {Number} pageX The page x coordinate in pixels.
 * @param {Number} pageY The page y coordinate in pixels.
 */
ia.MapMouseEvent = function(map, evt, eventType, dataX, dataY, mouseX, mouseY, mouseX2, mouseY2, pageX, pageY)
{
	ia.MapMouseEvent.baseConstructor.call(this, evt, eventType, mouseX, mouseY, map);
	
	this.x2 = mouseX2;
	this.y2 = mouseY2;
	this.dataX = dataX;
	this.dataY = dataY;
	this.map = map;
	this.pageX = pageX;
	this.pageY = pageY;

    if (evt && evt.originalEvent) this.isTouchEvent = evt.originalEvent.touches != undefined ? true : false;
    else this.isTouchEvent = false;
}
ia.extend(ia.MouseEvent, ia.MapMouseEvent);

/** 
 * Check if its a touch event
 *
 * @property isTouchEvent
 * @type Boolean
 */
ia.MapMouseEvent.prototype.isTouchEvent;

/** 
 * The second x coord (used for touch devices)).
 *
 * @property x2
 * @type Number
 */
ia.MapMouseEvent.prototype.x2;

/** 
 * The second y coord (used for touch devices)).
 *
 * @property y2
 * @type Number
 */
ia.MapMouseEvent.prototype.y2;

/** 
 * The data x.
 *
 * @property dataX
 * @type Number
 */
ia.MapMouseEvent.prototype.dataX;

/** 
 * The data y.
 *
 * @property dataY
 * @type Number
 */
ia.MapMouseEvent.prototype.dataY;

/** 
 * The map.
 *
 * @property map
 * @type ia.Map
 */
ia.MapMouseEvent.prototype.map;

/** 
 * The page x.
 *
 * @property pageX
 * @type Number
 */
ia.MapMouseEvent.prototype.pageX;

/** 
 * The page y.
 *
 * @property pageY
 * @type Number
 */
ia.MapMouseEvent.prototype.pageY;

/**
 * Indicates that the user touches the map with two fingers the map.
 * 
 * @static
 * @final
 * @property MAP_PINCH_DOWN
 * @type String
 * @default "mapPinchDown"
 */
ia.MapMouseEvent.MAP_PINCH_DOWN = "mapPinchDown";

/**
 * Indicates that the user moves two fingers over the map.
 * 
 * @static
 * @final
 * @property MAP_PINCH_MOVE
 * @type String
 * @default "mapPinchMove"
 */
ia.MapMouseEvent.MAP_PINCH_MOVE = "mapPinchMove";

/**
 * Indicates that the user lifts a finger after a double touch.
 * 
 * @static
 * @final
 * @property MAP_PINCH_UP
 * @type String
 * @default "mapPinchUp"
 */
ia.MapMouseEvent.MAP_PINCH_UP = "mapPinchUp";

/**
 * Indicates that the user clicked the mouse button over a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_CLICK
 * @type String
 * @default "mapMouseClick"
 */
ia.MapMouseEvent.MAP_MOUSE_CLICK = "mapMouseClick";

/**
 * Indicates that the user pressed the mouse button over a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_DOWN
 * @type String
 * @default "mapMouseDown"
 */
ia.MapMouseEvent.MAP_MOUSE_DOWN = "mapMouseDown";

/**
 * Indicates that the user released the mouse button over a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_UP
 * @type String
 * @default "mapMouseUp"
 */
ia.MapMouseEvent.MAP_MOUSE_UP = "mapMouseUp";

/**
 * Indicates that the user moved the mouse pointer while hovering over a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_MOVE
 * @type String
 * @default "mapMouseMove"
 */
ia.MapMouseEvent.MAP_MOUSE_MOVE = "mapMouseMove";

/**
 * Indicates that the user rolled the mouse pointer over a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_OVER
 * @type String
 * @default "mapMouseOver"
 */
ia.MapMouseEvent.MAP_MOUSE_OVER = "mapMouseOver";

/**
 * Indicates that the user rolled the mouse pointer out of a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_OUT
 * @type String
 * @default "mapMouseOut"
 */
ia.MapMouseEvent.MAP_MOUSE_OUT = "mapMouseOut";

/**
 * Indicates that the user moved the mouse wheel while hovering over a map.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_WHEEL
 * @type String
 * @default "mapMouseWheel"
 */
ia.MapMouseEvent.MAP_MOUSE_WHEEL = "mapMouseWheel";

/**
 * Indicates that the user finished moving the mouse wheel while hovering over a
 * 
 * @static
 * @final
 * @property MAP_MOUSE_WHEEL_END
 * @type String
 * @default "mapMouseWheelEnd"
 * map.
 */
ia.MapMouseEvent.MAP_MOUSE_WHEEL_END = "mapMouseWheelEnd";

/**
 * Indicates that the user dragged the mouse pointer over a map. The
 * mapMouseDrag event will continue to be dispatched after the mouse has
 * moved out of the canvas as long as the the mouse is down.
 * 
 * @static
 * @final
 * @property MAP_MOUSE_DRAG
 * @type String
 * @default "mapMouseDrag"
 */
ia.MapMouseEvent.MAP_MOUSE_DRAG = "mapMouseDrag";

/**
 * Indicates that the user released the mouse button after a mapMouseDrag
 * event. The mapMouseDragUp event will still to be dispatched after the
 * mouse has moved out of the canvas as long as the mouse was dragged out of the
 * 
 * @static
 * @final
 * @property MAP_MOUSE_DRAG_UP
 * @type String
 * @default "mapMouseDragUp"
 * map.
 */
ia.MapMouseEvent.MAP_MOUSE_DRAG_UP = "mapMouseDragUp";