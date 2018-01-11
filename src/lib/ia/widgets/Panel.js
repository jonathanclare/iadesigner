/** 
 * Creates a panel widget.
 *
 * @author J Clare
 * @class ia.Panel
 * @extends ia.Widget
 * @constructor
 * @param {String} id The id for the widget.
 * @param {String} title The widget title.
 */
ia.Panel = function(id, title)
{		
	ia.Panel.baseConstructor.call(this, id);

	this._title = title;
	this._settingsBtn = undefined;
	this._hasSettings = false;
	this._closeBtn = undefined;
	this._closeable = false;
	this._exportBtn = undefined;
	this._exportable = false;
	this._resizeBtn = undefined;
	this._resizeable = false;
	this._isMaximized = false;
	this._borderRadius = 0;

	this._build();
};
ia.extend(ia.Widget, ia.Panel);

/** 
 * The panel header.
 *
 * @property header
 * @type JQUERY Element
 */	
ia.Panel.prototype.header;

/** 
 * The panel footer.
 *
 * @property footer
 * @type JQUERY Element
 */	
ia.Panel.prototype.footer;

/** 
 * The panel content container.
 *
 * @property content
 * @type JQUERY Element
 */	
ia.Panel.prototype.content;

/** 
 * Allows text to be placed in the panel content.
 *
 * @property contentText
 * @type JQUERY Element
 */	
ia.Panel.prototype.contentText;

/** 
 * Builds the panel.
 * 
 * @method _build
 * @private
 */
ia.Panel.prototype._build = function()
{
	var me = this;

	// Calculated border-radius for elements inside panels.
	this._borderRadius = parseInt($j(".ia-panel").css("border-top-left-radius")) - 1;
	if (this._borderRadius < 0) this._borderRadius = 0;

	// A div to contain the panel.
	this.container = $j("<div>").addClass('ia-widget ia-panel').attr('id', 'ia-widget-' + this.id);
	this.container.css("visibility","hidden");
	this.container.resize(function(e){me._size();});

	// A div to contain the content.
	this.content = $j("<div>").addClass('ia-panel-content').attr('id', 'ia-widget-' + this.id +"-content");
	this.contentText = $j("<div>").addClass('ia-panel-content-text ia-nodata-text').attr('id', 'ia-widget-' + this.id +"-content-text");

	// A div to contain the header.
	this.header = $j("<div>").addClass('ia-panel-header').attr('id', 'ia-widget-' + this.id +"-header");
	this.header.css("border-top-left-radius", this._borderRadius+"px");
	this.header.css("border-top-right-radius", this._borderRadius+"px");
	this.header.css({"display" : 'none'});
	this.container.append(this.header);

	this.container.append(this.content);
	this.container.append(this.contentText);

	// A div to contain the footer.
	this.footer = $j("<div>").addClass('ia-panel-footer').attr('id', 'ia-widget-' + this.id +"-footer");
	this.container.append(this.footer);

	// Btn bar.
	var btns = $j("<div>").addClass('ia-panel-btns').attr('id', 'ia-widget-' + this.id +"-btns");	
	this.container.append(btns);

	var overBtns = false;
	this.container.mouseenter(function(e) 
	{
		btns.stop().css({visibility: "visible"}).animate({opacity: 0.5});
	});
	this.container.mouseleave(function(e) 
	{
		btns.stop().animate({opacity: 0}, function() 
		{
			btns.css({visibility: "hidden"});
		});
	});
	btns.mouseenter(function(e) 
	{
		btns.stop().animate({opacity: 1.0});
	});
	btns.mouseleave(function(e) 
	{
		btns.stop().animate({opacity: 0.5});
	});

	var btnsTimeout;
	this.container.bind("touchstart", function(e) 
	{
		//clearTimeout(btnsTimeout);
		btns.stop();
		btns.css({visibility: "visible"}).animate({opacity: 1.0});
		
		clearTimeout(btnsTimeout);
		btnsTimeout = setTimeout(function()
		{
			clearTimeout(btnsTimeout);
			btns.stop().animate({opacity: 0}, function() 
			{
				btns.css({visibility: "hidden"});
			});
		}, 5000);
	});

	// Resize button.
	this._resizeBtn = $j("<div>").addClass('ia-panel-btn ia-panel-resize-btn-maximize').attr('id', 'ia-widget-' + this.id +"-resize").css("display","none")
	btns.append(this._resizeBtn);
	this._resizeBtn.bind("click", function(e)  
	{
		e.stopPropagation();
		e.preventDefault();
		if (me.resizeFunction) me.resizeFunction.call(null, me);
	});

	// Export button.			
	this._exportBtn = $j("<div>").addClass('ia-panel-btn ia-panel-export-btn').attr('id', 'ia-widget-' + this.id +"-export").css("display","none");
	this._exportBtn.bind("click", function(e) 
	{
		e.stopPropagation();
		e.preventDefault();
		if (me.exportFunction) me.exportFunction.call(null, e);
	});
	btns.append(this._exportBtn);

	// Close button.				
	this._closeBtn = $j("<div>").addClass('ia-panel-btn ia-panel-close-btn').attr('id', 'ia-widget-' + this.id +"-close").css("display","none")
	this._closeBtn.bind("click", function(e) 
	{
		e.stopPropagation();
		e.preventDefault();
		if (me.closeFunction) me.closeFunction.call(null, me);
	});
	btns.append(this._closeBtn);

	// Settings button.
	this._settingsBtn = $j("<div>").addClass('ia-panel-btn ia-panel-settings-btn').attr('id', 'ia-widget-' + this.id +"-settings").css("display","none")
	this._settingsBtn.bind("click", function(e) 
	{
		e.stopPropagation();
		e.preventDefault();
		if (me.settingsFunction) me.settingsFunction.call(null, e);
	});
	btns.append(this._settingsBtn);
	
	this.title(this._title);
	this._size();
};

