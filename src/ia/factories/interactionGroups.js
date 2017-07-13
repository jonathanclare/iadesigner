/** 
 * Builds interaction groups.
 *
 * @method buildInteractionGroups
 * @param {ia.Report} report The report object.
 * @param {ia.DataGroup} dataGroup The associated data group.
 * @param {ia.InteractionGroup} interactionGroup The associated interaction group.
 * @param {ia.InteractionGroup} comparisonInteractionGroup The associated comparison interaction group.
 */
ia.ComponentFactory.prototype.buildInteractionGroups = function(report, dataGroup, interactionGroup, comparisonInteractionGroup)
{
	report.addComponent("interactionGroup"+dataGroup.suffix, interactionGroup);
	report.addComponent("comparisonInteractionGroup"+dataGroup.suffix, comparisonInteractionGroup);

	// This code executes every time a geography has changed.
	dataGroup.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
	{
		interactionGroup.clearSelection();
		comparisonInteractionGroup.clearSelection();
	});

	// This code executes every time a filter has changed.
	dataGroup.addEventListener(ia.FilterEvent.FILTER_CHANGED, function(event)
	{
		interactionGroup.clearSelection();
	});

	// This code executes every time the selection changes.
	interactionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event)
	{
		updateSelectionParams(interactionGroup.getSelection());
	});

	// This code executes every time the comparison selection changes.
	comparisonInteractionGroup.addEventListener(ia.InteractionEvent.SELECTION_CHANGED, function(event)
	{
		// Update the comparison select url param.
		var selectedFeatures = comparisonInteractionGroup.getSelection();
		if (selectedFeatures.length > 0) report.url.params["comparisonSelect"+dataGroup.suffix] = selectedFeatures.join(",");
		else report.url.params["comparisonSelect"+dataGroup.suffix] = "";
	});

	function updateSelectionParams(selectedFeatures)
	{
		if (selectedFeatures.length > 0) 
		{
			// Update the selected feature variable.
			var id = selectedFeatures[0];
			var feature = dataGroup.geography.getFeature(id);
			if (feature)
			{
				var name = feature.name;
				report.textSubstitution.setVariable("selectedFeature"+dataGroup.suffix, name);
			}

			// Update the select url param.
			report.url.params["select"+dataGroup.suffix] = selectedFeatures.join(",");
		}
		else 
		{
			// Clear the selected feature variable.
			report.textSubstitution.setVariable("selectedFeature"+dataGroup.suffix, "");

			// Clear the select url param.
			report.url.params["select"+dataGroup.suffix] = "";
		}
		report.updateDynamicText(report.textSubstitution);
	}

	// Initialise selection params.
	if (report.url.params["select"+dataGroup.suffix]) 
	{
		var selectedFeatures = report.url.params["select"+dataGroup.suffix].toString().split(",");
		updateSelectionParams(selectedFeatures);
	}
};