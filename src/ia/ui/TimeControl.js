/** 
 * A class for controlling time animations.
 *
 * @author J Clare
 * @class ia.TimeControl
 * @constructor
 * @param {String} id The id of the TimeControl.
 * @param {ia.DataGroup} dataGroup The this._dataGroup attached to the control.
 * @param {Function} callbackFunction Called when a selection is made. 
 */
ia.TimeControl = function(id, dataGroup, callbackFunction)
{		
	this.id = id;
	if (callbackFunction) this._callbackFunction = callbackFunction;
	this._dataGroup = dataGroup;

	this.delay = 1.5;

	// Is the animation this._playing.
	this._playing = false;

	// Div to contain play button.
	this.$playBtn = undefined;

	// The current geography id.
	this._currentGeographyId = undefined;

	// The current indicator id.
	this._currentIndicatorId = undefined;

	this.container  = $j("<div id='"+id+"-container' class='ia-time-control-scrollbox'>");
	this._scrollBox = new ia.ScrollBox(this.container);

	this.$table  = $j("<table class='ia-time-control-table'>");
	this.container.append(this.$table);

	var me = this;

	this._dataGroup.addEventListener(ia.DataEvent.GEOG_CHANGED, function(event)
	{
		me._stop();
		me._currentIndicatorId = event.indicator.id;
		me._currentGeographyId = event.indicator.geography.id;
		me._render(event.indicator);

		if (event.indicator.date != undefined)
		{
			var fixedDate = event.indicator.date.replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
			me.$table.find("td.ia-time-control-date-btn[id='"+fixedDate+"-btn']").addClass("ia-time-control-date-btn-active");
		}
	});

	this._dataGroup.addEventListener(ia.DataEvent.INDICATOR_CHANGED, function(event)
	{
		// Indicator has been changed outside control.
		if ((event.indicator.geography.id != me._currentGeographyId) || (me._currentIndicatorId != event.indicator.id))
		{
			me._stop();
			me._currentIndicatorId = event.indicator.id;
			me._currentGeographyId = event.indicator.geography.id;
			me._render(event.indicator);
		}
		else if (me._playing)
		{
			var t = setTimeout(function()
			{
				clearTimeout(t);
				if (me._playing)
				{
					// Load next date or stop animation if at the end.
					var dates = me._getDates(event.theme.getIndicatorDates(event.indicator.id));
					var index = dates.indexOf(event.indicator.date) + 1;
					if (index < dates.length)
						me._dataGroup.setData(event.geography.id, event.indicator.id, dates[index]);
					else
						me._stop();
				}

			}, me.delay * 1000);
		}

		me.$table.find("td.ia-time-control-date-btn").removeClass("ia-time-control-date-btn-active");

		if (event.indicator.date != undefined)
		{
			var fixedDate = event.indicator.date.replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
			me.$table.find("td.ia-time-control-date-btn[id='"+fixedDate+"-btn']").addClass("ia-time-control-date-btn-active");
		}
	});
};

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.TimeControl.prototype.container;

/**
 * The time delay in seconds between changing dates.
 * 
 * @property delay
 * @type Number
 * @default 1.5
 */
ia.TimeControl.prototype.delay;

/**
 * Drop dates.
 *
 * @property dropDates
 * @type String[]
 */
ia.TimeControl.prototype.dropDates;

/**
 * Get the dates to use.
 *
 * @method _getDates
 * @private
 */
ia.TimeControl.prototype._getDates = function (arrDates)
{
	if (arrDates == undefined) return [];
    if (this.dropDates != undefined && this.dropDates.length > 0)
    {
        var me = this;
        return arrDates.filter(function (el)
        {
            return me.dropDates.indexOf(el) < 0;
        });
    }
    return arrDates;
};

/**
 * Plays the animation.
 *
 * @method _play
 * @private
 */
ia.TimeControl.prototype._play = function() 
{	
	if (!this._playing)
	{
		if (this._callbackFunction) this._callbackFunction.call(null, true);
		this._playing = true;
		this.$playBtn.removeClass("ia-time-control-btn-play");
		this.$playBtn.addClass("ia-time-control-btn-stop");

		// Load next date or first date if at the end.
		var dates = this._getDates(this._dataGroup.theme.getIndicatorDates(this._dataGroup.indicator.id));
		var index = dates.indexOf(this._dataGroup.indicator.date) + 1;
		if (index < dates.length) 
			this._dataGroup.setData(this._dataGroup.geography.id, this._dataGroup.indicator.id, dates[index]);
		else 
			this._dataGroup.setData(this._dataGroup.geography.id, this._dataGroup.indicator.id, dates[0]);
	}
	else this._stop();
};

