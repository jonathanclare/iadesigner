/** 
 * Utility class for drawing shapes on a canvas.
 *
 * @author J Clare
 * @class ia.Shape
 * @constructor
 */
ia.Shape = function() {};

/** 
 * Constant indicating a circle shape. 
 *
 * @static
 * @final
 * @property CIRCLE
 * @type String
 * @default "circle"
 */
ia.Shape.CIRCLE = "circle";

/** 
 * Constant indicating a square shape. 
 *
 * @static
 * @final
 * @property SQUARE
 * @type String
 * @default "square"
 */
ia.Shape.SQUARE = "square";

/** 
 * Constant indicating a line. 
 *
 * @static
 * @final
 * @property LINE
 * @type String
 * @default "line"
 */
ia.Shape.LINE = "line";

/** 
 * Constant indicating a vertical line. 
 *
 * @static
 * @final
 * @property VERTICAL_LINE
 * @type String
 * @default "vertical line"
 */
ia.Shape.VERTICAL_LINE = "vertical line";

/** 
 * Constant indicating a horizontal line. 
 *
 * @static
 * @final
 * @property HORIZONTAL_LINE
 * @type String
 * @default "horizontal line"
 */
ia.Shape.HORIZONTAL_LINE = "horizontal line";

/** 
 * Constant indicating a minus shape. 
 *
 * @static
 * @final
 * @property MINUS
 * @type String
 * @default "minus"
 */
ia.Shape.MINUS = "minus";

/** 
 * Constant indicating a plus shape. 
 *
 * @static
 * @final
 * @property PLUS
 * @type String
 * @default "plus"
 */
ia.Shape.PLUS = "plus";

/** 
 * Constant indicating an x shape. 
 *
 * @static
 * @final
 * @property X
 * @type String
 * @default "x"
 */
ia.Shape.X = "x";

/** 
 * Constant indicating a diamond shape. 
 *
 * @static
 * @final
 * @property DIAMOND
 * @type String
 * @default "diamond"
 */
ia.Shape.DIAMOND = "diamond";

/** 
 * Constant indicating a star shape. 
 *
 * @static
 * @final
 * @property STAR
 * @type String
 * @default "star"
 */
ia.Shape.STAR = "star";

/** 
 * Constant indicating a upward-pointing triangle shape. 
 *
 * @static
 * @final
 * @property TRIANGLE_UP
 * @type String
 * @default "triangle up"
 */
ia.Shape.TRIANGLE_UP = "triangle up";

/** 
 * Constant indicating a downward-pointing triangle shape.
 *
 * @static
 * @final
 * @property TRIANGLE_DOWN
 * @type String
 * @default "triangle down"
 */
ia.Shape.TRIANGLE_DOWN = "triangle down";

/** 
 * Constant indicating a rightward-pointing triangle shape. 
 *
 * @static
 * @final
 * @property TRIANGLE_RIGHT
 * @type String
 * @default "triangle right"
 */
ia.Shape.TRIANGLE_RIGHT = "triangle right";

/** 
 * Constant indicating a leftward-pointing triangle shape.
 *
 * @static
 * @final
 * @property TRIANGLE_LEFT
 * @type String
 * @default "triangle left"
 */
ia.Shape.TRIANGLE_LEFT = "triangle left";

/** 
 * Constant indicating a upward-pointing arrow shape. 
 *
 * @static
 * @final
 * @property ARROW_UP
 * @type String
 * @default "arrow up"
 */
ia.Shape.ARROW_UP = "arrow up";

/** 
 * Constant indicating a downward-pointing arrow shape.
 *
 * @static
 * @final
 * @property ARROW_DOWN
 * @type String
 * @default "arrow down"
 */
ia.Shape.ARROW_DOWN = "arrow down";

/** 
 * Constant indicating a rightward-pointing arrow shape. 
 *
 * @static
 * @final
 * @property ARROW_RIGHT
 * @type String
 * @default "arrow right"
 */
ia.Shape.ARROW_RIGHT = "arrow right";

/** 
 * Constant indicating a leftward-pointing arrow shape.
 *
 * @static
 * @final
 * @property ARROW_LEFT
 * @type String
 * @default "rrow left"
 */
ia.Shape.ARROW_LEFT = "arrow left";

/**
 * Generic function for drawing a shape. 
 * 
 * @static
 * @method draw
 * @param {Number} name The name of the shape to draw.
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The shape size.
 * @param {Number} dashWidth The width of the dash for a dashed line.
 * @param {Number} gapWidth The width of the gap for a dashed line.
 */
