/** 
 * A class for rendering an advanced pie chart component.
 *
 * @author J Clare
 * @class ia.AdvancedPieComponent
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the component.
 * @param {String} The layout of the component "vertical", "horizontal", "box", single".
 */
ia.AdvancedPieComponent = function(id, layout)
{		
	ia.AdvancedPieComponent.baseConstructor.call(this);
	
	this.id = id;	
	this.tip = "";
	this._layout = layout;

	this._chartTitle1 = "";
	this._chart1 = undefined;
	this._layer1 = undefined;
	this._chartTitle2 = "";
	this._chart2 = undefined;
	this._layer2 = undefined;
	this._legend = undefined;
	
	this._selectionIds = [];
	this._scrollBox = undefined;
	this._scrollContainer = undefined;
	this._multiLayout = true;
	this._data = undefined;
	this._isVisible = true;
};
ia.extend(ia.EventDispatcher, ia.AdvancedPieComponent);
	
/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.AdvancedPieComponent.prototype.id;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type {JQUERY Element}
 */
ia.AdvancedPieComponent.prototype.container;

/**
 * The thematic.
 * 
 * @property thematic
 * @type ia.Thematic
 */
ia.AdvancedPieComponent.prototype.thematic;

/**
 * The initial title of the first chart.
 * 
 * @property title1
 * @type String
 */
ia.AdvancedPieComponent.prototype.title1;

/**
 * The initial title of the second chart.
 * 
 * @property title2
 * @type String
 */
ia.AdvancedPieComponent.prototype.title2;

/** 
 * The item selection color.
 * 
 * @property selectionColor
 * @type String
 */
ia.AdvancedPieComponent.prototype.selectionColor;

/** 
 * The item highlight color.
 * 
 * @property highlightColor
 * @type String

 */
ia.AdvancedPieComponent.prototype.highlightColor;

/**
 * The data tip.
 * 
 * @property tip
 * @type String
 * @default = ""
 */
ia.AdvancedPieComponent.prototype.tip;

/**
 * Builds the component
 *
 * @method build
 */
ia.AdvancedPieComponent.prototype.build = function()
{
	// Interaction group
	var iGroup = new ia.InteractionGroup();

	this.container = $j("<div id='"+this.id+"' class='ia-advanced-chart'>");
	var me = this;
	this.container.resize(function(e){me._size();});
	
	// Contains the scroll bars.
	this._scrollContainer = $j("<div id='"+this.id+"-scroll-container' class='ia-advanced-chart-scrollbox'>"); 
	this._scrollBox = new ia.ScrollBox(this._scrollContainer);
	this.container.append(this._scrollContainer);
	
	// Pie thematics.
	this.thematic = new ia.Thematic();
	this.thematic.setDataType(ia.Thematic.CATEGORIC);
	this.thematic.setDataField("value");
	
	// Containers.
	var div1,div2,div3;
	if (this._layout == "vertical") 
	{
		div1 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:0%;width:90%;height:30%'>");
		div2 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:35%;width:90%;height:30%'>");
		div3 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:70%;width:90%'>");
	}
	else if (this._layout == "horizontal")
	{
		div1 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:0%;width:30%;height:80%'>");
	 	div2 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:30%;top:0%;width:30%;height:80%'>");
		div3 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:60%;top:0%;height:80%;width:35%'>");
	}
	else if (this._layout == "box")
	{
		div1 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:0%;width:50%;height:40%'>");
	 	div2 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:50%;width:50%;height:40%'>");
		div3 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:50%;top:0%;width:45%'>");
	}
	else // Single layout.
	{
		this._multiLayout = false;
		div1 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:0%;top:0%;width:50%;height:90%'>");
		div3 = $j("<div class='ia-ui-item ia-ui-item-align-center' style='position:absolute;left:50%;top:0%;width:45%;'>");
	}
	this._scrollContainer.append(div1);
	if (this._multiLayout) this._scrollContainer.append(div2);
	this._scrollContainer.append(div3);
	
	// Pie Chart 1.
	this._chartTitle1 = $j("<div>").html("");
	div1.append(this._chartTitle1);
	
	this._chart1 = new ia.PieChart(this.id+"-pie-chart-1");
	this._chart1.container.css('position','relative')
	div1.append(this._chart1.container);

	this._layer1 = new ia.AdvancedPieLayer();
	this._layer1.thematic = this.thematic;
	this._layer1.highlightColor = this.highlightColor;
	this._layer1.selectionColor = this.selectionColor;
	this._layer1.tip = this.tip;
	this._layer1.setVisible(true);
	this._layer1.interactive = true;
	iGroup.addComponent(this._layer1);
	this._chart1.addLayer(this._layer1);
	
	if (this._multiLayout) 
	{
		// Pie Chart 2.
		this._chartTitle2 = $j("<div>");
		div2.append(this._chartTitle2).html("");

		this._chart2 = new ia.PieChart(this.id+"-pie-chart-2");
		this._chart2.container.css('position','relative')
		div2.append(this._chart2.container);

		this._layer2 = new ia.AdvancedPieLayer();
		this._layer2.thematic = this.thematic;
		this._layer2.highlightColor = this.highlightColor;
		this._layer2.selectionColor = this.selectionColor;
		this._layer2.tip = this.tip;
		this._layer2.setVisible(true);
		this._layer2.interactive = true;
		iGroup.addComponent(this._layer2);
		this._chart2.addLayer(this._layer2);
	}
	
	// Pie this._legend.
	this._legend = new ia.DiscreteLegend(this.id+"-this._legend-discrete"); 
	this._legend.thematic = this.thematic;
	this._legend.highlightColor = this.highlightColor;
	this._legend.selectionColor = this.selectionColor;
	iGroup.addComponent(this._legend);
	div3.append(this._legend.container);
	this._legend.container.resize(function(e){me._size();});
};