/**
 * Stops the animation.
 *
 * @method _stop
 * @private
 */
ia.TimeControl.prototype._stop = function() 
{	
	if (this._callbackFunction) this._callbackFunction.call(null, false);
	this._playing = false;
	if (this.$playBtn)
	{
		this.$playBtn.removeClass("ia-time-control-btn-stop");
		this.$playBtn.addClass("ia-time-control-btn-play");
	}
};

/**
 * Moves to previous date.
 *
 * @method _back
 * @private
 */
ia.TimeControl.prototype._back = function() 
{	
	this._stop();

	// Load previous date or last date if at the start.
	var dates = this._getDates(this._dataGroup.theme.getIndicatorDates(this._dataGroup.indicator.id));
	var index = dates.indexOf(this._dataGroup.indicator.date) - 1;
	if (index > -1) 
		this._dataGroup.setData(this._dataGroup.geography.id, this._dataGroup.indicator.id, dates[index]);
	else 
		this._dataGroup.setData(this._dataGroup.geography.id, this._dataGroup.indicator.id, dates[dates.length-1]);
};

/**
 * Moves to next date.
 *
 * @method _next
 * @private
 */
ia.TimeControl.prototype._next = function() 
{			
	this._stop();

	// Load next date or first date if at the end.
	var dates = this._getDates(this._dataGroup.theme.getIndicatorDates(this._dataGroup.indicator.id));
	var index = dates.indexOf(this._dataGroup.indicator.date) + 1;
	if (index < dates.length) 
		this._dataGroup.setData(this._dataGroup.geography.id, this._dataGroup.indicator.id, dates[index]);
	else 
		this._dataGroup.setData(this._dataGroup.geography.id, this._dataGroup.indicator.id, dates[0]);
};

/**
 * Sets the data.
 *
 * @method setData
 */
ia.TimeControl.prototype.setData = function(indicator) 
{	
	this._stop();
	this._currentIndicatorId = indicator.id;
	this._currentGeographyId = indicator.geography.id;
	this._render(indicator);
	this.$table.find("td.ia-time-control-date-btn").removeClass("ia-time-control-date-btn-active");

	if (indicator.date != undefined)
	{
		var fixedDate = indicator.date.replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
		this.$table.find("td.ia-time-control-date-btn[id='"+fixedDate+"-btn']").addClass("ia-time-control-date-btn-active");
	}
};

/**
 * Renders the control.
 *
 * @method _render
 * @private
 */
ia.TimeControl.prototype._render = function(indicator) 
{	
    this.$table.empty();

    var dates = this._getDates(indicator.theme.getIndicatorDates(indicator.id));
	if (dates)
	{
		var me = this;

		$tr = $j("<tr>");
		this.$table.append($tr);

		this.$playBtn = $j("<td class='ia-list-item ia-time-control-btn ia-time-control-btn-play'>");
		$tr.append(this.$playBtn);
		this.$playBtn.bind("click", function(e) 
		{
			e.stopPropagation();
			me._play();
		});

		var $backBtn = $j("<td class='ia-list-item ia-time-control-btn ia-time-control-btn-back'>");
		$tr.append($backBtn);
		$backBtn.bind("click", function(e) 
		{
			e.stopPropagation();
			me._back();
		});

		var $forwardBtn = $j("<td class='ia-list-item ia-time-control-btn ia-time-control-btn-forward'>");
		$tr.append($forwardBtn);
		$forwardBtn.bind("click", function(e) 
		{
			e.stopPropagation();
			me._next();
		});

		for (var i = 0; i < dates.length; i++) 
		{
			var date = dates[i]
			var fixedDate = date.replace(/'/g, "#quote#").replace(/"/g, "#double-quote#"); // Fix for quotations breaking ids.
			$dateBtn = $j("<td id='"+fixedDate+"-btn' class='ia-list-item ia-time-control-td ia-time-control-date-btn'>").html(date);
			$tr.append($dateBtn);

			(function() // Execute immediately
			{ 
				var geographyId = indicator.geography.id;
				var indicatorId = indicator.id;
				var dateStr = date;

				$dateBtn.bind("click", function(e) 
				{
					e.stopPropagation();

					me._stop();
					me._dataGroup.setData(geographyId, indicatorId, dateStr);
				});
			})();
		}
	}
	this._scrollBox.refresh();
};