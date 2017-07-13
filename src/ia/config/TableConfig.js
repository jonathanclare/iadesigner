/** 
 * Contains the configuration information for a table.
 *
 * @author J Clare
 * @class ia.TableConfig
 * @extends ia.ComponentConfig
 * @constructor
 * @param {XML} xml The XML data that describes the table.
 */
ia.TableConfig = function(xml)
{
    ia.TableConfig.baseConstructor.call(this, xml);
    this._parseTableXML(xml);
};
ia.extend(ia.WidgetConfig, ia.TableConfig);

/** 
 * Parses in an XML object containing the configuration xml.  
 *
 * @method parseXML
 * @param {XML} xml The xml data.
 */ 
ia.TableConfig.prototype.parseXML = function(xml) 
{
    this._parseTableXML(xml);
};

/** 
 * Protected method to be used by subclasses when parsing xml.  
 *
 * @method _parseTableXML
 * @param {XML} xml The xml data.
 * @protected
 */ 
ia.TableConfig.prototype._parseTableXML = function(xml) 
{
    this._parseWidgetXML(xml);
    
    var me = this;
    var $xml = $j(xml);

    me.customColumns = [];

    // Columns. 
    me._columnArray = [];
    me._columnHash = {}
    var colWidthSum = 0
    var $columns = $xml.find("Column");
    $j.each($columns, function(i, xmlColumn)
    {
        var col = {};

        var id = $j(xmlColumn).attr("name");

        var fid = id;
        if (fid != "name") fid = fid +"_formatted";

        col.id = $j(xmlColumn).attr("name");
        col.formattedId = fid;
        col.label = $j(xmlColumn).attr("alias");
        col.width = parseFloat($j(xmlColumn).attr("width"));
        me._columnArray[i] = col;
        me._columnHash[col.id] = col;

        colWidthSum += col.width;
    });

    // Compensate for user error when the column widths dont add up to 1.
    var remainder = 1 - colWidthSum;
    if (remainder != 0)
    {
        var adjustmentValue = remainder / me._columnArray.length;
        for (var i = 0; i < me._columnArray.length; i++)
        {
            var colConfig = me._columnArray[i];
            colConfig.width += adjustmentValue;

        }
    }
};

/** 
 * Custom columns that can be used instead of those defined in the config.
 *
 * @property customColumns
 * @type {object[]}} Array of columns.
 */
ia.TableConfig.prototype.customColumns;

/** 
 * Returns the column that corresponds to the given id.
 *
 * <p>The column is an object with the following structure:</p>
 *
 * <p>{id:"name", formattedId:"name_formatted", label:"Features", type:"categoric" width:0.25}</p>
 * 
 * @method getColumn
 * @param {String} id The id.
 * @return {Object} The column object.
 */
ia.TableConfig.prototype.getColumn = function(name) {return this._columnHash[id];};

/** 
 * Returns the table columns.  
 *
 * <p>The array of columns has the following structure:</p>
 *
 * <p>[{id:"name", formattedId:"name_formatted", label:"Features", width:0.25},
 * <br/>{id:"value", formattedId:"value_formatted", label:"Indicator", width:0.25},
 * <br/>{id:"associate1", formattedId:"associate1_formatted", label:"Associate 1", width:0.25},
 * <br/>{id:"associate2", formattedId:"associate2_formatted" label:"Associate 2", width:0.25}]</p>
 *
 * @method getColumns
 * @return {Object[]} An array of column objects.
 */ 
ia.TableConfig.prototype.getColumns = function() {return this._columnArray;};

/**
 * Returns the table columns for the given indicator.
 *
 * <p>The array of columns has the following structure:</p>
 *
 * <p>[{id:"name", formattedId:"name_formatted", label:"Features", width:0.25},
 * <br/>{id:"value", formattedId:"value_formatted", label:"Indicator", width:0.25},
 * <br/>{id:"associate1", formattedId:"associate1_formatted", label:"Associate 1", width:0.25},
 * <br/>{id:"associate2", formattedId:"associate2_formatted" label:"Associate 2", width:0.25}]</p>
 *
 * @method getColumnsForIndicator
 * @param {ia.Indicator} indicator The indicator.
 * @param {ia.TextSubstitution} substitution The TextSubstitution object.
 * @return {Object[]} The array of columns.
 */
