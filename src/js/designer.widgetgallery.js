var designer = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.widgetgallery = iad.widgetgallery || {};

	iad.widgetgallery.initialised = false;

	var options;
	var dataSourceIndex = 0;

	// Initialise gallery.
	iad.widgetgallery.init = function(o)
	{
		options = o;

		$(options.container)
		.on('mouseenter', '.iad-widget-thumbnail', function ()
		{
			$(this).find('.iad-thumbnail-hover-clickable').fadeIn(); // Show description and buttons on thumbnail enter.
		})
		.on('mouseleave', '.iad-widget-thumbnail', function()
		{
			$(this).find('.iad-thumbnail-hover-clickable').fadeOut(); // Hide description and buttons on thumbnail leave.
		})
		.on('click', '.iad-widget-thumbnail', function (e)
		{
            var widgetId = $(this).data('widget-id');
			if (options && options.onAdd) options.onAdd.call(null, widgetId);
		})
		.on('click change', 'input[name="iad-radio-widget-gallery-datasource"]', function(e)
        {
            dataSourceIndex = $(this).val();
            iad.widgetgallery.update();
        });
		this.initialised = true;
	};

	// Update gallery.
	iad.widgetgallery.update = function()
	{
		var json = JSON.parse(JSON.stringify(options.json));

		// Get widgets and sort into alphabetical order so that galleries 
		// will look similar across config files no matter what order widgets appear in config file.
		var $xmlWidgets = iad.report.getComponents();

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

		if (moreThanOneDataSource === true) 
		{
			json.header.include = true;
		}
		else
		{
			json.header.include = false;
			dataSourceIndex = 0;
		}
		json.dataSourceIndex = dataSourceIndex;

		if (parseInt(dataSourceIndex) === 0)
		{
			json.header.buttons.datasource1.active = 'active';
			json.header.buttons.datasource2.active = '';
		}
		else
		{
			json.header.buttons.datasource1.active = '';
			json.header.buttons.datasource2.active = 'active';
		}

		var arrDataSources = dataSources[dataSourceIndex];
		for (var i = 0; i < arrDataSources.length; i++)
		{
			var $xmlWidget 	= arrDataSources[i];
			var vis 		= $xmlWidget.attr('visible');

			if (vis != 'true')
			{
				// Get config info.
				var id 			= $xmlWidget.attr('id');
				var adjustedId 	= iad.report.getIdWithoutSuffix(id);
				var name 		= iad.report.getDisplayName(id);
				var description = $xmlWidget.find('Description').text();

				// Find the widget in the gallery
				for (var j = 0; j < json.galleries.length; j++)
				{
					var gallery = json.galleries[j];
					for (var k = 0; k < gallery.widgets.length; k++)
					{
						var widget = gallery.widgets[k];
						if (widget.id == adjustedId)
						{
							gallery.include = true; // Include the gallery if it has at least one widget.
							widget.include = true;
							widget.id = id;
							widget.name = name;
							widget.description = description;
							break;
						}
					}
				}
			}
		}

		// Find first gallery.
		for (var m = 0; m < json.galleries.length; m++)
		{
			if (json.galleries[m].include === true) 
			{
				json.galleries[m].first = true;
				break;
			}
		}

		// Apply handlebars template for gallery.
		var template = window.designer[options.template];
		var html = template(json);
		$(options.container).html(html);
	};

	return iad;

})(designer || {}, jQuery, window, document);