/** 
 * A class for rendering a gradient legend.
 *
 * @author J Clare
 * @class ia.GradientLegend
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the the legend.
 */
ia.GradientLegend = function(id)
{		
	ia.GradientLegend.baseConstructor.call(this);
	
	this.id = id;
	
	// The legend labels.
	this._minValue = undefined;
	this._maxValue = undefined;
	this._minLabel = undefined;
	this._maxLabel = undefined;

	// Canvases.
	this._canvas = undefined;
	this._context = undefined;

	// A div to contain the legend and allow correct scrolling
	this.container = $j("<div id='"+id+"' class='ia-legend'>");
	
	// A table used to render the legend.
	this.$table = $j("<table>");
	this.container.append(this.$table);
	this.style = {fillStyle:'#EFEFEF', strokeStyle:'#cccccc', lineWidth:'1', lineJoin:'miter'};
};
ia.extend(ia.EventDispatcher, ia.GradientLegend);

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.GradientLegend.prototype.id;

/**
 * The style.
 * 
 * @property style
 * @type Object
 * @default {fillStyle:'#EFEFEF', strokeStyle:'#cccccc', lineWidth:'0.5', lineJoin:'miter'}
 */
ia.GradientLegend.prototype.style;

/**
 * A thematic that can be associated with the data in the legend.
 * 
 * @property thematic
 * @type ia.Thematic
 */
ia.GradientLegend.prototype.thematic;

/** 
 * The item highlight color.
 *
 * @property highlightColor
 * @type String
 */
ia.GradientLegend.prototype.highlightColor;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.GradientLegend.prototype.container;

/** 
 * The precision.
 *
 * @property precision
 * @type Number
 */
ia.GradientLegend.prototype.precision;

/**
 * Renders the legend.
 *
 * @method render
 */
ia.GradientLegend.prototype.render = function() 
{		
	if (this.thematic.symbol == ia.Shape.SQUARE || this.thematic.symbol == ia.Shape.LINE || this.thematic.heatmap == true) 
	{
		this._build(20, 120); 
		this._renderBlock(); 
	}
	else 
	{
		var maxSymbolSize =  Math.max(this.thematic.numericClassifier.sizePalette.minSize, 
		this.thematic.numericClassifier.sizePalette.maxSize);
		this._build(maxSymbolSize + 10, maxSymbolSize + 10);
		this._renderPoint();
	}
};

/**
 * Builds the legend.
 *
 * @method _build
 * @param {Number} cw The width.
 * @param {Number} ch The height.
 * @private
 */
ia.GradientLegend.prototype._build = function(cw, ch) 
{	
	this.$table.empty();

	// Get the breaks.
	var breaks = this.thematic.numericClassifier.getBreaks();
	this._minValue = breaks[0];
	this._maxValue = breaks[breaks.length-1];

	// Text.
	var minText;
	var maxText;
	if (this.thematic.numericClassifier.sizePalette.maxSize >= this.thematic.numericClassifier.sizePalette.minSize)
	{
		minText = this.thematic.numericClassifier.formatter.format(this._minValue, this.precision);
		maxText = this.thematic.numericClassifier.formatter.format(this._maxValue, this.precision);
	}
	else
	{
		minText = this.thematic.numericClassifier.formatter.format(this._maxValue, this.precision);
		maxText = this.thematic.numericClassifier.formatter.format(this._minValue, this.precision);
	}

	// Add max label.
	var tr = $j("<tr>");
	this._maxLabel = $j("<td class='ia-legend-item ia-legend-label ia-gradient-legend-label'>");
	this._maxLabel.html(maxText);
	tr.append(this._maxLabel);
	this.$table.append(tr);

	// Add the gradient.
	var tr = $j("<tr>");
	var td = $j("<td class='ia-legend-item'>");
	tr.append(td);
	this.$table.append(tr);

	// We need to place the canvas in a div otherwise the positioning of the this._canvas doesnt work.
	var div = $j("<div class='ia-legend-symbol' style='width:"+cw+";height:"+ch+";'>"); 
	td.append(div);

	// Create a this._canvas to contain the gradient.
	this._canvas = document.createElement('canvas');
	this._canvas.width = cw;
	this._canvas.height = ch;
	div.append($j(this._canvas));
	this._context = this._canvas.getContext("2d");

	// Add min label.
	var tr = $j("<tr>");
	this._minLabel = $j("<td class='ia-legend-item ia-legend-label ia-gradient-legend-label'>");
	this._minLabel.html(minText);
	tr.append(this._minLabel);
	this.$table.append(tr);
};

/**
 * Renders the block legend.
 *
 * @method _renderBlock
 * @private
 */
