/** 
 * Used to build and manage widgets.
 *
 * @author J Clare
 * @class ia.Report
 * @extends ia.EventDispatcher
 * @constructor
 * @param {JQUERY Element} reportContainer The report container.
 */
ia.Report = function(reportContainer)
{   
    ia.Report.baseConstructor.call(this);

    this._isResponsive = false;
    this._widgetProps = [];
    this._widgetArray = [];
    this._widgetHash = new Object();
    this._panelArray = [];
    this._panelHash = new Object();
    this._buttonArray = [];
    this._buttonHash = new Object();
    this._textArray = [];
    this._textHash = new Object();
    this._imageArray = [];
    this._imageHash = new Object();
    this._calloutArray = [];
    this._calloutHash = new Object();
    this._componentArray = [];
    this._componentHash = new Object();
    this._isFlowLayout = false;
    this.selectionColor = "#ff0000";
    this.highlightColor = "#00ff00";
    this.selectionOpacity = 0.3;
    this.highlightOpacity = 0.3;
    this.uid = "";
    this.evaluation = true;

    // Report config.
    this.config = new ia.ReportConfig();

    // Text substitution.
    this.textSubstitution = new ia.TextSubstitution();

    this.container = $j('<div id="ia-report" class="ia-report">');
    reportContainer.append(this.container);
    
    // Add the busy container.
    this.$busyContainer = $j('<div class="ia-report-busy">');
    this.$busyContainer.bind("click", function(e) {e.stopPropagation();});
    this.$busyContainer.bind("touchstart touchmove touchend mousemove mouseup mouseenter mouseleave mousedown click", function(e)
    {
        e.stopPropagation();
    });
    reportContainer.append(this.$busyContainer);

    // Add the progress container if it doesnt already exist.
    if ($j('#ia-report-progress').length)
    {
        this.$progressContainer = $j('#ia-report-progress');
    }
    else
    {
        this.$progressContainer = $j('<div class="ia-report-loading">');
        reportContainer.append(this.$progressContainer);
    }
    this.$progressContainer.bind("click", function(e) {e.stopPropagation();});
    this.$progressContainer.bind("touchstart touchmove touchend mousemove mouseup mouseenter mouseleave mousedown click", function(e)
    {
        e.stopPropagation();
    });

    this._responsiveMenu = new ia.ResponsiveMenu();
};
ia.extend(ia.EventDispatcher, ia.Report);

/**
 * The container that holds the object.
 * 
 * @property container
 * @type JQUERY Element
 */
ia.Report.prototype.container;

/** 
 * The report config object. 
 
 *
 * @property config
 * @type ia.ReportConfig
 */ 
ia.Report.prototype.config;

/** 
 * An ArcGIS Web Map object. 
 *
 * @property webMapData
 * @type ia.WebMapData
 */ 
ia.Report.prototype.webMapData;

/** 
 * The report data object. 
 *
 * @property data
 * @type ia.ReportData
 */ 
ia.Report.prototype.data;

/** 
 * The report locale object.  
 *
 * @property locale
 * @type ia.Locale
 */ 
ia.Report.prototype.locale;

/** 
 * The report text substitution object. 
 *
 * @property textSubstitution
 * @type ia.TextSubstitution 
 */ 
ia.Report.prototype.textSubstitution;

/** 
 * The report url object.  
 *
 * @property url
 * @type ia.UrlParams
 */ 
ia.Report.prototype.url;

/** 
 * The report selection color.
 *
 * @property selectionColor
 * @type String
 */
ia.Report.prototype.selectionColor;

/** 
 * The report highlight color.
 *
 * @property highlightColor
 * @type String
 */
ia.Report.prototype.highlightColor;

/** 
 * The report selection opacity.
 *
 * @property selectionOpacity
 * @type Number
 * @default 0.3
 */
ia.Report.prototype.selectionOpacity;

/** 
 * The report highlight opacity.
 *
 * @property highlightOpacity
 * @type Number
 * @default 0.3
 */
ia.Report.prototype.highlightOpacity;

