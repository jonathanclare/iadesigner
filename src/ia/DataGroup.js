/** 
 * Responsible for holding information abut the data for a group of components.
 *
 * @author J Clare
 * @class ia.DataGroup
 * @extends ia.EventDispatcher
 * @constructor
 * @param {ia.Report} report The report object.
 * @param {Number} suffix The component suffix.
 */
ia.DataGroup = function(report, suffix)
{   
    ia.DataGroup.baseConstructor.call(this);

    //--------------------------------------------------------------------------
    //
    // Variables
    //
    //--------------------------------------------------------------------------
    
    var me = this;

    var dataChanged = true;
    var geogChanged = false;
    var themeChanged = false;
    var indicatorChanged = false;
    var filterChanged = false;
    var thematicChanged = false;
    var calc = new ia.BreaksCalculator();

    var callbackFunction;
    var setDataCallbackFunction;

    // To hold the id, name, value and features of any applied filter.
    var filter = {id:"",name:"",value:"", features:[]};

    // Holds multiple filters.
    var arrFilters = [];

    //--------------------------------------------------------------------------
    //
    // Properties
    //
    //--------------------------------------------------------------------------
    
    /** 
     * The suffix for the data group.
     * 
     * @property suffix
     * @type String
     */
    this.suffix = suffix || "";

    /** 
     * The map data.
     * 
     * @property mapData
     * @type ia.MapData
     */
    this.mapData;
    
    /** 
     * The selected geography.
     * 
     * @property geography
     * @type ia.Geography
     */
    this.geography;
    
    /** 
     * The selected theme.
     * 
     * @property theme
     * @type ia.Theme
     */
    this.theme;
    
    /** 
     * The selected indicator.
     * 
     * @property indicator
     * @type ia.Indicator
     */
    this.indicator;

    /** 
     * The indicator data.
     * 
     * @property indicatorData
     * @type Object
     */
    this.indicatorData;
    
    /** 
     * The comparison data.
     * 
     * @property comparisonData
     * @type Object
     */
    this.comparisonData;
    
    /** 
     * The theme data.
     * 
     * @property themeData
     * @type Object
     */
    this.themeData;

    /** 
     * The comparison theme data.
     * 
     * @property comparisonThemeData
     * @type Object
     */
    this.comparisonThemeData;
    
    /** 
     * The thematic.
     * 
     * @property me.thematic
     * @type ia.Thematic
     */
    this.thematic;
    
    /** 
     * The comparison thematic.
     * 
     * @property comparisonThematic
     * @type ia.Thematic
     */
    this.comparisonThematic;
    
    /** 
     * holder for the legend settings.
     * 
     * @property legendSettings
     * @type Object
     */
    this.legendSettings = {};

    //--------------------------------------------------------------------------
    //
    // Methods
    //
    //--------------------------------------------------------------------------

    /** 
     * Loads a new indicator.
     *
     * @method setData
     * @param {String} geogId The geog id.
     * @param {String} indicatorId The indicator id.
     * @param {String} date The date.
     * @param {Function} callbackFnc Called on completion of function.
     */
    this.setData = function(geogId, indicatorId, date, callbackFnc) 
    {       
        if (callbackFnc != undefined) setDataCallbackFunction = callbackFnc; 

        // Check the indicator exists.
        var geog = report.data.getGeography(geogId);
        var ind  = geog.getIndicator(indicatorId, date);
        
        // If it doesnt just use first indicator.
        if (ind == undefined) 
        {
            var reverseDates = true;
            ind = geog.getFirstIndicator(reverseDates);
        }
        
        updateData(geogId, ind.id, ind.date);
    };

    /** 
     * Sets a new filter.
     *
     * @method setFilter
     * @param {String} filterId The filter id.
     * @param {String} filterValue The filter value.
     */
    this.setFilter = function(filterId, filterValue) 
    {
        filterChanged = true;

        filter.id = filterId;
        filter.name = me.geography.getFilter(filterId).name;
        filter.value = filterValue;
        filter.features = me.geography.getFilteredFeatures(filter.id, filter.value);
        arrFilters = [];

        report.textSubstitution.setVariable("filterName"+suffix, filter.name);
        report.textSubstitution.setVariable("filterValue"+suffix, filter.value);

        onDataChanged();
        me.thematic.commitChanges();
    };

    /** 
     * Appends a new filter.
     *
     * @method setFilter
     * @param {String} filterId The filter id.
     * @param {String} filterValue The filter value.
     */
    this.appendFilter = function(filterId, filterValue) 
    {
        // Add to multi filters array.
        var f = {}
        f.id = filterId;
        f.name = me.geography.getFilter(filterId).name;
        f.value = filterValue;
        f.features = me.geography.getFilteredFeatures(filterId, filterValue);
        arrFilters.push(f);

        applyFilters();
    };

    /** 
     * Removes a filter.
     *
     * @method setFilter
     * @param {String} filterId The filter id.
     * @param {String} filterValue The filter value.
     */
    this.removeFilter = function(filterId, filterValue) 
    {
        // Remove from multi filters array.
        arrFilters = arrFilters.filter(function (el) 
        {
            if (el.id == filterId && el.value == filterValue) return false;
            else return true;
        });

        applyFilters();
    };

    function applyFilters()
    {
        filterChanged = true;

        // Check if filters have been applied from more than one filter group.
        var arrIds = [];
        for (var i = 0; i < arrFilters.length; i++) 
        {   
            var f = arrFilters[i];
            arrIds.push(f.id);
        }
        // Remove duplicates.
        arrIds = arrIds.filter(function (itm,i,a) {return i == a.indexOf(itm);});

        var noOfFilterGroups = arrIds.length;
        filter.features = [];
        if (noOfFilterGroups > 1)
        {
            // Merge features that are in the same group.
            var objFeaturesByGroup = {};
            for (var i = 0; i < arrFilters.length; i++) 
            {   
                var f = arrFilters[i];
                if (objFeaturesByGroup[f.id] == undefined)  objFeaturesByGroup[f.id] = f.features;
                else                                        objFeaturesByGroup[f.id] = objFeaturesByGroup[f.id].concat(f.features);
            }   

            // Get features from group 1.
            var count = 0;
            for (var id1 in objFeaturesByGroup)
            {
                var arr1 = objFeaturesByGroup[id1];

                for (var i = 0; i < arr1.length; i++) 
                {
                    count = 0;
                    var featureId = arr1[i] 
                    for (var id2 in objFeaturesByGroup)
                    {
                        var arr2 = objFeaturesByGroup[id2];
                        if (arr2.indexOf(featureId) > 0) count++;
                    }
                    if (count == noOfFilterGroups) filter.features.push(featureId);

                }
                break;
            }


            // Filters applied from multiple filter groups.
            // "OR" rule used within filter groups, "AND" rule used across filter groups.
            /*for (var i = 0; i < arrFilters.length; i++) 
            {   
                var f1 = arrFilters[i];
                for (var j = 0; j < f1.features.length; j++) 
                {
                    var value1 = f1.features[j];
                    for (var k = 0; k < arrFilters.length; k++) 
                    {   
                        var f2 = arrFilters[k];
                        if (f1.id != f2.id)
                        {
                            for (var m = 0; m < f2.features.length; m++) 
                            {   
                                var value2 = f2.features[m];
                                if (value1 == value2) filter.features.push(value1);
                            }
                        }
                    }
                }
            }*/
        }
        else
        { 
            // Filter applied from single filter group.
            for (var i = 0; i < arrFilters.length; i++) 
            {   
                var f = arrFilters[i];
                filter.features = filter.features.concat(f.features);
            }
        }

        // Remove duplicates.
        filter.features = filter.features.filter(function (itm,i,a) {return i == a.indexOf(itm);});

        // Filter applied but no features satisfy query.
        // Put in a fake feature so that the filter isnt cleared (this is a hack but simplest solution to stop it breaking).
        if (filter.features.length == 0 && arrIds.length > 0) filter.features.push("~~~");

        // Extract a commma separated list of values for filterValues sub var.
        var values = arrFilters.map(function(a) {return a.value;});
        report.textSubstitution.setVariable("filterValues"+suffix, values.join(', '));

        onDataChanged();
        me.thematic.commitChanges();
    };

    /** 
     * Filters the data group on a list of feature ids.
     *
     * @method setFeatureFilter
     * @param {String[]} featureList a list of feature ids.
     */
    this.setFilteredFeatures = function(featureList) 
    {
        filterChanged = true;

        filter.id = "";
        filter.name = "";
        filter.value = "";
        filter.features = featureList.concat();
        arrFilters = [];

        report.textSubstitution.setVariable("filterName"+suffix, "");
        report.textSubstitution.setVariable("filterValue"+suffix, "");
        report.textSubstitution.setVariable("filterValues"+suffix, "");

        onDataChanged();
        me.thematic.commitChanges();
    };

    /** 
     * Gets the list of filtered features.
     *
     * @method getFilterFeatures
     * @return {String[]} A list of feature ids.
     */
    this.getFilteredFeatures = function() 
    {
        return filter.features;
    };

    /** 
     * Clears the filter.
     *
     * @method clearFilter
     */
    this.clearFilter = function() 
    {
        filterChanged = true;

        filter.id = "";
        filter.name = "";
        filter.value = "";
        filter.features = [];
        arrFilters = [];

        report.textSubstitution.setVariable("filterName"+suffix, "");
        report.textSubstitution.setVariable("filterValue"+suffix, "");
        report.textSubstitution.setVariable("filterValues"+suffix, "");

        onDataChanged();
        me.thematic.commitChanges();
    };

    /** 
     * Call this to update the DataGroup when the data.js has been changed.
     *
     * @method update
     * @param {Function} callbackFnc Called on completion of function.
     */
    this.update = function(callbackFnc) 
    {
        callbackFunction = callbackFnc; 
        initData();
    };

    /** 
     * Builds the datagroup.
     *
     * @method build
     * @param {Function} callbackFnc Gets called when the DataGroup is complete.
     */
    var t = null;
    this.build = function(callbackFnc) 
    {
        callbackFunction = callbackFnc; 

        // Update text here to stop resizing of panels on startup.
        report.textSubstitution.setVariable("geogName"+suffix, " ");
        report.textSubstitution.setVariable("themeName"+suffix, " ");
        report.textSubstitution.setVariable("indicatorName"+suffix, " ");
        report.textSubstitution.setVariable("date"+suffix, " ");
        report.textSubstitution.setVariable("filterName"+suffix, "");
        report.textSubstitution.setVariable("filterValue"+suffix, "");
        report.textSubstitution.setVariable("filterValues"+suffix, "");
        report.textSubstitution.setVariable("legendType"+suffix, "");
        report.updateDynamicText(report.textSubstitution);

        // Thematics
        me.thematic = new ia.Thematic();
        me.thematic.noDataValue = report.locale.formatter.noDataValue;
        me.thematic.setDataField(report.config.getProperty("data"+suffix));
        me.thematic.addEventListener(ia.Event.THEME_CHANGED, function() 
        {
            // Legend type.
            if (me.indicator.type == ia.Thematic.CATEGORIC)
            {
                report.textSubstitution.setVariable("legendType"+suffix, "");
            }
            else
            {
                var legendType = report.config.getProperty(me.legendSettings.legendType)
                report.textSubstitution.setVariable("legendType"+suffix, legendType);
            }
            report.updateDynamicText(report.textSubstitution);

            // Add this timeout because thematic.commitchanges was being called
            // from db builder whilst datagroup.js was still processing.
            // Originally the timeout was placed in Thematic.js  commitChanges()
            // but that broke the bubble plot because the synbolSize wasnt set by
            // the time the chart was rendered.
            //clearTimeout(t);
            //t = setTimeout(function ()
            //{     
                if (!dataChanged)
                {
                    me.comparisonThematic.commitChanges();
                    thematicChanged = true;

                    // Update the statictics substitution variables.
                    updateStats();

                    report.blockInteraction('onThemeChangeProgress', false, function() 
                    { 
                        render();
                    });   
                }
            //}, 250);
        });

        // Categoric classifier.
        var paletteConfig = report.config.getMapPalette();
        var cClassifier = me.thematic.categoricClassifier;
        cClassifier.formatter = report.locale.formatter;
        cClassifier.colorPalette = paletteConfig.getColorScheme(paletteConfig.defaultSchemeId);

        me.legendSettings.schemeId = paletteConfig.defaultSchemeId;

        // Numeric classifier.
        if (suffix != "") me.legendSettings.paletteId = report.config.getProperty("mapPalette"+suffix) || paletteConfig.defaultPaletteId;
        else me.legendSettings.paletteId = paletteConfig.defaultPaletteId;
        me.legendSettings.legendType = report.config.getProperty("legendClassifier"+suffix) || "quantile";
        
        var nClassifier = me.thematic.numericClassifier;
        nClassifier.noClasses = paletteConfig.noClasses;
        nClassifier.formatter = report.locale.formatter;
        nClassifier.classificationName = me.legendSettings.legendType;
        nClassifier.colorPalette = paletteConfig.getColorPalette(me.legendSettings.paletteId);
        nClassifier.sdLabels = [report.config.getProperty("sd1"),
                    report.config.getProperty("sd2"),
                    report.config.getProperty("sd3"),
                    report.config.getProperty("sd4"),
                    report.config.getProperty("sd5"),
                    report.config.getProperty("sd6")];
        if (report.config.getProperty("sdSize")) nClassifier.getCalculator().sdSize = report.config.getProperty("sdSize");
        if (report.config.getProperty("useOldClassificationMethod") != undefined) nClassifier.useEsriClassificationMethod = !report.config.getProperty("useOldClassificationMethod");
        var legendPrecision = report.config.getProperty("legendPrecision")
        if (legendPrecision != undefined && legendPrecision > -1) nClassifier.precision = legendPrecision;

        // Comparison thematics.
        me.comparisonThematic = new ia.Thematic();
        me.comparisonThematic.setDataType(ia.Thematic.CATEGORIC);
        me.comparisonThematic.setDataField("id");

        // Initialise data.
        initData();
    };

    /** 
     * Initialises the data for first use.
     *
     * @method initData
     * @private
     */
    function initData()
    {
        dataChanged = true;

        // Use the index number to select a geography.
        var geog;
        var geogs = report.data.getGeographies();

        if (report.config.template == ia.DOUBLE_PLOT_REPORT) // Both maps for this template should use param["geog"] if it is set.
        {
            if (report.url.params["geog"]) geog = geogs[report.url.params["geog"]];
            else geog = geogs[0];
            me.mapData.baseLayer.setVisible(true); // Fixes horrendous bug where first layer set to invisible and second layer set as layer to be displayed in double plot.
        }
        else
        {
            if (report.url.params["geog"+suffix]) geog = geogs[report.url.params["geog"+suffix]];
            if (geog == undefined) 
            {
                if ((report.config.template == ia.DOUBLE_GEOG_REPORT
                || report.config.template == ia.DOUBLE_BASELAYER_REPORT
                || report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW) && (suffix != ""))
                {
                    if (geogs.length >= suffix) geog = geogs[suffix-1];
                    else geog = geogs[0];
                }
                else geog = geogs[0];
            }
        }

        var geographyButton = report.getButton("geographyButton"+suffix)
        if (geographyButton)
        {
            if (geogs.length > 1) geographyButton.show();
            else geographyButton.hide();
        }

        var reverseDates = true;
        var c = report.config.getComponent("dataExplorer"+suffix);
        if (c)
        {
            reverseDates = c.getProperty("reverseDates");
            if (reverseDates == undefined) reverseDates = true;
        }

        var ind;
        if (report.url.params["indicator"+suffix]) 
        {
            if (report.url.params["date"+suffix]) ind = geog.getIndicator(report.url.params["indicator"+suffix], report.url.params["date"+suffix]);
            else ind = geog.getIndicator(report.url.params["indicator"+suffix], undefined, reverseDates);
        }
        if (ind == undefined) 
        {
            var ind = geog.getFirstIndicator(reverseDates);
            if (report.url.params["date"+suffix]) ind = geog.getIndicator(ind.id, report.url.params["date"+suffix]);
        }

        updateData(geog.id, ind.id, ind.date);
    };

    /** 
     * Loads a new indicator.
     *
     * @method updateData
     * @param {String} geogId The geog id.
     * @param {String} indicatorId The indicator id.
     * @param {String} date The date.
     * @private
     */
    function updateData(geogId, indicatorId, date)
    {
        report.blockInteraction('onDataChangeProgress', true, function() 
        {
            var geog = report.data.getGeography(geogId);

            geog.loadIndicator(indicatorId, date, function(indicator)
            {
                // Check if geography changed.
                if (dataChanged || (indicator.geography.id != me.indicator.geography.id)) 
                {
                    onGeographyChanged(geog, function()
                    {
                        // Check if all data need to be loaded.
                        if (report.url.params["loadAllData"])
                        {
                            geog.loadData(function(g)
                            {
                                onIndicatorChanged(indicator);
                            });
                        }
                        else onIndicatorChanged(indicator);
                    });
                }
                else onIndicatorChanged(indicator);
            });
        });
    };
    
    /** 
     * Called after an indicator has changed.
     *
     * @method onIndicatorChanged
     * @param {ia.Indicator} indicator The indicator.
     * @private
     */
    function onIndicatorChanged(indicator)
    {
        indicatorChanged = true;

        me.indicator = indicator;
        if (dataChanged || (me.theme.id != indicator.theme.id)) themeChanged = true;
        me.theme = indicator.theme;
        me.geography = indicator.geography;

        onDataChanged();

        // Only set custom properties when a new indicator is loaded.
        checkForCustomThemeProperties(me.thematic, me.indicator);

        // Commit theme changes - this will also force a render();
        dataChanged = false;
        me.thematic.commitChanges();
    };

    /** 
     * Called after a geography has changed.
     *
     * @method onGeographyChanged
     * @param {ia.Geography} indicator The indicator.
     * @param {Function} callbackFnc Called on completion of function.
     * @private
     */
    function onGeographyChanged(geog, callbackFnc)
    {
        geogChanged = true;
    
        if (dataChanged)
        {
            if (report.url.params["filteredFeatures"+suffix])
            {
                filter.features = report.url.params["filteredFeatures"+suffix].split(","); 
                filterChanged = true;
            }
            else if (report.url.params["filter"+suffix]) // filter=filter4,Crossroads
            {
                var arr = report.url.params["filter"+suffix].split(","); 
                var filterId = arr[0];
                var filterValue = arr[1];
                filterChanged = true;

                filter.id = filterId;
                filter.name = geog.getFilter(filterId).name;
                filter.value = filterValue;
                filter.features = geog.getFilteredFeatures(filter.id, filter.value);
                arrFilters = [];

                report.textSubstitution.setVariable("filterName"+suffix, filter.name);
                report.textSubstitution.setVariable("filterValue"+suffix, filter.value);
            }
        }
        else
        {
            // Clear the filter.
            filter.features = [];
            report.textSubstitution.setVariable("filterName"+suffix, "");
            report.textSubstitution.setVariable("filterValue"+suffix, "");
            report.textSubstitution.setVariable("filterValues"+suffix, "");
        }

        var filterBtn = report.getButton("filterButton"+suffix)
        if (filterBtn)
        {
            var filterList = geog.getFilters();
            if (filterList.length > 0) filterBtn.show()
            else filterBtn.hide();
        }

        if (me.mapData)
        {
            // This was part of a fix in case people make the base layer invisible.
            var layerIsVisible = me.mapData.baseLayer.getVisible();

            // Set previous active layer visibility to false.
            me.mapData.baseLayer.setVisible(false);

            // Set new active base layer - use the index of the geog
            // to get the correct base layer.
            // Default to first base layer if it cant be found
            me.mapData.baseLayer = me.mapData.baseLayers[geog.index];
            if (me.mapData.baseLayer == undefined) me.mapData.baseLayer = me.mapData.baseLayers[0]; 

            function processLayer()
            {
                if (layerIsVisible) me.mapData.baseLayer.setVisible(true);

                // Added for heatmap functionality.
                me.mapData.baseLayer.thematic = me.thematic;

                // Set thematic and layer symbols according to layer geometry.
                var shp;
                var pal = me.thematic.numericClassifier.sizePalette;
                if (report.config.template == ia.BUBBLE_PLOT_REPORT && suffix == "2")
                {
                    var c = report.config.getComponent("scatterPlot");
                    if (c)
                    {
                        shp = "circle";
                        me.thematic.setDataField(c.getProperty("sizeData"));
                        me.legendSettings.legendType = "continuous";
                        pal.minSize = c.getProperty("minBubbleSize");
                        pal.maxSize = c.getProperty("maxBubbleSize");
                        me.thematic.categoricClassifier.symbolSize = 8;
                    }
                }
                else if (me.mapData.baseLayer.geometry == "point") // Point layer.
                {
                    var shp = report.config.getProperty("symbolShape"+suffix);
                    if (shp == undefined) shp = report.config.getProperty("symbolShape"); // Fix for http://bugzilla.geowise.co.uk/show_bug.cgi?id=8703

                    pal.minSize = report.config.getProperty("minSymbolSize"+suffix); 
                    if (pal.minSize == undefined) pal.minSize = report.config.getProperty("minSymbolSize"); 

                    pal.maxSize = report.config.getProperty("maxSymbolSize"+suffix); 
                    if (pal.maxSize == undefined) pal.maxSize = report.config.getProperty("maxSymbolSize"); 

                    me.thematic.categoricClassifier.symbolSize = me.mapData.baseLayer.symbolSize;
                }
                else if (me.mapData.baseLayer.geometry == "line") // Line layer.
                {
                    shp = ia.Shape.LINE;

                    pal.minSize = report.config.getProperty("minLineSize"+suffix); 
                    if (pal.minSize == undefined) pal.minSize = report.config.getProperty("minLineSize"); 

                    pal.maxSize = report.config.getProperty("minLineSize"+suffix); 
                    if (pal.maxSize == undefined) pal.maxSize = report.config.getProperty("minLineSize"); 

                    me.thematic.categoricClassifier.symbolSize = me.mapData.baseLayer.style.lineWidth;
                }
                else // Polygon layer.
                {
                    shp = ia.Shape.SQUARE;

                    // Use base layer symbol size when its a polygon layer.
                    pal.minSize = me.mapData.baseLayer.symbolSize;
                    pal.maxSize = me.mapData.baseLayer.symbolSize;
                    me.thematic.categoricClassifier.symbolSize = me.mapData.baseLayer.symbolSize;
                }
                me.mapData.baseLayer.symbol = shp;
                me.thematic.symbol = shp;

                callbackFnc.call(null); // return.
            }

            if (!me.mapData.baseLayer.isLoaded) 
            {
                me.mapData.baseLayer.addEventListener(ia.Event.LAYER_READY, function ()
                {
                     processLayer();
                });
                me.mapData.baseLayer.loadSource();
            }
            else processLayer();
        }
        else callbackFnc.call(null); // return.
    };

    /** 
     * Called after the data have changed - this can be if a new indicator
     * has been selected or if a filter has been applied.
     *
     * @method onDataChanged
     * @private
     */
    function onDataChanged()
    {
        // Update the indicator data object used by the report components.
        if (filter.features.length > 0) 
        {
            me.indicatorData = me.indicator.getData(filter.features);
            me.themeData = me.theme.getData(me.indicator.id, filter.features);
        }
        else 
        {
            me.indicatorData = me.indicator.getData();
            me.themeData = me.theme.getData(me.indicator.id);
        }

        // Update the comparison data object used by the report components.
        me.comparisonData = me.indicator.getComparisonData();
        me.comparisonThemeData = me.theme.getComparisonData(me.indicator.id);
        me.comparisonThematic.setData(me.comparisonData);

        // Thematic.
        var dataType = me.indicator.getDataType(me.thematic.getDataField());
        me.thematic.setDataType(dataType);
        me.thematic.setData(me.indicatorData);
        
        // Substitution.
        report.textSubstitution.setVariable("geogName"+suffix, me.geography.name);
        report.textSubstitution.setVariable("themeName"+suffix, me.theme.getParentThemes());
        report.textSubstitution.setVariable("indicatorName"+suffix, me.indicator.name);
        report.textSubstitution.setVariable("date"+suffix, me.indicator.date);

        // Properties.
        var props = me.indicator.getProperties();
        for (var propName in props) {report.textSubstitution.setVariable(propName+""+suffix, props[propName]);}

        report.updateDynamicText(report.textSubstitution);
    };

    /** 
     * Responsible for rendering all the components.
     *
     * @method render
     * @private
     */
    function render()
    { 
        // Events.
        if (geogChanged) 
            me.dispatchEvent(new ia.DataEvent(ia.DataEvent.GEOG_CHANGED, me, me.geography, me.theme, me.indicator));
        if (filterChanged) 
        {
            // Update report url filter params.
            if (filter.features.length > 0) report.url.params["filteredFeatures"+suffix] = filter.features.join(",");
            else report.url.params["filteredFeatures"+suffix] = "";

            me.dispatchEvent(new ia.FilterEvent(ia.FilterEvent.FILTER_CHANGED, me, filter.id, filter.name, filter.value, filter.features));
        }
        if (themeChanged)  
            me.dispatchEvent(new ia.DataEvent(ia.DataEvent.THEME_CHANGED, me, me.geography, me.theme, me.indicator));
        if (indicatorChanged) 
        {
            // Update report url data params.
            report.url.params["geog"+suffix] = me.geography.index;
            report.url.params["indicator"+suffix] = me.indicator.id;
            if (me.indicator.date) report.url.params["date"+suffix] = me.indicator.date;
            else report.url.params["date"+suffix] = ""; 

            me.dispatchEvent(new ia.DataEvent(ia.DataEvent.INDICATOR_CHANGED, me, me.geography, me.theme, me.indicator));
        }
        if (indicatorChanged || filterChanged) 
            me.dispatchEvent(new ia.DataEvent(ia.DataEvent.DATA_CHANGED, me, me.geography, me.theme, me.indicator));
        if (thematicChanged) 
        {
            updateThematicParams();
            me.dispatchEvent(new ia.Event(ia.Event.THEMATIC_CHANGED, me));
        }

        report.allowInteraction('onThemeChangeProgress');
        report.allowInteraction('onDataChangeProgress');

        if (callbackFunction != undefined)  
        {
            callbackFunction.call(null);
            callbackFunction = undefined;
        }

        if (setDataCallbackFunction) setDataCallbackFunction.call(null);

        geogChanged = false;
        filterChanged = false;
        indicatorChanged = false;
        themeChanged = false;
        thematicChanged = false;
    };

    /** 
     * Checks if the loaded indicator has custom legend properties.
     *
     * @method checkForCustomThemeProperties
     * @param {ia.Thematic} thematic The thematic.
     * @param {ia.Indicator} indicator The indicator.
     * @private
     */
    function checkForCustomThemeProperties(thematic, indicator)
    {
        var paletteConfig = report.config.getMapPalette();

        var customClassifier = indicator.getProperty(report.config.getProperty("customClassifierKey"+suffix));
        var customColours = indicator.getProperty(report.config.getProperty("customColoursKey"+suffix));
        var customPalette = indicator.getProperty(report.config.getProperty("customPaletteKey"+suffix));
        var customBreaks = indicator.getProperty(report.config.getProperty("customBreaksKey"+suffix));
        var customLabels = indicator.getProperty(report.config.getProperty("customLabelsKey"+suffix));


        /*
        Use an associate to set the color of the legend.

        I’m assuming that the indicator will always be numeric and the associate will always be categoric otherwise it gets very messy.

        Use  indicator properties to initiate the process.

        Provide an associate name for the indicator property using:

        customAssociateForColourLegend : myAssociateName

        If this is set you can use the following standard indicator properties to change the legend for the associate bit:

        customBreaksForColourLegend
        customLabelsForColourLegend
        customPaletteForColourLegend
        customColoursForColourLegend

        I’d also suggest that the legend should be set to continuous because it’s a much nicer visual.

        customClassifierKey : continuous

        You could also add the associate value to the tooltip – but I’ve left all this configurable
        */
        var customAssociateForColourLegend = indicator.getProperty("customAssociateForColourLegend");
        me.thematic.colorField = undefined;

        // Added these for ECDC.
        var customNoClasses = indicator.getProperty("customNoClasses");

        // Default settings for categoric.
        var cClassifier = me.thematic.categoricClassifier;
        cClassifier.breaks = [];
        cClassifier.labels = [];
        cClassifier.colorPalette = paletteConfig.getColorScheme(me.legendSettings.schemeId);

        // Default settings for numeric.
        var nClassifier = me.thematic.numericClassifier;
        nClassifier.labels = [];
        nClassifier.classificationName = me.legendSettings.legendType;
        var calc = nClassifier.getCalculator();
        calc.addFunction(ia.Thematic.CONTINUOUS, ia.Thematic.CONTINUOUS);

        // Legend based on all indicators in times series.
        if (customBreaks == undefined)
        {
            var buildLegendUsingTimeSeries = report.config.getProperty("buildLegendUsingTimeSeries"+suffix)
            if (indicator.type == ia.Thematic.NUMERIC && buildLegendUsingTimeSeries == true)
            {
                var arrIndicators = indicator.theme.getIndicators(indicator.id);
                var arrData = [];
                for (var i = 0; i < arrIndicators.length; i++) 
                {   
                    arrData = arrData.concat(arrIndicators[i].getValues());
                }
                calc.setData(arrData);
                var brks = calc.getBreaks(nClassifier.noClasses, nClassifier.classificationName)
                customBreaks = brks.join(';');
                indicator.setProperty(report.config.getProperty("customBreaksKey"+suffix), customBreaks);
            }
        }

        // Added for heatmap functionality.
        me.thematic.heatmap = false;
        me.thematic.heatmapradius = undefined;
        if (me.mapData.baseLayer.geometry == "point") 
        {
            if (indicator.getProperty("heatmap") 
                && (indicator.getProperty("heatmap") == 'true' 
                || indicator.getProperty("heatmap") == 'True'
                || indicator.getProperty("heatmap") == 'TRUE'
                || indicator.getProperty("heatmap") == true
                || indicator.getProperty("heatmap") == 'heatmap'))
            {
                nClassifier.classificationName = "continuous";
                me.thematic.heatmap = true;

                if (indicator.getProperty("heatmapradius")) me.thematic.heatmapradius = indicator.getProperty("heatmapradius");
            }
        }

        // Overrides config - included for dashboard builder where webmap controls theme
        if (me.mapData.baseLayer.themeColors != undefined)
            nClassifier.colorPalette = new ia.ColorPalette(me.mapData.baseLayer.themeColors);
        else 
            nClassifier.colorPalette = paletteConfig.getColorPalette(me.legendSettings.paletteId);

        if (me.thematic.getDataType() == ia.Thematic.CATEGORIC)
        {
            report.textSubstitution.setVariable("legendType"+suffix, "");
            report.updateDynamicText(report.textSubstitution);

            if (customBreaks) cClassifier.breaks = customBreaks.split(";");
            if (customLabels) cClassifier.labels = customLabels.split(";");
            if (customPalette) 
            {
                //cClassifier.colorPalette = paletteConfig.getColorScheme(customPalette);

                /*var colorList = paletteConfig.getColorScheme(customPalette).getColorList(colorList);
                cClassifier.colorPalette.setColorList(colorList);
                cClassifier.customColorsDefined = true;*/

                var colorList = paletteConfig.getColorScheme(customPalette).getColorList();
                var colorPalette = new ia.ColorPalette(colorList);
                for (var id in cClassifier.colorPalette.matchColorsToValues)
                {
                    colorPalette.matchColorsToValues[id] = cClassifier.colorPalette.matchColorsToValues[id];
                }
                cClassifier.colorPalette = colorPalette;
                cClassifier.customColorsDefined = true;
            }
            if (customColours)
            {
                //cClassifier.colorPalette = new ia.ColorPalette(colorList);

                /*var colorList = customColours.split(";");
                cClassifier.colorPalette.setColorList(colorList);
                cClassifier.customColorsDefined = true;*/

                var colorList = customColours.split(";");
                var colorPalette = new ia.ColorPalette(colorList);
                for (var id in cClassifier.colorPalette.matchColorsToValues)
                {
                    colorPalette.matchColorsToValues[id] = cClassifier.colorPalette.matchColorsToValues[id];
                }
                cClassifier.colorPalette = colorPalette;
                cClassifier.customColorsDefined = true;
            }
        }
        else
        {
            if (customClassifier) nClassifier.classificationName = customClassifier;

            var legendType = report.config.getProperty(nClassifier.classificationName);
            report.textSubstitution.setVariable("legendType"+suffix, legendType);
            report.updateDynamicText(report.textSubstitution);

            if (customBreaks)
            {
                var breaksList = customBreaks.split(";");
                if (breaksList.length > 1)
                {
                    // Combination of using a continuous legend and supplying the breaks for it as well.
                    // Was implemented as part of ECDC project.
                    // Changed by JC 22/05/2017 to allow custom breaks to work with continuous legend.
                    if (nClassifier.classificationName == 'continuous')
                    {
                        calc.addFunction("continuous", function (noClasses)
                        {
                            var arrValues = calc.getStats().unique;
                            var min = parseFloat(breaksList[0]);
                            var max = parseFloat(breaksList[breaksList.length-1]);
                            var arrBreaks = arrValues.filter(function (v)
                            {
                                return (v >= min) && (v <= max);
                            });
                            arrBreaks.unshift(min);
                            arrBreaks.push(max);
                            return arrBreaks;
                        });
                        nClassifier.classificationName = "continuous";
                    }
                    else
                    {
                        calc.addFunction("customClassifier", function (noClasses)
                        {
                            return breaksList;
                        });
                        nClassifier.classificationName = "customClassifier";
                    }
                }
            }

            if (customNoClasses) nClassifier.noClasses = customNoClasses;

            if (customLabels) nClassifier.labels  = customLabels.split(";");
            if (customPalette) nClassifier.colorPalette = paletteConfig.getColorPalette(customPalette);
            if (customColours)
            {
                var colorList = customColours.split(";");
                nClassifier.colorPalette = new ia.ColorPalette(colorList);
            }

            if (customAssociateForColourLegend)
            {
                me.thematic.colorField = customAssociateForColourLegend;

                var customBreaksForColourLegend = indicator.getProperty("customBreaksForColourLegend");
                var customLabelsForColourLegend = indicator.getProperty("customLabelsForColourLegend");
                var customPaletteForColourLegend = indicator.getProperty("customPaletteForColourLegend");
                var customColoursForColourLegend = indicator.getProperty("customColoursForColourLegend");

                // Apply custom properties to the categoric part of the legend.
                if (customBreaksForColourLegend) cClassifier.breaks = customBreaksForColourLegend.split(";");
                if (customLabelsForColourLegend) cClassifier.labels = customLabelsForColourLegend.split(";");
                if (customPaletteForColourLegend) 
                {
                    /*var colorList = paletteConfig.getColorScheme(customPaletteForColourLegend).getColorList(colorList);
                    cClassifier.colorPalette.setColorList(colorList);
                    cClassifier.customColorsDefined = true;*/

                    var colorList = paletteConfig.getColorScheme(customPaletteForColourLegend).getColorList();
                    var colorPalette = new ia.ColorPalette(colorList);
                    for (var id in cClassifier.colorPalette.matchColorsToValues)
                    {
                        colorPalette.matchColorsToValues[id] = cClassifier.colorPalette.matchColorsToValues[id];
                    }
                    cClassifier.colorPalette = colorPalette;
                    cClassifier.customColorsDefined = true;
                }
                if (customColoursForColourLegend)
                {
                    /*var colorList = customColoursForColourLegend.split(";");
                    cClassifier.colorPalette.setColorList(colorList);
                    cClassifier.customColorsDefined = true;*/

                    var colorList = customColoursForColourLegend.split(";");
                    var colorPalette = new ia.ColorPalette(colorList);
                    for (var id in cClassifier.colorPalette.matchColorsToValues)
                    {
                        colorPalette.matchColorsToValues[id] = cClassifier.colorPalette.matchColorsToValues[id];
                    }
                    cClassifier.colorPalette = colorPalette;
                    cClassifier.customColorsDefined = true;
                }
            }
        }
    };

    /** 
     * Updates the params for the thematics.
     *
     * @method updateThematicParams
     * @private
     */
    function updateThematicParams()
    {
        // Classification name
        report.url.params["prop_legendClassifier"+suffix] = me.thematic.numericClassifier.classificationName;

        // Map Palette settings
        if (suffix == "") 
        {
            report.url.params["pal_defaultPaletteId"] = me.legendSettings.paletteId;
            report.url.params["pal_defaultSchemeId"] = me.legendSettings.schemeId;
            report.url.params["pal_noClasses"] = me.thematic.numericClassifier.noClasses;
        }

        // Palett for second map.
        if (suffix == "2") report.url.params["prop_mapPalette2"] = me.legendSettings.paletteId;

        // Symbol sizes.
        var pal = me.thematic.numericClassifier.sizePalette;
        if (report.config.template == ia.BUBBLE_PLOT_REPORT && suffix == "2") // Bubble plot.
        {
            var c = report.config.getComponent("scatterPlot");
            if (c)
            {
                report.url.params["prop_minBubbleSize"+suffix] = pal.minSize;
                report.url.params["prop_maxBubbleSize"+suffix] = pal.maxSize;
            }
        }
        else if (me.mapData.baseLayer.geometry == "point") // Point layer.
        {
            report.url.params["prop_minSymbolSize"+suffix] = pal.minSize;
            report.url.params["prop_maxSymbolSize"+suffix] = pal.maxSize;
        }
        else if (me.mapData.baseLayer.geometry == "line") // Line layer.
        {
            report.url.params["prop_minLineSize"+suffix] = pal.minSize;
            report.url.params["prop_maxLineSize"+suffix] = pal.maxSize;
        }
    };

    /** 
     * Updates the statictics substitution variables.
     *
     * @method updateStats
     * @private
     */
    function updateStats()
    {
        // Stats Substitution.
        var dataType = me.indicator.getDataType(me.thematic.getDataField());
        if (dataType == ia.Thematic.CATEGORIC)
        {
            report.textSubstitution.setVariable("mean"+suffix, "");
            report.textSubstitution.setVariable("median"+suffix, "");
            report.textSubstitution.setVariable("sum"+suffix, "");
            report.textSubstitution.setVariable("minValue"+suffix, "");
            report.textSubstitution.setVariable("maxValue"+suffix, "");
            report.textSubstitution.setVariable("range"+suffix, "");
            report.textSubstitution.setVariable("lowerQuartile"+suffix, "");
            report.textSubstitution.setVariable("upperQuartile"+suffix, "");
            report.textSubstitution.setVariable("interquartileRange"+suffix, "");
            report.textSubstitution.setVariable("variance"+suffix, "");
            report.textSubstitution.setVariable("standardDeviation"+suffix, "");
        }
        else
        {
            var p = me.indicator.precision || 2;
            if (p == undefined) p = 2;
            var f = report.locale.formatter;
            var stats = me.thematic.numericClassifier.getCalculator().getStats();
            report.textSubstitution.setVariable("sum"+suffix, f.format(stats.sum, p));
            report.textSubstitution.setVariable("mean"+suffix, f.format(stats.mean, p));
            report.textSubstitution.setVariable("median"+suffix, f.format(stats.median, p));
            report.textSubstitution.setVariable("minValue"+suffix, f.format(stats.minValue, p));
            report.textSubstitution.setVariable("maxValue"+suffix, f.format(stats.maxValue, p));
            report.textSubstitution.setVariable("range"+suffix, f.format(stats.range, p));
            report.textSubstitution.setVariable("lowerQuartile"+suffix, f.format(stats.lowerQuartile, p));
            report.textSubstitution.setVariable("upperQuartile"+suffix, f.format(stats.upperQuartile, p));
            report.textSubstitution.setVariable("interquartileRange"+suffix, f.format(stats.interquartileRange, p));
            report.textSubstitution.setVariable("variance"+suffix, f.format(stats.variance, p));
            report.textSubstitution.setVariable("standardDeviation"+suffix, f.format(stats.standardDeviation, p));
        }
        report.updateDynamicText(report.textSubstitution);
    };
};
ia.extend(ia.EventDispatcher, ia.DataGroup);