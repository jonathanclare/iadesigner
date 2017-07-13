/** 
 * A class for rendering a feature card.
 *
 * @author J Clare
 * @class ia.FeatureCard
 * @extends ia.EventDispatcher
 * @constructor
 * @param {String} id The id of the feature card.
 */
ia.FeatureCard = function(id)
{		
	ia.FeatureCard.baseConstructor.call(this);

	this.id = id;
	this.displaySelectedDateOnly = false
	this.ignoreThemeIds = [];
	this.ignoreIndicatorIds = [];
	this.displayThemeHeader = false;
	this.displayFeatureHeader = false;
	this.displayMode = "All themes";
	this.dataOrder = "Order data by feature";
	this._renderTimeout = null;
	
	this._featureIds = [];	// A list of feature ids.

	this.container  = $j("<div id='"+id+"' class='ia-feature-card-scrollbox'>");
	this._scrollBox = new ia.ScrollBox(this.container);
	this.$content  = $j("<div>"); // Div to contain the html.
	this.container.append(this.$content);

	// Text substitution.
	this._textSubstitution = new ia.TextSubstitution();

	// Load the html snippet.
	this._snippet = "";	
};
ia.extend(ia.EventDispatcher, ia.FeatureCard);

/** 
 * The id.
 * 
 * @property id
 * @type String
 */
ia.FeatureCard.prototype.id;

/**
 * Specifies a geography.
 * 
 * @property geography
 * @type ia.Geography
 */
ia.FeatureCard.prototype.geography;

/**
 * Specifies a selected indicator.
 * 
 * @property indicator
 * @type ia.Indicator
 */
ia.FeatureCard.prototype.indicator;

/**
 * Display indicators for selected date only?
 * 
 * @property displaySelectedDateOnly
 * @type Boolean
 * @default false
 */
ia.FeatureCard.prototype.displaySelectedDateOnly;

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.FeatureCard.prototype.container;

/**
 * The themes to ignore.
 * 
 * @property ignoreThemeIds
 * @type String[]
 */
ia.FeatureCard.prototype.ignoreThemeIds;

/**
 * The indicators to ignore.
 * 
 * @property ignoreIndicatorIds
 * @type String[]
 */
ia.FeatureCard.prototype.ignoreIndicatorIds;

/**
 * Should theme headers be displayed.
 * 
 * @property displayThemeHeader
 * @type Boolean
 * @default false
 */
ia.FeatureCard.prototype.displayThemeHeader;

/**
 * Should feature headers be displayed.
 * 
 * @property displayFeatureHeader
 * @type Boolean
 * @default false
 */
ia.FeatureCard.prototype.displayFeatureHeader;

/**
 * The display mode.
 * 
 * @property displayMode
 * @type String
 * @default "All themes"
 */
ia.FeatureCard.prototype.displayMode;

/**
 * The list mode.
 * 
 * @property dataOrder
 * @type String
 * @default "Order data by feature"
 */
ia.FeatureCard.prototype.dataOrder;

/** 
 * The no data value.
 *
 * @property noDataValue
 * @type String
 * @default ""
 */
ia.FeatureCard.prototype.noDataValue = "";

/**
 * Sets the snippet.
 *
 * @method setSnippet
 * @param {String} url The path to the html snippet. 
 * @param {Function} callbackFunction Called once snippet has loaded. 
 */
ia.FeatureCard.prototype.setSnippet = function(url, callbackFunction) 
{
	var me = this;
	if (url != "" && url != undefined) 
	{
		me._snippet = url;

		// Check for html file - otherwise its a blob of html.
		if (me._snippet.indexOf("&lt;") == -1 
			&& me._snippet.indexOf("&gt;") == -1
			&& me._snippet.indexOf("<") == -1
			&& me._snippet.indexOf(">") == -1)
		{
			ia.File.load(
			{
				url: url,
				dataType: "html", 
				onSuccess:function(data)
				{
					me._snippet = data;
					if (callbackFunction != undefined) callbackFunction.call(null);
				}, 
				onFail:function(XMLHttpRequest, textStatus, errorThrown)
				{
					if (callbackFunction != undefined) callbackFunction.call(null);
				}
			});
		}
		else if (callbackFunction != undefined) callbackFunction.call(null);
	}
	else if (callbackFunction != undefined) callbackFunction.call(null);
};

