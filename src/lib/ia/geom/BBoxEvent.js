/** 
 * Dispatched by a map when its bounding box changes.
 *
 * @author J Clare
 * @class ia.BBoxEvent
 * @extends ia.Event
 * @constructor
 * @param {Number} eventType The event type.
 * @param {Object} eventDispatcher The object that dispatched the event.
 * @param {ia.BoundingBox} bBox The new bBox.
 * @param {ia.BoundingBox} oldBBox The old bBox.
 */
ia.BBoxEvent = function(eventType, eventDispatcher, bBox, oldBBox)
{
	ia.BBoxEvent.baseConstructor.call(this, eventType, eventDispatcher);
	
	this.bBox = bBox;
	this.oldBBox = oldBBox;
}
ia.extend(ia.Event, ia.BBoxEvent);

/**
 * Indicates a translation took place.
 *
 * @static
 * @final
 * @property BBOX_TRANSLATE
 * @type Number
 * @default 0
 */
ia.BBoxEvent.BBOX_TRANSLATE = 0;

/**
 * Indicates the scale changed.
 *
 * @static
 * @final
 * @property BBOX_SCALE
 * @type Number
 * @default 1
 */
ia.BBoxEvent.BBOX_SCALE = 1;