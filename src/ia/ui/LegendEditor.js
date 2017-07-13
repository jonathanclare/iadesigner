/**
 * An editor for thematics.
 *
 * @author J Clare
 * @class ia.LegendEditor
 * @constructor
 * @param {ia.Thematic} thm The theme
 * @param {ia.ReportConfig} config The report config. 
 * @param {Object} legendSettings The legend settings {paletteId:String, schemeId:String, legendType:String}. 
 * @param {Object} options A set of functions to call {onPaletteChanged: function(palette), onSchemeChanged: function(palette), 
 * onClassificationChanged: function(classificationName), onPaletteFlipped: function(palette), 
 * onNoClassesChanged: function(noClasses), onSymbolSizeChanged: function(minSize, maxSize)}. 
 */
ia.LegendEditor = function(thm, config, legendSettings, options)
{
	var me = this;

	this.showLegendTypePanel = true;
	this.showLegendTools = true;
	this.showPalettePanel = true;
	this.showSizePanel = true;

	this._options = options;
	this._updateTimeout = undefined;
	this._lockEditor = false;
	this._isVisible = false;
	this._thematic = thm;
	this._thematic.addEventListener(ia.Event.THEME_CHANGED,function() {me.render()}, me);
	this._reportConfig = config;
	this._settings = legendSettings;
	this._dataType = this._thematic.getDataType();
	
	// Create the container element.
	this.container = $j('<div class="ia-editor"></div>');
	$j("body").bind("click", function(e) 
	{
		me.hide();
	});
	this.container.bind("click", function(e) 
	{
		e.stopPropagation();
	});

	// Initialise.
	me.render();
};

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.LegendEditor.prototype.container;

/**
 * Display the legend type panel?
 * 
 * @property showLegendTypePanel
 * @type Boolean
 * @default true
 */
ia.LegendEditor.prototype.showLegendTypePanel;

/**
 * Display the legend tools panel?
 * 
 * @property showLegendTools
 * @type Boolean
 * @default true
 */
ia.LegendEditor.prototype.showLegendTools;

/**
 * Display the palette panel?
 * 
 * @property showPalettePanel
 * @type Boolean
 * @default true
 */
ia.LegendEditor.prototype.showPalettePanel;

/**
 * Display the size panel?
 * 
 * @property showSizePanel
 * @type Boolean
 * @default true
 */
ia.LegendEditor.prototype.showSizePanel;

/** 
 * Change the parameters.
 *
 * @method setParams
 * @param {ia.Thematic} thm The theme
 * @param {ia.ReportConfig} config The report config. 
 * @param {Object} legendSettings The legend settings {paletteId:String, schemeId:String, legendType:String}. 
 */
ia.LegendEditor.prototype.setParams = function(thm, config, legendSettings) 
{
	var me = this;
	this._thematic 		= thm;
	this._thematic.removeListener(me);
	this._thematic.addEventListener(ia.Event.THEME_CHANGED,function() {me.render()});
	this._reportConfig 	= config;
	this._settings 		= legendSettings;
	this._dataType 	 	= this._thematic.getDataType();
	this.render();
};

/** 
 * Render the legend editor after changes.
 *
 * @method render
 */
