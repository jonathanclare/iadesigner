/** 
 * A class for rendering a layer list.
 *
 * @author J Clare
 * @class ia.LayerList
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String}  The id of the list.
 */
ia.LayerList = function(id)
{		
	ia.LayerList.baseConstructor.call(this);

	this.id = id;

	this.container = $j("<div id='"+id+"' class='ia-layer-list'>");
	
	// The table used to render the data.
	this.$tableContainer = $j("<div id='"+id+"-container' class='ia-layer-list-scrollbox'>"); 
	this._scrollBox = new ia.ScrollBox(this.$tableContainer);
	this.container.append(this.$tableContainer);

	// A table used to render the layer list.
	this.$tableList = $j("<table class='ia-layer-list-table'>");
	this.$tableContainer.append(this.$tableList);
	
	var me  = this;
	this.container.resize(function(e){me._size();});
};
ia.extend(ia.EventDispatcher, ia.LayerList);

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.LayerList.prototype.id;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.LayerList.prototype.container;

/**
 * The map data object.
 * 
 * @property mapData
 * @type ia.MapData
 */
ia.LayerList.prototype.mapData;

/**
 * The discrete legend.
 * 
 * @property discreteLegend
 * @type ia.DiscreteLegend
 */
ia.LayerList.prototype.discreteLegend;

/**
 * The gradient legend.
 * 
 * @property gradientLegend
 * @type ia.GradientLegend
 */
ia.LayerList.prototype.gradientLegend;
	
/** 
 * Sizes all the element to make the scrolling work.
 *
 * @method _size
 * @private
 */
ia.LayerList.prototype._size = function()
{
	this.$tableContainer.height(this.container.height());
	this.$tableContainer.width(this.container.width());
};

/**
 * Renders the layer list.
 *
 * @method render
 */
ia.LayerList.prototype.render = function() 
{	
	var me = this;

	// Empty the previous list.
	this.$tableList.empty();
	
	if (this.mapData)
	{
		buildLegendItem();

		// Insert the rest of the layers.
		// Loop through the layers backwards to get order correct.
		var n = this.mapData.noneBaseLayers.length;
		if (this.mapData.maintainLayerOrder)
		{	
			for (var i = 0; i < n; i++) 
			{
				var layer = this.mapData.noneBaseLayers[i];
				this._buildLayerItem(layer);
			}
		}
		else
		{
			for (var i = n-1; i >= 0; i--) 
			{
				var layer = this.mapData.noneBaseLayers[i];
				this._buildLayerItem(layer);
			}
		}
	}

	function buildLegendItem()
	{
		// Insert base layer here.
		me._buildLayerItem(me.mapData.baseLayer, true);
		
		// Insert legend here.
		var tr = $j("<tr>");
		me.$tableList.append(tr);

		var td = $j("<td colspan='2' class='ia-layer-list-legend-td'>"); 
		tr.append(td);

		if (me.gradientLegend) 
		{
			td.append(me.gradientLegend.container);
			me.gradientLegend.container.resize(function(e){me._size();});
		}

		if (me.discreteLegend) 
		{
			td.append(me.discreteLegend.container);
			me.discreteLegend.scrollBox = me._scrollBox;
			me.discreteLegend.container.resize(function(e){me._size();});
		}
	};


	this._scrollBox.refresh();
};

/**
 * Draws the layer symbol.
 *
 * @method _buildLayerItem
 * @param {HTML Canvas} canvas The canvas to draw to.
 * @param {Boolean} isBaseLayer Is it a base layer.
 * @private
 */
