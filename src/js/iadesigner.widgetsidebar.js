var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.widgetsidebar = iad.widgetsidebar || {};

    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $editWidgetBtn = $('#iad-btn-widget-edit');

    iad.widgetsidebar.edit = function(widgetId)
    {
        var title = iad.config.getDisplayName(widgetId);
        $sidebarWidgetTitle.text(title);

        if (widgetId === 'PropertyGroup')  iad.configform.showPropertyGroupForm();
        else
        {
            if (iad.sidebar.isVisible('iad-sidebar-widget')) iad.configform.showWidgetForm(widgetId);
            else $editWidgetBtn.show();
        }
    };

    iad.widgetsidebar.show = function(widgetId)
    {
        $editWidgetBtn.hide();

        var title = iad.config.getDisplayName(widgetId);
        $sidebarWidgetTitle.text(title);
        
        if (widgetId === 'PropertyGroup')
        {
            iad.canvas.clearSelection();
            iad.configform.showPropertyGroupForm();
        }
        else
        {
            iad.canvas.select(widgetId);
            iad.configform.showWidgetForm(widgetId);
        }
        iad.sidebar.show('iad-sidebar-widget');
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
