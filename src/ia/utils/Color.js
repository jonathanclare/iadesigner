/** 
 * The <code>Color</code> class is an all-static class with methods for working with colors. 
 * You do not create instances of <code>Color</code> instead you simply call static methods 
 * such as the <code>Color.getRandomColor()</code> method.
 * 
 * <p>All colors must use the format #<i>RRGGBB</i>. <i>RR</i>, <i>GG</i>, and <i>BB</i> 
 * each consist of two hexadecimal digits that specify the offset of each color component.</p>
 *
 * @author J Clare
 * @class ia.Color
 * @constructor
 */
ia.Color = function() {};

/**
 * Returns the red component of a color value.
 * 
 * @static
 * @method r
 * @param {String} c The color value.
 * @return  {String} The red component.
 */
ia.Color.r = function(c)
{
	var r;
	if (ia.Color.isHSV(c))
		r = ia.parseInt((ia.Color.cutRgb(ia.Color.HSVtoRGB(c)))[0]);
	else if (ia.Color.isHex(c))
		r = ia.parseInt((ia.Color.cutHex(c)).substring(0,2),16);
	else if (ia.Color.isRGB(c))
		r = ia.parseInt((ia.Color.cutRgb(c))[0]);
	return r;
};

/**
 * Returns the green component of a color value.
 * 
 * @static
 * @method g
 * @param {String} c The color value.
 * @return {String} The green component.
 */
ia.Color.g = function(c)
{
	var g;
	if (ia.Color.isHSV(c))
		g = ia.parseInt((ia.Color.cutRgb(ia.Color.HSVtoRGB(c)))[1]);
	else if (ia.Color.isHex(c))
		g = ia.parseInt((ia.Color.cutHex(c)).substring(2,4),16);
	else if (ia.Color.isRGB(c))
		g = ia.parseInt((ia.Color.cutRgb(c))[1]);
	return g;
};

/**
 * Returns the blue component of a color value.
 * 
 * @static
 * @method b
 * @param {String} c The color value
 * @return {String} The blue component
 */
ia.Color.b = function(c)
{
	var b;
	if (ia.Color.isHSV(c))
		b = ia.parseInt((ia.Color.cutRgb(ia.Color.HSVtoRGB(c)))[2]);
	else if (ia.Color.isHex(c))
		b = ia.parseInt((ia.Color.cutHex(c)).substring(4,6),16);
	else if (ia.Color.isRGB(c))
		b = ia.parseInt((ia.Color.cutRgb(c))[2]);
	return b;	
};

/**
 * Returns the alpha component of a color value.
 * 
 * @static
 * @method a
 * @param {String} c The color value.
 * @return {String} The alpha component.
 */
ia.Color.a = function(c)
{
	var a;
	if (ia.Color.isHSV(c))
		a = parseFloat(c[3]);
	else if (ia.Color.isHex(c))
		a = parseFloat((ia.Color.cutHex(c)).substring(6,8),16);
	else if (ia.Color.isRGB(c))
		a = parseFloat((ia.Color.cutRgb(c))[3]);
	return a;
};

/**
 * Returns the hue component of a color value.
 * 
 * @static
 * @method h
 * @param {String} c The color value.
 * @return  {String} The hue component 0 - 360.
 */
ia.Color.h = function(c)
{
	return ia.Color.toHSVA(c)[0];
};

/**
 * Returns the saturation component of a color value.
 * 
 * @static
 * @method s
 * @param {String} c The color value.
 * @return  {String} The hue component 0 - 100.
 */
ia.Color.s = function(c)
{
	return ia.Color.toHSVA(c)[1];
};

/**
 * Returns the value component of a color value.
 * 
 * @static
 * @method v
 * @param {String} c The color value.
 * @return  {String} The hue component 0 - 100.
 */
ia.Color.v = function(c)
{
	return ia.Color.toHSVA(c)[2];
};

/**
 * Returns a color value with the given red, green, blue, and alpha
 * components.
 * 
 * @static
 * @method toRGBA
 * @param {String} c A string of the form "rgb(25,90,127)" or "#FFFFFF".
 * @param {Number} alpha The alpha value 0 to 1.
 * @return {String} A string of the form "rgb(25,90,127, 0.1)".
 */
