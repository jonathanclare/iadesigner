/** 
 * A class for metadata.
 *
 * @author J Clare
 * @class ia.Metadata
 * @constructor
 * @param {String} id The id of the metadata.
 */
ia.Metadata = function(id)
{		
	this.container  = $j("<div id='"+id+"' class='ia-metadata-scrollbox'>");

	// A scroll box used to hold the content.
	this._scrollBox = new ia.ScrollBox(this.container);

	// Div to contain the html.
	this._textBox  = $j("<div class='ia-metadata'>");
	this.container.append(this._textBox)
};
	
/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.Metadata.prototype.container;

/**
 * Sets the text or html file.
 * 
 * @method setHtml
 * @param {String} text The text.
 */
ia.Metadata.prototype.setHtml = function(text)
{
	if (text != undefined)
	{
		text = '' + text; // http://bugzilla.geowise.co.uk/show_bug.cgi?id=10169

		// Check for html file
		if ((ia.endsWith(text, ".htm") || ia.endsWith(text, ".html")) && text.indexOf("href=") == -1)
		{
			var me = this;
			this._textBox.load(text, function(response, status, xhr) 
			{
				me._scrollBox.refresh();
			});
		}
		else // Otherwise its text.
		{
			this._textBox.html(text);
			this._scrollBox.refresh();
		}
	}
};