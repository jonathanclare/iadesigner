/** 
 * A <code>ia.DataEvent</code> object.
 *
 * @author J Clare
 * @class ia.DataEvent
 * @extends ia.Event
 * @constructor
 * @param {String} eventType The event type.
 * @param {Object} data The data group object.
 * @param {ia.Geography} geography The geography.
 * @param {ia.Theme} theme The theme.
 * @param {ia.Indicator} indicator The indicator.
 */
ia.DataEvent = function(eventType, data, geography, theme, indicator)
{
	ia.DataEvent.baseConstructor.call(this, eventType, data);
	
	this.data = data;
	this.geography = geography;
	this.theme = theme;
	this.indicator = indicator;

};
ia.extend(ia.Event, ia.DataEvent);

/**
 * Dispatched when the data have changed somehow.
 * This can be if the geography, indicator or filter have changed.
 * 
 * @static
 * @final
 * @property DATA_CHANGED
 * @type String
 * @default "dataChanged"
 */
ia.DataEvent.DATA_CHANGED = "dataChanged";

/**
 * Dispatched when the geography has changed.
 * 
 * @static
 * @final
 * @property GEOG_CHANGED
 * @type String
 * @default "geogChanged"
 */
ia.DataEvent.GEOG_CHANGED = "geogChanged";

/**
 * Dispatched when the theme has changed.
 * 
 * @static
 * @final
 * @property THEME_CHANGED
 * @type String
 * @default "themeChanged"
 */
ia.DataEvent.THEME_CHANGED = "themeChanged";

/**
 * Dispatched when the indicator has changed.
 * 
 * @static
 * @final
 * @property INDICATOR_CHANGED
 * @type String
 * @default "indicatorChanged"
 */
ia.DataEvent.INDICATOR_CHANGED = "indicatorChanged";
	
/** 
 * The data object.
 *
 * @property data
 * @type Object
 */
ia.DataEvent.prototype.data;

/** 
 * The geography.
 *
 * @property geography
 * @type ia.Geography
 */
ia.DataEvent.prototype.geography;

/** 
 * The theme.
 *
 * @property theme
 * @type ia.Theme
 */
ia.DataEvent.prototype.theme;

/** 
 * The indicator.
 *
 * @property indicator
 * @type ia.Indicator
 */
ia.DataEvent.prototype.indicator;
