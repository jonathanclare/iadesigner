/** 
 * A class for a text box.
 *
 * @author J Clare
 * @class ia.TextBox
 * @constructor
 * @param {String} id The id of the text box.
 */
ia.TextBox = function(id)
{		
	this.container  = $j("<div id='"+id+"' class='ia-textbox-scrollbox'>");

	// A scroll box used to hold the content.
	this._scrollBox = new ia.ScrollBox(this.container);

	// Div to contain the html.
	this._textBox  = $j("<div class='ia-textbox'>");
	this.container.append(this._textBox)
};
	
/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.TextBox.prototype.container;

/**
 * Sets the text or html file.
 * 
 * @method setHtml
 * @param {String} text The text.
 */
ia.TextBox.prototype.setHtml = function(text)
{
	if (text != undefined)
	{
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