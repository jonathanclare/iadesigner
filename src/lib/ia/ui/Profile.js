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

	this.displayMode = 'Selected date';
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
	this._featureIds = [];	// A list of feature ids.
	this._collapseIds = [];	// A list of collapsed ids.
	this._nonComparisonIds = []; // A list of non-comparison feature ids.

	// A div to contain the table and allow correct scrolling.
	this.container = $j('<div id="'+id+'" class="ia-table">'); 
	this._containerId = id;

	this.$tableCorner = $j('<span class="ia-table-header-corner">');
	this.container.append(this.$tableCorner);
			
	// The table used to render the headers.
	this.$tableHeaders = $j('<table>');
	this.container.append(this.$tableHeaders);
	
	// The table used to render the data.
	this.$tableContainer = $j('<div id="'+id+'-container" class="ia-table-scrollbox">'); 
	this._scrollBox = new ia.ScrollBox(this.$tableContainer);
	this.container.append(this.$tableContainer);
	
	this.$table = $j('<table>');
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
 * Display indicators for 'Selected date','Most recent date', 'All dates'?
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
 * [{id:'name', label:'Features', type:'categoric'},
 * {id:'value', label:'Indicator', type:'numeric'},
 * {id:'associate1', label:'Associate 1', type:'numeric"'},
 * {id:'associate2', label:'Associate 2', type:'categoric"'}]
 * 
 * @property columns
 * @type JSON
 */
ia.Profile.prototype.columns;

/**
 * A list of objects that describe symbols. 
 * [{shape:'arrow down', color:'#EC6768', size:'12', label:'Poor', value:'--'}]
 *
 * @property symbols
 * @type Object[]
 */
ia.Profile.prototype.symbols;

/**
 * A list of objects that describe targets. 
 * [{shape:'vertical line', color:'#EC6768', size:'12', label:'Poor', data:'target'}]
 *
 * @property targets
 * @type Object[]
 */
ia.Profile.prototype.targets;

/**
 * A list of objects that describe breaks for the performance chart. 
 * [{color:'#EC6768', label:'Poor'}]
 *
 * @property breaks
 * @type Object[]
 */
ia.Profile.prototype.breaks;

