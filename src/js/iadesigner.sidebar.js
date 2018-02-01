var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.sidebar = iad.sidebar || {};

    // Passed in options.
    var options;

    // Container.
    var $container;

    iad.sidebar.init = function(o)
    {
        options = o;

        if (options && options.container)  $container = $(options.container);

        // Launch sidebars from elements with data-sidebar attribute 
        // with value being the id of the sidebar its associated with.
        $('[data-sidebar]').on('click', function (e)
        {
            var id = $(this).data('sidebar');
            iad.sidebar.show(id);
        });

        // Close sidebar button.
        $('.iad-sidebar-close-btn').on('click', function (e)
        {
            iad.sidebar.hide(getSidebarId($(this)));
        });

        // Undo sidebar button.
        $('.iad-sidebar-undo-btn').on('click', function (e)
        {
            iad.sidebar.undo(getSidebarId($(this)));
        });
    };

    iad.sidebar.show = function(id)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            var sidebarIsVisible = false;
            $('.iad-sidebar:visible').each(function()
            {
                var thisId = $(this).prop('id');
                if (thisId !== id) fadeOut(thisId);
                sidebarIsVisible = true;
            });
            if (sidebarIsVisible) fadeIn(id);
            else slideIn(id);
        }
    };

    iad.sidebar.isVisible = function(id)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length) return $sidebar.is(":visible");
        else return false;
    };

    iad.sidebar.hide = function(id, callback)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            if (options && options.onHide) options.onHide.call(null, id); 
            var w = $sidebar.outerWidth() * -1;
            if ($container !== undefined) $container.animate({left:'30px'}, {duration: 400, queue: false});
            $sidebar.animate({left: w + 'px'}, {duration: 400, queue: false, complete: function() 
            {
                $sidebar.hide({complete: function() 
                {
                    if (options && options.onHidden) options.onHidden.call(null, id); 
                    if (callback !== undefined) callback.call(null);
                }});
            }});
        }
    };

    iad.sidebar.undo = function(id)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            if (options && options.onUndo) options.onUndo.call(null, id); 
        }
    };

    function getSidebarId($element)
    {
        return $element.closest('.iad-sidebar').prop('id');
    }

    function fadeOut(id, callback)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            if ($sidebar.is(':visible'))
            {
                if (options && options.onHide) options.onHide.call(null, id); 
                var l = $sidebar.outerWidth() * -1;
                $sidebar.fadeOut({duration: 400, queue: false, complete: function() 
                {
                    $sidebar.css('left', l + 'px');
                    if (options && options.onHidden) options.onHidden.call(null, id); 
                    if (callback !== undefined) callback.call(null);
                }});
            }
        }
    }

    function fadeIn(id)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            if ($sidebar.is(':hidden'))
            {
                if (options && options.onShow) options.onShow.call(null, id); 
                $sidebar.css('left', '0px');
                $sidebar.fadeIn({duration: 400, queue: false, complete: function() 
                {
                    onShown(id);
                }});
            }
        }
    }

    function slideIn(id)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            if (options && options.onShow) options.onShow.call(null, id); 
            $sidebar.show({complete: function() 
            {
                $sidebar.animate({left: '0px'}, {duration: 400, queue: false, complete: function() 
                {
                    onShown(id);
                }});
                if ($container !== undefined)  $container.animate({left: $sidebar.outerWidth() + 'px'}, {duration: 400, queue: false});
            }});
        }
    }

    function onShown(id)
    {
        var $sidebar = $('#'+id);
        if ($sidebar.length)
        {
            if ($sidebar.data('initialised') !== true)
            {
                if (options && options.onFirstShown) options.onFirstShown.call(null, id); 
                $sidebar.data('initialised', true);
            }
            if (options && options.onShown) options.onShown.call(null, id); 
        }
    }

    return iad;

})(iadesigner || {}, jQuery, window, document);
