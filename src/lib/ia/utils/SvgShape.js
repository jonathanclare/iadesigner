/** 
 * Utility class for drawing shapes on a canvas.
 *
 * @author J Clare
 * @class ia.SvgShape
 * @constructor
 */
ia.SvgShape = function() {};

/** 
 * Constant indicating a circle shape. 
 *
 * @static
 * @final
 * @property CIRCLE
 * @type String
 * @default "circle"
 */
ia.SvgShape.CIRCLE = "circle";

/** 
 * Constant indicating a square shape. 
 *
 * @static
 * @final
 * @property SQUARE
 * @type String
 * @default "square"
 */
ia.SvgShape.SQUARE = "square";

/** 
 * Constant indicating a line. 
 *
 * @static
 * @final
 * @property LINE
 * @type String
 * @default "line"
 */
ia.SvgShape.LINE = "line";

/** 
 * Constant indicating a vertical line. 
 *
 * @static
 * @final
 * @property VERTICAL_LINE
 * @type String
 * @default "vertical line"
 */
ia.SvgShape.VERTICAL_LINE = "vertical line";

/** 
 * Constant indicating a horizontal line. 
 *
 * @static
 * @final
 * @property HORIZONTAL_LINE
 * @type String
 * @default "horizontal line"
 */
ia.SvgShape.HORIZONTAL_LINE = "horizontal line";

/** 
 * Constant indicating a minus shape. 
 *
 * @static
 * @final
 * @property MINUS
 * @type String
 * @default "minus"
 */
ia.SvgShape.MINUS = "minus";

/** 
 * Constant indicating a plus shape. 
 *
 * @static
 * @final
 * @property PLUS
 * @type String
 * @default "plus"
 */
ia.SvgShape.PLUS = "plus";

/** 
 * Constant indicating an x shape. 
 *
 * @static
 * @final
 * @property X
 * @type String
 * @default "x"
 */
ia.SvgShape.X = "x";

/** 
 * Constant indicating a diamond shape. 
 *
 * @static
 * @final
 * @property DIAMOND
 * @type String
 * @default "diamond"
 */
ia.SvgShape.DIAMOND = "diamond";

/** 
 * Constant indicating a star shape. 
 *
 * @static
 * @final
 * @property STAR
 * @type String
 * @default "star"
 */
ia.SvgShape.STAR = "star";

/** 
 * Constant indicating a upward-pointing triangle shape. 
 *
 * @static
 * @final
 * @property TRIANGLE_UP
 * @type String
 * @default "triangle up"
 */
ia.SvgShape.TRIANGLE_UP = "triangle up";

/** 
 * Constant indicating a downward-pointing triangle shape.
 *
 * @static
 * @final
 * @property TRIANGLE_DOWN
 * @type String
 * @default "triangle down"
 */
ia.SvgShape.TRIANGLE_DOWN = "triangle down";

/** 
 * Constant indicating a rightward-pointing triangle shape. 
 *
 * @static
 * @final
 * @property TRIANGLE_RIGHT
 * @type String
 * @default "triangle right"
 */
ia.SvgShape.TRIANGLE_RIGHT = "triangle right";

/** 
 * Constant indicating a leftward-pointing triangle shape.
 *
 * @static
 * @final
 * @property TRIANGLE_LEFT
 * @type String
 * @default "triangle left"
 */
ia.SvgShape.TRIANGLE_LEFT = "triangle left";

/** 
 * Constant indicating a upward-pointing arrow shape. 
 *
 * @static
 * @final
 * @property ARROW_UP
 * @type String
 * @default "arrow up"
 */
ia.SvgShape.ARROW_UP = "arrow up";

/** 
 * Constant indicating a downward-pointing arrow shape.
 *
 * @static
 * @final
 * @property ARROW_DOWN
 * @type String
 * @default "arrow down"
 */
ia.SvgShape.ARROW_DOWN = "arrow down";

/** 
 * Constant indicating a rightward-pointing arrow shape. 
 *
 * @static
 * @final
 * @property ARROW_RIGHT
 * @type String
 * @default "arrow right"
 */
ia.SvgShape.ARROW_RIGHT = "arrow right";

/** 
 * Constant indicating a leftward-pointing arrow shape.
 *
 * @static
 * @final
 * @property ARROW_LEFT
 * @type String
 * @default "rrow left"
 */
ia.SvgShape.ARROW_LEFT = "arrow left";

/**
 * Generic function for drawing a shape. 
 * 
 * @static
 * @method draw
 * @param {Number} name The name of the shape to draw.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The shape size.
 */
