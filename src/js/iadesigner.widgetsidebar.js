var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.widgetsidebar = iad.widgetsidebar || {};

    // Passed in options.
    var options;

    var activeWidgetId;
    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $editWidgetBtn = $('#iad-btn-widget-edit');

    // Initialise.
    iad.widgetsidebar.init = function(o)
    {
        options = o; 
    };

    iad.widgetsidebar.refresh = function()
    {
        if (activeWidgetId === undefined || activeWidgetId === 'PropertyGroup')
            showPropertyGroupForm();
        else 
            showWidgetForm(activeWidgetId);
    };

    iad.widgetsidebar.edit = function(widgetId)
    {
        if (iad.sidebar.isVisible('iad-sidebar-widget'))
        {
            var title = iad.config.getDisplayName(widgetId);
            $sidebarWidgetTitle.text(title);

            if (widgetId === 'PropertyGroup') showPropertyGroupForm();
            else
            {
                if (iad.sidebar.isVisible('iad-sidebar-widget')) showWidgetForm(widgetId);
                else $editWidgetBtn.show();
            }
        }
        else $editWidgetBtn.show();
    };

    iad.widgetsidebar.show = function(widgetId)
    {
        $editWidgetBtn.hide();

        var title = iad.config.getDisplayName(widgetId);
        $sidebarWidgetTitle.text(title);

        if (widgetId === 'PropertyGroup')
        {
            iad.canvas.clearSelection();
            showPropertyGroupForm();
        }
        else
        {
            iad.canvas.select(widgetId);
            showWidgetForm(widgetId);
        }
        iad.sidebar.show('iad-sidebar-widget');
    };

    // Displays the form for the given property group.
    function showPropertyGroupForm()
    {
        activeWidgetId = 'PropertyGroup';
        var jsonForm = iad.configform.getPropertyGroupsForm();
        renderForm(jsonForm);
    }

    // Displays the form for the given widget.
    function showWidgetForm(widgetId)
    {
        activeWidgetId = widgetId;
        var jsonForm = iad.configform.getWidgetForm(widgetId);
        renderForm(jsonForm);
    }

    // Renders the form with the passed in json.
    function renderForm(jsonForm)
    {
        if (options && options.container) 
        {
            if (jsonForm.forms.length === 1) jsonForm.forms[0].name = undefined;

            iad.form.render(
            {
                container:options.container,
                template:options.template,
                json:jsonForm
            });
        }
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);