ia.LayerList.prototype._buildLayerItem = function(layer, isBaseLayer) 
{	
	if (layer.showInLayerList)
	{
		var me = this;
		layer.addEventListener(ia.Event.LAYER_VISIBLE_CHANGED, this._layerEventHandler.bind(this));
	
		// Add a row
		var tr = $j("<tr id='"+this.id+"_"+replaceBadCharacters(layer.id)+"' class='ia-list-item'>");
		this.$tableList.append(tr);
		
		// Add symbol.
		if (!isBaseLayer && layer.geometry != "image")
		{
			// Layer symbol.
			var td = $j("<td class='ia-legend-item' style='text-align:center'>"); 
			tr.append(td);
			if (layer.iconPath != "") // Icon layer
			{
				var imgSymbol = $j("<img>").attr('src', layer.iconPath);	
				td.append(imgSymbol);
			}
			else // Contextual layer
			{
				// Take into account the border of the symbol when sizing the canvas.
				var borderWidth = layer.style.lineWidth;
				var canvasWidth = layer.symbolSize + (borderWidth * 2);

				/*if (layer.geometry == ia.Shape.LINE) canvasWidth = 30;*/
				var canvasHeight = layer.symbolSize + (borderWidth * 2);

				// We need to place the canvas in a div otherwise the positioning of the canvas doesnt work.
				var divSymbol = $j("<div class='ia-legend-symbol' style='width:"+canvasWidth+";height:"+canvasHeight+";'>"); 
				td.append(divSymbol);

				// Create a canvas to contain the symbol.
				var canvas = document.createElement('canvas');
				canvas.width = canvasWidth;
				canvas.height = canvasHeight;
				divSymbol.append($j(canvas));

				// Draw the symbol.
				this._drawSymbol(canvas, layer);
			}
		}
		
		// Add the label.
		var td = $j("<td style='width:100%' id='"+replaceBadCharacters(layer.id)+"' class='ia-layer-list-item ia-layer-list-item-unchecked'>");
		if (isBaseLayer || layer.geometry == "image") td.attr('colspan', 2); 
		td.html(layer.name);
		tr.append(td);
		
		// Set selection.
		if (layer.getVisible() == true) td.addClass('ia-layer-list-item-checked');

		// Add onclick handler to checkbox.
		(function() // Execute immediately
		{ 
			var l = layer;
			var cell = td;

			tr.bind("click", function(e) 
			{
				e.stopPropagation();
				e.preventDefault();

				if (cell.hasClass('ia-layer-list-item-checked'))
				{
					cell.removeClass('ia-layer-list-item-checked');
					l.setVisible(false);
				}
				else
				{      
					cell.addClass('ia-layer-list-item-checked');
					l.setVisible(true);
					if (!l.isLoaded) l.loadSource();
				}
			});
		})();
	}
};

function replaceBadCharacters (str) 
{
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "");
};

/**
 * Shows a layer.
 * 
 * @method showLayer
 * @param {String} id The layer id.
 */
ia.LayerList.prototype.showLayer = function(id)
{
	this.$tableList.find("tr[id='"+this.id+"_"+replaceBadCharacters(id)+"']").show();
};

/**
 * Hides a layer.
 * 
 * @method hideLayer
 * @param {String} id The layer id.
 */
ia.LayerList.prototype.hideLayer = function(id)
{
	this.$tableList.find("tr[id='"+this.id+"_"+replaceBadCharacters(id)+"']").hide();
};

/** 
 * Supplies the click function for when the legend editor button is pressed
 * 
 * @method clickFunction
 * @param {Event} e The event.
 */
ia.LayerList.prototype.clickFunction = function(e) {};

/**
 * Draws the layer symbol.
 *
 * @method _drawSymbol
 * @param {HTML Canvas} canvas The canvas to draw to.
 * @param {ia.LayerBase} layer The layer.
 * @private
 */
ia.LayerList.prototype._drawSymbol = function(canvas, layer) 
{	
	// Get the canvas context.
	var context = canvas.getContext("2d");

	var style = layer.style;

	for (var p in style) {context[p] = style[p];}

	if (layer.geometry == "line")
	{
		context.beginPath();
			ia.Shape.draw(ia.Shape.LINE, context, canvas.width/2, canvas.height/2, layer.symbolSize);
		context.stroke();
	}
	else
	{
		context.beginPath();

			var symbol = ia.Shape.SQUARE; // Polygon.
			if (layer.geometry == "point") symbol = ia.Shape.CIRCLE;
			ia.Shape.draw(symbol, context, canvas.width/2, canvas.height/2, layer.symbolSize);

		context.fill();
		context.stroke();
	}
};

/** 
 * Updates the checkbox when a layers visibility has changed.
 * 
 * @method _layerEventHandler
 * @param {ia.Event} event A <code>ia.Event</code> dispatched by a layer.
 * @private
 */	
ia.LayerList.prototype._layerEventHandler = function(event) 
{
	if (event.type == ia.Event.LAYER_VISIBLE_CHANGED) 
	{
		var layer = event.object;
		var layerId = replaceBadCharacters(layer.id);
		if (layer.getVisible()) this.$tableList.find("#"+layerId).addClass('ia-layer-list-item-checked');
		else this.$tableList.find("#"+layerId).removeClass('ia-layer-list-item-checked');
	}
};