ia.SvgShape.draw = function(name, x, y, size)
{
	switch(name)
	{
		case ia.SvgShape.SQUARE:
			return this.drawSquare(x, y, size);
		break;
		case ia.SvgShape.LINE:
			return this.drawLine(x, y, size);
		break;
		case ia.SvgShape.VERTICAL_LINE:
			return this.drawVerticalLine(x, y, size);
		break;
		case ia.SvgShape.HORIZONTAL_LINE:
			return this.drawHorizontalLine(x, y, size);
		break;
		case ia.SvgShape.MINUS:
			return this.drawMinus(x, y, size);
		break;
		case ia.SvgShape.PLUS:
			return this.drawPlus(x, y, size);
		break;
		case ia.SvgShape.X:
			return this.drawX(x, y, size);
		break;
		case ia.SvgShape.CIRCLE:
			return this.drawCircle(x, y, size);
		break;
		case ia.SvgShape.DIAMOND:
			return this.drawDiamond(x, y, size);
		break;
		case ia.SvgShape.TRIANGLE_UP:
			return this.drawTriangleUp(x, y, size);
		break;
		case ia.SvgShape.TRIANGLE_DOWN:
			return this.drawTriangleDown(x, y, size);
		break;
		case ia.SvgShape.TRIANGLE_RIGHT:
			return this.drawTriangleRight(x, y, size);
		break;
		case ia.SvgShape.TRIANGLE_LEFT:
			return this.drawTriangleLeft(x, y, size);
		break;
		case ia.SvgShape.ARROW_UP:
			return this.drawArrowUp(x, y, size);
		break;
		case ia.SvgShape.ARROW_DOWN:
			return this.drawArrowDown(x, y, size);
		break;
		case ia.SvgShape.ARROW_RIGHT:
			return this.drawArrowRight(x, y, size);
		break;
		case ia.SvgShape.ARROW_LEFT:
			return this.drawArrowLeft(x, y, size);
		break;
		case ia.SvgShape.STAR:
			return this.drawStar(x, y, size);
		break;
		default:
			//code to be executed if n is different from case 1 and 2
	}

};

