/** 
 * A class for rendering a set of legend classes as a html table.
 *
 * @author J Clare
 * @class ia.DiscreteLegend
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the legend.
 */
ia.DiscreteLegend = function(id)
{		
	ia.DiscreteLegend.baseConstructor.call(this);
	
	this.id = id;

	// A div to contain the legend and allow correct scrolling
	this.container = $j("<div id='"+id+"' class='ia-legend'>");
	
	// A table used to render the legend.
	this.$table = $j("<table class='ia-legend-table'>");
	this.container.append(this.$table);

	this.style = {fillStyle:'#EFEFEF', strokeStyle:'#cccccc', lineWidth:'0.5', lineJoin:'miter'};
	this.isLegendComponent = true;
	this.interactive = true;
	this.layout = "vertical";
	this.thematic = new ia.Thematic();

	this._touchStart = 0;		// Timing of touch start.
};
ia.extend(ia.EventDispatcher, ia.DiscreteLegend);

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.DiscreteLegend.prototype.id;

/**
 * The style.
 * 
 * @property style
 * @type Object
 * @default {fillStyle:'#EFEFEF', strokeStyle:'#cccccc', lineWidth:'0.5', lineJoin:'miter'}
 */
ia.DiscreteLegend.prototype.style;

/** 
 * The item selection color.
 *
 * @property selectionColor
 * @type String
 */
ia.DiscreteLegend.prototype.selectionColor;

/** 
 * The item highlight color.
 *
 * @property highlightColor
 * @type String
 */
ia.DiscreteLegend.prototype.highlightColor;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.DiscreteLegend.prototype.container;

/**
 * Specifies a thematic for the legend.
 *
 * @property thematic
 * @type ia.Thematic
 */
ia.DiscreteLegend.prototype.thematic;

/**
 * Indicates this is a legend component.
 *
 * @property isLegendComponent
 * @type Boolean
 * @default true
 */
ia.DiscreteLegend.prototype.isLegendComponent;

/**
 * Indicates if theres a scrollbox attached.
 *
 * @property scrollBox
 * @type ia.ScrollBox
 * @default true
 */
ia.DiscreteLegend.prototype.scrollBox;

/**
 * Indicates if the legend is interactive.
 *
 * @property interactive
 * @type Boolean
 * @default true
 */
ia.DiscreteLegend.prototype.interactive;

/**
 * The layout of the legend.
 *
 * @property layout
 * @type String
 * @default "vertical"
 */
ia.DiscreteLegend.prototype.layout;

/**
 * Renders the legend.
 *
 * @method render
 */
ia.DiscreteLegend.prototype.render = function() 
{		
	this.renderLegend(this.thematic.getClasses()) ;
};

/**
 * Renders the numeric legend classes.
 *
 * @method renderNumeric
 * @param {ia.Legend[]} classes The legend classes.
 */
ia.DiscreteLegend.prototype.renderNumeric = function()
{
	this.renderLegend(this.thematic.numericClassifier.getClasses());
};

/**
 * Renders the categoric legend classes.
 *
 * @method renderCategoric
 * @param {ia.Legend[]} classes The legend classes.
 */
ia.DiscreteLegend.prototype.renderCategoric = function()
{
	this.renderLegend(this.thematic.categoricClassifier.getClasses());
};

/**
 * Renders the passed legend classes.
 *
 * @method renderLegend
 * @param {ia.Legend[]} classes The legend classes.
 */