/** 
 * Unique id.
 *
 * @property uid
 * @type String
 * @default ""
 */
ia.Report.prototype.uid;

/** 
 * Is it an evaluation version. 
 *
 * @property evaluation
 * @type Boolean
 * @default true
 */ 
this.evaluation = true;

/** 
 * The template number.
 *
 * @property template
 * @type String
 */
ia.Report.prototype.template;

/** 
 * The version number.
 *
 * @property version
 * @type String
 */
ia.Report.prototype.version;

/** 
 * Adds a component.  
 *
 * @method addComponent
 * @param {String} id The component id.
 * @param {Object} component The component to add.
 */ 
ia.Report.prototype.addComponent = function(id, component) 
{
    this._componentHash[id] = component;
    this._componentArray[this._componentArray.length] = component;
};

/** 
 * Returns all components.  
 *
 * @method getComponents
 * @return {Object[]} An array of components.
 */ 
ia.Report.prototype.getComponents = function() {return this._componentArray;};

/** 
 * Returns the component that corresponds to the id.
 * 
 * @method getComponent
 * @param {String} id The id.
 * @return {Object} The component.
 */
ia.Report.prototype.getComponent = function(id) {return this._componentHash[id];};

/** 
 * Adds a callout.  
 *
 * @method addCallout
 * @param {ia.CalloutBox} callout The callout to add.
 */ 
ia.Report.prototype.addCallout = function(callout) 
{
    this._calloutArray[this._calloutArray.length] = callout;
    this._calloutHash[callout.id] = callout;
    this.container.append(callout.container);
};

/** 
 * Returns all callouts.  
 *
 * @method getCallouts
 * @return {ia.CalloutBox[]} An array of callouts.
 */ 
ia.Report.prototype.getCallouts = function() {return this._calloutArray;};

/** 
 * Returns the callout that corresponds to the id.
 * 
 * @method getCallout
 * @param {String} id The id.
 * @return {ia.CalloutBox} The callout.
 */
ia.Report.prototype.getCallout = function(id) {return this._calloutHash[id];};

/** 
 * Adds a new widget.  
 *
 * @method addWidget
 * @param {ia.Widget} widget The widget.
 * @param {ia.ComponentConfig|ia.TableConfig|ia.ButtonConfig|ia.TextConfig|ia.ImageConfig} config Optional configuration.
 */ 
ia.Report.prototype.addWidget = function(widget, config) 
{
    this._widgetArray[this._widgetArray.length] = widget;
    this._widgetHash[widget.id] = widget;
    this.container.append(widget.container);

    if (config != undefined) 
    {
        if (config.id.indexOf("filterButton") != -1 || config.id.indexOf("geographyButton") != -1)
            widget.container.css("visibility","hidden"); // Hide filter and geog button unless needed.
        else
            widget.visible(config.visible);

        widget.update(config);
    }
};

/** 
 * Removes a widget.  
 *
 * @method removeWidget
 * @param {String} id The id.
 */ 
ia.Report.prototype.removeWidget = function(id) 
{
    var widget = this.getWidget(id);
    if (widget != undefined)
    {
        widget.container.remove();

        delete this._widgetHash[id];
        delete this._panelHash[id];
        delete this._textHash[id];
        delete this._buttonHash[id];
        delete this._imageHash[id];
        delete this._componentHash[id];

        for (var i = 0; i < this._widgetArray.length; i++) 
        {
            var widget = this._widgetArray[i];
            if (widget.id == id)
            {
                this._widgetArray.splice(i,1)
                break;
            }
        }
        for (var i = 0; i < this._panelArray.length; i++) 
        {
            var widget = this._panelArray[i];
            if (widget.id == id)
            {
                this._panelArray.splice(i,1)
                break;
            }
        }
        for (var i = 0; i < this._textArray.length; i++) 
        {
            var widget = this._textArray[i];
            if (widget.id == id)
            {
                this._textArray.splice(i,1)
                break;
            }
        }
        for (var i = 0; i < this._buttonArray.length; i++) 
        {
            var widget = this._buttonArray[i];
            if (widget.id == id)
            {
                this._buttonArray.splice(i,1)
                break;
            }
        }
        for (var i = 0; i < this._imageArray.length; i++) 
        {
            var widget = this._imageArray[i];
            if (widget.id == id)
            {
                this._imageArray.splice(i,1)
                break;
            }
        }
        for (var i = 0; i < this._componentArray.length; i++) 
        {
            var widget = this._componentArray[i];
            if (widget.id == id)
            {
                this._componentArray.splice(i,1)
                break;
            }
        }
    }
};

