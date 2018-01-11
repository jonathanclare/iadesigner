/** 
 * The <code>TextSubstitution</code> class contains functions for 
 * variable subtitution in strings.
 * 
 * <p>All variables are indicated by the name of the variable. This class registers these names
 * with variable values, allowing the lookup of variable values
 * by the variable name. The set of available variables can be extended by using 
 * the static <code>setVariable</code> method to register a new variable name and
 * value.</p>
 *
 * @author J Clare
 * @class ia.TextSubstitution
 * @constructor
 */
ia.TextSubstitution = function() 
{
	// For removing whitespace when formatting text.
	this._TAB = 9;
	this._LINEFEED = 10;
	this._CARRIAGE = 13; 
	this._SPACE = 32; 
	
	// An object that holds the values for substitution variables.
	// An example might be: {themeName:"Theme 1"; indicatorName:"Indicator 1"}.
	this._substitutionVariables = new Object();
};

/**
 * Sets the value for the given substitution variable.
 * 
 * @method setVariable
 * @param {String} name The name of the variable
 * @param {String} value The value of the variable.
 */
ia.TextSubstitution.prototype.setVariable = function(name, value)
{
	this._substitutionVariables[name] = value;
};

/**
 * Clears the variables.
 *
 * @method clearVariables
 */
ia.TextSubstitution.prototype.clearVariables = function()
{
	this._substitutionVariables = new Object();
};

/**
 * Replaces all instances of a variable name in a string with the 'real' values.
 * 
 * @method formatMessage
 * @param {String} msg The input string which may contain variable names, for example: 'Current theme is: ${themeName1}'.
 * @return {String} The input string with all variables substituted out.
 */
ia.TextSubstitution.prototype.formatMessage = function(msg) 
{
	var s = msg + '';

	// Iterate through the variable strings.
	while (s.indexOf('${') >= 0) 
	{
		// Get the variable string
		var start = s.indexOf('${');
		var end = s.indexOf('}', start);
		var variableString = s.substring(start, end + 1);

		// Look for and / or statements.
		if ((variableString.indexOf('&&') != -1 
			|| variableString.indexOf('||') != -1)
			&& variableString.indexOf('==') != -1)
		{
			var arr = variableString.split("==");

			var trueFalseValues = this._trim(arr[1]);
			trueFalseValues = trueFalseValues.substring(trueFalseValues.indexOf("(") + 1, trueFalseValues.indexOf(')'))

			var andOrString = this._trim(arr[0]);
			var variableArray = andOrString.split(/&&|\|\|/);
			
			for (var i = 0; i < variableArray.length; i++) 
			{ 
				var nestedVariableString = variableArray[i];
				var replacementString;

				if (i == 0)
					replacementString = this._processVariable(this._trim(nestedVariableString) + '}');
				else
					replacementString = this._processVariable('${' + this._trim(nestedVariableString) + '}');

				andOrString = this._replace(andOrString, nestedVariableString, replacementString);
			}

			// The replacement string.
			var replacementString = this._processVariable("${andOrTest('" + andOrString + "'," + trueFalseValues +  ")}");

			// Substitute.
			s = this._replace(s, variableString, replacementString);
		}
		else
		{

			// The replacement string.
			var replacementString = this._processVariable(variableString);

			// Substitute.
			s = this._replace(s, variableString, replacementString);
		}
	}

	return s;
};

/**
 * Processes a conditional statement.
 * 
 * @method _processVariable
 * @param {String} variableString The variable string.
 * @private
 */