ia.GradientLegend.prototype._renderBlock = function() 
{		
	if (this._context)
	{
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
	
		// Draw the gradient.
		this._context.strokeStyle = this.style.strokeStyle;
		this._context.lineWidth = this.style.lineWidth;
		var colorList = this.thematic.numericClassifier.colorPalette.getColorList();
		
		// Draw the gradient.
		this._context.beginPath();
		ia.Shape.drawGradient(this._canvas, colorList, "bottomToTop");
		this._context.fill();
		this._context.stroke();
	}
};

/**
 * Renders the point legend.
 *
 * @method _renderPoint
 * @private
 */
ia.GradientLegend.prototype._renderPoint = function() 
{		
	if (this._context)
	{
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		var minSymbolSize =  Math.min(this.thematic.numericClassifier.sizePalette.minSize, 
						this.thematic.numericClassifier.sizePalette.maxSize);
		var maxSymbolSize =  Math.max(this.thematic.numericClassifier.sizePalette.minSize, 
						this.thematic.numericClassifier.sizePalette.maxSize);
		
		var cx = this._canvas.width / 2;
		var cy = this._canvas.height / 2; 
		
		this._context.strokeStyle = this.style.strokeStyle;
		this._context.lineWidth = this.style.lineWidth;
		
		this._context.beginPath();
			ia.Shape.draw(this.thematic.symbol, this._context, cx, cy, minSymbolSize);
		this._context.stroke();
		
		this._context.beginPath();
			ia.Shape.draw(this.thematic.symbol, this._context, cx, cy, maxSymbolSize);
		this._context.stroke();
		
		/*this._context.beginPath();
			this._context.moveTo(this._canvas.width/2, 0);
			this._context.lineTo(this._canvas.width/2, 5);
		this._context.stroke();
		
		this._context.beginPath();
			this._context.moveTo(this._canvas.width/2, ((this._canvas.height + minSymbolSize)/2));
			this._context.lineTo(this._canvas.width/2, this._canvas.height);
		this._context.stroke();*/
	}
};
 
/**
 * Highlights the legend.
 *
 * @method highlight
 * @param {String} id The id of the item.
 */
ia.GradientLegend.prototype.highlight = function(id) 
{	
	if (this._context && this.thematic)
	{
		var data = this.thematic.getData();
		var dataItem = data[id];
		if (dataItem && dataItem.legendClass)
		{
			var value = dataItem.legendClass.value;
			if (this.thematic.symbol == ia.Shape.SQUARE || this.thematic.symbol == ia.Shape.LINE || this.thematic.heatmap == true) 
				this._highlightBlock(value);
			else 
				this._highlightPoint(value);
		}
	}
};

/**
 * Highlights the block legend
 *
 * @method _highlightBlock
 * @param {Number} value The value of the item.
 * @private
 */
ia.GradientLegend.prototype._highlightBlock = function(value) 
{	
	this._renderBlock();
	if (ia.isNumber(value))
	{
		this._context.strokeStyle = this.highlightColor;
		this._context.lineWidth = 3;

		var y = this._canvas.height - (((value - this._minValue) / (this._maxValue - this._minValue)) * this._canvas.height);
		this._context.beginPath();
		this._context.moveTo(1, y);
		this._context.lineTo(this._canvas.width - 1, y);
		this._context.stroke();
	}
};

/**
 * Highlights the point legend.
 *
 * @method _highlightPoint
 * @param {Number} value The value of the item.
 * @private
 */
ia.GradientLegend.prototype._highlightPoint = function(value) 
{	
	this._renderPoint();
	if (ia.isNumber(value))
	{
		var legendClass = this.thematic.getClass(value)
		if (legendClass != undefined)
		{
			var cx = this._canvas.width / 2;
			var cy = this._canvas.height / 2; 

			this._context.strokeStyle = this.style.strokeStyle;
			this._context.lineWidth = this.style.lineWidth;
			this._context.fillStyle = legendClass.color;			
			this._context.beginPath();
				ia.Shape.draw(this.thematic.symbol, this._context, cx, cy, legendClass.size);
			this._context.fill();
			this._context.stroke();
		}
	}
};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.GradientLegend.prototype.clearHighlight = function() 
{	
	if (this.thematic.symbol == ia.Shape.SQUARE || this.thematic.symbol == ia.Shape.LINE || this.thematic.heatmap == true) 
		this._renderBlock(); 
	else this._renderPoint();
};

/**
 * Selects.
 *
 * @method select
 * @param {String} id The id of the item.
 */
ia.GradientLegend.prototype.select = function(id) {};

/**
 * Unselects.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.GradientLegend.prototype.unselect = function(id) {};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.GradientLegend.prototype.clearSelection = function() {};

/**
 * Hides the legend.
 *
 * @method hide
 */
ia.GradientLegend.prototype.hide = function()
{
	this.container.css("display", "none");
};

/**
 * Shows the legend.
 *
 * @method show
 */
ia.GradientLegend.prototype.show = function()
{
	this.container.css("display", "inline");
};