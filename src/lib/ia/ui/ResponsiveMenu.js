/** 
 * A class for a reponsive menu.
 *
 * @author J Clare
 * @class ia.ResponsiveMenu
 * @constructor
 */
ia.ResponsiveMenu = function()
{		
	var me = this;

	this._menuIsDisplayed = false;
	this.container 		= $j('<div class="ia-panel ia-flow-menu">').on("click", function(e) {e.stopPropagation();me.toggleMenu();});
	var $menuBtn 		= $j('<div class="ia-list-item ia-flow-menu-icon"></div>').appendTo(this.container);
	this._$menuItems 	= $j('<div class="ia-flow-menu-items">').appendTo(this.container);
};

/**
 * The container that holds the menu.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.ResponsiveMenu.prototype.container;

/** 
 * Renders the menu.
 *
 * @method render
 */
ia.ResponsiveMenu.prototype.render = function(report) 
{
	this._$menuItems.empty();

    // Add buttons to flow menu.
	var widgets = report.getButtons();
	for (var i = 0; i < widgets.length; i++) 
	{
		var widget = widgets[i];
		if (widget.visible()) 
		{
			var c = report.config.getWidget(widget.id);
			if (c != undefined) this.addMenuItem(report, c.text, c.href, c.target);
		}
	}

    // Add menu bar to flow menu.
    var menuBar = report.getWidget('menuBar');
    if (menuBar && menuBar.visible())
    {
		var c = report.config.getWidget(menuBar.id);
		var properties = c.getProperties();
		for (var id in properties) 
		{
			if (id.indexOf('menuItem') != -1)
			{
				var index 	= id.substring(8, id.length);
				var text 	= c.getProperty('menuItem'+index);
				var fnc 	= c.getProperty('menuFunc'+index);

				if (fnc != 'javascript:iaToggleShare()') // Dont include share.
				{
					if (text && fnc) this.addMenuItem(report, text, fnc, '_blank');
				}
			}
		}
    }
};

/** 
 * Toggles the menu.
 *
 * @method toggleMenu
 * @private
 */
ia.ResponsiveMenu.prototype.toggleMenu = function() 
{
	if (this._menuIsDisplayed) this.hideMenu(); 
	else this.showMenu();
};

/** 
 * Shows the menu.
 *
 * @method showMenu
 * @private
 */
ia.ResponsiveMenu.prototype.showMenu = function() 
{
	this._menuIsDisplayed = true;
	this._$menuItems.slideDown();
};

/** 
 * Hides the menu.
 *
 * @method hideMenu
 * @private
 */
ia.ResponsiveMenu.prototype.hideMenu = function() 
{
	this._menuIsDisplayed = false;
	this._$menuItems.slideUp();
};

/** 
 * Adds a menu item.
 *
 * @method addMenuItem
 * @private
 */
ia.ResponsiveMenu.prototype.addMenuItem = function(report, label, fnc, target) 
{
	var me = this;
	var $menuItem = $j('<div class="ia-list-item ia-flow-menu-item">'+label+'<div>').appendTo(this._$menuItems);

	if (fnc)
	{
		if (typeof(fnc) == "function") 
		{
			$menuItem.on("click", function(e) 
			{
				e.stopPropagation();
				fnc.call(null, e);
				me.hideMenu();
			});
		}
		else
		{
			(function()
			{ 
				$menuItem.on("click", function(e) 
				{
					var st1 = $j(window).scrollTop();
					var st2 = report.container.scrollTop();
					var t = st1 + st2 + 20;
					$j('.ia-popup-panel').css('top',t + 'px');

					e.stopPropagation();
					ia.callFunction(fnc, target, e);
					me.hideMenu();
				});
			})();
		}
	}
};