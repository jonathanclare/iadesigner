/** 
 * Class for loading data.
 *
 * @author J Clare
 * @class ia.File
 * @constructor
 */
ia.File = function() {};

/** 
 * If set, overrides default error reporting - requested by KM for server.
 *
 * @property errorHandler
 * @type String
 */
ia.File.errorHandler = undefined;

/** 
 * Loads a file.
 *
 * @static
 * @method load
 * @param {Object} options Object literal containing url, type, onSuccess(), onFail(). 
 */
ia.File.load = function(options) 
{
	var o = {};
	o.type 		= options.type || "GET";
	o.url 		= ia.getDomainSafeUrl(options.url);
	o.dataType 	= options.dataType || "text";

	var str = o.url;

	if (options.contentType) 	o.contentType 	= options.contentType;
	if (options.data)
	{
	    o.data = options.data;
	    str += '?' + o.data
	}
	if (options.onSuccess)  	o.success 		= options.onSuccess;

    // Check length of url plus query string - use GET when possible cos its faster.
    // This was added 10/03/2017 by JC to try to make dashboard bulider run faster
    // Overrides the type passed in by the options param.
	if (str.length <= 2000) o.type = "GET";
	else o.type = "POST";

	o.error = function(XMLHttpRequest, textStatus, errorThrown) 
	{
		/*ia.log(o);
		ia.log(XMLHttpRequest);
		ia.log(textStatus);
		ia.log(errorThrown);*/
		
		if (options.onFail) 		options.onFail(XMLHttpRequest, textStatus, errorThrown);
		if (ia.File.errorHandler) 	ia.File.errorHandler(o.url, XMLHttpRequest, textStatus, errorThrown, options);
	};

	$j.ajax(o);
};

/** 
 * Returns the file directory.
 *
 * @static
 * @method getFileDirectory
 * @param {String} url The file path. 
 * @param {String} The file directory. 
 */
ia.File.getFileDirectory = function(url) 
{
	var dir = url;
	if (url.indexOf('?') > 0)	dir = url.substring(0, url.lastIndexOf('?'));
	if (dir.indexOf("/") < 0)	return dir.substring(0, dir.lastIndexOf("\\") + 1);
	else						return dir.substring(0, dir.lastIndexOf("/") + 1);
}

/** 
 * Returns the file name.
 *
 * @static
 * @method getFileName
 * @param {String} url The file path. 
 * @param {String} The file name. 
 */
ia.File.getFileName = function(url) 
{
	var fn = url;
	if (url.indexOf('?') > 0)	fn = url.substring(0, url.lastIndexOf('?'));
	if (fn.indexOf("/") < 0)	return fn.substring(fn.lastIndexOf("\\") + 1);
	else						return fn.substring(fn.lastIndexOf("/") + 1);
}