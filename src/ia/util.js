/**
 * Holds Instant Atlas utility functions.
 *
 * @module ia
 * @main ia
 */
var ia = ia ||
{
    // Utility functions.

    /** 
     * Check if value is undefined.
     *
     * @method log
     * @param {String|Number} v The value.
     */
    isUndefined: function(v)
    {
        if ((v == "null") || (v == null) || (v == "NaN") || (v == "") || (v == undefined)) return true;
        else return false;
    },

    /** 
     * Debugs to console.
     *
     * @method log
     * @param {String} s The text.
     */
    log: function(s)
    {
        if (window.console && window.console.log) window.console.log(s);

        // Debugging for touch devices.
        if (ia.isTouchDevice()) $j("#ia-debug-container").append("<span style='color:green'><br/>&gt; " + s + "</span>");
    },

    /** 
     * Checks if a string ends with a suffix.
     *
     * @method log
     * @param {String} str The string.
     * @param {String} suffix The suffix.
     */
    endsWith: function(str, suffix)
    {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },

    /** 
     * Test for a number.
     *
     * @method isNumber
     * @param {Object} n The value to test.
     * @return {Boolean} true or false.
     */
    isNumber: function(n)
    {
        return !isNaN(parseFloat(n)) && isFinite(n);
        /*var s = '' + n;
		var m = s.match(/^\-?[0-9]+(\.[0-9]+)?$j/);
		return (m != null);*/
    },

    /**
     * Shortcut for parseInt(). Copes with strings that have leading 0's.
     *
     * @method parseInt
     * @param {Object} s
     */
    parseInt: function(s, mag)
    {
        return parseInt(s, mag || 10);
    },

    /** 
     * A function used to extend one class with another.
     *
     * @method extend
     * @param {Object} baseClass The class from which to inherit.
     * @param {Object} subClass The inheriting class, or subclass.
     */
    extend: function(baseClass, subClass)
    {
        function inheritance()
        {}
        inheritance.prototype = baseClass.prototype;
        subClass.prototype = new inheritance();
        subClass.prototype.constructor = subClass;
        subClass.baseConstructor = baseClass;
        subClass.superClass = baseClass.prototype;
    },

    /** 
     * Quicksort is the fastest array sorting routine for
     * unordered arrays.  Its big O is n log n.
     *
     * @method Quicksort
     * @param {Number[]} vec The array to sort.
     * @param {Number} loBound The lower bound.
     * @param {Number} hiBound The upper bound.
     */
    Quicksort: function(vec, sortField, loBound, hiBound)
    {
        var pivot, loSwap, hiSwap, temp;

        // Two items to sort
        if (hiBound - loBound == 1)
        {
            if (vec[loBound][sortField] > vec[hiBound][sortField])
            {
                temp = vec[loBound];
                vec[loBound] = vec[hiBound];
                vec[hiBound] = temp;
            }
            return;
        }

        // Three or more items to sort
        pivot = vec[ia.parseInt((loBound + hiBound) / 2)];
        vec[ia.parseInt((loBound + hiBound) / 2)] = vec[loBound];
        vec[loBound] = pivot;
        loSwap = loBound + 1;
        hiSwap = hiBound;

        do {
            // Find the right loSwap
            while (loSwap <= hiSwap && vec[loSwap][sortField] <= pivot[sortField])
                loSwap++;

            // Find the right hiSwap
            while (vec[hiSwap][sortField] > pivot[sortField])
                hiSwap--;

            // Swap values if loSwap is less than hiSwap
            if (loSwap < hiSwap)
            {
                temp = vec[loSwap];
                vec[loSwap] = vec[hiSwap];
                vec[hiSwap] = temp;
            }
        }
        while (loSwap < hiSwap);

        vec[loBound] = vec[hiSwap];
        vec[hiSwap] = pivot;

        // Recursively call function...  the beauty of quicksort.

        // 2 or more items in first section		
        if (loBound < hiSwap - 1)
            ia.Quicksort(vec, sortField, loBound, hiSwap - 1);


        // 2 or more items in second section
        if (hiSwap + 1 < hiBound)
            ia.Quicksort(vec, sortField, hiSwap + 1, hiBound);
    },

    /** 
     * Path to root of virtual directory.
     *
     * @property proxyMapStem
     * @type Object
     */
    proxyMapStem: "../",

    /** 
     * The proxy mapping object.
     *
     * @property proxyMapStem
     * @type Associative Array
     */
    proxyMaps: undefined,

    /** 
     * Indicates whether to use a proxy.
     *
     * @property useProxy
     * @type Boolean
     * @default false
     */
    useProxy: false,

    /** 
     * An access token used for authentication.
     *
     * @property accessToken
     * @type String
     */
    accessToken: "",

    /** 
     * Adds a proxy.
     *
     * @method addProxy
     * @param {String} domain The domain.
     * @return {String} proxy The proxy replacement.
     */
    addProxy: function(domain, proxy)
    {
        if (ia.proxyMaps == undefined) ia.proxyMaps = new Object();
        ia.proxyMaps[domain] = proxy;
    },

    /** 
     * Gets a domain safe url.
     *
     * @method getDomainSafeUrl
     * @param {String} url The url.
     * @return {String} The domain safe url.
     */
    getDomainSafeUrl: function(url)
    {
        var safe = url;
        if (ia.useProxy)
        {
            var start = url.indexOf('://') + 3;
            var server = url.substring(0, url.indexOf('/', start) + 1);
            if (ia.proxyMaps && ia.proxyMaps[server]) safe = url.replace(server, ia.proxyMapStem + ia.proxyMaps[server]);
        }
        return safe;
    },

    /** 
     * The registered app id.
     *
     * @property regAppId
     * @type String
     */
    regAppId: '83wV2txRMBrDpKjq',

    /** 
     * Redirects to AGOL authentication.
     */
    redirectToArcGisOnlineAuth: function()
    {
        // This will open the AGOL login page. Once logged in the page is redirected to the report with an appended token that can be used to access the data in the report.
        var authUrl = 'https://www.arcgis.com/sharing/oauth2/authorize?client_id=' + ia.regAppId + '&response_type=token&redirect_uri=' + encodeURI(window.location.href);
        window.location.href = authUrl;
    },

    /** 
     * Gets a "nice" number. Useful for axis labels.
     *
     * @method getNiceNum
     * @param {Number} val The value.
     * @param {Boolean} round Should the value be rounded.
     * @return {Number} The number.
     */
    getNiceNum: function(val, round)
    {
        var expt = Math.floor(ia.log10(val));
        var f = val / Math.pow(10, expt);
        var nf;
        if (round)
        {
            if (f < 1.5) nf = 1;
            else if (f < 3) nf = 2;
            else if (f < 7) nf = 5;
            else nf = 10;
        }
        else
        {
            if (f <= 1) nf = 1;
            else if (f <= 2) nf = 2;
            else if (f <= 5) nf = 5;
            else nf = 10;
        }
        return nf * Math.pow(10, expt);
    },

    /** 
     * Gets the log10 of a value.
     *
     * @method log10
     * @param {Number} val The value.
     * @param {Number} noDigits The number of digits to round to.
     * @return {Number} The log value.
     */
    log10: function(val)
    {
        return Math.log(val) / Math.LN10;
    },

    /** 
     * Rounds a value.
     *
     * @method round
     * @param {Number} val The value.
     * @param {Number} noDigits The number of digits to round to.
     * @return {Number} The rounded value.
     */
    round: function(val, noDigits)
    {
        var m = Math.pow(10, noDigits);
        var rn = Math.round(val * m) / m;
        return rn;
    },

    /** 
     * Disables text selection in the object.
     * (Recommended because it causes text selection issues when dragging mouse)
     *
     * @method disableTextSelection
     * @param {JQUERY Element} ele The jquery object.
     */
    disableTextSelection: function(ele)
    {
        var target = ele.get(0);
        if (typeof target.onselectstart != "undefined") // IE route
            target.onselectstart = function()
        {
            return false
        }
        else if (typeof target.style.MozUserSelect != "undefined") // Firefox route
            target.style.MozUserSelect = "none"
        else // All other route (ie: Opera)
            target.onmousedown = function()
        {
            return false
        }
    },

    /** 
     * Enables text selection in the object.
     *
     * @method enableTextSelection
     * @param {JQUERY Element} ele The jquery object.
     */
    enableTextSelection: function(ele)
    {
        var target = ele.get(0);
        if (typeof target.onselectstart != "undefined") // IE route
            target.onselectstart = function()
        {
            return true
        }
        else if (typeof target.style.MozUserSelect != "undefined") // Firefox route
            target.style.MozUserSelect = "text"
        else // All other route (ie: Opera)
            target.onmousedown = function()
        {
            return true
        }
    },

    /** 
     * Loads a css file.
     *
     * @method loadCssfile
     * @param {String} href The path to the file.
     * @param {Function} callbackfunction An optional callback function.
     */
    loadCssfile: function(href, callbackfunction)
    {
        /*var fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", href);
		if (typeof fileref != "undefined") document.getElementsByTagName("head")[0].appendChild(fileref)*/

        // Load and inline the styles via ajax because Chrome bails on gzipped CSS if it is not served as text/css and ArcGIS Online serves it as text/plain
        var head = document.getElementsByTagName("head")[0];
        var newCss = document.createElement('style');
        newCss.type = 'text/css';
        head.appendChild(newCss);
        ia.File.load(
        {
            url: href,
            onSuccess: function(cssText)
            {
                newCss.appendChild(document.createTextNode(cssText));
                if (callbackfunction != undefined) callbackfunction.call(null);
            }
        });
    },

    /** 
     * Appends css to the html document.
     *
     * @method appendCss
     * @param {String} cssText The css text to append.
     * @param {Function} callbackfunction An optional callback function.
     */
    appendCss: function(cssText, callbackfunction)
    {
        // Load and inline the styles via ajax because Chrome bails on gzipped CSS if it is not served as text/css and ArcGIS Online serves it as text/plain
        var head = document.getElementsByTagName("head")[0];
        var newCss = document.createElement('style');
        newCss.type = 'text/css';
        head.appendChild(newCss);
        newCss.appendChild(document.createTextNode(cssText));
        if (callbackfunction != undefined) callbackfunction.call(null);
    },

    /** 
     * Gets the minimum precision required for a set of values, whilst maintaining the numbers.
     *
     * @method _getPrecision
     * @param {Number[]} brks A list of values.
     * @return {Number} The precision.
     * @private
     */
    getPrecision: function(brks)
    {
        var precision = 0;
        var nClasses = brks.length - 1;
        for (var i = 0; i < nClasses; i++)
        {
            var p;

            // Added the BigDecimal class to cope with floating point errors like this
            //
            // 0.2 - 0.1 = 0.9999999999999999
            //
            // Infinity and -Infinity not handled by BigDecimal.
            var minValue = brks[i];
            var maxValue = brks[i + 1];

            if (ia.isNumber(minValue) && ia.isNumber(maxValue))
            {
                var diff = Math.abs(maxValue - minValue);

                if (minValue != Infinity && minValue != -Infinity && maxValue != Infinity && maxValue != -Infinity)
                {
                    minValue = new BigDecimal("" + minValue);
                    maxValue = new BigDecimal("" + maxValue);
                    diff = Math.abs(maxValue.subtract(minValue));
                }

                if ((diff > 0) && (diff < 1))
                {
                    var isExponential = String(diff).indexOf("e");
                    if (isExponential != -1)
                    {
                        var bd = new BigDecimal("" + diff);
                        p = Math.abs(bd.exp);
                    }
                    else
                    {
                        var decimals = String(diff).split(".")[1];
                        var isExponential = decimals.indexOf("e");
                        if (isExponential != -1)
                        {
                            var index;
                            if (decimals.indexOf("+") != -1) index = isExponential + 2; // Removes plus sign.
                            else index = isExponential + 1; // Maintains minus sign.
                            p = decimals.substr(index);
                        }
                        else
                        {
                            var decimalsToInt = String(ia.parseInt(decimals));
                            p = (decimals.length - decimalsToInt.length) + 1;
                        }
                    }

                    if (p > precision) precision = p;
                }
                else if (String(minValue).indexOf(".") > -1)
                {
                    p = 1;
                    if (p > precision) precision = p;
                }
            }
        }
        return precision;
    },

    /**
     * Processes function strings.
     *
     * @method callFunction
     * @param {String} inString This may be a url or contain a call to 'javascript:'  or 'script:'.
     * It may also be a semi colon delimited list of calls to javascript functions :
     * 'javascript:toggleTable;toggleMap'.
     * @param {String} target The url target. _blank for a new window or tab, _self for the current page,
     * top for the topmost frame container, or _parent for the parent of
     * the current frame container.
     * @param {Event} e An optional event.
     */
    callFunction: function(inString, target, e)
    {
        var fncList;
        var fncType = "none"

        // Process the function string.
        if ((inString.indexOf("script") == 0) || (inString.indexOf("javascript") == 0))
        {
            fncType = inString.split(":")[0]
            var fncString = inString.substring(inString.indexOf(":") + 1);
            fncList = fncString.split(";");
        }
        else fncList = inString.split(";");

        for (var i = 0; i < fncList.length; i++)
        {
            if (fncList[i]) ia.processFunction(fncList[i], fncType, target, e)
        }
    },

    /**
     * Processes function strings.
     *
     * @param inString This may be a url or contain a call to a function
     * example functions:
     *	myFunction
     * 	myFunction()
     *	myFunction(myParameter)
     *	myFunction(myParameter,myOtherParameter)
     *	myFunction('my parameter','my other parameter')
     *
     * @method processFunction
     * @param {String} type This may be 'url', 'javascript' or 'script'.
     * @param {String} target The url target. _blank for a new window or tab, _self for the current page,
     * top for the topmost frame container, or _parent for the parent of
     * the current frame container.
     * @param {Event} e An optional event.
     */
    processFunction: function(inString, type, target, e)
    {
        var functionName;
        var params = [];

        if ((type == "script") || (type == "javascript")) // Its a function.
        {
            var fnc = inString;

            // Check for brackets.
            if (fnc.indexOf("(") != -1)
            {
                // Get function name and strip white space.
                functionName = jQuery.trim(fnc.substring(0, fnc.indexOf("(")));

                // Check for parameters.
                var paramString = fnc.substring(fnc.indexOf("(") + 1, fnc.indexOf(")"));
                if (paramString != "")
                {
                    params = paramString.split(",");
                    for (var j = 0; j < params.length; j++)
                    {
                        // Strip white space and quotations around strings.
                        var p = jQuery.trim(params[j]);

                        // Strip quotations from around strings if they exist.
                        if (p.indexOf("'") == 0 && p.lastIndexOf("'") == p.length - 1) p = p.substr(1, p.length - 2);
                        else if (p.indexOf('"') == 0 && p.lastIndexOf('"') == p.length - 1) p = p.substr(1, p.length - 2);

                        // Trim converts numbers to strings so change back here.
                        if (ia.isNumber(p)) p = parseFloat(p);

                        params[j] = p;
                    }
                }
            }
            else
            {
                functionName = jQuery.trim(fnc);
            }

            if (e) params[params.length] = e;

            //ia.log("function name: "+functionName)
            //ia.log("function params: "+params);
            window[functionName].apply(null, params);
        }
        else // Its a url.
        {
            if (target == undefined) target = "_blank";
            window.open(inString, target);
        }
    },

    /** 
     * Determines if the browser supports canvas.
     *
     * @method supportsCanvas
     * @return {Boolean} true or false.
     */
    supportsCanvas: function()
    {
        return !!document.createElement('canvas').getContext;
    },

    /** 
     * Determines if its a touch device.
     *
     * @method isTouchDevice
     * @return {Boolean} true or false.
     */
    isTouchDevice: function()
    {
        return 'ontouchstart' in window;
    },

    /** 
     * Disables default touch functionality.
     *
     * @method disableDefaultTouch
     * @return {Boolean} true or false.
     */
    disableDefaultTouch: function()
    {
        if (ia.isTouchDevice())
        {
            // Prevent default touch as it causes too many issues.
            document.body.addEventListener('touchstart touchend touchmove', function(event)
            {
                event.preventDefault();
            }, false);
            document.ontouchmove = function(e)
            {
                e.preventDefault();
            }
        }
    },

    /** 
     * Displays the wait cursor.
     *
     * @method showWaitCursor
     */
    showWaitCursor: function()
    {
        $j("body").css("cursor", "wait");
    },

    /** 
     * Displays the default cursor.
     *
     * @method showDefaultCursor
     */
    showDefaultCursor: function()
    {
        document.onselectstart = function()
        {
            return ia.useTextSelection;
        }
        $j("body").css("cursor", "default");
    },

    /** 
     * Displays the given cursor.
     *
     * @method showCursor
     * @param {String} type The cursor type.
     */
    showCursor: function(type)
    {
        // Stop chrome from changing to selection cursor on drag.
        document.onselectstart = function()
        {
            return false;
        }
        $j("body").css("cursor", type);
    },

    /** 
     * Displays the move cursor.
     *
     * @method showMoveCursor
     */
    showMoveCursor: function()
    {
        // Stop chrome from changing to selection cursor on drag.
        document.onselectstart = function()
        {
            return false;
        }
        $j("body").css("cursor", "move");
    },

    /** 
     * Displays the pointer cursor.
     *
     * @method showPointerCursor
     */
    showPointerCursor: function()
    {
        $j("body").css("cursor", "pointer");
    },


    /**
     * Gets the data url of the passed in jquery element (use this for screen grabs).
     *
     * @method getDataUrl
     * @param {JQuery Object} $container The element to be captured.
     * @param {Function} callbackFunction Called on completion of function - contains the data url as a parameter.
     */
    getDataUrl: function($container, callback)
    {
        html2canvas($container.get(0),
        {
            onrendered: function(canvas)
            {
                try 
                {
                    callback.call(null, canvas.toDataURL("image/png"));
                }
                catch(e)
                {
                    callback.call(null);
                }
            }
        });
    },

    /** 
     * Tests if text select icon is used on drag.
     *
     * @property useTextSelection
     * @type Boolean
     */
    useTextSelection: document.onselectstart,

    /** 
     * IAS relative path - used to make server work.
     *
     * @property IAS_PATH
     * @type String
     * @default ""
     */
    IAS_PATH: "",

    /** 
     * Is it a touch device?
     *
     * @property IS_TOUCH_DEVICE
     * @type Boolean
     * @default false
     */
    IS_TOUCH_DEVICE: false,

    /** 
     * Is the browser IE 10?
     *
     * @property IS_IE_TEN
     * @type Boolean
     * @default false
     */
    IS_IE_TEN: false,

    /** 
     * Indicates we are using a single map report.
     *
     * @static
     * @final
     * @property SINGLE_MAP_REPORT
     * @type String
     * @default "timeseries_advanced_sm::flash::html"
     */
    SINGLE_MAP_REPORT: "timeseries_advanced_sm::flash::html",

    /** 
     * Indicates we are using a pyramid report.
     *
     * @static
     * @final
     * @property PYRAMID_REPORT
     * @type String
     * @default "timeseries_advanced_sm::flash::pyramid::html"
     */
    PYRAMID_REPORT: "timeseries_advanced_sm::flash::pyramid::html",

    /** 
     * Indicates we are using a spine report.
     *
     * @static
     * @final
     * @property SPINE_REPORT
     * @type String
     * @default "areaprofiler::flash::html"
     */
    SPINE_REPORT: "areaprofiler::flash::html",

    /** 
     * Indicates we are using an election report.
     *
     * @static
     * @final
     * @property ELECTION_REPORT
     * @type String
     * @default "areaprofiler::flash::election::html"
     */
    ELECTION_REPORT: "areaprofiler::flash::election::html",

    /** 
     * Indicates we are using a double geog report.
     *
     * @static
     * @final
     * @property DOUBLE_GEOG_REPORT
     * @type String
     * @default "double_timeseries_advanced_dm::flash::html"
     */
    DOUBLE_GEOG_REPORT: "double_timeseries_advanced_dm::flash::html",

    /** 
     * Indicates we are using a double geog report with a single map.
     * This is the double base layer template.
     *
     * @static
     * @final
     * @property DOUBLE_BASELAYER_REPORT
     * @type String
     * @default "double_timeseries_advanced_dm::flash::double_base::html"
     */
    DOUBLE_BASELAYER_REPORT: "double_timeseries_advanced_dm::flash::double_base::html",

    /** 
     * Indicates we are using a double base layer report.
     * This is the new double base layer template, thats not currently in use.
     *
     * @static
     * @final
     * @property DOUBLE_BASELAYER_REPORT_NEW
     * @type String
     * @default "double_timeseries_advanced_dm::flash::double_base::html"
     */
    DOUBLE_BASELAYER_REPORT_NEW: "double_timeseries_advanced_dm::flash::double_base_new::html",

    /** 
     * Indicates we are using a double plot report.
     *
     * @static
     * @final
     * @property DOUBLE_PLOT_REPORT
     * @type String
     * @default "timeseries_advanced_dm::flash::html"
     */
    DOUBLE_PLOT_REPORT: "timeseries_advanced_dm::flash::html",

    /** 
     * Indicates we are using a Bubble plot report.
     *
     * @static
     * @final
     * @property BUBBLE_PLOT_REPORT
     * @type String
     * @default "bubbleplot::flash::html"
     */
    BUBBLE_PLOT_REPORT: "bubbleplot::flash::html",

    /** 
     * Indicates we are using a bubble plot single report.
     *
     * @static
     * @final
     * @property BUBBLE_PLOT_REPORT_SINGLE
     * @type String
     * @default "bubbleplot::flash::html::single"
     */
    BUBBLE_PLOT_REPORT_SINGLE: "bubbleplot::flash::html::single"
};

