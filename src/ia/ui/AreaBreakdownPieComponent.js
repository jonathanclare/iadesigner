/** 
 * A class for rendering an area breakdown pie chart component.
 *
 * @author J Clare
 * @class ia.AreaBreakdownPieComponent
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the component.
 * @param {String} The layout of the component "vertical", "horizontal" or single".
 */
ia.AreaBreakdownPieComponent = function(id, layout)
{		
	ia.AreaBreakdownPieComponent.baseConstructor.call(this);
	
	this.id = id;	
	this.tip = "";
	this.layout = layout;

	this._selectionIds = [];

	this._multiLayout = true;
	this._data = undefined;
	this._isVisible = true;

	this._chart1Defined = false;
	this._chart2Defined = false;

	// Containers.
	this.container = $j("<div id='"+id+"'class='ia-area-breakdown-pie-chart'>");
	this._$pieContainer1 = $j("<div style='display:inline-block;padding:8px;text-align:center'>").appendTo(this.container);
	this._$pieContainer2 = $j("<div style='display:inline-block;padding:8px;text-align:center'>");

	// Pie thematics.
	this.thematic = new ia.Thematic();
	this.thematic.setDataType(ia.Thematic.CATEGORIC);
	this.thematic.setDataField("value");

	// Chart titles.
	this._$chartTitle1 = $j("<div>").html("").appendTo(this._$pieContainer1);
	this._$chartTitle2 = $j("<div>").html("").appendTo(this._$pieContainer2);

	// Charts
	this._chart1 = new ia.PieChart(this.id+"-pie-chart-1");
	this._chart1.container.css('position','relative');
	this._layer1 = new ia.AdvancedPieLayer();
	this._layer1.thematic = this.thematic;
	this._layer1.setVisible(true);
	this._layer1.interactive = true;
	this._layer1.selectable = false;
	this._chart1.addLayer(this._layer1);

	this._chart2 = new ia.PieChart(this.id+"-pie-chart-2");
	this._chart2.container.css('position','relative');
	this._layer2 = new ia.AdvancedPieLayer();
	this._layer2.thematic = this.thematic;
	this._layer2.setVisible(true);
	this._layer2.interactive = true;
	this._layer2.selectable = false;
	this._chart2.addLayer(this._layer2);

	// Interaction group
	var iGroup = new ia.InteractionGroup();
	iGroup.addComponent(this._layer1);
	iGroup.addComponent(this._layer2);
};
ia.extend(ia.EventDispatcher, ia.AreaBreakdownPieComponent);
	
/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.AreaBreakdownPieComponent.prototype.id;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type {JQUERY Element}
 */
ia.AreaBreakdownPieComponent.prototype.container;

/**
 * The thematic.
 * 
 * @property thematic
 * @type ia.Thematic
 */
ia.AreaBreakdownPieComponent.prototype.thematic;

/**
 * The initial title of the first chart.
 * 
 * @property title1
 * @type String
 */
ia.AreaBreakdownPieComponent.prototype.title1;

/**
 * The initial title of the second chart.
 * 
 * @property title2
 * @type String
 */
ia.AreaBreakdownPieComponent.prototype.title2;

/** 
 * The item selection color.
 * 
 * @property selectionColor
 * @type String
 */
ia.AreaBreakdownPieComponent.prototype.selectionColor;

/** 
 * The item highlight color.
 * 
 * @property highlightColor
 * @type String

 */
ia.AreaBreakdownPieComponent.prototype.highlightColor;

/**
 * The data tip.
 * 
 * @property tip
 * @type String
 * @default ""
 */
ia.AreaBreakdownPieComponent.prototype.tip;

/**
 * The layout.
 * 
 * @property tip
 * @type String
 */
ia.AreaBreakdownPieComponent.prototype.layout;

/**
 * Builds the component
 *
 * @method build
 */
ia.AreaBreakdownPieComponent.prototype.build = function(callbackFunction)
{
	// Containers.
	if (this.layout == "vertical") 
	{
		this.container.append(this._$pieContainer2);
		this._multiLayout = true;
		this._$pieContainer1.css({'width': '100%', 'height': '50%'});
		this._$pieContainer2.css({'width': '100%', 'height': '50%'});
	}
	else if (this.layout == "horizontal")
	{
		this.container.append(this._$pieContainer2);
		this._multiLayout = true;
		this._$pieContainer1.css({'width': '50%', 'height': '100%'});
		this._$pieContainer2.css({'width': '50%', 'height': '100%'});
	}
	else // Single layout.
	{
		this._$pieContainer2.detach();
		this._multiLayout = false;
		this._$pieContainer1.css({'width': '100%', 'height': '100%'});
	}
	
	// Pie Chart 1.	
	this._layer1.highlightColor = this.highlightColor;
	this._layer1.selectionColor = this.selectionColor;
	this._layer1.tip = this.tip;

	if (this._chart1Defined == false)
	{
		this._chart1Defined = true;
		this._$pieContainer1.append(this._chart1.container);

		if (!this._multiLayout) 
		{ 
			// Wait till charts ready before returning.
			this._chart1.addEventListener(ia.Event.MAP_READY, function() 
			{
				if (callbackFunction != undefined) callbackFunction.call(null);
			});
		}
	}
	else 
	{
		if (!this._multiLayout && callbackFunction != undefined) callbackFunction.call(null);
	}

	// Pie Chart 2.	
	if (this._multiLayout) 
	{
		this._layer2.highlightColor = this.highlightColor;
		this._layer2.selectionColor = this.selectionColor;
		this._layer2.tip = this.tip;

		if (this._chart2Defined == false)
		{
			this._chart2Defined = true	;
			this._$pieContainer2.append(this._chart2.container);

			// Wait till charts ready before returning.
			this._chart2.addEventListener(ia.Event.MAP_READY, function() 
			{
				if (callbackFunction != undefined) callbackFunction.call(null);
			});
		}
		else
		{
			if (callbackFunction != undefined) callbackFunction.call(null);
		}
	}
};

