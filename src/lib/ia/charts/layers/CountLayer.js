/** 
 * The base class for count bar layers.
 *
 * @author J Clare
 * @class ia.CountLayer
 * @extends ia.BarLayer
 * @constructor
 */
ia.CountLayer = function()
{
	ia.CountLayer.baseConstructor.call(this);

	this.isLegendComponent = true;
};
ia.extend(ia.BarLayer, ia.CountLayer);

/**
 * Specifies a thematic for the pie layer.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.CountLayer.prototype.thematic;

/**
 * Indicates this is a legend component.
 *
 * @property isLegendComponent
 * @type Boolean
 * @default true
 */
ia.CountLayer.prototype.isLegendComponent;

/**
 * Updates the data.
 *
 * @method update
 */
ia.CountLayer.prototype.update = function() 
{
	// Check if the data has changed
	if (this.map && this.dataChanged)
	{
		// Get the data.
		var data = this.getData()

		// Clear the items.
		this.itemArray = [];
		this.clearItems();
		
		this.minValue = Infinity;
		this.maxValue = -Infinity;
		
		var classes = this.thematic.getClasses();
		for (var i = 0; i < classes.length; i++) 
		{
			var legendClass = classes[i];

			// Create a new chart item.
			var chartItem = {};
			chartItem.id = legendClass.index;
			chartItem.legendClass = legendClass;
			chartItem.color = legendClass.color;
			chartItem.value = legendClass.items.length;
			chartItem.state = ia.ItemLayer.UNSELECTED;
			if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
			chartItem.parent = this;
			chartItem.layer = this;
			chartItem.label = legendClass.getLabel() + " : " + chartItem.value;
			
			chartItem.rect = new ia.Rectangle();
			chartItem.hitArea = new ia.Rectangle();

			this.items[chartItem.id] = chartItem;
			this.itemArray.push(chartItem);

			// Get the min and max bar values for the layer.
			this.minValue = Math.min(this.minValue, chartItem.value);
			this.maxValue = Math.max(this.maxValue, chartItem.value);
		}
		
		// Sort items if in sort direction.
		if (this.sortDirection != undefined)
		{
			var dir;
			if (this.sortDirection == "ascending") dir = 1
			else dir = -1;
			
			this.itemArray.sort(function(a, b)
			{
				if (a.value < b.value) return -dir;
				if (a.value > b.value) return dir;
				return 0; 
			});
		}
		this.dataChanged = false;
	}
};

/** 
 * Displays the tip for the passed item
 * 
 * @method showTip
 * @param {Object} item The map item.	 
 * @param {ia.ItemEvent} event An <code>ia.ItemEvent</code>.
 */
ia.CountLayer.prototype.showTip = function(item, event)
{
	this.map.datatip.text(item.label);

	// Position above the bar.
	var px,py;
	
	if (event.isTouchEvent)
	{
		px = event.x - (this.map.datatip.getWidth() / 2);
		py = event.y - (this.map.datatip.getHeight() + 30);
	}
	else
	{
		if (this.map.orientation == "vertical")
		{
			px = (item.rect.x + (item.rect.width / 2)) -  (this.map.datatip.getWidth() / 2);

			if (item.value < 0)
				py = item.rect.y + item.rect.height + 5;
			else
				py = item.rect.y - this.map.datatip.getHeight() - 5;
		}
		else
		{
			if (item.value < 0)
				px = item.rect.x - (this.map.datatip.getWidth() + 5);
			else
				px = (item.rect.x + item.rect.width) + 5;

			py = (item.rect.y + (item.rect.height / 2)) -  (this.map.datatip.getHeight() / 2);
		}
	}
	this.map.datatip.position(px, py);
	this.map.datatip.show();
};