/**
 * Common GLOBAL functions that can be called from config.xml.
 *
 * @param report The InstantAtlas Report object.
 */
iaAddGlobalFunctions = function(report)
{
    /**
     * Toggles the visibility of the element with the passed id.
     *
     * @param id The panel id.
     *
     * config.xml href="javascript:iaToggle(dataExplorer)"
     */
    iaToggle = function(id)
    {
        report.closePopups(id);
        var widget = report.getWidget(id);
        if (widget != undefined) widget.toggle();
        else // May be a different sort of widget like a button.
        {
            var widget = report.getWidget(id);
            if (widget != undefined) widget.toggle();
        }
    };

    /**
     * Show a component.
     *
     * @param id The component id.
     */
    iaShow = function(id)
    {
        var widgetId = id+"-panel";
        report.closePopups(widgetId);

        var widget = report.getWidget(widgetId);
        if (widget != undefined) widget.show();
        else // May be a different sort of widget like a button.
        {
            var widget = report.getWidget(id);
            if (widget != undefined) widget.show();
        }
    };

    /**
     * Hide a component.
     *
     * @param id The component id.
     */
    iaHide = function(id)
    {
        var widgetId = id+"-panel";
        report.closePopups(widgetId);

        var widget = report.getWidget(widgetId);
        if (widget != undefined) widget.hide();
        else // May be a different sort of widget like a button.
        {
            var widget = report.getWidget(id);
            if (widget != undefined) widget.hide();
        }
    };

    /**
     * Resize a component.
     *
     * @param id The component id.
     * @param w The new width of the component in % of the full report width.
     * @param h The new height of the component in % of the full report height.
     */
    iaResize = function(id, w, h)
    {
        var widgetId = id+"-panel";
        report.closePopups(widgetId);

        var widget = report.getWidget(widgetId);
        if (widget != undefined) widget.setSize(w, h);
        else // May be a different sort of widget like a button.
        {
            var widget = report.getWidget(id);
            if (widget != undefined) widget.setSize(w, h);
        }
    };

    /**
     * Toggles the visibility of the popup window.
     *
     * @param url The url of a html file to place in the popup.
     *
     * config.xml href="javascript:iaTogglePopup(./help.htm)"
     */
    iaTogglePopup = function(url)
    {
        if (url.indexOf("http") == -1) url = ia.IAS_PATH + url;

        // Open in window if a touch device because scrolling isnt handled well in pop-up div.
        if (ia.IS_TOUCH_DEVICE) window.open(url, "_blank");
        else
        {
            iaToggle("popup");
            var popupContent = report.getComponent("popup");
            popupContent.setHtml(url);
        }
    };

    /**
     * Toggles the visibility of the callout with the passed id.
     *
     * @param id The callout id.
     * @param e The associated event.
     *
     * config.xml href="javascript:iaToggleCallout(shareCallout)"
     */
    iaToggleCallout = function(id, e)
    {
        var callout = report.getCallout(id);

        if (callout != undefined)
        {
            if (e.originalEvent.touches)
            {
                var touchEvent = e.originalEvent.changedTouches[0];
                callout.position(touchEvent.pageX, touchEvent.pageY);
            }
            else callout.position(e.pageX, e.pageY);
            callout.toggle();
        }
    };

    /**
     * Toggles the visibility of the legend callout.
     *
     * @param e The associated event.
     *
     * config.xml href="javascript:iaToggleLegendEditor()"
     */
    iaToggleLegendEditor = function(e)
    {
        iaToggleCallout("legend-callout", e);
    };

    /**
     * Toggles the visibility of the help.
     *
     * @param e The associated event.
     *
     * config.xml href="javascript:iaToggleHelp()"
     */
    iaToggleHelp = function(e)
    {
        iaTogglePopup('./help.htm');
    };

    /**
     * Toggles the visibility of the share callout.
     *
     * @param e The associated event.
     *
     * config.xml href="javascript:iaToggleShare()"
     */
    iaToggleShare = function(e)
    {
        report.blockInteraction('iaShare', true, function()
        {
            // Get the report url.
            var url = ia.getUrl();

            // Share.
            $j("#ia-share-callout").val(url);

            // Embed.
            var embedCode = "<iframe src='" + decodeURIComponent(window.location.href) + "' style='width:800px;height:600px;border-width:0px'></iframe>"
            $j("#ia-embed-callout").val(embedCode);

            // Capture screen shot.
            ia.getDataUrl(report.container, function(dataURL)
            {
                /*var a = document.createElement('a');
				var htmlText;
				if (typeof a.download != "undefined") 
				{
					var txt = report.config.getProperty("saveImageText");
					htmlText = '<div class="ia-share-text">'+txt+'</div><a href="'+dataURL+'" download="dashboard.png"><img class="ia-export-thumbnail" src="'+dataURL+'"/></a>'
				}
				else
				{
					var txt = report.config.getProperty("saveImageText");
					htmlText += '<p><div><img class="ia-thumbnail" src="'+dataURL+'"/></div></p>'
				}*/

                if (dataURL != undefined)
                {
                    // Thumbnail.
                    var txt = report.config.getProperty("saveImageText");
                    var htmlText = '<div class="ia-share-text">' + txt + '</div><a href="' + dataURL + '" download="dashboard.png"><img class="ia-export-thumbnail" src="' + dataURL + '"/></a>'
                    $j("#ia-thumbnail-callout").html(htmlText);
                }

                // Show callout.
                var callout = report.getCallout("shareCallout");
                if (e.originalEvent.changedTouches)
                {
                    var touchEvent = e.originalEvent.changedTouches[0];
                    callout.position(touchEvent.pageX, touchEvent.pageY);
                }
                else callout.position(e.pageX, e.pageY);
                callout.show();

                report.allowInteraction('iaShare');
            });
        });
    };

    /**
     * Exports a chart image.
     *
     * config.xml href="javascript:iaExportData()"
     */
    var exportCallout = new ia.CalloutBox("exportCallout", "top-bottom");
    exportCallout.popup(true);
    report.addCallout(exportCallout);
    var $exportContent = $j("<div>");
    exportCallout.append($exportContent);
    iaExportDataUrl = function(dataURL, e)
    {
        var txt = report.config.getProperty("saveImageText");
        var htmlText = '<div class="ia-share-text">' + txt + '</div><a href="' + dataURL + '" download="chart.png"><img class="ia-export-thumbnail" src="' + dataURL + '"/></a>'
        $exportContent.html(htmlText);

        if (e.originalEvent.changedTouches)
        {
            var touchEvent = e.originalEvent.changedTouches[0];
            exportCallout.position(touchEvent.pageX, touchEvent.pageY);
        }
        else exportCallout.position(e.pageX, e.pageY);
        exportCallout.show();
    };

    /**
     * Exports a panel with a chart (gives better resolution for the chart than iaExportPanel).
     *
     * config.xml href="javascript:iaExportPanelWithChart()"
     */
    iaExportPanelWithChart = function(panel, chart, includeLogo, e)
    {
        // Check if theres a header.
        if (panel.header.text().trim().length) 
        {
            ia.getDataUrl(panel.header, function (dataHeader)
            {
                var imgHeader = document.createElement('img');
                imgHeader.addEventListener('load', function() 
                {
                    var dataChart = chart.exportData(includeLogo);
                    var imgChart = document.createElement('img');
                    imgChart.addEventListener('load', function() 
                    {
                        var c = document.createElement('canvas');
                        c.width = chart.canvas.width;
                        c.height = imgHeader.height + chart.canvas.height;
                        c.getContext("2d").drawImage(imgHeader,0,0);
                        c.getContext("2d").drawImage(imgChart,0,imgHeader.height);
                        var dataURL = c.toDataURL("image/png");
                        iaExportDataUrl(dataURL, e);

                    });
                    imgChart.src = dataChart;
                });
                imgHeader.src = dataHeader;
            });
        }
        else
        {
            var dataUrl = chart.exportData(includeLogo);
            iaExportDataUrl(dataUrl, e);
        }
    };

    /**
     * Exports a panel.
     *
     * config.xml href="javascript:iaExportPanelWithChart()"
     */
    iaExportPanel = function(panel, e)
    {
        // Check if theres a header.
        if (panel.header.text().trim().length) 
        {
            ia.getDataUrl(panel.header, function (dataHeader)
            {
                var imgHeader = document.createElement('img');
                imgHeader.addEventListener('load', function() 
                {
                    ia.getDataUrl(panel.content, function (dataContent)
                    {
                        var imgContent = document.createElement('img');
                        imgContent.addEventListener('load', function() 
                        {
                            var c = document.createElement('canvas');
                            c.width = imgContent.width;
                            c.height = imgHeader.height + imgContent.height;
                            c.getContext("2d").drawImage(imgHeader,0,0);
                            c.getContext("2d").drawImage(imgContent,0,imgHeader.height);
                            var dataURL = c.toDataURL("image/png");
                            iaExportDataUrl(dataURL, e);

                        });
                        imgContent.src = dataContent;
                    });
                });
                imgHeader.src = dataHeader;
            });
        }
        else
        {
            ia.getDataUrl(panel.content, function(dataUrl)
            {
                iaExportDataUrl(dataUrl, e);
            });
        }
    };

    /**
     * Exports table data.
     *
     * config.xml href="javascript:iaExportData()"
     */
    iaExportCSV = function(csvString, e)
    {
        var htmlText = '<textarea rows="15" cols="40">' + csvString + '</textarea>';
        $exportContent.html(htmlText);

        if (e.originalEvent.changedTouches)
        {
            var touchEvent = e.originalEvent.changedTouches[0];
            exportCallout.position(touchEvent.pageX, touchEvent.pageY);
        }
        else exportCallout.position(e.pageX, e.pageY);
        exportCallout.show();
    };

    /**
     * Toggle profile treeMap.
     *
     * config.xml href="javascript:iaToggleProfileTree()"
     */
    iaToggleProfileTree = function()
    {
        var profile = report.getComponent("spineChart");
        profile.toggleTree();
    };

    /**
     * Open print preview window.
     *
     * config.xml href="javascript:iaOpenPrintPreview()"
     */
    iaOpenPrintPreview = function()
    {
        var url = ia.getUrl();
        url += "&printmode=true";
        window.open(url, "_blank");

    	// Capture screen shot.
        /*ia.getDataUrl(report.container, function(dataURL)
        {
           	var txt = report.config.getProperty("saveImageText");
			window.open().document.write('<img src="'+dataURL+'"/>');
        });*/
    };

    /**
     * KM.
     */
    iacPopMetadata = function(iasObjectType, iasObjectId, iasObjectName, extraContent)
    {
        // Does stuff but this will do:
        alert(iasObjectType + ' ' + iasObjectId);
    };
};

