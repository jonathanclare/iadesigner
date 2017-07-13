/** 
 * A class for MenuBar.
 *
 * @author J Clare
 * @class ia.MenuBar
 * @constructor
 * @param {String} id The id of the Menubar.
 */
ia.MenuBar = function(id)
{		
	this.container  = $j("<div id='"+id+"' class='ia-menubar'>");
};

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.MenuBar.prototype.container;

/**
 * The config settings.
 * 
 * @property config
 * @type ia.ComponentConfig
 */
ia.MenuBar.prototype.config;
	
/** 
 * Renders the menu bar with the given config settings.
 *
 * @param {ia.ComponentConfig} config The config settings.
 * @method render
 */
ia.MenuBar.prototype.render = function(config) 
{
	this.container.empty();

	var $table  = $j("<table class='ia-menubar-table'>");
	this.container.append($table);
	
	var $tr = $j("<tr>");
	$table.append($tr);
	
	var properties = config.getProperties();
	for (var id in properties) 
	{
		var testId = 'menuItem';
		if (id.indexOf(testId) != -1)
		{
			var index = id.substring(8, id.length);

			// Add text.
			var menuItemText = config.getProperty("menuItem"+index);
			if (menuItemText)
			{
				$td = $j("<td class='ia-list-item ia-menubar-btn'>").html(menuItemText);
				$tr.append($td);

				// Add onclick handler.
				var menuItemFunction = config.getProperty("menuFunc"+index);
				if (menuItemFunction != undefined)
				{
					(function() // Execute immediately
					{ 
						var fnc = menuItemFunction;
						if (fnc.indexOf("http") == -1 && fnc.indexOf("javascript") == -1)
							fnc = ia.IAS_PATH + fnc;

						$td.bind("click", function(e) 
						{
							e.stopPropagation();
							ia.callFunction(fnc, "_blank", e);
						});
					})();
				}
			}
		}
	}
};