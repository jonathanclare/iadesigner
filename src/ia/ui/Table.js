/** 
 * A class for rendering a data table.
 *
 * @author J Clare
 * @class ia.Table
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the table.
 */
ia.Table = function(id)
{		
	ia.Table.baseConstructor.call(this);

	this.id = id;
	this._data = undefined;
	this._cId = undefined;
	this._sDirection = undefined;
	this._selectedRows = new Object();
	this._scrollTimeout = undefined;	
	this._highlightRows = new Object();
	this._stickyIds = new Array();

	this.showLegendColor = true;
	this.allowUserSorting = true;

	// A div to contain the table and allow correct scrolling.
	this.container = $j("<div id='"+id+"' class='ia-table'>"); 

	// Use this for identifying unique table rows.
	this._containerId = id + "-";
	
	// Calculated border-radius for elements inside panels.
	this._borderRadius = parseInt($j(".ia-panel").css("border-top-left-radius")) - 1;
	if (this._borderRadius < 0) this._borderRadius = 0;

	this.$tableCorner = $j("<span class='ia-table-header ia-table-header-corner'>");
	this.$tableCorner.css("border-top-right-radius", this._borderRadius+"px");
	this.container.append(this.$tableCorner);
			
	// The table used to render the headers.
	this.$tableHeaders = $j("<table>");
	this.container.append(this.$tableHeaders);
	
	// The table used to render the data.
	this.$tableContainer = $j("<div id='"+id+"-container' class='ia-table-scrollbox'>"); 
	this._scrollBox = new ia.ScrollBox(this.$tableContainer);
	this.container.append(this.$tableContainer);
	
	this.$table = $j("<table>");
	this.$tableContainer.append(this.$table);
	this._addMouseEvents();
	
	var resizeTimeout;
	var me = this;
	this.container.resize(function(e) 
	{		
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function()
		{
			clearTimeout(resizeTimeout);
			me._size();

		}, 500);
	});
};
ia.extend(ia.EventDispatcher, ia.Table);

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.Table.prototype.id;

/** 
 * The item selection color.
 * 
 * @property selectionColor
 * @type String
 */
ia.Table.prototype.selectionColor;

/** 
 * The item highlight color.
 * 
 * @property highlightColor
 * @type String
 */
ia.Table.prototype.highlightColor;

/** 
 * Should the legend color be displayed.
 * 
 * @property showLegendColor
 * @type Boolean
 * @default true
 */
ia.Table.prototype.showLegendColor;

/** 
 * Should user sorting be allowed.
 * 
 * @property allowUserSorting
 * @type Boolean
 * @default true
 */
ia.Table.prototype.allowUserSorting;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.Table.prototype.container;

/**
 * The columns to be rendered. 
 *
 * The columns are an array with the following structure:
 * They dictate which columns should be used from the data.
 * The id points to the id in the data.
 *
 * [{id:"name", label:"Features", type:"categoric'"},
 * {id:"value", label:"Indicator", type:"numeric'"},
 * {id:"associate1", label:"Associate 1", type:"numeric'"},
 * {id:"associate2", label:"Associate 2", type:"categoric'"}]
 * 
 * @property columns
 * @type JSON
 */
ia.Table.prototype.columns;

/** 
 * Sizes all the element to make the scrolling work.
 *
 * @method _size
 * @private
 */
ia.Table.prototype._size = function()
{
	var containerWidth = this.container.width()
	var scrollBarWidth = this.$tableContainer.get(0).offsetWidth - this.$tableContainer.get(0).clientWidth;
	
	var tableWidth = containerWidth - scrollBarWidth
	this.$table.width(tableWidth);
	this.$tableHeaders.width(tableWidth);
	
	var containerHeight = this.container.height();
	var headerHeight = this.$tableHeaders.outerHeight();
	var contentHeight = containerHeight - headerHeight;
	this.$tableContainer.height(contentHeight);
	
	//var bgcolor = $j(".ia-table-header").css("background-color");
	//this.$tableCorner.css("background-color",bgcolor)
	this.$tableCorner.width(scrollBarWidth);
	this.$tableCorner.height(headerHeight);
};

