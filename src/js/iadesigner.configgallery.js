var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.configgallery = iad.configgallery || {};

	iad.configgallery.initialised = false;

	// Initialise thumbnail gallery.
	iad.configgallery.init = function(options)
	{
		var $container = $(options.container);

		var reportHash = {}; 	// Hash to hold report info.
		var reportId = ''; 		// Holds the active report id.

		// Register handlebars helper variables.
		var galleryCounter = 0;
		var reportCounter = 0;
		Handlebars.registerHelper('galleryId', function() {return 'gallery-' + galleryCounter++;}); 											// Returns ids of galleries.
		Handlebars.registerHelper('reportId', function() {return 'report-' + reportCounter++;}); 												// Returns ids of reports.
		Handlebars.registerHelper('screenshotPath', function(report) {return options.configPath + '/' + report.path + '/screenshot.png';}); 	// The path to the screenshot.

		// Apply handlebars template for gallery
		var template = window.iadesigner[options.template];
		var html = template(options.json);
		$container.html(html);

		// Build a hashtable to hold the report info for quick reference.
		var index = 0; // Index for report ids.
		for (var j = 0; j < options.json.galleries.length; j++)
		{
			var gallery = options.json.galleries[j];
			if (gallery.reports !== undefined)
			{
				for (var k = 0; k < gallery.reports.length; k++)
				{
					var report = gallery.reports[k];
					var id = 'report-' + index++;
					reportHash[id] = report;
				}
			}
		}

		// Thumbnail hover.
		$('.iad-thumbnail')
		.on('mouseenter', function()
		{
			reportId = $(this).attr('id'); // Set the active report id.
			$(this).find('.iad-thumbnail-hover').fadeIn(); // Show description and buttons on thumbnail enter.
		})
		.on('mouseleave', function()
		{
			$(this).find('.iad-thumbnail-hover').fadeOut(); // Hide description and buttons on thumbnail leave.
		});

		// Preview click.
		$('.iad-config-gallery-preview-btn')
		.on('click', function(e) // Open the a live report preview in a new tab.
		{
			var report = reportHash[reportId];
			var path = options.reportPath + '/atlas.html?config=../../' + options.configPath + '/' + report.path + '/config&dataPath=../../' + options.configPath + '/' + report.path + '/';
			if (options && options.onPreview) options.onPreview.call(null, path, report.header);
		});

		// Apply click.
		$('.iad-config-gallery-apply-btn')
		.on('click', function(e) // Apply the selected config file.
		{
			var report = reportHash[reportId];
			var path = options.configPath + '/' + report.path + '/config.xml';
			if (options && options.onApply) options.onApply.call(null, path, report.header);
		});

		this.initialised = true;
	};

	return iad;

})(iadesigner || {}, jQuery, window, document);