/** 
 * Sizes all the element to make the scrolling work.
 *
 * @method _size
 * @private
 */
ia.AdvancedPieComponent.prototype._size = function()
{
	this._scrollContainer.height(this.container.height());
	this._scrollContainer.width(this.container.width());
	this._scrollBox.refresh();
};

/** 
 * Specifies a dataprovider.
 *
 * @method setData
 */
ia.AdvancedPieComponent.prototype.setData = function(data)
{
	this._data = data;
	this._layer1.setData(data)
	if (this._multiLayout) this._layer2.setData(data)
};

/**
 * Hightlights an item.
 *
 * @method highlight
 * @param {String} id The id of the item to highlight.
 */
ia.AdvancedPieComponent.prototype.highlight = function(id)
{		
	if (this._multiLayout) 
	{
		if (this._selectionIds.length == 1)
		{
			this._layer2.itemId = id;
			this._layer2.update();
			this._layer2.render();
			this._chartTitle2.html(this._layer2.itemName);
		}
		else if (this._selectionIds.length == 0)
		{
			this._layer1.itemId = id;
			this._layer1.update();
			this._layer1.render();
			this._chartTitle1.html(this._layer1.itemName);
		}
	}
	else
	{
		if (this._selectionIds.length == 0)
		{
			this._layer1.itemId = id;
			this._layer1.update();
			this._layer1.render();
			this._chartTitle1.html(this._layer1.itemName);
		}
	}
};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.AdvancedPieComponent.prototype.clearHighlight = function() 
{
	if (this._multiLayout) 
	{
		if (this._selectionIds.length == 1)
		{
			this._chartTitle2.html(this.title2);
			this._layer2.itemId = null;
			this._layer2.update();
			this._layer2.render();
		}
		else if (this._selectionIds.length == 0)
		{
			this._chartTitle1.html(this.title1);
			this._layer1.itemId = null;
			this._layer1.update();
			this._layer1.render();
		}
	}
	else
	{
		if (this._selectionIds.length == 0)
		{
			this._chartTitle1.html(this.title1);
			this._layer1.itemId = null;
			this._layer1.update();
			this._layer1.render();
		}
	}
};

/**
 * Selects an item.
 *
 * @method select
 * @param {String} id The id of the item.
 */
ia.AdvancedPieComponent.prototype.select = function(id)
{	
	var index = this._selectionIds.indexOf(id);
	if (index == -1) this._selectionIds.push(id);
	
	if (this._multiLayout) 
	{
		if (this._selectionIds.length > 1)
		{
			this._layer2.itemId = id;
			this._layer2.update();
			this._layer2.render();
			this._chartTitle2.html(this._layer2.itemName);
		}
		else
		{
			this._layer1.itemId = id;
			this._layer1.update();
			this._layer1.render();
			this._chartTitle1.html(this._layer1.itemName);
		}
	}
	else
	{
		this._layer1.itemId = id;
		this._layer1.update();
		this._layer1.render();
		this._chartTitle1.html(this._layer1.itemName);
	}
};

/**
 * Unselects an item.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.AdvancedPieComponent.prototype.unselect = function(id) 
{
	var index = this._selectionIds.indexOf(id);
	if (index != -1) this._selectionIds.splice(index, 1);
	
	if (this._multiLayout) 
	{
		if (this._selectionIds.length == 0)
		{
			this._chartTitle1.html(this.title1);
			this._layer1.itemId = null;
			this._layer1.update();
			this._layer1.render();
		}
		else if (this._selectionIds.length == 1)
		{
			this._chartTitle2.html(this.title2);
			this._layer2.itemId = null;
			this._layer2.update();
			this._layer2.render();
		}
	}
	else
	{
		if (this._selectionIds.length == 0)
		{
			this._chartTitle1.html(this.title1);
			this._layer1.itemId = null;
			this._layer1.update();
			this._layer1.render();
		}
	}
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.AdvancedPieComponent.prototype.clearSelection = function() 
{
	this._selectionIds = [];
	
	this._layer1.itemId = null;
	this._layer1.update();
	this._layer1.render();
	this._chartTitle1.html(this.title1);
	
	if (this._multiLayout) 
	{
		this._layer2.itemId = null;
		this._layer2.update();
		this._layer2.render();
		this._chartTitle2.html(this.title2);
	}
};

/**
 * Renders the component.
 *
 * @method render
 */
ia.AdvancedPieComponent.prototype.render = function() 
{
	this._legend.render();
	this._layer1.update();
	this._layer1.render();
	if (this._chartTitle1.html() == "") this._chartTitle1.html(this.title1);
	if (this._multiLayout) 
	{
		this._layer2.update();
		this._layer2.render();
		if (this._chartTitle2.html() == "") this._chartTitle2.html(this.title2);
	}
	this._size();
	
};

/**
 * Toggles the chart visibility.
 *
 * @method toggle
 */
ia.AdvancedPieComponent.prototype.toggle = function(visible)
{
	if (this._isVisible) this.hide();
	else this.show();
};

/**
 * Hides the chart.
 *
 * @method hide
 */
ia.AdvancedPieComponent.prototype.hide = function()
{
	if (this._isVisible)
	{
		this._isVisible = false;
		this.container.stop();
		this.container.animate({opacity: 0}, function() {});
	}
};

/**
 * Shows the chart.
 *
 * @method show
 */
ia.AdvancedPieComponent.prototype.show = function()
{
	if (!this._isVisible)
	{
		this._isVisible = true;
		this.container.stop();
		this.container.animate({opacity: 1}, function() {});
	}
};