/** 
 * Returns all widgets.  
 *
 * @method getWidgets
 * @return {ia.Widget[]} An array of widgets.
 */ 
ia.Report.prototype.getWidgets = function() {return this._widgetArray;};

/** 
 * Returns the widget that corresponds to the id.
 * 
 * @method getWidget
 * @param {String} id The id.
 * @return {ia.Widget} The widget.
 */
ia.Report.prototype.getWidget = function(id) 
{
    id = id.replace('-panel', ''); // For backwards compatibility.
    return this._widgetHash[id];
};

/** 
 * Removes all widgets.  
 *
 * @method removeWidgets
 */ 
ia.Report.prototype.removeWidgets = function() 
{
    for (var i = 0; i < this._widgetArray.length; i++) 
    {
        var widget = this._widgetArray[i];
        widget.container.remove();
    }
    
    // Reset arrays
    this._panelArray = [];
    this._panelHash = new Object();
    this._textArray = [];
    this._textHash = new Object();
    this._imageArray = [];
    this._imageHash = new Object();
    this._buttonArray = [];
    this._buttonHash = new Object();
    this._widgetArray = [];
    this._widgetHash = new Object();
    /*this._calloutArray = []; // Commented this out because it was removing callouts which are added at start (shareCallout) - and not re-added when a new config is parsed in.
    this._calloutHash = new Object();*/
    this._componentArray = [];
    this._componentHash = new Object();
};

/** 
 * Adds a new panel.  
 *
 * @method addPanel
 * @param {ia.Panel} panel The panel.
 * @param {ia.ComponentConfig|ia.TableConfig} config Optional configuration.
 */ 
ia.Report.prototype.addPanel = function(panel, config) 
{
    this._panelArray[this._panelArray.length] = panel;
    this._panelHash[panel.id] = panel;
    this.addWidget(panel, config);
};

/** 
 * Returns the panels.  
 *
 * @method getPanels
 * @return {ia.Panel[]} An array of panels.
 */ 
ia.Report.prototype.getPanels = function() {return this._panelArray;};

/** 
 * Returns the panel that corresponds to the id.
 * 
 * @method getPanel
 * @param {String} id The id.
 * @return {ia.Panel} The panel.
 */
ia.Report.prototype.getPanel = function(id) 
{
    id = id.replace('-panel', ''); // For backwards compatibility.
    return this._panelHash[id];
};

/** 
 * Adds a new button.  
 *
 * @method addButton
 * @param {ia.Button} btn The button.
 * @param {ia.ButtonConfig} config Optional configuration.
 */ 
ia.Report.prototype.addButton = function(btn, config) 
{
    this._buttonArray[this._buttonArray.length] = btn;
    this._buttonHash[btn.id] = btn;
    this.addWidget(btn, config);
};

/** 
 * Returns the buttons.  
 *
 * @method getButtons
 * @return {ia.Button[]} An array of buttons.
 */ 
ia.Report.prototype.getButtons = function() {return this._buttonArray;};

/** 
 * Returns the component that corresponds to the id.
 * 
 * @method getButton
 * @param {String} id The id.
 * @return {ia.Button} The button.
 */
ia.Report.prototype.getButton = function(id) {return this._buttonHash[id];};

/** 
 * Adds new text.  
 *
 * @method addText
 * @param {ia.Text} txt The text.
 * @param {ia.TextConfig} config Optional configuration.
 */ 
