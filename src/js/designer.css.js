var designer = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.css = iad.css || {};

    // For parsing less into css.
    var lessParser;     

    // Holds default.less as a string.
    var strLess;        

    // Less variables.
    var lessVars = {};

    // Passed in options.
    var options;

    // Has css been initialised.
    var initialised = false;

    // Initialise.
    iad.css.init = function(o)
    {
        options = o; 
        lessParser = new(less.Parser)();
        iad.css.setLessVars(options.lessVars);
    };

    // Returns the current report css as a string.
    iad.css.getCssAsString = function(callback)
    {
        readLessFile(function()
        {
            // Make a copy of the orginal less string.
            var inLess = String(strLess);

            // Convert the less variables to a string that can be 
            // added to the top of the less string.
            var strCssVars = '';
            for (var property in lessVars)
            {
                var value = lessVars[property];
                strCssVars = strCssVars + property + ':' + value + ';';
            }
            inLess = strCssVars + inLess;
            
            // Parse the css string.
            lessParser.parse(inLess, function(err, tree)
            {
                if (err) console.error(err);
                var strOutCss = tree.toCSS();
                callback.call(null, strOutCss); // Return.
            });
        });
    };

    function readLessFile(callback)
    {
        if (strLess === undefined)
        {
            $.ajax(
            {
                url: options.lessFile,
                dataType: 'text',
                success: function(str)
                {
                    strLess = String(str); // Less string.
                    callback.call(null);  
                }
            });
        }
        else callback.call(null);  
    }

    // Load in a less variables file.
    iad.css.loadLessVarsFile = function(srcLessVars)
    {
        // Read in less variables from AGOL on initial page load.
        $.getJSON(srcLessVars)
        .done(function(jsonLessVars)
        {
            iad.css.setLessVars(jsonLessVars);
        })
        .fail(function(jqXHR, textStatus, errorThrown)
        {
            console.error(errorThrown);
        });
    };

    // Set the less vars.
    iad.css.setLessVars = function(jsonLessVars)
    {
        // Extend our lessVars object here - this is so we dont get errors
        // if we add new css properties and they arent contained in the 
        // users saved version.
        if (jsonLessVars !== undefined) 
        {
            $.extend(lessVars, jsonLessVars);

            // Update the css.
            less.modifyVars(lessVars);

            if (options && options.onLessVarsChanged) options.onLessVarsChanged.call(null, lessVars);
        }
        
        if (!initialised && options && options.onReady) options.onReady.call(null);
        initialised = true;
    };

    // Sets a property.
    iad.css.setProperty = function(property, value)
    {
        // Modify the less variable if a property and value have been supplied.
        if (property !== undefined && value !== undefined)
        {
            // Prepend '@' if its isnt already there.
            if (property.indexOf('@') !== 0) property = '@' + property;
            lessVars[property] = value;
        }

        // Update the css.
        less.modifyVars(lessVars);

        if (options && options.onPropertyChanged) options.onPropertyChanged.call(null, property, value);
    };

    return iad;

})(designer || {}, jQuery, window, document);
