/** 
 * Factory for creating data explorers.
 *
 * @author J Clare
 * @class ia.DimensionsFactory
 * @param {ia.ComponentConfig} config The component config.
 * @param {ia.Report} report The report object.
 * @param {Object} componentGroup  Hash table containing the Data and  Interaction Groups that the component belongs to:
 * {dataGroup:ia.DataGroup, interactionGroup:ia.InteractionGroup, comparisonInteractionGroup:ia.InteractionGroup}.
 */
ia.DimensionsFactory = function(config, report, componentGroup)
{
    var me = this;

    // Data and Interaction groups that the components belongs to.
    var dataGroup = componentGroup.dataGroup;

    // Event handlers.

    // This code executes every time a geography has changed.
    dataGroup.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
    {
        me.update();
    });

    // Components.

    // Panel.
    var panel = report.getWidget(config.id); 
    var arrIndicators;

    // Config Settings.
    var arrDimensionNames, arrDimensionCheckbox, indicatorSelectTitle, resetButtonText, noSelectionValue;

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
        // Empty panel.
        panel.content.empty();

		/*
		    var arrDimensionNames = ['Speciality','Theme','Location / Service Area','Topic'];
		    var arrDimensionCheckbox = ['Theme'];
		    var indicatorSelectTitle = ['Indicator'];
		    var resetButtonText = 'Reset';
		    var noSelectionValue = ['-'];
		*/

        arrDimensionNames = config.getProperty('arrDimensionNames') || [];
        arrDimensionCheckbox = config.getProperty('arrDimensionCheckbox') || [];
        indicatorSelectTitle = config.getProperty('indicatorSelectTitle') || '';
        resetButtonText = config.getProperty('resetButtonText') || '';
        noSelectionValue = config.getProperty('noSelectionValue') || '';

        getAllIndicators();
        addControls();
        updateControls();

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

    function getAllIndicators ()
    {
        arrIndicators = dataGroup.geography.getIndicators();
        arrIndicators = arrIndicators.filter(function (item, pos) 
        {
            var index = arrIndicators.map(function(o) { return o.id; }).indexOf(item.id);
            return index == pos;
        });
    }

    // Add event listeners.
    function addEventListeners ()
    {
        panel.content.on("change", ".ia-dimension-control", function (e)
        {
            updateControls();
        });
        panel.content.on("click", ".ia-dimension-reset-button", function (e)
        {
            panel.content.find('input.ia-dimension-checkbox').removeAttr('checked');
            panel.content.find('select.ia-dimension-select').val(noSelectionValue);
            updateControls();
        });
        panel.content.on("change", "#ia-dimension-indicator-select", function (e)
        {
            dataGroup.setData(dataGroup.geography.id, $j(this).val(), dataGroup.indicator.date);
        });
    }

    // Add controls.
    function addControls ()
    {
        var str = '<div class="ia-dimension">';

            // Add dimension dropdowns.
            for (var i = 0; i < arrDimensionNames.length; i++)
            {
                var dim = arrDimensionNames[i];

                str += '<div class="ia-dimension-section">';
                if (arrDimensionCheckbox.indexOf(dim) != -1) 
                {
                    var arrValues = getValuesForDimension(dim, arrIndicators);
                    str += '<label id="'+dim+'" class="ia-select-label">'+dim+'</label>';
                    for (var j = 0; j < arrValues.length; j++)
                    {
                        var val = arrValues[j];
                        if (val != noSelectionValue) 
                        {
                            str += '<div>';
                                str += '<input type="checkbox" class="ia-dimension-control ia-dimension-checkbox" data-dimension="'+dim+'" id="'+val+'" value="'+val+'">';
                                str += '<label for="'+val+'">'+val+'</label>';
                            str += '</div>';
                        }
                    }
                }
                else
                { 
                    str += '<label for="'+dim+'" class="ia-select-label">'+dim+'</label>';
                    str += '<select id="'+dim+'" data-dimension="'+dim+'" class="ia-select ia-dimension-control ia-dimension-select"></select>';
                }
                str += '</div>';
            }

            // Add indicator dropdown.
            str += '<div class="ia-dimension-section">';
                str += '<label for="ia-dimension-indicator-select" class="ia-select-label">'+indicatorSelectTitle+'</label>';
                str += '<select id="ia-dimension-indicator-select" class="ia-select"></select>';
            str += '</div>';

            // Add reset button.
            str += '<div class="ia-dimension-section">';
                str += '<button type="button" class="ia-widget ia-button button ia-dimension-reset-button">'+resetButtonText+'</button>';
            str += '</div>';

        str += '</div>';

        panel.append($j(str));
    }

    // Update controls.
    function updateControls ()
    {
        // Loop through each dimension and see what values are
        // available after all other dimensions are applied.
        for (var i = 0; i < arrDimensionNames.length; i++)
        {
            var dim = arrDimensionNames[i];

            // Get an array of indicators that are left over after applying all dimensions except this one.
            var arrIndicatorsLeftOver = getIndicators(dim);

            // Get the values for the dropdown from the leftover indicators.
            var arrValues = getValuesForDimension(dim, arrIndicatorsLeftOver);

            // Update the control associated with the dimension.
            if (arrDimensionCheckbox.indexOf(dim) != -1) 
            {
                // Hide checkboxes that arent available.
                panel.content.find('input.ia-dimension-checkbox[data-dimension="'+dim+'"]').each(function() 
                {
                    var value = $j(this).val();
                    
                    if (arrValues.indexOf(value) != -1) 
                        $j(this).parent().show();
                    else 
                        $j(this).parent().hide();
                });
            }
            else
            {
                // Get the current value of the select.
                var $select = panel.content.find('select.ia-dimension-select[data-dimension="'+dim+'"]');
                var selectedVal = $select.val();

                // Clear the select and append the new options.
                $select.find("option").remove();
                for (var j = 0; j < arrValues.length; j++)
                {
                    var val = arrValues[j];
                    if (val == selectedVal)
                        $select.append("<option value='"+val+"' selected>"+val+"</option>");
                    else
                        $select.append("<option value='"+val+"'>"+val+"</option>");
                }
            }
        }

        // Update the indicator dropdown.
        var $selectIndicator = panel.content.find("#ia-dimension-indicator-select");
        var selectedVal = $selectIndicator.val();

        // Clear the select and append the new options.
        $selectIndicator.find("option").remove();
        var arrIndicatorsForDimensions = getIndicators();
        for (var i = 0; i < arrIndicatorsForDimensions.length; i++)
        {
            var indicator = arrIndicatorsForDimensions[i];
            if (indicator.id == selectedVal)
                $selectIndicator.append("<option value='"+indicator.id+"' selected>"+indicator.name+"</option>");
            else
                $selectIndicator.append("<option value='"+indicator.id+"'>"+indicator.name+"</option>");
        }

        // Set the indicator for the report if its changed.
        if (selectedVal != $selectIndicator.val())  dataGroup.setData(dataGroup.geography.id, $selectIndicator.val(), dataGroup.indicator.date);
    }

    // Get the currently selected values for the dimensions.
    function getSelectedValues (ignoreDimension)
    {
        var oDimensions = {};

        for (var j = 0; j < arrDimensionNames.length; j++)
        {
            var dim = arrDimensionNames[j];
            if (dim != ignoreDimension)
            {
                var arrSelectedValues;
                if (arrDimensionCheckbox.indexOf(dim) != -1) 
                {
                    arrSelectedValues = [];
                    panel.content.find('input.ia-dimension-checkbox[data-dimension="'+dim+'"]:checked').each(function() 
                    {
                        arrSelectedValues.push($j(this).val());
                    });
                }
                else
                {
                    arrSelectedValues = [panel.content.find('select.ia-dimension-select[data-dimension="'+dim+'"]').val()];
                }

                if (arrSelectedValues.length == 0 || arrSelectedValues[0] == null)  arrSelectedValues[0] = noSelectionValue;

                oDimensions[dim] = arrSelectedValues;
            }
        }
        return oDimensions;
    }

    // Get the list of indicators that are in the selected dimensions.
    function getIndicators (ignoreDimension)
    {
        var oDimensions = getSelectedValues(ignoreDimension);

        var arrNewIndicators = [];
        for (var i = 0; i < arrIndicators.length; i++)
        {
            var indicator = arrIndicators[i];
            var containsDimensionValues = true;

            for (var dim in oDimensions)
            {
                var arrValues = oDimensions[dim];
                if (arrValues[0] != noSelectionValue)
                {
                    var strProps = indicator.getProperty(dim);
                    if (strProps != undefined)
                    {
                        var arrProps = strProps.split(";");
                        containsDimensionValues = arrProps.some(function (item, pos) {return arrValues.indexOf(item) >= 0;});
                        if (!containsDimensionValues) break;
                    }
                    else 
                    {
                        containsDimensionValues = false;
                        break;
                    }
                }
            }
            
            if (containsDimensionValues) arrNewIndicators.push(indicator);
        }
        return arrNewIndicators;
    }

    // Get the values the dimension can have from the list of indicators.
    function getValuesForDimension (dim, arrInds)
    { 
        // Get the values.
        var arrValues = ["-"];
        for (var i = 0; i < arrInds.length; i++)
        {
        	var arrProps = arrInds[i].getProperty(dim);
        	if (arrProps != undefined) arrValues = arrValues.concat(arrProps.split(";"));
        }

        // Remove duplicates and sort.
        arrValues = arrValues.filter(function(item, pos) {return arrValues.indexOf(item) == pos;});
        arrValues.sort();
        return arrValues;
    }
};