/** 
 * Sets or gets if it has settings.
 * 
 * @method hasSettings
 * @param {Boolean} hasSettings true/false.
 */
ia.Panel.prototype.hasSettings = function(hasSettings)
{
	if (hasSettings == true)
	{
		this._hasSettings = true;
		this._settingsBtn.css("display","")
	}
	else if (hasSettings == false)
	{
		this._hasSettings = false;
		this._settingsBtn.css("display","none")
	}
	else return this._hasSettings
};

/** 
 * The settings function.  
 *
 * @method settingsFunction
 */	
ia.Panel.prototype.settingsFunction;

/** 
 * Sets or gets if its closeable.
 * 
 * @method closeable
 * @param {Boolean} isCloseable true/false.
 */
ia.Panel.prototype.closeable = function(isCloseable)
{
	if (isCloseable == true)
	{
		this._closeable = true;
		this._closeBtn.css("display","")
	}
	else if (isCloseable == false)
	{
		this._closeable = false;
		this._closeBtn.css("display","none")
	}
	else return this._closeable
};

/** 
 * The close function.  
 *
 * @method closeFunction
 * @param {ia.Panel} p The panel object.
 */	
ia.Panel.prototype.closeFunction = function(p)
{
	p.hide();
};

/** 
 * Sets or gets if its exportable.
 * 
 * @method exportable
 * @param {Boolean} isExportable true/false.
 */
ia.Panel.prototype.exportable = function(isExportable)
{
	if (isExportable == true)
	{
		this._exportable = true;
		this._exportBtn.css("display","")
	}
	else if (isExportable == false)
	{
		this._exportable = false;
		this._exportBtn.css("display","none")
	}
	else return this._exportable
};

/** 
 * The export function.  
 *
 * @method exportFunction
 */	
ia.Panel.prototype.exportFunction;

/** 
 * Sets or gets if its resizeable.
 * 
 * @method resizeable
 * @param {Boolean} isResizeable true/false.
 */
