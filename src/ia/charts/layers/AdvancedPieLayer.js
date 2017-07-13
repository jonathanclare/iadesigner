/** 
 * The base class for pie layers.
 *
 * @author J Clare
 * @class ia.AdvancedPieLayer
 * @extends ia.PieLayer
 * @constructor
 */
ia.AdvancedPieLayer = function()
{
	ia.AdvancedPieLayer.baseConstructor.call(this);
};
ia.extend(ia.PieLayer, ia.AdvancedPieLayer);
	
/**
 * Specifies the id of the data item to render.
 *
 * @property itemId
 * @type String
 */
ia.AdvancedPieLayer.prototype.itemId;

/**
 * Specifies the name of the data item to render.
 *
 * @property itemName
 * @type String
 */
ia.AdvancedPieLayer.prototype.itemName;
	
/**
 * Updates the data.
 *
 * @method update
 */
ia.AdvancedPieLayer.prototype.update = function() 
{
	// Clear the items.
	this.itemArray = [];
	this.clearItems();
	
	var data = this.getData();
	if (data && this.itemId)
	{
		// Plot indicators or indicator dates.
		if (data.dates)
		{
			var dateLength = data.dates.length;
			for (var i = 0; i < dateLength; i++)
			{
				var date = data.dates[i];
				var dataItem = data[date][this.itemId];
		
				if (dataItem)
				{
					this.itemName = dataItem.name;
					var legendClass = this.thematic.getClass(date);
					if (legendClass)
					{
						// Create a new chart item.
						var chartItem = {};
						chartItem.state = ia.ItemLayer.UNSELECTED;
						if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
						chartItem.parent = this;
						chartItem.layer = this;

						chartItem.id = legendClass.index;
						chartItem.legendClass = legendClass;
						chartItem.value = dataItem.value;
						chartItem.formattedValue = dataItem.value_formatted;
						chartItem.label = legendClass.getLabel() + " : " + chartItem.value;
						chartItem.color = legendClass.color;

						this.items[chartItem.id] = chartItem;
						this.itemArray.push(chartItem);
					}
				}
			}
		}
		else
		{
			// Plot associates
			var dataItem = data[this.itemId];
			if (dataItem)
			{
				this.itemName = dataItem.name;
				var classes = this.thematic.getClasses()
				for (var i = 0; i < classes.length; i++) 
				{
					var legendClass = classes[i];
					var associateName = legendClass.value;
					
					// Create a new chart item.
					var chartItem = {};
					chartItem.state = ia.ItemLayer.UNSELECTED;
					if (this.selectionIds.indexOf(chartItem.id) != -1 ) chartItem.state = ia.ItemLayer.SELECTED;
					chartItem.parent = this;
					chartItem.layer = this;
					chartItem.id = legendClass.index;
					chartItem.legendClass = legendClass;
					chartItem.value = dataItem[associateName];
					chartItem.formattedValue = dataItem[associateName+'_formatted'];
					chartItem.label = legendClass.getLabel() + " : " + chartItem.value;
					chartItem.color = legendClass.color;

					this.items[chartItem.id] = chartItem;
					this.itemArray.push(chartItem);
				}
			}
		}
	}
};