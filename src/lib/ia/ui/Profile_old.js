/** 
 * A class for rendering a data table.
 * for rendering a data table.
 *
 * @author J Clare
 * @class ia.Profile
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the table.
 * @param {Boolean} useMouseClick  Indicates if an event should be fired when an indicator is clicked.
 * @param {Function} callbackFunction Called when a selection is made. 
 */
ia.Profile = function(id, useMouseClick, callbackFunction)
{       
    ia.Profile.baseConstructor.call(this);

    this.displayMode = "Selected date";
    this.displayDatesInProfile = false;
    this.includeMinMaxColumns = true;
    this.symbols = [];
    this.targets = [];
    this.breaks = [];
    
    this.id = id;
    this._useMouseClick = useMouseClick;
    this._data = undefined;
    this._isCollapsed = false;

    this._renderTimeout = null; 
    this._featureIds = [];  // A list of feature ids.
    this._collapseIds = []; // A list of collapsed ids.
    this._nonComparisonIds = []; // A list of non-comparison feature ids.

    // A div to contain the table and allow correct scrolling.
    this.container = $j("<div id='"+id+"' class='ia-table'>"); 
    this._containerId = id;

    // Tip.
    this._tip = new ia.ChartTip(this.container);
    
    this.$tableCorner = $j("<span class='ia-table-header-corner'>");
    this.container.append(this.$tableCorner);
            
    // The table used to render the headers.
    this.$tableHeaders = $j("<table>");
    this.container.append(this.$tableHeaders);
    
    // The table used to render the data.
    this.$tableContainer = $j("<div id='"+id+"-container' class='ia-table-scrollbox'>"); 
    this._scrollBox = new ia.ScrollBox(this.$tableContainer);
    this.container.append(this.$tableContainer);
    
    this.$table = $j("<table>");
    this.$tableContainer.append(this.$table);
    this._addMouseEvents();

    if (callbackFunction) this.callbackFunction = callbackFunction;
    
    var resizeTimeout;
    var me = this;
    this.container.resize(function(e) 
    {       
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function()
        {
            clearTimeout(resizeTimeout);
            me._size();

        }, 250);
    });
};
ia.extend(ia.EventDispatcher, ia.Profile);

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.Profile.prototype.id;

/** 
 * The callback function.  
 *
 * @property callbackFunction
 * @type Function
 */ 
ia.Profile.prototype.callbackFunction;

/**
 * Specifies a color palette for the bars.
 * 
 * @property colorPalette
 * @type ia.ColorPalette
 */
ia.Profile.prototype.colorPalette;


/**
 * Specifies a thematic for comparison data.
 * 
 * @property comparisonThematic
 * @type ia.Thematic
 */
ia.Profile.prototype.comparisonThematic;

/**
 * Specifies a geography.
 * 
 * @property geography
 * @type ia.Geography
 */
ia.Profile.prototype.geography;

/**
 * Specifies a selected indicator.
 * 
 * @property indicator
 * @type ia.Indicator
 */
ia.Profile.prototype.indicator;

/**
 * Display indicators for "Selected date","Most recent date", "All dates"?
 * 
 * @property displayMode
 * @type String
 * @default Selected date
 */
ia.Profile.prototype.displayMode;

/**
 * Include the minimum and maximum columns?
 * 
 * @property includeMinMaxColumns
 * @type Boolean
 * @default true
 */
ia.Profile.prototype.includeMinMaxColumns;

/**
 * Display the dates in the profile?
 * 
 * @property displayDatesInProfile
 * @type Boolean
 * @default false
 */
ia.Profile.prototype.displayDatesInProfile;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.Profile.prototype.container;

/**
 * The columns to be rendered. 
 *
 * The columns are an array with the following structure:
 * They dictate which columns should be used from the data.
 * The id points to the id in the data.
 *
 * [{id:"name", label:"Features", type:"categoric"},
 * {id:"value", label:"Indicator", type:"numeric"},
 * {id:"associate1", label:"Associate 1", type:"numeric'"},
 * {id:"associate2", label:"Associate 2", type:"categoric'"}]
 * 
 * @property columns
 * @type JSON
 */
ia.Profile.prototype.columns;

/**
 * A list of objects that describe symbols. 
 * [{shape:"arrow down", color:"#EC6768", size:"12", label:"Poor", value:"--"}]
 *
 * @property symbols
 * @type Object[]
 */
ia.Profile.prototype.symbols;

/**
 * A list of objects that describe targets. 
 * [{shape:"vertical line", color:"#EC6768", size:"12", label:"Poor", data:"target"}]
 *
 * @property targets
 * @type Object[]
 */
ia.Profile.prototype.targets;

/**
 * A list of objects that describe breaks for the performance chart. 
 * [{color:"#EC6768", label:"Poor"}]
 *
 * @property breaks
 * @type Object[]
 */
ia.Profile.prototype.breaks;

/**
 * An object that describe a bar. 
 * {color:"#EC6768", height:"12", data:"diff"}
 *
 * @property bar
 * @type Object
 */
ia.Profile.prototype.bar;

/** 
 * The formatter.
 * 
 * @property formatter
 * @type ia.Formatter
 */
ia.Profile.prototype.formatter;

/** 
 * Sizes all the element to make the scrolling work.
 *
 * @method _size
 * @private
 */
ia.Profile.prototype._size = function()
{
    var containerWidth = this.container.width()
    var scrollBarWidth = this.$tableContainer.get(0).offsetWidth - this.$tableContainer.get(0).clientWidth;
    
    var tableWidth = containerWidth - scrollBarWidth
    this.$table.width(tableWidth);
    this.$tableHeaders.width(tableWidth);
    
    var containerHeight = this.container.height();
    var headerHeight = this.$tableHeaders.outerHeight();
    var contentHeight = containerHeight - headerHeight;
    this.$tableContainer.height(contentHeight);
    
    var bgcolor = $j(".ia-table-header").css("background-color");
    this.$tableCorner.css("background-color",bgcolor)
    this.$tableCorner.width(scrollBarWidth);
    this.$tableCorner.height(headerHeight);

    this._renderCanvasColumns();
};

/**
 * Expands the passed theme ids.
 *
 * @method expandThemes
 * @param String[] expandedThemeIds The theme levels that should be expanded.
 */
ia.Profile.prototype.expandThemes = function(expandedThemeIds) 
{       
    if (this._data)
    {
        var me = this;
        var n = expandedThemeIds.length;

        this._isCollapsed = false;
        this._collapseIds = [];

        var themes = this._data.themes;

        $j.each(themes, function(tIndex, theme)
        {
            var isCollapsed = true;

            for (var i = 0; i < n; i++) 
            {
                if (theme.id == expandedThemeIds[i])
                {
                    isCollapsed = false;
                    me.$table.find("td[id='"+theme.id+"']").removeClass("ia-profile-theme-expand").addClass("ia-profile-theme-collapse");
                    me.$table.find("tbody[id='"+theme.id+"-children']").show();
                    break;
                }
            }

            if (isCollapsed == true)
            {
                me._collapseIds[me._collapseIds.length] = theme.id;
                me.$table.find("td[id='"+theme.id+"']").removeClass("ia-profile-theme-collapse").addClass("ia-profile-theme-expand");
                me.$table.find("tbody[id='"+theme.id+"-children']").hide();
            }
        });
    }
};

/**
 * Collapse / expands the table.
 *
 * @method toggleTree
 */