ia.TextSubstitution.prototype._processVariable = function(variableString) 
{
	// The test to carry out.
	var test = variableString.substring(variableString.indexOf("{") + 1, variableString.indexOf('('));

	// Nested Themes
	if (test.indexOf('themeName') != -1)
	{
		// Theme names as stored as arrays of nested theme names.
		var themeNames = this._substitutionVariables[test];
		var replacementString = "";

		if (themeNames != undefined)
		{
			if (themeNames.length == 1) // Just one theme.
			{
				replacementString = themeNames[0];
			}
			else // Its a nested theme
			{
				var separator = variableString.substring(variableString.indexOf("'") + 1, variableString.lastIndexOf("'"));
				var index = 0;
				for (var i = 0; i < themeNames.length; i++) 
				{ 
					var t = themeNames[i];
					if (index == 0) replacementString = t;
					else replacementString = replacementString + separator + t;
					index++;
				}
			}
		}
		return replacementString;
	}		

	// Its a simple variable with no conditional statement.
	if (test == "${") 
	{
		var variableName = variableString.substring(2, variableString.length - 1);
		return this._formatValue(variableName);
	}

	// Trim the variable string and create an array.
	variableString = this._trim(variableString.substring(variableString.indexOf('(') + 1, variableString.lastIndexOf(')}')));
	var variableArray = variableString.split(',');
	
	test = test.toLowerCase();
	var testValue;			// The value being tested.
	var comparisonValue; 	// The value to test against.
	var trueValue;			// The value to substitute if test returns true.
	var falseValue;			// The value to substitute if test returns false.

	// And / Or test.
	if (test == "andortest")
	{
		testValue = this._formatValue(variableArray[0]);
		trueValue = this._formatValue(variableArray[1]);
		falseValue = this._formatValue(variableArray[2]);

		try 
		{
			var test = eval(testValue);
			if (test == true)  return trueValue;
			else if (test == false)  return falseValue;
			else return "";
		} 
		catch (e) 
		{
			return "";
		}
	}
	// Conditional.
	else if (test == "empty")
	{
		testValue = this._formatValue(variableArray[0]);
		trueValue = this._formatValue(variableArray[1]);
		falseValue = this._formatValue(variableArray[2]);
		if (variableArray.length < 2) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if ((testValue == undefined) || (testValue.toString() == ''))  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "notempty")
	{
		testValue = this._formatValue(variableArray[0]);
		trueValue = this._formatValue(variableArray[1]);
		falseValue = this._formatValue(variableArray[2]);
		if (variableArray.length < 2) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if ((testValue != undefined) && (testValue.toString() != ''))  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "equals")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		trueValue = this._formatValue(variableArray[2]);
		falseValue = this._formatValue(variableArray[3]);
		if (variableArray.length < 3) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (testValue == comparisonValue)  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "notequals")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		trueValue = this._formatValue(variableArray[2]);
		falseValue = this._formatValue(variableArray[3]);
		if (variableArray.length < 3) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (testValue != comparisonValue)  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "greaterthan")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		trueValue = this._formatValue(variableArray[2]);
		falseValue = this._formatValue(variableArray[3]);
		if (variableArray.length < 3) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (parseFloat(testValue) > parseFloat(comparisonValue))  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "greaterthanorequalto")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		trueValue = this._formatValue(variableArray[2]);
		falseValue = this._formatValue(variableArray[3]);
		if (variableArray.length < 3) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (parseFloat(testValue) >= parseFloat(comparisonValue))  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "lessthan")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		trueValue = this._formatValue(variableArray[2]);
		falseValue = this._formatValue(variableArray[3]);
		if (variableArray.length < 3) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (parseFloat(testValue) < parseFloat(comparisonValue))  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "lessthanorequalto")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		trueValue = this._formatValue(variableArray[2]);
		falseValue = this._formatValue(variableArray[3]);
		if (variableArray.length < 3) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (parseFloat(testValue) <= parseFloat(comparisonValue))  return trueValue;
		else if (falseValue != undefined)  return falseValue;
	}
	else if (test == "even")
	{
		testValue = this._formatValue(variableArray[0]);
		trueValue = this._formatValue(variableArray[1]);
		falseValue = this._formatValue(variableArray[2]);
		if (variableArray.length < 2) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (parseFloat(testValue)%2 == 0)
			return trueValue;
		else
			return falseValue;
	}
	else if (test == "odd")
	{
		testValue = this._formatValue(variableArray[0]);
		trueValue = this._formatValue(variableArray[1]);
		falseValue = this._formatValue(variableArray[2]);
		if (variableArray.length < 2) // true / false test with no output value.
		{
			trueValue = true;
			falseValue = false;
		}

		if (parseFloat(testValue)%2 == 0)
			return falseValue;
		else
			return trueValue;
	}
	// Math.
	else if (test == "multiply")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return (parseFloat(testValue) * parseFloat(comparisonValue));
	}
	else if (test == "divide")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return (parseFloat(testValue) / parseFloat(comparisonValue));
	}
	else if (test == "add")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return (parseFloat(testValue) + parseFloat(comparisonValue));
	}
	else if (test == "subtract")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return (parseFloat(testValue) - parseFloat(comparisonValue));
	}
	else if (test == "min")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return Math.min(parseFloat(testValue), parseFloat(comparisonValue));
	}
	else if (test == "max")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return Math.max(parseFloat(testValue), parseFloat(comparisonValue));
	}
	else if (test == "pow")
	{
		testValue = this._formatValue(variableArray[0]);
		comparisonValue = this._formatValue(variableArray[1]);
		return Math.pow(parseFloat(testValue), parseFloat(comparisonValue));
	}
	else if (test == "sqrt")
	{
		testValue = this._formatValue(variableArray[0]);
		return Math.sqrt(parseFloat(testValue));
	}
	else if (test == "exp")
	{
		testValue = this._formatValue(variableArray[0]);
		return Math.exp(parseFloat(testValue));
	}
	else if (test == "log")
	{
		testValue = this._formatValue(variableArray[0]);
		return Math.log(parseFloat(testValue));
	}
	else if (test == "abs")
	{
		testValue = this._formatValue(variableArray[0]);
		return Math.abs(parseFloat(testValue));
	}

	return "";
};