ia.Report.prototype.addText = function(txt, config) 
{
    this._textArray[this._textArray.length] = txt;
    this._textHash[txt.id] = txt;
    this.addWidget(txt, config);
};

/** 
 * Returns the text.  
 *
 * @method getTexts
 * @return {ia.Text[]} An array of text.
 */ 
ia.Report.prototype.getTexts = function() {return this._textArray;};

/** 
 * Returns the text that corresponds to the id.
 * 
 * @method getText
 * @param {String} id The id.
 * @return {ia.Text} The text.
 */
ia.Report.prototype.getText = function(id) {return this._textHash[id];};
    
/** 
 * Adds a new image.  
 *
 * @method addImage
 * @param {ia.Image} img The image.
 * @param {ia.ImageConfig} config Optional configuration.
 */ 
ia.Report.prototype.addImage = function(img, config) 
{
    this._imageArray[this._imageArray.length] = img;
    this._imageHash[img.id] = img;
    this.addWidget(img, config);
};

/** 
 * Returns the images.  
 *
 * @method getImages
 * @return {ia.Image[]} An array of images.
 */ 
ia.Report.prototype.getImages = function() {return this._imageArray;};

/** 
 * Returns the image that corresponds to the id.
 * 
 * @method getImage
 * @param {String} id The id.
 * @return {ia.Image} The image.
 */
ia.Report.prototype.getImage = function(id) {return this._imageHash[id];};

/** 
 * Resets the report widgets back to their original config settings.
 *
 * @method reset
 */
ia.Report.prototype.reset = function()
{
    for (var i = 0; i < this._widgetArray.length; i++) 
    {
        var widget = this._widgetArray[i];
        var config = this.config.getWidget(widget.id);
        if (config != undefined) widget.update(config);
    }
    this.updateDynamicText(this.textSubstitution);
};

/** 
 * Builds a set of widgets based on the passed config object.
 *
 * @method build
 * @param {Function} callbackFnc Function called when build is complete.
 */
ia.Report.prototype.build = function(callbackFnc)
{
    this.removeWidgets();

    // Devious method which allows us to use css to set the highlight and selection colors in the css.
    // Placed here because it gives css time to load.
    var highlightContainer = $j('<div class="ia-highlight-color ia-map-highlight-opacity">');
    this.container.append(highlightContainer);

    var selectionContainer = $j('<div class="ia-selection-color ia-map-selection-opacity">');
    this.container.append(selectionContainer);

    this.highlightColor = ia.Color.toHex(highlightContainer.css("color"));
    this.selectionColor = ia.Color.toHex(selectionContainer.css("color"));
    this.highlightOpacity = highlightContainer.css("opacity");
    this.selectionOpacity = selectionContainer.css("opacity");

    highlightContainer.remove();
    selectionContainer.remove();

    var widgetConfigs = this.config.getWidgets();

    // Add this temporarily so all panels can pick up the panel border radius.
    var tempPanelContainer = $j('<div class="ia-panel">');
    this.container.append(tempPanelContainer);
    
    for (var i = 0; i < widgetConfigs.length; i++) 
    {
        var c = widgetConfigs[i];
        var widget;

        if (c.type == "component" || c.type == "table")
        {
            widget = new ia.Panel(c.id);
            this.addPanel(widget, c);
        }
        else if (c.type == "button")
        {
            widget = new ia.Button(c.id);
            this.addButton(widget, c);
        }
        else if (c.type == "text")
        {
            widget = new ia.Text(c.id);
            this.addText(widget, c);
        }
        else if ((c.type == "image") || (c.type == "img")) // IE9 converts 'image' to 'img' when local.
        {
            widget = new ia.Image(c.id, c.src);
            this.addImage(widget, c);
        }
    }
    tempPanelContainer.remove();
    
    // Call back function.
    if (callbackFnc != null) callbackFnc.call(null, this);
};

/** 
 * Updates dynamic text of widgets.
 *
 * @method updateDynamicText
 * @param {ia.TextSubstitution} textSubstitution The TextSubstitution object.
 */
