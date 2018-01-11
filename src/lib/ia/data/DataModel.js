/** 
 * Contains information about a report.
 *
 * @author J Clare
 * @class ia.AGOLData
 * @constructor
 */
ia.AGOLData = function()
{
	this.iaData = {};
	//this.geogsWithData = {}; 	// Hash of IA geographies containing data.
	//this.themesWithData = {}; // Hash of IA themes containing data.
	this.geogModels = {}; 		// Hash of geography models.
	this.geogs = {}; 			// Hash of IA geographies.
	this.themes = {}; 			// Hash of IA themes.
	this.indicators = {}; 		// Hash of IA indicators.
};

/** 
 * The raw json data describing the IA data.
 *
 * @property iaData
 * @type JSON
 */
ia.AGOLData.prototype.iaData;

/** 
 * The raw json data describing the data model.
 *
 * @property dataModel
 * @type JSON
 */
ia.AGOLData.prototype.dataModel;

/** 
 * Loads and parses the source file then calls the given function.
 *
 * @method loadSource
 * @param {String} url The url to the data. 
 * @param {Function} callbackFunction The call back function. 
 */
ia.AGOLData.prototype.loadSource = function(url, callbackFunction) 
{
	var me = this;
	this.url = url;
	this.path = ia.File.getFileDirectory(this.url);

	ia.File.load(
	{
		url: url,
		dataType: 'json', 
		onSuccess:function(dataModel)
		{
			// Parses a data model
			me.parseData(dataModel, callbackFunction);
		}
	});
};

/** 
 * Parses a 'data model' JSON into IA 'data' JSON.
 *
 * @method parseDataModel
 * @param {JSON} dataModel The data model.
 * @param {Function} callbackFunction The call back function. 
 */	
ia.AGOLData.prototype.parseData = function(dataModel, callbackFunction) 
{
	var me = this;

	//this.geogsWithData = {};
	this.geogModels = {};
	this.geogs = {};
	this.themes = {};
	this.indicators = {};
	this.dataModel = dataModel;

	// Initialise IA Data.
	this.iaData = 
	{
		'version' 		: dataModel.version,
		'geographies' 	: []
	};

	// Geographies
	var agolGeogs = dataModel.geographies;
	if (agolGeogs != undefined && agolGeogs.length > 0)  
	{	
		var geogCount = -1;
		function onGeogReady()
		{
			geogCount++;
			if (geogCount == agolGeogs.length) 
			{
				callbackFunction.call(null, me.iaData); // return.
			}
			else 
			{
				me.buildGeography(agolGeogs[geogCount], function(iaGeography)
				{
					onGeogReady();
				});
			}
		};
		onGeogReady();
	}
	else callbackFunction.call(null, me.iaData); // return. 
};

ia.AGOLData.prototype.getGeography = function(id) 
{
	return this.geogs[id];
};

/** 
 * Builds the IA geography structure (without data) from a geography model.  
 *
 * @method buildGeography
 * @param {JSON} geogModel The geography model.
 * @param {Function} callback The call back function. 
 */
ia.AGOLData.prototype.buildGeography = function(geogModel, callback) 
{
	var me = this;

	// Define a new iaGeography.
	var iaGeography = 
	{
		'id'				: geogModel.id,
		'name' 				: geogModel.name,
		'type' 				: geogModel.type,
		'url' 				: geogModel.url,
		'idField' 			: geogModel.idField,
		'nameField' 		: geogModel.nameField,
		'themes' 			: [],
		'features' 			: [],
		'comparisonFeatures': [],
		'fieldNames' 		: [geogModel.idField, geogModel.nameField],
		'urlList'			: [],
		'indicatorList'		: [],
		'indicators'		: {}
	};

	// Check if its a new geography.
	if (this.geogs[iaGeography.id] == undefined)
	{
		// Its a new geography.
		me.iaData.geographies[me.iaData.geographies.length] = iaGeography;
	}

	// Update Hash tables.
	//delete this.geogsWithData[geogModel.id];

	this.geogModels[geogModel.id] = geogModel;
	this.geogs[iaGeography.id] = iaGeography;

	// Check for object ids.
	if (geogModel.objectIds != undefined) iaGeography.objectIds = geogModel.objectIds.split(',');

	// Check for filters.
	if (geogModel.model.filters != undefined) iaGeography.filters = geogModel.model.filters;

	// Check for feature properties and filter values and add them to the geography field names list.
	if (geogModel.model.features != undefined)
	{
		// Properties.
		var props = geogModel.model.features.properties;
		if (props != undefined)
		{
			for (var j = 0; j < props.length; j++) 
			{
				var prop = props[j];
				if (iaGeography.fieldNames.indexOf(prop.src.fieldName) == -1)
					iaGeography.fieldNames[iaGeography.fieldNames.length] = prop.src.fieldName;
			}
		}

		// Filters.
		var filters = geogModel.model.features.filters;
		if (filters != undefined)
		{
			for (var j = 0; j < filters.length; j++) 
			{
				var filter = filters[j];
				if (iaGeography.fieldNames.indexOf(filter.src.fieldName) == -1)
					iaGeography.fieldNames[iaGeography.fieldNames.length] = filter.src.fieldName;
			}
		}
	}

	// Themes.
	var themeModels = geogModel.model.themes;
	if (themeModels != undefined && themeModels.length > 0) 
	{
		this.buildThemes(iaGeography, iaGeography, themeModels, function()
		{
			callback.call(null, iaGeography); // return.
		}); 
	}
	else callback.call(null, iaGeography); // return.
};


/** 
 * Builds the themes for a geography.  
 *
 * @method buildThemes
 * @param {JSON} iaGeography An IA Geography.
 * @param {JSON} iaParent The parent of these themes. An IA Geography or IA Theme.
 * @param {JSON} themeModels A list of theme models. 
 * @param {Function} callback The call back function. 
 */
ia.AGOLData.prototype.buildThemes = function(iaGeography, iaParent, themeModels, callback) 
{
	var me = this;

	var themeCount = -1;
	function onThemeReady()
	{
		themeCount++;
		if (themeCount == themeModels.length) callback.call(null); // return.
		else me.buildTheme(iaGeography, iaParent, themeModels[themeCount], onThemeReady)
	};
	onThemeReady();
};

