/** 
 * Simply extends a button to add a down arrow.
 *
 * @author J Clare
 * @class ia.MenuButton
 * @extends ia.Button
 * @constructor
 * @param {String} id The id for the widget.
 * @param {String} text The text for the widget.
 */
ia.MenuButton = function(id, text)
{		
	ia.MenuButton.baseConstructor.call(this, id, text);
	this.container.addClass("menuButton"); 
};
ia.extend(ia.Button, ia.MenuButton);