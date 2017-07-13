/** 
 * Palette for size values.
 * 
 * @author J Clare
 * @class ia.SizePalette
 * @constructor
 * @param {Number} minimumSize The minimum size.
 * @param {Number} maximumSize The maximum size.
 */
ia.SizePalette = function(minimumSize, maximumSize)
{
	this.minSize = 15;
	this.maxSize = 15;
	this.useSqrRoot = false;
	
	if (minimumSize != null) this.minSize = minimumSize;
	if (maximumSize != null) this.maxSize = maximumSize;
};

/** 
 * The minimum size.
 *
 * @property minSize
 * @type Number
 * @default 15
 */
ia.SizePalette.prototype.minSize;

/** 
 * The maximum size.
 * 
 * @property maxSize
 * @type Number
 * @default 15
 */
ia.SizePalette.prototype.maxSize;

/** 
 * Flag indicating if square root should be used.
 * 
 * @property useSqrRoot
 * @type Boolean
 * @default false
 */
ia.SizePalette.prototype.useSqrRoot;

/**
 * Returns a list of sizes uniformly interpolated
 * 
 * @method getInterpolatedSizes
 * @param {Number} noSizes The number of sizes required.
 * @return {String[]} An array of color values.
 */
ia.SizePalette.prototype.getInterpolatedSizes = function(noSizes)
{
	var s = [];

	if (noSizes == 1) return [this.minSize];

	for (var i = 0; i < noSizes; i++)
	{
		s.push(this.getSize(i/(noSizes-1)));
	}
	
	return s;
};

/**
 * Gets the size corresponding to the interpolation fraction. 
 * If the <code>useSqrRoot</code> flag is true, the square root
 * of the size value is returned.
 * 
 * @method getSize
 * @param {Number} f An interpolation fraction as a value between 0 and 1.
 * @return {Number} The size corresponding to the fraction.
 */
ia.SizePalette.prototype.getSize = function(f)
{
	if (f == null) return this.minSize;
	if (this.useSqrRoot) f = Math.sqrt(f);

	var sizeRange = this.maxSize - this.minSize;
	var size = this.minSize + f * sizeRange;

	return size;
};