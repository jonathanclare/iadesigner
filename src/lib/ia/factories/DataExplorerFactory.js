/** 
 * Factory for creating data explorers.
 *
 * @author J Clare
 * @class ia.DataExplorerFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.DataExplorerFactory = function(config, report, componentGroup)
{
    var me = this;

    // Data and Interaction groups that the components belongs to.
    var interactionGroup = componentGroup.interactionGroup;
    var dataGroup = componentGroup.dataGroup;
    var comparisonInteractionGroup = componentGroup.comparisonInteractionGroup;

    // Event handlers.

    // This code executes every time a geography has changed.
    dataGroup.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
    {
        me.update();
    });

    // This code executes every time the data groups data has changed.
    dataGroup.addEventListener(ia.DataEvent.DATA_CHANGED, function(event)
    {
        showCurrentIndicator();
        if (explorer.hideOnSelection) panel.hide();
    });

    // Components.

    // Panel.
    var panel = report.getWidget(config.id); 

    // Explorer.
    var explorer;
    var showDates;
    var reverseDates;

    /** 
     * Builds the component.
     *
     * @method build
     * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
     */
    this.build = function(callbackFunction)
    {
        // Empty panel.
        panel.content.empty();
    
        // Explorer.
        explorer = new ia.DataExplorer(config.id, function(id)
        {
            // id of the form 'geogId~indicatorid~date'.
            var dataIds = id.split("~");
            var geogId = dataIds[0];
            var indicatorId = dataIds[1];
            var date = dataIds[2];

            // Try and match from the previous date if one hasnt been selected.
            if (date == undefined) date = dataGroup.indicator.date;

            // When dates are not displayed load the most recent date on a selection.
            if (config.getProperty("showDates") == false)
            {
                var mrd = config.getProperty("loadMostRecentDate");
                if (mrd != undefined && mrd == true) date = undefined;
            }

            dataGroup.setData(geogId, indicatorId, date)
        });
        panel.append(explorer.container);
        report.addComponent(config.id, explorer);

        if (callbackFunction != undefined) callbackFunction.call(null, config.id);
    };

    /** 
     * Updates the component.
     *
     * @method update
     * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
     */
    this.update = function(callbackFunction)
    {
        explorer.closeBranchesOnSelection = config.getProperty("closeBranchesOnSelection");
        explorer.hideOnSelection = config.getProperty("hideOnSelection");

        showDates = config.getProperty("showDates");
        reverseDates = config.getProperty("reverseDates");
        if (reverseDates == undefined) reverseDates = true;
        var geography = dataGroup.geography;

        // If the geography explorer exists we only want to put
        // themes and indicators into the data explorer tree.
        if (report.config.getComponent("geogExplorer") != undefined
            || report.config.template == ia.DOUBLE_GEOG_REPORT
            || report.config.template == ia.DOUBLE_BASELAYER_REPORT
            || report.config.template == ia.DOUBLE_PLOT_REPORT
            || report.config.template == ia.BUBBLE_PLOT_REPORT
            || report.config.template == ia.DOUBLE_BASELAYER_REPORT_NEW)
        {
            explorer.data(geography.getDataTree(showDates, reverseDates));
            explorer.build(geography.id);
        }
        // For backwards compatibility before geogExplorer was added to config.
        // Also places geographies in the data explorer tree if the
        // geography explorer has been removed from the config.
        else 
        {
            if (report.data.getGeographies().length > 1) // Multi geography.
            {
                explorer.data(report.data.getDataTree(showDates, reverseDates));
                explorer.build();
            }
            else // Single geography.
            {
                explorer.data(geography.getDataTree(showDates, reverseDates));
                explorer.build(geography.id);
            }
        }

        showCurrentIndicator();

        if (callbackFunction != undefined) callbackFunction.call(null, config.id);
    };

    /** 
     * Renders the component.
     *
     * @method render
     * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
     */
    this.render = function(callbackFunction)
    {
        if (callbackFunction != undefined) callbackFunction.call(null, config.id);
    };

    // Show the current indicator in the explorer.
    function showCurrentIndicator()
    {
        var indicator = dataGroup.indicator;
        if (showDates && indicator.date != undefined)
            explorer.showItem(indicator.geography.id+"~"+indicator.id+"~"+indicator.date);
        else
            explorer.showItem(indicator.geography.id+"~"+indicator.id);
    };
};