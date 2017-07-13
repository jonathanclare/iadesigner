/** 
 * An <code>ia.MouseEvent</code> object.
 *
 * @author J Clare
 * @class ia.MouseEvent
 * @extends ia.Event
 * @constructor
 * @param {Object} evt A mouse event.
 * @param {String} eventType The event type.
 * @param {Number} mouseX The x coordinate of the mouse.
 * @param {Number} mouseY The y coordinate of the mouse.
 * @param {Object} obj The object associated with the event.
 */
ia.MouseEvent = function(evt, eventType, mouseX, mouseY, obj)
{
	ia.MouseEvent.baseConstructor.call(this, eventType, obj);

	this.x = mouseX;
	this.y = mouseY;
	this.shiftKey = evt.shiftKey;
	this.ctrlKey = evt.ctrlKey;
	this.mouseEvent = evt;
	
	// Fix for firefox.
	var evt = window.event || evt // equalize event object
	this.delta = evt.detail ? evt.detail*(-120) : evt.wheelDelta;
}
ia.extend(ia.Event, ia.MouseEvent);

/** 
 * The actual mouse event.
 *
 * @property mouseEvent
 * @type Object
 */
ia.MouseEvent.prototype.mouseEvent;

/** 
 * The x coord.
 *
 * @property x
 * @type Number
 */
ia.MouseEvent.prototype.x;

/** 
 * The y coord.
 *
 * @property y
 * @type Number
 */
ia.MouseEvent.prototype.y;

/** 
 * Is the shift key pressed.
 *
 * @property shiftKey
 * @type Boolean
 */
ia.MouseEvent.prototype.shiftKey;

/** 
 * Is the ctrl key pressed.
 *
 * @property ctrlKey
 * @type Boolean
 */
ia.MouseEvent.prototype.ctrlKey;

/** 
 * Wheel delta.
 *
 * @property delta
 * @type Number
 */
ia.MouseEvent.prototype.delta;