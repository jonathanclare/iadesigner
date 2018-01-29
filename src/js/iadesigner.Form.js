var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad = iad || {};

    iad.Form = function (options)
    {
        this.options = $.extend({}, options);

    	this._doScrollAfterPanelExpanded = false;
    	this._scrollPos = 0;
    	this._panelIndex = undefined;
    	this._controlWasAdded = false;

        if (this.options && this.options.container) 
        {
            this.$container = $(this.options.container);
            
            // Add handlers.
            var oForm = this;

	        // Fix for accordion collapse bug https://github.com/openam/bootstrap-responsive-tabs/issues/45
	        this.$container.on('show.bs.collapse', '.iad-collapse', function (e) 
	        {
	            $(e.target).closest('.panel').siblings().find('.panel-collapse').collapse('hide');
	        });
	        this.$container.on('shown.bs.collapse', '.iad-collapse', function (e)
	        {
	            // Do scroll after collapse has expanded to scroll to correct position.
	            if (oForm._doScrollAfterPanelExpanded)
	            {
	                oForm._doScrollAfterPanelExpanded = false;
	                onRenderComplete(oForm);
	            }
	            // Store the index of the expanded panel.
	            oForm._panelIndex = oForm.$container.find('.iad-collapse').index(this);
	        });
	        this.$container.on('hidden.bs.collapse', '.iad-collapse', function (e)
	        {
	            // Remove the index of the expanded panel.
	            oForm._panelIndex = undefined;
	        });
	        this.$container.parent().on('scroll', function (e)
	        {
	            if (oForm._doScrollAfterPanelExpanded === false) oForm._scrollPos = $(this).scrollTop();
	        });
        }
    };

    // Renders the form with the passed in json.
    iad.Form.prototype.render = function (jsonForm)
    {
        if (jsonForm.forms.length === 1) jsonForm.forms[0].name = undefined;

        // Apply handlebars template for forms.
        this.$container.parent().css('visibility','hidden');
        this.$container.empty();
        var template = window.iadesigner[this.options.template];
        var html = template(jsonForm);
        this.$container.append(html);

        // Enable control tooltips.
        this.$container.find('.iad-tooltip-control').tooltip(
        {
            placement: 'bottom',
            trigger: 'hover'
        });

        // Popovers.
        this.$container.find('.iad-popover').popover();

        // Make columns sortable.
        this.$container.find('.draggableList').sortable(
        {
            handle: '.iad-sort-handle', 
            axis:'y',
            update: function()
            {
                // New order.
                var widgetId;
                var columns = [];
                $('.iad-sortable', $(this)).each(function(i, elem) 
                {
                    var $control = $(elem);
                    widgetId = $control.data('control-id');
                    var index = $control.data('control-index');
                    $control.data('control-index', i); // Update the column index.
                    
                    if (widgetId.indexOf('menuBar') !== -1)
                    {
                        var $menuItem = iad.config.getWidgetXml(widgetId).find('#menuItem' + index);
                        var $menuFunc = iad.config.getWidgetXml(widgetId).find('#menuFunc' + index);
                        columns[columns.length] = {menuItem:$menuItem, menuFunc:$menuFunc};
                    }
                    else
                    {
                        var $column = iad.config.getWidgetXml(widgetId).find('Column').eq(index);
                        columns[columns.length] = $column;
                    }
                });

                if (widgetId.indexOf('menuBar') !== -1)
                    iad.config.orderMenuItems(widgetId, columns);
                else
                    iad.config.orderColumns(widgetId, columns);
            }
        });

        // Apply auto size to text areas.
        var $textarea = this.$container.find('.iad-control-textarea');
        $textarea.autosize({append: '\n'});
        $textarea.trigger('autosize.resize');
        $textarea.resize(function(e) {$textarea.trigger('autosize.resize');});

        if (this._panelIndex !== undefined) // Open previous panel then scroll to correct position.
        {
            this._doScrollAfterPanelExpanded = true;
            this.$container.find('.iad-collapse:eq('+this._panelIndex+')').collapse('show');
        }
        else if (this.$container.find('.iad-collapse').length > 1) // Open first panel then scroll to correct position.
        {
            this._doScrollAfterPanelExpanded = true;
            this._panelIndex = 0;
            this.$container.find('.iad-collapse:eq(0)').collapse('show');
        }        
        else onRenderComplete(this); // Scroll to correct position.
    };

    function onRenderComplete(oForm)
    {
        if (oForm._controlWasAdded) 
        	oForm.scrollToBottom();
        else 
        	oForm.scrollTo(oForm._scrollPos);

        oForm.$container.parent().css('visibility','visible');
    }

    // Scrolls to position in form.
    iad.Form.prototype.scrollTo = function (scrollPos)
    {
        this.$container.parent().scrollTop(scrollPos);        
    };

    // Scrolls to bottom of form.
    iad.Form.prototype.scrollToBottom = function ()
    {
        this.scrollTo(this.$container.parent()[0].scrollHeight); 
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