/**
 * Gets a data object for the table.
 *
 * @method getData
 * @return ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.Table.prototype.getData = function()
{
	return this._data;
};

/**
 * Sets a data object for the table.
 *
 * @method setData
 * @param value ["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.Table.prototype.setData = function(value)
{
	this._data = value;
};

/**
 * Renders the table.
 *
 * @method render
 */
ia.Table.prototype.render = function(arrRowOrder) 
{		
	var me = this;

	// Empty the previous table.
	this.$table.empty();
	this.$tableHeaders.empty();

	// Add the col section.
	var thead = $j("<thead>");
	var tr = $j("<tr>");
	thead.append(tr)
	this.$tableHeaders.append(thead);

	// Iterate through each col.
	var displayHeaders = false;
	var col;
	var nCol = this.columns.length;
	for (var i = 0; i < nCol; i++) 
	{
		col = this.columns[i];
		var colWidth = col.width*110;

		// The col label.
		var thLabel = $j("<th id='"+col.id+"' class='ia-table-header' title='"+col.label+"' style='width:"+colWidth+"%'>").html(col.label);
		thLabel.data('type', col.type);

		if (col.label != "") displayHeaders = true;

		if (i == 0) thLabel.css("border-top-left-radius", this._borderRadius+"px");

		tr.append(thLabel);

		if (this.allowUserSorting)
		{
			// Add Mouse Events - Click sort col.
			(function() // Execute immediately
			{ 
				var colId = col.id;

				thLabel.click
				(
					function () 
					{
						// Get the sort direction.
						var sortDirection = "ascending";
						if ($j(this).is(".sort-asc")) sortDirection = "descending";

						// Call the sort function.
						me.sort(colId, sortDirection);
					}
				);
			})();
		}
	}

	// Hide the headers if no labels have been defined for them.
	if (displayHeaders == false) thead.css("display", "none");
	
	// Dont use jquery for table rows as its too slow for large tables.
	var r = new Array(), i = -1;
	var rowData;
	var rowIndex = 0;
	var cellData;
	var formattedData;
	var colWidth;
	
	r[++i] = '<colgroup>';
	for (var j = 0; j < nCol; j++) 
	{
		col = this.columns[j];
		colWidth = col.width*110;
		r[++i] = "<col style='width:"+colWidth+"%'>";
	}
	r[++i] = '</colgroup>';

	r[++i] = '<tbody>';

	if (arrRowOrder == undefined || (arrRowOrder != undefined && arrRowOrder.length == 0))
	{
		arrRowOrder = [];
		for(id in this._data) {arrRowOrder.push(id);}
	}

	// Iterate through each row.
	for (var k = 0; k < arrRowOrder.length; k++) 
	{
		var id = arrRowOrder[k];
		rowData = this._data[id];
		if (rowData != undefined)
		{
			var rowId = String(id).replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
			
			// Style even and odd rows differently.
			if (rowIndex%2 == 0) 	
				r[++i] = "<tr id='"+this._containerId+rowId+"' class='ia-table-row ia-table-row-even'>";
			else  			
				r[++i] = "<tr id='"+this._containerId+rowId+"' class='ia-table-row ia-table-row-odd'>";
			rowIndex++;					
					
			var itemColor = undefined;
			var itemSize = 0;
			if (rowData.color && this.showLegendColor) 
			{
				itemColor = ia.Color.toRGBA(rowData.color, 1);
				itemSize = rowData.symbolSize;
			}
				
			// Iterate through each table cell in the row - match to columns.
			for (var j = 0; j < nCol; j++) 
			{
				col = this.columns[j];
				
				if (col.id.indexOf("~") != -1)
				{
					var colId = col.id.split("~")[0];
					var suffix = col.id.split("~")[1];
					cellData = this["data"+suffix][id][colId];
					formattedData = this["data"+suffix][id][colId+"_formatted"];
				}
				else		
				{
					cellData = rowData[col.id];
					formattedData = rowData[col.formattedId];
				}
				
				if (col.type  == "categoric") 
					r[++i] = "<td class='ia-table-cell ia-table-cell-categoric' title='"+formattedData+"' data-value='"+formattedData+"'>";
				else  
					r[++i] = "<td class='ia-table-cell ia-table-cell-numeric' title='"+formattedData+"' data-value='"+cellData+"'>";
			
				if (itemColor && col.id == "name" && itemSize > 0)
				{
					r[++i] = "<span class='ia-table-legend-swatch' style='background-color:"+itemColor+";'></span>";
				}
				if (rowData.href && col.id == "name")
				{
					r[++i] = "<span id='"+rowData.href+"' class='ia-table-notes-icon'></span>";
				}
			
				r[++i] = formattedData;
				r[++i] = "</td>";
			}
			
			r[++i] = "</tr>";
		}
	}
	
	r[++i] = '</tbody>';
	this.$table.append(r.join(""));
	
	this._scrollBox.refresh();
	
	this._size();
	
	// If sort has been set.
	if (this._cId != undefined) this.sort(this._cId, this._sDirection);
	
	this.renderSelection();
};

