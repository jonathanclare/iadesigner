/**
 * The <code>ia.Thematic</code> class is used to 
 * classify data. The Theme contains two classifiers 
 * for classifying both numeric and non-numeric data.
 *
 * <p>The data is an associative array with the following format:</p>
 * <p>["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}</p>
 *
 * @author J Clare
 * @class ia.Thematic
 * @extends ia.EventDispatcher
 * @constructor
 * @param {AssociativeArray[]} data The data is an associative array with the following format:
 * <br/>["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}
 */
ia.Thematic = function(data)
{
	ia.Thematic.baseConstructor.call(this);

	this._data = new Object();
	this._dataField = "value";
	this._dataType = "numeric";
	this._dataChanged = true;

	this.colorField = undefined;
	this.symbol = ia.Shape.SQUARE;
	this.noDataValue = "No Data";
	this.numericClassifier = new ia.NumericClassifier();
	this.categoricClassifier = new ia.CategoricClassifier();

	if (data != undefined) this.setData(data);
};
ia.extend(ia.EventDispatcher, ia.Thematic);

/**
 * Constant indicating a continuous value classification.
 * 
 * @static
 * @final
 * @property CONTINUOUS
 * @type String
 * @default "continuous"
 */
ia.Thematic.CONTINUOUS = "continuous";

/**
 * Constant indicating an equal interval classification.
 * 
 * @static
 * @final
 * @property EQUAL_INTERVAL
 * @type String
 * @default "equalInterval"
 */
ia.Thematic.EQUAL_INTERVAL = "equalInterval";

/**
 * Constant indicating a quantile classification.
 * 
 * @static
 * @final
 * @property QUANTILE
 * @type String
 * @default "quantile"
 */
ia.Thematic.QUANTILE = "quantile";

/**
 * Constant indicating a natural breaks classification.
 * 
 * @static
 * @final
 * @property NATURAL
 * @type String
 * @default "natural"
 */
ia.Thematic.NATURAL = "natural";

/**
 * Constant indicating a standard deviation classification.
 * 
 * @static
 * @final
 * @property STANDARD_DEVIATION
 * @type String
 * @default "standardDeviation"
 */
ia.Thematic.STANDARD_DEVIATION = "standardDeviation";

/**
 * Specifies that the data for the thematic is numeric.
 * 
 * @static
 * @final
 * @property NUMERIC
 * @type String
 * @default "numeric"
 */
ia.Thematic.NUMERIC = "numeric";

/**
 * Specifies that the data for the thematic is categoric.
 * 
 * @static
 * @final
 * @property CATEGORIC
 * @type String
 * @default "categoric"
 */
ia.Thematic.CATEGORIC = "categoric";
	
/**
 * The symbol used for point data.
 * 
 * @property symbol
 * @type String
 * @default ia.Shape.SQUARE
 */
ia.Thematic.prototype.symbol;

/** 
 * The no data value.
 *
 * @property noDataValue
 * @type String
 * @default "No Data"
 */
ia.Thematic.prototype.noDataValue;

/** 
 * The classifier used to handle numeric data.
 *
 * @property numericClassifier
 * @type ia.NumericClassifier
 */
ia.Thematic.prototype.numericClassifier;

/** 
 * The classifier used to handle non-numeric data.
 *
 * @property categoricClassifier
 * @type ia.CategoricClassifier
 */
ia.Thematic.prototype.categoricClassifier;

/**
 * Flag to indicate heatmap mode.
 * 
 * @property heatmap
 * @type Boolean
 * @default false
 */
ia.Thematic.prototype.heatmap = false;

/**
 * Flag to indicate heatmap mode.
 * 
 * @property heatmap
 * @type Boolean
 * @default false
 */
ia.Thematic.prototype.heatmapradius;

/**
 * Optional field of the data provider that provides the color values (ie when using an associate to defined the map colors).
 * 
 * @property colorField
 * @type String
 * @default undefined
 */
ia.Thematic.prototype.colorField;

/** 
 * Gets the data for the theme.
 *
 * <p>The data is an associative array with the following format:<p>
 * <p>["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}</p>
 *
 * @method getData
 * @return {AssociativeArray[]} The data.
 */
ia.Thematic.prototype.getData = function()
{
	return this._data;
};

/** 
 * Sets the data for the theme.
 *
 * <p>The data is an associative array with the following format:<p>
 * <p>["eh11"]{id:"eh11", name:"polwarth", value:2345, associate1:25}
 * <br/>["eh12"]{id:"eh12", name:"morningside", value:4347, associate1:45}
 * <br/>["eh13"]{id:"eh13", name:"merchiston", value:2496, associate1:25}</p>
 *
 * @method setData
 * @param {AssociativeArray[]} data The data.
 */
ia.Thematic.prototype.setData = function(data)
{
	this._data = data;
	this._dataChanged = true;
};

/**
 * Gets the field of the data provider that provides the values.
 *
 * @method getDataField
 * @return {String} The data field.
 */
ia.Thematic.prototype.getDataField = function()
{
	return this._dataField;
};

/**
 * Sets the field of the data provider that provides the values.
 *
 * @method setDataField
 * @param {String} dataField The data field.
 */
ia.Thematic.prototype.setDataField = function(dataField)
{
	this._dataField = dataField;
	this._dataChanged = true;
};