/** 
 * Builds an  theme.  
 *
 * @method buildTheme
 * @param {JSON} iaGeography An IA Geography.
 * @param {JSON} themeModel The theme model.
 * @param {JSON} iaParent The parent of the theme. An IA Geography or IA Theme.
 * @return {JSON} The IA indicator or associate.
 * @param {Function} callback The call back function. 
 */
ia.AGOLData.prototype.buildTheme = function(iaGeography, iaParent, themeModel, callback) 
{				
	var me = this;

	// Theme points to a json theme file.
	if (themeModel.sourceType && themeModel.sourceType == 'IA-JSON')
	{
		$j.getJSON(ia.getDomainSafeUrl(themeModel.url)) 
		.done(function (iaData) // This could be a geography or a theme object.
		{
			if (iaData.geographies) // Its a geography.
			{
				for (var i = 0; i < iaData.geographies.length; i++)
				{ 	
					var geog = iaData.geographies[i];
					for (var j = 0; j < geog.themes.length; j++)
					{ 	
						iaParent.themes[iaParent.themes.length] = geog.themes[j];
					}
				}
			}
			else // Its a theme.
			{
				iaParent.themes[iaParent.themes.length] = iaData;
			}
			callback.call(null); // return.
		})
		.fail(function(jqXHR, textStatus, errorThrown) {});
	}
	else
	{
		var iaTheme = 
		{
			'id' 			: themeModel.id, 
			'precision' 	: themeModel.precision,
			'href' 			: themeModel.href,
			'name' 			: themeModel.name,
			'properties' 	: themeModel.properties, 
			'indicators' 	: []
		};
		this.themes[iaTheme.id] = iaTheme;
		if (themeModel.src) iaTheme.url = themeModel.src.url;
		iaParent.themes[iaParent.themes.length] = iaTheme;

		// Indicators.
		var indicatorModels = themeModel.indicators;
		for (var j = 0; j < indicatorModels.length; j++)
		{ 	
			var indicatorModel = indicatorModels[j];
			var iaIndicator = this.buildIndicator(iaGeography, iaTheme, indicatorModel);

			iaTheme.indicators[iaTheme.indicators.length] = iaIndicator;

			// Associates.
			if (indicatorModel.associates != undefined && indicatorModel.associates.length > 0)
			{
				iaIndicator.associates  = new Array();
				for (var k = 0; k < indicatorModel.associates.length; k++)
				{ 	
					var agolAssociate = indicatorModel.associates[k];
					var iaAssociate = this.buildIndicator(iaGeography, iaTheme, agolAssociate);
					iaIndicator.associates[iaIndicator.associates.length] = iaAssociate;
				}
			}
		}

		// Nested Themes.
		if (themeModel.themes && themeModel.themes.length > 0) 
		{
			iaTheme.themes = new Array();
			this.buildThemes(iaGeography, iaTheme, themeModel.themes, function()
			{
				callback.call(null); // return.
			});
		}
		else
		{
			callback.call(null); // return.
		}
	}

	return iaTheme;
};

/** 
 * Builds an indicator or associate.  
 *
 * @method buildIndicator
 * @param {JSON} iaGeography An IA Geography.
 * @param {JSON} iaTheme An IA Theme.
 * @param {JSON} indicatorModel The indicator or associate model.
 * @return {JSON} The IA indicator or associate.
 */