ia.LegendEditor.prototype.render = function() 
{
	var me = this;
	this.container.empty();
	
	// Holds the menu.
	var menu = $j("<div>");
	this.container.append(menu);
	
	var nClassifier = this._thematic.numericClassifier;
	var cClassifier = this._thematic.categoricClassifier;
	var paletteConfig = this._reportConfig.getMapPalette();

	if (this._thematic.getDataType() == ia.Thematic.CATEGORIC) // Categoric.	
	{
		if (this._dataType != ia.Thematic.CATEGORIC && me._options && me._options.onDataTypeChanged) 
		{
			this._dataType = ia.Thematic.CATEGORIC;
			me._options.onDataTypeChanged.call(null, ia.Thematic.CATEGORIC, cClassifier.colorPalette);
		}

		if (this.showPalettePanel)
		{
			// Palette Panel.
			var $paletteTable = $j("<table class='ia-editor-panel ia-editor-palette-panel'>");
			menu.append($paletteTable);

			var $paletteTableRow = $j("<tr>");
			$paletteTable.append($paletteTableRow);

			var $td = $j("<td>");
			$paletteTableRow.append($td);

			// Color Panel.
			var $table = $j("<table class='ia-editor-color-panel'>");
			$td.append($table);

			var $tr = $j("<tr>");
			$table.append($tr);

			var palettes = paletteConfig.getColorSchemes();
			for (var i = 0; i < palettes.length; i++) 
			{
				var p = palettes[i];

				// Palette button.
				var $td = $j("<td class='ia-list-item'>");
				$tr.append($td);
				(function() // Execute immediately
				{ 
					var palette = p;
					$td.bind("click", function(e)
					{ 
						cClassifier.colorPalette = palette;
						me._settings.schemeId = palette.id;
						me._updateTheme();

						if (me._options && me._options.onSchemeChanged) me._options.onSchemeChanged.call(null, cClassifier.colorPalette);
					});
				})();

				// Color swatches.
				var colorList = p.getColorList();
				for (var j = 0; j < colorList.length; j++) 
				{
					var color = colorList[j];
					var $colorswatch = $j("<div class='ia-editor-color-panel-discrete-swatch'>");
					if (p.id ==  cClassifier.colorPalette.id) $colorswatch.addClass("ia-editor-swatch-selected")
					$colorswatch.css({"background-color" : color});
					$td.append($colorswatch);
				}
			}
		}
		
		if (this._thematic.symbol != ia.Shape.SQUARE)  // Categoric Symbol Size
		{
			if (this.showSizePanel)
			{
				// Separator.
				if (this.showPalettePanel)
				{
					var $separator = $j("<div class='ia-editor-separator'>");
					menu.append($separator);
				}

				// Symbol size.
				var pointIncrementSize = 5;
				var minAllowedPointSize = 5;
				if (this._thematic.symbol == ia.Shape.LINE) 
				{
					pointIncrementSize = 1;
					minAllowedPointSize = 1;
				}
				var symbolSize = cClassifier.symbolSize;

				// Size Panel.
				var $sizeTable = $j("<table class='ia-editor-panel ia-editor-size-panel'>");
				menu.append($sizeTable);

				var $tr = $j("<tr>");
				$sizeTable.append($tr);

				// Decrease symbol size.
				var $td = $j("<td class='ia-list-item' style='width:50px'>").html("-");
				$tr.append($td);
				$td.bind("click", function(e) 
				{ 
					var size = symbolSize - pointIncrementSize;
					if (size < minAllowedPointSize) size = minAllowedPointSize;
					cClassifier.symbolSize = size;
					me._updateTheme();

					if (me._options && me._options.onSymbolSizeChanged) me._options.onSymbolSizeChanged.call(null, cClassifier.symbolSize);
				});

				// Symbol.
				var $td = $j("<td style='padding:5px'>");
				$tr.append($td);

				var canvas = document.createElement('canvas');
				canvas.width = symbolSize + 2;
				if (this._thematic.symbol == ia.Shape.LINE) canvas.width = 100;
				canvas.height = symbolSize + 2;
				$td.append($j(canvas))
				var context = canvas.getContext("2d");

				if (this._thematic.symbol == ia.Shape.LINE)
				{
					context.strokeStyle = "#cccccc";
					context.lineWidth = symbolSize;
					context.beginPath();
						ia.Shape.draw(this._thematic.symbol, context, canvas.width/2, canvas.height/2, canvas.width);
					context.stroke();
				}
				else
				{
					context.strokeStyle = "#cccccc";
					context.fillStyle = "#f9f9f9";
					context.lineWidth = 1;
					context.beginPath();
					ia.Shape.draw(this._thematic.symbol, context, canvas.width/2, canvas.height/2, symbolSize);
					context.fill();
					context.stroke();
				}

				// Increase Symbol Size
				var $td = $j("<td class='ia-list-item' style='width:50px'>").html("+");
				$tr.append($td);
				$td.bind("click", function(e) 
				{ 
					cClassifier.symbolSize = (symbolSize + pointIncrementSize);
					me._updateTheme();
					
					if (me._options && me._options.onSymbolSizeChanged) me._options.onSymbolSizeChanged.call(null, cClassifier.symbolSize);
				});
			}
		}

	}
	else  // Numeric.	
	{
		
		if (this._dataType != ia.Thematic.NUMERIC && me._options && me._options.onDataTypeChanged) 
		{
			this._dataType = ia.Thematic.NUMERIC; 
			me._options.onDataTypeChanged.call(null, ia.Thematic.NUMERIC, nClassifier.colorPalette);
		}

		// Current classifier name.
		var cName = nClassifier.classificationName;
		//if (cName != "customClassifier")
		//{
			var $table = $j("<table class='ia-editor-panel ia-editor-classifier-panel'>");
			menu.append($table);
					
			var $tr = $j("<tr>");
			$table.append($tr);

			if (this.showLegendTypePanel)
			{
				// Classification arrays.
				var cNames = [ia.Thematic.QUANTILE,ia.Thematic.EQUAL_INTERVAL,ia.Thematic.NATURAL,ia.Thematic.CONTINUOUS,ia.Thematic.STANDARD_DEVIATION];
				var cLabels = [this._reportConfig.getProperty("quantile"),
					this._reportConfig.getProperty("equalInterval"),
					this._reportConfig.getProperty("natural"),
					this._reportConfig.getProperty("continuous"),
					this._reportConfig.getProperty("standardDeviation")];
					
				// Current label
				var cLabel = cLabels[cNames.indexOf(cName)];

				for (var i = 0; i < cNames.length; i++) 
				{
					var name = cNames[i];
					var label = cLabels[i];

					if (label != undefined)
					{
						var $td = $j("<td class='ia-list-item'>").html(label);
						if (label == cLabel) $td.addClass("ia-editor-classifier-selected")
						$tr.append($td);

						(function() // Execute immediately
						{ 
							var n = name;
							$td.bind("click", function(e)
							{ 
								me._typeMenuOpen = false;
								nClassifier.classificationName = n;
								me._settings.legendType = n;
								me._updateTheme();						

								if (me._options && me._options.onClassificationChanged) me._options.onClassificationChanged.call(null, nClassifier.classificationName);
							});
						})();
					}
				}
			}
		//}
		
		if (cName != ia.Thematic.CONTINUOUS)  // Numeric Discrete.
		{
			//if (cName != "customClassifier")
			//{
				if (this.showPalettePanel)
				{
					// Separator.
					if (this.showLegendTypePanel)
					{
						var $separator = $j("<div class='ia-editor-separator'>");
						menu.append($separator);
					}

					// Palette Panel.
					var $paletteTable = $j("<table class='ia-editor-panel ia-editor-palette-panel'>");
					menu.append($paletteTable);

					var $paletteTableRow = $j("<tr>");
					$paletteTable.append($paletteTableRow);

					var $td = $j("<td>");
					$paletteTableRow.append($td);

					// Color Panel.
					var $table = $j("<table class='ia-editor-color-panel'>");
					$td.append($table);

					var $tr = $j("<tr>");
					$table.append($tr);

					// Discrete palettes.
					var palettes = paletteConfig.getColorPalettes();
					for (var i = 0; i < palettes.length; i++) 
					{
						var p = palettes[i];

						// Palette button.
						var $td = $j("<td class='ia-list-item'>");
						if (p.id ==  nClassifier.colorPalette.id) $td.addClass("ia-editor-selected")
						$tr.append($td);
						(function() // Execute immediately
						{ 
							var palette = p;
							$td.bind("click", function(e)
							{ 
								nClassifier.colorPalette = palette;
								me._settings.paletteId = palette.id;
								me._updateTheme();

								if (me._options && me._options.onPaletteChanged) me._options.onPaletteChanged.call(null, nClassifier.colorPalette);
							});
						})();

						// Color swatches.
						var noClasses = nClassifier.noClasses;
						if (cName == ia.Thematic.STANDARD_DEVIATION) noClasses = 6;
						var colors = p.getInterpolatedColors(noClasses);
						for (var j = 0; j < colors.length; j++) 
						{
							var color = colors[j];
							var $colorswatch = $j("<div class='ia-editor-color-panel-discrete-swatch'>");
							if (p.id ==  nClassifier.colorPalette.id) $colorswatch.addClass("ia-editor-swatch-selected")
							$colorswatch.css({"background-color" : color});
							$td.append($colorswatch);
						}
					}

					if (this.showLegendTools)
					{
						// Tool Panel.
						var $td = $j("<td>");
						$paletteTableRow.append($td);

						var $table = $j("<table class='ia-editor-tool-panel'>");
						$td.append($table);

						// Flip palette colors.
						var $tr = $j("<tr>");
						$table.append($tr);
						var $td = $j("<td class='ia-list-item'>").html("&uArr;&dArr;");
						$tr.append($td);
						$td.bind("click", function(e) 
						{ 
							nClassifier.colorPalette.getColorList().reverse();
							me._updateTheme();

							if (me._options && me._options.onPaletteFlipped) me._options.onPaletteFlipped.call(null, nClassifier.colorPalette);
						});

						if (cName != ia.Thematic.STANDARD_DEVIATION)
						{
							// Decrease no classes.
							var $tr = $j("<tr>");
							$table.append($tr);
							var $td = $j("<td class='ia-list-item'>").html("-");
							$tr.append($td);
							$td.bind("click", function(e) 
							{ 
								if (nClassifier.noClasses > paletteConfig.minNoClasses) 
								{
									nClassifier.noClasses--;
									me._updateTheme();

									if (me._options && me._options.onNoClassesChanged) me._options.onNoClassesChanged.call(null, nClassifier.noClasses);
								}
							});

							// Increase no classes.
							var $tr = $j("<tr>");
							$table.append($tr);
							var $td = $j("<td class='ia-list-item'>").html("+");
							$tr.append($td);
							$td.bind("click", function(e) 
							{ 
								if (nClassifier.noClasses < paletteConfig.maxNoClasses) 
								{
									me._thematic.numericClassifier.noClasses++;
									me._updateTheme();

									if (me._options && me._options.onNoClassesChanged) me._options.onNoClassesChanged.call(null, nClassifier.noClasses);
								}
							});
						}
					}
				}
			//}
		}
		else  // Numeric Continuous.
		{
			if (this.showPalettePanel)
			{
				// Separator.
				if (this.showLegendTypePanel)
				{
					var $separator = $j("<div class='ia-editor-separator'>");
					menu.append($separator);
				}

				// Palette Panel.
				var $paletteTable = $j("<table class='ia-editor-panel ia-editor-palette-panel'>");
				menu.append($paletteTable);

				var $paletteTableRow = $j("<tr>");
				$paletteTable.append($paletteTableRow);

				var $td = $j("<td>");
				$paletteTableRow.append($td);

				// Color Panel.
				var $table = $j("<table class='ia-editor-color-panel'>");
				$td.append($table);

				var $tr = $j("<tr>");
				$table.append($tr);

				// Continuous palettes.
				var palettes = paletteConfig.getColorPalettes();
				for (var i = 0; i < palettes.length; i++) 
				{
					var p = palettes[i];

					// Palette button.
					var $td = $j("<td class='ia-list-item'>");
					$tr.append($td);
					(function() // Execute immediately
					{ 
						var palette = p;
						$td.bind("click", function(e)
						{ 
							nClassifier.colorPalette = palette;
							me._settings.paletteId = palette.id;
							me._updateTheme();

							if (me._options && me._options.onPaletteChanged) me._options.onPaletteChanged.call(null, nClassifier.colorPalette);
						});
					})();

					var colors = p.getColorList();

					// Create a canvas to contain the gradient.
					var canvas = document.createElement('canvas');
					$j(canvas).addClass("ia-editor-color-panel-continuous-swatch");
					if (p.id ==  nClassifier.colorPalette.id) $j(canvas).addClass("ia-editor-swatch-selected")
					$td.append($j(canvas));
					
					// Draw the gradient.
					var context = canvas.getContext("2d");
					context.beginPath();
					ia.Shape.drawGradient(canvas, colors, "bottomToTop");
					context.fill();
				}

				if (this.showLegendTools)
				{
					// Tool Panel.
					var $td = $j("<td>");
					$paletteTableRow.append($td);

					var $table = $j("<table class='ia-editor-tool-panel'>");
					$td.append($table);
						
					// Flip palette colors.
					var $tr = $j("<tr>");
					$table.append($tr);
					var $td = $j("<td class='ia-list-item'>").html("&uArr;&dArr;");
					$tr.append($td);
					$td.bind("click", function(e) 
					{ 
						nClassifier.colorPalette.getColorList().reverse();
						me._updateTheme();
								
						if (me._options && me._options.onPaletteFlipped) me._options.onPaletteFlipped.call(null, nClassifier.colorPalette);
					});
				}
			}
		}
		
		if (this._thematic.symbol != ia.Shape.SQUARE)  // Numeric Symbol Size
		{
			if (this.showSizePanel)
			{
				// Separator.
				if (this.showPalettePanel || this.showLegendTypePanel)
				{
					var $separator = $j("<div class='ia-editor-separator'>");
					menu.append($separator);
				}

				// Size palette.
				var pointIncrementSize = 5;
				var minAllowedPointSize = 5;
				
				if (this._thematic.symbol == ia.Shape.LINE) 
				{
					pointIncrementSize = 1;
					minAllowedPointSize = 1;
				}

				var sizePalette = nClassifier.sizePalette;
				var colorList = nClassifier.colorPalette.getColorList();
				var minColor = colorList[0];
				var maxColor = colorList[colorList.length-1];

				// Size Panel.
				var $sizeTable = $j("<table class='ia-editor-panel ia-editor-size-panel'>");
				menu.append($sizeTable);

				var $sizeTableRow = $j("<tr>");
				$sizeTable.append($sizeTableRow);

				// Min Buttons.
				var $td = $j("<td style='vertical-align:top;width:50px;padding:0px'>");
				$sizeTableRow.append($td);

				var $table = $j("<table style='width:100%'>");
				$td.append($table);

				// Decrease min button.
				var $tr = $j("<tr>");
				$table.append($tr);
				var $td = $j("<td class='ia-list-item'>").html("-");
				$tr.append($td);
				$td.bind("click", function(e) 
				{ 
					var size = sizePalette.minSize - pointIncrementSize;
					if (size < minAllowedPointSize) size = minAllowedPointSize;
					sizePalette.minSize = size;
					me._updateTheme();						

					if (me._options && me._options.onSymbolSizeChanged) me._options.onSymbolSizeChanged.call(null, sizePalette.minSize, sizePalette.maxSize);
				});

				// Increase min button.
				var $tr = $j("<tr>");
				$table.append($tr);
				var $td = $j("<td class='ia-list-item'>").html("+");
				$tr.append($td);
				$td.bind("click", function(e) 
				{ 
					sizePalette.minSize = (sizePalette.minSize + pointIncrementSize);
					me._updateTheme();

					if (me._options && me._options.onSymbolSizeChanged) me._options.onSymbolSizeChanged.call(null, sizePalette.minSize, sizePalette.maxSize);
				});
								
				// Min Symbol.
				var $td = $j("<td style='padding:5px'>");
				$sizeTableRow.append($td);

				var canvasSize = Math.max(sizePalette.minSize,sizePalette.maxSize)  + 2;

				var canvas = document.createElement('canvas');
				canvas.width = canvasSize;
				if (this._thematic.symbol == ia.Shape.LINE) canvas.width = 100;
				canvas.height = canvasSize;
				$td.append($j(canvas))
				var context = canvas.getContext("2d");

				if (this._thematic.symbol == ia.Shape.LINE)
				{
					context.strokeStyle = minColor;
					context.lineWidth = sizePalette.minSize;
					context.beginPath();
						ia.Shape.draw(this._thematic.symbol, context, canvas.width/2, canvas.height/2, canvas.width);
					context.stroke();
				}
				else
				{
					context.strokeStyle = "#cccccc";
					context.fillStyle = minColor;
					context.lineWidth = 1;
					context.beginPath();
					ia.Shape.draw(this._thematic.symbol, context, canvas.width/2, canvas.height/2, sizePalette.minSize);
					context.fill();
					context.stroke();
				}
				
				// Max Symbol.
				var $td = $j("<td style='padding:5px'>");
				$sizeTableRow.append($td);

				var canvas = document.createElement('canvas');
				canvas.width = canvasSize;
				if (this._thematic.symbol == ia.Shape.LINE) canvas.width = 100;
				canvas.height = canvasSize;
				$td.append($j(canvas))
				var context = canvas.getContext("2d");

				if (this._thematic.symbol == ia.Shape.LINE)
				{
					context.strokeStyle = maxColor;
					context.lineWidth = sizePalette.maxSize;
					context.beginPath();
						ia.Shape.draw(this._thematic.symbol, context, canvas.width/2, canvas.height/2, canvas.width);
					context.stroke();
				}
				else
				{
					context.strokeStyle = "#cccccc";
					context.fillStyle = maxColor;
					context.lineWidth = 1;
					context.beginPath();
						ia.Shape.draw(this._thematic.symbol, context, canvas.width/2, canvas.height/2, sizePalette.maxSize);
					context.fill();
					context.stroke();
				}

				// Max Buttons.
				var $td = $j("<td style='vertical-align:top;width:50px;padding:0px'>");
				$sizeTableRow.append($td);

				var $table = $j("<table style='width:100%'>");
				$td.append($table);

				var $tr = $j("<tr>");
				$table.append($tr);
				
				// Decrease max button.
				var $td = $j("<td class='ia-list-item'>").html("-");
				$tr.append($td);
				$td.bind("click", function(e) 
				{ 
					var size = sizePalette.maxSize - pointIncrementSize;
					if (size < minAllowedPointSize) size = minAllowedPointSize;
					sizePalette.maxSize = size;
					me._updateTheme();

					if (me._options && me._options.onSymbolSizeChanged) me._options.onSymbolSizeChanged.call(null, sizePalette.minSize, sizePalette.maxSize);
				});

				// Increase max button.
				var $tr = $j("<tr>");
				$table.append($tr);
				var $td = $j("<td class='ia-list-item'>").html("+");
				$tr.append($td);
				$td.bind("click", function(e) 
				{
					sizePalette.maxSize = (sizePalette.maxSize + pointIncrementSize);
					me._updateTheme();

					if (me._options && me._options.onSymbolSizeChanged) me._options.onSymbolSizeChanged.call(null, sizePalette.minSize, sizePalette.maxSize);
				});
			}
		}
	}
			
	this._lockEditor = false;
};