/** 
 * Specifies a dataprovider.
 *
 * @method setData
 */
ia.AreaBreakdownPieComponent.prototype.setData = function(data)
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
ia.AreaBreakdownPieComponent.prototype.highlight = function(id)
{		
	if (this._multiLayout) 
	{
		if (this._selectionIds.length == 1)
		{
			this._layer2.itemId = id;
			this._layer2.update();
			this._layer2.render();
			this._$chartTitle2.html(this._layer2.itemName);
		}
		else if (this._selectionIds.length == 0)
		{
			this._layer1.itemId = id;
			this._layer1.update();
			this._layer1.render();
			this._$chartTitle1.html(this._layer1.itemName);
		}
	}
	else
	{
		if (this._selectionIds.length == 0)
		{
			this._layer1.itemId = id;
			this._layer1.update();
			this._layer1.render();
			this._$chartTitle1.html(this._layer1.itemName);
		}
	}
};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.AreaBreakdownPieComponent.prototype.clearHighlight = function() 
{
	if (this._multiLayout) 
	{
		if (this._selectionIds.length == 1)
		{
			this._$chartTitle2.html(this.title2);
			this._layer2.itemId = null;
			this._layer2.update();
			this._layer2.render();
		}
		else if (this._selectionIds.length == 0)
		{
			this._$chartTitle1.html(this.title1);
			this._layer1.itemId = null;
			this._layer1.update();
			this._layer1.render();
		}
	}
	else
	{
		if (this._selectionIds.length == 0)
		{
			this._$chartTitle1.html(this.title1);
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
ia.AreaBreakdownPieComponent.prototype.select = function(id)
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
			this._$chartTitle2.html(this._layer2.itemName);
		}
		else
		{
			this._layer1.itemId = id;
			this._layer1.update();
			this._layer1.render();
			this._$chartTitle1.html(this._layer1.itemName);
		}
	}
	else
	{
		this._layer1.itemId = id;
		this._layer1.update();
		this._layer1.render();
		this._$chartTitle1.html(this._layer1.itemName);
	}
};

/**
 * Unselects an item.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.AreaBreakdownPieComponent.prototype.unselect = function(id) 
{
	var index = this._selectionIds.indexOf(id);
	if (index != -1) this._selectionIds.splice(index, 1);
	
	if (this._multiLayout) 
	{
		if (this._selectionIds.length == 0)
		{
			this._$chartTitle1.html(this.title1);
			this._layer1.itemId = null;
			this._layer1.update();
			this._layer1.render();
		}
		else if (this._selectionIds.length == 1)
		{
			this._$chartTitle2.html(this.title2);
			this._layer2.itemId = null;
			this._layer2.update();
			this._layer2.render();
		}
	}
	else
	{
		if (this._selectionIds.length == 0)
		{
			this._$chartTitle1.html(this.title1);
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
ia.AreaBreakdownPieComponent.prototype.clearSelection = function() 
{
	this._selectionIds = [];
	
	this._layer1.itemId = null;
	this._layer1.update();
	this._layer1.render();
	this._$chartTitle1.html(this.title1);
	
	if (this._multiLayout) 
	{
		this._layer2.itemId = null;
		this._layer2.update();
		this._layer2.render();
		this._$chartTitle2.html(this.title2);
	}
};

/**
 * Renders the component.
 *
 * @method render
 */
ia.AreaBreakdownPieComponent.prototype.render = function() 
{
	this._layer1.update();
	this._layer1.render();
	if (this._$chartTitle1.html() == "") this._$chartTitle1.html(this.title1);
	if (this._multiLayout) 
	{
		this._layer2.update();
		this._layer2.render();
		if (this._$chartTitle2.html() == "") this._$chartTitle2.html(this.title2);
	}	
};

/**
 * Toggles the chart visibility.
 *
 * @method toggle
 */
ia.AreaBreakdownPieComponent.prototype.toggle = function(visible)
{
	if (this._isVisible) this.hide();
	else this.show();
};

/**
 * Hides the chart.
 *
 * @method hide
 */
ia.AreaBreakdownPieComponent.prototype.hide = function()
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
ia.AreaBreakdownPieComponent.prototype.show = function()
{
	if (!this._isVisible)
	{
		this._isVisible = true;
		this.container.stop();
		this.container.animate({opacity: 1}, function() {});
	}
};