ia.TableConfig.prototype.getColumnsForIndicator = function(indicator, substitution)
{
    // Check for custom columns.
    // http://bugzilla.geowise.co.uk/show_bug.cgi?id=9892
    var colDef;
    if (this.customColumns.length > 0) 
    {
        colDef = [];
        for (var i = 0; i < this._columnArray.length; i++)
        {
            var o = this._columnArray[i];
            colDef.push({id:o.id, label:o.label, formattedId:o.formattedId});
        }

        var arrCustCols = this.customColumns.concat(); 
        for (var i = 0; i < colDef.length; i++)
        {
            var col = colDef[i];

            for (var j = arrCustCols.length-1; j >= 0; j--)
            {
                var custCol = arrCustCols[j];
                if (custCol.id == col.id)
                {
                    col.label = custCol.label;
                    arrCustCols.splice(j,1);
                    break;
                }
            }
        }
        colDef = colDef.concat(arrCustCols);
    }
    else colDef = this._columnArray.concat();

    var colArray = [];

    for (var i = 0; i < colDef.length; i++)
    {
        var colConfig = colDef[i];

        var col = {};
        col.id = colConfig.id;
        col.formattedId = colConfig.formattedId;
        col.label = substitution.formatMessage(colConfig.label);
        col.width = colConfig.width;
        col.type = "categoric";
        
        if (col.id == "name")       col.type = "categoric";
        else if (col.id == "value") col.type = indicator.type;
        else
        {
            var a = indicator.getAssociate(col.id);
            if (a != null) col.type = a.type;
        }
        colArray.push(col);
    }

    return colArray;
};

/**
 * Returns the table columns for an array of indicators.
 *
 * <p>The array of columns has the following structure:</p>
 *
 * <p>[{id:"name", formattedId:"name_formatted", label:"Features", width:0.25},
 * <br/>{id:"value", formattedId:"value_formatted", label:"Indicator", width:0.25},
 * <br/>{id:"associate1", formattedId:"associate1_formatted", label:"Associate 1", width:0.25},
 * <br/>{id:"associate2", formattedId:"associate2_formatted" label:"Associate 2", width:0.25}]</p>
 *
 * @method getColumnsForIndicators
 * @param {ia.Indicator} indicators An optional array of extra indicators.
 * @param {ia.TextSubstitution} substitution The TextSubstitution object.
 * @return {Object[]} The array of columns.
 */
ia.TableConfig.prototype.getColumnsForIndicators = function(indicators, substitution)
{
    var indicator = indicators[0];

    // Check for custom columns.
    // http://bugzilla.geowise.co.uk/show_bug.cgi?id=9892
    var colDef;
    if (this.customColumns.length > 0) 
    {
        colDef = [];
        for (var i = 0; i < this._columnArray.length; i++)
        {
            var o = this._columnArray[i];
            colDef.push({id:o.id, label:o.label, formattedId:o.formattedId});
        }

        var arrCustCols = this.customColumns.concat(); 
        for (var i = 0; i < colDef.length; i++)
        {
            var col = colDef[i];

            for (var j = arrCustCols.length-1; j >= 0; j--)
            {
                var custCol = arrCustCols[j];
                if (custCol.id == col.id)
                {
                    col.label = custCol.label;
                    arrCustCols.splice(j,1);
                    break;
                }
            }
        }
        colDef = colDef.concat(arrCustCols);
    }
    else colDef = this._columnArray.concat();

    var colArray = [];

    for (var i = 0; i < colDef.length; i++)
    {
        var colConfig = colDef[i];

        var dataForColumnExists = true;

        var col = {};
        col.id = colConfig.id;
        col.formattedId = colConfig.formattedId;
        col.label = substitution.formatMessage(colConfig.label);
        col.width = colConfig.width;
        col.type = "categoric";
        
        if (col.id == "name")       col.type = "categoric";
        else if (col.id == "value") col.type = indicator.type;
        else if (col.id.indexOf("~") != -1) // Double table
        {
            var colId = col.id.split("~")[0];
            var suffix = col.id.split("~")[1];
            var ind = indicators[suffix-1];
            
            if (ind != undefined)
            {
                if (colId == "value") col.type = ind.type;
                else
                {
                    var a = ind.getAssociate(colId);
                    var f = ind.geography.getFeatures()[0]; // Could be a feature property so test first feature to see if it exists.
                    
                    if (colId.toLowerCase() == "lowerlimit" && ind.getLowerLimits() != undefined) col.type = "numeric";
                    else if (colId.toLowerCase() == "upperlimit" && ind.getUpperLimits() != undefined) col.type = "numeric";
                    else if (a) col.type = a.type;
                    else if (f.getProperty(col.id)) col.type = 'categoric';
                    else dataForColumnExists = false;
                }
            }
        }
        else
        {
            var a = indicator.getAssociate(col.id);
            var f = indicator.geography.getFeatures()[0]; // Could be a feature property so test first feature to see if it exists.

            if (col.id.toLowerCase() == "lowerlimit" && indicator.getLowerLimits() != undefined) col.type = "numeric";
            else if (col.id.toLowerCase() == "upperlimit" && indicator.getUpperLimits() != undefined) col.type = "numeric";
            else if (a) col.type = a.type;
            else if (f.getProperty(col.id)) col.type = 'categoric';
            else dataForColumnExists = false;
        }

        if (dataForColumnExists) colArray.push(col);
    }

    return colArray;
};