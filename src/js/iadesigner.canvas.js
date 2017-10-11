var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

	iad.canvas = iad.canvas || {};

	var hoveredWidget; 					// Reference to the hovered widget.
	var activeWidget; 					// Reference to the active widget.
	iad.canvas.isActive = true;			// Indicates if the canvas is active.

	var cursor 			= ''; 			// The cursor type.
	var minSize 		= 30; 			// Minimum size for the dragger.
	var edgeBuffer 		= 15;			// Buffer size around dragger edges for picking up cursor type.
	var snapToGrid 		= true; 		// Snap to grid.
	var snapThreshold 	= 0.75; 		// Percent 0 - 100.
	var dragging 		= false; 		// Indicates that a drag or resize in progress.
	var mouseOverParent = true;			// Indicates that the mouse is over the report container.
	var mouseOverButton = false;		// Indicates that the mouse is over a button.

	// dragPanel dimensions on mouse down.
	var draggerDownX = 0, draggerDownY = 0, draggerDownW = 0, draggerDownH = 0; 

	// The mouse coords on mouse down.
	var mouseDownX = 0, mouseDownY = 0;

	// JQuery containers
	var $parent; 														// Parent container.
	var $eventBlocker 	= $('<div class="iad-event-blocker">'); 		// Blocks mouse event propagation when dragging or resizing.
	var $activePanel 	= $('<div class="iad-active-panel">');			// The active panel container. 
	var $dragPanel 		= $('<div class="iad-drag-panel">')				// The drag panel container.
	.append($('<div class="iad-drag-panel-fill">'));					// Add a fill to stop event propagation when the mouse is hovered over a widget in IE.  
	var $btns 			= $('<div class="iad-drag-panel-btn-bar">');	// Button bar.
	var $title 			= $('<div class="iad-drag-panel-title-bar">');	// Title bar.

	// Passed in options.
	var options;

	// Initialise.
	iad.canvas.init = function(o)
	{
		options = o; 

		if (options) 
		{
			$parent = options.report.container;

			// Append html to parent.
			$eventBlocker.appendTo($parent);
			$activePanel.appendTo($parent);
			$dragPanel.appendTo($parent);
			$btns.appendTo($dragPanel);
			//$title.appendTo($dragPanel);

			// Edit button.
			$('<div class="iad-drag-panel-btn iad-drag-panel-btn-edit" title="Edit">')
			.append($('<i class="fa fa-pencil">'))
			.mousedown(function(e) 
			{
				e.stopPropagation();

				if (options && options.onEditBtnClick) 
					options.onEditBtnClick.call(null, hoveredWidget.id);
			})
			.appendTo($btns);

			// Remove button.
			$('<div class="iad-drag-panel-btn iad-drag-panel-btn-remove" title="Remove">')
			.append($('<i class="fa fa-times">'))
			.mousedown(function(e) 
			{
				e.stopPropagation();

				if (options && options.onRemoveBtnClick) 
					options.onRemoveBtnClick.call(null, hoveredWidget.id);
			})
			.appendTo($btns);

			// Check for when mouse is over a button.
			$('.iad-drag-panel-btn')
			.mouseenter(function(e) {mouseOverButton = true;})
			.mouseleave(function(e) {mouseOverButton = false;});

			// Add mouseenter handler to widgets.
			iad.canvas.on();

			// Report Container.
			$parent
			.mouseenter(function(e) {mouseOverParent = true;})
			.mouseleave(function(e) {mouseOverParent = false;})
			.mousedown(function(e) 
			{
				if (iad.canvas.isActive === true)
				{
					$activePanel.css('display', 'none');

					if (activeWidget)
					{
						if (options && options.onUnselect) options.onUnselect.call(null, activeWidget.id);	
						activeWidget = undefined;
					}	
					if (options && options.onClearSelection) options.onClearSelection.call(null);
				}
			});

			// Drag Panel.
			$dragPanel
			.mouseenter(function(e) {if (!dragging) showCursor(e);})
			.mousemove(function(e) 	{if (!dragging) showCursor(e);})
			.mousedown(function(e) 	{if (!mouseOverButton) onMouseDown(e);})
			.mouseleave(function(e) 
			{
				if (!dragging) 
				{
					cursor = '';
					$dragPanel.css('display', 'none');
					ia.showDefaultCursor();
				}
			});
		}
	};

	// Called when the mouse enters a widget.
	function onMouseEnter(e, widget)
	{
		// Set this widget as the hovered widget.
		hoveredWidget = widget;

		// Display drag panel.
		$dragPanel.css('display', 'inline');

		// Add the widget name.
		$title.html(iad.report.getDisplayName(hoveredWidget.id));

		// Position the dragger container.
		var c = hoveredWidget.container;
	    var pos = c.position();
	    var l = c.position().left, t = c.position().top, w = c.outerWidth(), h = c.outerHeight(), z = hoveredWidget.zIndex();
		if (z === undefined) z = hoveredWidget.container.css('z-index');
		$dragPanel.css({'left': l, 'top': t, 'width': w, 'height': h, 'z-index': z, 'display': 'inline'});
	}

	function onMouseDown(e)
	{
		// Dont need to call onUnselect or onSelect if this is already the active widget.
		var isNotActiveWidget = true;
		if (activeWidget && (activeWidget.id === hoveredWidget.id)) isNotActiveWidget = false;

		// Dont need to call this if the widget is already selected.
		if (activeWidget && options && options.onUnselect && isNotActiveWidget) options.onUnselect.call(null, activeWidget.id);

		dragging = true;
		$eventBlocker.css({'display': 'inline'});
		e.stopPropagation();

		// Set this widget as the active widget.
		activeWidget = hoveredWidget;

		// Get position of the dragger within the parent container.
	    var pos = $dragPanel.position();
	    draggerDownX = pos.left;
	    draggerDownY = pos.top; 
	    draggerDownW = $dragPanel.outerWidth(); 
	    draggerDownH = $dragPanel.outerHeight();

	    // Position of cursor in the document.
		mouseDownX = e.pageX; 
		mouseDownY = e.pageY;

		// Update the active panel dimensions.
		updateActivePanel();

		if (options && options.onMouseDown) options.onMouseDown.call(null, activeWidget.id);
		if (options && options.onSelect && isNotActiveWidget) options.onSelect.call(null, activeWidget.id);

		$(document).on('mouseup.iadcanvas', onMouseUp);
		$(document).on('mousemove.iadcanvas', onMouseMove);
	}

	function onMouseUp(e)
	{
		if (options && options.onMouseUp) options.onMouseUp.call(null, activeWidget.id);
		dragging = false;
		$(document).off('.iadcanvas');
		$eventBlocker.css('display', 'none');
	}

	function onMouseMove(e)
	{
		$(document).off('.iadcanvas');

		// Check if dragging or resizing
		if (cursor === 'move') 
		{
			$(document).on('mousemove.iadcanvas', onDrag);
			$(document).on('mouseup.iadcanvas', onDragEnd);
		}
		else if (cursor === 'n-resize' || cursor === 'ne-resize' || cursor === 'e-resize' || cursor === 'se-resize' || 
			cursor === 's-resize' || cursor === 'sw-resize' || cursor === 'w-resize' || cursor === 'nw-resize')
		{
			$activePanel.css('display', 'none');
			$(document).on('mousemove.iadcanvas', onResize);
			$(document).on('mouseup.iadcanvas', onResizeEnd);
		}
		else dragging = false;
	}

	function onDrag(e)
	{
		// Keep showing cursor in case its been changed to the select cursor.
		ia.showCursor(cursor);

		if (mouseOverParent) 
		{
			// Change in x and y of mouse.
			var dx = e.pageX - mouseDownX;
			var dy = e.pageY - mouseDownY;
			var x = draggerDownX + dx;
			var y = draggerDownY + dy;

			if (snapToGrid)
			{	
				// Snap values in pixels.
				var xSnapThreshold = (snapThreshold / 100) * $parent.width();
				var ySnapThreshold = (snapThreshold / 100) *  $parent.height(); 
				x = Math.ceil(x/xSnapThreshold) * xSnapThreshold;
				y = Math.ceil(y/ySnapThreshold) * ySnapThreshold;
			}

			// Move the dragger.
			$dragPanel.css({'left': x,'top': y});

			// Account for anchored images.
			var xAnchor = activeWidget.xAnchor();
			if (xAnchor === "end" ||  xAnchor === "right") x = x + draggerDownW;
			else if (xAnchor === "middle" || xAnchor === "center") x = x + (draggerDownW / 2);

			// Move the active widget.
			var xPerc = (x / $parent.width()) * 100;
			var yPerc = (y /  $parent.height()) * 100;
			activeWidget.setPosition(xPerc, yPerc);

			// Update the active panel dimensions.
			updateActivePanel();
		}
	}

	function onDragEnd(e)
	{ 
		dragging = false; 	
		$(document).off('.iadcanvas');
		$eventBlocker.css('display', 'none');

		if (options && options.onDragEnd) 
		{
	        var pos = activeWidget.container.position();
			var xPerc = (pos.left / $parent.width()) * 100;
			var yPerc = (pos.top / $parent.height()) * 100;
			options.onDragEnd.call(null, activeWidget.id,  xPerc, yPerc); 
		}
		if (options && options.onMouseUp) options.onMouseUp.call(null, activeWidget.id);
	}

	function onResize(e)
	{
		// Keep showing cursor in case its been changed to the select cursor.
		ia.showCursor(cursor);
		
		if (mouseOverParent) 
		{
			// Change in x and y of mouse.
			var dx = e.pageX - mouseDownX;
			var dy = e.pageY - mouseDownY;

			var x = draggerDownX, y = draggerDownY, w = draggerDownW, h = draggerDownH;
			if (cursor === 'nw-resize') 
			{
				x = x + dx; 
				w = w - dx; 
				y = y + dy;
				h = h - dy;
			}		
			else if (cursor === 'n-resize') 
			{	
				y = y + dy; 
				h = h - dy;
			}		
			else if (cursor === 'ne-resize') 	
			{
				w = w + dx; 
				y = y + dy; 
				h = h - dy;
			}		
			else if (cursor === 'e-resize') 	
			{
				w = w + dx;
			}		
			else if (cursor === 'se-resize') 	
			{
				w = w + dx; 
				h = h + dy;
			}		
			else if (cursor === 's-resize') 	
			{
				h = h + dy;
			}		
			else if (cursor === 'sw-resize')	
			{
				x = x + dx; 
				w = w - dx; 
				h = h + dy;
			}		
			else if (cursor === 'w-resize')		
			{
				x = x + dx; 
				w = w - dx;
			}		

			if (snapToGrid)
			{
				// Snap values in pixels.
				var xSnapThreshold = (snapThreshold / 100) * $parent.width();
				var ySnapThreshold = (snapThreshold / 100) * $parent.height(); 

				if (cursor === 'nw-resize' || cursor === 'w-resize' || cursor === 'sw-resize') 
				{
					var xSnap = Math.ceil(x/xSnapThreshold) * xSnapThreshold;
					w = w - (xSnap - x);
					x = xSnap;
				}
				if (cursor === 'nw-resize' || cursor === 'n-resize' || cursor === 'ne-resize') 
				{
					var ySnap = Math.ceil(y/ySnapThreshold) * ySnapThreshold;
					h = h - (ySnap - y);
					y = ySnap;
				}
				if (cursor === 'ne-resize' || cursor === 'e-resize' || cursor === 'se-resize') 
					w = Math.ceil(w/xSnapThreshold) * xSnapThreshold;
				if (cursor === 'se-resize' || cursor === 's-resize' || cursor === 'sw-resize') 
					h = Math.ceil(h/ySnapThreshold) * ySnapThreshold;
			}
			
			// Adjust for min size.
			w = Math.max(w, minSize); 
			h = Math.max(h, minSize);

			// Resize the dragger.
			$dragPanel.css({'left': x, 'top': y, 'width': w, 'height': h});
		}
	}

	function onResizeEnd(e)
	{  	
		dragging = false;
		$(document).off('.iadcanvas');

		// Resize the active widget.
		var x = $dragPanel.position().left, y = $dragPanel.position().top, w = $dragPanel.outerWidth(), h = $dragPanel.outerHeight();

		// Account for anchored images.
		var xAnchor = activeWidget.xAnchor();
		if (xAnchor === "end" ||  xAnchor === "right") x = x + w;
		else if (xAnchor === "middle" || xAnchor === "center") x = x + (w / 2);

		// Calculate percentage dimensions.
		var xPerc = (x / $parent.width()) * 100;
		var yPerc = (y / $parent.height()) * 100;
		var wPerc = (w / $parent.width()) * 100;
		var hPerc = (h / $parent.height()) * 100;

		if (activeWidget.height() === undefined) hPerc = undefined;

		if (activeWidget.rescale) activeWidget.setDimensions(xPerc, yPerc, wPerc, hPerc);
		else activeWidget.setDimensions(xPerc, yPerc, w, h); // Fixed width and height images. 

		// Update the active panel dimensions.
		updateActivePanel();

		$eventBlocker.css('display', 'none');

		if (options && options.onResizeEnd) options.onResizeEnd.call(null, activeWidget.id,  xPerc, yPerc, wPerc, hPerc); 
		if (options && options.onMouseUp) options.onMouseUp.call(null, activeWidget.id);
	}

	function showCursor(e)
	{
		// Cursor position in dragger.
		var cx = e.pageX - $dragPanel.offset().left;
		var cy = e.pageY - $dragPanel.offset().top;

		// Dragger dimensions.
		var w = $dragPanel.outerWidth(true);
		var h = $dragPanel.outerHeight(true);

		// Get position of cursor to decide cursor type.
		if (hoveredWidget.height() === undefined) // Text Widget
		{
			if (cx > (w-edgeBuffer)) 	cursor = 'e-resize';
			else 						cursor = 'move';
		}
		else
		{
			if (cx > edgeBuffer && cx < (w-edgeBuffer) && cy < edgeBuffer) 			cursor = 'n-resize';
			else if (cx > (w-edgeBuffer) && cy < edgeBuffer) 						cursor = 'ne-resize';
			else if (cx > (w-edgeBuffer) && cy > edgeBuffer && cy < (h-edgeBuffer)) cursor = 'e-resize';
			else if (cx > (w-edgeBuffer) && cy > (h-edgeBuffer)) 					cursor = 'se-resize';
			else if (cx > edgeBuffer && cx < (w-edgeBuffer) && cy > (h-edgeBuffer)) cursor = 's-resize';
			else if (cx < edgeBuffer && cy > (h-edgeBuffer)) 						cursor = 'sw-resize';
			else if (cx < edgeBuffer && cy > edgeBuffer && cy < (h-edgeBuffer)) 	cursor = 'w-resize';
			else if (cx < edgeBuffer &&  cy < edgeBuffer)							cursor = 'nw-resize';
			else 																	cursor = 'move';
		}

		// Set cursor type.
		ia.showCursor(cursor);
	}

	// Update the dimensions of the active panel.
	function updateActivePanel()
	{
		var w = activeWidget;

		var xPerc = (w.container.position().left / $parent.width()) * 100;
		var yPerc = (w.container.position().top / $parent.height()) * 100; 
		var wPerc = (w.container.outerWidth() / $parent.width()) * 100;
		var hPerc = (w.container.outerHeight() / $parent.height()) * 100; 
	    var zIndex = w.zIndex();

		if (w.xAnchor() === 'end' || w.xAnchor() === 'right')
		{		
		    xPerc = w.container[0].style.right;
			$activePanel.css({'top': yPerc+'%', 'width': wPerc+'%', 'height': hPerc+'%', 'left' : '', 'right' : xPerc+'%', 'margin-left' : '', 'display' : 'inline', 'z-index': zIndex});
		}
		else if (w.xAnchor() === 'middle' || w.xAnchor() === 'center')
		{
	    	var marginLeft = w.container.css('margin-left');
			$activePanel.css({'top': yPerc+'%', 'width': wPerc+'%', 'height': hPerc+'%', 'left' : xPerc+'%', 'right' : '', 'margin-left' : marginLeft, 'display' : 'inline', 'z-index': zIndex});
		}
		else  
		{
			$activePanel.css({'top': yPerc+'%', 'width': wPerc+'%', 'height': hPerc+'%', 'left' : xPerc+'%', 'right' : '', 'margin-left' : '', 'display' : 'inline', 'z-index': zIndex});
		}
	}

	// Selects the widget with the given id.
	iad.canvas.select = function(id) 
	{
		// Check if widget exists.
		var widget = options.report.getWidget(id);
		if (widget !== undefined)
		{
			// Dont need to call onUnselect or onSelect if this is already the active widget.
			var isNotActiveWidget = true;
			if (activeWidget && (activeWidget.id === widget.id)) isNotActiveWidget = false; 

			if (activeWidget && options && options.onUnselect && isNotActiveWidget) options.onUnselect.call(null, activeWidget.id);

			// Set this widget as the active widget.
			activeWidget = widget;

			// Update the active panel dimensions.
			updateActivePanel();

			if (options && options.onSelect && isNotActiveWidget) options.onSelect.call(null, activeWidget.id);
		}
		else iad.canvas.clearSelection();
	};

	// Clears the selection.
	iad.canvas.clearSelection = function() 
	{
		if (activeWidget && options && options.onUnselect) options.onUnselect.call(null, activeWidget.id);
		if (options && options.onClearSelection) options.onClearSelection.call(null);

		$activePanel.css('display', 'none');
		activeWidget = undefined;
		$dragPanel.css('display', 'none');
		hoveredWidget = undefined;
	};

	// Updates the canvas after the report config has changed.
	iad.canvas.update = function() 
	{
		$activePanel.css('display', 'none');
		$dragPanel.css('display', 'none');

		// Re-append elements to bring them to the front.
		$eventBlocker.appendTo($parent);
		$activePanel.appendTo($parent);
		$dragPanel.appendTo($parent);

		// Add mouseenter handler to widgets.
		if (iad.canvas.isActive) iad.canvas.on();
	};

	// Switches on the drag canvas.
	iad.canvas.on = function() 
	{
		iad.canvas.isActive = true;

		// Hide panels.
		if (activeWidget !== undefined) $activePanel.css('display', 'inline');

		// Add mouseenter handler to widgets.
		var widgets = options.report.getWidgets();
		for (var i = 0; i < widgets.length; i++)
		{
			addHandler(widgets[i]);
		}
					
		if (options && options.onActivated) options.onActivated.call(null);
	};

	// Add handler.
	function addHandler(widget)
	{
		(function() // Execute immediately
		{ 
			widget.container.on('mouseenter.widgetEvents', function(e) {onMouseEnter(e, widget);});
		})();
	}

	// Switches off the drag canvas.
	iad.canvas.off = function() 
	{
		iad.canvas.isActive = false;

		// Hide panels.
		$activePanel.css('display', 'none');
		$dragPanel.css('display', 'none');

		// Remove mouseenter handler to widgets.
		var widgets = options.report.getWidgets();
		for (var i = 0; i < widgets.length; i++)
		{
			removeHandler(widgets[i]);
		}

		if (options && options.onDeactivated) options.onDeactivated.call(null);
	};

	// Remove handler.
	function removeHandler(widget)
	{
		(function() // Execute immediately
		{ 
			widget.container.off('mouseenter.widgetEvents');
		})();
	}

	return iad;

})(iadesigner || {}, jQuery, window, document);