ia.AGOLData.prototype.buildIndicator = function(iaGeography, iaTheme, indicatorModel) 
{
	var me = this;
	
	// This can be an indicator or an associate.
	var iaIndicator = 
	{
		'id'				: indicatorModel.id,
		'name' 				: indicatorModel.name,		
		'precision' 		: indicatorModel.precision,
		'href' 				: indicatorModel.href,
		'url' 				: indicatorModel.src.url,
        'srcFormat'         : indicatorModel.src.format,
		'fieldName' 		: indicatorModel.src.fieldName,
		'rowFilters' 		: indicatorModel.src.rowFilters,
		'properties' 		: indicatorModel.properties, 
		'values' 			: [],
		'comparisonValues'	: []
	};

	if ((indicatorModel.date != "null") && 
		(indicatorModel.date != null) && 
		(indicatorModel.date != "NaN") && 
		(indicatorModel.date != "") && 
		(indicatorModel.date != "No Data") && 
		(indicatorModel.date != undefined)) 
	{
		iaIndicator.date = indicatorModel.date; 
		iaGeography.indicators[iaIndicator.id+'_'+iaIndicator.date] = iaIndicator; // To fix bug with repeated indicator ids across geographies (JC 21/04/17).
		this.indicators[iaIndicator.id+'_'+iaIndicator.date] = iaIndicator;
	}
	else 
	{
		iaGeography.indicators[iaIndicator.id] = iaIndicator; // To fix bug with repeated indicator ids across geographies (JC 21/04/17).
		this.indicators[iaIndicator.id] = iaIndicator;
	}

	if (indicatorModel.type) iaIndicator.type = indicatorModel.type.toLowerCase(); 
	else iaIndicator.type = 'numeric'; 

	// If the indicator/associate url matches the geography url or isnt defined at all 
	// its field can be included in the query for the geography data.
	if ((iaIndicator.url == iaGeography.url) || iaIndicator.url == undefined || iaIndicator.url == '')
	{

		// <<<<<<< Fix for comma bug injected into old reports for csv >>>>>>>>>
		var suffix = ',0';
		if (iaIndicator.fieldName && iaIndicator.fieldName.indexOf(suffix, this.length - suffix.length) !== -1)
		{
			var arr = iaIndicator.fieldName.split(',');
			var popped = arr.pop();
			iaIndicator.fieldName = arr.join(',');
		}
		// <<<<<<< Fix for comma bug injected into old reports for csv >>>>>>>>>

		if (iaTheme.url != undefined && iaTheme.url != '')
		{			
			//addUrl(iaTheme.url, iaIndicator);
			if (iaGeography.urlList[iaTheme.url] == undefined) iaGeography.urlList[iaTheme.url] = new Array();
			iaGeography.urlList[iaTheme.url].push(iaIndicator);
			iaIndicator.url = iaTheme.url;
		}
		else
		{
			if (iaGeography.fieldNames.indexOf(iaIndicator.fieldName) == -1)
				iaGeography.fieldNames[iaGeography.fieldNames.length] = iaIndicator.fieldName;
			iaGeography.indicatorList[iaGeography.indicatorList.length] = iaIndicator;
		}
	}
	else 
	{
		// Flipped the test - CSV file or any other where the ID field is explicitly set...
        if (iaIndicator.srcFormat && indicatorModel.src.fieldName && (indicatorModel.src.fieldName.split(',').length > 1))
		{
			// For csv indicators fieldname is a comma-separated list containing
			// the data field followed by the id field.

			// Fix issue of folk putting commas in fieldname.
			var arr = indicatorModel.src.fieldName.split(',');
			iaIndicator.idField = arr.pop();
			iaIndicator.fieldName = arr.join(',');
			//iaIndicator.fieldName = indicatorModel.src.fieldName.split(',')[0];
			//iaIndicator.idField = indicatorModel.src.fieldName.split(',')[1];
		}
        else if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0)) 
		&&  (iaIndicator.url.indexOf('FeatureServer') != -1 
		|| iaIndicator.url.indexOf('MapServer') != -1          	// Feature Service.
		|| iaIndicator.url.indexOf('?f=geojson') > 0 
		|| iaIndicator.url.indexOf('&f=geojson') > 0 
		|| iaIndicator.url.indexOf('?sv=') > 0))				// GeoJson.
		{
			if (indicatorModel.src.idField != undefined && indicatorModel.src.idField != '')
			{
				iaIndicator.idField = indicatorModel.src.idField;
			}
			else
			{
				iaIndicator.idField = iaGeography.idField;
			}

			// <<<<<<< Fix for comma bug injected into old reports for csv >>>>>>>>>
			var suffix = ',0';
			if (iaIndicator.fieldName && iaIndicator.fieldName.indexOf(suffix, this.length - suffix.length) !== -1)
			{
				var arr = iaIndicator.fieldName.split(',');
				var popped = arr.pop();
				iaIndicator.fieldName = arr.join(',');
			}
			// <<<<<<< Fix for comma bug injected into old reports for csv >>>>>>>>>
		}
		else // CSV file.
		{
			// For csv indicators fieldname is a comma-separated list containing
			// the data field followed by the id field.

			// Fix issue of folk putting commas in fieldname.
			var arr = indicatorModel.src.fieldName.split(',');
			iaIndicator.idField = arr.pop();
			iaIndicator.fieldName = arr.join(',');
			//iaIndicator.fieldName = indicatorModel.src.fieldName.split(',')[0];
			//iaIndicator.idField = indicatorModel.src.fieldName.split(',')[1];
		}

		//addUrl(iaIndicator.url, iaIndicator);
		if (iaGeography.urlList[iaIndicator.url] == undefined) iaGeography.urlList[iaIndicator.url] = new Array();
		iaGeography.urlList[iaIndicator.url].push(iaIndicator);
	}


	if (iaGeography.firstIndicator == undefined) iaGeography.firstIndicator = iaIndicator;

	return iaIndicator;

	/*function addUrl(url, iaIndicator)
	{
		// Add the url of the indicator to the url list. We do this so
		// that each url only needs to be called once rather than for each
		// indicator individually.

		// Unique URLs by geog.
		var n = iaGeography.urlList.length;
		var newUrl = true;
		for (var i = 0; i < n; i++) 
		{
			var c = iaGeography.urlList[i]
			if (c.url == url)
			{
				c.indicators[c.indicators.length] = iaIndicator;
				newUrl = false;
				break;
			}
		}
		if (newUrl) iaGeography.urlList[iaGeography.urlList.length] = {url:url, indicators:[iaIndicator]};*/

		// Unique URLs by theme.
		/*var n = iaTheiaGeography.urlList.length;
		var newUrl = true;
		for (var i = 0; i < n; i++) 
		{
			var c = iaTheiaGeography.urlList[i]
			if (c.url == url)
			{
				c.indicators[c.indicators.length] = iaIndicator;
				newUrl = false;
				break;
			}
		}
		if (newUrl) iaTheiaGeography.urlList[iaTheiaGeography.urlList.length] = {url:url, indicators:[iaIndicator]};
	};*/
};

/** 
 * Check if the data model has data for the given geography id.
 *
 * @method hasData
 * @param {String} geogId The geography id.
 * @return {Boolean} true or false.
 */	
/*ia.AGOLData.prototype.hasData = function(geogId) 
{
	if (this.geogsWithData[geogId] != undefined) return true;
	else return false;
};*/

/** 
 * Loads the data (if necessary) for the geography with the given id and returns the JSON for the IA Geography.
 *
 * @method getGeography
 * @param {String} geogId The geography id.
 * @param {Function} callback The call back function. 
 */	
/*ia.AGOLData.prototype.getGeography = function(geogId, callback) 
{
	var me = this;

	if (me.geogsWithData[geogId]) 
	{
		callback.call(null, me.geogsWithData[geogId]); // return.
	}
	else
	{
		// Get the geography.
		var iaGeography = me.geogs[geogId];

		// Request the geography data.
		if ((iaGeography.url.indexOf('?f=geojson') > 0) 
		|| (iaGeography.url.indexOf('&f=geojson') > 0) 
		|| (iaGeography.url.indexOf('?sv=') > 0)) 	// GeoJson - test for token param
		{
			ia.File.load(
			{
				url: iaGeography.url,
				dataType: "json", 
				onSuccess:function(json)
				{
					iaGeography.fsFeatures = json.features;
					me._processFeatures(geogId, json.features);
					me._processData(geogId, json.features, callback);
				}
			});
		}
		else 										// Feature Service
		{
			var fsUrl = ia.FeatureServiceReader.buildQuery(iaGeography.url, iaGeography.fieldNames, iaGeography.objectIds);
			ia.FeatureServiceReader.sendQuery(fsUrl, ia.accessToken, function(fsFeatures)
			{	
				iaGeography.fsFeatures = fsFeatures;
				me._processFeatures(geogId, fsFeatures);
				me._processData(geogId, fsFeatures, callback);
			});
		}
	}
};*/


