/** 
 * Contains information about a filter.
 *
 * @author J Clare
 * @class ia.Filter
 * @extends ia.BaseData
 * @constructor
 * @param {JSON} data The filter data.
 */
ia.Filter = function(data)
{
	ia.Filter.baseConstructor.call(this, data);
};
ia.extend(ia.BaseData, ia.Filter);