ia.Profile.prototype.toggleTree = function() 
{       
    if (this._data)
    {
        var me = this;
        
        this._isCollapsed = !this._isCollapsed;
        this._collapseIds = [];

        var themes = this._data.themes;

        if (this._isCollapsed)
        {
            $j.each(themes, function(tIndex, theme)
            {
                me._collapseIds[me._collapseIds.length] = theme.id;
                me.$table.find("td[id='"+theme.id+"']").removeClass("ia-profile-theme-collapse").addClass("ia-profile-theme-expand");
                me.$table.find("tbody[id='"+theme.id+"-children']").hide();
            });
        }
        else
        {
            $j.each(themes, function(tIndex, theme)
            {
                me.$table.find("td[id='"+theme.id+"']").removeClass("ia-profile-theme-expand").addClass("ia-profile-theme-collapse");
                me.$table.find("tbody[id='"+theme.id+"-children']").show();
            });
        }
    }
};

/**
 * Renders the table.
 *
 * @method render
 */
ia.Profile.prototype.render = function() 
{       
    this._nonComparisonIds = [];
    this._renderTimeout = null;

    if (this.displayMode == undefined) this.displayMode = "Selected date";

    if (this.displayMode == "Selected date") 
        this._data = this.geography.getProfileData(this._featureIds, this.indicator.date, true);
    else if (this.displayMode == "Most recent date")
        this._data = this.geography.getProfileData(this._featureIds, undefined, true);
    else // All Dates.
        this._data = this.geography.getProfileData(this._featureIds);

    // Empty the previous table.
    this.$table.empty();
    this.$tableHeaders.empty();

    // Add the col section.
    var thead = $j("<thead>");
    var tr = $j("<tr>");
    thead.append(tr)
    this.$tableHeaders.append(thead)

    // Iterate through each col.
    var nCol = this.columns.length;
    for (var i = 0; i < nCol; i++) 
    {
        var col = this.columns[i];
        var colWidth = col.width*100;

        if (col.id == "performance")
        {
            // The col label.
            var w = colWidth * 0.2
            var thLabel = $j("<th id='"+col.id+"' class='ia-table-header' style='width:"+w+"%'>");
            tr.append(thLabel);
            w = colWidth * 0.6
            var thLabel = $j("<th id='"+col.id+"' class='ia-table-header' title='"+col.label+"' style='width:"+w+"%;border-left-width:0px'>");
            thLabel.html(col.label);
            tr.append(thLabel);
            w = colWidth * 0.2
            var thLabel = $j("<th id='"+col.id+"' class='ia-table-header' style='width:"+w+"%;border-left-width:0px'>");
            tr.append(thLabel);
        }
        else
        {
            // The col label.
            var thLabel = $j("<th id='"+col.id+"' class='ia-table-header' title='"+col.label+"' style='width:"+colWidth+"%'>");
            thLabel.html(col.label);    
            tr.append(thLabel);
        }

        // Area Profile.
        if (col.id == "profile")
        {
            var midValue = this.bar.minValue + ((this.bar.maxValue - this.bar.minValue)/2);
        
            var div = $j("<div style='display:table;width:100%'>");
            var leftDiv = $j("<div style='display:table-cell;width:30%;text-align:left' title='"+this.bar.minValue+"'>").html(this.bar.minValue);   
            var centreDiv = $j("<div style='display:table-cell;width:40%' title='"+midValue+"'>").html(midValue);   
            var rightDiv = $j("<div style='display:table-cell;width:30%;text-align:right' title='"+this.bar.maxValue+"'>").html(this.bar.maxValue);
            
            div.append(leftDiv);
            div.append(centreDiv);
            div.append(rightDiv);
            thLabel.append(div);
            
            // Calculate the canvas height.
            col.canvasHeight = this.bar.height;
            var n = this.targets.length;
            for (var j = 0; j < n; j++) 
            {
                var target = this.targets[j];
                col.canvasHeight = Math.max(col.canvasHeight, target.size);
            }
            
        }
        // Election.
        else if (col.id == "election")
        {
            // Calculate the canvas height.
            col.canvasHeight = this.bar.height;
            var n = this.targets.length;
            for (var j = 0; j < n; j++) 
            {
                var target = this.targets[j];
                col.canvasHeight = Math.max(col.canvasHeight, target.size);
            }
        }
        // Performance.
        else if (col.id == "performance")
        {
            // Calculate the canvas height.
            col.canvasHeight = this.bar.height;
            var n = this.targets.length;
            for (var j = 0; j < n; j++) 
            {
                var target = this.targets[j];
                col.canvasHeight = Math.max(col.canvasHeight, target.size);
            }

            // Add a bit more so breaks are visible
            if (col.canvasHeight <= this.bar.height + 8) col.canvasHeight = this.bar.height + 8;
        }
        // Health.
        else if (col.id.indexOf("health") != -1)
        {
            var div = $j("<div style='display:table;width:100%'>");     
            var w = colWidth * 0.2;
            var leftDiv = $j("<div style='width:"+w+"%;display:table-cell;text-align:right' title='"+this.bar.minValue+"'>").html(this.bar.minValue);   
            w = colWidth * 0.6;
            var centreDiv = $j("<div style='width:"+w+"%;display:table-cell' title='"+this.bar.midValue+"'>").html(this.bar.midValue);  
            w = colWidth * 0.2;
            var rightDiv = $j("<div style='width:"+w+"%;display:table-cell;text-align:left' title='"+this.bar.maxValue+"'>").html(this.bar.maxValue);

            div.append(leftDiv);
            div.append(centreDiv);
            div.append(rightDiv);
            thLabel.append(div);

            /*var leftDiv = $j("<div style='display:table-cell;width:30%;text-align:left' title='"+this.bar.minValue+"'>").html(this.bar.minValue); 
            var centreDiv = $j("<div style='display:table-cell;width:40%' title='"+this.bar.midValue+"'>").html(this.bar.midValue); 
            var rightDiv = $j("<div style='display:table-cell;width:30%;text-align:right' title='"+this.bar.maxValue+"'>").html(this.bar.maxValue);*/
            

            // Calculate the canvas height.
            col.canvasHeight = 0;
            var n = this.targets.length;
            for (var j = 0; j < n; j++) 
            {
                var target = this.targets[j];
                col.canvasHeight = Math.max(col.canvasHeight, target.size);
            }
            var n = this.symbols.length;
            for (var j = 0; j < n; j++) 
            {
                var symbol = this.symbols[j];
                col.canvasHeight = Math.max(col.canvasHeight, symbol.size);
            }

            // Symbol column properties.
            var propsString = col.id.substring(col.id.indexOf("(")+1, col.id.indexOf(")")); 
            var propsArray = propsString.split(",");
            col.symbolAlign = "right"; // default value.
            for (var j = 0; j < propsArray.length; j++) 
            {
                var prop = propsArray[j].split(":"); 
                var propName = prop[0];
                var propValue =  prop[1];
                col[propName] = propValue;
            }
        }
        // Symbol column.
        else if (col.id.indexOf("symbol(") != -1)
        {
            // Symbol column properties.
            var propsString = col.id.substring(col.id.indexOf("(")+1, col.id.indexOf(")")); 
            var propsArray = propsString.split(",");
            col.symbolAlign = "right"; // default value.
            for (var j = 0; j < propsArray.length; j++) 
            {
                var prop = propsArray[j].split(":"); 
                var propName = prop[0];
                var propValue =  prop[1];
                col[propName] = propValue;
            }
        }   
    }
    
    // Dummy hidden row to maintain column widths - which are lost if theme colspan is applied first.
    var tr = $j("<tr class='ia-table-row'>");
    this.$table.append(tr);
    var adjustedNCol = nCol;
    for (var j = 0; j < nCol; j++) 
    {
        var col = this.columns[j];
        var colWidth = col.width*100;   

        if ((col.id == "performance" || col.id.indexOf("health") != -1) && this.includeMinMaxColumns)
        {
            adjustedNCol = nCol + 2;
            var w = colWidth * 0.2
            var td = $j("<td class='ia-table-cell' style='width:"+w+"%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px'>");
            tr.append(td);
            w = colWidth * 0.6
            var td = $j("<td class='ia-table-cell' style='width:"+w+"%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px'>");
            tr.append(td);
            w = colWidth * 0.2
            var td = $j("<td class='ia-table-cell' style='width:"+w+"%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px'>");
            tr.append(td);
        }
        else
        {
            var td = $j("<td class='ia-table-cell' style='width:"+colWidth+"%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px'>");
            tr.append(td);
        }
    }

    // Themes.
    var themes = this._data.themes;
    var me = this;
    $j.each(themes, function(tIndex, theme)
    {
        var tBody = $j("<tbody>");
        me.$table.append(tBody);
        
        var tr = $j("<tr class='ia-table-row'>");
        tBody.append(tr);
        var td = $j("<td id='"+theme.id+"' class='ia-table-cell ia-profile-theme-name-cell ia-profile-theme-collapse ia-profile-row' colspan='"+adjustedNCol+"'>");
        td.html(theme.name);
        td.attr("title", theme.name);
        tr.append(td);
        
        var tBody = $j("<tbody id='"+theme.id+"-children'>");
        me.$table.append(tBody);

        // Indicators.
        var indicators = theme.indicators;
        $j.each(indicators, function(iIndex, indicator)
        {
            var features = indicator.features;
            
            // No features selected.
            if (features.length == 0)
            {
                // Style even and odd rows differently.
                if (iIndex%2 == 0)  
                    var tr = $j("<tr id='"+indicator.id+"' class='ia-table-row ia-profile-row ia-table-row-even indicator-row'>");
                else            
                    var tr = $j("<tr id='"+indicator.id+"' class='ia-table-row ia-profile-row ia-table-row-odd indicator-row'>");
                
                if (indicator.date != undefined) tr.data('linkId', indicator.id+"~"+indicator.date);
                else tr.data('linkId', indicator.id);
                
                tBody.append(tr);
                
                // Iterate through each table cell in the row - match to columns.
                for (var j = 0; j < nCol; j++) 
                {
                    var col = me.columns[j];
                    var colWidth = col.width*100;
                    
                    if ((col.id == "performance" || col.id.indexOf("health") != -1) && this.includeMinMaxColumns)
                    {
                        var w = colWidth * 0.2
                        var td = $j("<td class='ia-table-cell' style='width:"+w+"%'>");
                        tr.append(td);
                        w = colWidth * 0.6
                        var td = $j("<td class='ia-table-cell' style='width:"+w+"%;border-left-width:0px'>");
                        tr.append(td);
                        w = colWidth * 0.2
                        var td = $j("<td class='ia-table-cell' style='width:"+w+"%;border-left-width:0px'>");
                        tr.append(td);
                    }
                    else if (col.id == "indicatorName") 
                    {
                        var $notesBtn;
                        var td = $j("<td class='ia-profile-indicator-name-cell' style='width:"+colWidth+"%'>");
                        if (me.displayDatesInProfile)
                        {
                            if (indicator.href)
                            {
                                $notesBtn = $j("<span class='ia-table-notes-icon'>");
                                td.append($notesBtn);
                            }
                            if (indicator.date) 
                            {
                                td.append(indicator.name+" ("+indicator.date+")");
                                td.attr("title", indicator.name+" ("+indicator.date+")");
                            }
                            else 
                            {
                                td.append(indicator.name);
                                td.attr("title", indicator.name);
                            }
                        }
                        else 
                        {
                            if (indicator.href)
                            {
                                $notesBtn = $j("<span class='ia-table-notes-icon'>");
                                td.append($notesBtn);
                            }
                            td.append(indicator.name);
                            td.attr("title", indicator.name);
                        }
                        tr.append(td);

                        if (indicator.href)
                        {
                            (function() // Execute immediately
                            { 
                                var link = indicator.href;

                                $notesBtn.bind("click", function(e) 
                                {   
                                    e.stopPropagation();
                                    window.open(link, "_blank");
                                });
                            
                                $notesBtn.bind('mouseover touchstart', function(e) 
                                {   
                                    e.stopPropagation();
                                });

                            })();
                        }
                    }
                    else
                    {
                        var td = $j("<td class='ia-table-cell' style='width:"+colWidth+"%'>");
                        tr.append(td);
                    }
                }
            }
            
            // Features.
            $j.each(features, function(fIndex, feature)
            {           
                // Create a feature array without comparison ids.
                if (feature.isComparison != true)
                {
                    if (me._nonComparisonIds.indexOf(feature.id) == -1)
                    {
                        me._nonComparisonIds[me._nonComparisonIds.length] = feature.id;
                    }
                }

                // Style even and odd rows differently.
                if (iIndex%2 == 0)  
                    var tr = $j("<tr id='"+indicator.id+"' class='ia-table-row ia-profile-row ia-table-row-even indicator-row'>");
                else            
                    var tr = $j("<tr id='"+indicator.id+"' class='ia-table-row ia-profile-row ia-table-row-odd indicator-row'>");
                
                if (indicator.date != undefined) tr.data('linkId', indicator.id+"~"+indicator.date);
                else tr.data('linkId', indicator.id);

                tBody.append(tr);
                
                // Columns.
                for (var j = 0; j < nCol; j++) 
                {
                    var col = me.columns[j];

                    var formattedData = feature[col.formattedId];
                    var colWidth = col.width*100;
                    
                    // First indicator row and with indicator name column.
                    if (fIndex == 0 && col.id == "indicatorName")
                    {   
                        var $notesBtn;                  
                        var td = $j("<td class='ia-profile-indicator-name-cell' rowspan='"+features.length+"' style='width:"+colWidth+"%'>");
                        if (me.displayDatesInProfile)
                        {   
                            if (indicator.href)
                            {
                                $notesBtn = $j("<span class='ia-table-notes-icon'>");
                                td.append($notesBtn);
                            }
                            if (indicator.date) 
                            {
                                td.append(indicator.name+" ("+indicator.date+")");
                                td.attr("title", indicator.name+" ("+indicator.date+")");
                            }
                            else 
                            {
                                td.append(indicator.name);
                                td.attr("title", indicator.name);
                            }
                        }
                        else
                        {
                            if (indicator.href)
                            {
                                $notesBtn = $j("<span class='ia-table-notes-icon'>");
                                td.append($notesBtn);
                            }
                            td.append(indicator.name);
                            td.attr("title", indicator.name);
                        }
                        tr.append(td);

                        if (indicator.href)
                        {
                            (function() // Execute immediately
                            { 
                                var link = indicator.href;

                                $notesBtn.bind("click", function(e) 
                                {   
                                    e.stopPropagation();
                                    window.open(link, "_blank");
                                });
                            
                                $notesBtn.bind('mouseover touchstart', function(e) 
                                {   
                                    e.stopPropagation();
                                });

                            })();
                        }
                    }
                    // Feature name column
                    else if (col.id == "name")
                    {
                        var td = $j("<td class='ia-table-cell ia-table-cell-categoric' style='width:"+colWidth+"%'>");
                        td.html(formattedData);
                        td.attr('title', formattedData)
                        tr.append(td);
                    }
                    // Area Profile.
                    else if (col.id == "profile" || col.id == "election")
                    {
                        var td = $j("<td class='ia-table-cell ia-profile-cell' style='width:"+colWidth+"%'>");
                        var canvas = document.createElement('canvas');
                        canvas.width = 0;
                        canvas.height = 0;
                        td.append($j(canvas));
                        
                        // Attach data values.
                        var barValue = feature[me.bar.data];
                        var symbolValue = feature[me.bar.symbolValue];
                        td.data('id', feature.id);
                        td.data('isComparison', feature.isComparison);
                        td.data('barValue', barValue);
                        td.data('canvasHeight', col.canvasHeight);
                        td.data('symbolValue', symbolValue);
                        var barValueFormatted = feature[me.bar.data+'_formatted'];
                        td.data('barValue_formatted', barValueFormatted);
                        
                        // Attach target data values.
                        var n = me.targets.length;
                        for (var i = 0; i < n; i++) 
                        {
                            var target = me.targets[i];
                            var targetValue = feature[target.data];
                            td.data('targetValue'+i, targetValue);
                            var targetValueFormatted = feature[target.data+'_formatted'];
                            td.data('targetValue'+i+'_formatted', targetValueFormatted);
                        }
                        tr.append(td);
                    }
                    // Peformance.
                    else if (col.id == "performance" || col.id.indexOf("health") != -1)
                    {
                        var td;
                        if (me.includeMinMaxColumns)
                        {
                            var w = colWidth * 0.2
                            var minValueCell = $j("<td class='ia-table-cell' style='text-align:right' style='width:"+w+"%'>");  
                            tr.append(minValueCell);
                        
                            w = colWidth * 0.6
                            td = $j("<td class='ia-table-cell' style='width:"+w+"%;border-left-width:0px'>");
                        }
                        else
                        {
                            td = $j("<td class='ia-table-cell' style='width:"+colWidth+"%'>");
                        }

                        if (col.id == "performance") td.addClass('ia-performance-cell');
                        else if (col.id.indexOf("health") != -1) 
                        {
                            td.addClass('ia-health-cell');
                            var symbolValue = feature[col.symbolValue];
                            var areaValue = feature[col.areaValue];
                            var nationalValue = feature[col.nationalValue];
                            var areaValueFormatted = feature[col.areaValue+'_formatted'];
                            var nationalValueFormatted = feature[col.nationalValue+'_formatted'];

                            td.data('symbolValue', symbolValue);
                            td.data('areaValue', areaValue);
                            td.data('nationalValue', nationalValue);
                            td.data('areaValue_formatted', areaValueFormatted);
                            td.data('nationalValue_formatted', nationalValueFormatted);
                            td.data('usingMedian', false);

                            if (nationalValue == undefined) 
                            {
                                if (me.bar.data == "value" || me.bar.data == undefined)
                                {
                                    td.data('nationalValue', indicator.median); // Default value if it hasnt been defined.
                                    td.data('nationalValue_formatted', indicator.median_formatted);
                                }
                                else
                                {
                                    td.data('nationalValue', indicator[me.bar.data+"_median"]); // Default value if it hasnt been defined.
                                    td.data('nationalValue_formatted', indicator[me.bar.data+"_median_formatted"]);
                                }
                                td.data('usingMedian', true);
                            }
                        }

                        tr.append(td);

                        var canvas = document.createElement('canvas');
                        canvas.width = 0;
                        canvas.height = 0;
                        td.append($j(canvas));

                        if (me.includeMinMaxColumns)
                        {
                            w = colWidth * 0.2
                            var maxValueCell = $j("<td class='ia-table-cell' style='text-align:left;border-left-width:0px' style='width:"+w+"%'>");
                            tr.append(maxValueCell);
                        }

                        // Attach data values.
                        var barValue = feature[me.bar.data];
                        var breaksFlip = feature[me.bar.breaksFlip];
                        td.data('id', feature.id);
                        td.data('isComparison', feature.isComparison);
                        td.data('barValue', barValue);
                        td.data('breaksFlip', breaksFlip);
                        td.data('canvasHeight', col.canvasHeight);
                        var barValueFormatted = feature[me.bar.data+'_formatted'];
                        td.data('barValue_formatted', barValueFormatted);
                        
                        // Attach target data values.
                        var n = me.targets.length;
                        for (var i = 0; i < n; i++) 
                        {
                            var target = me.targets[i];
                            var targetValue = feature[target.data];
                            td.data('targetValue'+i, targetValue);
                            var targetValueFormatted = feature[target.data+'_formatted'];
                            td.data('targetValue'+i+'_formatted', targetValueFormatted);
                        }

                        // Attach breaks values.
                        if (me.bar.breaksData)
                        {
                            var breaksString = feature[me.bar.breaksData];
                            if (breaksString != undefined)
                            {
                                var breaksArray = breaksString.split(",");
                                var minValue = Infinity;
                                var maxValue = -Infinity;
                                var n = breaksArray.length;
                                for (var i = 0; i < n; i++) 
                                {
                                    var breakValue = breaksArray[i];
                                    minValue = Math.min(minValue, breakValue);
                                    maxValue = Math.max(maxValue, breakValue);
                                    td.data('breakValue'+i, breakValue);
                                    td.data('breakValue'+i+'_formatted', me.formatter.format(breakValue));
                                }
                                td.data('minValue', minValue);
                                td.data('maxValue', maxValue);
                                var fMinValue = me.formatter.format(minValue);
                                var fMaxValue = me.formatter.format(maxValue);
                                td.data('minValue_formatted', fMinValue);
                                td.data('maxValue_formatted', fMaxValue);

                                if (me.includeMinMaxColumns)
                                {
                                    minValueCell.html(fMinValue);
                                    maxValueCell.html(fMaxValue);
                                    minValueCell.attr('title', fMinValue);
                                    maxValueCell.attr('title', fMaxValue);

                                    // Check if breaks are reversed.
                                    var breakValue1 = parseFloat(td.data('breakValue0'));
                                    var breakValue2 = parseFloat(td.data('breakValue1'));
                                    if (breakValue1 > breakValue2) 
                                    {
                                        minValueCell.html(fMaxValue);
                                        maxValueCell.html(fMinValue);
                                        minValueCell.attr('title', fMaxValue);
                                        maxValueCell.attr('title', fMinValue);
                                    }
                                }
                            }
                            else
                            {
                                if (me.bar.data == "value" || me.bar.data == undefined)
                                {
                                    td.data('breakValue0', indicator.minValue);
                                    td.data('breakValue1', indicator.lowerQuartile);
                                    td.data('breakValue2', indicator.upperQuartile);
                                    td.data('breakValue3', indicator.maxValue);
                                    td.data('minValue', indicator.minValue);
                                    td.data('maxValue', indicator.maxValue);
                                    td.data('breakValue0_formatted', indicator.minValue_formatted);
                                    td.data('breakValue1_formatted', indicator.lowerQuartile_formatted);
                                    td.data('breakValue2_formatted', indicator.upperQuartile_formatted);
                                    td.data('breakValue3_formatted', indicator.maxValue_formatted);
                                    td.data('minValue_formatted', indicator.minValue_formatted);
                                    td.data('maxValue_formatted', indicator.maxValue_formatted);

                                    if (me.includeMinMaxColumns)
                                    {
                                        minValueCell.html(indicator.minValue_formatted);
                                        maxValueCell.html(indicator.maxValue_formatted);
                                        minValueCell.attr('title', indicator.minValue_formatted);
                                        maxValueCell.attr('title', indicator.maxValue_formatted);

                                        // Check if breaks are reversed.
                                        var breakValue1 = parseFloat(td.data('breakValue0'));
                                        var breakValue2 = parseFloat(td.data('breakValue1'));
                                        if (breakValue1 > breakValue2) 
                                        {
                                            minValueCell.html(indicator.maxValue_formatted);
                                            maxValueCell.html(indicator.minValue_formatted);
                                            minValueCell.attr('title', indicator.maxValue_formatted);
                                            maxValueCell.attr('title', indicator.minValue_formatted);
                                        }
                                    }
                                }
                                else
                                {
                                    td.data('breakValue0', indicator[me.bar.data+"_minValue"]);
                                    td.data('breakValue1', indicator[me.bar.data+"_lowerQuartile"]);
                                    td.data('breakValue2', indicator[me.bar.data+"_upperQuartile"]);
                                    td.data('breakValue3', indicator[me.bar.data+"_maxValue"]);
                                    td.data('minValue', indicator[me.bar.data+"_minValue"]);
                                    td.data('maxValue', indicator[me.bar.data+"_maxValue"]);
                                    td.data('breakValue0_formatted', indicator[me.bar.data+"_minValue_formatted"]);
                                    td.data('breakValue1_formatted', indicator[me.bar.data+"_lowerQuartile_formatted"]);
                                    td.data('breakValue2_formatted', indicator[me.bar.data+"_upperQuartile_formatted"]);
                                    td.data('breakValue3_formatted', indicator[me.bar.data+"_maxValue_formatted"]);
                                    td.data('minValue_formatted', indicator[me.bar.data+"_minValue_formatted"]);
                                    td.data('maxValue_formatted', indicator[me.bar.data+"_maxValue_formatted"]);

                                    if (me.includeMinMaxColumns)
                                    {
                                        minValueCell.html(indicator[me.bar.data+"_minValue_formatted"]);
                                        maxValueCell.html(indicator[me.bar.data+"_maxValue_formatted"]);
                                        minValueCell.attr('title', indicator[me.bar.data+"_minValue_formatted"]);
                                        maxValueCell.attr('title', indicator[me.bar.data+"_maxValue_formatted"]);

                                        // Check if breaks are reversed.
                                        var breakValue1 = parseFloat(td.data('breakValue0'));
                                        var breakValue2 = parseFloat(td.data('breakValue1'));
                                        if (breakValue1 > breakValue2) 
                                        {
                                            minValueCell.html(indicator[me.bar.data+"_maxValue_formatted"]);
                                            maxValueCell.html(indicator[me.bar.data+"_minValue_formatted"]);
                                            minValueCell.attr('title', indicator[me.bar.data+"_maxValue_formatted"]);
                                            maxValueCell.attr('title', indicator[me.bar.data+"_minValue_formatted"]);
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (me.bar.data == "value" || me.bar.data == undefined)
                            {
                                td.data('breakValue0', indicator.minValue);
                                td.data('breakValue1', indicator.lowerQuartile);
                                td.data('breakValue2', indicator.upperQuartile);
                                td.data('breakValue3', indicator.maxValue);
                                td.data('minValue', indicator.minValue);
                                td.data('maxValue', indicator.maxValue);
                                td.data('breakValue0_formatted', indicator.minValue_formatted);
                                td.data('breakValue1_formatted', indicator.lowerQuartile_formatted);
                                td.data('breakValue2_formatted', indicator.upperQuartile_formatted);
                                td.data('breakValue3_formatted', indicator.maxValue_formatted);
                                td.data('minValue_formatted', indicator.minValue_formatted);
                                td.data('maxValue_formatted', indicator.maxValue_formatted);

                                if (me.includeMinMaxColumns)
                                {
                                    minValueCell.html(indicator.minValue_formatted);
                                    maxValueCell.html(indicator.maxValue_formatted);
                                    minValueCell.attr('title', indicator.minValue_formatted);
                                    maxValueCell.attr('title', indicator.maxValue_formatted);
                                }
                            }
                            else
                            {
                                td.data('breakValue0', indicator[me.bar.data+"_minValue"]);
                                td.data('breakValue1', indicator[me.bar.data+"_lowerQuartile"]);
                                td.data('breakValue2', indicator[me.bar.data+"_upperQuartile"]);
                                td.data('breakValue3', indicator[me.bar.data+"_maxValue"]);
                                td.data('minValue', indicator[me.bar.data+"_minValue"]);
                                td.data('maxValue', indicator[me.bar.data+"_maxValue"]);
                                td.data('breakValue0_formatted', indicator[me.bar.data+"_minValue_formatted"]);
                                td.data('breakValue1_formatted', indicator[me.bar.data+"_lowerQuartile_formatted"]);
                                td.data('breakValue2_formatted', indicator[me.bar.data+"_upperQuartile_formatted"]);
                                td.data('breakValue3_formatted', indicator[me.bar.data+"_maxValue_formatted"]);
                                td.data('minValue_formatted', indicator[me.bar.data+"_minValue_formatted"]);
                                td.data('maxValue_formatted', indicator[me.bar.data+"_maxValue_formatted"]);

                                if (me.includeMinMaxColumns)
                                {
                                    minValueCell.html(indicator[me.bar.data+"_minValue_formatted"]);
                                    maxValueCell.html(indicator[me.bar.data+"_maxValue_formatted"]);
                                    minValueCell.attr('title', indicator[me.bar.data+"_minValue_formatted"]);
                                    maxValueCell.attr('title', indicator[me.bar.data+"_maxValue_formatted"]);
                                }
                            }
                        }
                    }
                    // Symbol column.
                    else if (col.id.indexOf("symbol(") != -1)
                    {
                        var symbolValue = feature[col.symbolValue];

                        if (col.textValue != undefined)
                        {
                            var textValue = feature[col.textValue+"_formatted"];
                            if (col.textValue == "indicatorName")   
                            {
                                if (me.displayDatesInProfile)
                                {
                                    if (indicator.date) textValue = indicator.name+" ("+indicator.date+")";
                                    else textValue = indicator.name;
                                }
                                else textValue = indicator.name;
                            }
                            else if (col.textValue == "name") textValue = feature["name"];

                            var td = $j("<td class='ia-table-cell ia-symbol-cell' style='width:"+colWidth+"%'>");
                            td.data('symbolValue', symbolValue);
                            
                            var div = $j("<div style='display:table'>");    
                            td.append(div);
                            
                            var textDiv = $j("<div style='display:table-cell;vertical-align:middle;width:100%'>")
                            if (textValue != undefined) 
                            {
                                textDiv.html(textValue+"&nbsp;");   
                                textDiv.attr('title', textValue);
                            }
                            
                            var type = indicator.type;
                            if (col.textValue != "value") type = feature[col.textValue+"_type"];
                            if (type == "categoric") textDiv.addClass("ia-table-cell-categoric");
                            else  textDiv.addClass("ia-table-cell-numeric");
                            
                            var symbolDiv = $j("<div style='display:table-cell;vertical-align:middle'>");
                            var canvas = document.createElement('canvas');
                            canvas.width = 0;
                            canvas.height = 0;
                            symbolDiv.append($j(canvas));
                            
                            if (col.symbolAlign == "right")
                            {
                                div.append(textDiv);
                                div.append(symbolDiv);
                            }
                            else if (col.symbolAlign == "left")
                            {
                                div.append(symbolDiv);
                                div.append(textDiv);
                            }
                        }
                        else
                        {
                            var td = $j("<td class='ia-table-cell ia-symbol-cell' style='width:"+colWidth+"%'>");
                            td.data('symbolValue', symbolValue);
                            
                            var symbolDiv = $j("<div style='vertical-align:middle;text-align:"+col.symbolAlign+";width:100%'>");
                            var canvas = document.createElement('canvas');
                            canvas.width = 0;
                            canvas.height = 0;
                            symbolDiv.append($j(canvas));
                            td.append(symbolDiv);
                        }
                        tr.append(td);
                    }
                    // Indicator column.
                    else if (col.id == "value")
                    {
                        if (indicator.type  == "categoric") 
                            var td = $j("<td class='ia-table-cell ia-table-cell-categoric' style='width:"+colWidth+"%'>");
                        else  
                            var td = $j("<td class='ia-table-cell ia-table-cell-numeric' style='width:"+colWidth+"%'>");

                        if (formattedData != undefined) 
                        {
                            td.html(formattedData);
                            td.attr('title', formattedData)
                        }
                        tr.append(td);
                    }
                    // Associate column.
                    else if (col.id != "indicatorName" && col.id != "name")
                    {
                        var type = feature[col.id+"_type"];
                        if (type  == "categoric") 
                            var td = $j("<td class='ia-table-cell ia-table-cell-categoric' style='width:"+colWidth+"%'>");
                        else  
                            var td = $j("<td class='ia-table-cell ia-table-cell-numeric' style='width:"+colWidth+"%'>");

                        if (formattedData != undefined)
                        {
                            td.html(formattedData);
                            td.attr('title', formattedData)
                        }
                        tr.append(td);
                    }
                }
            }); 
        });
    });
    
    // Check if any themes have been collapsed.
    for (var i = 0; i < this._collapseIds.length; i++) 
    {
        var id = this._collapseIds[i];
        this.$table.find("td[id='"+id+"']").removeClass("ia-profile-theme-collapse").addClass("ia-profile-theme-expand");
        this.$table.find("tbody[id='"+id+"-children']").hide();
    }

    this._scrollBox.refresh();
    this._size();

    var e = new ia.Event('onRender', this);
    this.dispatchEvent(e);
};

/**
 * Renders special columns.
 *
 * @method _renderCanvasColumns
 * @private
 */
ia.Profile.prototype._renderCanvasColumns = function()
{
    // Area Profile.
    var me = this;
    this.$table.find('tbody > tr > td.ia-profile-cell').each(function() 
    {
        var features = [];

        var id = $j(this).data('id');
        var isComparison = $j(this).data('isComparison');
        var barValue = $j(this).data('barValue');
        var barValue_formatted = $j(this).data('barValue_formatted');
        var range = me.bar.maxValue - me.bar.minValue;
                
        var symbolValue = $j(this).data('symbolValue');

        var canvas = $j(this).find("canvas:first").get(0);
        var canvasWidth = $j(this).width();
        var canvasHeight = $j(this).data('canvasHeight');
            
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bar.
        if (barValue != undefined)
        {
            var barWidth = (Math.abs(barValue) / range) * canvasWidth;
            var zeroPosition = ((me.bar.minValue / range) * canvasWidth) * -1;
            
            var barX = zeroPosition;
            if (barValue < 0) barX = zeroPosition - barWidth;
            var barY = (canvasHeight - me.bar.height) / 2;

            // Check if its a comparison feature.
            var comparisonColor;
            if (isComparison && me.comparisonThematic)
            {
                var legendClass = me.comparisonThematic.getClass(id);
                if (legendClass != undefined) comparisonColor = legendClass.color;  
            }

            // Bar color
            if (comparisonColor != undefined)
            {
                ctx.fillStyle = comparisonColor;
            }
            else if (me.colorPalette) // Use legend color
            {
                var n = me._nonComparisonIds.length;
                var colorList = me.colorPalette.getColors(n);
                var index = me._nonComparisonIds.indexOf(id);
                ctx.fillStyle = colorList[index];   
            }
            else if (symbolValue != undefined) // Use symbol color - used by election template.
            {
                var n = me.symbols.length;
                for (var i = 0; i < n; i++) 
                {
                    var symbol = me.symbols[i];
                    if (symbol.value == symbolValue)
                    {
                        ctx.fillStyle = symbol.color;
                        break;
                    }
                }
            }
            else // Use default color
                ctx.fillStyle = me.bar.color;

            if (me.bar.shape == 'bar' || me.bar.shape == undefined) 
            {
                ctx.beginPath();
                    ctx.rect(barX, barY, barWidth, me.bar.height);
                ctx.fill();
            }
            else 
            {
                if (barValue > 0) barX = barX + barWidth;
                barWidth = me.bar.height;

                ctx.beginPath();
                    ia.Shape.draw(me.bar.shape, ctx, barX, canvas.height/2, me.bar.height);
                ctx.fill();

                ctx.fillStyle = '#cccccc';
                ctx.beginPath();
                    ia.Shape.draw('vertical line', ctx, zeroPosition, canvas.height/2, canvas.height);
                ctx.fill();

                barX = barX - (me.bar.height/2)
            }

            var f = {};
            f.label = barValue_formatted;
            f.rect = new ia.Rectangle(barX, barY, barWidth, me.bar.height);
            features[features.length] = f;
        }
        
        // Draw targets.
        var n = me.targets.length;
        for (var i = 0; i < n; i++) 
        {
            var target = me.targets[i];
            var targetValue = $j(this).data('targetValue'+i);
            var targetValueFormatted = $j(this).data('targetValue'+i+'_formatted');

            if (targetValue != undefined)
            {
                var targetX = (((targetValue - me.bar.minValue) / range) * canvasWidth);
                ctx.fillStyle = target.color;
                ctx.beginPath();
                    ia.Shape.draw(target.shape, ctx, targetX, canvas.height/2, target.size);
                ctx.fill();

                var f = {};
                f.label = target.label + " : " + targetValueFormatted;
                f.rect = new ia.Rectangle(targetX-(target.size/2), (canvas.height-target.size)/2, target.size, target.size);
                features[features.length] = f;
            }
        }

        me._setToolTip($j(canvas), features);
    });

    // Performance.
    var nComparisons = 0;
    this.$table.find('tbody > tr > td.ia-performance-cell').each(function() 
    {
        var features = [];

        var id = $j(this).data('id');
        var isComparison = $j(this).data('isComparison');
        var breaksFlip = $j(this).data('breaksFlip');
        var barValue = $j(this).data('barValue');
        var barValue_formatted = $j(this).data('barValue_formatted');
        var minValue = $j(this).data('minValue');
        var maxValue = $j(this).data('maxValue');
        var range = maxValue - minValue;

        var canvas = $j(this).find("canvas:first").get(0);
        var canvasWidth = $j(this).width();
        var canvasHeight = $j(this).data('canvasHeight');
            
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check for reverse breaks ie 84,68,35,7.
        var reverseBreaks = false;
        var breakValue1 = parseFloat($j(this).data('breakValue0'));
        var breakValue2 = parseFloat($j(this).data('breakValue1'));
        if (breakValue1 > breakValue2) reverseBreaks = true;
        
        // Draw breaks.
        var n = me.breaks.length;
        for (var i = 0; i < n; i++) 
        {
            if (breaksFlip == true || breaksFlip == 'true' || breaksFlip == 'TRUE' || breaksFlip == 'True') 
            {
                var brk = me.breaks[n-i-1];
            }
            else var brk = me.breaks[i];

            var breakValue1 = $j(this).data('breakValue'+i);
            var j = i+1;
            var breakValue2 = $j(this).data('breakValue'+j);

            //var breakX = (((breakValue1 - minValue) / range) * canvasWidth);
            //var breakWidth = (((breakValue2 - breakValue1) / range) * canvasWidth);

            var breakWidth = ((Math.abs(breakValue2 - breakValue1) / range) * canvasWidth);
            var breakX = (((breakValue1 - minValue) / range) * canvasWidth);
            if (reverseBreaks) breakX = canvasWidth - breakX; 

            ctx.fillStyle = brk.color;
            ctx.beginPath();
                ctx.rect(breakX, 0, breakWidth, canvas.height);
            ctx.fill();

            var f = {};
            f.label = brk.label + " : " + $j(this).data('breakValue'+i+'_formatted') + " - " + $j(this).data('breakValue'+j+'_formatted');
            if (reverseBreaks) f.label = brk.label + " : " + $j(this).data('breakValue'+j+'_formatted') + " - " + $j(this).data('breakValue'+i+'_formatted');
            f.rect = new ia.Rectangle(breakX, 0, breakWidth, canvas.height);
            features[features.length] = f;
        }

        // Draw bar.
        if (barValue != undefined)
        {
            var barWidth = (Math.abs(barValue) / range) * canvasWidth;
            var zeroPosition = ((minValue / range) * canvasWidth) * -1;
            var barX = zeroPosition;
            if (barValue < 0) barX = zeroPosition - barWidth;
            var barY = (canvasHeight - me.bar.height) / 2;

            if (reverseBreaks) barX = canvasWidth - (barX + barWidth);

            /*var barWidth = ((Math.abs(barValue) - minValue) / range) * canvasWidth;
            var barX = 0;
            var barY = (canvasHeight - me.bar.height) / 2;

            if (barValue < 0)
            {
                var zeroPosition = ((minValue / range) * canvasWidth) * -1;
                barX =  (Math.abs(barValue - minValue) / range) * canvasWidth;
                barWidth = zeroPosition - barX;
            }*/

            // Check if its a comparison feature.
            var comparisonColor;
            if (isComparison && me.comparisonThematic)
            {
                var legendClass = me.comparisonThematic.getClass(id);
                if (legendClass != undefined) comparisonColor = legendClass.color;  
            }

            // Bar color
            if (comparisonColor != undefined)
            {
                nComparisons++;
                ctx.fillStyle = comparisonColor;
            }
            else if  (me.colorPalette)
            {
                var n = me._nonComparisonIds.length;
                var colorList = me.colorPalette.getColors(n);
                var index = me._nonComparisonIds.indexOf(id);
                ctx.fillStyle = colorList[index];   
            }
            else  ctx.fillStyle = me.bar.color;


            if (me.bar.shape == 'bar' || me.bar.shape == undefined) 
            {
                ctx.beginPath();
                    ctx.rect(barX, barY, barWidth, me.bar.height);
                ctx.fill();
            }
            else 
            {
                if (barValue > 0) barX = barX + barWidth;
                barWidth = me.bar.height;

                ctx.beginPath();
                    ia.Shape.draw(me.bar.shape, ctx, barX, canvas.height/2, me.bar.height);
                ctx.fill();

                barX = barX - (me.bar.height/2)
            }

            var f = {};
            f.label = barValue_formatted;
            f.rect = new ia.Rectangle(barX, barY, barWidth, me.bar.height);
            features[features.length] = f;
        }
        
        // Draw targets.
        var n = me.targets.length;
        for (var i = 0; i < n; i++) 
        {
            var target = me.targets[i];
            var targetValue = $j(this).data('targetValue'+i);
            var targetValueFormatted = $j(this).data('targetValue'+i+'_formatted');

            if (targetValue != undefined)
            {
                var targetX = (((targetValue - minValue) / range) * canvasWidth);
                if (reverseBreaks) targetX = canvasWidth - targetX; 

                ctx.fillStyle = target.color;
                ctx.beginPath();
                    ia.Shape.draw(target.shape, ctx, targetX, canvas.height/2, target.size);
                ctx.fill();

                var f = {};
                f.label = target.label + " : " + targetValueFormatted;
                f.rect = new ia.Rectangle(targetX-(target.size/2), (canvas.height-target.size)/2, target.size, target.size);
                features[features.length] = f;
            }
        }
        me._setToolTip($j(canvas), features);
    });

    // Health.
    this.$table.find('tbody > tr > td.ia-health-cell').each(function() 
    {
        var features = [];

        var id = $j(this).data('id');
        var breaksFlip = $j(this).data('breaksFlip');

        var minValue = parseFloat($j(this).data('minValue'));
        var maxValue = parseFloat($j(this).data('maxValue'));
        var range = maxValue - minValue;

        var symbolValue = $j(this).data('symbolValue');

        var areaValue = parseFloat($j(this).data('areaValue'));
        var nationalValue = parseFloat($j(this).data('nationalValue'));

        var midValue = minValue + (range / 2);
        var diff = Math.max(Math.abs(maxValue - nationalValue),Math.abs(nationalValue - minValue));

        minValue = nationalValue - diff;
        maxValue = nationalValue + diff;
        range = maxValue - minValue;

        var canvas = $j(this).find("canvas:first").get(0);
        var canvasWidth = $j(this).width();
        var canvasHeight = $j(this).data('canvasHeight');
            
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check for reverse breaks ie 84,68,35,7.
        var reverseBreaks = false;
        var breakValue1 = parseFloat($j(this).data('breakValue0'));
        var breakValue2 = parseFloat($j(this).data('breakValue1'));
        if (breakValue1 > breakValue2) reverseBreaks = true;

        // Draw breaks.
        var n = me.breaks.length;
        for (var i = 0; i < n; i++) 
        {
            if (breaksFlip == true || breaksFlip == 'true' || breaksFlip == 'TRUE' || breaksFlip == 'True') var brk = me.breaks[n-i-1];
            else var brk = me.breaks[i];

            var breakValue1 = parseFloat($j(this).data('breakValue'+i));
            var j = i+1;
            var breakValue2 = parseFloat($j(this).data('breakValue'+j));

            var breakWidth = ((Math.abs(breakValue2 - breakValue1) / range) * canvasWidth);
            var breakX = (((breakValue1 - minValue) / range) * canvasWidth);
            if (reverseBreaks) breakX = canvasWidth - breakX; 

            ctx.fillStyle = brk.color;
            ctx.beginPath();
                ctx.rect(breakX, 0, breakWidth, canvas.height);
            ctx.fill();

            var f = {};
            f.label = brk.label + " : " + $j(this).data('breakValue'+i+'_formatted') + " - " + $j(this).data('breakValue'+j+'_formatted');
            if (reverseBreaks) f.label = brk.label + " : " + $j(this).data('breakValue'+j+'_formatted') + " - " + $j(this).data('breakValue'+i+'_formatted');
            f.rect = new ia.Rectangle(breakX, 0, breakWidth, canvas.height);
            features[features.length] = f;
        }

        // If using median for health chart draw a target for it.
        if ($j(this).data('usingMedian'))
        {
            var target = {};
            target.color = '#999999';
            target.size = 14;
            target.shape = ia.Shape.VERTICAL_LINE;

            var targetX = (((nationalValue - minValue) / range) * canvasWidth);
            ctx.fillStyle = target.color;
            ctx.beginPath();
                ia.Shape.draw(target.shape, ctx, targetX, canvas.height/2, target.size);
            ctx.fill();

            var f = {};
            f.label = $j(this).data('nationalValue_formatted');
            f.rect = new ia.Rectangle(targetX-(target.size/2), (canvas.height-target.size)/2, target.size, target.size);
            features[features.length] = f;
        }

        // Draw targets.
        var n = me.targets.length;
        for (var i = 0; i < n; i++) 
        {
            var target = me.targets[i];
            var targetValue = $j(this).data('targetValue'+i);
            var targetValueFormatted = $j(this).data('targetValue'+i+'_formatted');

            if (targetValue != undefined)
            {
                var targetX = (((targetValue - minValue) / range) * canvasWidth);
            
                if (reverseBreaks) targetX = canvasWidth - targetX; 

                ctx.fillStyle = target.color;
                ctx.beginPath();
                    ia.Shape.draw(target.shape, ctx, targetX, canvas.height/2, target.size);
                ctx.fill();

                var f = {};
                f.label = target.label + " : " + targetValueFormatted;
                f.rect = new ia.Rectangle(targetX-(target.size/2), (canvas.height-target.size)/2, target.size, target.size);
                features[features.length] = f;
            }
        }

        // Draw area symbol.
        if (symbolValue != undefined)
        {
            var n = me.symbols.length;
            for (var i = 0; i < n; i++) 
            {
                var symbol = me.symbols[i];
                if (symbol.value == symbolValue)
                {
                    var symbolX = (((areaValue - minValue) / range) * canvasWidth);

                    if (reverseBreaks) symbolX = canvasWidth - symbolX; 

                    ctx.fillStyle = symbol.color;
                    ctx.beginPath();
                        ia.Shape.draw(symbol.shape, ctx, symbolX, canvas.height/2, symbol.size);
                    ctx.fill();

                    var f = {};
                    f.label = symbol.label + " : " + $j(this).data('areaValue_formatted');
                    f.rect = new ia.Rectangle(symbolX-(symbol.size/2), (canvas.height-symbol.size)/2, symbol.size, symbol.size);
                    features[features.length] = f;

                    break;
                }
            }
        }
        else // If no symbol is found just draw it as a target line.
        {
            var symbol = {};
            symbol.color = me.bar.color;
            symbol.size = 14;
            symbol.shape = ia.Shape.DIAMOND;

            var symbolX = (((areaValue - minValue) / range) * canvasWidth);

            ctx.fillStyle = symbol.color;
            ctx.beginPath();
                ia.Shape.draw(symbol.shape, ctx, symbolX, canvas.height/2, symbol.size);
            ctx.fill();

            var f = {};
            f.label = $j(this).data('areaValue_formatted');
            f.rect = new ia.Rectangle(symbolX-(symbol.size/2), (canvas.height-symbol.size)/2, symbol.size, symbol.size);
            features[features.length] = f;
        }

        me._setToolTip($j(canvas), features);
    });

    // Symbol column.
    this.$table.find('tbody > tr > td.ia-symbol-cell').each(function() 
    {
        var features = [];

        var symbolValue = $j(this).data('symbolValue');


        // Draw symbol.
        if (symbolValue != undefined)
        {
            var symbolShape; 
            var symbolSize; 
            var symbolColor; 
            var symbolLabel; 

            var n = me.symbols.length;
            for (var i = 0; i < n; i++) 
            {
                var symbol = me.symbols[i];
                if (symbol.value == symbolValue)
                {
                    symbolLabel = symbol.label;
                    symbolShape = symbol.shape; 
                    symbolSize = symbol.size;
                    symbolColor = symbol.color;
                    break;
                }
            }
            
            if (symbolShape != undefined)
            {
                var canvas = $j(this).find("canvas:first").get(0);
                canvas.width = symbolSize;
                canvas.height = symbolSize;
                var ctx = canvas.getContext("2d");
                ctx.clearRect( 0, 0, canvas.width, canvas.height);

                ctx.fillStyle = symbolColor;
                var cx = symbolSize / 2;
                var cy = symbolSize / 2;
                ctx.beginPath();
                    ia.Shape.draw(symbolShape, ctx, cx, cy, symbolSize);
                ctx.fill();

                var f = {};
                f.label = symbolLabel;
                f.rect = new ia.Rectangle(0, 0, canvas.width, canvas.height);
                features[features.length] = f;
            }
            else // http://bugzilla.geowise.co.uk/show_bug.cgi?id=8733
            {
                var canvas = $j(this).find("canvas:first").get(0);
                canvas.width = 1;
                canvas.height = 1;
            }
        }
        me._setToolTip($j(canvas), features);
    });
};

/** 
 * Sets the tooltip.
 * 
 * @method _setToolTip
 * @param {HTML Canvas} canvas The canvas to add the tip to.
 * @param {Object[]} features The features the tip applies to.
 * @private
 */
ia.Profile.prototype._setToolTip = function(canvas, features)
{
    var me = this;
    canvas.hover
    (
        function(e)
        {   

        },
        function()
        {
            me._tip.hide();
        }
    );  

    var doFade = false;
    canvas.mousemove
    (
        function(e)
        {
            var mouseX = e.pageX - canvas.offset().left;
            var mouseY = e.pageY - canvas.offset().top;
            var hit = false;

            for (var i = features.length - 1; i >= 0; i--) 
            {
                var f = features[i];
                if (f.rect.intersects(mouseX, mouseY))
                {
                    doFade = true;
                    hit = true;
                    me._tip.text(f.label); 
                    me._tip.show();
                    break;
                }
            };
            if (!hit && doFade == true) 
            {
                me._tip.hide();
            }

            var parentOffset = me.container.offset(); 
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;

            var px,py;
            if (ia.IS_TOUCH_DEVICE)
            {
                px = relX - (me._tip.getWidth() / 2);
                py = relY - (me._tip.getHeight() + 30);
            }
            else
            {
                px = relX - (me._tip.getWidth() / 2);
                py = relY - (me._tip.getHeight() + 10);
            }

            me._tip.position(px, py);
        }
    );
};

/**
 * Adds mouse events to the passed jquery object.
 * Uses delegation to reduce number of events added to rows and rendering time!
 * 
 * @method _addMouseEvents
 * @private
 */
ia.Profile.prototype._addMouseEvents = function() 
{   
    var me = this;
    // Theme Click.
    this.$table.delegate('td.ia-profile-theme-name-cell', "click", function(e)
    {
        me._onThemeClick($j(this));
    });
    if (this._useMouseClick)
    {
        // Indicator Click.
        this.$table.delegate('tr.indicator-row', "click", function(e)
        {
            me._onIndicatorClick($j(this));
        });
    }
};

/**
 * Called when a theme td is clicked.
 *
 * @method _onThemeClick
 * @param {JQUERY Element} themeCell The theme td.
 * @private
 */
ia.Profile.prototype._onThemeClick = function(themeCell)
{
    var id = themeCell.attr("id");

    if (themeCell.hasClass("ia-profile-theme-expand"))
    {
        var index = this._collapseIds.indexOf(id);
        if (index != -1) this._collapseIds.splice(index, 1);
        themeCell.removeClass("ia-profile-theme-expand").addClass("ia-profile-theme-collapse"); 
        //this.$table.find('tbody > tr.'+id).show();
        this.$table.find("tbody[id='"+id+"-children']").show();
    }
    else
    {
        this._collapseIds[this._collapseIds.length] = id;
        themeCell.removeClass("ia-profile-theme-collapse").addClass("ia-profile-theme-expand");
        //this.$table.find('tbody > tr.'+id).hide()
        this.$table.find("tbody[id='"+id+"-children']").hide();
    }
    this._size(); // Need to size here because scrollbar may have disappeared.
};

/**
 * Called when a indicator tr is clicked.
 *
 * @method _onIndicatorClick
 * @param {JQUERY Element} indicatorRow The indicator tr.
 * @private
 */
ia.Profile.prototype._onIndicatorClick = function(indicatorRow)
{
    if (this._tip) this._tip.hide();
    if (this.callbackFunction) this.callbackFunction.call(null, indicatorRow.data('linkId'));
};

/**
 * Selects a row.
 *
 * @method select
 * @param {String} rowId The id of the row to select.
 */ 
ia.Profile.prototype.select = function(id) 
{
    var index = this._featureIds.indexOf(id);
    if (index == -1) this._featureIds.push(id);
    this._triggerRender();
};

/**
 * Unselects a row.
 *
 * @method unselect
 * @param {String} rowId The id of the row to unselect.
 */
ia.Profile.prototype.unselect = function(id) 
{
    var index = this._featureIds.indexOf(id);
    if (index != -1) this._featureIds.splice(index, 1);
    this._triggerRender();
};

/**
 * Clears all selections.
 *
 * @method clearSelection
 */
ia.Profile.prototype.clearSelection = function() 
{   
    // Remove non - comparison features.
    var n = this._nonComparisonIds.length
    for (var i = 0; i < n; i++) 
    {
        var id = this._nonComparisonIds[i];
        var index = this._featureIds.indexOf(id);
        if (index != -1)
        {
            this._featureIds.splice(index, 1);
        }
    }
    //this._featureIds = [];
    this._triggerRender();
};

/** 
 * Triggers a render. Prevents over rendering which results in a frozen browser.
 *
 * @method _triggerRender
 * @private
 */
ia.Profile.prototype._triggerRender = function()
{
    if (!this._renderTimeout) 
    {
        this._renderTimeout = setTimeout(function()
        {
            this.render()
        }.bind(this), 5);
    }
};

/**
 * Hightlights a row.
 *
 * @method highlight
 * @param {String} rowId The id of the row to select.
 */
ia.Profile.prototype.highlight = function(rowId) {};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.Profile.prototype.clearHighlight = function() {};