/**
 * An object that describe a bar. 
 * {color:'#EC6768', height:'12', data:'diff'}
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
	
	var bgcolor = $j('.ia-table-header').css('background-color');
	this.$tableCorner.css('background-color',bgcolor)
	this.$tableCorner.width(scrollBarWidth);
	this.$tableCorner.height(headerHeight);
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
					me.$table.find('td[id="'+theme.id+'"]').removeClass('ia-profile-theme-expand').addClass('ia-profile-theme-collapse');
					me.$table.find('tbody[id="'+theme.id+'-children"]').show();
					break;
				}
			}

			if (isCollapsed == true)
			{
				me._collapseIds[me._collapseIds.length] = theme.id;
				me.$table.find('td[id="'+theme.id+'"]').removeClass('ia-profile-theme-collapse').addClass('ia-profile-theme-expand');
				me.$table.find('tbody[id="'+theme.id+'-children"]').hide();
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
				me.$table.find('td[id="'+theme.id+'"]').removeClass('ia-profile-theme-collapse').addClass('ia-profile-theme-expand');
				me.$table.find('tbody[id="'+theme.id+'-children"]').hide();
			});
		}
		else
		{
			$j.each(themes, function(tIndex, theme)
			{
				me.$table.find('td[id="'+theme.id+'"]').removeClass('ia-profile-theme-expand').addClass('ia-profile-theme-collapse');
				me.$table.find('tbody[id="'+theme.id+'-children"]').show();
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

	if (this.displayMode == undefined) this.displayMode = 'Selected date';

	if (this.displayMode == 'Selected date') 
		this._data = this.geography.getProfileData(this._featureIds, this.indicator.date, true);
	else if (this.displayMode == 'Most recent date')
		this._data = this.geography.getProfileData(this._featureIds, undefined, true);
	else // All Dates.
		this._data = this.geography.getProfileData(this._featureIds);

	// Empty the previous table.
	this.$table.empty();
	this.$tableHeaders.empty();

	var r = new Array(), q = -1;

	// Add the col section.
	r[++q] = '<thead><tr>';

	// Iterate through each col.
	var nCol = this.columns.length;
	for (var i = 0; i < nCol; i++) 
	{
		var col = this.columns[i];
		var colWidth = col.width*100;

		var label = col.label.replace(/"/g, '&quot;');

		if (col.id == 'performance')
		{
			// The col label.
			var w = colWidth * 0.2;
			r[++q] = '<th id="'+col.id+'" class="ia-table-header" style="width:'+w+'%"></th>';
			w = colWidth * 0.6;
			r[++q] = '<th id="'+col.id+'" class="ia-table-header" title="'+label+'" style="width:'+w+'%;border-left-width:0px">'+label+'</th>';
			w = colWidth * 0.2;
			r[++q] = '<th id="'+col.id+'" class="ia-table-header" style="width:'+w+'%;border-left-width:0px">';
		}
		else
		{
			// The col label.
			r[++q] = '<th id="'+col.id+'" class="ia-table-header" title="'+label+'" style="width:'+colWidth+'%">'+label;
		}

		// Area Profile.
		if (col.id == 'profile')
		{
			var midValue = this.bar.minValue + ((this.bar.maxValue - this.bar.minValue)/2);
		
			r[++q] = '<div style="display:table;width:100%">';
				r[++q] = '<div style="display:table-cell;width:30%;text-align:left" title="'+this.bar.minValue+'">'+this.bar.minValue+'</div>';	
				r[++q] = '<div style="display:table-cell;width:40%" title="'+midValue+'">'+midValue+'</div>';		
				r[++q] = '<div style="display:table-cell;width:30%;text-align:right" title="'+this.bar.maxValue+'">'+this.bar.maxValue+'</div>';	
			r[++q] = '</div>';
			
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
		else if (col.id == 'election')
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
		else if (col.id == 'performance')
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
		else if (col.id.indexOf('health') != -1)
		{
			var minLabel = this.bar.minValue ? this.bar.minValue : '';
			var midLabel = this.bar.midValue ? this.bar.midValue : '';
			var maxLabel = this.bar.maxValue ? this.bar.maxValue : '';

			r[++q] = '<div style="display:table;width:100%">'; 	
				var w = colWidth * 0.2;
				r[++q] = '<div style="width:'+w+'%;display:table-cell;text-align:right" title="'+minLabel+'">'+minLabel+'</div>';	
				w = colWidth * 0.6;
				r[++q] = '<div style="width:'+w+'%;display:table-cell" title="'+midLabel+'">'+midLabel+'</div>';	
				w = colWidth * 0.2;
				r[++q] = '<div style="width:'+w+'%;display:table-cell;text-align:left" title="'+maxLabel+'">'+maxLabel+'</div>';	
			r[++q] = '</div>';

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
			var propsString = col.id.substring(col.id.indexOf('(')+1, col.id.indexOf(')')); 
			var propsArray = propsString.split(',');
			col.symbolAlign = 'right'; // default value.
			for (var j = 0; j < propsArray.length; j++) 
			{
				var prop = propsArray[j].split(':'); 
				var propName = prop[0];
				var propValue =  prop[1];
				col[propName] = propValue;
			}
		}
		// Symbol column.
		else if (col.id.indexOf('symbol(') != -1)
		{
			// Symbol column properties.
			var propsString = col.id.substring(col.id.indexOf('(')+1, col.id.indexOf(')')); 
			var propsArray = propsString.split(',');
			col.symbolAlign = 'right'; // default value.
			for (var j = 0; j < propsArray.length; j++) 
			{
				var prop = propsArray[j].split(':'); 
				var propName = prop[0];
				var propValue =  prop[1];
				col[propName] = propValue;
			}
		}	
		r[++q] = '</th>';
	}
	r[++q] = '</tr></thead>';
	this.$tableHeaders.html(r.join(''));
	
	// Dummy hidden row to maintain column widths - which are lost if theme colspan is applied first.
	r = new Array(), q = -1;
	r[++q] = '<tr class="ia-table-row">';
	var adjustedNCol = nCol;
	for (var j = 0; j < nCol; j++) 
	{
		var col = this.columns[j];
		var colWidth = col.width*100;	

		if ((col.id == 'performance' || col.id.indexOf('health') != -1) && this.includeMinMaxColumns)
		{
			adjustedNCol = nCol + 2;
			var w = colWidth * 0.2
			r[++q] = '<td class="ia-table-cell" style="width:'+w+'%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px"></td>';
			w = colWidth * 0.6
			r[++q] = '<td class="ia-table-cell" style="width:'+w+'%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px"></td>';
			w = colWidth * 0.2
			r[++q] = '<td class="ia-table-cell" style="width:'+w+'%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px"></td>';
		}
		else
		{
			r[++q] = '<td class="ia-table-cell" style="width:'+colWidth+'%;padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px"></td>';
		}
	}
	r[++q] = '</tr>';
	this.$table.append(r.join(''));

	// Themes.
	var themes = this._data.themes;
	var me = this;
	$j.each(themes, function(tIndex, theme)
	{
		r = new Array(), q = -1;

		var label = theme.name.replace(/"/g, '&quot;');

		r[++q] = '<tbody>';
			r[++q] = '<tr class="ia-table-row">';
				r[++q] = '<td id="'+theme.id+'" class="ia-table-cell ia-profile-theme-name-cell ia-profile-theme-collapse ia-profile-row" title="'+label+'" colspan="'+adjustedNCol+'">'+label+'</td>';
			r[++q] = '</tr>';
		r[++q] = '</tbody>';
		
		r[++q] = '<tbody id="'+theme.id+'-children">';

		// Indicators.
		var indicators = theme.indicators;
		$j.each(indicators, function(iIndex, indicator)
		{
			var features = indicator.features;
			
			// No features selected.
			if (features.length == 0)
			{
				var linkId = indicator.id;
				if (indicator.date != undefined) linkId = indicator.id+'~'+indicator.date;
				
				// Style even and odd rows differently.
				if (iIndex%2 == 0) 	
					r[++q] = '<tr id="'+indicator.id+'" class="ia-table-row ia-profile-row ia-table-row-even indicator-row" data-linkId="'+linkId+'">';
				else  			
					r[++q] = '<tr id="'+indicator.id+'" class="ia-table-row ia-profile-row ia-table-row-odd indicator-row" data-linkId="'+linkId+'">';
				
				// Iterate through each table cell in the row - match to columns.
				for (var j = 0; j < nCol; j++) 
				{
					var col = me.columns[j];
					var colWidth = col.width*100;
					
					if ((col.id == 'performance' || col.id.indexOf('health') != -1) && this.includeMinMaxColumns)
					{
						var w = colWidth * 0.2
						r[++q] = '<td class="ia-table-cell" style="width:'+w+'%"></td>';
						w = colWidth * 0.6
						r[++q] = '<td class="ia-table-cell" style="width:'+w+'%;border-left-width:0px"></td>';
						w = colWidth * 0.2
						r[++q] = '<td class="ia-table-cell" style="width:'+w+'%;border-left-width:0px"></td>';
					}
					else if (col.id == 'indicatorName') 
					{
						var title;
						if (me.displayDatesInProfile)
						{
							if (indicator.date) title = indicator.name+' ('+indicator.date+')';
							else title = indicator.name;
						}
						else  title = indicator.name;

						title = title.replace(/"/g, '&quot;');
						r[++q] = '<td class="ia-profile-indicator-name-cell" style="width:'+colWidth+'%" title="'+title+'">';

						if (me.displayDatesInProfile)
						{
							if (indicator.href) r[++q] = '<span class="ia-table-notes-icon" onmouseover="event.stopPropagation()" ontouchstart="event.stopPropagation()" onclick="event.stopPropagation();window.open(\''+indicator.href+'\', \'_blank\')"></span>';
							if (indicator.date) r[++q] = indicator.name+' ('+indicator.date+')';
							else r[++q] = indicator.name;
						}
						else 
						{
							if (indicator.href) r[++q] = '<span class="ia-table-notes-icon" onmouseover="event.stopPropagation()" ontouchstart="event.stopPropagation()" onclick="event.stopPropagation();window.open(\''+indicator.href+'\', \'_blank\')"></span>';
							r[++q] = indicator.name;
						}
						r[++q] = '</td>';
					}
					else
					{
						r[++q] = '<td class="ia-table-cell" style="width:'+colWidth+'%"></td>';
					}
				}
				r[++q] = '</tr>';
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
				var linkId = indicator.id;
				if (indicator.date != undefined) linkId = indicator.id+'~'+indicator.date;

				if (iIndex%2 == 0) 	
					r[++q] = '<tr id="'+indicator.id+'" class="ia-table-row ia-profile-row ia-table-row-even indicator-row" data-linkId="'+linkId+'">';
				else  			
					r[++q] = '<tr id="'+indicator.id+'" class="ia-table-row ia-profile-row ia-table-row-odd indicator-row" data-linkId="'+linkId+'">';
				
				// Columns.
				for (var j = 0; j < nCol; j++) 
				{
					var col = me.columns[j];

					var formattedData = feature[col.formattedId];
					var colWidth = col.width*100;
					
					// First indicator row and with indicator name column.
					if (fIndex == 0 && col.id == 'indicatorName')
					{	
						var title;
						if (me.displayDatesInProfile)
						{
							if (indicator.date) title = indicator.name+' ('+indicator.date+')';
							else title = indicator.name;
						}
						else  title = indicator.name;

						title = title.replace(/"/g, '&quot;');
						r[++q] = '<td class="ia-profile-indicator-name-cell" rowspan="'+features.length+'" style="width:'+colWidth+'%" title="'+title+'">';

						if (me.displayDatesInProfile)
						{
							if (indicator.href) r[++q] = '<span class="ia-table-notes-icon" onmouseover="event.stopPropagation()" ontouchstart="event.stopPropagation()" onclick="event.stopPropagation();window.open(\''+indicator.href+'\', \'_blank\')"></span>';
							if (indicator.date) r[++q] = indicator.name+' ('+indicator.date+')';
							else r[++q] = indicator.name;
						}
						else 
						{
							if (indicator.href) r[++q] = '<span class="ia-table-notes-icon" onmouseover="event.stopPropagation()" ontouchstart="event.stopPropagation()" onclick="event.stopPropagation();window.open(\''+indicator.href+'\', \'_blank\')"></span>';
							r[++q] = indicator.name;
						}
						r[++q] = '</td>';
					}
					// Feature name column
					else if (col.id == 'name')
					{
						r[++q] = '<td class="ia-table-cell ia-table-cell-categoric" style="width:'+colWidth+'%" title="'+formattedData+'">'+formattedData+'</td>';
					}
					// Area Profile.
					else if (col.id == 'profile' || col.id == 'election')
					{
						r[++q] = '<td class="ia-table-cell ia-profile-cell" style="width:'+colWidth+'%">';
						r[++q] = me._getProfileSvg(feature, col);
						r[++q] = '</td>'
					}
					// Peformance.
					else if (col.id == 'performance' || col.id.indexOf('health') != -1)
					{
						r[++q] = me._getPerformanceSvg(feature, indicator, col);
					}
					// Symbol column.
					else if (col.id.indexOf('symbol(') != -1)
					{
						var strText = "";
						if (col.textValue != undefined)
						{
							strText = feature[col.textValue+'_formatted'];
							if (col.textValue == 'indicatorName') 	
							{
								if (me.displayDatesInProfile)
								{
									if (indicator.date) strText = indicator.name+' ('+indicator.date+')';
									else strText = indicator.name;
								}
								else strText = indicator.name;
							}
							else if (col.textValue == 'name') strText = feature['name'];
						}

						var symbolValue = feature[col.symbolValue];
						var strSymbol = "";
						if (symbolValue != undefined)
						{
							for (var i = 0; i < me.symbols.length; i++) 
							{
								var symbol = me.symbols[i];
								if (symbol.value == symbolValue) 
								{
									strSymbol += "<svg style='overflow:hidden;width:"+symbol.size+"px;height:"+symbol.size+"px;' preserveAspectRatio='none'>"
										//strSymbol += "<path d='"+ia.SvgShape.drawVerticalLine(symbol.size/2, symbol.size/2, symbol.size)+"' fill='"+symbol.color+"'><title>"+symbol.label+"</title></path>";
					    				strSymbol += "<path d='"+ia.SvgShape.draw(symbol.shape, symbol.size/2, symbol.size/2, symbol.size)+"' fill='"+symbol.color+"'><title>"+symbol.label+"</title></path>";
					    			strSymbol += "</svg>"
									break;
								}
							}
						}

						r[++q] = '<td class="ia-table-cell ia-symbol-cell" style="width:'+colWidth+'%;vertical-align:middle;text-align:'+col.symbolAlign+'">';
							if (col.symbolAlign == 'right')
							{
								r[++q] = strText + "&nbsp;";
								r[++q] = strSymbol;
							}
							else if (col.symbolAlign == 'left')
							{
								r[++q] = strSymbol;
								r[++q] = "&nbsp;" + strText;
							}
							else
							{
								r[++q] = strSymbol;
							}
						r[++q] = '</td>'
					}
					// Indicator column.
					else if (col.id == 'value')
					{
						var className;
						if (indicator.type == 'categoric') 
							className = 'ia-table-cell-categoric';
						else  
							className = 'ia-table-cell-numeric';

						if (formattedData != undefined) 
							r[++q] = '<td class="ia-table-cell '+className+'" style="width:'+colWidth+'%" title="'+formattedData+'">'+formattedData+'</td>';
						else
							r[++q] = '<td class="ia-table-cell '+className+'" style="width:'+colWidth+'%"></td>';
					}
					// Associate column.
					else if (col.id != 'indicatorName' && col.id != 'name')
					{
						var type = feature[col.id+'_type'];
						var className;
						if (type == 'categoric') 
							className = 'ia-table-cell-categoric';
						else  
							className = 'ia-table-cell-numeric';

						if (formattedData != undefined) 
							r[++q] = '<td class="ia-table-cell '+className+'" style="width:'+colWidth+'%" title="'+formattedData+'">'+formattedData+'</td>';
						else
							r[++q] = '<td class="ia-table-cell '+className+'" style="width:'+colWidth+'%"></td>';
					}
				}
				r[++q] = '</tr>';
			});	
		});
		r[++q] = '</tbody>';
		me.$table.append(r.join(''));
	});

	// Check if any themes have been collapsed.
	for (var i = 0; i < this._collapseIds.length; i++) 
	{
		var id = this._collapseIds[i];
		this.$table.find('td[id="'+id+'"]').removeClass('ia-profile-theme-collapse').addClass('ia-profile-theme-expand');
		this.$table.find('tbody[id="'+id+'-children"]').hide();
	}

	this._scrollBox.refresh();
	this._size();

	var e = new ia.Event("onRender", this);
	this.dispatchEvent(e);
};

ia.Profile.prototype._getProfileSvg = function(feature, col)
{
	var r = [], q = -1;

	var barValue = feature[this.bar.data];
	var barValue_formatted = feature[this.bar.data+"_formatted"];
	var symbolValue = feature[this.bar.symbolValue];
	var range = this.bar.maxValue - this.bar.minValue;

	r[++q] = "<div style='position:relative'>";

	// Draw bar.
	if (ia.isNumber(barValue))
	{
		// Check if its a comparison feature.
		var barFill;
		var comparisonColor;
		if (feature.isComparison && this.comparisonThematic)
		{
			var legendClass = this.comparisonThematic.getClass(feature.id);
			if (legendClass != undefined) comparisonColor = legendClass.color;	
		}

		// Bar color
		if (comparisonColor != undefined)
		{
			barFill = comparisonColor;
		}
		else if (this.colorPalette) // Use legend color
		{
			var n = this._nonComparisonIds.length;
			var colorList = this.colorPalette.getColors(n);
			var index = this._nonComparisonIds.indexOf(feature.id);
			barFill = colorList[index];	
		}
		else if (symbolValue != undefined) // Use symbol color - used by election template.
		{
			var n = this.symbols.length;
			for (var i = 0; i < n; i++) 
			{
				var symbol = this.symbols[i];
				if (symbol.value == symbolValue)
				{
					barFill = symbol.color;
					break;
				}
			}
		}
		else // Use default color
			barFill = this.bar.color;

		var barW = Math.abs(barValue);
		var barH = this.bar.height;
		var barY = 0;
		var barX = 0;
		if (barValue < 0) barX = barValue;

		var marginTop = (barH / 2) * -1;

		if (this.bar.shape == "bar" || this.bar.shape == undefined) 
		{
			// Draw Bar.
			r[++q] = "<svg style='overflow:hidden;position:absolute;left:0px;top:50%;margin-top:"+marginTop+"px;width:100%;height:"+barH+"px' preserveAspectRatio='none' viewBox='"+this.bar.minValue+" 0 "+range+" "+barH+"'>";
  				r[++q] = "<rect x='"+barX+"' y='"+barY+"' width='"+barW+"' height='"+barH+"' fill='"+barFill+"'><title>"+barValue_formatted+"</title></rect>";
			r[++q] = "</svg>";
  		}
  		else
  		{
            // Draw center line.
			var target = {};
			target.color = "#cccccc";
			target.size = barH;
			target.shape = ia.Shape.VERTICAL_LINE;
			r[++q] = this._drawTarget(target, 0, 0, this.bar.minValue, this.bar.maxValue, range, col.canvasHeight);

			// Draw Shape.
			var target = {};
			target.color = barFill;
			target.size = barH;
			target.shape = this.bar.shape;
			r[++q] = this._drawTarget(target, barValue, barValue_formatted, this.bar.minValue, this.bar.maxValue, range, col.canvasHeight);
  		}
  	}

	// Draw targets.
	var n = this.targets.length;
	for (var i = 0; i < n; i++) 
	{
		var target = this.targets[i];
		var targetValue = feature[target.data];
		var targetValueFormatted = feature[target.data+"_formatted"];
		if (targetValue != undefined) r[++q] = this._drawTarget(target, targetValue, target.label + ' : ' + targetValueFormatted, this.bar.minValue, this.bar.maxValue, range, col.canvasHeight);
	}

    r[++q] = "</div>"
	return r.join('');
};

ia.Profile.prototype._getPerformanceSvg = function(feature, indicator, col)
{
	var r = [], q = -1;

	var className;
	if (col.id == 'performance') 
		className = 'ia-performance-cell';
	else if (col.id.indexOf('health') != -1) 
		className = 'ia-health-cell';

	var colWidth = col.width*100;
	var barValue = feature[this.bar.data];
	var barValue_formatted = feature[this.bar.data+"_formatted"];
	var breaksFlip = feature[this.bar.breaksFlip];

	// Attach breaks values.
	var breaksArray, fBreaksArray, minValue, maxValue, fMinValue, fMaxValue;
	if (this.bar.breaksData)
	{
		var breaksString = feature[this.bar.breaksData];
		if (breaksString != undefined)
		{
			breaksArray = breaksString.split(',');
			fBreaksArray = [];
			minValue = Infinity;
			maxValue = -Infinity;
			var n = breaksArray.length;
			for (var i = 0; i < n; i++) 
			{
				var breakValue = breaksArray[i];
				fBreaksArray.push(this.formatter.format(breakValue));
				minValue = Math.min(minValue, breakValue);
				maxValue = Math.max(maxValue, breakValue);
			}
			fMinValue = this.formatter.format(minValue);
			fMaxValue = this.formatter.format(maxValue);
		}
	}
	if (breaksArray == undefined)
	{
		if (this.bar.data == 'value' || this.bar.data == undefined)
		{
			minValue = indicator.minValue;
			maxValue = indicator.maxValue;
			fMinValue = indicator.minValue_formatted;
			fMaxValue = indicator.maxValue_formatted;
			breaksArray = [indicator.minValue, indicator.lowerQuartile, indicator.upperQuartile, indicator.maxValue]
			fBreaksArray = [indicator.minValue_formatted, indicator.lowerQuartile_formatted, indicator.upperQuartile_formatted, indicator.maxValue_formatted];
		}
		else
		{
			minValue = indicator[this.bar.data+'_minValue'];
			maxValue = indicator[this.bar.data+'_maxValue'];
			fMinValue = indicator[this.bar.data+'_minValue_formatted'];
			fMaxValue = indicator[this.bar.data+'_maxValue_formatted'];
			breaksArray = [indicator[this.bar.data+'_minValue'], [this.bar.data+'_lowerQuartile'], indicator[this.bar.data+'_upperQuartile'], indicator[this.bar.data+'_maxValue']];
			fBreaksArray = [indicator[this.bar.data+'_minValue_formatted'],  indicator[this.bar.data+'_lowerQuartile_formatted'], indicator[this.bar.data+'_upperQuartile_formatted'], indicator[this.bar.data+'_maxValue_formatted']];
		}
	}

	breaksArray = breaksArray.map(function(item) 
	{
    	return parseFloat(item);
	});
	minValue = parseFloat(minValue);
	maxValue = parseFloat(maxValue);
	var range = maxValue - minValue;

/*
	console.log(minValue)
	console.log(maxValue)
	console.log(fMinValue)
	console.log(fMaxValue)
	console.log(breaksArray)
	console.log(fBreaksArray)
*/

	// Health Profile.
	if (className == 'ia-health-cell')
	{
		var symbolValue = feature[col.symbolValue];
		var areaValue = feature[col.areaValue];
		var nationalValue = feature[col.nationalValue];
		var areaValueFormatted = feature[col.areaValue+"_formatted"];
		var nationalValueFormatted = feature[col.nationalValue+"_formatted"];

		if (nationalValue == undefined) 
		{
			if (this.bar.data == 'value' || this.bar.data == undefined)
			{
				nationalValue = indicator.median; // Default value if it hasnt been defined.
				nationalValueFormatted = indicator.median_formatted;
			}
			else
			{
				nationalValue = indicator[this.bar.data+'_median']; // Default value if it hasnt been defined.
				nationalValueFormatted = indicator[this.bar.data+'_median_formatted'];
			}
		}

    	var diff = Math.max(Math.abs(maxValue - nationalValue), Math.abs(nationalValue - minValue));
    	minValue = nationalValue - diff;
    	maxValue = nationalValue + diff;
		range = maxValue - minValue;
	}

	// Check for reverse breaks ie 84,68,35,7.
	var reverseBreaks = false;
	if (breaksArray[0] > breaksArray[1]) 
	{
		reverseBreaks = true;
		breaksArray.reverse();
		fBreaksArray.reverse();
		var temp = fMinValue;
		fMinValue = fMaxValue;
		fMaxValue = temp;
	}

	// Min Value.
	if (this.includeMinMaxColumns)
	{
		var w = colWidth * 0.2
		r[++q] = '<td class="ia-table-cell" style="text-align:right" style="width:'+w+'%" title="'+fMinValue+'">'+fMinValue+'</td>';	
		w = colWidth * 0.6
		r[++q] = '<td class="ia-table-cell '+className+'" style="width:'+w+'%;border-left-width:0px">';
	}
	else r[++q] = '<td class="ia-table-cell '+className+'" style="width:'+colWidth+'%">';

	// Draw breaks.
	var marginTop = (col.canvasHeight / 2) * -1;

	r[++q] = "<div style='position:relative'>";
	r[++q] = "<svg style='overflow:hidden;position:absolute;left:0px;top:50%;margin-top:"+marginTop+"px;width:100%;height:"+col.canvasHeight+"px' preserveAspectRatio='none' viewBox='"+minValue+" 0 "+range+" "+col.canvasHeight+"'>";
	
	var n = this.breaks.length;
	for (var i = 0; i < n; i++) 
	{
		if (breaksArray.length > i+1)
		{
			var brk = this.breaks[i];
            if (breaksFlip == true || breaksFlip == "true" || breaksFlip == "TRUE" || breaksFlip == "True")  var brk = this.breaks[n-i-1];

			var breakValue1 = breaksArray[i];
			var j = i+1;
			var breakValue2 = breaksArray[j];

			var breakWidth = Math.abs(breakValue2 - breakValue1);
			var breakX = breakValue1;
			if (reverseBreaks) breakX = (maxValue - (breakX - minValue)) - breakWidth;

			var breakLabel = brk.label + ' : ' + fBreaksArray[i] + ' - ' + fBreaksArray[j];

			// Draw break.
			r[++q] = "<rect x='"+breakX+"' y='0' width='"+breakWidth+"' height='"+col.canvasHeight+"' fill='"+brk.color+"'><title>"+breakLabel+"</title></rect>";
		}
	}

	// Draw bar.
	if (ia.isNumber(barValue))
	{
		// Check if its a comparison feature.
		var barFill;
		var comparisonColor;
		if (feature.isComparison && this.comparisonThematic)
		{
			var legendClass = this.comparisonThematic.getClass(feature.id);
			if (legendClass != undefined) comparisonColor = legendClass.color;	
		}

		// Bar color
		if (comparisonColor != undefined)
		{
			barFill = comparisonColor;
		}
		else if (this.colorPalette) // Use legend color
		{
			var n = this._nonComparisonIds.length;
			var colorList = this.colorPalette.getColors(n);
			var index = this._nonComparisonIds.indexOf(feature.id);
			barFill = colorList[index];	
		}
		else // Use default color
			barFill = this.bar.color;

		var barW = barValue;
		var barH = this.bar.height;
		var barY = (col.canvasHeight - barH) / 2;
		var barX = 0;
		if (reverseBreaks) barX = (maxValue + minValue) - barW;

		if (this.bar.shape == "bar" || this.bar.shape == undefined) 
		{
			// Draw Bar.
  				r[++q] = "<rect x='"+barX+"' y='"+barY+"' width='"+barW+"' height='"+barH+"' fill='"+barFill+"'><title>"+barValue_formatted+"</title></rect>";
			r[++q] = "</svg>";
  		}
  		else
  		{
			r[++q] = "</svg>";

			// Draw Shape.
			var target = {};
			target.color = barFill;
			target.size = barH;
			target.shape = this.bar.shape;
			r[++q] = this._drawTarget(target, barValue, barValue_formatted, minValue, maxValue, range, col.canvasHeight);
  		}
  	}
  	else r[++q] = "</svg>";

	if (className == 'ia-health-cell')
	{
		// Draw center line.
		var target = {};
		target.color = "#999999";
		target.size = 14;
		target.shape = ia.Shape.VERTICAL_LINE;
		r[++q] = this._drawTarget(target, nationalValue, nationalValueFormatted, minValue, maxValue, range, col.canvasHeight, reverseBreaks);
			
		// Draw area symbol.
		if (symbolValue != undefined)
		{
			var n = this.symbols.length;
			for (var i = 0; i < n; i++) 
			{
				var symbol = this.symbols[i];
				if (symbol.value == symbolValue)
				{
					r[++q] = this._drawTarget(symbol, areaValue, symbol.label + ' : ' + areaValueFormatted, minValue, maxValue, range, col.canvasHeight, reverseBreaks)
					break;
				}
			}
		}
		else // If no symbol is found just draw it as a target line.
		{
			var symbol = {};
			symbol.color = this.bar.color;
			symbol.size = 14;
			symbol.shape = ia.Shape.DIAMOND;
			r[++q] = this._drawTarget(symbol, areaValue, areaValueFormatted, minValue, maxValue, range, col.canvasHeight, reverseBreaks);
		}
	}

	// Draw targets.
	var n = this.targets.length;
	for (var i = 0; i < n; i++) 
	{
		var target = this.targets[i];
		var targetValue = feature[target.data];
		var targetValueFormatted = feature[target.data+"_formatted"];
		if (targetValue != undefined) r[++q] = this._drawTarget(target, targetValue, target.label + ' : ' + targetValueFormatted, minValue, maxValue, range, col.canvasHeight, reverseBreaks);
	}

    r[++q] = "</div></td>"

	// Max Value.
	if (this.includeMinMaxColumns)
	{
		w = colWidth * 0.2
		r[++q] = '<td class="ia-table-cell" style="text-align:left;border-left-width:0px" style="width:'+w+'%" title="'+fMaxValue+'">'+fMaxValue+'</td>';
	}

	return r.join('');
};

