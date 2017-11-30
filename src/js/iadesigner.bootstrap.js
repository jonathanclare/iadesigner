var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.bootstrap = iad.bootstrap || {};

    // Contains any bootstrap overrides.

    // Menu bar hover dropdowns.
    $('ul.nav > li.dropdown').on('mouseover', function(e)
    {
        $(this).find('.dropdown-menu').show();
    });
    $('ul.nav > li.dropdown').on('mouseout', function(e)
    {
        $(this).find('.dropdown-menu').hide();
    });
    $('ul.nav > li.dropdown > ul.dropdown-menu > li > a').on('click', function(e)
    {
        $(this).closest('ul.dropdown-menu').fadeOut();
    });

    return iad;

})(iadesigner || {}, jQuery, window, document);
