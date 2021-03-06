var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.util = iad.util || {};

    var electron = require('electron');
    var remote = electron.remote;
    var shell = electron.shell;

    iad.util.isUndefined = function (v)
    {
        if ((v === 'null') || (v === null) || (v === 'NaN') || (v === '') || (v === undefined)|| (v === 'undefined')) return true;
        else return false;
    };

    iad.util.debounce = function (func, wait, immediate) 
    {
        var timeout;
        return function() 
        {
            var me = this, args = arguments;
            var later = function() 
            {
                timeout = null;
                if (!immediate) func.apply(me, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait || 250);
            if (callNow) func.apply(me, args);
        };
    };

    iad.util.isNumeric = function (n) 
    {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    iad.util.checkInput = function (type)
    {
        var input = document.createElement("input");
        input.setAttribute("type", type);
        return input.type == type;
    };

    iad.util.guid = function ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
        {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    iad.util.getParam = function (name, url) 
    {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    iad.util.pathIsAbsolute = function (path)
    {
        // Test for absolute path.
        var r = new RegExp('^(?:[a-z]+:)?//', 'i');
        return r.test(path);

        /*
        r.test('http://example.com'); // true - regular http absolute URL
        r.test('HTTP://EXAMPLE.COM'); // true - HTTP upper-case absolute URL
        r.test('https://www.exmaple.com'); // true - secure http absolute URL
        r.test('ftp://example.com/file.txt'); // true - file transfer absolute URL
        r.test('//cdn.example.com/lib.js'); // true - protocol-relative absolute URL
        r.test('/myfolder/test.txt'); // false - relative URL
        r.test('test'); // false - also relative URL
        */
    };

    iad.util.getRelativePath = function (path)
    {
        if (path.lastIndexOf('./', 0) === 0) return path;
        else if (path.lastIndexOf('/', 0) === 0) return '.' + path;
        else return './' + path;
    };

    iad.util.getWindowProtocol = function (url)
    {
        var protocol = window.location.protocol == "file:" ? "http:" : window.location.protocol;
        return protocol + '//' + url.substr(url.indexOf('://') + 3);
    };

    iad.util.getDomainSafeUrl = function (url)
    {
        if (iad.util.pathIsAbsolute(url)) return iad.util.getWindowProtocol(url);
        else return iad.util.getRelativePath(url);
    };

    iad.util.getItem = function (arr, prop, value)
    {
        var arrFilter = arr.filter(function (o)
        {
            return o[prop] == value;
        });
        if (arrFilter.length === 0) return undefined;
        else return arrFilter[0];
    };

    iad.util.download = function (filename, content, type)
    {
        if (window.navigator.msSaveOrOpenBlob)
        {
            var blob = new Blob([content], { type: type });
            window.navigator.msSaveBlob(blob, filename);
        }
        else
        {
            var encodedUri = encodeURI('data:'+type+';charset=utf-8,' + content);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Electron.

    // Force links to open in default browser window.
    iad.util.forceLinksToOpenInBrowserWindow = function ()
    {  
        $(document).on('click', 'a[href^="http"]', function(event) 
        {
            event.preventDefault();
            shell.openExternal(this.href);
        });
        $(document).on('click', '.nav li.disabled a', function(event) 
        {
            event.preventDefault();
            shell.openExternal(this.href);
        });
    };

    // Open a new window.
    iad.util.openWin = function (url, w, h)
    {  
        var childWin = new remote.BrowserWindow({ width: w || 1000, height: h || 800});
        childWin.loadURL(url);
        childWin.on('closed', function() {childWin = null;});
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);