/**
 * Renders the repeater.
 *
 * @method render
 */
ia.FeatureCard.prototype.render = function() 
{	
	this._renderTimeout = null;
	var me = this;

	if (this._snippet != "")	
	{
		// Empty the previous content.
		this.$content.empty();
		me._textSubstitution.clearVariables();

		var listByFeature = true;
		if (me.dataOrder != "Order data by feature") listByFeature = false;

		// Reverse selection so last selected feature is top of list.
		var ids = this._featureIds.concat().reverse();
		if (this.displaySelectedDateOnly) 
		{
			if (listByFeature) data = this.geography.getFeatureData(ids, this.indicator.date);
			else data = this.geography.getIndicatorData(ids, this.indicator.date);
		}
		else 
		{
			if (listByFeature) data = this.geography.getFeatureData(ids);
			else data = this.geography.getIndicatorData(ids);
		}

		if (listByFeature) this._renderFeatureList(data);
		else this._renderIndicatorList(data);
	
		this._scrollBox.refresh();
	}
};

/**
 * Renders the feature list.
 *
 * @method _renderFeatureList
 * @param {JSON} data The JSON data.
 */
ia.FeatureCard.prototype._renderFeatureList = function(data) 
{
	var me = this;
	me._textSubstitution.setVariable("geog-id", data.id);
	me._textSubstitution.setVariable("geog-name", data.name);
	var r = new Array(), index = -1;

	// Features.
	var features = data.features;
	$j.each(features, function(fIndex, feature)
	{
		me._textSubstitution.setVariable("feature-id", feature.id);
		me._textSubstitution.setVariable("feature-name", feature.name);
		me._textSubstitution.setVariable("feature-href", feature.href);
		me._textSubstitution.setVariable("feature-index", fIndex);
		$j.each(feature.properties, function(i, prop)
		{
			me._textSubstitution.setVariable(prop.name+"-value", prop.value);
			me._textSubstitution.setVariable(prop.name+"-formatted-value", prop.formattedValue);
		});

		//var $featureCard = $j("<div class='ia-feature-card'>");
		//me.$content.append($featureCard);

		r[++index] = "<div class='ia-feature-card'>";

		// Feature header.
		if (me.displayFeatureHeader)
		{
			//var $featureHeader = $j("<div id='"+feature.id+"' class='ia-feature-card-header'>").html(feature.name);
			//$featureCard.append($featureHeader);
			r[++index] = "<div id='"+feature.id+"' class='ia-feature-card-header'>"+feature.name+"</div>";
		}

		// Themes.
		index = me._renderFeatureListTheme(r, index, feature.themes);
		
		r[++index] = "</div>";

		// Clear up http://bugzilla.geowise.co.uk/show_bug.cgi?id=9985.
		$j.each(feature.properties, function(i, prop)
		{
			me._textSubstitution.setVariable(prop.name+"-value", undefined);
			me._textSubstitution.setVariable(prop.name+"-formatted-value", undefined);
		});

	});

	var t = r.join("").replace(/(\r\n|\n|\r)/gm,""); // Remove line breaks.
	this.$content.append(t);
};


/**
 * Renders the feature list.
 *
 * @method _renderFeatureListTheme
 * @param {JSON} data The JSON data.
 */
