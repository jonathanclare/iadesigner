/** 
 * Utility methods for handling requests against feature services. All methods are static.
 *
 * @author J Clare
 * @class ia.FeatureServiceReader
 * @constructor
 */
ia.FeatureServiceReader = function() {};

/**
 * Builds a query for the passed parameters.
 * 
 * @static
 * @method buildQuery
 * @param {String} fsUrl The feature service url.
 * @param {String[]} outFields Optional list of out fields.
 * @param {String[]} objectIds Optional list of object ids.
 */
ia.FeatureServiceReader.buildQuery = function(fsUrl, outFields, objectIds)
{
	var queryUrl = fsUrl.split('?')[0];
	var whereString = ia.FeatureServiceReader.getParam(fsUrl, 'where');
	// Feature service with no query.
	if (queryUrl.indexOf('/query?') == -1) queryUrl += '/query?where=' + (whereString && (whereString != '') ? encodeURIComponent(whereString) : '1+%3D+1');

	// Append objectids and outfields.
	if (!ia.isUndefined(objectIds)) queryUrl += '&objectIds='+objectIds.join();
	if (!ia.isUndefined(outFields)) queryUrl += '&outFields='+outFields.join();

	return queryUrl;
};

/**
 * Returns the feature service component part of a given url.
 * 
 * @static
 * @method getFeatureService
 * @param {String} url The url.
 * @param {String} The feature service url.
 */
ia.FeatureServiceReader.getFeatureServiceUrl = function(url)
{
	var fsUrl = url;
	if (fsUrl.indexOf('/query?') != -1) 		fsUrl = fsUrl.split('/query?')[0];
	else if (fsUrl.indexOf('/export?') != -1) 	fsUrl = fsUrl.split('/export?')[0]; // For ArcGIS background mapping.
	else if (fsUrl.indexOf('/export') != -1) 	fsUrl = fsUrl.split('/export')[0]; 	// For ArcGIS background mapping.
	else if (fsUrl.indexOf('?') != -1) 			fsUrl = fsUrl.split('?')[0];
	return fsUrl;
};

/**
 * Returns the url params.
 * 
 * @static
 * @method getParams
 * @param {String} queryUrl The url.
 * @param {String} name The name of the param.
 * @return {Object} The url params.
 */