ia.Report.prototype.updateDynamicText = function(textSubstitution)
{
    // Panel titles.
    var configs = this.config.getComponents();
    for (var i = 0; i < configs.length; i++) 
    {
        var c = configs[i];
        var s = textSubstitution.formatMessage(c.getProperty('title'));
        this.getWidget(c.id).title(s);
    }
    
    // Text and Buttons.
    var configs = this.config.getTexts().concat(this.config.getButtons());
    for (var i = 0; i < configs.length; i++) 
    {
        var c = configs[i];
        var s = textSubstitution.formatMessage(c.text);
        this.getWidget(c.id).text(s);
    }
    
    // TODO Column Headings.
};

/** 
 * Starts the progress bar.
 *
 * @method startProgress
 * @param {String} id The id of the progress bar.
 * @param {Function} callbackFnc The callbackFnc gets called once the progress container is ready.
 */
ia.Report.prototype._progressIds = [];
ia.Report.prototype.startProgress = function(id, callbackFnc)
{
    //this._progressIds[this._progressIds] = id; 

    this.$progressContainer.css("display", "inline");
    ia.showWaitCursor();

    // Need a delay to allow progress container to appear.
    setTimeout(function() {callbackFnc.call(null);}, 100);
};

/** 
 * Ends the progress bar.
 *
 * @method endProgress
 * @param {String} id The id of the progress bar.
 */
ia.Report.prototype.endProgress = function(id)
{
    //var index = this._progressIds.indexOf(id);
    //if (index != -1) this._progressIds.splice(index, 1);
    //if (this._progressIds.length == 0) 
    //{
        this.$progressContainer.css("display", "none");
        ia.showDefaultCursor();
    //}
};

/** 
 * Bloacks report interaction.
 *
 * @method blockInteraction
 * @param {String} id The id of the interaction blocker.
 * @param {Boolean} showWaitCursor Should wait cursor be displayed.
 * @param {Function} callbackFnc The callbackFnc gets called once the progress container is ready.
 */
ia.Report.prototype._blockIds = [];
ia.Report.prototype.blockInteraction = function(id, showWaitCursor, callbackFnc)
{
    //this._blockIds[this._blockIds.length] = id; 

    this.$busyContainer.css("display", "inline");
    if (showWaitCursor) ia.showWaitCursor();

    // Need a delay to allow progress container to appear.
    setTimeout(function() {callbackFnc.call(null);}, 100);
};

/** 
 * Allows report interaction.
 *
 * @method allowInteraction
 * @param {String} id The id of the interaction blocker.
 */
ia.Report.prototype.allowInteraction = function(id)
{
    //var index = this._blockIds.indexOf(id);
    //if (index != -1) this._blockIds.splice(index, 1);
    //if (this._blockIds.length == 0) 
    //{
        this.$busyContainer.css("display", "none");
        ia.showDefaultCursor();
    //}
};

/** 
 * Displays the evaluation message.
 *
 * @method displayEvaluationMessage
 * @param {ia.Panel} panel The panel to hold the message.
 * @private
 */
