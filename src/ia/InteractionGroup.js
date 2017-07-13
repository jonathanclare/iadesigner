/** 
 * An ia.Event object.
 *
 * @author J Clare
 * @class ia.InteractionEvent
 * @extends ia.Event
 * @constructor
 * @param {String} eventType The event type.
 * @param {ia.InteractionGroup} interactionGroup The InteractionGroup associated with the event.
 * @param {String[]} ids A list if ids associated with the event.
 */
ia.InteractionEvent = function(eventType, interactionGroup, ids)
{
	ia.InteractionEvent.baseConstructor.call(this, eventType, interactionGroup);

	this.ids = ids || [];
};
ia.extend(ia.Event, ia.InteractionEvent);

/**
 * Indicates that the selection has changed.
 * 
 * @static
 * @final
 * @property SELECTION_CHANGED
 * @type String
 * @default "selectionChanged"
 */
ia.InteractionEvent.SELECTION_CHANGED = "selectionChanged";

/**
 * Indicates that the highlight has changed.
 * 
 * @static
 * @final
 * @property HIGHLIGHT_CHANGED
 * @type String
 * @default "highlightChanged"
 */
ia.InteractionEvent.HIGHLIGHT_CHANGED = "highlightChanged";

/** 
 *  A list if ids associated with the event.
 * 
 * @property ids
 * @type String[]
 */
ia.InteractionEvent.prototype.ids;

/** 
 * Organizes interactions between different components.
 *
 * @author J Clare
 * @class ia.InteractionGroup
 * @constructor
 */
ia.InteractionGroup = function()
{		
	ia.InteractionGroup.baseConstructor.call(this);

	this._selection = new Array();			// Contains the selected ids.
	this._highlight = "";					// Contains the highlighted ids.
	this._components = new Array();			// Contains the none legend components.
	this._legendComponents = new Array();	// Contains the legend components.
	this.selectionMode = "multiple";
};
ia.extend(ia.EventDispatcher, ia.InteractionGroup);

/** 
 * Selection mode.
 * 
 * @property selectionMode
 * @type String
 * @default "multiple"
 */
ia.InteractionGroup.prototype.selectionMode;

/** 
 * Gets the list of components.
 * 
 * @method getComponents
 * @return {Object[]} An array of components.
 */
ia.InteractionGroup.prototype.getComponents = function(c) 
{
	return this._components.concat(this._legendComponents);
};

/** 
 * Adds a component to the group.
 * 
 * @method addComponent
 * @param {Object} component The component to add.
 */
ia.InteractionGroup.prototype.addComponent = function(c) 
{
	if (c.isLegendComponent) this._legendComponents.push(c);
	else this._components.push(c);
	
	// Add item listeners.
	c.addEventListener(ia.ItemEvent.ITEM_MOUSE_OVER, this._itemEventHandler.bind(this));
	c.addEventListener(ia.ItemEvent.ITEM_MOUSE_OUT, this._itemEventHandler.bind(this));
	c.addEventListener(ia.ItemEvent.ITEM_MOUSE_UP, this._itemEventHandler.bind(this));
	c.addEventListener(ia.ItemEvent.ITEM_CLICK, this._itemEventHandler.bind(this));
	c.addEventListener(ia.ItemEvent.NONE_ITEM_CLICK, this._itemEventHandler.bind(this));
	
	// For report object.
	c.addEventListener(ia.ItemEvent.ITEM_MOUSE_DOWN, dispatch.bind(this));
	c.addEventListener(ia.ItemEvent.ITEM_MOUSE_MOVE, dispatch.bind(this));
	function dispatch(event) {this.dispatchEvent(event)}
};

/** 
 * Removes a component from the group.
 * 
 * @method removeComponent
 * @param {Object} component The component to remove.
 */
ia.InteractionGroup.prototype.removeComponent = function(c) 
{
	var index = this._components.indexOf(c);
	if (index != -1) this._components.splice(index, 1);

	var index = this._legendComponents.indexOf(c);
	if (index != -1) this._legendComponents.splice(index, 1);
};

/** 
 * Returns the highlighted id.
 * 
 * @method getHighlight
 * @return {String} The id.
 */
ia.InteractionGroup.prototype.getHighlight = function()
{
	return this._highlight;
};

/** 
 * Clears the highlight.
 * 
 * @method clearHighlight
 */
ia.InteractionGroup.prototype.clearHighlight = function()
{
	this._highlight = "";

	for (var i = 0; i < this._components.length; i++) 
	{ 
		var component = this._components[i];
		component.clearHighlight();
	}
	for (var i = 0; i < this._legendComponents.length; i++) 
	{ 
		var component = this._legendComponents[i];
		component.clearHighlight();
	}
	this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.HIGHLIGHT_CHANGED, this, [this._highlight]));
};

/**
 * Highlight the id.
 *
 * @method setHighlight
 * @param {String} id The id.
 */
