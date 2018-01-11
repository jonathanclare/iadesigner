/** 
 * Factory for creating dropdown data explorers.
 *
 * @author J Clare
 * @class ia.DropdownExplorerFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.DropdownExplorerFactory = function(config, report, componentGroup)
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
        if (config.getProperty('hideOnSelection')) panel.hide();
    });

    // Components.

    // Panel.
    var panel = report.getWidget(config.id); 

    // Explorer.
    var showDates;
    var reverseDates;
    var dataTree;
    var oLabels;
    var oPositions;

    /** 
     * Builds the component.
     *
     * @method build
     * @param {Function} callbackFunction Called on completion of function, with the component id as the parameter.
     */
    this.build = function(callbackFunction)
    {
        addEventListeners();

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
        oLabels = {
            'geography':config.getProperty('geogLabel'),
            'theme':config.getProperty('themeLabel'),
            'indicator':config.getProperty('indicatorLabel'),
            'date':config.getProperty('dateLabel')
        };

        showDates = config.getProperty('showDates');
        reverseDates = config.getProperty('reverseDates');
        if (reverseDates == undefined) reverseDates = true;

        var geography = dataGroup.geography;
        if (report.data.getGeographies().length > 1) // Multi geography.
        {
            dataTree = report.data.getDataTree(showDates, reverseDates);
        }
        else // Single geography.
        {
            dataTree = geography.getDataTree(showDates, reverseDates);
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

    function getSelectedIds(selectId, selectValue)
    {
        var arrSelectedIds = [];

        // Up tree.
        var o = dataTree[selectId];
        while (o.parent != undefined)
        {
            arrSelectedIds.unshift(o.parent); 
            o = dataTree[o.parent];
        }

        arrSelectedIds.push(selectId); 

        // Down tree.
        if (selectValue != undefined)
        {
            arrSelectedIds.push(selectValue);
            var index = arrSelectedIds.length - 1;

            // Use these to maintain indicators and dates if they still exist in new selection
            var labels = [];
            panel.content.find('select.ia-dropdown-explorer-select').each(function() 
            {
                labels.push($j(this).find('option:selected').text());
            });

            o = dataTree[selectValue];
            while (o.children != undefined)
            {
                var label = labels[index];
                var childId = o.children[0];
                for (var j = 0; j < o.children.length; j++)
                {
                    var childId = o.children[j]
                    var oChild = dataTree[childId];
                    if (oChild.label == label)
                    {
                        childId = o.children[j];
                        break;
                    }
                }
                arrSelectedIds.push(childId); 
                o = dataTree[childId];
                index++;
            }
        }

        return arrSelectedIds;
    }

    function onChange(id)
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

        dataGroup.setData(geogId, indicatorId, date);
    }

    function showCurrentIndicator()
    {
        var indicator = dataGroup.indicator;
        var arrSelectedIds;
        if (showDates && indicator.date != undefined)
            arrSelectedIds = getSelectedIds(indicator.geography.id+'~'+indicator.id+'~'+indicator.date);
        else
            arrSelectedIds = getSelectedIds(indicator.geography.id+'~'+indicator.id);
        updateDropdowns(arrSelectedIds);
    }

    function updateDropdowns(arrSelectedIds)
    {
        panel.content.empty();
        var prevChildType;
        var str = '<div class="ia-dropdown-explorer">';

            for (var i = 0; i < arrSelectedIds.length; i++)
            {
                var id = arrSelectedIds[i];
                var o = dataTree[id];
                if (o.type == "branch")
                {
                    var selectedId = arrSelectedIds[i+1];

                    str += '<div class="ia-dropdown-explorer-section">';
                        if (prevChildType != o.childtype) 
                        {
                            var label = oLabels[o.childtype];
                            if (label != '' && label != undefined) str += '<label for="'+o.id+'" class="ia-select-label">'+label+'</label>';
                        }
                        str += '<select id="'+o.id+'" class="ia-select ia-dropdown-explorer-select">';
                            var item;
                            for (var j = 0; j < o.children.length; j++)
                            {
                                var childId = o.children[j]
                                var oChild = dataTree[childId];
                                if (oChild.id == selectedId) 
                                    str += '<option value="'+oChild.id+'" selected>'+oChild.label+'</option>';
                                else 
                                    str += '<option value="'+oChild.id+'">'+oChild.label+'</option>';
                            }
                        str += '</select>';
                    str += '</div>';

                    prevChildType = o.childtype;
                }
            }

        str += '</div>';
        panel.append($j(str));
    }


    function addEventListeners()
    {
        panel.content.on('change', '.ia-dropdown-explorer-select', function (e)
        {
            var id = $j(this).attr('id');
            var value = $j(this).val();
            var arrSelectedIds = getSelectedIds(id, value);
            onChange(arrSelectedIds[arrSelectedIds.length - 1]);
        });
    }
};