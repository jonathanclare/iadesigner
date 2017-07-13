/**
 * <code>Map</code> defines the basic layout behavior of a google map.
 *
 * @author J Clare
 * @class ia.GoogleMap
 * @extends ia.CartesianSpace
 * @constructor
 * @param {String} id The id of the map.
 * @param {String} mapType The initial map type.
 * @param {String} apiKey The api key.
 * @param {Number} minZoomLevel The min zoom (smaller number).
 * @param {Number} maxZoomLevel The max zoom (larger number).
 * @param {String} greyscaleText Toolbar greyscale text.
 * @param {String} offText Toolbar off text.
 */
ia.GoogleMap = function(id, mapType, apiKey, minZoomLevel, maxZoomLevel, greyscaleText, offText)
{
	ia.GoogleMap.baseConstructor.call(this);
	
	//--------------------------------------------------------------------------
	//
	// Variables
	//
	//--------------------------------------------------------------------------

	// A reference to this object.
	var me = this;
	
	// For projecting coordinates
	var mp = new ia.GoogleMercatorProjection();
	
	// The IA map object.
	var iaMap;

	// The google overlay that holds the IA map.
	var iaMapOverlay;
		
	// Work around fitBounds() bug in google maps.	
	var fittedBounds;
	var zoomFull = false;
	
	// Variables to keep track of navigation.
	var dragBounds;
	var zooming = false;
	var iaMapWidth = -1;
	var iaMapHeight = -1;

	//--------------------------------------------------------------------------
	//
	// Properties
	//
	//--------------------------------------------------------------------------

	/**
	 * The google map object.
	 * 
	 * @property gMap
	 * @type google.maps.Map
	 */
	this.gMap;

	/**
	 * The google api key.
	 * 
	 * @property apiKey
	 * @type String
	 */
	this.apiKey;

	/**
	 * The container that holds the object.
	 * 
	 * @property container
	 * @type JQUERY Element
	 */
	this.container;

	/**
	 * The map bounds - equivalent of defaultBBox.
	 * 
	 * @property defaultBounds
	 * @type ia.BoundingBox
	 */
	this.defaultBounds;

	/**
	 * The id.
	 * 
	 * @property id
	 * @type String
	 */
	this.id;
	
	//--------------------------------------------------------------------------
	//
	// Constructor
	//
	//--------------------------------------------------------------------------
	
	/** 
	 * Initialises.
	 *
 	 * @method init
	 * @private
	 */
	function init() 
	{
		me.id = id
		me.apiKey = apiKey;
		me.setMapType(mapType);
		
		// Create a new greyscale map type.
		var greyscaleStyle = 
		[{
			featureType: "all",
			stylers: [{ saturation: -80 }]
		}];
		var greyscaleMapType = new google.maps.StyledMapType(greyscaleStyle, {name:greyscaleText});
		
		var offStyle = 
		[{
		    stylers: [{ visibility: "off" }]
		}]
		var offMapType = new google.maps.StyledMapType(offStyle, {name:offText});

		// Google map interface settings
		var mapOptions = 
		{
			panControl: false,
			zoomControl: false,
			streetViewControl: false,
			overviewMapControl: true,			
			disableDoubleClickZoom: true,
			mapTypeControlOptions: 
			{
				//style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				mapTypeIds: 
				[
					google.maps.MapTypeId.ROADMAP, 
					google.maps.MapTypeId.SATELLITE, 
					google.maps.MapTypeId.HYBRID, 
					google.maps.MapTypeId.TERRAIN,
					greyscaleText,
					offText
				]
			}
		};
		
		if (minZoomLevel != -1) mapOptions.minZoom = minZoomLevel;
		if (maxZoomLevel != -1) mapOptions.maxZoom = maxZoomLevel;
		
		// Create the container element.
		me.container = $j("<div id='"+id+"' class='ia-map'>"); 
		me.mapContainer = $j("<div id='"+id+"-map-container'>"); 
		me.container.append(me.mapContainer);
		
		// Add the map controller.
		me.controller = new ia.MapController(me);
				
		// Redraw the map on a resize - use a timeout to reduce number of redraws.
		var resizeTimer;
		me.container.resize(function(e) 
		{		
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function()
			{
				clearTimeout(resizeTimer);
				
				var w = me.container.width();
				var h = me.container.height();
				
				if (me.mapContainer.width() != w
				|| me.mapContainer.height() != h)
				{
					me.mapContainer.width(w);
					me.mapContainer.height(h);

					me.canvasWidth = w;
					me.canvasHeight= h;

					me.commitChanges();

					if (me.gMap == undefined)
					{
						// Initialise the google map.
						me.gMap = new google.maps.Map(document.getElementById(id+'-map-container'), mapOptions);

						// Add an event listener to update the bbox.
						google.maps.event.addListener(me.gMap, 'bounds_changed', updateBBox);

						// Register the greyscale map type.
						me.gMap.mapTypes.set(greyscaleText, greyscaleMapType);
						me.gMap.mapTypes.set(offText, offMapType);

						// Set the starting map type.
						me.gMap.setMapTypeId(_mapType);

						var e = new ia.Event(ia.Event.MAP_READY, me);
						me.dispatchEvent(e);
					}

					google.maps.event.trigger(me.gMap, "resize");
				}
			
			}, 500);
		});
	};
	
	//--------------------------------------------------------------------------
	//
	// Methods
	//
	//--------------------------------------------------------------------------
	
	/** 
	 * Adds an IA map as a google overlay.
	 * 
 	 * @method addMapOverlay
	 * @param {ia.Map} map The IA map.
	 */
	this.addMapOverlay = function(map)
	{
		iaMap = map;
		iaMap.embeddedInGoogleMaps = true;
		iaMap.isDraggable = false;
		
		iaMap.addEventListener(ia.Event.MAP_RESIZE, onIAMAPResize);
	
		// Unproject from mercator to lat/long.
		var bb = me.controller.defaultBBox;
		var sw = mp.unproject(bb.getXMin(), bb.getYMin(), true);
		var ne = mp.unproject(bb.getXMax(), bb.getYMax(), true);

		// Get bounds for google maps.
		var swBound = new google.maps.LatLng(sw.latitude, sw.longitude);
		var neBound = new google.maps.LatLng(ne.latitude, ne.longitude);
		me.defaultBounds = new google.maps.LatLngBounds(swBound, neBound); 
					
		// Inner class - Google overlay object which is used to place the ia map
		// inside the google map as an overlay.
		GoogleOverlay.prototype = new google.maps.OverlayView();
		function GoogleOverlay() 
		{
			this.setMap(me.gMap);
		};
		GoogleOverlay.prototype.onAdd = function() 
		{
			var panes = this.getPanes();
			panes.overlayImage.appendChild(iaMap.container.get(0));
		};
		GoogleOverlay.prototype.draw = function() {};
		GoogleOverlay.prototype.onRemove = function() 
		{
			iaMap.container.parentNode.removeChild(iaMap.container);
		};

		// Create the new IA map overlay.
		iaMapOverlay = new GoogleOverlay();
		
		// Add google map events.
		var zoomLevel = -1;
		google.maps.event.addListener(me.gMap, 'zoom_changed', function(event) 	
		{
			var zl = me.gMap.getZoom();
			var doZoom = true;
			if ((minZoomLevel != -1) && (zl < minZoomLevel))  doZoom = false;
			if ((maxZoomLevel != -1) && (zl > maxZoomLevel))  doZoom = false;
			if (zl == zoomLevel)  doZoom = false;
			
			if (doZoom)
			{
				zooming = true;
				if (zoomLevel != -1) iaMap.clear();
				zoomLevel = zl;
			}
		});
		google.maps.event.addListener(me.gMap, 'idle', function(event) 	
		{
			updateIAMap();
			zooming = false;
		});
		/*google.maps.event.addListener(me.gMap, 'drag', function(event) 	
		{
			var ne = dragBounds.getNorthEast();
			var sw = dragBounds.getSouthWest();

			var overlayProjection = iaMapOverlay.getProjection();
			var x = overlayProjection.fromLatLngToDivPixel(sw).x;
			var y = overlayProjection.fromLatLngToDivPixel(ne).y;
			
			iaMap.container.css({"left" : x + "px", 
						"top" : y + "px"});
		});*/


		// Fix for when google maps stops propagation of events during dragging.
		google.maps.event.addListener(me.gMap, 'dragstart', function(event) 	
		{
			iaMap.startDrag();
		});
		google.maps.event.addListener(me.gMap, 'dragend', function(event) 	
		{
			iaMap.endDrag();
		});
	};
	
	/** 
	 * Called when the IA map resizes.
	 *
 	 * @method onIAMAPResize
	 * @private
	 */
	function onIAMAPResize(event)
	{
		if (zooming == false)
		{
			if (mapWrapped()) 
			{
				iaMap.controller.zoomFull();
			}
			else 
			{
				iaMap.commitChanges();
			}
		};
	};
	
	/** 
	 * Checks if the IA map fits inside the google map.
	 *
 	 * @method mapWrapped
	 * @return {Boolean} True if it fits, otherwise false.
	 * @private
	 */
	function mapWrapped()
	{
		var overlayProjection = iaMapOverlay.getProjection();
		var mapBounds = me.gMap.getBounds();
		var ne = mapBounds.getNorthEast();
		var sw = mapBounds.getSouthWest();
		if (sw.lng() >= ne.lng()) return true;
		
		var worldWidth = overlayProjection.getWorldWidth();
		if (worldWidth <= me.container.width()) return true;
		else return false;
	};
	
	/** 
	 * Updates the IA map.
	 *
 	 * @method updateIAMap
	 * @private
	 */
	function updateIAMap()
	{
		iaMap.clear();
	
		var overlayProjection = iaMapOverlay.getProjection();
		if (mapWrapped())
		{
			var sw = me.defaultBounds.getSouthWest();
			var ne = me.defaultBounds.getNorthEast();
			var swPixels = overlayProjection.fromLatLngToDivPixel(sw);
			var nePixels = overlayProjection.fromLatLngToDivPixel(ne);
			var w = Math.abs((nePixels.x - swPixels.x));
			var h = Math.abs((swPixels.y - nePixels.y));
			var x = swPixels.x;
			var y = nePixels.y;
			
			// Width of map greater or same as world.
			if (me.controller.defaultBBox.getWidth() >= 40000000)
			{
				// Need to fix width because coords just go haywire.
				var worldWidth = overlayProjection.getWorldWidth();
				w = worldWidth;

				// Solves problem of countries near dateline by moving
				// map west of dateline if more of that side is displayed in the map.
				var cx = overlayProjection.fromLatLngToContainerPixel(sw).x;
				var centreMap = me.container.width() / 2
				if (cx > centreMap) x = x  - w;
			}

			iaMap.container.css({"left" : x + "px", 
						"top" : y + "px",
						"width" : w + "px",
						"height" : h + "px"});
			dragBounds = me.defaultBounds;
		}
		else
		{
			var mapBounds = me.gMap.getBounds();
			var sw = mapBounds.getSouthWest();
			var ne = mapBounds.getNorthEast();
			
			var x = overlayProjection.fromLatLngToDivPixel(sw).x;
			var y = overlayProjection.fromLatLngToDivPixel(ne).y;
			var w = me.container.width();
			var h = me.container.height();
			iaMap.container.css({"left" : x + "px", 
					"top" : y + "px",
					"width" : w + "px",
					"height" : h + "px"});

			var p1 = mp.project(sw.lng(), sw.lat(), true);
			var p2 = mp.project(ne.lng(), ne.lat(), true);
			
			iaMap.getBBox().setXMin(p1.x);
			iaMap.getBBox().setYMin(p1.y);
			iaMap.getBBox().setXMax(p2.x);
			iaMap.getBBox().setYMax(p2.y);

			dragBounds = mapBounds;
		}		
		
		// Render here if the IA map canvas didnt change size.
		// Otherwise onIAMAPResize() takes care of the rendering.
		if (Math.round(w) == Math.round(iaMapWidth) && Math.round(h) == Math.round(iaMapHeight)) 
		{
			iaMap.render();
		}
		iaMapWidth = w;
		iaMapHeight = h;
	};
	
	/** 
	 * Sets the map type.
	 * 
 	 * @method setMapType
	 * @param {String} mapType The mapType.
	 */
	var _mapType = google.maps.MapTypeId.ROADMAP;
	this.setMapType = function(mapType)
	{
		if (mapType == 'greyscale') _mapType = greyscaleText;
		else if (mapType == 'off') _mapType = offText;
		else if (mapType == 'normal') _mapType = google.maps.MapTypeId.ROADMAP;
		else if (mapType == 'satellite') _mapType = google.maps.MapTypeId.SATELLITE;
		else if (mapType == 'hybrid') _mapType = google.maps.MapTypeId.HYBRID;
		else if (mapType == 'physical') _mapType = google.maps.MapTypeId.TERRAIN;
	};
	
	/** 
	 * Updates the bounding box after the bounds of the google map have changed.
	 * 
 	 * @method updateBBox
 	 * @private
	 */
	function updateBBox() 
	{
		var bounds = me.gMap.getBounds();
		
		// Work around fitBounds() bug in google maps...
		// http://code.google.com/p/gmaps-api-issues/issues/detail?id=3117
		var zoom = extra_zoom(fittedBounds, bounds);
		if (zoom > 0 && zoomFull)
		{ 
			me.gMap.setZoom(me.gMap.getZoom() + zoom);
		}
		else
		{
			var ne = bounds.getNorthEast();
			var sw = bounds.getSouthWest();
			var p1 = mp.project(sw.lng(), sw.lat(), true);
			var p2 = mp.project(ne.lng(), ne.lat(), true);

			me.bBox.setXMin(p1.x);
			me.bBox.setYMin(p1.y);
			me.bBox.setXMax(p2.x);
			me.bBox.setYMax(p2.y);

			me.commitChanges();
		}
		zoomFull = false;
	};
	
	/** 
	 * Sets the bounding box.
	 * 
 	 * @method setBBox
	 * @param {ia.BoundingBox} bBox The bounding box.
	 */
	this.setBBox = function(bBox) 
	{	
		if (me.gMap) 
		{		 
			if (bBox.equals(me.controller.defaultBBox)) zoomFull = true;
			
			if (bBox.getXMin() < -20000000)
			{
				bBox.setXMin(-20000000);
				me.adjustY(bBox);
			}
			if (bBox.getXMax() > 20000000)
			{
				bBox.setXMax(20000000);
				me.adjustY(bBox);
			}

			// Unproject from mercator to lat/long.
			var p1 = mp.unproject(bBox.getXMin(), bBox.getYMin(), true);
			var p2 = mp.unproject(bBox.getXMax(), bBox.getYMax(), true);

			// Get bounds for google maps.
			var sw = new google.maps.LatLng(p1.latitude, p1.longitude);
			var ne = new google.maps.LatLng(p2.latitude, p2.longitude);
			fittedBounds = new google.maps.LatLngBounds(sw, ne); 
				 
			me.gMap.fitBounds(fittedBounds);
		
			//var rect = new google.maps.Rectangle({ map: me.gMap, strokeColor: '#FF0000', strokeOpacity: 1.0,strokeWeight: 5 });
			//rect.setBounds(fittedBounds);
        }
	};
	
	/** 
	 * LatLngBounds bnds -> height and width as a Point
	 * 
 	 * @method hwpx
	 * @param {google.maps.LatLngBounds} bnds LatLngBounds.
	 * @param {google.maps.Point} A google point.
 	 * @private
	 */
	function hwpx(bnds)
	{ 
		var proj = iaMapOverlay.getProjection();
		var sw = proj.fromLatLngToContainerPixel(bnds.getSouthWest()) ;
		var ne = proj.fromLatLngToContainerPixel(bnds.getNorthEast()) ;
		return new google.maps.Point(Math.abs(sw.y - ne.y), Math.abs(sw.x - ne.x));
	};
	  
	/** 
	 * LatLngBounds b1, b2 -> zoom increment.
	 * 
 	 * @method extra_zoom
	 * @param {google.maps.LatLngBounds} b1 The first LatLngBounds.
	 * @param {google.maps.LatLngBounds} b2 The second LatLngBounds.
	 * @param {Number} The zoom increment.
 	 * @private
	 */
	function extra_zoom(b1, b2) 
	{ 
		hw1 = hwpx (b1) ;
		hw2 = hwpx (b2) ;
		if (Math.floor(hw1.x) == 0) {return 0;}
		if (Math.floor(hw1.y) == 0) {return 0;}
		var qx = hw2.x / hw1.x;
		var qy = hw2.y / hw1.y;
		var min = qx < qy ? qx : qy;
		if (min < 1) {return 0;}
		return Math.floor(Math.log(min) / Math.log(2)) ;
	};
	
	//--------------------------------------------------------------------------
	//
	// Zoom to feature
	//
	//--------------------------------------------------------------------------
	
	/** 
	 * Zooms to a feature in the map.
	 * 
	 * @method zoomToFeatureWithId
	 * @param {String} featureId The id of the feature.
	 * @param {ia.LayerBase[]} optLayers An optional list of layers to check.
	 * @return {Boolean} true if the feature was found, otherwise false.
	 */
	this.zoomToFeatureWithId = function(featureId) 
	{
		var layers = iaMap.getLayers();
		for (var i = 0; i < layers.length; i++)  
		{
			var items = layers[i].items;
			for (var id in items)
			{
				if (id == featureId)
				{		
					me.zoomToFeature(items[id]);
					return true;
				}
			}
		}
		return false;
	};

	/** 
	 * Zooms to a feature in the map with the given name.
	 * 
	 * @method zoomToFeatureWithName
	 * @param {String} featureName The name of the feature.
	 * @param {ia.LayerBase[]} optLayers An optional list of layers to check.
	 * @return {Boolean} true if the feature was found, otherwise false.
	 */
	this.zoomToFeatureWithName = function(featureName, optLayers) 
	{
		var layers = optLayers || iaMap.getLayers();
		for (var i = 0; i < layers.length; i++)  
		{
			var items = layers[i].items;
			for (var id in items)
			{
				var item = items[id];
				if (item.name == featureName)
				{
					me.zoomToFeature(item);
					return true;
				}
			}
		}
		return false;
	};

	/** 
	 * Zooms to a feature in the map.
	 * 
	 * @method zoomToFeature
	 * @param {String} featureId The id of the feature.
	 * @return {Boolean} true if the feature was found, otherwise false.
	 */
	this.zoomToFeature = function(feature) 
	{
		if (feature.bBox && feature.bBox.getXMin() != Infinity)
		{
			me.controller.zoomToBBox(feature.bBox);
		}
	};

	/** 
	 * Zooms to a set of features in the map.
	 * 
	 * @method zoomToFeatures
	 * @param {String[]} featureIds A list of feature ids.
	 * @param {ia.LayerBase[]} optLayers An optional list of layers to check.
	 */
	this.zoomToFeatures = function(featureIds, optLayers) 
	{
		var xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;

		var layers = optLayers || this.getLayers();
		for (var i = 0; i < layers.length; i++)  
		{
			var items = layers[i].items;

			for (var j = 0; j < featureIds.length; j++)  
			{
				var id = featureIds[j]
				var item = items[id];
				if (item && item.bBox)
				{
					
					xMin = (item.bBox.getXMin() < xMin) ? item.bBox.getXMin() : xMin;
					yMin = (item.bBox.getYMin() < yMin) ? item.bBox.getYMin() : yMin;
					xMax = (item.bBox.getXMax() > xMax) ? item.bBox.getXMax() : xMax;                       
					yMax = (item.bBox.getYMax() > yMax) ? item.bBox.getYMax() : yMax;
				}
			}
		}

		if (xMin != Infinity 
			&& yMin != Infinity 
			&& xMax != Infinity 
			&& yMax != Infinity)
		{
			var bb = new ia.BoundingBox(xMin, yMin, xMax, yMax);
			me.controller.zoomToBBox(bb);
		}
	};


	/** 
	 * Centers a feature on the map.
	 *
	 * @method centerOnFeature
	 * @param {String} featureId The id of the feature.
	 * @return {Boolean} true if the feature was found, otherwise false.
	 */
	this.centerOnFeature = function(featureId) 
	{
		// Center on feature didnt work correctly so just use zoom.
		return this.zoomToFeature(featureId);
	};

	init();
}
ia.extend(ia.CartesianSpace, ia.GoogleMap);