/** 
 * @private 
 */
/*ia.AGOLData.prototype._processData = function(geogId, fsFeatures, callback)
{
	var me = this;

	// Get the geography.
	var iaGeography = me.geogs[geogId];

	// Query and CSV indicators.
	var count = -1;
	function onComplete()
	{
		count++;
		if (count == iaGeography.urlList.length) 
		{
			me.geogsWithData[iaGeography.id] = iaGeography;
			callback.call(null, iaGeography); // return.
		}
		else 
		{
			var url = iaGeography.urlList[count].url;
			var indicators = iaGeography.urlList[count].indicators; 
			var iaIndicator = indicators[0];

			if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0))
				&& (url.indexOf('FeatureServer') != -1 || url.indexOf('MapServer') != -1))
			{
				me.getQueryData(iaGeography.idField, fsFeatures, url, indicators, onComplete); 		// Feature service query.
			}
			if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0))
				&& (url.indexOf('?f=geojson' > 0) || url.indexOf('&f=geojson' > 0) || url.indexOf('?sv=') > 0))
			{
				me.getGeoJsonData(iaGeography.idField, fsFeatures, url, indicators, onComplete); 	// GeoJson.
			}
			else
				me.readCsvFile(iaGeography, iaGeography.idField, fsFeatures, url, indicators, onComplete);  		// CSV File.
		}
	};
	onComplete();
};*/

/** 
 * Loads the data (if necessary) for the theme with the given id and returns the JSON for the IA Theme.
 *
 * @method getTheme
 * @param {String} geogId The geography id.
 * @param {String} themeId The theme id.
 * @param {Function} callback The call back function. 
 */	
/*ia.AGOLData.prototype.getTheme = function(geogId, themeId, callback) 
{
	var me = this;

	if (me.themesWithData[themeId]) 
	{
		callback.call(null, me.themesWithData[themeId]); // return.
	}
	else
	{
		// Get the geography.
		var iaGeography = me.geogs[geogId];

		// Get the theme.
		var iaTheme = me.themes[themeId];

		// Query and CSV indicators.
		var count = -1;
		function onComplete()
		{
			count++;
			if (count == iaTheiaGeography.urlList.length) 
			{
				me.themesWithData[iaTheme.id] = iaTheme;
				callback.call(null, iaTheme); // return.
			}
			else 
			{
				var url = iaTheiaGeography.urlList[count].url;
				var indicators = iaTheiaGeography.urlList[count].indicators; 
				var iaIndicator = indicators[0];

				if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0))
					&& (url.indexOf('FeatureServer') != -1 || url.indexOf('MapServer') != -1))
				{
					me.getQueryData(iaGeography.idField, iaGeography.fsFeatures, url, indicators, onComplete); 		// Feature service query.
				}
				if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0))
					&& (url.indexOf('?f=geojson' > 0) || url.indexOf('&f=geojson' > 0) || url.indexOf('?sv=') > 0))
				{
					me.getGeoJsonData(iaGeography.idField, iaGeography.fsFeatures, url, indicators, onComplete); 	// GeoJson.
				}
				else
					me.readCsvFile(iaGeography, iaGeography.idField, iaGeography.fsFeatures, url, indicators, onComplete);  		// CSV File.
			}
		};
		onComplete();
	}
};*/

/** 
 * Loads the features for the geography with the given id and returns the JSON for the IA Geography.
 *
 * @method getGeography
 * @param {String} geogId The geography id.
 * @param {Function} callback The call back function. 
 */	
ia.AGOLData.prototype.getFeatures = function(geogId, callback) 
{
    var me = this;

	// Get the geography.
	var iaGeography = me.geogs[geogId];

	// Request the geography data.
	if ((iaGeography.url.indexOf('?f=geojson') > 0) 
	|| (iaGeography.url.indexOf('&f=geojson') > 0) 
	|| (iaGeography.url.indexOf('?sv=') > 0)) 	// GeoJson - test for token param
	{
		ia.File.load(
		{
			url: iaGeography.url,
			dataType: "json", 
			onSuccess:function(json)
			{
				iaGeography.fsFeatures = json.features;
				me._processFeatures(geogId, json.features, function()
				{
					// Load first indicator in case theres comparison features in the csv file.
					var iaIndicator = iaGeography.firstIndicator;
					if (iaIndicator != undefined)
					{
						me.getIndicator(iaGeography.id, iaIndicator.id, iaIndicator.date, function() 
						{
							callback.call(null, iaGeography);
						}) 
					}
					else callback.call(null, iaGeography);
				});
			}
		});
	}
	else 										// Feature Service
	{
	    this._checkForRelationships(geogId, function ()
	    {
	        var fsUrl = ia.FeatureServiceReader.buildQuery(iaGeography.url, iaGeography.fieldNames, iaGeography.objectIds);

	        ia.FeatureServiceReader.sendQuery(fsUrl, ia.accessToken, function (fsFeatures)
	        {
	            iaGeography.fsFeatures = fsFeatures;
	            me._processFeatures(geogId, fsFeatures, function ()
	            {
	                // Load first indicator in case theres comparison features in the csv file.
	                var iaIndicator = iaGeography.firstIndicator;
	                if (iaIndicator != undefined)
	                {
	                    me.getIndicator(iaGeography.id, iaIndicator.id, iaIndicator.date, function ()
	                    {
	                        callback.call(null, iaGeography);
	                    })
	                }
	                else callback.call(null, iaGeography);
	            });
	        });
	    });
	}
};

