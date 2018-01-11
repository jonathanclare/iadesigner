/**
 * <code>ia.MapTools</code> is a set of map tools that can be attached to a map.
 *
 * @author J Clare
 * @class ia.MapTools
 * @constructor
 * @param {ia.Map} map The associated map object.
 * @param {ia.DataGroup} dataGroup The associated data group.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 * @param {Boolean} googleMaps Indicates if google maps is being used.
 * @param {Boolean} includeSearchTool Indicates if the search tool is included.
 */
ia.MapTools = function(map, dataGroup, interactionGroup, googleMaps, includeSearchTool)
{
    var me = this;

    me._clearBtn = undefined;
    me._filterBtn = undefined;
    me._map = map;
    me._useGoogleMaps = googleMaps;
    me._includeSearchTool = includeSearchTool;
    me._searching = false;
    me._interactionGroup = interactionGroup;
    me._dataGroup = dataGroup;

    // Create Load a marker for search results.
    me._marker = new Image();
    me._marker.src = "./map_tool_search.png";

    // Create the container element.
    if (me._useGoogleMaps) me.container = $j('<div class="ia-google-map-toolbar"></div>');
    else me.container = $j('<div class="ia-map-toolbar"></div>');

    // Listen for the selection changing.
    interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, this._updateToolbar.bind(this));

    // Listen for the filter changing.
    dataGroup.addEventListener(ia.FilterEvent.FILTER_CHANGED, this._updateToolbar.bind(this));
};

/** 
 * Updates the tool bar.
 * 
 * @property updateToolbar
 * @private
 */
ia.MapTools.prototype._updateToolbar = function() 
{
    if (this._interactionGroup.getSelection().length > 0) 
    {
        if (this._clearBtn) 
            this._clearBtn.removeClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled').addClass('ia-list-item ia-cross-btn');
        if (this._filterBtn) 
            this._filterBtn.removeClass('ia-cross-btn ia-toolbar-text-btn-disabled').addClass('ia-list-item ia-cross-btn-disabled');
    }
    else
    {
        if (this._clearBtn) 
            this._clearBtn.removeClass('ia-list-item ia-cross-btn').addClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled');
        if (this._filterBtn)
        {
            if (this._dataGroup.getFilteredFeatures().length > 0)  
                this._filterBtn.removeClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled').addClass('ia-list-item ia-cross-btn');
            else 
                this._filterBtn.removeClass('ia-list-item ia-cross-btn').addClass('ia-cross-btn-disabled ia-toolbar-text-btn-disabled');
        }
    }
};

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.MapTools.prototype.container;

/** 
 * Allows a custom function to be set for when the filter button is pressed.
 * 
 * @property filterFunction
 * @type Function
 */
ia.MapTools.prototype.filterFunction = function() {};

/** 
 * Allows a custom function to be set for when the clear button is pressed.
 * 
 * @property filterFunction
 * @type Function
 */
ia.MapTools.prototype.clearFunction = function() {};

/**
 * Default function carries out a single search using the ArcGIS Server geocoding rest api.
 * Override this function to use a different geogode service.
 *
 * @param searchTerm The search term entered by the user.
 * @param callbackfunction A function to call with the search results as a parameter.
 */
ia.MapTools.prototype.searchFunction = function(searchTerm, callbackfunction)
{
    // This is the spatial reference system for the Web Mercator projection used in the ArcGIS Online maps.
    var srs = 102100; 

    // Restrict the search to this bBox.
    var bBox = this._map.controller.defaultBBox; 
    var bBoxString = '{"xmin":'+bBox.getXMin()+',"ymin":'+bBox.getXMin()+',"xmax":'+bBox.getXMax()+',"ymax":'+bBox.getYMax()+',"spatialReference":{"wkid":'+srs+'}}';
    
    // Maximum nmuber of returned locations.
    var maxLocations = 4; 

    // Build the request url.
    var requestUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text="+searchTerm+"&outSR="+srs+"&bbox="+bBoxString+"&maxLocations="+maxLocations+"&f=json";

    ia.File.load(
    {
        url: requestUrl,
        dataType: "json", 
        onSuccess:function(searchResults)
        {
            // List to hold returned location items.
            var items = new Array();

            // Parse the search results.
            if (searchResults.locations != undefined) //  ArcGIS rest api.
            {
                var locations = searchResults.locations;
                for (var i = 0; i < locations.length; i++)
                {   
                    var location = locations[i];

                    // Create an item with name, geometry and bounds properties.
                    // The map will zoom to the bounds. If the bounds are undefined the map
                    // will be centred on the location.
                    var item = {};
                    item.name = location.name;
                    item.location = location.feature.geometry; // {x:-10010459, y:3521002}
                    item.bounds = location.extent; // {xmin:-10032723, ymin:3495284, xmax:-10010459, ymax:3521002}
                    items[items.length] = item;
                }
            }

            callbackfunction.call(null, items);
        }
    });
}

/**
 * The text for the clear button.
 * 
 * @property clearButtonText
 * @type String
 */