ia.Panel.prototype.resizeable = function(isResizeable)
{
	if (isResizeable == true)
	{
		this._resizeable = true;
		this._resizeBtn.css("display","")
	}
	else if (isResizeable == false)
	{
		this._resizeable = false;
		this._resizeBtn.css("display","none")
	}
	else return this._resizeable
};

/** 
 * The resize function.  
 *
 * @method resizeFunction
 * @param {ia.Panel} p The panel object.
 */	
ia.Panel.prototype.resizeFunction = function(p)
{
	p.resize();
};

/** 
 * Resizes the panel.  
 *
 * @method resize
 */	
ia.Panel.prototype.resize = function()
{
	if (this._isMaximized) 
	{
		this._resizeBtn.addClass('ia-panel-resize-btn-maximize').removeClass('ia-panel-resize-btn-minimize');
		this.restore();
	}
	else 
	{
		this._resizeBtn.addClass('ia-panel-resize-btn-minimize').removeClass('ia-panel-resize-btn-maximize');
		this.maximize();
	}
	this._isMaximized = !this._isMaximized;
};

/** 
 * Appends an element to the panel content area.
 * 
 * @method append
 * @param {JQUERY Element} obj The jquery object.
 */
ia.Panel.prototype.append = function(obj)
{
	this.content.append(obj);
};

/** 
 * Appends an element to the panel footer area.
 * 
 * @method appendToFooter
 * @param {JQUERY Element} obj The jquery object.
 */
ia.Panel.prototype.appendToFooter = function(obj)
{
	this.footer.append(obj);
};

/** 
 * Sets the title text.
 * 
 * @method title
 * @param {String} text The text.
 */
ia.Panel.prototype.title = function(text)
{
	if (text != undefined && text != "undefined" &&  text != "")
	{
		this.header.css("display", "");
		this.header.html(text);
		//this.header.attr('title', text);
	}
	else
	{
		this.header.css("display", "none");
		this.header.html("");
		//this.header.attr('title', "");
	}
	this._size();
};

/** 
 * Sets the content text.
 * 
 * @method text
 * @param {String} text The text.
 */
ia.Panel.prototype.text = function(text)
{
	this.contentText.html(text);
	if (text == "") this.contentText.css("display", "none");
	else this.contentText.css("display", "inline");
};

/** 
 * Resizes the panel elements when the panel size or header
 * text have changed. This is the only way at the moment to
 * make sure the content doesnt overflow its container.
 *
 * @method _size
 * @private
 */
ia.Panel.prototype._size = function()
{
	var panelHeight = this.container.height();
	var titleHeight = 0;
	if (this.header.css("display") != "none") titleHeight = this.header.outerHeight();
	footerHeight = this.footer.outerHeight();
	var contentHeight = panelHeight - titleHeight - footerHeight;
	this.content.height(contentHeight);
};

/** 
 * Updates the component configuration.
 * 
 * @method update
 * @param {ia.ComponentConfig} c The component config.
 */
ia.Panel.prototype.update = function(c)
{
	if (c != undefined)
	{
		var isPopUp = c.getProperty("isPopUp") || false;
		var isResizeable = true;
		/*if (c.id.indexOf("menuBar") != -1
			|| c.id.indexOf("timeControl") != -1
			|| c.id.indexOf("featureLegend") != -1
			|| c.id.indexOf("legend") != -1
			|| c.id.indexOf("stackedLegend") != -1
			|| c.id.indexOf("areaBreakdownPieLegend") != -1
			|| c.id.indexOf("profileLegend") != -1) isResizeable = false*/
		if (c.id.indexOf("menuBar") != -1
			|| c.id.indexOf("timeControl") != -1) isResizeable = false
		var isExportable = c.getProperty("isExportable") || false;
		var isVisible = c.getProperty("visible") || false;

		this.popup(isPopUp);
		this.closeable(isPopUp);
		this.resizeable(isResizeable);
		this.exportable(isExportable);
		this.visible(isVisible);
		this.zIndex(c.zIndex);
		
		this.updateWidget(c);
	}
};