ia.AGOLData.prototype._checkForRelationships = function (geogId, callback)
{
    var me = this;

    // Get the geography.
    var iaGeography = this.geogs[geogId];

    ia.FeatureServiceReader.getInfo(iaGeography.url, ia.accessToken, function (info)
    {
        if (info && info.relationships != undefined && info.relationships.length > 0)
        {
            var count = -1;
            function onComplete()
            {
                count++;
                if (count == info.relationships.length)
                {
                    callback.call(null); // return.
                }
                else
                {
                    var r = info.relationships[count];
                    if (r.cardinality == 'esriRelCardinalityOneToMany' && r.role == 'esriRelRoleDestination')
                    {
                        var url = iaGeography.url + '/queryRelatedRecords'
                        //var params = 'outFields=' + iaGeography.fieldNames.join(',') + '&relationshipId=' + r.id + '&objectids=1&returnGeometry=false&f=pjson';
                        var params = 'outFields=*&relationshipId=' + r.id + '&objectids=1&returnGeometry=false&f=pjson';

                        ia.File.load(
                        {
                            url: url,
                            type: 'POST',
                            dataType: 'json',
                            data: params,
                            onSuccess: function (fsLayer)
                            {
                            	if (fsLayer.relatedRecordGroups != undefined && fsLayer.relatedRecordGroups.length > 0)
                            	{
                            		var rrg = fsLayer.relatedRecordGroups[0];
                            		if (rrg.relatedRecords != undefined && rrg.relatedRecords.length > 0)
                            		{
		                                var attributes = rrg.relatedRecords[0].attributes;
		                                var featureId = String(r.id);
		                                if (r.keyField !== undefined && attributes[r.keyField] !== undefined) featureId = attributes[r.keyField];

		                                iaGeography.comparisonFeatures[iaGeography.comparisonFeatures.length] =
		                                {
		                                    'id': featureId.replace(/^#/, ''),
		                                    'name': String(attributes.NAME)
		                                };

		                                for (var j = 0; j < iaGeography.indicatorList.length; j++)
		                                {
		                                    var iaIndicator = iaGeography.indicatorList[j];
		                                    var dataValue = attributes[iaIndicator.fieldName];
		                                    if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) dataValue = me.formatter.noDataValue;
		                                    iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = dataValue;
		                                }
                            		}
                            	}
                                onComplete();
                            },
                            onFail: function ()
                            {
                                onComplete();
                            }
                        });
                    }
                    else onComplete();
                }
            };
            onComplete();
        }
        else callback.call(null);
    });
};

/** 
 * Loads the data (if necessary) for the theme with the given id and returns the JSON for the IA Theme.
 *
 * @method getTheme
 * @param {String} geogId The geography id.
 * @param {String} themeId The theme id.
 * @param {Function} callback The call back function. 
 */	
ia.AGOLData.prototype.getTheme = function(geogId, themeId, callback) 
{
	var me = this;

	// Get the geography.
	var iaGeography = me.geogs[geogId];

	// Get the theme.
	//var iaTheme = me.themes[themeId];
	var iaTheme = getThemeJson(iaGeography.themes, themeId);

	// Query and CSV indicators.
	var count = -1;
	function onComplete()
	{
		count++;
		if (count == iaTheme.indicators.length) 
		{
			callback.call(null, iaTheme); // return.
		}
		else 
		{
			var iaIndicator = iaTheme.indicators[count];
			if (iaIndicator.values && iaIndicator.values.length > 0) 
			{
				onComplete();
			}
			else
			{
				var indicators = iaGeography.urlList[iaIndicator.url]; 
				if (indicators && indicators.length > 0)
				{
					me._loadIndicatorData(iaGeography, iaIndicator.url, indicators, function()
					{
						onComplete();
					});
				}
				else onComplete();
			}
		}
	};
	onComplete();
};

// TODO - check nested themes work here!!!!!!!!!!!
function getThemeJson (themes, themeId)
{
	for (var j = 0; j < themes.length; j++) 	
	{
		var thm = themes[j];
		if (thm.id == themeId)
		{
			return thm;
		}
		else if (thm.themes && thm.themes.length > 0) 
		{
			var t = getThemeJson(thm.themes, themeId);
			if (t != false) return t;
		}
	}
	return false;
}

/** 
 * Loads the data (if necessary) for the indicator with the given id and returns the JSON for the IA Indicator.
 *
 * @method getTheme
 * @param {String} geogId The geography id.
 * @param {String} indicatorId The indicator id.
 * @param {String} date The date.
 * @param {Function} callback The call back function. 
 */	
ia.AGOLData.prototype.getIndicator = function(geogId, indicatorId, date, callback) 
{
	// Get the geography.
	var iaGeography = this.geogs[geogId];

	// Get the indicator.
	var iaIndicator;
	if ((date != "null") && (date != null) && (date != "NaN") && (date != "") && (date != "No Data") && (date != undefined)) 
	{
		iaIndicator = iaGeography.indicators[indicatorId+'_'+date]; // To fix bug with repeated indicator ids across geographies (JC 21/04/17).
		//iaIndicator = this.indicators[indicatorId+'_'+date];
	}
	else  		
	{		
		iaIndicator = iaGeography.indicators[indicatorId]; // To fix bug with repeated indicator ids across geographies (JC 21/04/17).								
		//iaIndicator = this.indicators[indicatorId];
	}

	var indicators = iaGeography.urlList[iaIndicator.url]; 
	if (indicators && indicators.length > 0)
	{
		this._loadIndicatorData(iaGeography, iaIndicator.url, indicators, function()
		{
			callback.call(null, indicators); // return.
		});
	}
	else callback.call(null, indicators); // return.
};

function updateJson(iaGeography, url, indicators)
{
	// Find and update the indicator json.
	for (var i = 0; i < indicators.length; i++) 	
	{
		var ind = indicators[i];
		var id = ind.id;
		var date = ind.date;

		for (var j = 0; j < iaGeography.themes.length; j++) 	
		{
			var thm = iaGeography.themes[j];
			for (var k = 0; k < thm.indicators.length; k++) 	
			{
				var thmInd = thm.indicators[k];

				if ((date != "null") && (date != null) && (date != "NaN") && (date != "") && (date != "No Data") && (date != undefined)) 
				{
					if (thmInd.id == id && thmInd.date == date) thmInd.values = ind.values.concat();
				}
				else  		
				{			
					if (thmInd.id == id) 
					{
						thmInd.values = ind.values.concat();
					}
				}
			}
		}
	}
}

