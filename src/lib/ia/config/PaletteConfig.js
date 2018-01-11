/** 
 * Contains the configuration information for a map palette.
 *
 * @author J Clare
 * @class ia.PaletteConfig
 * @constructor
 * @param {XML} data The XML data that describes the object.
 * @param {String} noDataColor The color used to represent no data values.
 * @param {String} noDataValue The value used to represent no data values.
 */
ia.PaletteConfig = function(data, noDataColor, noDataValue)
{
	this.noDataColor = noDataColor;
	this.noDataValue = noDataValue;
	this.parseXML(data);
};

/** 
 * The default palette id.
 *
 * @property defaultPaletteId
 * @type String
 * @default ""
 */
ia.PaletteConfig.prototype.defaultPaletteId;

/** 
 * The default scheme id.
 *
 * @property defaultSchemeId
 * @type String
 * @default ""
 */
ia.PaletteConfig.prototype.defaultSchemeId;

/** 
 * The number of classes.
 *
 * @property noClasses
 * @type Number
 * @default 5
 */
ia.PaletteConfig.prototype.noClasses;

/** 
 * The maximum number of classes.
 *
 * @property maxNoClasses
 * @type Number
 * @default 10
 */
ia.PaletteConfig.prototype.maxNoClasses;

/** 
 * The no data value.
 *
 * @property noDataValue
 * @type String
 * @default ""
 */
ia.PaletteConfig.prototype.noDataValue = "";

/** 
 * The no data color.
 *
 * @property noDataColor
 * @type String
 * @default ""
 */
ia.PaletteConfig.prototype.noDataColor = "";

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */	
ia.PaletteConfig.prototype.parseXML = function(xml) 
{
	// Parse the data.
	var me = this;
	var d = $j(xml);

	this.defaultPaletteId = "";
	this.defaultSchemeId = "";
	this.noClasses = 5;
	this.minNoClasses = 2;
	this.maxNoClasses = 10;

	// Palettes attributes.
	if (d.attr("default") != undefined) this.defaultPaletteId = d.attr("default");
	if (d.attr("classes") != undefined) this.noClasses = ia.parseInt(d.attr("classes"));
	if (d.attr("maxclasses") != undefined) this.maxNoClasses = ia.parseInt(d.attr("maxclasses"));

	// Color Range.
	me._paletteArray = [];
	me._paletteHash = {}
	var colors = d.find("ColourRange");
	$j.each(colors, function(i, colorRangeXml)
	{
		var colors = $j(colorRangeXml).find("Colour");
		var colorArray = [];
		$j.each(colors, function(j, colorXml)
		{
			colorArray.push($j(colorXml).text());
		});

		var cp = new ia.ColorPalette(colorArray);
		cp.id = $j(colorRangeXml).attr("id");
		me._paletteHash[cp.id] = cp;
		me._paletteArray.push(cp)
	});

	// Color Scheme.
	var ndColor = (this.noDataColor == undefined) ? "#f9f9f9" : this.noDataColor
	var noDataArray = ["null",null,"NaN","","No Data",undefined];
	noDataArray[noDataArray.length] = this.noDataValue;

	me._schemeArray = [];
	me._schemeHash = {}
	var colors = d.find("ColourScheme");
	$j.each(colors, function(i, ColourSchemeXml)
	{
		var colorArray = [];
		var cp = new ia.ColorPalette();

		var colors = $j(ColourSchemeXml).find("ColourMatch");
		$j.each(colors, function(j, colorXml)
		{
			var forValue = $j(colorXml).attr("for")
			var colorValue = $j(colorXml).text();
			colorArray.push(colorValue);
			cp.matchColorsToValues[forValue] = colorValue;
		});

		// Match no data values
		for (var i = 0; i < noDataArray.length; i++) 
		{
			cp.matchColorsToValues[noDataArray[i]] = ndColor;
		}

		cp.setColorList(colorArray);
		
		cp.id = $j(ColourSchemeXml).attr("id");
		me._schemeHash[cp.id] = cp;
		me._schemeArray.push(cp);
	});
	this.defaultSchemeId = me._schemeArray[0].id;
};

/** 
 * Returns the color palettes.  
 *
 * @method getColorPalettes
 * @return {ia.ColorPalette[]} A list of color palettes.
 */	
ia.PaletteConfig.prototype.getColorPalettes = function() {return this._paletteArray;};

/** 
 * Returns the color palettes.  
 *
 * @method getColorPalettes
 * @return {ia.ColorPalette[]} A list of color palettes.
 */	
ia.PaletteConfig.prototype.getColorPalettes = function() {return this._paletteArray;};

/** 
 * Returns the color palette that corresponds to the id.
 * 
 * @method getColorPalette
 * @param {String} id The id.
 * @return {ia.ColorPalette} The color palette.
 */
ia.PaletteConfig.prototype.getColorPalette = function(id) {return this._paletteHash[id];};

/** 
 * Returns the color schemes.  
 *
 * @method getColorSchemes
 * @return {ia.ColorPalette[]} A list of color schemes.
 */	
ia.PaletteConfig.prototype.getColorSchemes = function() {return this._schemeArray;};

/** 
 * Returns the color scheme that corresponds to the id.
 * 
 * @method getColorScheme
 * @param {String} id The id.
 * @return {ia.ColorPalette} The color scheme.
 */
ia.PaletteConfig.prototype.getColorScheme = function(id) {return this._schemeHash[id];};