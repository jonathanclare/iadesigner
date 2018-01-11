/** 
 * A class for rendering a set of legend classes as a html table.
 *
 * @author J Clare
 * @class ia.FeatureLegend
 * @extends ia.DiscreteLegend
 * @constructor
 * @param {String} id The id of the legend.
 */
ia.FeatureLegend = function(id)
{		
	ia.FeatureLegend.baseConstructor.call(this, id);
	
	// A list of legend classes
	this._selectionIds = [];
	this.container.addClass("ia-feature-legend");
	this._scrollBox = new ia.ScrollBox(this.container);
	this._renderTimeout = null;

	this.isLegendComponent = false;
	this.interactive = false;
	this.colorPalette = new ia.ColorPalette();
};
ia.extend(ia.DiscreteLegend, ia.FeatureLegend);

/**
 * Specifies a color palette for the legend.
 *
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.FeatureLegend.prototype.colorPalette;

/**
 * A geography object.
 *
 * @property geography
 * @type ia.Geography
 */
ia.FeatureLegend.prototype.geography;

/**
 * Renders the legend.
 *
 * @method render
 */
ia.FeatureLegend.prototype.render = function() 
{		
	this._renderTimeout = null;
	var legendClasses = [];
	var n = this._selectionIds.length;
	var colorList = this.colorPalette.getColors(n);
	
	for (var i = 0; i < n; i++)	
	{
		var id = this._selectionIds[i];
		var feature = this.geography.getFeature(id);
		if (feature != undefined)
		{
			var legendClass = new ia.CategoricClass(feature.name);
			legendClass.color = colorList[i];
			legendClasses[i] = legendClass;
		}
	}
	this.renderLegend(legendClasses);
	this._scrollBox.refresh();
};

/**
 * Highlights the legend class that contains the given id.
 *
 * @method highlight
 * @param {String} id The id of the item.
 */
ia.FeatureLegend.prototype.highlight = function(id) {};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.FeatureLegend.prototype.clearHighlight = function() {};

/**
 * Selects.
 *
 * @method select
 * @param {String} id The id of the item.
 */
ia.FeatureLegend.prototype.select = function(id) 
{
	var index = this._selectionIds.indexOf(id);
	if (index == -1) this._selectionIds.push(id);
	this._triggerRender();
};

/**
 * Unselects.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.FeatureLegend.prototype.unselect = function(id) 
{
	var index = this._selectionIds.indexOf(id);
	if (index != -1) this._selectionIds.splice(index, 1);
	this._triggerRender();
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.FeatureLegend.prototype.clearSelection = function() 
{	
	this._selectionIds = [];
	this._triggerRender();
};

/** 
 * Triggers a render. Prevents over rendering which results in a frozen browser.
 *
 * @method _triggerRender
 * @private
 */
ia.FeatureLegend.prototype._triggerRender = function()
{
	if (!this._renderTimeout) 
	{
		this._renderTimeout = setTimeout(function()
		{
			this.render()
		}.bind(this), 5);
	}
};