ia.AGOLData.prototype._checkForIndicatorRelationships = function (iaGeography, url, indicators, callback)
{
    var me = this;

    ia.FeatureServiceReader.getInfo(url, ia.accessToken, function (info)
    {
        if (info && info.relationships != undefined && info.relationships.length > 0)
        {
            var count = -1;
            function onComplete()
            {
                count++;
                if (count == info.relationships.length)
                {
                    callback.call(null); // return.
                }
                else
                {
                    var r = info.relationships[count];
                    if (r.cardinality == 'esriRelCardinalityOneToMany' && r.role == 'esriRelRoleDestination')
                    {
                        var params = 'outFields=*&relationshipId=' + r.id + '&objectids=1&returnGeometry=false&f=pjson';
                        ia.File.load(
                        {
                            url: url + '/queryRelatedRecords',
                            type: 'POST',
                            dataType: 'json',
                            data: params,
                            onSuccess: function (fsLayer)
                            {
                            	if (fsLayer.relatedRecordGroups != undefined && fsLayer.relatedRecordGroups.length > 0)
                            	{
                            		var rrg = fsLayer.relatedRecordGroups[0];
                            		if (rrg.relatedRecords != undefined && rrg.relatedRecords.length > 0)
                            		{
   										var attributes = rrg.relatedRecords[0].attributes;
		                                for (var j = 0; j < indicators.length; j++)
		                                {
		                                    var iaIndicator = indicators[j];
		                                    var dataValue = attributes[iaIndicator.fieldName];
		                                    if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) dataValue = me.formatter.noDataValue;
		                                    iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = dataValue;
		                                }
                            		}
                            	}
                                onComplete();
                            },
                            onFail: function ()
                            {
                                onComplete();
                            }
                        });
                    }
                    else onComplete();
                }
            };
            onComplete();
        }
        else callback.call(null);
    });
};

/** 
 * @private 
 */
ia.AGOLData.prototype._loadIndicatorData = function(iaGeography, url, indicators, callback)
{
	var me = this;
	var count = -1;
	function onComplete()
	{
		count++;
		if (count == indicators.length) 
		{
			me._checkForIndicatorRelationships(iaGeography, url, indicators, function()
			{
				callback.call(null); // return.
			})
			//updateJson(iaGeography, url, indicators);
		}
		else 
		{
			var iaIndicator = indicators[count];
			if (iaIndicator.values && iaIndicator.values.length > 0) 
			{
				onComplete();
			}
			else
			{
				if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0))
					&& (url.indexOf('FeatureServer') != -1 || url.indexOf('MapServer') != -1))
				{
					me.getQueryData(iaGeography.idField, iaGeography.features, url, indicators, onComplete); 				// Feature service query.
				}
				else if ((!iaIndicator.srcFormat || (iaIndicator.srcFormat.toLowerCase().indexOf('csv') < 0))
					&& (url.indexOf('?f=geojson') > 0 || url.indexOf('&f=geojson') > 0 || url.indexOf('?sv=') > 0))
				{
					me.getGeoJsonData(iaGeography.idField, iaGeography.features, url, indicators, onComplete); 				// GeoJson.
				}
				else
				{
					me.readCsvFile(iaGeography, iaGeography.idField, iaGeography.fsFeatures, url, indicators, onComplete);  // CSV File.
				}
			}
		}
	};
	onComplete();
};

/** 
 * @private 
 */
ia.AGOLData.prototype._processFeatures = function(geogId, fsFeatures, callback)
{
	// Get the geography.
	var geogModel = this.geogModels[geogId]; 
	var iaGeography = this.geogs[geogId];

	// Iterate through the  features to populate the feature and indicator values.
	var n = fsFeatures.length;
	for (var i = 0; i < n; i++) 		
	{
		var fsFeature = fsFeatures[i];

		var attributes;
		if (fsFeature.attributes) 		attributes = fsFeature.attributes; // Feature Service.
		else if (fsFeature.properties) 	attributes = fsFeature.properties; // GeoJson.

		var featureId = String(attributes[iaGeography.idField]);
		var featureName = String(attributes[iaGeography.nameField]);

		// Define a new iaFeature.
		var iaFeature = 
		{
			'id' 	: featureId.replace(/^#/, ''),
			'name' 	: featureName
		};

		// Check for feature properties and filter values.
		if (geogModel.model.features != undefined)
		{
			// Properties.
			var props = geogModel.model.features.properties;
			if (props != undefined)
			{
				iaFeature.properties = new Array();
				for (var j = 0; j < props.length; j++) 
				{
					var prop = props[j];
					var iaProperty = 
					{
						'name' 	: prop.name,
						'value' : attributes[prop.src.fieldName]
					};
					iaFeature.properties[iaFeature.properties.length] = iaProperty;
				}
			}

			// Filters.
			var filters = geogModel.model.features.filters;
			if (filters != undefined)
			{
				iaFeature.filters = new Array();
				for (var j = 0; j < filters.length; j++) 
				{
					var filter = filters[j];
					var iaFilter = 
					{
						'for' 	: filter['id'],
						'name' 	: attributes[filter.src.fieldName]
					};
					iaFeature.filters[iaFeature.filters.length] = iaFilter;
				}
			}
		}

		// Add the feature.
		if (featureId.indexOf('#') == 0)
			iaGeography.comparisonFeatures[iaGeography.comparisonFeatures.length] = iaFeature;
		else 
			iaGeography.features[iaGeography.features.length] = iaFeature;

		// Indicators with same url/fs as geography.
		// This bit may be obsolete now as data has changed to loaded on a theme by theme basis JC 25/05/16.
		for (var j = 0; j < iaGeography.indicatorList.length; j++)
		{
			var iaIndicator = iaGeography.indicatorList[j];

			var dataValue = attributes[iaIndicator.fieldName];
			if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) dataValue = this.formatter.noDataValue;

			if (featureId.indexOf('#') == 0) 
			{
				// Comparison feature.
				iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = dataValue;
			}
			else
			{
				// Regular feature.
				iaIndicator.values[iaIndicator.values.length] = dataValue;
			}
		}
	}
	if (callback) callback.call(null, iaGeography); // return.
};

