var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.widgetproperties = iad.widgetproperties || {};

    // Passed in options.
    var options;

    // Form display properties for each widget (scroll position and expanded panel index).
    var oFormProps = {};

    // Do scroll after panel has been opened.
    var doScroll = false;

    // Current widget id.
    var activeWidgetId;

    // Indicates a config property was added.
    var propertyWasAdded = false;

    var $container;
    var $sidebarWidgetTitle = $('#iad-sidebar-widget-title');
    var $editWidgetBtn = $('#iad-btn-widget-edit');

    // Initialise.
    iad.widgetproperties.init = function(o)
    {
        options = o; 
        if (options && options.container) 
        {
            $container = $(options.container);
            addHandlers($container);
        }
    };

    iad.widgetproperties.refresh = function(propertyAdded)
    {
        propertyWasAdded = propertyAdded;

        if (activeWidgetId === undefined || activeWidgetId === 'PropertyGroup')
            showPropertyGroupForm();
        else if (activeWidgetId === 'MapPalettes')
            showMapPalettesForm();
        else 
            showWidgetForm(activeWidgetId);
    };

    iad.widgetproperties.edit = function(widgetId)
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

    iad.widgetproperties.show = function(widgetId)
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

    // Scrolls to position in form.
    function scrollTo(scrollPos)
    {
        if (options && options.container) $container.parent().scrollTop(scrollPos);        
    }

    // Scrolls to bottom of form.
    function scrollToBottom()
    {
        if (options && options.container) 
        {
            scrollTo($container.parent()[0].scrollHeight); 
            propertyWasAdded = false;       
        }
    }

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

            // Apply handlebars template for forms.
            $container.parent().css('visibility','hidden');

            iad.formcontrols.render(
            {
                container:options.container,
                template:options.template,
                json:jsonForm

            });
            
            // Form display properties for each widget (scroll position and expanded panel index).
            if (oFormProps[activeWidgetId] !== undefined)         
            {
                if (oFormProps[activeWidgetId].panelIndex !== undefined) 
                {
                    doScroll = true;
                    $container.find('.iad-collapse:eq('+oFormProps[activeWidgetId].panelIndex+')').collapse('show');
                }
                else if (oFormProps[activeWidgetId].scrollPos !== undefined) 
                {
                    scrollTo(oFormProps[activeWidgetId].scrollPos);
                    $container.parent().css('visibility','visible');
                    if (propertyWasAdded) scrollToBottom();
                }
            }   
            else 
            {
                if ($container.find('.iad-collapse').length > 1)
                {
                    doScroll = true;
                    oFormProps[activeWidgetId] = {scrollPos:0, panelIndex:0};
                    $container.find('.iad-collapse:eq(0)').collapse('show');
                }        
                else
                {
                    scrollTo(0);
                    $container.parent().css('visibility','visible');
                    if (propertyWasAdded) scrollToBottom();
                }    
            }
        }
    }

    function addHandlers($container)
    {
        // Fix for accordion collapse bug https://github.com/openam/bootstrap-responsive-tabs/issues/45
        $container.on('show.bs.collapse', '.iad-collapse', function (e) 
        {
            $(e.target).closest('.panel').siblings().find('.panel-collapse').collapse('hide');
        });
        $container.on('shown.bs.collapse', '.iad-collapse', function (e)
        {
            // Do scroll after collapse has expanded to scroll to correct position.
            if (doScroll)
            {
                doScroll = false;
                if (oFormProps[activeWidgetId].scrollPos !== undefined) 
                    scrollTo(oFormProps[activeWidgetId].scrollPos);

                $container.parent().css('visibility','visible');
                if (propertyWasAdded) scrollToBottom();
            }
            // Store the index of the expanded panel.
            var panelIndex = $container.find('.iad-collapse').index(this);
            if (oFormProps[activeWidgetId] !== undefined)
                oFormProps[activeWidgetId].panelIndex = panelIndex;
            else
                oFormProps[activeWidgetId] = {scrollPos:0, panelIndex:panelIndex};
        });
        $container.on('hidden.bs.collapse', '.iad-collapse', function (e)
        {
            // Remove the index of the expanded panel.
            if (oFormProps[activeWidgetId] !== undefined)
                oFormProps[activeWidgetId].panelIndex = undefined;
            else
                oFormProps[activeWidgetId] = {scrollPos:0, panelIndex:undefined};
        });
        $container.parent().on('scroll', function (e)
        {
            if (doScroll === false)
            {
                // Store the current scroll position so we can go back to it after the form has refreshed.
                var scrollPos = $(this).scrollTop();
                if (oFormProps[activeWidgetId] !== undefined)
                    oFormProps[activeWidgetId].scrollPos = scrollPos;
                else
                    oFormProps[activeWidgetId] = {scrollPos:scrollPos, panelIndex:undefined};
            }
        });
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);
