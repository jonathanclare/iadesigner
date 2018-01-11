/** 
 * Contains code to allow objects to dispatch events and add listeners.
 *
 * @author J Clare
 * @class ia.EventDispatcher
 * @constructor
 */
ia.EventDispatcher = function()
{
	this._objs = new Array();
	this._eventListeners = new Array();
	this._eventTypes = new Array();
};

/** 
 * Add an event listener.
 *
 * @method addEventListener
 * @param {String} eventType The type of event to listen for.
 * @param {Function} fnc The function to call when the event occurs.
 * @param {Object} obj An optional parent object.
 */
ia.EventDispatcher.prototype.addEventListener = function(eventType, fnc, obj)
{
	this._objs.push(obj);
	this._eventTypes.push(eventType);	
	this._eventListeners.push(fnc);
};

/** 
 * Removes all event listeners for the given object.
 *
 * @method removeListener
 * @param {Object} obj The object.
 */
ia.EventDispatcher.prototype.removeListener = function(obj)
{
	var i = this._objs.length;
	while (i--) 
	{
		if (this._objs[i] == obj)
		{
			this._objs.splice(i, 1);
			this._eventTypes.splice(i, 1);
			this._eventListeners.splice(i, 1);
		}
	}
};

/** 
 * Dispatch an event to the listeners.
 *
 * @method dispatchEvent
 * @param {Object} event The event object.
 */
ia.EventDispatcher.prototype.dispatchEvent = function(event)
{
	// Clone the listeners here so you only call the listeners
	// that already exist when the event was dispatched and none
	// that are added as a result of the dispatch.
	var listeners = this._eventListeners.concat();
	var types = this._eventTypes.concat();
	for (var i = 0; i < listeners.length; i++)
	{
		if (types[i] == event.type)
		{
			listeners[i].call(null, event);
		}
	}
};