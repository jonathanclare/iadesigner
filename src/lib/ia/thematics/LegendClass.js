/** 
 * A <code>ia.LegendClass</code> consists of a value, color and size.
 * 
 * @author J Clare
 * @class ia.LegendClass
 * @constructor
 * @param {String|Number} inValue The value.
 * @param {String} inColor The color.
 * @param {Number} inSize The size.
 */
ia.LegendClass = function(inValue, inColor, inSize)
{
	this.formatter = new ia.Formatter();
	this.color = '#FFFFFF';
	this.size = 15;
	this.items = [];
	this.symbol = ia.Shape.SQUARE;
	this.index = 0;

	if (inValue != null) this.value = inValue;
	if (inColor != null) this.color = inColor;
	if (inSize != null) this.size = inSize;
};

/** 
 * The formatter.
 * 
 * @property formatter
 * @type ia.Formatter
 */
ia.LegendClass.prototype.formatter;

/** 
 * The value
 * 
 * @property value
 * @type Number
 */
ia.LegendClass.prototype.value;

/** 
 * The default color.
 * 
 * @property color
 * @type String
 * @default "#FFFFFF"
 */
ia.LegendClass.prototype.color;

/** 
 * The default size applied to data in the layer.
 * 
 * @property size
 * @type Number
 * @default 15
 */
ia.LegendClass.prototype.size;

/** 
 * The list of data items contained in this class.
 * 
 * @property items
 * @type Number[]
 */
ia.LegendClass.prototype.items;

/**
 * The symbol used for point data.
 * 
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.LegendClass.prototype.symbol;

/**
 * The position of the class in the thematic.
 * 
 * @property index
 * @type Number
 * @default 0
 */
ia.LegendClass.prototype.index;