ia.FeatureCard.prototype._renderFeatureListTheme = function(r, index, themes) 
{
	var me = this;

	// Themes.
	$j.each(themes, function(tIndex, theme)
	{
		var includeTheme = true;
		if (me.displayMode == "Selected theme only") // Test if this is selected theme.
		{	
			if (me.indicator.theme.id != theme.id) includeTheme = false;
		}
		else // Test if theme is ignored.
		{
			for (var i = 0; i < me.ignoreThemeIds.length; i++) 
			{
				if (theme.id == me.ignoreThemeIds[i])
				{
					includeTheme = false;
					break;
				}
			}
		}

		if (includeTheme)
		{
			me._textSubstitution.setVariable("theme-id", theme.id);
			me._textSubstitution.setVariable("theme-name", theme.name);
			me._textSubstitution.setVariable("theme-index", tIndex);

			if (me.displayThemeHeader && theme.indicators.length > 0)
			{
				// Theme row.
				if (me.displayMode == "Selected indicator only") 
				{
					var containsIndicator = false;
					var indicators = theme.indicators;
					$j.each(indicators, function(iIndex, indicator)
					{
						if (me.indicator.id == indicator.id) containsIndicator = true
					});
					if (containsIndicator == true)
					{
						//var $themeHeader = $j("<div id='"+theme.id+"' class='ia-feature-card-sub-header'>").html(theme.name);
						//$featureCard.append($themeHeader);
						r[++index] = "<div id='"+theme.id+"' class='ia-feature-card-sub-header'>"+theme.name+"</div>";
					}
				}
				else
				{
					//var $themeHeader = $j("<div id='"+theme.id+"' class='ia-feature-card-sub-header'>").html(theme.name);
					//$featureCard.append($themeHeader);
					r[++index] = "<div id='"+theme.id+"' class='ia-feature-card-sub-header'>"+theme.name+"</div>";
				}
			}

			//var $themeContainer = $j("<div class='ia-feature-card-content'>");
			//$featureCard.append($themeContainer);
			r[++index] = "<div class='ia-feature-card-content'>";

			// Indicators.
			var indicators = theme.indicators;

			// Keep track of dates.
			var dateIndex;
			var prevId = "";

			$j.each(indicators, function(iIndex, indicator)
			{
				var includeIndicator = true;
				if (me.displayMode == "Selected indicator only") // Test if this is selected indicator.
				{	
					if (me.indicator.id != indicator.id) includeIndicator = false;
				}
				else // Test if indicator is ignored.
				{
					for (var i = 0; i < me.ignoreIndicatorIds.length; i++) 
					{
						if (indicator.id == me.ignoreIndicatorIds[i])
						{
							includeIndicator = false;
							break;
						}
					}
				}

				if (includeIndicator)
				{
					me._textSubstitution.setVariable("indicator-id", indicator.id);
					me._textSubstitution.setVariable("indicator-name", indicator.name);
					me._textSubstitution.setVariable("indicator-index", iIndex);
					me._textSubstitution.setVariable("indicator-type", indicator.type);
					me._textSubstitution.setVariable("indicator-href", indicator.href);
					me._textSubstitution.setVariable("indicator-formatted-value", indicator.formattedValue);
					me._textSubstitution.setVariable("indicator-date", indicator.date);
					if (indicator.id != prevId)
					{
						prevId = indicator.id;
						dateIndex = 0;
					}
					me._textSubstitution.setVariable("indicator-date-index", dateIndex);
					dateIndex++;

					if ((indicator.value === "null") 
						|| (indicator.value === null) 
						|| (indicator.value === "NaN") 
						|| (indicator.value === "") 
						|| (indicator.value === "No Data") 
						|| (indicator.value === undefined) 
						|| (indicator.value === me.noDataValue)) 
						me._textSubstitution.setVariable("indicator-value", "");
					else
						me._textSubstitution.setVariable("indicator-value", indicator.value);

					$j.each(indicator.associates, function(i, associate)
					{
						if ((associate.value === "null") 
							|| (associate.value === null) 
							|| (associate.value === "NaN") 
							|| (associate.value === "") 
							|| (associate.value === "No Data") 
							|| (associate.value === undefined) 
							|| (associate.value === me.noDataValue)) 
							me._textSubstitution.setVariable(associate.name+"-value", "");
						else
							me._textSubstitution.setVariable(associate.name+"-value", associate.value);

						me._textSubstitution.setVariable(associate.name+"-formatted-value", associate.formattedValue);
						me._textSubstitution.setVariable(associate.name+"-type", associate.type);
					});
					$j.each(indicator.properties, function(i, prop)
					{
						me._textSubstitution.setVariable(prop.name+"-value", prop.value);
						me._textSubstitution.setVariable(prop.name+"-formatted-value", prop.formattedValue);
					});
					if (indicator.lowerLimit) 
					{
						me._textSubstitution.setVariable("lower-limit-value", indicator.lowerLimit.value);
						me._textSubstitution.setVariable("lower-limit-formatted-value", indicator.lowerLimit.formattedValue);
					}
					if (indicator.upperLimit) 
					{
						me._textSubstitution.setVariable("upper-limit-value", indicator.upperLimit.value);
						me._textSubstitution.setVariable("upper-limit-formatted-value", indicator.upperLimit.formattedValue);
					}

					var msg = me._textSubstitution.formatMessage(me._snippet);
					//$themeContainer.append(msg);
					r[++index] = msg;

					// Clear up http://bugzilla.geowise.co.uk/show_bug.cgi?id=9985.
					$j.each(indicator.associates, function(i, associate)
					{
						me._textSubstitution.setVariable(associate.name+"-value", undefined);
						me._textSubstitution.setVariable(associate.name+"-formatted-value", undefined);
						me._textSubstitution.setVariable(associate.name+"-type", undefined);
					});
					$j.each(indicator.properties, function(i, prop)
					{
						me._textSubstitution.setVariable(prop.name+"-value", undefined);
						me._textSubstitution.setVariable(prop.name+"-formatted-value", undefined);
					});
					if (indicator.lowerLimit) 
					{
						me._textSubstitution.setVariable("lower-limit-value", undefined);
						me._textSubstitution.setVariable("lower-limit-formatted-value", undefined);
					}
					if (indicator.upperLimit) 
					{
						me._textSubstitution.setVariable("upper-limit-value", undefined);
						me._textSubstitution.setVariable("upper-limit-formatted-value", undefined);
					}
				}
			});
			r[++index] = "</div>"; 
		}

		if (theme.hasThemes)
		{
			// Nested Themes.
			index = me._renderFeatureListTheme(r, index, theme.getThemes());
		}
	});

	return index;
};