/**
 * Draws a square shape.
 * 
 * @static
 * @method drawSquare
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawSquare = function(x, y, size)
{
	var s = size / 2;

	var d =  'M' + (x-s) + ' ' + (y-s) ;
	d += ' L' + (x+s) + ' ' + (y-s); 
	d += ' L' + (x+s) + ' ' + (y+s); 
	d += ' L' + (x-s) + ' ' + (y+s); 
	d += ' Z'; 
	return d;
};

/**
 * Draws a line.
 * 
 * @static
 * @method drawLine
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawLine = function(x, y, size)
{
	var s = size / 2;
	var lw = 1;

	var d =  'M' + (x-s) + ' ' + (y-lw/2) ;
	d += ' L' + (x-s) + ' ' + (y+lw/2); 
	d += ' L' + (x+s) + ' ' + (y+lw/2); 
	d += ' L' + (x+s) + ' ' + (y-lw/2); 
	d += ' Z'; 
	return d;
};

/**
 * Draws a vertical line.
 * 
 * @static
 * @method drawVerticalLine
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawVerticalLine = function(x, y, size)
{
	var s = size / 2;
	var lw = 2;

	var d =  'M' + (x-lw/2) + ' ' + (y-s) ;
	d += ' L' + (x+lw/2) + ' ' + (y-s); 
	d += ' L' + (x+lw/2) + ' ' + (y+s); 
	d += ' L' + (x-lw/2) + ' ' + (y+s); 
	d += ' Z'; 
	return d;
};

/**
 * Draws a horizontal line.
 * 
 * @static
 * @method drawHorizontalLine
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawHorizontalLine = function(x, y, size)
{
	var s = size / 2;
	var lw = 2;

	var d =  'M' + (x-s) + ' ' + (y-lw/2) ;
	d += ' L' + (x-s) + ' ' + (y+lw/2); 
	d += ' L' + (x+s) + ' ' + (y+lw/2); 
	d += ' L' + (x+s) + ' ' + (y-lw/2); 
	d += ' Z'; 
	return d;
};

/**
 * Draws a minus shape.
 * 
 * @static
 * @method drawMinus
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawMinus = function(x, y, size)
{
	var s = size / 2;
	var lw = size * 0.3;

	var d =  'M' + (x-s) + ' ' + (y-lw/2) ;
	d += ' L' + (x-s) + ' ' + (y+lw/2); 
	d += ' L' + (x+s) + ' ' + (y+lw/2); 
	d += ' L' + (x+s) + ' ' + (y-lw/2); 
	d += ' Z'; 
	return d;
};

/**
 * Draws a plus shape.
 * 
 * @static
 * @method drawPlus
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawPlus = function(x, y, size)
{
	var s = size / 2;
	var lw = (size * 0.3) / 2;

	var d =  'M' + (x-lw) + ' ' + (y-s);
	d += ' L' + (x+lw) + ' ' + (y-s);
	d += ' L' + (x+lw) + ' ' + (y-lw);
	d += ' L' + (x+s) + ' ' + (y-lw);
	d += ' L' + (x+s) + ' ' + (y+lw);
	d += ' L' + (x+lw) + ' ' + (y+lw);
	d += ' L' + (x+lw) + ' ' + (y+s);
	d += ' L' + (x-lw) + ' ' + (y+s);
	d += ' L' + (x-lw) + ' ' + (y+lw);
	d += ' L' + (x-s) + ' ' + (y+lw);
	d += ' L' + (x-s) + ' ' + (y-lw);
	d += ' L' + (x-lw) + ' ' + (y-lw);
	d += ' L' + (x-lw) + ' ' + (y-s);
	return d;
};

/**
 * Draws an x shape.
 * 
 * @static
 * @method drawX
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawX = function(x, y, size)
{
	var s = size / 2;
	var lw = (size * 0.3) / 2;

	var x1 = (x-lw) - x;
	var y1 = (y-s) - y;
	var x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	var y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	var d = 'M' + (x2+x) + ' ' + (y2+y);

	x1 = (x+lw) - x;
	y1 = (y-s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x+lw) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x+s) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x+s) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x+lw) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x+lw) - x;
	y1 = (y+s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x-lw) - x;
	y1 = (y+s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x-lw) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x-s) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x-s) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x-lw) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);

	x1 = (x-lw) - x;
	y1 = (y-s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	d += ' L' + (x2+x) + ' ' + (y2+y);
	return d;
};

/**
 * Draws a circle shape.
 * 
 * @static
 * @method drawCircle
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawCircle = function(x, y, size)
{
	var r = size / 2;
    var d = 'M' + x + ',' + y;
    d += 'm' + (-r) + ',0';
    d += 'a' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0'
    d += 'a' + r + ',' + r + ' 0 1,0 ' + -(r * 2) + ',0'
	return d;
};

/**
 * Draws a diamond shape.
 * 
 * @static
 * @method drawDiamond
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawDiamond = function(x, y, size)
{
	var s = size / 2;
	var d = 'M' + (x) + ' ' + (y-s);
	d += ' L' + (x+s) + ' ' + (y);
	d += ' L' + (x) + ' ' + (y+s);
	d += ' L' + (x-s) + ' ' + (y);
	d += ' L' + (x) + ' ' + (y-s);	
	return d;
};

/**
 * Draws an upward-pointing triangle.
 * 
 * @static
 * @method drawTriangleUp
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawTriangleUp = function(x, y, size)
{
	var s = size / 2;
	var d = 'M' + (x) + ' ' + (y-s);
	d += ' L' + (x+s) + ' ' + (y+s);
	d += ' L' + (x-s) + ' ' + (y+s);
	d += ' L' + (x) + ' ' + (y-s);
	return d;
};

/**
 * Draws a downward-pointing triangle shape.
 * 
 * @static
 * @method drawTriangleDown
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawTriangleDown = function(x, y, size)
{
	var s = size / 2;
	var d = 'M' + (x-s) + ' ' + (y-s);
	d += ' L' + (x+s) + ' ' + (y-s);
	d += ' L' + (x) + ' ' + (y+s);
	d += ' L' + (x-s) + ' ' + (y-s);
	return d;
};

/**
 * Draws a right-pointing triangle shape.
 * 
 * @static
 * @method drawTriangleRight
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawTriangleRight = function(x, y, size)
{
	var s = size / 2;
	var d = 'M' + (x-s) + ' ' + (y-s);
	d += ' L' + (x+s) + ' ' + (y);
	d += ' L' + (x-s) + ' ' + (y+s);
	d += ' L' + (x-s) + ' ' + (y-s);
	return d;
};

/**
 * Draws a left-pointing arrow shape.
 * 
 * @static
 * @method drawTriangleLeft
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawTriangleLeft = function(x, y, size)
{
	var s = size / 2;
	var d = 'M' + (x+s) + ' ' + (y-s);
	d += ' L' + (x+s) + ' ' + (y+s);
	d += ' L' + (x-s) + ' ' + (y);
	d += ' L' + (x+s) + ' ' + (y-s);
	return d;
};

/**
 * Draws an upward-pointing arrow.
 * 
 * @static
 * @method drawArrowUp
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawArrowUp = function(x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;

	var d = 'M' + (x) + ' ' + (y - s);
	d += ' L' + (x + arrowWidth/2) + ' ' + (y - s + arrowLength);
	d += ' L' + (x + stemWidth/2) + ' ' + (y - s + arrowLength);

	d += ' L' + (x + stemWidth/2) + ' ' + (y + s);
	d += ' L' + (x - stemWidth/2) + ' ' + (y + s);

	d += ' L' + (x - stemWidth/2) + ' ' + (y - s + arrowLength);
	d += ' L' + (x - arrowWidth/2) + ' ' + (y - s + arrowLength);
	d += ' L' + (x) + ' ' + (y - s);
	return d;
};

/**
 * Draws a downward-pointing arrow shape.
 * 
 * @static
 * @method drawArrowDown
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawArrowDown = function(x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;
			
	var d = 'M' + (x) + ' ' + (y + s);
	d += ' L' + (x + arrowWidth/2) + ' ' + (y + s - arrowLength);
	d += ' L' + (x + stemWidth/2) + ' ' + (y + s - arrowLength);

	d += ' L' + (x + stemWidth/2) + ' ' + (y - s);
	d += ' L' + (x - stemWidth/2) + ' ' + (y - s);

	d += ' L' + (x - stemWidth/2) + ' ' + (y + s - arrowLength);
	d += ' L' + (x - arrowWidth/2) + ' ' + (y + s - arrowLength);
	d += ' L' + (x) + ' ' + (y + s);
	return d;
};

/**
 * Draws a right-pointing arrow shape.
 * 
 * @static
 * @method drawArrowRight
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawArrowRight = function(x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;
			
	var d = 'M' + (x + s) + ' ' + (y);
	d += ' L' + (x + s - arrowLength) + ' ' + (y + arrowWidth/2);
	d += ' L' + (x + s - arrowLength) + ' ' + (y + stemWidth/2);

	d += ' L' + (x - s) + ' ' + (y + stemWidth/2);
	d += ' L' + (x - s) + ' ' + (y - stemWidth/2);

	d += ' L' + (x + s - arrowLength) + ' ' + (y - stemWidth/2);
	d += ' L' + (x + s - arrowLength) + ' ' + (y - arrowWidth/2);
	d += ' L' + (x + s) + ' ' + (y);
	return d;
};

/**
 * Draws a left-pointing arrow shape.
 * 
 * @static
 * @method drawArrowLeft
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawArrowLeft = function(x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;
			
	var d = 'M' + (x - s) + ' ' + (y);
	d += ' L' + (x - s + arrowLength) + ' ' + (y + arrowWidth/2);
	d += ' L' + (x - s + arrowLength) + ' ' + (y + stemWidth/2);

	d += ' L' + (x + s) + ' ' + (y + stemWidth/2);
	d += ' L' + (x + s) + ' ' + (y - stemWidth/2);

	d += ' L' + (x - s + arrowLength) + ' ' + (y - stemWidth/2);
	d += ' L' + (x - s + arrowLength) + ' ' + (y - arrowWidth/2);
	d += ' L' + (x - s) + ' ' + (y);
	return d;
};

/**
 * Draws a star shape.
 * 
 * @static
 * @method drawStar
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.SvgShape.drawStar = function(x, y, size)
{
	var points = 5;
	var innerRadius = 0.25 * size;
	var outerRadius = 0.5 * size;
	var angle = 90;
	var step; 
	var halfStep;  
	var start;  
	var n;  
	var dx;  
	var dy; 

	// calculate distance between points
	step = (Math.PI*2)/points;
	halfStep = step/2;

	// calculate starting angle in radians
	start = (angle/180)*Math.PI;
	var d = 'M' + (x+(Math.cos(start)*outerRadius)) + ' ' + (y - (Math.sin(start)*outerRadius));

	// draw lines
	for (var i=1; i<=points; i++) 
	{
		dx = x + Math.cos(start+(step*i)-halfStep)*innerRadius;
		dy = y - Math.sin(start+(step*i)-halfStep)*innerRadius;
		d += ' L' + (dx) + ' ' + (dy);
		
		dx = x + Math.cos(start+(step*i))*outerRadius;
		dy = y -Math.sin(start+(step*i))*outerRadius;
		d += ' L' + (dx) + ' ' + (dy);
	}
	return d;
};