ia.Report.prototype.displayEvaluationMessage = function(panel)
{
    var evalMessage = "This report was prepared using an InstantAtlas&#153 evaluation license. It is not licensed for distribution or publication of any kind. For more information contact <a href='mailto:support@geowise.co.uk'>support@geowise.co.uk</a>, or visit <a href='http://www.instantatlas.com/' target='_blank'>http://www.instantatlas.com/</a>.";
    var evalText = "Evaluation";

    if (this.locale)
    {
        if (this.locale.getLanguage() == "de") 
            evalMessage = "Dieser Bericht wurde mit einer InstantAtlas&#153 Testlizenz erstellt. Er ist nicht zur Verbreitung oder Veröffentlichung jeglicher Art lizensiert. Für weitere Informationen kontaktieren Sie bitte <a href='mailto:support@geowise.co.uk'>support@geowise.co.uk</a> oder besuchen Sie <a href='http://www.instantatlas.com/de/' target='_blank'>http://www.instantatlas.com/</a>.";
        else if (this.locale.getLanguage() == "fr") 
            evalMessage = "Ce rapport a été crée avec une licence d’évaluation. Cette licence ne permet pas la distribution ou la publication du rapport. Pour plus de renseignements veuillez contacter <a href='mailto:support@geowise.co.uk'>support@geowise.co.uk</a> ou consulter <a href='http://www.instantatlas.com/fr/' target='_blank'>http://www.instantatlas.com</a>.";
        else if (this.locale.getLanguage() == "es") 
        {
            evalMessage = "Este informe ha sido generado con una licencia de evaluación. La distribución o publicación del informe está prohibida. Para más información mande un email a <a href='mailto:support@geowise.co.uk'>support@geowise.co.uk</a> o consulte <a href='http://www.instantatlas.com/es/' target='_blank'>http://www.instantatlas.com</a>.";
            evalText = "Evaluación";
        }
    }
    
    var holder = $j("<div>");
    holder.css({"position": "absolute",
                "left":"5px",
                "bottom":"5px",
                "border-color":"#DCDCDC",
                "border-width":"1px",
                "border-style":"solid",
                "background-color":"#f9f9f9",
                "border-radius": "4px",
                "padding":"5px",
                "text-align": "right"});
                
    var eval = $j("<div>").text(evalText)
    eval.css({"font-family":"Arial Black", "font-size":"30px", "color":"#bbbbbb"});
        
    var link = $j("<a href='http://www.instantatlas.com/' target='_blank'>").text("http://www.instantatlas.com");
    if (this.locale)
    {
        if (this.locale.getLanguage() == "de") link = $j("<a href='http://www.instantatlas.com/de/' target='_blank'>").text("http://www.instantatlas.com");
        else if (this.locale.getLanguage() == "fr") link = $j("<a href='http://www.instantatlas.com/fr/' target='_blank'>").text("http://www.instantatlas.com");
        else if (this.locale.getLanguage() == "es") link = $j("<a href='http://www.instantatlas.com/es/' target='_blank'>").text("http://www.instantatlas.com");
    }
    link.css({"font-family":"Verdana", "font-size":"11px", "color":"#888888"});
    
    var info = $j("<div>").html(evalMessage);
    info.css({"position": "absolute",
    "left":"30%",
    "top":"40%",
    "width":"40%",
    "border-color":"#DCDCDC",
    "border-width":"1px",
    "border-style":"solid",
    "background-color":"#f9f9f9",
    "border-radius":"5px",
    "padding":"10px",
    "z-index":999999});
    
    $j("body").bind("click", function(e) 
    {
        info.hide();
    });
    
    panel.append(holder)
    holder.append(eval)
    holder.append(link);
    this.container.append(info);
};

/**
 * Closes all popup windows except the one with the passed id.
 *
 * @method closePopups
 * @param {String} id The popup id that should not be closed.
 */
ia.Report.prototype.closePopups = function(id)
{
    var panels = this.getPanels();
    for (var i = 0; i < panels.length; i++) 
    {
        var panel = panels[i];
        if (panel.popup() && panel.id != id) panel.hide();
    }
    var callouts = this.getCallouts();
    for (var i = 0; i < callouts.length; i++) 
    {
        var callout = callouts[i];
        if (callout.id != id) callout.hide();
    }
};

/**
 * Add responsive design to the report.
 *
 * @method setResponsive
 * @param {Boolean} isResponsive True or false.
 * @param {Number} maxWidth The maximum width of the flow layout.
 * @param {Boolean} includeImages Should images be included in the flow layout.
 *
 */
ia.Report.prototype.setResponsive = function(isResponsive, maxWidth, includeImages)
{
    if (this._isResponsive != isResponsive)
    {
        this.container.removeClass('ia-flow-report-remove-scrollbars');
        $j(window).off('.responseEvents');
        this._isFlowLayout = false;
        this._setNormalLayout();

        if (isResponsive)
        {
            this.container.addClass('ia-flow-report-remove-scrollbars');

            // Toggle between flow and normal layout on resize.
            var me = this;
            var r;
            $j(window).on('resize.responseEvents', function() 
            {
                clearTimeout(r);
                r = setTimeout(function() 
                {
                    me._updateLayout(maxWidth, includeImages);
                }, 250);
            });
            this._updateLayout(maxWidth, includeImages);
        }
    }
    this._isResponsive = isResponsive;
};