/**
 * Gets the data type of the data provider.
 * 
 * <p>Possible values include: 
 * <ul>
 * <li><code>ia.Thematic.NUMERIC</code></li>
 * <li><code>ia.Thematic.CATEGORIC</code></li>
 * </ul>
 * </p>
 *
 * @method getDataType
 * @return {String} The data type.
 */
ia.Thematic.prototype.getDataType = function()
{
	return this._dataType;
};

/** 
 * Sets the data type of the data provider.
 * 
 * <p>Possible values include: 
 * <ul>
 * <li><code>ia.Thematic.NUMERIC</code></li>
 * <li><code>ia.Thematic.CATEGORIC</code></li>
 * </ul>
 * </p>
 *
 * @method setDataType
 * @param {String} dataType The data type.
 */
ia.Thematic.prototype.setDataType = function(dataType)
{
	this._dataType = dataType;
	this._dataChanged = true;
};

/** 
 * An array of classes contained in the theme.
 *
 * @method getClasses
 * @return {ia.LegendClass[]} The classes.
 */
ia.Thematic.prototype.getClasses = function()
{
	return this.numericClassifier.getClasses().concat(this.categoricClassifier.getClasses());
};

/** 
 * Gets the legend class for the given value.
 * 
 * @method getClass
 * @param {Number|String} value The value.
 * @return {ia.LegendClass} The legend class that contains the value.
 */
ia.Thematic.prototype.getClass = function(value)
{	
	var legendClass;
	
	if (this._dataType == ia.Thematic.CATEGORIC)
	{
		legendClass = this.categoricClassifier.getClass(value);
	}
	else
	{
		if (ia.isNumber(value)) legendClass = this.numericClassifier.getClass(value);
		else legendClass = this.categoricClassifier.getClass(value);
	}

	return legendClass;
};

ia.Thematic.prototype._updateTimeout = null;

/** 
 * Call this to commit any changes.
 *
 * @method commitChanges
 */
ia.Thematic.prototype.commitChanges = function()
{
	var me = this;
	me._commitChanges();
	/*if (!me._updateTimeout) 
	{
		me._updateTimeout = setTimeout(function()
		{
			me._commitChanges();
		}, 250);
	}*/
};

/** 
 * Call this to commit any changes.
 *
 * @method _commitChanges
 * @private
 */
ia.Thematic.prototype._commitChanges = function()
{
	this._updateTimeout = null;

	if (this._dataChanged)
	{
		var nArray = new Array();
		var cArray = new Array();
		var dataItem;
		var value;

		for (var id in this._data)
		{
			dataItem = this._data[id];
			value = dataItem[this._dataField];

			if (this.colorField != undefined) cArray.push(dataItem[this.colorField]);

			if (this._dataType == ia.Thematic.CATEGORIC)
			{
				cArray.push(value);
			}
			else
			{
				if (ia.isNumber(value)) nArray.push(value);
				else if (this.colorField == undefined)  cArray.push(value);
			}
		}

		this.numericClassifier.setData(nArray);
		this.categoricClassifier.setData(cArray);
	}

	this.categoricClassifier.noDataValue = this.noDataValue;
	
	// Commit classifier changes.
	this.numericClassifier.commitChanges()
	this.categoricClassifier.commitChanges()
	
	// Now link ids to legend classes.
	var legendClasses = this.getClasses();
	var n = legendClasses.length;
	var legendClass, colorClass;
	
	// Set symbol shape and index to legend class.
	for (var i = 0; i < n; i++) 
	{ 
		legendClass = legendClasses[i];
		legendClass.symbol = this.symbol; 
		legendClass.index = i; 

		// Check for point with no data value.
		if (legendClass.getLabel() == this.noDataValue
			&& legendClass.symbol != ia.Shape.LINE
			&& legendClass.symbol != ia.Shape.SQUARE) 
		{
			legendClass.size = 0
		}
	}

	// Make numeric classes white and semi=transparent for legend 
	// display purposes when a colorfield is defined.
	if (this.colorField != undefined) 
	{
		var nClasses = this.numericClassifier.getClasses();
		for (var i = 0; i < nClasses.length; i++) 
		{ 
			legendClass = nClasses[i];
			legendClass.color =  "rgba(255, 255, 255, 0.5)";
		}
	}
	
	// Add thematic information to data items.
	for (var id in this._data)
	{
		dataItem = this._data[id];
		value = dataItem[this._dataField];

		for (var i = 0; i < n; i++) 
		{ 
			legendClass = legendClasses[i];
			if (legendClass.contains(value))
			{
				// Add thematic information to the data item.
				dataItem.color = legendClass.color;
				dataItem.symbolSize = legendClass.size;
				dataItem.legendClass = legendClass;

				// Add the data item to the list of items contained in the class
				// This is useful for legends and pie charts
				legendClass.items.push(dataItem);

				break;
			}
		}	

		if (this.colorField != undefined) 
		{
			var cClasses = this.categoricClassifier.getClasses();
			value = dataItem[this.colorField];
			for (var i = 0; i < cClasses.length; i++) 
			{ 
				legendClass = cClasses[i];
				if (legendClass.contains(value)) dataItem.color = legendClass.color;
			}
		}
	}
	
	this.dispatchEvent(new ia.Event(ia.Event.THEME_CHANGED, this));
};