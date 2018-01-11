/** 
 * An <code>ia.Event</code> object.
 *
 * @author J Clare
 * @class ia.Event
 * @constructor
 * @param eventType The event type.
 * @param obj The object associated with the event.
 */
ia.Event = function(eventType, obj)
{
	this.type = eventType;
	this.object = obj;
}

/** 
 * The type of event.
 *
 * @property eventType
 * @type String
 */
ia.Event.prototype.type;

/** 
 * The object associated with the event.
 *
 * @property obj
 * @type Object
 */
ia.Event.prototype.object;

/**
 * Indicates that the map is ready to be rendered.
 *
 * @static
 * @final
 * @property MAP_READY
 * @type String
 * @default "mapReady"
 */
ia.Event.MAP_READY = "mapReady";

/**
 * Indicates that the map has resized.
 *
 * @static
 * @final
 * @property MAP_RESIZE
 * @type String
 * @default "mapResize"
 */
ia.Event.MAP_RESIZE = "mapResize";

/**
 * Indicates that the layer is ready to be rendered.
 *
 * @static
 * @final
 * @property LAYER_READY
 * @type String
 * @default "layerReady"
 */
ia.Event.LAYER_READY = "layerReady";

/**
 * Indicates that the layer changed.
 *
 * @static
 * @final
 * @property LAYER_VISIBLE_CHANGED
 * @type String
 * @default "layerVisibleChanged"
 */
ia.Event.LAYER_VISIBLE_CHANGED = "layerVisibleChanged";

/**
 * Dispatched by a theme when it has changed.
 *
 * @static
 * @final
 * @property THEME_CHANGED
 * @type String
 * @default "themeChanged"
 */
ia.Event.THEME_CHANGED = "themeChanged";

/**
 * Dispatched by a data group when its thematic changes.
 *
 * @static
 * @final
 * @property THEMATIC_CHANGED
 * @type String
 * @default "thematicChanged"
 */
ia.Event.THEMATIC_CHANGED = "thematicChanged";

/**
 * Indicates that the user clicked the mouse button over a canvas but not over an item.
 *
 * @static
 * @final
 * @property CLEAR_SELECTION
 * @type String
 * @default "clearSelection"
 */
ia.Event.CLEAR_SELECTION = "clearSelection";