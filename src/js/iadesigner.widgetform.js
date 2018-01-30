var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.widgetform = iad.widgetform || {};

    // Passed in options.
    var options;

    // Current widget id.
    var activeWidgetId;

    // Indicates a config property was added.
    var propertyWasAdded = false;

    var $container;
    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $editWidgetBtn = $('#iad-btn-widget-edit');

    // Initialise.
    iad.widgetform.init = function(o)
    {
        options = o; 
        if (options && options.container) 
        {
            $container = $(options.container);
        }
    };

    iad.widgetform.refresh = function(propertyAdded)
    {
        propertyWasAdded = propertyAdded;

        if (activeWidgetId === undefined || activeWidgetId === 'PropertyGroup')
            showPropertyGroupForm();
        else if (activeWidgetId === 'MapPalettes')
            showMapPalettesForm();
        else 
            showWidgetForm(activeWidgetId);
    };

    iad.widgetform.edit = function(widgetId)
    {
        if (iad.sidebar.isVisible('iad-sidebar-widget'))
        {
            var title = iad.config.getDisplayName(widgetId);
            $sidebarWidgetTitle.text(title);

            if (widgetId === 'PropertyGroup') showPropertyGroupForm();
            else if (widgetId === 'MapPalettes') showMapPalettesForm();
            else
            {
                if (iad.sidebar.isVisible('iad-sidebar-widget')) showWidgetForm(widgetId);
                else $editWidgetBtn.show();
            }
        }
        else $editWidgetBtn.show();
    };

    iad.widgetform.show = function(widgetId)
    {
        $editWidgetBtn.hide();

        var title = iad.config.getDisplayName(widgetId);
        $sidebarWidgetTitle.text(title);

        if (widgetId === 'PropertyGroup')
        {
            iad.canvas.clearSelection();
            showPropertyGroupForm();
        }
        else if (widgetId === 'MapPalettes')
        {
            iad.canvas.clearSelection();
            showMapPalettesForm();
        }
        else
        {
            iad.canvas.select(widgetId);
            showWidgetForm(widgetId);
        }
        iad.sidebar.show('iad-sidebar-widget');
    };

    // Displays the form for the map palettes.
    function showMapPalettesForm()
    {
        activeWidgetId = 'MapPalettes';
        var jsonForm = iad.configforms.getMapPalettesForm();
        renderForm(jsonForm);
    }

    // Displays the form for the given property group.
    function showPropertyGroupForm()
    {
        activeWidgetId = 'PropertyGroup';
        var jsonForm = iad.configforms.getPropertyGroupsForm();
        renderForm(jsonForm);
    }

    // Displays the form for the given widget.
    function showWidgetForm(widgetId)
    {
        activeWidgetId = widgetId;
        var jsonForm = iad.configforms.getWidgetForm(widgetId);
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
                json:jsonForm,
                controlAdded:propertyWasAdded
            });
        }
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);
