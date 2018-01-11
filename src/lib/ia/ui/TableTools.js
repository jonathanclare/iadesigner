/**
 * <code>ia.TableTools</code> is a set of table tools that can be attached to a table.
 *
 * @author J Clare
 * @class ia.TableTools
 * @constructor
 * @param {ia.DataGroup} dataGroup The associated data group.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 */
ia.TableTools = function(dataGroup, interactionGroup)
{	
	var me = this;

	me._clearBtn = undefined;
	me._filterBtn = undefined;
	me._interactionGroup = interactionGroup;
	me._dataGroup = dataGroup;

	// Calculated border radius.
	me._borderRadius = 0;
	
	// Calculated border-radius for elements inside panels.
	me._borderRadius = parseInt($j(".ia-panel").css("border-top-left-radius")) - 1;
	if (me._borderRadius < 0) me._borderRadius = 0;

	// Create the container element.
	me.container = $j('<div class="ia-table-toolbar"></div>');
	me.container.css("border-bottom-left-radius", me._borderRadius+"px");
	me.container.css("border-bottom-right-radius", me._borderRadius+"px");

	// Listen for the selection changing.
	interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, this._updateToolbar.bind(this));

	// Listen for the filter changing.
	dataGroup.addEventListener(ia.FilterEvent.FILTER_CHANGED, this._updateToolbar.bind(this));
};

/** 
 * Updates the tool bar.
 * 
 * @property updateToolbar
 * @private
 */
ia.TableTools.prototype._updateToolbar = function() 
{
	if (this._interactionGroup.getSelection().length > 0) 
	{
		if (this._clearBtn) 
			this._clearBtn.removeClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled').addClass('ia-list-item ia-cross-btn');
		if (this._filterBtn) 
			this._filterBtn.removeClass('ia-cross-btn ia-toolbar-text-btn-disabled').addClass('ia-list-item ia-cross-btn-disabled');
	}
	else
	{
		if (this._clearBtn) 
			this._clearBtn.removeClass('ia-list-item ia-cross-btn').addClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled');
		if (this._filterBtn)
		{
			if (this._dataGroup.getFilteredFeatures().length > 0)  
				this._filterBtn.removeClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled').addClass('ia-list-item ia-cross-btn');
			else 
				this._filterBtn.removeClass('ia-list-item ia-cross-btn').addClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled');
		}
	}
};
	
/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.TableTools.prototype.container;

/** 
 * Allows a custom function to be set for when the filter button is pressed.
 * 
 * @property filterFunction
 * @type Function
 */
ia.TableTools.prototype.filterFunction = function() {};

/** 
 * Allows a custom function to be set for when the clear button is pressed.
 * 
 * @property filterFunction
 * @type Function
 */
ia.TableTools.prototype.clearFunction = function() {};

/**
 * The text for the clear button.
 * 
 * @property clearButtonText
 * @type String
 */
ia.TableTools.prototype.clearButtonText;

/**
 *  The text for the filter button.
 * 
 * @property filterButtonText
 * @type String
 */	
ia.TableTools.prototype.filterButtonText;

/** 
 * Render the toolbar.
 *
 * @method render
 */
ia.TableTools.prototype.render = function() 
{
	this.container.empty();

	var me = this;
	
	// Add clear selection button
	if (this.clearButtonText)
	{
		this._clearBtn = $j("<div class='ia-toolbar-text-btn ia-list-item ia-toolbar-text-btn-disabled ia-cross-btn-disabled'>").html(this.clearButtonText);
		this.container.append(this._clearBtn);
		this._clearBtn.bind("click", function(e)  
		{
			e.stopPropagation();
			e.preventDefault();
			me.clearFunction();
		});
		this._clearBtn.css("border-radius", this._borderRadius+"px");
	}

	// Add filter button 
	if (this.filterButtonText)
	{
		this._filterBtn = $j("<div class='ia-toolbar-text-btn ia-list-item ia-toolbar-text-btn-disabled ia-cross-btn-disabled'>").html(this.filterButtonText);
		this.container.append(this._filterBtn);
		this._filterBtn.bind("click", function(e)  
		{
			e.stopPropagation();
			e.preventDefault();
			me.filterFunction();
		});
		this._filterBtn.css("border-radius", this._borderRadius+"px");
	}

	this._updateToolbar();
};