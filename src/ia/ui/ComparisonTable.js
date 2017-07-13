/** 
 * A class for rendering a comparison table.
 *
 * @author J Clare
 * @class ia.ComparisonTable
 * @extends ia.Table
 * @constructor
 * @param id The id of the table.
 */
ia.ComparisonTable = function(id)
{		
	ia.ComparisonTable.baseConstructor.call(this, id);
};
ia.extend(ia.Table, ia.ComparisonTable);

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.ComparisonTable.prototype.clearSelection = function() {};