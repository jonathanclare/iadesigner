/** 
 * Class for data trees.
 *
 * Requires data in the form of a hashtable:
 *
 * ["i1"]{id:"i1", label:"Home", type:"branch", children:["i2", "i3", "i4"]}
 * ["i2"]{id:"i2", label:"Indicator 1", type:"branch", parent:"i1", children:["i5", "i6", "i7"]}
 * ["i5"]{id:"i5", label:"2004", type:"leaf", parent:"i2"}
 *
 * @author J Clare
 * @class ia.DataExplorer
 * @constructor
 * @param {String} id The id of the explorer.
 * @param {Function} callbackFunction Called when a selection is made. 
 */
ia.DataExplorer = function(id, callbackFunction)
{			
	this.id = id;
	this._data = undefined;
	this._treeId = "";
	this.closeBranchesOnSelection = true;

	// A div to contain the explorer.
	this.container = $j("<div id='"+id+"' class='ia-explorer'>");

	// A ScrollBox.
	this.$sb = $j("<div id='"+id+"-scrollbox' class='ia-explorer-scrollbox'>");
	//this._scrollBox = new ia.ScrollBox(this.$sb);
	this.container.append(this.$sb);
	this.$sb.bind("click", function(e) {e.stopPropagation();});

	// A div to contain the data tree.
	this.$tree = $j("<div class='ia-explorer-tree'>");
	this.$sb.append(this.$tree);

	this.filterType = "single";

	if (callbackFunction) this.callbackFunction = callbackFunction;

	var me = this;
	this.container.resize(function(e){me._size();});
};

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.DataExplorer.prototype.id;

/** 
 * The  callback function.  
 *
 * @property callbackFunction
 * @type Function
 */	
ia.DataExplorer.prototype.callbackFunction;

/** 
 * Should the explorer be hidden after selection.
 *
 * @property hideOnSelection
 * @type Boolean
 */
ia.DataExplorer.prototype.hideOnSelection;

/** 
 * Filter explorer.
 *
 * @property isFilterExplorer
 * @type Boolean
 */
ia.DataExplorer.prototype.isFilterExplorer;

/** 
 * Filter type.
 *
 * @property isFilterExplorer
 * @type String
 * @default single
 */
ia.DataExplorer.prototype.filterType;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.DataExplorer.prototype.container;

/**
 * Indicates that other branches should be closed or remain open when a branch is selected.
 * 
 * @property closeBranchesOnSelection
 * @type Boolean
 * @default false
 */
ia.DataExplorer.prototype.closeBranchesOnSelection = false;

/** 
 * Resizes the tree.
 *
 * @method _size
 * @private
 */
ia.DataExplorer.prototype._size = function()
{
	this.$sb.height(this.container.height());
	this.$sb.width(this.container.width());
};

/** 
 * Sets or gets the data.
 *
 * @method data
 * @param {Object} d The data.
 */
ia.DataExplorer.prototype.data = function(d)
{
	if (d != undefined) this._data = d;
	else return this._data
};

/** 
 * Refreshes the explorer.
 *
 * @method refresh
 */
ia.DataExplorer.prototype.refresh = function()
{
	if (this._treeId != "") this.build(this._treeId);
};

/** 
 * Builds the tree for the given item.
 *
 * @method build
 * @param {String} id The item id. 
 */
ia.DataExplorer.prototype.build = function(id)
{
	this._treeId = id;
	if (this._treeId == undefined) this._treeId =  "topLevel";

	this.$tree.empty();
	var o = this._data[this._treeId];
	var n = o.children.length;
	for (var i = 0; i < n; i++) 
	{ 	
		var childId = o.children[i];
		this._buildItem(childId, this.$tree);
	}

	//this._scrollBox.refresh();
};

/** 
 * Builds the item for the given id - along with all its children.
 *
 * @method _buildItem
 * @param {String} id The item id. 
 * @param {JQUERY Element} $parentItem The items parent. 
 * @private
 */
ia.DataExplorer.prototype._buildItem = function(id, $parentItem)
{
	var itemId = String(id).replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.

	var o = this._data[id];

	// Explorer item.
	var $explorerItem = $j("<div id='"+itemId+"' class='ia-explorer-item ia-list-item'>");
	$parentItem.append($explorerItem);

	// Item label.
	var $label = $j("<div class='ia-explorer-label'>").html(o.label);
	$explorerItem.append($label);

	var me = this;
	if (o.type == "branch")
	{
		$explorerItem.addClass("ia-explorer-branch-icon");
		$explorerItem.addClass("ia-explorer-branch");

		// Child items.
		var $childGroup = $j("<div class='ia-explorer-group'>");
		$childGroup.hide();
		$parentItem.append($childGroup);

		$explorerItem.data("childGroup", $childGroup);

		(function() // Execute immediately
		{ 
			var $item = $explorerItem;
			var $childGroup = $childGroup;

			$explorerItem.bind("click", function(e) 
			{	
				e.stopPropagation(); 
				me._toggleBranch($item)
			});
		})();

		var n = o.children.length;
		for (var i = 0; i < n; i++) 
		{ 	
			var childId = o.children[i];
			me._buildItem(childId, $childGroup);
		}
	}
	else // leaf.
	{			
		$explorerItem.addClass("ia-explorer-leaf");

		// Notes button
		if (o.href != undefined)
		{
			var $notesBtn = $j("<div class='ia-explorer-notes-icon'>");
			$explorerItem.prepend($notesBtn);

			(function() // Execute immediately
			{ 
				var link = o.href;

				$notesBtn.bind("click", function(e) 
				{	
					e.stopPropagation();
					ia.callFunction(link, "_blank");
				});
			})();
		}

		(function() // Execute immediately
		{ 
			var $item = $explorerItem;

			$explorerItem.bind("click", function(e) 
			{	
				e.stopPropagation();
				me._selectLeaf($item);
			});
		})(); 
	}
};

