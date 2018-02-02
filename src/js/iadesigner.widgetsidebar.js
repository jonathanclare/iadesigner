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

    iad.widgetsidebar.update = function()
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

    iad.widgetsidebar.updateDropdown = function()
    {
        // Sort widgets by name.
        var $xmlWidgets = iad.config.getComponents();
        $xmlWidgets.sort(function(a, b)
        {
            if ($(a).attr('name') < $(b).attr('name')) return -1;
            if ($(a).attr('name') > $(b).attr('name')) return 1;
            return 0;
        });

        // Split components up by data source.
        var dataSources = new Array([], [], [], []);
        var moreThanOneDataSource = false;
        var arr;
        $.each($xmlWidgets, function(i, xmlWidget)
        {
            var $xmlWidget = $(xmlWidget);
            var id = $xmlWidget.attr('id');

            // If theres a number on the end of the id it means theres more than one data source.
            // eg. barChart2.
            var match = id.match(/\d+/);
            if (match)
            {
                moreThanOneDataSource = true;
                var index = parseInt(match[0], 10);
                arr = dataSources[index-1];
                arr[arr.length] = $xmlWidget;
            }
            else
            {
                arr = dataSources[0];
                arr[arr.length] = $xmlWidget;
            }
        });

        // General Properties.
        var options = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-id="PropertyGroup" class="iad-dropdown-option-widget-properties">General Properties</a></li>';
        options += '<li role="presentation" class="divider"></li>';

        // Add dropdown options to widget select dropdown.
        for (var i = 0; i < dataSources.length; i++)
        {
            var arrDataSources = dataSources[i];
            if (arrDataSources.length > 0)
            {
                if (moreThanOneDataSource)
                {
                    var index = i + 1;
                    if (index != 1) options += '<li role="presentation" class="divider"></li>';
                }
                for (var j = 0; j < arrDataSources.length; j++)
                {
                    var $xmlWidget = arrDataSources[j];
                    var vis = $xmlWidget.attr('visible');
                    if (vis === 'true')
                    {
                        var id = $xmlWidget.attr('id');
                        var name = iad.config.getDisplayName(id);
                        options += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-id="'+ id + '" class="iad-dropdown-option-widget-properties">' + name + '</a></li>';
                    }
                }
            }
        }
        $('#iad-dropdown-widget-properties').html(options);
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