/** 
 * Reads in the data retrieved from a feature service query.  
 *
 * @method getQueryData
 * @param {String} featureIdField The field that contains the feature ids.
 * @param {JSON} features The list of features.
 * @param {String} url The query url.
 * @param {JSON[]} indicators The list of indicators and associates.
 * @param {Function} callback The call back function. 
 */
ia.AGOLData.prototype.getQueryData = function(featureIdField, features,  url, indicators, callback) 
{
	var me = this;
	ia.FeatureServiceReader.sendQuery(url, ia.accessToken, function(fsFeatures)
	{
		for (var i = 0; i < indicators.length; i++) 
		{
			var iaIndicator = indicators[i];

			// Get data values for indicator / associate.
			me._getDataValues(featureIdField, features, fsFeatures, iaIndicator);
		}
		callback.call(null);
	});
};

/** 
 * Reads in the data retrieved from a GeoJson file.  
 *
 * @method getGeoJsonData
 * @param {String} featureIdField The field that contains the feature ids.
 * @param {JSON} features The list of features.
 * @param {String} url The query url.
 * @param {JSON[]} indicators The list of indicators and associates.
 * @param {Function} callback The call back function. 
 */
ia.AGOLData.prototype.getGeoJsonData = function(featureIdField, features,  url, indicators, callback) 
{
	var me = this;
	ia.File.load(
	{
		url: url,
		dataType: "json", 
		onSuccess:function(json)
		{
			for (var i = 0; i < indicators.length; i++) 
			{
				var iaIndicator = indicators[i];

				// Get data values for indicator / associate.
				me._getDataValues(featureIdField, features, json.features, iaIndicator);
			}
			callback.call(null);
		}
	});
};

/** 
 * @private 
 */
ia.AGOLData.prototype._getDataValues = function(featureIdField, features,  fsFeatures, iaIndicator)
{
	var me = this;
	var featureValues = {};
	var comparisonValues = {};

	// Loop through the features returned from the query.
	var n = fsFeatures.length;
	for (var k = 0; k < n; k++) 
	{
		var fsFeature = fsFeatures[k];

		var attributes;
		if (fsFeature.attributes) 		attributes = fsFeature.attributes; // Feature Service.
		else if (fsFeature.properties) 	attributes = fsFeature.properties; // GeoJson.

		// Row filters.
		var pass = true;
		if (iaIndicator.rowFilters != undefined)
		{
			for (var key in iaIndicator.rowFilters)
			{
				if (attributes[key] != iaIndicator.rowFilters[key])
				{
					pass = false;
					break;
				}
			}
		}

		if (pass == true)
		{
			var featureId = String(attributes[iaIndicator.idField]);
			var dataValue = attributes[iaIndicator.fieldName];

			if (iaIndicator.type == 'numeric' && ia.isNumber(dataValue)) dataValue = parseFloat(dataValue);

			if (featureId.indexOf('#') == 0) 
		  		comparisonValues[featureId] = dataValue;
			else
		  		featureValues[featureId] = dataValue;
		}
	}

	// Match the feature ids up.
	var n = features.length;
	for (var k = 0; k < n; k++) 		
	{
		var featureId = features[k].id;
		if (featureId.indexOf('#') == 0) 
		{
			var dataValue = comparisonValues[featureId];
			if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
				iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = me.formatter.noDataValue;
			else 
				iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = comparisonValues[featureId];
		}
		else
		{
			var dataValue = featureValues[featureId];
			if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
				iaIndicator.values[iaIndicator.values.length] = me.formatter.noDataValue;
			else 
				iaIndicator.values[iaIndicator.values.length] = featureValues[featureId];
		}
	}
};