/**
 * Checks the screen size and updates the layout accordingly.
 *
 * @method _updateLayout
 * @private
 *
 */
ia.Report.prototype._updateLayout = function(maxWidth, includeImages)
{
    if (this.container.width() < maxWidth) 
    {
        if (!this._isFlowLayout) 
        {
            // Store widget properties in case user has changed layout programmatically.
            // http://bugzilla.geowise.co.uk/show_bug.cgi?id=10555
            this._widgetProps = [];
            var widgets = this.getWidgets();
            for (var i = 0; i < widgets.length; i++) 
            {
                var widget = widgets[i];
                this._widgetProps.push(
                {
                    id : widget.id,
                    x : widget.x(),
                    y : widget.y(),
                    width : widget.width(),
                    height : widget.height(),
                    xAnchor : widget.xAnchor(),
                    yAnchor : widget.yAnchor(),
                    visible : widget.visible()
                })
            }

            this._setFlowLayout(includeImages);
            this._isFlowLayout = true;
        }
    }
    else
    {
        if (this._isFlowLayout)
        {
            this._setNormalLayout();

            // Reset widget properties in case user has changed layout programmatically.
            // http://bugzilla.geowise.co.uk/show_bug.cgi?id=10555
            for (var i = 0; i < this._widgetProps.length; i++) 
            {
                var w = this._widgetProps[i];
                var widget = this.getWidget(w.id);
                if (widget != undefined)
                {
                    widget.setDimensions(w.x, w.y, w.width, w.height, w.xAnchor, 'top');
                    widget.visible(w.visible);
                }
            }
            this._widgetProps = [];

            this._isFlowLayout = false;
        } 
    }
};

/**
 * Switch to flow layout.
 *
 * @method _setFlowLayout
 * @private
 *
 */