/** 
 * Clears any selected items.
 *
 * @method clearSelection
 */
ia.DataExplorer.prototype.clearSelection = function()
{
	this.$tree.find(".ia-explorer-item").removeClass("ia-explorer-selected-item");
	if (this.isFilterExplorer) this.$tree.find(".ia-explorer-leaf").removeClass("ia-filter-explorer-selected-item");
};

/** 
 * Expands the necessary branches to show an item.
 *
 * @method showItem
 * @param {String} id The item id. 
 */
ia.DataExplorer.prototype.showItem = function(id)
{
	var itemId = String(id).replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.

	var $item = this.$tree.find("div[id='"+itemId+"']");
	if ($item) 
	{
		if ($item.hasClass("ia-explorer-branch"))
		{
			this._openBranch($item);
		}
		else if ($item.hasClass("ia-explorer-leaf"))
		{
			// Make this the selected item.
			this.$tree.find(".ia-explorer-leaf").removeClass("ia-explorer-selected-item");
			$item.addClass("ia-explorer-selected-item");
		}
		if (this._data[id] && this._data[id].parent) this.showItem(this._data[id].parent);
	}
};

/** 
 * Selects a leaf item.
 *
 * @method _selectLeaf
 * @param {JQUERY Element} $item The item. 
 * @private
 */
ia.DataExplorer.prototype._selectLeaf = function($item)
{
	var id = $item.attr("id");

	// Special case for filter explorer
	if (this.isFilterExplorer) 
	{
		if ($item.hasClass("ia-filter-explorer-selected-item"))
		{
			id = id+"~clearFilter";
			$item.removeClass("ia-explorer-selected-item");
			$item.removeClass("ia-filter-explorer-selected-item");
		}
		else
		{
			if (this.filterType == "single") 
			{
				this.$tree.find(".ia-explorer-item").removeClass("ia-explorer-selected-item");
				this.$tree.find(".ia-explorer-leaf").removeClass("ia-filter-explorer-selected-item");
			}
			$item.addClass("ia-explorer-selected-item");
			$item.addClass("ia-filter-explorer-selected-item");
		}
	}
	else
	{
		// Make this the selected item.
		this.$tree.find(".ia-explorer-item").removeClass("ia-explorer-selected-item");
		$item.addClass("ia-explorer-selected-item");
	}

	var itemId = String(id).replace(/#quote#/g, "'").replace(/#double-quote#/g, '"'); // Fix for quotations breaking ids.
	if (this.callbackFunction) this.callbackFunction.call(null, itemId);
};

/** 
 * Toggles a branch item.
 *
 * @method _toggleBranch
 * @param {JQUERY Element} $item The item. 
 * @private
 */
ia.DataExplorer.prototype._toggleBranch = function($item)
{
	if ($item.hasClass("ia-explorer-branch"))
	{
		this.$tree.find(".ia-explorer-item").removeClass("ia-explorer-selected-item");

		if ($item.data("childGroup").is(":visible"))  
		{
			this._closeBranch($item);
		}
		else  
		{
			// Make this the selected item.
			$item.addClass("ia-explorer-selected-item");
			this._openBranch($item);
		}
	}
};

/** 
 * Closes a branch item.
 *
 * @method _closeBranch
 * @param {JQUERY Element} $item The item. 
 * @private
 */
ia.DataExplorer.prototype._closeBranch = function($item)
{
	if ($item.hasClass("ia-explorer-branch"))
	{
		// Change to open icon.
		$item.addClass("ia-explorer-branch-icon");
		$item.removeClass("ia-explorer-branch-expanded-icon");

		// Close the child items.
		var me = this;
		$item.data("childGroup").slideUp('fast', function()  {me._size();});
	}
};

/** 
 * Opens a branch item.
 *
 * @method _openBranch
 * @param {JQUERY Element} $item The item. 
 * @private
 */
ia.DataExplorer.prototype._openBranch = function($item)
{
	if ($item.hasClass("ia-explorer-branch"))
	{
		// Close any open siblings.
		if (this.closeBranchesOnSelection)
		{
			$item.siblings(".ia-explorer-branch-expanded-icon").each(function(index) 
			{
				$j(this).addClass("ia-explorer-branch-icon");
				$j(this).removeClass("ia-explorer-branch-expanded-icon");
				$j(this).data("childGroup").slideToggle('fast', function() {});
			});
		}

		// Change to close icon.
		$item.removeClass("ia-explorer-branch-icon");
		$item.addClass("ia-explorer-branch-expanded-icon");

		// Slide open the child items.
		var me = this;
		$item.data("childGroup").slideDown('fast', function()  {me._size();});
	}
};