ia.Color.toRGBA = function(c, alpha)
{
	var a = alpha;
	if (a == undefined) a = 1;
	var r = ia.Color.r(c);
	var g = ia.Color.g(c);
	var b = ia.Color.b(c);
	return ia.Color.rgba(r, g, b, a);
};

/**
 * Returns a color value for a given string. 
 * Checks if the color is hex. If it is hex
 * the hex value is simply returned. If its
 * is rgb it is converted into hex and returned
 * 
 * @static
 * @method toHex
 * @param {String} c A string of the form "rgb(25,90,127)" or "#FFFFFF".
 * @return {String} The hex color value or 0.
 */
ia.Color.toHex = function(c)
{
	var r = ia.Color.r(c);
	var g = ia.Color.g(c);
	var b = ia.Color.b(c);
	var hex = "#"+ia.Color.intToHex(r)+ia.Color.intToHex(g)+ia.Color.intToHex(b);
	return hex;
};

/**
 * Returns a color value with the given hue, saturation, value, and alpha
 * components.
 * 
 * @static
 * @method toHSVA
 * @param {String} c A string of the form "rgb(25,90,127)" or "#FFFFFF".
 * @param {Number} alpha The alpha value 0 to 1.
 * @return {String} An of the form "[255,100,100,1]" - "[h,s,v,a]".
 */
ia.Color.toHSVA = function(c, alpha)
{
	var r = ia.Color.r(c);
	var g = ia.Color.g(c);
	var b = ia.Color.b(c);

	var h, s, v;
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);

	if ( max == min ) h = 0;
	else if ( max == r ) h = ( 60 * (g - b) / ( max - min ) + 360 ) % 360;
	else if ( max == g ) h = 60 * ( b - r ) / ( max - min ) + 120;
	else if ( max == b ) h = 60 * ( r - g ) / ( max - min ) + 240;

	if ( max == 0 ) s = 0;
	else  s = (1 - min / max) * 100;

	v = (max / 255) * 100;

	return [h, s, v, alpha];
};

/**
 * Converts HSV to RGB.
 * 
 * @static
 * @method HSVtoRGB
 * @param {String} c An array of the form "[h, s, v, a]".
 * @return {String} A string of the form "rgb(25,90,127, 0.1)".
 */
ia.Color.HSVtoRGB = function(c)
{
	var h = c[0];
	var s = c[1] / 100;
	var v = (c[2] / 100) * 255;
	var a = c[3];

	if ( h < 0 ) { h += 360; }

	var hi = Math.floor( h / 60 ) % 6;
	var f = h / 60 - Math.floor( h / 60 );
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - ( 1 - f ) * s );
	var r, g, b;

	switch( hi ) 
	{
		case 0: 
			r = v;
			g = t;
			b = p;
		break;
		case 1: 
			r = q;
			g = v;
			b = p;
		break;
		case 2: 
			r = p;
			g = v;
			b = t;
		break;
		case 3: 
			r = p;
			g = q;
			b = v;
		break;
		case 4: 
			r = t;
			g = p;
			b = v;
		break;
		case 5: 
			r = v;
			g = p;
			b = q;
		break;
	}
	
	return ia.Color.rgba(r,g,b,a);
};

/** 
 * Validates a hex color.
 *
 * @static
 * @method validHex
 * @param {String} value The color.
 * @return {String} The validated value.
 */