ia.Report.prototype._setFlowLayout = function(includeImages)
{
    this._responsiveMenu.render(this);

    // Ensure any previous panel containers are removed.
    $j('.ia-flow-panel-container').remove();
    $j('.ia-flow-image-container').remove();

    // Order for panels in flow mode.
    var arrPanelOrder = 
    [
        'dataExplorer','filterExplorer','geogExplorer',
        'map','timeControl','legend', 
        'featureCard','scatterPlot', 'spineChart', 'radarChart','profileLegend', 'pyramidChart', 'pyramidLegend',
        'barChart','boxAndWhisker','pieChart',
        'timeSeries','discreteTimeSeries','stackedFeaturesTimeSeries','areaBreakdownBarChart','featureLegend',
        'areaBreakdownPieChart','areaBreakdownPieLegend',
        'stackedBarChart','stackedTimeSeries','stackedLegend',
        'table','comparisonTable',
        'statsbox','metadata'
    ];

    // Add css for flow layout.
    this.container.addClass('ia-flow-report');
    this.container.append(this._responsiveMenu.container);  

    // Hide panel buttons.
    $j('.ia-panel-btns').css({'display':'none'});

    // Hide menu bar if included.
    var menuBar = this.getWidget('menuBar');
    if (menuBar) menuBar.hide();

    // Hide text and buttons.
    var widgets = this.getTexts().concat(this.getButtons());
    for (var i = 0; i < widgets.length; i++) 
    {
        var widget = widgets[i];
        widget.container.detach();
    }

    // Handle images.
    var $arrPanelContainers = []
    var widgets = this.getImages();
    for (var i = 0; i < widgets.length; i++) 
    {
        var widget = widgets[i];    

        if (includeImages)
        {
            // Set image size to config width and height in pixels
            var config      = this.config.getWidget(widget.id);
            widget.rescale  = false;        
            widget.setSize(config.getAttribute('width'), config.getAttribute('height'));

            // Add image to container.
            var $panelContainer = $j('<div class="ia-flow-image-container" data-index="-1">');
            $arrPanelContainers.push($panelContainer);
            widget.container.css(
            {
                'position'  : 'static',
                'max-width' : '100%'
            })
            .appendTo($panelContainer);
        }
        else widget.container.detach(); // Detach images if not included.
    }

    // Handle panels.
    var widgets = this.getPanels();
    for (var i = 0; i < widgets.length; i++) 
    {
        var widget = widgets[i];

        if (widget.popup())
        {
            // Fix position of popups.
            widget.container.appendTo(this.container)
            .css(
            {
                'left'          : '10%',
                'width'         : '80%',
                'height'        : '80%',
                'min-height'    : '200px',
                'max-height'    : '400px'
            });
        }
        else if (widget.visible()) 
        {
            // For panel ordering.
            var id      = widget.id.replace(/[0-9]/g, '');
            var suffix  = widget.id.slice(-1);
            var index   = arrPanelOrder.indexOf(id);
            if (index == -1) index = arrPanelOrder.length;
            if (ia.isNumber(suffix))  index = index + (suffix * 100);

            // Append panel to flow container.
            var $panelContainer = $j('<div class="ia-flow-panel-container" data-index="'+index+'">');
            $arrPanelContainers.push($panelContainer);
            widget.container.css(
            {
                'position'      : 'relative',
                'left'          : 0,
                'width'         : ''
            })
            .addClass('ia-flow-panel')
            .appendTo($panelContainer);
        }
    }

    // Sort array panels by index.
    $arrPanelContainers.sort(function($a, $b)
    {
        var i1 = $a.data('index');
        var i2 = $b.data('index');
        if(i1 < i2) return -1;
        if(i1 > i2) return 1;
        return 0;
    });

    // Add panel containers.
    for (var i = 0; i < $arrPanelContainers.length; i++) 
    {
        var $widget = $arrPanelContainers[i];
        $widget.appendTo(this.container);
    }

    var e = new ia.Event(ia.Event.FLOW_LAYOUT, this);
    this.dispatchEvent(e);
};

/**
 * Switch to normal layout.
 *
 * @method _setNormalLayout
 * @private
 *
 */
ia.Report.prototype._setNormalLayout = function()
{
    // Make report unresponsive.
    this.container.removeClass('ia-flow-report');

    // Show panel buttons.
    $j('.ia-panel-btns').css({'display':''})

    // Remove the responsive menu.
    this._responsiveMenu.container.detach();

    // Reset widgets.
    var widgets = this.getWidgets();
    for (var i = 0; i < widgets.length; i++) 
    {
        var widget = widgets[i];
        widget.container.appendTo(this.container)
        .css(
        {
            'position'      : '',
            //'top'           : '',
            'min-height'    : '',
            'max-height'    : '',
            'max-width'     : ''
        })
        .removeClass('ia-flow-panel');

        // Fixes bug where panels added in custom javascript lose their "top" value because they dont have any 
        // config associated with them when reset() is called (JC 04/05/2017)
        if (this.config.getWidget(widget.id) != undefined) widget.container.css({'top':''});
    }
    this.reset();

    // Remove panel containers.
    $j('.ia-flow-panel-container').remove();
    $j('.ia-flow-image-container').remove();

    var e = new ia.Event(ia.Event.NORMAL_LAYOUT, this);
    this.dispatchEvent(e);
};

/**
 * Dispatched when the report changes to a flow layout.
 *
 * @static
 * @final
 * @property FLOW_LAYOUT
 * @type String
 * @default "flowLayout"
 */
ia.Event.FLOW_LAYOUT = "flowLayout";

/**
 * Dispatched when the report changes to a normal layout.
 *
 * @static
 * @final
 * @property NORMAL_LAYOUT
 * @type String
 * @default "normalLayout"
 */
ia.Event.NORMAL_LAYOUT = "normalLayout";