ia.DiscreteLegend.prototype.renderLegend = function(classes) 
{		
	this.$table.empty();
	var tr;

	if (this.layout == "horizontal")
	{
		if (!this.container.hasClass("ia-legend-horizontal"))  
			this.container.addClass("ia-legend-horizontal");
		
		this.$table.css("height", "100%");
		this.$table.css("width","auto");
		this.container.css("width","auto");

		tr = $j("<tr>");
		this.$table.append(tr);
	}

	for (var i = 0; i < classes.length; i++) 
	{
		// A legend class.
		var legendClass = classes[i];

		// Add a row
		if (this.layout == "vertical") 
		{
			tr = $j("<tr data-index='"+i+"''>");
			this.$table.append(tr);
		}

		if (legendClass.size == 0) tr.css("display","none");

		// Add the symbol.
		var tdSymbol = $j("<td class='ia-legend-item'>"); 
		if (this.interactive) tdSymbol.addClass("ia-legend-item-interactive");
		tr.append(tdSymbol);

		// Take into account the border of the symbol when sizing the canvas.
		var borderWidth = this.style.lineWidth;
		var canvasWidth = legendClass.size + (borderWidth * 2);
		if (legendClass.symbol == ia.Shape.LINE) canvasWidth = 30;
		var canvasHeight = legendClass.size + (borderWidth * 2);
		
		// We need to place the canvas in a div otherwise the positioning of the canvas doesnt work.
		var divSymbol = $j("<div class='ia-legend-symbol' style='width:"+canvasWidth+";height:"+canvasHeight+";'>"); 
		tdSymbol.append(divSymbol);

		// Create a canvas to contain the symbol.
		var canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		divSymbol.append($j(canvas));

		// Draw the symbol.
		var context = canvas.getContext("2d");

		for (var p in this.style) 
		{
			context[p] = this.style[p];
		}

		// We want to keep the shape corners sharp so reset to miter here in case its been changed.
		context.lineJoin = 'miter'; 
		context.fillStyle = legendClass.color;

		if (legendClass.symbol == ia.Shape.LINE)
		{
			context.strokeStyle = legendClass.color;
			context.lineWidth = legendClass.size;
			context.beginPath();
				ia.Shape.draw(legendClass.symbol, context, canvas.width/2, canvas.height/2, canvas.width, legendClass.dashWidth, legendClass.gapWidth);
			context.stroke();
		}
		else
		{
			// Add 0.5 to shape size to remove antialiasing
			context.beginPath();
				ia.Shape.draw(legendClass.symbol, context, canvas.width/2, canvas.height/2, legendClass.size + 0.5);
			context.fill();
			context.stroke();
		}

		// Add the label.
		var tdLabel = $j("<td class='ia-legend-item ia-legend-label'>").html(legendClass.getLabel());
		if (this.interactive) tdLabel.addClass("ia-legend-item-interactive");
		if (this.layout == "horizontal") 
		{
			tdLabel.css("white-space","nowrap");
			tdLabel.css("width","auto");
		}
		tr.append(tdLabel);

		// Add mouse events to the row.
		if (this.interactive) this._addMouseEvents(tr);
	}
};

/**
 * Adds mouse events to the passed jquery object.
 *
 * @method _addMouseEvents
 * @param {JQUERY Element} obj The jquery object.
 * @private
 */
ia.DiscreteLegend.prototype._addMouseEvents = function(obj) 
{
	var me = this;

	// Hover.
	obj.hover
	(
		function () 
		{
			//var index = me.$table.find("tbody > tr").index($j(this));
			var index = me.$table.find("tbody > tr").data("index");
			if ($j(this).hasClass("ia-legend-select")) 
			{
				$j(this).addClass("ia-legend-highlight-select");
				
				//var c = ia.Color.adjustSV(me.selectionColor,40,100);
				var c = ia.Color.shade(me.selectionColor,0.64);
				me._dispatchItemEvent(index, ia.ItemEvent.ITEM_MOUSE_OVER, ia.ItemLayer.ROLLOVER_SELECTED);
			}
			else 
			{
				$j(this).addClass("ia-legend-highlight");
				
				//var c = ia.Color.adjustSV(me.highlightColor,20,100);
				var c = ia.Color.shade(me.highlightColor,0.7);
				me._dispatchItemEvent(index, ia.ItemEvent.ITEM_MOUSE_OVER, ia.ItemLayer.ROLLOVER);
			}
			
			$j(this).css("background-color", c);
		},
		function () 
		{
			//var index = me.$table.find("tbody > tr").index($j(this));
			var index = me.$table.find("tbody > tr").data("index");
			$j(this).removeClass("ia-legend-highlight");
			if ($j(this).hasClass("ia-legend-highlight-select"))
			{
				$j(this).removeClass("ia-legend-highlight-select");
				$j(this).addClass("ia-legend-select");
				
				//var c = ia.Color.adjustSV(me.selectionColor,30,100);
				var c = ia.Color.shade(me.selectionColor,0.68);
				me._dispatchItemEvent(index, ia.ItemEvent.ITEM_MOUSE_OUT, ia.ItemLayer.SELECTED);
			}
			else 
			{
				var c = "";
				me._dispatchItemEvent(index, ia.ItemEvent.ITEM_MOUSE_OUT, ia.ItemLayer.UNSELECTED);
			}
			 
			$j(this).css("background-color", c);
		}
	);
	// Toggle.
	obj.bind("click", function(e)
	{
		var index = me.$table.find("tbody > tr").index($j(this));

		// Unselect.
		if ($j(this).hasClass("ia-legend-select") || $j(this).hasClass("ia-legend-highlight-select"))
		{
			$j(this).removeClass("ia-legend-select").removeClass("ia-legend-highlight-select"); 
			me._dispatchItemEvent(index, ia.ItemEvent.ITEM_CLICK, ia.ItemLayer.UNSELECTED);
			var c = "";
		}
		// Select.
		else
		{
			$j(this).removeClass("ia-legend-highlight").addClass("ia-legend-highlight-select");
			me._dispatchItemEvent(index, ia.ItemEvent.ITEM_CLICK, ia.ItemLayer.SELECTED);
				
			//var c = ia.Color.adjustSV(me.selectionColor,40,100);
			var c = ia.Color.shade(me.selectionColor,0.64);
		}
		
		$j(this).css("background-color", c);
	});
};