ia.InteractionGroup.prototype.setHighlight = function(id) 
{
	if (id != "")
	{
		this._highlight = id;

		for (var i = 0; i < this._components.length; i++) 
		{ 
			this._components[i].clearHighlight();
			this._components[i].highlight(''+id);
		}
		this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.HIGHLIGHT_CHANGED, this, [this._highlight]));
	}
	else this.clearHighlight();
};

/** 
 * Returns the selected ids as an array.
 * 
 * @method getSelection
 * @return {String[]} The list of ids.
 */
ia.InteractionGroup.prototype.getSelection = function()
{
	return this._selection;
};

/** 
 * Sets the selected ids as an array.
 * 
 * @method setSelection
 * @param {String[]} s An array of ids.
 */
ia.InteractionGroup.prototype.setSelection = function(s)
{
	// Dispatch event without item because none have been clicked.
	// This is so components like map/table tool bars know that a selection has been made programmatically.
	/*var item = new Object();
	if (this._selection.length > 0) item.id = this._selection[this._selection.length - 1];
	item.state = ia.ItemLayer.SELECTED;
	this.dispatchEvent(new ia.ItemEvent(ia.ItemEvent.ITEM_CLICK, item));*/

	if (s.length > 0)
	{
		this._selection = s.concat();

		for (var i = 0; i < this._components.length; i++) 
		{ 
			for (var j = 0; j < this._selection.length; ++j) 
			{
				this._components[i].select(''+this._selection[j]);
			}
		}

		this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.SELECTION_CHANGED, this, this._selection));
	}
	else this.clearSelection();
};	

/** 
 * Clears the selection.
 * 
 * @method clearSelection
 */
ia.InteractionGroup.prototype.clearSelection = function()
{
	for (var i = 0; i < this._components.length; i++) 
	{ 
		var component = this._components[i];
		component.clearSelection();
	}
	for (var i = 0; i < this._legendComponents.length; i++) 
	{ 
		var component = this._legendComponents[i];
		component.clearSelection();
	}
	this._selection = [];

	this.dispatchEvent(new ia.Event(ia.Event.CLEAR_SELECTION, new Object())); // Keep for backwards compatibility but use InteractionEvent from now on.

	this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.SELECTION_CHANGED, this, this._selection));
};

/**
 * Selects the id.
 * 
 * @method clearSelection
 * @param {String} id The id.
 */
ia.InteractionGroup.prototype.select = function(id) 
{
	var index = this._selection.indexOf(id);
	if (index == -1) 
	{
		this._selection.push(id);

		/*var item = new Object();
		item.id = id;
		item.state = ia.ItemLayer.SELECTED;
		this.dispatchEvent(new ia.ItemEvent(ia.ItemEvent.ITEM_CLICK, item));*/

		for (var i = 0; i < this._components.length; i++) 
		{ 
			this._components[i].select(''+id);
		}

		this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.SELECTION_CHANGED, this, this._selection));
	}
};

/**
 * Unselects the id.
 * 
 * @method unselect
 * @param {String} id The id.
 */
ia.InteractionGroup.prototype.unselect = function(id) 
{
	var index = this._selection.indexOf(id);
	if (index != -1) 
	{
		this._selection.splice(index, 1);
		
		/*var item = new Object();
		item.id = id;
		item.state = ia.ItemLayer.UNSELECTED;
		this.dispatchEvent(new ia.ItemEvent(ia.ItemEvent.ITEM_CLICK, item));*/

		for (var i = 0; i < this._components.length; i++) 
		{ 
			this._components[i].unselect(''+id);
		}
		
		this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.SELECTION_CHANGED, this, this._selection));
	}
};

/** 
 * Handles item events.
 * 
 * @method _itemEventHandler
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code> dispatched by a component.
 * @private
 */	
ia.InteractionGroup.prototype._itemEventHandler = function(event) 
{
	var item = event.item;

	if (event.type == ia.ItemEvent.NONE_ITEM_CLICK)
	{
		// Ignore non-item clicks on everything except maps.
		if (event.item.parent instanceof ia.FeatureLayer) this.clearSelection();
	}
	else if (item.parent.isLegendComponent) 
	{
		if (event.type == ia.ItemEvent.ITEM_CLICK && this.selectionMode == "single") {item.parent.unselect(''+item.id);}
		else this._onLegendClassEvent(event, item); 
	}
	else
	{
		this._updateComponents(event, item);
		this._updateLegendClassComponents(event, item);
	}

	this._dispatchInteractionEvent(event.type);
};

/** 
 * Dispatches an interaction event.
 * 
 * @method _dispatchInteractionEvent
 * @param {String} eventType An ia.ItemEvent type.
 * @private
 */	