/**
 * Updates the theme - uses a timer and a lock editor variable to cope with rapid clicking.
 *
 * @method _updateTheme
 * @private
 */
ia.LegendEditor.prototype._updateTheme = function()
{		
	if (!this._lockEditor)
	{
		var me = this;
		clearTimeout(this._updateTimeout);
		this._updateTimeout = setTimeout(function() 
		{
			me._lockEditor = true;
			me._thematic.commitChanges();
		}, 100);
	}
};

/**
 * Toggles the editor visibility.
 *
 * @method toggle
 */
ia.LegendEditor.prototype.toggle = function(visible)
{
	if (this._isVisible) this.hide();
	else this.show();
};

/**
 * Hides the editor.
 *
 * @method hide
 */
ia.LegendEditor.prototype.hide = function()
{	
	//if (this._isVisible) this.container.slideUp('slow', function() {this._isVisible = false;});
	if (this._isVisible) 
	{
		this.container.animate({opacity: 0}, function() 
		{
			this.container.css({visibility: "hidden"});
			this._isVisible = false;
		});
	}
};

/**
 * Shows the editor.
 *
 * @method show
 */
ia.LegendEditor.prototype.show = function()
{
	if (!this._isVisible) 
	{
		this.container.css({visibility: "visible"}).animate({opacity: 1}, function() 
		{
			this._isVisible = true;
		});
	}
};