ia.Shape.draw = function(name, ctx, x, y, size, dashWidth, gapWidth)
{
	switch(name)
	{
		case ia.Shape.SQUARE:
			this.drawSquare(ctx, x, y, size);
		break;
		case ia.Shape.LINE:
			this.drawLine(ctx, x, y, size, dashWidth, gapWidth);
		break;
		case ia.Shape.VERTICAL_LINE:
			this.drawVerticalLine(ctx, x, y, size);
		break;
		case ia.Shape.HORIZONTAL_LINE:
			this.drawHorizontalLine(ctx, x, y, size);
		break;
		case ia.Shape.MINUS:
			this.drawMinus(ctx, x, y, size);
		break;
		case ia.Shape.PLUS:
			this.drawPlus(ctx, x, y, size);
		break;
		case ia.Shape.X:
			this.drawX(ctx, x, y, size);
		break;
		case ia.Shape.CIRCLE:
			this.drawCircle(ctx, x, y, size);
		break;
		case ia.Shape.DIAMOND:
			this.drawDiamond(ctx, x, y, size);
		break;
		case ia.Shape.TRIANGLE_UP:
			this.drawTriangleUp(ctx, x, y, size);
		break;
		case ia.Shape.TRIANGLE_DOWN:
			this.drawTriangleDown(ctx, x, y, size);
		break;
		case ia.Shape.TRIANGLE_RIGHT:
			this.drawTriangleRight(ctx, x, y, size);
		break;
		case ia.Shape.TRIANGLE_LEFT:
			this.drawTriangleLeft(ctx, x, y, size);
		break;
		case ia.Shape.ARROW_UP:
			this.drawArrowUp(ctx, x, y, size);
		break;
		case ia.Shape.ARROW_DOWN:
			this.drawArrowDown(ctx, x, y, size);
		break;
		case ia.Shape.ARROW_RIGHT:
			this.drawArrowRight(ctx, x, y, size);
		break;
		case ia.Shape.ARROW_LEFT:
			this.drawArrowLeft(ctx, x, y, size);
		break;
		case ia.Shape.STAR:
			this.drawStar(ctx, x, y, size);
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
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawSquare = function(ctx, x, y, size)
{
	var s = size / 2;
	ctx.rect(x-s, y-s, size, size);
};

/**
 * Draws a line.
 * 
 * @static
 * @method drawLine
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 * @param {Number} dashWidth The width of the dash for a dashed line.
 * @param {Number} gapWidth The width of the gap for a dashed line.
 */
ia.Shape.drawLine = function(ctx, x, y, size, dashWidth, gapWidth)
{
	var s = size / 2;
	if (dashWidth != undefined) // Dashed line.
	{
		ctx.dashedLine(x-s, y, x+s, y, dashWidth, gapWidth);
	}
	else
	{
		ctx.moveTo(x-s, y);
		ctx.lineTo(x+s, y);
	}
};

/**
 * Draws a vertical line.
 * 
 * @static
 * @method drawVerticalLine
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawVerticalLine = function(ctx, x, y, size)
{
	var s = size / 2;
	var lw = 2;
	ctx.rect(x-lw/2, y-s, lw, size);
};

/**
 * Draws a horizontal line.
 * 
 * @static
 * @method drawHorizontalLine
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawHorizontalLine = function(ctx, x, y, size)
{
	var s = size / 2;
	var lw = 2;
	ctx.rect(x-s, y-lw/2, size, lw);
};

/**
 * Draws a minus shape.
 * 
 * @static
 * @method drawMinus
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawMinus = function(ctx, x, y, size)
{
	var s = size / 2;
	var lw = size * 0.3;
	ctx.rect(x-s, y-lw/2, size, lw);
};

/**
 * Draws a plus shape.
 * 
 * @static
 * @method drawPlus
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawPlus = function(ctx, x, y, size)
{
	var s = size / 2;
	var lw = (size * 0.3) / 2;
	ctx.moveTo(x-lw, y-s);
	ctx.lineTo(x+lw, y-s);
	ctx.lineTo(x+lw, y-lw);
	ctx.lineTo(x+s, y-lw);
	ctx.lineTo(x+s, y+lw);
	ctx.lineTo(x+lw, y+lw);
	ctx.lineTo(x+lw, y+s);
	ctx.lineTo(x-lw, y+s);
	ctx.lineTo(x-lw, y+lw);
	ctx.lineTo(x-s, y+lw);
	ctx.lineTo(x-s, y-lw);
	ctx.lineTo(x-lw, y-lw);
	ctx.lineTo(x-lw, y-s);
};

/**
 * Draws an x shape.
 * 
 * @static
 * @method drawX
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawX = function(ctx, x, y, size)
{
	var s = size / 2;
	var lw = (size * 0.3) / 2;

	var x1 = (x-lw) - x;
	var y1 = (y-s) - y;
	var x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	var y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.moveTo(x2+x, y2+y);

	x1 = (x+lw) - x;
	y1 = (y-s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x+lw) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x+s) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x+s) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x+lw) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x+lw) - x;
	y1 = (y+s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x-lw) - x;
	y1 = (y+s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x-lw) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x-s) - x;
	y1 = (y+lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x-s) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x-lw) - x;
	y1 = (y-lw) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);

	x1 = (x-lw) - x;
	y1 = (y-s) - y;
	x2 = (x1 * Math.cos(45*Math.PI/180)) - (y1 * Math.sin(45*Math.PI/180));
	y2 = (x1 * Math.sin(45*Math.PI/180)) + (y1 * Math.cos(45*Math.PI/180));
	ctx.lineTo(x2+x, y2+y);
};

/**
 * Draws a circle shape.
 * 
 * @static
 * @method drawCircle
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawCircle = function(ctx, x, y, size)
{
	var r = size / 2;
	if (r > 0) ctx.arc(x, y, r, 0, 2 * Math.PI, false);
};

/**
 * Draws a diamond shape.
 * 
 * @static
 * @method drawDiamond
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawDiamond = function(ctx, x, y, size)
{
	var s = size / 2;
	ctx.moveTo(x, y-s);
	ctx.lineTo(x+s, y);
	ctx.lineTo(x, y+s);
	ctx.lineTo(x-s, y);
	ctx.lineTo(x, y-s);	
};

/**
 * Draws an upward-pointing triangle.
 * 
 * @static
 * @method drawTriangleUp
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawTriangleUp = function(ctx, x, y, size)
{
	var s = size / 2;
	ctx.moveTo(x, y-s);
	ctx.lineTo(x+s, y+s);
	ctx.lineTo(x-s, y+s);
	ctx.lineTo(x, y-s);
};

/**
 * Draws a downward-pointing triangle shape.
 * 
 * @static
 * @method drawTriangleDown
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawTriangleDown = function(ctx, x, y, size)
{
	var s = size / 2;
	ctx.moveTo(x-s, y-s);
	ctx.lineTo(x+s, y-s);
	ctx.lineTo(x, y+s);
	ctx.lineTo(x-s, y-s);
};

/**
 * Draws a right-pointing triangle shape.
 * 
 * @static
 * @method drawTriangleRight
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawTriangleRight = function(ctx, x, y, size)
{
	var s = size / 2;
	ctx.moveTo(x-s, y-s);
	ctx.lineTo(x+s, y);
	ctx.lineTo(x-s, y+s);
	ctx.lineTo(x-s, y-s);
};

/**
 * Draws a left-pointing arrow shape.
 * 
 * @static
 * @method drawTriangleLeft
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawTriangleLeft = function(ctx, x, y, size)
{
	var s = size / 2;
	ctx.moveTo(x+s, y-s);
	ctx.lineTo(x+s, y+s);
	ctx.lineTo(x-s, y);
	ctx.lineTo(x+s, y-s);
};

/**
 * Draws an upward-pointing arrow.
 * 
 * @static
 * @method drawArrowUp
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawArrowUp = function(ctx, x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;

	ctx.moveTo(x, y - s);
	ctx.lineTo(x + arrowWidth/2, y - s + arrowLength);
	ctx.lineTo(x + stemWidth/2, y - s + arrowLength);

	ctx.lineTo(x + stemWidth/2, y + s);
	ctx.lineTo(x - stemWidth/2, y + s);

	ctx.lineTo(x - stemWidth/2, y - s + arrowLength);
	ctx.lineTo(x - arrowWidth/2, y - s + arrowLength);
	ctx.lineTo(x, y - s);
};

/**
 * Draws a downward-pointing arrow shape.
 * 
 * @static
 * @method drawArrowDown
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawArrowDown = function(ctx, x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;
			
	ctx.moveTo(x, y + s);
	ctx.lineTo(x + arrowWidth/2, y + s - arrowLength);
	ctx.lineTo(x + stemWidth/2, y + s - arrowLength);

	ctx.lineTo(x + stemWidth/2, y - s);
	ctx.lineTo(x - stemWidth/2, y - s);

	ctx.lineTo(x - stemWidth/2, y + s - arrowLength);
	ctx.lineTo(x - arrowWidth/2, y + s - arrowLength);
	ctx.lineTo(x, y + s);
};

/**
 * Draws a right-pointing arrow shape.
 * 
 * @static
 * @method drawArrowRight
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawArrowRight = function(ctx, x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;
			
	ctx.moveTo(x + s, y);
	ctx.lineTo(x + s - arrowLength, y + arrowWidth/2);
	ctx.lineTo(x + s - arrowLength, y + stemWidth/2);

	ctx.lineTo(x - s, y + stemWidth/2);
	ctx.lineTo(x - s, y - stemWidth/2);

	ctx.lineTo(x + s - arrowLength, y - stemWidth/2);
	ctx.lineTo(x + s - arrowLength, y - arrowWidth/2);
	ctx.lineTo(x + s, y);
};

/**
 * Draws a left-pointing arrow shape.
 * 
 * @static
 * @method drawArrowLeft
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawArrowLeft = function(ctx, x, y, size)
{
	var s = size / 2;
	var stemWidth = size * 0.5;
	var stemLength = size * 0.5;
	var arrowWidth = size * 1;
	var arrowLength = size * 0.5;
			
	ctx.moveTo(x - s, y);
	ctx.lineTo(x - s + arrowLength, y + arrowWidth/2);
	ctx.lineTo(x - s + arrowLength, y + stemWidth/2);

	ctx.lineTo(x + s, y + stemWidth/2);
	ctx.lineTo(x + s, y - stemWidth/2);

	ctx.lineTo(x - s + arrowLength, y - stemWidth/2);
	ctx.lineTo(x - s + arrowLength, y - arrowWidth/2);
	ctx.lineTo(x - s, y);
};

/**
 * Draws a star shape.
 * 
 * @static
 * @method drawStar
 * @param {HTML Canvas Context} ctx The graphics context to draw with.
 * @param {Number} x The x position to centre the shape on.
 * @param {Number} y The y position to centre the shape on.
 * @param {Number} size The size of the symbol.
 */
ia.Shape.drawStar = function(ctx, x, y, size)
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
	ctx.moveTo(x+(Math.cos(start)*outerRadius), y - (Math.sin(start)*outerRadius));

	// draw lines
	for (var i=1; i<=points; i++) 
	{
		dx = x + Math.cos(start+(step*i)-halfStep)*innerRadius;
		dy = y - Math.sin(start+(step*i)-halfStep)*innerRadius;
		ctx.lineTo(dx, dy);
		
		dx = x + Math.cos(start+(step*i))*outerRadius;
		dy = y -Math.sin(start+(step*i))*outerRadius;
		ctx.lineTo(dx, dy);
	}
};

/**
 * Draws the gradient. 
 * 
 * @static
 * @method drawGradient
 * @param {HTML Canvas Element} canvas The canvas to draw to.
 * @param {Array} colorList An array of color values.
 * @param {String} orientation "leftToRight"; "rightToLeft"; "topToBottom"; "bottomToTop" - default is "bottomToTop".
 */
ia.Shape.drawGradient = function(canvas, colorList, orientation)
{
	if (orientation == null) orientation = "bottomToTop";

	// Get the canvas context.
	var context = canvas.getContext("2d");

	// Create the gradient.
	var grd;

	if (orientation == "leftToRight")
		grd = context.createLinearGradient(0, 0, canvas.width, 0);
	else if (orientation == "rightToLeft")
		grd = context.createLinearGradient(canvas.width, 0, 0, 0);
	else if (orientation == "topToBottom")
		grd = context.createLinearGradient(0, 0, 0, canvas.height);
	else if (orientation == "bottomToTop")
		grd = context.createLinearGradient(0, canvas.height, 0, 0);

	// Loop through the color list to add colors to gradient.
	var n = colorList.length;
	for (var i = 0; i < n; i++) 
	{
		var pos = i/(n-1);
		grd.addColorStop(pos, colorList[i]);
	}

	context.rect(0, 0, canvas.width, canvas.height);
	context.fillStyle = grd;
};