ia.AGOLData.prototype._CSVToArray = function(strData, strDelimiter)
{
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

/** 
 * Reads in a csv file.  
 *
 * @method readCsvFile
 * @param {JSON} iaGeography An IA Geography.
 * @param {String} featureIdField The field that contains the feature ids.
 * @param {JSON} fsFeatures The list of features.
 * @param {String} url The url of the csv file.
 * @param {JSON[]} indicators The list of indicators and associates.
 * @param {Function} callback The call back function. 
 */
ia.AGOLData.prototype.readCsvFile = function(iaGeography, featureIdField, fsFeatures, url, indicators, callback) 
{
	var me = this;

	// Strip beginning and ending single or double quotes.
	function trim(str)
	{
		if (str.charAt(0) == '"' && str.charAt(str.length - 1) == '"') str = str.substring(1, str.length-1)
		else if (str.charAt(0) == "'" && str.charAt(str.length-1) == "'") str = str.substring(1, str.length-2)
		return str;
	}

	if (ia.accessToken != '') 
	{
		if (url.indexOf('?') == -1) url += '?';
		else url += '&';
		url += 'token=' + ia.accessToken;
	}

	ia.File.load(
	{
		url: url,
        contentType: 'text/plain', // Because 'text/csv; charset=utf-8' triggers an OPTIONS request that causes all sorts of problems - see http://api.jquery.com/jquery.ajax/,
		dataType: 'text',
		onSuccess:function(csvData)
		{
			var fields = me._CSVToArray(csvData);
			var headers = fields[0];

			for (var j = 0; j < indicators.length; j++) 
			{
				var iaIndicator = indicators[j];

				var idColumnIndex = 0;
				var dataColumnIndex = 0;

				// Add a name field for when comparison areas are contained in csv files (azure).
				// All we can do is assume that the second column (index:1) contains the names.
				var nameColumnIndex = 1;

				for(var i = 0; i < headers.length; i++) 
				{
					var header = headers[i];
					if ($j.trim(iaIndicator.idField) == $j.trim(header)) idColumnIndex = i; 
					if ($j.trim(iaIndicator.fieldName) == $j.trim(header)) dataColumnIndex = i; 
				}

				var featureValues = {};
				var comparisonValues = {};
				var data = fields.slice(1, fields.length);

				for (var i = 0; i < data.length; i++) 
				{
					var d = data[i];
				  	var featureId = d[idColumnIndex];
				  	var dataValue = d[dataColumnIndex];
				  	var nameValue;
				  	if (d.length > 1) nameValue = d[nameColumnIndex]; // Azure.

					if (iaIndicator.type == 'numeric' && ia.isNumber(dataValue)) dataValue = parseFloat(dataValue);

					if (featureId != undefined && featureId != '')
					{
						if (featureId.indexOf('#') == 0) 
					  		comparisonValues[featureId.replace(/^#/, '')] = {name:nameValue, data:dataValue};
						else
					  		featureValues[featureId] = dataValue;
					}
				}

				// Comparison features that already exist.
				var arrComparisonFeatureIds = [];
				for (var i = 0; i < iaGeography.comparisonFeatures.length; i++) 		
				{
					var f = iaGeography.comparisonFeatures[i];
					arrComparisonFeatureIds.push(f.id);
					if (comparisonValues[f.id] != undefined)
					{
						var dataValue = comparisonValues[f.id].data;
						if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
							iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = me.formatter.noDataValue;
						else 
							iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = dataValue;
					}
					else iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = me.formatter.noDataValue;
				}

				// Match the feature ids up.
				var n = fsFeatures.length;
				for (var i = 0; i < n; i++) 		
				{
					var fsFeature = fsFeatures[i];

					var attributes;
					if (fsFeature.attributes) 		attributes = fsFeature.attributes; // Feature Service.
					else if (fsFeature.properties) 	attributes = fsFeature.properties; // GeoJson.

					var featureId = String(attributes[featureIdField]);

					/*if (featureId.indexOf('#') == 0)  
					{
						if (comparisonValues[featureId] != undefined)
						{
							var dataValue = comparisonValues[featureId].data;
							if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
								iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = me.formatter.noDataValue;
							else 
								iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = dataValue;
						}
						else iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = me.formatter.noDataValue;
					}
					else*/
					if (featureId.indexOf('#') !== 0) 	
					{
						var dataValue = featureValues[featureId];

						if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
							iaIndicator.values[iaIndicator.values.length] = me.formatter.noDataValue;
						else 
							iaIndicator.values[iaIndicator.values.length] = dataValue;
					}
				}

				// Check if theres any new comparison areas (azure).
				for (var id in comparisonValues) 		
				{
					var name = comparisonValues[id].name;
					if (name != undefined) // Doesnt have a name column.
					{
						if (arrComparisonFeatureIds.indexOf(id) == -1)
						{
							// Its a new comparison area.

							// Check if it already exists as a comparison feature.
							// If it does get the index so the value is put in the right position.
							/*var comparisonFeatureFound = false;
							for (var i = 0; i < iaGeography.comparisonFeatures.length; i++) 		
							{
								var comparisonFeature = iaGeography.comparisonFeatures[i];
								if (comparisonFeature.id == id)
								{	
									comparisonFeatureFound = true;
									break;
								}
							}
							if (!comparisonFeatureFound)
							{*/
								var dataValue = comparisonValues[id].data;
								if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
								{
									 dataValue = me.formatter.noDataValue;
								}
								// Not found in json feature list. So add it.
								iaGeography.comparisonFeatures.push({id:id, name:name});
							//}

							// Add comparison value to indicator.
							iaIndicator.comparisonValues.push(dataValue);
						}
					}
				}
			}

			callback.call(null);
		}
	});	
};


/*ia.AGOLData.prototype.readCsvFile = function(featureIdField, features, url, indicators, callback) 
{
	var me = this;

	// Strip beginning and ending single or double quotes.
	function trim(str)
	{
		if (str.charAt(0) == '"' && str.charAt(str.length - 1) == '"') str = str.substring(1, str.length-1)
		else if (str.charAt(0) == "'" && str.charAt(str.length-1) == "'") str = str.substring(1, str.length-2)
		return str;
	}

	if (ia.accessToken != '') 
	{
		if (url.indexOf('?') == -1) url += '?';
		else url += '&';
		url += 'token=' + ia.accessToken;
	}

	ia.File.load(
	{
		url: url,
		contentType: 'text/csv; charset=utf-8',
		dataType: 'text',
		onSuccess:function(csvData)
		{
			var fields = csvData.split(/\n/);
			fields.pop(fields.length-1);

			var headers = fields[0].split(',');

			for (var j = 0; j < indicators.length; j++) 
			{
				var iaIndicator = indicators[j];

				var idColumnIndex = 0;
				var dataColumnIndex = 0;
				for(var i = 0; i < headers.length; i++) 
				{
					var header = $j.trim(headers[i]);
					header = trim(header);

					if ($j.trim(iaIndicator.idField) == header) idColumnIndex = i; 
					if ($j.trim(iaIndicator.fieldName) == header) dataColumnIndex = i; 
				}

				var featureValues = {};
				var comparisonValues = {};
				var data = fields.slice(1, fields.length);

				for (var i = 0; i < data.length; i++) 
				{
				  	var featureId = $j.trim(data[i].split(',')[idColumnIndex]);
				  	featureId = trim(featureId);

				  	var dataValue = $j.trim(data[i].split(',')[dataColumnIndex]);
				  	dataValue = trim(dataValue);

					if (iaIndicator.type == 'numeric' && ia.isNumber(dataValue)) dataValue = parseFloat(dataValue);

					if (featureId.indexOf('#') == 0) 
				  		comparisonValues[featureId] = dataValue;
					else
				  		featureValues[featureId] = dataValue;
				}

				// Match the feature ids up.
				var n = features.length;
				for (var i = 0; i < n; i++) 		
				{
					var fsFeature = features[i];
					var featureId = String(fsFeature.attributes[featureIdField]);

					if (featureId.indexOf('#') == 0) 
					{
						var dataValue = comparisonValues[featureId];
						if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
							iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = me.formatter.noDataValue;
						else 
							iaIndicator.comparisonValues[iaIndicator.comparisonValues.length] = comparisonValues[featureId];
					}
					else
					{
						var dataValue = featureValues[featureId];
						if ((dataValue === "null") || (dataValue === null) || (dataValue === "NaN") || (dataValue === "") || (dataValue === undefined)) 
							iaIndicator.values[iaIndicator.values.length] = me.formatter.noDataValue;
						else 
							iaIndicator.values[iaIndicator.values.length] = featureValues[featureId];
					}
				}
			}

			callback.call(null);
		}
	});	
};*/