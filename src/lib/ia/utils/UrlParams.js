/** 
 * Parses a url to get the parameters.
 *
 * @author J Clare
 * @class ia.UrlParams
 * @constructor
 * @param {String} href The href.
 */
ia.UrlParams = function(href) 
{
	this.href = href;
	this.path = ia.File.getFileDirectory(decodeURIComponent(href));
	this.filename = ia.File.getFileName(decodeURIComponent(href));

	if (location.href.indexOf("#") != -1)
	{
		this.href = this.href.split("#")[0];
		href = href.split("#")[0];
	}

	this.params = {};
	if (href.indexOf('?') != -1)
	{
		var hashes = href.slice(href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			var hash = hashes[i].split('=');
			var key = decodeURIComponent(hash[0]);
			var value = decodeURIComponent(hash[1]);

			// Format boolean values.
			if (value == "false") value = false;
			if (value == "true") value = true;

			// Format numbers. Dont do it for select because it might be a feature id starting with 0 and youll lose the 0.
			if (ia.isNumber(value) && (key != 'select') &&  (key != 'select2')) value = parseFloat(value);

			this.params[key] = value;
		}
	}
};

/** 
 * Gets the URL for the current report settings.
 *
 * @method getReportUrl
 * @return {String} The url.
 */
ia.UrlParams.prototype.getReportUrl = function()
{
	var url = this.path + this.filename + "?";
	var firstParamAdded = false;
	for (var key in this.params)
	{
		var value = this.params[key];
		if (value != "" && value != undefined)
		{
			if (firstParamAdded == true) url = url + "&";
			url = url + key + "=" + encodeURIComponent(this.params[key]);
			firstParamAdded = true;
		}
	}
	return url;
};

/** 
 * The full url.
 *
 * @property href
 * @type String
 */
ia.UrlParams.prototype.href;

/** 
 * The url path without the parameters.
 *
 * @property path
 * @type String
 */
ia.UrlParams.prototype.path;

/** 
 * The url file name.
 *
 * @property filename
 * @type String
 */
ia.UrlParams.prototype.filename;

/** 
 * The parameter as a hash in the form params[key] = value
 *
 * @property params
 * @type Associative Array
 */
ia.UrlParams.prototype.params;