ia.InteractionGroup.prototype._dispatchInteractionEvent = function(eventType) 
{
	if (eventType == ia.ItemEvent.NONE_ITEM_CLICK
		|| eventType == ia.ItemEvent.ITEM_CLICK)
	{
		//ia.log(this._selection)
		this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.SELECTION_CHANGED, this, this._selection));
	}
	else if (eventType == ia.ItemEvent.ITEM_MOUSE_OUT
		|| eventType == ia.ItemEvent.ITEM_MOUSE_UP 
		|| eventType == ia.ItemEvent.ITEM_MOUSE_OVER)  
	{
		//ia.log(this._highlight)
		this.dispatchEvent(new ia.InteractionEvent(ia.InteractionEvent.HIGHLIGHT_CHANGED, this, [this._highlight]));
	}
};

/** 
 * Updates the legend class components.
 * 
 * @method _onLegendClassEvent
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code> dispatched by a component.
 * @param {Object} item An item.
 * @private
 */	
ia.InteractionGroup.prototype._onLegendClassEvent = function(event, item) 
{
	var id = item.id;
	var parent = item.parent;
	var state = item.state;

	for (var i = 0; i < this._legendComponents.length; i++) 
	{ 
		var component = this._legendComponents[i];
		if (component != parent && parent.thematic == component.thematic)
		{
			if (event.type == ia.ItemEvent.ITEM_MOUSE_OUT
			|| event.type == ia.ItemEvent.ITEM_MOUSE_UP) 
			{
				component.clearHighlight();
			}
			else if (event.type == ia.ItemEvent.ITEM_MOUSE_OVER)
			{
				component.clearHighlight();
				component.highlight(''+id);
			}
			else if (event.type == ia.ItemEvent.ITEM_CLICK)
			{
				if (state == ia.ItemLayer.UNSELECTED) component.unselect(''+id);
				else component.select(''+id);
			}
		}
	}
	
	if (event.type == ia.ItemEvent.ITEM_CLICK)
	{
		// Iterate through the child items belonging to the legend class.
		var childItems = item.legendClass.items;
		var n = childItems.length;
		for (var i = 0; i < n; i++)  {this._updateComponents(event, childItems[i]);}
	}
};

/** 
 * Updates the legend class components
 * 
 * @method _updateLegendClassComponents
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code> dispatched by a component.
 * @param {Object} item An item.
 * @private
 */	
ia.InteractionGroup.prototype._updateLegendClassComponents = function(event, item) 
{	
	for (var i = 0; i < this._legendComponents.length; i++) 
	{ 
		var component = this._legendComponents[i];
		if (event.type == ia.ItemEvent.ITEM_MOUSE_OUT 
		|| event.type == ia.ItemEvent.ITEM_MOUSE_UP) 
		{
			component.clearHighlight();
		}
		else if (event.type == ia.ItemEvent.ITEM_MOUSE_OVER)
		{
			component.clearHighlight();
			var data = component.thematic.getData();
			if (data)
			{
				var dataItem = data[item.id];
				if (dataItem && dataItem.legendClass) 
				{
					var id = dataItem.legendClass.index;
					component.highlight(''+id);
				}
			}
		}
	}
};

/** 
 * Updates the components
 * 
 * @method _updateComponents
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code> dispatched by a component.
 * @param {Object} item An item.
 * @private
 */	
ia.InteractionGroup.prototype._updateComponents = function(event, item) 
{
	var id = item.id;
	var parent = item.parent;
	var state = event.item.state;

	// Clear selection after youve got the item state.
	if (event.type == ia.ItemEvent.ITEM_CLICK && this.selectionMode == "single") this.clearSelection();

	// Add or remove from selection/highlight ids lists.
	if (event.type == ia.ItemEvent.ITEM_CLICK)
	{
		if (state == ia.ItemLayer.UNSELECTED) 
		{
			var index = this._selection.indexOf(id);
			if (index != -1) this._selection.splice(index, 1);
		}
		else this._selection.push(id);
	}
	else if (event.type == ia.ItemEvent.ITEM_MOUSE_OUT || event.type == ia.ItemEvent.ITEM_MOUSE_UP) this._highlight = "";  
	else if (event.type == ia.ItemEvent.ITEM_MOUSE_OVER) this._highlight = id;

	// Iterate through the component list
	for (var i = 0; i < this._components.length; i++) 
	{ 
		var component = this._components[i];
		if (component != parent || event.type == ia.ItemEvent.ITEM_CLICK)
		//if (component != parent || this.selectionMode == "single")
		{
			if (event.type == ia.ItemEvent.ITEM_MOUSE_OUT
			|| event.type == ia.ItemEvent.ITEM_MOUSE_UP)  
			{
				component.clearHighlight();
			}
			else if (event.type == ia.ItemEvent.ITEM_MOUSE_OVER)
			{
				component.clearHighlight();
				component.highlight(''+id);
			}
			if (event.type == ia.ItemEvent.ITEM_CLICK)
			{
				if (state == ia.ItemLayer.UNSELECTED) component.unselect(''+id);
				else component.select(''+id);
			}
		}
	}

	this.dispatchEvent(event); // Keep for backwards compatibility but use InteractionEvent from now on.
};