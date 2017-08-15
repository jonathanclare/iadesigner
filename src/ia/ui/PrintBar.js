/**
 * <code>ia.PrintBar</code>.
 *
 * @author J Clare
 * @class ia.PrintBar
 * @constructor
 * @param {ia.Report} report The associated report object.
 */
ia.PrintBar = function(report)
{
	// The this._report object.
	this._report = report;
	
	// Calculate width / height this._ratio.
	this._ratio = this._report.container.height() / this._report.container.width();
	
	// Create the container element.
	this.container = $j('<div class="ia-print-bar"></div>');
};
	
/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.PrintBar.prototype.container;

/** 
 * Adds the container.
 *
 * @method render
 */
ia.PrintBar.prototype.render = function() 
{
	this.container.empty();

    // Change Layout 
	var $cbxContainer = $j('<div class="ia-ui-item ia-ui-item-align-center ia-list-item ia-ui-item-table-cell ia-drag-btn"><input style="cursor:pointer" type="checkbox" checked>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>');
	this.container.append($cbxContainer);

	var $cbx = $cbxContainer.find('input:checkbox:first');
	$cbxContainer.bind("click", function (e)
	{
	    var $target = $j(e.target);
	    if ($target.is(':checkbox'))
	    {
	        if ($cbx.is(":checked")) builder.canvas.on();
	        else builder.canvas.off();
	    }
	    else
	    {
	        if ($cbx.is(":checked"))
	        {
	            $cbx.prop("checked", false);
	            builder.canvas.off();
	        }
	        else
	        {
	            $cbx.prop("checked", true);
	            builder.canvas.on();
	        }
	    }
	});
	
	// Minus button 
	var me = this;
	var minusBtn = $j('<div class="ia-ui-item ia-ui-item-align-center ia-list-item ia-ui-item-table-cell ia-minus-btn"></div>').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	this.container.append(minusBtn);
	minusBtn.bind("click", function(e)  
	{
		e.stopPropagation();
		e.preventDefault();

		var w = me._report.container.width() - 10;
		var h = w * me._ratio;
		me._report.container.css({width: w+"px",height: h+"px"});
	});
	
	// Plus button 
	var plusBtn = $j('<div class="ia-ui-item ia-ui-item-align-center ia-list-item ia-ui-item-table-cell ia-plus-btn"></div>').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	this.container.append(plusBtn);
	plusBtn.bind("click", function(e)  
	{
		e.stopPropagation();
		e.preventDefault();

		var w = me._report.container.width() + 10;
		var h = w * me._ratio;
		me._report.container.css({width: w+"px",height: h+"px"});
	});

    // Print button 
	var printBtn = $j('<div class="ia-ui-item ia-ui-item-align-center ia-list-item ia-ui-item-table-cell ia-print-btn"></div>').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	this.container.append(printBtn);
	printBtn.bind("click", function (e)
	{
	    e.stopPropagation();
	    e.preventDefault();
	    window.print();

        /*var win = window.open();
		ia.getDataUrl(me._report.container, function(dataURL)
        {
            if (dataURL != undefined)
            {
    			win.document.body.innerHTML = '<div></div><p><img src="'+dataURL+'"/></p>';
    			win.print();
            }
		});*/
	});
};

/** 
 * Adds the drag script.
 *
 * @method loadDragScript
 */
ia.PrintBar.prototype.loadDragScript = function() 
{
    // Drag & Delete. 
	var me = this;
    $j.getScript("./db-canvas-min.js")
    .done(function (script, textStatus)
    {
        builder.report = me._report;
        builder.canvas.init(
        {
            onRemoveBtnClick: function (widgetId)
            {
                var widget = builder.report.getWidget(widgetId);
                widget.container.hide();
            },
            onSendToBackBtnClick: function (widgetId)
            {
                var widgets = me._report.getWidgets();
                for (var i = 0; i < widgets.length; i++)
                {
                    var widget = widgets[i];
                    var zIndex = widget.zIndex();
                    if (widget.id === widgetId) widget.zIndex(0);
                    else widget.zIndex(zIndex+1);
                }
            },
            onBringToFrontBtnClick: function (widgetId)
            {
                var widgets = me._report.getWidgets();
                var maxZ = 0;
                for (var i = 0; i < widgets.length; i++)
                {
                    var widget = widgets[i];
                    var zIndex = widget.zIndex();
                    if (ia.isNumber(zIndex)) maxZ = Math.max(maxZ, zIndex);
                }
                me._report.getWidget(widgetId).zIndex(maxZ+1);
            }
        });
    })
    .fail(function (jqxhr, settings, exception)
    {
        console.log(exception);
    });
};