/** 
 * Palette for colors.
 *
 * @author J Clare
 * @class ia.ColorPalette
 * @constructor
 * @param {String[]} c A list of colors.
 */
ia.ColorPalette = function(c)
{
	this._colors = new Array();

	this.id = "";
	this.matchColorsToValues = new Object();

	if (c != undefined) this.setColorList(c);
	else this.setColorList(ia.ColorPalette.CATEGORY_COLORS);
};

/**
 * A blue numeric color scheme.
 * 
 * @static
 * @final
 * @property NUMERIC_COLORS
 * @type String[]
 * @default ['#ece7f2', '#74a9cf', '#023858']
 */
ia.ColorPalette.NUMERIC_COLORS = ['#9EDAE5', '#74a9cf', '#023858'];

/**
 * A set of 20 colors for categoric color schemes.
 * 
 * @static
 * @final
 * @property CATEGORY_COLORS
 * @type String[]
 * @default [ '#B4371F', '#FFBB78', '#2CA02C','#98DF8A', '#D62728', '#FF9896', '#9467BD', '#C5B0D5', '#8C564B',
 *			'#C49C94', '#E377C2', '#F7B6D2', '#7F7F7F', '#C7C7C7', '#BCBD22','#DBDB8D', '#17BECF', '#9EDAE5', '#AEC7E8', '#9EDAE5' ]
 */
ia.ColorPalette.CATEGORY_COLORS = [ '#B4371F', '#FFBB78', '#2CA02C',
		'#98DF8A', '#D62728', '#FF9896', '#9467BD', '#C5B0D5', '#8C564B',
		'#C49C94', '#E377C2', '#F7B6D2', '#7F7F7F', '#C7C7C7', '#BCBD22',
		'#DBDB8D', '#17BECF', '#9EDAE5', '#AEC7E8', '#9EDAE5' ];

/**
 * The id of the palette. 
 * 
 * @property id
 * @type String[]
 * @default ""
 */
ia.ColorPalette.prototype.id;

/**
 * A hash that matches colors to values.
 * The key is the value to match against - the value is the color.
 * 
 * @property matchColorsToValues
 * @type Associative Array
 */
ia.ColorPalette.prototype.matchColorsToValues;

/**
 * Gets the list of colors. 
 *
 * @method getColorList
 * @return {String[]} The color list.
 */
ia.ColorPalette.prototype.getColorList = function()
{
	return this._colors;
};

/** 
 * Sets the list of colors. 
 *
 * @method setColorList
 * @param {String[]} value The color list.
 */
ia.ColorPalette.prototype.setColorList = function(value)
{
	this._colors = value;
};

/**
 * Adds a color to this ia.ColorPalette.
 * 
 * @method addColor
 * @param {String} c The name of the color.
 */
ia.ColorPalette.prototype.addColor = function(c)
{
	this._colors.push(c);
};

/**
 * Gets the color at the given index into the palette.
 * 
 * @method getColorAtIndex
 * @param {Number} index the Index of the color
 * @return {String} the name of the color
 */
ia.ColorPalette.prototype.getColorAtIndex = function(index)
{
	return this._colors[index % this._colors.length];
};

/**
 * Sets the color at the given index into the palette.
 * 
 * @method setColorAtIndex
 * @param {Number} index The index of the color
 * @param {String} c The name of the color.
 */
ia.ColorPalette.prototype.setColorAtIndex = function(index, c)
{
	this._colors[index] = c;
};

/** 
 * Returns the colors that are matched against the given values
 * in the <code>matchColorsToValues</code> hash. 
 * 
 * If no match is found the next color in the palette is used.
 * 
 * If more colors are requested than are contained in the palette, 
 * random colours are generated to complete the list.
 * 
 * @method getMatchingColors
 * @param {String[]} values The values array.
 * @return {String[]} An array of color values.
 */