ia.MapTools.prototype.clearButtonText;

/**
 *  The text for the filter button.
 * 
 * @property filterButtonText
 * @type String
 */ 
ia.MapTools.prototype.filterButtonText;

/** 
 * Render the toolbar.
 *
 * @method render
 */
ia.MapTools.prototype.render = function() 
{
    this.container.empty();
    
    var me = this;

    var overToolbar = false;
    this._map.container.mouseenter(function(e) 
    {
        if (!overToolbar)
        {
            me.container.stop();
            me.container.css({visibility: "visible"}).animate({opacity: 1.0});
        }
    });
    this._map.container.mouseleave(function(e) 
    {
        me.container.stop();
        me.container.animate({opacity: 0}, function() 
        {
            me.container.css({visibility: "hidden"});
        });
        overToolbar = false;
    });
    this.container.mouseenter(function(e) 
    {
        overToolbar = true;
        me.container.stop();
        me.container.animate({opacity: 1.0});
    });
    this.container.mouseleave(function(e) 
    {
        overToolbar = false;
        me.container.stop();
        me.container.animate({opacity: 1.0});
    });

    var toolbarTimeout;
    this.container.bind("touchstart", function(e) 
    {
        me.container.stop();
        me.container.css({visibility: "visible"}).animate({opacity: 1.0});
        
        clearTimeout(toolbarTimeout);
        toolbarTimeout = setTimeout(function()
        {
            clearTimeout(toolbarTimeout);
            me.container.stop();

            if (!me._searching)
            {
                me.container.animate({opacity: 0}, function() 
                {
                    me.container.css({visibility: "hidden"});
                });
            }
        }, 5000);
    });
    this._map.container.bind("touchstart", function(e) 
    {
        me._searching = false;

        me.container.stop();
        me.container.css({visibility: "visible"}).animate({opacity: 1.0});
        
        clearTimeout(toolbarTimeout);
        toolbarTimeout = setTimeout(function()
        {
            clearTimeout(toolbarTimeout);
            me.container.stop();

            if (!me._searching)
            {
                me.container.animate({opacity: 0}, function() 
                {
                    me.container.css({visibility: "hidden"});
                });
            }
        }, 5000);
    });
        

    // Add zoom full button 
    var zoomFull = $j('<div class="ia-toolbar-btn ia-list-item ia-zoomfull-btn"></div>');
    this.container.append(zoomFull);
    zoomFull.bind("click", function(e)  
    {
        e.stopPropagation();
        e.preventDefault();
        me._map.controller.zoomFull();
    });
    
    // Add zoom out button 
    var zoomOut = $j('<div class="ia-toolbar-btn ia-list-item ia-zoomout-btn"></div>');
    this.container.append(zoomOut);
    zoomOut.bind("click", function(e)  
    {
        e.stopPropagation();
        e.preventDefault();
        if (me._useGoogleMaps)
            me._map.gMap.setZoom(me._map.gMap.getZoom()-1);
        else
            me._map.controller.zoomOut();
    });
    
    // Add zoom in button 
    var zoomIn = $j('<div class="ia-toolbar-btn ia-list-item ia-zoomin-btn"></div>');
    this.container.append(zoomIn);
    zoomIn.bind("click", function(e)  
    {
        e.stopPropagation();
        e.preventDefault();
        if (me._useGoogleMaps)
            me._map.gMap.setZoom(me._map.gMap.getZoom()+1);
        else
            me._map.controller.zoomIn();
    });

    // Add search button 
    var searchTool;
    if (this._includeSearchTool)
    {
        searchTool = $j('<div class="ia-toolbar-btn ia-list-item ia-search-btn"></div>');
        me.container.append(searchTool);
    }
    
    // Add clear selection button
    if (this.clearButtonText)
    {
        me._clearBtn = $j("<div class='ia-toolbar-text-btn ia-list-item ia-toolbar-text-btn-disabled ia-cross-btn-disabled'>").html(me.clearButtonText);
        me.container.append(me._clearBtn);
        me._clearBtn.bind("click", function(e)  
        {
            e.stopPropagation();
            e.preventDefault();
            me.clearFunction();
        });
    }
    
    // Add filter button 
    if (this.filterButtonText)
    {
        this._filterBtn = $j("<div class='ia-toolbar-text-btn ia-list-item ia-toolbar-text-btn-disabled ia-cross-btn-disabled'>").html(this.filterButtonText);
        this.container.append(this._filterBtn);
        this._filterBtn.bind("click", function(e)  
        {
            e.stopPropagation();
            e.preventDefault();
            me.filterFunction();
        });
    }

    if (this._includeSearchTool)
    {
        if (this._useGoogleMaps)
        {
            var uiWidget = $j("<div id='ia-search-holder-"+this._map.id+"' class='ui-widget'>");
            var searchWidget = $j("<input id='ia-search-"+this._map.id+"' class='ia-search-input'>");
            uiWidget.append(searchWidget);
            this.container.append(uiWidget);
            uiWidget.hide();

            // Add search click 
            var firstUse = true;
            var geocoder = new google.maps.Geocoder();
            var marker;

            searchTool.bind("click", function(e)  
            {
                me._searching = true;

                e.stopPropagation();
                e.preventDefault();
                uiWidget.toggle();

                if (firstUse)
                {
                    firstUse = false;
                    searchWidget.autocomplete(
                    {
                        source: function(request, response) 
                        {
                            var address = request.term;
                            geocoder.geocode(
                            {
                                'address': address,
                                'bounds':  me._map.defaultBounds
                            }, 
                            function(results, status) 
                            {
                                if (status == google.maps.GeocoderStatus.OK) 
                                {
                                    // The bounding box filter only biases the results
                                    // it could include results outside the bbox 
                                    // so check if the bounding box of each item intercepts the default bbox.
                                    var filteredResults = []
                                    for (var id in results)
                                    {
                                        var item = results[id];
                                        if (item.geometry.bounds)
                                        {
                                            if (me._map.defaultBounds.intersects(item.geometry.bounds)) 
                                                filteredResults[filteredResults.length] = results[id];
                                        }
                                    }

                                    response( $j.map( filteredResults, function( item ) {
                                    return {
                                                    label: item.formatted_address,
                                                    value: item.formatted_address,
                                                    location: item.geometry.location,
                                                    bounds: item.geometry.bounds
                                    }
                                    }));
                                } 
                            });
                        },
                        minLength: 2,
                        select: function( event, ui ) 
                        {
                            me._map.gMap.fitBounds(ui.item.bounds);
                            if (marker) marker.setMap(null);
                            marker = new google.maps.Marker(
                            {
                                map: me._map.gMap,
                                position: ui.item.location
                            });

                            uiWidget.toggle();


                        },
                        open: function() 
                        {
                            //$(this).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                        },
                        close: function() 
                        {
                            //$(this).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                        },
                        appendTo: "#ia-search-holder-"+me._map.id+""
                    });
                }

                searchWidget.focus();
                searchWidget.val([])
                searchWidget.autocomplete("close");
            });
        }
        else
        {
            var uiWidget = $j("<div id='ia-search-holder-"+this._map.id+"' class='ui-widget'>");
            var searchWidget = $j("<input id='ia-search-"+this._map.id+"' class='ia-search-input'>");
            uiWidget.append(searchWidget);
            this.container.append(uiWidget);
            uiWidget.hide();

            // Add search click 
            var firstUse = true;
            var marker;

            searchTool.bind("click", function(e)  
            {
                me._searching = true;

                // Clear markers.
                me._map.markerLayer.clearMarkers();

                e.stopPropagation();
                e.preventDefault();
                uiWidget.toggle();

                if (firstUse)
                {
                    firstUse = false;
                    searchWidget.autocomplete(
                    {
                        source: function( request, response ) 
                        {
                            me.searchFunction(request.term, function(results)
                            {
                                response($j.map(results, function( item ) {
                                return {
                                                label: item.name,
                                                value: item.name,
                                                location: item.location,
                                                bounds: item.bounds
                                }
                                }));
                            });
                        },
                        minLength: 2,
                        select: function( event, ui ) 
                        {
                            var bb = ui.item.bounds;
                            var location = ui.item.location;

                            if (bb != undefined) 
                            {
                                var bb = new ia.BoundingBox(bb.xmin,bb.ymin,bb.xmax,bb.ymax);

                                // Adjust for max zoom to force it to still zoom to feature
                                // even if the poly is less than the maximum allowable zoom.
                                if (me._map.maxZoom != -1)
                                {
                                    var maxZoom = Math.min(bb.getWidth(), bb.getHeight());
                                    if (maxZoom < me._map.maxZoom) 
                                    {
                                        cx = bb.getXCenter();
                                        cy = bb.getYCenter();
                                        bb.setWidth(me._map.maxZoom);
                                        bb.setHeight(me._map.maxZoom);
                                        bb.setXCenter(cx);
                                        bb.setYCenter(cy);
                                    }
                                }
                                me._map.controller.zoomToBBox(bb);
                            }
                            else if (location != undefined) me._map.controller.centerOnCoords(location.x, location.y);

                            // Draw a marker.
                            if (location != undefined)
                            {
                                me._map.markerLayer.clearMarkers();
                                me._map.markerLayer.addMarker(me._marker, location.x, location.y);
                                me._map.markerLayer.render();
                            }

                            uiWidget.toggle();

                            me.container.animate({opacity: 0}, function() 
                            {
                                me.container.css({visibility: "hidden"});
                            });
                        },
                        open: function() 
                        {
                            //$(this).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                        },
                        close: function() 
                        {
                            //$(this).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                        },
                        appendTo: "#ia-search-holder-"+me._map.id+""
                    });
                }

                searchWidget.focus();
                searchWidget.val([])
                searchWidget.autocomplete("close");
            });
        }
    }

    this._updateToolbar();
}