ia.Profile.prototype._drawTarget = function(target, value, label, minValue, maxValue, range, canvasHeight, reverseAxis)
{		
	var x = ((value - minValue) / range) * 100;
	if (reverseAxis) x = 100 - x; 
	var cp = canvasHeight / 2;
	var margin = cp * -1;

	var r = [], q = -1;
	r[++q] = "<svg style='overflow:hidden;position:absolute;left:"+x+"%;top:50%;margin-left:"+margin+"px;margin-top:"+margin+"px;width:"+canvasHeight+"px;height:"+canvasHeight+"px' preserveAspectRatio='none'>"
		r[++q] = "<path d='"+ia.SvgShape.draw(target.shape, cp, cp, target.size)+"' fill='"+target.color+"'></path>";
  		r[++q] = "<rect fill-opacity='0' x='0' y='0' width='"+canvasHeight+"' height='"+canvasHeight+"'><title>"+label+"</title></rect>";
    r[++q] = "</svg>"

	/*r[++q] = "<svg style='overflow:hidden;position:absolute;left:"+x+"%;top:50%;margin-left:"+marginLeft+"px;margin-top:"+marginTop+"px;width:"+w+"px;height:"+h+"px' preserveAspectRatio='none'>"
		r[++q] = "<path d='"+ia.SvgShape.drawVerticalLine(w/2, h/2, h)+"' fill='"+target.color+"'><title>"+label+"</title></path>";
    r[++q] = "</svg>"*/
	return r.join('');
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
	this.$table.delegate("td.ia-profile-theme-name-cell", 'click', function(e)
	{
		me._onThemeClick($j(this));
	});
	if (this._useMouseClick)
	{
		// Indicator Click.
		this.$table.delegate("tr.indicator-row", 'click', function(e)
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
	var id = themeCell.attr('id');

	if (themeCell.hasClass('ia-profile-theme-expand'))
	{
		var index = this._collapseIds.indexOf(id);
		if (index != -1) this._collapseIds.splice(index, 1);
		themeCell.removeClass('ia-profile-theme-expand').addClass('ia-profile-theme-collapse'); 
		this.$table.find('tbody[id="'+id+'-children"]').show();
	}
	else
	{
		this._collapseIds[this._collapseIds.length] = id;
		themeCell.removeClass('ia-profile-theme-collapse').addClass('ia-profile-theme-expand');
		this.$table.find('tbody[id="'+id+'-children"]').hide();
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
	if (this.callbackFunction) this.callbackFunction.call(null, indicatorRow.data("linkid"));
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