/** 
 * Exports the data in the table.
 * 
 * @method exportData
 * @return {String} A data string.
 */
ia.Table.prototype.exportData = function()
{
	// Dont use jquery for table rows as its too slow for large tables.
	var nCol = this.columns.length;
	var r = new Array(), i = -1;
	var rowData;
	var cellData;
	var formattedData;
	
	// Iterate through each header.
	for (var j = 0; j < nCol; j++) 
	{
		var col = this.columns[j];
		if (j > 0) r[++i] = ';'
		r[++i] = '"'+col.label+'"';
	}
	r[++i] = '\n';
	
	// If rows are selected only return selected rows.
	// Otherwise return all rows.
	var selLength = Object.keys(this._selectedRows).length;
	if (selLength > 0)
	{	
		for (id in this._selectedRows)
		{
			var rowId = String(id).replace(/#quote#/g, "'").replace(/#double-quote#/g, '"'); // Fix for quotations breaking ids.
			rowData = this._data[rowId];

			for (var j = 0; j < nCol; j++) 
			{
				col = this.columns[j];
				
				if (col.id.indexOf("~") != -1)
				{
					var colId = col.id.split("~")[0]
					var suffix = col.id.split("~")[1]
					cellData = this["data"+suffix][rowId][colId];
					formattedData = this["data"+suffix][rowId][colId+"_formatted"];
				}
				else		
				{
					cellData = rowData[col.id];
					formattedData = rowData[col.formattedId];
				}

				if (j > 0) r[++i] = ';'
				if (ia.isNumber(cellData)) r[++i] = cellData;  
				else r[++i] = '"'+formattedData+'"';
			}

			r[++i] = '\n';
		};
	}
	else
	{
		for (rowId in this._data)
		{
			rowData = this._data[rowId];

			for (var j = 0; j < nCol; j++) 
			{
				col = this.columns[j];

				if (col.id.indexOf("~") != -1)
				{
					var colId = col.id.split("~")[0]
					var suffix = col.id.split("~")[1]
					cellData = this["data"+suffix][rowId][colId];
					formattedData = this["data"+suffix][rowId][colId+"_formatted"];
				}
				else		
				{
					cellData = rowData[col.id];
					formattedData = rowData[col.formattedId];
				}

				if (j > 0) r[++i] = ';'
				if (ia.isNumber(cellData)) r[++i] = cellData;  
				else r[++i] = '"'+formattedData+'"';
			}

			r[++i] = '\n';
		};
	}
	var tableString = r.join("");
	return tableString;

	/*var htmlString;
	if (txt != undefined)
	{
		htmlString = '<div style="font-family:Verdana;font-size:12px;color:#888888;">'+txt+'</div>'
		htmlString += '<p><textarea rows="25" cols="60">'+tableString+'</textarea></p>';
	}
	else htmlString = '<textarea rows="25" cols="60">'+tableString+'</textarea>';
	window.open().document.write(htmlString);*/
};

/** 
 * Renders the selection.
 *
 * @method renderSelection
 */
ia.Table.prototype.renderSelection = function()
{
	for (var rowId in this._selectedRows)
	{	
		//var row = $j("#"+this._containerId+rowId);
		var row = $j("[id='"+this._containerId+rowId+"']");
		row.addClass("ia-table-row-select");
		//var c = ia.Color.adjustSV(this.selectionColor,30,100);
		var c = ia.Color.shade(this.selectionColor,0.68);
		row.css("background-color", c);
	}
};

/**
 * Adds mouse events to the passed jquery object.
 * Uses delegation to reduce number of events added to rows and rendering time!
 *
 * @method _addMouseEvents
 * @param {JQUERY Element} obj The jquery object.
 * @private
 */
ia.Table.prototype._addMouseEvents = function() 
{	
	var me = this;

	// Mouseover.
	this.$table.delegate('tr', 'mouseover', function(e)
	{
		var id = $j(this).attr("id").substring(me._containerId.length);
		me._highlightRows[id] = $j(this);

		if ($j(this).hasClass("ia-table-row-select")) 
		{
			$j(this).addClass("ia-table-row-highlight-select");
				
			//var c = ia.Color.adjustSV(me.selectionColor,40,100);
			var c = ia.Color.shade(me.selectionColor,0.64);
		}
		else 
		{
			$j(this).addClass("ia-table-row-highlight");
			//var c = ia.Color.adjustSV(me.highlightColor,20,100);
			var c = ia.Color.shade(me.highlightColor,0.7);
		}

		$j(this).css("background-color", c);

		me._dispatchItemEvent(id, ia.ItemEvent.ITEM_MOUSE_OVER, ia.ItemLayer.ROLLOVER);
	});
	// Mouseout
	this.$table.delegate('tr', 'mouseout', function(e)
	{
		var id = $j(this).attr("id").substring(me._containerId.length);
		delete me._highlightRows[id];

		$j(this).removeClass("ia-table-row-highlight");
		if ($j(this).hasClass("ia-table-row-highlight-select"))
		{
			$j(this).removeClass("ia-table-row-highlight-select").addClass("ia-table-row-select");
			me._dispatchItemEvent(id, ia.ItemEvent.ITEM_MOUSE_OUT, ia.ItemLayer.SELECTED);
				
			//var c = ia.Color.adjustSV(me.selectionColor,30,100);
			var c = ia.Color.shade(me.selectionColor,0.68);
		}
		else
		{
			me._dispatchItemEvent(id, ia.ItemEvent.ITEM_MOUSE_OUT, ia.ItemLayer.UNSELECTED);
		
			var c = "";
		}

		$j(this).css("background-color", c);
	});
	// Toggle.
	this.$table.delegate('tr', "click", function(e)
	{
		var id = $j(this).attr("id").substring(me._containerId.length);

		// Selection.
		if ($j(this).hasClass("ia-table-row-select") || $j(this).hasClass("ia-table-row-highlight-select"))
		{
			$j(this).removeClass("ia-table-row-select").removeClass("ia-table-row-highlight-select"); 

			delete me._selectedRows[id];
			me._dispatchItemEvent(id, ia.ItemEvent.ITEM_CLICK, ia.ItemLayer.UNSELECTED);
		
			var c = "";
		}
		else
		{
			$j(this).removeClass("ia-table-row-highlight").addClass("ia-table-row-highlight-select");

			me._selectedRows[id] = id;
			me._dispatchItemEvent(id, ia.ItemEvent.ITEM_CLICK, ia.ItemLayer.SELECTED);
				
			//var c = ia.Color.adjustSV(me.selectionColor,40,100);				
			var c = ia.Color.shade(me.selectionColor,0.64);
		}

		$j(this).css("background-color", c);
	});

	// Notes.
	this.$table.delegate('span.ia-table-notes-icon', "click", function(e)
	{
		e.stopPropagation();
		var link = $j(this).attr("id")
		window.open(link, "_blank");
	});
	this.$table.delegate('span.ia-table-notes-icon', 'mouseover touchstart', function(e)
	{
		e.stopPropagation();
	});
};

/**
 * Sorts the table. The table must be rendered before it can be sorted.
 *
 * @method sort
 * @param {Number} colIndex The id of the column to sort by.
 * @param {String} sortDirection The sort direction "ascending" or "descending". Default is "ascending".
 */
ia.Table.prototype.sort = function(colId, sortDirection)
{	
	var colIndex = this._getColumnIndex(colId);
	if (colIndex != -1)
	{
		this._cId = colId;
		this._sDirection = sortDirection;

		if (sortDirection != undefined) sortDirection = sortDirection.toLowerCase()

		var dir = 1;
		if (sortDirection == "descending") dir = -1;

		// Get the sort col element from the given column index.
		var th = this.$tableHeaders.find("th:eq("+colIndex+")");

		// Remove any previous sort desc/asc styles.
		this.$tableHeaders.find("th").removeClass("sort-asc").removeClass("sort-desc");

		// Style col according to the sort direction.
		var sortTextValue;
		if (dir == 1) 
		{
			th.addClass("sort-asc");
			sortTextValue = Infinity;
		}
		else 
		{
			th.addClass("sort-desc");
			sortTextValue = -Infinity;
		}

		// Set the sort function needed depending on the data type.
		var sortFunction;

		// Alphabetical sort.
		if (th.data("type") == "categoric")
		{
			sortFunction = function(text)
			{
				return text.toUpperCase();
			}
		}
		// Numerical sort is default.
		else 
		{
			sortFunction = function(text)
			{
				var key = parseFloat(text);
				return isNaN(key) ? sortTextValue : key;
			}
		}

		// Get the table rows as an array of DOM nodes.
		var sortedRows = new Array();
		var rows = this.$table.find("tbody > tr").get();

		// Do expensive sort work and store sort function in a new 'sortKey' property.
		var cellData
		var n = rows.length;
		for (var i = 0; i < n; i++) 
		{
			cellData = $j(rows[i].childNodes[colIndex]).attr("data-value");
			rows[i].sortKey = sortFunction(cellData);
		}

		// Speeds up the sort.
		var save = Object.prototype.toString;
		Object.prototype.toString = function () {return this.key;};

		// Sort the rows.
		rows.sort(function(a, b)
		{
			if (a.sortKey < b.sortKey) return -dir;
			if (a.sortKey > b.sortKey) return dir;
			return 0;
		});

		// Speeds up the sort. Reset.
		Object.prototype.toString = save;

		// Append the rows in new position (append moves rather than clones).
		for (var i = 0; i < n; i++) 
		{
			sortedRows.push(rows[i]);
			rows[i].sortKey = null;
		}
		this.$table.children('tbody').append(sortedRows);

		// Need to re-apply alternate row colors after sort.
		this.$table.find("tbody > tr.ia-table-row:odd").removeClass("ia-table-row-even").addClass("ia-table-row-odd");
		this.$table.find("tbody > tr.ia-table-row:even").removeClass("ia-table-row-odd").addClass("ia-table-row-even");

		// Bring any sticky rows to the top.
		this.promoteToTop(this._stickyIds);
	}
};

/**
 * Sticks a list of row ids to the the top of the table.
 *
 * @method stickToTop
 * @param {String[]} ids The list of ids.
 */
ia.Table.prototype.stickToTop = function(ids)
{	
	this._stickyIds = ids.concat();
	this.promoteToTop(this._stickyIds);
};

/**
 * Promotes a list of row ids to the the top of the table.
 *
 * @method promoteToTop
 * @param {String[]} ids The list of ids.
 */
ia.Table.prototype.promoteToTop = function(ids)
{	
	var n = ids.length;
	for (var i = n-1; i >= 0; i--) 
	{
		var row = $j("tr[id='"+this._containerId+ids[i]+"']");
		if (row) this.$table.prepend(row);
	}
};

/**
 * Selects all the text in the table.
 *
 * @method selectText
 */
ia.Table.prototype.selectText = function() 
{
	var t = this.container.get(0);
	var body = document.body;
	
	if (body.createTextRange) 
	{
		range = body.createTextRange();
		range.moveToElementText(t);
		range.select();
	} 
	else if (document.createRange && window.getSelection) 
	{
		sel = window.getSelection();
		sel.removeAllRanges();
		var range = document.createRange();
		range.selectNodeContents(t);
		sel.addRange(range); 
	}
};

/**
 * Dispatches item events.
 *
 * @method _dispatchItemEvent
 * @param {String} id The id.
 * @param {String} eventType The event type.
 * @param {String} state The state.
 * @private
 */
ia.Table.prototype._dispatchItemEvent = function(id, eventType, state)
{
	var rowId = String(id).replace(/#quote#/g, "'").replace(/#double-quote#/g, '"'); // Fix for quotations breaking ids.
	var item = new Object();
	item.id = rowId;
	item.state = state;
	item.parent = this;
	this.dispatchEvent(new ia.ItemEvent(eventType, item));
};

/**
 * Returns the column index for the given column id.
 *
 * @method _getColumnIndex
 * @param {String} colId The column id.
 * @return {Number} The index of the column (first column is 0).
 * @private
 */
ia.Table.prototype._getColumnIndex = function(colId)
{
	// Iterate through each col.
	var colIndex = -1;
	for (var i = 0; i < this.columns.length; i++) 
	{
		if (this.columns[i].id == colId)
		{
			colIndex = i;
			break;
		}
	}
	return colIndex;
};

/**
 * Selects a row.
 *
 * @method select
 * @param {String} rowId The id of the row to select.
 */	
ia.Table.prototype.select = function(rowId)
{	
	var rowId = String(rowId).replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.

	var row = $j("tr[id='"+this._containerId+rowId+"']");
	row.addClass("ia-table-row-select");
	this._selectedRows[rowId] = rowId;
	
	//var c = ia.Color.adjustSV(this.selectionColor,30,100);
	var c = ia.Color.shade(this.selectionColor,0.68);
	row.css("background-color", c);

	// Use this for when the legend or pie chart are
	// clicked which results in a massive amount of scrolling
	// and slows down the selection.
	clearTimeout(this._scrollTimeout);
	var me = this;
	this._scrollTimeout = setTimeout(function()
	{
		clearTimeout(me._scrollTimeout);
		me._scrollIntoView(row);
	}, 500);
};
	
/**
 * Scrolls a row into view.
 *
 * @method _scrollIntoView
 * @param {JQUERY Element} element The row as a jquery object.
 * @private
 */	
ia.Table.prototype._scrollIntoView = function(element) 
{
	var ele = element.get(0);
	if (ele != undefined)
	{
		if (ia.IS_TOUCH_DEVICE) 
		{
			this._scrollBox.scrollToElement(ele);
		}
		else
		{
			var containerTop = this.$tableContainer.scrollTop(); 
			var containerBottom = containerTop + this.$tableContainer.height(); 
			var elemTop = ele.offsetTop;
			var elemBottom = elemTop + element.height(); 
			if ((elemBottom > containerBottom) || (elemTop < containerTop))  this.$tableContainer.scrollTop(elemTop);
		}
	}
};

/**
 * Unselects a row.
 *
 * @method unselect
 * @param {String} rowId The id of the row to unselect.
 */
ia.Table.prototype.unselect = function(rowId)
{	
	var rowId = String(rowId).replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
	var row = $j("tr[id='"+this._containerId+rowId+"']");
	row.removeClass("ia-table-row-select");
	delete this._selectedRows[rowId];

	var c = "";
	row.css("background-color", c);
};
	
/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.Table.prototype.clearSelection = function()
{	
	for (var rowId in this._selectedRows) 
	{
		this.unselect(rowId);
	}
};
	
/**
 * Hightlights a row.
 *
 * @method highlight
 * @param {String} rowId The id of the row to select.
 */
ia.Table.prototype.highlight = function(rowId)
{		
	var rowId = String(rowId).replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
	var row = $j("tr[id='"+this._containerId+rowId+"']");

	if (row.hasClass("ia-table-row-select")) 
	{
		row.addClass("ia-table-row-highlight-select");
		
		//var c = ia.Color.adjustSV(this.selectionColor,40,100);				
		var c = ia.Color.shade(this.selectionColor,0.64);

	}
	else
	{
		row.addClass("ia-table-row-highlight");
							
		//var c = ia.Color.adjustSV(this.highlightColor,20,100);
		var c = ia.Color.shade(this.highlightColor,0.7);
	}
	
	row.css("background-color", c);
	
	this._highlightRows[rowId] = row;
};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.Table.prototype.clearHighlight = function()
{	
	for (var id in this._highlightRows)
	{
		var row = this._highlightRows[id];
		row.removeClass("ia-table-row-highlight").removeClass("ia-table-row-highlight-select");
		delete this._highlightRows[id];
		
		if (row.hasClass("ia-table-row-select")) 
		{
			//var c = ia.Color.adjustSV(this.selectionColor,30,100);
			var c = ia.Color.shade(this.selectionColor,0.68);
		}
		else
		{
			var c = "";
		}
		row.css("background-color", c);
	}
};