ia.FeatureServiceReader.getParam = function(url, name)
{
 	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

ia.FeatureServiceReader.layerQueryCache = {}
/**
 * Make a request to a feature service - handles maxRecordCount by making multiple requests
 * and concatenating the returned features.
 * 
 * @static
 * @method sendQuery
 * @param {String} queryUrl A feature service layer query.
 * @param {String} acessToken The access token.
 * @param {Function} callbackFunction The call back function. 
 * @return {JSON[]} The returned features as first parameter in a callback function.
 */
ia.FeatureServiceReader.sendQuery = function(queryUrl, acessToken, callbackFunction)
{
	var outFields = ia.FeatureServiceReader.getParam(queryUrl, 'outFields');
	if (outFields != '') outFields = outFields.split(/[\s,]+/);
	else outFields = undefined;

	var objectIds = ia.FeatureServiceReader.getParam(queryUrl, 'objectIds');
	if (objectIds != '') objectIds = objectIds.split(/[\s,]+/);
	else objectIds = undefined;

	var whereString = ia.FeatureServiceReader.getParam(queryUrl, 'where');
	if (objectIds == '') whereString = undefined;

	if (queryUrl.indexOf('f=json') == -1) queryUrl = queryUrl + (queryUrl.indexOf('?') > 0 ? "&f=json" : "?f=json");

    // Check if its been cached already.
	var features = ia.FeatureServiceReader.layerQueryCache[queryUrl];
	if (features != undefined)
	{
	    callbackFunction.call(null, features.concat()); // return.
	}
	else
	{

	    // Get the objectIds and maxRecordCount for the feature service 
	    // to check how many requests we need to make to the service.
	    ia.FeatureServiceReader.getInfo(queryUrl, acessToken, function (fsInfo, token)
	    {
	        var maxRecordCount = Infinity;
	        if (!ia.isUndefined(fsInfo.maxRecordCount)) maxRecordCount = ia.parseInt(fsInfo.maxRecordCount);

	        // Override if feature subset has been selected.
	        if (!ia.isUndefined(objectIds))
	        {
	            ia.FeatureServiceReader.sendFeatureRequests(queryUrl, token, objectIds, outFields, maxRecordCount, function (features)
	            {
	                ia.FeatureServiceReader.layerQueryCache[queryUrl] = features.concat();
	                callbackFunction.call(null, features); // return the features.
	            });
	        }
	        else
	        {
	            ia.FeatureServiceReader.getObjectIds(queryUrl, token, whereString, function (objectIds)
	            {
	                if (!ia.isUndefined(objectIds))
	                {
	                    ia.FeatureServiceReader.sendFeatureRequests(queryUrl, token, objectIds, outFields, maxRecordCount, function (features)
	                    {
	                        ia.FeatureServiceReader.layerQueryCache[queryUrl] = features.concat();
	                        callbackFunction.call(null, features); // return the features.
	                    });
	                }
	                else callbackFunction.call(null, []); // return empty array.
	            });
	        }
	    });
	}
};

ia.FeatureServiceReader.sendFeatureRequests = function(fsUrl, token, objectIds, outFields, maxRecordCount, callback)
{
	fsUrl = ia.FeatureServiceReader.getFeatureServiceUrl(fsUrl);
	
	if (objectIds.length > 0)
	{
		// Check if the maxRecordCount is greater than the actual number of features
		// If it is we only need to make one request to the FeatureServer.
		maxRecordCount = Math.min(objectIds.length, maxRecordCount);

		// Populate idArray with comma separated lists of ids.
		var idArray = new Array();
		while (objectIds.length > 0) idArray[idArray.length] = objectIds.splice(0, maxRecordCount);

		// An array to hold all the returned features as
		// we may have to make multiple requests to the FeatureServer 
		// if the number of features is greater than the maxRecordCount.
		var allFeatures = new Array();
		var noRequests = idArray.length;
		var requestCount = 0;

		// Makes multiple requests to the FeatureService until we have all the features.
		function onFeaturesReturned(features)
		{
			// Add the returned features to our master feature array.
			allFeatures = allFeatures.concat(features);
			requestCount++;

			if (requestCount == noRequests) 
				callback.call(null, allFeatures); // return.
			else 
				ia.FeatureServiceReader.getFeatureAttributes(fsUrl, token, idArray[requestCount], outFields, onFeaturesReturned); 
		};
		ia.FeatureServiceReader.getFeatureAttributes(fsUrl, token, idArray[requestCount], outFields, onFeaturesReturned);
	}
	else callback.call(null, []); // return.
};

ia.FeatureServiceReader.layerInfoCache = {}
ia.FeatureServiceReader.getInfo = function(fsUrl, token, callback) 
{
    var requestUrl = ia.FeatureServiceReader.getFeatureServiceUrl(fsUrl);

    // Check if its been cached already.
    var info = ia.FeatureServiceReader.layerInfoCache[requestUrl];
    if (info != undefined)
    {
        callback.call(null, info, token); // return.
    }
    else
    {
        var params;
        if (!ia.isUndefined(token) && token.indexOf('?') == 0)
        {
            params = 'token=' + token;; // Azure.
        }
        else
        {
            params = 'f=json';
            if (!ia.isUndefined(token)) params += '&token=' + token;
        }

        ia.File.load(
        {
            url: requestUrl,
            dataType: 'json',
            type: 'GET',
            data: params,
            onSuccess: function (fsLayer)
            {
                if (fsLayer.error && fsLayer.error.code == 498)
                {
                    // Try again without the token.
                    return ia.FeatureServiceReader.getInfo(requestUrl, undefined, callback)
                }
                else if (fsLayer.error && fsLayer.error.code == 499)
                {
                    // Redirect to get token.
                    ia.redirectToArcGisOnlineAuth();
                }
                else
                {
                    ia.FeatureServiceReader.layerInfoCache[requestUrl] = fsLayer;
                    callback.call(null, fsLayer, token); // return.
                }
            }
        });
    }
};

ia.FeatureServiceReader.layerObjectIdsCache = {}
ia.FeatureServiceReader.getObjectIds = function(fsUrl, token, whereString, callback) 
{
    fsUrl = ia.FeatureServiceReader.getFeatureServiceUrl(fsUrl);

    // Check if its been cached already.
    var objectIds = ia.FeatureServiceReader.layerObjectIdsCache[fsUrl + whereString];

    if (objectIds != undefined)
    {
        callback.call(null, objectIds.concat()); // return.
    }
    else
    {
        var requestUrl = fsUrl + '/query';
        var params = 'f=json&returnGeometry=false&returnIdsOnly=true&returnCountOnly=false';

        if (!ia.isUndefined(whereString)) params += '&where=' + whereString;
        else params += '&where=1+%3D+1';
        if (!ia.isUndefined(token)) params += '&token=' + token;

        ia.File.load(
	    {
	        url: requestUrl,
	        type: 'POST',
	        dataType: 'json',
	        data: params,
	        onSuccess: function (fsLayer)
	        {
	            ia.FeatureServiceReader.layerObjectIdsCache[fsUrl + whereString] = fsLayer.objectIds.concat();
	            callback.call(null, fsLayer.objectIds); // return.
	        }
	    });
    }
};

ia.FeatureServiceReader.getFeatureAttributes = function(fsUrl, token, objectIds, outFields, callback) 
{
	fsUrl = ia.FeatureServiceReader.getFeatureServiceUrl(fsUrl);
	
	var requestUrl = fsUrl + '/query';

	var params = 'where=1+%3D+1&f=json&returnGeometry=false&returnIdsOnly=false&returnCountOnly=false';

	if (!ia.isUndefined(objectIds)) params += '&objectIds=' + objectIds;

	if (!ia.isUndefined(outFields)) params += '&outFields=' + outFields;
	else params += '&outFields=*';

	if (!ia.isUndefined(token)) params += '&token=' + token;

	ia.File.load(
	{
		url: requestUrl,
		type: 'POST',
		dataType: 'json',
		data: params, 
		onSuccess:function(fsLayer)
		{		
			callback.call(null, fsLayer.features); // return.
		}
	});
};

ia.FeatureServiceReader.getFeatureGeometry = function(fsUrl, token, objectIds, outFields, outSR, maxAllowableOffset, callback) 
{
	fsUrl = ia.FeatureServiceReader.getFeatureServiceUrl(fsUrl);
	
	var requestUrl = fsUrl + '/query';

	var params = 'where=1+%3D+1&f=json&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false';

	if (!ia.isUndefined(objectIds)) params += '&objectIds=' + objectIds;
	if (!ia.isUndefined(outFields)) params += '&outFields=' + outFields;
	if (!ia.isUndefined(outSR)) params += '&outSR=' + outSR;
	if (!ia.isUndefined(maxAllowableOffset)) params += '&maxAllowableOffset=' + maxAllowableOffset;
	if (!ia.isUndefined(token)) params += '&token=' + token;

	ia.File.load(
	{
		url: requestUrl,
		type: 'POST',
		dataType: 'json',
		data: params, 
		onSuccess:function(fsLayer)
		{		
			callback.call(null, fsLayer.features); // return.
		}
	});
};