/** 
 * Contains information about a feature.
 *
 * @author J Clare
 * @class ia.Feature
 * @extends ia.BaseData
 * @constructor
 * @param {JSON} data The feature data.
 */
ia.Feature = function(data)
{
	ia.Feature.baseConstructor.call(this, data);
	
	// Private variables.
	this._filterHash = {};
	
	// Parse the JSON data.
	
	// Filters.
	this._filterHash = {};
	var filterValues = this.data.filters;
	if (filterValues != undefined) 
	{	
		var n = filterValues.length;
		for (var i = 0; i < n; i++) 
		{ 
			// ["for"] in square brackets fixes IE7,8 error
			var filterData = filterValues[i];
			this._filterHash[filterData["for"]] = filterData.name;
		}
	}	
};
ia.extend(ia.BaseData, ia.Feature);

/** 
 * Returns the filter value that corresponds to the filter id.
 * 
 * @method getFilterValue
 * @param {String} id The filter id.
 * @return {Number} The value for the given id.
 */
ia.Feature.prototype.getFilterValue = function(id) {return this._filterHash[id];};