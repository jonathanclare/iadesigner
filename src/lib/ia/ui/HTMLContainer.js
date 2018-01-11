/** 
 * A class for creating a container that can parse in html or load a html file.
 *
 * @author J Clare
 * @class ia.HTMLContainer
 * @constructor
 * @param {String} id The id of the HTMLContainer.
 */
ia.HTMLContainer = function(id)
{		
	this.container  = $j("<div id='"+id+"'>");
};
	
/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.HTMLContainer.prototype.container;

/**
 * Sets the text or html file.
 * 
 * @method setHtml
 * @param {String} text The text.
 */
ia.HTMLContainer.prototype.setHtml = function(text)
{
	if (text != undefined)
	{
		// Check for html file		
		if ((ia.endsWith(text, ".htm") || ia.endsWith(text, ".html")) && text.indexOf("href=") == -1)
		{
			this.container.load(text, function(response, status, xhr) {});
		}
		else // Otherwise its text.
		{
			this.container.html(text);
		}
	}
};