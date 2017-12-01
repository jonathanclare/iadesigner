var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.widgetsidebar = iad.widgetsidebar || {};

    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $editWidgetBtn = $('#iad-btn-widget-edit');

    iad.widgetsidebar.edit = function(widgetId)
    {
        if (iad.sidebar.isVisible('iad-sidebar-widget'))
        {
            var title = iad.config.getDisplayName(widgetId);
            $sidebarWidgetTitle.text(title);

            if (widgetId === 'PropertyGroup')  iad.forms.showPropertyGroupForm();
            else
            {
                if (iad.sidebar.isVisible('iad-sidebar-widget')) iad.forms.showWidgetForm(widgetId);
                else $editWidgetBtn.show();
            }
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
            iad.forms.showPropertyGroupForm();
        }
        else
        {
            iad.canvas.select(widgetId);
            iad.forms.showWidgetForm(widgetId);
        }
        iad.sidebar.show('iad-sidebar-widget');
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