/**
 * Renders the indicator list.
 *
 * @method _renderIndicatorList
 * @param {JSON} data The JSON data.
 */
ia.FeatureCard.prototype._renderIndicatorList = function(data) 
{	
	var me = this;
	me._textSubstitution.setVariable("geog-id", data.id);
	me._textSubstitution.setVariable("geog-name", data.name);
	var r = new Array(), index = -1;

	// Themes.
	index = me._renderIndicatorListThemes(r, index, data.themes);

	var t = r.join("").replace(/(\r\n|\n|\r)/gm,""); // Remove line breaks.
	this.$content.append(t);
};

/**
 * Renders the indicator list.
 *
 * @method _renderIndicatorListThemes
 * @param {JSON} data The JSON data.
 */
ia.FeatureCard.prototype._renderIndicatorListThemes = function(r, index, themes) 
{	
	var me = this;

	$j.each(themes, function(tIndex, theme)
	{
		var includeTheme = true;
		if (me.displayMode == "Selected theme only") // Test if this is selected theme.
		{	
			if (me.indicator.theme.id != theme.id) includeTheme = false;
		}
		else // Test if theme is ignored.
		{
			for (var i = 0; i < me.ignoreThemeIds.length; i++) 
			{
				if (theme.id == me.ignoreThemeIds[i])
				{
					includeTheme = false;
					break;
				}
			}
		}

		if (includeTheme)
		{
			//var $featureCard = $j("<div class='ia-feature-card'>");
			//me.$content.append($featureCard);
			r[++index] = "<div class='ia-feature-card'>";

			me._textSubstitution.setVariable("theme-id", theme.id);
			me._textSubstitution.setVariable("theme-name", theme.name);
			me._textSubstitution.setVariable("theme-index", tIndex);

			if (me.displayThemeHeader && theme.indicators.length > 0)
			{
				// Theme row.
				if (me.displayMode == "Selected indicator only") 
				{
					var containsIndicator = false;
					var indicators = theme.indicators;
					$j.each(indicators, function(iIndex, indicator)
					{
						if (me.indicator.id == indicator.id) containsIndicator = true
					});
					if (containsIndicator == true)
					{
						//var $themeHeader = $j("<div id='"+theme.id+"' class='ia-feature-card-header'>").html(theme.name);
						//$featureCard.append($themeHeader);
						r[++index] = "<div id='"+theme.id+"' class='ia-feature-card-header'>"+theme.name+"</div>";
					}
				}
				else
				{
					//var $themeHeader = $j("<div id='"+theme.id+"' class='ia-feature-card-header'>").html(theme.name);
					//$featureCard.append($themeHeader);
					r[++index] = "<div id='"+theme.id+"' class='ia-feature-card-header'>"+theme.name+"</div>";
				}
			}

			//var $themeContainer = $j("<div class='ia-feature-card-content'>");
			//$featureCard.append($themeContainer);
			r[++index] = "<div class='ia-feature-card-content'>";

			// Indicators.
			var indicators = theme.indicators;

			// Keep track of dates.
			var dateIndex;
			var prevId = "";

			$j.each(indicators, function(iIndex, indicator)
			{
				var includeIndicator = true;
				if (me.displayMode == "Selected indicator only") // Test if this is selected indicator.
				{	
					if (me.indicator.id != indicator.id) includeIndicator = false;
				}
				else // Test if indicator is ignored.
				{
					for (var i = 0; i < me.ignoreIndicatorIds.length; i++) 
					{
						if (indicator.id == me.ignoreIndicatorIds[i])
						{
							includeIndicator = false;
							break;
						}
					}
				}

				if (includeIndicator)
				{
					// Feature header.
					if (me.displayFeatureHeader)
					{
						//var $featureHeader = $j("<div id='"+indicator.id+"' class='ia-feature-card-sub-header'>").html(indicator.name);
						//$themeContainer.append($featureHeader);
						r[++index] = "<div id='"+indicator.id+"' class='ia-feature-card-sub-header'>"+indicator.name+"</div>";
					}

					me._textSubstitution.setVariable("indicator-id", indicator.id);
					me._textSubstitution.setVariable("indicator-name", indicator.name);
					me._textSubstitution.setVariable("indicator-index", iIndex);
					me._textSubstitution.setVariable("indicator-type", indicator.type);
					me._textSubstitution.setVariable("indicator-href", indicator.href);
					me._textSubstitution.setVariable("indicator-date", indicator.date);
					if (indicator.id != prevId)
					{
						prevId = indicator.id;
						dateIndex = 0;
					}
					me._textSubstitution.setVariable("indicator-date-index", dateIndex);
					dateIndex++;

					$j.each(indicator.properties, function(i, prop)
					{
						me._textSubstitution.setVariable(prop.name+"-value", prop.value);
						me._textSubstitution.setVariable(prop.name+"-formatted-value", prop.formattedValue);
					});

					// Features.
					var features = indicator.features;
					$j.each(features, function(fIndex, feature)
					{		
						me._textSubstitution.setVariable("feature-id", feature.id);
						me._textSubstitution.setVariable("feature-name", feature.name);
						me._textSubstitution.setVariable("feature-href", feature.href);
						me._textSubstitution.setVariable("feature-index", fIndex);

						me._textSubstitution.setVariable("indicator-formatted-value", feature.formattedValue);
						if ((feature.value === "null") 
							|| (feature.value === null) 
							|| (feature.value === "NaN") 
							|| (feature.value === "") 
							|| (feature.value === "No Data") 
							|| (feature.value === undefined) 
							|| (feature.value === me.noDataValue)) 
							me._textSubstitution.setVariable("indicator-value", "");
						else
							me._textSubstitution.setVariable("indicator-value", feature.value);

						$j.each(feature.properties, function(i, prop)
						{
							me._textSubstitution.setVariable(prop.name+"-value", prop.value);
							me._textSubstitution.setVariable(prop.name+"-formatted-value", prop.formattedValue);
						});
						$j.each(feature.associates, function(i, associate)
						{
							if ((associate.value === "null") 
								|| (associate.value === null) 
								|| (associate.value === "NaN") 
								|| (associate.value === "") 
								|| (associate.value === "No Data") 
								|| (associate.value === undefined) 
								|| (associate.value === me.noDataValue)) 
								me._textSubstitution.setVariable(associate.name+"-value", "");
							else
								me._textSubstitution.setVariable(associate.name+"-value", associate.value);

							me._textSubstitution.setVariable(associate.name+"-formatted-value", associate.formattedValue);
							me._textSubstitution.setVariable(associate.name+"-type", associate.type);
						});
						if (feature.lowerLimit) 
						{
							me._textSubstitution.setVariable("lower-limit-value", feature.lowerLimit.value);
							me._textSubstitution.setVariable("lower-limit-formatted-value", feature.lowerLimit.formattedValue);
						}
						if (feature.upperLimit) 
						{
							me._textSubstitution.setVariable("upper-limit-value", feature.upperLimit.value);
							me._textSubstitution.setVariable("upper-limit-formatted-value", feature.upperLimit.formattedValue);
						}

						var msg = me._textSubstitution.formatMessage(me._snippet);
						//$themeContainer.append(msg);
						r[++index] = msg;

						// Clear up http://bugzilla.geowise.co.uk/show_bug.cgi?id=9985.
						$j.each(feature.properties, function(i, prop)
						{
							me._textSubstitution.setVariable(prop.name+"-value", undefined);
							me._textSubstitution.setVariable(prop.name+"-formatted-value", undefined);
						});
						$j.each(feature.associates, function(i, associate)
						{
							me._textSubstitution.setVariable(associate.name+"-value", undefined);
							me._textSubstitution.setVariable(associate.name+"-formatted-value", undefined);
							me._textSubstitution.setVariable(associate.name+"-type", undefined);
						});
						if (feature.lowerLimit) 
						{
							me._textSubstitution.setVariable("lower-limit-value", undefined);
							me._textSubstitution.setVariable("lower-limit-formatted-value", undefined);
						}
						if (feature.upperLimit) 
						{
							me._textSubstitution.setVariable("upper-limit-value", undefined);
							me._textSubstitution.setVariable("upper-limit-formatted-value", undefined);
						}

					});

					// Clear up http://bugzilla.geowise.co.uk/show_bug.cgi?id=9985.
					$j.each(indicator.properties, function(i, prop)
					{
						me._textSubstitution.setVariable(prop.name+"-value", undefined);
						me._textSubstitution.setVariable(prop.name+"-formatted-value", undefined);
					});
				}
			});
			r[++index] = "</div></div>"; 
		}

		if (theme.hasThemes)
		{
			// Nested Themes.
			index = me._renderIndicatorListTheme(r, index, theme.getThemes());
		}
	});

	return index;
};

/** 
 * Triggers a render. Prevents over rendering which results in a frozen browser.
 *
 * @method _triggerRender
 * @private
 */
ia.FeatureCard.prototype._triggerRender = function()
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
 * Selects.
 *
 * @method select
 * @param {String} id The id of the item.
 */
ia.FeatureCard.prototype.select = function(id) 
{
	var index = this._featureIds.indexOf(id);
	if (index == -1) this._featureIds.push(id);
	this._triggerRender();
};

/**
 * Unselects.
 *
 * @method unselect
 * @param {String} id The id of the item.
 */
ia.FeatureCard.prototype.unselect = function(id) 
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
ia.FeatureCard.prototype.clearSelection = function() 
{	
	this._featureIds = [];
	this._triggerRender();
};

/**
 * Highlights the legend class that contains the given id.
 *
 * @method highlight
 * @param {String} id The id of the item.
 */
ia.FeatureCard.prototype.highlight = function(id) {};

/**
 * Clears all highlights.
 *
 * @method clearHighlight
 */
ia.FeatureCard.prototype.clearHighlight = function() {};