/**
 * Dispatches item events.
 *
 * @method ._dispatchItemEvent
 * @private
 */
ia.DiscreteLegend.prototype._dispatchItemEvent = function(classIndex, eventType, state)
{
	var item = new Object();
	item.id = classIndex;
	item.parent = this;
	item.state = state;

	if (this.thematic.numericClassifier.classificationName == ia.Thematic.CONTINUOUS)
		item.legendClass = this.thematic.categoricClassifier.getClasses()[classIndex];
	else
		item.legendClass = this.thematic.getClasses()[classIndex];



	this.dispatchEvent(new ia.ItemEvent(eventType, item));
};

/**
 * Selects.
 *
 * @method select
 * @param {String} id The id of the item.
 */
ia.DiscreteLegend.prototype.select = function(id) 
{
	var row = this.$table.find('tr:eq('+id+')');
	if (row != undefined)
	{
		row.removeClass("ia-legend-highlight").addClass("ia-legend-select");
		//row.css("background-color", ia.Color.adjustSV(this.selectionColor,40,100));
		row.css("background-color", ia.Color.shade(this.selectionColor,0.64));
	}
};

/**
 * Unselects.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.DiscreteLegend.prototype.unselect = function(id) 
{
	var row = this.$table.find('tr:eq('+id+')');
	if (row != undefined)
	{
		row.removeClass("ia-legend-highlight-select").removeClass("ia-legend-select").addClass("ia-legend-highlight"); 
		row.css("background-color", "");
	}
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.DiscreteLegend.prototype.clearSelection = function() 
{	
	this.$table.find("tbody > tr").removeClass("ia-legend-select").css("background-color", "");
};

/**
 * Highlights the legend class that contains the given id.
 *
 * @method highlight
 * @param {String} id The id of the item.
 */
ia.DiscreteLegend.prototype.highlight = function(id) 
{	
	var row = this.$table.find('tr:eq('+id+')');
	if (row.hasClass("ia-legend-select")) 
	{
		row.addClass("ia-legend-highlight-select");
		//var c = ia.Color.adjustSV(this.selectionColor,40,100);
		var c = ia.Color.shade(this.selectionColor,0.64);
	}
	else 
	{
		row.addClass("ia-legend-highlight");
		//var c = ia.Color.adjustSV(this.highlightColor,20,100);
		var c = ia.Color.shade(this.highlightColor,0.7);
	}
	row.css("background-color", c);
};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.DiscreteLegend.prototype.clearHighlight = function() 
{
	var rows = this.$table.find("tbody > tr");
	rows.removeClass("ia-legend-highlight").removeClass("ia-legend-highlight-select");
	var me = this;
	rows.each(function(index) 
	{
		if ($j(this).hasClass("ia-legend-select"))
		{
			//var c = ia.Color.adjustSV(me.selectionColor,30,100);
			var c = ia.Color.shade(me.selectionColor,0.68);
		}
		else
		{
			var c = "";
		}
		$j(this).css("background-color", c);
	});		
};

/**
 * Hides the legend.
 *
 * @method hide
 */
ia.DiscreteLegend.prototype.hide = function()
{
	//this.container.css("display", "none");
};

/**
 * Shows the legend.
 *
 * @method show
 */
ia.DiscreteLegend.prototype.show = function()
{
	//this.container.css("display", "");
};