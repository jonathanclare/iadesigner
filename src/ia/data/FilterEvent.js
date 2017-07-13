/** 
 * A <code>ia.FilterEvent</code> object.
 *
 * @author J Clare
 * @class ia.FilterEvent
 * @extends ia.Event
 * @constructor
 * @param {String} eventType The event type.
 * @param {Object} data The data group object.
 * @param {String} filterId The filter id.
 * @param {String} filterName The filter name.
 * @param {String} filterValue The filter value.
 * @param {String[]} filterFeatures A list of filtered feature ids.
 */
ia.FilterEvent = function(eventType, data, filterId, filterName, filterValue, filterFeatures)
{
	ia.FilterEvent.baseConstructor.call(this, eventType, data);
	
	this.data = data;
	this.filterId = filterId;
	this.filterName = filterName;
	this.filterValue = filterValue;
	this.filterFeatures = filterFeatures.concat();

};
ia.extend(ia.Event, ia.FilterEvent);

/**
 * Dispatched when the filter has changed.
 * 
 * @static
 * @final
 * @property FILTER_CHANGED
 * @type String
 * @default "filterChanged"
 */
ia.FilterEvent.FILTER_CHANGED = "filterChanged";
	
/** 
 * The filter id.
 *
 * @property filterId
 * @type String
 */
ia.FilterEvent.prototype.filterId;

/** 
 * The filter name.
 *
 * @property filterName
 * @type String
 */
ia.FilterEvent.prototype.filterName;

/** 
 * The filter value.
 *
 * @property filterValue
 * @type String
 */
ia.FilterEvent.prototype.filterValue;

/** 
 * A list of filtered feature ids.
 *
 * @property filterFeatures
 * @type String[]
 */
ia.FilterEvent.prototype.filterFeatures;