ia.Color.validHex = function(value) 
{
	var value = value.replace(/[^#a-fA-F0-9]/g, ''); // non [#a-f0-9]
	value = value.toLowerCase();
	if(value.match(/#/g) && value.match(/#/g).length > 1) value = value.replace(/#/g, ''); // ##
	if(value.indexOf('#') == -1) value = '#'+value; // no #
	if(value.length > 7) value = value.substr(0,7); // too many chars
	return value;
};

/** 
 * Get the hexadecimal value of an integer.
 *
 * @static
 * @method intToHex
 * @param {Number} n The integer.
 * @return {String} The hexadecimal value.
 */
ia.Color.intToHex = function(n)
{
	if (n == null) return "00";
	n = ia.parseInt(n);
	if (n == 0 || isNaN(n)) return "00";
	n = Math.max(0,n);
	n = Math.min(n,255);
	n = Math.round(n);
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
};

/** 
 * Get a hexadecimal colour with the hash removed.
 *
 * @static
 * @method cutHex
 * @param {String} c The color.
 * @return {String} The color.
 */
ia.Color.cutHex = function(c) {return (c.charAt(0)=="#") ? c.substring(1,7) : c;};

/** 
 * Get an rgb colour as an array.
 *
 * @static
 * @method cutRgb
 * @param {String} c The color.
 * @return {Array} An array.
 */
ia.Color.cutRgb = function(c)
{
	var cutRGB = c.substring(c.indexOf("(")+1,c.indexOf(")"));
	var rgbArray = cutRGB.split(",");
	return rgbArray;
};

/** 
 * Tests if the color is a hex.
 *
 * @static
 * @method isHex
 * @param {String} c The color.
 * @return {Boolean} true or false.
 */
ia.Color.isHex = function(c)
{
	return (c.indexOf("#") == 0);
};

/** 
 * Tests if the color is a rgb.
 *
 * @static
 * @method isRGB
 * @param {String} c The color.
 * @return {Boolean} true or false.
 */
ia.Color.isRGB = function(c)
{
	return (c.indexOf("rgb") != -1);
};

/** 
 * Tests if the color is a hsv.
 *
 * @static
 * @method isHSV
 * @param {String} c The color.
 * @return {Boolean} true or false.
 */
ia.Color.isHSV = function(c)
{
	return (Object.prototype.toString.call(c) == '[object Array]');
};

/**
 * Returns a color value with the given red, green, blue, and alpha
 * components.
 * 
 * @static
 * @method rgba
 * @param {Number} r The red component (0-255).
 * @param {Number} g The green component (0-255).
 * @param {Number} b The blue component (0-255).
 * @param {Number} a The alpha component (0-1).
 * @return {String} The color value.
 */
ia.Color.rgba = function(r, g, b, a)
{
	if (a == undefined) a = 1;
	return "rgba("+Math.floor(r)+","+Math.floor(g)+","+Math.floor(b)+","+a+")";
};

/**
 * Interpolate between two color values by the given mixing proportion.
 * A mixing fraction of 0 will result in c1, a value of 1.0 will result
 * in c2, and value of 0.5 will result in the color mid-way between the
 * two in RGB color space.
 * 
 * @static
 * @method getInterpolatedColor
 * @param {String} c1 The starting color.
 * @param {String} c2 The target color.
 * @param {Number} f A fraction between 0 and 1 controlling the interpolation.
 * @return {String} The interpolated color.
 */
ia.Color.getInterpolatedColor = function(c1, c2, f)
{
	var t;
	return ia.Color.rgba(
		(t=ia.Color.r(c1)) + f*(ia.Color.r(c2)-t),
		(t=ia.Color.g(c1)) + f*(ia.Color.g(c2)-t),
		(t=ia.Color.b(c1)) + f*(ia.Color.b(c2)-t));
};

/** 
 * Returns a randomly generated color.
 * 
 * @static
 * @method getRandomColor
 * @return {String} The random color.
 */
ia.Color.getRandomColor = function()
{
	var r = Math.round(Math.random() * 255);
	var g = Math.round(Math.random() * 255);
	var b = Math.round(Math.random() * 255);
	return ia.Color.rgba(r,g,b);
};

/**
 * Lightens a color by the given percentage.
 * 
 * @static
 * @method lighten
 * @param {String} c The color.
 * @param {String} p The percentage as a fraction (0 - 1).
 * @return {String} The new color as a hex value.
 */
ia.Color.lighten = function(c, p) 
{
	var hsv = ia.Color.toHSVA(c); 

	var v= hsv[2];
	v = v + (v * p);
	if (v > 100) v = 100;
	if (v < 0) v = 0;
	hsv[2] = v;
	
	return ia.Color.toHex(hsv);
};

/**
 * Lightens a color by the given percentage.
 * 
 * @static
 * @method lighten
 * @param {String} c The color.
 * @param {String} percent The percentage as a fraction (-1 to 1).
 * @return {String} The new color as a hex value.
 */
ia.Color.shade = function(c, percent) 
{   
	var color = ia.Color.toHex(c); 
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
};

/**
 * Darkens a color by the given percentage.
 * 
 * @static
 * @method darken
 * @param {String} c The color.
 * @param {String} p The percentage as a fraction (0 - 1).
 * @return {String} The new color as a hex value.
 */
ia.Color.darken = function(c, p) 
{
	return ia.Color.lighten(c, (p*-1));
};

/**
 * Adjusts the saturation and value of the color.
 * 
 * @static
 * @method adjustSV
 * @param {String} c The color.
 * @param {String} s The saturation (0 - 100).
 * @param {String} v The value (0 - 100).
 * @return {String} The new color as a hex value.
 */
ia.Color.adjustSV = function(c, s, v) 
{
	var hsv = ia.Color.toHSVA(c); 
	hsv[1] = s;
	hsv[2] = v;
	return ia.Color.toHex(hsv);
};

/**
 * Saturates a color by the given percentage.
 * 
 * @static
 * @method saturate
 * @param {String} c The color.
 * @param {String} p The percentage as a fraction (0 - 1).
 * @return {String} The new color as a hex value.
 */
ia.Color.saturate = function(c, p) 
{
	var hsv = ia.Color.toHSVA(c); 

	var s = hsv[1];
	s = s + (s * p);
	if (s > 100) s = 100;
	if (s < 0) s = 0;
	hsv[1] = s;
	
	return ia.Color.toHex(hsv);
};

/**
 * desaturates a color by the given percentage.
 * 
 * @static
 * @method desaturate
 * @param {String} c The color.
 * @param {String} p The percentage as a fraction (0 - 1).
 * @return {String} The new color as a hex value.
 */
ia.Color.desaturate = function(c, p) 
{
	return ia.Color.saturate(c, (p*-1));
};

/** 
 * Shifts the hue by the given amount.
 * 
 * @static
 * @method hueShift
 * @param {Number} h The hue 0 - 360.
 * @param {Number} amount The amount 0 - 360.
 */
ia.Color.hueShift = function(h, amount) 
{
	h+=amount; 
	while (h>=360.0) h-=360.0; 
	while (h<0.0) h+=360.0; 
	return h; 
};

/** 
 * Returns a complementary color.
 * 
 * @static
 * @method complement
 * @param {String} c The color value.
 * @return {String} The complemetary color value.
 */
ia.Color.complement = function(c)
{
	var hsv = ia.Color.toHSVA(c); 
	var hue = hsv[0];
	hsv[0] = ia.Color.hueShift(hue,180.0);
	return ia.Color.toHex(hsv);
};

/** 
 * Returns an array containing the two triad colors.
 * 
 * @static
 * @method triad
 * @param {String} c The color value.
 * @return [String] The two triad colors.
 */
ia.Color.triad = function(c)
{
	var hsv = ia.Color.toHSVA(c); 
	var hue = hsv[0];
	var c1 = [ia.Color.hueShift(hue,180.0-24),hsv[1],hsv[2]];
	var c2 = [ia.Color.hueShift(hue,180.0+24),hsv[1],hsv[2]];
	return [ia.Color.toHex(c1),ia.Color.toHex(c2)];
};

/** 
 * Returns an array containing the two analogic colors.
 * 
 * @static
 * @method analogic
 * @param {String} c The color value.
 * @return [String] The two analogic colors.
 */
ia.Color.analogic = function(c)
{
	var hsv = ia.Color.toHSVA(c); 
	var hue = hsv[0];
	var c1 = [ia.Color.hueShift(hue,-24),hsv[1],hsv[2]];
	var c2 = [ia.Color.hueShift(hue,+24),hsv[1],hsv[2]];
	return [ia.Color.toHex(c1),ia.Color.toHex(c2)];
};