/**
 * Extracts a variable / string / number from a conditional statement.
 * 
 * @method _formatValue
 * @param {String} variableString The conditional statement.
 * @param {Number} index The position of the variable in the statement.
 * @return {String} The variable or an empty string.
 * @private
 */
ia.TextSubstitution.prototype._formatValue = function(value) 
{
	if (value != undefined)
	{
		var inValue = this._trim(value);
		var outValue = "";

		// Check if its a string array, variable, string or number.

 		// Its a string array variable.
		if (inValue.indexOf("[") != -1 && inValue.indexOf("]") != -1)
		{
			var variableName = inValue.substring(0, inValue.indexOf("["));
			var index = inValue.substring(inValue.indexOf("[")+1, inValue.indexOf("]"));
			var arr = this._substitutionVariables[variableName];
			if (arr.indexOf(";") != -1) outValue = arr.split(";")[index];
			else if (arr.indexOf(",") != -1) outValue = arr.split(",")[index];
		} 
		// Its a string so remove quotes.
		else if ((inValue.charAt(0) == '"') || (inValue.charAt(0) == '\'')) outValue = inValue.substring(1, inValue.length - 1);
		// Its a number so parse it.
		else if (ia.isNumber(inValue)) outValue = inValue;
		// Its a variable so get its substitution value.
		else outValue = this._substitutionVariables[inValue];

		//if (ia.isNumber(outValue)) outValue = parseFloat(outValue);

		if (outValue == undefined) return "";
		else return outValue;
	}
	return ""; // Empty.
};	

/**
 * Removes whitespace from a string.
 * 
 * @method _trim
 * @param {String} s The string.
 * @return {String} The input string with whitespace removed.
 * @private
 */
ia.TextSubstitution.prototype._trim = function(s) 
{
   return this._leftTrim(this._rightTrim(s)); 
}; 

/**
 * Removes whitespace from the right side of a string.
 * 
 * @method _rightTrim
 * @param {String} s The string.
 * @return {String} The input string with whitespace removed.
 * @private
 */
ia.TextSubstitution.prototype._rightTrim = function(s) 
{
   var i = s.length - 1;
   while(s.charCodeAt(i) == this._SPACE 
       || s.charCodeAt(i) == this._CARRIAGE 
       || s.charCodeAt(i) == this._LINEFEED 
       || s.charCodeAt(i) == this._TAB) 
   {
      i--;
   }
   return s.substring(0,i+1);
};

/**
 * Removes whitespace from the left side of a string.
 * 
 * @method _leftTrim
 * @param {String} s The string.
 * @return {String} String with whitespace removed.
 * @private
 */
ia.TextSubstitution.prototype._leftTrim = function(s) 
{
   var i = 0;   
   while(s.charCodeAt(i) == this._SPACE 
      || s.charCodeAt(i) == this._CARRIAGE 
      || s.charCodeAt(i) == this._LINEFEED 
      || s.charCodeAt(i) == this._TAB) 
   {
      i++;
   }   
   return s.substring(i,s.length);
}; 

/**
 * Replaces a pattern in a string with a new pattern.
 * eg. All occurrences of ";" may be replaced with ";".
 * 
 * @method _replace
 * @param {String} s The string.
 * @param {String} pattern The pattern.
 * @param {String} replacement The pattern replacements.
 * @return {String} The input string with the pattern replaced.
 * @private
 */
ia.TextSubstitution.prototype._replace = function(s, pattern, replacement)
{
	return s.split(pattern).join(replacement);
};