ia.ColorPalette.prototype.getMatchingColors = function(values)
{
	var n = values.length;
	var colorArray = new Array(n);
	var paletteColors = this.getColors(n);

	// Replace any colours already used by matchColorsToValues.
	for (var i = 0; i < n; i++)
	{
		var c = ia.Color.toHex(paletteColors[i]);
		for (var v in this.matchColorsToValues)
		{
			for (var j = 0; j < n; j++)
			{
				var value = values[j];
				if (value == v)
				{
					var mc = ia.Color.toHex(this.matchColorsToValues[v]);
					if (mc == c) paletteColors[i] = ia.Color.getRandomColor();
				}
			}
		}
	}

	// Get colors for matching values.
	var index = 0;
	for (var i = 0; i < n; i++)
	{
		if (this.matchColorsToValues[values[i]] != undefined)
			colorArray[i] = this.matchColorsToValues[values[i]];
		else
		{
			colorArray[i] = paletteColors[index];
			index++;
		}
	}
	
	return colorArray;
};

/** 
 * Returns the list of colors. If more colors are requested
 * than are contained in the palette, random colours are generated
 * to complete the list.
 * 
 * @method getColors
 * @param {Number} numberOfColors The number of colors required.
 * @return {String[]} An array of color values.
 */
ia.ColorPalette.prototype.getColors = function(numberOfColors)
{
	var colorArray = new Array(numberOfColors);
	var index = 0;
	var c;

	// Get the colors.
	for (var i = 0; i < numberOfColors; i++)
	{

		if (i < this._colors.length)
			c = this._colors[i];
		else
		{
			if (index < ia.ColorPalette.CATEGORY_COLORS.length)
				c = ia.ColorPalette.CATEGORY_COLORS[index];
			else
			{
				var c = ia.Color.getRandomColor();
				ia.ColorPalette.CATEGORY_COLORS[ia.ColorPalette.CATEGORY_COLORS.length] = c;
			}
			index++;
		}

		colorArray[i] = c;
	}
	return colorArray;
};

/** 
 * Returns a list of colors uniformly interpolated
 * from the <code>color</code> property list. If only one color is requested it  
 * will be interpolated from the center of the <code>color</code> property list.
 * If two colors are requested the first and last
 * colors in the <code>color</code> property list will be returned.
 * 
 * @method getInterpolatedColors
 * @param {Number} numberOfColors The number of colors required.
 * @return {String[]} An array of color values.
 */
ia.ColorPalette.prototype.getInterpolatedColors = function(numberOfColors)
{
	var n = this._colors.length;
	if (numberOfColors == 1)
	{
		return [this._colors[0]];
	}
	else if (numberOfColors == 2)
	{
		return new Array(this.getColor(0), this.getColor(1));
	}
	else
	{
		var interpolatedColors = new Array(numberOfColors);
		var fSize = 1 / (numberOfColors-1);
		var ratio = 0

		for (var i = 0; i < numberOfColors; i++)
		{
			if (i == 0)
				 interpolatedColors[i] = this.getColor(0);
			else if (i == (numberOfColors-1)) 
				interpolatedColors[i] = this.getColor(1)
			else 
				interpolatedColors[i] = this.getColor(ratio);
			ratio += parseFloat(fSize);
		}
		return interpolatedColors;
	}
};

/** 
 * Gets the color corresponding to the interpolation fraction.
 * 
 * @method getColor
 * @param {Number} f An interpolation fraction as a value between 0 and 1.
 * @return {String} The color corresponding to the fraction.
 */
ia.ColorPalette.prototype.getColor = function(f)
{
	var n = this._colors.length - 1;
	var r = 1/n;

	if ((n <= 0) || (f <= 0))
	{
		return this._colors[0];
	}
	else if (f >= 1)
	{
		return this._colors[n];
	}
	else
	{
		// Interpolate the color.
		var color;
		var fSize = 1 / n;
		var ratio = 0

		for (var i = 0; i < n; i++)
		{
			var r1 = ratio;
			var r2 = r1 + fSize;

			if ((f >= r1) && (f <= r2))
			{
				var c1 = this._colors[i];
				var c2 = this._colors[i+1];

				var adjustedF = (f - r1) / (r2 - r1);
				color = ia.Color.getInterpolatedColor(c1, c2, adjustedF);
				break;
			}
			ratio += parseFloat(fSize);
		}
		return color;
	}
};