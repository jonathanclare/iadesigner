/** 
 * A class for rendering a set of legend classes as a html table.
 *
 * @author J Clare
 * @class ia.ProfileLegend
 * @extends ia.DiscreteLegend
 * @constructor
 * @param {String} id The id of the legend.
 */
ia.ProfileLegend = function(id)
{		
	ia.ProfileLegend.baseConstructor.call(this, id);
	
	this.container.addClass("ia-profile-legend");
	this._scrollBox = new ia.ScrollBox(this.container);
	this.isLegendComponent = false;
	this.interactive = false;
	this.legendClasses = [];
};
ia.extend(ia.DiscreteLegend, ia.ProfileLegend);

/**
 * A list of legend classes.
 *
 * @property legendClasses
 * @type ia.LegendClass[]
 */
ia.ProfileLegend.prototype.legendClasses;

/**
 * Renders the legend.
 *
 * @method render
 */
ia.ProfileLegend.prototype.render = function() 
{		
	this.renderLegend(this.legendClasses);
	this._scrollBox.refresh();
};