// For dashed lines in canvas - the default implemented version of dashed line is buggy.
// http://stackoverflow.com/questions/15397036/drawing-dashed-lines-on-html5-canvas
CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen, gapLen) 
{
    if (dashLen == undefined) dashLen = 2;
    if (gapLen == undefined) gapLen = dashLen;
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;

    var combined = Math.floor(Math.sqrt(dX * dX + dY * dY) / (dashLen + gapLen));
    combined = combined * 2;

    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var gaps = Math.floor(Math.sqrt(dX * dX + dY * dY) / gapLen);

    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var gapX = dX / gaps;
    var gapY = dY / gaps;

    var q = 0;
    while (q++ < combined) 
    {
        if (q % 2 == 0)
        {
            x1 += gapX;
            y1 += gapY;
            this.moveTo(x1, y1);
        }
        else
        {
            x1 += dashX;
            y1 += dashY;
            this.lineTo(x1, y1);
        }
        //this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    if (q % 2 == 0)
    {
        x1 += gapX;
        y1 += gapY;
        this.moveTo(x2, y2);
    }
    else
    {
        x1 += dashX;
        y1 += dashY;
        this.lineTo(x2, y2);
    }
    //this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
};

// https://gist.github.com/notmasteryet/1057924 - to support background mapping export in IE9 - uInt8Array
(function()
{
    try
    {
        var a = new Uint8Array(1);
        return; //no need
    }
    catch (e)
    {}

    function subarray(start, end)
    {
        return this.slice(start, end);
    }

    function set_(array, offset)
    {
        if (arguments.length < 2) offset = 0;
        for (var i = 0, n = array.length; i < n; ++i, ++offset)
            this[offset] = array[i] & 0xFF;
    }

    // we need typed arrays
    function TypedArray(arg1)
    {
        var result;
        if (typeof arg1 === "number")
        {
            result = new Array(arg1);
            for (var i = 0; i < arg1; ++i)
                result[i] = 0;
        }
        else
            result = arg1.slice(0);
        result.subarray = subarray;
        result.buffer = result;
        result.byteLength = result.length;
        result.set = set_;
        if (typeof arg1 === "object" && arg1.buffer)
            result.buffer = arg1.buffer;

        return result;
    }

    window.Uint8Array = TypedArray;
    window.Uint32Array = TypedArray;
    window.Int32Array = TypedArray;
})();


(function()
{
    if ("response" in XMLHttpRequest.prototype ||
        "mozResponseArrayBuffer" in XMLHttpRequest.prototype ||
        "mozResponse" in XMLHttpRequest.prototype ||
        "responseArrayBuffer" in XMLHttpRequest.prototype)
        return;
    Object.defineProperty(XMLHttpRequest.prototype, "response",
    {
        get: function()
        {
            return new Uint8Array(new VBArray(this.responseBody).toArray());
        }
    });
})();

(function()
{
    if ("btoa" in window)
        return;

    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    window.btoa = function(chars)
    {
        var buffer = "";
        var i, n;
        for (i = 0, n = chars.length; i < n; i += 3)
        {
            var b1 = chars.charCodeAt(i) & 0xFF;
            var b2 = chars.charCodeAt(i + 1) & 0xFF;
            var b3 = chars.charCodeAt(i + 2) & 0xFF;
            var d1 = b1 >> 2,
                d2 = ((b1 & 3) << 4) | (b2 >> 4);
            var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
            var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
            buffer += digits.charAt(d1) + digits.charAt(d2) + digits.charAt(d3) + digits.charAt(d4);
        }
        return buffer;
    };
})();